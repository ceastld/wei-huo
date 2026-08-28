'use strict';

const TAIL_T = 2.0;
const SPARK_GAP = 18;
const BLAST_R = 40;
const HOT_BLAST_R = 68;
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
const CRATE_S = 40;

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
  ash: '#6b5344',
  heart: '#ff5d8f',
};

const ROOM_NAMES = ['空场', '追者', '水巷', '箱巷', '夹道', '夜市'];

let ROOM_PACK = null;

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function dist(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }
function lerp(a, b, t) { return a + (b - a) * t; }

function prefersReduce() {
  try {
    return !!(typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (err) {
    return false;
  }
}

function audioApi() {
  if (typeof window !== 'undefined' && window.WeiHuoAudio) return window.WeiHuoAudio;
  if (typeof WeiHuoAudio !== 'undefined') return WeiHuoAudio;
  if (typeof window !== 'undefined' && window.AudioFx) return window.AudioFx;
  if (typeof AudioFx !== 'undefined') return AudioFx;
  return null;
}

function unlockAudio() {
  const api = audioApi();
  if (api && typeof api.unlock === 'function') api.unlock();
}

function sfx(name) {
  const api = audioApi();
  if (!api) return;
  const alias = { boom: 'explode', heal: 'pickup', open: 'beep' };
  const key = alias[name] || name;
  if (typeof api[key] === 'function') api[key]();
  else if (typeof api[name] === 'function') api[name]();
}

function circleRect(cx, cy, cr, rx, ry, rw, rh) {
  const nx = clamp(cx, rx, rx + rw);
  const ny = clamp(cy, ry, ry + rh);
  return dist(cx, cy, nx, ny) <= cr;
}

function inWater(s, x, y) {
  for (let i = 0; i < s.waters.length; i++) {
    const w = s.waters[i];
    if (x >= w.x && x <= w.x + w.w && y >= w.y && y <= w.y + w.h) return true;
  }
  return false;
}

function separateCircleRect(ent, rx, ry, rw, rh) {
  const nx = clamp(ent.x, rx, rx + rw);
  const ny = clamp(ent.y, ry, ry + rh);
  let dx = ent.x - nx;
  let dy = ent.y - ny;
  let d = Math.hypot(dx, dy);
  if (d < 1e-4) {
    const left = ent.x - rx;
    const right = rx + rw - ent.x;
    const top = ent.y - ry;
    const bot = ry + rh - ent.y;
    const m = Math.min(left, right, top, bot);
    if (m === left) ent.x = rx - ent.r;
    else if (m === right) ent.x = rx + rw + ent.r;
    else if (m === top) ent.y = ry - ent.r;
    else ent.y = ry + rh + ent.r;
    return true;
  }
  if (d < ent.r) {
    const pen = ent.r - d;
    ent.x += (dx / d) * pen;
    ent.y += (dy / d) * pen;
    return true;
  }
  return false;
}

function blockCrates(s, ent) {
  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    separateCircleRect(ent, c.x, c.y, c.w, c.h);
  }
}

function makeState() {
  return {
    roomIndex: 0,
    room: null,
    roomW: 720,
    roomH: 480,
    player: {
      x: 96, y: 240, r: PLAYER_R,
      vx: 0, vy: 0, faceX: 1, faceY: 0,
      dashT: 0, dashCd: 0, inv: 0, hearts: HEART_MAX,
      squash: 0,
    },
    lastSparkX: 96,
    lastSparkY: 240,
    sparks: [],
    enemies: [],
    crates: [],
    waters: [],
    items: [],
    parts: [],
    swells: [],
    input: { x: 0, y: 0, dash: false },
    cam: { x: 0, y: 0, punch: 0, dx: 1, dy: 0 },
    hitstop: 0,
    flash: 0,
    won: false,
    dead: false,
    cleared: false,
    advanceT: 0,
    toast: '',
    toastT: 0,
    toastTone: 'gold',
    stats: { booms: 0, fizzles: 0, drops: 0 },
    time: 0,
    reduce: prefersReduce(),
  };
}

function lootKind(drop) {
  if (drop === '心核' || drop === 'core') return 'core';
  if (drop === '回星' || drop === 'heal') return 'heal';
  return null;
}

function applyRoom(s, index) {
  const rooms = ROOM_PACK.rooms;
  const i = ((index % rooms.length) + rooms.length) % rooms.length;
  const room = rooms[i];
  const crateS = (ROOM_PACK.defaults && ROOM_PACK.defaults.crate) || CRATE_S;
  s.roomIndex = i;
  s.room = room;
  s.roomW = room.size.w;
  s.roomH = room.size.h;
  s.player.x = room.player.x;
  s.player.y = room.player.y;
  s.player.r = PLAYER_R;
  s.player.vx = 0;
  s.player.vy = 0;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.dashT = 0;
  s.player.dashCd = 0;
  s.player.inv = 0;
  s.player.hearts = HEART_MAX;
  s.player.squash = 0;
  s.lastSparkX = s.player.x;
  s.lastSparkY = s.player.y;
  s.sparks.length = 0;
  s.items.length = 0;
  s.parts.length = 0;
  s.swells.length = 0;
  s.won = false;
  s.dead = false;
  s.cleared = false;
  s.advanceT = 0;
  s.toast = '';
  s.toastT = 0;
  s.toastTone = 'gold';
  s.hitstop = 0;
  s.flash = 0;
  s.cam.x = 0;
  s.cam.y = 0;
  s.cam.punch = 0;
  s.time = 0;
  s.stats.booms = 0;
  s.stats.fizzles = 0;
  s.stats.drops = 0;
  s.waters = (room.puddles || []).map((p) => ({ x: p.x, y: p.y, w: p.w, h: p.h }));
  s.crates = (room.crates || []).map((c) => ({
    x: c.x - crateS * 0.5,
    y: c.y - crateS * 0.5,
    w: crateS,
    h: crateS,
    open: false,
    loot: lootKind(c.drop),
  }));
  s.enemies = (room.enemies || []).map((e) => ({
    x: e.x,
    y: e.y,
    r: ENEMY_R,
    hp: ENEMY_HP,
    hitT: 0,
  }));
  if (room.name === '夜市') toast(s, '夜市还亮着', 'gold');
}

function resetRoom(s) {
  applyRoom(s, s.roomIndex || 0);
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

function burst(s, x, y, n, color, speed, life, lift) {
  if (s.reduce) n = Math.max(2, Math.floor(n * 0.5));
  const life0 = life || 0.28;
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const sp = speed * (0.55 + Math.random() * 0.7);
    s.parts.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp + (lift ? -40 : 0),
      t: life0 * (0.75 + Math.random() * 0.45),
      max: life0,
      r: 2 + Math.random() * 3,
      color,
      lift: !!lift,
    });
  }
}

