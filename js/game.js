'use strict';

const TAIL_T = 2.0;
const SPARK_GAP = 18;
const BLAST_R = 36;
const HOT_BLAST_R = 56;
const VIEW_W = 960;
const VIEW_H = 540;
const PLAYER_R = 11;
const PLAYER_SPEED = 178;
const DASH_SPEED = 520;
const DASH_TIME = 0.13;
const DASH_CD = 0.42;
const ENEMY_R = 13;
const ENEMY_SPEED = 48;
const ENEMY_HP = 3;
const HOUND_HP = 2;
const HOUND_IDLE = 22;
const HOUND_SEEK = 88;
const HOUND_ROAD = 246;
const HOUND_MOUNT = 70;
const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八'];
const HEART_MAX = 3;
const HITSTOP = 0.08;
const IFRAMES = 0.95;
const CRATE = 48;
const NEXT_WAIT = 0.7;

const NAMES = {
  title: '尾火',
  enemy: '烬卫',
  crate: '箱',
  core: '心核',
  heal: '回星',
  water: '水洼',
  spark: '焰辙',
  hound: '循辙',
  hint: '跑过的路两秒后会爆',
};

const TOAST = {
  boom: '焰辙爆了',
  hot: '烫辙',
  dash: '冲出去',
  self: '别踩自己的尾',
  crate: '箱开了',
  foe: '烬卫倒了',
  fizzle: '水洼熄了',
  hold: '辙收住了',
  heal: '回了一心',
  core: '心核到手',
  clear: '过关',
  all: '通关',
  oob: '出界了',
  bump: '撞上了',
  empty: '心空了',
  again: '再来',
  night: '夜市还亮着',
  hound: '循辙倒了',
  road: '循辙盯着你的路',
  cut: '水能切断公路',
};

const COL = {
  bg: '#14080a',
  ember: '#ff6a1a',
  gold: '#ffd24a',
  water: '#3a6b8c',
  core: '#ff5d8f',
  heart: '#ff5d8f',
  ash: '#6b5344',
};

let ROOMS = [];

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function dist(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }
function lerp(a, b, t) { return a + (b - a) * t; }

function adoptRooms(pack) {
  if (pack && pack.rooms && pack.rooms.length) {
    ROOMS = pack.rooms;
    return true;
  }
  return false;
}

function ensureRooms() {
  if (ROOMS.length) return ROOMS;
  if (typeof WEI_HUO_ROOMS !== 'undefined') adoptRooms(WEI_HUO_ROOMS);
  if (ROOMS.length) return ROOMS;
  if (typeof require === 'function') {
    try { adoptRooms(require('./rooms.js')); } catch (e) {}
    if (ROOMS.length) return ROOMS;
    try {
      const fs = require('fs');
      const path = require('path');
      adoptRooms(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'levels', 'rooms.json'), 'utf8')));
    } catch (e2) {}
  }
  return ROOMS;
}

function roomW(r) {
  if (!r) return VIEW_W;
  if (r.w) return r.w;
  if (r.size && r.size.w) return r.size.w;
  return VIEW_W;
}

function roomH(r) {
  if (!r) return VIEW_H;
  if (r.h) return r.h;
  if (r.size && r.size.h) return r.size.h;
  return VIEW_H;
}

function roomSpawn(r) {
  if (r && r.spawn) return r.spawn;
  if (r && r.player) return r.player;
  return { x: 80, y: 80 };
}

function roomFit(s) {
  const rw = (s && s.roomW) || VIEW_W;
  const rh = (s && s.roomH) || VIEW_H;
  const scale = Math.min(VIEW_W / rw, VIEW_H / rh);
  return { scale: scale, ox: (VIEW_W - rw * scale) / 2, oy: (VIEW_H - rh * scale) / 2 };
}

function reducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hitstopAmt() {
  return reducedMotion() ? 0.02 : HITSTOP;
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

function audioPack() {
  if (typeof WeiHuoAudio !== 'undefined' && WeiHuoAudio) return WeiHuoAudio;
  if (typeof AudioFx !== 'undefined' && AudioFx) return AudioFx;
  return null;
}

function unlockAudio() {
  const pack = audioPack();
  if (pack && pack.unlock) pack.unlock();
}

function sfx(name) {
  const pack = audioPack();
  if (!pack) return;
  const aliases = {
    boom: ['explode', 'boom'],
    explode: ['explode', 'boom'],
    heal: ['pickup', 'heal'],
    pickup: ['pickup', 'heal'],
    open: ['pickup', 'open', 'beep'],
    dash: ['dash'],
    hurt: ['hurt'],
    win: ['win'],
    fizzle: ['fizzle'],
    beep: ['beep'],
  };
  const list = aliases[name] || [name];
  for (let i = 0; i < list.length; i++) {
    const fn = pack[list[i]];
    if (typeof fn === 'function') {
      fn();
      return;
    }
  }
}

function toast(s, msg, t, color) {
  s.toast = msg;
  s.toastT = t == null ? 1.1 : t;
  s.toastColor = color || COL.gold;
}

function lootKind(drop) {
  if (drop === '心核' || drop === 'core') return 'core';
  if (drop === '回星' || drop === 'heal') return 'heal';
  return null;
}

function makeState() {
  return {
    roomIndex: 0,
    roomW: VIEW_W,
    roomH: VIEW_H,
    roomName: '',
    roomId: '',
    player: {
      x: 110, y: 310, r: PLAYER_R,
      vx: 0, vy: 0, faceX: 1, faceY: 0,
      dashT: 0, dashCd: 0, inv: 0, hearts: HEART_MAX,
    },
    lastSparkX: 110,
    lastSparkY: 310,
    sparks: [],
    enemies: [],
    crates: [],
    waters: [],
    items: [],
    parts: [],
    rings: [],
    input: { x: 0, y: 0, dash: false },
    cam: { x: 0, y: 0, punch: 0 },
    hitstop: 0,
    flash: 0,
    won: false,
    dead: false,
    pendingNext: 0,
    toast: '',
    toastT: 0,
    toastColor: COL.gold,
    stats: { booms: 0, fizzles: 0, drops: 0 },
    time: 0,
  };
}

function resetRoom(s, index, keepHearts) {
  ensureRooms();
  if (index == null) index = s.roomIndex || 0;
  if (index < 0) index = 0;
  if (ROOMS.length && index >= ROOMS.length) index = ROOMS.length - 1;
  const room = ROOMS[index] || {
    id: '', name: '', w: VIEW_W, h: VIEW_H,
    spawn: { x: 110, y: 310 }, puddles: [], crates: [], enemies: [],
  };
  const hearts = keepHearts ? s.player.hearts : HEART_MAX;
  const sp = roomSpawn(room);
  s.roomIndex = index;
  s.roomW = roomW(room);
  s.roomH = roomH(room);
  s.roomName = room.name || '';
  s.roomId = room.id || '';
  s.player.x = sp.x;
  s.player.y = sp.y;
  s.player.vx = 0;
  s.player.vy = 0;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.dashT = 0;
  s.player.dashCd = 0;
  s.player.inv = 0;
  s.player.hearts = hearts;
  s.lastSparkX = s.player.x;
  s.lastSparkY = s.player.y;
  s.sparks.length = 0;
  s.items.length = 0;
  s.parts.length = 0;
  s.rings.length = 0;
  s.won = false;
  s.dead = false;
  s.pendingNext = 0;
  s.toast = '';
  s.toastT = 0;
  s.toastColor = COL.gold;
  s.hitstop = 0;
  s.flash = 0;
  s.cam.x = 0;
  s.cam.y = 0;
  s.cam.punch = 0;
  s.time = 0;
  s.stats.booms = 0;
  s.stats.fizzles = 0;
  s.stats.drops = 0;
  s.waters = (room.puddles || []).map(function (p) {
    return { x: p.x, y: p.y, w: p.w, h: p.h };
  });
  s.crates = (room.crates || []).map(function (c) {
    return {
      x: c.x - CRATE * 0.5,
      y: c.y - CRATE * 0.5,
      w: CRATE,
      h: CRATE,
      open: false,
      loot: lootKind(c.drop),
    };
  });
  s.enemies = (room.enemies || []).map(function (e) {
    const kind = e.type || e.kind || NAMES.enemy;
    const hound = kind === NAMES.hound;
    return {
      x: e.x, y: e.y,
      r: hound ? 12 : ENEMY_R,
      hp: hound ? HOUND_HP : ENEMY_HP,
      hitT: 0,
      kind: kind,
      faceX: 1,
      faceY: 0,
    };
  });
  if (room.name === '夜市') toast(s, TOAST.night, 1.1, COL.gold);
  else if (room.name === '循径') toast(s, TOAST.road, 1.1, COL.gold);
  else if (room.name === '双刃') toast(s, TOAST.cut, 1.1, COL.water);
}

function isHound(e) {
  return e.kind === NAMES.hound;
}

function liveRoad(s) {
  const out = [];
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (!k.dead && !k.wet) out.push(k);
  }
  return out;
}

