'use strict';

const TAIL_T = 2.0;
const HASTE_T = 0.55;
const ECHO_T = 0.45;
const TIDE_LOW = 2.8;
const TIDE_HIGH = 1.2;
const SPARK_GAP = 18;
const BLAST_R = 36;
const HOT_BLAST_R = 56;
const SEED_R = 72;
const SUCK_R = 140;
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
const EATER_HP = 2;
const EATER_R = 11;
const EATER_IDLE = 18;
const EATER_SEEK = 96;
const EATER_EAT = 16;
const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const HEART_MAX = 3;
const HITSTOP = 0.08;
const BIG_CHAIN_HIT = 0.08;
const BIG_CHAIN_PUNCH = 14;
const BIG_COMBO = 5;
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
  oil: '油渍',
  tide: '潮涌',
  spark: '焰辙',
  hound: '循辙',
  moth: '灯蛾',
  ash: '余烬',
  scorch: '焦痕',
  hint: '跑过的路两秒后会爆',
  watch: '观摩',
  seed: '焰种',
  haste: '急燃',
  echo: '回爆',
  suck: '吸爆',
  eater: '拾烬',
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
  wire: '密线一拉就炸',
  watch: '观摩中',
  watchOff: '手玩',
  tideOn: '潮来了',
  tideOff: '潮退了',
  tide: '潮会熄辙',
  seed: '焰种放大下一爆',
  seedGet: '捡到焰种',
  seedBoom: '焰种爆了',
  oil: '油渍烫了',
  oilRoom: '油渍烫爆',
  hasteGet: '急燃到手',
  hasteUse: '急燃爆了',
  hasteRoom: '急燃先爆',
  echoGet: '捡到回爆',
  echoUse: '回爆来了',
  echoRoom: '回爆会再炸',
  suckGet: '捡到吸爆',
  suckUse: '吸爆来了',
  suckRoom: '吸爆会吸辙',
  eater: '拾烬倒了',
  eaterEat: '拾烬吃辙',
  eaterRoom: '拾烬会吃辙',
};

const COL = {
  bg: '#14080a',
  ember: '#ff6a1a',
  gold: '#ffd24a',
  haste: '#ff9a3c',
  echo: '#e8b45a',
  suck: '#4ad8c8',
  water: '#3a6b8c',
  oil: '#8a4a12',
  eater: '#9a6ab0',
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

function tideHigh(s) {
  const t = (s && s.tideT) || 0;
  return (t % (TIDE_LOW + TIDE_HIGH)) >= TIDE_LOW;
}

function hasTidePuddle(s) {
  if (!s || !s.waters) return false;
  for (let i = 0; i < s.waters.length; i++) {
    if (s.waters[i].tide) return true;
  }
  return false;
}

function inWater(s, x, y) {
  const high = tideHigh(s);
  for (let i = 0; i < s.waters.length; i++) {
    const w = s.waters[i];
    if (x < w.x || x > w.x + w.w || y < w.y || y > w.y + w.h) continue;
    if (w.tide && !high) continue;
    return true;
  }
  return false;
}

function inOil(s, x, y) {
  if (!s || !s.oils) return false;
  for (let i = 0; i < s.oils.length; i++) {
    const o = s.oils[i];
    if (x < o.x || x > o.x + o.w || y < o.y || y > o.y + o.h) continue;
    return true;
  }
  return false;
}

function tickTide(s, dt) {
  const was = !!s.tideHigh;
  s.tideT = (s.tideT || 0) + dt;
  const now = tideHigh(s);
  s.tideHigh = now;
  if (now === was || !hasTidePuddle(s)) return;
  if (now) {
    for (let i = 0; i < s.sparks.length; i++) {
      const k = s.sparks[i];
      if (k.dead || k.wet) continue;
      if (!inWater(s, k.x, k.y)) continue;
      k.wet = true;
      k.t = Math.min(k.t, 0.08);
    }
    toast(s, TOAST.tideOn, 1.1, COL.water);
    sfx('fizzle');
    punch(s, 2);
  } else {
    toast(s, TOAST.tideOff, 1.1, COL.water);
  }
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
  if (drop === '焰种' || drop === 'seed') return 'seed';
  if (drop === '急燃' || drop === 'haste') return 'haste';
  if (drop === '回爆' || drop === 'echo') return 'echo';
  if (drop === '吸爆' || drop === 'suck') return 'suck';
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
    oils: [],
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
    taughtOil: false,
    taughtEat: false,
    chainToastT: 0,
    lastBoomX: null,
    lastBoomY: null,
    boomSeekT: 0,
    burstN: 0,
    burstWait: 0,
    lastCombo: 0,
    seed: 0,
    hasteReady: false,
    echoReady: false,
    suckReady: false,
    echoes: [],
    echoing: false,
    watch: false,
    watchSide: 1,
    watchStuckT: 0,
    watchLastX: 110,
    watchLastY: 310,
    tideT: 0,
    tideHigh: false,
  };
}

