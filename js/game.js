'use strict';

const TAIL_T = 2.0;
const SPARK_GAP = 18;
const BLAST_R = 36;
const HOT_BLAST_R = 50;
const W = 960;
const H = 540;
const PAD = 36;
const PLAYER_R = 11;
const PLAYER_SPEED = 178;
const DASH_SPEED = 520;
const DASH_TIME = 0.13;
const DASH_CD = 0.42;
const ENEMY_R = 13;
const ENEMY_SPEED = 48;
const ENEMY_HP = 3;
const HEART_MAX = 3;
const HITSTOP = 0.08;
const IFRAMES = 0.95;

const NAMES = {
  title: '尾火',
  enemy: '烬卫',
  crate: '箱',
  core: '心核',
  heal: '回星',
  water: '水洼',
  spark: '焰辙',
  hint: '跑过的路两秒后会爆',
};

const COL = {
  bg: '#14080a',
  ember: '#ff6a1a',
  gold: '#ffd24a',
  water: '#3a6b8c',
  core: '#ff5d8f',
};

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function dist(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }
function lerp(a, b, t) { return a + (b - a) * t; }

function circleRect(cx, cy, cr, rx, ry, rw, rh) {
  const nx = clamp(cx, rx, rx + rw);
  const ny = clamp(cy, ry, ry + rh);
  return dist(cx, cy, nx, ny) <= cr;
}

function inWater(s, x, y) {
  for (let i = 0; i < s.waters.length; i++) {
    const w = s.waters[i];
    const dx = (x - w.x) / w.rx;
    const dy = (y - w.y) / w.ry;
    if (dx * dx + dy * dy <= 1) return true;
  }
  return false;
}

function sfx(name) {
  if (typeof AudioFx === 'undefined') return;
  const fn = AudioFx[name];
  if (fn) fn();
}

function makeState() {
  return {
    player: {
      x: 110, y: 430, r: PLAYER_R,
      vx: 0, vy: 0, faceX: 1, faceY: 0,
      dashT: 0, dashCd: 0, inv: 0, hearts: HEART_MAX,
    },
    lastSparkX: 110,
    lastSparkY: 430,
    sparks: [],
    enemies: [],
    crates: [],
    waters: [],
    items: [],
    parts: [],
    input: { x: 0, y: 0, dash: false },
    cam: { x: 0, y: 0, punch: 0 },
    hitstop: 0,
    flash: 0,
    won: false,
    dead: false,
    toast: '',
    toastT: 0,
    stats: { booms: 0, fizzles: 0, drops: 0 },
    time: 0,
  };
}

function resetRoom(s) {
  s.player.x = 110;
  s.player.y = 430;
  s.player.vx = 0;
  s.player.vy = 0;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.dashT = 0;
  s.player.dashCd = 0;
  s.player.inv = 0;
  s.player.hearts = HEART_MAX;
  s.lastSparkX = s.player.x;
  s.lastSparkY = s.player.y;
  s.sparks.length = 0;
  s.items.length = 0;
  s.parts.length = 0;
  s.won = false;
  s.dead = false;
  s.toast = '';
  s.toastT = 0;
  s.hitstop = 0;
  s.flash = 0;
  s.cam.x = 0;
  s.cam.y = 0;
  s.cam.punch = 0;
  s.time = 0;
  s.stats.booms = 0;
  s.stats.fizzles = 0;
  s.stats.drops = 0;
  s.waters = [
    { x: 250, y: 400, rx: 64, ry: 36 },
    { x: 750, y: 150, rx: 72, ry: 42 },
  ];
  s.crates = [
    { x: 430, y: 176, w: 36, h: 36, open: false, loot: null },
    { x: 474, y: 176, w: 36, h: 36, open: false, loot: 'core' },
    { x: 518, y: 176, w: 36, h: 36, open: false, loot: null },
    { x: 452, y: 220, w: 36, h: 36, open: false, loot: null },
    { x: 800, y: 410, w: 36, h: 36, open: false, loot: 'heal' },
    { x: 168, y: 168, w: 36, h: 36, open: false, loot: null },
  ];
  s.enemies = [
    { x: 490, y: 86, r: ENEMY_R, hp: ENEMY_HP, hitT: 0 },
    { x: 710, y: 280, r: ENEMY_R, hp: ENEMY_HP, hitT: 0 },
    { x: 880, y: 108, r: ENEMY_R, hp: ENEMY_HP, hitT: 0 },
    { x: 360, y: 500, r: ENEMY_R, hp: ENEMY_HP, hitT: 0 },
    { x: 830, y: 470, r: ENEMY_R, hp: ENEMY_HP, hitT: 0 },
  ];
}

