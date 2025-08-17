
const ZZFXM_MUSIC = {
  "intro": genSong()
};

function genSong() {
  const p1m = [
    0, ,

    ...genRiff(1, 16, 1, 1, "1a"),
    ...genRiff(9, 8, 2, 3, "1b"), // 32

    ...genRiff(21, 4, 1, -1, "2a"),
    ...genRiff(18, 4, 2, -3, "2b"), // 32

    ...genRiff(18, 16, 1, -1, "3a"),
    ...genRiff(1, 8, 2, 5, "3b"), // 32

    ...genRiff(18, 4, 1, -1, "2a"),
    ...genRiff(15, 4, 2, -3, "2b"), // 32

  ];

  const bassPat = [
    2, -.3,
    ...genRiff(1, 16, 8, 0, "beat1"),
    ...genRiff(1, 16, 8, 0, "beat1"),
    ...genRiff(1, 16, 8, 0, "beat1"),
    ...genRiff(1, 16, 8, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const chikPat = [
    1, -.3,
    ,,,,,,,,,,
    ...genRiff(1, 16, 16, 0, "beat1"),
    ...genRiff(1, 16, 16, 0, "beat1"),
    ...genRiff(1, 16, 16, 0, "beat1"),
    ...genRiff(1, 8, 16, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const chikPat2 = [
    1, -.3,
    ,,,,,,,,,,
    ...genRiff(1, 16, 12, 0, "beat1"),
    ...genRiff(1, 16, 12, 0, "beat1"),
    ...genRiff(1, 16, 12, 0, "beat1"),
    ...genRiff(1, 8, 22, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const hatPat = [
    3, -.3,
    ,,,,,,,,
    ...genRiff(1, 16, 16, 0, "beat1"),
    ...genRiff(1, 16, 16, 0, "beat1"),
    ...genRiff(1, 16, 16, 0, "beat1"),
    ...genRiff(1, 8, 16, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const hatPat2 = [
    3, -.3,
    ,,,,,,,,
    ...genRiff(1, 16, 8, 0, "beat1"),
    ...genRiff(1, 16, 8, 0, "beat1"),
    ...genRiff(1, 16, 4, 0, "beat1"),
    ...genRiff(1, 8, 7, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const chikPat3 = [
    1, -.3,
    ,,,,,,,,,,
    ...genRiff(1, 16, 6, 0, "beat1"),
    ...genRiff(1, 16, 6, 0, "beat1"),
    ...genRiff(1, 16, 12, 0, "beat1"),
    ...genRiff(1, 8, 22, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const hatPat3 = [
    3, -.3,
    ,,,,,,,,
    ...genRiff(1, 16, 4, 0, "beat1"),
    ...genRiff(1, 16, 6, 0, "beat1"),
    ...genRiff(1, 16, 4, 0, "beat1"),
    ...genRiff(1, 8, 5, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const chikPat4 = [
    1, -.3,
    ,,,,,,,,,,
    ...genRiff(1, 16, 2, 0, "beat1"),
    ...genRiff(1, 16, 5, 0, "beat1"),
    ...genRiff(1, 16, 6, 0, "beat1"),
    ...genRiff(1, 8, 22, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const hatPat4 = [
    3, -.3,
    ,,,,,,,,
    ...genRiff(1, 16, 2, 0, "beat1"),
    ...genRiff(1, 16, 3, 0, "beat1"),
    ...genRiff(1, 16, 2, 0, "beat1"),
    ...genRiff(1, 8, 3, 0, "beat1"),
    // ...genRiff(13, 128, 8, 0, "beat1")
  ];
  const _song = [
    [
      [.5, 0, 440, .05, .4, .9],
      [.5, 0, 880, , , .05, , 9, , , , , , 50],
      [2, 0, 110, , .05, , , 10, -.5, , , , , 1, 2.1, -.1, , , , 1],
      [.7, 0, 3520, , , .05, , , , , , , , 20]
    ],
    [
      [
        p1m, hatPat
      ],
      [
        p1m, bassPat, hatPat2
      ],
      [
        p1m, bassPat, chikPat4, hatPat4
      ],
      [
        p1m, bassPat, chikPat4, hatPat4
      ],
      [
        p1m, bassPat, chikPat2, hatPat2
      ],
      [
        p1m, hatPat2, chikPat3
      ],
      [
        p1m, bassPat, chikPat3, hatPat3
      ],
      [
        p1m, bassPat, chikPat4, hatPat4
      ],
    ],
    // [0,1,2,3, 4, 5],
    // [0],
    // [0,1],
    [0,1,2,3,4,5,6,7],
    144,
    {
      "title": "LoFi",
      "instruments": ["Chords", "Chik", "Kick", "Hat"],
      "patterns": ["Intro", "P1", "P2", "P3", "P4", "P5", "P6", "Outro"]
    }
  ];

  //console.log(JSON.stringify(_song).split('null').join(''));
  return _song;

  function genRiff(n = 1, beats = 32, skip = 1, velocity = 1, name = "riff") {
    const ret = [...Array(beats).fill(null)];

    let curr = n;
    for (let i = 0; i < beats; i += skip) {
      ret[i] = curr;
      curr += velocity;
    }
    return ret;
  }
}
