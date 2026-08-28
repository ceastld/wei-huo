'use strict';

const TAIL_T = 2.0;
const SPARK_GAP = 18;
const BLAST_R = 36;
const HOT_BLAST_R = 56;
const CHAIN_T = 0.12;
const COMBO_MIN = 3;
const EMBER_T = 0.55;
const SCORCH_T = 1.2;
const VIEW_W = 960;
const VIEW_H = 540;
const PLAYER_R = 11;
const PLAYER_SPEED = 178;
const DASH_SPEED = 520;
const DASH_TIME = 0.18;
const DASH_CD = 0.42;
const ENEMY_R = 13;
const ENEMY_SPEED = 48;
const ENEMY_HP = 3;
const HOUND_HP = 2;
const HOUND_IDLE = 22;
const HOUND_SEEK = 88;
const HOUND_ROAD = 246;
const HOUND_MOUNT = 70;
const MOTH_HP = 2;
const MOTH_R = 9;
const MOTH_IDLE = 16;
const MOTH_SEEK = 236;
const MOTH_SEEK_T = 1.2;
const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const HEART_MAX = 3;
const HITSTOP = 0.08;
const IFRAMES = 0.35;
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
  moth: '灯蛾',
  ash: '余烬',
  scorch: '焦痕',
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
  dashSafe: '冲能穿过焰辙',
  chain: '连环了',
  loop: '回廊转起来了',
  moth: '灯蛾倒了',
  lure: '爆能引开灯蛾',
  ember: '别踩余烬',
  ash: '余烬还烫',
  ring: '绕环能连环',
};

const COL = {
  bg: '#14080a',
  ember: '#ff6a1a',
  gold: '#ffd24a',
  water: '#3a6b8c',
  core: '#ff5d8f',
  heart: '#ff5d8f',
  ash: '#6b5344',
  scorch: '#2a1810',
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

function comboText(n) {
  return String(n) + '连';
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
    embers: [],
    scorches: [],
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
    taughtDash: false,
    chainToastT: 0,
    lastBoomX: null,
    lastBoomY: null,
    boomSeekT: 0,
    burstN: 0,
    burstWait: 0,
    lastCombo: 0,
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
  s.embers.length = 0;
  s.scorches.length = 0;
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
  s.chainToastT = 0;
  s.lastBoomX = null;
  s.lastBoomY = null;
  s.boomSeekT = 0;
  s.burstN = 0;
  s.burstWait = 0;
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
    const moth = kind === NAMES.moth;
    return {
      x: e.x, y: e.y,
      r: moth ? MOTH_R : (hound ? 12 : ENEMY_R),
      hp: moth ? MOTH_HP : (hound ? HOUND_HP : ENEMY_HP),
      hitT: 0,
      kind: kind,
      faceX: 1,
      faceY: 0,
      flutter: 0,
    };
  });
  if (room.name === '夜市') toast(s, TOAST.night, 1.1, COL.gold);
  else if (room.name === '循径') toast(s, TOAST.road, 1.1, COL.gold);
  else if (room.name === '双刃') toast(s, TOAST.cut, 1.1, COL.water);
  else if (room.name === '回廊') toast(s, TOAST.loop, 1.3, COL.gold);
  else if (room.name === '灯巷') toast(s, TOAST.lure, 1.4, COL.gold);
  else if (room.name === '灰径') toast(s, TOAST.ash, 1.4, COL.ember);
  else if (room.name === '环行') toast(s, TOAST.ring, 1.4, COL.gold);
  else if (room.name === '夹道' && !s.taughtDash) {
    toast(s, TOAST.dashSafe, 1.4, COL.ember);
    s.taughtDash = true;
  }
}

function isHound(e) {
  return e.kind === NAMES.hound;
}

function isMoth(e) {
  return e.kind === NAMES.moth;
}

