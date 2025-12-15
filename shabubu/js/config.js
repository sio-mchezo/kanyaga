// Configuration constants
const CONFIG = {
  ANIMATIONS: {
    T_POSE: 0,
    SIT: 1,
    IDLE: 2,
    WALK: 3,
    RUN: 4,
  },
  SPEEDS: {
    IDLE: 0,
    WALK: 0.5,
    RUN: 1,
  },
  DIVISORS: {
    sit: 30,
    idle: 20,
    walk: 10,
    run: 5,
  },
  SPEECH: {
    SPEED: 70,
  },
};

// Sound effects
function sitSFX() {
  if (typeof zzfx !== "undefined") {
    zzfx(
      ...[
        0.2,
        0.5,
        300,
        0.01,
        0.04,
        0.07,
        ,
        1.1,
        ,
        -25,
        ,
        0.2,
        ,
        ,
        3,
        ,
        0.05,
        0.64,
        0.03,
        0.1,
      ],
    );
  }
}

// Random words for talking - 10 words as requested
const RANDOM_WORDS = [
  "Hello",
  "Wonderful",
  "Curious",
  "Delightful",
  "Mysterious",
  "Ethereal",
  "Whimsical",
  "Serendipity",
  "Luminous",
  "Quintessential",
];
