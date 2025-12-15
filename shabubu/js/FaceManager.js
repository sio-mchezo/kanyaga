// Face Manager - Simplified
class FaceManager {
  constructor() {
    this.textures = {};
    this.currentFace = "0";
    this.isReady = false;
    this.textureLoader = new THREE.TextureLoader();
    this.headMaterial = null;

    // Define face textures
    this.faces = [
      { n: "0", col: "3d/sm-face-clean.png", bump: "3d/sm-facebmp-clean.png" },
      { n: "1", col: "3d/sm-face.png", bump: "3d/sm-facebmp.png" },
      { n: "2", col: "3d/sm-faceblink.png", bump: "3d/sm-facebmp.png" },
      { n: "3", col: "3d/sm-face-A.png", bump: "3d/sm-facebmp-A.png" },
      { n: "5", col: "3d/sm-face-E.png", bump: "3d/sm-facebmp-E.png" },
      { n: "7", col: "3d/sm-face-oo.png", bump: "3d/sm-facebmp-oo.png" },
    ];

    // Simple phoneme mapping for 10 random words
    this.phonemeMap = {
      silence: "0",
      " ": "0",
      a: "3",
      e: "5",
      i: "5",
      o: "7",
      u: "7",
      m: "5",
      l: "5",
      r: "7",
      s: "5",
      t: "5",
      d: "5",
      f: "5",
      g: "3",
      h: "5",
      k: "3",
      n: "5",
      p: "5",
      w: "7",
      y: "5",
      default: "0",
    };
  }

  async init() {
    await this.preloadTextures();
    this.isReady = true;
    console.log("FaceManager ready");
  }

  async preloadTextures() {
    const loadPromises = this.faces.map(async (face) => {
      const [col, bump] = await Promise.all([
        this.loadTexture(face.col),
        this.loadTexture(face.bump),
      ]);
      this.texfix(col);
      this.texfix(bump);
      return { n: face.n, col, bump };
    });

    const loaded = await Promise.all(loadPromises);
    loaded.forEach((texture) => {
      this.textures[texture.n] = texture;
    });
  }

  loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, resolve, undefined, reject);
    });
  }

  texfix(texture) {
    texture.magFilter = texture.minFilter = THREE.NearestFilter;
  }

  setFace(faceIndex) {
    if (!this.isReady || !this.headMaterial) return;

    const face = this.textures[faceIndex];
    if (face && this.currentFace !== faceIndex) {
      this.headMaterial.map = face.col;
      this.headMaterial.displacementMap = face.bump;
      this.headMaterial.needsUpdate = true;
      this.currentFace = faceIndex;
    }
  }

  setHeadMaterial(material) {
    this.headMaterial = material;
  }

  // Simple blink
  blink() {
    if (!this.isReady) return;

    this.setFace("2");

    // Quick blink (50-150ms)
    setTimeout(
      () => {
        this.setFace("1");
      },
      50 + Math.random() * 100,
    );
  }

  // Simple mouth shape for speaking
  mouthshape(text, speed = CONFIG.SPEECH.SPEED) {
    if (!this.isReady) return;

    // Simple animation - just open/close mouth
    this.setFace("3"); // A sound

    setTimeout(
      () => {
        this.setFace("7"); // O sound
      },
      (text.length * speed) / 2,
    );

    setTimeout(
      () => {
        this.setFace("1"); // Back to neutral
      },
      text.length * speed + 200,
    );
  }

  resetToNeutral() {
    this.setFace("1");
  }
}
