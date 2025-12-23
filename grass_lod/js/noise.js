/* CC0 */
let G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
let G3 = 1.0 / 6.0;
let G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
function makeNoise2D() {
    let grad = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
        [1, 0],
        [-1, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [0, 1],
        [0, -1],
    ];
    let p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random());
        q = p[i];
        p[i] = p[n];
        p[n] = q;
    }
    let perm = new Uint8Array(512);
    let permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }
    return (x, y) => {
        let s = (x + y) * 0.5 * (Math.sqrt(3.0) - 1.0);
        let i = Math.floor(x + s);
        let j = Math.floor(y + s);
        let t = (i + j) * G2;
        let X0 = i - t;
        let Y0 = j - t;
        let x0 = x - X0;
        let y0 = y - Y0;
        let i1 = x0 > y0 ? 1 : 0;
        let j1 = x0 > y0 ? 0 : 1;
        let x1 = x0 - i1 + G2;
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1.0 + 2.0 * G2;
        let y2 = y0 - 1.0 + 2.0 * G2;
        let ii = i & 255;
        let jj = j & 255;
        let g0 = grad[permMod12[ii + perm[jj]]];
        let g1 = grad[permMod12[ii + i1 + perm[jj + j1]]];
        let g2 = grad[permMod12[ii + 1 + perm[jj + 1]]];
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        let n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0);
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        let n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1);
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        let n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2);
        return 70.14805770653952 * (n0 + n1 + n2);
    };
}
function makeNoise3D() {
    let grad = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
        [0, 1, 1],
        [0, -1, -1],
        [0, 1, -1],
        [0, -1, -1],
    ];
    let p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random());
        q = p[i];
        p[i] = p[n];
        p[n] = q;
    }
    let perm = new Uint8Array(512);
    let permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }
    return (x, y, z) => {
        let s = (x + y + z) / 3.0;
        let i = Math.floor(x + s);
        let j = Math.floor(y + s);
        let k = Math.floor(z + s);
        let t = (i + j + k) * G3;
        let X0 = i - t;
        let Y0 = j - t;
        let Z0 = k - t;
        let x0 = x - X0;
        let y0 = y - Y0;
        let z0 = z - Z0;
        let i1, j1, k1;
        let i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = i2 = j2 = 1;
                j1 = k1 = k2 = 0;
            } else if (x0 >= z0) {
                i1 = i2 = k2 = 1;
                j1 = k1 = j2 = 0;
            } else {
                k1 = i2 = k2 = 1;
                i1 = j1 = j2 = 0;
            }
        } else {
            if (y0 < z0) {
                k1 = j2 = k2 = 1;
                i1 = j1 = i2 = 0;
            } else if (x0 < z0) {
                j1 = j2 = k2 = 1;
                i1 = k1 = i2 = 0;
            } else {
                j1 = i2 = j2 = 1;
                i1 = k1 = k2 = 0;
            }
        }
        let x1 = x0 - i1 + G3;
        let y1 = y0 - j1 + G3;
        let z1 = z0 - k1 + G3;
        let x2 = x0 - i2 + 2.0 * G3;
        let y2 = y0 - j2 + 2.0 * G3;
        let z2 = z0 - k2 + 2.0 * G3;
        let x3 = x0 - 1.0 + 3.0 * G3;
        let y3 = y0 - 1.0 + 3.0 * G3;
        let z3 = z0 - 1.0 + 3.0 * G3;
        let ii = i & 255;
        let jj = j & 255;
        let kk = k & 255;
        let g0 = grad[permMod12[ii + perm[jj + perm[kk]]]];
        let g1 = grad[permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]];
        let g2 = grad[permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]];
        let g3 = grad[permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]];
        let t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
        let n0 =
            t0 < 0
                ? 0.0
                : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0 + g0[2] * z0);
        let t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
        let n1 =
            t1 < 0
                ? 0.0
                : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1 + g1[2] * z1);
        let t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
        let n2 =
            t2 < 0
                ? 0.0
                : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2 + g2[2] * z2);
        let t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
        let n3 =
            t3 < 0
                ? 0.0
                : Math.pow(t3, 4) * (g3[0] * x3 + g3[1] * y3 + g3[2] * z3);
        return 94.68493150681972 * (n0 + n1 + n2 + n3);
    };
}
function makeNoise4D() {
    let grad = [
        [0, 1, 1, 1],
        [0, 1, 1, -1],
        [0, 1, -1, 1],
        [0, 1, -1, -1],
        [0, -1, 1, 1],
        [0, -1, 1, -1],
        [0, -1, -1, 1],
        [0, -1, -1, -1],
        [1, 0, 1, 1],
        [1, 0, 1, -1],
        [1, 0, -1, 1],
        [1, 0, -1, -1],
        [-1, 0, 1, 1],
        [-1, 0, 1, -1],
        [-1, 0, -1, 1],
        [-1, 0, -1, -1],
        [1, 1, 0, 1],
        [1, 1, 0, -1],
        [1, -1, 0, 1],
        [1, -1, 0, -1],
        [-1, 1, 0, 1],
        [-1, 1, 0, -1],
        [-1, -1, 0, 1],
        [-1, -1, 0, -1],
        [1, 1, 1, 0],
        [1, 1, -1, 0],
        [1, -1, 1, 0],
        [1, -1, -1, 0],
        [-1, 1, 1, 0],
        [-1, 1, -1, 0],
        [-1, -1, 1, 0],
        [-1, -1, -1, 0],
    ];
    let p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random());
        q = p[i];
        p[i] = p[n];
        p[n] = q;
    }
    let perm = new Uint8Array(512);
    let permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }
    return (x, y, z, w) => {
        let s = ((x + y + z + w) * (Math.sqrt(5.0) - 1.0)) / 4.0;
        let i = Math.floor(x + s);
        let j = Math.floor(y + s);
        let k = Math.floor(z + s);
        let l = Math.floor(w + s);
        let t = (i + j + k + l) * G4;
        let X0 = i - t;
        let Y0 = j - t;
        let Z0 = k - t;
        let W0 = l - t;
        let x0 = x - X0;
        let y0 = y - Y0;
        let z0 = z - Z0;
        let w0 = w - W0;
        let rankx = 0;
        let ranky = 0;
        let rankz = 0;
        let rankw = 0;
        if (x0 > y0) rankx++;
        else ranky++;
        if (x0 > z0) rankx++;
        else rankz++;
        if (x0 > w0) rankx++;
        else rankw++;
        if (y0 > z0) ranky++;
        else rankz++;
        if (y0 > w0) ranky++;
        else rankw++;
        if (z0 > w0) rankz++;
        else rankw++;
        let i1 = rankx >= 3 ? 1 : 0;
        let j1 = ranky >= 3 ? 1 : 0;
        let k1 = rankz >= 3 ? 1 : 0;
        let l1 = rankw >= 3 ? 1 : 0;
        let i2 = rankx >= 2 ? 1 : 0;
        let j2 = ranky >= 2 ? 1 : 0;
        let k2 = rankz >= 2 ? 1 : 0;
        let l2 = rankw >= 2 ? 1 : 0;
        let i3 = rankx >= 1 ? 1 : 0;
        let j3 = ranky >= 1 ? 1 : 0;
        let k3 = rankz >= 1 ? 1 : 0;
        let l3 = rankw >= 1 ? 1 : 0;
        let x1 = x0 - i1 + G4;
        let y1 = y0 - j1 + G4;
        let z1 = z0 - k1 + G4;
        let w1 = w0 - l1 + G4;
        let x2 = x0 - i2 + 2.0 * G4;
        let y2 = y0 - j2 + 2.0 * G4;
        let z2 = z0 - k2 + 2.0 * G4;
        let w2 = w0 - l2 + 2.0 * G4;
        let x3 = x0 - i3 + 3.0 * G4;
        let y3 = y0 - j3 + 3.0 * G4;
        let z3 = z0 - k3 + 3.0 * G4;
        let w3 = w0 - l3 + 3.0 * G4;
        let x4 = x0 - 1.0 + 4.0 * G4;
        let y4 = y0 - 1.0 + 4.0 * G4;
        let z4 = z0 - 1.0 + 4.0 * G4;
        let w4 = w0 - 1.0 + 4.0 * G4;
        let ii = i & 255;
        let jj = j & 255;
        let kk = k & 255;
        let ll = l & 255;
        let g0 = grad[perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32];
        let g1 =
            grad[
                perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] %
                    32
            ];
        let g2 =
            grad[
                perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] %
                    32
            ];
        let g3 =
            grad[
                perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] %
                    32
            ];
        let g4 =
            grad[
                perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32
            ];
        let t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        let n0 =
            t0 < 0
                ? 0.0
                : Math.pow(t0, 4) *
                  (g0[0] * x0 + g0[1] * y0 + g0[2] * z0 + g0[3] * w0);
        let t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        let n1 =
            t1 < 0
                ? 0.0
                : Math.pow(t1, 4) *
                  (g1[0] * x1 + g1[1] * y1 + g1[2] * z1 + g1[3] * w1);
        let t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        let n2 =
            t2 < 0
                ? 0.0
                : Math.pow(t2, 4) *
                  (g2[0] * x2 + g2[1] * y2 + g2[2] * z2 + g2[3] * w2);
        let t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        let n3 =
            t3 < 0
                ? 0.0
                : Math.pow(t3, 4) *
                  (g3[0] * x3 + g3[1] * y3 + g3[2] * z3 + g3[3] * w3);
        let t4 = 0.5 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        let n4 =
            t4 < 0
                ? 0.0
                : Math.pow(t4, 4) *
                  (g4[0] * x4 + g4[1] * y4 + g4[2] * z4 + g4[3] * w4);
        return 72.37855765153665 * (n0 + n1 + n2 + n3 + n4);
    };
}