function updateHound(s, e, dt) {
  const p = s.player;
  const road = liveRoad(s);
  let tx = p.x;
  let ty = p.y;
  let speed = HOUND_IDLE;
  if (road.length) {
    let near = road[0];
    let nd = dist(e.x, e.y, near.x, near.y);
    for (let i = 1; i < road.length; i++) {
      const dE = dist(e.x, e.y, road[i].x, road[i].y);
      if (dE < nd) {
        nd = dE;
        near = road[i];
      }
    }
    if (nd > HOUND_MOUNT) {
      tx = near.x;
      ty = near.y;
      speed = HOUND_SEEK;
    } else {
      let step = near;
      let stepP = dist(step.x, step.y, p.x, p.y);
      for (let i = 0; i < road.length; i++) {
        const k = road[i];
        if (dist(e.x, e.y, k.x, k.y) > SPARK_GAP * 3.2) continue;
        const dP = dist(k.x, k.y, p.x, p.y);
        if (dP < stepP - 1) {
          step = k;
          stepP = dP;
        }
      }
      if (stepP < 14) {
        tx = p.x;
        ty = p.y;
      } else {
        tx = step.x;
        ty = step.y;
      }
      speed = HOUND_ROAD;
    }
  }
  const d = dist(e.x, e.y, tx, ty);
  if (d > 0.5) {
    e.faceX = (tx - e.x) / d;
    e.faceY = (ty - e.y) / d;
    e.x += e.faceX * speed * dt;
    e.y += e.faceY * speed * dt;
  }
}

function dropSpark(s, x, y, hot) {
  const wet = inWater(s, x, y);
  s.sparks.push({ x: x, y: y, t: TAIL_T, hot: !!hot, wet: wet, dead: false });
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
  if (reducedMotion()) n = Math.max(2, Math.floor(n * 0.5));
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const sp = speed * (0.55 + Math.random() * 0.7);
    s.parts.push({
      x: x, y: y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      t: 0.28 + Math.random() * 0.22,
      r: 2 + Math.random() * 3,
      color: color,
    });
  }
}

function punch(s, amt) {
  if (reducedMotion()) return;
  s.cam.punch = Math.max(s.cam.punch, amt);
}

function addRing(s, x, y, r, hot) {
  s.rings.push({
    x: x, y: y,
    r0: r * 0.7,
    r1: r * (hot ? 1.5 : 1.35),
    t: 0,
    grow: 0.016,
    life: 0.096,
    hot: !!hot,
  });
}

function resolveCircleRect(ent, rx, ry, rw, rh) {
  const nx = clamp(ent.x, rx, rx + rw);
  const ny = clamp(ent.y, ry, ry + rh);
  const dx = ent.x - nx;
  const dy = ent.y - ny;
  const d = Math.hypot(dx, dy);
  if (d === 0) {
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
    const push = ent.r - d;
    ent.x += (dx / d) * push;
    ent.y += (dy / d) * push;
    return true;
  }
  return false;
}

function resolveCrates(s, ent) {
  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    resolveCircleRect(ent, c.x, c.y, c.w, c.h);
  }
}

