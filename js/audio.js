'use strict';

const AudioFx = (() => {
  let ctx = null;

  function ac() {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function beep(freq, dur, type, vol, slide) {
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
    g.gain.setValueAtTime(vol || 0.06, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise(dur, vol, hp) {
    const c = ac();
    if (!c) return;
    const n = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, n, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = hp || 900;
    const g = c.createGain();
    g.gain.value = vol || 0.08;
    src.connect(f);
    f.connect(g);
    g.connect(c.destination);
    src.start();
  }

  return {
    unlock() { ac(); },
    dash() { beep(420, 0.08, 'sawtooth', 0.05, 180); },
    boom() { noise(0.16, 0.1, 700); beep(140, 0.12, 'triangle', 0.07, 60); },
    fizzle() { beep(720, 0.07, 'sine', 0.035, 220); },
    hurt() { beep(220, 0.16, 'square', 0.07, 80); },
    heal() { beep(520, 0.1, 'sine', 0.05, 780); },
    win() { beep(440, 0.1, 'sine', 0.06); setTimeout(() => beep(660, 0.18, 'sine', 0.06), 90); },
    open() { beep(180, 0.06, 'triangle', 0.04, 90); },
  };
})();
