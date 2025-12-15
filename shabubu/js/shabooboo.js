// Clean Shabooboo with 5 buttons
class Shabooboo {
  constructor() {
    console.log("Shabooboo starting...");

    // Initialize properties
    this.state = "sit";
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = null;
    this.mixer = null;
    this.actions = [];
    this.currentAction = null;
    this.groundtex = null;
    this.xval = 0;
    this.num = 0;
    this.divisor = 30;
    this.lerpspeed = 0;
    this.ear1 = null;
    this.ear2 = null;
    this.earGroup = null;
    this.characterObject = null;

    this.bones = { head: null };
    this.textures = {};

    // Facial systems
    this.faceManager = new FaceManager();
    this.headMotion = new HeadMotion();
    this.speechManager = new SpeechManager(this.faceManager, this.headMotion);

    // Initialize
    this._initialize();
  }

  _initialize() {
    this._setupScene();
    this._setupCamera();
    this._setupRenderer();
    this._setupControls();
    this._setupLights();
    this._setupGround();
    this._setupButtons(); // This creates our 5-button interface
    this._preloadTextures();
    this._loadCharacter();
    this._setupEventListeners();
    this._startAnimationLoop();
  }

  _setupScene() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
  }

  _setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(3, 0.7, 3);
    this.scene.add(this.camera);
  }

  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  _setupControls() {
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
    this.controls.enablePan = false;
    this.controls.maxDistance = 5;
    this.controls.minDistance = 2;
    this.controls.maxPolarAngle = Math.PI * 0.46;
    this.controls.target.set(0, 0.9, 0);
    this.controls.update();
  }

  _setupLights() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xcccccc, 0.8);
    this.scene.add(ambient);

    // Point light
    const light1 = new THREE.PointLight(0xffefef, 0.9);
    light1.position.set(0, 0.2, 2);
    light1.lookAt(0, 0, 0);
    this.scene.add(light1);

    // Directional shadow light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-3, 15, -8);
    dirLight.castShadow = true;
    this.scene.add(dirLight);
  }

  _setupGround() {
    const geometry = new THREE.CircleGeometry(5, 30);
    const groundMaterial = new THREE.MeshLambertMaterial({
      map: this._getTexture("3d/carpet.jpg"),
    });

    if (groundMaterial.map) {
      groundMaterial.map.wrapS = groundMaterial.map.wrapT =
        THREE.RepeatWrapping;
      this.groundtex = groundMaterial.map;
    }

    const ground = new THREE.Mesh(geometry, groundMaterial);
    ground.position.set(0, 0.01, 0);
    ground.rotation.set(-Math.PI / 2, 0, 0);
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  _setupButtons() {
    console.log("Setting up 5-button interface...");

    // Remove any existing UI
    const oldUI = document.getElementById("btns");
    if (oldUI) oldUI.remove();

    const oldSpeechUI = document.getElementById("speech-ui");
    if (oldSpeechUI) oldSpeechUI.remove();

    const oldSubs = document.getElementById("subs");
    if (oldSubs) oldSubs.remove();

    // Create clean button container
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "btns";
    buttonContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 10px;
            z-index: 100;
            flex-wrap: wrap;
        `;

    // Define our 5 buttons
    const buttons = [
      { id: "talk", text: "TALK", color: "#00ff00" },
      { id: "sit", text: "SIT", color: "#ff9900" },
      { id: "stand", text: "STAND", color: "#0099ff" },
      { id: "walk", text: "WALK", color: "#ff00ff" },
      { id: "run", text: "RUN", color: "#ff0000" },
    ];

    // Create buttons
    buttons.forEach((btn) => {
      const button = document.createElement("button");
      button.id = btn.id;
      button.textContent = btn.text;
      button.style.cssText = `
                padding: 15px 25px;
                font-family: monospace;
                font-size: 18px;
                font-weight: bold;
                color: white;
                background: ${btn.color};
                border: none;
                border-radius: 10px;
                cursor: pointer;
                min-width: 100px;
                transition: all 0.2s;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            `;

      // Hover effect
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-2px)";
        button.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(0)";
        button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
      });

      buttonContainer.appendChild(button);
    });

    document.body.appendChild(buttonContainer);

    // Set up button handlers
    this._setupButtonHandlers();
  }

  _setupButtonHandlers() {
    // TALK button - speaks random word
    const talkBtn = document.getElementById("talk");
    if (talkBtn) {
      talkBtn.addEventListener("click", () => {
        if (this.speechManager) {
          this.speechManager.speakRandomWord();
        }
      });
    }

    // SIT button
    const sitBtn = document.getElementById("sit");
    if (sitBtn) {
      sitBtn.addEventListener("click", () => {
        setTimeout(() => {
          if (typeof sitSFX !== "undefined") {
            sitSFX();
          }
        }, 300);
        this.state = "sit";
        this.xval = 0;
        this._playAction(CONFIG.ANIMATIONS.SIT);
      });
    }

    // STAND button (uses idle animation)
    const standBtn = document.getElementById("stand");
    if (standBtn) {
      standBtn.addEventListener("click", () => {
        this.state = "idle";
        this.xval = 0;
        this._playAction(CONFIG.ANIMATIONS.IDLE);
      });
    }

    // WALK button
    const walkBtn = document.getElementById("walk");
    if (walkBtn) {
      walkBtn.addEventListener("click", () => {
        this.state = "walk";
        this.xval = CONFIG.SPEEDS.WALK / 3;
        this._playAction(CONFIG.ANIMATIONS.WALK);
      });
    }

    // RUN button
    const runBtn = document.getElementById("run");
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        this.state = "run";
        this.xval = CONFIG.SPEEDS.RUN / 2;
        this._playAction(CONFIG.ANIMATIONS.RUN);
      });
    }
  }

  _getTexture(path) {
    if (!this.textures[path]) {
      const texture = new THREE.TextureLoader().load(path);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      this.textures[path] = texture;
    }
    return this.textures[path];
  }

  _preloadTextures() {
    const texturePaths = [
      "3d/shabody.png",
      "3d/sm-face.png",
      "3d/sm-facebmp.png",
      "3d/sm-facerough.png",
      "3d/v.png",
      "3d/bmp.png",
      "3d/carpet.jpg",
      "3d/sm-face-clean.png",
      "3d/sm-facebmp-clean.png",
      "3d/sm-faceblink.png",
      "3d/sm-face-A.png",
      "3d/sm-facebmp-A.png",
      "3d/sm-face-oo.png",
      "3d/sm-facebmp-oo.png",
    ];

    texturePaths.forEach((path) => this._getTexture(path));
  }

  _loadCharacter() {
    const loader = new THREE.FBXLoader();

    loader.load(
      "3d/tpose.fbx",
      (object) => {
        this.characterObject = object;
        this.mixer = new THREE.AnimationMixer(object);
        this._cacheBoneReferences(object);

        // Store T-pose
        const tPoseAction = this.mixer.clipAction(object.animations[0]);
        this.actions[CONFIG.ANIMATIONS.T_POSE] = tPoseAction;

        // Load sitting pose
        this._loadSittingPose();
      },
      undefined,
      (error) => {
        console.error("Error loading character:", error);
      },
    );
  }

  _cacheBoneReferences(object) {
    this.bones.head = object.getObjectByName("mixamorigHead");
  }

  _loadSittingPose() {
    const loader = new THREE.FBXLoader();
    loader.load("3d/sit.fbx", (object) => {
      const sitAction = this.mixer.clipAction(object.animations[0]);
      this.actions[CONFIG.ANIMATIONS.SIT] = sitAction;
      this._loadOtherAnimations();
    });
  }

  _loadOtherAnimations() {
    const animFiles = [
      { file: "idle.fbx", index: CONFIG.ANIMATIONS.IDLE },
      { file: "walk.fbx", index: CONFIG.ANIMATIONS.WALK },
      { file: "run.fbx", index: CONFIG.ANIMATIONS.RUN },
    ];

    const loader = new THREE.FBXLoader();
    let loadedCount = 0;

    animFiles.forEach(({ file, index }) => {
      loader.load(`3d/${file}`, (object) => {
        const action = this.mixer.clipAction(object.animations[0]);
        this.actions[index] = action;
        loadedCount++;

        if (loadedCount === animFiles.length) {
          this._finalizeCharacterSetup();
        }
      });
    });
  }

  _finalizeCharacterSetup() {
    this._setupMaterials();
    this.scene.add(this.characterObject);
    this._setupCharacterParts();

    // Start with sitting pose
    this._playAction(CONFIG.ANIMATIONS.SIT);
  }

  _setupMaterials() {
    if (!this.characterObject) return;

    const bodyTexture = this._getTexture("3d/shabody.png");

    this.characterObject.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.map = bodyTexture;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  _setupCharacterParts() {
    if (!this.bones.head) return;

    // Head sphere
    const sphereGeometry = new THREE.SphereGeometry(0.7, 40, 40);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.01,
      roughness: 3,
      map: this._getTexture("3d/sm-face-clean.png"),
      displacementMap: this._getTexture("3d/sm-facebmp-clean.png"),
      roughnessMap: this._getTexture("3d/sm-facerough.png"),
      displacementScale: -0.4,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.scale.set(0.7, 0.7, 0.8);
    sphere.rotation.y = -Math.PI / 2;
    sphere.position.set(0, 0.3, 0.1);
    this.bones.head.add(sphere);

    // Initialize FaceManager
    this.faceManager.setHeadMaterial(sphereMaterial);
    this.faceManager
      .init()
      .then(() => {
        // Initialize SpeechManager
        return this.speechManager.init();
      })
      .then(() => {
        console.log("All systems ready");
      });

    // Setup ears
    this._setupEars();

    // Set up head motion
    if (this.headMotion) {
      this.headMotion.setReferences(
        // this.characterObject,
        this.bones.head,
        this.ear1,
        this.ear2,
      );
    }
  }

  _setupEars() {
    this.earGroup = new THREE.Group();
    this.earGroup.rotation.y = -Math.PI/2;
    this.bones.head.add(this.earGroup);

    const earGeometry = new THREE.SphereGeometry(0.2, 12, 12);
    const earMaterial = new THREE.MeshStandardMaterial({
      map: this._getTexture("3d/v.png"),
      displacementMap: this._getTexture("3d/bmp.png"),
      displacementScale: -0.1,
    });

    // Left ear
    this.ear1 = new THREE.Mesh(earGeometry, earMaterial);
    this.ear1.position.set(-0.05, 0.7, 0.35);
    this.ear1.rotation.set(0.1, 0, 0);
    this.ear1.scale.set(0.5, 1.7, 0.6);
    this.earGroup.add(this.ear1);

    // Right ear
    this.ear2 = this.ear1.clone();
    this.ear2.rotation.set(-0.05, 0, -0.1);
    this.ear2.position.set(-0.1, 0.7, -0.35);
    this.earGroup.add(this.ear2);
  }

  _playAction(index) {
    if (!this.actions[index] || this.actions[index] === this.currentAction) {
      return;
    }

    const newAction = this.actions[index];

    if (this.currentAction) {
      this.currentAction.fadeOut(0.2);
    }

    newAction.reset();
    newAction.setEffectiveWeight(1);
    newAction.fadeIn(0.2);
    newAction.play();

    this.currentAction = newAction;
    if (this.mixer) {
      this.mixer.update(0);
    }
  }

  _update(delta) {
    this.num++;

    // Update head position for sitting
    if (this.bones.head) {
      const targetZ = this.state === "sit" ? 0.1 : 0;
      this.bones.head.position.z +=
        (targetZ - this.bones.head.position.z) * 0.3;
    }

    if (this.mixer) {
      this.mixer.update(delta);

      // Update divisor based on state
      this.divisor = CONFIG.DIVISORS[this.state] || 20;

      // Update head motion
      if (this.headMotion) {
        this.headMotion.update();
      }

      // BLINK ALL THE TIME - more frequent blinking
      if (this.faceManager && this.faceManager.isReady) {
        // Blink randomly (about every 2-8 seconds)
        if (Math.random() > 0.99) {
          this.faceManager.blink();
        }
      }
    }

    // Update ground texture
    if (this.groundtex && this.xval > 0.1) {
      this.lerpspeed += (this.xval - this.lerpspeed) * 0.3;
      this.groundtex.offset.y -= this.lerpspeed / 150;
    }

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  _startAnimationLoop() {
    const animate = (time) => {
      requestAnimationFrame(animate);
      const delta = this.clock ? this.clock.getDelta() : 0.016;
      this._update(delta);
    };

    animate();
  }

  _setupEventListeners() {
    window.addEventListener("resize", () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }
}