function spawnSwell(s, x, y, baseR, hot, dual) {
  s.swells.push({ x, y, t: 0, baseR, hot: !!hot, dual: !!dual });
}

function punch(s, amt, dirX, dirY) {
  if (s.reduce) return;
  s.cam.punch = Math.max(s.cam.punch, amt);
  if (dirX != null && dirY != null) {
    const d = Math.hypot(dirX, dirY) || 1;
    s.cam.dx = dirX / d;
    s.cam.dy = dirY / d;
  }
}

function toast(s, text, tone, hold) {
  s.toast = text;
  s.toastT = hold != null ? hold : 1.1;
  s.toastTone = tone || 'gold';
}

function hitstopFor(s, sec) {
  const amt = s.reduce ? 0.02 : sec;
  s.hitstop = Math.max(s.hitstop, amt);
}

function hurtPlayer(s, srcX, srcY, reason) {
  const p = s.player;
  if (s.won || s.dead || p.inv > 0) return false;
  p.hearts -= 1;
  p.inv = IFRAMES;
  p.squash = 0.14;
  s.flash = 0.22;
  hitstopFor(s, HITSTOP);
  punch(s, 6, p.x - (srcX != null ? srcX : p.x), p.y - (srcY != null ? srcY : p.y - 1));
  burst(s, p.x, p.y, 6, COL.heart, 90, 0.2);
  if (srcX != null) {
    const d = dist(p.x, p.y, srcX, srcY) || 1;
    p.x += ((p.x - srcX) / d) * 18;
    p.y += ((p.y - srcY) / d) * 18;
  }
  sfx('hurt');
  if (p.hearts <= 0) {
    p.hearts = 0;
    s.dead = true;
    toast(s, '心空了', 'heart', 99);
  } else {
    toast(s, reason || '别踩自己的尾', 'heart');
  }
  return true;
}

