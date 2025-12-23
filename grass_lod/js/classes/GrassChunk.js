import * as THREE from 'three';

export class GrassChunk {
    constructor(worldX, worldZ, config = {}) {
        this.worldX = worldX;
        this.worldZ = worldZ;

        // Configuration
        this.chunkSize = config.chunkSize || 20;
        this.grassCount = config.grassCount || 5000;
        this.bladeHeight = config.bladeHeight || 0.8;
        this.bladeWidth = config.bladeWidth || 0.05;

        // Cluster configuration
        this.grassClusterCount = config.grassClusterCount || 10;
        this.grassClusterRadiusMin = config.grassClusterRadiusMin || 1;
        this.grassClusterRadiusMax = config.grassClusterRadiusMax || 3;
        this.grassMinScale = config.grassMinScale || 0.3;
        this.grassMaxScale = config.grassMaxScale || 1.0;
        this.grassClusterProbability = config.grassClusterProbability !== undefined ? config.grassClusterProbability : 0.8;

        // Callbacks
        this.getHeightAt = config.getHeightAt || ((x, z) => 0);
        this.getColorAt = config.getColorAt || ((x, z) => new THREE.Color(0x00ff00));

        // Create dummy object for matrix manipulation
        this.dummy = new THREE.Object3D();

        // Create the mesh
        this.mesh = this.createMesh();
    }

    createBladeGeometry() {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 0, 0,                    // Bottom center
            -this.bladeWidth, 0, 0,     // Bottom left
            this.bladeWidth, 0, 0,      // Bottom right
            0, this.bladeHeight, 0      // Top point
        ]);
        const indices = new Uint16Array([
            0, 1, 3,  // Left triangle
            0, 3, 2   // Right triangle
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();
        return geometry;
    }

    createMesh() {
        const bladeGeometry = this.createBladeGeometry();
        const material = new THREE.MeshLambertMaterial({
            color: 0x4a9d2e,
            side: THREE.DoubleSide,
            flatShading: true
        });

        const instancedMesh = new THREE.InstancedMesh(bladeGeometry, material, this.grassCount);
        const offsetX = this.worldX * this.chunkSize;
        const offsetZ = this.worldZ * this.chunkSize;

        // Create seeded random number generator based on chunk position
        // This ensures grass placement is consistent across LOD levels
        const seed = `grass_${this.worldX}_${this.worldZ}`;
        const rng = new Math.seedrandom(seed);

        // Generate cluster centers - favor valleys (lower elevations)
        const clusters = [];
        for (let i = 0; i < this.grassClusterCount; i++) {
            let bestCluster = null;
            let lowestHeight = Infinity;

            // Try multiple random positions and pick the one with lowest elevation
            const attempts = 5;
            for (let attempt = 0; attempt < attempts; attempt++) {
                const x = (rng() - 0.5) * this.chunkSize;
                const z = (rng() - 0.5) * this.chunkSize;
                const worldX = x + offsetX;
                const worldZ = z + offsetZ;
                const height = this.getHeightAt(worldX, worldZ);

                if (height < lowestHeight) {
                    lowestHeight = height;
                    bestCluster = { x, z };
                }
            }

            // Assign a random radius to this cluster
            const radius = this.grassClusterRadiusMin + rng() * (this.grassClusterRadiusMax - this.grassClusterRadiusMin);
            bestCluster.radius = radius;

            clusters.push(bestCluster);
        }

        // Calculate how many blades go in clusters vs random
        const clusteredBladeCount = Math.floor(this.grassCount * this.grassClusterProbability);
        const randomBladeCount = this.grassCount - clusteredBladeCount;

        let bladeIndex = 0;

        // Place clustered grass blades
        if (clusteredBladeCount > 0) {
            const bladesPerCluster = Math.floor(clusteredBladeCount / this.grassClusterCount);

            for (let c = 0; c < this.grassClusterCount; c++) {
                const cluster = clusters[c];
                const bladesInThisCluster = (c === this.grassClusterCount - 1)
                    ? clusteredBladeCount - bladeIndex  // Last cluster gets remaining blades
                    : bladesPerCluster;

                for (let i = 0; i < bladesInThisCluster; i++) {
                    // Random position within this cluster's radius using seeded RNG
                    const angle = rng() * Math.PI * 2;
                    const distance = rng() * cluster.radius;

                    const localX = cluster.x + Math.cos(angle) * distance;
                    const localZ = cluster.z + Math.sin(angle) * distance;

                    const worldPosX = localX + offsetX;
                    const worldPosZ = localZ + offsetZ;
                    const y = this.getHeightAt(worldPosX, worldPosZ);

                    // Scale based on distance from cluster center (larger at center, smaller at edge)
                    const normalizedDistance = distance / cluster.radius;
                    const scale = this.grassMaxScale - (normalizedDistance * (this.grassMaxScale - this.grassMinScale));
                    const scaleVariation = scale * (0.8 + rng() * 0.4); // Add some randomness

                    this.dummy.position.set(localX, y, localZ);
                    this.dummy.rotation.y = rng() * Math.PI * 2;
                    this.dummy.scale.set(scaleVariation, scaleVariation, scaleVariation);
                    this.dummy.updateMatrix();

                    instancedMesh.setMatrixAt(bladeIndex, this.dummy.matrix);
                    instancedMesh.setColorAt(bladeIndex, this.getColorAt(worldPosX, worldPosZ));

                    bladeIndex++;
                }
            }
        }

        // Place random grass blades using seeded RNG
        for (let i = 0; i < randomBladeCount; i++) {
            const localX = (rng() - 0.5) * this.chunkSize;
            const localZ = (rng() - 0.5) * this.chunkSize;

            const worldPosX = localX + offsetX;
            const worldPosZ = localZ + offsetZ;
            const y = this.getHeightAt(worldPosX, worldPosZ);

            // Use minimum scale for non-clustered grass
            const scale = this.grassMinScale;

            this.dummy.position.set(localX, y, localZ);
            this.dummy.rotation.y = rng() * Math.PI * 2;
            this.dummy.scale.set(scale, scale, scale);
            this.dummy.updateMatrix();

            instancedMesh.setMatrixAt(bladeIndex, this.dummy.matrix);
            instancedMesh.setColorAt(bladeIndex, this.getColorAt(worldPosX, worldPosZ));

            bladeIndex++;
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
        instancedMesh.instanceColor.needsUpdate = true;
        instancedMesh.position.set(offsetX, 0, offsetZ);

        return instancedMesh;
    }

    updateWind(time) {
        for (let i = 0; i < this.grassCount; i++) {
            this.mesh.getMatrixAt(i, this.dummy.matrix);
            this.dummy.matrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);

            // Calculate world position for wave
            const worldX = this.dummy.position.x + this.mesh.position.x;
            const worldZ = this.dummy.position.z + this.mesh.position.z;
            const sway = Math.sin(time + worldX * 0.5 + worldZ * 0.5) * 0.1;

            this.dummy.rotation.set(0, this.dummy.rotation.y, sway);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }

    removeFromScene(scene) {
        scene.remove(this.mesh);
    }

    dispose() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}