/**

seedrandom.js
=============

Seeded random number generator for Javascript.

version 2.3.10
Author: David Bau
Date: 2014 Sep 20

Can be used as a plain script, a node.js module or an AMD module.

Script tag usage
----------------

<script src=//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.3.10/seedrandom.min.js>
</script>

// Sets Math.random to a PRNG initialized using the given explicit seed.
Math.seedrandom('hello.');
console.log(Math.random());          // Always 0.9282578795792454
console.log(Math.random());          // Always 0.3752569768646784

// Sets Math.random to an ARC4-based PRNG that is autoseeded using the
// current time, dom state, and other accumulated local entropy.
// The generated seed string is returned.
Math.seedrandom();
console.log(Math.random());          // Reasonably unpredictable.

// Seeds using the given explicit seed mixed with accumulated entropy.
Math.seedrandom('added entropy.', { entropy: true });
console.log(Math.random());          // As unpredictable as added entropy.

// Use "new" to create a local prng without altering Math.random.
var myrng = new Math.seedrandom('hello.');
console.log(myrng());                // Always 0.9282578795792454


Node.js usage
-------------

npm install seedrandom

// Local PRNG: does not affect Math.random.
var seedrandom = require('seedrandom');
var rng = seedrandom('hello.');
console.log(rng());                  // Always 0.9282578795792454

// Autoseeded ARC4-based PRNG.
rng = seedrandom();
console.log(rng());                  // Reasonably unpredictable.

// Global PRNG: set Math.random.
seedrandom('hello.', { global: true });
console.log(Math.random());          // Always 0.9282578795792454

// Mixing accumulated entropy.
rng = seedrandom('added entropy.', { entropy: true });
console.log(rng());                  // As unpredictable as added entropy.


Require.js usage
----------------

Similar to node.js usage:

bower install seedrandom

require(['seedrandom'], function(seedrandom) {
  var rng = seedrandom('hello.');
  console.log(rng());                  // Always 0.9282578795792454
});


Network seeding
---------------

<script src=//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.3.10/seedrandom.min.js>
</script>

<!-- Seeds using urandom bits from a server. -->
<script src=//jsonlib.appspot.com/urandom?callback=Math.seedrandom">
</script>

<!-- Seeds mixing in random.org bits -->
<script>
(function(x, u, s){
  try {
    // Make a synchronous request to random.org.
    x.open('GET', u, false);
    x.send();
    s = unescape(x.response.trim().replace(/^|\s/g, '%'));
  } finally {
    // Seed with the response, or autoseed on failure.
    Math.seedrandom(s, !!s);
  }
})(new XMLHttpRequest, 'https://www.random.org/integers/' +
  '?num=256&min=0&max=255&col=1&base=16&format=plain&rnd=new');
</script>

Reseeding using user input
--------------------------

var seed = Math.seedrandom();        // Use prng with an automatic seed.
document.write(Math.random());       // Pretty much unpredictable x.

var rng = new Math.seedrandom(seed); // A new prng with the same seed.
document.write(rng());               // Repeat the 'unpredictable' x.

function reseed(event, count) {      // Define a custom entropy collector.
  var t = [];
  function w(e) {
    t.push([e.pageX, e.pageY, +new Date]);
    if (t.length &lt; count) { return; }
    document.removeEventListener(event, w);
    Math.seedrandom(t, { entropy: true });
  }
  document.addEventListener(event, w);
}
reseed('mousemove', 100);            // Reseed after 100 mouse moves.

The "pass" option can be used to get both the prng and the seed.
The following returns both an autoseeded prng and the seed as an object,
without mutating Math.random:

var obj = Math.seedrandom(null, { pass: function(prng, seed) {
  return { random: prng, seed: seed };
}});


Version notes
-------------

The random number sequence is the same as version 1.0 for string seeds.
* Version 2.0 changed the sequence for non-string seeds.
* Version 2.1 speeds seeding and uses window.crypto to autoseed if present.
* Version 2.2 alters non-crypto autoseeding to sweep up entropy from plugins.
* Version 2.3 adds support for "new", module loading, and a null seed arg.
* Version 2.3.1 adds a build environment, module packaging, and tests.
* Version 2.3.4 fixes bugs on IE8, and switches to MIT license.
* Version 2.3.6 adds a readable options object argument.
* Version 2.3.10 adds support for node.js crypto (contributed by ctd1500).

The standard ARC4 key scheduler cycles short keys, which means that
seedrandom('ab') is equivalent to seedrandom('abab') and 'ababab'.
Therefore it is a good idea to add a terminator to avoid trivial
equivalences on short string seeds, e.g., Math.seedrandom(str + '\0').
Starting with version 2.0, a terminator is added automatically for
non-string seeds, so seeding with the number 111 is the same as seeding
with '111\0'.

When seedrandom() is called with zero args or a null seed, it uses a
seed drawn from the browser crypto object if present.  If there is no
crypto support, seedrandom() uses the current time, the native rng,
and a walk of several DOM objects to collect a few bits of entropy.

Each time the one- or two-argument forms of seedrandom are called,
entropy from the passed seed is accumulated in a pool to help generate
future seeds for the zero- and two-argument forms of seedrandom.

On speed - This javascript implementation of Math.random() is several
times slower than the built-in Math.random() because it is not native
code, but that is typically fast enough.  Some details (timings on
Chrome 25 on a 2010 vintage macbook):

* seeded Math.random()          - avg less than 0.0002 milliseconds per call
* seedrandom('explicit.')       - avg less than 0.2 milliseconds per call
* seedrandom('explicit.', true) - avg less than 0.2 milliseconds per call
* seedrandom() with crypto      - avg less than 0.2 milliseconds per call

Autoseeding without crypto is somewhat slower, about 20-30 milliseconds on
a 2012 windows 7 1.5ghz i5 laptop, as seen on Firefox 19, IE 10, and Opera.
Seeded rng calls themselves are fast across these browsers, with slowest
numbers on Opera at about 0.0005 ms per seeded Math.random().


LICENSE (MIT)
-------------

Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/**
 * All code is in an anonymous closure to keep the global namespace clean.
 */
