const DEBUG_UI = {
  debugMap: document.createElement("canvas"),
  debugDiv: document.createElement("div"),
  houseCountDiv: document.createElement("div"),
};
DEBUG_UI.init = () => {
  DEBUG_UI.debugMap.id = "lvlbump-debug";
  DEBUG_UI.debugDiv.id = "debug";
  document.body.append(DEBUG_UI.debugMap);
  document.body.append(DEBUG_UI.debugDiv);
  DEBUG_UI.debugMap.width = GAME.mapWidth;
  DEBUG_UI.debugMap.height = GAME.mapHeight;
  DEBUG_UI.debugCtx = DEBUG_UI.debugMap.getContext("2d");

  DEBUG_UI.initTopLeftHud();
  DEBUG_UI.buildDebugUi();
  DEBUG_UI.updateDebugUi();

  DEBUG_UI.initMapSelection();

  DEBUG_UI.debugMap.addEventListener("click", (e) => {
    e.preventDefault();
    DEBUG_UI.onClickMini(e);
  });
};
DEBUG_UI.update = (time) => {
  if (typeof DEBUG_UI !== "undefined") {
    DEBUG_UI.updateDebugMap();
    DEBUG_UI.updatePlayerPos();
  }
};
DEBUG_UI.initMapSelection = () => {
  const mapSelectDiv = document.createElement("div");
  mapSelectDiv.style.position = "fixed";
  mapSelectDiv.style.top = "210px";
  mapSelectDiv.style.right = "10px";
  mapSelectDiv.style.zIndex = "1000";
  mapSelectDiv.id = "mapSelectDiv";
  document.body.append(mapSelectDiv);
  DEBUG_UI.mapSelectDiv = mapSelectDiv;
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  fieldset.style.padding = "4px";
  legend.innerText = "Select Map:";
  fieldset.append(legend);

  const btn = document.createElement("button");
  btn.onclick = () => {
    if (GAME.activeMinigameInfo) GAME.activeMinigameInfo.handler?.onQuit();
  };
  btn.innerText = 'Quit Minigame';
  fieldset.append(btn);

  Object.keys(GAME.maps).forEach((mapName) => {
    console.log("mapName:", mapName);
    const btn = document.createElement("button");
    btn.onclick = () => {
      GAME.setMap(mapName);
    };
    btn.innerText = mapName;
    fieldset.append(btn);
  });
  mapSelectDiv.append(fieldset);
};
DEBUG_UI.initTopLeftHud = () => {
  const topLeftHud = document.createElement("div");
  topLeftHud.id = "topleft-hud";
  document.body.append(topLeftHud);
  DEBUG_UI.topLeftHud = topLeftHud;
  topLeftHud.innerHTML = `
        <div>x:<span id="xvar">1</span></div>
        <div>z:<span id="zvar">2</span></div>
        <div><span id="txt"></span></div>
    `;
};
DEBUG_UI.buildDebugUi = () => {
  const { debugDiv, debugMap } = DEBUG_UI;
  debugDiv.innerHTML = "";

  // House count label
  DEBUG_UI.houseCountDiv = document.createElement("div");
  debugDiv.append(DEBUG_UI.houseCountDiv);

  // Export button
  let exportBtn = document.createElement("button");
  exportBtn.innerText = "Export House Positions";
  exportBtn.onclick = () => {
    const bg = document.createElement("div");
    bg.className = "debug-modal";
    document.body.append(bg);

    const textarea = document.createElement("textarea");
    textarea.value = JSON.stringify(
      PLACED_HOUSES.map((house) => house.root.position),
    );
    bg.append(textarea);

    const doneButton = document.createElement("button");
    doneButton.innerText = "done";
    doneButton.onclick = () => bg.remove();
    bg.append(doneButton);
  };
  debugDiv.append(exportBtn);

  // Import button
  let importBtn = document.createElement("button");
  importBtn.innerText = "Import House Positions";
  importBtn.onclick = () => {
    const bg = document.createElement("div");
    bg.className = "debug-modal";
    document.body.append(bg);

    const textarea = document.createElement("textarea");
    bg.append(textarea);

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "cancel";
    cancelButton.onclick = () => bg.remove();
    bg.append(cancelButton);

    const { houseGroup } = GAME.currentMap;

    const doneButton = document.createElement("button");
    doneButton.innerText = "done";
    doneButton.onclick = () => {
      const input = textarea.value;
      if (input === "") {
        houseGroup.children.forEach((house) => {
          house.parent.remove(house);
        });
        houseGroup.userData.instances = [];
        bg.remove();
        return;
      }

      let json;
      try {
        json = JSON.parse(input);
      } catch (e) {
        alert("Invalid input");
        return;
      }

      if (!Array.isArray(json) || !json.length) {
        alert("Invalid input");
        return;
      }

      houseGroup.children.forEach((house) => {
        house.parent.remove(house);
      });
      houseGroup.userData.instances = [];
      GAME.houseGroup.parent.remove(GAME.houseGroup);
      GAME.currentMap.houses = json.map((n) => {
        return {
          x: n.x,
          z: n.z,
          modelJsonObj: MODELS_CONFIG.house,
        };
      });
      bg.remove();
    };
    bg.append(doneButton);
  };
  debugDiv.append(importBtn);
};
DEBUG_UI.onClickMini = () => {
  DEBUG_UI.updateDebugUi();
};
DEBUG_UI.updateDebugUi = () => {
  DEBUG_UI.houseCountDiv.innerText = `Click the map to\nplace a house\n\n# placed houses: ${GAME.currentMap.houseGroup.children.length}`;
};
DEBUG_UI.updatePlayerPos = () => {
  const xvar = document.getElementById("xvar");
  if (!xvar) {
    console.warn("xvar element not found");
    return;
  }
  xvar.innerHTML = Math.floor(GAME.player.x);
  document.getElementById("zvar").innerHTML = Math.floor(GAME.player.z);
  document.getElementById("txt").innerHTML = "y:" + GAME.hero.position.y;
};
DEBUG_UI.updateDebugMap = () => {
  const { debugCtx, debugMap } = DEBUG_UI;
  const olimg = GAME.groundplane.material.displacementMap.image;
  if (!olimg) {
    // console.warn('No ground plane image found for debug map');
    return;
  }
  debugCtx.clearRect(0, 0, debugMap.width, debugMap.height);
  debugCtx.drawImage(olimg, 0, 0, debugMap.width, debugMap.height);

  GAME.currentMap.houseGroup.children.forEach((house) => {
    if (!house.visible) return;
    let uv = {
      u: house.position.x / 4096 / 2 + 0.5,
      v: house.position.z / 4096 / 2 + 0.5,
    };
    debugCtx.fillStyle = "#00ffff";
    const s = 15;
    debugCtx.fillRect(
      uv.u * debugCtx.canvas.width - s / 2,
      uv.v * debugCtx.canvas.height - s / 2,
      s,
      s,
    );
    GAME.hitCtx.fillStyle = "#ffffff";
    GAME.hitCtx.fillRect(
      uv.u * debugCtx.canvas.width - s / 2,
      uv.v * debugCtx.canvas.height - s / 2,
      s,
      s,
    );
    GAME.hitCtx.fillStyle = "#000000";
    let doorS = 4;
    GAME.hitCtx.fillRect(
      doorS + uv.u * debugCtx.canvas.width - s / 2,
      2 * doorS + uv.v * debugCtx.canvas.height - s / 2,
      s - 2 * doorS,
      s - doorS,
    );
  });

  GAME.currentMap.treeGroup.children.forEach((tree) => {
    let uv = {
      u: tree.position.x / 4096 / 2 + 0.5,
      v: tree.position.z / 4096 / 2 + 0.5,
    };
    debugCtx.fillStyle = "#00ff00";
    const s = 5;
    debugCtx.fillRect(
      uv.u * debugCtx.canvas.width - s / 2,
      uv.v * debugCtx.canvas.height - s / 2,
      s,
      s,
    );
    GAME.hitCtx.fillStyle = "#ffffff";
    GAME.hitCtx.fillRect(
      uv.u * debugCtx.canvas.width - s / 2,
      uv.v * debugCtx.canvas.height - s / 2,
      s,
      s,
    );
  });

  GAME.currentMap.characterGroup.children.forEach((tree) => {
    let uv = {
      u: tree.position.x / 4096 / 2 + 0.5,
      v: tree.position.z / 4096 / 2 + 0.5,
    };
    debugCtx.fillStyle = "#00ff00";
    const s = 3;
    debugCtx.fillRect(
      uv.u * debugCtx.canvas.width - s / 2,
      uv.v * debugCtx.canvas.height - s / 2,
      s,
      s,
    );
    GAME.hitCtx.fillStyle = "#ffffff";
    GAME.hitCtx.fillRect(
      uv.u * debugCtx.canvas.width - s / 2,
      uv.v * debugCtx.canvas.height - s / 2,
      s,
      s,
    );
  });

  // draw player position on map
  let uv = GAME.getUvPosition(GAME.player);

  debugCtx.fillStyle = "rgba(255, 0, 0, 1)";
  debugCtx.fillRect(uv.u - 12, uv.v - 12, 24, 24);
};
