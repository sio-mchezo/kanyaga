import * as THREE from 'three';
import { GroundChunk } from './GroundChunk.js';

export class ChunkLODManager {
    constructor(config = {}) {
        this.chunkSize = config.chunkSize || 20;
        this.biome = config.biome;

        // LOD distance thresholds
        this.lodLevels = config.lodLevels || [
            { distance: 30, segments: 100, textureSize: 64, grassDensityMultiplier: 1.0 },
            { distance: 50, segments: 50, textureSize: 32, grassDensityMultiplier: 0.5 },
            { distance: 80, segments: 25, textureSize: 16, grassDensityMultiplier: 0.25 },
            { distance: Infinity, segments: 10, textureSize: 8, grassDensityMultiplier: 0 }
        ];

        // Active chunks storage: key = "x,z", value = { chunk, currentLOD }
        this.chunks = new Map();

        // Camera reference (will be set via setCamera)
        this.camera = null;

        // Update frequency
        this.updateInterval = config.updateInterval || 500; // ms
        this.lastUpdate = 0;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    // Get chunk key from world coordinates
    getChunkKey(worldX, worldZ) {
        return `${worldX},${worldZ}`;
    }

    // Calculate which LOD level should be used for a chunk
    calculateLOD(chunkWorldX, chunkWorldZ) {
        if (!this.camera) return 0;

        const chunkCenterX = chunkWorldX * this.chunkSize;
        const chunkCenterZ = chunkWorldZ * this.chunkSize;

        const dx = this.camera.position.x - chunkCenterX;
        const dz = this.camera.position.z - chunkCenterZ;
        const distance = Math.sqrt(dx * dx + dz * dz);

        for (let i = 0; i < this.lodLevels.length; i++) {
            if (distance < this.lodLevels[i].distance) {
                return i;
            }
        }

        return this.lodLevels.length - 1;
    }

    // Create a chunk with specific LOD settings
    createChunk(worldX, worldZ, lodLevel, scene) {
        const lod = this.lodLevels[lodLevel];
        const chunkCenterX = worldX * this.chunkSize;
        const chunkCenterZ = worldZ * this.chunkSize;

        // Get biome parameters for this chunk
        const grassScale = this.biome.getGrassScaleRange(chunkCenterX, chunkCenterZ);
        const clusterRadius = this.biome.getClusterRadiusRange(chunkCenterX, chunkCenterZ);
        const baseDensity = this.biome.getGrassDensity(chunkCenterX, chunkCenterZ);

        const chunk = new GroundChunk(worldX, worldZ, {
            chunkSize: this.chunkSize,
            segments: lod.segments,
            textureSize: lod.textureSize,
            grassCount: Math.floor(baseDensity * lod.grassDensityMultiplier),
            grassClusterCount: this.biome.getGrassClusterCount(chunkCenterX, chunkCenterZ),
            grassClusterRadiusMin: clusterRadius.min,
            grassClusterRadiusMax: clusterRadius.max,
            grassMinScale: grassScale.min,
            grassMaxScale: grassScale.max,
            grassClusterProbability: this.biome.getGrassClusterProbability(chunkCenterX, chunkCenterZ),
            getHeightAt: (x, z) => this.biome.getGroundHeight(x, z),
            getColorAt: (x, z) => this.biome.getGroundColor(x, z),
            getGrassColorAt: (x, z) => this.biome.getGrassColor(x, z),
            enableGrass: lod.grassDensityMultiplier > 0
        });

        chunk.addToScene(scene);
        return chunk;
    }

    // Add or update a chunk
    addChunk(worldX, worldZ, scene) {
        const key = this.getChunkKey(worldX, worldZ);
        const targetLOD = this.calculateLOD(worldX, worldZ);

        if (this.chunks.has(key)) {
            const chunkData = this.chunks.get(key);

            // If LOD level changed, recreate the chunk
            if (chunkData.currentLOD !== targetLOD) {
                chunkData.chunk.removeFromScene(scene);
                chunkData.chunk.dispose();

                const newChunk = this.createChunk(worldX, worldZ, targetLOD, scene);
                this.chunks.set(key, { chunk: newChunk, currentLOD: targetLOD });
            }
        } else {
            // Create new chunk
            const chunk = this.createChunk(worldX, worldZ, targetLOD, scene);
            this.chunks.set(key, { chunk, currentLOD: targetLOD });
        }
    }

    // Remove a chunk
    removeChunk(worldX, worldZ, scene) {
        const key = this.getChunkKey(worldX, worldZ);

        if (this.chunks.has(key)) {
            const chunkData = this.chunks.get(key);
            chunkData.chunk.removeFromScene(scene);
            chunkData.chunk.dispose();
            this.chunks.delete(key);
        }
    }

    // Update all chunks' LOD based on camera position
    update(scene, currentTime) {
        if (!this.camera) return;

        // Throttle updates
        if (currentTime - this.lastUpdate < this.updateInterval) {
            return;
        }
        this.lastUpdate = currentTime;

        // Update LOD for all chunks
        for (const [key, chunkData] of this.chunks.entries()) {
            const [worldX, worldZ] = key.split(',').map(Number);
            const targetLOD = this.calculateLOD(worldX, worldZ);

            // If LOD changed, recreate chunk
            if (chunkData.currentLOD !== targetLOD) {
                chunkData.chunk.removeFromScene(scene);
                chunkData.chunk.dispose();

                const newChunk = this.createChunk(worldX, worldZ, targetLOD, scene);
                this.chunks.set(key, { chunk: newChunk, currentLOD: targetLOD });
            }
        }
    }

    // Update wind for all chunks
    updateWind(time) {
        for (const [key, chunkData] of this.chunks.values()) {
            chunkData.chunk.updateWind(time);
        }
    }

    // Get all chunk objects (for compatibility)
    getChunks() {
        return Array.from(this.chunks.values()).map(data => data.chunk);
    }

    // Get LOD statistics
    getStats() {
        const stats = {
            totalChunks: this.chunks.size,
            totalGrassBlades: 0,
            lodCounts: new Array(this.lodLevels.length).fill(0)
        };

        for (const [key, chunkData] of this.chunks.entries()) {
            stats.lodCounts[chunkData.currentLOD]++;
            if (chunkData.chunk.grassChunk) {
                stats.totalGrassBlades += chunkData.chunk.grassChunk.grassCount;
            }
        }

        return stats;
    }

    // Dispose all chunks
    dispose(scene) {
        for (const [key, chunkData] of this.chunks.entries()) {
            chunkData.chunk.removeFromScene(scene);
            chunkData.chunk.dispose();
        }
        this.chunks.clear();
    }
}