function resetRoom(s, index, keepHearts) {
  ensureRooms();
  if (index == null) index = s.roomIndex || 0;
  if (index < 0) index = 0;
  if (ROOMS.length && index >= ROOMS.length) index = ROOMS.length - 1;
  const room = ROOMS[index] || {
    id: '', name: '', w: VIEW_W, h: VIEW_H,
    spawn: { x: 110, y: 310 }, puddles: [], crates: [], enemies: [], items: [],
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
  s.seed = 0;
  s.hasteReady = false;
  s.echoReady = false;
  s.suckReady = false;
  s.echoing = false;
  if (!s.echoes) s.echoes = [];
  s.echoes.length = 0;
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
  s.tideT = 0;
  s.tideHigh = false;
  s.taughtOil = false;
  s.taughtEat = false;
  s.waters = (room.puddles || []).map(function (p) {
    return { x: p.x, y: p.y, w: p.w, h: p.h, tide: !!p.tide };
  });
  s.oils = (room.oils || []).map(function (p) {
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
      thick: !!c.thick,
    };
  });
  s.items = (room.items || []).map(function (it) {
    return {
      kind: lootKind(it.kind) || lootKind(it.drop),
      x: it.x,
      y: it.y,
      r: 10,
      taken: false,
    };
  }).filter(function (it) { return it.kind; });
  s.enemies = (room.enemies || []).map(function (e) {
    const kind = e.type || e.kind || NAMES.enemy;
    const hound = kind === NAMES.hound;
    const moth = kind === NAMES.moth;
    const eater = kind === NAMES.eater;
    return {
      x: e.x, y: e.y,
      r: moth ? MOTH_R : (eater ? EATER_R : (hound ? 12 : ENEMY_R)),
      hp: moth ? MOTH_HP : (eater ? EATER_HP : (hound ? HOUND_HP : ENEMY_HP)),
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
  else if (room.name === '密线') toast(s, TOAST.wire, 1.4, COL.gold);
  else if (room.name === '潮廊') toast(s, TOAST.tide, 1.4, COL.water);
  else if (room.name === '种廊') toast(s, TOAST.seed, 1.4, COL.gold);
  else if (room.name === '油廊') toast(s, TOAST.oilRoom, 1.4, COL.gold);
  else if (room.name === '急廊') toast(s, TOAST.hasteRoom, 1.4, COL.haste);
  else if (room.name === '拾廊') toast(s, TOAST.eaterRoom, 1.4, COL.eater);
  else if (room.name === '响廊') toast(s, TOAST.echoRoom, 1.4, COL.echo);
  else if (room.name === '吸廊') toast(s, TOAST.suckRoom, 1.4, COL.suck);
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

function isEater(e) {
  return e.kind === NAMES.eater;
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

function updateEater(s, e, dt) {
  e.flutter = (e.flutter || 0) + dt;
  let prey = null;
  let nd = 1e9;
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead || k.wet) continue;
    const dE = dist(e.x, e.y, k.x, k.y);
    if (dE < nd) {
      nd = dE;
      prey = k;
    }
  }
  let tx = e.x;
  let ty = e.y;
  let speed = EATER_IDLE;
  if (prey) {
    tx = prey.x;
    ty = prey.y;
    speed = EATER_SEEK;
    if (nd < EATER_EAT) {
      prey.dead = true;
      burst(s, prey.x, prey.y, 4, COL.ash, 80);
      burst(s, prey.x, prey.y, 4, COL.eater, 80);
      sfx('fizzle');
      if (!s.taughtEat) {
        toast(s, TOAST.eaterEat, 1.1, COL.eater);
        s.taughtEat = true;
      }
      punch(s, 3);
    }
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
  const oiled = !wet && inOil(s, x, y);
  if (oiled) hot = true;
  const haste = !wet && !!s.hasteReady;
  const fuse = haste ? HASTE_T : TAIL_T;
  if (haste) s.hasteReady = false;
  s.sparks.push({
    x: x, y: y, t: fuse, life: fuse,
    hot: !!hot, wet: wet, oiled: oiled, dead: false, fuse: false, haste: haste,
  });
  s.stats.drops += 1;
  if (oiled && !s.taughtOil) {
    toast(s, TOAST.oil, 1.1, COL.gold);
    s.taughtOil = true;
  }
  if (haste) toast(s, TOAST.hasteUse, 1.1, COL.gold);
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

function addRing(s, x, y, r, hot, haste) {
  const snap = !!haste && !reducedMotion();
  const echoMul = (s.echoing && !reducedMotion()) ? 1.45 : 1;
  s.rings.push({
    x: x, y: y,
    r0: r * 0.7,
    r1: r * (hot ? 1.5 : 1.35) * (snap ? 1.2 : 1) * echoMul,
    t: 0,
    grow: snap ? 0.012 : 0.016,
    life: snap ? 0.08 : 0.096,
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

function foeDown(s, e) {
  if (isEater(e)) {
    burst(s, e.x, e.y, 8, COL.eater, 140);
    burst(s, e.x, e.y, 6, COL.ash, 110);
    toast(s, TOAST.eater, 1.1, COL.eater);
  } else if (isMoth(e)) {
    burst(s, e.x, e.y, 10, COL.gold, 140);
    toast(s, TOAST.moth, 1.1, COL.gold);
  } else if (isHound(e)) {
    burst(s, e.x, e.y, 12, COL.ember, 140);
    toast(s, TOAST.hound, 1.1, COL.ember);
  } else {
    burst(s, e.x, e.y, 12, COL.ember, 140);
    toast(s, TOAST.foe, 1.1, COL.ember);
  }
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
  if (e.hp <= 0) foeDown(s, e);
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

function explode(s, x, y, hot, fused, haste, opts) {
  const echoing = opts === true || (opts && opts.echo) || !!s.echoing;
  let seeded = false;
  if (!echoing && s.seed) {
    seeded = true;
    s.seed = 0;
    hot = true;
  }
  const r = seeded ? SEED_R : (hot ? HOT_BLAST_R : BLAST_R);
  s.stats.booms += 1;
  s.lastBoomX = x;
  s.lastBoomY = y;
  s.boomSeekT = MOTH_SEEK_T;
  spawnEmber(s, x, y, r, hot);
  spawnScorch(s, x, y, r, hot);
  burst(s, x, y, seeded ? 22 : (hot ? 16 : 10), hot ? COL.gold : COL.ember, hot ? 220 : 170);
  addRing(s, x, y, r, hot, haste);
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
      e.hp -= (isHound(e) || isMoth(e) || isEater(e)) ? 1 : (hot ? 2 : 1);
      e.hitT = 0.18;
      const d = dist(e.x, e.y, x, y) || 1;
      e.x += ((e.x - x) / d) * 22;
      e.y += ((e.y - y) / d) * 22;
      s.hitstop = Math.max(s.hitstop, hitstopAmt());
      punch(s, 6);
      hit = true;
      if (e.hp <= 0) foeDown(s, e);
    }
  }

  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    if (c.thick && !seeded) continue;
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

  if (!echoing && s.suckReady) {
    s.suckReady = false;
    let sucked = 0;
    for (let i = 0; i < s.sparks.length; i++) {
      const k = s.sparks[i];
      if (k.dead || k.wet) continue;
      if (k.x === x && k.y === y) continue;
      if (dist(k.x, k.y, x, y) > SUCK_R) continue;
      k.t = Math.min(k.t, CHAIN_T);
      k.fuse = true;
      if (!reducedMotion()) {
        const d = dist(k.x, k.y, x, y) || 1;
        const move = Math.min(18, Math.max(0, d - 10));
        k.x += ((x - k.x) / d) * move;
        k.y += ((y - k.y) / d) * move;
      }
      sucked += 1;
    }
    if (sucked >= 1) {
      toast(s, TOAST.suckUse, 1.1, COL.suck);
      if (!reducedMotion()) {
        punch(s, 8);
        burst(s, x, y, 8, COL.suck, 190);
        burst(s, x, y, 4, COL.gold, 170);
        s.rings.push({
          x: x, y: y,
          r0: SUCK_R * 0.55,
          r1: SUCK_R,
          t: 0,
          grow: 0.02,
          life: 0.14,
          hot: false,
          suck: true,
        });
      }
    }
  }

  if (hit) punch(s, 6);
  else punch(s, 2);
  if (seeded) {
    toast(s, TOAST.seedBoom, 1.1, COL.gold);
    s.hitstop = Math.max(s.hitstop, hitstopAmt());
    punch(s, 10);
  }
  noteBoom(s, chained, !!fused);
  if (echoing) return;
  if (s.echoReady) {
    s.echoReady = false;
    const echoHot = !!hot || seeded;
    if (!s.echoes) s.echoes = [];
    s.echoes.push({
      x: x, y: y,
      hot: echoHot,
      t: ECHO_T,
      r: echoHot ? HOT_BLAST_R : BLAST_R,
      wait: true,
    });
  }
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
  if (n >= BIG_COMBO && !reducedMotion()) {
    s.hitstop = Math.max(s.hitstop, BIG_CHAIN_HIT);
    punch(s, BIG_CHAIN_PUNCH);
  }
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
      explode(s, k.x, k.y, k.hot, k.fuse, k.haste);
    }
  }
  if (s.sparks.length > 80) {
    s.sparks = s.sparks.filter(function (k) { return !k.dead; });
  }
  tickBurst(s, dt);
}

function updateEchoes(s, dt) {
  if (!s.echoes || !s.echoes.length) return;
  for (let i = s.echoes.length - 1; i >= 0; i--) {
    const e = s.echoes[i];
    if (e.wait) {
      e.wait = false;
      continue;
    }
    e.t -= dt;
    if (e.t > 0) continue;
    s.echoes.splice(i, 1);
    s.echoing = true;
    explode(s, e.x, e.y, e.hot);
    s.echoing = false;
    toast(s, TOAST.echoUse, 1.1, COL.echo);
    if (!reducedMotion()) {
      punch(s, 8);
      burst(s, e.x, e.y, 8, COL.echo, 190);
      burst(s, e.x, e.y, 4, COL.gold, 170);
      addRing(s, e.x, e.y, e.r || (e.hot ? HOT_BLAST_R : BLAST_R), e.hot);
    }
  }
}

function updateRings(s, dt) {
  for (let i = s.rings.length - 1; i >= 0; i--) {
    s.rings[i].t += dt;
    if (s.rings[i].t >= s.rings[i].life) s.rings.splice(i, 1);
  }
}


function setWatch(s, on) {
  s.watch = !!on;
  s.watchSide = s.watchSide || 1;
  s.watchStuckT = 0;
  if (s.player) {
    s.watchLastX = s.player.x;
    s.watchLastY = s.player.y;
  }
  syncWatchBtn(s);
}

function toggleWatch(s) {
  setWatch(s, !s.watch);
  toast(s, s.watch ? TOAST.watch : TOAST.watchOff, 1.1, COL.gold);
}

function syncWatchBtn(s) {
  if (typeof document === 'undefined') return;
  const btn = document.getElementById('watchBtn');
  if (!btn) return;
  btn.textContent = NAMES.watch;
  btn.classList.toggle('on', !!s.watch);
  btn.setAttribute('aria-pressed', s.watch ? 'true' : 'false');
}

function circleAim(px, py, cx, cy, radius, side) {
  const dx = px - cx;
  const dy = py - cy;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  const sign = side >= 0 ? 1 : -1;
  const tangX = -uy * sign;
  const tangY = ux * sign;
  const radial = (d - radius) / Math.max(40, radius);
  return {
    x: tangX - ux * clamp(radial, -1.2, 1.2),
    y: tangY - uy * clamp(radial, -1.2, 1.2),
  };
}

function nearestSoonBlast(s, x, y, tMax, pad) {
  let near = null;
  let nd = 1e9;
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead || k.wet || k.t > tMax) continue;
    const r = (k.hot ? HOT_BLAST_R : BLAST_R) + pad;
    const d = dist(x, y, k.x, k.y);
    if (d < r && d < nd) {
      nd = d;
      near = k;
    }
  }
  return near;
}

function liveNearPoint(s, x, y, rad) {
  let n = 0;
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead || k.wet) continue;
    if (dist(x, y, k.x, k.y) <= rad) n += 1;
  }
  return n;
}

function watchSteer(s, dt) {
  const p = s.player;
  const pad = p.r + 18;
  let tx = 0;
  let ty = 0;
  let dash = false;
  let stand = false;

  let core = null;
  let seedIt = null;
  let hasteIt = null;
  let echoIt = null;
  let suckIt = null;
  for (let i = 0; i < s.items.length; i++) {
    const it = s.items[i];
    if (it.taken) continue;
    if (it.kind === 'core') core = it;
    if (it.kind === 'seed') seedIt = it;
    if (it.kind === 'haste') hasteIt = it;
    if (it.kind === 'echo') echoIt = it;
    if (it.kind === 'suck') suckIt = it;
  }
  const grab = core || (!s.seed && seedIt) || (!s.hasteReady && hasteIt) || (!s.echoReady && echoIt) || (!s.suckReady && suckIt);

  let guard = null;
  let gd = 1e9;
  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0 || isHound(e) || isMoth(e) || isEater(e)) continue;
    const d = dist(p.x, p.y, e.x, e.y);
    if (d < gd) {
      gd = d;
      guard = e;
    }
  }

  let crate = null;
  let crateX = 0;
  let crateY = 0;
  let crateD = 1e9;
  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    const cx = c.x + c.w * 0.5;
    const cy = c.y + c.h * 0.5;
    const d = dist(p.x, p.y, cx, cy) + (c.loot === 'core' ? -80 : 0);
    if (d < crateD) {
      crateD = d;
      crate = c;
      crateX = cx;
      crateY = cy;
    }
  }

  const threat = nearestSoonBlast(s, p.x, p.y, 0.32, p.r + 16);
  const side = s.watchSide || 1;

  if (core) {
    tx = core.x - p.x;
    ty = core.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.seed && seedIt) {
    tx = seedIt.x - p.x;
    ty = seedIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.hasteReady && hasteIt) {
    tx = hasteIt.x - p.x;
    ty = hasteIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.echoReady && echoIt) {
    tx = echoIt.x - p.x;
    ty = echoIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.suckReady && suckIt) {
    tx = suckIt.x - p.x;
    ty = suckIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (guard && gd < 150) {
    const orbit = circleAim(p.x, p.y, guard.x, guard.y, 128, side);
    tx = orbit.x;
    ty = orbit.y;
  } else if (crate) {
    const fuse = liveNearPoint(s, crateX, crateY, BLAST_R + 28);
    const dC = dist(p.x, p.y, crateX, crateY);
    if (fuse >= 2) {
      if (dC < 108) {
        tx = p.x - crateX;
        ty = p.y - crateY;
      } else {
        stand = true;
      }
    } else {
      const orbit = circleAim(p.x, p.y, crateX, crateY, 56, side);
      tx = orbit.x;
      ty = orbit.y;
    }
  } else if (guard) {
    const orbit = circleAim(p.x, p.y, guard.x, guard.y, 128, side);
    tx = orbit.x;
    ty = orbit.y;
  } else {
    const orbit = circleAim(p.x, p.y, s.roomW * 0.5, s.roomH * 0.5, 140, side);
    tx = orbit.x;
    ty = orbit.y;
  }

  if (threat) {
    tx = p.x - threat.x;
    ty = p.y - threat.y;
    stand = false;
    if (p.dashT <= 0 && p.dashCd <= 0) dash = true;
  }

  if (!grab) {
    let ember = null;
    for (let i = 0; i < s.embers.length; i++) {
      const em = s.embers[i];
      if (dist(p.x, p.y, em.x, em.y) < em.r + p.r + 10) ember = em;
    }
    if (ember) {
      tx = p.x - ember.x;
      ty = p.y - ember.y;
      stand = false;
    }
  }

  const look = 28;
  const nl0 = Math.hypot(tx, ty) || 1;
  const nx = p.x + (tx / nl0) * look;
  const ny = p.y + (ty / nl0) * look;
  if (!grab && !stand && inWater(s, nx, ny)) {
    const px = -ty;
    const py = tx;
    const pl = Math.hypot(px, py) || 1;
    if (!inWater(s, p.x + (px / pl) * look, p.y + (py / pl) * look)) {
      tx = px;
      ty = py;
    } else {
      tx = -px;
      ty = -py;
    }
  }

  if (p.x < pad) tx += 1.4;
  if (p.x > s.roomW - pad) tx -= 1.4;
  if (p.y < pad) ty += 1.4;
  if (p.y > s.roomH - pad) ty -= 1.4;

  const step = dist(
    p.x, p.y,
    s.watchLastX == null ? p.x : s.watchLastX,
    s.watchLastY == null ? p.y : s.watchLastY
  );
  if (step < 2.5) s.watchStuckT = (s.watchStuckT || 0) + dt;
  else s.watchStuckT = 0;
  s.watchLastX = p.x;
  s.watchLastY = p.y;
  if (s.watchStuckT > 0.5) {
    s.watchSide = -side;
    s.watchStuckT = 0;
    stand = false;
  }

  if (!dash && guard && gd < 36 && p.dashT <= 0 && p.dashCd <= 0) dash = true;

  if (stand && !dash) {
    s.input.x = 0;
    s.input.y = 0;
    s.input.dash = false;
    return;
  }

  const len = Math.hypot(tx, ty);
  if (len < 0.001) {
    tx = side;
    ty = 0.35;
  } else {
    tx /= len;
    ty /= len;
  }

  s.input.x = tx;
  s.input.y = ty;
  s.input.dash = dash;
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

  tickTide(s, dt);
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
    updateEchoes(s, dt);
    updateEmbers(s, dt, false);
    if (s.pendingNext <= 0) goNext(s);
    return;
  }

  if (s.won || s.dead) {
    updateSparks(s, dt);
    updateEchoes(s, dt);
    updateEmbers(s, dt, false);
    return;
  }

  if (s.watch) watchSteer(s, dt);

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
  updateEchoes(s, dt);
  updateEmbers(s, dt, true);

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    if (e.hitT > 0) e.hitT -= dt;
    if (isHound(e)) updateHound(s, e, dt);
    else if (isMoth(e)) updateMoth(s, e, dt);
    else if (isEater(e)) updateEater(s, e, dt);
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
    else if (it.kind === 'seed') {
      s.seed = 1;
      toast(s, TOAST.seedGet, 1.1, COL.gold);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.ember, 110);
      punch(s, 3);
    } else if (it.kind === 'haste') {
      s.hasteReady = true;
      toast(s, TOAST.hasteGet, 1.1, COL.haste);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.ember, 110);
      punch(s, 3);
    } else if (it.kind === 'echo') {
      s.echoReady = true;
      toast(s, TOAST.echoGet, 1.1, COL.echo);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.echo, 110);
      punch(s, 3);
    } else if (it.kind === 'suck') {
      s.suckReady = true;
      toast(s, TOAST.suckGet, 1.1, COL.suck);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.suck, 110);
      punch(s, 3);
    } else if (it.kind === 'heal') {
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

  for (let i = 0; i < (s.oils || []).length; i++) {
    const o = s.oils[i];
    const rgb = hexRgb(COL.oil);
    let a = 0.45;
    if (!reducedMotion()) {
      a = 0.4 + 0.1 * (0.5 + 0.5 * Math.sin((s.time || 0) * 2.4 + i * 0.7));
    }
    ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = 'rgba(255,210,74,0.42)';
    ctx.lineWidth = 1.5 / fit.scale;
    ctx.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
  }

  const high = tideHigh(s);
  for (let i = 0; i < s.waters.length; i++) {
    const w = s.waters[i];
    const tide = !!w.tide;
    const wet = !tide || high;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    if (!wet) {
      ctx.fillStyle = 'rgba(58,107,140,0.12)';
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.save();
      ctx.strokeStyle = 'rgba(180,220,240,0.26)';
      ctx.lineWidth = 1.5 / fit.scale;
      ctx.setLineDash([6 / fit.scale, 5 / fit.scale]);
      ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
      ctx.restore();
      ctx.fillStyle = 'rgba(200,230,255,0.3)';
      ctx.fillText(NAMES.tide, w.x + w.w * 0.5, w.y + w.h * 0.5 + 4);
      continue;
    }
    let a = 0.55;
    if (tide) {
      const ph = (s.tideT % (TIDE_LOW + TIDE_HIGH)) - TIDE_LOW;
      a = 0.48 + 0.12 * (0.5 + 0.5 * Math.sin((ph / TIDE_HIGH) * Math.PI * 2));
    }
    ctx.fillStyle = 'rgba(58,107,140,' + a + ')';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = 'rgba(180,220,240,0.35)';
    ctx.lineWidth = 1.5 / fit.scale;
    ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
    ctx.fillStyle = 'rgba(200,230,255,0.55)';
    ctx.fillText(tide ? NAMES.tide : NAMES.water, w.x + w.w * 0.5, w.y + w.h * 0.5 + 4);
  }

  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) {
      ctx.strokeStyle = 'rgba(255,210,74,0.25)';
      ctx.strokeRect(c.x + 4, c.y + 4, c.w - 8, c.h - 8);
      continue;
    }
    ctx.fillStyle = c.thick ? '#1c100c' : '#3a2218';
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = c.thick ? '#c48a18' : COL.gold;
    ctx.lineWidth = (c.thick ? 3.2 : 1.5) / fit.scale;
    ctx.strokeRect(c.x + 1, c.y + 1, c.w - 2, c.h - 2);
    if (c.thick) {
      ctx.strokeStyle = '#6a3a12';
      ctx.lineWidth = 2 / fit.scale;
      ctx.strokeRect(c.x + 5, c.y + 5, c.w - 10, c.h - 10);
    }
    ctx.fillStyle = c.thick ? '#e0b040' : COL.gold;
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
    const life = k.life > 0 ? k.life : TAIL_T;
    const age = clamp(1 - k.t / life, 0, 1);
    if (k.wet) {
      const shrink = 3.2 * (1 - age * 0.7);
      glow(ctx, k.x, k.y, shrink * 2.2, COL.ash, 0.2);
      ctx.beginPath();
      ctx.fillStyle = mixHex(COL.water, COL.ash, age);
      ctx.arc(k.x, k.y, shrink, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    let swell = k.hot ? 5 + 9 * age * age : 3.2 + 7 * age * age;
    if (k.haste && !reducedMotion()) swell *= 1.2;
    let col = mixHex(COL.ember, COL.gold, age * age);
    if (k.haste) col = mixHex(col, COL.haste, 0.5);
    glow(ctx, k.x, k.y, swell * 3.2, col, 0.22 + age * 0.45);
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.arc(k.x, k.y, swell, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < (s.echoes || []).length; i++) {
    const e = s.echoes[i];
    const rad = e.r || (e.hot ? HOT_BLAST_R : BLAST_R);
    let a = 0.4;
    if (!reducedMotion()) {
      a = 0.28 + 0.18 * (0.5 + 0.5 * Math.sin((s.time || 0) * 8));
    }
    ctx.globalAlpha = a;
    ctx.strokeStyle = COL.echo;
    ctx.lineWidth = 2 / fit.scale;
    ctx.beginPath();
    ctx.arc(e.x, e.y, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = COL.echo;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(NAMES.echo, e.x, e.y + rad + 12);
  }

  for (let i = 0; i < s.rings.length; i++) {
    const ring = s.rings[i];
    let rad;
    let col;
    let a;
    if (ring.t < ring.grow) {
      rad = lerp(ring.r0, ring.r1, ring.t / ring.grow);
      col = ring.suck ? COL.suck : COL.ember;
      a = 0.85;
    } else {
      const k = (ring.t - ring.grow) / (ring.life - ring.grow);
      rad = lerp(ring.r1, 0, k);
      col = ring.suck ? COL.suck : COL.gold;
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
    } else if (it.kind === 'seed') {
      glow(ctx, it.x, it.y, 20 * pulse, COL.gold, 0.65);
      glow(ctx, it.x, it.y, 10, COL.ember, 0.4);
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.ember;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.seed, it.x, it.y - 16);
    } else if (it.kind === 'haste') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.haste, 0.7);
      glow(ctx, it.x, it.y, 8, COL.ember, 0.35);
      ctx.fillStyle = COL.haste;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.ember;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.haste;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.haste, it.x, it.y - 16);
    } else if (it.kind === 'echo') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.echo, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.echo;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.echo;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.echo, it.x, it.y - 16);
    } else if (it.kind === 'suck') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.suck, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.suck;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.suck;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.suck, it.x, it.y - 16);
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
    if (isEater(e)) {
      const flick = reducedMotion() ? 1 : (0.85 + 0.15 * Math.sin(s.time * 8 + e.x * 0.02));
      glow(ctx, e.x, e.y, 18, COL.eater, 0.2 * flick);
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(Math.atan2(e.faceY || 0, e.faceX || 1));
      ctx.fillStyle = flash ? COL.gold : COL.eater;
      ctx.beginPath();
      ctx.ellipse(0, 0, 9.2, 6.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(8.2, 0, 5.2, 3.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6e3f82';
      ctx.lineWidth = 1.5 / fit.scale;
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(4, 0);
      ctx.stroke();
      ctx.fillStyle = flash ? '#fff8dc' : '#2a1410';
      ctx.beginPath();
      ctx.arc(9.2, -1.5, 1.15, 0, Math.PI * 2);
      ctx.arc(9.2, 1.5, 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = COL.eater;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.eater, e.x, e.y + e.r + 12);
      for (let h = 0; h < EATER_HP; h++) {
        ctx.fillStyle = h < e.hp ? COL.eater : 'rgba(154,106,176,0.2)';
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
  if (s.seed) {
    let ox;
    let oy;
    if (reducedMotion()) {
      ox = p.x + 10;
      oy = p.y - 8;
    } else {
      const a = s.time * 5.2;
      ox = p.x + Math.cos(a) * 16;
      oy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, ox, oy, 8, COL.gold, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(ox, oy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.ember;
    ctx.arc(ox, oy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.hasteReady) {
    let hx;
    let hy;
    if (reducedMotion()) {
      hx = p.x - 10;
      hy = p.y - 8;
    } else {
      const a = s.time * 5.2 + Math.PI;
      hx = p.x + Math.cos(a) * 16;
      hy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, hx, hy, 8, COL.haste, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.haste;
    ctx.arc(hx, hy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.ember;
    ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.echoReady) {
    let ex;
    let ey;
    if (reducedMotion()) {
      ex = p.x + 10;
      ey = p.y + 8;
    } else {
      const a = s.time * 5.2 + Math.PI * 0.5;
      ex = p.x + Math.cos(a) * 16;
      ey = p.y + Math.sin(a) * 16;
    }
    glow(ctx, ex, ey, 8, COL.echo, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.echo;
    ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.suckReady) {
    let sx;
    let sy;
    if (reducedMotion()) {
      sx = p.x - 10;
      sy = p.y + 8;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.2;
      sx = p.x + Math.cos(a) * 16;
      sy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, sx, sy, 8, COL.suck, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.suck;
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
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
    if (e.code === 'KeyG') {
      e.preventDefault();
      if (!e.repeat) toggleWatch(s);
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
  syncWatchBtn(s);
  heartsEl.textContent = '心×' + s.player.hearts;
  if (roomEl) {
    roomEl.textContent = roomHudText(s);
  }
  if (comboEl) {
    comboEl.textContent = s.lastCombo >= COMBO_MIN ? comboText(s.lastCombo) : '';
  }
  const seedEl = (typeof document !== 'undefined') ? document.getElementById('seed') : null;
  if (seedEl) {
    seedEl.textContent = s.seed ? NAMES.seed : '';
  } else if (comboEl && s.lastCombo < COMBO_MIN) {
    comboEl.textContent = s.seed ? NAMES.seed : '';
  }
  const hasteEl = (typeof document !== 'undefined') ? document.getElementById('haste') : null;
  if (hasteEl) {
    hasteEl.textContent = s.hasteReady ? NAMES.haste : '';
  } else if (seedEl && s.hasteReady && !s.seed) {
    seedEl.textContent = NAMES.haste;
  }
  const echoEl = (typeof document !== 'undefined') ? document.getElementById('echo') : null;
  if (echoEl) {
    echoEl.textContent = s.echoReady ? NAMES.echo : '';
  } else if (hasteEl && s.echoReady && !s.hasteReady) {
    hasteEl.textContent = NAMES.echo;
  }
  const suckEl = (typeof document !== 'undefined') ? document.getElementById('suck') : null;
  if (suckEl) {
    suckEl.textContent = s.suckReady ? NAMES.suck : '';
  } else if (echoEl && s.suckReady && !s.echoReady) {
    echoEl.textContent = NAMES.suck;
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
  const watchBtn = document.getElementById('watchBtn');
  const s = makeState();

  function begin() {
    ensureRooms();
    resetRoom(s, 0, false);
    bindInput(s, canvas, stick, knob, dashBtn, touchRoot);
    if (watchBtn) {
      watchBtn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        unlockAudio();
        toggleWatch(s);
      });
    }
    syncWatchBtn(s);
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
  if (HASTE_T !== 0.55) throw new Error('HASTE_T 0.55');
  if (ECHO_T !== 0.45) throw new Error('ECHO_T 0.45');
  if (EMBER_T !== 0.55) throw new Error('EMBER_T 0.55');
  if (SCORCH_T !== 1.2) throw new Error('焦痕 1.2s');
  if (!ROOMS || ROOMS.length !== 20) throw new Error('need 20 rooms, got ' + (ROOMS ? ROOMS.length : 0));
  const want = ['空场', '追者', '水巷', '箱巷', '夹道', '夜市', '循径', '双刃', '回廊', '灯巷', '灰径', '环行', '密线', '潮廊', '种廊', '油廊', '急廊', '拾廊', '响廊', '吸廊'];
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
  if (ROOMS[12].id !== 'mixian') throw new Error('密线 id');
  if (ROOMS[12].name !== '密线') throw new Error('room 13 密线');
  if (ROOMS[13].id !== 'chaolang') throw new Error('潮廊 id');
  if (ROOMS[13].name !== '潮廊') throw new Error('room 14 潮廊');
  if (ROOMS[14].id !== 'zhonglang') throw new Error('种廊 id');
  if (ROOMS[14].name !== '种廊') throw new Error('room 15 种廊');
  if (ROOMS[15].id !== 'youlang') throw new Error('油廊 id');
  if (ROOMS[15].name !== '油廊') throw new Error('room 16 油廊');
  if (ROOMS[16].id !== 'jilang') throw new Error('急廊 id');
  if (ROOMS[16].name !== '急廊') throw new Error('room 17 急廊');
  if (ROOMS[17].id !== 'shilang') throw new Error('拾廊 id');
  if (ROOMS[17].name !== '拾廊') throw new Error('room 18 拾廊');
  if (ROOMS[18].id !== 'xianglang') throw new Error('响廊 id');
  if (ROOMS[18].name !== '响廊') throw new Error('room 19 响廊');
  if (ROOMS[19].id !== 'xilang') throw new Error('吸廊 id');
  if (ROOMS[19].name !== '吸廊') throw new Error('room 20 吸廊');
  if (SEED_R !== 72) throw new Error('SEED_R 72');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (HOT_BLAST_R !== 56) throw new Error('HOT_BLAST_R 56');
  if (SUCK_R !== 140) throw new Error('SUCK_R 140');

  const fitJ = roomFit({ roomW: 960, roomH: 140 });
  if (Math.abs(fitJ.scale - 1) > 1e-9) throw new Error('letterbox must not stretch');
  if (Math.abs(fitJ.ox) > 1e-9) throw new Error('jiadao letterbox x');
  if (Math.abs(fitJ.oy - 200) > 1e-6) throw new Error('jiadao letterbox y');

  const fitK = roomFit({ roomW: 840, roomH: 480 });
  if (Math.abs(fitK.scale - Math.min(960 / 840, 540 / 480)) > 1e-9) throw new Error('kongchang letterbox');

  const need = ['尾火', '烬卫', '箱', '心核', '回星', '水洼', '油渍', '潮涌', '焰辙', '循辙', '灯蛾', '余烬', '焦痕', '观摩', '焰种', '急燃', '拾烬', '回爆', '吸爆'];
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
  if (NAMES.watch !== '观摩') throw new Error('观摩 name');
  if (TOAST.watch !== '观摩中') throw new Error('观摩中');
  if (NAMES.eater !== '拾烬') throw new Error('拾烬 name');
  if (TOAST.eater !== '拾烬倒了') throw new Error('拾烬倒了');
  if (TOAST.eaterEat !== '拾烬吃辙') throw new Error('拾烬吃辙');
  if (TOAST.eaterRoom !== '拾烬会吃辙') throw new Error('拾烬会吃辙');
  if (COL.eater !== '#9a6ab0') throw new Error('COL.eater');
  if (EATER_HP !== 2) throw new Error('拾烬 2 HP');
  if (EATER_R !== 11) throw new Error('EATER_R');
  if (EATER_IDLE !== 18) throw new Error('EATER_IDLE');
  if (EATER_SEEK !== 96) throw new Error('EATER_SEEK');
  if (EATER_EAT !== 16) throw new Error('EATER_EAT');

  if (typeof setWatch !== 'function' || typeof watchSteer !== 'function') {
    throw new Error('观摩 helpers');
  }
  const inputSrc = Function.prototype.toString.call(bindInput);
  if (inputSrc.indexOf("keys.has('KeyA')") < 0) throw new Error('A moves left');
  if (inputSrc.indexOf("e.code === 'KeyG'") < 0) throw new Error('G toggles 观摩');
  if (inputSrc.indexOf("e.code === 'KeyA'") >= 0) throw new Error('A must not toggle 观摩');
  let houndN = 0;
  let mothN = 0;
  let eaterN = 0;
  for (let r = 0; r < ROOMS.length; r++) {
    const ens = ROOMS[r].enemies || [];
    for (let j = 0; j < ens.length; j++) {
      const k = ens[j].type || ens[j].kind;
      if (k === '循辙') houndN += 1;
      if (k === '灯蛾') mothN += 1;
      if (k === '拾烬') eaterN += 1;
    }
  }
  if (houndN < 1) throw new Error('循辙 exists');
  if (mothN < 1) throw new Error('灯蛾 exists');
  if (eaterN < 1) throw new Error('拾烬 exists');
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
  if (roomHudText(hud0) !== '空场 · 1/20') throw new Error('HUD 空场 1/20');
  const hud2 = makeState();
  resetRoom(hud2, 2, false);
  if (roomHudText(hud2) !== '水巷 · 3/20') throw new Error('HUD 3/20');

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
  if (roomHudText(hudAsh) !== '灰径 · 11/20') throw new Error('HUD 灰径 11/20');

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
  if (ring.won) throw new Error('环行 should not 通关');
  for (let i = 0; i < 20; i++) update(ring, 0.1);
  if (ring.roomName !== '密线') throw new Error('core advances to 密线');

  const hudRing = makeState();
  resetRoom(hudRing, 11, false);
  if (roomHudText(hudRing) !== '环行 · 12/20') throw new Error('HUD 环行 12/20');

  const wire = makeState();
  resetRoom(wire, 12, false);
  if (wire.roomName !== '密线' || wire.roomId !== 'mixian') throw new Error('mixian load');
  if (wire.toast !== TOAST.wire) throw new Error('密线 intro');
  if (TOAST.wire !== '密线一拉就炸') throw new Error('密线一拉就炸');
  if (!wire.waters.length) throw new Error('密线 needs 水洼');
  let wireHound = 0;
  let wireGuard = 0;
  for (let i = 0; i < wire.enemies.length; i++) {
    if (isHound(wire.enemies[i])) wireHound += 1;
    else wireGuard += 1;
  }
  if (wireHound !== 2) throw new Error('密线 2 循辙');
  if (wireGuard < 1) throw new Error('密线 烬卫');
  let wireCore = 0;
  let wireHeal = 0;
  for (let i = 0; i < wire.crates.length; i++) {
    if (wire.crates[i].loot === 'core') wireCore += 1;
    if (wire.crates[i].loot === 'heal') wireHeal += 1;
  }
  if (wireCore !== 1 || wireHeal < 1) throw new Error('密线 心核/回星');
  takeCore(wire, { x: 100, y: 100 });
  if (wire.won) throw new Error('密线 should not 通关');
  for (let i = 0; i < 20; i++) update(wire, 0.1);
  if (wire.roomName !== '潮廊') throw new Error('core advances to 潮廊');
  const hudWire = makeState();
  resetRoom(hudWire, 12, false);
  if (roomHudText(hudWire) !== '密线 · 13/20') throw new Error('HUD 密线 13/20');

  // big-chain hitstop on 5连
  const big = makeState();
  resetRoom(big, 0, false);
  big.burstN = 5;
  finishBurst(big);
  if (big.lastCombo !== 5) throw new Error('big lastCombo');
  if (!reducedMotion()) {
    if (big.hitstop < BIG_CHAIN_HIT - 1e-9) throw new Error('5连 hitstop');
    if (big.cam.punch < BIG_CHAIN_PUNCH - 1e-9) throw new Error('5连 punch');
  }
  if (BIG_CHAIN_HIT !== 0.08) throw new Error('BIG_CHAIN_HIT');
  if (BIG_COMBO !== 5) throw new Error('BIG_COMBO');

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

  const armed = makeState();
  resetRoom(armed, 0, false);
  if (armed.watch) throw new Error('观摩 off by default');
  setWatch(armed, true);
  if (!armed.watch) throw new Error('观摩 can be armed');
  const ax = armed.player.x;
  const ay = armed.player.y;
  let maxStep = 0;
  let px = ax;
  let py = ay;
  for (let i = 0; i < 24; i++) {
    update(armed, 0.05);
    const step = dist(armed.player.x, armed.player.y, px, py);
    if (step > maxStep) maxStep = step;
    px = armed.player.x;
    py = armed.player.y;
  }
  if (armed.stats.drops < 1) throw new Error('观摩 drop trail');
  if (dist(armed.player.x, armed.player.y, ax, ay) < 20) throw new Error('观摩 should walk');
  if (maxStep > DASH_SPEED * 0.05 + 8) throw new Error('观摩 no teleport');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const kite = makeState();
  resetRoom(kite, 1, false);
  setWatch(kite, true);
  kite.player.inv = 2;
  const k0x = kite.player.x;
  const k0y = kite.player.y;
  for (let i = 0; i < 36; i++) update(kite, 0.05);
  if (kite.stats.drops < 1) throw new Error('观摩 kite trail');
  if (dist(kite.player.x, kite.player.y, k0x, k0y) < 16) throw new Error('观摩 kite walks');

  const seek = makeState();
  resetRoom(seek, 0, false);
  setWatch(seek, true);
  seek.crates.forEach(function (c) { c.open = true; });
  seek.items.push({ kind: 'core', x: 400, y: 220, r: 10, taken: false });
  const sx = seek.player.x;
  const sy = seek.player.y;
  const coreD0 = dist(sx, sy, 400, 220);
  for (let i = 0; i < 30; i++) update(seek, 0.05);
  const coreD1 = dist(seek.player.x, seek.player.y, 400, 220);
  if (!seek.won && !seek.items[0].taken && coreD1 >= coreD0 - 8) {
    throw new Error('观摩 seek 心核');
  }

  if (TIDE_LOW !== 2.8) throw new Error('TIDE_LOW 2.8');
  if (TIDE_HIGH !== 1.2) throw new Error('TIDE_HIGH 1.2');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (typeof tideHigh !== 'function') throw new Error('tideHigh');
  if (TOAST.tideOn !== '潮来了') throw new Error('潮来了');
  if (TOAST.tideOff !== '潮退了') throw new Error('潮退了');
  if (TOAST.tide !== '潮会熄辙') throw new Error('潮会熄辙');
  if (NAMES.tide !== '潮涌') throw new Error('潮涌');

  const chao = makeState();
  resetRoom(chao, 13, false);
  if (chao.roomName !== '潮廊' || chao.roomId !== 'chaolang') throw new Error('chaolang load');
  if (chao.toast !== TOAST.tide) throw new Error('潮廊 intro');
  if (chao.roomW !== 960 || chao.roomH !== 400) throw new Error('潮廊 size');
  if (chao.player.x !== 80 || chao.player.y !== 200) throw new Error('潮廊 spawn');
  let tideN = 0;
  let stillN = 0;
  for (let i = 0; i < chao.waters.length; i++) {
    if (chao.waters[i].tide) tideN += 1;
    else stillN += 1;
  }
  if (tideN < 1) throw new Error('潮廊 needs tide puddle');
  if (stillN < 1) throw new Error('潮廊 needs static 水洼');
  let chaoCore = 0;
  let chaoHeal = 0;
  for (let i = 0; i < chao.crates.length; i++) {
    if (chao.crates[i].loot === 'core') chaoCore += 1;
    if (chao.crates[i].loot === 'heal') chaoHeal += 1;
  }
  if (chaoCore !== 1) throw new Error('潮廊 心核');
  if (chaoHeal < 1) throw new Error('潮廊 回星');
  let chaoHound = 0;
  let chaoGuard = 0;
  let chaoMoth = 0;
  for (let i = 0; i < chao.enemies.length; i++) {
    if (isHound(chao.enemies[i])) chaoHound += 1;
    else if (isMoth(chao.enemies[i])) chaoMoth += 1;
    else chaoGuard += 1;
  }
  if (chaoHound !== 1 || chaoGuard !== 1 || chaoMoth !== 1) throw new Error('潮廊 循辙/烬卫/灯蛾');
  for (let i = 0; i < chao.crates.length; i++) {
    const c = chao.crates[i];
    if (circleRect(chao.player.x, chao.player.y, chao.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('潮廊 crate on spawn');
    }
  }
  if (inWater(chao, 440, 28)) throw new Error('north ledge dry at low');
  chao.tideT = TIDE_LOW + 0.01;
  if (inWater(chao, 440, 28)) throw new Error('north ledge dry at high');
  if (!inWater(chao, 440, 200)) throw new Error('tide gate wet at high');
  if (inWater(chao, 880, 200)) throw new Error('east pocket dry at high');
  chao.tideT = 0;
  if (inWater(chao, 440, 200)) throw new Error('tide gate dry at low');
  const chaoBox = chao.crates.find(function (c) { return c.loot === 'core'; });
  explode(chao, chaoBox.x + chaoBox.w * 0.5, chaoBox.y - 20, false);
  if (!chaoBox.open) throw new Error('潮廊 dry trail should open 心核');
  takeCore(chao, { x: 100, y: 100 });
  if (chao.won) throw new Error('潮廊 should not 通关');
  for (let i = 0; i < 20; i++) update(chao, 0.1);
  if (chao.roomName !== '种廊') throw new Error('core advances to 种廊');
  const hudChao = makeState();
  resetRoom(hudChao, 13, false);
  if (roomHudText(hudChao) !== '潮廊 · 14/20') throw new Error('HUD 潮廊 14/20');

  if (NAMES.seed !== '焰种') throw new Error('焰种 name');
  if (TOAST.seed !== '焰种放大下一爆') throw new Error('焰种放大下一爆');
  if (TOAST.seedGet !== '捡到焰种') throw new Error('捡到焰种');
  if (TOAST.seedBoom !== '焰种爆了') throw new Error('焰种爆了');
  if (lootKind('焰种') !== 'seed' || lootKind('seed') !== 'seed') throw new Error('lootKind 焰种');

  const zhong = makeState();
  resetRoom(zhong, 14, false);
  if (zhong.roomName !== '种廊' || zhong.roomId !== 'zhonglang') throw new Error('zhonglang load');
  if (zhong.toast !== TOAST.seed) throw new Error('种廊 intro');
  if (zhong.roomW !== 960 || zhong.roomH !== 360) throw new Error('种廊 size');
  if (zhong.player.x !== 80 || zhong.player.y !== 180) throw new Error('种廊 spawn');
  if (zhong.seed !== 0) throw new Error('种廊 seed starts 0');
  let zhongCore = 0;
  let zhongHeal = 0;
  let zhongThick = 0;
  for (let i = 0; i < zhong.crates.length; i++) {
    if (zhong.crates[i].loot === 'core') zhongCore += 1;
    if (zhong.crates[i].loot === 'heal') zhongHeal += 1;
    if (zhong.crates[i].thick) zhongThick += 1;
  }
  if (zhongCore !== 1) throw new Error('种廊 心核');
  if (zhongHeal < 1) throw new Error('种廊 回星');
  const zBox = zhong.crates.find(function (c) { return c.loot === 'core'; });
  if (!zBox || !zBox.thick) throw new Error('种廊 心核 crate is thick');
  if (zhongThick !== 1) throw new Error('种廊 one thick crate');
  const zSeed = zhong.items.find(function (it) { return it.kind === 'seed' && !it.taken; });
  if (!zSeed) throw new Error('种廊 ground 焰种');
  let zhongHound = 0;
  let zhongGuard = 0;
  for (let i = 0; i < zhong.enemies.length; i++) {
    if (isHound(zhong.enemies[i])) zhongHound += 1;
    else zhongGuard += 1;
  }
  if (zhongGuard !== 1 || zhongHound !== 1) throw new Error('种廊 烬卫/循辙');
  if (!zhong.waters.length) throw new Error('种廊 needs 水洼');
  for (let i = 0; i < zhong.crates.length; i++) {
    const c = zhong.crates[i];
    if (circleRect(zhong.player.x, zhong.player.y, zhong.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('种廊 crate on spawn');
    }
  }
  if (inWater(zhong, 80, 180) || inWater(zhong, 340, 180) || inWater(zhong, 860, 180)) {
    throw new Error('种廊 walk line wet');
  }
  for (let x = 80; x < 800; x += 10) {
    for (let i = 0; i < zhong.crates.length; i++) {
      const c = zhong.crates[i];
      if (circleRect(x, 180, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('种廊 crate on dry walk');
      }
    }
  }
  explode(zhong, zBox.x + zBox.w * 0.5, zBox.y - 20, false);
  if (zBox.open) throw new Error('种廊 thick stays closed');
  zhong.seed = 1;
  explode(zhong, zBox.x + zBox.w * 0.5, zBox.y - 20, false);
  if (!zBox.open) throw new Error('种廊 seeded opens thick');
  if (zhong.seed !== 0) throw new Error('种廊 seed consumed');
  takeCore(zhong, { x: 100, y: 100 });
  if (zhong.won) throw new Error('种廊 should not 通关');
  for (let i = 0; i < 20; i++) update(zhong, 0.1);
  if (zhong.roomName !== '油廊') throw new Error('core advances to 油廊');
  const hudZhong = makeState();
  resetRoom(hudZhong, 14, false);
  if (roomHudText(hudZhong) !== '种廊 · 15/20') throw new Error('HUD 种廊 15/20');

  if (NAMES.oil !== '油渍') throw new Error('油渍 name');
  if (COL.oil !== '#8a4a12') throw new Error('COL.oil');
  if (TOAST.oil !== '油渍烫了') throw new Error('油渍烫了');
  if (TOAST.oilRoom !== '油渍烫爆') throw new Error('油渍烫爆');
  if (typeof inOil !== 'function') throw new Error('inOil');

  const oilU = makeState();
  resetRoom(oilU, 0, false);
  oilU.player.x = 40;
  oilU.player.y = 40;
  oilU.oils = [{ x: 200, y: 180, w: 80, h: 80 }];
  dropSpark(oilU, 240, 220, false);
  if (!oilU.sparks[0].oiled || !oilU.sparks[0].hot || oilU.sparks[0].wet) {
    throw new Error('oil spark oiled+hot');
  }
  const oilDropToast = oilU.toast;
  if (oilDropToast !== TOAST.oil) throw new Error('油渍烫了 at drop');
  oilU.sparks[0].t = 0;
  update(oilU, 0.016);
  if (!oilU.embers.length || Math.abs(oilU.embers[0].r - HOT_BLAST_R) > 1e-9) {
    throw new Error('oil boom HOT_BLAST_R');
  }
  if (oilDropToast !== TOAST.oil && oilU.toast !== TOAST.hot) {
    throw new Error('oil toast 油渍烫了 or 烫辙');
  }

  const oilWet = makeState();
  resetRoom(oilWet, 0, false);
  oilWet.player.x = 40;
  oilWet.player.y = 40;
  oilWet.oils = [{ x: 200, y: 180, w: 80, h: 80 }];
  oilWet.waters = [{ x: 200, y: 180, w: 80, h: 80 }];
  dropSpark(oilWet, 240, 220, false);
  if (!oilWet.sparks[0].wet || oilWet.sparks[0].oiled) throw new Error('water wins over oil');
  oilWet.sparks[0].t = 0;
  update(oilWet, 0.016);
  if (oilWet.stats.booms !== 0) throw new Error('wet oil no boom');
  if (oilWet.stats.fizzles < 1) throw new Error('wet oil fizzle');

  const oilGapCold = makeState();
  resetRoom(oilGapCold, 0, false);
  oilGapCold.player.x = 40;
  oilGapCold.player.y = 40;
  dropSpark(oilGapCold, 200, 200, false);
  dropSpark(oilGapCold, 250, 200, false);
  oilGapCold.sparks[0].t = 0;
  update(oilGapCold, 0.016);
  if (oilGapCold.sparks[1].t <= CHAIN_T) throw new Error('dry 50px no chain');

  const oilGapHot = makeState();
  resetRoom(oilGapHot, 0, false);
  oilGapHot.player.x = 40;
  oilGapHot.player.y = 40;
  oilGapHot.oils = [{ x: 180, y: 180, w: 40, h: 40 }];
  dropSpark(oilGapHot, 200, 200, false);
  dropSpark(oilGapHot, 250, 200, false);
  if (!oilGapHot.sparks[0].oiled || !oilGapHot.sparks[0].hot) throw new Error('gap first oiled');
  if (oilGapHot.sparks[1].oiled) throw new Error('gap neighbor dry');
  oilGapHot.sparks[0].t = 0;
  update(oilGapHot, 0.016);
  if (oilGapHot.sparks[1].t > CHAIN_T + 1e-9) throw new Error('oil-hot chains 50px');

  const you = makeState();
  resetRoom(you, 15, false);
  if (you.roomName !== '油廊' || you.roomId !== 'youlang') throw new Error('youlang load');
  if (you.toast !== TOAST.oilRoom) throw new Error('油廊 intro');
  if (you.roomW !== 960 || you.roomH !== 400) throw new Error('油廊 size');
  if (you.player.x !== 80 || you.player.y !== 200) throw new Error('油廊 spawn');
  if (!you.oils.length) throw new Error('油廊 needs 油渍');
  let youStill = 0;
  let youTide = 0;
  for (let i = 0; i < you.waters.length; i++) {
    if (you.waters[i].tide) youTide += 1;
    else youStill += 1;
  }
  if (youStill < 1) throw new Error('油廊 needs static 水洼');
  if (youTide) throw new Error('油廊 no tide');
  let youCore = 0;
  let youHeal = 0;
  let youThick = 0;
  for (let i = 0; i < you.crates.length; i++) {
    if (you.crates[i].loot === 'core') youCore += 1;
    if (you.crates[i].loot === 'heal') youHeal += 1;
    if (you.crates[i].thick) youThick += 1;
  }
  if (youCore !== 1) throw new Error('油廊 心核');
  if (youHeal < 1) throw new Error('油廊 回星');
  const yBox = you.crates.find(function (c) { return c.loot === 'core'; });
  if (!yBox || yBox.thick) throw new Error('油廊 心核 crate is not thick');
  if (youThick) throw new Error('油廊 no thick crate');
  let youHound = 0;
  let youGuard = 0;
  let youMoth = 0;
  for (let i = 0; i < you.enemies.length; i++) {
    if (isHound(you.enemies[i])) youHound += 1;
    else if (isMoth(you.enemies[i])) youMoth += 1;
    else youGuard += 1;
  }
  if (youGuard !== 1 || youHound !== 1 || youMoth !== 0) throw new Error('油廊 烬卫/循辙');
  if (inWater(you, 80, 200) || inOil(you, 80, 200)) throw new Error('油廊 spawn dry');
  if (!inOil(you, 480, 200)) throw new Error('油廊 oil road');
  if (inOil(you, 860, 188) || inWater(you, 860, 188)) throw new Error('油廊 core dry');
  if (inOil(you, 400, 350) || !inWater(you, 450, 350)) throw new Error('油廊 wet bag');
  for (let i = 0; i < you.crates.length; i++) {
    const c = you.crates[i];
    if (circleRect(you.player.x, you.player.y, you.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('油廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 540; x += 10) {
    for (let i = 0; i < you.crates.length; i++) {
      const c = you.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('油廊 crate on dry walk');
      }
    }
  }
  explode(you, yBox.x + yBox.w * 0.5, yBox.y - 20, false);
  if (!yBox.open) throw new Error('油廊 dry trail should open 心核');
  takeCore(you, { x: 100, y: 100 });
  if (you.won) throw new Error('油廊 should not 通关');
  for (let i = 0; i < 20; i++) update(you, 0.1);
  if (you.roomName !== '急廊') throw new Error('core advances to 急廊');
  const hudYou = makeState();
  resetRoom(hudYou, 15, false);
  if (roomHudText(hudYou) !== '油廊 · 16/20') throw new Error('HUD 油廊 16/20');

  if (NAMES.haste !== '急燃') throw new Error('急燃 name');
  if (COL.haste !== '#ff9a3c') throw new Error('COL.haste');
  if (HASTE_T !== 0.55) throw new Error('HASTE_T 0.55');
  if (TOAST.hasteGet !== '急燃到手') throw new Error('急燃到手');
  if (TOAST.hasteUse !== '急燃爆了') throw new Error('急燃爆了');
  if (TOAST.hasteRoom !== '急燃先爆') throw new Error('急燃先爆');
  if (lootKind('急燃') !== 'haste' || lootKind('haste') !== 'haste') throw new Error('lootKind 急燃');

  const ji = makeState();
  resetRoom(ji, 16, false);
  if (ji.roomName !== '急廊' || ji.roomId !== 'jilang') throw new Error('jilang load');
  if (ji.toast !== TOAST.hasteRoom) throw new Error('急廊 intro');
  if (ji.roomW !== 960 || ji.roomH !== 400) throw new Error('急廊 size');
  if (ji.player.x !== 80 || ji.player.y !== 200) throw new Error('急廊 spawn');
  if (ji.hasteReady) throw new Error('急廊 haste starts false');
  let jiStill = 0;
  let jiTide = 0;
  for (let i = 0; i < ji.waters.length; i++) {
    if (ji.waters[i].tide) jiTide += 1;
    else jiStill += 1;
  }
  if (jiStill < 1) throw new Error('急廊 needs static 水洼');
  if (jiTide) throw new Error('急廊 no tide');
  let jiCore = 0;
  let jiHeal = 0;
  let jiThick = 0;
  let jiHasteItem = 0;
  for (let i = 0; i < ji.crates.length; i++) {
    if (ji.crates[i].loot === 'core') jiCore += 1;
    if (ji.crates[i].loot === 'heal') jiHeal += 1;
    if (ji.crates[i].thick) jiThick += 1;
  }
  for (let i = 0; i < ji.items.length; i++) {
    if (ji.items[i].kind === 'haste') jiHasteItem += 1;
  }
  if (jiHasteItem < 1) throw new Error('急廊 needs 急燃');
  if (jiCore !== 1) throw new Error('急廊 心核');
  if (jiHeal < 1) throw new Error('急廊 回星');
  const jBox = ji.crates.find(function (c) { return c.loot === 'core'; });
  if (!jBox || jBox.thick) throw new Error('急廊 心核 crate is not thick');
  if (jiThick) throw new Error('急廊 no thick crate');
  let jiHound = 0;
  let jiGuard = 0;
  let jiMoth = 0;
  for (let i = 0; i < ji.enemies.length; i++) {
    if (isHound(ji.enemies[i])) jiHound += 1;
    else if (isMoth(ji.enemies[i])) jiMoth += 1;
    else jiGuard += 1;
  }
  if (jiGuard !== 1 || jiHound !== 1 || jiMoth !== 0) throw new Error('急廊 烬卫/循辙');
  if (inWater(ji, 80, 200) || inOil(ji, 80, 200)) throw new Error('急廊 spawn dry');
  if (inWater(ji, 280, 200) || inOil(ji, 280, 200)) throw new Error('急廊 急燃 dry');
  if (inOil(ji, 860, 188) || inWater(ji, 860, 188)) throw new Error('急廊 core dry');
  if (!inWater(ji, 450, 350)) throw new Error('急廊 wet bag');
  for (let i = 0; i < ji.crates.length; i++) {
    const c = ji.crates[i];
    if (circleRect(ji.player.x, ji.player.y, ji.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('急廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 500; x += 10) {
    for (let i = 0; i < ji.crates.length; i++) {
      const c = ji.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('急廊 crate on dry walk');
      }
    }
  }
  explode(ji, jBox.x + jBox.w * 0.5, jBox.y - 20, false);
  if (!jBox.open) throw new Error('急廊 dry trail should open 心核');
  takeCore(ji, { x: 100, y: 100 });
  if (ji.won) throw new Error('急廊 should not 通关');
  for (let i = 0; i < 20; i++) update(ji, 0.1);
  if (ji.roomName !== '拾廊') throw new Error('core advances to 拾廊');
  const hudJi = makeState();
  resetRoom(hudJi, 16, false);
  if (roomHudText(hudJi) !== '急廊 · 17/20') throw new Error('HUD 急廊 17/20');

  const hastePick = makeState();
  resetRoom(hastePick, 0, false);
  if (hastePick.hasteReady) throw new Error('haste starts false');
  hastePick.items.push({ kind: 'haste', x: hastePick.player.x, y: hastePick.player.y, r: 10, taken: false });
  update(hastePick, 0.016);
  if (hastePick.hasteReady !== true) throw new Error('pick 急燃');
  if (hastePick.toast !== TOAST.hasteGet) throw new Error('急燃到手');
  dropSpark(hastePick, 200, 200, false);
  const hasteSpark = hastePick.sparks[hastePick.sparks.length - 1];
  if (Math.abs(hasteSpark.t - HASTE_T) > 1e-9) throw new Error('haste fuse HASTE_T');
  if (hastePick.hasteReady) throw new Error('haste consumed');
  if (String(hastePick.toast).indexOf(TOAST.hasteUse) < 0) throw new Error('急燃爆了');

  const hasteWet = makeState();
  resetRoom(hasteWet, 0, false);
  hasteWet.hasteReady = true;
  hasteWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(hasteWet, 120, 120, false);
  if (!hasteWet.sparks[0].wet) throw new Error('haste wet spark');
  if (hasteWet.hasteReady !== true) throw new Error('wet keeps haste');
  if (Math.abs(hasteWet.sparks[0].t - TAIL_T) > 1e-9) throw new Error('wet fuse TAIL_T');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const hasteStack = makeState();
  resetRoom(hasteStack, 0, false);
  hasteStack.hasteReady = true;
  hasteStack.items.push({ kind: 'haste', x: hasteStack.player.x, y: hasteStack.player.y, r: 10, taken: false });
  update(hasteStack, 0.016);
  if (hasteStack.hasteReady !== true) throw new Error('stack stays ready');
  dropSpark(hasteStack, 180, 180, false);
  dropSpark(hasteStack, 220, 180, false);
  if (Math.abs(hasteStack.sparks[0].t - HASTE_T) > 1e-9) throw new Error('only first haste');
  if (Math.abs(hasteStack.sparks[1].t - TAIL_T) > 1e-9) throw new Error('second spark TAIL_T');

  const hasteKeepSeed = makeState();
  resetRoom(hasteKeepSeed, 0, false);
  hasteKeepSeed.seed = 1;
  hasteKeepSeed.hasteReady = true;
  dropSpark(hasteKeepSeed, 200, 200, false);
  if (hasteKeepSeed.seed !== 1) throw new Error('haste drop keeps seed');
  if (hasteKeepSeed.hasteReady) throw new Error('haste spent keep seed');

  const hasteThick = makeState();
  resetRoom(hasteThick, 0, false);
  hasteThick.hasteReady = true;
  hasteThick.crates.push({ x: 400, y: 200, w: CRATE, h: CRATE, open: false, loot: 'core', thick: true });
  dropSpark(hasteThick, 424, 224, false);
  hasteThick.sparks[hasteThick.sparks.length - 1].t = 0;
  update(hasteThick, 0.016);
  if (hasteThick.crates[hasteThick.crates.length - 1].open) throw new Error('haste no thick');

  const hasteOil = makeState();
  resetRoom(hasteOil, 0, false);
  hasteOil.player.x = 40;
  hasteOil.player.y = 40;
  hasteOil.hasteReady = true;
  hasteOil.oils = [{ x: 200, y: 180, w: 80, h: 80 }];
  dropSpark(hasteOil, 240, 220, false);
  if (!hasteOil.sparks[0].oiled || !hasteOil.sparks[0].hot || !hasteOil.sparks[0].haste) {
    throw new Error('haste oil still hot');
  }
  if (Math.abs(hasteOil.sparks[0].t - HASTE_T) > 1e-9) throw new Error('haste oil fuse');
  hasteOil.sparks[0].t = 0;
  update(hasteOil, 0.016);
  if (!hasteOil.embers.length || Math.abs(hasteOil.embers[0].r - HOT_BLAST_R) > 1e-9) {
    throw new Error('haste oil HOT_BLAST_R');
  }

  for (let r = 0; r < 14; r++) {
    const old = ROOMS[r].crates || [];
    for (let j = 0; j < old.length; j++) {
      if (old[j].thick) throw new Error('no thick in old rooms');
    }
  }

  const seedPick = makeState();
  resetRoom(seedPick, 0, false);
  if (seedPick.seed !== 0) throw new Error('seed starts 0');
  seedPick.items.push({ kind: 'seed', x: seedPick.player.x, y: seedPick.player.y, r: 10, taken: false });
  update(seedPick, 0.016);
  if (seedPick.seed !== 1) throw new Error('pick 焰种');
  if (seedPick.toast !== TOAST.seedGet) throw new Error('捡到焰种');
  seedPick.watch = true;
  resetRoom(seedPick, 0, false);
  if (seedPick.seed !== 0) throw new Error('R clears seed');
  if (!seedPick.watch) throw new Error('R keeps 观摩');

  const thickNo = makeState();
  resetRoom(thickNo, 0, false);
  thickNo.seed = 0;
  thickNo.crates.push({ x: 400, y: 200, w: CRATE, h: CRATE, open: false, loot: 'core', thick: true });
  explode(thickNo, 424, 224, false);
  if (thickNo.crates[thickNo.crates.length - 1].open) throw new Error('thick closed normal');
  explode(thickNo, 424, 224, true);
  if (thickNo.crates[thickNo.crates.length - 1].open) throw new Error('thick closed hot');

  const thickYes = makeState();
  resetRoom(thickYes, 0, false);
  thickYes.player.x = 40;
  thickYes.player.y = 40;
  thickYes.seed = 1;
  thickYes.crates.push({ x: 400, y: 200, w: CRATE, h: CRATE, open: false, loot: 'core', thick: true });
  explode(thickYes, 424, 224, false);
  if (!thickYes.crates[thickYes.crates.length - 1].open) throw new Error('seeded opens thick');
  if (thickYes.seed !== 0) throw new Error('seed consumed');
  if (thickYes.toast !== TOAST.seedBoom) throw new Error('焰种爆了');
  if (!thickYes.embers.length || Math.abs(thickYes.embers[0].r - SEED_R) > 1e-9) {
    throw new Error('SEED_R');
  }

  const seedWet = makeState();
  resetRoom(seedWet, 0, false);
  seedWet.seed = 1;
  seedWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(seedWet, 120, 120, false);
  for (let i = 0; i < 24; i++) update(seedWet, 0.1);
  if (seedWet.stats.fizzles < 1) throw new Error('seed fizzle');
  if (seedWet.stats.booms !== 0) throw new Error('fizzle no boom');
  if (seedWet.seed !== 1) throw new Error('fizzle keeps seed');

  const seedSeek = makeState();
  resetRoom(seedSeek, 0, false);
  setWatch(seedSeek, true);
  seedSeek.crates.forEach(function (c) { c.open = true; });
  seedSeek.items.push({ kind: 'seed', x: 400, y: 220, r: 10, taken: false });
  const seedD0 = dist(seedSeek.player.x, seedSeek.player.y, 400, 220);
  for (let i = 0; i < 30; i++) update(seedSeek, 0.05);
  const seedD1 = dist(seedSeek.player.x, seedSeek.player.y, 400, 220);
  if (seedSeek.seed !== 1 && !seedSeek.items[seedSeek.items.length - 1].taken && seedD1 >= seedD0 - 8) {
    throw new Error('观摩 seek 焰种');
  }

  const tideU = makeState();
  resetRoom(tideU, 0, false);
  tideU.player.x = 40;
  tideU.player.y = 40;
  tideU.waters = [{ x: 200, y: 180, w: 80, h: 80, tide: true }];
  tideU.tideT = 0;
  tideU.tideHigh = false;
  if (tideHigh(tideU)) throw new Error('tide starts low');
  if (inWater(tideU, 240, 220) !== false) throw new Error('inWater false while low');
  dropSpark(tideU, 240, 220, false);
  if (tideU.sparks[0].wet) throw new Error('spark not wet while low');
  const boomsTide = tideU.stats.booms;
  const fizTide = tideU.stats.fizzles;
  let guard = 0;
  while (tideU.tideT < TIDE_LOW && guard < 200) {
    if (tideU.sparks[0] && !tideU.sparks[0].dead) tideU.sparks[0].t = 0.5;
    update(tideU, 0.05);
    guard += 1;
  }
  if (!tideHigh(tideU)) throw new Error('tide should be high after 2.8s');
  if (!inWater(tideU, 240, 220)) throw new Error('inWater true while high');
  const soaked = tideU.sparks[0];
  if (!soaked || (!soaked.dead && !soaked.wet)) throw new Error('rise soaks dry spark');
  for (let i = 0; i < 8; i++) update(tideU, 0.05);
  if (tideU.stats.fizzles <= fizTide) throw new Error('tide rise fizzle');
  if (tideU.stats.booms !== boomsTide) throw new Error('tide fizzle no boom');
  if (!inWater(tideU, 240, 220)) throw new Error('still high after fizzle');
  for (let i = 0; i < 28; i++) update(tideU, 0.05);
  if (inWater(tideU, 240, 220)) throw new Error('inWater false after fall');

  if (typeof updateEater !== 'function' || typeof isEater !== 'function') {
    throw new Error('拾烬 helpers');
  }
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const eat = makeState();
  resetRoom(eat, 0, false);
  eat.player.x = 40;
  eat.player.y = 40;
  eat.player.inv = 2;
  eat.enemies.push({
    x: 280, y: 200, r: EATER_R, hp: EATER_HP, hitT: 0,
    kind: NAMES.eater, faceX: 1, faceY: 0, flutter: 0,
  });
  dropSpark(eat, 288, 200, false);
  if (eat.sparks[0].wet || eat.sparks[0].dead) throw new Error('eat spark live dry');
  const eatBooms = eat.stats.booms;
  for (let i = 0; i < 12; i++) update(eat, 0.05);
  if (!eat.sparks[0].dead) throw new Error('拾烬 eats dry spark');
  if (eat.stats.booms !== eatBooms) throw new Error('eat must not boom');
  if (String(eat.toast).indexOf(TOAST.eaterEat) < 0) throw new Error('拾烬吃辙');

  const eatIdle = makeState();
  resetRoom(eatIdle, 0, false);
  eatIdle.player.x = 40;
  eatIdle.player.y = 40;
  eatIdle.player.inv = 2;
  eatIdle.enemies.push({
    x: 420, y: 220, r: EATER_R, hp: EATER_HP, hitT: 0,
    kind: NAMES.eater, faceX: 1, faceY: 0, flutter: 0,
  });
  const ei = eatIdle.enemies[eatIdle.enemies.length - 1];
  const idleEx = ei.x;
  const idleEy = ei.y;
  const idleP0 = dist(idleEx, idleEy, eatIdle.player.x, eatIdle.player.y);
  for (let i = 0; i < 20; i++) update(eatIdle, 0.05);
  const idleP1 = dist(ei.x, ei.y, eatIdle.player.x, eatIdle.player.y);
  if (idleP0 - idleP1 > 18) throw new Error('拾烬 must not seek the player');

  const eatWet = makeState();
  resetRoom(eatWet, 0, false);
  eatWet.player.x = 40;
  eatWet.player.y = 40;
  eatWet.player.inv = 2;
  eatWet.waters = [{ x: 200, y: 180, w: 80, h: 80 }];
  eatWet.enemies.push({
    x: 240, y: 220, r: EATER_R, hp: EATER_HP, hitT: 0,
    kind: NAMES.eater, faceX: 1, faceY: 0, flutter: 0,
  });
  dropSpark(eatWet, 240, 220, false);
  if (!eatWet.sparks[0].wet) throw new Error('wet spark for 拾烬');
  for (let i = 0; i < 16; i++) update(eatWet, 0.05);
  if (eatWet.sparks[0].dead) throw new Error('拾烬 must not eat wet');
  if (!eatWet.sparks[0].wet) throw new Error('wet stays wet');
  for (let i = 0; i < 24; i++) update(eatWet, 0.1);
  if (eatWet.stats.fizzles < 1) throw new Error('wet spark fizzle path');
  if (eatWet.stats.booms !== 0) throw new Error('wet no boom');

  const eatHp = makeState();
  resetRoom(eatHp, 0, false);
  eatHp.player.x = 40;
  eatHp.player.y = 40;
  eatHp.player.inv = 2;
  eatHp.enemies.push({
    x: 400, y: 220, r: EATER_R, hp: EATER_HP, hitT: 0,
    kind: NAMES.eater, faceX: 1, faceY: 0, flutter: 0,
  });
  const eh = eatHp.enemies[eatHp.enemies.length - 1];
  explode(eatHp, eh.x, eh.y, true);
  if (eh.hp !== 1) throw new Error('拾烬 any blast is 1');
  explode(eatHp, eh.x, eh.y, false);
  if (eh.hp > 0) throw new Error('拾烬 dies in 2 blasts');
  if (eatHp.toast !== TOAST.eater) throw new Error('拾烬倒了');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const shi = makeState();
  resetRoom(shi, 17, false);
  if (shi.roomName !== '拾廊' || shi.roomId !== 'shilang') throw new Error('shilang load');
  if (shi.toast !== TOAST.eaterRoom) throw new Error('拾廊 intro');
  if (shi.roomW !== 960 || shi.roomH !== 400) throw new Error('拾廊 size');
  if (shi.player.x !== 80 || shi.player.y !== 200) throw new Error('拾廊 spawn');
  let shiCore = 0;
  let shiHeal = 0;
  let shiThick = 0;
  for (let i = 0; i < shi.crates.length; i++) {
    if (shi.crates[i].loot === 'core') shiCore += 1;
    if (shi.crates[i].loot === 'heal') shiHeal += 1;
    if (shi.crates[i].thick) shiThick += 1;
  }
  if (shiCore !== 1) throw new Error('拾廊 心核');
  if (shiHeal < 1) throw new Error('拾廊 回星');
  const sBox = shi.crates.find(function (c) { return c.loot === 'core'; });
  if (!sBox || sBox.thick) throw new Error('拾廊 心核 crate is not thick');
  if (shiThick) throw new Error('拾廊 no thick crate');
  let shiHound = 0;
  let shiGuard = 0;
  let shiMoth = 0;
  let shiEater = 0;
  for (let i = 0; i < shi.enemies.length; i++) {
    if (isHound(shi.enemies[i])) shiHound += 1;
    else if (isMoth(shi.enemies[i])) shiMoth += 1;
    else if (isEater(shi.enemies[i])) shiEater += 1;
    else shiGuard += 1;
  }
  if (shiEater !== 1 || shiGuard !== 1 || shiHound !== 0 || shiMoth !== 0) {
    throw new Error('拾廊 拾烬/烬卫');
  }
  const se = shi.enemies.find(function (e) { return isEater(e); });
  if (!se || se.hp !== 2 || se.r !== EATER_R) throw new Error('拾廊 拾烬 stats');
  if (Math.abs(se.x - 400) > 1e-9 || Math.abs(se.y - 230) > 1e-9) throw new Error('拾廊 拾烬 pos');
  let shiHasteItem = 0;
  let shiSeedItem = 0;
  for (let i = 0; i < shi.items.length; i++) {
    if (shi.items[i].kind === 'haste') shiHasteItem += 1;
    if (shi.items[i].kind === 'seed') shiSeedItem += 1;
  }
  if (shiHasteItem || shiSeedItem) throw new Error('拾廊 no 焰种/急燃');
  let shiTide = 0;
  let shiStill = 0;
  for (let i = 0; i < shi.waters.length; i++) {
    if (shi.waters[i].tide) shiTide += 1;
    else shiStill += 1;
  }
  if (shiTide) throw new Error('拾廊 no tide');
  if (shiStill < 1) throw new Error('拾廊 needs 水洼');
  if (inWater(shi, 80, 200) || inOil(shi, 80, 200)) throw new Error('拾廊 spawn dry');
  if (inWater(shi, 400, 100)) throw new Error('拾廊 north shelf wet');
  if (!inWater(shi, 450, 350)) throw new Error('拾廊 wet bag');
  for (let i = 0; i < shi.crates.length; i++) {
    const c = shi.crates[i];
    if (circleRect(shi.player.x, shi.player.y, shi.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('拾廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 500; x += 10) {
    for (let i = 0; i < shi.crates.length; i++) {
      const c = shi.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('拾廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 700; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(shi, x, y)) throw new Error('拾廊 north puddle');
      for (let i = 0; i < shi.enemies.length; i++) {
        const e = shi.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('拾廊 north enemy');
      }
    }
  }
  explode(shi, sBox.x + sBox.w * 0.5, sBox.y - 20, false);
  if (!sBox.open) throw new Error('拾廊 dry trail should open 心核');
  takeCore(shi, { x: 100, y: 100 });
  if (shi.won) throw new Error('拾廊 should not 通关');
  for (let i = 0; i < 20; i++) update(shi, 0.1);
  if (shi.roomName !== '响廊') throw new Error('core advances to 响廊');
  const hudShi = makeState();
  resetRoom(hudShi, 17, false);
  if (roomHudText(hudShi) !== '拾廊 · 18/20') throw new Error('HUD 拾廊 18/20');

  if (NAMES.echo !== '回爆') throw new Error('回爆 name');
  if (COL.echo !== '#e8b45a') throw new Error('COL.echo');
  if (ECHO_T !== 0.45) throw new Error('ECHO_T 0.45');
  if (TOAST.echoGet !== '捡到回爆') throw new Error('捡到回爆');
  if (TOAST.echoUse !== '回爆来了') throw new Error('回爆来了');
  if (TOAST.echoRoom !== '回爆会再炸') throw new Error('回爆会再炸');
  if (lootKind('回爆') !== 'echo' || lootKind('echo') !== 'echo') throw new Error('lootKind 回爆');
  if (NAMES.suck !== '吸爆') throw new Error('吸爆 name');
  if (COL.suck !== '#4ad8c8') throw new Error('COL.suck');
  if (SUCK_R !== 140) throw new Error('SUCK_R 140');
  if (TOAST.suckGet !== '捡到吸爆') throw new Error('捡到吸爆');
  if (TOAST.suckUse !== '吸爆来了') throw new Error('吸爆来了');
  if (TOAST.suckRoom !== '吸爆会吸辙') throw new Error('吸爆会吸辙');
  if (lootKind('吸爆') !== 'suck' || lootKind('suck') !== 'suck') throw new Error('lootKind 吸爆');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const echoDry = makeState();
  resetRoom(echoDry, 0, false);
  echoDry.echoReady = true;
  dropSpark(echoDry, 120, 120, false);
  if (echoDry.echoReady !== true) throw new Error('dropSpark keeps 回爆');
  for (let i = 0; i < 24; i++) update(echoDry, 0.1);
  if (echoDry.stats.booms !== 1) throw new Error('echo first boom');
  if (echoDry.echoReady !== false) throw new Error('echoReady consumed on boom');
  if (!echoDry.echoes || echoDry.echoes.length !== 1) throw new Error('echo queued');

  for (let i = 0; i < 10; i++) update(echoDry, 0.1);
  if (echoDry.stats.booms !== 2) throw new Error('echo second boom');
  if (echoDry.echoes.length !== 0) throw new Error('echo spent');
  if (String(echoDry.toast).indexOf(TOAST.echoUse) < 0) throw new Error('回爆来了');

  const echoWet = makeState();
  resetRoom(echoWet, 0, false);
  echoWet.echoReady = true;
  echoWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(echoWet, 120, 120, false);
  if (!echoWet.sparks[0].wet) throw new Error('echo wet spark');
  for (let i = 0; i < 24; i++) update(echoWet, 0.1);
  if (echoWet.echoReady !== true) throw new Error('wet keeps 回爆');
  if (echoWet.stats.booms !== 0) throw new Error('wet echo no boom');
  if (echoWet.echoes && echoWet.echoes.length) throw new Error('wet no echo queue');

  const echoHurt = makeState();
  resetRoom(echoHurt, 0, false);
  echoHurt.player.x = 80;
  echoHurt.player.y = 80;
  echoHurt.echoReady = true;
  explode(echoHurt, 400, 220, false);
  if (echoHurt.stats.booms !== 1) throw new Error('echo hurt first boom');
  if (!echoHurt.echoes.length) throw new Error('echo hurt queued');
  echoHurt.player.x = 400;
  echoHurt.player.y = 220;
  echoHurt.player.inv = 0;
  echoHurt.player.dashT = 0;
  echoHurt.embers.length = 0;
  echoHurt.echoes[0].t = 0;
  echoHurt.echoes[0].wait = false;
  const echoHp = echoHurt.player.hearts;
  update(echoHurt, 0.016);
  if (echoHurt.stats.booms !== 2) throw new Error('echo hurt second boom');
  if (echoHurt.player.hearts !== echoHp - 1) throw new Error('echo hurts player');

  const echoOnce = makeState();
  resetRoom(echoOnce, 0, false);
  echoOnce.echoReady = true;
  dropSpark(echoOnce, 120, 120, false);
  for (let i = 0; i < 40; i++) update(echoOnce, 0.1);
  if (echoOnce.stats.booms !== 2) throw new Error('one pickup one echo');
  if (echoOnce.echoReady) throw new Error('echo stays spent');
  if (echoOnce.echoes && echoOnce.echoes.length) throw new Error('echo no requeue');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const echoPick = makeState();
  resetRoom(echoPick, 0, false);
  if (echoPick.echoReady) throw new Error('echo starts false');
  echoPick.items.push({ kind: 'echo', x: echoPick.player.x, y: echoPick.player.y, r: 10, taken: false });
  update(echoPick, 0.016);
  if (echoPick.echoReady !== true) throw new Error('pick 回爆');
  if (echoPick.toast !== TOAST.echoGet) throw new Error('捡到回爆');

  const echoKeep = makeState();
  resetRoom(echoKeep, 0, false);
  echoKeep.seed = 1;
  echoKeep.hasteReady = true;
  echoKeep.echoReady = true;
  dropSpark(echoKeep, 200, 200, false);
  if (echoKeep.seed !== 1) throw new Error('echo drop keeps seed');
  if (echoKeep.hasteReady) throw new Error('haste spent before echo boom');
  if (echoKeep.echoReady !== true) throw new Error('echo waits for boom');
  echoKeep.sparks[echoKeep.sparks.length - 1].t = 0;
  update(echoKeep, 0.016);
  if (echoKeep.seed !== 0) throw new Error('first boom spends seed');
  if (echoKeep.echoReady) throw new Error('first boom spends echo');
  echoKeep.seed = 1;
  echoKeep.hasteReady = true;
  echoKeep.echoReady = true;
  echoKeep.echoing = true;
  explode(echoKeep, 200, 200, true);
  echoKeep.echoing = false;
  if (echoKeep.seed !== 1) throw new Error('echo keeps seed');
  if (echoKeep.hasteReady !== true) throw new Error('echo keeps haste');
  if (echoKeep.echoReady !== true) throw new Error('echo blast keeps ready');
  if (echoKeep.echoes.length !== 1) throw new Error('echo blast no requeue');

  const xiang = makeState();
  resetRoom(xiang, 18, false);
  if (xiang.roomName !== '响廊' || xiang.roomId !== 'xianglang') throw new Error('xianglang load');
  if (xiang.toast !== TOAST.echoRoom) throw new Error('响廊 intro');
  if (xiang.roomW !== 960 || xiang.roomH !== 400) throw new Error('响廊 size');
  if (xiang.player.x !== 80 || xiang.player.y !== 200) throw new Error('响廊 spawn');
  if (xiang.echoReady) throw new Error('响廊 echo starts false');
  let xiangStill = 0;
  let xiangTide = 0;
  for (let i = 0; i < xiang.waters.length; i++) {
    if (xiang.waters[i].tide) xiangTide += 1;
    else xiangStill += 1;
  }
  if (xiangStill < 1) throw new Error('响廊 needs static 水洼');
  if (xiangTide) throw new Error('响廊 no tide');
  let xiangCore = 0;
  let xiangHeal = 0;
  let xiangThick = 0;
  let xiangEchoItem = 0;
  let xiangHasteItem = 0;
  let xiangSeedItem = 0;
  for (let i = 0; i < xiang.crates.length; i++) {
    if (xiang.crates[i].loot === 'core') xiangCore += 1;
    if (xiang.crates[i].loot === 'heal') xiangHeal += 1;
    if (xiang.crates[i].thick) xiangThick += 1;
  }
  for (let i = 0; i < xiang.items.length; i++) {
    if (xiang.items[i].kind === 'echo') xiangEchoItem += 1;
    if (xiang.items[i].kind === 'haste') xiangHasteItem += 1;
    if (xiang.items[i].kind === 'seed') xiangSeedItem += 1;
  }
  if (xiangEchoItem < 1) throw new Error('响廊 needs 回爆');
  if (xiangHasteItem || xiangSeedItem) throw new Error('响廊 no 焰种/急燃');
  if (xiangCore !== 1) throw new Error('响廊 心核');
  if (xiangHeal < 1) throw new Error('响廊 回星');
  const xBox = xiang.crates.find(function (c) { return c.loot === 'core'; });
  if (!xBox || xBox.thick) throw new Error('响廊 心核 crate is not thick');
  if (xiangThick) throw new Error('响廊 no thick crate');
  let xiangHound = 0;
  let xiangGuard = 0;
  let xiangMoth = 0;
  let xiangEater = 0;
  for (let i = 0; i < xiang.enemies.length; i++) {
    if (isHound(xiang.enemies[i])) xiangHound += 1;
    else if (isMoth(xiang.enemies[i])) xiangMoth += 1;
    else if (isEater(xiang.enemies[i])) xiangEater += 1;
    else xiangGuard += 1;
  }
  if (xiangMoth !== 1 || xiangGuard !== 1 || xiangHound !== 0 || xiangEater !== 0) {
    throw new Error('响廊 灯蛾/烬卫');
  }
  if (inWater(xiang, 80, 200) || inOil(xiang, 80, 200)) throw new Error('响廊 spawn dry');
  if (inWater(xiang, 280, 200) || inOil(xiang, 280, 200)) throw new Error('响廊 回爆 dry');
  if (inOil(xiang, 860, 188) || inWater(xiang, 860, 188)) throw new Error('响廊 core dry');
  if (!inWater(xiang, 450, 350)) throw new Error('响廊 wet bag');
  if (inWater(xiang, 400, 100)) throw new Error('响廊 north shelf wet');
  for (let i = 0; i < xiang.crates.length; i++) {
    const c = xiang.crates[i];
    if (circleRect(xiang.player.x, xiang.player.y, xiang.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('响廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 500; x += 10) {
    for (let i = 0; i < xiang.crates.length; i++) {
      const c = xiang.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('响廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 700; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(xiang, x, y)) throw new Error('响廊 north puddle');
      for (let i = 0; i < xiang.enemies.length; i++) {
        const e = xiang.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('响廊 north enemy');
      }
    }
  }
  explode(xiang, xBox.x + xBox.w * 0.5, xBox.y - 20, false);
  if (!xBox.open) throw new Error('响廊 dry trail should open 心核');
  takeCore(xiang, { x: 100, y: 100 });
  if (xiang.won) throw new Error('响廊 should not 通关');
  for (let i = 0; i < 20; i++) update(xiang, 0.1);
  if (xiang.roomName !== '吸廊') throw new Error('core advances to 吸廊');
  const hudXiang = makeState();
  resetRoom(hudXiang, 18, false);
  if (roomHudText(hudXiang) !== '响廊 · 19/20') throw new Error('HUD 响廊 19/20');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const suckA = makeState();
  resetRoom(suckA, 0, false);
  suckA.suckReady = true;
  dropSpark(suckA, 200, 200, false);
  dropSpark(suckA, 300, 200, false);
  suckA.sparks[0].t = 0;
  update(suckA, 0.016);
  if (suckA.suckReady !== false) throw new Error('suckReady consumed on boom');
  if (suckA.sparks[1].t > CHAIN_T) throw new Error('suck neighbor t');
  if (suckA.sparks[1].fuse !== true) throw new Error('suck neighbor fuse');
  if (String(suckA.toast).indexOf(TOAST.suckUse) < 0) throw new Error('吸爆来了');

  const suckB = makeState();
  resetRoom(suckB, 0, false);
  dropSpark(suckB, 200, 200, false);
  dropSpark(suckB, 300, 200, false);
  suckB.sparks[0].t = 0;
  update(suckB, 0.016);
  if (suckB.sparks[1].fuse) throw new Error('no suck no fuse');
  if (suckB.sparks[1].t <= CHAIN_T) throw new Error('no suck neighbor t');

  const suckWet = makeState();
  resetRoom(suckWet, 0, false);
  suckWet.suckReady = true;
  suckWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(suckWet, 120, 120, false);
  if (!suckWet.sparks[0].wet) throw new Error('suck wet spark');
  for (let i = 0; i < 24; i++) update(suckWet, 0.1);
  if (suckWet.suckReady !== true) throw new Error('wet keeps 吸爆');
  if (suckWet.stats.booms !== 0) throw new Error('wet suck no boom');

  const suckHurt = makeState();
  resetRoom(suckHurt, 0, false);
  suckHurt.suckReady = true;
  const suckHp = suckHurt.player.hearts;
  explode(suckHurt, suckHurt.player.x, suckHurt.player.y, false);
  if (suckHurt.player.hearts !== suckHp - 1) throw new Error('suck boom hurts');
  if (suckHurt.suckReady !== false) throw new Error('suck boom spends ready');

  const suckOnce = makeState();
  resetRoom(suckOnce, 0, false);
  suckOnce.suckReady = true;
  dropSpark(suckOnce, 300, 200, false);
  explode(suckOnce, 200, 200, false);
  if (suckOnce.suckReady !== false) throw new Error('first boom spends suck');
  if (!suckOnce.sparks[0].fuse) throw new Error('first suck fuses');
  suckOnce.sparks[0].fuse = false;
  suckOnce.sparks[0].t = TAIL_T;
  explode(suckOnce, 200, 200, false);
  if (suckOnce.sparks[0].fuse) throw new Error('second boom does not suck');
  if (suckOnce.sparks[0].t <= CHAIN_T) throw new Error('second boom no suck t');

  const suckEcho = makeState();
  resetRoom(suckEcho, 0, false);
  suckEcho.suckReady = true;
  suckEcho.echoReady = true;
  suckEcho.echoing = true;
  dropSpark(suckEcho, 300, 200, false);
  explode(suckEcho, 200, 200, false);
  suckEcho.echoing = false;
  if (suckEcho.suckReady !== true) throw new Error('echo blast keeps suck');
  if (suckEcho.sparks[0].fuse) throw new Error('echo blast no suck fuse');
  if (suckEcho.echoReady !== true) throw new Error('echo blast keeps echo');

  const suckPick = makeState();
  resetRoom(suckPick, 0, false);
  if (suckPick.suckReady) throw new Error('suck starts false');
  suckPick.items.push({ kind: 'suck', x: suckPick.player.x, y: suckPick.player.y, r: 10, taken: false });
  update(suckPick, 0.016);
  if (suckPick.suckReady !== true) throw new Error('pick 吸爆');
  if (suckPick.toast !== TOAST.suckGet) throw new Error('捡到吸爆');

  const suckKeep = makeState();
  resetRoom(suckKeep, 0, false);
  suckKeep.seed = 1;
  suckKeep.hasteReady = true;
  suckKeep.echoReady = true;
  suckKeep.suckReady = true;
  explode(suckKeep, 400, 220, false);
  if (suckKeep.suckReady) throw new Error('suck boom spends suck');
  if (suckKeep.echoReady) throw new Error('suck boom still queues echo');
  if (!suckKeep.echoes || suckKeep.echoes.length !== 1) throw new Error('suck boom queues echo');
  if (suckKeep.seed !== 0) throw new Error('suck boom is a real boom spends seed');
  if (suckKeep.hasteReady !== true) throw new Error('suck does not spend haste');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const xi = makeState();
  resetRoom(xi, 19, false);
  if (xi.roomName !== '吸廊' || xi.roomId !== 'xilang') throw new Error('xilang load');
  if (xi.toast !== TOAST.suckRoom) throw new Error('吸廊 intro');
  if (xi.roomW !== 960 || xi.roomH !== 400) throw new Error('吸廊 size');
  if (xi.player.x !== 80 || xi.player.y !== 200) throw new Error('吸廊 spawn');
  if (xi.suckReady) throw new Error('吸廊 suck starts false');
  let xiStill = 0;
  let xiTide = 0;
  for (let i = 0; i < xi.waters.length; i++) {
    if (xi.waters[i].tide) xiTide += 1;
    else xiStill += 1;
  }
  if (xiStill < 1) throw new Error('吸廊 needs static 水洼');
  if (xiTide) throw new Error('吸廊 no tide');
  let xiCore = 0;
  let xiHeal = 0;
  let xiThick = 0;
  let xiSuckItem = 0;
  let xiEchoItem = 0;
  let xiHasteItem = 0;
  let xiSeedItem = 0;
  for (let i = 0; i < xi.crates.length; i++) {
    if (xi.crates[i].loot === 'core') xiCore += 1;
    if (xi.crates[i].loot === 'heal') xiHeal += 1;
    if (xi.crates[i].thick) xiThick += 1;
  }
  for (let i = 0; i < xi.items.length; i++) {
    if (xi.items[i].kind === 'suck') xiSuckItem += 1;
    if (xi.items[i].kind === 'echo') xiEchoItem += 1;
    if (xi.items[i].kind === 'haste') xiHasteItem += 1;
    if (xi.items[i].kind === 'seed') xiSeedItem += 1;
  }
  if (xiSuckItem < 1) throw new Error('吸廊 needs 吸爆');
  if (xiEchoItem || xiHasteItem || xiSeedItem) throw new Error('吸廊 no 焰种/急燃/回爆');
  if (xiCore !== 1) throw new Error('吸廊 心核');
  if (xiHeal < 1) throw new Error('吸廊 回星');
  const xiBox = xi.crates.find(function (c) { return c.loot === 'core'; });
  if (!xiBox || xiBox.thick) throw new Error('吸廊 心核 crate is not thick');
  if (xiThick) throw new Error('吸廊 no thick crate');
  let xiHound = 0;
  let xiGuard = 0;
  let xiMoth = 0;
  let xiEater = 0;
  for (let i = 0; i < xi.enemies.length; i++) {
    if (isHound(xi.enemies[i])) xiHound += 1;
    else if (isMoth(xi.enemies[i])) xiMoth += 1;
    else if (isEater(xi.enemies[i])) xiEater += 1;
    else xiGuard += 1;
  }
  if (xiGuard !== 1 || xiHound !== 0 || xiMoth !== 0 || xiEater !== 0) {
    throw new Error('吸廊 烬卫 only');
  }
  if (inWater(xi, 80, 200) || inOil(xi, 80, 200)) throw new Error('吸廊 spawn dry');
  if (inWater(xi, 280, 200) || inOil(xi, 280, 200)) throw new Error('吸廊 吸爆 dry');
  if (inOil(xi, 860, 188) || inWater(xi, 860, 188)) throw new Error('吸廊 core dry');
  if (!inWater(xi, 450, 350)) throw new Error('吸廊 wet bag');
  if (inWater(xi, 400, 100)) throw new Error('吸廊 north shelf wet');
  for (let i = 0; i < xi.crates.length; i++) {
    const c = xi.crates[i];
    if (circleRect(xi.player.x, xi.player.y, xi.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('吸廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 500; x += 10) {
    for (let i = 0; i < xi.crates.length; i++) {
      const c = xi.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('吸廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 700; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(xi, x, y)) throw new Error('吸廊 north puddle');
      for (let i = 0; i < xi.enemies.length; i++) {
        const e = xi.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('吸廊 north enemy');
      }
    }
  }
  const stack = xi.crates.filter(function (c) {
    const cx = c.x + c.w * 0.5;
    return Math.abs(cx - 560) < 8 && !c.loot;
  });
  if (stack.length < 3) throw new Error('吸廊 crate stack');
  stack.sort(function (a, b) { return a.y - b.y; });
  for (let i = 1; i < stack.length; i++) {
    const ay = stack[i - 1].y + stack[i - 1].h * 0.5;
    const by = stack[i].y + stack[i].h * 0.5;
    if (by - ay < 110) throw new Error('吸廊 crate stack y-gap');
  }
  explode(xi, stack[0].x + stack[0].w * 0.5, stack[0].y + stack[0].h * 0.5, false);
  if (!stack[0].open) throw new Error('吸廊 one crate opens');
  if (stack[1].open || stack[2].open) throw new Error('吸廊 blast misses stacked crates');
  explode(xi, xiBox.x + xiBox.w * 0.5, xiBox.y - 20, false);
  if (!xiBox.open) throw new Error('吸廊 dry trail should open 心核');
  takeCore(xi, { x: 100, y: 100 });
  if (!xi.won || xi.toast !== TOAST.all) throw new Error('吸廊 should 通关');
  const hudXi = makeState();
  resetRoom(hudXi, 19, false);
  if (roomHudText(hudXi) !== '吸廊 · 20/20') throw new Error('HUD 吸廊 20/20');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  console.log('selfCheck ok', {
    TAIL_T: TAIL_T,
    DASH_TIME: DASH_TIME,
    IFRAMES: IFRAMES,
    rooms: ROOMS.map(function (r) { return r.name; }),
    fizzles: wet.stats.fizzles,
    standDrops: still.stats.drops,
    watch: armed.watch,
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
