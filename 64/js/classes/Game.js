class Game {
  minigameScores = {};
  constructor(
    options = {
      canvas,
      width: 64,
      height: 64,
      mapWidth: 1024,
      mapHeight: 1024,
      player: {
        width: 128,
        size: 32,
        count: 4,
        fps: 16,
        x: 0,
        z: 0,
        xlerp: 0,
        zlerp: 0,
        vx: 0,
        vy: 0,
        xu: 0,
        xv: 0,
        rotation: 0,
        maxSpeed: 0.4,
        moving: false,
        jactive: false,
      },
      keyboard: {},
      joystick: {},
      camOffsetY: 10,
      minigames: {},
      canvas,
      onQuit,
    },
  ) {
    Object.assign(this, options);

    this.debugMode = false;

    if (this.debugMode) console.groupCollapsed("GAME constructor");

    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.id = "generated-game-canvas";
    }

    this.canvas.width = options.width;
    this.canvas.height = options.height;

    // this.stx

    this.keyboard = options.keyboard || {};
    this.joystick = options.joystick || {};

    this.activeMinigameInfo = null;

    this.triggeredDoorway = null;

    this.minigameDataMap = options.minigames;

    this.setCurrentMap = options.maps[options.currentMapName];

    this.sceneTransitions = [];

    this.objectArr = []; // does not include hero

    this.doorDataList = []; // doors to houses, used for minigames

    this.currentMap = this.maps[this.currentMapName];

    this.initScene();

    this.initCurrentMap();
    this.initStx();

    this.initOverlays();

    if (this.debugMode) console.groupEnd();

    this.startMinigame(4, 0);
  }

  initScene() {
    if (this.debugMode) console.groupCollapsed("GAME.initScene");

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(72, 1, 0.1, 10000);
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas: this.canvas,
    });
    this.renderer.setClearColor(0x0088ff);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(64 / 64);
    this.renderer.setSize(64, 64);

    this.camera.aspect = 1 / 1;
    this.camera.position.set(0, 50, 150);
    this.camera.updateProjectionMatrix();

    this.initLighting();

    // Optional fog (commented out like in main scene)
    // this.scene.fog = new THREE.FogExp2(0x000000, 0.0015);

    if (this.debugMode) console.groupEnd();
  }

  initCurrentMap() {
    if (this.debugMode) console.groupCollapsed("GAME.initCurrentMap");

    const { currentMap } = this;
    // this.mapImg = currentMap.mapImg;
    // this.displacementMapImg = currentMap.displacementMapImg;
    this.initGround();
    this.initHero();
    this.initHouses();
    this.initTrees();
    this.initHit();
    this.initCharacters();

    if (this.debugMode) console.groupEnd();
  }

  initGround() {
    if (this.debugMode) console.groupCollapsed("GAME.initGround");
    const { objectArr, scene } = this;
    // groundplane
    const geometry = new THREE.PlaneGeometry(
      this.worldWidth ?? 2048,
      this.worldHeight ?? 2048,
      300,
      300,
    );
    const material = new THREE.MeshStandardMaterial({
      displacementMap: new THREE.CanvasTexture(
        this.currentMap.displacementMapImg,
      ),
      displacementScale: this.currentMap.displacementScale ?? 1,
      displacementBias: this.currentMap.displacementBias ?? 0,
      map: new THREE.CanvasTexture(this.currentMap.mapImg),
      metalness: 0,
      roughness: 20,
    });
    material.map.magFilter = THREE.NearestFilter;
    material.map.minFilter = THREE.NearestFilter;

    const groundplane = new THREE.Mesh(geometry, material);
    groundplane.name = "groundplane";
    groundplane.position.set(0, 0, 0);
    groundplane.rotation.x = -Math.PI / 2;
    groundplane.receiveShadow = true;
    groundplane.castShadow = true;
    groundplane.scale.set(4, 4, 4);
    scene.add(groundplane);
    objectArr.push(groundplane);
    this.groundplane = groundplane;

    //
    const watermaterial = new THREE.MeshBasicMaterial({
      color: 0x1111ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const waterplane = new THREE.Mesh(geometry, watermaterial);
    waterplane.receiveShadow = true;
    waterplane.castShadow = true;
    waterplane.rotation.x = -Math.PI / 2;
    waterplane.position.set(0, 0, 0);
    waterplane.position.y = this.currentMap.waterLevel ?? 0;
    waterplane.name = "waterplane";
    scene.add(waterplane);
    this.waterplane = waterplane;
    if (this.debugMode) console.groupEnd();
  }

  initHero() {
    if (this.debugMode) console.groupCollapsed("GAME.initHero");
    this.hero = new THREE.Group();
    this.hero.name = "hero";
    this.scene.add(this.hero);
    this.camera.lookAt(this.hero.position);
    this.heroFacetex = new THREE.TextureLoader().load("assets/face.png");
    this.heroFacetex.magFilter = THREE.NearestFilter;
    this.heroFacetex.minFilter = THREE.NearestFilter;
    this.heroGeometry = new THREE.SphereGeometry(20, 20, 20);
    this.heroMaterial = new THREE.MeshLambertMaterial({
      // color: 0x00ff00,
      map: this.heroFacetex,
    });
    this.heroHead = new THREE.Mesh(this.heroGeometry, this.heroMaterial);
    this.heroHead.receiveShadow = true;
    this.heroHead.castShadow = true;
    this.heroHead.rotation.set(0, -Math.PI / 2, 0);
    this.heroHead.position.y = 20;
    this.heroHead.name = "hero head";
    this.hero.add(this.heroHead);

    this.heroLegIdleTexture = new THREE.TextureLoader().load(
      "assets/leg-still3.png",
    );
    this.heroLegIdleTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.heroLegIdleTexture.repeat.set(1, 1);
    this.heroLegRunTexture = new THREE.TextureLoader().load(
      "assets/leg-walk3.png",
    );
    this.heroLegRunTexture.wrapT = THREE.RepeatWrapping;
    this.heroLegRunTexture.repeat.set(0.25, 1);
    this.heroLegIdleTexture.magFilter = THREE.NearestFilter;
    this.heroLegIdleTexture.minFilter = THREE.NearestFilter;
    this.heroLegRunTexture.magFilter = THREE.NearestFilter;
    this.heroLegRunTexture.minFilter = THREE.NearestFilter;

    const heroLegGeo = new THREE.PlaneGeometry(30, 30);
    const heroLegMat = new THREE.MeshBasicMaterial({
      map: this.heroLegIdleTexture,
      transparent: true,
      alphaTest: 0.2,
    });

    const heroLegPlane = new THREE.Mesh(heroLegGeo, heroLegMat);
    heroLegPlane.position.set(0, 0, 0);
    this.hero.add(heroLegPlane);
    this.heroLegPlane = heroLegPlane;
    this.heroLegPlane.name = "hero legs";
    if (this.debugMode) console.groupEnd();
  }

  initHouses() {
    if (this.debugMode) console.groupCollapsed("GAME.initHouses");
    this.currentMap.houseGroup = new THREE.Group();

    const { houseGroup, houses = [] } = this.currentMap;

    houseGroup.name = "houseGroup";
    houseGroup.userData.instances = [];
    this.scene.add(houseGroup);
    this.objectArr.push(houseGroup);
    houses.forEach((houseData) => {
      this.initHouse(houseData);
    });
    if (this.debugMode) console.groupEnd();
  }
  initHouse({ x, y, z, modelJsonObj, disabled }) {
    if (this.debugMode) console.groupCollapsed("GAME.initHouse");
    const _y = y ?? this.getMapHeight({ x, z }, false);
    const { houseGroup } = this.currentMap;
    const houseInstance = new CrappyObjectInstance(modelJsonObj);
    houseGroup.userData.instances.push(houseInstance);
    houseGroup.add(houseInstance.root);

    houseInstance.root.position.set(x, _y, z);
    houseInstance.root.scale.multiplyScalar(10);
    const houseId = "house-" + houseGroup.children.length;
    houseInstance.root.name = houseId;
    houseInstance.root.visible = !disabled;

    const door = houseInstance.instances.door;

    let pivot = new THREE.Group();
    pivot.name = houseId + "-pivot";
    door.parent.add(pivot);
    pivot.position.copy(door.position);
    pivot.position.x -= 2;
    door.position.set(2, 0, 0);

    let s = new THREE.Mesh(
      new THREE.CylinderGeometry(),
      new THREE.MeshStandardMaterial(),
    );
    s.position.y += 1;
    s.name = houseId + "-hinge1";
    pivot.add(s);
    s = new THREE.Mesh(
      new THREE.CylinderGeometry(),
      new THREE.MeshStandardMaterial(),
    );
    s.position.y -= 1;
    s.name = houseId + "-hinge2";
    pivot.add(s);
    s.scale.multiplyScalar(1);
    door.name = houseId + "-door";

    pivot.add(door);

    this.doorDataList.push({
      houseId,
      houseInstance: houseInstance,
      obj: houseInstance.instances.door,
      minigameIndex: houseGroup.children.length - 1,
      //pivot: houseInstance.groups.pivot,
      pivot,
      disabled,
    });
    if (this.debugMode) console.groupEnd();
  }

  initTrees() {
    if (this.debugMode) console.groupCollapsed("GAME.initTrees");
    this.currentMap.treeGroup = new THREE.Group();

    const { treeGroup, trees = [] } = this.currentMap;
    treeGroup.name = "treeGroup";
    treeGroup.userData.instances = [];
    this.scene.add(treeGroup);
    this.objectArr.push(treeGroup);
    trees.forEach((treeData) => {
      this.initTree(treeData);
    });
    if (this.debugMode) console.groupEnd();
  }

  charTrees = {
    elf: [],
    dryad: [],
    squirrel: [],
  };
  hasScaledTrees = {};
  initTree({ x, y, z, modelJsonObj,charName }) {
    x *= 16;
    z *= 16;
    if (this.debugMode) console.groupCollapsed("GAME.initTree");
    const _y = y ?? this.getMapHeight({ x, z }, false);
    const treeInstance = new CrappyObjectInstance(modelJsonObj, TREE_TYPES);
    treeInstance.root.scale.multiplyScalar(this.treeScale);
    const { treeGroup } = this.currentMap;
    treeGroup.add(treeInstance.root);

    if (this.charTrees[charName]) {
      this.charTrees[charName].push(treeInstance.root);
    }

    treeGroup.userData.instances.push(treeInstance);

    treeInstance.root.position.set(x, _y, z);
    treeInstance.root.scale.multiplyScalar(0.5);
    const treeId = "tree-" + treeGroup.children.length;
    treeInstance.root.name = treeId;
    if (this.debugMode) console.groupEnd();
  }

  initHit() {
    let hitCanvas = document.createElement("canvas");
    hitCanvas.id = "hitcanvas";
    hitCanvas.width = 1024;
    hitCanvas.height = 1024;
    let hitCtx = hitCanvas.getContext("2d");
    var imgx = document.getElementById("natronHit");
    hitCtx.drawImage(imgx, 0, 0, 1024, 1024);
    document.body.appendChild(hitCanvas);

    // Store these on the class for later access
    this.hitCanvas = hitCanvas;
    this.hitCtx = hitCtx;
    this.imgx = imgx;
  }

  initCharacters() {
    this.currentMap.characterGroup = new THREE.Group();
    this.scene.add(this.currentMap.characterGroup);
    this.objectArr.push(this.currentMap.characterGroup);

    let elf = new CrappyObjectInstance(elf_model);
    let x = -110;
    let z = 70;
    let y = this.getMapHeight({x,z}, false);
    elf.root.position.set(x, y, z);
    elf.root.scale.multiplyScalar(30);
    this.currentMap.characterGroup.add(elf.root);

    let dryad = new CrappyObjectInstance(dryad_model);
    x = -350;
    z = 210;
    y = this.getMapHeight({x,z}, false);
    dryad.root.position.set(x, y, z);
    dryad.root.scale.multiplyScalar(30);
    this.currentMap.characterGroup.add(dryad.root);

    let squirrel = new CrappyObjectInstance(squirrel_model);
    x = 290;
    z = 170;
    y = this.getMapHeight({x,z}, false);
    squirrel.root.position.set(x, y, z);
    squirrel.root.scale.multiplyScalar(30);
    this.currentMap.characterGroup.add(squirrel.root);

    let kid = new CrappyObjectInstance(kid_model);
    x = -120;
    z = 600;
    y = this.getMapHeight({x,z}, false);
    kid.root.position.set(x, y, z);
    kid.root.scale.multiplyScalar(30);
    this.currentMap.characterGroup.add(kid.root);

    let dad = new CrappyObjectInstance(dad_model);
    x = -30;
    z = 600;
    y = this.getMapHeight({x,z}, false);
    dad.root.position.set(x, y, z);
    dad.root.scale.multiplyScalar(30);
    this.currentMap.characterGroup.add(dad.root);
  }

  initLighting() {
    if (this.debugMode) console.groupCollapsed("GAME.initLighting");

    this.globalLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.globalLight.name = "globalLight";
    this.scene.add(this.globalLight);

    this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.shadowLight.position.set(0, 120, 0.1);
    this.shadowLight.castShadow = true;
    this.shadowLight.shadow.radius = 4;
    this.shadowLight.shadow.camera.left = -40;
    this.shadowLight.shadow.camera.right = 40;
    this.shadowLight.shadow.camera.top = 40;
    this.shadowLight.shadow.camera.bottom = -40;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;
    this.shadowLight.shadow.mapSize.width = 128;
    this.shadowLight.shadow.mapSize.height = 128;
    this.shadowLight.name = "shadowLight";
    this.scene.add(this.shadowLight);
    if (this.debugMode) console.groupEnd();
  }

  initOverlays() {
    if (this.debugMode) console.groupCollapsed("GAME.initOverlays");
    this.noiseCanvas = document.createElement("canvas");
    this.noiseCanvas.width = 64;
    this.noiseCanvas.height = 64;
    this.noiseCtx = this.noiseCanvas.getContext("2d");
    if (this.debugMode) console.groupEnd();
  }

  initStx() {
    const stxImg = this.currentMap.displacementMapImg;

    // if no stx image, return 0
    if (!stxImg) {
      console.warn("No height map image found for getMapHeight");
      return 0;
    }

    const stxCanvas = document.createElement("canvas");
    stxCanvas.width = stxImg.width;
    stxCanvas.height = stxImg.height;
    // document.body.appendChild(stxCanvas);
    // stxCanvas.style.position = "fixed";
    // stxCanvas.style.bottom = "0";
    // stxCanvas.style.left = "0";
    // stxCanvas.style.pointerEvents = "none";

    const stxCtx = stxCanvas.getContext("2d");
    stxCtx.drawImage(stxImg, 0, 0);
    this.stx = stxCtx;
  }
  getMapHeight(position, isPlayer = true) {
    if (this.debugMode) console.groupCollapsed("GAME.getMapHeight");
    if (!this.stx) {
      this.initStx();
    }
    if (!isPlayer) {
      position = {
        x: position.x / 16,
        z: position.z / 16,
      };
    }

    let uv = this.getUvPosition(position);
    let samples = [
      this.stx.getImageData(uv.u, uv.v, 1, 1).data[0],
      //stx.getImageData(uv.u + 1, uv.v, 1, 1).data[0],
      //stx.getImageData(uv.u - 1, uv.v, 1, 1).data[0],
      //stx.getImageData(uv.u, uv.v + 1, 1, 1).data[0],
      //stx.getImageData(uv.u, uv.v - 1, 1, 1).data[0],
    ];

    let value = samples.reduce((sum, x) => (sum += x)) / samples.length;

    const ratio = value / 255;
    const displacementScale = this.currentMap.displacementScale; // scale factor for height
    const scale = this.groundplane.scale.y;
    value = displacementScale * ratio * scale;
    if (!this.prevX) {
      this.prevX = position.x;
    }
    this.prevX = position.x;
    if (isPlayer) {
      if (value < this.currentMap.waterLevel) value = this.currentMap.waterLevel - 40;
    }
    if (this.debugMode) console.groupEnd();
    return value;
  }

  getUvPosition(position) {
    return {
      u: 1024 / 2 + position.x * 2,
      v: 1024 / 2 + position.z * 2,
    };
  }

  checkDoors(time) {
    if (this.debugMode) console.groupCollapsed("GAME.checkDoors");
    const { hero, doorDataList, player } = this;
    let entranceDist = 40;
    let entranceTimeSec = 0.7;

    if (this.triggeredDoorway) {
      let doorway = this.triggeredDoorway;
      let opacity = (time - doorway.triggerTime) / (0.5 * entranceTimeSec)
      if (doorway.doorData.pivot) {
        doorway.doorData.pivot.rotation.y = -1.571 * opacity;
      }

      if (time - doorway.triggerTime > entranceTimeSec) {
        // enterthe door's minigame
        let minigameIndex = doorway.doorData.minigameIndex;
        this.startMinigame(minigameIndex, time);

        if (doorway.doorData.pivot) {
          doorway.doorData.pivot.rotation.y = 0;
        }

        this.lastTriggeredDoorway = this.triggeredDoorway;
        this.triggeredDoorway = null;
      }
    } else {
      // No currently triggered doorway, check if we any are close enough to trigger
      for (let i = 0; i < doorDataList.length; i++) {
        let doorData = doorDataList[i];
        if (doorData.disabled) continue;
        let doorPos = new THREE.Vector3();
        doorData.obj.getWorldPosition(doorPos);

        // Prevent entering the same house twice -- TODO remove this later when a button press enters house instead of proximity auto-entrance
        if (
          this.lastTriggeredDoorway &&
          this.lastTriggeredDoorway.doorData.houseId == doorData.houseId
        )
          continue;

        let dist = doorPos.distanceTo(hero.position);
        if (dist > entranceDist) continue;

        this.triggeredDoorway = {
          doorData,
          worldPos: doorPos,
          triggerTime: TIME,
        };
        this.sceneTransitions.push(
          new SceneTransition(entranceTimeSec, "circle", "in"),
        );
      }
    }
    if (this.debugMode) console.groupEnd();
  }

  applyRandomNoiseEffect(ctx) {
    if (this.debugMode) console.groupCollapsed("GAME.applyRandomNoiseEffect");
    if (!ctx) return;
    const w = ctx.canvas.width,
      h = ctx.canvas.height,
      iData = ctx.createImageData(w, h),
      buffer32 = new Uint32Array(iData.data.buffer),
      len = buffer32.length;
    let i = 0;
    for (; i < len; i++) if (Math.random() < 0.5) buffer32[i] = 0xffffffff;
    ctx.putImageData(iData, 0, 0);
    if (this.debugMode) console.groupEnd();
  }

  setMap(mapName) {
    if (this.maps[mapName]) {
      this.clearGroups();

      this.currentMap = this.maps[mapName];
      this.initStx();

      const map =
        this.currentMap.map ?? new THREE.CanvasTexture(this.currentMap.mapImg);
      const displacementMap =
        this.currentMap.displacementMap ??
        new THREE.CanvasTexture(this.currentMap.displacementMapImg);

      this.waterplane.position.y = this.currentMap.waterLevel ?? 0;

      this.updateMinimap(this.currentMap.displacementMapImg);

      this.groundplane.material.map = map;
      this.groundplane.material.displacementMap = displacementMap;
      this.groundplane.material.displacementScale =
        this.currentMap.displacementScale ?? this.displacementScale;
      this.groundplane.material.needsUpdate = true;

      this.initHouses();
      this.initTrees();
      this.initRocket();
    } else {
      console.warn(`Map not found: ${mapName}`);
    }
  }

  clearGroups() {
    const houseUuids = this.currentMap.houseGroup.children.map((n) => n.uuid);
    houseUuids.forEach((uuid) => {
      const obj = this.scene.getObjectByProperty("uuid", uuid);
      if (obj) obj.parent.remove(obj);
    });

    const treeUuids = this.currentMap.treeGroup.children.map((n) => n.uuid);
    treeUuids.forEach((uuid) => {
      const obj = this.scene.getObjectByProperty("uuid", uuid);
      obj.parent.remove(obj);
    });
  }

  setActiveMinigame(minigameInfo) {
    this.activeMinigameInfo = minigameInfo;
  }

  updateMinimap(img) {
    DEBUG_UI.debugCtx.drawImage(img, 0, 0);
  }

  startMinigame(i, time) {
    if (this.debugMode) console.groupCollapsed("GAME.startMinigame");
    if (this.activeMinigameInfo) {
      this.activeMinigameInfo.canvas.remove();
    }
    let abort = () => {
      alert(
        `Minigame for index ${i} not found.\n\n...that means this house is haunted, RUN AWAY!`,
      );
    };
    if (this.minigameDataMap[i] === undefined) {
      return abort();
    }

    let minigameData = this.minigameDataMap[i];
    const handlerClass = minigameData.handlerClass;
    if (!handlerClass) return abort();

    let canvas = document.createElement("canvas");
    canvas.id = "minigame-canvas";
    canvas.width = canvas.height = 64;
    canvas.background = "green";
    canvas.className = "minigame-canvas";
    document.body.append(canvas);

    let onQuit = (checkCompletion = false) => {
      if (this.activeMinigameInfo) this.activeMinigameInfo.canvas.remove();
      this.activeMinigameInfo = null;
      if (i <= 3) this.player.z += 6;
      this.sceneTransitions.push(new SceneTransition(1, "circle", "out"));

      if (checkCompletion) {
        console.log('OK>>>>', i, this.hasScaledTrees);
        if (i == 10 && !this.hasScaledTrees.dryad) {
            console.log("DRYAD");
            this.hasScaledTrees.dryad = true;
            this.charTrees.dryad.forEach(t => t.scale.multiplyScalar(20));
        }
        if (i == 11 && !this.hasScaledTrees.elf) {
            console.log("ELFIE", this.charTrees.elf);
            this.hasScaledTrees.elf = true;
            this.charTrees.elf.forEach(t => t.scale.multiplyScalar(20));
        }
        if (i == 12 && !this.hasScaledTrees.squirrel) {
            this.hasScaledTrees.squirrel = true;
            this.charTrees.squirrel.forEach(t => t.scale.multiplyScalar(20));
        }

        if (Object.keys(this.minigameScores).length < 4) return;
        let dd = this.doorDataList[this.doorDataList.length - 1]
        if (!dd) return;
        dd.disabled = false;
        dd.houseInstance.root.visible = true;
      }
    };

    this.sceneTransitions.push(new SceneTransition(1, "circle", "out"));

    this.activeMinigameInfo = {
      index: i,
      startTime: time,
      canvas,
      handler: new handlerClass(canvas, onQuit, minigameData.arg),
    };
    if (this.debugMode) console.groupEnd();
  }

  updateMinigame(time) {
    let timeElapsed = time - this.activeMinigameInfo.startTime;
    let noiseFadeTime = 1;

    let noiseOpacity;
    if (timeElapsed < noiseFadeTime) {
      this.applyRandomNoiseEffect(this.noiseCtx);
      noiseOpacity = 1 - timeElapsed / noiseFadeTime;
    } else noiseOpacity = 0;
    this.noiseCtx.canvas.style.opacity = noiseOpacity;

    let handler = this.activeMinigameInfo.handler;
    handler.update(timeElapsed, CONTROLS.keyboard);
  }

  // Returns true if there is a collision object at the input coordinate. Could also be named checkHit(). In debug mode, also redraws the debug collision display
  updateHit(posx, posz) {
    // Make hitCanvas fields from the Game class easier to use in this function
    let hitCanvas = this.hitCanvas;
    let hitCtx = this.hitCtx;
    // You can also do: let { hitCanvas, hitCtx } = this; // but this method was not supported in browsers in the past

    let uv = {
      u: posx / 256 / 2 + 0.5,
      v: posz / 256 / 2 + 0.5,
    };

    // Redraw the image background in debug mode, to clear the square drawn on top
    if (this.debugMode) hitCtx.drawImage(this.imgx, 0, 0, 1024, 1024);

    // get colour
    const pixel = hitCtx.getImageData(
      uv.u * hitCanvas.width,
      uv.v * hitCanvas.height,
      1,
      1,
    );

    // show place on map in debug mode
    if (this.debugMode) {
      hitCtx.strokeStyle = "#ffff00";
      hitCtx.lineWidth = 4;
      hitCtx.beginPath();
      hitCtx.rect(
       uv.u * hitCanvas.width,
       uv.v * hitCanvas.height,
       20,
       20,
     );
     hitCtx.stroke();
    }

    let hitPixelValue = pixel.data[0];
    return hitPixelValue > 5; // 5 is chosen because it's safely above 0 on a scale to 255
  }

  updatePlayer(time) {
    const {
      camera,
      hero,
      heroMaterial,
      heroLegIdleTexture,
      heroLegRunTexture,
      heroHead,
      keyboard,
      objectArr,
      player,
    } = this;

    // moving?
    if (
      keyboard?.isDown(keyboard?.DOWN) ||
      keyboard?.isDown(keyboard?.UP) ||
      keyboard?.isDown(keyboard?.LEFT) ||
      keyboard?.isDown(keyboard?.RIGHT) ||
      player.jactive
    ) {
      player.moving = true;
    } else {
      player.moving = false;
    }

    let frameMove = { x: player.x, z: player.z };

    // keys
    if (keyboard?.isDown(keyboard?.LEFT)) {
      frameMove.x -= player.maxSpeed;
    }
    if (keyboard?.isDown(keyboard?.RIGHT)) {
      frameMove.x += player.maxSpeed;
    }
    if (keyboard?.isDown(keyboard?.UP)) {
      frameMove.z -= player.maxSpeed;
    }
    if (keyboard?.isDown(keyboard?.DOWN)) {
      frameMove.z += player.maxSpeed;
    }

    // joystick movement
    if (player.moving) {
      frameMove.z += player.vy;
      frameMove.x += player.vx;
    }

    let wouldHitCollision = this.updateHit(frameMove.x, frameMove.z);
    if (wouldHitCollision) {
      // Collision for full move, try moving in only one axis
      let xCollision = this.updateHit(frameMove.x, player.z);
      let zCollision = this.updateHit(player.x, frameMove.z);
      if (xCollision && zCollision) return;
      if (!xCollision) {
        player.x = frameMove.x;
      }
      if (!zCollision) {
        player.z = frameMove.z;
      }
    } else {
      // No collision, move the player to target
      player.x = frameMove.x;
      player.z = frameMove.z;
    }

    // lerp motion
    player.xlerp += (player.x - player.xlerp) * 0.2;
    player.zlerp += (player.z - player.zlerp) * 0.2;

    // set hero on ground
    hero.position.y = this.getMapHeight(player) + 20;
    camera.position.y = this.camOffsetY + (hero.position.y + 50);
    camera.lookAt(hero.position.clone().add(new THREE.Vector3(0,50,0)));

    // walking camera shake
    if (player.moving && !wouldHitCollision) {
      camera.position.y += Math.cos(time * 20) * 2;
    }

    // legs
    if (player.moving) {
      this.heroLegPlane.material.map = heroLegRunTexture;
      this.heroLegPlane.material.map.offset.x =
        (Math.floor((time * player.fps) % player.count) * player.size) /
        player.width;
    } else {
      this.heroLegPlane.material.map = heroLegIdleTexture;
    }

    // align 3D
    for (let i = 0, len = objectArr.length; i < len; i++) {
      objectArr[i].position.x = -player.xlerp * 16 + 0.15;
      objectArr[i].position.z = -player.zlerp * 16 - 0.8;
    }

    // bounds
    if (player.x > 62 * 4) {
      player.x = 62 * 4;
    }
    if (player.x < -62 * 4) {
      player.x = -62 * 4;
    }
    if (player.z > 62 * 4) {
      player.z = 62 * 4;
    }
    if (player.z < -62 * 4) {
      player.z = -62 * 4;
    }
  }

  update(time) {
    if (this.activeMinigameInfo) {
      this.updateMinigame(time);
    } else {
      this.updatePlayer(time);
      this.checkDoors(time);

      if (typeof DEBUG_UI !== "undefined") {
        DEBUG_UI.update(time);
      }
    }

    this.sceneTransitions.forEach((t) => t.update());
    this.sceneTransitions = this.sceneTransitions.filter((t) => !t.isDone);

    this.renderer.render(this.scene, this.camera);
  }
}
