/* 尾火 · 音效。纯 WebAudio，无 CDN。首次手势才 resume。 */
(function (global) {
  "use strict";

  var ctx = null;
  var armed = false;

  function AudioCtor() {
    return global.AudioContext || global.webkitAudioContext;
  }

  function getCtx() {
    var AC = AudioCtor();
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") {
      var p = ctx.resume();
      if (p && p.catch) p.catch(function () {});
    }
    return ctx;
  }

  function onFirstGesture() {
    getCtx();
  }

  function arm() {
    if (armed) return;
    armed = true;
    global.addEventListener("pointerdown", onFirstGesture, { once: true, passive: true });
    global.addEventListener("keydown", onFirstGesture, { once: true });
    global.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });
  }

  function envGain(c, peak, dur, t) {
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(c.destination);
    return g;
  }

  function tone(freq, dur, type, peak, when, slide) {
    var c = getCtx();
    if (!c) return;
    var t = when == null ? c.currentTime : when;
    var osc = c.createOscillator();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t);
    if (slide != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur);
    }
    osc.connect(envGain(c, peak, dur, t));
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  function noise(dur, peak, when, cutoff) {
    var c = getCtx();
    if (!c) return;
    var t = when == null ? c.currentTime : when;
    var n = Math.max(1, (c.sampleRate * dur) | 0);
    var buf = c.createBuffer(1, n, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource();
    src.buffer = buf;
    var filt = c.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(cutoff || 1800, t);
    var g = envGain(c, peak, dur, t);
    src.connect(filt);
    filt.connect(g);
    src.start(t);
    src.stop(t + dur + 0.03);
  }

  function beep() {
    tone(880, 0.07, "square", 0.08);
  }

  function explode() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime;
    noise(0.22, 0.28, t, 2400);
    tone(180, 0.18, "sawtooth", 0.16, t, 55);
    tone(420, 0.08, "square", 0.06, t);
  }

  function dash() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime;
    tone(220, 0.12, "sawtooth", 0.1, t, 620);
    noise(0.08, 0.08, t, 3200);
  }

  function hurt() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime;
    tone(140, 0.22, "square", 0.14, t, 60);
    noise(0.12, 0.1, t, 800);
  }

  function win() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime;
    tone(523, 0.12, "triangle", 0.1, t);
    tone(659, 0.12, "triangle", 0.1, t + 0.1);
    tone(784, 0.18, "triangle", 0.12, t + 0.2);
    tone(1046, 0.28, "sine", 0.1, t + 0.32);
  }

  function pickup() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime;
    tone(660, 0.08, "triangle", 0.09, t);
    tone(990, 0.12, "sine", 0.08, t + 0.06);
  }

  function fizzle() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime;
    noise(0.2, 0.07, t, 900);
    tone(320, 0.16, "sine", 0.05, t, 90);
  }

  arm();

  global.WeiHuoAudio = {
    beep: beep,
    explode: explode,
    dash: dash,
    hurt: hurt,
    win: win,
    pickup: pickup,
    fizzle: fizzle
  };
})(typeof window !== "undefined" ? window : this);