(function (global, pool, math, width, chunks, digits, module, define, rngname) {
    //
    // The following constants are related to IEEE 754 limits.
    //
    var startdenom = math.pow(width, chunks),
        significance = math.pow(2, digits),
        overflow = significance * 2,
        mask = width - 1,
        nodecrypto;

    //
    // seedrandom()
    // This is the seedrandom function described above.
    //
    var impl = (math["seed" + rngname] = function (seed, options, callback) {
        var key = [];
        options = options == true ? { entropy: true } : options || {};

        // Flatten the seed string or build one from local entropy if needed.
        var shortseed = mixkey(
            flatten(
                options.entropy
                    ? [seed, tostring(pool)]
                    : seed == null
                    ? autoseed()
                    : seed,
                3,
            ),
            key,
        );

        // Use the seed to initialize an ARC4 generator.
        var arc4 = new ARC4(key);

        // Mix the randomness into accumulated entropy.
        mixkey(tostring(arc4.S), pool);

        // Calling convention: what to return as a function of prng, seed, is_math.
        return (
            options.pass ||
            callback ||
            // If called as a method of Math (Math.seedrandom()), mutate Math.random
            // because that is how seedrandom.js has worked since v1.0.  Otherwise,
            // it is a newer calling convention, so return the prng directly.
            function (prng, seed, is_math_call) {
                if (is_math_call) {
                    math[rngname] = prng;
                    return seed;
                } else return prng;
            }
        )(
            // This function returns a random double in [0, 1) that contains
            // randomness in every bit of the mantissa of the IEEE 754 value.
            function () {
                var n = arc4.g(chunks), // Start with a numerator n < 2 ^ 48
                    d = startdenom, //   and denominator d = 2 ^ 48.
                    x = 0; //   and no 'extra last byte'.
                while (n < significance) {
                    // Fill up all significant digits by
                    n = (n + x) * width; //   shifting numerator and
                    d *= width; //   denominator and generating a
                    x = arc4.g(1); //   new least-significant-byte.
                }
                while (n >= overflow) {
                    // To avoid rounding up, before adding
                    n /= 2; //   last byte, shift everything
                    d /= 2; //   right using integer math until
                    x >>>= 1; //   we have exactly the desired bits.
                }
                return (n + x) / d; // Form the number within [0, 1).
            },
            shortseed,
            "global" in options ? options.global : this == math,
        );
    });

    //
    // ARC4
    //
    // An ARC4 implementation.  The constructor takes a key in the form of
    // an array of at most (width) integers that should be 0 <= x < (width).
    //
    // The g(count) method returns a pseudorandom integer that concatenates
    // the next (count) outputs from ARC4.  Its return value is a number x
    // that is in the range 0 <= x < (width ^ count).
    //
    /** @constructor */
    function ARC4(key) {
        var t,
            keylen = key.length,
            me = this,
            i = 0,
            j = (me.i = me.j = 0),
            s = (me.S = []);

        // The empty key [] is treated as [0].
        if (!keylen) {
            key = [keylen++];
        }

        // Set up S using the standard key scheduling algorithm.
        while (i < width) {
            s[i] = i++;
        }
        for (i = 0; i < width; i++) {
            s[i] = s[(j = mask & (j + key[i % keylen] + (t = s[i])))];
            s[j] = t;
        }

        // The "g" method returns the next (count) outputs as one number.
        (me.g = function (count) {
            // Using instance members instead of closure state nearly doubles speed.
            var t,
                r = 0,
                i = me.i,
                j = me.j,
                s = me.S;
            while (count--) {
                t = s[(i = mask & (i + 1))];
                r =
                    r * width +
                    s[mask & ((s[i] = s[(j = mask & (j + t))]) + (s[j] = t))];
            }
            me.i = i;
            me.j = j;
            return r;
            // For robust unpredictability, the function call below automatically
            // discards an initial batch of values.  This is called RC4-drop[256].
            // See http://google.com/search?q=rsa+fluhrer+response&btnI
        })(width);
    }

    //
    // flatten()
    // Converts an object tree to nested arrays of strings.
    //
    function flatten(obj, depth) {
        var result = [],
            typ = typeof obj,
            prop;
        if (depth && typ == "object") {
            for (prop in obj) {
                try {
                    result.push(flatten(obj[prop], depth - 1));
                } catch (e) {}
            }
        }
        return result.length ? result : typ == "string" ? obj : obj + "\0";
    }

    //
    // mixkey()
    // Mixes a string seed into a key that is an array of integers, and
    // returns a shortened string seed that is equivalent to the result key.
    //
    function mixkey(seed, key) {
        var stringseed = seed + "",
            smear,
            j = 0;
        while (j < stringseed.length) {
            key[mask & j] =
                mask &
                ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
        }
        return tostring(key);
    }

    //
    // autoseed()
    // Returns an object for autoseeding, using window.crypto if available.
    //
    /** @param {Uint8Array|Navigator=} seed */
    function autoseed(seed) {
        try {
            if (nodecrypto) return tostring(nodecrypto.randomBytes(width));
            global.crypto.getRandomValues((seed = new Uint8Array(width)));
            return tostring(seed);
        } catch (e) {
            return [
                +new Date(),
                global,
                (seed = global.navigator) && seed.plugins,
                global.screen,
                tostring(pool),
            ];
        }
    }

    //
    // tostring()
    // Converts an array of charcodes to a string
    //
    function tostring(a) {
        return String.fromCharCode.apply(0, a);
    }

    //
    // When seedrandom.js is loaded, we immediately mix a few bits
    // from the built-in RNG into the entropy pool.  Because we do
    // not want to interfere with deterministic PRNG state later,
    // seedrandom will not call math.random on its own again after
    // initialization.
    //
    mixkey(math[rngname](), pool);

    //
    // Nodejs and AMD support: export the implementation as a module using
    // either convention.
    //
    if (module && module.exports) {
        module.exports = impl;
        try {
            // When in node.js, try using crypto package for autoseeding.
            nodecrypto = require("crypto");
        } catch (ex) {}
    } else if (define && define.amd) {
        define(function () {
            return impl;
        });
    }

    //
    // Node.js native crypto support.
    //

    // End anonymous scope, and pass initial values.
})(
    this, // global window object
    [], // pool: entropy pool starts empty
    Math, // math: package containing random, pow, and seedrandom
    256, // width: each RC4 output is 0 <= x < 256
    6, // chunks: at least six RC4 outputs for each double
    52, // digits: there are 52 significant digits in a double
    typeof module == "object" && module, // present in node.js
    typeof define == "function" && define, // present with an AMD loader
    "random", // rngname: name for Math.random and Math.seedrandom
);

