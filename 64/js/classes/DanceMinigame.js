//DanceMinigame.pj

class DanceMinigame {
  // TODO gracefully use input from parent, not window events
  // TODO get total song time, as metadata if necessary
  // TODO pre-space out all the note times, don't spawn per time elapsed, spawn per time progression through total duration
  score = 0;
  zapYPixel = 1;
  constructor(canvas, onQuit, songName) {
    let overlay = document.getElementById('joystick-overlay');
    this.onQuit = () => {
      if (overlay) overlay.style['pointerEvents'] = 'auto'; // restore the joystick overlay's clickability
      onQuit();
    };
    if (overlay) overlay.style['pointerEvents'] = 'none'; // allow clicks past the joystick overlay
    this.canvas = canvas;
    this.registerInputHandlers();
    this.canvas.width = 64;
    this.canvas.height = 64;
    this.mcImg = document.getElementById('dancingMc')
    this.ctx = this.canvas.getContext('2d');
    this.playMusic = () => {
      zzfxX = new AudioContext;
      // Create a song
      let songData = songs[songName];
      if (!songData) songData = Object.values(songs)[0];
      let mySongData = zzfxM(...songData);

      // Play the song (returns a AudioBufferSourceNode)
      let myAudioNode = zzfxP(...mySongData);
    };
    this.scoreDrawer = new ScoreDrawer(this);
    this.danceClubScene = new DanceClubScene(this.canvas);
    this.playMusic();
    if (songName == 'seaShanty') this.BEAT_COUNT = 22;
    window.setTimeout(() => this.done(), songName == 'seaShanty' ? 25000 : 23000);
  }
  done() {
    this.dead = true;
    this.onQuit();
  }
  drawScore() {
    this.scoreDrawer.update(this.ctx, 10 * this.score);
  }
  drawPlayer(ctx) {
    let t = 2 * 1.2 * this.time % 1;
    t *= 6;
    let spriteIndex = Math.floor(t);
    if (spriteIndex > 3) spriteIndex = 6 - spriteIndex;

    let px = 4//36;
    let py = 33;

    ctx.drawImage(this.mcImg, 20 * spriteIndex, 0, 20, 32, px, py, 20, 32);
  }
  activePresses = [];
  handlePress(dir) {
    this.activePresses.push({ startTime: this.time, dir });
    this.danceClubScene.lightOn[dir] = { startTime: this.time };
    let matchingArrow = this.beatArrows.find(beatArrow => {
      return beatArrow.dir == dir && beatArrow.yPos >= 0 && beatArrow.yPos <= 3;
    });
    if (!matchingArrow) {
      this.score -= 1;
      this.danceClubScene.multiplier = 3;
      this.score = Math.max(0, this.score);
      this.scoreDrawer.addScore(0);
      return;
    }
    let points = 3 - (matchingArrow.yPos - 1);
    if (matchingArrow.yPos == 0) points = 3; // I ain't refiguring out all that math, this should work

    this.scoreDrawer.addScore(points);
    this.score += points;
    this.danceClubScene.multiplier = Math.min(10, this.danceClubScene.multiplier + 1);
    this.beatArrows = this.beatArrows.filter(ba => !(ba.dir == dir && ba.yPos <= 3));
  }
  drawArrow(x, y, rows) {
    let ctx = this.ctx;
    for (let i = 0; i < rows[0].length; i++) {
      for (let j = 0; j < rows.length; j++) {
        if (rows[j][i]) ctx.fillRect(x + i, y + j, 1, 1);
      }
    }
  }
  drawActivePresses() {
    let pressLife = 10 / 60;
    this.activePresses = this.activePresses.filter(press => this.time - press.startTime < pressLife);
    this.activePresses.forEach(press => {
      let capDir = press.dir[0].toUpperCase() + press.dir.substring(1);
      this.ctx.globalAlpha = 1 - ((this.time - press.startTime) / pressLife);
      this[`draw${capDir}ArrowHighlight`](0);
    });
    this.ctx.globalAlpha = 1;
  }
  drawLeftArrow(y) {
    let x = 1;
    this.ctx.fillStyle = '#0f4';
    let rows = [
      [0, 0, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
    ];
    this.drawArrow(x, y, rows);
  }
  drawLeftArrowHighlight(y) {
    let x = 0;
    this.ctx.fillStyle = 'white';
    let rows = [
      [0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 2, 1, 2, 0, 0, 0],
      [0, 2, 1, 1, 2, 2, 2, 0],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [0, 2, 1, 1, 2, 2, 2, 0],
      [0, 0, 2, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0]
    ];
    rows = rows.map(row => row.map(v => Math.max(0, v - 1)));
    this.drawArrow(x, y, rows);
  }
  drawUpArrow(y) {
    let x = 8;
    this.ctx.fillStyle = 'red';
    let rows = [
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
    ];
    this.drawArrow(x, y, rows);
  }
  drawUpArrowHighlight(y) {
    let x = 7;
    this.ctx.fillStyle = 'white';
    let rows = [
      [0, 0, 0, 2, 2, 0, 0, 0],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 2, 1, 1, 1, 1, 2, 0],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 0, 0, 2, 2, 0, 0, 0],
    ];
    rows = rows.map(row => row.map(v => Math.max(0, v - 1)));
    this.drawArrow(x, y, rows);
  }
  drawDownArrow(y) {
    let x = 15;
    this.ctx.fillStyle = '#08f';
    let rows = [
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
    ].reverse();
    this.drawArrow(x, y, rows);
  }
  drawDownArrowHighlight(y) {
    let x = 14;
    this.ctx.fillStyle = 'white';
    let rows = [
      [0, 0, 0, 2, 2, 0, 0, 0],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 2, 1, 1, 1, 1, 2, 0],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 0, 2, 1, 1, 2, 0, 0],
      [0, 0, 0, 2, 2, 0, 0, 0],
    ].reverse();
    rows = rows.map(row => row.map(v => Math.max(0, v - 1)));
    this.drawArrow(x, y, rows);
  }
  drawRightArrow(y) {
    let x = 22;
    this.ctx.fillStyle = 'yellow';
    let rows = [
      [0, 0, 1, 0, 0, 0].reverse(),
      [0, 1, 1, 0, 0, 0].reverse(),
      [1, 1, 1, 1, 1, 1].reverse(),
      [1, 1, 1, 1, 1, 1].reverse(),
      [0, 1, 1, 0, 0, 0].reverse(),
      [0, 0, 1, 0, 0, 0].reverse(),
    ];
    this.drawArrow(x, y, rows);
  }
  drawRightArrowHighlight(y) {
    let x = 21;
    this.ctx.fillStyle = 'white';
    let rows = [
      [0, 0, 0, 2, 0, 0, 0, 0].reverse(),
      [0, 0, 2, 1, 2, 0, 0, 0].reverse(),
      [0, 2, 1, 1, 2, 2, 2, 0].reverse(),
      [2, 1, 1, 1, 1, 1, 1, 2].reverse(),
      [2, 1, 1, 1, 1, 1, 1, 2].reverse(),
      [0, 2, 1, 1, 2, 2, 2, 0].reverse(),
      [0, 0, 2, 1, 2, 0, 0, 0].reverse(),
      [0, 0, 0, 2, 0, 0, 0, 0].reverse(),
    ];
    rows = rows.map(row => row.map(v => Math.max(0, v - 1)));
    this.drawArrow(x, y, rows);
  }
  held = {};
  registerInputHandlers() {
    window.addEventListener('keydown', (e) => {
      this.held[e.key] = true;
      if (e.repeat) return;
      let dir = {
        'arrowup': 'up',
        'arrowdown': 'down',
        'arrowleft': 'left',
        'arrowright': 'right',
        'w': 'up',
        'a': 'left',
        's': 'down',
        'd': 'right',
        '1': 'left',
        '2': 'up',
        '3': 'down',
        '4': 'right',
      }[e.key.toLowerCase()];
      if (dir && !this.dead) this.handlePress(dir);
    });
    window.addEventListener('keyup', (e) => this.held[e.key] = false);
    this.canvas.onpointerdown = (e) => {
      let rect = this.canvas.getBoundingClientRect();
      let x = (e.clientX - rect.left) / rect.width;
      let y = (e.clientY - rect.top) / rect.height;
      let isVert = Math.abs(y - 0.5) > Math.abs(x - 0.5);
      if (isVert) {
        if (y < 0.5) this.handlePress('up');
        else this.handlePress('down');
      } else {
        if (x < 0.5) this.handlePress('left');
        else this.handlePress('right');
      }
    }
  }
  lastTime = 0;
  update(time, keyboard) {
    this.time = time;
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


    // Create a linear gradient
    // The start gradient point is at x=20, y=0
    // The end gradient point is at x=220, y=0
    const gradient = this.ctx.createLinearGradient(0, 300, 0, 0);

    // Add three color stops
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(1, "#222");

    // Set the fill style and draw a rectangle
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0,0,30,64);


    this.ctx.globalAlpha = 0.33;
    this.drawLeftArrow(1);
    this.drawUpArrow(1);
    this.drawDownArrow(1);
    this.drawRightArrow(1);
    this.ctx.globalAlpha = 1;
    this.drawActivePresses();
    let dt = this.time - this.lastTime;
    this.lastTime = this.time;
    this.drawPlayer(this.ctx);
    this.updateArrowTracks(this.time);
    this.danceClubScene.update(dt);
    this.drawScore();
  }
  lastArrowSpawn = [];
  lastSpawn = 0;
  BEAT_COUNT = 19;
  beatArrows = [];
  totalSpawnedBeatArrows = 0;
  updateArrowTracks() {
    let bpm = 144;
    let arrowSpawnGap = 2 * 60 / 144;
    let time = this.time;
    this.beatArrows.forEach(beatArrow => this.updateBeatArrow(time, beatArrow));
    this.beatArrows = this.beatArrows.filter(ba => {
      let missed = ba.yPos < -6;
      if (missed) {
        //$score -= 1;
        //$score = Math.max($score, 0);
        this.danceClubScene.multiplier -= 2;
        this.danceClubScene.multiplier = Math.max(3, this.danceClubScene.multiplier);
      }
      return !missed;
    });
    if (time - this.lastSpawn < arrowSpawnGap) return;
    if (this.totalSpawnedBeatArrows >= this.BEAT_COUNT) return;
    this.lastSpawn = time;
    this.totalSpawnedBeatArrows++;
    this.beatArrows.push({
      yPos: 63,
      dir: ['left', 'right', 'up', 'down'][Math.floor(4 * Math.random())],
      lastMoveTime: time,
    });
  }
  updateBeatArrow(time, beatArrow) {
    let moveUpInterval = 1 / 10;
    if (time - beatArrow.lastMoveTime > moveUpInterval) {
      beatArrow.lastMoveTime = time;
      beatArrow.yPos -= 1;
    }
    let x;
    let y = beatArrow.yPos;
    let drawFunc = {
      'left': 'drawLeftArrow',
      'right': 'drawRightArrow',
      'up': 'drawUpArrow',
      'down': 'drawDownArrow',
    }[beatArrow.dir];
    this[drawFunc](y);
  }
}