function dropSpark(s, x, y, hot) {
  const wet = inWater(s, x, y);
  s.sparks.push({ x, y, t: TAIL_T, hot: !!hot, wet, dead: false });
  s.stats.drops += 1;
  return s.sparks[s.sparks.length - 1];
}

function layTrail(s, fromX, fromY, toX, toY, hot) {
  let x = s.lastSparkX;
  let y = s.lastSparkY;
  const dx = toX - x;
  const dy = toY - y;
  const d = Math.hypot(dx, dy);
  if (d < SPARK_GAP) return;
  const n = Math.floor(d / SPARK_GAP);
  for (let i = 1; i <= n; i++) {
    const t = (i * SPARK_GAP) / d;
    dropSpark(s, x + dx * t, y + dy * t, hot);
    s.lastSparkX = x + dx * t;
    s.lastSparkY = y + dy * t;
  }
}

function burst(s, x, y, n, color, speed) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const sp = speed * (0.55 + Math.random() * 0.7);
    s.parts.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      t: 0.28 + Math.random() * 0.22,
      max: 0.5,
      r: 2 + Math.random() * 3,
      color,
    });
  }
}

function punch(s, amt) {
  s.cam.punch = Math.max(s.cam.punch, amt);
}

function hurtPlayer(s, srcX, srcY) {
  const p = s.player;
  if (s.won || s.dead || p.inv > 0) return false;
  p.hearts -= 1;
  p.inv = IFRAMES;
  s.flash = 0.22;
  s.hitstop = HITSTOP;
  punch(s, 8);
  if (srcX != null) {
    const d = dist(p.x, p.y, srcX, srcY) || 1;
    p.x += ((p.x - srcX) / d) * 18;
    p.y += ((p.y - srcY) / d) * 18;
  }
  sfx('hurt');
  if (p.hearts <= 0) {
    p.hearts = 0;
    s.dead = true;
    s.toast = '失败';
    s.toastT = 99;
  }
  return true;
}

function explode(s, x, y, hot) {
  const r = hot ? HOT_BLAST_R : BLAST_R;
  s.stats.booms += 1;
  burst(s, x, y, hot ? 14 : 10, hot ? COL.gold : COL.ember, hot ? 220 : 170);
  punch(s, hot ? 6 : 4);
  sfx('boom');

  const p = s.player;
  if (!s.won && !s.dead && dist(p.x, p.y, x, y) <= r + p.r) {
    hurtPlayer(s, x, y);
  }

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    if (dist(e.x, e.y, x, y) <= r + e.r) {
      e.hp -= hot ? 2 : 1;
      e.hitT = 0.18;
      const d = dist(e.x, e.y, x, y) || 1;
      e.x += ((e.x - x) / d) * 22;
      e.y += ((e.y - y) / d) * 22;
      s.hitstop = Math.max(s.hitstop, HITSTOP);
      if (e.hp <= 0) burst(s, e.x, e.y, 8, COL.ember, 140);
    }
  }

  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    if (circleRect(x, y, r, c.x, c.y, c.w, c.h)) {
      c.open = true;
      sfx('open');
      burst(s, c.x + c.w * 0.5, c.y + c.h * 0.5, 7, COL.gold, 120);
      if (c.loot) {
        s.items.push({
          kind: c.loot,
          x: c.x + c.w * 0.5,
          y: c.y + c.h * 0.5,
          r: 10,
          taken: false,
        });
      }
    }
  }
}

function updateSparks(s, dt) {
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead) continue;
    k.t -= dt;
    if (k.t > 0) continue;
    k.dead = true;
    if (k.wet) {
      s.stats.fizzles += 1;
      burst(s, k.x, k.y, 5, COL.water, 70);
      sfx('fizzle');
    } else {
      explode(s, k.x, k.y, k.hot);
    }
  }
  if (s.sparks.length > 80) {
    s.sparks = s.sparks.filter((k) => !k.dead);
  }
}