let simplex2D, looplex2D, simplex3D, looplex3D, simplex4D, looplex4D;
resetNoise(window?.WORLD_SEED);

function resetNoise(seed) {
    if (typeof seed !== "undefined") Math.seedrandom(seed);
    simplex2D = makeNoise2D();
    looplex2D = (x, y, fx = 0.1, fy = 0.1, octaves = []) => {
        let amplitude = 1;
        let range = 1;
        let v = simplex2D(x * fx, y * fy);
        octaves.forEach((octave) => {
            fx *= octave[0];
            fy *= octave[0];
            amplitude *= octave[1];
            range += amplitude;
            const _x = x;
            const _y = y;
            v += simplex2D(_x * fx, _y * fy) * amplitude;
        });
        return Math.max(0, Math.min(0.999999999999, (v / range + 1) / 2));
    };

    simplex3D = makeNoise3D();
    looplex3D = (
        x,
        y,
        z,
        fx = 0.1,
        fy = 0.1,
        fz = 0.1,
        octaves = [
            [2, 0.5],
            [2, 0.5],
        ],
    ) => {
        let amplitude = 1;
        let range = 1;
        let v = simplex3D(x * fx, y * fy, z * fz);

        octaves.forEach((octave) => {
            fx *= octave[0];
            fy *= octave[0];
            fz *= octave[0];
            amplitude *= octave[1];
            range += amplitude;
            v += simplex3D(x * fx, y * fy, z * fz) * amplitude;
        });
        return Math.max(0, Math.min(0.999999999999, (v / range + 1) / 2));
    };
    simplex4D = makeNoise4D();
    looplex4D = (
        x,
        y,
        z,
        u,
        fx = 0.1,
        fy = 0.1,
        fz = 0.1,
        fu = 0.1,
        octaves = [
            [2, 0.5],
            [2, 0.5],
        ],
    ) => {
        let amplitude = 1;
        let range = 1;
        let v = simplex4D(x * fx, y * fy, z * fz, u * fu);
        octaves.forEach((octave) => {
            fx *= octave[0];
            fy *= octave[0];
            fz *= octave[0];
            fu *= octave[0];
            amplitude *= octave[1];
            range += amplitude;
            v += simplex4D(x * fx, y * fy, z * fz, u * fu) * amplitude;
        });
        return Math.max(0, Math.min(0.999999999999, (v / range + 1) / 2));
    };
}