function explode(s, x, y, hot) {
  const r = hot ? HOT_BLAST_R : BLAST_R;
  s.stats.booms += 1;
  burst(s, x, y, hot ? 16 : 10, hot ? COL.gold : COL.ember, hot ? 220 : 170, hot ? 0.36 : 0.28);
  burst(s, x, y, hot ? 8 : 6, COL.gold, 100, 0.4);
  spawnSwell(s, x, y, r, hot, false);
  sfx('explode');

  let hit = false;
  let notable = false;
  const p = s.player;
  if (!s.won && !s.dead && dist(p.x, p.y, x, y) <= r + p.r) {
    hit = true;
    hurtPlayer(s, x, y, '别踩自己的尾');
  }

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    if (dist(e.x, e.y, x, y) <= r + e.r) {
      hit = true;
      e.hp -= hot ? 2 : 1;
      e.hitT = 0.18;
      const d = dist(e.x, e.y, x, y) || 1;
      e.x += ((e.x - x) / d) * 22;
      e.y += ((e.y - y) / d) * 22;
      if (e.hp <= 0) {
        burst(s, e.x, e.y, 12, COL.ember, 150, 0.32);
        burst(s, e.x, e.y, 6, COL.ash, 80, 0.28);
        toast(s, '烬卫倒了', 'gold');
        notable = true;
      }
    }
  }

  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    if (circleRect(x, y, r, c.x, c.y, c.w, c.h)) {
      hit = true;
      c.open = true;
      sfx('beep');
      burst(s, c.x + c.w * 0.5, c.y + c.h * 0.5, 8, COL.gold, 120, 0.24);
      burst(s, c.x + c.w * 0.5, c.y + c.h * 0.5, 4, COL.ash, 70, 0.2);
      toast(s, '箱开了', 'gold');
      notable = true;
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

  if (hit) {
    hitstopFor(s, HITSTOP);
    punch(s, 6, p.x - x, p.y - y);
    if (!notable && s.toastTone !== 'heart') toast(s, hot ? '烫辙' : '焰辙爆了', 'gold');
  } else {
    punch(s, 2, p.x - x, p.y - y);
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
      burst(s, k.x, k.y, 5, COL.water, 70, 0.22, true);
      burst(s, k.x, k.y, 3, COL.ash, 40, 0.18, true);
      sfx('fizzle');
      toast(s, '水洼熄了', 'water');
    } else {
      explode(s, k.x, k.y, k.hot);
    }
  }
  if (s.sparks.length > 80) {
    s.sparks = s.sparks.filter((k) => !k.dead);
  }
}

function tickJuice(s, dt) {
  if (s.toastT > 0) s.toastT -= dt;
  if (s.flash > 0) s.flash -= dt;
  if (s.player.squash > 0) s.player.squash -= dt;
  for (let i = s.swells.length - 1; i >= 0; i--) {
    s.swells[i].t += dt;
    if (s.swells[i].t > 0.11) s.swells.splice(i, 1);
  }
  if (s.cam.punch > 0) {
    s.cam.x = s.cam.dx * s.cam.punch;
    s.cam.y = s.cam.dy * s.cam.punch;
    s.cam.punch *= Math.pow(0.04, dt);
    if (s.cam.punch < 0.08) {
      s.cam.punch = 0;
      s.cam.x = 0;
      s.cam.y = 0;
    }
  } else {
    s.cam.x = 0;
    s.cam.y = 0;
  }
}

