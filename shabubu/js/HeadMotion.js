// Head Motion - Head animation during speech and idle movements
class HeadMotion {
    constructor() {
        this.isSpeaking = false;
        this.animationIntensity = 0;
        this.headBobOffset = Math.random() * Math.PI * 2;
        this.headTiltOffset = Math.random() * Math.PI * 2;
        this.earWiggleOffset = Math.random() * Math.PI * 2;
        
        // Animation settings
        this.HEAD_BOB_SPEED = 0.2;
        this.HEAD_TILT_SPEED = 0.07;
        this.EAR_WIGGLE_SPEED = 0.15;
        
        // References to character parts
        this.character = null;
        this.head = null;
        this.ear1 = null;
        this.ear2 = null;
    }

    setReferences(character, head, ear1, ear2) {
        this.character = character;
        this.head = head;
        this.ear1 = ear1;
        this.ear2 = ear2;
    }

    startAnimation() {
        this.isSpeaking = true;
        this.animationIntensity = 0.4;
    }

    stopAnimation() {
        this.isSpeaking = false;
        // Gradually reduce intensity
        const reduceIntensity = () => {
            this.animationIntensity *= 0.9;
            if (this.animationIntensity > 0.01) {
                requestAnimationFrame(reduceIntensity.bind(this));
            } else {
                this.animationIntensity = 0;
                this.resetToNeutral();
            }
        };
        reduceIntensity();
    }

    resetToNeutral() {
        if (this.character) {
            this.character.position.y = 0;
        }

        if (this.head) {
            this.head.rotation.z = 0;
        }

        if (this.ear1 && this.ear2) {
            this.ear1.rotation.x = 0.1;
            this.ear1.rotation.z = 0;
            this.ear2.rotation.x = -0.05;
            this.ear2.rotation.z = 0;
            this.ear1.position.y = 0.7;
            this.ear2.position.y = 0.7;
        }
    }

    update() {
        if (!this.isSpeaking && this.animationIntensity === 0) return;

        // Increment offsets
        this.headBobOffset += this.HEAD_BOB_SPEED;
        this.headTiltOffset += this.HEAD_TILT_SPEED;
        this.earWiggleOffset += this.EAR_WIGGLE_SPEED;

        if (this.character && this.head && this.ear1 && this.ear2) {
            // Head bobbing
            const bobY = Math.sin(this.headBobOffset) * 0.03 * this.animationIntensity;

            // Head tilting
            const tiltZ = Math.sin(this.headTiltOffset) * 0.1 * this.animationIntensity;

            // Apply head movements
            this.character.position.y = bobY;
            this.head.rotation.z = tiltZ;

            // Ear movements
            const earWiggle1 = Math.sin(this.earWiggleOffset) * 0.08 * this.animationIntensity;
            const earWiggle2 = Math.sin(this.earWiggleOffset + 1.5) * 0.06 * this.animationIntensity;

            // Ear tilting
            const earTilt1 = Math.sin(this.earWiggleOffset * 0.8) * 0.1 * this.animationIntensity;
            const earTilt2 = Math.sin(this.earWiggleOffset * 0.8 + 1.2) * 0.08 * this.animationIntensity;

            // Apply ear movements
            this.ear1.rotation.x = 0.1 + earTilt1;
            this.ear1.rotation.z = earWiggle1;
            this.ear2.rotation.x = -0.05 + earTilt2;
            this.ear2.rotation.z = earWiggle2;

            // Ear bouncing
            this.ear1.position.y = 0.7 + Math.sin(this.earWiggleOffset * 0.5) * 0.02 * this.animationIntensity;
            this.ear2.position.y = 0.7 + Math.sin(this.earWiggleOffset * 0.5 + 0.8) * 0.015 * this.animationIntensity;
        }
    }
}