function hurtPlayer(s, srcX, srcY, why) {
  const p = s.player;
  if (s.won || s.dead || s.pendingNext > 0 || p.inv > 0) return false;
  p.hearts -= 1;
  p.inv = IFRAMES;
  s.flash = 0.22;
  s.hitstop = Math.max(s.hitstop, hitstopAmt());
  punch(s, 6);
  if (srcX != null) {
    const d = dist(p.x, p.y, srcX, srcY) || 1;
    p.x += ((p.x - srcX) / d) * 18;
    p.y += ((p.y - srcY) / d) * 18;
  }
  sfx('hurt');
  burst(s, p.x, p.y, 6, COL.heart, 110);
  if (why === 'blast') toast(s, TOAST.self, 1.1, COL.heart);
  else if (why === 'oob') toast(s, TOAST.oob, 1.1, COL.heart);
  else toast(s, TOAST.bump, 1.1, COL.heart);
  if (p.hearts <= 0) {
    p.hearts = 0;
    s.dead = true;
    toast(s, TOAST.empty, 99, COL.heart);
  }
  return true;
}

function explode(s, x, y, hot) {
  const r = hot ? HOT_BLAST_R : BLAST_R;
  s.stats.booms += 1;
  burst(s, x, y, hot ? 16 : 10, hot ? COL.gold : COL.ember, hot ? 220 : 170);
  addRing(s, x, y, r, hot);
  sfx('boom');

  const p = s.player;
  let hit = false;
  if (!s.won && !s.dead && dist(p.x, p.y, x, y) <= r + p.r) {
    hurtPlayer(s, x, y, 'blast');
    hit = true;
  }

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    if (dist(e.x, e.y, x, y) <= r + e.r) {
      e.hp -= isHound(e) ? 1 : (hot ? 2 : 1);
      e.hitT = 0.18;
      const d = dist(e.x, e.y, x, y) || 1;
      e.x += ((e.x - x) / d) * 22;
      e.y += ((e.y - y) / d) * 22;
      s.hitstop = Math.max(s.hitstop, hitstopAmt());
      punch(s, 6);
      hit = true;
      if (e.hp <= 0) {
        burst(s, e.x, e.y, 12, COL.ember, 140);
        toast(s, isHound(e) ? TOAST.hound : TOAST.foe, 1.1, COL.ember);
      }
    }
  }

  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    if (circleRect(x, y, r, c.x, c.y, c.w, c.h)) {
      c.open = true;
      hit = true;
      s.hitstop = Math.max(s.hitstop, hitstopAmt());
      punch(s, 6);
      sfx('open');
      burst(s, c.x + c.w * 0.5, c.y + c.h * 0.5, 8, COL.gold, 120);
      toast(s, TOAST.crate, 1.1, COL.gold);
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

  if (hit) punch(s, 6);
  else punch(s, 2);
}

function takeCore(s, it) {
  sfx('win');
  burst(s, it.x, it.y, 18, COL.core, 200);
  addRing(s, it.x, it.y, 40, true);
  s.hitstop = Math.max(s.hitstop, hitstopAmt());
  punch(s, 6);
  const last = s.roomIndex >= ensureRooms().length - 1;
  if (last) {
    s.won = true;
    toast(s, TOAST.all, 99, COL.core);
  } else {
    s.pendingNext = NEXT_WAIT;
    toast(s, TOAST.core, 1.1, COL.core);
  }
}

function goNext(s) {
  const rooms = ensureRooms();
  if (s.roomIndex >= rooms.length - 1) {
    s.won = true;
    toast(s, TOAST.all, 99, COL.core);
    return;
  }
  resetRoom(s, s.roomIndex + 1, true);
  toast(s, TOAST.clear, 1.1, COL.core);
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
      toast(s, TOAST.fizzle, 1.1, COL.water);
    } else {
      explode(s, k.x, k.y, k.hot);
    }
  }
  if (s.sparks.length > 80) {
    s.sparks = s.sparks.filter(function (k) { return !k.dead; });
  }
}