function update(s, dt) {
  s.time += dt;
  tickJuice(s, dt);

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
    if (q.lift) q.vy -= 80 * dt;
    q.vx *= 0.9;
    q.vy *= 0.9;
    if (q.t <= 0) s.parts.splice(i, 1);
  }

  if (s.advanceT > 0) {
    s.advanceT -= dt;
    if (s.advanceT <= 0) applyRoom(s, s.roomIndex + 1);
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
    hitstopFor(s, 0.04);
    punch(s, 3, p.faceX, p.faceY);
    burst(s, p.x, p.y, 4, COL.ember, 160, 0.12);
    toast(s, '冲出去', 'gold');
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
  blockCrates(s, p);

  const minX = p.r;
  const maxX = s.roomW - p.r;
  const minY = p.r;
  const maxY = s.roomH - p.r;
  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
    const cx = clamp(ox, minX, maxX);
    const cy = clamp(oy, minY, maxY);
    p.x = clamp(p.x, minX, maxX);
    p.y = clamp(p.y, minY, maxY);
    hurtPlayer(s, cx, cy, '出界了');
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
    blockCrates(s, e);
    e.x = clamp(e.x, e.r, s.roomW - e.r);
    e.y = clamp(e.y, e.r, s.roomH - e.r);
    if (dist(e.x, e.y, p.x, p.y) < e.r + p.r - 1) hurtPlayer(s, e.x, e.y, '撞上了');
  }

  for (let i = 0; i < s.items.length; i++) {
    const it = s.items[i];
    if (it.taken) continue;
    if (dist(it.x, it.y, p.x, p.y) > it.r + p.r) continue;
    it.taken = true;
    if (it.kind === 'core') {
      takeCore(s, it);
    } else if (it.kind === 'heal') {
      p.hearts = Math.min(HEART_MAX, p.hearts + 1);
      toast(s, '回了一心', 'heart');
      sfx('pickup');
      burst(s, it.x, it.y, 8, COL.heart, 130, 0.26);
      burst(s, it.x, it.y, 4, COL.gold, 90, 0.22);
    }
  }
}