let bootsNCats = [[[.1,0,4400,,,.05,,,,,,,,1,1,.15],[2,0,110,,,,1],[,0,440,,,,,30,,,,,,10],[,0,4400,,,.05,,30,,,,,,10],[.5,0,221,.1,.1,,2,0,,,,,,,,,.5,,.1],[,0,440,.05,,.2,1,,-.01],[,0,880,.05,,.2,1,,-.01],[,0,440,.05,,1,1],[.2,0,880,.05,,1,1,,-.01,5]],[[[,.5,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,],[1,-.4,3,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,],[2,.5,,,,,1,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,],[3,-.3,,,3,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,3,,,,3,,,,5,,,,6,,,,8,,,,6,,,,5,,,,3,,],[4,-.1,1,,,,,,,,6,,,,,,5,,,,,,,,,,,,,,,,,,1,,,,,,,,8,,,,,,5,,,,,,,,,,6,,,,5,,,,]],[[,.5,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,],[1,-.4,3,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,],[2,.5,,,,,1,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,],[3,-.3,,,3,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,3,,,,3,,,,5,,,,6,,,,8,,,,6,,,,5,,,,3,,],[4,-.1,1,,,,,,,,6,,,,,,5,,,,,,,,,,,,,,,,,,1,,,,,,,,8,,,,,,5,,,,,,,,,,,,,,,,,,]],[[,.5,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,],[1,-.4,3,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,],[2,.5,,,,,1,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,],[3,-.3,,,3,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,3,,,,3,,,,5,,,,6,,,,8,,,,6,,,,5,,,,3,,],[4,-.1,1,,,,,,,,6,,,,,,5,,,,,,,,,,,,,,,,,,1,,,,,,,,8,,,,,,5,,,,,,,,,,,,,,,,,,],[5,,1,1,,1,1,,5,5,,5,5,,6,6,,6,6,,5,5,,5,5,,,,1,,3,,5,,1,1,,1,1,,5,5,,5,5,,8,8,,8,8,,5,5,,5,5,,,,1,,5,,3,,]],[[,.5,1,,1,,,1,,,1,,1,,,1,,,1,,]],[[7,,1,,,,,,,,,,,,,,,,,,,,,],[7,,8,,,,,,,,,,,,,,,,,,,,,],[8,,17,,,,,,,,,,,,,,,,,,,,,]],[[,.5,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,1,,1,,,1,,,],[1,-.4,3,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,],[2,.5,,,,,1,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,,,,,5,,,,,,,,1,,,,],[3,-.3,,,3,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,1,,,,3,,,,3,,,,5,,,,6,,,,8,,,,6,,,,5,,,,3,,],[4,-.1,1,,,,,,,,6,,,,,,5,,,,,,,,,,,,,,,,,,1,,,,,,,,8,,,,,,5,,,,,,,,,,,,,,,,,,],[6,,1,1,,1,1,,5,5,,5,5,,6,6,,6,6,,5,5,,5,5,,,,1,,3,,5,,1,1,,1,1,,5,5,,5,5,,8,8,,8,8,,5,5,,5,5,,,,1,,5,,3,,]]],[3,0,2,5,4],144,{"title":"boots n cats","instruments":["Instrument 0","Instrument 1","Instrument 2","Instrument 3","Instrument 4","Instrument 5","Instrument 6","Instrument 7","Instrument 8"],"patterns":["Pattern 0","Pattern 1","Pattern 2","Pattern 3","Pattern 4","Pattern 5"]}]
let lofiVibin = [[[.5,0,440,.05,.4,.9],[.5,0,880,,,.05,,9,,,,,,50],[2,0,110,,.05,,,10,-.5,,,,,1,2.1,-.1,,,,1],[1.5,0,880,,.05,.25,,10,-.5,,5,,.01,6.5,,,,.9,,1],[.25,0,880,,1.5,.3,,.5,-.005,,1,,.5,,1,,1],[3,0,221,.02,.01,.31,,,,,,,,,,.1],[.7,0,3520,,,.05,,,,,,,,20]],[[[,,1,,,,,,,,5,,,,,,,,8,,,,,,,,3,,,,,,,,6,,,,,,,,10,,,,,,,,5,,,,,,,,8,,,,,,,,12,,,,,,,,6,,,,,,,,10,,,,,,,,13,,,,,,,,],[,.6,8,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,17,,,,,,,,,,,,,,,,],[1,-.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,1,,,1,,,,,1,,,1,,,,,1,,,1,,,,],[2,-.3,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,],[3,.3,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,],[6,.6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,]],[[,,1,,,,,,,,5,,,,,,,,8,,,,,,,,3,,,,,,,,6,,,,,,,,10,,,,,,,,5,,,,,,,,8,,,,,,,,12,,,,,,,,6,,,,,,,,10,,,,,,,,13,,,,,,,,],[,.6,8,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,17,,,,,,,,,,,,,,,,],[1,-.5,,,,,5,,,,,5,,,5,,,,,5,,,5,,,,,3,,,3,,,,,,,,1,,,,,1,,,1,,,,,1,,,1,,,,,1,,,1,,,,,,,,1,,,,,1,,,1,,,,,1,,,1,,,,,1,,,1,,,,],[2,-.3,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,],[3,.3,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,1,,,,,,,,],[5,,,,,,,,,,,,,,,,3,,1,,1,,,,,,,,,,,,5,,6,,6,,,,,,,,,,,,6,,5,,5,,,,,,,,,,,,5,,3,,3,,,,,,,,,,,,1,,5,,5,,,,,,,,,,,,,,],[4,.3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,20,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,29,,,,,,,,,,,,,,,,,,,,,,,,],[6,.6,,,,,13,,13,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,]],[[2,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,],[3,,,,,,,,,,13,,,,,,,,,,,,,,,,13,,,,,,,,,],[,,1,,,,5,,,,8,,,,12,,,,13,,,,17,,,,13,,,,,,,,,],[4,,,,,,,,,,32,,,,,,,,,,,,,,,,,,,,,,,,,],[5,,1,,,,5,,,,8,,,,12,,,,13,,,,17,,,,13,,,,,,,,,],[6,,,,,,13,,13,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,]]],[0,1,2],144,{"title":"LoFi","instruments":["Chords","Chik","Kic    k","Snare","Bass","Bass Guitar","Hat"],"patterns":["Pattern 0","Pattern 1","Pattern 2"]}]
let dryadsRage = [[[1.25,0,440,,,.3,1,.5],[.4,0,880,,,,,,,,,,,20],[.35,0,221,2,1,1,,1.4],[1.5,0,221,,.2,.2,1]],[[[,.4,3,,8,,,,8,,3,,8,,,,,,3,,8,,,,8,,3,,8,,,,,,5,,10,,,,10,,5,,10,,,,,,5,,10,,,,10,,5,,10,,,,,,],[1,-.3,,,3,3,3,,3,3,3,,3,3,3,,,,,,3,3,3,,3,3,3,,3,3,3,,,,,,5,5,5,,5,5,5,,5,5,5,,,,,,5,5,5,,5,5,5,,5,5,5,,,,],[2,-.7,15,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,17,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[2,.6,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[3,,5,,,,,,,,1,,,,,,8,,10,,,,,,,,8,,,,,,,,5,,,,,,,,1,,,,,,8,,10,,,,,,,,8,,,,,,,,]],[[,-.4,3,,8,,15,,8,,3,,8,,15,,,,3,,8,,15,,8,,3,,8,,15,,,,5,,10,,17,,10,,5,,10,,17,,,,5,,10,,17,,10,,5,,10,,17,,,,],[1,.4,,,3,3,3,,3,3,3,,3,3,3,,,,,,3,3,3,,3,3,3,,3,3,3,,,,,,5,5,5,,5,5,5,,5,5,5,,,,,,5,5,5,,5,5,5,,5,5,5,,,,],[2,-.7,15,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,17,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[2,.6,20,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[3,,17,,,,,,,,13,,,,,,20,,22,,,,,,,,20,,,,,,,,17,,,,,,,,13,,,,,,20,,22,,,,,,,,32,,,,,,,,]],[[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[1,-.3,,,3,3,3,,3,3,3,,3,3,3,,,,,,3,3,3,,3,3,3,,3,3,3,,,,,,5,5,5,,5,5,5,,5,5,5,,,,,,5,5,5,,5,5,5,,5,5,5,,,,],[2,-.7,15,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,17,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[2,.6,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,]],[[1,.2,,,3,3,3,,5,5,5,,6,6,6,,,,,,,,13,,,,15,,,,17,,,,,,,,,,,,,,],[,-.3,13,,13,,,,10,,13,,,,10,,,,,,,,8,,,,12,,,,13,,,,,,,,,,,,,,],[2,.4,25,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[3,,5,,,,,,,,1,,,,,,10,,8,,,,,,,,1,,,,,,,,,,,,,,,,,,]]],[2,0,1,3],144,{"title":"DryadsRage","instruments":["Lead","Hat","Pad","Bass"],"patterns":["Pattern 0","Pattern 1","Pattern 2","Pattern 3"]}]
const p1m = [0,,1,,5,,,,5,,10,,10,,,,5,,,8,,,10,,5,,6,,10,,,,];
const p1c = [2,,,,,,,,5,,10,,10,,,,,,,,,,10,13,13,,8,,8,,,,];
const p1end = [0,,1,,5,,,,5,,10,,10,,,,5,,,8,,,10,,13,,13,,13,,,,];

const p2m = [0,,6,,10,,,13,10,,13,,10,,6,,10,,,13,,,10,,13,,8,,6,,,,];
const p2b = [1,,6,,10,,,13,10,,13,,10,,6,,10,,,13,,,10,,13,,10,,6,,,,];

const p3m = [0,,8,,12,,,3,12,,8,,12,,8,,3,,,12,,,3,,12,,1,,8,,,,];
const p3b = [1,,8,,12,,,3,12,,8,,12,,8,,3,,,12,,,3,,12,,3,,8,,,,];
const p3c = [2,,,,12,,,3,12,8,,,12,,8,,3,,,12,,,3,,12,,3,,8,,,,];

const p4m = [0,,1,,5,,,8,5,,10,,5,,1,,5,,,8,,,10,,13,,10,,8,,,,];
const p4b = [1,,1,,5,,,8,5,,10,,5,,1,,5,,,8,,,10,,13,,10,,8,,,,];

const bassPat = [2,-.3,1,,,,,,,,1,,,,,,,,1,,,,,,,,1,,,,,,,,];
const tickPat = [3,-.3,,,,13,,,,13,,,,13,,,,,,,,13,,,,13,,,,13,,,,,,];

const seaShanty = [
    [
        [.5, 0, 440, .05, .4, .9],
        [.5, 0, 880, , , .05, , 9, , , , , , 50],
        [2, 0, 110, , .05, , , 10, -.5, , , , , 1, 2.1, -.1, , , , 1],
        [.7, 0, 3520, , , .05, , , , , , , , 20]
    ],
    [
        [p1m,bassPat],
        [p2m,p2b,bassPat,tickPat],
        [p3m,p3b,bassPat,tickPat],
        [p4m,p4b,bassPat,tickPat],
        [p2m,p2b,p1c,bassPat,tickPat],
        [p3m,p3b,p3c,bassPat,tickPat],
        [p4m,p4b,p1c,bassPat,tickPat],
        [p1end,bassPat],
    ],
    [0,1,2,3,4,5,6,7],
    144,
    {
        "title": "LoFi",
        "instruments": ["Chords", "Chik", "Kick", "Hat"],
        "patterns": ["Intro", "P1", "P2", "P3", "P4", "P5", "P6", "Outro"]
    }
];
let songs = {
  bootsNCats,
  lofiVibin,
  dryadsRage,
  seaShanty,
}

function floatLerp(v1, v2, t) {
  t = Math.min(1, Math.max(0, t));
  return (v1 == v2) ? v1 : ((1 - t) * v1) + (t * v2);
}

//DanceClubScene.pj

class DanceClubScene {
  constructor(outCanvas) {
    this.outCanvas = outCanvas;
    let canvas = document.createElement('canvas');
    let W = 34;
    let H = 32;
    canvas.width = W;
    canvas.height = H;
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.cam = new SimpleCamera(this, this.canvas.width, this.canvas.height);
    this.cam.camera.position.set(0, 2, 5);
    this.spheres = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        let colors = [
          '#eed0b8',
          '#76441f',
          '#cb9662',
          '#301e10',
        ];
        //let s = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
        let s = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial({ color: colors[Math.floor(colors.length * Math.random())] }));
        s.position.set(0.25 * Math.random() + 2 * (x - 5), 0, 0.25 * Math.random() + 2 * (y - 5));
        s.scale.multiplyScalar(0.7);
        s.castShadow = true;
        this.scene.add(s);
        this.spheres.push(s);
      }
    }
    //new BasicLights($scene);
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      //antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setClearColor(0x222222, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.wireframeFloor = new WireframeFloor(this.scene);
    this.canvas.className = 'dance-club-canvas'
    this.cam.onResize(this.canvas.width, this.canvas.height);
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.lights = [];
    const skyColor = 0xffffff;
    const groundColor = 0x222222;
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    light.position.set(10, 40, 10);
    light.lookAt(new THREE.Vector3());
    this.scene.add(light);
    const rl = new THREE.DirectionalLight(0xffff00, 2);
    rl.position.set(40, 40, -40);
    const ll = new THREE.DirectionalLight(0xff0000, 2);
    ll.position.set(-40, 40, 40);
    const ul = new THREE.DirectionalLight(0x00ff00);
    ul.position.set(40, 40, 40);
    const dl = new THREE.DirectionalLight(0x0044ff);
    dl.position.set(-40, 40, -40);
    this.lights = {
      right: rl,
      left: ll,
      up: ul,
      down: dl,
    };
    Object.values(this.lights).forEach(l => {
      l.castShadow = true;
      l.lookAt(new THREE.Vector3());
      this.scene.add(l);
    });
    this.lightOn = {};
  }
  multiplier = 3;
  time = 0;
  update(dt) {
    //$cam.orbiter.right(0.005 * Math.sin($time));
    this.cam.orbiter.right(this.multiplier * 0.1 * dt);
    this.cam.update(dt);
    this.time += dt;
    let multiplier = this.multiplier;
    let t = this.time * multiplier;
    this.spheres.forEach(s => {
      s.position.y = multiplier * 0.05 * (
        Math.sin(t + s.position.x) + Math.cos(t + s.position.z)
      );
    });
    // Update lights
    let lightLifetime = 0.5;
    Object.keys(this.lights).forEach(dir => {
      if (this.lightOn[dir]) {
        let l = this.lightOn[dir];
        if (this.time - l.startTime > lightLifetime) delete this.lightOn[dir];
        this.lights[dir].intensity = 1;
      } else {
        this.lights[dir].intensity = 0;
      }
    });
    this.renderer.render(this.scene, this.cam.camera);
    let y = 32;//16;
    let ctx = this.outCanvas.getContext('2d');
    ctx.drawImage(
      this.canvas,
      0, 0, this.canvas.width, this.canvas.height,
      30, y, 34, 32
    );
    ctx.fillStyle = '#000'
    ctx.fillRect(29, 0, 1, 64)
  }
}




//SimpleCamera.pj

class SimpleCamera {
  lastAngle = 0;
  rotationAngle = 0;
  constructor(app, width, height) {
    this.app = app;
    this.width = width;
    this.height = height;
    this.group = new THREE.Group();
    this.camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
    this.camera.near = 0.01;
    this.camera.far = 20000;
    this.group.add(this.camera);
    this.app.scene.add(this.group);
    this.orbiter = new SimpleCameraOrbiter(this);
  }
  onResize(width, height) {
    this.width = width;
    this.height = height;
    if (this.type == 'ortho') {
      this.updateOrthoProjection();
    } else {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
  updateOrthoProjection() {
    const ratio = this.width / this.height;
    const dist = 0.575 * this.distToTarget();
    this.camera.left = -ratio * dist;
    this.camera.right = ratio * dist;
    this.camera.top = dist;
    this.camera.bottom = -dist;
    this.camera.updateProjectionMatrix();
  }
  getTargetPosition() {
    return new THREE.Vector3();
  }
  distToTarget() {
    return this.camera.position.clone().sub(this.getTargetPosition()).length();
  }
  update(dt) {
    if (this.type == 'ortho') this.updateOrthoProjection();
    this.orbiter.update(dt);
  }
  type = 'perspective'
  toggleType() {
    const newCam = (this.type == 'ortho') ? new THREE.PerspectiveCamera(60, 1, 1, 1000) : new THREE.OrthographicCamera();
    newCam.far = 20000;
    newCam.position.copy(this.camera.position);
    newCam.lookAt(this.getTargetPosition());
    this.camera.parent.remove(this.camera);
    this.camera = newCam;
    this.type = (this.type == 'perspective') ? 'ortho' : 'perspective';
    this.group.add(this.camera);
  }
  snap(which) {
    const dist = this.distToTarget();
    const set = (x, y, z) => {
      this.camera.position.x = x; this.camera.position.y = y; this.camera.position.z = z;
    };
    switch (which[0]) {
      case 'f': return set(0, 0, dist);
      case 'b': return set(0, 0, -dist);
      case 'l': return set(-dist, 0, 0);
      case 'r': return set(dist, 0, 0);
      case 'u': return set(0, dist, 0);
      case 'd': return set(0, -dist, 0);
    }
    this.camera.lookAt(this.getTargetPosition());
  }
}


//SimpleCameraOrbiter.pj

class SimpleCameraOrbiter {
  minZoomDistance = 5;
  maxZoomDistance = 100;
  constructor(harness) {
    this.harness = harness;
    this.sphericalDelta = new THREE.Spherical();
  }
  up(angle) {
    this.sphericalDelta.phi -= angle;
  }
  right(angle) {
    this.sphericalDelta.theta += angle;
  }
  zoom(delta) {
    this.sphericalDelta.radius += 5 * delta;
  }
  dist = 0;
  clampDistance(dist) {
    this.dist = Math.max(this.minZoomDistance, Math.min(this.maxZoomDistance, dist));
    return this.dist;
  }
  update(dt) {
    this.camera = this.harness.camera;
    // adapted from chatgpt, comments are mine
    // get the camera's position as spherical coordinates
    let position = this.camera.position.clone()
    let spherical = new THREE.Spherical().setFromVector3(position);
    // apply the movement info from sphericalDelta to a target spherical coordinate
    let targetSpherical = spherical.clone();
    targetSpherical.radius += this.sphericalDelta.radius;
    targetSpherical.radius = this.clampDistance(targetSpherical.radius);
    targetSpherical.phi += this.sphericalDelta.phi;
    targetSpherical.theta += this.sphericalDelta.theta;
    // Phi clamping, pre-lerp, prevents orbiting around in vertical direction
    const minPhi = 0.1;
    const maxPhi = Math.PI - 0.1;
    targetSpherical.makeSafe();
    targetSpherical.phi = Math.max(minPhi, Math.min(maxPhi, targetSpherical.phi));
    // Perform a spherical lerp
    let amt = 7;
    spherical.radius = floatLerp(spherical.radius, targetSpherical.radius, dt * amt);
    spherical.phi = floatLerp(spherical.phi, targetSpherical.phi, dt * amt);
    spherical.theta = floatLerp(spherical.theta, targetSpherical.theta, dt * amt);
    // Phi clamping, post-lerp
    spherical.makeSafe();
    spherical.phi = Math.max(minPhi, Math.min(maxPhi, spherical.phi));
    // Apply the lerped spherical coordinates
    position.setFromSpherical(spherical);
    this.camera.position.copy(position);
    this.camera.lookAt(this.harness.getTargetPosition());
    // Decrement the sphericalDelta data by the amount we moved via the lerp step
    this.sphericalDelta.set(targetSpherical.radius - spherical.radius, targetSpherical.phi - spherical.phi, targetSpherical.theta - spherical.theta);
  }
}


//WireframeFloor.pj

class WireframeFloor {
  constructor(scene) {
    this.scene = scene;
    let scale = 20;
    if (scale % 2) scale++;
    let g = new THREE.PlaneGeometry(scale, scale);
    let canvas = document.createElement('canvas');
    let canvasScale = 512;
    let thickness = 0.1;
    canvas.width = canvasScale;
    canvas.height = canvasScale;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222';
    ctx.fillStyle = '#222';
    //ctx.fillStyle = '#0ff';
    ctx.fillRect(0, 0, thickness * canvasScale, canvas.height);
    ctx.fillRect(0, 0, canvas.width, thickness * canvasScale);
    let tex = new THREE.Texture(canvas);
    //tex.minFilter = THREE.LinearFilter;
    //tex.maxFilter = THREE.NearestFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(scale, scale);
    tex.needsUpdate = true;
    let mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, transparent: true, alpha: true });
    mat.side = THREE.DoubleSide;
    this.mesh = new THREE.Mesh(g, mat);
    this.mesh.position.y = -.5;
    this.mesh.receiveShadow = true;
    //$mesh.scale.multiplyScalar(scale);
    this.mesh.rotation.x = -0.5 * Math.PI;
    //$mesh.scale.multiplyScalar(2);
    this.scene.add(this.mesh);
  }
}

class ScoreDrawer {
  timingScores = [];
  constructor(danceMinigame) {
    this.danceMinigame = danceMinigame;
    this.img = document.getElementById('danceScores');
    this.gbfont = document.getElementById('gbfont');
  }

  getSourceCoords(num) {
    let y = 0, h = 6;
    if (num == 0) return { x: 0, y, w: 6, h };
    if (num == 1) return { x: 7, y, w: 4, h };
    if (num == 2) return { x: 12, y, w: 5, h };
    if (num == 3) return { x: 18, y, w: 5, h };
    if (num == 4) return { x: 24, y, w: 6, h };
    if (num == 5) return { x: 31, y, w: 5, h };
    if (num == 6) return { x: 37, y, w: 6, h };
    if (num == 7) return { x: 44, y, w: 6, h };
    if (num == 8) return { x: 51, y, w: 6, h };
    if (num == 9) return { x: 58, y, w: 6, h };
  }

  drawTotalScore(ctx, totalScore) {
    let digits = totalScore.split('');
    let xOffset = 31;
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      let coords = this.getSourceCoords(digit);
      if (!coords) continue;
      ctx.drawImage(this.gbfont,
        coords.x, coords.y, coords.w, coords.h,
        xOffset, 2, coords.w, coords.h);
      xOffset += coords.w + 1;
    }
  }

  lastScoreTime = 0;
  addScore(type) {
    if (this.danceMinigame.time - this.lastScoreTime < 0.5) return;
    this.lastScoreTime = this.danceMinigame.time;
    this.timingScores.push({ type: type, yOffset: 0 });
  }

  update(ctx, totalScore) {
    this.drawTotalScore(ctx, `${totalScore}`);

    if (!this.timingScores.length) return;


    this.timingScores.forEach(score => {
      ctx.globalAlpha = Ease.inOutCubic((28 - score.yOffset) / 28);
      this.drawScore(ctx, score)
      score.yOffset += 0.2;
    });
    ctx.globalAlpha = 1;
    this.timingScores = this.timingScores.filter(s => s.yOffset < 28);
  }

  drawScore(ctx, score) {
    ctx.fillStyle = '#eee';

    if (score.type == 0) {
      ctx.drawImage(this.img, 3, 25, 27, 6, 32, 32 - Math.floor(score.yOffset), 27, 6);
    } else if (score.type == 1) {
      ctx.drawImage(this.img, 3, 20, 27, 6, 32, 32 - Math.floor(score.yOffset), 27, 6);
    } else if (score.type == 2) {
      ctx.drawImage(this.img, 3, 13, 27, 6, 32, 32 - Math.floor(score.yOffset), 27, 6);
    } else {
      ctx.drawImage(this.img, 3, 4, 29, 6, 32, 32 - Math.floor(score.yOffset), 29, 6);
    }
  }
}
