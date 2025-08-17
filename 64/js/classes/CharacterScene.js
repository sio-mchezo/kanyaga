class CharacterScene {
  constructor(target, onQuit, args) {
    let overlay = document.getElementById('joystick-overlay');

    let charName = args[0];
    let emotion = args[1];

    this.onQuit = () => {
      if (overlay) overlay.style['pointerEvents'] = 'auto'; // restore the joystick overlay's clickability
      onQuit();
      if (args[2]) GAME.startMinigame(args[2], TIME);
    };
    if (overlay) overlay.style['pointerEvents'] = 'none'; // allow clicks past the joystick overlay

    // Example usage
    const canvas = document.createElement('canvas');

    const houseCharsCanvasArr = sliceCanvas(houseCharactersImg, 64, 64);

    const ACTORS = {
      elf: {
        sad: houseCharsCanvasArr[0],
        happy: houseCharsCanvasArr[1],
      },
      squirrel: {
        sad: houseCharsCanvasArr[2],
        happy: houseCharsCanvasArr[3],
      },
      dryad: {
        sad: houseCharsCanvasArr[4],
        happy: houseCharsCanvasArr[5],
      },
    };

    // // build frames
    const frames = [];

    let actorCanvas = ACTORS[charName][emotion];
    let text = {
      elf: {
        sad: "Our trees are sick", happy: "Healing energy!",
      },
      squirrel: {
        sad: "I miss my trees", happy: "That was nuts!",
      },
      dryad: {
        sad: "The forest weeps", happy: "Bountiful growth!",
      }
    }[charName][emotion];
    frames.push({
      canvas: actorCanvas,
      duration: 455,
      text,
      sfx: 'talk4' // key for SFX global object
    });

    this.cfp = new CanvasFramePlayer(target, frames, 12, () => this.onQuit());
    this.cfp.play();
  }

  update(time, keyboard) {
    this.cfp.update(time * 1000);
  }
}