function updateRings(s, dt) {
  for (let i = s.rings.length - 1; i >= 0; i--) {
    s.rings[i].t += dt;
    if (s.rings[i].t >= s.rings[i].life) s.rings.splice(i, 1);
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

  updateRings(s, dt);

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

  if (s.pendingNext > 0) {
    s.pendingNext -= dt;
    updateSparks(s, dt);
    if (s.pendingNext <= 0) goNext(s);
    return;
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
    toast(s, TOAST.dash, 1.1, COL.ember);
    burst(s, p.x, p.y, 4, COL.ember, 90);
    if (!reducedMotion()) {
      s.hitstop = Math.max(s.hitstop, 0.04);
      punch(s, 3);
    }
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
  resolveCrates(s, p);

  const rw = s.roomW;
  const rh = s.roomH;
  if (p.x - p.r < 0 || p.x + p.r > rw || p.y - p.r < 0 || p.y + p.r > rh) {
    p.x = clamp(p.x, p.r, rw - p.r);
    p.y = clamp(p.y, p.r, rh - p.r);
    hurtPlayer(s, clamp(ox, p.r, rw - p.r), clamp(oy, p.r, rh - p.r), 'oob');
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
    if (isHound(e)) updateHound(s, e, dt);
    else {
      const d = dist(e.x, e.y, p.x, p.y) || 1;
      e.x += ((p.x - e.x) / d) * ENEMY_SPEED * dt;
      e.y += ((p.y - e.y) / d) * ENEMY_SPEED * dt;
    }
    resolveCrates(s, e);
    e.x = clamp(e.x, e.r, rw - e.r);
    e.y = clamp(e.y, e.r, rh - e.r);
    if (dist(e.x, e.y, p.x, p.y) < e.r + p.r - 1) hurtPlayer(s, e.x, e.y, 'bump');
  }

  for (let i = 0; i < s.items.length; i++) {
    const it = s.items[i];
    if (it.taken) continue;
    if (dist(it.x, it.y, p.x, p.y) > it.r + p.r) continue;
    it.taken = true;
    if (it.kind === 'core') takeCore(s, it);
    else if (it.kind === 'heal') {
      p.hearts = Math.min(HEART_MAX, p.hearts + 1);
      toast(s, TOAST.heal, 1.1, COL.heart);
      sfx('heal');
      burst(s, it.x, it.y, 8, COL.heart, 130);
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
  ctx.fillStyle = '#0a0406';
  ctx.fillRect(-30, -30, VIEW_W + 60, VIEW_H + 60);

  const fit = roomFit(s);
  ctx.translate(fit.ox, fit.oy);
  ctx.scale(fit.scale, fit.scale);

  const rw = s.roomW;
  const rh = s.roomH;
  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, rw, rh);

  ctx.strokeStyle = 'rgba(255,106,26,0.22)';
  ctx.lineWidth = 2 / fit.scale;
  ctx.strokeRect(1, 1, rw - 2, rh - 2);

  ctx.strokeStyle = 'rgba(255,210,74,0.05)';
  ctx.lineWidth = 1 / fit.scale;
  for (let x = 40; x < rw; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, rh);
    ctx.stroke();
  }
  for (let y = 40; y < rh; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(rw, y);
    ctx.stroke();
  }

  for (let i = 0; i < s.waters.length; i++) {
    const w = s.waters[i];
    ctx.fillStyle = 'rgba(58,107,140,0.55)';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = 'rgba(180,220,240,0.35)';
    ctx.lineWidth = 1.5 / fit.scale;
    ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
    ctx.fillStyle = 'rgba(200,230,255,0.55)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(NAMES.water, w.x + w.w * 0.5, w.y + w.h * 0.5 + 4);
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
    ctx.lineWidth = 1.5 / fit.scale;
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
    if (k.wet) {
      const shrink = 3.2 * (1 - age * 0.7);
      glow(ctx, k.x, k.y, shrink * 2.2, COL.ash, 0.2);
      ctx.beginPath();
      ctx.fillStyle = mixHex(COL.water, COL.ash, age);
      ctx.arc(k.x, k.y, shrink, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    const swell = k.hot ? 5 + 9 * age * age : 3.2 + 7 * age * age;
    const col = mixHex(COL.ember, COL.gold, age * age);
    glow(ctx, k.x, k.y, swell * 3.2, col, 0.22 + age * 0.45);
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.arc(k.x, k.y, swell, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < s.rings.length; i++) {
    const ring = s.rings[i];
    let rad;
    let col;
    let a;
    if (ring.t < ring.grow) {
      rad = lerp(ring.r0, ring.r1, ring.t / ring.grow);
      col = COL.ember;
      a = 0.85;
    } else {
      const k = (ring.t - ring.grow) / (ring.life - ring.grow);
      rad = lerp(ring.r1, 0, k);
      col = COL.gold;
      a = 0.85 * (1 - k);
    }
    if (rad > 0.4) {
      ctx.globalAlpha = a;
      ctx.strokeStyle = col;
      ctx.lineWidth = 4 / fit.scale;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, rad, 0, Math.PI * 2);
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
    if (isHound(e)) {
      glow(ctx, e.x, e.y, 24, COL.gold, 0.22);
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(Math.atan2(e.faceY || 0, e.faceX || 1));
      ctx.beginPath();
      ctx.fillStyle = flash ? COL.gold : '#5a2a12';
      ctx.moveTo(14, 0);
      ctx.lineTo(-9, 8);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-9, -8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = COL.ember;
      ctx.lineWidth = 2 / fit.scale;
      ctx.stroke();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(3, -2.4, 1.6, 0, Math.PI * 2);
      ctx.arc(3, 2.4, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = COL.gold;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.hound, e.x, e.y + e.r + 12);
      for (let h = 0; h < HOUND_HP; h++) {
        ctx.fillStyle = h < e.hp ? COL.gold : 'rgba(255,210,74,0.2)';
        ctx.fillRect(e.x - 9 + h * 10, e.y + e.r + 14, 8, 3);
      }
      continue;
    }
    glow(ctx, e.x, e.y, 22, COL.ember, 0.18);
    ctx.beginPath();
    ctx.fillStyle = flash ? COL.gold : '#2a1410';
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COL.ember;
    ctx.lineWidth = 2 / fit.scale;
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
    ctx.lineWidth = 2 / fit.scale;
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
    ctx.fillRect(0, 0, rw, rh);
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

  window.addEventListener('keydown', function (e) {
    unlockAudio();
    keys.add(e.code);
    if (e.code === 'Space') {
      e.preventDefault();
      s.input.dash = true;
    }
    if (e.code === 'KeyR') {
      resetRoom(s, s.roomIndex, false);
      toast(s, TOAST.again, 1.1, COL.gold);
    }
    syncKeys();
  });
  window.addEventListener('keyup', function (e) {
    keys.delete(e.code);
    if (e.code === 'Space') s.input.dash = false;
    syncKeys();
  });

  let mouseOn = false;
  canvas.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;
    mouseOn = true;
    aimMouse(e);
  });
  window.addEventListener('pointerup', function () {
    if (mouseOn) {
      mouseOn = false;
      if (!stick.active) { s.input.x = 0; s.input.y = 0; syncKeys(); }
    }
  });
  canvas.addEventListener('pointermove', function (e) {
    if (mouseOn) aimMouse(e);
  });

  function aimMouse(e) {
    const world = screenToWorld(canvas, e.clientX, e.clientY, s);
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
  stick.addEventListener('pointerdown', function (e) {
    unlockAudio();
    stick.active = true;
    stickId = e.pointerId;
    stick.setPointerCapture(e.pointerId);
    stickAt(e.clientX, e.clientY);
  });
  stick.addEventListener('pointermove', function (e) {
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

  dashBtn.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    unlockAudio();
    s.input.dash = true;
  });
  dashBtn.addEventListener('pointerup', function () { s.input.dash = false; });

  window.addEventListener('touchstart', function () {
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
  view.scale = Math.min(ww / VIEW_W, hh / VIEW_H);
  view.ox = (ww - VIEW_W * view.scale) / 2;
  view.oy = (hh - VIEW_H * view.scale) / 2;
}

function screenToWorld(canvas, cx, cy, s) {
  const rec = canvas.getBoundingClientRect();
  const x = cx - rec.left;
  const y = cy - rec.top;
  const canvasX = (x - view.ox) / view.scale;
  const canvasY = (y - view.oy) / view.scale;
  const fit = roomFit(s);
  return {
    x: (canvasX - fit.ox) / fit.scale,
    y: (canvasY - fit.oy) / fit.scale,
  };
}

function syncHud(s, heartsEl, toastEl, roomEl) {
  heartsEl.textContent = '心×' + s.player.hearts;
  if (roomEl) {
    const n = ensureRooms().length;
    const a = CN_NUM[s.roomIndex] || String(s.roomIndex + 1);
    const b = CN_NUM[n - 1] || String(n);
    roomEl.textContent = (s.roomName || '') + ' · ' + a + '/' + b;
  }
  if (s.toast && (s.toastT > 0 || s.won || s.dead)) {
    toastEl.hidden = false;
    toastEl.textContent = s.toast + ((s.won || s.dead) ? '  ·  R 再玩' : '');
    toastEl.style.color = s.toastColor || '';
  } else {
    toastEl.hidden = true;
  }
}

function startLoop(s, canvas, ctx, heartsEl, toastEl, roomEl) {
  let last = performance.now();
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.033);
    last = now;
    update(s, dt);
    const dpr = view.dpr;
    ctx.setTransform(dpr * view.scale, 0, 0, dpr * view.scale, dpr * view.ox, dpr * view.oy);
    draw(s, ctx);
    syncHud(s, heartsEl, toastEl, roomEl);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function boot() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const heartsEl = document.getElementById('hearts');
  const toastEl = document.getElementById('toast');
  const roomEl = document.getElementById('roomName') || document.getElementById('room');
  const stick = document.getElementById('stick');
  const knob = document.getElementById('knob');
  const dashBtn = document.getElementById('dashBtn');
  const touchRoot = document.getElementById('touch');
  const s = makeState();

  function begin() {
    ensureRooms();
    resetRoom(s, 0, false);
    bindInput(s, canvas, stick, knob, dashBtn, touchRoot);
    fitCanvas(canvas);
    window.addEventListener('resize', function () { fitCanvas(canvas); });
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      touchRoot.hidden = false;
    }
    startLoop(s, canvas, ctx, heartsEl, toastEl, roomEl);
  }

  function fallback() {
    ensureRooms();
    begin();
  }

  if (typeof fetch === 'function') {
    fetch('levels/rooms.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('rooms')); })
      .then(function (data) {
        if (!adoptRooms(data)) fallback();
        else begin();
      })
      .catch(fallback);
  } else {
    fallback();
  }
}

function selfCheck() {
  ensureRooms();
  if (TAIL_T !== 2) throw new Error('TAIL_T must be 2');
  if (!ROOMS || ROOMS.length !== 8) throw new Error('need 8 rooms, got ' + (ROOMS ? ROOMS.length : 0));
  const want = ['空场', '追者', '水巷', '箱巷', '夹道', '夜市', '循径', '双刃'];
  for (let i = 0; i < 8; i++) {
    if (!ROOMS[i] || ROOMS[i].name !== want[i]) {
      throw new Error('room ' + i + ' ' + (ROOMS[i] && ROOMS[i].name));
    }
    if (!roomW(ROOMS[i]) || !roomH(ROOMS[i]) || !roomSpawn(ROOMS[i])) {
      throw new Error('room fields ' + ROOMS[i].name);
    }
  }

  const fitJ = roomFit({ roomW: 960, roomH: 140 });
  if (Math.abs(fitJ.scale - 1) > 1e-9) throw new Error('letterbox must not stretch');
  if (Math.abs(fitJ.ox) > 1e-9) throw new Error('jiadao letterbox x');
  if (Math.abs(fitJ.oy - 200) > 1e-6) throw new Error('jiadao letterbox y');

  const fitK = roomFit({ roomW: 840, roomH: 480 });
  if (Math.abs(fitK.scale - Math.min(960 / 840, 540 / 480)) > 1e-9) throw new Error('kongchang letterbox');

  const need = ['尾火', '烬卫', '箱', '心核', '回星', '水洼', '焰辙', '循辙'];
  const blob = Object.keys(NAMES).map(function (k) { return NAMES[k]; }).join('') +
    Object.keys(TOAST).map(function (k) { return TOAST[k]; }).join('');
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
  if (NAMES.hound !== '循辙') throw new Error('循辙 exists');
  let houndN = 0;
  for (let r = 0; r < ROOMS.length; r++) {
    const ens = ROOMS[r].enemies || [];
    for (let j = 0; j < ens.length; j++) {
      if ((ens[j].type || ens[j].kind) === '循辙') houndN += 1;
    }
  }
  if (houndN < 1) throw new Error('循辙 exists');
  const scan = blob + NAMES.hint + '尾火过关失败通关循辙倒了' + want.join('');
  for (let i = 0; i < banned.length; i++) {
    if (scan.indexOf(banned[i]) >= 0) throw new Error('banned');
  }

  const wet = makeState();
  resetRoom(wet, 0, false);
  wet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(wet, 120, 120, false);
  if (!wet.sparks[0].wet) throw new Error('spark in water should be wet');
  for (let i = 0; i < 24; i++) update(wet, 0.1);
  if (wet.stats.fizzles < 1) throw new Error('water should fizzle');
  if (wet.stats.booms !== 0) throw new Error('water must not boom');

  const dry = makeState();
  resetRoom(dry, 0, false);
  dropSpark(dry, 120, 120, false);
  for (let i = 0; i < 24; i++) update(dry, 0.1);
  if (dry.stats.booms < 1) throw new Error('dry spark should boom at TAIL_T');

  const still = makeState();
  resetRoom(still, 0, false);
  still.input.x = 0;
  still.input.y = 0;
  for (let i = 0; i < 20; i++) update(still, 0.05);
  if (still.sparks.length !== 0 || still.stats.drops !== 0) {
    throw new Error('standing drops 0');
  }

  const run = makeState();
  resetRoom(run, 0, false);
  run.input.x = 1;
  run.input.y = 0;
  for (let i = 0; i < 20; i++) update(run, 0.05);
  if (run.stats.drops < 1) throw new Error('moving should drop sparks');

  const own = makeState();
  resetRoom(own, 0, false);
  const hp = own.player.hearts;
  explode(own, own.player.x, own.player.y, false);
  if (own.player.hearts !== hp - 1) throw new Error('own blast hurts');

  const lane = makeState();
  resetRoom(lane, 4, false);
  if (lane.roomName !== '夹道' || lane.roomH !== 140) throw new Error('jiadao load');

  const houndIdle = makeState();
  resetRoom(houndIdle, 6, false);
  if (houndIdle.roomName !== '循径') throw new Error('room 6 循径');
  const hi = houndIdle.enemies.find(function (e) { return isHound(e); });
  if (!hi || hi.hp !== 2) throw new Error('循径 needs 循辙');
  const idleX = hi.x;
  const idleY = hi.y;
  for (let i = 0; i < 20; i++) update(houndIdle, 0.05);
  const idleD = dist(hi.x, hi.y, idleX, idleY);

  const houndRun = makeState();
  resetRoom(houndRun, 6, false);
  const hr = houndRun.enemies.find(function (e) { return isHound(e); });
  const runX = hr.x;
  const runY = hr.y;
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    dropSpark(
      houndRun,
      runX + (houndRun.player.x - runX) * t,
      runY + (houndRun.player.y - runY) * t,
      false
    );
  }
  for (let i = 0; i < 20; i++) update(houndRun, 0.05);
  const roadD = dist(hr.x, hr.y, runX, runY);
  if (roadD <= idleD + 10) throw new Error('循辙 should run the trail');

  const twoHit = makeState();
  resetRoom(twoHit, 6, false);
  const hk = twoHit.enemies.find(function (e) { return isHound(e); });
  explode(twoHit, hk.x, hk.y, true);
  if (hk.hp !== 1) throw new Error('循辙 any blast is 1');
  explode(twoHit, hk.x, hk.y, false);
  if (hk.hp > 0) throw new Error('循辙 dies in 2 blasts');

  const last = makeState();
  resetRoom(last, 7, false);
  if (last.roomName !== '双刃') throw new Error('shuangren load');
  last.roomIndex = 7;
  takeCore(last, { x: 100, y: 100 });
  if (!last.won || last.toast !== TOAST.all) throw new Error('双刃 should 通关');

  const mid = makeState();
  resetRoom(mid, 0, false);
  takeCore(mid, { x: 200, y: 200 });
  if (mid.pendingNext <= 0) throw new Error('core should queue next room');
  for (let i = 0; i < 20; i++) update(mid, 0.1);
  if (mid.roomName !== '追者') throw new Error('core advances to 追者');

  if (HITSTOP !== 0.08) throw new Error('hitstop 80ms');

  console.log('selfCheck ok', {
    TAIL_T: TAIL_T,
    rooms: ROOMS.map(function (r) { return r.name; }),
    fizzles: wet.stats.fizzles,
    standDrops: still.stats.drops,
  });
}

if (typeof window === 'undefined') {
  try {
    if (typeof require === 'function') {
      global.WEI_HUO_ROOMS = require('./rooms.js');
    }
  } catch (e) {}
  selfCheck();
} else if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