function noise2dCanvas(
    width,
    height,
    noiseFunction = looplex2D,
    fx = 0.1,
    fy = 0.1,
    octaves = [
        [2, 0.5],
        [2, 0.5],
    ],
) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    let imgData = ctx.createImageData(width, height);
    let data = imgData.data;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let v = noiseFunction(x, y, fx, fy, octaves);
            let i = (y * width + x) * 4;
            data[i] = data[i + 1] = data[i + 2] = v * 255;
            data[i + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
}
function noise3dCanvas(
    width,
    height,
    noiseFunction = looplex3D,
    fx = 0.1,
    fy = 0.1,
    fz = 0.1,
    octaves = [
        [2, 0.5],
        [2, 0.5],
    ],
) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    let imgData = ctx.createImageData(width, height);
    let data = imgData.data;
    const z = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let v = noiseFunction(x, y, z, fx, fy, fz, octaves);
            let i = (y * width + x) * 4;
            data[i] = data[i + 1] = data[i + 2] = v * 255;
            data[i + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
}
function noise4dCanvas(
    width,
    height,
    noiseFunction = looplex4D,
    fx = 0.1,
    fy = 0.1,
    fz = 0.1,
    fw = 0.1,
    octaves = [
        [2, 0.5],
        [2, 0.5],
    ],
) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    let imgData = ctx.createImageData(width, height);
    let data = imgData.data;
    const z = 0;
    const w = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let v = noiseFunction(x, y, z, w, fx, fy, fz, fw, octaves);
            let i = (y * width + x) * 4;
            data[i] = data[i + 1] = data[i + 2] = v * 255;
            data[i + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
}

