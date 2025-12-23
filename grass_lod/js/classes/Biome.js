import * as THREE from 'three';

export class Biome {
    constructor(config = {}) {
        // Noise frequencies for each layer
        this.heatFrequency = config.heatFrequency || 0.05;
        this.moistureFrequency = config.moistureFrequency || 0.08;
        this.fertilityFrequency = config.fertilityFrequency || 0.1;
        this.continentalnessFrequency = config.continentalnessFrequency || 0.02;

        // Noise loop sizes
        this.heatLoopSize = config.heatLoopSize || 0.2;
        this.moistureLoopSize = config.moistureLoopSize || 0.15;
        this.fertilityLoopSize = config.fertilityLoopSize || 0.25;
        this.continentalnessLoopSize = config.continentalnessLoopSize || 0.1;

        // Biome configuration (will be set via loadConfig)
        this.biomeConfig = null;
    }

    // Load biome configuration from JSON
    async loadConfig(configPath = './BIOME_CONFIG.json') {
        try {
            const response = await fetch(configPath);
            this.biomeConfig = await response.json();
        } catch (error) {
            console.error('Failed to load biome config:', error);
            // Use default config if loading fails
            this.biomeConfig = this.getDefaultConfig();
        }
    }

    // Get default configuration as fallback
    getDefaultConfig() {
        return {
            biomes: {
                desert: {
                    ground: {
                        hue: { base: 0.1, fertilityInfluence: 0.05 },
                        saturation: { base: 0.4, fertilityInfluence: 0.2 },
                        lightness: { base: 0.5, moistureInfluence: 0.1 }
                    }
                },
                tropical: {
                    ground: {
                        hue: { base: 0.25, fertilityInfluence: 0.1 },
                        saturation: { base: 0.5, fertilityInfluence: 0.3 },
                        lightness: { base: 0.2, moistureInfluence: 0.1 }
                    }
                },
                tundra: {
                    ground: {
                        hue: { base: 0.1, fertilityInfluence: 0 },
                        saturation: { base: 0.1, fertilityInfluence: 0.2 },
                        lightness: { base: 0.3, moistureInfluence: 0.2 }
                    }
                },
                boreal: {
                    ground: {
                        hue: { base: 0.25, fertilityInfluence: 0.05 },
                        saturation: { base: 0.3, fertilityInfluence: 0.3 },
                        lightness: { base: 0.25, moistureInfluence: 0.15 }
                    }
                }
            },
            grass: {
                color: {
                    baseHue: 0.28,
                    heatShiftAmount: 0.08,
                    fertilityShiftAmount: 0.04,
                    baseSaturation: 0.35,
                    moistureBoost: 0.4,
                    fertilityBoost: 0.25,
                    baseLightness: 0.25,
                    moistureLightness: 0.18,
                    fertilityLightness: 0.12
                },
                density: { base: 1000, max: 6000 },
                clusterCount: { base: 5, max: 20 },
                clusterProbability: { base: 0.5, max: 0.5 },
                scale: { min: 0.2, baseMax: 0.5, fertilityBoost: 1.0 },
                clusterRadius: { baseMin: 1.0, minBoost: 0.5, baseMax: 3.0, maxBoost: 10.0 }
            },
            terrain: {
                height: { continentalnessMultiplier: 15, moistureInfluence: 5 }
            }
        };
    }

    // Get heat value (0-1) at world position
    getHeat(x, z) {
        return looplex2D(
            x * this.heatFrequency,
            z * this.heatFrequency,
            this.heatLoopSize,
            this.heatLoopSize
        );
    }

    // Get moisture value (0-1) at world position
    getMoisture(x, z) {
        return looplex2D(
            x * this.moistureFrequency,
            z * this.moistureFrequency,
            this.moistureLoopSize,
            this.moistureLoopSize
        );
    }

    // Get fertility value (0-1) at world position
    getFertility(x, z) {
        return looplex2D(
            x * this.fertilityFrequency,
            z * this.fertilityFrequency,
            this.fertilityLoopSize,
            this.fertilityLoopSize
        );
    }

    // Get continentalness value (0-1) at world position
    getContinentalness(x, z) {
        return looplex2D(
            x * this.continentalnessFrequency,
            z * this.continentalnessFrequency,
            this.continentalnessLoopSize,
            this.continentalnessLoopSize
        );
    }

    // Get ground height based on continentalness and moisture
    getGroundHeight(x, z) {
        const cfg = this.biomeConfig?.terrain?.height || this.getDefaultConfig().terrain.height;
        const continentalness = this.getContinentalness(x, z);
        const moisture = this.getMoisture(x, z);

        // Higher continentalness = higher base elevation
        // Lower moisture in high areas = peaks, high moisture = valleys
        const baseHeight = continentalness * cfg.continentalnessMultiplier;
        const moistureInfluence = (1 - moisture) * continentalness * cfg.moistureInfluence;

        return baseHeight + moistureInfluence;
    }