function updateMoth(s, e, dt) {
  e.flutter = (e.flutter || 0) + dt;
  let tx = e.x;
  let ty = e.y;
  let speed = MOTH_IDLE;
  if (s.boomSeekT > 0 && s.lastBoomX != null) {
    tx = s.lastBoomX;
    ty = s.lastBoomY;
    speed = MOTH_SEEK;
  } else {
    const a = e.flutter * 3.4;
    tx = e.x + Math.cos(a) * 6;
    ty = e.y + Math.sin(a) * 5;
  }
  const d = dist(e.x, e.y, tx, ty);
  if (d > 0.5) {
    e.faceX = (tx - e.x) / d;
    e.faceY = (ty - e.y) / d;
    e.x += e.faceX * speed * dt;
    e.y += e.faceY * speed * dt;
  }
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
  s.sparks.push({ x: x, y: y, t: TAIL_T, hot: !!hot, wet: wet, dead: false, fuse: false });
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

function dashIFrame(p) {
  return p && p.dashT > 0;
}

function hurtPlayer(s, srcX, srcY, why) {
  const p = s.player;
  if (s.won || s.dead || s.pendingNext > 0 || p.inv > 0) return false;
  if (dashIFrame(p) && (why === 'blast' || why === 'bump' || why === 'ember')) return false;
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
  else if (why === 'ember') toast(s, TOAST.ember, 1.1, COL.ember);
  else if (why === 'oob') toast(s, TOAST.oob, 1.1, COL.heart);
  else toast(s, TOAST.bump, 1.1, COL.heart);
  if (p.hearts <= 0) {
    p.hearts = 0;
    s.dead = true;
    toast(s, TOAST.empty, 99, COL.heart);
  }
  return true;
}

function spawnEmber(s, x, y, r, hot) {
  s.embers.push({
    x: x, y: y, r: r,
    t: EMBER_T,
    life: EMBER_T,
    hot: !!hot,
    hitEnemies: [],
  });
}

function spawnScorch(s, x, y, r, hot) {
  if (reducedMotion()) return;
  s.scorches.push({
    x: x, y: y, r: r,
    t: SCORCH_T,
    life: SCORCH_T,
    hot: !!hot,
  });
}

function updateScorches(s, dt) {
  for (let i = s.scorches.length - 1; i >= 0; i--) {
    s.scorches[i].t -= dt;
    if (s.scorches[i].t <= 0) s.scorches.splice(i, 1);
  }
}

function hurtEnemyFromEmber(s, e, em) {
  if (e.hp <= 0) return;
  if (e.hitT > 0) return;
  if (em.hitEnemies.indexOf(e) >= 0) return;
  if (dist(e.x, e.y, em.x, em.y) > em.r + e.r) return;
  em.hitEnemies.push(e);
  e.hp -= 1;
  e.hitT = 0.18;
  const d = dist(e.x, e.y, em.x, em.y) || 1;
  e.x += ((e.x - em.x) / d) * 14;
  e.y += ((e.y - em.y) / d) * 14;
  s.hitstop = Math.max(s.hitstop, hitstopAmt());
  punch(s, 4);
  if (e.hp <= 0) {
    burst(s, e.x, e.y, isMoth(e) ? 10 : 12, isMoth(e) ? COL.gold : COL.ember, 140);
    toast(s, isMoth(e) ? TOAST.moth : (isHound(e) ? TOAST.hound : TOAST.foe), 1.1, isMoth(e) ? COL.gold : COL.ember);
  }
}

function updateEmbers(s, dt, canHurt) {
  for (let i = s.embers.length - 1; i >= 0; i--) {
    const em = s.embers[i];
    em.t -= dt;
    if (em.t <= 0) {
      s.embers.splice(i, 1);
      continue;
    }
    if (!canHurt) continue;
    const p = s.player;
    if (dist(p.x, p.y, em.x, em.y) <= em.r + p.r) {
      hurtPlayer(s, em.x, em.y, 'ember');
    }
    for (let j = 0; j < s.enemies.length; j++) {
      hurtEnemyFromEmber(s, s.enemies[j], em);
    }
  }
}

function explode(s, x, y, hot, fused) {
  const r = hot ? HOT_BLAST_R : BLAST_R;
  s.stats.booms += 1;
  s.lastBoomX = x;
  s.lastBoomY = y;
  s.boomSeekT = MOTH_SEEK_T;
  spawnEmber(s, x, y, r, hot);
  spawnScorch(s, x, y, r, hot);
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
      e.hp -= (isHound(e) || isMoth(e)) ? 1 : (hot ? 2 : 1);
      e.hitT = 0.18;
      const d = dist(e.x, e.y, x, y) || 1;
      e.x += ((e.x - x) / d) * 22;
      e.y += ((e.y - y) / d) * 22;
      s.hitstop = Math.max(s.hitstop, hitstopAmt());
      punch(s, 6);
      hit = true;
      if (e.hp <= 0) {
        burst(s, e.x, e.y, isMoth(e) ? 10 : 12, isMoth(e) ? COL.gold : COL.ember, 140);
        toast(s, isMoth(e) ? TOAST.moth : (isHound(e) ? TOAST.hound : TOAST.foe), 1.1, isMoth(e) ? COL.gold : COL.ember);
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

  let chained = 0;
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead || k.wet) continue;
    if (k.x === x && k.y === y) continue;
    if (dist(k.x, k.y, x, y) <= r) {
      k.t = Math.min(k.t, CHAIN_T);
      k.fuse = true;
      chained += 1;
    }
  }
  if (chained > 0) {
    punch(s, 2);
    if (s.chainToastT <= 0) toast(s, TOAST.chain, 0.9, COL.gold);
    s.chainToastT = 2.2;
  }

  if (hit) punch(s, 6);
  else punch(s, 2);
  noteBoom(s, chained, !!fused);
}

function pendingFuse(s) {
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead || k.wet || !k.fuse) continue;
    if (k.t <= CHAIN_T) return true;
  }
  return false;
}

function finishBurst(s) {
  const n = s.burstN;
  s.burstN = 0;
  s.burstWait = 0;
  if (n < COMBO_MIN) return;
  s.lastCombo = n;
  if (s.dead || s.won) return;
  toast(s, comboText(n), 1.2, COL.gold);
  punch(s, 10);
}

function noteBoom(s, chained, fused) {
  if (chained > 0 || fused) s.burstN += 1;
  if (s.burstN <= 0) return;
  if (chained > 0 || pendingFuse(s)) {
    s.burstWait = CHAIN_T + 0.05;
    return;
  }
  finishBurst(s);
}