function sphereNoiseCanvas(
    width,
    height,
    noiseFunction = looplex3D,
    fx = 0.1,
    fy = 0.1,
    fz = 0.1,
    octaves = [
        [2, 0.5],
        [2, 0.5],
    ],
) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    let imgData = ctx.createImageData(width, height);
    let data = imgData.data;
    const z = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let dx = (x / width) * 2 - 1;
            let dy = (y / height) * 2 - 1;
            let dz = Math.sqrt(1 - dx * dx - dy * dy);
            let v = noiseFunction(dx, dy, dz, fx, fy, fz, octaves);
            let i = (y * width + x) * 4;
            data[i] = data[i + 1] = data[i + 2] = v * 255;
            data[i + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
}

function noiseCanvas(options = {}) {
    let {
        ctx,
        w,
        h,
        noiseFunc,
        f,
        fx,
        fy,
        octaves,
        projection,
        colorRules,
        edgeEase,
        valueEase,
        bufferSize,
        topSize,
        bottomSize,
        leftSize,
        rightSize,
        dump,
    } = options;
    let _canvas = ctx?.canvas ?? document.createElement("canvas");
    if (f && !fx) fx = f;
    if (f && !fy) fy = f;
    if (options.id) {
        _canvas.id = options.id;
    }
    if (!edgeEase) edgeEase = (v) => v;
    if (!valueEase) valueEase = (v) => v;
    if (!ctx) {
        _canvas.width = w;
        _canvas.height = h;
    }
    if (!colorRules) {
        colorRules = [
            ...[...Array(255)].map((_, i) => {
                return {
                    min: i / 255,
                    max: (i + 1) / 255,
                    rgb: { r: i, g: i, b: i },
                };
            }),
        ];
    }
    // console.log(`colorRules:`, colorRules);
    // console.log(`colorRules:`, colorRules);
    let _ctx = ctx ?? _canvas.getContext("2d", { willReadFrequently: true });
    let imgData;
    if (ctx) {
        imgData = _ctx.getImageData(0, 0, w, h);
    } else {
        imgData = _ctx.createImageData(w, h);
    }
    let data = imgData.data;
    if (!bufferSize) bufferSize = Math.min(w, h) / 4;
    if (bufferSize) {
        if (!topSize) topSize = bufferSize;
        if (!bottomSize) bottomSize = bufferSize;
        if (!leftSize) leftSize = bufferSize;
        if (!rightSize) rightSize = bufferSize;
    }
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let isTop = y < topSize;
            let isBottom = y >= h - bottomSize;
            let isLeft = x < leftSize;
            let isRight = x >= w - rightSize;
            let tbRatio = 1;
            let lrRatio = 1;
            // projected x and y
            const _projection_w = projection ? projection.w : w;
            const _projection_h = projection ? projection.h : h;
            const px = projection ? project(x, 0, w, 0, _projection_w) : x;
            const py = projection ? project(y, 0, h, 0, _projection_h) : y;
            // console.log(`px, x, 0, w, 0, _projection_w:`, px, x, 0, w, 0, _projection_w);
            let v = noiseFunc(px, py, fx, fy, octaves);
            if (h / 2 === y && dump) console.log(`v:`, v);
            if (isTop) {
                tbRatio = y / topSize;
            } else if (isBottom) {
                tbRatio = (h - y) / bottomSize;
            }
            if (isLeft) {
                lrRatio = x / leftSize;
            } else if (isRight) {
                lrRatio = (w - x) / rightSize;
            }
            v =
                tbRatio > lrRatio
                    ? edgeEase(v * lrRatio)
                    : edgeEase(v * tbRatio);
            v = valueEase(v);
            // if (h / 2 === y && dump) console.log(`v:`, v);
            let i = (y * w + x) * 4;
            // data[i] = data[i + 1] = data[i + 2] = v * 255;
            applyColor(data, i, v, colorRules);
            data[i + 3] = 255;
        }
    }
    _ctx.putImageData(imgData, 0, 0);
    return _ctx.canvas;
}
function applyColor(data, i, v, colorRules) {
    if (colorRules) {
        let match = 0;
        data[i] = data[i + 1] = data[i + 2] = 0;
        colorRules.forEach((rule) => {
            if (v >= rule.min && v <= rule.max) {
                data[i] += rule.rgb.r;
                data[i + 1] += rule.rgb.g;
                data[i + 2] += rule.rgb.b;
                match++;
            }
        });
        if (match) {
            data[i] = Math.floor(data[i] / match);
            data[i + 1] = Math.floor(data[i + 1] / match);
            data[i + 2] = Math.floor(data[i + 2] / match);
        }
    }
}

