/*
  CanvasFramePlayer
  - Fixed 64x64 canvas, 1:1 pixel ratio (no DPR upscaling)
  - If a frame has `text`, auto-cycles through ALL frames with the same text
    until user clicks. Text stays overlaid the whole time.
  - Permanent click listener; per-frame logic is swapped via _clickLogic.
  - Optional SFX: frame.sfx -> if SFX[frame.sfx] exists, runs zzfx(...SFX[frame.sfx])
*/
class CanvasFramePlayer {
  constructor(targetCanvas, frames = [], fps = 12, onDone = () => {}) {
    this.onDone = onDone;
    this.target = targetCanvas;
    this._forceFixed64(); // <<< lock size & pixel ratio

    this.ctx = targetCanvas.getContext('2d', { alpha: true, desynchronize: true });
    this.ctx.imageSmoothingEnabled = false;

    this._musicPlayer = null; // <---- NEW: keep track of zzfxM player instance

    this.frames = frames;
    this.fps = Math.max(1, fps | 0);
    this.defaultInterval = 1000 / this.fps;

    this.loop = false;

    this._i = 0;
    this._running = false;
    this._lastTs = 0;

    this._buildTextMap();

    // timing per frame
    this._frameEndsAt = 0;
    this._textEndsAt = 0;

    // text-group state (active while looping among same-text frames)
    this._group = null; // { text, indices: number[], active: true/false }

    // click handling (permanent listener)
    this._awaitingClick = false;      // for legacy clickToProgress frames
    this._clickLogic = null;          // swapped per frame / group
    this._onClick = (ev) => {
      if (typeof this._clickLogic === 'function') this._clickLogic(ev);
    };
    this.target.addEventListener('click', this._onClick, { once: false });

    // pre-rendered text canvas for current frame
    this._textCanvas = null;

    if (this.frames.length) this._enterFrame(0, this._lastTs);
  }

  // --- fixed-size setup ---
  _forceFixed64() {
    // Backing store size
    this.target.width = 64;
    this.target.height = 64;
    // CSS box size
    this.target.style.width = '64px';
    this.target.style.height = '64px';
    // Keep pixels sharp when scaled by browser/compositor
    this.target.style.imageRendering = 'pixelated';
    this.target.style.imageRendering = 'crisp-edges'; // fallback/alt keyword
  }

  _buildTextMap() {
    this.textMap = {};
    (this.frames || []).forEach((n, i) => {
      const key = n && n.text != null ? String(n.text) : null;
      if (!key) return;
      if (!this.textMap[key]) this.textMap[key] = [];
      this.textMap[key].push(i);
    });
  }

  setFrames(frames) {
    this.frames = frames || [];
    this._buildTextMap();
    this._group = null;
    this._i = 0;
    if (this.frames.length) this._enterFrame(0, this._lastTs);
  }

  setFPS(fps) {
    this.fps = Math.max(1, fps | 0);
    this.defaultInterval = 1000 / this.fps;
  }

  update(time) {
    const tick = (ts) => {
      if (!this._running) return;
      this._draw(ts);

      // auto-advance logic:
      if (this._group && this._group.active) {
        if (ts >= this._frameEndsAt) this._advanceWithinGroup(ts);
      } else {
        if (!this._awaitingClick && ts >= this._frameEndsAt) {
          this._advanceFrame(ts);
        }
      }

    };
    tick(time);
  }

  play() {
    if (this._running || !this.frames.length) return;
    this._running = true;
  }

  pause() {
    this._running = false;
  }

  stop() {
    this.pause();
    this._group = null;
    this._i = 0;
    if (this.frames.length) this._enterFrame(0, this._lastTs);
  }

  goto(index) {
    if (!this.frames.length) return;
    const ts = this._lastTs;
    const i = Math.max(0, Math.min(index | 0, this.frames.length - 1));
    this._group = null;
    this._enterFrame(i, ts);
    this._draw(ts);
  }

  next() { this._advanceFrame(this._lastTs); }

