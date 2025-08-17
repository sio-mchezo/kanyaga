class IntroScene {
  constructor(target, onQuit) {
    let overlay = document.getElementById('joystick-overlay');
    this.onQuit = () => {
      if (overlay) overlay.style['pointerEvents'] = 'auto'; // restore the joystick overlay's clickability
      onQuit();
    };
    if (overlay) overlay.style['pointerEvents'] = 'none'; // allow clicks past the joystick overlay

    const titleCanvasArr = sliceCanvas(titleImg, 64, 64);

    const ftlCanvasArr = sliceCanvas(ftlImg, 64, 64);
    let solarFlareCanvasArr = sliceCanvas(solarFlareImg, 64, 64);
    const outOfControlCanvasArr = sliceCanvas(outOfControlImg, 64, 64);
    const aimForPlanetCanvasArr = sliceCanvas(aimForPlanetImg, 64, 64);
    const aimForPlanetPauseCanvasArr = sliceCanvas(aimForPlanetPauseImg, 64, 64);
    const flyToPlanetCanvasArr = sliceCanvas(flyToPlanetImg, 64, 64);
    let splashDownCanvasArr = sliceCanvas(splashDownImg, 64, 64);
    const driftCanvasArr = sliceCanvas(driftImg, 64, 64);
    const bsLayCanvasArr = sliceCanvas(bsLayImg, 64, 64);
    const bsShineCanvasArr = sliceCanvas(bsShineImg, 64, 64);
    const bsLaySunCanvasArr = sliceCanvas(bsLaySunImg, 64, 64);
    const bsWakeCanvasArr = sliceCanvas(bsWakeImg, 64, 64);
    const bsSitCanvasArr = sliceCanvas(bsSitImg, 64, 64);
    const bsGetUpCanvasArr = sliceCanvas(bsGetUpImg, 64, 64);
    const bsStandCanvasArr = sliceCanvas(bsStandImg, 64, 64);
    const childEncounterCanvasArr = sliceCanvas(childEncounterImg, 64, 64);

    const chargedBotCanvasArr = sliceCanvas(chargedBotImg, 64, 64);

    const kidAweCanvasArr = sliceCanvas(kidAweImg, 64, 64);
    const kidHappyCanvasArr = sliceCanvas(kidHappyImg, 64, 64);

    const engiHappyCanvasArr = sliceCanvas(engiHappyImg, 64, 64);
    const engiShockCanvasArr = sliceCanvas(engiShockImg, 64, 64);
    const engiSmirkCanvasArr = sliceCanvas(engiSmirkImg, 64, 64);

    const workshopChargingCanvasArr = sliceCanvas(workshopChargingImg, 64, 64);
    const kidRunCanvasArr = sliceCanvas(kidRunImg, 64, 64);
    const beepBoopCanvasArr = sliceCanvas(beepBoopImg, 64, 64);

    const workshopChargingAltCanvasArr = sliceCanvas(workshopChargingAltImg, 64, 64);
    const workshopChargingStableCanvasArr = sliceCanvas(workshopChargingStableImg, 64, 64);

    const tapeCanvasArr = sliceCanvas(tapeImg, 64, 64);

    const ACTORS = {
      dad: {
        happy: engiHappyCanvasArr[0],
        shock: engiShockCanvasArr[0],
        smirk: engiSmirkCanvasArr[0],
      },
      kid: {
        happy: kidHappyCanvasArr[0],
        awe: kidAweCanvasArr[0],
      },
      bot: {
        charged: chargedBotCanvasArr[0],
      }
    };
    // document.body.appendChild(kidAweCanvasArr[0]);

    solarFlareCanvasArr = solarFlareCanvasArr.slice(0, -1);
    // splashDownCanvasArr = splashDownCanvasArr.slice(0, -2);

    // console.log("splashDownCanvasArr.length:", splashDownCanvasArr.length);

    // // build frames
    const frames = [];

    frames.push(
      ...titleCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 280,
          zzfxM: 'intro',
          text: `     INSERT COIN`
        };
      })
    );

    const INTRO_TEXT = `Next Star: H374b`;

    frames.push({ canvas: ftlCanvasArr[0], duration: 150, text: INTRO_TEXT, sfx: 'ftl' });
    frames.push({ canvas: ftlCanvasArr[1], duration: 150, text: INTRO_TEXT });
    frames.push({ canvas: ftlCanvasArr[2], duration: 150, text: INTRO_TEXT, sfx: 'btn_c' });
    frames.push({ canvas: ftlCanvasArr[3], duration: 150, text: INTRO_TEXT, sfx: 'btn_e' });
    frames.push({ canvas: ftlCanvasArr[4], duration: 150, text: INTRO_TEXT });
    frames.push({ canvas: ftlCanvasArr[5], duration: 150, text: INTRO_TEXT, sfx: 'btn_g' });
    frames.push({ canvas: ftlCanvasArr[6], duration: 150, text: INTRO_TEXT });
    frames.push({ canvas: ftlCanvasArr[7], duration: 150, text: INTRO_TEXT, sfx: 'btn_r' });
    
    
    frames.push({ canvas: solarFlareCanvasArr[0], duration: 150, sfx: 'ftl_arrive' });
    frames.push(
      ...solarFlareCanvasArr.map((n,i) => {
        return { canvas: n, duration: 250, sfx: i===2 ? 'solar_flare' : undefined };
      })
    );
    frames.push(
      ...outOfControlCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 250,
          text: 'Tap to STABILIZE!',
          sfx: i === 0 ? 'out_of_control' : undefined,
        };
      })
    );
    frames.push({ canvas: aimForPlanetCanvasArr[0], duration: 150, sfx: 'stabilized' });

    frames.push({ canvas: aimForPlanetCanvasArr[0], duration: 150, sfx: 'stabilized' });
    frames.push({ canvas: aimForPlanetCanvasArr[1], duration: 150});
    frames.push({ canvas: aimForPlanetCanvasArr[2], duration: 150, sfx: 'btn_c' });
    frames.push({ canvas: aimForPlanetCanvasArr[3], duration: 150, sfx: 'btn_e' });
    frames.push({ canvas: aimForPlanetCanvasArr[4], duration: 150 });
    frames.push({ canvas: aimForPlanetCanvasArr[5], duration: 150, sfx: 'btn_g' });
    frames.push({ canvas: aimForPlanetCanvasArr[6], duration: 150 });
    frames.push({ canvas: aimForPlanetCanvasArr[7], duration: 150, sfx: 'btn_r' });

    frames.push({ canvas: aimForPlanetPauseCanvasArr[0], duration: 150, text: 'Attempt to land!', sfx: 'ftl' });
    frames.push({ canvas: aimForPlanetPauseCanvasArr[1], duration: 150, text: 'Attempt to land!' });
    frames.push({ canvas: aimForPlanetPauseCanvasArr[2], duration: 150, text: 'Attempt to land!', sfx: 'btn_c' });
    frames.push({ canvas: aimForPlanetPauseCanvasArr[3], duration: 150, text: 'Attempt to land!', sfx: 'btn_fs' });
    frames.push({ canvas: aimForPlanetPauseCanvasArr[4], duration: 150, text: 'Attempt to land!' });
    frames.push({ canvas: aimForPlanetPauseCanvasArr[5], duration: 150, text: 'Attempt to land!', sfx: 'btn_fs' });
    frames.push({ canvas: aimForPlanetPauseCanvasArr[6], duration: 150, text: 'Attempt to land!' });
    frames.push({ canvas: aimForPlanetPauseCanvasArr[7], duration: 150, text: 'Attempt to land!', sfx: 'btn_r' });
    
    frames.push(
      ...flyToPlanetCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 250,
          sfx: i === 0 ? 'fly_to_planet' : undefined,
        };
      })
    );
    // frames.push({ canvas: flyToPlanetCanvasArr[flyToPlanetCanvasArr.length - 1], duration: 500, text: 'Crash imminent!', sfx: 'alarm_cs' });
    frames.push({ canvas: flyToPlanetCanvasArr[flyToPlanetCanvasArr.length - 1], duration: 500, text: 'Crash imminent!', sfx: 'alarm_r' });
    frames.push({ canvas: flyToPlanetCanvasArr[flyToPlanetCanvasArr.length - 1], duration: 500, text: 'Crash imminent!', sfx: 'alarm_c' });
    frames.push({ canvas: flyToPlanetCanvasArr[flyToPlanetCanvasArr.length - 1], duration: 500, text: 'Crash imminent!', sfx: 'alarm_fs' });
    
    frames.push(
      ...splashDownCanvasArr.map((n,i) => {
        let sfx = undefined;
        if(i === 0) {
          sfx = 'fly_down';
        } else if (i === 7) {
          sfx = 'splash_down';
        }
        return {
          canvas: n,
          duration: 250,
          sfx
        };
      })
    );

    frames.push(
      ...driftCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 350,
          sfx: (i % 4) === 0 ? 'heartbeat' : undefined
        };
      })
    );

    frames.push({canvas: bsLayCanvasArr[0], duration: 350, text: "...", sfx: 'beach_wave'});
    frames.push({canvas: bsLayCanvasArr[1], duration: 350, text: "..."});
    frames.push({canvas: bsLayCanvasArr[2], duration: 350, text: "..."});
    frames.push({canvas: bsLayCanvasArr[3], duration: 350, text: "..."});
    frames.push({canvas: bsLayCanvasArr[4], duration: 350, text: "..."});
    frames.push({canvas: bsLayCanvasArr[5], duration: 350, text: "..."});
    frames.push(
      ...bsShineCanvasArr.map((n,i) => {
        return {canvas: n,duration: 350};
      })
    );
    frames.push({canvas: bsLaySunCanvasArr[0], duration: 350, text: "Solar charging...", sfx: "solar_charging"});
    frames.push(
      ...bsLaySunCanvasArr.map((n,i) => {
        return {canvas: n,duration: 350, text: "Solar charging..."};
      })
    );
    frames.push(
      ...bsWakeCanvasArr.map((n,i) => {
        return {canvas: n,duration: 350};
      })
    );
    frames.push({canvas: bsSitCanvasArr[0], duration: 350, text: "Calibrating...", sfx: "calibrating"});
    frames.push(
      ...bsSitCanvasArr.map((n,i) => {
        return {canvas: n,duration: 350, text: "Calibrating..."};
      })
    );
    frames.push(
      ...bsGetUpCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 350,
          sfx: i === 3 ? 'footstep_sandy' : undefined
        };
      })
    );
    frames.push({canvas: bsStandCanvasArr[0], duration: 350, text: "Scanning...", sfx: 'scanning'});
    frames.push({canvas: bsStandCanvasArr[1], duration: 350, text: "Scanning..."});
    frames.push({canvas: bsStandCanvasArr[2], duration: 350, text: "Scanning..."});
    frames.push({canvas: bsStandCanvasArr[3], duration: 350, text: "Scanning..."});
    frames.push({canvas: bsStandCanvasArr[4], duration: 350, text: "Scanning..."});
    frames.push({canvas: bsStandCanvasArr[5], duration: 350, text: "Scanning..."});

    frames.push({canvas: childEncounterCanvasArr[0], duration: 350, text: "Fauna detected.", sfx: 'fauna_detected'});
    frames.push(
      ...childEncounterCanvasArr.map((n,i) => {
        return {canvas: n,duration: 350, text: "Fauna detected."};
      })
    );

    frames.push({canvas: kidAweCanvasArr[0], duration: 350, text: "Wow who are you?!", sfx: 'talk3'});
    frames.push({canvas: kidAweCanvasArr[0], duration: 350, text: "Wow who are you?!"});

    frames.push({canvas: beepBoopCanvasArr[0], duration: 350, text: "*beep boop*", sfx: 'beep'});
    frames.push({canvas: beepBoopCanvasArr[1], duration: 350, text: "*beep boop*"});
    frames.push({canvas: beepBoopCanvasArr[2], duration: 350, text: "*beep boop*", sfx: 'boop'});
    frames.push({canvas: beepBoopCanvasArr[3], duration: 350, text: "*beep boop*"});

    frames.push({canvas: kidHappyCanvasArr[0], duration: 350, text: "You're a robot!", sfx: 'talk3'});
    frames.push({canvas: kidHappyCanvasArr[0], duration: 350, text: "You're a robot!"});

    frames.push({canvas: bsLayCanvasArr[0], duration: 350, text: "Energy low...", sfx: 'power_down'});
    frames.push(
      ...bsLayCanvasArr.map((n,i) => {
        return {canvas: n,duration: 350, text: "Energy low..."};
      })
    );

    frames.push({canvas: kidAweCanvasArr[0], duration: 455, text: "Are you okay?", sfx: 'talk3'});
    frames.push({canvas: kidAweCanvasArr[0], duration: 455, text: "I'll get dad!", sfx: 'talk3'});

    frames.push({canvas: kidRunCanvasArr[0], duration: 150, sfx: 'footstep_sandy'});
    frames.push({canvas: kidRunCanvasArr[1], duration: 150});
    frames.push({canvas: kidRunCanvasArr[2], duration: 150, sfx: 'footstep_sandy'});
    frames.push({canvas: kidRunCanvasArr[3], duration: 150});
    frames.push({canvas: kidRunCanvasArr[4], duration: 150, sfx: 'footstep_sandy'});
    frames.push({canvas: kidRunCanvasArr[5], duration: 150});
    frames.push({canvas: kidRunCanvasArr[6], duration: 150, sfx: 'footstep_sandy'});
    frames.push({canvas: kidRunCanvasArr[7], duration: 150});
    frames.push({canvas: kidRunCanvasArr[8], duration: 150, sfx: 'footstep_sandy'});
    
    frames.push({canvas: bsLayCanvasArr[0], duration: 350, text: "5 minutes later...", sfx: 'beach_wave'});
    frames.push({canvas: bsLayCanvasArr[1], duration: 350, text: "5 minutes later..."});
    frames.push({canvas: bsLayCanvasArr[2], duration: 350, text: "5 minutes later..."});
    frames.push({canvas: bsLayCanvasArr[3], duration: 350, text: "5 minutes later..."});
    frames.push({canvas: bsLayCanvasArr[4], duration: 350, text: "5 minutes later..."});
    frames.push({canvas: bsLayCanvasArr[5], duration: 350, text: "5 minutes later..."});

    frames.push({canvas: engiShockCanvasArr[0], duration: 650, text: "It's a BEAT BOT!", sfx: 'talk4'});

    frames.push({canvas: kidHappyCanvasArr[0], duration: 455, text: "Can you fix it?", sfx: 'talk3'});
    frames.push({canvas: engiSmirkCanvasArr[0], duration: 650, text: "Yes, but don't tell your mother.", sfx: 'talk4'});
    frames.push({canvas: kidHappyCanvasArr[0], duration: 455, text: "I won't, I swear!", sfx: 'talk3'});
    frames.push({canvas: engiHappyCanvasArr[0], duration: 650, text: "Okay... to the workshop!", sfx: 'talk4'});

    frames.push(
      ...workshopChargingCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: i < 16 ? 150 : 350,
          text: "Almost got it...",
          sfx: i < 16 ? 'keyboard_clack' : 'workshop_charging'
        };
      })
    );
    frames.push(
      ...workshopChargingAltCanvasArr.map((n,i) => {
        let sfx = i === 17 || i === 19 || i === 21 ? 'scratch' : undefined;
        if(i < 16) sfx = 'keyboard_clack';
        return {
          canvas: n,
          duration: 150,
          text: "Hmm...",
          sfx
        };
      })
    );
    frames.push(
      ...workshopChargingCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: i < 16 ? 150 : 350,
          text: "Ah okay...",
          sfx: i < 16 ? 'keyboard_clack' : 'workshop_charging'
        };
      })
    );
    frames.push(
      ...workshopChargingStableCanvasArr.map((n,i) => {

        return {
          canvas: n,
          duration: 150,
          text: "I GOT IT!",
          sfx: i === 3 ? 'belly_jiggle' : undefined
        };
      })
    );
    frames.push({
      canvas: ACTORS.kid.happy,
      duration: 455,
      text: "His eyes glow!",
      sfx: 'talk3'
    });
    frames.push({
      canvas: ACTORS.dad.shock,
      duration: 455,
      text: "Go get Vera!",
      sfx: 'talk4'
    });
    frames.push({
      canvas: ACTORS.dad.shock,
      duration: 455,
      text: "Tell her to bring    her DJ equipment!",
      sfx: 'talk4'
    });
    frames.push({
      canvas: ACTORS.kid.awe,
      duration: 455,
      text: "...what?!",
      sfx: 'talk3'
    });
    frames.push({
      canvas: ACTORS.dad.shock,
      duration: 455,
      text: "Just go! Hurry!",
      sfx: 'talk4'
    });
    frames.push({
      canvas: ACTORS.bot.charged,
      duration: 455,
      text: "Take me to your DJ",
      sfx: 'bot_talk'
    });
    frames.push({
      canvas: ACTORS.dad.shock,
      duration: 455,
      text: "She's on her way",
      sfx: 'talk3'
    });
    frames.push({
      canvas: ACTORS.bot.charged,
      duration: 455,
      text: "No... NOW!",
      sfx: 'bot_talk'
    });
    frames.push({
      canvas: ACTORS.dad.shock,
      duration: 455,
      text: "Then I will DJ!",
      sfx: 'talk3'
    });
    frames.push({
      canvas: ACTORS.bot.charged,
      duration: 455,
      text: "Very well...",
      sfx: 'bot_talk'
    });
    frames.push({
      canvas: ACTORS.dad.smirk,
      duration: 300,
      text: "It's shanty time!",
      sfx: 'talk3'
    });
    frames.push(
      ...tapeCanvasArr.map((n,i) => {
        return {
          canvas: n,
          duration: 250,
          sfx: i === 2 ? 'cassette' : undefined,
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