    // Get ground color based on heat, moisture, and fertility
    getGroundColor(x, z) {
        const cfg = this.biomeConfig?.biomes || this.getDefaultConfig().biomes;
        const heat = this.getHeat(x, z);
        const moisture = this.getMoisture(x, z);
        const fertility = this.getFertility(x, z);

        // Define base colors for different biome extremes using config
        // Desert (hot, dry)
        const desertH = cfg.desert.ground.hue.base + fertility * cfg.desert.ground.hue.fertilityInfluence;
        const desertS = cfg.desert.ground.saturation.base + fertility * cfg.desert.ground.saturation.fertilityInfluence;
        const desertL = cfg.desert.ground.lightness.base + moisture * cfg.desert.ground.lightness.moistureInfluence;

        // Tropical (hot, wet)
        const tropicalH = cfg.tropical.ground.hue.base + fertility * cfg.tropical.ground.hue.fertilityInfluence;
        const tropicalS = cfg.tropical.ground.saturation.base + fertility * cfg.tropical.ground.saturation.fertilityInfluence;
        const tropicalL = cfg.tropical.ground.lightness.base + moisture * cfg.tropical.ground.lightness.moistureInfluence;

        // Tundra (cold, dry)
        const tundraH = cfg.tundra.ground.hue.base + fertility * cfg.tundra.ground.hue.fertilityInfluence;
        const tundraS = cfg.tundra.ground.saturation.base + fertility * cfg.tundra.ground.saturation.fertilityInfluence;
        const tundraL = cfg.tundra.ground.lightness.base + moisture * cfg.tundra.ground.lightness.moistureInfluence;

        // Boreal (cold, wet)
        const borealH = cfg.boreal.ground.hue.base + fertility * cfg.boreal.ground.hue.fertilityInfluence;
        const borealS = cfg.boreal.ground.saturation.base + fertility * cfg.boreal.ground.saturation.fertilityInfluence;
        const borealL = cfg.boreal.ground.lightness.base + moisture * cfg.boreal.ground.lightness.moistureInfluence;

        // Blend between hot and cold based on moisture
        const hotH = desertH * (1 - moisture) + tropicalH * moisture;
        const hotS = desertS * (1 - moisture) + tropicalS * moisture;
        const hotL = desertL * (1 - moisture) + tropicalL * moisture;

        const coldH = tundraH * (1 - moisture) + borealH * moisture;
        const coldS = tundraS * (1 - moisture) + borealS * moisture;
        const coldL = tundraL * (1 - moisture) + borealL * moisture;

        // Blend between hot and cold based on heat
        const h = coldH * (1 - heat) + hotH * heat;
        const s = coldS * (1 - heat) + hotS * heat;
        const l = coldL * (1 - heat) + hotL * heat;

        const color = new THREE.Color();
        color.setHSL(h, s, l);

        return color;
    }

    // Get grass color based on heat, moisture, and fertility
    getGrassColor(x, z) {
        const cfg = this.biomeConfig?.grass?.color || this.getDefaultConfig().grass.color;
        const heat = this.getHeat(x, z);
        const moisture = this.getMoisture(x, z);
        const fertility = this.getFertility(x, z);

        // Smooth transitions for grass color
        // Hue: cooler (more blue-green) in cold areas, warmer (yellow-green) in hot areas
        // Saturation: higher with moisture and fertility
        // Lightness: brighter with moisture and fertility

        const heatShift = (heat - 0.5) * cfg.heatShiftAmount;
        const fertilityShift = fertility * cfg.fertilityShiftAmount;
        const h = cfg.baseHue + heatShift + fertilityShift;

        const moistureBoost = moisture * cfg.moistureBoost;
        const fertilityBoost = fertility * cfg.fertilityBoost;
        const s = Math.min(1.0, cfg.baseSaturation + moistureBoost + fertilityBoost);

        const moistureLight = moisture * cfg.moistureLightness;
        const fertilityLight = fertility * cfg.fertilityLightness;
        const l = Math.min(0.65, cfg.baseLightness + moistureLight + fertilityLight);

        const color = new THREE.Color();
        color.setHSL(h, s, l);
        return color;
    }

    // Get grass cluster probability based on fertility and moisture
    getGrassClusterProbability(x, z) {
        const cfg = this.biomeConfig?.grass?.clusterProbability || this.getDefaultConfig().grass.clusterProbability;
        const fertility = this.getFertility(x, z);
        const moisture = this.getMoisture(x, z);

        // More fertile and moist areas have more clustered grass
        return cfg.base + (fertility * moisture) * cfg.max;
    }

    // Get grass cluster count based on fertility
    getGrassClusterCount(x, z) {
        const cfg = this.biomeConfig?.grass?.clusterCount || this.getDefaultConfig().grass.clusterCount;
        const fertility = this.getFertility(x, z);
        const moisture = this.getMoisture(x, z);

        // More fertile areas have more clusters
        return Math.floor(cfg.base + (fertility * moisture) * cfg.max);
    }

    // Get grass density (total count) based on fertility and moisture
    getGrassDensity(x, z) {
        const cfg = this.biomeConfig?.grass?.density || this.getDefaultConfig().grass.density;
        const fertility = this.getFertility(x, z);
        const moisture = this.getMoisture(x, z);
        const heat = this.getHeat(x, z);

        // Optimal grass growth: moderate heat, high moisture, high fertility
        const heatFactor = 1 - Math.abs(heat - 0.5) * 2; // Peaks at 0.5
        const densityFactor = fertility * moisture * heatFactor;

        return Math.floor(cfg.base + densityFactor * cfg.max);
    }

    // Get grass scale range based on fertility
    getGrassScaleRange(x, z) {
        const cfg = this.biomeConfig?.grass?.scale || this.getDefaultConfig().grass.scale;
        const fertility = this.getFertility(x, z);
        const moisture = this.getMoisture(x, z);

        const baseFactor = fertility * moisture;

        return {
            min: cfg.min,
            max: cfg.baseMax + baseFactor * cfg.fertilityBoost
        };
    }

    // Get cluster radius range based on moisture
    getClusterRadiusRange(x, z) {
        const cfg = this.biomeConfig?.grass?.clusterRadius || this.getDefaultConfig().grass.clusterRadius;
        const moisture = this.getMoisture(x, z);
        const fertility = this.getFertility(x, z);

        const sizeFactor = moisture * fertility;

        return {
            min: cfg.baseMin + sizeFactor * cfg.minBoost,
            max: cfg.baseMax + sizeFactor * cfg.maxBoost
        };
    }
}
