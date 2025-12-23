import * as THREE from 'three';
import { GrassChunk } from './GrassChunk.js';

export class GroundChunk {
    constructor(worldX, worldZ, config = {}) {
        this.worldX = worldX;
        this.worldZ = worldZ;

        // Configuration
        this.chunkSize = config.chunkSize || 20;
        this.segments = config.segments || 100;
        this.textureSize = config.textureSize || 256;

        // Callbacks for terrain generation
        this.getHeightAt = config.getHeightAt || ((x, z) => 0);
        this.getColorAt = config.getColorAt || ((x, z) => new THREE.Color(0x00ff00));
        this.getGrassColorAt = config.getGrassColorAt || ((x, z) => new THREE.Color(0x4a9d2e));

        // Grass configuration
        this.grassCount = config.grassCount || 5000;
        this.grassClusterCount = config.grassClusterCount || 10;
        this.grassClusterRadiusMin = config.grassClusterRadiusMin || 1;
        this.grassClusterRadiusMax = config.grassClusterRadiusMax || 3;
        this.grassMinScale = config.grassMinScale || 0.3;
        this.grassMaxScale = config.grassMaxScale || 1.0;
        this.grassClusterProbability = config.grassClusterProbability !== undefined ? config.grassClusterProbability : 0.8;
        this.enableGrass = config.enableGrass !== false;

        // Create the ground mesh
        this.mesh = this.createMesh();

        // Create grass chunk if enabled
        this.grassChunk = null;
        if (this.enableGrass) {
            this.grassChunk = new GrassChunk(worldX, worldZ, {
                chunkSize: this.chunkSize,
                grassCount: this.grassCount,
                grassClusterCount: this.grassClusterCount,
                grassClusterRadiusMin: this.grassClusterRadiusMin,
                grassClusterRadiusMax: this.grassClusterRadiusMax,
                grassMinScale: this.grassMinScale,
                grassMaxScale: this.grassMaxScale,
                grassClusterProbability: this.grassClusterProbability,
                getHeightAt: this.getHeightAt,
                getColorAt: this.getGrassColorAt
            });
        }
    }

    createMesh() {
        const geometry = new THREE.PlaneGeometry(
            this.chunkSize,
            this.chunkSize,
            this.segments,
            this.segments
        );

        const offsetX = this.worldX * this.chunkSize;
        const offsetZ = this.worldZ * this.chunkSize;

        // Apply height to vertices
        const positionAttribute = geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const localX = positionAttribute.getX(i);
            const localZ = -positionAttribute.getY(i); // Y becomes Z after rotation
            const worldPosX = localX + offsetX;
            const worldPosZ = localZ + offsetZ;
            const y = this.getHeightAt(worldPosX, worldPosZ);
            positionAttribute.setZ(i, y);
        }
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();

        // Create texture
        const texture = this.createTexture(offsetX, offsetZ);

        // Create material
        const material = new THREE.MeshLambertMaterial({
            map: texture,
            flatShading: true
        });

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(offsetX, 0, offsetZ);

        return mesh;
    }

    createTexture(offsetX, offsetZ) {
        const canvas = document.createElement('canvas');
        canvas.width = this.textureSize;
        canvas.height = this.textureSize;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < this.textureSize; y++) {
            for (let x = 0; x < this.textureSize; x++) {
                const worldPosX = ((x / this.textureSize) - 0.5) * this.chunkSize + offsetX;
                const worldPosZ = ((y / this.textureSize) - 0.5) * this.chunkSize + offsetZ;
                const color = this.getColorAt(worldPosX, worldPosZ);

                ctx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    addToScene(scene) {
        scene.add(this.mesh);
        if (this.grassChunk) {
            this.grassChunk.addToScene(scene);
        }
    }

    removeFromScene(scene) {
        scene.remove(this.mesh);
        if (this.grassChunk) {
            this.grassChunk.removeFromScene(scene);
        }
    }

    updateWind(time) {
        if (this.grassChunk) {
            this.grassChunk.updateWind(time);
        }
    }

    dispose() {
        this.mesh.geometry.dispose();
        this.mesh.material.map.dispose();
        this.mesh.material.dispose();
        if (this.grassChunk) {
            this.grassChunk.dispose();
        }
    }
}