function tileCanvas(width, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = 512; // Width of the canvas
    canvas.height = 512; // Height of the canvas
    document.body.appendChild(canvas);

    const noiseScale = 0.1; // Scale of the noise
    const tileW = canvas.width;
    const tileH = canvas.height;

    function generateTileableTexture() {
        for (let x = 0; x < tileW; x++) {
            for (let y = 0; y < tileH; y++) {
                // Convert pixel position to polar coordinates
                const angle = (x / tileW) * Math.PI * 2;
                const radius = (y / tileH) * Math.PI * 2;
                const { x: u, y: v } = polarToCartesian(radius, angle);

                // Use simplex noise to get a value based on polar coordinates
                const noiseValue = simplex.noise3D(
                    u * noiseScale,
                    v * noiseScale,
                    0,
                );

                // Normalize the noise value and convert to a color
                const color = (noiseValue + 1) * 0.5 * 255;

                let i = (y * width + x) * 4;
                data[i] = data[i + 1] = data[i + 2] = color;
                data[i + 3] = 255;
            }
        }
    }
}

function polarNoiseCanvas(width, height, scale, angleOffset, radialScale) {
    const noiseMap = [];
    const centerX = width / 2;
    const centerY = height / 2;

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            // Convert Cartesian (x, y) to Polar (r, theta)
            let dx = x - centerX;
            let dy = y - centerY;
            let r = Math.sqrt(dx * dx + dy * dy);
            let theta = Math.atan2(dy, dx);

            // Transform polar coordinates
            r /= radialScale; // Scale radius to change frequency
            theta += angleOffset; // Rotate by a constant or variable angle

            // Convert polar back to Cartesian (nx, ny) for noise sampling
            const nx = (r * Math.cos(theta)) / scale;
            const ny = (r * Math.sin(theta)) / scale;

            // Sample the noise function at transformed coordinates
            row.push(simplex.noise2D(nx, ny));
        }
        noiseMap.push(row);
    }
    return noiseMap;
}
