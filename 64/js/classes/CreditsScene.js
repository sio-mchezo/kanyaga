class CreditsScene {
  constructor(target, onQuit) {
    let overlay = document.getElementById('joystick-overlay');
    this.onQuit = () => {
      if (overlay) overlay.style['pointerEvents'] = 'auto'; // restore the joystick overlay's clickability
      onQuit();
    };
    if (overlay) overlay.style['pointerEvents'] = 'none'; // allow clicks past the joystick overlay

    const workshopChargingStableCanvasArr = sliceCanvas(workshopChargingStableImg, 64, 64);
    const houseCharsCanvasArr = sliceCanvas(houseCharactersImg, 64, 64);
    const driftCanvasArr = sliceCanvas(driftImg, 64, 64);
    const kidRunCanvasArr = sliceCanvas(kidRunImg, 64, 64);
    
    const frames = [];

    frames.push(
      ...[
        houseCharsCanvasArr[0],
        houseCharsCanvasArr[1]
      ].map((n,i) => {
        return {
          canvas: n,
          duration: 150,
          text: "Code/Art/Music by Studio Barefoot",
          sfx: i === 1 ? 'keyboard_clack' : undefined
        };
      })
    );
    frames.push(
      ...workshopChargingStableCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 150,
          text: "Code/Art/Music by Jaman",
          sfx: i === 3 ? 'belly_jiggle' : undefined
        };
      })
    );
    frames.push(
      ...driftCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 250,
          text: "Code/Art by dr okra",
          sfx: (i % 4) === 0 ? 'heartbeat' : undefined
        };
      })
    );
    frames.push(
      ...kidRunCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 250,
          text: "End Music by Bryce with Rice",
          sfx: (i % 4) === 0 ? 'heartbeat' : undefined
        };
      })
    );

    this.cfp = new CanvasFramePlayer(target, frames, 12, () => this.onQuit());
    this.cfp.play();
  }

  update(time, keyboard) {
    this.cfp.update(time * 1000);
  }
}