function update(s, dt) {
  s.time += dt;
  if (s.toastT > 0) s.toastT -= dt;
  if (s.flash > 0) s.flash -= dt;
  if (s.cam.punch > 0) {
    s.cam.punch *= Math.pow(0.04, dt);
    if (s.cam.punch < 0.08) s.cam.punch = 0;
    s.cam.x = (Math.random() - 0.5) * 2 * s.cam.punch;
    s.cam.y = (Math.random() - 0.5) * 2 * s.cam.punch;
  } else {
    s.cam.x = 0;
    s.cam.y = 0;
  }

  if (s.hitstop > 0) {
    s.hitstop -= dt;
    for (let i = 0; i < s.parts.length; i++) s.parts[i].t -= dt;
    return;
  }

  for (let i = s.parts.length - 1; i >= 0; i--) {
    const q = s.parts[i];
    q.t -= dt;
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.vx *= 0.9;
    q.vy *= 0.9;
    if (q.t <= 0) s.parts.splice(i, 1);
  }

  if (s.won || s.dead) {
    updateSparks(s, dt);
    return;
  }

  const p = s.player;
  if (p.inv > 0) p.inv -= dt;
  if (p.dashCd > 0) p.dashCd -= dt;

  let ix = s.input.x;
  let iy = s.input.y;
  const il = Math.hypot(ix, iy);
  if (il > 1) { ix /= il; iy /= il; }
  if (il > 0.12) {
    p.faceX = ix;
    p.faceY = iy;
  }

  if (s.input.dash && p.dashT <= 0 && p.dashCd <= 0) {
    p.dashT = DASH_TIME;
    p.dashCd = DASH_CD;
    s.input.dash = false;
    sfx('dash');
  }

  const moving = p.dashT > 0 || il > 0.12;
  const hot = p.dashT > 0;
  if (p.dashT > 0) {
    p.dashT -= dt;
    p.vx = p.faceX * DASH_SPEED;
    p.vy = p.faceY * DASH_SPEED;
  } else {
    p.vx = ix * PLAYER_SPEED;
    p.vy = iy * PLAYER_SPEED;
  }

  const ox = p.x;
  const oy = p.y;
  p.x += p.vx * dt;
  p.y += p.vy * dt;

  if (p.x - p.r < PAD || p.x + p.r > W - PAD || p.y - p.r < PAD || p.y + p.r > H - PAD) {
    p.x = clamp(p.x, PAD + p.r, W - PAD - p.r);
    p.y = clamp(p.y, PAD + p.r, H - PAD - p.r);
    hurtPlayer(s, clamp(ox, PAD + p.r, W - PAD - p.r), clamp(oy, PAD + p.r, H - PAD - p.r));
  }

  if (moving) layTrail(s, ox, oy, p.x, p.y, hot);
  else {
    s.lastSparkX = p.x;
    s.lastSparkY = p.y;
  }

  updateSparks(s, dt);

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    if (e.hitT > 0) e.hitT -= dt;
    const d = dist(e.x, e.y, p.x, p.y) || 1;
    e.x += ((p.x - e.x) / d) * ENEMY_SPEED * dt;
    e.y += ((p.y - e.y) / d) * ENEMY_SPEED * dt;
    e.x = clamp(e.x, PAD + e.r, W - PAD - e.r);
    e.y = clamp(e.y, PAD + e.r, H - PAD - e.r);
    if (dist(e.x, e.y, p.x, p.y) < e.r + p.r - 1) hurtPlayer(s, e.x, e.y);
  }

  for (let i = 0; i < s.items.length; i++) {
    const it = s.items[i];
    if (it.taken) continue;
    if (dist(it.x, it.y, p.x, p.y) > it.r + p.r) continue;
    it.taken = true;
    if (it.kind === 'core') {
      s.won = true;
      s.toast = '过关';
      s.toastT = 99;
      sfx('win');
      burst(s, it.x, it.y, 16, COL.core, 200);
    } else if (it.kind === 'heal') {
      p.hearts = Math.min(HEART_MAX, p.hearts + 1);
      s.toast = NAMES.heal;
      s.toastT = 1.1;
      sfx('heal');
    }
  }
}

function hexRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function mixHex(a, b, t) {
  const A = hexRgb(a);
  const B = hexRgb(b);
  const r = Math.round(lerp(A[0], B[0], t));
  const g = Math.round(lerp(A[1], B[1], t));
  const bl = Math.round(lerp(A[2], B[2], t));
  return 'rgb(' + r + ',' + g + ',' + bl + ')';
}

function glow(ctx, x, y, r, color, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = a;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function draw(s, ctx) {
  ctx.save();
  ctx.translate(s.cam.x, s.cam.y);
  ctx.fillStyle = COL.bg;
  ctx.fillRect(-20, -20, W + 40, H + 40);

  ctx.strokeStyle = 'rgba(255,106,26,0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, PAD, W - PAD * 2, H - PAD * 2);

  ctx.strokeStyle = 'rgba(255,210,74,0.05)';
  ctx.lineWidth = 1;
  for (let x = PAD + 40; x < W - PAD; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, PAD);
    ctx.lineTo(x, H - PAD);
    ctx.stroke();
  }
  for (let y = PAD + 40; y < H - PAD; y += 40) {
    ctx.beginPath();
    ctx.moveTo(PAD, y);
    ctx.lineTo(W - PAD, y);
    ctx.stroke();
  }

  for (let i = 0; i < s.waters.length; i++) {
    const w = s.waters[i];
    ctx.save();
    ctx.translate(w.x, w.y);
    ctx.scale(w.rx, w.ry);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(58,107,140,0.55)';
    ctx.fill();
    ctx.lineWidth = 1 / w.rx;
    ctx.strokeStyle = 'rgba(180,220,240,0.35)';
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = 'rgba(200,230,255,0.55)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(NAMES.water, w.x, w.y + 4);
  }

  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) {
      ctx.strokeStyle = 'rgba(255,210,74,0.25)';
      ctx.strokeRect(c.x + 4, c.y + 4, c.w - 8, c.h - 8);
      continue;
    }
    ctx.fillStyle = '#3a2218';
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = COL.gold;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(c.x + 1, c.y + 1, c.w - 2, c.h - 2);
    ctx.fillStyle = COL.gold;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(NAMES.crate, c.x + c.w / 2, c.y + c.h / 2 + 4);
  }

  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead) continue;
    const age = 1 - k.t / TAIL_T;
    const swell = k.hot ? 5 + 9 * age * age : 3.2 + 7 * age * age;
    const col = k.wet ? COL.water : mixHex(COL.ember, COL.gold, age * age);
    glow(ctx, k.x, k.y, swell * 3.2, col, 0.22 + age * 0.45);
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.arc(k.x, k.y, swell, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < s.items.length; i++) {
    const it = s.items[i];
    if (it.taken) continue;
    const pulse = 1 + Math.sin(s.time * 8) * 0.12;
    if (it.kind === 'core') {
      glow(ctx, it.x, it.y, 22 * pulse, COL.core, 0.7);
      ctx.fillStyle = COL.core;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 8 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff0f5';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.core, it.x, it.y - 16);
    } else {
      glow(ctx, it.x, it.y, 18, COL.gold, 0.5);
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.heal, it.x, it.y - 14);
    }
  }

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    const flash = e.hitT > 0;
    glow(ctx, e.x, e.y, 22, COL.ember, 0.18);
    ctx.beginPath();
    ctx.fillStyle = flash ? COL.gold : '#2a1410';
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COL.ember;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = COL.ember;
    ctx.beginPath();
    ctx.arc(e.x - 4, e.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(e.x + 4, e.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COL.gold;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(NAMES.enemy, e.x, e.y + e.r + 12);
    for (let h = 0; h < ENEMY_HP; h++) {
      ctx.fillStyle = h < e.hp ? COL.ember : 'rgba(255,106,26,0.2)';
      ctx.fillRect(e.x - 10 + h * 8, e.y + e.r + 14, 6, 3);
    }
  }

  const p = s.player;
  const blink = p.inv > 0 && Math.floor(s.time * 16) % 2 === 0;
  if (!blink) {
    glow(ctx, p.x, p.y, 26, COL.ember, 0.55);
    ctx.beginPath();
    ctx.fillStyle = '#fff3d6';
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COL.gold;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = COL.ember;
    ctx.arc(p.x + p.faceX * 3, p.y + p.faceY * 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < s.parts.length; i++) {
    const q = s.parts[i];
    ctx.globalAlpha = clamp(q.t / 0.35, 0, 1);
    ctx.fillStyle = q.color;
    ctx.beginPath();
    ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  if (s.flash > 0) {
    ctx.fillStyle = 'rgba(255,40,60,' + (s.flash * 1.4) + ')';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.restore();
}

function bindInput(s, canvas, stick, knob, dashBtn, touchRoot) {
  const keys = new Set();
  function syncKeys() {
    let x = 0;
    let y = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) y -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) y += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
    if (!stick.active) {
      s.input.x = x;
      s.input.y = y;
    }
  }

  window.addEventListener('keydown', (e) => {
    if (typeof AudioFx !== 'undefined') AudioFx.unlock();
    keys.add(e.code);
    if (e.code === 'Space') {
      e.preventDefault();
      s.input.dash = true;
    }
    if (e.code === 'KeyR') resetRoom(s);
    syncKeys();
  });
  window.addEventListener('keyup', (e) => {
    keys.delete(e.code);
    if (e.code === 'Space') s.input.dash = false;
    syncKeys();
  });

  let mouseOn = false;
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    mouseOn = true;
    aimMouse(e);
  });
  window.addEventListener('pointerup', () => {
    if (mouseOn) {
      mouseOn = false;
      if (!stick.active) { s.input.x = 0; s.input.y = 0; syncKeys(); }
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (mouseOn) aimMouse(e);
  });

  function aimMouse(e) {
    const world = screenToWorld(canvas, e.clientX, e.clientY);
    const dx = world.x - s.player.x;
    const dy = world.y - s.player.y;
    const d = Math.hypot(dx, dy);
    if (d > 8) {
      s.input.x = dx / d;
      s.input.y = dy / d;
    }
  }

  stick.active = false;
  let stickId = null;
  function setKnob(nx, ny) {
    knob.style.transform = 'translate(' + (nx * 28) + 'px,' + (ny * 28) + 'px)';
  }
  function stickAt(cx, cy) {
    const rec = stick.getBoundingClientRect();
    const x = (cx - (rec.left + rec.width / 2)) / (rec.width * 0.5);
    const y = (cy - (rec.top + rec.height / 2)) / (rec.height * 0.5);
    const d = Math.hypot(x, y);
    const cl = d > 1 ? 1 / d : 1;
    s.input.x = x * cl;
    s.input.y = y * cl;
    setKnob(s.input.x, s.input.y);
  }
  stick.addEventListener('pointerdown', (e) => {
    if (typeof AudioFx !== 'undefined') AudioFx.unlock();
    stick.active = true;
    stickId = e.pointerId;
    stick.setPointerCapture(e.pointerId);
    stickAt(e.clientX, e.clientY);
  });
  stick.addEventListener('pointermove', (e) => {
    if (stick.active && e.pointerId === stickId) stickAt(e.clientX, e.clientY);
  });
  function endStick() {
    stick.active = false;
    stickId = null;
    s.input.x = 0;
    s.input.y = 0;
    setKnob(0, 0);
    syncKeys();
  }
  stick.addEventListener('pointerup', endStick);
  stick.addEventListener('pointercancel', endStick);

  dashBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (typeof AudioFx !== 'undefined') AudioFx.unlock();
    s.input.dash = true;
  });
  dashBtn.addEventListener('pointerup', () => { s.input.dash = false; });

  window.addEventListener('touchstart', () => {
    touchRoot.hidden = false;
  }, { once: true, passive: true });
}