function takeCore(s, it) {
  sfx('win');
  hitstopFor(s, HITSTOP);
  punch(s, 6, 0, -1);
  burst(s, it.x, it.y, 18, COL.core, 200, 0.4);
  burst(s, it.x, it.y, 8, COL.gold, 140, 0.32);
  spawnSwell(s, it.x, it.y, 48, false, true);
  s.won = true;
  const last = s.roomIndex >= ROOM_PACK.rooms.length - 1;
  if (last) {
    s.cleared = true;
    toast(s, '通关', 'core', 99);
  } else {
    s.advanceT = 1.15;
    toast(s, '心核到手', 'core');
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

function swellScale(t, hot) {
  const peak = hot ? 1.5 : 1.35;
  if (t < 0.016) return lerp(0.7, peak, t / 0.016);
  if (t < 0.096) return lerp(peak, 0, (t - 0.016) / 0.08);
  return 0;
}

function draw(s, ctx) {
  const W = s.roomW;
  const H = s.roomH;
  ctx.save();
  ctx.translate(s.cam.x, s.cam.y);
  ctx.fillStyle = COL.bg;
  ctx.fillRect(-40, -40, W + 80, H + 80);

  ctx.strokeStyle = 'rgba(255,106,26,0.22)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  ctx.strokeStyle = 'rgba(255,210,74,0.05)';
  ctx.lineWidth = 1;
  for (let x = 40; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 40; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  for (let i = 0; i < s.waters.length; i++) {
    const w = s.waters[i];
    ctx.fillStyle = 'rgba(58,107,140,0.55)';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = 'rgba(180,220,240,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(w.x + 0.5, w.y + 0.5, w.w - 1, w.h - 1);
    if (w.w >= 48 && w.h >= 28) {
      ctx.fillStyle = 'rgba(200,230,255,0.55)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.water, w.x + w.w / 2, w.y + w.h / 2 + 4);
    }
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
    let swell;
    let col;
    if (k.wet) {
      swell = 3.2 * clamp(k.t / TAIL_T, 0.15, 1);
      col = mixHex(COL.ash, COL.water, clamp(k.t / TAIL_T, 0, 1));
    } else {
      const near = Math.pow(age, 2.8);
      swell = (k.hot ? 4.6 : 3.2) + (k.hot ? 16 : 12) * near;
      col = mixHex(COL.ember, COL.gold, age * age);
    }
    glow(ctx, k.x, k.y, swell * 3.4, col, 0.22 + age * 0.5);
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.arc(k.x, k.y, swell, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < s.swells.length; i++) {
    const sw = s.swells[i];
    const k = swellScale(sw.t, sw.hot);
    if (k <= 0) continue;
    const goldish = sw.t >= 0.016;
    if (sw.dual) {
      ctx.strokeStyle = COL.core;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.baseR * k * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.baseR * k * 1.05, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = goldish ? COL.gold : COL.ember;
      ctx.globalAlpha = goldish ? 0.9 : 0.75;
      ctx.lineWidth = 3 + (sw.hot ? 2 : 0);
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.baseR * k, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
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
    const sq = p.squash > 0 ? 0.78 : 1;
    glow(ctx, p.x, p.y, 26, COL.ember, 0.55);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(1 + (1 - sq) * 0.25, sq);
    ctx.beginPath();
    ctx.fillStyle = '#fff3d6';
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COL.gold;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = COL.ember;
    ctx.arc(p.faceX * 3, p.faceY * 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (let i = 0; i < s.parts.length; i++) {
    const q = s.parts[i];
    ctx.globalAlpha = clamp(q.t / Math.max(0.12, q.max || 0.35), 0, 1);
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
    unlockAudio();
    keys.add(e.code);
    if (e.code === 'Space') {
      e.preventDefault();
      s.input.dash = true;
    }
    if (e.code === 'KeyR') {
      applyRoom(s, s.cleared ? 0 : s.roomIndex);
      toast(s, '再来', 'gold');
    }
    if (e.code === 'KeyN') {
      applyRoom(s, s.roomIndex + 1);
    }
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
    unlockAudio();
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
    unlockAudio();
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
    unlockAudio();
    s.input.dash = true;
  });
  dashBtn.addEventListener('pointerup', () => { s.input.dash = false; });

  window.addEventListener('touchstart', () => {
    touchRoot.hidden = false;
  }, { once: true, passive: true });
}

let view = { scale: 1, ox: 0, oy: 0, dpr: 1 };

function fitCanvas(canvas, rw, rh) {
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const ww = wrap.clientWidth;
  const hh = wrap.clientHeight;
  canvas.width = Math.floor(ww * dpr);
  canvas.height = Math.floor(hh * dpr);
  view.dpr = dpr;
  view.scale = Math.min(ww / rw, hh / rh);
  view.ox = (ww - rw * view.scale) / 2;
  view.oy = (hh - rh * view.scale) / 2;
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

function syncHud(s, heartsEl, toastEl, hintEl, roomEl) {
  heartsEl.textContent = '心×' + s.player.hearts;
  if (roomEl && s.room) roomEl.textContent = s.room.name;
  if (hintEl && s.room) hintEl.textContent = s.room.hint || NAMES.hint;
  const hold = s.toast && (s.toastT > 0 || s.cleared || s.dead);
  if (hold) {
    toastEl.hidden = false;
    const extra = (s.cleared || s.dead) ? '  ·  R 再来' : '';
    toastEl.textContent = s.toast + extra;
    const big = s.cleared || s.dead;
    toastEl.className = 'toast ' + (s.toastTone || 'gold') + (big ? ' big' : '');
  } else {
    toastEl.hidden = true;
  }
}

function boot() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const heartsEl = document.getElementById('hearts');
  const toastEl = document.getElementById('toast');
  const hintEl = document.getElementById('hint');
  const roomEl = document.getElementById('roomName');
  const stick = document.getElementById('stick');
  const knob = document.getElementById('knob');
  const dashBtn = document.getElementById('dashBtn');
  const touchRoot = document.getElementById('touch');
  const s = makeState();
  applyRoom(s, 0);
  bindInput(s, canvas, stick, knob, dashBtn, touchRoot);
  fitCanvas(canvas, s.roomW, s.roomH);
  window.addEventListener('resize', () => fitCanvas(canvas, s.roomW, s.roomH));
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    touchRoot.hidden = false;
  }

  let last = performance.now();
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.033);
    last = now;
    update(s, dt);
    fitCanvas(canvas, s.roomW, s.roomH);
    const dpr = view.dpr;
    ctx.setTransform(dpr * view.scale, 0, 0, dpr * view.scale, dpr * view.ox, dpr * view.oy);
    draw(s, ctx);
    syncHud(s, heartsEl, toastEl, hintEl, roomEl);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function loadRoomsNode() {
  const fs = require('fs');
  const path = require('path');
  const file = path.join(__dirname, '..', 'levels', 'rooms.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function selfCheck() {
  if (TAIL_T !== 2) throw new Error('TAIL_T must be 2');
  if (!ROOM_PACK || !ROOM_PACK.rooms) throw new Error('rooms.json missing');
  if (ROOM_PACK.rooms.length !== 6) throw new Error('need 6 rooms');
  for (let i = 0; i < ROOM_NAMES.length; i++) {
    if (ROOM_PACK.rooms[i].name !== ROOM_NAMES[i]) {
      throw new Error('room ' + i + ' should be ' + ROOM_NAMES[i]);
    }
  }
  if (ROOM_PACK.rooms[0].name !== '空场') throw new Error('first room must be 空场');

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
  const scan = blob + NAMES.hint + ROOM_NAMES.join('') + '尾火过关心核到手通关失败再来';
  for (let i = 0; i < banned.length; i++) {
    if (scan.indexOf(banned[i]) >= 0) throw new Error('banned');
  }

  const wet = makeState();
  applyRoom(wet, 2);
  if (wet.room.name !== '水巷') throw new Error('room 2 水巷');
  if (wet.waters.length < 1) throw new Error('水巷 should have water');
  const puddle = wet.waters[0];
  dropSpark(wet, puddle.x + puddle.w * 0.5, puddle.y + puddle.h * 0.5, false);
  if (!wet.sparks[0].wet) throw new Error('spark in water should be wet');
  for (let i = 0; i < 24; i++) update(wet, 0.1);
  if (wet.stats.fizzles < 1) throw new Error('water should fizzle');
  if (wet.stats.booms !== 0) throw new Error('water must not boom');

  const dry = makeState();
  applyRoom(dry, 0);
  dropSpark(dry, 200, 120, false);
  for (let i = 0; i < 24; i++) update(dry, 0.1);
  if (dry.stats.booms < 1) throw new Error('dry spark should boom at TAIL_T');

  const still = makeState();
  applyRoom(still, 0);
  still.input.x = 0;
  still.input.y = 0;
  for (let i = 0; i < 20; i++) update(still, 0.05);
  if (still.sparks.length !== 0 || still.stats.drops !== 0) {
    throw new Error('standing drops 0');
  }

  const run = makeState();
  applyRoom(run, 0);
  run.input.x = 1;
  run.input.y = 0;
  for (let i = 0; i < 20; i++) update(run, 0.05);
  if (run.stats.drops < 1) throw new Error('moving should drop sparks');

  const burn = makeState();
  applyRoom(burn, 0);
  const hearts = burn.player.hearts;
  dropSpark(burn, burn.player.x, burn.player.y, false);
  for (let i = 0; i < 24; i++) update(burn, 0.1);
  if (burn.player.hearts >= hearts) throw new Error('own blast should hurt');

  const seq = makeState();
  applyRoom(seq, 0);
  if (seq.room.name !== '空场') throw new Error('boot room 空场');
  seq.items.push({ kind: 'core', x: seq.player.x, y: seq.player.y, r: 10, taken: false });
  update(seq, 0.02);
  if (!seq.won) throw new Error('core should clear room');
  if (seq.cleared) throw new Error('empty field is not last');
  for (let i = 0; i < 80; i++) update(seq, 0.05);
  if (seq.room.name !== '追者') throw new Error('after 心核 go to 追者');

  const last = makeState();
  applyRoom(last, 5);
  last.items.push({ kind: 'core', x: last.player.x, y: last.player.y, r: 10, taken: false });
  update(last, 0.02);
  if (!last.won || !last.cleared) throw new Error('last room should 通关');
  if (last.toast !== '通关') throw new Error('last toast 通关');
  if (last.advanceT > 0) throw new Error('last room must not advance');

  for (let i = 0; i < 6; i++) {
    const probe = makeState();
    applyRoom(probe, i);
    if (probe.room.name !== ROOM_NAMES[i]) throw new Error('apply ' + ROOM_NAMES[i]);
  }

  console.log('selfCheck ok', {
    TAIL_T,
    rooms: ROOM_NAMES,
    first: ROOM_PACK.rooms[0].name,
    names: NAMES,
    fizzles: wet.stats.fizzles,
    standDrops: still.stats.drops,
  });
}

function startBrowser() {
  fetch('levels/rooms.json').then((res) => {
    if (!res.ok) throw new Error('rooms.json');
    return res.json();
  }).then((data) => {
    ROOM_PACK = data;
    boot();
  }).catch((err) => {
    console.error(err);
  });
}

if (typeof window === 'undefined') {
  ROOM_PACK = loadRoomsNode();
  selfCheck();
} else if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBrowser);
  } else {
    startBrowser();
  }
}