function tickBurst(s, dt) {
  if (s.burstWait <= 0) return;
  s.burstWait -= dt;
  if (s.burstWait > 0) return;
  if (pendingFuse(s)) s.burstWait = CHAIN_T;
  else finishBurst(s);
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
  if (!s.toast) toast(s, TOAST.clear, 1.1, COL.core);
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
      explode(s, k.x, k.y, k.hot, k.fuse);
    }
  }
  if (s.sparks.length > 80) {
    s.sparks = s.sparks.filter(function (k) { return !k.dead; });
  }
  tickBurst(s, dt);
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
  if (s.chainToastT > 0) s.chainToastT -= dt;
  if (s.boomSeekT > 0) s.boomSeekT -= dt;
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
  updateScorches(s, dt);

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
    updateEmbers(s, dt, false);
    if (s.pendingNext <= 0) goNext(s);
    return;
  }

  if (s.won || s.dead) {
    updateSparks(s, dt);
    updateEmbers(s, dt, false);
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
  updateEmbers(s, dt, true);

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    if (e.hitT > 0) e.hitT -= dt;
    if (isHound(e)) updateHound(s, e, dt);
    else if (isMoth(e)) updateMoth(s, e, dt);
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

  for (let i = 0; i < s.scorches.length; i++) {
    const sc = s.scorches[i];
    const k = clamp(sc.t / sc.life, 0, 1);
    const rad = sc.r * (0.9 + 0.04 * k);
    if (rad < 2) continue;
    const stain = ctx.createRadialGradient(sc.x, sc.y, rad * 0.12, sc.x, sc.y, rad);
    stain.addColorStop(0, 'rgba(18,8,6,' + (0.2 + 0.16 * k) + ')');
    stain.addColorStop(0.62, 'rgba(42,20,12,' + (0.14 + 0.12 * k) + ')');
    stain.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = stain;
    ctx.beginPath();
    ctx.arc(sc.x, sc.y, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.18 + 0.28 * k;
    ctx.strokeStyle = mixHex(COL.scorch, COL.ember, sc.hot ? 0.28 : 0.16);
    ctx.lineWidth = (1.5 + 1.1 * k) / fit.scale;
    ctx.beginPath();
    ctx.arc(sc.x, sc.y, rad * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
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

  for (let i = 0; i < s.embers.length; i++) {
    const em = s.embers[i];
    const k = clamp(em.t / em.life, 0, 1);
    const rad = em.r * (0.88 + 0.12 * k);
    if (rad < 2) continue;
    const col = em.hot ? COL.gold : COL.ember;
    glow(ctx, em.x, em.y, rad * 1.06, col, 0.1 + 0.26 * k);
    ctx.globalAlpha = 0.22 + 0.52 * k;
    ctx.strokeStyle = mixHex(COL.ember, COL.gold, em.hot ? 0.7 : 1 - k);
    ctx.lineWidth = (2.4 + 2.6 * k) / fit.scale;
    ctx.beginPath();
    ctx.arc(em.x, em.y, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
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
    if (isMoth(e)) {
      const flick = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.time * 14 + e.x * 0.02));
      glow(ctx, e.x, e.y, 15, '#fff8dc', 0.16 + 0.28 * flick);
      glow(ctx, e.x, e.y, 9, COL.gold, 0.22 * flick);
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(Math.atan2(e.faceY || 0, e.faceX || 1));
      const flap = Math.sin((s.time + e.flutter) * 16) * 0.28;
      ctx.fillStyle = flash ? '#ffffff' : 'rgba(255, 244, 210, 0.82)';
      ctx.beginPath();
      ctx.ellipse(-5.5, -1.2, 6.4, 3.4 + flap * 1.6, -0.45, 0, Math.PI * 2);
      ctx.ellipse(5.5, -1.2, 6.4, 3.4 + flap * 1.6, 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = flash ? '#ffffff' : '#fff6d0';
      ctx.ellipse(0, 0, 3.2, 5.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#fff6d0';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.moth, e.x, e.y + e.r + 12);
      for (let h = 0; h < MOTH_HP; h++) {
        ctx.fillStyle = h < e.hp ? '#fff6d0' : 'rgba(255,246,208,0.2)';
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

function roomHudText(s) {
  const n = ensureRooms().length;
  return (s.roomName || '') + ' · ' + (s.roomIndex + 1) + '/' + n;
}

function syncHud(s, heartsEl, toastEl, roomEl, comboEl) {
  heartsEl.textContent = '心×' + s.player.hearts;
  if (roomEl) {
    roomEl.textContent = roomHudText(s);
  }
  if (comboEl) {
    comboEl.textContent = s.lastCombo >= COMBO_MIN ? comboText(s.lastCombo) : '';
  }
  if (s.toast && (s.toastT > 0 || s.won || s.dead)) {
    toastEl.hidden = false;
    toastEl.textContent = s.toast + ((s.won || s.dead) ? '  ·  R 再玩' : '');
    toastEl.style.color = s.toastColor || '';
  } else {
    toastEl.hidden = true;
  }
}

function startLoop(s, canvas, ctx, heartsEl, toastEl, roomEl, comboEl) {
  let last = performance.now();
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.033);
    last = now;
    update(s, dt);
    const dpr = view.dpr;
    ctx.setTransform(dpr * view.scale, 0, 0, dpr * view.scale, dpr * view.ox, dpr * view.oy);
    draw(s, ctx);
    syncHud(s, heartsEl, toastEl, roomEl, comboEl);
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
  const comboEl = document.getElementById('combo');
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
    startLoop(s, canvas, ctx, heartsEl, toastEl, roomEl, comboEl);
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
  if (EMBER_T !== 0.55) throw new Error('EMBER_T 0.55');
  if (SCORCH_T !== 1.2) throw new Error('焦痕 1.2s');
  if (!ROOMS || ROOMS.length !== 12) throw new Error('need 12 rooms, got ' + (ROOMS ? ROOMS.length : 0));
  const want = ['空场', '追者', '水巷', '箱巷', '夹道', '夜市', '循径', '双刃', '回廊', '灯巷', '灰径', '环行'];
  for (let i = 0; i < want.length; i++) {
    if (!ROOMS[i] || ROOMS[i].name !== want[i]) {
      throw new Error('room ' + i + ' ' + (ROOMS[i] && ROOMS[i].name));
    }
    if (!roomW(ROOMS[i]) || !roomH(ROOMS[i]) || !roomSpawn(ROOMS[i])) {
      throw new Error('room fields ' + ROOMS[i].name);
    }
  }
  if (ROOMS[8].id !== 'huilang') throw new Error('回廊 id');
  if (ROOMS[9].id !== 'dengxiang') throw new Error('灯巷 id');
  if (ROOMS[10].id !== 'huijing') throw new Error('灰径 id');
  if (ROOMS[11].id !== 'huanxing') throw new Error('环行 id');
  if (ROOMS[11].name !== '环行') throw new Error('room 12 环行');

  const fitJ = roomFit({ roomW: 960, roomH: 140 });
  if (Math.abs(fitJ.scale - 1) > 1e-9) throw new Error('letterbox must not stretch');
  if (Math.abs(fitJ.ox) > 1e-9) throw new Error('jiadao letterbox x');
  if (Math.abs(fitJ.oy - 200) > 1e-6) throw new Error('jiadao letterbox y');

  const fitK = roomFit({ roomW: 840, roomH: 480 });
  if (Math.abs(fitK.scale - Math.min(960 / 840, 540 / 480)) > 1e-9) throw new Error('kongchang letterbox');

  const need = ['尾火', '烬卫', '箱', '心核', '回星', '水洼', '焰辙', '循辙', '灯蛾', '余烬', '焦痕'];
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
  if (NAMES.moth !== '灯蛾') throw new Error('灯蛾 name');
  if (NAMES.scorch !== '焦痕') throw new Error('焦痕 exists');
  let houndN = 0;
  let mothN = 0;
  for (let r = 0; r < ROOMS.length; r++) {
    const ens = ROOMS[r].enemies || [];
    for (let j = 0; j < ens.length; j++) {
      const k = ens[j].type || ens[j].kind;
      if (k === '循辙') houndN += 1;
      if (k === '灯蛾') mothN += 1;
    }
  }
  if (houndN < 1) throw new Error('循辙 exists');
  if (mothN < 1) throw new Error('灯蛾 exists');
  if (MOTH_SEEK_T !== 1.2) throw new Error('灯蛾 seek 1.2s');
  if (MOTH_HP !== 2) throw new Error('灯蛾 2 HP');
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

  if (DASH_TIME !== 0.18) throw new Error('DASH_TIME ~0.18');
  if (IFRAMES !== 0.35) throw new Error('IFRAMES 0.35');
  if (typeof dashIFrame !== 'function') throw new Error('dash i-frame');

  const dashBlast = makeState();
  resetRoom(dashBlast, 0, false);
  dashBlast.player.dashT = DASH_TIME;
  const dashHp = dashBlast.player.hearts;
  explode(dashBlast, dashBlast.player.x, dashBlast.player.y, false);
  if (dashBlast.player.hearts !== dashHp) throw new Error('dash i-frame own blast');

  const dashTouch = makeState();
  resetRoom(dashTouch, 1, false);
  dashTouch.player.dashT = DASH_TIME;
  dashTouch.player.inv = 0;
  const touchHp = dashTouch.player.hearts;
  const foe = dashTouch.enemies[0];
  if (!foe) throw new Error('dash i-frame need enemy');
  foe.x = dashTouch.player.x;
  foe.y = dashTouch.player.y;
  update(dashTouch, 0.016);
  if (dashTouch.player.hearts !== touchHp) throw new Error('dash i-frame enemy');

  const dashHot = makeState();
  resetRoom(dashHot, 0, false);
  dashHot.input.x = 1;
  dashHot.input.dash = true;
  for (let i = 0; i < 10; i++) update(dashHot, 0.02);
  let hotN = 0;
  for (let i = 0; i < dashHot.sparks.length; i++) {
    if (dashHot.sparks[i].hot) hotN += 1;
  }
  if (hotN < 1) throw new Error('dash still leaves hot sparks');

  const afterDash = makeState();
  resetRoom(afterDash, 0, false);
  afterDash.player.dashT = 0;
  const afterHp = afterDash.player.hearts;
  explode(afterDash, afterDash.player.x, afterDash.player.y, false);
  if (afterDash.player.hearts !== afterHp - 1) throw new Error('own blast hurts when not dashing');

  const hitInv = makeState();
  resetRoom(hitInv, 0, false);
  hurtPlayer(hitInv, hitInv.player.x + 10, hitInv.player.y, 'bump');
  if (Math.abs(hitInv.player.inv - 0.35) > 1e-9) throw new Error('hit invuln 0.35s');

  const hud0 = makeState();
  resetRoom(hud0, 0, false);
  if (roomHudText(hud0) !== '空场 · 1/12') throw new Error('HUD 空场 1/12');
  const hud2 = makeState();
  resetRoom(hud2, 2, false);
  if (roomHudText(hud2) !== '水巷 · 3/12') throw new Error('HUD 3/12');

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

  const shuang = makeState();
  resetRoom(shuang, 7, false);
  if (shuang.roomName !== '双刃') throw new Error('shuangren load');
  takeCore(shuang, { x: 100, y: 100 });
  if (shuang.won) throw new Error('双刃 should not 通关');
  for (let i = 0; i < 20; i++) update(shuang, 0.1);
  if (shuang.roomName !== '回廊') throw new Error('core advances to 回廊');

  const last = makeState();
  resetRoom(last, 8, false);
  if (last.roomName !== '回廊' || last.roomId !== 'huilang') throw new Error('huilang load');
  if (last.toast !== TOAST.loop) throw new Error('回廊 intro');
  let loopHound = 0;
  let loopGuard = 0;
  for (let i = 0; i < last.enemies.length; i++) {
    if (isHound(last.enemies[i])) loopHound += 1;
    else loopGuard += 1;
  }
  if (loopGuard !== 2 || loopHound !== 1) throw new Error('回廊 2 烬卫 + 1 循辙');
  if (!last.waters.length) throw new Error('回廊 needs 水洼');
  let loopCore = 0;
  let loopHeal = 0;
  for (let i = 0; i < last.crates.length; i++) {
    if (last.crates[i].loot === 'core') loopCore += 1;
    if (last.crates[i].loot === 'heal') loopHeal += 1;
  }
  if (loopCore !== 1 || loopHeal < 1) throw new Error('回廊 心核/回星');
  const coreBox = last.crates.find(function (c) { return c.loot === 'core'; });
  explode(last, 858, 416, false);
  if (!coreBox.open) throw new Error('回廊 dry trail should open 心核');
  last.roomIndex = 8;
  takeCore(last, { x: 100, y: 100 });
  if (last.won) throw new Error('回廊 should not 通关');
  for (let i = 0; i < 20; i++) update(last, 0.1);
  if (last.roomName !== '灯巷') throw new Error('core advances to 灯巷');

  const mid = makeState();
  resetRoom(mid, 0, false);
  takeCore(mid, { x: 200, y: 200 });
  if (mid.pendingNext <= 0) throw new Error('core should queue next room');
  for (let i = 0; i < 20; i++) update(mid, 0.1);
  if (mid.roomName !== '追者') throw new Error('core advances to 追者');

  if (HITSTOP !== 0.08) throw new Error('hitstop 80ms');
  if (CHAIN_T !== 0.12) throw new Error('CHAIN_T 0.12');
  if (TOAST.chain !== '连环了') throw new Error('连环了');

  const ch = makeState();
  resetRoom(ch, 0, false);
  ch.player.x = 40;
  ch.player.y = 40;
  for (let i = 0; i < 5; i++) dropSpark(ch, 200 + i * SPARK_GAP, 200, false);
  ch.sparks[0].t = 0;
  update(ch, 0.016);
  if (ch.stats.booms !== 1) throw new Error('chain must not sync recurse');
  if (ch.sparks[1].dead) throw new Error('chain delays neighbor');
  if (ch.sparks[1].t > CHAIN_T + 1e-9) throw new Error('chain cuts timer');
  if (ch.sparks[3].t <= CHAIN_T) throw new Error('outside blast no chain');
  if (ch.toast !== TOAST.chain) throw new Error('连环了 toast');
  update(ch, 0);
  if (ch.stats.booms !== 1) throw new Error('same explode no re-trigger');
  for (let i = 0; i < 10; i++) update(ch, 0.016);
  if (ch.stats.booms < 3) throw new Error('cascade via timers');
  for (let i = 0; i < 40; i++) update(ch, 0.016);
  if (ch.stats.booms < COMBO_MIN) throw new Error('combo toast at 3+');
  if (ch.toast !== comboText(ch.stats.booms)) throw new Error('combo toast ' + ch.toast);
  if (ch.lastCombo < COMBO_MIN) throw new Error('lastCombo');
  if (comboText(3) !== '3连' || comboText(5) !== '5连') throw new Error('3连/5连');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const duo = makeState();
  resetRoom(duo, 0, false);
  duo.player.x = 40;
  duo.player.y = 40;
  dropSpark(duo, 200, 200, false);
  dropSpark(duo, 200 + SPARK_GAP, 200, false);
  duo.sparks[0].t = 0;
  for (let i = 0; i < 40; i++) update(duo, 0.016);
  if (duo.stats.booms !== 2) throw new Error('duo chain size');
  if (duo.toast === comboText(2)) throw new Error('no 2连');
  if (duo.lastCombo >= COMBO_MIN) throw new Error('duo lastCombo');

  const hotCh = makeState();
  resetRoom(hotCh, 0, false);
  hotCh.player.x = 40;
  hotCh.player.y = 40;
  dropSpark(hotCh, 200, 200, true);
  dropSpark(hotCh, 200 + 50, 200, false);
  hotCh.sparks[0].t = 0;
  update(hotCh, 0.016);
  if (hotCh.sparks[1].t > CHAIN_T + 1e-9) throw new Error('hot blast chains at HOT_BLAST_R');

  const coldCh = makeState();
  resetRoom(coldCh, 0, false);
  coldCh.player.x = 40;
  coldCh.player.y = 40;
  dropSpark(coldCh, 200, 200, false);
  dropSpark(coldCh, 200 + 50, 200, false);
  coldCh.sparks[0].t = 0;
  update(coldCh, 0.016);
  if (coldCh.sparks[1].t <= CHAIN_T) throw new Error('normal blast uses BLAST_R');

  const wetCh = makeState();
  resetRoom(wetCh, 0, false);
  wetCh.player.x = 40;
  wetCh.player.y = 40;
  wetCh.waters = [{ x: 90, y: 80, w: 50, h: 50 }];
  dropSpark(wetCh, 120, 100, false);
  dropSpark(wetCh, 150, 100, false);
  if (!wetCh.sparks[0].wet || wetCh.sparks[1].wet) throw new Error('wet/dry pair');
  wetCh.sparks[0].t = 0;
  update(wetCh, 0.016);
  if (wetCh.stats.booms !== 0) throw new Error('fizzle must not boom');
  if (wetCh.sparks[1].t <= CHAIN_T) throw new Error('fizzle must not chain');
  wetCh.sparks[1].t = 0;
  update(wetCh, 0.016);
  if (wetCh.stats.booms !== 1) throw new Error('dry neighbor still booms later');

  const wetHit = makeState();
  resetRoom(wetHit, 0, false);
  wetHit.player.x = 40;
  wetHit.player.y = 40;
  wetHit.waters = [{ x: 210, y: 180, w: 40, h: 40 }];
  dropSpark(wetHit, 200, 200, false);
  dropSpark(wetHit, 218, 200, false);
  if (wetHit.sparks[0].wet || !wetHit.sparks[1].wet) throw new Error('dry hits wet');
  wetHit.sparks[0].t = 0;
  update(wetHit, 0.016);
  if (wetHit.sparks[1].dead) throw new Error('wet spark stays live');
  if (wetHit.sparks[1].t <= CHAIN_T) throw new Error('wet spark not chained');

  const alley = makeState();
  resetRoom(alley, 9, false);
  if (alley.roomName !== '灯巷' || alley.roomId !== 'dengxiang') throw new Error('dengxiang load');
  if (alley.toast !== TOAST.lure) throw new Error('灯巷 intro');
  if (!alley.waters.length) throw new Error('灯巷 needs 水洼');
  let alleyMoth = 0;
  let alleyCore = 0;
  for (let i = 0; i < alley.enemies.length; i++) {
    if (isMoth(alley.enemies[i])) alleyMoth += 1;
  }
  if (alleyMoth < 2) throw new Error('灯巷 needs 灯蛾');
  for (let i = 0; i < alley.crates.length; i++) {
    if (alley.crates[i].loot === 'core') alleyCore += 1;
  }
  if (alleyCore !== 1) throw new Error('灯巷 心核');
  takeCore(alley, { x: 100, y: 100 });
  if (alley.won) throw new Error('灯巷 should not 通关');
  for (let i = 0; i < 20; i++) update(alley, 0.1);
  if (alley.roomName !== '灰径') throw new Error('core advances to 灰径');

  const ashRoom = makeState();
  resetRoom(ashRoom, 10, false);
  if (ashRoom.roomName !== '灰径' || ashRoom.roomId !== 'huijing') throw new Error('huijing load');
  if (ashRoom.toast !== TOAST.ash) throw new Error('灰径 intro');
  if (ashRoom.roomH > 260) throw new Error('灰径 should be narrow-ish');
  if (ashRoom.waters.length) throw new Error('灰径 dry so 余烬 stays');
  let ashCore = 0;
  for (let i = 0; i < ashRoom.crates.length; i++) {
    if (ashRoom.crates[i].loot === 'core') ashCore += 1;
  }
  if (ashCore !== 1) throw new Error('灰径 心核');
  takeCore(ashRoom, { x: 100, y: 100 });
  if (ashRoom.won) throw new Error('灰径 should not 通关');
  for (let i = 0; i < 20; i++) update(ashRoom, 0.1);
  if (ashRoom.roomName !== '环行') throw new Error('core advances to 环行');

  const hudAsh = makeState();
  resetRoom(hudAsh, 10, false);
  if (roomHudText(hudAsh) !== '灰径 · 11/12') throw new Error('HUD 灰径 11/12');

  const ring = makeState();
  resetRoom(ring, 11, false);
  if (ring.roomName !== '环行' || ring.roomId !== 'huanxing') throw new Error('huanxing load');
  if (ring.toast !== TOAST.ring) throw new Error('环行 intro');
  if (TOAST.ring !== '绕环能连环') throw new Error('绕环能连环');
  let ringHound = 0;
  for (let i = 0; i < ring.enemies.length; i++) {
    if (isHound(ring.enemies[i])) ringHound += 1;
  }
  if (ringHound !== 2) throw new Error('环行 2 循辙');
  const ringCore = ring.crates.find(function (c) { return c.loot === 'core'; });
  if (!ringCore) throw new Error('环行 心核');
  const holeX = ringCore.x + ringCore.w * 0.5;
  const holeY = ringCore.y + ringCore.h * 0.5;
  if (dist(holeX, holeY, ring.roomW * 0.5, ring.roomH * 0.5) > 40) {
    throw new Error('环行 core in the hole');
  }
  if (ring.waters.length) throw new Error('环行 dry so fuse loops');
  takeCore(ring, { x: 100, y: 100 });
  if (!ring.won || ring.toast !== TOAST.all) throw new Error('环行 should 通关');

  const hudRing = makeState();
  resetRoom(hudRing, 11, false);
  if (roomHudText(hudRing) !== '环行 · 12/12') throw new Error('HUD 环行 12/12');

  const ringRun = makeState();
  resetRoom(ringRun, 11, false);
  const rr = ringRun.enemies.find(function (e) { return isHound(e); });
  if (!rr) throw new Error('环行 循辙 for circle');
  const rrX = rr.x;
  const rrY = rr.y;
  const idleRing = makeState();
  resetRoom(idleRing, 11, false);
  const ir = idleRing.enemies.find(function (e) { return isHound(e); });
  const irX = ir.x;
  const irY = ir.y;
  for (let i = 0; i < 20; i++) update(idleRing, 0.05);
  const ringIdleD = dist(ir.x, ir.y, irX, irY);
  const rcx = 480;
  const rcy = 270;
  const rcr = 180;
  const ringSteps = 28;
  for (let i = 0; i <= ringSteps; i++) {
    const a = (Math.PI * 2 * i) / ringSteps;
    dropSpark(ringRun, rcx + Math.cos(a) * rcr, rcy + Math.sin(a) * rcr, false);
  }
  for (let i = 0; i < 20; i++) update(ringRun, 0.05);
  const ringRoadD = dist(rr.x, rr.y, rrX, rrY);
  if (ringRoadD <= ringIdleD + 10) throw new Error('环行 循辙 should run the circle');

  const em = makeState();
  resetRoom(em, 0, false);
  em.player.x = 80;
  em.player.y = 80;
  explode(em, 400, 220, false);
  if (!em.embers.length) throw new Error('boom spawns 余烬');
  if (Math.abs(em.embers[0].r - BLAST_R) > 1e-9) throw new Error('余烬 radius = blast');
  if (Math.abs(em.embers[0].t - EMBER_T) > 1e-9) throw new Error('余烬 life 0.55');
  em.player.x = 400;
  em.player.y = 220;
  em.player.inv = 0;
  em.player.dashT = 0;
  const emHp = em.player.hearts;
  update(em, 0.016);
  if (em.player.hearts !== emHp - 1) throw new Error('余烬 can hurt');
  if (em.toast !== TOAST.ember) throw new Error('别踩余烬');

  const emDash = makeState();
  resetRoom(emDash, 0, false);
  emDash.player.x = 80;
  emDash.player.y = 80;
  explode(emDash, 400, 220, false);
  emDash.player.x = 400;
  emDash.player.y = 220;
  emDash.player.inv = 0;
  emDash.player.dashT = DASH_TIME;
  const emDashHp = emDash.player.hearts;
  update(emDash, 0.016);
  if (emDash.player.hearts !== emDashHp) throw new Error('dash i-frame 余烬');

  const emInv = makeState();
  resetRoom(emInv, 0, false);
  emInv.player.x = 80;
  emInv.player.y = 80;
  explode(emInv, 400, 220, false);
  emInv.player.x = 400;
  emInv.player.y = 220;
  emInv.player.inv = IFRAMES;
  emInv.player.dashT = 0;
  const emInvHp = emInv.player.hearts;
  update(emInv, 0.016);
  if (emInv.player.hearts !== emInvHp) throw new Error('hit-invuln 余烬');

  const emHot = makeState();
  resetRoom(emHot, 0, false);
  emHot.player.x = 80;
  emHot.player.y = 80;
  explode(emHot, 400, 220, true);
  if (Math.abs(emHot.embers[0].r - HOT_BLAST_R) > 1e-9) throw new Error('hot 余烬 radius');

  const emGone = makeState();
  resetRoom(emGone, 0, false);
  emGone.player.x = 80;
  emGone.player.y = 80;
  explode(emGone, 400, 220, false);
  for (let i = 0; i < 40; i++) update(emGone, 0.02);
  if (emGone.embers.length) throw new Error('余烬 fades at 0.55s');
  emGone.player.x = 400;
  emGone.player.y = 220;
  emGone.player.inv = 0;
  const goneHp = emGone.player.hearts;
  update(emGone, 0.016);
  if (emGone.player.hearts !== goneHp) throw new Error('dead 余烬 no hurt');

  const emFoe = makeState();
  resetRoom(emFoe, 1, false);
  const foeEm = emFoe.enemies[0];
  if (!foeEm) throw new Error('余烬 enemy need 烬卫');
  emFoe.player.x = 40;
  emFoe.player.y = 40;
  emFoe.player.inv = 2;
  explode(emFoe, 700, 80, false);
  foeEm.x = 700;
  foeEm.y = 80;
  foeEm.hitT = 0;
  const foeHp = foeEm.hp;
  update(emFoe, 0.016);
  if (foeEm.hp !== foeHp - 1) throw new Error('余烬 can hurt enemy');

  const sc = makeState();
  resetRoom(sc, 0, false);
  sc.player.x = 80;
  sc.player.y = 80;
  explode(sc, 400, 220, false);
  if (!sc.scorches.length) throw new Error('boom spawns 焦痕');
  if (Math.abs(sc.scorches[0].r - BLAST_R) > 1e-9) throw new Error('焦痕 radius = blast');
  if (Math.abs(sc.scorches[0].t - SCORCH_T) > 1e-9) throw new Error('焦痕 life 1.2');
  for (let i = 0; i < 36; i++) update(sc, 0.02);
  if (!sc.scorches.length) throw new Error('焦痕 still after 余烬');
  if (sc.embers.length) throw new Error('余烬 gone before 焦痕');
  sc.player.x = 400;
  sc.player.y = 220;
  sc.player.inv = 0;
  sc.player.dashT = 0;
  const scHp = sc.player.hearts;
  update(sc, 0.016);
  if (sc.player.hearts !== scHp) throw new Error('焦痕 does not deal HP');

  const scHot = makeState();
  resetRoom(scHot, 0, false);
  scHot.player.x = 80;
  scHot.player.y = 80;
  explode(scHot, 400, 220, true);
  if (Math.abs(scHot.scorches[0].r - HOT_BLAST_R) > 1e-9) throw new Error('hot 焦痕 radius');

  const scFade = makeState();
  resetRoom(scFade, 0, false);
  scFade.player.x = 80;
  scFade.player.y = 80;
  explode(scFade, 400, 220, false);
  for (let i = 0; i < 70; i++) update(scFade, 0.02);
  if (scFade.scorches.length) throw new Error('焦痕 fades at 1.2s');

  const mothIdle = makeState();
  resetRoom(mothIdle, 9, false);
  const mi = mothIdle.enemies.find(function (e) { return isMoth(e); });
  if (!mi || mi.hp !== 2) throw new Error('灯巷 needs 灯蛾 2hp');
  mothIdle.player.x = 40;
  mothIdle.player.y = 40;
  mothIdle.player.inv = 2;
  const mix = mi.x;
  const miy = mi.y;
  const playerX = mothIdle.player.x;
  const playerY = mothIdle.player.y;
  for (let i = 0; i < 20; i++) update(mothIdle, 0.05);
  const mothIdleD = dist(mi.x, mi.y, mix, miy);
  const mothToPlayer0 = dist(mix, miy, playerX, playerY);
  const mothToPlayer1 = dist(mi.x, mi.y, playerX, playerY);
  if (mothToPlayer0 - mothToPlayer1 > 18) throw new Error('灯蛾 must not seek the player');

  const mothSeek = makeState();
  resetRoom(mothSeek, 9, false);
  const mk = mothSeek.enemies.find(function (e) { return isMoth(e); });
  mothSeek.player.x = 40;
  mothSeek.player.y = 40;
  mothSeek.player.inv = 2;
  mk.x = 220;
  mk.y = 180;
  const boomX = 520;
  const boomY = 180;
  explode(mothSeek, boomX, boomY, false);
  if (mothSeek.lastBoomX !== boomX || mothSeek.lastBoomY !== boomY) throw new Error('latest boom stored');
  if (Math.abs(mothSeek.boomSeekT - MOTH_SEEK_T) > 1e-9) throw new Error('seek 1.2 after boom');
  const laterX = 220;
  const laterY = 320;
  explode(mothSeek, laterX, laterY, false);
  if (mothSeek.lastBoomX !== laterX || mothSeek.lastBoomY !== laterY) throw new Error('seeks latest boom');
  const sx0 = mk.x;
  const sy0 = mk.y;
  for (let i = 0; i < 16; i++) update(mothSeek, 0.05);
  const towardLatest = dist(mk.x, mk.y, laterX, laterY);
  const towardFirst = dist(mk.x, mk.y, boomX, boomY);
  const towardPlayer = dist(mk.x, mk.y, mothSeek.player.x, mothSeek.player.y);
  if (dist(mk.x, mk.y, sx0, sy0) < 40) throw new Error('灯蛾 should sprint to boom');
  if (towardLatest >= dist(sx0, sy0, laterX, laterY) - 8) throw new Error('灯蛾 toward latest boom');
  if (towardLatest > towardFirst) throw new Error('灯蛾 prefers latest boom not first');
  if (towardPlayer < dist(sx0, sy0, mothSeek.player.x, mothSeek.player.y) - 8) {
    throw new Error('灯蛾 sprints to boom not player');
  }

  const mothHp = makeState();
  resetRoom(mothHp, 9, false);
  const mh = mothHp.enemies.find(function (e) { return isMoth(e); });
  explode(mothHp, mh.x, mh.y, true);
  if (mh.hp !== 1) throw new Error('灯蛾 any blast is 1');
  explode(mothHp, mh.x, mh.y, false);
  if (mh.hp > 0) throw new Error('灯蛾 dies in 2 blasts');

  console.log('selfCheck ok', {
    TAIL_T: TAIL_T,
    DASH_TIME: DASH_TIME,
    IFRAMES: IFRAMES,
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