let view = { scale: 1, ox: 0, oy: 0, dpr: 1 };

function fitCanvas(canvas) {
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const ww = wrap.clientWidth;
  const hh = wrap.clientHeight;
  canvas.width = Math.floor(ww * dpr);
  canvas.height = Math.floor(hh * dpr);
  view.dpr = dpr;
  view.scale = Math.min(ww / W, hh / H);
  view.ox = (ww - W * view.scale) / 2;
  view.oy = (hh - H * view.scale) / 2;
}

function screenToWorld(canvas, cx, cy) {
  const rec = canvas.getBoundingClientRect();
  const x = cx - rec.left;
  const y = cy - rec.top;
  return {
    x: (x - view.ox) / view.scale,
    y: (y - view.oy) / view.scale,
  };
}

function syncHud(s, heartsEl, toastEl) {
  heartsEl.textContent = '心×' + s.player.hearts;
  if (s.toast && (s.toastT > 0 || s.won || s.dead)) {
    toastEl.hidden = false;
    toastEl.textContent = s.toast + ((s.won || s.dead) ? '  ·  R 再玩' : '');
  } else {
    toastEl.hidden = true;
  }
}

function boot() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const heartsEl = document.getElementById('hearts');
  const toastEl = document.getElementById('toast');
  const stick = document.getElementById('stick');
  const knob = document.getElementById('knob');
  const dashBtn = document.getElementById('dashBtn');
  const touchRoot = document.getElementById('touch');
  const s = makeState();
  resetRoom(s);
  bindInput(s, canvas, stick, knob, dashBtn, touchRoot);
  fitCanvas(canvas);
  window.addEventListener('resize', () => fitCanvas(canvas));
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    touchRoot.hidden = false;
  }

  let last = performance.now();
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.033);
    last = now;
    update(s, dt);
    const dpr = view.dpr;
    ctx.setTransform(dpr * view.scale, 0, 0, dpr * view.scale, dpr * view.ox, dpr * view.oy);
    draw(s, ctx);
    syncHud(s, heartsEl, toastEl);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function selfCheck() {
  if (TAIL_T !== 2) throw new Error('TAIL_T must be 2');

  const need = ['尾火', '烬卫', '箱', '心核', '回星', '水洼', '焰辙'];
  const blob = Object.keys(NAMES).map((k) => NAMES[k]).join('');
  for (let i = 0; i < need.length; i++) {
    if (blob.indexOf(need[i]) < 0) throw new Error('missing name ' + need[i]);
    if (!/[\u4e00-\u9fff]/.test(need[i])) throw new Error('not Chinese');
  }
  if (NAMES.hint !== '跑过的路两秒后会爆') throw new Error('hint');

  const banned = [
    '\u4f20\u9001',
    '\u98de\u884c',
    '\u4e09\u53c9\u621f',
    '\u6fc0\u6012',
    '\u5929\u4f7f',
    '\u6076\u9b54',
  ];
  const scan = blob + NAMES.hint + '尾火过关失败';
  for (let i = 0; i < banned.length; i++) {
    if (scan.indexOf(banned[i]) >= 0) throw new Error('banned');
  }

  const wet = makeState();
  resetRoom(wet);
  const puddle = wet.waters[0];
  dropSpark(wet, puddle.x, puddle.y, false);
  if (!wet.sparks[0].wet) throw new Error('spark in water should be wet');
  for (let i = 0; i < 24; i++) update(wet, 0.1);
  if (wet.stats.fizzles < 1) throw new Error('water should fizzle');
  if (wet.stats.booms !== 0) throw new Error('water must not boom');

  const dry = makeState();
  resetRoom(dry);
  dropSpark(dry, 120, 120, false);
  for (let i = 0; i < 24; i++) update(dry, 0.1);
  if (dry.stats.booms < 1) throw new Error('dry spark should boom at TAIL_T');

  const still = makeState();
  resetRoom(still);
  still.input.x = 0;
  still.input.y = 0;
  for (let i = 0; i < 20; i++) update(still, 0.05);
  if (still.sparks.length !== 0 || still.stats.drops !== 0) {
    throw new Error('standing drops 0');
  }

  const run = makeState();
  resetRoom(run);
  run.input.x = 1;
  run.input.y = 0;
  for (let i = 0; i < 20; i++) update(run, 0.05);
  if (run.stats.drops < 1) throw new Error('moving should drop sparks');

  console.log('selfCheck ok', {
    TAIL_T,
    names: NAMES,
    fizzles: wet.stats.fizzles,
    standDrops: still.stats.drops,
  });
}

if (typeof window === 'undefined') {
  selfCheck();
} else if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