  // --- internals ---
  _enterFrame(index, ts) {
    // reset per-frame state (do NOT remove the click listener)
    this._awaitingClick = false;
    this._clickLogic = null;

    // --- stop any previous zzfxM music if it was playing ---
    if (this._musicPlayer && typeof this._musicPlayer.stop === 'function') {
      try { this._musicPlayer.stop(); } catch(_) {}
      this._musicPlayer = null;
    }

    this._i = index;
    const f = this.frames[this._i] || {};
    const dur = (f.duration > 0 ? f.duration : this.defaultInterval);
    this._frameEndsAt = ts + dur;

    // --- SFX support (unchanged) ---
    if (f.sfx && typeof f.sfx === 'string' && typeof SFX !== 'undefined' && SFX && SFX[f.sfx]) {
      try { zzfx(...SFX[f.sfx]); } catch (err) { console.warn('SFX error:', err); }
    }
    // --- ZZFXM MUSIC support (NEW) ---
    if (f.zzfxM && typeof f.zzfxM === 'string'
        && typeof ZZFXM_MUSIC !== 'undefined'
        && ZZFXM_MUSIC[f.zzfxM]) {
          // debugger;
      try {
        // zzfxM(data, volume?, tempo?, returnPlayer?)
        // returnPlayer=true makes it return a player control object
        // this._musicPlayer = zzfxM(ZZFXM_MUSIC[f.zzfxM], 1, 1, true);
        
        const songBuffer = zzfxM(...ZZFXM_MUSIC[f.zzfxM]);
        this._musicPlayer = zzfxP(...songBuffer);
      }
      catch (err) { console.warn('zzfxM error:', err); }
    }

    // prepare text overlay
    this._textCanvas = null;
    const hasText = !!f.text;
    if (hasText) {
      try { this._textCanvas = PIXEL_TEXT.textCanvas(String(f.text)); }
      catch (_) { this._textCanvas = null; }
      const tdur = (f.textDuration > 0 ? f.textDuration : dur);
      this._textEndsAt = ts + tdur;
    } else {
      this._textEndsAt = ts;
    }

    // text-group handling
    if (hasText) {
      const key = String(f.text);
      const indices = (this.textMap[key] || []).slice().sort((a, b) => a - b);
      this._group = { text: key, indices, active: true };

      this._textEndsAt = Number.POSITIVE_INFINITY;
      this._clickLogic = () => {
        if (!this._group || !this._group.active) return;
        this._group.active = false;

        // --- stop music when exiting the group ---
        if (this._musicPlayer && typeof this._musicPlayer.stop === 'function') {
          try { this._musicPlayer.stop(); } catch(_) {}
          this._musicPlayer = null;
        }

        const lastIdx = this._group.indices[this._group.indices.length - 1];
        let next = lastIdx + 1;
        if (next >= this.frames.length) {
          if (!this.loop) {
            this.pause();
            this.onDone();
            return;
          }
          next = 0;
        }
        this._enterFrame(next, this._lastTs);
      };
    } else {
      this._group = null;
      if (f.clickToProgress) {
        this._awaitingClick = true;
        this._clickLogic = () => {
          if (this._awaitingClick) {
            this._awaitingClick = false;
            this._advanceFrame(this._lastTs);
          }
        };
      }
    }
  }

  _advanceWithinGroup(ts) {
    if (!this._group || !this._group.active) return;

    const group = this._group;
    const idx = group.indices.indexOf(this._i);
    const nextInGroup = group.indices[(idx + 1) % group.indices.length];
    const target = (idx === -1) ? group.indices[0] : nextInGroup;

    // move to next frame in the same-text group
    this._i = target;
    const f = this.frames[this._i] || {};
    const dur = (f.duration > 0 ? f.duration : this.defaultInterval);
    this._frameEndsAt = ts + dur;

    // --- SFX support on intra-group advance ---
    if (f.sfx && typeof f.sfx === 'string' && typeof SFX !== 'undefined' && SFX && SFX[f.sfx]) {
      try { zzfx(...SFX[f.sfx]); } catch (err) { console.warn('SFX error:', err); }
    }

    // keep text overlay alive while in group
    if (f.text) {
      try { this._textCanvas = PIXEL_TEXT.textCanvas(String(f.text)); } catch (_) { /* keep previous */ }
    }
    this._textEndsAt = Number.POSITIVE_INFINITY;
  }


  _advanceFrame(ts) {
    let next = this._i + 1;
    if (next >= this.frames.length) {
      if (!this.loop) {
        this.pause();
        this.onDone();
        return;
      }
      next = 0;
    }
    this._enterFrame(next, ts);
  }

  _draw(ts) {
    const f = this.frames[this._i];
    if (!f || !f.canvas) return;

    // Ensure fixed size & identity transform every draw (defensive)
    if (this.target.width !== 64 || this.target.height !== 64) {
      this._forceFixed64();
    }
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.imageSmoothingEnabled = false;

    const tw = 64, th = 64;
    const { width: sw, height: sh } = f.canvas;

    // Fit-to-cover inside 64x64, integer rounding to avoid subpixel blur
    const scale = Math.min(tw / sw, th / sh);
    const dw = (sw * scale) | 0;
    const dh = (sh * scale) | 0;
    const dx = ((tw - dw) / 2) | 0;
    const dy = ((th - dh) / 2) | 0;

    this.ctx.clearRect(0, 0, tw, th);
    this.ctx.drawImage(f.canvas, 0, 0, sw, sh, dx, dy, dw, dh);

    // overlay text canvas while active (Infinity during group mode)
    if (this._textCanvas && ts < this._textEndsAt) {
      const tc = this._textCanvas;
      const pad = 1;
      const maxW = Math.min(tw - pad * 2, tc.width);
      const textScale = Math.min(1, maxW / tc.width);
      const tdw = (tc.width * textScale) | 0;
      const tdh = (tc.height * textScale) | 0;
      const tdx = ((tw - tdw) / 2) | 0;
      const tdy = th - tdh - pad;

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(tdx - pad, tdy - pad, tdw + pad * 2, tdh + pad * 2);
      this.ctx.globalAlpha = 1;
      // this.ctx.drawImage(tc, 0, 0, tc.width, tc.height, tdx, tdy, tdw, tdh);
      this.ctx.drawImage(tc, tdx, tdy);
    }
  }
}
