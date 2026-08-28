'use strict';

const TAIL_T = 2.0;
const HASTE_T = 0.55;
const ECHO_T = 0.45;
const SPLIT_T = 0.28;
const SPLIT_D = 80;
const PIERCE_L = 200;
const PIERCE_W = 40;
const RING_IN = 40;
const RING_OUT = 80;
const FROST_T = 1.8;
const SHOVE_V = 280;
const SHOVE_T = 0.40;
const BAIT_T = 2.0;
const BAIT_SEE = 240;
const BAIT_R = 11;
const BAIT_HIT = 16;
const BOLT_R = 170;
const BOLT_N = 3;
const TRIP_R = 16;
const TRIP_LIFE = 12.0;
const DELAY_T = 1.2;
const DELAY_R = 14;
const BOUNCE_R = 150;
const BOUNCE_N = 2;
const ROLL_N = 3;
const ROLL_GAP = 90;
const ROLL_DT = 0.16;
const MIRROR_DT = 0.14;
const SPIN_N = 4;
const SPIN_R = 90;
const SPIN_DT = 0.14;
const POOL_R = 52;
const POOL_LIFE = 5.0;
const FAN_N = 3;
const FAN_D = 96;
const FAN_A = Math.PI / 6;
const FAN_DT = 0.12;
const DRUM_R = 150;
const DRUM_V = 320;
const DRUM_W = 20;
const DRUM_DMG = 2;
const DRUM_KB = 220;
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
const SHELL_HP = 2;
const SHELL_R = 14;
const BOOMER_HP = 1;
const BOOMER_R = 13;
const BOOMER_T = 0.80;
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
  dashBoom: '冲爆',
  split: '裂爆',
  pierce: '贯爆',
  halo: '环爆',
  frost: '霜爆',
  shove: '推爆',
  bait: '诱爆',
  bolt: '雷爆',
  trip: '绊爆',
  delay: '迟爆',
  bounce: '跳爆',
  roll: '卷爆',
  mirror: '镜爆',
  spin: '旋爆',
  pool: '洼爆',
  poolPad: '临洼',
  fan: '扇爆',
  drum: '鼓爆',
  eater: '拾烬',
  shell: '壳卫',
  boomer: '爆卫',
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
  cont: '续关',
  home: '回空场',
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
  dashBoomGet: '捡到冲爆',
  dashBoomUse: '冲爆来了',
  dashBoomRoom: '冲爆会引爆',
  splitGet: '捡到裂爆',
  splitUse: '裂爆来了',
  splitBoom: '裂开了',
  splitRoom: '裂爆会裂开',
  pierceGet: '捡到贯爆',
  pierceUse: '贯爆穿了',
  pierceRoom: '贯爆会穿箱',
  haloGet: '捡到环爆',
  haloUse: '炸成圈了',
  haloRoom: '环爆是空心',
  frostGet: '捡到霜爆',
  frostUse: '冻住了',
  frostRoom: '霜爆会冻住',
  shoveGet: '捡到推爆',
  shoveUse: '推开了',
  shoveRoom: '推爆会推开',
  baitGet: '捡到诱爆',
  baitUse: '诱出来了',
  baitRoom: '诱爆会引开',
  boltGet: '捡到雷爆',
  boltUse: '雷劈了',
  boltRoom: '雷爆会劈远',
  tripGet: '捡到绊爆',
  tripPlant: '绊线埋了',
  tripPop: '绊住了',
  tripSelf: '踩到绊线',
  tripRoom: '埋线等他们来',
  delayGet: '捡到迟爆',
  delayPlant: '迟线埋了',
  delayPop: '迟爆来了',
  delayFizzle: '迟线熄了',
  delayRoom: '埋了再跑',
  bounceGet: '捡到跳爆',
  bounceUse: '跳过去了',
  bounceRoom: '跳过去清场',
  rollGet: '捡到卷爆',
  rollUse: '卷出去了',
  rollRoom: '卷过去清场',
  mirrorGet: '捡到镜爆',
  mirrorUse: '对岸也炸了',
  mirrorRoom: '对岸清场',
  spinGet: '捡到旋爆',
  spinUse: '旋出去了',
  spinRoom: '围着清场',
  poolGet: '捡到洼爆',
  poolUse: '洼开了',
  poolDry: '洼干了',
  poolRoom: '炸出一洼',
  fanGet: '捡到扇爆',
  fanUse: '扇出去了',
  fanRoom: '扇过去清场',
  drumGet: '捡到鼓爆',
  drumUse: '鼓开了',
  drumRoom: '鼓过去清场',
  eater: '拾烬倒了',
  eaterEat: '拾烬吃辙',
  eaterRoom: '拾烬会吃辙',
  shell: '壳卫倒了',
  shellClang: '壳挡了',
  shellRoom: '烫爆才破壳',
  boomer: '爆卫倒了',
  boomerPop: '爆卫炸了',
  boomerFizzle: '爆线熄了',
  boomerRoom: '倒了还会炸',
};

const COL = {
  bg: '#14080a',
  ember: '#ff6a1a',
  gold: '#ffd24a',
  haste: '#ff9a3c',
  echo: '#e8b45a',
  suck: '#4ad8c8',
  dashBoom: '#b8ff4a',
  split: '#7ad0ff',
  pierce: '#ff6ad5',
  halo: '#9a7aff',
  frost: '#9ef0ff',
  shove: '#ff5a3a',
  bait: '#ffb020',
  bolt: '#6ec8ff',
  trip: '#ff6a3d',
  delay: '#ff9a4a',
  bounce: '#ff4ad2',
  roll: '#c86aff',
  mirror: '#6affc2',
  spin: '#ff9a4a',
  pool: '#4ec4ff',
  fan: '#ff7a54',
  drum: '#ffd24a',
  water: '#3a6b8c',
  oil: '#8a4a12',
  eater: '#9a6ab0',
  shell: '#c4a06a',
  boomer: '#d4ff32',
  core: '#ff5d8f',
  heart: '#ff5d8f',
  ash: '#6b5344',
  scorch: '#2a1810',
};

let ROOMS = [];

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function dist(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }
function lerp(a, b, t) { return a + (b - a) * t; }
function mirrorX(s, x) { return (s.roomW || VIEW_W) - x; }

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

function openCrate(s, c) {
  if (!c || c.open) return false;
  c.open = true;
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
  return true;
}

function faceUnit(s) {
  let fx = s.player.faceX;
  let fy = s.player.faceY;
  let fl = Math.hypot(fx, fy);
  if (fl < 0.001) {
    return { x: 1, y: 0 };
  }
  return { x: fx / fl, y: fy / fl };
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

function updatePools(s, dt) {
  if (!s.waters || !s.waters.length) return;
  for (let i = s.waters.length - 1; i >= 0; i--) {
    const w = s.waters[i];
    if (!w.temp) continue;
    w.life = (w.life == null ? 0 : w.life) - dt;
    if (w.life > 0) continue;
    const cx = w.x + w.w * 0.5;
    const cy = w.y + w.h * 0.5;
    s.waters.splice(i, 1);
    burst(s, cx, cy, 5, COL.water, 70);
    toast(s, TOAST.poolDry, 0.9, COL.water);
  }
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
  if (drop === '冲爆' || drop === 'dashboom') return 'dashboom';
  if (drop === '裂爆' || drop === 'split') return 'split';
  if (drop === '贯爆' || drop === 'pierce') return 'pierce';
  if (drop === '环爆' || drop === 'halo') return 'halo';
  if (drop === '霜爆' || drop === 'frost') return 'frost';
  if (drop === '推爆' || drop === 'shove') return 'shove';
  if (drop === '诱爆' || drop === 'bait') return 'bait';
  if (drop === '雷爆' || drop === 'bolt') return 'bolt';
  if (drop === '绊爆' || drop === 'trip') return 'trip';
  if (drop === '迟爆' || drop === 'delay') return 'delay';
  if (drop === '跳爆' || drop === 'bounce') return 'bounce';
  if (drop === '卷爆' || drop === 'roll') return 'roll';
  if (drop === '镜爆' || drop === 'mirror') return 'mirror';
  if (drop === '旋爆' || drop === 'spin') return 'spin';
  if (drop === '洼爆' || drop === 'pool') return 'pool';
  if (drop === '扇爆' || drop === 'fan') return 'fan';
  if (drop === '鼓爆' || drop === 'drum') return 'drum';
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
      shoveT: 0, shoveVx: 0, shoveVy: 0,
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
    dashBoomReady: false,
    splitReady: false,
    pierceReady: false,
    haloReady: false,
    frostReady: false,
    shoveReady: false,
    baitReady: false,
    boltReady: false,
    tripReady: false,
    delayReady: false,
    bounceReady: false,
    rollReady: false,
    mirrorReady: false,
    spinReady: false,
    poolReady: false,
    fanReady: false,
    drumReady: false,
    baits: [],
    bolts: [],
    trips: [],
    delays: [],
    bounceArcs: [],
    rolls: [],
    mirrors: [],
    spins: [],
    fans: [],
    drums: [],
    boomerFuses: [],
    echoes: [],
    echoing: false,
    splits: [],
    splitting: false,
    pierces: [],
    halos: [],
    watch: false,
    watchSide: 1,
    watchStuckT: 0,
    watchLastX: 110,
    watchLastY: 310,
    tideT: 0,
    tideHigh: false,
    shellClangT: 0,
  };
}


const SAVE_KEY = 'weihuo-progress';

function saveStore() {
  if (typeof localStorage !== 'undefined') return localStorage;
  if (!globalThis.__weiHuoMem) globalThis.__weiHuoMem = {};
  const mem = globalThis.__weiHuoMem;
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
    setItem: function (k, v) { mem[k] = String(v); },
    removeItem: function (k) { delete mem[k]; },
  };
}

function loadProgress() {
  try {
    const raw = saveStore().getItem(SAVE_KEY);
    if (!raw) return { room: 0, unlocked: 0 };
    const o = JSON.parse(raw);
    const n = (typeof ensureRooms === 'function' ? ensureRooms() : ROOMS || []).length;
    let room = Math.floor(Number(o.room) || 0);
    let unlocked = Math.floor(Number(o.unlocked) || 0);
    if (room < 0) room = 0;
    if (unlocked < room) unlocked = room;
    if (n) {
      if (room >= n) room = n - 1;
      if (unlocked >= n) unlocked = n - 1;
    }
    return { room: room, unlocked: unlocked };
  } catch (err) {
    return { room: 0, unlocked: 0 };
  }
}

function saveProgress(s) {
  if (!s || !s.persist) return;
  try {
    const n = (typeof ensureRooms === 'function' ? ensureRooms() : ROOMS || []).length;
    let room = s.roomIndex || 0;
    if (room < 0) room = 0;
    if (n && room >= n) room = n - 1;
    const prev = loadProgress();
    const unlocked = prev.unlocked > room ? prev.unlocked : room;
    saveStore().setItem(SAVE_KEY, JSON.stringify({ v: 1, room: room, unlocked: unlocked }));
  } catch (err) {}
}

function clearProgress() {
  try { saveStore().removeItem(SAVE_KEY); } catch (err) {}
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
  s.player.shoveT = 0;
  s.player.shoveVx = 0;
  s.player.shoveVy = 0;
  s.lastSparkX = s.player.x;
  s.lastSparkY = s.player.y;
  s.seed = 0;
  s.hasteReady = false;
  s.echoReady = false;
  s.suckReady = false;
  s.dashBoomReady = false;
  s.splitReady = false;
  s.pierceReady = false;
  s.haloReady = false;
  s.frostReady = false;
  s.shoveReady = false;
  s.baitReady = false;
  s.boltReady = false;
  s.tripReady = false;
  s.delayReady = false;
  s.bounceReady = false;
  s.rollReady = false;
  s.mirrorReady = false;
  s.spinReady = false;
  s.poolReady = false;
  s.fanReady = false;
  s.drumReady = false;
  s.echoing = false;
  s.splitting = false;
  if (!s.echoes) s.echoes = [];
  s.echoes.length = 0;
  if (!s.splits) s.splits = [];
  s.splits.length = 0;
  if (!s.pierces) s.pierces = [];
  s.pierces.length = 0;
  if (!s.halos) s.halos = [];
  s.halos.length = 0;
  if (!s.baits) s.baits = [];
  s.baits.length = 0;
  if (!s.bolts) s.bolts = [];
  s.bolts.length = 0;
  if (!s.trips) s.trips = [];
  s.trips.length = 0;
  if (!s.delays) s.delays = [];
  s.delays.length = 0;
  if (!s.bounceArcs) s.bounceArcs = [];
  s.bounceArcs.length = 0;
  if (!s.rolls) s.rolls = [];
  s.rolls.length = 0;
  if (!s.mirrors) s.mirrors = [];
  s.mirrors.length = 0;
  if (!s.spins) s.spins = [];
  s.spins.length = 0;
  if (!s.fans) s.fans = [];
  s.fans.length = 0;
  if (!s.drums) s.drums = [];
  s.drums.length = 0;
  if (!s.boomerFuses) s.boomerFuses = [];
  s.boomerFuses.length = 0;
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
  s.shellClangT = 0;
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
    let kind = e.type || e.kind || NAMES.enemy;
    if (kind === 'shell' || kind === '壳卫') kind = NAMES.shell;
    if (kind === 'boomer' || kind === '爆卫') kind = NAMES.boomer;
    const hound = kind === NAMES.hound;
    const moth = kind === NAMES.moth;
    const eater = kind === NAMES.eater;
    const shell = kind === NAMES.shell;
    const boomer = kind === NAMES.boomer;
    return {
      x: e.x, y: e.y,
      r: boomer ? BOOMER_R : (shell ? SHELL_R : (moth ? MOTH_R : (eater ? EATER_R : (hound ? 12 : ENEMY_R)))),
      hp: boomer ? BOOMER_HP : (shell ? SHELL_HP : (moth ? MOTH_HP : (eater ? EATER_HP : (hound ? HOUND_HP : ENEMY_HP)))),
      hitT: 0,
      frostT: 0,
      shoveT: 0,
      shoveVx: 0,
      shoveVy: 0,
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
  else if (room.name === '冲廊') toast(s, TOAST.dashBoomRoom, 1.4, COL.dashBoom);
  else if (room.name === '裂廊') toast(s, TOAST.splitRoom, 1.4, COL.split);
  else if (room.name === '贯廊') toast(s, TOAST.pierceRoom, 1.4, COL.pierce);
  else if (room.name === '晕廊') toast(s, TOAST.haloRoom, 1.4, COL.halo);
  else if (room.name === '冻廊') toast(s, TOAST.frostRoom, 1.4, COL.frost);
  else if (room.name === '推廊') toast(s, TOAST.shoveRoom, 1.4, COL.shove);
  else if (room.name === '诱廊') toast(s, TOAST.baitRoom, 1.4, COL.bait);
  else if (room.name === '壳廊') toast(s, TOAST.shellRoom, 1.4, COL.shell);
  else if (room.name === '雷廊') toast(s, TOAST.boltRoom, 1.4, COL.bolt);
  else if (room.name === '绊廊') toast(s, TOAST.tripRoom, 1.4, COL.trip);
  else if (room.name === '迟廊') toast(s, TOAST.delayRoom, 1.4, COL.delay);
  else if (room.name === '跳廊') toast(s, TOAST.bounceRoom, 1.4, COL.bounce);
  else if (room.name === '卷廊') toast(s, TOAST.rollRoom, 1.4, COL.roll);
  else if (room.name === '镜廊') toast(s, TOAST.mirrorRoom, 1.4, COL.mirror);
  else if (room.name === '旋廊') toast(s, TOAST.spinRoom, 1.4, COL.spin);
  else if (room.name === '爆廊') toast(s, TOAST.boomerRoom, 1.4, COL.boomer);
  else if (room.name === '洼廊') toast(s, TOAST.poolRoom, 1.4, COL.pool);
  else if (room.name === '扇廊') toast(s, TOAST.fanRoom, 1.4, COL.fan);
  else if (room.name === '鼓廊') toast(s, TOAST.drumRoom, 1.4, COL.drum);
  else if (room.name === '夹道' && !s.taughtDash) {
    toast(s, TOAST.dashSafe, 1.4, COL.ember);
    s.taughtDash = true;
  }
  saveProgress(s);
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

function isShell(e) {
  return e.kind === NAMES.shell;
}

function isBoomer(e) {
  return e.kind === NAMES.boomer;
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
  if (isBoomer(e)) {
    burst(s, e.x, e.y, 8, COL.boomer, 140);
    burst(s, e.x, e.y, 6, COL.gold, 140);
    toast(s, TOAST.boomer, 1.1, COL.boomer);
    if (!reducedMotion()) {
      punch(s, 6);
      s.hitstop = Math.max(s.hitstop, 0.05);
    }
    if (!s.boomerFuses) s.boomerFuses = [];
    s.boomerFuses.push({ x: e.x, y: e.y, t: BOOMER_T });
  } else if (isShell(e)) {
    burst(s, e.x, e.y, 8, COL.shell, 140);
    burst(s, e.x, e.y, 6, COL.gold, 140);
    toast(s, TOAST.shell, 1.1, COL.shell);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
    }
  } else if (isEater(e)) {
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

function spawnEmber(s, x, y, r, hot, inner) {
  const em = {
    x: x, y: y, r: r,
    t: EMBER_T,
    life: EMBER_T,
    hot: !!hot,
    hitEnemies: [],
  };
  if (typeof inner === 'number') em.inner = inner;
  s.embers.push(em);
}

function spawnScorch(s, x, y, r, hot, inner) {
  if (reducedMotion()) return;
  const sc = {
    x: x, y: y, r: r,
    t: SCORCH_T,
    life: SCORCH_T,
    hot: !!hot,
  };
  if (typeof inner === 'number') sc.inner = inner;
  s.scorches.push(sc);
}

function updateScorches(s, dt) {
  for (let i = s.scorches.length - 1; i >= 0; i--) {
    s.scorches[i].t -= dt;
    if (s.scorches[i].t <= 0) s.scorches.splice(i, 1);
  }
}

function hurtEnemyFromEmber(s, e, em) {
  if (e.hp <= 0) return;
  if (isShell(e)) return;
  if (e.hitT > 0) return;
  if (em.hitEnemies.indexOf(e) >= 0) return;
  const dHit = dist(e.x, e.y, em.x, em.y);
  if (typeof em.inner === 'number') {
    if (dHit < em.inner - e.r || dHit > em.r + e.r) return;
  } else if (dHit > em.r + e.r) return;
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
    const pd = dist(p.x, p.y, em.x, em.y);
    const pHurt = (typeof em.inner === 'number')
      ? (pd >= em.inner - p.r && pd <= em.r + p.r)
      : (pd <= em.r + p.r);
    if (pHurt) {
      hurtPlayer(s, em.x, em.y, 'ember');
    }
    for (let j = 0; j < s.enemies.length; j++) {
      hurtEnemyFromEmber(s, s.enemies[j], em);
    }
  }
}

function nearestBait(s, x, y) {
  const baits = s.baits || [];
  let best = null;
  let bd = 1e9;
  for (let i = 0; i < baits.length; i++) {
    const b = baits[i];
    const d = dist(x, y, b.x, b.y);
    if (d <= BAIT_SEE && d < bd) {
      bd = d;
      best = b;
    }
  }
  return best;
}

function updateBaits(s, dt) {
  if (!s.baits || !s.baits.length) return;
  for (let i = s.baits.length - 1; i >= 0; i--) {
    const b = s.baits[i];
    b.t -= dt;
    if (inWater(s, b.x, b.y)) {
      s.baits.splice(i, 1);
      burst(s, b.x, b.y, 4, COL.water, 70);
      continue;
    }
    let touched = false;
    for (let j = 0; j < s.enemies.length; j++) {
      const e = s.enemies[j];
      if (e.hp <= 0) continue;
      if (isHound(e) || isMoth(e) || isEater(e)) continue;
      if (dist(e.x, e.y, b.x, b.y) <= BAIT_HIT + e.r) {
        touched = true;
        break;
      }
    }
    if (touched) {
      s.baits.splice(i, 1);
      if (!reducedMotion()) burst(s, b.x, b.y, 4, COL.bait, 160);
      explode(s, b.x, b.y, false, false, false, { fork: true });
      continue;
    }
    if (b.t <= 0) {
      s.baits.splice(i, 1);
      explode(s, b.x, b.y, false, false, false, { fork: true });
    }
  }
}

function updateBolts(s, dt) {
  if (!s.bolts || !s.bolts.length) return;
  for (let i = s.bolts.length - 1; i >= 0; i--) {
    s.bolts[i].t -= dt;
    if (s.bolts[i].t <= 0) s.bolts.splice(i, 1);
  }
}

function updateBounceArcs(s, dt) {
  if (!s.bounceArcs || !s.bounceArcs.length) return;
  for (let i = s.bounceArcs.length - 1; i >= 0; i--) {
    s.bounceArcs[i].t -= dt;
    if (s.bounceArcs[i].t <= 0) s.bounceArcs.splice(i, 1);
  }
}

function updateTrips(s, dt) {
  if (!s.trips || !s.trips.length) return;
  const pops = [];
  for (let i = s.trips.length - 1; i >= 0; i--) {
    const tr = s.trips[i];
    tr.t -= dt;
    if (tr.t <= 0) {
      s.trips.splice(i, 1);
      continue;
    }
    let hitEnemy = false;
    for (let j = 0; j < s.enemies.length; j++) {
      const e = s.enemies[j];
      if (e.hp <= 0) continue;
      if (dist(e.x, e.y, tr.x, tr.y) <= TRIP_R + (e.r || 0)) {
        hitEnemy = true;
        break;
      }
    }
    const p = s.player;
    const skipSelf = (p.inv > 0) || dashIFrame(p);
    const hitSelf = !hitEnemy && !skipSelf && dist(p.x, p.y, tr.x, tr.y) <= TRIP_R + (p.r || 0);
    if (hitEnemy || hitSelf) {
      s.trips.splice(i, 1);
      pops.push({ x: tr.x, y: tr.y, self: hitSelf });
    }
  }
  for (let i = 0; i < pops.length; i++) {
    const pop = pops[i];
    explode(s, pop.x, pop.y, true, true, false, { fork: true });
    toast(s, pop.self ? TOAST.tripSelf : TOAST.tripPop, 1.1, pop.self ? COL.heart : COL.trip);
    if (!reducedMotion()) {
      punch(s, 10);
      s.hitstop = Math.max(s.hitstop, 0.06);
    }
  }
}

function updateRolls(s, dt) {
  if (!s.rolls || !s.rolls.length) return;
  const fires = [];
  for (let i = s.rolls.length - 1; i >= 0; i--) {
    const r = s.rolls[i];
    r.t -= dt;
    if (r.t <= 0) {
      fires.push(r);
      s.rolls.splice(i, 1);
    }
  }
  fires.reverse();
  for (let i = 0; i < fires.length; i++) {
    const r = fires[i];
    const hx = clamp(r.x, 0, s.roomW || VIEW_W);
    const hy = clamp(r.y, 0, s.roomH || VIEW_H);
    explode(s, hx, hy, true, true, false, { fork: true });
    if (!reducedMotion()) {
      punch(s, 6);
      burst(s, hx, hy, 4, COL.roll, 160);
    }
  }
}

function updateMirrors(s, dt) {
  if (!s.mirrors || !s.mirrors.length) return;
  const fires = [];
  for (let i = s.mirrors.length - 1; i >= 0; i--) {
    const m = s.mirrors[i];
    m.t -= dt;
    if (m.t <= 0) {
      fires.push(m);
      s.mirrors.splice(i, 1);
    }
  }
  fires.reverse();
  for (let i = 0; i < fires.length; i++) {
    const m = fires[i];
    const hx = clamp(m.x, 0, s.roomW || VIEW_W);
    const hy = clamp(m.y, 0, s.roomH || VIEW_H);
    explode(s, hx, hy, true, true, false, { fork: true });
    if (!reducedMotion()) {
      punch(s, 6);
      burst(s, hx, hy, 5, COL.mirror, 160);
    }
  }
}

function updateBoomerFuses(s, dt) {
  if (!s.boomerFuses || !s.boomerFuses.length) return;
  const pops = [];
  for (let i = s.boomerFuses.length - 1; i >= 0; i--) {
    const f = s.boomerFuses[i];
    if (inWater(s, f.x, f.y)) {
      s.boomerFuses.splice(i, 1);
      burst(s, f.x, f.y, 4, COL.water, 70);
      toast(s, TOAST.boomerFizzle, 1.0, COL.water);
      continue;
    }
    f.t -= dt;
    if (f.t <= 0) {
      s.boomerFuses.splice(i, 1);
      pops.push({ x: f.x, y: f.y });
    }
  }
  for (let i = 0; i < pops.length; i++) {
    const pop = pops[i];
    explode(s, pop.x, pop.y, true, true, false, { fork: true });
    toast(s, TOAST.boomerPop, 1.1, COL.boomer);
    if (!reducedMotion()) {
      punch(s, 8);
      burst(s, pop.x, pop.y, 6, COL.boomer, 170);
    }
  }
}

function updateSpins(s, dt) {
  if (!s.spins || !s.spins.length) return;
  const fires = [];
  for (let i = s.spins.length - 1; i >= 0; i--) {
    const p = s.spins[i];
    p.t -= dt;
    if (p.t <= 0) {
      fires.push(p);
      s.spins.splice(i, 1);
    }
  }
  fires.reverse();
  for (let i = 0; i < fires.length; i++) {
    const p = fires[i];
    const hx = clamp(p.x, 0, s.roomW || VIEW_W);
    const hy = clamp(p.y, 0, s.roomH || VIEW_H);
    explode(s, hx, hy, true, true, false, { fork: true });
    if (!reducedMotion()) {
      punch(s, 5);
      burst(s, hx, hy, 4, COL.spin, 160);
    }
  }
}

function updateFans(s, dt) {
  if (!s.fans || !s.fans.length) return;
  const fires = [];
  for (let i = s.fans.length - 1; i >= 0; i--) {
    const p = s.fans[i];
    p.t -= dt;
    if (p.t <= 0) {
      fires.push(p);
      s.fans.splice(i, 1);
    }
  }
  fires.reverse();
  for (let i = 0; i < fires.length; i++) {
    const p = fires[i];
    const hx = clamp(p.x, 0, s.roomW || VIEW_W);
    const hy = clamp(p.y, 0, s.roomH || VIEW_H);
    explode(s, hx, hy, true, true, false, { fork: true });
    if (!reducedMotion()) {
      punch(s, 5);
      burst(s, hx, hy, 5, COL.fan, 160);
    }
  }
}

function drumHurtEnemy(s, e, ox, oy) {
  if (!e || e.hp <= 0) return;
  if (isShell(e)) {
    e.hp -= 1;
    if (!reducedMotion()) {
      burst(s, e.x, e.y, 4, COL.shell, 90);
      burst(s, e.x, e.y, 4, COL.gold, 90);
    }
  } else {
    e.hp -= (isHound(e) || isMoth(e) || isEater(e)) ? 1 : DRUM_DMG;
  }
  e.hitT = 0.18;
  const ang = Math.atan2(e.y - oy, e.x - ox) || 0;
  e.shoveVx = Math.cos(ang) * DRUM_KB;
  e.shoveVy = Math.sin(ang) * DRUM_KB;
  e.shoveT = SHOVE_T;
  if (!reducedMotion()) {
    burst(s, e.x, e.y, 6, COL.drum, 170);
    burst(s, e.x, e.y, 4, COL.gold, 160);
    punch(s, 4);
    s.hitstop = Math.max(s.hitstop, 0.05);
  }
  if (e.hp <= 0) foeDown(s, e);
}

function updateDrums(s, dt) {
  if (!s.drums || !s.drums.length) return;
  for (let i = s.drums.length - 1; i >= 0; i--) {
    const d = s.drums[i];
    if (!d.hit) d.hit = Object.create(null);
    d.r += DRUM_V * dt;
    const band = DRUM_W * 0.5;
    for (let j = 0; j < s.enemies.length; j++) {
      const e = s.enemies[j];
      if (e.hp <= 0) continue;
      const key = String(e.id != null ? e.id : s.enemies.indexOf(e));
      if (d.hit[key]) continue;
      const ed = Math.hypot(e.x - d.x, e.y - d.y);
      if (Math.abs(ed - d.r) <= band + (e.r || ENEMY_R)) {
        d.hit[key] = 1;
        drumHurtEnemy(s, e, d.x, d.y);
      }
    }
    const p = s.player;
    if (p && !d.hitPlayer) {
      const pd = Math.hypot(p.x - d.x, p.y - d.y);
      if (Math.abs(pd - d.r) <= band + (p.r || PLAYER_R)) {
        d.hitPlayer = 1;
        if (!s.won && !s.dead) hurtPlayer(s, d.x, d.y, 'blast');
      }
    }
    if (d.r >= DRUM_R) s.drums.splice(i, 1);
  }
}

function updateDelays(s, dt) {
  if (!s.delays || !s.delays.length) return;
  const pops = [];
  for (let i = s.delays.length - 1; i >= 0; i--) {
    const d = s.delays[i];
    if (inWater(s, d.x, d.y)) {
      s.delays.splice(i, 1);
      burst(s, d.x, d.y, 4, COL.water, 70);
      toast(s, TOAST.delayFizzle, 1.0, COL.water);
      continue;
    }
    d.t -= dt;
    if (d.t <= 0) {
      s.delays.splice(i, 1);
      pops.push({ x: d.x, y: d.y });
    }
  }
  for (let i = 0; i < pops.length; i++) {
    const pop = pops[i];
    explode(s, pop.x, pop.y, true, true, false, { fork: true });
    toast(s, TOAST.delayPop, 1.1, COL.delay);
    if (!reducedMotion()) {
      punch(s, 10);
      s.hitstop = Math.max(s.hitstop, 0.06);
    }
  }
}

function thickInRange(s, x, y, r) {
  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (!c.thick || c.open) continue;
    if (circleRect(x, y, r, c.x, c.y, c.w, c.h)) return true;
  }
  return false;
}

function explode(s, x, y, hot, fused, haste, opts) {
  const echoing = opts === true || (opts && opts.echo) || !!s.echoing;
  const splitting = !!(opts && opts.split) || !!s.splitting;
  const forked = echoing || splitting || !!(opts && opts.fork);
  let seeded = false;
  if (!forked && s.seed && thickInRange(s, x, y, SEED_R)) {
    seeded = true;
    s.seed = 0;
    hot = true;
  }
  const r = seeded ? SEED_R : (hot ? HOT_BLAST_R : BLAST_R);
  let halo = false;
  if (!forked && s.haloReady) {
    s.haloReady = false;
    halo = true;
  }
  let frost = false;
  if (!forked && s.frostReady) {
    s.frostReady = false;
    frost = true;
  }
  let shove = false;
  if (!forked && s.shoveReady) {
    s.shoveReady = false;
    shove = true;
  }
  let baited = false;
  if (!forked && s.baitReady) {
    s.baitReady = false;
    baited = true;
  }
  let bolted = false;
  if (!forked && s.boltReady) {
    s.boltReady = false;
    bolted = true;
  }
  let trippedPlant = false;
  if (!forked && s.tripReady) {
    s.tripReady = false;
    trippedPlant = true;
  }
  let delayPlant = false;
  if (!forked && s.delayReady) {
    s.delayReady = false;
    delayPlant = true;
  }
  let bounce = false;
  if (!forked && s.bounceReady) {
    s.bounceReady = false;
    bounce = true;
  }
  let rolled = false;
  if (!forked && s.rollReady) {
    s.rollReady = false;
    rolled = true;
  }
  let mirrored = false;
  if (!forked && s.mirrorReady) {
    s.mirrorReady = false;
    mirrored = true;
  }
  let spinning = false;
  if (!forked && s.spinReady) {
    s.spinReady = false;
    spinning = true;
  }
  let pooling = false;
  if (!forked && s.poolReady) {
    s.poolReady = false;
    pooling = true;
  }
  let fanning = false;
  if (!forked && s.fanReady) {
    s.fanReady = false;
    fanning = true;
  }
  let drumming = false;
  if (!forked && s.drumReady) {
    s.drumReady = false;
    drumming = true;
  }
  const boomR = halo ? RING_OUT : r;
  s.stats.booms += 1;
  s.lastBoomX = x;
  s.lastBoomY = y;
  s.boomSeekT = MOTH_SEEK_T;
  spawnEmber(s, x, y, boomR, hot, halo ? RING_IN : undefined);
  spawnScorch(s, x, y, boomR, hot, halo ? RING_IN : undefined);
  burst(s, x, y, seeded ? 22 : (hot ? 16 : 10), hot ? COL.gold : COL.ember, hot ? 220 : 170);
  addRing(s, x, y, boomR, hot, haste);
  sfx('boom');

  const p = s.player;
  let hit = false;
  const pd = dist(p.x, p.y, x, y);
  const pHurt = halo
    ? (pd >= RING_IN - p.r && pd <= RING_OUT + p.r)
    : (pd <= r + p.r);
  if (!s.won && !s.dead && pHurt) {
    hurtPlayer(s, x, y, 'blast');
    hit = true;
  }
  if (shove && pHurt && !dashIFrame(p)) {
    const pdShove = dist(p.x, p.y, x, y) || 1;
    p.shoveVx = ((p.x - x) / pdShove) * SHOVE_V;
    p.shoveVy = ((p.y - y) / pdShove) * SHOVE_V;
    p.shoveT = SHOVE_T;
    if (!reducedMotion()) {
      burst(s, p.x, p.y, 6, COL.shove, 170);
      burst(s, p.x, p.y, 4, COL.gold, 160);
    }
  }

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    const ed = dist(e.x, e.y, x, y);
    const eHurt = halo
      ? (ed >= RING_IN - e.r && ed <= RING_OUT + e.r)
      : (ed <= r + e.r);
    if (eHurt) {
      if (isShell(e) && !hot) {
        e.hitT = 0.10;
        const dClang = dist(e.x, e.y, x, y) || 1;
        e.x += ((e.x - x) / dClang) * 10;
        e.y += ((e.y - y) / dClang) * 10;
        if (!reducedMotion()) burst(s, e.x, e.y, 4, COL.shell, 80);
        if ((s.shellClangT || 0) <= 0) {
          toast(s, TOAST.shellClang, 1.0, COL.shell);
          s.shellClangT = 1.6;
        }
        continue;
      }
      if (isShell(e)) {
        e.hp -= 1;
        if (!reducedMotion()) {
          burst(s, e.x, e.y, 4, COL.shell, 90);
          burst(s, e.x, e.y, 4, COL.gold, 90);
          punch(s, 4);
        }
      } else {
        e.hp -= (isHound(e) || isMoth(e) || isEater(e)) ? 1 : (hot ? 2 : 1);
      }
      e.hitT = 0.18;
      const d = dist(e.x, e.y, x, y) || 1;
      e.x += ((e.x - x) / d) * 22;
      e.y += ((e.y - y) / d) * 22;
      s.hitstop = Math.max(s.hitstop, hitstopAmt());
      punch(s, 6);
      hit = true;
      if (frost) {
        e.frostT = FROST_T;
        if (!reducedMotion()) {
          burst(s, e.x, e.y, 6, COL.frost, 170);
          burst(s, e.x, e.y, 4, COL.gold, 160);
        }
      }
      if (shove) {
        const sd = dist(e.x, e.y, x, y) || 1;
        e.shoveVx = ((e.x - x) / sd) * SHOVE_V;
        e.shoveVy = ((e.y - y) / sd) * SHOVE_V;
        e.shoveT = SHOVE_T;
        if (!reducedMotion()) {
          burst(s, e.x, e.y, 6, COL.shove, 170);
          burst(s, e.x, e.y, 4, COL.gold, 160);
        }
      }
      if (e.hp <= 0) foeDown(s, e);
    }
  }

  for (let i = 0; i < s.crates.length; i++) {
    const c = s.crates[i];
    if (c.open) continue;
    if (halo) {
      if (c.thick) continue;
      const cx = c.x + c.w * 0.5;
      const cy = c.y + c.h * 0.5;
      const cd = dist(cx, cy, x, y);
      if (cd >= RING_IN && cd <= RING_OUT) {
        if (openCrate(s, c)) hit = true;
      }
      continue;
    }
    if (c.thick && !seeded) continue;
    if (circleRect(x, y, r, c.x, c.y, c.w, c.h)) {
      if (openCrate(s, c)) hit = true;
    }
  }

  let chained = 0;
  for (let i = 0; i < s.sparks.length; i++) {
    const k = s.sparks[i];
    if (k.dead || k.wet) continue;
    if (k.x === x && k.y === y) continue;
    const kd = dist(k.x, k.y, x, y);
    const kHit = halo ? (kd >= RING_IN && kd <= RING_OUT) : (kd <= r);
    if (kHit) {
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

  if (!forked && s.suckReady) {
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
  if (forked) return;
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
  if (s.splitReady) {
    s.splitReady = false;
    const face = faceUnit(s);
    const fx = face.x;
    const fy = face.y;
    const px = -fy;
    const py = fx;
    const pr = s.player.r || PLAYER_R;
    const splitHot = !!hot;
    if (!s.splits) s.splits = [];
    const a = {
      x: clamp(x + px * SPLIT_D, pr, s.roomW - pr),
      y: clamp(y + py * SPLIT_D, pr, s.roomH - pr),
      hot: splitHot,
      t: SPLIT_T,
      r: splitHot ? HOT_BLAST_R : BLAST_R,
      wait: true,
    };
    const b = {
      x: clamp(x - px * SPLIT_D, pr, s.roomW - pr),
      y: clamp(y - py * SPLIT_D, pr, s.roomH - pr),
      hot: splitHot,
      t: SPLIT_T,
      r: splitHot ? HOT_BLAST_R : BLAST_R,
      wait: true,
    };
    s.splits.push(a);
    s.splits.push(b);
    toast(s, TOAST.splitUse, 1.1, COL.split);
    if (!reducedMotion()) {
      punch(s, 8);
      burst(s, x, y, 8, COL.split, 190);
      burst(s, x, y, 4, COL.gold, 170);
      const markR = SPLIT_D * 0.35;
      s.rings.push({
        x: a.x, y: a.y,
        r0: markR * 0.55,
        r1: markR,
        t: 0,
        grow: 0.02,
        life: 0.14,
        hot: false,
        split: true,
      });
      s.rings.push({
        x: b.x, y: b.y,
        r0: markR * 0.55,
        r1: markR,
        t: 0,
        grow: 0.02,
        life: 0.14,
        hot: false,
        split: true,
      });
    }
  }
  if (s.pierceReady) {
    s.pierceReady = false;
    const face = faceUnit(s);
    const fx = face.x;
    const fy = face.y;
    const halfW = PIERCE_W * 0.5;
    for (let i = 0; i < s.crates.length; i++) {
      const c = s.crates[i];
      if (c.open || c.thick) continue;
      const cx = c.x + c.w * 0.5;
      const cy = c.y + c.h * 0.5;
      const dx = cx - x;
      const dy = cy - y;
      const t = dx * fx + dy * fy;
      if (t < 0 || t > PIERCE_L) continue;
      const perp = Math.abs(dx * fy - dy * fx);
      if (perp > halfW) continue;
      if (openCrate(s, c)) hit = true;
    }
    toast(s, TOAST.pierceUse, 1.1, COL.pierce);
    if (!reducedMotion()) {
      punch(s, 9);
      if (!s.pierces) s.pierces = [];
      s.pierces.push({
        x: x, y: y,
        x2: x + fx * PIERCE_L,
        y2: y + fy * PIERCE_L,
        t: 0.28,
        life: 0.28,
      });
      for (let i = 0; i < 4; i++) {
        const u = (i + 1) / 4;
        burst(s, x + fx * PIERCE_L * u, y + fy * PIERCE_L * u, i % 2 ? 4 : 3, i % 2 ? COL.pierce : COL.gold, 170);
      }
    }
  }
  if (halo) {
    toast(s, TOAST.haloUse, 1.1, COL.halo);
    if (!reducedMotion()) {
      punch(s, 9);
      if (!s.halos) s.halos = [];
      s.halos.push({ x: x, y: y, r: RING_IN, t: 0.28, life: 0.28 });
      s.halos.push({ x: x, y: y, r: RING_OUT, t: 0.28, life: 0.28 });
      const mid = (RING_IN + RING_OUT) * 0.5;
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5;
        burst(s, x + Math.cos(a) * mid, y + Math.sin(a) * mid, i % 2 ? 3 : 2, i % 2 ? COL.halo : COL.gold, 170);
      }
    }
  }
  if (frost) {
    toast(s, TOAST.frostUse, 1.1, COL.frost);
    if (!reducedMotion()) punch(s, 8);
  }
  if (shove) {
    toast(s, TOAST.shoveUse, 1.1, COL.shove);
    if (!reducedMotion()) {
      punch(s, 10);
      s.hitstop = Math.max(s.hitstop, 0.06);
    }
  }
  if (baited) {
    if (!s.baits) s.baits = [];
    s.baits.push({ x: x, y: y, t: BAIT_T });
    toast(s, TOAST.baitUse, 1.1, COL.bait);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
      burst(s, x, y, 8, COL.bait, 190);
      burst(s, x, y, 4, COL.gold, 170);
    }
  }
  if (bolted) {
    const cand = [];
    for (let i = 0; i < s.enemies.length; i++) {
      const e = s.enemies[i];
      if (e.hp <= 0) continue;
      const ed = dist(e.x, e.y, x, y);
      const eHurt = halo
        ? (ed >= RING_IN - e.r && ed <= RING_OUT + e.r)
        : (ed <= r + e.r);
      if (eHurt) continue;
      if (ed > BOLT_R) continue;
      cand.push({ e: e, d: ed });
    }
    cand.sort(function (a, b) { return a.d - b.d; });
    const n = Math.min(BOLT_N, cand.length);
    if (!s.bolts) s.bolts = [];
    for (let i = 0; i < n; i++) {
      const e = cand[i].e;
      if (isShell(e) && !hot) {
        e.hitT = 0.10;
        const dClang = dist(e.x, e.y, x, y) || 1;
        e.x += ((e.x - x) / dClang) * 12;
        e.y += ((e.y - y) / dClang) * 12;
        if (!reducedMotion()) burst(s, e.x, e.y, 4, COL.shell, 80);
        if ((s.shellClangT || 0) <= 0) {
          toast(s, TOAST.shellClang, 1.0, COL.shell);
          s.shellClangT = 1.6;
        }
      } else {
        if (isShell(e)) {
          e.hp -= 1;
          if (!reducedMotion()) {
            burst(s, e.x, e.y, 4, COL.shell, 90);
            burst(s, e.x, e.y, 4, COL.gold, 90);
            punch(s, 4);
          }
        } else {
          e.hp -= 1;
        }
        e.hitT = 0.18;
        const d = dist(e.x, e.y, x, y) || 1;
        e.x += ((e.x - x) / d) * 12;
        e.y += ((e.y - y) / d) * 12;
        if (e.hp <= 0) foeDown(s, e);
      }
      s.bolts.push({ x0: x, y0: y, x1: e.x, y1: e.y, t: 0.22 });
    }
    if (n >= 1) {
      toast(s, TOAST.boltUse, 1.1, COL.bolt);
      burst(s, x, y, 6, COL.bolt, 170);
      if (!reducedMotion()) {
        punch(s, 8);
        s.hitstop = Math.max(s.hitstop, 0.05);
      }
    } else {
      burst(s, x, y, 3, COL.bolt, 80);
    }
  }
  if (trippedPlant) {
    if (!s.trips) s.trips = [];
    s.trips.push({ x: x, y: y, t: TRIP_LIFE });
    toast(s, TOAST.tripPlant, 1.1, COL.trip);
    if (!reducedMotion()) {
      punch(s, 6);
      s.hitstop = Math.max(s.hitstop, 0.04);
      burst(s, x, y, 5, COL.trip, 160);
    }
  }
  if (delayPlant) {
    if (!s.delays) s.delays = [];
    s.delays.push({ x: x, y: y, t: DELAY_T });
    toast(s, TOAST.delayPlant, 1.1, COL.delay);
    if (!reducedMotion()) {
      punch(s, 6);
      s.hitstop = Math.max(s.hitstop, 0.04);
      burst(s, x, y, 5, COL.delay, 160);
    }
  }
  if (bounce) {
    const blastRUsed = halo ? RING_OUT : r;
    const cand = [];
    for (let i = 0; i < s.enemies.length; i++) {
      const e = s.enemies[i];
      if (e.hp <= 0) continue;
      const ed = dist(e.x, e.y, x, y);
      const eHurt = halo
        ? (ed >= RING_IN - e.r && ed <= RING_OUT + e.r)
        : (ed <= r + e.r);
      if (eHurt) continue;
      if (!(ed > blastRUsed && ed <= BOUNCE_R)) continue;
      cand.push({ e: e, d: ed });
    }
    cand.sort(function (a, b) { return a.d - b.d; });
    const n = Math.min(BOUNCE_N, cand.length);
    if (!s.bounceArcs) s.bounceArcs = [];
    for (let i = 0; i < n; i++) {
      const e = cand[i].e;
      if (!reducedMotion()) {
        s.bounceArcs.push({ x1: x, y1: y, x2: e.x, y2: e.y, t: 0.18 });
        burst(s, e.x, e.y, 4, COL.bounce, 160);
      }
      explode(s, e.x, e.y, true, true, false, { fork: true });
    }
    if (n >= 1) {
      toast(s, TOAST.bounceUse, 1.1, COL.bounce);
      if (!reducedMotion()) {
        punch(s, 10);
        s.hitstop = Math.max(s.hitstop, 0.06);
      }
    }
  }
  if (rolled) {
    const face = faceUnit(s);
    if (!s.rolls) s.rolls = [];
    for (let i = 1; i <= ROLL_N; i++) {
      s.rolls.push({
        x: x + face.x * ROLL_GAP * i,
        y: y + face.y * ROLL_GAP * i,
        t: ROLL_DT * i,
        ox: x,
        oy: y,
      });
    }
    toast(s, TOAST.rollUse, 1.1, COL.roll);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
      burst(s, x + face.x * ROLL_GAP, y + face.y * ROLL_GAP, 5, COL.roll, 170);
    }
  }
  if (mirrored) {
    const mx = clamp(mirrorX(s, x), 0, s.roomW || VIEW_W);
    const my = clamp(y, 0, s.roomH || VIEW_H);
    if (!s.mirrors) s.mirrors = [];
    s.mirrors.push({ x: mx, y: my, t: MIRROR_DT, ox: x, oy: y });
    toast(s, TOAST.mirrorUse, 1.1, COL.mirror);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
      burst(s, mx, my, 5, COL.mirror, 170);
    }
  }
  if (spinning) {
    if (!s.spins) s.spins = [];
    for (let i = 0; i < SPIN_N; i++) {
      const ang = -Math.PI / 2 + i * (Math.PI * 2 / SPIN_N);
      const sx = clamp(x + Math.cos(ang) * SPIN_R, 0, s.roomW || VIEW_W);
      const sy = clamp(y + Math.sin(ang) * SPIN_R, 0, s.roomH || VIEW_H);
      s.spins.push({ x: sx, y: sy, t: SPIN_DT * (i + 1), ox: x, oy: y, i: i });
    }
    toast(s, TOAST.spinUse, 1.1, COL.spin);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
      burst(s, x, y, 4, COL.spin, 170);
    }
  }
  if (pooling) {
    if (!s.waters) s.waters = [];
    s.waters.push({
      x: x - POOL_R,
      y: y - POOL_R,
      w: POOL_R * 2,
      h: POOL_R * 2,
      tide: false,
      temp: true,
      life: POOL_LIFE,
    });
    toast(s, TOAST.poolUse, 1.1, COL.pool);
    burst(s, x, y, 6, COL.pool, 170);
    burst(s, x, y, 4, COL.water, 140);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
    }
  }
  if (fanning) {
    const face = faceUnit(s);
    const base = Math.atan2(face.y, face.x);
    if (!s.fans) s.fans = [];
    const offsets = [-FAN_A, 0, FAN_A];
    for (let k = 0; k < FAN_N; k++) {
      const ang = base + offsets[k];
      const fx = clamp(x + Math.cos(ang) * FAN_D, 0, s.roomW || VIEW_W);
      const fy = clamp(y + Math.sin(ang) * FAN_D, 0, s.roomH || VIEW_H);
      s.fans.push({ x: fx, y: fy, t: FAN_DT * (k + 1), ox: x, oy: y, i: k });
    }
    toast(s, TOAST.fanUse, 1.1, COL.fan);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
      burst(s, x, y, 6, COL.fan, 170);
      burst(s, x, y, 4, COL.gold, 160);
    }
  }
  if (drumming) {
    if (!s.drums) s.drums = [];
    s.drums.push({ x: x, y: y, r: BLAST_R, hit: Object.create(null) });
    toast(s, TOAST.drumUse, 1.1, COL.drum);
    burst(s, x, y, 6, COL.gold, 170);
    burst(s, x, y, 4, COL.haste, 160);
    if (!reducedMotion()) {
      punch(s, 8);
      s.hitstop = Math.max(s.hitstop, 0.05);
    }
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

function updateSplits(s, dt) {
  if (!s.splits || !s.splits.length) return;
  let announced = false;
  for (let i = s.splits.length - 1; i >= 0; i--) {
    const e = s.splits[i];
    if (e.wait) {
      e.wait = false;
      continue;
    }
    e.t -= dt;
    if (e.t > 0) continue;
    s.splits.splice(i, 1);
    s.splitting = true;
    explode(s, e.x, e.y, e.hot);
    s.splitting = false;
    if (!announced) {
      toast(s, TOAST.splitBoom, 1.1, COL.split);
      announced = true;
    }
  }
}

function updateRings(s, dt) {
  for (let i = s.rings.length - 1; i >= 0; i--) {
    s.rings[i].t += dt;
    if (s.rings[i].t >= s.rings[i].life) s.rings.splice(i, 1);
  }
}

function updatePierces(s, dt) {
  if (!s.pierces || !s.pierces.length) return;
  for (let i = s.pierces.length - 1; i >= 0; i--) {
    s.pierces[i].t -= dt;
    if (s.pierces[i].t <= 0) s.pierces.splice(i, 1);
  }
}

function updateHalos(s, dt) {
  if (!s.halos || !s.halos.length) return;
  for (let i = s.halos.length - 1; i >= 0; i--) {
    s.halos[i].t -= dt;
    if (s.halos[i].t <= 0) s.halos.splice(i, 1);
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
  const fuses = s.boomerFuses || [];
  for (let i = 0; i < fuses.length; i++) {
    const f = fuses[i];
    if (!(f.t < 0.40)) continue;
    const r = HOT_BLAST_R + pad;
    const d = dist(x, y, f.x, f.y);
    if (d < r && d < nd) {
      nd = d;
      near = f;
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
  let dashBoomIt = null;
  let splitIt = null;
  let pierceIt = null;
  let haloIt = null;
  let frostIt = null;
  let shoveIt = null;
  let baitIt = null;
  let boltIt = null;
  let tripIt = null;
  let delayIt = null;
  let bounceIt = null;
  let rollIt = null;
  let mirrorIt = null;
  let spinIt = null;
  let poolIt = null;
  let fanIt = null;
  let drumIt = null;
  for (let i = 0; i < s.items.length; i++) {
    const it = s.items[i];
    if (it.taken) continue;
    if (it.kind === 'core') core = it;
    if (it.kind === 'seed') seedIt = it;
    if (it.kind === 'haste') hasteIt = it;
    if (it.kind === 'echo') echoIt = it;
    if (it.kind === 'suck') suckIt = it;
    if (it.kind === 'dashboom') dashBoomIt = it;
    if (it.kind === 'split') splitIt = it;
    if (it.kind === 'pierce') pierceIt = it;
    if (it.kind === 'halo') haloIt = it;
    if (it.kind === 'frost') frostIt = it;
    if (it.kind === 'shove') shoveIt = it;
    if (it.kind === 'bait') baitIt = it;
    if (it.kind === 'bolt') boltIt = it;
    if (it.kind === 'trip') tripIt = it;
    if (it.kind === 'delay') delayIt = it;
    if (it.kind === 'bounce') bounceIt = it;
    if (it.kind === 'roll') rollIt = it;
    if (it.kind === 'mirror') mirrorIt = it;
    if (it.kind === 'spin') spinIt = it;
    if (it.kind === 'pool') poolIt = it;
    if (it.kind === 'fan') fanIt = it;
    if (it.kind === 'drum') drumIt = it;
  }
  const grab = core || (!s.seed && seedIt) || (!s.hasteReady && hasteIt) || (!s.echoReady && echoIt) || (!s.suckReady && suckIt) || (!s.dashBoomReady && dashBoomIt) || (!s.splitReady && splitIt) || (!s.pierceReady && pierceIt) || (!s.haloReady && haloIt) || (!s.frostReady && frostIt) || (!s.shoveReady && shoveIt) || (!s.baitReady && baitIt) || (!s.boltReady && boltIt) || (!s.tripReady && tripIt) || (!s.delayReady && delayIt) || (!s.bounceReady && bounceIt) || (!s.rollReady && rollIt) || (!s.mirrorReady && mirrorIt) || (!s.spinReady && spinIt) || (!s.poolReady && poolIt) || (!s.fanReady && fanIt) || (!s.drumReady && drumIt);

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
  } else if (!s.dashBoomReady && dashBoomIt) {
    tx = dashBoomIt.x - p.x;
    ty = dashBoomIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.splitReady && splitIt) {
    tx = splitIt.x - p.x;
    ty = splitIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.pierceReady && pierceIt) {
    tx = pierceIt.x - p.x;
    ty = pierceIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.haloReady && haloIt) {
    tx = haloIt.x - p.x;
    ty = haloIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.frostReady && frostIt) {
    tx = frostIt.x - p.x;
    ty = frostIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.shoveReady && shoveIt) {
    tx = shoveIt.x - p.x;
    ty = shoveIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.baitReady && baitIt) {
    tx = baitIt.x - p.x;
    ty = baitIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.boltReady && boltIt) {
    tx = boltIt.x - p.x;
    ty = boltIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.tripReady && tripIt) {
    tx = tripIt.x - p.x;
    ty = tripIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.delayReady && delayIt) {
    tx = delayIt.x - p.x;
    ty = delayIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.bounceReady && bounceIt) {
    tx = bounceIt.x - p.x;
    ty = bounceIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.rollReady && rollIt) {
    tx = rollIt.x - p.x;
    ty = rollIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.mirrorReady && mirrorIt) {
    tx = mirrorIt.x - p.x;
    ty = mirrorIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.spinReady && spinIt) {
    tx = spinIt.x - p.x;
    ty = spinIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.poolReady && poolIt) {
    tx = poolIt.x - p.x;
    ty = poolIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.fanReady && fanIt) {
    tx = fanIt.x - p.x;
    ty = fanIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (!s.drumReady && drumIt) {
    tx = drumIt.x - p.x;
    ty = drumIt.y - p.y;
    if (threat && p.dashT <= 0 && p.dashCd <= 0) dash = true;
  } else if (guard && isShell(guard)) {
    tx = guard.x - p.x;
    ty = guard.y - p.y;
    if (p.dashT <= 0 && p.dashCd <= 0) dash = true;
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

  if (!dash && s.dashBoomReady && p.dashT <= 0 && p.dashCd <= 0) {
    for (let i = 0; i < s.sparks.length; i++) {
      const k = s.sparks[i];
      if (k.dead || k.wet) continue;
      dash = true;
      break;
    }
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
  if (s.shellClangT > 0) s.shellClangT -= dt;
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
  updatePools(s, dt);
  updateRings(s, dt);
  updatePierces(s, dt);
  updateHalos(s, dt);
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
    updateSplits(s, dt);
    updateEmbers(s, dt, false);
    updateBaits(s, dt);
    updateBolts(s, dt);
    updateBounceArcs(s, dt);
    updateTrips(s, dt);
    updateDelays(s, dt);
    updateRolls(s, dt);
    updateMirrors(s, dt);
    updateSpins(s, dt);
    updateFans(s, dt);
    updateDrums(s, dt);
    updateBoomerFuses(s, dt);
    if (s.pendingNext <= 0) goNext(s);
    return;
  }

  if (s.won || s.dead) {
    updateSparks(s, dt);
    updateEchoes(s, dt);
    updateSplits(s, dt);
    updateEmbers(s, dt, false);
    updateBaits(s, dt);
    updateBolts(s, dt);
    updateBounceArcs(s, dt);
    updateTrips(s, dt);
    updateDelays(s, dt);
    updateRolls(s, dt);
    updateMirrors(s, dt);
    updateSpins(s, dt);
    updateFans(s, dt);
    updateDrums(s, dt);
    updateBoomerFuses(s, dt);
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
    if (s.dashBoomReady) {
      s.dashBoomReady = false;
      let fused = 0;
      for (let i = 0; i < s.sparks.length; i++) {
        const k = s.sparks[i];
        if (k.dead || k.wet) continue;
        k.t = Math.min(k.t, CHAIN_T);
        k.fuse = true;
        fused += 1;
      }
      if (fused >= 1) {
        toast(s, TOAST.dashBoomUse, 1.1, COL.dashBoom);
        if (!reducedMotion()) {
          punch(s, 8);
          burst(s, p.x, p.y, 8, COL.dashBoom, 190);
          burst(s, p.x, p.y, 4, COL.gold, 170);
          s.rings.push({
            x: p.x, y: p.y,
            r0: 90 * 0.55,
            r1: 90,
            t: 0,
            grow: 0.02,
            life: 0.14,
            hot: false,
            dashBoom: true,
          });
        }
      }
    }
  }

  const shoving = (p.shoveT || 0) > 0;
  const shoveMove = shoving && Math.hypot(p.shoveVx || 0, p.shoveVy || 0) > 1;
  const moving = p.dashT > 0 || il > 0.12 || shoveMove;
  const hot = p.dashT > 0;
  if (p.dashT > 0) {
    p.dashT -= dt;
    p.vx = p.faceX * DASH_SPEED;
    p.vy = p.faceY * DASH_SPEED;
  } else if (shoving) {
    p.vx = p.shoveVx;
    p.vy = p.shoveVy;
  } else {
    p.vx = ix * PLAYER_SPEED;
    p.vy = iy * PLAYER_SPEED;
  }
  if (shoving) p.shoveT -= dt;

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
  updateSplits(s, dt);
  updateEmbers(s, dt, true);
  updateBaits(s, dt);
  updateBolts(s, dt);
  updateBounceArcs(s, dt);
  updateTrips(s, dt);
  updateDelays(s, dt);
  updateRolls(s, dt);
  updateMirrors(s, dt);
  updateSpins(s, dt);
  updateFans(s, dt);
  updateDrums(s, dt);
  updateBoomerFuses(s, dt);

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    if (e.hitT > 0) e.hitT -= dt;
    if (e.frostT > 0) e.frostT -= dt;
    if (e.shoveT > 0) {
      e.x += e.shoveVx * dt;
      e.y += e.shoveVy * dt;
      e.shoveT -= dt;
      if (!reducedMotion() && Math.random() < dt * 10) {
        burst(s, e.x + (Math.random() - 0.5) * 8, e.y + (Math.random() - 0.5) * 8, 1, COL.shove, 50);
      }
    } else if (!(e.frostT > 0)) {
      if (isHound(e)) updateHound(s, e, dt);
      else if (isMoth(e)) updateMoth(s, e, dt);
      else if (isEater(e)) updateEater(s, e, dt);
      else {
        const bait = nearestBait(s, e.x, e.y);
        const tx = bait ? bait.x : p.x;
        const ty = bait ? bait.y : p.y;
        const d = dist(e.x, e.y, tx, ty) || 1;
        e.x += ((tx - e.x) / d) * ENEMY_SPEED * dt;
        e.y += ((ty - e.y) / d) * ENEMY_SPEED * dt;
      }
    } else if (!reducedMotion() && Math.random() < dt * 6) {
      burst(s, e.x + (Math.random() - 0.5) * 10, e.y - 6 - Math.random() * 8, 1, COL.frost, 40);
    }
    resolveCrates(s, e);
    e.x = clamp(e.x, e.r, rw - e.r);
    e.y = clamp(e.y, e.r, rh - e.r);
    if (!(e.frostT > 0) && !(e.shoveT > 0) && dist(e.x, e.y, p.x, p.y) < e.r + p.r - 1) hurtPlayer(s, e.x, e.y, 'bump');
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
    } else if (it.kind === 'dashboom') {
      s.dashBoomReady = true;
      toast(s, TOAST.dashBoomGet, 1.1, COL.dashBoom);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.dashBoom, 110);
      punch(s, 3);
    } else if (it.kind === 'split') {
      s.splitReady = true;
      toast(s, TOAST.splitGet, 1.1, COL.split);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.split, 110);
      punch(s, 3);
    } else if (it.kind === 'pierce') {
      s.pierceReady = true;
      toast(s, TOAST.pierceGet, 1.1, COL.pierce);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.pierce, 110);
      punch(s, 3);
    } else if (it.kind === 'halo') {
      s.haloReady = true;
      toast(s, TOAST.haloGet, 1.1, COL.halo);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.halo, 110);
      punch(s, 3);
    } else if (it.kind === 'frost') {
      s.frostReady = true;
      toast(s, TOAST.frostGet, 1.1, COL.frost);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.frost, 110);
      punch(s, 3);
    } else if (it.kind === 'shove') {
      s.shoveReady = true;
      toast(s, TOAST.shoveGet, 1.1, COL.shove);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.shove, 110);
      punch(s, 3);
    } else if (it.kind === 'bait') {
      s.baitReady = true;
      toast(s, TOAST.baitGet, 1.1, COL.bait);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.bait, 110);
      punch(s, 3);
    } else if (it.kind === 'bolt') {
      s.boltReady = true;
      toast(s, TOAST.boltGet, 1.1, COL.bolt);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.bolt, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'trip') {
      s.tripReady = true;
      toast(s, TOAST.tripGet, 1.1, COL.trip);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.trip, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'delay') {
      s.delayReady = true;
      toast(s, TOAST.delayGet, 1.1, COL.delay);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.delay, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'bounce') {
      s.bounceReady = true;
      toast(s, TOAST.bounceGet, 1.1, COL.bounce);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.bounce, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'roll') {
      s.rollReady = true;
      toast(s, TOAST.rollGet, 1.1, COL.roll);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.roll, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'mirror') {
      s.mirrorReady = true;
      toast(s, TOAST.mirrorGet, 1.1, COL.mirror);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.mirror, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'spin') {
      s.spinReady = true;
      toast(s, TOAST.spinGet, 1.1, COL.spin);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.spin, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'pool') {
      s.poolReady = true;
      toast(s, TOAST.poolGet, 1.1, COL.pool);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.pool, 130);
      burst(s, it.x, it.y, 4, COL.water, 110);
      punch(s, 3);
    } else if (it.kind === 'fan') {
      s.fanReady = true;
      toast(s, TOAST.fanGet, 1.1, COL.fan);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.fan, 130);
      burst(s, it.x, it.y, 4, COL.gold, 110);
      punch(s, 3);
    } else if (it.kind === 'drum') {
      s.drumReady = true;
      toast(s, TOAST.drumGet, 1.1, COL.drum);
      sfx('pickup');
      burst(s, it.x, it.y, 6, COL.gold, 130);
      burst(s, it.x, it.y, 4, COL.haste, 110);
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
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    if (w.temp) {
      const rgb = hexRgb(COL.pool);
      let a = 0.35;
      if (!reducedMotion()) {
        a = 0.28 + 0.12 * (0.5 + 0.5 * Math.sin((s.time || 0) * 3.4 + i));
      }
      ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')';
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.save();
      ctx.strokeStyle = COL.pool;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.8 / fit.scale;
      ctx.setLineDash([6 / fit.scale, 5 / fit.scale]);
      ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
      ctx.restore();
      ctx.fillStyle = COL.pool;
      ctx.fillText(NAMES.poolPad, w.x + w.w * 0.5, w.y + w.h * 0.5 + 4);
      continue;
    }
    const tide = !!w.tide;
    const wet = !tide || high;
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
    if (typeof sc.inner === 'number' && sc.inner > 2) {
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, sc.inner * (0.9 + 0.04 * k), 0, Math.PI * 2);
      ctx.stroke();
    }
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

  for (let i = 0; i < (s.splits || []).length; i++) {
    const e = s.splits[i];
    const rad = e.r || (e.hot ? HOT_BLAST_R : BLAST_R);
    let a = 0.4;
    if (!reducedMotion()) {
      a = 0.28 + 0.18 * (0.5 + 0.5 * Math.sin((s.time || 0) * 8));
    }
    ctx.globalAlpha = a;
    ctx.strokeStyle = COL.split;
    ctx.lineWidth = 2 / fit.scale;
    ctx.beginPath();
    ctx.arc(e.x, e.y, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = COL.split;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(NAMES.split, e.x, e.y + rad + 12);
  }

  for (let i = 0; i < (s.pierces || []).length; i++) {
    const beam = s.pierces[i];
    const k = clamp(beam.t / (beam.life || 0.28), 0, 1);
    ctx.globalAlpha = 0.28 + 0.55 * k;
    ctx.strokeStyle = COL.pierce;
    ctx.lineCap = 'round';
    ctx.lineWidth = (5.5 + 3.5 * k) / fit.scale;
    ctx.beginPath();
    ctx.moveTo(beam.x, beam.y);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    ctx.globalAlpha = 0.16 * k;
    ctx.lineWidth = (PIERCE_W * 0.42) / fit.scale;
    ctx.beginPath();
    ctx.moveTo(beam.x, beam.y);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    glow(ctx, beam.x, beam.y, 14 * k, COL.pierce, 0.45 * k);
    glow(ctx, beam.x2, beam.y2, 12 * k, COL.gold, 0.4 * k);
  }

  for (let i = 0; i < (s.halos || []).length; i++) {
    const haloFx = s.halos[i];
    const k = clamp(haloFx.t / (haloFx.life || 0.28), 0, 1);
    ctx.globalAlpha = 0.28 + 0.55 * k;
    ctx.strokeStyle = COL.halo;
    ctx.lineWidth = (4.2 + 2.4 * k) / fit.scale;
    ctx.beginPath();
    ctx.arc(haloFx.x, haloFx.y, haloFx.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    glow(ctx, haloFx.x, haloFx.y, 10 * k, COL.halo, 0.22 * k);
  }

  for (let i = 0; i < s.rings.length; i++) {
    const ring = s.rings[i];
    let rad;
    let col;
    let a;
    if (ring.t < ring.grow) {
      rad = lerp(ring.r0, ring.r1, ring.t / ring.grow);
      col = ring.split ? COL.split : (ring.dashBoom ? COL.dashBoom : (ring.suck ? COL.suck : COL.ember));
      a = 0.85;
    } else {
      const k = (ring.t - ring.grow) / (ring.life - ring.grow);
      rad = lerp(ring.r1, 0, k);
      col = ring.split ? COL.split : (ring.dashBoom ? COL.dashBoom : (ring.suck ? COL.suck : COL.gold));
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
    if (typeof em.inner === 'number' && em.inner > 2) {
      ctx.beginPath();
      ctx.arc(em.x, em.y, em.inner * (0.88 + 0.12 * k), 0, Math.PI * 2);
      ctx.stroke();
    }
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
    } else if (it.kind === 'dashboom') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.dashBoom, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.dashBoom;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.dashBoom;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.dashBoom, it.x, it.y - 16);
    } else if (it.kind === 'split') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.split, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.split;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.split;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.split, it.x, it.y - 16);
    } else if (it.kind === 'pierce') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.pierce, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.pierce;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.pierce;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.pierce, it.x, it.y - 16);
    } else if (it.kind === 'halo') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.halo, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.halo;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.halo;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.halo, it.x, it.y - 16);
    } else if (it.kind === 'frost') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.frost, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.frost;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.frost;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.frost, it.x, it.y - 16);
    } else if (it.kind === 'shove') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.shove, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.shove;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.shove;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.shove, it.x, it.y - 16);
    } else if (it.kind === 'bait') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.bait, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.bait;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.bait;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.bait, it.x, it.y - 16);
    } else if (it.kind === 'bolt') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.bolt, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.bolt;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.bolt;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.bolt, it.x, it.y - 16);
    } else if (it.kind === 'trip') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.trip, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.trip;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.trip;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.trip, it.x, it.y - 16);
    } else if (it.kind === 'delay') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.delay, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.delay;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.delay;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.delay, it.x, it.y - 16);
    } else if (it.kind === 'bounce') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.bounce, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.bounce;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.bounce;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.bounce, it.x, it.y - 16);
    } else if (it.kind === 'roll') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.roll, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.roll;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.roll;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.roll, it.x, it.y - 16);
    } else if (it.kind === 'mirror') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.mirror, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.mirror;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.mirror;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.mirror, it.x, it.y - 16);
    } else if (it.kind === 'spin') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.spin, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.spin;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.spin;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.spin, it.x, it.y - 16);
    } else if (it.kind === 'pool') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.pool, 0.7);
      glow(ctx, it.x, it.y, 8, COL.water, 0.35);
      ctx.fillStyle = COL.pool;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.water;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.pool;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.pool, it.x, it.y - 16);
    } else if (it.kind === 'fan') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.fan, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.fan;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.fan;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.fan, it.x, it.y - 16);
    } else if (it.kind === 'drum') {
      glow(ctx, it.x, it.y, 18 * pulse, COL.drum, 0.7);
      glow(ctx, it.x, it.y, 8, COL.gold, 0.35);
      ctx.fillStyle = COL.drum;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.haste;
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.drum;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.drum, it.x, it.y - 16);
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

  for (let i = 0; i < (s.baits || []).length; i++) {
    const b = s.baits[i];
    const life = clamp(b.t / BAIT_T, 0, 1);
    const pulse = reducedMotion() ? 1 : 0.88 + 0.18 * (0.5 + 0.5 * Math.sin((s.time || 0) * 8));
    glow(ctx, b.x, b.y, (BAIT_R + 10) * pulse, COL.bait, reducedMotion() ? 0.28 : 0.22 + 0.28 * life);
    ctx.globalAlpha = reducedMotion() ? 0.7 : 0.4 + 0.4 * life;
    ctx.strokeStyle = COL.bait;
    ctx.lineWidth = 2 / fit.scale;
    ctx.beginPath();
    ctx.arc(b.x, b.y, BAIT_R * pulse * (0.7 + 0.35 * life), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = COL.bait;
    ctx.beginPath();
    ctx.arc(b.x, b.y, BAIT_R * (reducedMotion() ? 0.72 : 0.62 * pulse), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COL.gold;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COL.bait;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('诱', b.x, b.y - BAIT_R - 6);
  }

  for (let i = 0; i < (s.bolts || []).length; i++) {
    const b = s.bolts[i];
    const k = clamp(b.t / 0.22, 0, 1);
    const dx = b.x1 - b.x0;
    const dy = b.y1 - b.y0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = COL.bolt;
    if (reducedMotion()) {
      ctx.globalAlpha = 0.55 + 0.35 * k;
      ctx.lineWidth = 1.4 / fit.scale;
      ctx.beginPath();
      ctx.moveTo(b.x0, b.y0);
      ctx.lineTo(b.x1, b.y1);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const seed = b.x0 * 0.013 + b.y0 * 0.021 + b.x1 * 0.017 + b.y1 * 0.011;
      ctx.globalAlpha = 0.35 + 0.55 * k;
      ctx.lineWidth = (2.4 + 1.2 * k) / fit.scale;
      ctx.beginPath();
      ctx.moveTo(b.x0, b.y0);
      const mids = 3;
      for (let j = 1; j <= mids; j++) {
        const t = j / (mids + 1);
        const jog = Math.sin(seed + j * 2.7) * 12;
        ctx.lineTo(b.x0 + dx * t + nx * jog, b.y0 + dy * t + ny * jog);
      }
      ctx.lineTo(b.x1, b.y1);
      ctx.stroke();
      ctx.globalAlpha = 0.2 * k;
      ctx.lineWidth = (6 * k) / fit.scale;
      ctx.beginPath();
      ctx.moveTo(b.x0, b.y0);
      ctx.lineTo(b.x1, b.y1);
      ctx.stroke();
      ctx.globalAlpha = 1;
      glow(ctx, b.x0, b.y0, 12 * k, COL.bolt, 0.4 * k);
      glow(ctx, b.x1, b.y1, 10 * k, COL.gold, 0.32 * k);
    }
  }

  for (let i = 0; i < (s.bounceArcs || []).length; i++) {
    const b = s.bounceArcs[i];
    const k = clamp(b.t / 0.18, 0, 1);
    const dx = b.x2 - b.x1;
    const dy = b.y2 - b.y1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = COL.bounce;
    if (reducedMotion()) {
      ctx.globalAlpha = 0.55 + 0.35 * k;
      ctx.lineWidth = 1.4 / fit.scale;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const seed = b.x1 * 0.013 + b.y1 * 0.021 + b.x2 * 0.017 + b.y2 * 0.011;
      ctx.globalAlpha = 0.35 + 0.55 * k;
      ctx.lineWidth = (2.4 + 1.2 * k) / fit.scale;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      const mids = 3;
      for (let j = 1; j <= mids; j++) {
        const t = j / (mids + 1);
        const jog = Math.sin(seed + j * 2.7) * 10;
        ctx.lineTo(b.x1 + dx * t + nx * jog, b.y1 + dy * t + ny * jog);
      }
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.globalAlpha = 0.2 * k;
      ctx.lineWidth = (6 * k) / fit.scale;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      glow(ctx, b.x1, b.y1, 12 * k, COL.bounce, 0.4 * k);
      glow(ctx, b.x2, b.y2, 10 * k, COL.gold, 0.32 * k);
    }
  }

  for (let i = 0; i < (s.trips || []).length; i++) {
    const tr = s.trips[i];
    const fade = tr.t < 1.5 ? clamp(tr.t / 1.5, 0, 1) : 1;
    const pulse = reducedMotion() ? 1 : 0.88 + 0.16 * (0.5 + 0.5 * Math.sin((s.time || 0) * 5.6));
    const rad = TRIP_R * pulse;
    glow(ctx, tr.x, tr.y, rad + 8, COL.trip, reducedMotion() ? 0.28 * fade : 0.18 + 0.22 * fade);
    ctx.globalAlpha = reducedMotion() ? 0.75 * fade : 0.45 + 0.4 * fade;
    ctx.strokeStyle = COL.trip;
    ctx.lineWidth = 1.8 / fit.scale;
    if (reducedMotion()) {
      ctx.setLineDash([]);
    } else {
      ctx.setLineDash([4 / fit.scale, 3.2 / fit.scale]);
    }
    ctx.beginPath();
    ctx.arc(tr.x, tr.y, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(tr.x - 6, tr.y);
    ctx.lineTo(tr.x + 6, tr.y);
    ctx.moveTo(tr.x, tr.y - 6);
    ctx.lineTo(tr.x, tr.y + 6);
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (reducedMotion()) {
      ctx.fillStyle = COL.trip;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, 4.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = COL.trip;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, 3.1 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = COL.trip;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.globalAlpha = fade;
    ctx.fillText('绊', tr.x, tr.y - TRIP_R - 5);
    ctx.globalAlpha = 1;
  }

  for (let i = 0; i < (s.delays || []).length; i++) {
    const dly = s.delays[i];
    const life = clamp(dly.t / DELAY_T, 0, 1);
    const pulse = reducedMotion() ? 1 : 0.9 + 0.14 * (0.5 + 0.5 * Math.sin((s.time || 0) * 7.2));
    const rad = DELAY_R * pulse;
    glow(ctx, dly.x, dly.y, rad + 8, COL.delay, reducedMotion() ? 0.3 : 0.2 + 0.28 * life);
    ctx.fillStyle = COL.delay;
    ctx.globalAlpha = reducedMotion() ? 0.72 : 0.42 + 0.38 * life;
    ctx.beginPath();
    ctx.arc(dly.x, dly.y, rad * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = COL.delay;
    ctx.lineWidth = 2.4 / fit.scale;
    ctx.beginPath();
    if (reducedMotion()) {
      ctx.arc(dly.x, dly.y, rad, 0, Math.PI * 2);
    } else {
      ctx.arc(dly.x, dly.y, rad, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * life);
    }
    ctx.stroke();
    ctx.fillStyle = COL.gold;
    ctx.beginPath();
    ctx.arc(dly.x, dly.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COL.delay;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('迟', dly.x, dly.y - DELAY_R - 5);
  }

  if (!reducedMotion() && s.rolls && s.rolls.length) {
    const last = s.rolls[s.rolls.length - 1];
    const ox = last.ox == null ? last.x : last.ox;
    const oy = last.oy == null ? last.y : last.oy;
    ctx.strokeStyle = COL.roll;
    ctx.globalAlpha = 0.28;
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.6 / fit.scale;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    for (let i = 0; i < s.rolls.length; i++) {
      const r = s.rolls[i];
      const pulse = 0.88 + 0.16 * (0.5 + 0.5 * Math.sin((s.time || 0) * 8 + i));
      const rad = 8 * pulse;
      glow(ctx, r.x, r.y, rad + 6, COL.roll, 0.35);
      ctx.fillStyle = COL.roll;
      ctx.beginPath();
      ctx.arc(r.x, r.y, rad * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.roll;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('卷', r.x, r.y - 12);
    }
  }

  if (!reducedMotion() && s.mirrors && s.mirrors.length) {
    for (let i = 0; i < s.mirrors.length; i++) {
      const m = s.mirrors[i];
      const ox = m.ox == null ? m.x : m.ox;
      const oy = m.oy == null ? m.y : m.oy;
      ctx.strokeStyle = COL.mirror;
      ctx.globalAlpha = 0.28;
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.6 / fit.scale;
      ctx.setLineDash([6 / fit.scale, 5 / fit.scale]);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      const pulse = 0.88 + 0.16 * (0.5 + 0.5 * Math.sin((s.time || 0) * 8 + i));
      const rad = 9 * pulse;
      glow(ctx, m.x, m.y, rad + 6, COL.mirror, 0.35);
      ctx.fillStyle = COL.mirror;
      ctx.beginPath();
      ctx.arc(m.x, m.y, rad * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.mirror;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('镜', m.x, m.y - 12);
    }
  }

  if (!reducedMotion() && s.spins && s.spins.length) {
    const plant = s.spins[0];
    const ox = plant.ox == null ? plant.x : plant.ox;
    const oy = plant.oy == null ? plant.y : plant.oy;
    ctx.strokeStyle = COL.spin;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 1.4 / fit.scale;
    ctx.setLineDash([6 / fit.scale, 5 / fit.scale]);
    ctx.beginPath();
    ctx.arc(ox, oy, SPIN_R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    for (let i = 0; i < s.spins.length; i++) {
      const p = s.spins[i];
      const px = p.ox == null ? ox : p.ox;
      const py = p.oy == null ? oy : p.oy;
      ctx.strokeStyle = COL.spin;
      ctx.globalAlpha = 0.28;
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.6 / fit.scale;
      ctx.setLineDash([6 / fit.scale, 5 / fit.scale]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      const pulse = 0.88 + 0.16 * (0.5 + 0.5 * Math.sin((s.time || 0) * 8 + i));
      const rad = 8 * pulse;
      glow(ctx, p.x, p.y, rad + 6, COL.spin, 0.35);
      ctx.fillStyle = COL.spin;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.spin;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('旋', p.x, p.y - 12);
    }
  }

  if (s.fans && s.fans.length) {
    for (let i = 0; i < s.fans.length; i++) {
      const p = s.fans[i];
      const ox = p.ox == null ? p.x : p.ox;
      const oy = p.oy == null ? p.y : p.oy;
      ctx.strokeStyle = COL.fan;
      ctx.globalAlpha = reducedMotion() ? 0.38 : 0.28;
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.6 / fit.scale;
      ctx.setLineDash([6 / fit.scale, 5 / fit.scale]);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      const pulse = reducedMotion() ? 1 : 0.88 + 0.16 * (0.5 + 0.5 * Math.sin((s.time || 0) * 8 + i));
      const rad = 8 * pulse;
      if (!reducedMotion()) glow(ctx, p.x, p.y, rad + 6, COL.fan, 0.35);
      ctx.fillStyle = COL.fan;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.gold;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL.fan;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('扇', p.x, p.y - 12);
    }
  }

  if (s.drums && s.drums.length) {
    for (let i = 0; i < s.drums.length; i++) {
      const d = s.drums[i];
      const rad = Math.max(2, d.r || 0);
      if (!reducedMotion()) glow(ctx, d.x, d.y, rad + DRUM_W, COL.drum, 0.22);
      ctx.strokeStyle = COL.drum;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = Math.max(1.6, DRUM_W * 0.45) / fit.scale;
      ctx.beginPath();
      ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.28;
      ctx.lineWidth = (DRUM_W * 0.9) / fit.scale;
      ctx.beginPath();
      ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (!reducedMotion()) {
        for (let k = 0; k < 8; k++) {
          const a = (Math.PI * 2 * k) / 8 + (s.time || 0) * 0.6;
          const px = d.x + Math.cos(a) * rad;
          const py = d.y + Math.sin(a) * rad;
          ctx.fillStyle = k % 2 ? COL.gold : COL.haste;
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  for (let i = 0; i < (s.boomerFuses || []).length; i++) {
    const fu = s.boomerFuses[i];
    const life = clamp(fu.t / BOOMER_T, 0, 1);
    const grown = 1 - life;
    const pulse = reducedMotion() ? 1 : 0.9 + 0.14 * (0.5 + 0.5 * Math.sin((s.time || 0) * 9));
    const rad = 9 * pulse;
    glow(ctx, fu.x, fu.y, rad + 8, COL.boomer, reducedMotion() ? 0.28 : 0.2 + 0.32 * grown);
    ctx.fillStyle = COL.boomer;
    ctx.globalAlpha = reducedMotion() ? 0.82 : 0.5 + 0.4 * pulse;
    ctx.beginPath();
    ctx.arc(fu.x, fu.y, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = COL.boomer;
    ctx.lineWidth = 1.8 / fit.scale;
    if (reducedMotion()) {
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(fu.x, fu.y, rad, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const ringR = 10 + grown * (HOT_BLAST_R - 10);
      ctx.setLineDash([5 / fit.scale, 4 / fit.scale]);
      ctx.beginPath();
      ctx.arc(fu.x, fu.y, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = COL.gold;
    ctx.beginPath();
    ctx.arc(fu.x, fu.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COL.boomer;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('爆', fu.x, fu.y - 14);
  }

  for (let i = 0; i < s.enemies.length; i++) {
    const e = s.enemies[i];
    if (e.hp <= 0) continue;
    const flash = e.hitT > 0;
    if (e.frostT > 0) {
      glow(ctx, e.x, e.y, e.r + 12, COL.frost, reducedMotion() ? 0.1 : 0.38);
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = COL.frost;
      ctx.lineWidth = 1.8 / fit.scale;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (e.shoveT > 0) {
      const sl = Math.hypot(e.shoveVx || 0, e.shoveVy || 0) || 1;
      const bx = e.x - (e.shoveVx / sl) * 18;
      const by = e.y - (e.shoveVy / sl) * 18;
      glow(ctx, e.x, e.y, e.r + 10, COL.shove, reducedMotion() ? 0.1 : 0.36);
      ctx.globalAlpha = reducedMotion() ? 0.22 : 0.7;
      ctx.strokeStyle = COL.shove;
      ctx.lineWidth = 2.4 / fit.scale;
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.globalAlpha = reducedMotion() ? 0.15 : 0.4;
      ctx.lineWidth = 4.2 / fit.scale;
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(e.x - (e.shoveVx / sl) * 10, e.y - (e.shoveVy / sl) * 10);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
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
    if (isShell(e)) {
      const pulse = reducedMotion() ? 1 : (0.92 + 0.08 * Math.sin(s.time * 6 + e.x * 0.02));
      glow(ctx, e.x, e.y, 22 * pulse, COL.shell, reducedMotion() ? 0.16 : 0.24);
      ctx.beginPath();
      ctx.fillStyle = flash ? COL.gold : '#5a3a18';
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = flash ? COL.gold : COL.shell;
      ctx.lineWidth = 3.4 / fit.scale;
      ctx.stroke();
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.strokeStyle = flash ? COL.gold : '#8a6a3a';
      ctx.lineWidth = 1.7 / fit.scale;
      for (let t = 0; t < 4; t++) {
        const a = (t / 4) * Math.PI * 2 + 0.35;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (e.r - 6.5), Math.sin(a) * (e.r - 6.5));
        ctx.lineTo(Math.cos(a) * (e.r - 1.2), Math.sin(a) * (e.r - 1.2));
        ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = COL.shell;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.shell, e.x, e.y + e.r + 12);
      for (let h = 0; h < SHELL_HP; h++) {
        ctx.fillStyle = h < e.hp ? COL.shell : 'rgba(196,160,106,0.2)';
        ctx.fillRect(e.x - 9 + h * 10, e.y + e.r + 14, 8, 3);
      }
      continue;
    }
    if (isBoomer(e)) {
      const pulse = reducedMotion() ? 1 : (0.9 + 0.1 * Math.sin(s.time * 8 + e.x * 0.02));
      glow(ctx, e.x, e.y, 22 * pulse, COL.boomer, reducedMotion() ? 0.16 : 0.28);
      ctx.beginPath();
      ctx.fillStyle = flash ? COL.gold : '#3a4a10';
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = flash ? COL.gold : COL.boomer;
      ctx.lineWidth = 2.4 / fit.scale;
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = flash ? COL.gold : mixHex('#2a1410', COL.boomer, 0.55);
      ctx.arc(e.x, e.y, e.r * 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = flash ? COL.gold : '#8aaa20';
      ctx.lineWidth = 1.3 / fit.scale;
      ctx.beginPath();
      ctx.moveTo(e.x - 4, e.y - 2);
      ctx.lineTo(e.x + 1, e.y + 3);
      ctx.lineTo(e.x + 4, e.y - 1);
      ctx.stroke();
      if (!reducedMotion()) {
        const flick = 0.5 + 0.5 * Math.sin(s.time * 18);
        glow(ctx, e.x, e.y - e.r - 2, 6, COL.boomer, 0.4 * flick);
        ctx.beginPath();
        ctx.fillStyle = flash ? COL.gold : COL.boomer;
        ctx.arc(e.x, e.y - e.r - 1, 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.fillStyle = COL.boomer;
        ctx.arc(e.x, e.y - e.r - 1, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = COL.boomer;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(NAMES.boomer, e.x, e.y + e.r + 12);
      ctx.fillStyle = e.hp > 0 ? COL.boomer : 'rgba(212,255,50,0.2)';
      ctx.fillRect(e.x - 4, e.y + e.r + 14, 8, 3);
      continue;
    }
    const iced = e.frostT > 0;
    const flying = e.shoveT > 0;
    if (iced) glow(ctx, e.x, e.y, 26, COL.frost, reducedMotion() ? 0.12 : 0.42);
    glow(ctx, e.x, e.y, 22, flying ? COL.shove : (iced ? COL.frost : COL.ember), flying ? 0.32 : (iced ? 0.28 : 0.18));
    ctx.beginPath();
    ctx.fillStyle = flash ? COL.gold : (flying ? mixHex('#2a1410', COL.shove, 0.45) : (iced ? mixHex('#2a1410', COL.frost, 0.55) : '#2a1410'));
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = flying ? COL.shove : (iced ? COL.frost : COL.ember);
    ctx.lineWidth = (flying || iced ? 2.6 : 2) / fit.scale;
    ctx.stroke();
    if (iced && !flying) {
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.strokeStyle = COL.frost;
      ctx.lineWidth = 1.4 / fit.scale;
      ctx.arc(e.x, e.y, e.r + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
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
  if (s.dashBoomReady) {
    let dx;
    let dy;
    if (reducedMotion()) {
      dx = p.x + 12;
      dy = p.y;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7;
      dx = p.x + Math.cos(a) * 16;
      dy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, dx, dy, 8, COL.dashBoom, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.dashBoom;
    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(dx, dy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.splitReady) {
    let lx;
    let ly;
    if (reducedMotion()) {
      lx = p.x - 12;
      ly = p.y;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2;
      lx = p.x + Math.cos(a) * 16;
      ly = p.y + Math.sin(a) * 16;
    }
    glow(ctx, lx, ly, 8, COL.split, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.split;
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(lx, ly, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.pierceReady) {
    let gx;
    let gy;
    if (reducedMotion()) {
      gx = p.x + 12;
      gy = p.y - 10;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35;
      gx = p.x + Math.cos(a) * 16;
      gy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, gx, gy, 8, COL.pierce, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.pierce;
    ctx.arc(gx, gy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(gx, gy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.haloReady) {
    let hx;
    let hy;
    if (reducedMotion()) {
      hx = p.x + 12;
      hy = p.y + 10;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55;
      hx = p.x + Math.cos(a) * 16;
      hy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, hx, hy, 8, COL.halo, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.halo;
    ctx.arc(hx, hy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.frostReady) {
    let fx;
    let fy;
    if (reducedMotion()) {
      fx = p.x - 12;
      fy = p.y + 10;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7;
      fx = p.x + Math.cos(a) * 16;
      fy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, fx, fy, 8, COL.frost, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.frost;
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(fx, fy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.shoveReady) {
    let ux;
    let uy;
    if (reducedMotion()) {
      ux = p.x + 10;
      uy = p.y + 12;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9;
      ux = p.x + Math.cos(a) * 16;
      uy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, ux, uy, 8, COL.shove, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.shove;
    ctx.arc(ux, uy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(ux, uy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.baitReady) {
    let bx;
    let by;
    if (reducedMotion()) {
      bx = p.x - 10;
      by = p.y + 12;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1;
      bx = p.x + Math.cos(a) * 16;
      by = p.y + Math.sin(a) * 16;
    }
    glow(ctx, bx, by, 8, COL.bait, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.bait;
    ctx.arc(bx, by, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.boltReady) {
    let lx;
    let ly;
    if (reducedMotion()) {
      lx = p.x + 12;
      ly = p.y - 10;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3;
      lx = p.x + Math.cos(a) * 16;
      ly = p.y + Math.sin(a) * 16;
    }
    glow(ctx, lx, ly, 8, COL.bolt, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.bolt;
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(lx, ly, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.tripReady) {
    let rx;
    let ry;
    if (reducedMotion()) {
      rx = p.x - 12;
      ry = p.y - 12;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5;
      rx = p.x + Math.cos(a) * 16;
      ry = p.y + Math.sin(a) * 16;
    }
    glow(ctx, rx, ry, 8, COL.trip, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.trip;
    ctx.arc(rx, ry, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(rx, ry, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.delayReady) {
    let dx;
    let dy;
    if (reducedMotion()) {
      dx = p.x + 12;
      dy = p.y + 12;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7;
      dx = p.x + Math.cos(a) * 16;
      dy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, dx, dy, 8, COL.delay, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.delay;
    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(dx, dy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.bounceReady) {
    let nx;
    let ny;
    if (reducedMotion()) {
      nx = p.x - 14;
      ny = p.y + 4;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7 + Math.PI * 1.95;
      nx = p.x + Math.cos(a) * 16;
      ny = p.y + Math.sin(a) * 16;
    }
    glow(ctx, nx, ny, 8, COL.bounce, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.bounce;
    ctx.arc(nx, ny, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(nx, ny, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.rollReady) {
    let rx;
    let ry;
    if (reducedMotion()) {
      rx = p.x + 14;
      ry = p.y + 4;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7 + Math.PI * 1.95 + Math.PI * 2.15;
      rx = p.x + Math.cos(a) * 16;
      ry = p.y + Math.sin(a) * 16;
    }
    glow(ctx, rx, ry, 8, COL.roll, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.roll;
    ctx.arc(rx, ry, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(rx, ry, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.mirrorReady) {
    let mx;
    let my;
    if (reducedMotion()) {
      mx = p.x - 4;
      my = p.y - 14;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7 + Math.PI * 1.95 + Math.PI * 2.15 + Math.PI * 2.4;
      mx = p.x + Math.cos(a) * 16;
      my = p.y + Math.sin(a) * 16;
    }
    glow(ctx, mx, my, 8, COL.mirror, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.mirror;
    ctx.arc(mx, my, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(mx, my, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.spinReady) {
    let sx;
    let sy;
    if (reducedMotion()) {
      sx = p.x + 4;
      sy = p.y - 14;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7 + Math.PI * 1.95 + Math.PI * 2.15 + Math.PI * 2.4 + Math.PI * 2.65;
      sx = p.x + Math.cos(a) * 16;
      sy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, sx, sy, 8, COL.spin, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.spin;
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.poolReady) {
    let px;
    let py;
    if (reducedMotion()) {
      px = p.x - 14;
      py = p.y - 4;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7 + Math.PI * 1.95 + Math.PI * 2.15 + Math.PI * 2.4 + Math.PI * 2.65 + Math.PI * 2.9;
      px = p.x + Math.cos(a) * 16;
      py = p.y + Math.sin(a) * 16;
    }
    glow(ctx, px, py, 8, COL.pool, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.pool;
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.water;
    ctx.arc(px, py, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.fanReady) {
    let fx;
    let fy;
    if (reducedMotion()) {
      fx = p.x + 14;
      fy = p.y + 4;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7 + Math.PI * 1.95 + Math.PI * 2.15 + Math.PI * 2.4 + Math.PI * 2.65 + Math.PI * 2.9 + Math.PI * 3.15;
      fx = p.x + Math.cos(a) * 16;
      fy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, fx, fy, 8, COL.fan, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.fan;
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.gold;
    ctx.arc(fx, fy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (s.drumReady) {
    let dx;
    let dy;
    if (reducedMotion()) {
      dx = p.x - 4;
      dy = p.y + 14;
    } else {
      const a = s.time * 5.2 + Math.PI * 1.7 + Math.PI * 0.2 + Math.PI * 0.35 + Math.PI * 0.55 + Math.PI * 0.7 + Math.PI * 0.9 + Math.PI * 1.1 + Math.PI * 1.3 + Math.PI * 1.5 + Math.PI * 1.7 + Math.PI * 1.95 + Math.PI * 2.15 + Math.PI * 2.4 + Math.PI * 2.65 + Math.PI * 2.9 + Math.PI * 3.15 + Math.PI * 3.4;
      dx = p.x + Math.cos(a) * 16;
      dy = p.y + Math.sin(a) * 16;
    }
    glow(ctx, dx, dy, 8, COL.drum, 0.55);
    ctx.beginPath();
    ctx.fillStyle = COL.drum;
    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = COL.haste;
    ctx.arc(dx, dy, 1.4, 0, Math.PI * 2);
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
      if (e.shiftKey) {
        clearProgress();
        resetRoom(s, 0, false);
        toast(s, TOAST.home, 1.2, COL.gold);
      } else {
        resetRoom(s, s.roomIndex, false);
        toast(s, TOAST.again, 1.1, COL.gold);
      }
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
  const dashBoomEl = (typeof document !== 'undefined') ? document.getElementById('dashboom') : null;
  if (dashBoomEl) {
    dashBoomEl.textContent = s.dashBoomReady ? NAMES.dashBoom : '';
  } else if (suckEl && s.dashBoomReady && !s.suckReady) {
    suckEl.textContent = NAMES.dashBoom;
  }
  const splitEl = (typeof document !== 'undefined') ? document.getElementById('split') : null;
  if (splitEl) {
    splitEl.textContent = s.splitReady ? NAMES.split : '';
  } else if (dashBoomEl && s.splitReady && !s.dashBoomReady) {
    dashBoomEl.textContent = NAMES.split;
  }
  const pierceEl = (typeof document !== 'undefined') ? document.getElementById('pierce') : null;
  if (pierceEl) {
    pierceEl.textContent = s.pierceReady ? NAMES.pierce : '';
  } else if (splitEl && s.pierceReady && !s.splitReady) {
    splitEl.textContent = NAMES.pierce;
  }
  const haloEl = (typeof document !== 'undefined') ? document.getElementById('halo') : null;
  if (haloEl) {
    haloEl.textContent = s.haloReady ? NAMES.halo : '';
  } else if (pierceEl && s.haloReady && !s.pierceReady) {
    pierceEl.textContent = NAMES.halo;
  }
  const frostEl = (typeof document !== 'undefined') ? document.getElementById('frost') : null;
  if (frostEl) {
    frostEl.textContent = s.frostReady ? NAMES.frost : '';
  } else if (haloEl && s.frostReady && !s.haloReady) {
    haloEl.textContent = NAMES.frost;
  }
  const shoveEl = (typeof document !== 'undefined') ? document.getElementById('shove') : null;
  if (shoveEl) {
    shoveEl.textContent = s.shoveReady ? NAMES.shove : '';
  } else if (frostEl && s.shoveReady && !s.frostReady) {
    frostEl.textContent = NAMES.shove;
  }
  const baitEl = (typeof document !== 'undefined') ? document.getElementById('bait') : null;
  if (baitEl) {
    baitEl.textContent = s.baitReady ? NAMES.bait : '';
  } else if (shoveEl && s.baitReady && !s.shoveReady) {
    shoveEl.textContent = NAMES.bait;
  }
  const boltEl = (typeof document !== 'undefined') ? document.getElementById('bolt') : null;
  if (boltEl) {
    boltEl.textContent = s.boltReady ? NAMES.bolt : '';
  } else if (baitEl && s.boltReady && !s.baitReady) {
    baitEl.textContent = NAMES.bolt;
  } else if (shoveEl && s.boltReady && !s.shoveReady) {
    shoveEl.textContent = NAMES.bolt;
  }
  const tripEl = (typeof document !== 'undefined') ? document.getElementById('trip') : null;
  if (tripEl) {
    tripEl.textContent = s.tripReady ? NAMES.trip : '';
  } else if (boltEl && s.tripReady && !s.boltReady) {
    boltEl.textContent = NAMES.trip;
  } else if (baitEl && s.tripReady && !s.baitReady) {
    baitEl.textContent = NAMES.trip;
  } else if (shoveEl && s.tripReady && !s.shoveReady) {
    shoveEl.textContent = NAMES.trip;
  }
  const delayEl = (typeof document !== 'undefined') ? document.getElementById('delay') : null;
  if (delayEl) {
    delayEl.textContent = s.delayReady ? NAMES.delay : '';
  } else if (tripEl && s.delayReady && !s.tripReady) {
    tripEl.textContent = NAMES.delay;
  } else if (boltEl && s.delayReady && !s.boltReady) {
    boltEl.textContent = NAMES.delay;
  } else if (baitEl && s.delayReady && !s.baitReady) {
    baitEl.textContent = NAMES.delay;
  }
  const bounceEl = (typeof document !== 'undefined') ? document.getElementById('bounce') : null;
  if (bounceEl) {
    bounceEl.textContent = s.bounceReady ? NAMES.bounce : '';
  } else if (delayEl && s.bounceReady && !s.delayReady) {
    delayEl.textContent = NAMES.bounce;
  } else if (tripEl && s.bounceReady && !s.tripReady) {
    tripEl.textContent = NAMES.bounce;
  } else if (boltEl && s.bounceReady && !s.boltReady) {
    boltEl.textContent = NAMES.bounce;
  }
  const rollEl = (typeof document !== 'undefined') ? document.getElementById('roll') : null;
  if (rollEl) {
    rollEl.textContent = s.rollReady ? NAMES.roll : '';
  } else if (bounceEl && s.rollReady && !s.bounceReady) {
    bounceEl.textContent = NAMES.roll;
  } else if (delayEl && s.rollReady && !s.delayReady) {
    delayEl.textContent = NAMES.roll;
  }
  const mirrorEl = (typeof document !== 'undefined') ? document.getElementById('mirror') : null;
  if (mirrorEl) {
    mirrorEl.textContent = s.mirrorReady ? NAMES.mirror : '';
  } else if (rollEl && s.mirrorReady && !s.rollReady) {
    rollEl.textContent = NAMES.mirror;
  } else if (bounceEl && s.mirrorReady && !s.bounceReady) {
    bounceEl.textContent = NAMES.mirror;
  } else if (delayEl && s.mirrorReady && !s.delayReady) {
    delayEl.textContent = NAMES.mirror;
  }
  const spinEl = (typeof document !== 'undefined') ? document.getElementById('spin') : null;
  if (spinEl) {
    spinEl.textContent = s.spinReady ? NAMES.spin : '';
  } else if (mirrorEl && s.spinReady && !s.mirrorReady) {
    mirrorEl.textContent = NAMES.spin;
  } else if (rollEl && s.spinReady && !s.rollReady) {
    rollEl.textContent = NAMES.spin;
  } else if (bounceEl && s.spinReady && !s.bounceReady) {
    bounceEl.textContent = NAMES.spin;
  } else if (delayEl && s.spinReady && !s.delayReady) {
    delayEl.textContent = NAMES.spin;
  }
  const poolEl = (typeof document !== 'undefined') ? document.getElementById('pool') : null;
  if (poolEl) {
    poolEl.textContent = s.poolReady ? NAMES.pool : '';
  } else if (spinEl && s.poolReady && !s.spinReady) {
    spinEl.textContent = NAMES.pool;
  } else if (mirrorEl && s.poolReady && !s.mirrorReady) {
    mirrorEl.textContent = NAMES.pool;
  } else if (rollEl && s.poolReady && !s.rollReady) {
    rollEl.textContent = NAMES.pool;
  } else if (bounceEl && s.poolReady && !s.bounceReady) {
    bounceEl.textContent = NAMES.pool;
  }
  const fanEl = (typeof document !== 'undefined') ? document.getElementById('fan') : null;
  if (fanEl) {
    fanEl.textContent = s.fanReady ? NAMES.fan : '';
  } else if (poolEl && s.fanReady && !s.poolReady) {
    poolEl.textContent = NAMES.fan;
  } else if (spinEl && s.fanReady && !s.spinReady) {
    spinEl.textContent = NAMES.fan;
  } else if (mirrorEl && s.fanReady && !s.mirrorReady) {
    mirrorEl.textContent = NAMES.fan;
  } else if (rollEl && s.fanReady && !s.rollReady) {
    rollEl.textContent = NAMES.fan;
  }
  const drumEl = (typeof document !== 'undefined') ? document.getElementById('drum') : null;
  if (drumEl) {
    drumEl.textContent = s.drumReady ? NAMES.drum : '';
  } else if (fanEl && s.drumReady && !s.fanReady) {
    fanEl.textContent = NAMES.drum;
  } else if (poolEl && s.drumReady && !s.poolReady) {
    poolEl.textContent = NAMES.drum;
  } else if (spinEl && s.drumReady && !s.spinReady) {
    spinEl.textContent = NAMES.drum;
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
    s.persist = true;
    const prog = loadProgress();
    resetRoom(s, prog.room, false);
    if (prog.room > 0) toast(s, TOAST.cont + ' · ' + (s.roomName || ''), 1.5, COL.gold);
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
  if (SPLIT_T !== 0.28) throw new Error('SPLIT_T 0.28');
  if (SPLIT_D !== 80) throw new Error('SPLIT_D 80');
  if (PIERCE_L !== 200) throw new Error('PIERCE_L 200');
  if (PIERCE_W !== 40) throw new Error('PIERCE_W 40');
  if (RING_IN !== 40) throw new Error('RING_IN 40');
  if (RING_OUT !== 80) throw new Error('RING_OUT 80');
  if (FROST_T !== 1.8) throw new Error('FROST_T 1.8');
  if (SHOVE_V !== 280) throw new Error('SHOVE_V 280');
  if (SHOVE_T !== 0.40) throw new Error('SHOVE_T 0.40');
  if (BAIT_T !== 2.0) throw new Error('BAIT_T 2.0');
  if (BAIT_SEE !== 240) throw new Error('BAIT_SEE 240');
  if (BAIT_R !== 11) throw new Error('BAIT_R 11');
  if (BAIT_HIT !== 16) throw new Error('BAIT_HIT 16');
  if (BOLT_R !== 170) throw new Error('BOLT_R 170');
  if (BOLT_N !== 3) throw new Error('BOLT_N 3');
  if (TRIP_R !== 16) throw new Error('TRIP_R 16');
  if (TRIP_LIFE !== 12) throw new Error('TRIP_LIFE 12');
  if (DELAY_T !== 1.2) throw new Error('DELAY_T 1.2');
  if (DELAY_R !== 14) throw new Error('DELAY_R 14');
  if (BOUNCE_R !== 150) throw new Error('BOUNCE_R 150');
  if (BOUNCE_N !== 2) throw new Error('BOUNCE_N 2');
  if (ROLL_N !== 3) throw new Error('ROLL_N 3');
  if (ROLL_GAP !== 90) throw new Error('ROLL_GAP 90');
  if (ROLL_DT !== 0.16) throw new Error('ROLL_DT 0.16');
  if (MIRROR_DT !== 0.14) throw new Error('MIRROR_DT 0.14');
  if (SPIN_N !== 4) throw new Error('SPIN_N 4');
  if (SPIN_R !== 90) throw new Error('SPIN_R 90');
  if (SPIN_DT !== 0.14) throw new Error('SPIN_DT 0.14');
  if (POOL_R !== 52) throw new Error('POOL_R 52');
  if (POOL_LIFE !== 5.0) throw new Error('POOL_LIFE 5.0');
  if (FAN_N !== 3) throw new Error('FAN_N 3');
  if (FAN_D !== 96) throw new Error('FAN_D 96');
  if (Math.abs(FAN_A - Math.PI / 6) >= 1e-6) throw new Error('FAN_A pi/6');
  if (FAN_DT !== 0.12) throw new Error('FAN_DT 0.12');
  if (DRUM_R !== 150) throw new Error('DRUM_R 150');
  if (DRUM_V !== 320) throw new Error('DRUM_V 320');
  if (DRUM_W !== 20) throw new Error('DRUM_W 20');
  if (DRUM_DMG !== 2) throw new Error('DRUM_DMG 2');
  if (DRUM_KB !== 220) throw new Error('DRUM_KB 220');
  if (EMBER_T !== 0.55) throw new Error('EMBER_T 0.55');
  if (SCORCH_T !== 1.2) throw new Error('焦痕 1.2s');
  if (!ROOMS || ROOMS.length !== 39) throw new Error('need 39 rooms, got ' + (ROOMS ? ROOMS.length : 0));
  const want = ['空场', '追者', '水巷', '箱巷', '夹道', '夜市', '循径', '双刃', '回廊', '灯巷', '灰径', '环行', '密线', '潮廊', '种廊', '油廊', '急廊', '拾廊', '响廊', '吸廊', '冲廊', '裂廊', '贯廊', '晕廊', '冻廊', '推廊', '诱廊', '壳廊', '雷廊', '绊廊', '迟廊', '跳廊', '卷廊', '镜廊', '旋廊', '爆廊', '洼廊', '扇廊', '鼓廊'];
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
  if (ROOMS[20].id !== 'chonglang') throw new Error('冲廊 id');
  if (ROOMS[20].name !== '冲廊') throw new Error('room 21 冲廊');
  if (ROOMS[21].id !== 'lielang') throw new Error('裂廊 id');
  if (ROOMS[21].name !== '裂廊') throw new Error('room 22 裂廊');
  if (ROOMS[22].id !== 'guanlang') throw new Error('贯廊 id');
  if (ROOMS[22].name !== '贯廊') throw new Error('room 23 贯廊');
  if (ROOMS[23].id !== 'yunlang') throw new Error('晕廊 id');
  if (ROOMS[23].name !== '晕廊') throw new Error('room 24 晕廊');
  if (ROOMS[24].id !== 'donglang') throw new Error('冻廊 id');
  if (ROOMS[24].name !== '冻廊') throw new Error('room 25 冻廊');
  if (ROOMS[25].id !== 'tuilang') throw new Error('推廊 id');
  if (ROOMS[25].name !== '推廊') throw new Error('room 26 推廊');
  if (ROOMS[26].id !== 'yinlang') throw new Error('诱廊 id');
  if (ROOMS[26].name !== '诱廊') throw new Error('room 27 诱廊');
  if (ROOMS[27].id !== 'qiaolang') throw new Error('壳廊 id');
  if (ROOMS[27].name !== '壳廊') throw new Error('room 28 壳廊');
  if (ROOMS[28].id !== 'leilang') throw new Error('雷廊 id');
  if (ROOMS[28].name !== '雷廊') throw new Error('room 29 雷廊');
  if (ROOMS[29].id !== 'banlang') throw new Error('绊廊 id');
  if (ROOMS[29].name !== '绊廊') throw new Error('room 30 绊廊');
  if (ROOMS[30].id !== 'chilang') throw new Error('迟廊 id');
  if (ROOMS[30].name !== '迟廊') throw new Error('room 31 迟廊');
  if (ROOMS[31].id !== 'tiaolang') throw new Error('跳廊 id');
  if (ROOMS[31].name !== '跳廊') throw new Error('room 32 跳廊');
  if (ROOMS[32].id !== 'juanlang') throw new Error('卷廊 id');
  if (ROOMS[32].name !== '卷廊') throw new Error('room 33 卷廊');
  if (ROOMS[33].id !== 'jinglang') throw new Error('镜廊 id');
  if (ROOMS[33].name !== '镜廊') throw new Error('room 34 镜廊');
  if (ROOMS[34].id !== 'xuanlang') throw new Error('旋廊 id');
  if (ROOMS[34].name !== '旋廊') throw new Error('room 35 旋廊');
  if (ROOMS[35].id !== 'baolang') throw new Error('爆廊 id');
  if (ROOMS[35].name !== '爆廊') throw new Error('room 36 爆廊');
  if (ROOMS[36].id !== 'walang') throw new Error('洼廊 id');
  if (ROOMS[36].name !== '洼廊') throw new Error('room 37 洼廊');
  if (ROOMS[37].id !== 'shanlang') throw new Error('扇廊 id');
  if (ROOMS[37].name !== '扇廊') throw new Error('room 38 扇廊');
  if (ROOMS[38].id !== 'gulang') throw new Error('鼓廊 id');
  if (ROOMS[38].name !== '鼓廊') throw new Error('room 39 鼓廊');
  if (NAMES.delay !== '迟爆') throw new Error('NAMES.delay');
  if (COL.delay !== '#ff9a4a') throw new Error('COL.delay');
  if (NAMES.bounce !== '跳爆') throw new Error('NAMES.bounce');
  if (COL.bounce !== '#ff4ad2') throw new Error('COL.bounce');
  if (NAMES.roll !== '卷爆') throw new Error('NAMES.roll');
  if (COL.roll !== '#c86aff') throw new Error('COL.roll');
  if (NAMES.mirror !== '镜爆') throw new Error('NAMES.mirror');
  if (COL.mirror !== '#6affc2') throw new Error('COL.mirror');
  if (lootKind('镜爆') !== 'mirror' || lootKind('mirror') !== 'mirror') throw new Error('lootKind 镜爆');
  if (NAMES.spin !== '旋爆') throw new Error('NAMES.spin');
  if (COL.spin !== '#ff9a4a') throw new Error('COL.spin');
  if (lootKind('旋爆') !== 'spin' || lootKind('spin') !== 'spin') throw new Error('lootKind 旋爆');
  if (NAMES.pool !== '洼爆') throw new Error('NAMES.pool');
  if (NAMES.poolPad !== '临洼') throw new Error('NAMES.poolPad');
  if (COL.pool !== '#4ec4ff') throw new Error('COL.pool');
  if (lootKind('洼爆') !== 'pool' || lootKind('pool') !== 'pool') throw new Error('lootKind 洼爆');
  if (NAMES.fan !== '扇爆') throw new Error('NAMES.fan');
  if (COL.fan !== '#ff7a54') throw new Error('COL.fan');
  if (lootKind('扇爆') !== 'fan' || lootKind('fan') !== 'fan') throw new Error('lootKind 扇爆');
  if (NAMES.drum !== '鼓爆') throw new Error('NAMES.drum');
  if (COL.drum !== '#ffd24a') throw new Error('COL.drum');
  if (lootKind('鼓爆') !== 'drum' || lootKind('drum') !== 'drum') throw new Error('lootKind 鼓爆');
  if (SHELL_HP !== 2) throw new Error('SHELL_HP 2');
  if (SHELL_R !== 14) throw new Error('SHELL_R 14');
  if (NAMES.shell !== '壳卫') throw new Error('壳卫 name');
  if (COL.shell !== '#c4a06a') throw new Error('COL.shell');
  if (BOOMER_HP !== 1) throw new Error('BOOMER_HP 1');
  if (BOOMER_R !== 13) throw new Error('BOOMER_R 13');
  if (BOOMER_T !== 0.80) throw new Error('BOOMER_T 0.80');
  if (NAMES.boomer !== '爆卫') throw new Error('爆卫 name');
  if (COL.boomer !== '#d4ff32') throw new Error('COL.boomer');
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

  const need = ['尾火', '烬卫', '箱', '心核', '回星', '水洼', '油渍', '潮涌', '焰辙', '循辙', '灯蛾', '余烬', '焦痕', '观摩', '焰种', '急燃', '拾烬', '回爆', '吸爆', '冲爆', '裂爆', '贯爆', '环爆', '霜爆', '推爆', '诱爆', '雷爆', '绊爆', '迟爆', '跳爆', '卷爆', '镜爆', '旋爆', '洼爆', '临洼', '扇爆', '鼓爆', '壳卫', '爆卫'];
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
  if (NAMES.shell !== '壳卫') throw new Error('壳卫 name');
  if (TOAST.shell !== '壳卫倒了') throw new Error('壳卫倒了');
  if (TOAST.shellClang !== '壳挡了') throw new Error('壳挡了');
  if (TOAST.shellRoom !== '烫爆才破壳') throw new Error('烫爆才破壳');
  if (COL.shell !== '#c4a06a') throw new Error('COL.shell');
  if (SHELL_HP !== 2) throw new Error('壳卫 2 HP');
  if (SHELL_R !== 14) throw new Error('SHELL_R');
  if (NAMES.boomer !== '爆卫') throw new Error('爆卫 name');
  if (TOAST.boomer !== '爆卫倒了') throw new Error('爆卫倒了');
  if (TOAST.boomerPop !== '爆卫炸了') throw new Error('爆卫炸了');
  if (TOAST.boomerFizzle !== '爆线熄了') throw new Error('爆线熄了');
  if (TOAST.boomerRoom !== '倒了还会炸') throw new Error('倒了还会炸');
  if (COL.boomer !== '#d4ff32') throw new Error('COL.boomer');
  if (BOOMER_HP !== 1) throw new Error('爆卫 1 HP');
  if (BOOMER_R !== 13) throw new Error('BOOMER_R');
  if (BOOMER_T !== 0.80) throw new Error('BOOMER_T');
  if (typeof isBoomer !== 'function') throw new Error('isBoomer');

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
  let shellN = 0;
  let boomerN = 0;
  for (let r = 0; r < ROOMS.length; r++) {
    const ens = ROOMS[r].enemies || [];
    for (let j = 0; j < ens.length; j++) {
      const k = ens[j].type || ens[j].kind;
      if (k === '循辙') houndN += 1;
      if (k === '灯蛾') mothN += 1;
      if (k === '拾烬') eaterN += 1;
      if (k === '壳卫' || k === 'shell') shellN += 1;
      if (k === '爆卫' || k === 'boomer') boomerN += 1;
    }
  }
  if (houndN < 1) throw new Error('循辙 exists');
  if (mothN < 1) throw new Error('灯蛾 exists');
  if (eaterN < 1) throw new Error('拾烬 exists');
  if (shellN < 1) throw new Error('壳卫 exists');
  if (boomerN < 1) throw new Error('爆卫 exists');
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
  if (roomHudText(hud0).indexOf('空场 · 1/') !== 0) throw new Error('HUD 空场 1/38');
  const hud2 = makeState();
  resetRoom(hud2, 2, false);
  if (roomHudText(hud2).indexOf('水巷 · 3/') !== 0) throw new Error('HUD 3/38');

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
  if (roomHudText(hudAsh).indexOf('灰径 · 11/') !== 0) throw new Error('HUD 灰径 11/38');

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
  if (roomHudText(hudRing).indexOf('环行 · 12/') !== 0) throw new Error('HUD 环行 12/38');

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
  if (roomHudText(hudWire).indexOf('密线 · 13/') !== 0) throw new Error('HUD 密线 13/38');

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
  if (roomHudText(hudChao).indexOf('潮廊 · 14/') !== 0) throw new Error('HUD 潮廊 14/38');

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
  if (inWater(zhong, 80, 180) || inWater(zhong, 340, 180) || inWater(zhong, 780, 180) || inWater(zhong, 860, 180)) {
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
  explode(zhong, 200, 180, false);
  if (zhong.seed !== 1) throw new Error('种廊 mid trail keeps seed');
  if (zBox.open) throw new Error('种廊 mid no thick');
  explode(zhong, zBox.x + zBox.w * 0.5, zBox.y - 20, false);
  if (!zBox.open) throw new Error('种廊 seeded opens thick');
  if (zhong.seed !== 0) throw new Error('种廊 seed consumed');
  takeCore(zhong, { x: 100, y: 100 });
  if (zhong.won) throw new Error('种廊 should not 通关');
  for (let i = 0; i < 20; i++) update(zhong, 0.1);
  if (zhong.roomName !== '油廊') throw new Error('core advances to 油廊');
  const hudZhong = makeState();
  resetRoom(hudZhong, 14, false);
  if (roomHudText(hudZhong).indexOf('种廊 · 15/') !== 0) throw new Error('HUD 种廊 15/38');

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
  if (roomHudText(hudYou).indexOf('油廊 · 16/') !== 0) throw new Error('HUD 油廊 16/38');

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
  if (roomHudText(hudJi).indexOf('急廊 · 17/') !== 0) throw new Error('HUD 急廊 17/38');

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

  const shellHit = makeState();
  resetRoom(shellHit, 0, false);
  shellHit.player.x = 40;
  shellHit.player.y = 40;
  shellHit.player.inv = 2;
  shellHit.enemies.push({
    x: 400, y: 200, r: SHELL_R, hp: SHELL_HP, hitT: 0,
    frostT: 0, shoveT: 0, shoveVx: 0, shoveVy: 0,
    kind: NAMES.shell, faceX: 1, faceY: 0, flutter: 0,
  });
  const sh = shellHit.enemies[shellHit.enemies.length - 1];
  explode(shellHit, 400, 200, false);
  if (sh.hp !== 2) throw new Error('壳卫 cold boom 0 dmg');
  if (shellHit.toast !== TOAST.shellClang) throw new Error('壳挡了');
  explode(shellHit, 400, 200, true);
  if (sh.hp !== 1) throw new Error('壳卫 hot boom 1 dmg');
  explode(shellHit, 400, 200, true);
  if (sh.hp !== 0) throw new Error('壳卫 second hot dies');
  if (shellHit.toast !== TOAST.shell) throw new Error('壳卫倒了');

  const boomHit = makeState();
  resetRoom(boomHit, 0, false);
  boomHit.player.x = 40;
  boomHit.player.y = 40;
  boomHit.player.inv = 2;
  boomHit.enemies.push({
    x: 400, y: 200, r: BOOMER_R, hp: BOOMER_HP, hitT: 0,
    frostT: 0, shoveT: 0, shoveVx: 0, shoveVy: 0,
    kind: NAMES.boomer, faceX: 1, faceY: 0, flutter: 0,
  });
  const bm = boomHit.enemies[boomHit.enemies.length - 1];
  explode(boomHit, 400, 200, false);
  if (bm.hp !== 0) throw new Error('爆卫 dry boom kills');
  if (boomHit.toast !== TOAST.boomer) throw new Error('爆卫倒了');
  if (!boomHit.boomerFuses || boomHit.boomerFuses.length !== 1) throw new Error('fuse queued');
  if (dist(boomHit.boomerFuses[0].x, boomHit.boomerFuses[0].y, 400, 200) > 30) {
    throw new Error('fuse at corpse');
  }
  if (Math.abs(boomHit.boomerFuses[0].t - BOOMER_T) > 0.05) throw new Error('fuse t is BOOMER_T');
  const boomBooms = boomHit.stats.booms;
  boomHit.player.x = 400;
  boomHit.player.y = 200;
  boomHit.player.inv = 0;
  boomHit.player.hearts = 3;
  boomHit.hitstop = 0;
  boomHit.embers.length = 0;
  updateBoomerFuses(boomHit, BOOMER_T + 0.05);
  if (boomHit.boomerFuses.length !== 0) throw new Error('fuse cooked off');
  if (!(boomHit.stats.booms > boomBooms)) throw new Error('corpse hot boom');
  if (boomHit.player.hearts >= 3) throw new Error('corpse boom hurts player');
  if (boomHit.toast !== TOAST.boomerPop) throw new Error('爆卫炸了');

  const poolUnit = makeState();
  resetRoom(poolUnit, 0, false);
  poolUnit.roomW = 960;
  poolUnit.roomH = 400;
  poolUnit.waters = [];
  poolUnit.poolReady = true;
  poolUnit.player.x = 80;
  poolUnit.player.y = 80;
  poolUnit.player.inv = 1;
  explode(poolUnit, 400, 200, false);
  if (poolUnit.poolReady !== false) throw new Error('pool consumed');
  const poolTemps = (poolUnit.waters || []).filter(function (w) { return w.temp; });
  if (poolTemps.length !== 1) throw new Error('one temp water');
  const poolPad = poolTemps[0];
  if (Math.abs((poolPad.x + poolPad.w * 0.5) - 400) > 1) throw new Error('pad center x');
  if (Math.abs((poolPad.y + poolPad.h * 0.5) - 200) > 1) throw new Error('pad center y');
  if (Math.abs(poolPad.w - POOL_R * 2) > 1e-9 || Math.abs(poolPad.h - POOL_R * 2) > 1e-9) {
    throw new Error('pad size');
  }
  if (Math.abs(poolPad.life - POOL_LIFE) > 0.05) throw new Error('pad life');
  if (!inWater(poolUnit, 400, 200)) throw new Error('inWater at plant');
  poolUnit.hitstop = 0;
  update(poolUnit, POOL_LIFE + 0.05);
  const poolTemps2 = (poolUnit.waters || []).filter(function (w) { return w.temp; });
  if (poolTemps2.length !== 0) throw new Error('temp pad gone');
  if (poolUnit.toast !== TOAST.poolDry) throw new Error('洼干了');

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
  if (roomHudText(hudShi).indexOf('拾廊 · 18/') !== 0) throw new Error('HUD 拾廊 18/38');

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
  if (NAMES.dashBoom !== '冲爆') throw new Error('冲爆 name');
  if (COL.dashBoom !== '#b8ff4a') throw new Error('COL.dashBoom');
  if (TOAST.dashBoomGet !== '捡到冲爆') throw new Error('捡到冲爆');
  if (TOAST.dashBoomUse !== '冲爆来了') throw new Error('冲爆来了');
  if (TOAST.dashBoomRoom !== '冲爆会引爆') throw new Error('冲爆会引爆');
  if (lootKind('冲爆') !== 'dashboom' || lootKind('dashboom') !== 'dashboom') throw new Error('lootKind 冲爆');
  if (NAMES.split !== '裂爆') throw new Error('裂爆 name');
  if (COL.split !== '#7ad0ff') throw new Error('COL.split');
  if (SPLIT_T !== 0.28) throw new Error('SPLIT_T 0.28');
  if (SPLIT_D !== 80) throw new Error('SPLIT_D 80');
  if (TOAST.splitGet !== '捡到裂爆') throw new Error('捡到裂爆');
  if (TOAST.splitUse !== '裂爆来了') throw new Error('裂爆来了');
  if (TOAST.splitBoom !== '裂开了') throw new Error('裂开了');
  if (TOAST.splitRoom !== '裂爆会裂开') throw new Error('裂爆会裂开');
  if (lootKind('裂爆') !== 'split' || lootKind('split') !== 'split') throw new Error('lootKind 裂爆');
  if (NAMES.pierce !== '贯爆') throw new Error('贯爆 name');
  if (COL.pierce !== '#ff6ad5') throw new Error('COL.pierce');
  if (PIERCE_L !== 200) throw new Error('PIERCE_L 200');
  if (PIERCE_W !== 40) throw new Error('PIERCE_W 40');
  if (TOAST.pierceGet !== '捡到贯爆') throw new Error('捡到贯爆');
  if (TOAST.pierceUse !== '贯爆穿了') throw new Error('贯爆穿了');
  if (TOAST.pierceRoom !== '贯爆会穿箱') throw new Error('贯爆会穿箱');
  if (lootKind('贯爆') !== 'pierce' || lootKind('pierce') !== 'pierce') throw new Error('lootKind 贯爆');
  if (NAMES.halo !== '环爆') throw new Error('环爆 name');
  if (COL.halo !== '#9a7aff') throw new Error('COL.halo');
  if (RING_IN !== 40) throw new Error('RING_IN 40');
  if (RING_OUT !== 80) throw new Error('RING_OUT 80');
  if (TOAST.haloGet !== '捡到环爆') throw new Error('捡到环爆');
  if (TOAST.haloUse !== '炸成圈了') throw new Error('炸成圈了');
  if (TOAST.haloRoom !== '环爆是空心') throw new Error('环爆是空心');
  if (lootKind('环爆') !== 'halo' || lootKind('halo') !== 'halo') throw new Error('lootKind 环爆');
  if (NAMES.frost !== '霜爆') throw new Error('霜爆 name');
  if (COL.frost !== '#9ef0ff') throw new Error('COL.frost');
  if (FROST_T !== 1.8) throw new Error('FROST_T 1.8');
  if (TOAST.frostGet !== '捡到霜爆') throw new Error('捡到霜爆');
  if (TOAST.frostUse !== '冻住了') throw new Error('冻住了');
  if (TOAST.frostRoom !== '霜爆会冻住') throw new Error('霜爆会冻住');
  if (lootKind('霜爆') !== 'frost' || lootKind('frost') !== 'frost') throw new Error('lootKind 霜爆');
  if (NAMES.shove !== '推爆') throw new Error('推爆 name');
  if (COL.shove !== '#ff5a3a') throw new Error('COL.shove');
  if (SHOVE_V !== 280) throw new Error('SHOVE_V 280');
  if (SHOVE_T !== 0.40) throw new Error('SHOVE_T 0.40');
  if (TOAST.shoveGet !== '捡到推爆') throw new Error('捡到推爆');
  if (TOAST.shoveUse !== '推开了') throw new Error('推开了');
  if (TOAST.shoveRoom !== '推爆会推开') throw new Error('推爆会推开');
  if (lootKind('推爆') !== 'shove' || lootKind('shove') !== 'shove') throw new Error('lootKind 推爆');
  if (NAMES.bait !== '诱爆') throw new Error('诱爆 name');
  if (COL.bait !== '#ffb020') throw new Error('COL.bait');
  if (BAIT_T !== 2.0) throw new Error('BAIT_T 2.0');
  if (BAIT_SEE !== 240) throw new Error('BAIT_SEE 240');
  if (BAIT_R !== 11) throw new Error('BAIT_R 11');
  if (BAIT_HIT !== 16) throw new Error('BAIT_HIT 16');
  if (TOAST.baitGet !== '捡到诱爆') throw new Error('捡到诱爆');
  if (TOAST.baitUse !== '诱出来了') throw new Error('诱出来了');
  if (TOAST.baitRoom !== '诱爆会引开') throw new Error('诱爆会引开');
  if (lootKind('诱爆') !== 'bait' || lootKind('bait') !== 'bait') throw new Error('lootKind 诱爆');
  if (NAMES.bolt !== '雷爆') throw new Error('雷爆 name');
  if (COL.bolt !== '#6ec8ff') throw new Error('COL.bolt');
  if (BOLT_R !== 170) throw new Error('BOLT_R 170');
  if (BOLT_N !== 3) throw new Error('BOLT_N 3');
  if (TOAST.boltGet !== '捡到雷爆') throw new Error('捡到雷爆');
  if (TOAST.boltUse !== '雷劈了') throw new Error('雷劈了');
  if (TOAST.boltRoom !== '雷爆会劈远') throw new Error('雷爆会劈远');
  if (lootKind('雷爆') !== 'bolt' || lootKind('bolt') !== 'bolt') throw new Error('lootKind 雷爆');
  if (NAMES.trip !== '绊爆') throw new Error('绊爆 name');
  if (COL.trip !== '#ff6a3d') throw new Error('COL.trip');
  if (TRIP_R !== 16) throw new Error('TRIP_R 16');
  if (TRIP_LIFE !== 12) throw new Error('TRIP_LIFE 12');
  if (TOAST.tripGet !== '捡到绊爆') throw new Error('捡到绊爆');
  if (TOAST.tripPlant !== '绊线埋了') throw new Error('绊线埋了');
  if (TOAST.tripPop !== '绊住了') throw new Error('绊住了');
  if (TOAST.tripSelf !== '踩到绊线') throw new Error('踩到绊线');
  if (TOAST.tripRoom !== '埋线等他们来') throw new Error('埋线等他们来');
  if (lootKind('绊爆') !== 'trip' || lootKind('trip') !== 'trip') throw new Error('lootKind 绊爆');
  if (lootKind('跳爆') !== 'bounce' || lootKind('bounce') !== 'bounce') throw new Error('lootKind 跳爆');
  if (lootKind('卷爆') !== 'roll' || lootKind('roll') !== 'roll') throw new Error('lootKind 卷爆');
  if (lootKind('镜爆') !== 'mirror' || lootKind('mirror') !== 'mirror') throw new Error('lootKind 镜爆');
  if (lootKind('旋爆') !== 'spin' || lootKind('spin') !== 'spin') throw new Error('lootKind 旋爆');
  if (lootKind('洼爆') !== 'pool' || lootKind('pool') !== 'pool') throw new Error('lootKind 洼爆');
  if (lootKind('扇爆') !== 'fan' || lootKind('fan') !== 'fan') throw new Error('lootKind 扇爆');
  if (lootKind('鼓爆') !== 'drum' || lootKind('drum') !== 'drum') throw new Error('lootKind 鼓爆');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');

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
  if (echoKeep.seed !== 1) throw new Error('first boom keeps seed off thick');
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
  if (roomHudText(hudXiang).indexOf('响廊 · 19/') !== 0) throw new Error('HUD 响廊 19/38');
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
  if (suckKeep.seed !== 1) throw new Error('suck boom keeps seed off thick');
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
  if (xi.won) throw new Error('吸廊 should not 通关');
  for (let i = 0; i < 20; i++) update(xi, 0.1);
  if (xi.roomName !== '冲廊') throw new Error('core advances to 冲廊');
  const hudXi = makeState();
  resetRoom(hudXi, 19, false);
  if (roomHudText(hudXi).indexOf('吸廊 · 20/') !== 0) throw new Error('HUD 吸廊 20/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const dashA = makeState();
  resetRoom(dashA, 0, false);
  dashA.player.x = 80;
  dashA.player.y = 80;
  dashA.dashBoomReady = true;
  dropSpark(dashA, 200, 200, false);
  dropSpark(dashA, 300, 200, false);
  dashA.input.dash = true;
  update(dashA, 0.016);
  if (dashA.dashBoomReady !== false) throw new Error('dashBoom consumed on dash');
  if (dashA.sparks[0].t > CHAIN_T) throw new Error('dashBoom spark0 t');
  if (dashA.sparks[1].t > CHAIN_T) throw new Error('dashBoom spark1 t');
  if (dashA.sparks[0].fuse !== true || dashA.sparks[1].fuse !== true) throw new Error('dashBoom fuse');
  if (String(dashA.toast).indexOf(TOAST.dashBoomUse) < 0) throw new Error('冲爆来了');

  const dashB = makeState();
  resetRoom(dashB, 0, false);
  dashB.player.x = 80;
  dashB.player.y = 80;
  dropSpark(dashB, 200, 200, false);
  dropSpark(dashB, 300, 200, false);
  dashB.input.dash = true;
  update(dashB, 0.016);
  if (dashB.sparks[0].fuse || dashB.sparks[1].fuse) throw new Error('no dashBoom no fuse');
  if (dashB.sparks[0].t <= CHAIN_T || dashB.sparks[1].t <= CHAIN_T) throw new Error('no dashBoom t');

  const dashWet = makeState();
  resetRoom(dashWet, 0, false);
  dashWet.player.x = 40;
  dashWet.player.y = 40;
  dashWet.dashBoomReady = true;
  dashWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(dashWet, 120, 120, false);
  if (!dashWet.sparks[0].wet) throw new Error('dashBoom wet spark');
  dashWet.input.dash = true;
  update(dashWet, 0.016);
  if (dashWet.sparks[0].wet !== true) throw new Error('wet stays wet');
  if (dashWet.sparks[0].fuse) throw new Error('wet not fused');
  if (dashWet.dashBoomReady !== false) throw new Error('wet dash spends 冲爆');
  if (dashWet.stats.booms !== 0) throw new Error('wet dashBoom no boom');

  const dashEmpty = makeState();
  resetRoom(dashEmpty, 0, false);
  dashEmpty.dashBoomReady = true;
  dashEmpty.input.dash = true;
  update(dashEmpty, 0.016);
  if (dashEmpty.dashBoomReady !== false) throw new Error('empty dash spends 冲爆');

  const dashOnce = makeState();
  resetRoom(dashOnce, 0, false);
  dashOnce.player.x = 80;
  dashOnce.player.y = 80;
  dashOnce.dashBoomReady = true;
  dropSpark(dashOnce, 200, 200, false);
  dropSpark(dashOnce, 300, 200, false);
  dashOnce.input.dash = true;
  update(dashOnce, 0.016);
  if (dashOnce.dashBoomReady !== false) throw new Error('first dash spends 冲爆');
  dashOnce.player.dashT = 0;
  dashOnce.player.dashCd = 0;
  dropSpark(dashOnce, 220, 280, false);
  dropSpark(dashOnce, 320, 280, false);
  const later0 = dashOnce.sparks[dashOnce.sparks.length - 2];
  const later1 = dashOnce.sparks[dashOnce.sparks.length - 1];
  dashOnce.input.dash = true;
  update(dashOnce, 0.016);
  if (later0.fuse || later1.fuse) throw new Error('second dash does not fuse');
  if (later0.t <= CHAIN_T || later1.t <= CHAIN_T) throw new Error('second dash no fuse t');

  const dashKeep = makeState();
  resetRoom(dashKeep, 0, false);
  dashKeep.dashBoomReady = true;
  dropSpark(dashKeep, 200, 200, false);
  if (dashKeep.dashBoomReady !== true) throw new Error('dropSpark keeps 冲爆');
  explode(dashKeep, 400, 220, false);
  if (dashKeep.dashBoomReady !== true) throw new Error('explode keeps 冲爆');

  const dashPick = makeState();
  resetRoom(dashPick, 0, false);
  if (dashPick.dashBoomReady) throw new Error('dashBoom starts false');
  dashPick.items.push({ kind: 'dashboom', x: dashPick.player.x, y: dashPick.player.y, r: 10, taken: false });
  update(dashPick, 0.016);
  if (dashPick.dashBoomReady !== true) throw new Error('pick 冲爆');
  if (dashPick.toast !== TOAST.dashBoomGet) throw new Error('捡到冲爆');

  const dashKeepOthers = makeState();
  resetRoom(dashKeepOthers, 0, false);
  dashKeepOthers.player.x = 80;
  dashKeepOthers.player.y = 80;
  dashKeepOthers.lastSparkX = 80;
  dashKeepOthers.lastSparkY = 80;
  dropSpark(dashKeepOthers, 200, 200, false);
  dashKeepOthers.seed = 1;
  dashKeepOthers.hasteReady = true;
  dashKeepOthers.echoReady = true;
  dashKeepOthers.suckReady = true;
  dashKeepOthers.splitReady = true;
  dashKeepOthers.pierceReady = true;
  dashKeepOthers.dashBoomReady = true;
  dashKeepOthers.input.dash = true;
  update(dashKeepOthers, 0.016);
  if (dashKeepOthers.dashBoomReady) throw new Error('dash spends 冲爆 keep others');
  if (dashKeepOthers.seed !== 1) throw new Error('冲爆 keeps 焰种');
  if (dashKeepOthers.hasteReady !== true) throw new Error('冲爆 keeps 急燃');
  if (dashKeepOthers.echoReady !== true) throw new Error('冲爆 keeps 回爆');
  if (dashKeepOthers.suckReady !== true) throw new Error('冲爆 keeps 吸爆');
  if (dashKeepOthers.splitReady !== true) throw new Error('冲爆 keeps 裂爆');
  if (dashKeepOthers.pierceReady !== true) throw new Error('冲爆 keeps 贯爆');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');

  const chong = makeState();
  resetRoom(chong, 20, false);
  if (chong.roomName !== '冲廊' || chong.roomId !== 'chonglang') throw new Error('chonglang load');
  if (chong.toast !== TOAST.dashBoomRoom) throw new Error('冲廊 intro');
  if (chong.roomW !== 960 || chong.roomH !== 400) throw new Error('冲廊 size');
  if (chong.player.x !== 80 || chong.player.y !== 200) throw new Error('冲廊 spawn');
  if (chong.dashBoomReady) throw new Error('冲廊 dashBoom starts false');
  let chongStill = 0;
  let chongTide = 0;
  for (let i = 0; i < chong.waters.length; i++) {
    if (chong.waters[i].tide) chongTide += 1;
    else chongStill += 1;
  }
  if (chongStill < 1) throw new Error('冲廊 needs static 水洼');
  if (chongTide) throw new Error('冲廊 no tide');
  let chongCore = 0;
  let chongHeal = 0;
  let chongThick = 0;
  let chongDashItem = 0;
  let chongSuckItem = 0;
  let chongEchoItem = 0;
  let chongHasteItem = 0;
  let chongSeedItem = 0;
  for (let i = 0; i < chong.crates.length; i++) {
    if (chong.crates[i].loot === 'core') chongCore += 1;
    if (chong.crates[i].loot === 'heal') chongHeal += 1;
    if (chong.crates[i].thick) chongThick += 1;
  }
  for (let i = 0; i < chong.items.length; i++) {
    if (chong.items[i].kind === 'dashboom') chongDashItem += 1;
    if (chong.items[i].kind === 'suck') chongSuckItem += 1;
    if (chong.items[i].kind === 'echo') chongEchoItem += 1;
    if (chong.items[i].kind === 'haste') chongHasteItem += 1;
    if (chong.items[i].kind === 'seed') chongSeedItem += 1;
  }
  if (chongDashItem < 1) throw new Error('冲廊 needs 冲爆');
  if (chongSuckItem || chongEchoItem || chongHasteItem || chongSeedItem) {
    throw new Error('冲廊 no 焰种/急燃/回爆/吸爆');
  }
  if (chongCore !== 1) throw new Error('冲廊 心核');
  if (chongHeal < 1) throw new Error('冲廊 回星');
  const cBox = chong.crates.find(function (c) { return c.loot === 'core'; });
  if (!cBox || cBox.thick) throw new Error('冲廊 心核 crate is not thick');
  if (chongThick) throw new Error('冲廊 no thick crate');
  let chongHound = 0;
  let chongGuard = 0;
  let chongMoth = 0;
  let chongEater = 0;
  for (let i = 0; i < chong.enemies.length; i++) {
    if (isHound(chong.enemies[i])) chongHound += 1;
    else if (isMoth(chong.enemies[i])) chongMoth += 1;
    else if (isEater(chong.enemies[i])) chongEater += 1;
    else chongGuard += 1;
  }
  if (chongGuard !== 1 || chongHound !== 0 || chongMoth !== 0 || chongEater !== 0) {
    throw new Error('冲廊 烬卫 only');
  }
  if (inWater(chong, 80, 200) || inOil(chong, 80, 200)) throw new Error('冲廊 spawn dry');
  if (inWater(chong, 280, 200) || inOil(chong, 280, 200)) throw new Error('冲廊 冲爆 dry');
  if (inOil(chong, 860, 188) || inWater(chong, 860, 188)) throw new Error('冲廊 core dry');
  if (!inWater(chong, 450, 350)) throw new Error('冲廊 wet bag');
  if (inWater(chong, 400, 100)) throw new Error('冲廊 north shelf wet');
  for (let i = 0; i < chong.crates.length; i++) {
    const c = chong.crates[i];
    if (circleRect(chong.player.x, chong.player.y, chong.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('冲廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 500; x += 10) {
    for (let i = 0; i < chong.crates.length; i++) {
      const c = chong.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('冲廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 700; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(chong, x, y)) throw new Error('冲廊 north puddle');
      for (let i = 0; i < chong.enemies.length; i++) {
        const e = chong.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('冲廊 north enemy');
      }
    }
  }
  const cStack = chong.crates.filter(function (c) {
    const cx = c.x + c.w * 0.5;
    return Math.abs(cx - 560) < 8 && !c.loot;
  });
  if (cStack.length < 3) throw new Error('冲廊 crate stack');
  cStack.sort(function (a, b) { return a.y - b.y; });
  for (let i = 1; i < cStack.length; i++) {
    const ay = cStack[i - 1].y + cStack[i - 1].h * 0.5;
    const by = cStack[i].y + cStack[i].h * 0.5;
    if (by - ay < 110) throw new Error('冲廊 crate stack y-gap');
  }
  explode(chong, cStack[0].x + cStack[0].w * 0.5, cStack[0].y + cStack[0].h * 0.5, false);
  if (!cStack[0].open) throw new Error('冲廊 one crate opens');
  if (cStack[1].open || cStack[2].open) throw new Error('冲廊 blast misses stacked crates');
  explode(chong, cBox.x + cBox.w * 0.5, cBox.y - 20, false);
  if (!cBox.open) throw new Error('冲廊 dry trail should open 心核');
  takeCore(chong, { x: 100, y: 100 });
  if (chong.won) throw new Error('冲廊 should not 通关');
  for (let i = 0; i < 20; i++) update(chong, 0.1);
  if (chong.roomName !== '裂廊') throw new Error('core advances to 裂廊');
  const hudChong = makeState();
  resetRoom(hudChong, 20, false);
  if (roomHudText(hudChong).indexOf('冲廊 · 21/') !== 0) throw new Error('HUD 冲廊 21/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');

  const splitDry = makeState();
  resetRoom(splitDry, 0, false);
  splitDry.splitReady = true;
  splitDry.player.faceX = 1;
  splitDry.player.faceY = 0;
  explode(splitDry, 400, 200, false);
  if (splitDry.splitReady !== false) throw new Error('splitReady consumed on boom');
  if (!splitDry.splits || splitDry.splits.length !== 2) throw new Error('split queued 2');
  for (let i = 0; i < 10; i++) update(splitDry, 0.05);
  if (splitDry.stats.booms !== 3) throw new Error('split two satellites');
  const satA = dist(splitDry.lastBoomX, splitDry.lastBoomY, 400, 120) <= 4
    || dist(splitDry.lastBoomX, splitDry.lastBoomY, 400, 280) <= 4;
  if (!satA) throw new Error('split last satellite near fork');
  let near120 = 0;
  let near280 = 0;
  for (let i = 0; i < splitDry.embers.length; i++) {
    const em = splitDry.embers[i];
    if (dist(em.x, em.y, 400, 120) <= 4) near120 += 1;
    if (dist(em.x, em.y, 400, 280) <= 4) near280 += 1;
  }
  if (near120 < 1 || near280 < 1) throw new Error('split satellites at 400,120 / 400,280');
  const splitToast = String(splitDry.toast);
  if (splitToast.indexOf(TOAST.splitUse) < 0 && splitToast.indexOf(TOAST.splitBoom) < 0) {
    throw new Error('裂爆来了 or 裂开了');
  }

  const splitOff = makeState();
  resetRoom(splitOff, 0, false);
  explode(splitOff, 400, 200, false);
  if (splitOff.splits && splitOff.splits.length) throw new Error('no split no queue');
  if (splitOff.stats.booms !== 1) throw new Error('no split one boom');

  const splitWet = makeState();
  resetRoom(splitWet, 0, false);
  splitWet.splitReady = true;
  splitWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(splitWet, 120, 120, false);
  if (!splitWet.sparks[0].wet) throw new Error('split wet spark');
  for (let i = 0; i < 24; i++) update(splitWet, 0.1);
  if (splitWet.splitReady !== true) throw new Error('wet keeps 裂爆');
  if (splitWet.stats.booms !== 0) throw new Error('wet split no boom');
  if (splitWet.splits && splitWet.splits.length) throw new Error('wet no split queue');

  const splitOnce = makeState();
  resetRoom(splitOnce, 0, false);
  splitOnce.splitReady = true;
  splitOnce.player.faceX = 1;
  splitOnce.player.faceY = 0;
  explode(splitOnce, 400, 200, false);
  if (splitOnce.splits.length !== 2) throw new Error('first boom forks');
  for (let i = 0; i < 10; i++) update(splitOnce, 0.05);
  const afterFork = splitOnce.stats.booms;
  explode(splitOnce, 420, 220, false);
  if (splitOnce.splits && splitOnce.splits.length) throw new Error('second boom no fork');
  if (splitOnce.stats.booms !== afterFork + 1) throw new Error('second boom only one');
  if (splitOnce.splitReady) throw new Error('split stays spent');

  const splitKeepDrop = makeState();
  resetRoom(splitKeepDrop, 0, false);
  splitKeepDrop.splitReady = true;
  dropSpark(splitKeepDrop, 200, 200, false);
  if (splitKeepDrop.splitReady !== true) throw new Error('dropSpark keeps 裂爆');
  splitKeepDrop.player.x = 80;
  splitKeepDrop.player.y = 80;
  splitKeepDrop.input.dash = true;
  update(splitKeepDrop, 0.016);
  if (splitKeepDrop.splitReady !== true) throw new Error('dash keeps 裂爆');
  splitKeepDrop.player.dashT = 0;
  splitKeepDrop.player.dashCd = 0;
  splitKeepDrop.hitstop = 0;
  splitKeepDrop.dashBoomReady = true;
  splitKeepDrop.input.dash = true;
  update(splitKeepDrop, 0.016);
  if (splitKeepDrop.splitReady !== true) throw new Error('冲爆 keeps 裂爆');
  if (splitKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const splitSatKeep = makeState();
  resetRoom(splitSatKeep, 0, false);
  splitSatKeep.splitReady = true;
  splitSatKeep.player.faceX = 1;
  splitSatKeep.player.faceY = 0;
  explode(splitSatKeep, 400, 200, false);
  splitSatKeep.splitReady = true;
  splitSatKeep.echoReady = true;
  splitSatKeep.suckReady = true;
  splitSatKeep.seed = 1;
  for (let i = 0; i < 10; i++) update(splitSatKeep, 0.05);
  if (splitSatKeep.splitReady !== true) throw new Error('satellite keeps split');
  if (splitSatKeep.echoReady !== true) throw new Error('satellite keeps echo');
  if (splitSatKeep.suckReady !== true) throw new Error('satellite keeps suck');
  if (splitSatKeep.seed !== 1) throw new Error('satellite keeps seed');

  const splitPick = makeState();
  resetRoom(splitPick, 0, false);
  if (splitPick.splitReady) throw new Error('split starts false');
  splitPick.items.push({ kind: 'split', x: splitPick.player.x, y: splitPick.player.y, r: 10, taken: false });
  update(splitPick, 0.016);
  if (splitPick.splitReady !== true) throw new Error('pick 裂爆');
  if (splitPick.toast !== TOAST.splitGet) throw new Error('捡到裂爆');

  const splitKeepOthers = makeState();
  resetRoom(splitKeepOthers, 0, false);
  splitKeepOthers.seed = 1;
  splitKeepOthers.hasteReady = true;
  splitKeepOthers.echoReady = true;
  splitKeepOthers.suckReady = true;
  splitKeepOthers.dashBoomReady = true;
  splitKeepOthers.splitReady = true;
  splitKeepOthers.pierceReady = true;
  splitKeepOthers.player.faceX = 1;
  splitKeepOthers.player.faceY = 0;
  explode(splitKeepOthers, 400, 220, false);
  if (splitKeepOthers.splitReady) throw new Error('split boom spends split');
  if (splitKeepOthers.echoReady) throw new Error('split boom still queues echo');
  if (!splitKeepOthers.echoes || splitKeepOthers.echoes.length !== 1) throw new Error('split boom queues echo');
  if (!splitKeepOthers.splits || splitKeepOthers.splits.length !== 2) throw new Error('split boom queues forks');
  if (splitKeepOthers.seed !== 1) throw new Error('split boom keeps seed off thick');
  if (splitKeepOthers.hasteReady !== true) throw new Error('split does not spend haste');
  if (splitKeepOthers.dashBoomReady !== true) throw new Error('split does not spend 冲爆');
  if (splitKeepOthers.suckReady) throw new Error('split boom spends suck as real boom');
  if (splitKeepOthers.pierceReady) throw new Error('split boom spends pierce as real boom');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (SPLIT_T !== 0.28) throw new Error('SPLIT_T 0.28');
  if (SPLIT_D !== 80) throw new Error('SPLIT_D 80');

  const lie = makeState();
  resetRoom(lie, 21, false);
  if (lie.roomName !== '裂廊' || lie.roomId !== 'lielang') throw new Error('lielang load');
  if (lie.toast !== TOAST.splitRoom) throw new Error('裂廊 intro');
  if (lie.roomW !== 960 || lie.roomH !== 400) throw new Error('裂廊 size');
  if (lie.player.x !== 80 || lie.player.y !== 200) throw new Error('裂廊 spawn');
  if (lie.splitReady) throw new Error('裂廊 split starts false');
  let lieStill = 0;
  let lieTide = 0;
  for (let i = 0; i < lie.waters.length; i++) {
    if (lie.waters[i].tide) lieTide += 1;
    else lieStill += 1;
  }
  if (lieStill < 1) throw new Error('裂廊 needs static 水洼');
  if (lieTide) throw new Error('裂廊 no tide');
  let lieCore = 0;
  let lieHeal = 0;
  let lieThick = 0;
  let lieSplitItem = 0;
  let lieDashItem = 0;
  let lieSuckItem = 0;
  let lieEchoItem = 0;
  let lieHasteItem = 0;
  let lieSeedItem = 0;
  for (let i = 0; i < lie.crates.length; i++) {
    if (lie.crates[i].loot === 'core') lieCore += 1;
    if (lie.crates[i].loot === 'heal') lieHeal += 1;
    if (lie.crates[i].thick) lieThick += 1;
  }
  for (let i = 0; i < lie.items.length; i++) {
    if (lie.items[i].kind === 'split') lieSplitItem += 1;
    if (lie.items[i].kind === 'dashboom') lieDashItem += 1;
    if (lie.items[i].kind === 'suck') lieSuckItem += 1;
    if (lie.items[i].kind === 'echo') lieEchoItem += 1;
    if (lie.items[i].kind === 'haste') lieHasteItem += 1;
    if (lie.items[i].kind === 'seed') lieSeedItem += 1;
  }
  if (lieSplitItem < 1) throw new Error('裂廊 needs 裂爆');
  if (lieDashItem || lieSuckItem || lieEchoItem || lieHasteItem || lieSeedItem) {
    throw new Error('裂廊 no 焰种/急燃/回爆/吸爆/冲爆');
  }
  if (lieCore !== 1) throw new Error('裂廊 心核');
  if (lieHeal < 1) throw new Error('裂廊 回星');
  const lBox = lie.crates.find(function (c) { return c.loot === 'core'; });
  if (!lBox || lBox.thick) throw new Error('裂廊 心核 crate is not thick');
  if (lieThick) throw new Error('裂廊 no thick crate');
  let lieHound = 0;
  let lieGuard = 0;
  let lieMoth = 0;
  let lieEater = 0;
  for (let i = 0; i < lie.enemies.length; i++) {
    if (isHound(lie.enemies[i])) lieHound += 1;
    else if (isMoth(lie.enemies[i])) lieMoth += 1;
    else if (isEater(lie.enemies[i])) lieEater += 1;
    else lieGuard += 1;
  }
  if (lieGuard !== 1 || lieHound !== 0 || lieMoth !== 0 || lieEater !== 0) {
    throw new Error('裂廊 烬卫 only');
  }
  if (inWater(lie, 80, 200) || inOil(lie, 80, 200)) throw new Error('裂廊 spawn dry');
  if (inWater(lie, 280, 200) || inOil(lie, 280, 200)) throw new Error('裂廊 裂爆 dry');
  if (inOil(lie, 860, 188) || inWater(lie, 860, 188)) throw new Error('裂廊 core dry');
  if (!inWater(lie, 450, 350)) throw new Error('裂廊 wet bag');
  if (inWater(lie, 400, 100)) throw new Error('裂廊 north shelf wet');
  for (let i = 0; i < lie.crates.length; i++) {
    const c = lie.crates[i];
    if (circleRect(lie.player.x, lie.player.y, lie.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('裂廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 500; x += 10) {
    for (let i = 0; i < lie.crates.length; i++) {
      const c = lie.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('裂廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 700; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(lie, x, y)) throw new Error('裂廊 north puddle');
      for (let i = 0; i < lie.enemies.length; i++) {
        const e = lie.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('裂廊 north enemy');
      }
    }
  }
  const lPair = lie.crates.filter(function (c) {
    const cx = c.x + c.w * 0.5;
    return Math.abs(cx - 560) < 8 && !c.loot;
  });
  if (lPair.length < 2) throw new Error('裂廊 N/S crate pair');
  lPair.sort(function (a, b) { return a.y - b.y; });
  const pairDy = (lPair[lPair.length - 1].y + lPair[lPair.length - 1].h * 0.5)
    - (lPair[0].y + lPair[0].h * 0.5);
  if (pairDy < 200) throw new Error('裂廊 crate pair |Δy| >= 200');
  explode(lie, 560, 200, false);
  if (lPair[0].open || lPair[1].open) throw new Error('裂廊 BLAST_R misses N/S pair');
  lie.splitReady = true;
  lie.player.faceX = 1;
  lie.player.faceY = 0;
  explode(lie, 560, 200, false);
  for (let i = 0; i < 10; i++) update(lie, 0.05);
  if (!lPair[0].open || !lPair[1].open) throw new Error('裂廊 split opens N/S pair');
  if (lie.stats.booms < 3) throw new Error('裂廊 center + 2 satellites');
  explode(lie, lBox.x + lBox.w * 0.5, lBox.y - 20, false);
  if (!lBox.open) throw new Error('裂廊 dry trail should open 心核');
  takeCore(lie, { x: 100, y: 100 });
  if (lie.won) throw new Error('裂廊 should not 通关');
  for (let i = 0; i < 20; i++) update(lie, 0.1);
  if (lie.roomName !== '贯廊') throw new Error('core advances to 贯廊');
  const hudLie = makeState();
  resetRoom(hudLie, 21, false);
  if (roomHudText(hudLie).indexOf('裂廊 · 22/') !== 0) throw new Error('HUD 裂廊 22/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');

  function lineCrate(s, cx, cy, thick) {
    s.crates.push({
      x: cx - CRATE * 0.5,
      y: cy - CRATE * 0.5,
      w: CRATE,
      h: CRATE,
      open: false,
      loot: null,
      thick: !!thick,
    });
  }

  const pierceDry = makeState();
  resetRoom(pierceDry, 0, false);
  lineCrate(pierceDry, 540, 200);
  lineCrate(pierceDry, 630, 200);
  lineCrate(pierceDry, 700, 200);
  pierceDry.pierceReady = true;
  pierceDry.player.faceX = 1;
  pierceDry.player.faceY = 0;
  explode(pierceDry, 500, 200, false);
  if (pierceDry.pierceReady !== false) throw new Error('pierceReady consumed on boom');
  if (!pierceDry.crates[pierceDry.crates.length - 3].open
    || !pierceDry.crates[pierceDry.crates.length - 2].open
    || !pierceDry.crates[pierceDry.crates.length - 1].open) {
    throw new Error('pierce opens three line crates');
  }
  if (String(pierceDry.toast).indexOf(TOAST.pierceUse) < 0) throw new Error('贯爆穿了');

  const pierceOff = makeState();
  resetRoom(pierceOff, 0, false);
  lineCrate(pierceOff, 540, 200);
  lineCrate(pierceOff, 630, 200);
  lineCrate(pierceOff, 700, 200);
  explode(pierceOff, 500, 200, false);
  const offA = pierceOff.crates[pierceOff.crates.length - 3];
  const offB = pierceOff.crates[pierceOff.crates.length - 2];
  const offC = pierceOff.crates[pierceOff.crates.length - 1];
  if (offB.open || offC.open) throw new Error('BLAST_R misses far line crates');
  if (offA.open !== circleRect(500, 200, BLAST_R, offA.x, offA.y, offA.w, offA.h)
    && !offA.open) {
    throw new Error('near crate may open');
  }
  if (offB.open || offC.open) throw new Error('no pierce no far crates');

  const pierceWet = makeState();
  resetRoom(pierceWet, 0, false);
  pierceWet.pierceReady = true;
  pierceWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(pierceWet, 120, 120, false);
  if (!pierceWet.sparks[0].wet) throw new Error('pierce wet spark');
  for (let i = 0; i < 24; i++) update(pierceWet, 0.1);
  if (pierceWet.pierceReady !== true) throw new Error('wet keeps 贯爆');
  if (pierceWet.stats.booms !== 0) throw new Error('wet pierce no boom');

  const pierceOnce = makeState();
  resetRoom(pierceOnce, 0, false);
  lineCrate(pierceOnce, 540, 200);
  lineCrate(pierceOnce, 630, 200);
  lineCrate(pierceOnce, 700, 200);
  pierceOnce.pierceReady = true;
  pierceOnce.player.faceX = 1;
  pierceOnce.player.faceY = 0;
  explode(pierceOnce, 500, 200, false);
  if (pierceOnce.pierceReady) throw new Error('first boom spends pierce');
  const onceOpen = pierceOnce.crates.filter(function (c) { return c.open; }).length;
  explode(pierceOnce, 400, 200, false);
  const afterOnce = pierceOnce.crates.filter(function (c) { return c.open; }).length;
  if (afterOnce !== onceOpen) throw new Error('second boom does not pierce');
  if (pierceOnce.pierceReady) throw new Error('pierce stays spent');

  const pierceKeepDrop = makeState();
  resetRoom(pierceKeepDrop, 0, false);
  pierceKeepDrop.pierceReady = true;
  dropSpark(pierceKeepDrop, 200, 200, false);
  if (pierceKeepDrop.pierceReady !== true) throw new Error('dropSpark keeps 贯爆');
  pierceKeepDrop.player.x = 80;
  pierceKeepDrop.player.y = 80;
  pierceKeepDrop.input.dash = true;
  update(pierceKeepDrop, 0.016);
  if (pierceKeepDrop.pierceReady !== true) throw new Error('dash keeps 贯爆');
  pierceKeepDrop.player.dashT = 0;
  pierceKeepDrop.player.dashCd = 0;
  pierceKeepDrop.hitstop = 0;
  pierceKeepDrop.dashBoomReady = true;
  pierceKeepDrop.input.dash = true;
  update(pierceKeepDrop, 0.016);
  if (pierceKeepDrop.pierceReady !== true) throw new Error('冲爆 keeps 贯爆');
  if (pierceKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const pierceSatKeep = makeState();
  resetRoom(pierceSatKeep, 0, false);
  pierceSatKeep.splitReady = true;
  pierceSatKeep.player.faceX = 1;
  pierceSatKeep.player.faceY = 0;
  explode(pierceSatKeep, 400, 200, false);
  pierceSatKeep.pierceReady = true;
  pierceSatKeep.echoReady = true;
  pierceSatKeep.splitReady = true;
  pierceSatKeep.suckReady = true;
  pierceSatKeep.seed = 1;
  for (let i = 0; i < 10; i++) update(pierceSatKeep, 0.05);
  if (pierceSatKeep.pierceReady !== true) throw new Error('satellite keeps pierce');
  if (pierceSatKeep.splitReady !== true) throw new Error('satellite keeps split');
  if (pierceSatKeep.echoReady !== true) throw new Error('satellite keeps echo');
  if (pierceSatKeep.suckReady !== true) throw new Error('satellite keeps suck');
  if (pierceSatKeep.seed !== 1) throw new Error('satellite keeps seed');

  const pierceEchoKeep = makeState();
  resetRoom(pierceEchoKeep, 0, false);
  pierceEchoKeep.echoReady = true;
  explode(pierceEchoKeep, 400, 200, false);
  pierceEchoKeep.pierceReady = true;
  for (let i = 0; i < 12; i++) update(pierceEchoKeep, 0.05);
  if (pierceEchoKeep.pierceReady !== true) throw new Error('echo boom keeps pierce');

  const piercePick = makeState();
  resetRoom(piercePick, 0, false);
  if (piercePick.pierceReady) throw new Error('pierce starts false');
  piercePick.items.push({ kind: 'pierce', x: piercePick.player.x, y: piercePick.player.y, r: 10, taken: false });
  update(piercePick, 0.016);
  if (piercePick.pierceReady !== true) throw new Error('pick 贯爆');
  if (piercePick.toast !== TOAST.pierceGet) throw new Error('捡到贯爆');

  const pierceThick = makeState();
  resetRoom(pierceThick, 0, false);
  lineCrate(pierceThick, 640, 200, true);
  pierceThick.pierceReady = true;
  pierceThick.player.faceX = 1;
  pierceThick.player.faceY = 0;
  explode(pierceThick, 500, 200, false);
  if (pierceThick.crates[pierceThick.crates.length - 1].open) throw new Error('pierce skips thick crate');
  if (pierceThick.pierceReady) throw new Error('pierce still spends on thick miss');

  const pierceKeepOthers = makeState();
  resetRoom(pierceKeepOthers, 0, false);
  pierceKeepOthers.seed = 1;
  pierceKeepOthers.hasteReady = true;
  pierceKeepOthers.echoReady = true;
  pierceKeepOthers.suckReady = true;
  pierceKeepOthers.dashBoomReady = true;
  pierceKeepOthers.splitReady = true;
  pierceKeepOthers.pierceReady = true;
  pierceKeepOthers.player.faceX = 1;
  pierceKeepOthers.player.faceY = 0;
  explode(pierceKeepOthers, 400, 220, false);
  if (pierceKeepOthers.pierceReady) throw new Error('pierce boom spends pierce');
  if (pierceKeepOthers.splitReady) throw new Error('pierce boom still queues split');
  if (pierceKeepOthers.echoReady) throw new Error('pierce boom still queues echo');
  if (!pierceKeepOthers.echoes || pierceKeepOthers.echoes.length !== 1) throw new Error('pierce boom queues echo');
  if (!pierceKeepOthers.splits || pierceKeepOthers.splits.length !== 2) throw new Error('pierce boom queues split');
  if (pierceKeepOthers.seed !== 1) throw new Error('pierce boom keeps seed off thick');
  if (pierceKeepOthers.hasteReady !== true) throw new Error('pierce does not spend haste');
  if (pierceKeepOthers.dashBoomReady !== true) throw new Error('pierce does not spend 冲爆');
  if (pierceKeepOthers.suckReady) throw new Error('pierce boom spends suck as real boom');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (PIERCE_L !== 200) throw new Error('PIERCE_L 200');
  if (PIERCE_W !== 40) throw new Error('PIERCE_W 40');

  const guan = makeState();
  resetRoom(guan, 22, false);
  if (guan.roomName !== '贯廊' || guan.roomId !== 'guanlang') throw new Error('guanlang load');
  if (guan.toast !== TOAST.pierceRoom) throw new Error('贯廊 intro');
  if (guan.roomW !== 960 || guan.roomH !== 400) throw new Error('贯廊 size');
  if (guan.player.x !== 80 || guan.player.y !== 200) throw new Error('贯廊 spawn');
  if (guan.pierceReady) throw new Error('贯廊 pierce starts false');
  let guanStill = 0;
  let guanTide = 0;
  for (let i = 0; i < guan.waters.length; i++) {
    if (guan.waters[i].tide) guanTide += 1;
    else guanStill += 1;
  }
  if (guanStill < 1) throw new Error('贯廊 needs static 水洼');
  if (guanTide) throw new Error('贯廊 no tide');
  let guanCore = 0;
  let guanHeal = 0;
  let guanThick = 0;
  let guanPierceItem = 0;
  let guanSplitItem = 0;
  let guanDashItem = 0;
  let guanSuckItem = 0;
  let guanEchoItem = 0;
  let guanHasteItem = 0;
  let guanSeedItem = 0;
  for (let i = 0; i < guan.crates.length; i++) {
    if (guan.crates[i].loot === 'core') guanCore += 1;
    if (guan.crates[i].loot === 'heal') guanHeal += 1;
    if (guan.crates[i].thick) guanThick += 1;
  }
  for (let i = 0; i < guan.items.length; i++) {
    if (guan.items[i].kind === 'pierce') guanPierceItem += 1;
    if (guan.items[i].kind === 'split') guanSplitItem += 1;
    if (guan.items[i].kind === 'dashboom') guanDashItem += 1;
    if (guan.items[i].kind === 'suck') guanSuckItem += 1;
    if (guan.items[i].kind === 'echo') guanEchoItem += 1;
    if (guan.items[i].kind === 'haste') guanHasteItem += 1;
    if (guan.items[i].kind === 'seed') guanSeedItem += 1;
  }
  if (guanPierceItem < 1) throw new Error('贯廊 needs 贯爆');
  if (guanSplitItem || guanDashItem || guanSuckItem || guanEchoItem || guanHasteItem || guanSeedItem) {
    throw new Error('贯廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆');
  }
  if (guanCore !== 1) throw new Error('贯廊 心核');
  if (guanHeal < 1) throw new Error('贯廊 回星');
  const gBox = guan.crates.find(function (c) { return c.loot === 'core'; });
  if (!gBox || gBox.thick) throw new Error('贯廊 心核 crate is not thick');
  if (guanThick) throw new Error('贯廊 no thick crate');
  let guanHound = 0;
  let guanGuard = 0;
  let guanMoth = 0;
  let guanEater = 0;
  for (let i = 0; i < guan.enemies.length; i++) {
    if (isHound(guan.enemies[i])) guanHound += 1;
    else if (isMoth(guan.enemies[i])) guanMoth += 1;
    else if (isEater(guan.enemies[i])) guanEater += 1;
    else guanGuard += 1;
  }
  if (guanGuard !== 1 || guanHound !== 0 || guanMoth !== 0 || guanEater !== 0) {
    throw new Error('贯廊 烬卫 only');
  }
  if (inWater(guan, 80, 200) || inOil(guan, 80, 200)) throw new Error('贯廊 spawn dry');
  if (inWater(guan, 280, 200) || inOil(guan, 280, 200)) throw new Error('贯廊 贯爆 dry');
  if (inOil(guan, 860, 188) || inWater(guan, 860, 188)) throw new Error('贯廊 core dry');
  if (!inWater(guan, 450, 350)) throw new Error('贯廊 wet bag');
  if (inWater(guan, 400, 100)) throw new Error('贯廊 north shelf wet');
  for (let i = 0; i < guan.crates.length; i++) {
    const c = guan.crates[i];
    if (circleRect(guan.player.x, guan.player.y, guan.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('贯廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 480; x += 10) {
    for (let i = 0; i < guan.crates.length; i++) {
      const c = guan.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('贯廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(guan, x, y)) throw new Error('贯廊 north puddle');
      for (let i = 0; i < guan.enemies.length; i++) {
        const e = guan.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('贯廊 north enemy');
      }
    }
  }
  const gLine = guan.crates.filter(function (c) {
    const cy = c.y + c.h * 0.5;
    return Math.abs(cy - 200) < 8 && !c.loot;
  });
  if (gLine.length < 3) throw new Error('贯廊 three-crate line');
  gLine.sort(function (a, b) { return a.x - b.x; });
  for (let i = 1; i < gLine.length; i++) {
    const ax = gLine[i - 1].x + gLine[i - 1].w * 0.5;
    const bx = gLine[i].x + gLine[i].w * 0.5;
    if (bx - ax < 70) throw new Error('贯廊 crate line |Δx| >= 70');
  }
  explode(guan, 500, 200, false);
  if (!gLine[0].open) throw new Error('贯廊 plant opens crate A');
  if (gLine[1].open || gLine[2].open) throw new Error('贯廊 BLAST_R misses B/C');
  guan.pierceReady = true;
  guan.player.faceX = 1;
  guan.player.faceY = 0;
  explode(guan, 500, 200, false);
  if (!gLine[0].open || !gLine[1].open || !gLine[2].open) throw new Error('贯廊 pierce opens line');
  explode(guan, gBox.x + gBox.w * 0.5, gBox.y - 20, false);
  if (!gBox.open) throw new Error('贯廊 dry trail should open 心核');
  takeCore(guan, { x: 100, y: 100 });
  if (guan.won) throw new Error('贯廊 should not 通关');
  for (let i = 0; i < 20; i++) update(guan, 0.1);
  if (guan.roomName !== '晕廊') throw new Error('core advances to 晕廊');
  const hudGuan = makeState();
  resetRoom(hudGuan, 22, false);
  if (roomHudText(hudGuan).indexOf('贯廊 · 23/') !== 0) throw new Error('HUD 贯廊 23/38');
  const hudChong23 = makeState();
  resetRoom(hudChong23, 20, false);
  if (roomHudText(hudChong23).indexOf('冲廊 · 21/') !== 0) throw new Error('HUD 冲廊 21/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (PIERCE_L !== 200) throw new Error('PIERCE_L 200');
  if (PIERCE_W !== 40) throw new Error('PIERCE_W 40');

  const haloDry = makeState();
  resetRoom(haloDry, 0, false);
  lineCrate(haloDry, 500, 132);
  lineCrate(haloDry, 568, 200);
  lineCrate(haloDry, 500, 268);
  explode(haloDry, 500, 200, false);
  const dryA = haloDry.crates[haloDry.crates.length - 3];
  const dryB = haloDry.crates[haloDry.crates.length - 2];
  const dryC = haloDry.crates[haloDry.crates.length - 1];
  if (dryA.open || dryB.open || dryC.open) throw new Error('BLAST_R misses halo ring crates');

  const haloOn = makeState();
  resetRoom(haloOn, 0, false);
  lineCrate(haloOn, 500, 132);
  lineCrate(haloOn, 568, 200);
  lineCrate(haloOn, 500, 268);
  haloOn.haloReady = true;
  explode(haloOn, 500, 200, false);
  if (haloOn.haloReady !== false) throw new Error('haloReady consumed on boom');
  if (!haloOn.crates[haloOn.crates.length - 3].open
    || !haloOn.crates[haloOn.crates.length - 2].open
    || !haloOn.crates[haloOn.crates.length - 1].open) {
    throw new Error('halo opens three ring crates');
  }
  if (String(haloOn.toast).indexOf(TOAST.haloUse) < 0) throw new Error('炸成圈了');

  const haloHole = makeState();
  resetRoom(haloHole, 0, false);
  lineCrate(haloHole, 500, 200);
  haloHole.haloReady = true;
  explode(haloHole, 500, 200, false);
  if (haloHole.crates[haloHole.crates.length - 1].open) throw new Error('halo hole crate stays closed');

  const haloSafe = makeState();
  resetRoom(haloSafe, 0, false);
  haloSafe.player.x = 500;
  haloSafe.player.y = 200;
  haloSafe.player.hearts = 3;
  haloSafe.haloReady = true;
  explode(haloSafe, 500, 200, false);
  if (haloSafe.player.hearts !== 3) throw new Error('halo hole is safe');

  const haloRim = makeState();
  resetRoom(haloRim, 0, false);
  haloRim.player.x = 560;
  haloRim.player.y = 200;
  haloRim.player.hearts = 3;
  haloRim.haloReady = true;
  explode(haloRim, 500, 200, false);
  if (haloRim.player.hearts >= 3) throw new Error('halo rim hurts');

  const haloSelf = makeState();
  resetRoom(haloSelf, 0, false);
  haloSelf.player.x = 500;
  haloSelf.player.y = 200;
  haloSelf.player.hearts = 3;
  explode(haloSelf, 500, 200, false);
  if (haloSelf.player.hearts >= 3) throw new Error('own blast still hurts without halo');

  const haloWet = makeState();
  resetRoom(haloWet, 0, false);
  haloWet.haloReady = true;
  haloWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(haloWet, 120, 120, false);
  if (!haloWet.sparks[0].wet) throw new Error('halo wet spark');
  for (let i = 0; i < 24; i++) update(haloWet, 0.1);
  if (haloWet.haloReady !== true) throw new Error('wet keeps 环爆');
  if (haloWet.stats.booms !== 0) throw new Error('wet halo no boom');

  const haloOnce = makeState();
  resetRoom(haloOnce, 0, false);
  lineCrate(haloOnce, 500, 132);
  lineCrate(haloOnce, 568, 200);
  lineCrate(haloOnce, 500, 268);
  haloOnce.haloReady = true;
  explode(haloOnce, 100, 100, false);
  if (haloOnce.haloReady) throw new Error('first boom spends halo');
  explode(haloOnce, 500, 200, false);
  if (haloOnce.crates[haloOnce.crates.length - 3].open
    || haloOnce.crates[haloOnce.crates.length - 2].open
    || haloOnce.crates[haloOnce.crates.length - 1].open) {
    throw new Error('second boom is filled BLAST_R');
  }

  const haloKeepDrop = makeState();
  resetRoom(haloKeepDrop, 0, false);
  haloKeepDrop.haloReady = true;
  dropSpark(haloKeepDrop, 200, 200, false);
  if (haloKeepDrop.haloReady !== true) throw new Error('dropSpark keeps 环爆');
  haloKeepDrop.player.x = 80;
  haloKeepDrop.player.y = 80;
  haloKeepDrop.input.dash = true;
  update(haloKeepDrop, 0.016);
  if (haloKeepDrop.haloReady !== true) throw new Error('dash keeps 环爆');
  haloKeepDrop.player.dashT = 0;
  haloKeepDrop.player.dashCd = 0;
  haloKeepDrop.hitstop = 0;
  haloKeepDrop.dashBoomReady = true;
  haloKeepDrop.input.dash = true;
  update(haloKeepDrop, 0.016);
  if (haloKeepDrop.haloReady !== true) throw new Error('冲爆 keeps 环爆');
  if (haloKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const haloSatKeep = makeState();
  resetRoom(haloSatKeep, 0, false);
  haloSatKeep.splitReady = true;
  haloSatKeep.player.faceX = 1;
  haloSatKeep.player.faceY = 0;
  explode(haloSatKeep, 400, 200, false);
  haloSatKeep.haloReady = true;
  haloSatKeep.echoReady = true;
  haloSatKeep.splitReady = true;
  haloSatKeep.suckReady = true;
  haloSatKeep.seed = 1;
  for (let i = 0; i < 10; i++) update(haloSatKeep, 0.05);
  if (haloSatKeep.haloReady !== true) throw new Error('satellite keeps halo');
  if (haloSatKeep.splitReady !== true) throw new Error('satellite keeps split with halo');
  if (haloSatKeep.echoReady !== true) throw new Error('satellite keeps echo with halo');
  if (haloSatKeep.suckReady !== true) throw new Error('satellite keeps suck with halo');
  if (haloSatKeep.seed !== 1) throw new Error('satellite keeps seed with halo');

  const haloEchoKeep = makeState();
  resetRoom(haloEchoKeep, 0, false);
  haloEchoKeep.echoReady = true;
  explode(haloEchoKeep, 400, 200, false);
  haloEchoKeep.haloReady = true;
  for (let i = 0; i < 12; i++) update(haloEchoKeep, 0.05);
  if (haloEchoKeep.haloReady !== true) throw new Error('echo boom keeps halo');

  const haloPick = makeState();
  resetRoom(haloPick, 0, false);
  if (haloPick.haloReady) throw new Error('halo starts false');
  haloPick.items.push({ kind: 'halo', x: haloPick.player.x, y: haloPick.player.y, r: 10, taken: false });
  update(haloPick, 0.016);
  if (haloPick.haloReady !== true) throw new Error('pick 环爆');
  if (haloPick.toast !== TOAST.haloGet) throw new Error('捡到环爆 pick');

  const haloThick = makeState();
  resetRoom(haloThick, 0, false);
  lineCrate(haloThick, 560, 200, true);
  haloThick.haloReady = true;
  explode(haloThick, 500, 200, false);
  if (haloThick.crates[haloThick.crates.length - 1].open) throw new Error('halo skips thick crate');
  if (haloThick.haloReady) throw new Error('halo still spends on thick miss');

  function testFoe(x, y) {
    return {
      x: x, y: y, r: ENEMY_R, hp: ENEMY_HP, hitT: 0, frostT: 0,
      shoveT: 0, shoveVx: 0, shoveVy: 0,
      kind: NAMES.enemy, faceX: 1, faceY: 0, flutter: 0,
    };
  }

  const frostOn = makeState();
  resetRoom(frostOn, 0, false);
  frostOn.enemies.push(testFoe(500, 200));
  frostOn.frostReady = true;
  frostOn.dashBoomReady = true;
  frostOn.hasteReady = true;
  explode(frostOn, 500, 200, false);
  if (frostOn.frostReady !== false) throw new Error('frostReady consumed on boom');
  if (!(frostOn.enemies[0].frostT > 0)) throw new Error('frost sets frostT');
  if (Math.abs(frostOn.enemies[0].frostT - FROST_T) > 1e-9) throw new Error('frostT is FROST_T');
  if (frostOn.enemies[0].hp !== ENEMY_HP - 1) throw new Error('frost still damages');
  if (frostOn.toast !== TOAST.frostUse) throw new Error('冻住了');
  if (frostOn.dashBoomReady !== true) throw new Error('frost boom keeps 冲爆');
  if (frostOn.hasteReady !== true) throw new Error('frost boom keeps 急燃');

  const frostFar = makeState();
  resetRoom(frostFar, 0, false);
  frostFar.enemies.push(testFoe(800, 200));
  frostFar.frostReady = true;
  explode(frostFar, 100, 100, false);
  if (frostFar.frostReady) throw new Error('first boom spends frost');
  if (frostFar.enemies[0].frostT > 0) throw new Error('miss does not freeze');
  if (frostFar.toast !== TOAST.frostUse) throw new Error('冻住了 even on miss');
  explode(frostFar, 800, 200, false);
  if (frostFar.enemies[0].frostT > 0) throw new Error('second boom is not frost');

  const frostWet = makeState();
  resetRoom(frostWet, 0, false);
  frostWet.frostReady = true;
  frostWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(frostWet, 120, 120, false);
  if (!frostWet.sparks[0].wet) throw new Error('frost wet spark');
  for (let i = 0; i < 24; i++) update(frostWet, 0.1);
  if (frostWet.frostReady !== true) throw new Error('wet keeps 霜爆');
  if (frostWet.stats.booms !== 0) throw new Error('wet frost no boom');

  const frostKeepDrop = makeState();
  resetRoom(frostKeepDrop, 0, false);
  frostKeepDrop.frostReady = true;
  dropSpark(frostKeepDrop, 200, 200, false);
  if (frostKeepDrop.frostReady !== true) throw new Error('dropSpark keeps 霜爆');
  frostKeepDrop.player.x = 80;
  frostKeepDrop.player.y = 80;
  frostKeepDrop.input.dash = true;
  update(frostKeepDrop, 0.016);
  if (frostKeepDrop.frostReady !== true) throw new Error('dash keeps 霜爆');
  frostKeepDrop.player.dashT = 0;
  frostKeepDrop.player.dashCd = 0;
  frostKeepDrop.hitstop = 0;
  frostKeepDrop.dashBoomReady = true;
  frostKeepDrop.input.dash = true;
  update(frostKeepDrop, 0.016);
  if (frostKeepDrop.frostReady !== true) throw new Error('冲爆 keeps 霜爆');
  if (frostKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const frostSatKeep = makeState();
  resetRoom(frostSatKeep, 0, false);
  frostSatKeep.enemies.push(testFoe(400, 280));
  frostSatKeep.splitReady = true;
  frostSatKeep.player.faceX = 1;
  frostSatKeep.player.faceY = 0;
  explode(frostSatKeep, 400, 200, false);
  frostSatKeep.frostReady = true;
  frostSatKeep.echoReady = true;
  frostSatKeep.splitReady = true;
  frostSatKeep.suckReady = true;
  frostSatKeep.seed = 1;
  frostSatKeep.haloReady = true;
  frostSatKeep.pierceReady = true;
  for (let i = 0; i < 10; i++) update(frostSatKeep, 0.05);
  if (frostSatKeep.frostReady !== true) throw new Error('satellite keeps frost');
  if (frostSatKeep.enemies[0].frostT > 0) throw new Error('satellite does not apply frost');
  if (frostSatKeep.splitReady !== true) throw new Error('satellite keeps split with frost');
  if (frostSatKeep.echoReady !== true) throw new Error('satellite keeps echo with frost');
  if (frostSatKeep.suckReady !== true) throw new Error('satellite keeps suck with frost');
  if (frostSatKeep.seed !== 1) throw new Error('satellite keeps seed with frost');
  if (frostSatKeep.haloReady !== true) throw new Error('satellite keeps halo with frost');
  if (frostSatKeep.pierceReady !== true) throw new Error('satellite keeps pierce with frost');

  const frostEchoKeep = makeState();
  resetRoom(frostEchoKeep, 0, false);
  frostEchoKeep.enemies.push(testFoe(400, 200));
  frostEchoKeep.echoReady = true;
  explode(frostEchoKeep, 400, 200, false);
  frostEchoKeep.frostReady = true;
  frostEchoKeep.enemies[0].frostT = 0;
  for (let i = 0; i < 12; i++) update(frostEchoKeep, 0.05);
  if (frostEchoKeep.frostReady !== true) throw new Error('echo boom keeps frost');
  if (frostEchoKeep.enemies[0].frostT > 0) throw new Error('echo boom does not apply frost');

  const frostPick = makeState();
  resetRoom(frostPick, 0, false);
  if (frostPick.frostReady) throw new Error('frost starts false');
  frostPick.items.push({ kind: 'frost', x: frostPick.player.x, y: frostPick.player.y, r: 10, taken: false });
  update(frostPick, 0.016);
  if (frostPick.frostReady !== true) throw new Error('pick 霜爆');
  if (frostPick.toast !== TOAST.frostGet) throw new Error('捡到霜爆 pick');

  const frostBump = makeState();
  resetRoom(frostBump, 0, false);
  frostBump.enemies.push(testFoe(400, 200));
  frostBump.frostReady = true;
  frostBump.player.x = 80;
  frostBump.player.y = 80;
  explode(frostBump, 400, 200, false);
  if (!(frostBump.enemies[0].frostT > 0)) throw new Error('frost bump setup');
  frostBump.player.x = frostBump.enemies[0].x;
  frostBump.player.y = frostBump.enemies[0].y;
  frostBump.player.hearts = 3;
  frostBump.player.inv = 0;
  frostBump.player.dashT = 0;
  update(frostBump, 0.016);
  if (frostBump.player.hearts !== 3) throw new Error('frosted guard does not bump');
  frostBump.player.x = 80;
  frostBump.player.y = 80;
  frostBump.player.inv = 0;
  for (let i = 0; i < 20; i++) update(frostBump, 0.1);
  if (frostBump.enemies[0].frostT > 0) throw new Error('frost expires');
  frostBump.player.x = frostBump.enemies[0].x;
  frostBump.player.y = frostBump.enemies[0].y;
  frostBump.player.hearts = 3;
  frostBump.player.inv = 0;
  frostBump.player.dashT = 0;
  update(frostBump, 0.016);
  if (frostBump.player.hearts >= 3) throw new Error('after frost bump hurts');

  const shoveOn = makeState();
  resetRoom(shoveOn, 0, false);
  shoveOn.enemies.push(testFoe(500, 200));
  shoveOn.shoveReady = true;
  shoveOn.dashBoomReady = true;
  shoveOn.hasteReady = true;
  explode(shoveOn, 500, 200, false);
  if (shoveOn.shoveReady !== false) throw new Error('shoveReady consumed on boom');
  if (!(shoveOn.enemies[0].shoveT > 0)) throw new Error('shove sets shoveT');
  if (Math.abs(shoveOn.enemies[0].shoveT - SHOVE_T) > 1e-9) throw new Error('shoveT is SHOVE_T');
  if (shoveOn.enemies[0].hp !== ENEMY_HP - 1) throw new Error('shove still damages');
  if (shoveOn.toast !== TOAST.shoveUse) throw new Error('推开了');
  if (shoveOn.dashBoomReady !== true) throw new Error('shove boom keeps 冲爆');
  if (shoveOn.hasteReady !== true) throw new Error('shove boom keeps 急燃');

  const shoveFar = makeState();
  resetRoom(shoveFar, 0, false);
  shoveFar.enemies.push(testFoe(800, 200));
  shoveFar.shoveReady = true;
  explode(shoveFar, 100, 100, false);
  if (shoveFar.shoveReady) throw new Error('first boom spends shove');
  if (shoveFar.enemies[0].shoveT > 0) throw new Error('miss does not shove');
  if (shoveFar.toast !== TOAST.shoveUse) throw new Error('推开了 even on miss');
  explode(shoveFar, 800, 200, false);
  if (shoveFar.enemies[0].shoveT > 0) throw new Error('second boom is not shove');

  const shoveWet = makeState();
  resetRoom(shoveWet, 0, false);
  shoveWet.shoveReady = true;
  shoveWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(shoveWet, 120, 120, false);
  if (!shoveWet.sparks[0].wet) throw new Error('shove wet spark');
  for (let i = 0; i < 24; i++) update(shoveWet, 0.1);
  if (shoveWet.shoveReady !== true) throw new Error('wet keeps 推爆');
  if (shoveWet.stats.booms !== 0) throw new Error('wet shove no boom');

  const shoveKeepDrop = makeState();
  resetRoom(shoveKeepDrop, 0, false);
  shoveKeepDrop.shoveReady = true;
  dropSpark(shoveKeepDrop, 200, 200, false);
  if (shoveKeepDrop.shoveReady !== true) throw new Error('dropSpark keeps 推爆');
  shoveKeepDrop.player.x = 80;
  shoveKeepDrop.player.y = 80;
  shoveKeepDrop.input.dash = true;
  update(shoveKeepDrop, 0.016);
  if (shoveKeepDrop.shoveReady !== true) throw new Error('dash keeps 推爆');
  shoveKeepDrop.player.dashT = 0;
  shoveKeepDrop.player.dashCd = 0;
  shoveKeepDrop.hitstop = 0;
  shoveKeepDrop.dashBoomReady = true;
  shoveKeepDrop.input.dash = true;
  update(shoveKeepDrop, 0.016);
  if (shoveKeepDrop.shoveReady !== true) throw new Error('冲爆 keeps 推爆');
  if (shoveKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const shoveSatKeep = makeState();
  resetRoom(shoveSatKeep, 0, false);
  shoveSatKeep.enemies.push(testFoe(400, 280));
  shoveSatKeep.splitReady = true;
  shoveSatKeep.player.faceX = 1;
  shoveSatKeep.player.faceY = 0;
  explode(shoveSatKeep, 400, 200, false);
  shoveSatKeep.shoveReady = true;
  shoveSatKeep.echoReady = true;
  shoveSatKeep.splitReady = true;
  shoveSatKeep.suckReady = true;
  shoveSatKeep.seed = 1;
  shoveSatKeep.haloReady = true;
  shoveSatKeep.pierceReady = true;
  shoveSatKeep.frostReady = true;
  for (let i = 0; i < 10; i++) update(shoveSatKeep, 0.05);
  if (shoveSatKeep.shoveReady !== true) throw new Error('satellite keeps shove');
  if (shoveSatKeep.enemies[0].shoveT > 0) throw new Error('satellite does not apply shove');
  if (shoveSatKeep.splitReady !== true) throw new Error('satellite keeps split with shove');
  if (shoveSatKeep.echoReady !== true) throw new Error('satellite keeps echo with shove');
  if (shoveSatKeep.suckReady !== true) throw new Error('satellite keeps suck with shove');
  if (shoveSatKeep.seed !== 1) throw new Error('satellite keeps seed with shove');
  if (shoveSatKeep.haloReady !== true) throw new Error('satellite keeps halo with shove');
  if (shoveSatKeep.pierceReady !== true) throw new Error('satellite keeps pierce with shove');
  if (shoveSatKeep.frostReady !== true) throw new Error('satellite keeps frost with shove');

  const shoveEchoKeep = makeState();
  resetRoom(shoveEchoKeep, 0, false);
  shoveEchoKeep.enemies.push(testFoe(400, 200));
  shoveEchoKeep.echoReady = true;
  explode(shoveEchoKeep, 400, 200, false);
  shoveEchoKeep.shoveReady = true;
  shoveEchoKeep.enemies[0].shoveT = 0;
  for (let i = 0; i < 12; i++) update(shoveEchoKeep, 0.05);
  if (shoveEchoKeep.shoveReady !== true) throw new Error('echo boom keeps shove');
  if (shoveEchoKeep.enemies[0].shoveT > 0) throw new Error('echo boom does not apply shove');

  const shovePick = makeState();
  resetRoom(shovePick, 0, false);
  if (shovePick.shoveReady) throw new Error('shove starts false');
  shovePick.items.push({ kind: 'shove', x: shovePick.player.x, y: shovePick.player.y, r: 10, taken: false });
  update(shovePick, 0.016);
  if (shovePick.shoveReady !== true) throw new Error('pick 推爆');
  if (shovePick.toast !== TOAST.shoveGet) throw new Error('捡到推爆 pick');

  const shoveMe = makeState();
  resetRoom(shoveMe, 0, false);
  shoveMe.shoveReady = true;
  shoveMe.player.x = 400;
  shoveMe.player.y = 200;
  shoveMe.player.dashT = 0;
  explode(shoveMe, 400, 200, false);
  if (!(shoveMe.player.shoveT > 0)) throw new Error('player inside boom gets shoveT');
  if (Math.abs(shoveMe.player.shoveT - SHOVE_T) > 1e-9) throw new Error('player shoveT is SHOVE_T');

  const shoveDash = makeState();
  resetRoom(shoveDash, 0, false);
  shoveDash.shoveReady = true;
  shoveDash.player.x = 400;
  shoveDash.player.y = 200;
  shoveDash.player.dashT = DASH_TIME;
  explode(shoveDash, 400, 200, false);
  if (shoveDash.player.shoveT > 0) throw new Error('dash i-frame skips player shove');
  if (shoveDash.shoveReady) throw new Error('dash boom still spends shove');

  const shoveBump = makeState();
  resetRoom(shoveBump, 0, false);
  shoveBump.enemies.push(testFoe(500, 200));
  shoveBump.shoveReady = true;
  shoveBump.player.x = 80;
  shoveBump.player.y = 80;
  explode(shoveBump, 470, 200, false);
  if (!(shoveBump.enemies[0].shoveT > 0)) throw new Error('shove bump setup');
  shoveBump.hitstop = 0;
  shoveBump.embers.length = 0;
  shoveBump.player.x = shoveBump.enemies[0].x;
  shoveBump.player.y = shoveBump.enemies[0].y;
  shoveBump.player.hearts = 3;
  shoveBump.player.inv = 0;
  shoveBump.player.dashT = 0;
  update(shoveBump, 0.016);
  if (shoveBump.player.hearts !== 3) throw new Error('shoving guard does not bump');
  shoveBump.player.x = 80;
  shoveBump.player.y = 80;
  shoveBump.player.inv = 0;
  for (let i = 0; i < 10; i++) update(shoveBump, 0.1);
  if (shoveBump.enemies[0].shoveT > 0) throw new Error('shove expires');
  shoveBump.hitstop = 0;
  shoveBump.embers.length = 0;
  shoveBump.player.x = shoveBump.enemies[0].x;
  shoveBump.player.y = shoveBump.enemies[0].y;
  shoveBump.player.hearts = 3;
  shoveBump.player.inv = 0;
  shoveBump.player.dashT = 0;
  update(shoveBump, 0.016);
  if (shoveBump.player.hearts >= 3) throw new Error('after shove bump hurts');

  const baitOn = makeState();
  resetRoom(baitOn, 0, false);
  baitOn.baitReady = true;
  baitOn.dashBoomReady = true;
  baitOn.hasteReady = true;
  explode(baitOn, 200, 200, false);
  if (baitOn.baitReady !== false) throw new Error('baitReady consumed on boom');
  if (!baitOn.baits || baitOn.baits.length !== 1) throw new Error('plants one bait');
  if (baitOn.baits[0].x !== 200 || baitOn.baits[0].y !== 200) throw new Error('bait at blast');
  if (Math.abs(baitOn.baits[0].t - BAIT_T) > 1e-9) throw new Error('bait t is BAIT_T');
  if (baitOn.toast !== TOAST.baitUse) throw new Error('诱出来了');
  if (baitOn.dashBoomReady !== true) throw new Error('bait boom keeps 冲爆');
  if (baitOn.hasteReady !== true) throw new Error('bait boom keeps 急燃');

  const baitWet = makeState();
  resetRoom(baitWet, 0, false);
  baitWet.baitReady = true;
  baitWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(baitWet, 120, 120, false);
  if (!baitWet.sparks[0].wet) throw new Error('bait wet spark');
  for (let i = 0; i < 24; i++) update(baitWet, 0.1);
  if (baitWet.baitReady !== true) throw new Error('wet keeps 诱爆');
  if (baitWet.stats.booms !== 0) throw new Error('wet bait no boom');
  if (baitWet.baits.length !== 0) throw new Error('wet does not plant bait');

  const baitKeepDrop = makeState();
  resetRoom(baitKeepDrop, 0, false);
  baitKeepDrop.baitReady = true;
  dropSpark(baitKeepDrop, 200, 200, false);
  if (baitKeepDrop.baitReady !== true) throw new Error('dropSpark keeps 诱爆');
  baitKeepDrop.player.x = 80;
  baitKeepDrop.player.y = 80;
  baitKeepDrop.input.dash = true;
  update(baitKeepDrop, 0.016);
  if (baitKeepDrop.baitReady !== true) throw new Error('dash keeps 诱爆');
  baitKeepDrop.player.dashT = 0;
  baitKeepDrop.player.dashCd = 0;
  baitKeepDrop.hitstop = 0;
  baitKeepDrop.dashBoomReady = true;
  baitKeepDrop.input.dash = true;
  update(baitKeepDrop, 0.016);
  if (baitKeepDrop.baitReady !== true) throw new Error('冲爆 keeps 诱爆');
  if (baitKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const baitSatKeep = makeState();
  resetRoom(baitSatKeep, 0, false);
  baitSatKeep.splitReady = true;
  baitSatKeep.player.faceX = 1;
  baitSatKeep.player.faceY = 0;
  explode(baitSatKeep, 400, 200, false);
  baitSatKeep.baitReady = true;
  baitSatKeep.echoReady = true;
  baitSatKeep.splitReady = true;
  baitSatKeep.suckReady = true;
  baitSatKeep.seed = 1;
  baitSatKeep.haloReady = true;
  baitSatKeep.pierceReady = true;
  baitSatKeep.frostReady = true;
  baitSatKeep.shoveReady = true;
  for (let i = 0; i < 10; i++) update(baitSatKeep, 0.05);
  if (baitSatKeep.baitReady !== true) throw new Error('satellite keeps bait');
  if (baitSatKeep.baits.length !== 0) throw new Error('satellite does not plant bait');
  if (baitSatKeep.splitReady !== true) throw new Error('satellite keeps split with bait');
  if (baitSatKeep.echoReady !== true) throw new Error('satellite keeps echo with bait');
  if (baitSatKeep.suckReady !== true) throw new Error('satellite keeps suck with bait');
  if (baitSatKeep.seed !== 1) throw new Error('satellite keeps seed with bait');
  if (baitSatKeep.haloReady !== true) throw new Error('satellite keeps halo with bait');
  if (baitSatKeep.pierceReady !== true) throw new Error('satellite keeps pierce with bait');
  if (baitSatKeep.frostReady !== true) throw new Error('satellite keeps frost with bait');
  if (baitSatKeep.shoveReady !== true) throw new Error('satellite keeps shove with bait');

  const baitEchoKeep = makeState();
  resetRoom(baitEchoKeep, 0, false);
  baitEchoKeep.echoReady = true;
  explode(baitEchoKeep, 400, 200, false);
  baitEchoKeep.baitReady = true;
  for (let i = 0; i < 12; i++) update(baitEchoKeep, 0.05);
  if (baitEchoKeep.baitReady !== true) throw new Error('echo boom keeps bait');
  if (baitEchoKeep.baits.length !== 0) throw new Error('echo boom does not plant bait');

  const baitForkKeep = makeState();
  resetRoom(baitForkKeep, 0, false);
  baitForkKeep.baitReady = true;
  baitForkKeep.frostReady = true;
  baitForkKeep.shoveReady = true;
  baitForkKeep.echoReady = true;
  baitForkKeep.splitReady = true;
  explode(baitForkKeep, 200, 200, false, false, false, { fork: true });
  if (baitForkKeep.baitReady !== true) throw new Error('forked boom keeps bait');
  if (baitForkKeep.baits.length !== 0) throw new Error('forked boom does not plant bait');
  if (baitForkKeep.frostReady !== true) throw new Error('forked boom keeps frost');
  if (baitForkKeep.shoveReady !== true) throw new Error('forked boom keeps shove');
  if (baitForkKeep.echoReady !== true) throw new Error('forked boom keeps echo');
  if (baitForkKeep.splitReady !== true) throw new Error('forked boom keeps split');

  const baitPick = makeState();
  resetRoom(baitPick, 0, false);
  if (baitPick.baitReady) throw new Error('bait starts false');
  baitPick.items.push({ kind: 'bait', x: baitPick.player.x, y: baitPick.player.y, r: 10, taken: false });
  update(baitPick, 0.016);
  if (baitPick.baitReady !== true) throw new Error('pick 诱爆');
  if (baitPick.toast !== TOAST.baitGet) throw new Error('捡到诱爆 pick');

  const baitWalk = makeState();
  resetRoom(baitWalk, 0, false);
  baitWalk.player.x = 80;
  baitWalk.player.y = 80;
  baitWalk.baits.push({ x: 200, y: 200, t: BAIT_T });
  baitWalk.enemies.push(testFoe(200 + 80, 200));
  const baitWalkX = baitWalk.enemies[0].x;
  const baitWalkBooms = baitWalk.stats.booms;
  baitWalk.hitstop = 0;
  for (let i = 0; i < 6; i++) update(baitWalk, 0.05);
  if (!(baitWalk.enemies[0].x < baitWalkX)) throw new Error('烬卫 walks toward bait');
  for (let i = 0; i < 50; i++) {
    baitWalk.hitstop = 0;
    update(baitWalk, 0.1);
  }
  if (baitWalk.baits.length !== 0) throw new Error('bait pops after BAIT_T');
  if (!(baitWalk.stats.booms > baitWalkBooms)) throw new Error('bait pop boom');

  const baitWater = makeState();
  resetRoom(baitWater, 0, false);
  baitWater.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  baitWater.baits.push({ x: 120, y: 120, t: BAIT_T });
  const baitWaterBooms = baitWater.stats.booms;
  updateBaits(baitWater, 0.016);
  if (baitWater.baits.length !== 0) throw new Error('bait in water fizzles');
  if (baitWater.stats.booms !== baitWaterBooms) throw new Error('bait in water does not explode');

  const baitPop = makeState();
  resetRoom(baitPop, 0, false);
  baitPop.player.x = 80;
  baitPop.player.y = 80;
  baitPop.baitReady = true;
  baitPop.frostReady = true;
  baitPop.shoveReady = true;
  baitPop.echoReady = true;
  baitPop.splitReady = true;
  baitPop.haloReady = true;
  baitPop.pierceReady = true;
  baitPop.suckReady = true;
  baitPop.seed = 1;
  baitPop.baits.push({ x: 200, y: 200, t: 0 });
  const baitPopBooms = baitPop.stats.booms;
  updateBaits(baitPop, 0.016);
  if (baitPop.baits.length !== 0) throw new Error('t=0 bait pops');
  if (!(baitPop.stats.booms > baitPopBooms)) throw new Error('t=0 bait explodes');
  if (baitPop.baitReady !== true) throw new Error('bait pop keeps baitReady');
  if (baitPop.frostReady !== true) throw new Error('bait pop keeps frost');
  if (baitPop.shoveReady !== true) throw new Error('bait pop keeps shove');
  if (baitPop.echoReady !== true) throw new Error('bait pop keeps echo');
  if (baitPop.splitReady !== true) throw new Error('bait pop keeps split');
  if (baitPop.haloReady !== true) throw new Error('bait pop keeps halo');
  if (baitPop.pierceReady !== true) throw new Error('bait pop keeps pierce');
  if (baitPop.suckReady !== true) throw new Error('bait pop keeps suck');
  if (baitPop.seed !== 1) throw new Error('bait pop keeps seed');

  const boltOn = makeState();
  resetRoom(boltOn, 0, false);
  boltOn.enemies.push(testFoe(400 + 120, 200));
  boltOn.enemies.push(testFoe(400 + 140, 200));
  boltOn.enemies.push(testFoe(400 + 160, 200));
  boltOn.boltReady = true;
  boltOn.dashBoomReady = true;
  boltOn.hasteReady = true;
  explode(boltOn, 400, 200, false);
  if (boltOn.boltReady !== false) throw new Error('boltReady consumed on boom');
  if (boltOn.enemies[0].hp !== ENEMY_HP - 1) throw new Error('bolt 120 1 dmg');
  if (boltOn.enemies[1].hp !== ENEMY_HP - 1) throw new Error('bolt 140 1 dmg');
  if (boltOn.enemies[2].hp !== ENEMY_HP - 1) throw new Error('bolt 160 1 dmg');
  if (!boltOn.bolts || boltOn.bolts.length !== 3) throw new Error('three bolt arcs');
  if (boltOn.toast !== TOAST.boltUse) throw new Error('雷劈了');
  if (boltOn.dashBoomReady !== true) throw new Error('bolt boom keeps 冲爆');
  if (boltOn.hasteReady !== true) throw new Error('bolt boom keeps 急燃');

  const boltInside = makeState();
  resetRoom(boltInside, 0, false);
  boltInside.enemies.push(testFoe(400, 200));
  const insideHp = boltInside.enemies[0].hp;
  boltInside.boltReady = true;
  explode(boltInside, 400, 200, false);
  if (boltInside.boltReady !== false) throw new Error('empty outer ring still spends bolt');
  if (boltInside.enemies[0].hp !== insideHp - 1) throw new Error('inside blast still 1 from boom not bolt');
  if (boltInside.bolts && boltInside.bolts.length) throw new Error('no arc on blast-hit foe');
  if (boltInside.toast === TOAST.boltUse) throw new Error('no 雷劈了 when 0 arcs');

  const boltWet = makeState();
  resetRoom(boltWet, 0, false);
  boltWet.boltReady = true;
  boltWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(boltWet, 120, 120, false);
  if (!boltWet.sparks[0].wet) throw new Error('bolt wet spark');
  for (let i = 0; i < 24; i++) update(boltWet, 0.1);
  if (boltWet.boltReady !== true) throw new Error('wet keeps 雷爆');
  if (boltWet.stats.booms !== 0) throw new Error('wet bolt no boom');
  if (boltWet.bolts && boltWet.bolts.length) throw new Error('wet does not zap');

  const boltKeepDrop = makeState();
  resetRoom(boltKeepDrop, 0, false);
  boltKeepDrop.boltReady = true;
  dropSpark(boltKeepDrop, 200, 200, false);
  if (boltKeepDrop.boltReady !== true) throw new Error('dropSpark keeps 雷爆');
  boltKeepDrop.player.x = 80;
  boltKeepDrop.player.y = 80;
  boltKeepDrop.input.dash = true;
  update(boltKeepDrop, 0.016);
  if (boltKeepDrop.boltReady !== true) throw new Error('dash keeps 雷爆');
  boltKeepDrop.player.dashT = 0;
  boltKeepDrop.player.dashCd = 0;
  boltKeepDrop.hitstop = 0;
  boltKeepDrop.dashBoomReady = true;
  boltKeepDrop.input.dash = true;
  update(boltKeepDrop, 0.016);
  if (boltKeepDrop.boltReady !== true) throw new Error('冲爆 keeps 雷爆');
  if (boltKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const boltSatKeep = makeState();
  resetRoom(boltSatKeep, 0, false);
  boltSatKeep.splitReady = true;
  boltSatKeep.player.faceX = 1;
  boltSatKeep.player.faceY = 0;
  explode(boltSatKeep, 400, 200, false);
  boltSatKeep.boltReady = true;
  boltSatKeep.echoReady = true;
  boltSatKeep.splitReady = true;
  boltSatKeep.suckReady = true;
  boltSatKeep.seed = 1;
  boltSatKeep.haloReady = true;
  boltSatKeep.pierceReady = true;
  boltSatKeep.frostReady = true;
  boltSatKeep.shoveReady = true;
  boltSatKeep.baitReady = true;
  for (let i = 0; i < 10; i++) update(boltSatKeep, 0.05);
  if (boltSatKeep.boltReady !== true) throw new Error('satellite keeps bolt');
  if (boltSatKeep.bolts && boltSatKeep.bolts.length) throw new Error('satellite does not arc');
  if (boltSatKeep.splitReady !== true) throw new Error('satellite keeps split with bolt');
  if (boltSatKeep.echoReady !== true) throw new Error('satellite keeps echo with bolt');
  if (boltSatKeep.suckReady !== true) throw new Error('satellite keeps suck with bolt');
  if (boltSatKeep.seed !== 1) throw new Error('satellite keeps seed with bolt');
  if (boltSatKeep.haloReady !== true) throw new Error('satellite keeps halo with bolt');
  if (boltSatKeep.pierceReady !== true) throw new Error('satellite keeps pierce with bolt');
  if (boltSatKeep.frostReady !== true) throw new Error('satellite keeps frost with bolt');
  if (boltSatKeep.shoveReady !== true) throw new Error('satellite keeps shove with bolt');
  if (boltSatKeep.baitReady !== true) throw new Error('satellite keeps bait with bolt');

  const boltEchoKeep = makeState();
  resetRoom(boltEchoKeep, 0, false);
  boltEchoKeep.echoReady = true;
  explode(boltEchoKeep, 400, 200, false);
  boltEchoKeep.boltReady = true;
  for (let i = 0; i < 12; i++) update(boltEchoKeep, 0.05);
  if (boltEchoKeep.boltReady !== true) throw new Error('echo boom keeps bolt');
  if (boltEchoKeep.bolts && boltEchoKeep.bolts.length) throw new Error('echo boom does not arc');

  const boltForkKeep = makeState();
  resetRoom(boltForkKeep, 0, false);
  boltForkKeep.boltReady = true;
  boltForkKeep.baitReady = true;
  boltForkKeep.frostReady = true;
  boltForkKeep.shoveReady = true;
  boltForkKeep.echoReady = true;
  boltForkKeep.splitReady = true;
  explode(boltForkKeep, 200, 200, false, false, false, { fork: true });
  if (boltForkKeep.boltReady !== true) throw new Error('forked boom keeps bolt');
  if (boltForkKeep.bolts && boltForkKeep.bolts.length) throw new Error('forked boom does not arc');
  if (boltForkKeep.baitReady !== true) throw new Error('forked boom keeps bait');
  if (boltForkKeep.frostReady !== true) throw new Error('forked boom keeps frost');
  if (boltForkKeep.shoveReady !== true) throw new Error('forked boom keeps shove');
  if (boltForkKeep.echoReady !== true) throw new Error('forked boom keeps echo');
  if (boltForkKeep.splitReady !== true) throw new Error('forked boom keeps split');

  const boltPick = makeState();
  resetRoom(boltPick, 0, false);
  if (boltPick.boltReady) throw new Error('bolt starts false');
  boltPick.items.push({ kind: 'bolt', x: boltPick.player.x, y: boltPick.player.y, r: 10, taken: false });
  update(boltPick, 0.016);
  if (boltPick.boltReady !== true) throw new Error('pick 雷爆');
  if (boltPick.toast !== TOAST.boltGet) throw new Error('捡到雷爆 pick');

  const boltTick = makeState();
  resetRoom(boltTick, 0, false);
  boltTick.bolts.push({ x0: 0, y0: 0, x1: 10, y1: 10, t: 0.22 });
  updateBolts(boltTick, 0.22);
  if (boltTick.bolts.length !== 0) throw new Error('bolts expire');

  const tripOn = makeState();
  resetRoom(tripOn, 0, false);
  tripOn.tripReady = true;
  tripOn.dashBoomReady = true;
  tripOn.hasteReady = true;
  explode(tripOn, 400, 200, false);
  if (tripOn.tripReady !== false) throw new Error('tripReady consumed on boom');
  if (!tripOn.trips || tripOn.trips.length !== 1) throw new Error('plants one trip');
  if (tripOn.trips[0].x !== 400 || tripOn.trips[0].y !== 200) throw new Error('trip at boom');
  if (Math.abs(tripOn.trips[0].t - TRIP_LIFE) > 1e-9) throw new Error('trip t is TRIP_LIFE');
  if (tripOn.toast !== TOAST.tripPlant) throw new Error('绊线埋了');
  if (tripOn.dashBoomReady !== true) throw new Error('trip boom keeps 冲爆');
  if (tripOn.hasteReady !== true) throw new Error('trip boom keeps 急燃');

  const tripWet = makeState();
  resetRoom(tripWet, 0, false);
  tripWet.tripReady = true;
  tripWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(tripWet, 120, 120, false);
  if (!tripWet.sparks[0].wet) throw new Error('trip wet spark');
  for (let i = 0; i < 24; i++) update(tripWet, 0.1);
  if (tripWet.tripReady !== true) throw new Error('wet keeps 绊爆');
  if (tripWet.stats.booms !== 0) throw new Error('wet trip no boom');
  if (tripWet.trips && tripWet.trips.length) throw new Error('wet does not plant trip');

  const tripKeepDrop = makeState();
  resetRoom(tripKeepDrop, 0, false);
  tripKeepDrop.tripReady = true;
  dropSpark(tripKeepDrop, 200, 200, false);
  if (tripKeepDrop.tripReady !== true) throw new Error('dropSpark keeps 绊爆');
  tripKeepDrop.player.x = 80;
  tripKeepDrop.player.y = 80;
  tripKeepDrop.input.dash = true;
  update(tripKeepDrop, 0.016);
  if (tripKeepDrop.tripReady !== true) throw new Error('dash keeps 绊爆');
  tripKeepDrop.player.dashT = 0;
  tripKeepDrop.player.dashCd = 0;
  tripKeepDrop.hitstop = 0;
  tripKeepDrop.dashBoomReady = true;
  tripKeepDrop.input.dash = true;
  update(tripKeepDrop, 0.016);
  if (tripKeepDrop.tripReady !== true) throw new Error('冲爆 keeps 绊爆');
  if (tripKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends');

  const tripSatKeep = makeState();
  resetRoom(tripSatKeep, 0, false);
  tripSatKeep.splitReady = true;
  tripSatKeep.player.faceX = 1;
  tripSatKeep.player.faceY = 0;
  explode(tripSatKeep, 400, 200, false);
  tripSatKeep.tripReady = true;
  tripSatKeep.boltReady = true;
  tripSatKeep.baitReady = true;
  tripSatKeep.echoReady = true;
  tripSatKeep.splitReady = true;
  for (let i = 0; i < 10; i++) update(tripSatKeep, 0.05);
  if (tripSatKeep.tripReady !== true) throw new Error('satellite keeps trip');
  if (tripSatKeep.trips && tripSatKeep.trips.length) throw new Error('satellite does not plant trip');
  if (tripSatKeep.boltReady !== true) throw new Error('satellite keeps bolt with trip');
  if (tripSatKeep.baitReady !== true) throw new Error('satellite keeps bait with trip');

  const tripEchoKeep = makeState();
  resetRoom(tripEchoKeep, 0, false);
  tripEchoKeep.echoReady = true;
  explode(tripEchoKeep, 400, 200, false);
  tripEchoKeep.tripReady = true;
  for (let i = 0; i < 12; i++) update(tripEchoKeep, 0.05);
  if (tripEchoKeep.tripReady !== true) throw new Error('echo boom keeps trip');
  if (tripEchoKeep.trips && tripEchoKeep.trips.length) throw new Error('echo boom does not plant trip');

  const tripForkKeep = makeState();
  resetRoom(tripForkKeep, 0, false);
  tripForkKeep.tripReady = true;
  tripForkKeep.boltReady = true;
  tripForkKeep.baitReady = true;
  explode(tripForkKeep, 200, 200, false, false, false, { fork: true });
  if (tripForkKeep.tripReady !== true) throw new Error('forked boom keeps trip');
  if (tripForkKeep.trips && tripForkKeep.trips.length) throw new Error('forked boom does not plant trip');
  if (tripForkKeep.boltReady !== true) throw new Error('forked boom keeps bolt with trip');
  if (tripForkKeep.baitReady !== true) throw new Error('forked boom keeps bait with trip');

  const tripPick = makeState();
  resetRoom(tripPick, 0, false);
  if (tripPick.tripReady) throw new Error('trip starts false');
  tripPick.items.push({ kind: 'trip', x: tripPick.player.x, y: tripPick.player.y, r: 10, taken: false });
  update(tripPick, 0.016);
  if (tripPick.tripReady !== true) throw new Error('pick 绊爆');
  if (tripPick.toast !== TOAST.tripGet) throw new Error('捡到绊爆 pick');

  const tripHit = makeState();
  resetRoom(tripHit, 0, false);
  tripHit.trips.push({ x: 400, y: 200, t: TRIP_LIFE });
  tripHit.enemies.push(testFoe(400, 200));
  tripHit.tripReady = true;
  tripHit.boltReady = true;
  tripHit.baitReady = true;
  const tripHp = tripHit.enemies[0].hp;
  const tripBooms = tripHit.stats.booms;
  updateTrips(tripHit, 0.016);
  if (tripHit.trips.length !== 0) throw new Error('trip pops on enemy');
  if (!(tripHit.stats.booms > tripBooms)) throw new Error('trip hot boom');
  if (tripHit.enemies[0].hp !== tripHp - 2) throw new Error('trip hot boom 2 dmg');
  if (tripHit.toast !== TOAST.tripPop) throw new Error('绊住了');
  if (tripHit.tripReady !== true) throw new Error('trip pop keeps tripReady');
  if (tripHit.boltReady !== true) throw new Error('trip pop keeps bolt');
  if (tripHit.baitReady !== true) throw new Error('trip pop keeps bait');

  const tripSelf = makeState();
  resetRoom(tripSelf, 0, false);
  tripSelf.trips.push({ x: tripSelf.player.x, y: tripSelf.player.y, t: TRIP_LIFE });
  tripSelf.player.inv = 0;
  tripSelf.player.dashT = 0;
  const selfHp = tripSelf.player.hearts;
  updateTrips(tripSelf, 0.016);
  if (tripSelf.trips.length !== 0) throw new Error('player trips');
  if (tripSelf.player.hearts !== selfHp - 1) throw new Error('own trip hurts');
  if (tripSelf.toast !== TOAST.tripSelf) throw new Error('踩到绊线');

  const tripDashSkip = makeState();
  resetRoom(tripDashSkip, 0, false);
  tripDashSkip.trips.push({ x: tripDashSkip.player.x, y: tripDashSkip.player.y, t: TRIP_LIFE });
  tripDashSkip.player.inv = 0;
  tripDashSkip.player.dashT = DASH_TIME;
  const dashSkipBooms = tripDashSkip.stats.booms;
  updateTrips(tripDashSkip, 0.016);
  if (tripDashSkip.trips.length !== 1) throw new Error('dash i-frame skips trip');
  if (tripDashSkip.stats.booms !== dashSkipBooms) throw new Error('dash i-frame no trip boom');

  const tripExp = makeState();
  resetRoom(tripExp, 0, false);
  tripExp.trips.push({ x: 200, y: 200, t: 0.01 });
  const expBooms = tripExp.stats.booms;
  updateTrips(tripExp, 0.02);
  if (tripExp.trips.length !== 0) throw new Error('trip expires');
  if (tripExp.stats.booms !== expBooms) throw new Error('expire no boom');

  const delayOn = makeState();
  resetRoom(delayOn, 0, false);
  delayOn.delayReady = true;
  delayOn.dashBoomReady = true;
  delayOn.hasteReady = true;
  delayOn.tripReady = true;
  explode(delayOn, 400, 200, false);
  if (delayOn.delayReady !== false) throw new Error('delayReady consumed on boom');
  if (!delayOn.delays || delayOn.delays.length !== 1) throw new Error('plants one delay');
  if (delayOn.delays[0].x !== 400 || delayOn.delays[0].y !== 200) throw new Error('delay at boom');
  if (Math.abs(delayOn.delays[0].t - DELAY_T) > 1e-9) throw new Error('delay t is DELAY_T');
  if (delayOn.toast !== TOAST.delayPlant) throw new Error('迟线埋了');
  if (delayOn.dashBoomReady !== true) throw new Error('delay boom keeps 冲爆');
  if (delayOn.hasteReady !== true) throw new Error('delay boom keeps 急燃');
  if (delayOn.tripReady !== false) throw new Error('trip still spends with delay');
  delayOn.enemies.push(testFoe(400, 200));
  delayOn.player.x = 80;
  delayOn.player.y = 80;
  delayOn.player.inv = 1;
  delayOn.delayReady = true;
  delayOn.tripReady = true;
  delayOn.boltReady = true;
  const delayCookHp = delayOn.enemies[0].hp;
  const delayCookBooms = delayOn.stats.booms;
  updateDelays(delayOn, DELAY_T + 0.01);
  if (delayOn.delays.length !== 0) throw new Error('delay cooks off');
  if (!(delayOn.stats.booms > delayCookBooms)) throw new Error('delay hot boom');
  if (delayOn.enemies[0].hp !== delayCookHp - 2) throw new Error('delay hot 2 dmg');
  if (delayOn.toast !== TOAST.delayPop) throw new Error('迟爆来了');
  if (delayOn.delayReady !== true) throw new Error('delay pop keeps delayReady');
  if (delayOn.tripReady !== true) throw new Error('delay pop keeps trip');
  if (delayOn.boltReady !== true) throw new Error('delay pop keeps bolt');

  const delayWet = makeState();
  resetRoom(delayWet, 0, false);
  delayWet.delayReady = true;
  delayWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(delayWet, 120, 120, false);
  if (!delayWet.sparks[0].wet) throw new Error('delay wet spark');
  for (let i = 0; i < 24; i++) update(delayWet, 0.1);
  if (delayWet.delayReady !== true) throw new Error('wet keeps 迟爆');
  if (delayWet.stats.booms !== 0) throw new Error('wet delay no boom');
  if (delayWet.delays && delayWet.delays.length) throw new Error('wet does not plant delay');

  const delayKeepDrop = makeState();
  resetRoom(delayKeepDrop, 0, false);
  delayKeepDrop.delayReady = true;
  dropSpark(delayKeepDrop, 200, 200, false);
  if (delayKeepDrop.delayReady !== true) throw new Error('dropSpark keeps 迟爆');
  delayKeepDrop.player.x = 80;
  delayKeepDrop.player.y = 80;
  delayKeepDrop.input.dash = true;
  update(delayKeepDrop, 0.016);
  if (delayKeepDrop.delayReady !== true) throw new Error('dash keeps 迟爆');
  delayKeepDrop.player.dashT = 0;
  delayKeepDrop.player.dashCd = 0;
  delayKeepDrop.hitstop = 0;
  delayKeepDrop.dashBoomReady = true;
  delayKeepDrop.input.dash = true;
  update(delayKeepDrop, 0.016);
  if (delayKeepDrop.delayReady !== true) throw new Error('冲爆 keeps 迟爆');
  if (delayKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends with delay');

  const delaySatKeep = makeState();
  resetRoom(delaySatKeep, 0, false);
  delaySatKeep.splitReady = true;
  delaySatKeep.player.faceX = 1;
  delaySatKeep.player.faceY = 0;
  explode(delaySatKeep, 400, 200, false);
  delaySatKeep.delayReady = true;
  delaySatKeep.tripReady = true;
  delaySatKeep.boltReady = true;
  delaySatKeep.baitReady = true;
  delaySatKeep.echoReady = true;
  delaySatKeep.splitReady = true;
  for (let i = 0; i < 10; i++) update(delaySatKeep, 0.05);
  if (delaySatKeep.delayReady !== true) throw new Error('satellite keeps delay');
  if (delaySatKeep.delays && delaySatKeep.delays.length) throw new Error('satellite does not plant delay');
  if (delaySatKeep.tripReady !== true) throw new Error('satellite keeps trip with delay');
  if (delaySatKeep.boltReady !== true) throw new Error('satellite keeps bolt with delay');

  const delayEchoKeep = makeState();
  resetRoom(delayEchoKeep, 0, false);
  delayEchoKeep.echoReady = true;
  explode(delayEchoKeep, 400, 200, false);
  delayEchoKeep.delayReady = true;
  for (let i = 0; i < 12; i++) update(delayEchoKeep, 0.05);
  if (delayEchoKeep.delayReady !== true) throw new Error('echo boom keeps delay');
  if (delayEchoKeep.delays && delayEchoKeep.delays.length) throw new Error('echo boom does not plant delay');

  const delayForkKeep = makeState();
  resetRoom(delayForkKeep, 0, false);
  delayForkKeep.delayReady = true;
  delayForkKeep.tripReady = true;
  delayForkKeep.boltReady = true;
  explode(delayForkKeep, 200, 200, false, false, false, { fork: true });
  if (delayForkKeep.delayReady !== true) throw new Error('forked boom keeps delay');
  if (delayForkKeep.delays && delayForkKeep.delays.length) throw new Error('forked boom does not plant delay');
  if (delayForkKeep.tripReady !== true) throw new Error('forked boom keeps trip with delay');
  if (delayForkKeep.boltReady !== true) throw new Error('forked boom keeps bolt with delay');

  const delayPick = makeState();
  resetRoom(delayPick, 0, false);
  if (delayPick.delayReady) throw new Error('delay starts false');
  delayPick.items.push({ kind: 'delay', x: delayPick.player.x, y: delayPick.player.y, r: 10, taken: false });
  update(delayPick, 0.016);
  if (delayPick.delayReady !== true) throw new Error('pick 迟爆');
  if (delayPick.toast !== TOAST.delayGet) throw new Error('捡到迟爆 pick');

  const delayFizz = makeState();
  resetRoom(delayFizz, 0, false);
  delayFizz.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  delayFizz.delays.push({ x: 120, y: 120, t: DELAY_T });
  delayFizz.delayReady = false;
  const fizzBooms = delayFizz.stats.booms;
  updateDelays(delayFizz, 0.016);
  if (delayFizz.delays.length !== 0) throw new Error('delay fizzles in water');
  if (delayFizz.stats.booms !== fizzBooms) throw new Error('fizzle no boom');
  if (delayFizz.toast !== TOAST.delayFizzle) throw new Error('迟线熄了');
  if (delayFizz.delayReady !== false) throw new Error('fizzle no refund');

  const bounceOn = makeState();
  resetRoom(bounceOn, 0, false);
  bounceOn.bounceReady = true;
  bounceOn.dashBoomReady = true;
  bounceOn.hasteReady = true;
  bounceOn.delayReady = true;
  bounceOn.tripReady = true;
  bounceOn.player.x = 80;
  bounceOn.player.y = 80;
  bounceOn.player.inv = 1;
  bounceOn.enemies = [testFoe(520, 110), testFoe(520, 290)];
  const bounceHp0 = bounceOn.enemies[0].hp;
  const bounceHp1 = bounceOn.enemies[1].hp;
  explode(bounceOn, 400, 200, false);
  if (bounceOn.bounceReady !== false) throw new Error('bounceReady consumed on boom');
  if (bounceOn.delayReady !== false) throw new Error('delay still spends with bounce');
  if (bounceOn.tripReady !== false) throw new Error('trip still spends with bounce');
  if (bounceOn.dashBoomReady !== true) throw new Error('bounce boom keeps 冲爆');
  if (bounceOn.hasteReady !== true) throw new Error('bounce boom keeps 急燃');
  if (bounceOn.toast !== TOAST.bounceUse) throw new Error('跳过去了');
  if (!(bounceOn.enemies[0].hp < bounceHp0 || bounceOn.enemies[0].hp <= 0)) throw new Error('bounce NE hot dmg');
  if (!(bounceOn.enemies[1].hp < bounceHp1 || bounceOn.enemies[1].hp <= 0)) throw new Error('bounce SE hot dmg');

  const bounceWet = makeState();
  resetRoom(bounceWet, 0, false);
  bounceWet.bounceReady = true;
  bounceWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(bounceWet, 120, 120, false);
  if (!bounceWet.sparks[0].wet) throw new Error('bounce wet spark');
  for (let i = 0; i < 24; i++) update(bounceWet, 0.1);
  if (bounceWet.bounceReady !== true) throw new Error('wet keeps 跳爆');
  if (bounceWet.stats.booms !== 0) throw new Error('wet bounce no boom');

  const bounceKeepDrop = makeState();
  resetRoom(bounceKeepDrop, 0, false);
  bounceKeepDrop.bounceReady = true;
  dropSpark(bounceKeepDrop, 200, 200, false);
  if (bounceKeepDrop.bounceReady !== true) throw new Error('dropSpark keeps 跳爆');
  bounceKeepDrop.player.x = 80;
  bounceKeepDrop.player.y = 80;
  bounceKeepDrop.input.dash = true;
  update(bounceKeepDrop, 0.016);
  if (bounceKeepDrop.bounceReady !== true) throw new Error('dash keeps 跳爆');
  bounceKeepDrop.player.dashT = 0;
  bounceKeepDrop.player.dashCd = 0;
  bounceKeepDrop.hitstop = 0;
  bounceKeepDrop.dashBoomReady = true;
  bounceKeepDrop.input.dash = true;
  update(bounceKeepDrop, 0.016);
  if (bounceKeepDrop.bounceReady !== true) throw new Error('冲爆 keeps 跳爆');
  if (bounceKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends with bounce');

  const bounceSatKeep = makeState();
  resetRoom(bounceSatKeep, 0, false);
  bounceSatKeep.splitReady = true;
  bounceSatKeep.player.faceX = 1;
  bounceSatKeep.player.faceY = 0;
  explode(bounceSatKeep, 400, 200, false);
  bounceSatKeep.bounceReady = true;
  bounceSatKeep.delayReady = true;
  bounceSatKeep.tripReady = true;
  bounceSatKeep.boltReady = true;
  bounceSatKeep.baitReady = true;
  bounceSatKeep.echoReady = true;
  bounceSatKeep.splitReady = true;
  for (let i = 0; i < 10; i++) update(bounceSatKeep, 0.05);
  if (bounceSatKeep.bounceReady !== true) throw new Error('satellite keeps bounce');
  if (bounceSatKeep.delayReady !== true) throw new Error('satellite keeps delay with bounce');
  if (bounceSatKeep.tripReady !== true) throw new Error('satellite keeps trip with bounce');
  if (bounceSatKeep.boltReady !== true) throw new Error('satellite keeps bolt with bounce');

  const bounceEchoKeep = makeState();
  resetRoom(bounceEchoKeep, 0, false);
  bounceEchoKeep.echoReady = true;
  explode(bounceEchoKeep, 400, 200, false);
  bounceEchoKeep.bounceReady = true;
  for (let i = 0; i < 12; i++) update(bounceEchoKeep, 0.05);
  if (bounceEchoKeep.bounceReady !== true) throw new Error('echo boom keeps bounce');

  const bounceForkKeep = makeState();
  resetRoom(bounceForkKeep, 0, false);
  bounceForkKeep.bounceReady = true;
  bounceForkKeep.delayReady = true;
  bounceForkKeep.tripReady = true;
  bounceForkKeep.boltReady = true;
  explode(bounceForkKeep, 200, 200, false, false, false, { fork: true });
  if (bounceForkKeep.bounceReady !== true) throw new Error('forked boom keeps bounce');
  if (bounceForkKeep.delayReady !== true) throw new Error('forked boom keeps delay with bounce');
  if (bounceForkKeep.tripReady !== true) throw new Error('forked boom keeps trip with bounce');
  if (bounceForkKeep.boltReady !== true) throw new Error('forked boom keeps bolt with bounce');

  const bouncePick = makeState();
  resetRoom(bouncePick, 0, false);
  if (bouncePick.bounceReady) throw new Error('bounce starts false');
  bouncePick.items.push({ kind: 'bounce', x: bouncePick.player.x, y: bouncePick.player.y, r: 10, taken: false });
  update(bouncePick, 0.016);
  if (bouncePick.bounceReady !== true) throw new Error('pick 跳爆');
  if (bouncePick.toast !== TOAST.bounceGet) throw new Error('捡到跳爆 pick');

  const rollOn = makeState();
  resetRoom(rollOn, 0, false);
  rollOn.rollReady = true;
  rollOn.dashBoomReady = true;
  rollOn.hasteReady = true;
  rollOn.bounceReady = true;
  rollOn.delayReady = true;
  rollOn.player.x = 80;
  rollOn.player.y = 80;
  rollOn.player.inv = 1;
  rollOn.player.faceX = 1;
  rollOn.player.faceY = 0;
  rollOn.enemies = [testFoe(430, 200), testFoe(520, 200), testFoe(610, 200)];
  const rollHp0 = rollOn.enemies[0].hp;
  const rollHp1 = rollOn.enemies[1].hp;
  const rollHp2 = rollOn.enemies[2].hp;
  explode(rollOn, 340, 200, false);
  if (rollOn.rollReady !== false) throw new Error('rollReady consumed on boom');
  if (rollOn.bounceReady !== false) throw new Error('bounce still spends with roll');
  if (rollOn.delayReady !== false) throw new Error('delay still spends with roll');
  if (rollOn.dashBoomReady !== true) throw new Error('roll boom keeps 冲爆');
  if (rollOn.hasteReady !== true) throw new Error('roll boom keeps 急燃');
  if (rollOn.toast !== TOAST.rollUse) throw new Error('卷出去了');
  if (!rollOn.rolls || rollOn.rolls.length !== 3) throw new Error('queues ROLL_N hops');
  if (Math.abs(rollOn.rolls[0].x - 430) > 1e-6 || Math.abs(rollOn.rolls[0].t - ROLL_DT) > 1e-9) throw new Error('roll hop 1');
  if (Math.abs(rollOn.rolls[1].x - 520) > 1e-6 || Math.abs(rollOn.rolls[1].t - ROLL_DT * 2) > 1e-9) throw new Error('roll hop 2');
  if (Math.abs(rollOn.rolls[2].x - 610) > 1e-6 || Math.abs(rollOn.rolls[2].t - ROLL_DT * 3) > 1e-9) throw new Error('roll hop 3');
  for (let i = 0; i < 3; i++) {
    rollOn.hitstop = 0;
    updateRolls(rollOn, ROLL_DT + 0.01);
  }
  if (rollOn.rolls.length !== 0) throw new Error('roll hops fire');
  if (!(rollOn.enemies[0].hp < rollHp0 || rollOn.enemies[0].hp <= 0)) throw new Error('roll hop1 hot dmg');
  if (!(rollOn.enemies[1].hp < rollHp1 || rollOn.enemies[1].hp <= 0)) throw new Error('roll hop2 hot dmg');
  if (!(rollOn.enemies[2].hp < rollHp2 || rollOn.enemies[2].hp <= 0)) throw new Error('roll hop3 hot dmg');

  const rollTick = makeState();
  resetRoom(rollTick, 0, false);
  rollTick.rollReady = true;
  rollTick.player.x = 80;
  rollTick.player.y = 80;
  rollTick.player.inv = 1;
  rollTick.player.faceX = 1;
  rollTick.player.faceY = 0;
  rollTick.enemies = [testFoe(430, 200), testFoe(520, 200), testFoe(610, 200)];
  const tickHp0 = rollTick.enemies[0].hp;
  const tickHp1 = rollTick.enemies[1].hp;
  const tickHp2 = rollTick.enemies[2].hp;
  explode(rollTick, 340, 200, false);
  if (rollTick.rollReady !== false) throw new Error('rollTick consumed');
  if (!rollTick.rolls || rollTick.rolls.length !== 3) throw new Error('rollTick queues 3');
  if (rollTick.toast !== TOAST.rollUse) throw new Error('卷出去了 tick');
  for (let i = 0; i < 40; i++) {
    rollTick.hitstop = 0;
    update(rollTick, 0.016);
  }
  if (!(rollTick.enemies[0].hp < tickHp0 || rollTick.enemies[0].hp <= 0)) throw new Error('roll update hop1');
  if (!(rollTick.enemies[1].hp < tickHp1 || rollTick.enemies[1].hp <= 0)) throw new Error('roll update hop2');
  if (!(rollTick.enemies[2].hp < tickHp2 || rollTick.enemies[2].hp <= 0)) throw new Error('roll update hop3');

  const rollWet = makeState();
  resetRoom(rollWet, 0, false);
  rollWet.rollReady = true;
  rollWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(rollWet, 120, 120, false);
  if (!rollWet.sparks[0].wet) throw new Error('roll wet spark');
  for (let i = 0; i < 24; i++) update(rollWet, 0.1);
  if (rollWet.rollReady !== true) throw new Error('wet keeps 卷爆');
  if (rollWet.stats.booms !== 0) throw new Error('wet roll no boom');
  if (rollWet.rolls && rollWet.rolls.length) throw new Error('wet does not queue roll');

  const rollKeepDrop = makeState();
  resetRoom(rollKeepDrop, 0, false);
  rollKeepDrop.rollReady = true;
  dropSpark(rollKeepDrop, 200, 200, false);
  if (rollKeepDrop.rollReady !== true) throw new Error('dropSpark keeps 卷爆');
  rollKeepDrop.player.x = 80;
  rollKeepDrop.player.y = 80;
  rollKeepDrop.input.dash = true;
  update(rollKeepDrop, 0.016);
  if (rollKeepDrop.rollReady !== true) throw new Error('dash keeps 卷爆');
  rollKeepDrop.player.dashT = 0;
  rollKeepDrop.player.dashCd = 0;
  rollKeepDrop.hitstop = 0;
  rollKeepDrop.dashBoomReady = true;
  rollKeepDrop.input.dash = true;
  update(rollKeepDrop, 0.016);
  if (rollKeepDrop.rollReady !== true) throw new Error('冲爆 keeps 卷爆');
  if (rollKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends with roll');

  const rollSatKeep = makeState();
  resetRoom(rollSatKeep, 0, false);
  rollSatKeep.splitReady = true;
  rollSatKeep.player.faceX = 1;
  rollSatKeep.player.faceY = 0;
  explode(rollSatKeep, 400, 200, false);
  rollSatKeep.rollReady = true;
  rollSatKeep.bounceReady = true;
  rollSatKeep.delayReady = true;
  rollSatKeep.mirrorReady = true;
  for (let i = 0; i < 10; i++) update(rollSatKeep, 0.05);
  if (rollSatKeep.rollReady !== true) throw new Error('satellite keeps roll');
  if (rollSatKeep.rolls && rollSatKeep.rolls.length) throw new Error('satellite does not queue roll');
  if (rollSatKeep.bounceReady !== true) throw new Error('satellite keeps bounce with roll');
  if (rollSatKeep.delayReady !== true) throw new Error('satellite keeps delay with roll');
  if (rollSatKeep.mirrorReady !== true) throw new Error('satellite keeps mirror');
  if (rollSatKeep.mirrors && rollSatKeep.mirrors.length) throw new Error('satellite does not queue mirror');

  const rollEchoKeep = makeState();
  resetRoom(rollEchoKeep, 0, false);
  rollEchoKeep.echoReady = true;
  explode(rollEchoKeep, 400, 200, false);
  rollEchoKeep.rollReady = true;
  rollEchoKeep.mirrorReady = true;
  for (let i = 0; i < 12; i++) update(rollEchoKeep, 0.05);
  if (rollEchoKeep.rollReady !== true) throw new Error('echo boom keeps roll');
  if (rollEchoKeep.rolls && rollEchoKeep.rolls.length) throw new Error('echo boom does not queue roll');
  if (rollEchoKeep.mirrorReady !== true) throw new Error('echo boom keeps mirror');
  if (rollEchoKeep.mirrors && rollEchoKeep.mirrors.length) throw new Error('echo boom does not queue mirror');

  const rollForkKeep = makeState();
  resetRoom(rollForkKeep, 0, false);
  rollForkKeep.rollReady = true;
  rollForkKeep.bounceReady = true;
  rollForkKeep.delayReady = true;
  rollForkKeep.mirrorReady = true;
  explode(rollForkKeep, 200, 200, false, false, false, { fork: true });
  if (rollForkKeep.rollReady !== true) throw new Error('forked boom keeps roll');
  if (rollForkKeep.rolls && rollForkKeep.rolls.length) throw new Error('forked boom does not queue roll');
  if (rollForkKeep.bounceReady !== true) throw new Error('forked boom keeps bounce with roll');
  if (rollForkKeep.delayReady !== true) throw new Error('forked boom keeps delay with roll');
  if (rollForkKeep.mirrorReady !== true) throw new Error('forked boom keeps mirror');
  if (rollForkKeep.mirrors && rollForkKeep.mirrors.length) throw new Error('forked boom does not queue mirror');

  const rollPick = makeState();
  resetRoom(rollPick, 0, false);
  if (rollPick.rollReady) throw new Error('roll starts false');
  rollPick.items.push({ kind: 'roll', x: rollPick.player.x, y: rollPick.player.y, r: 10, taken: false });
  update(rollPick, 0.016);
  if (rollPick.rollReady !== true) throw new Error('pick 卷爆');
  if (rollPick.toast !== TOAST.rollGet) throw new Error('捡到卷爆 pick');

  const mirrorOn = makeState();
  resetRoom(mirrorOn, 0, false);
  mirrorOn.roomW = 960;
  mirrorOn.roomH = 400;
  mirrorOn.mirrorReady = true;
  mirrorOn.dashBoomReady = true;
  mirrorOn.hasteReady = true;
  mirrorOn.rollReady = true;
  mirrorOn.bounceReady = true;
  mirrorOn.player.x = 80;
  mirrorOn.player.y = 80;
  mirrorOn.player.inv = 1;
  mirrorOn.enemies = [testFoe(680, 200), testFoe(680, 160), testFoe(680, 240)];
  const mHp0 = mirrorOn.enemies[0].hp;
  const mHp1 = mirrorOn.enemies[1].hp;
  const mHp2 = mirrorOn.enemies[2].hp;
  explode(mirrorOn, 280, 200, false);
  if (mirrorOn.mirrorReady !== false) throw new Error('mirrorReady consumed on boom');
  if (mirrorOn.rollReady !== false) throw new Error('roll still spends with mirror');
  if (mirrorOn.bounceReady !== false) throw new Error('bounce still spends with mirror');
  if (mirrorOn.dashBoomReady !== true) throw new Error('mirror boom keeps 冲爆');
  if (mirrorOn.hasteReady !== true) throw new Error('mirror boom keeps 急燃');
  if (mirrorOn.toast !== TOAST.mirrorUse) throw new Error('对岸也炸了');
  if (!mirrorOn.mirrors || mirrorOn.mirrors.length !== 1) throw new Error('queues 1 mirror');
  if (Math.abs(mirrorOn.mirrors[0].x - 680) > 1) throw new Error('mirror pending x');
  if (Math.abs(mirrorOn.mirrors[0].y - 200) > 1) throw new Error('mirror pending y');
  if (Math.abs(mirrorOn.mirrors[0].t - MIRROR_DT) > 1e-9) throw new Error('mirror dt');
  if (mirrorOn.enemies[0].hp !== mHp0 || mirrorOn.enemies[1].hp !== mHp1 || mirrorOn.enemies[2].hp !== mHp2) {
    throw new Error('mirror not instant');
  }
  mirrorOn.hitstop = 0;
  update(mirrorOn, MIRROR_DT + 0.01);
  if (mirrorOn.mirrors.length !== 0) throw new Error('mirror fires');
  if (!(mirrorOn.enemies[0].hp < mHp0 || mirrorOn.enemies[0].hp <= 0)) throw new Error('mirror hot dmg 0');
  if (!(mirrorOn.enemies[1].hp < mHp1 || mirrorOn.enemies[1].hp <= 0)) throw new Error('mirror hot dmg 1');
  if (!(mirrorOn.enemies[2].hp < mHp2 || mirrorOn.enemies[2].hp <= 0)) throw new Error('mirror hot dmg 2');

  const mirrorTick = makeState();
  resetRoom(mirrorTick, 0, false);
  mirrorTick.roomW = 960;
  mirrorTick.roomH = 400;
  mirrorTick.mirrorReady = true;
  mirrorTick.player.x = 80;
  mirrorTick.player.y = 80;
  mirrorTick.player.inv = 1;
  mirrorTick.enemies = [testFoe(680, 200), testFoe(680, 160), testFoe(680, 240)];
  const tickM0 = mirrorTick.enemies[0].hp;
  const tickM1 = mirrorTick.enemies[1].hp;
  const tickM2 = mirrorTick.enemies[2].hp;
  explode(mirrorTick, 280, 200, false);
  if (mirrorTick.mirrorReady !== false) throw new Error('mirrorTick consumed');
  if (!mirrorTick.mirrors || mirrorTick.mirrors.length !== 1) throw new Error('mirrorTick queues 1');
  if (mirrorTick.toast !== TOAST.mirrorUse) throw new Error('对岸也炸了 tick');
  for (let i = 0; i < 20; i++) {
    mirrorTick.hitstop = 0;
    update(mirrorTick, 0.016);
  }
  if (!(mirrorTick.enemies[0].hp < tickM0 || mirrorTick.enemies[0].hp <= 0)) throw new Error('mirror update dmg 0');
  if (!(mirrorTick.enemies[1].hp < tickM1 || mirrorTick.enemies[1].hp <= 0)) throw new Error('mirror update dmg 1');
  if (!(mirrorTick.enemies[2].hp < tickM2 || mirrorTick.enemies[2].hp <= 0)) throw new Error('mirror update dmg 2');

  const mirrorWet = makeState();
  resetRoom(mirrorWet, 0, false);
  mirrorWet.mirrorReady = true;
  mirrorWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(mirrorWet, 120, 120, false);
  if (!mirrorWet.sparks[0].wet) throw new Error('mirror wet spark');
  for (let i = 0; i < 24; i++) update(mirrorWet, 0.1);
  if (mirrorWet.mirrorReady !== true) throw new Error('wet keeps 镜爆');
  if (mirrorWet.stats.booms !== 0) throw new Error('wet mirror no boom');
  if (mirrorWet.mirrors && mirrorWet.mirrors.length) throw new Error('wet does not queue mirror');

  const mirrorKeepDrop = makeState();
  resetRoom(mirrorKeepDrop, 0, false);
  mirrorKeepDrop.mirrorReady = true;
  dropSpark(mirrorKeepDrop, 200, 200, false);
  if (mirrorKeepDrop.mirrorReady !== true) throw new Error('dropSpark keeps 镜爆');
  mirrorKeepDrop.player.x = 80;
  mirrorKeepDrop.player.y = 80;
  mirrorKeepDrop.input.dash = true;
  update(mirrorKeepDrop, 0.016);
  if (mirrorKeepDrop.mirrorReady !== true) throw new Error('dash keeps 镜爆');
  mirrorKeepDrop.player.dashT = 0;
  mirrorKeepDrop.player.dashCd = 0;
  mirrorKeepDrop.hitstop = 0;
  mirrorKeepDrop.dashBoomReady = true;
  mirrorKeepDrop.input.dash = true;
  update(mirrorKeepDrop, 0.016);
  if (mirrorKeepDrop.mirrorReady !== true) throw new Error('冲爆 keeps 镜爆');
  if (mirrorKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends with mirror');

  const mirrorHopKeep = makeState();
  resetRoom(mirrorHopKeep, 0, false);
  mirrorHopKeep.player.faceX = 1;
  mirrorHopKeep.player.faceY = 0;
  mirrorHopKeep.player.x = 80;
  mirrorHopKeep.player.y = 80;
  mirrorHopKeep.player.inv = 1;
  mirrorHopKeep.rollReady = true;
  explode(mirrorHopKeep, 340, 200, false);
  mirrorHopKeep.mirrorReady = true;
  for (let i = 0; i < 3; i++) {
    mirrorHopKeep.hitstop = 0;
    updateRolls(mirrorHopKeep, ROLL_DT + 0.01);
  }
  if (mirrorHopKeep.mirrorReady !== true) throw new Error('roll-hop keeps mirror');
  if (mirrorHopKeep.mirrors && mirrorHopKeep.mirrors.length) throw new Error('roll-hop does not queue mirror');

  const mirrorPick = makeState();
  resetRoom(mirrorPick, 0, false);
  if (mirrorPick.mirrorReady) throw new Error('mirror starts false');
  mirrorPick.items.push({ kind: 'mirror', x: mirrorPick.player.x, y: mirrorPick.player.y, r: 10, taken: false });
  update(mirrorPick, 0.016);
  if (mirrorPick.mirrorReady !== true) throw new Error('pick 镜爆');
  if (mirrorPick.toast !== TOAST.mirrorGet) throw new Error('捡到镜爆 pick');
  if (Math.abs(mirrorX({ roomW: 960 }, 280) - 680) > 1e-9) throw new Error('mirrorX 960');

  const spinTogether = makeState();
  resetRoom(spinTogether, 0, false);
  spinTogether.roomW = 960;
  spinTogether.roomH = 400;
  spinTogether.spinReady = true;
  spinTogether.mirrorReady = true;
  spinTogether.rollReady = true;
  spinTogether.bounceReady = true;
  spinTogether.poolReady = true;
  spinTogether.player.x = 80;
  spinTogether.player.y = 80;
  spinTogether.player.inv = 1;
  spinTogether.player.faceX = 1;
  spinTogether.player.faceY = 0;
  explode(spinTogether, 400, 200, false);
  if (spinTogether.spinReady !== false) throw new Error('spin spends with bounce/roll/mirror');
  if (spinTogether.mirrorReady !== false) throw new Error('mirror spends with spin');
  if (spinTogether.rollReady !== false) throw new Error('roll spends with spin');
  if (spinTogether.bounceReady !== false) throw new Error('bounce spends with spin');
  if (spinTogether.poolReady !== false) throw new Error('pool spends with bounce/roll/mirror/spin');
  if (!(spinTogether.waters || []).some(function (w) { return w.temp; })) throw new Error('pool plants with others');
  if (!spinTogether.spins || spinTogether.spins.length !== 4) throw new Error('spin queues with others');
  if (!spinTogether.mirrors || spinTogether.mirrors.length !== 1) throw new Error('mirror queues with spin');
  if (!spinTogether.rolls || spinTogether.rolls.length !== 3) throw new Error('roll queues with spin');

  const spinOn = makeState();
  resetRoom(spinOn, 0, false);
  spinOn.roomW = 960;
  spinOn.roomH = 400;
  spinOn.spinReady = true;
  spinOn.dashBoomReady = true;
  spinOn.hasteReady = true;
  spinOn.player.x = 80;
  spinOn.player.y = 80;
  spinOn.player.inv = 1;
  spinOn.enemies = [testFoe(400, 110), testFoe(490, 200), testFoe(400, 290), testFoe(310, 200)];
  const spHp0 = spinOn.enemies[0].hp;
  const spHp1 = spinOn.enemies[1].hp;
  const spHp2 = spinOn.enemies[2].hp;
  const spHp3 = spinOn.enemies[3].hp;
  explode(spinOn, 400, 200, false);
  if (spinOn.spinReady !== false) throw new Error('spinReady consumed on boom');
  if (spinOn.dashBoomReady !== true) throw new Error('spin boom keeps 冲爆');
  if (spinOn.hasteReady !== true) throw new Error('spin boom keeps 急燃');
  if (spinOn.toast !== TOAST.spinUse) throw new Error('旋出去了');
  if (!spinOn.spins || spinOn.spins.length !== 4) throw new Error('queues SPIN_N orbits');
  const spinSeats = [
    { x: 400, y: 110 },
    { x: 490, y: 200 },
    { x: 400, y: 290 },
    { x: 310, y: 200 },
  ];
  for (let i = 0; i < spinSeats.length; i++) {
    const seat = spinSeats[i];
    const pending = spinOn.spins.find(function (p) { return dist(p.x, p.y, seat.x, seat.y) < 2; });
    if (!pending) throw new Error('spin pending seat ' + i);
    if (Math.abs(pending.t - SPIN_DT * (pending.i + 1)) > 1e-9) throw new Error('spin dt ' + i);
  }
  if (spinOn.enemies[0].hp !== spHp0 || spinOn.enemies[1].hp !== spHp1 || spinOn.enemies[2].hp !== spHp2 || spinOn.enemies[3].hp !== spHp3) {
    throw new Error('spin not instant');
  }
  spinOn.hitstop = 0;
  update(spinOn, SPIN_DT * SPIN_N + 0.05);
  if (spinOn.spins.length !== 0) throw new Error('spin orbits fire');
  if (!(spinOn.enemies[0].hp < spHp0 || spinOn.enemies[0].hp <= 0)) throw new Error('spin hot dmg 0');
  if (!(spinOn.enemies[1].hp < spHp1 || spinOn.enemies[1].hp <= 0)) throw new Error('spin hot dmg 1');
  if (!(spinOn.enemies[2].hp < spHp2 || spinOn.enemies[2].hp <= 0)) throw new Error('spin hot dmg 2');
  if (!(spinOn.enemies[3].hp < spHp3 || spinOn.enemies[3].hp <= 0)) throw new Error('spin hot dmg 3');

  const spinTick = makeState();
  resetRoom(spinTick, 0, false);
  spinTick.roomW = 960;
  spinTick.roomH = 400;
  spinTick.spinReady = true;
  spinTick.player.x = 80;
  spinTick.player.y = 80;
  spinTick.player.inv = 1;
  spinTick.enemies = [testFoe(400, 110), testFoe(490, 200), testFoe(400, 290), testFoe(310, 200)];
  const tickS0 = spinTick.enemies[0].hp;
  const tickS1 = spinTick.enemies[1].hp;
  const tickS2 = spinTick.enemies[2].hp;
  const tickS3 = spinTick.enemies[3].hp;
  explode(spinTick, 400, 200, false);
  if (spinTick.spinReady !== false) throw new Error('spinTick consumed');
  if (!spinTick.spins || spinTick.spins.length !== 4) throw new Error('spinTick queues 4');
  if (spinTick.toast !== TOAST.spinUse) throw new Error('旋出去了 tick');
  for (let i = 0; i < 50; i++) {
    spinTick.hitstop = 0;
    update(spinTick, 0.016);
  }
  if (!(spinTick.enemies[0].hp < tickS0 || spinTick.enemies[0].hp <= 0)) throw new Error('spin update dmg 0');
  if (!(spinTick.enemies[1].hp < tickS1 || spinTick.enemies[1].hp <= 0)) throw new Error('spin update dmg 1');
  if (!(spinTick.enemies[2].hp < tickS2 || spinTick.enemies[2].hp <= 0)) throw new Error('spin update dmg 2');
  if (!(spinTick.enemies[3].hp < tickS3 || spinTick.enemies[3].hp <= 0)) throw new Error('spin update dmg 3');

  const spinWet = makeState();
  resetRoom(spinWet, 0, false);
  spinWet.spinReady = true;
  spinWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(spinWet, 120, 120, false);
  if (!spinWet.sparks[0].wet) throw new Error('spin wet spark');
  for (let i = 0; i < 24; i++) update(spinWet, 0.1);
  if (spinWet.spinReady !== true) throw new Error('wet keeps 旋爆');
  if (spinWet.stats.booms !== 0) throw new Error('wet spin no boom');
  if (spinWet.spins && spinWet.spins.length) throw new Error('wet does not queue spin');

  const spinKeepDrop = makeState();
  resetRoom(spinKeepDrop, 0, false);
  spinKeepDrop.spinReady = true;
  dropSpark(spinKeepDrop, 200, 200, false);
  if (spinKeepDrop.spinReady !== true) throw new Error('dropSpark keeps 旋爆');
  spinKeepDrop.player.x = 80;
  spinKeepDrop.player.y = 80;
  spinKeepDrop.input.dash = true;
  update(spinKeepDrop, 0.016);
  if (spinKeepDrop.spinReady !== true) throw new Error('dash keeps 旋爆');
  spinKeepDrop.player.dashT = 0;
  spinKeepDrop.player.dashCd = 0;
  spinKeepDrop.hitstop = 0;
  spinKeepDrop.dashBoomReady = true;
  spinKeepDrop.input.dash = true;
  update(spinKeepDrop, 0.016);
  if (spinKeepDrop.spinReady !== true) throw new Error('冲爆 keeps 旋爆');
  if (spinKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends with spin');

  const spinSatKeep = makeState();
  resetRoom(spinSatKeep, 0, false);
  spinSatKeep.splitReady = true;
  spinSatKeep.player.faceX = 1;
  spinSatKeep.player.faceY = 0;
  explode(spinSatKeep, 400, 200, false);
  spinSatKeep.spinReady = true;
  spinSatKeep.mirrorReady = true;
  for (let i = 0; i < 10; i++) update(spinSatKeep, 0.05);
  if (spinSatKeep.spinReady !== true) throw new Error('satellite keeps spin');
  if (spinSatKeep.spins && spinSatKeep.spins.length) throw new Error('satellite does not queue spin');
  if (spinSatKeep.mirrorReady !== true) throw new Error('satellite keeps mirror with spin');

  const spinEchoKeep = makeState();
  resetRoom(spinEchoKeep, 0, false);
  spinEchoKeep.echoReady = true;
  explode(spinEchoKeep, 400, 200, false);
  spinEchoKeep.spinReady = true;
  for (let i = 0; i < 12; i++) update(spinEchoKeep, 0.05);
  if (spinEchoKeep.spinReady !== true) throw new Error('echo boom keeps spin');
  if (spinEchoKeep.spins && spinEchoKeep.spins.length) throw new Error('echo boom does not queue spin');

  const spinForkKeep = makeState();
  resetRoom(spinForkKeep, 0, false);
  spinForkKeep.spinReady = true;
  spinForkKeep.mirrorReady = true;
  explode(spinForkKeep, 200, 200, false, false, false, { fork: true });
  if (spinForkKeep.spinReady !== true) throw new Error('forked boom keeps spin');
  if (spinForkKeep.spins && spinForkKeep.spins.length) throw new Error('forked boom does not queue spin');
  if (spinForkKeep.mirrorReady !== true) throw new Error('forked boom keeps mirror with spin');

  const spinHopKeep = makeState();
  resetRoom(spinHopKeep, 0, false);
  spinHopKeep.player.faceX = 1;
  spinHopKeep.player.faceY = 0;
  spinHopKeep.player.x = 80;
  spinHopKeep.player.y = 80;
  spinHopKeep.player.inv = 1;
  spinHopKeep.rollReady = true;
  explode(spinHopKeep, 340, 200, false);
  spinHopKeep.spinReady = true;
  for (let i = 0; i < 3; i++) {
    spinHopKeep.hitstop = 0;
    updateRolls(spinHopKeep, ROLL_DT + 0.01);
  }
  if (spinHopKeep.spinReady !== true) throw new Error('roll-hop keeps spin');
  if (spinHopKeep.spins && spinHopKeep.spins.length) throw new Error('roll-hop does not queue spin');

  const spinMirrorKeep = makeState();
  resetRoom(spinMirrorKeep, 0, false);
  spinMirrorKeep.roomW = 960;
  spinMirrorKeep.roomH = 400;
  spinMirrorKeep.player.x = 80;
  spinMirrorKeep.player.y = 80;
  spinMirrorKeep.player.inv = 1;
  spinMirrorKeep.mirrorReady = true;
  explode(spinMirrorKeep, 280, 200, false);
  spinMirrorKeep.spinReady = true;
  spinMirrorKeep.hitstop = 0;
  updateMirrors(spinMirrorKeep, MIRROR_DT + 0.01);
  if (spinMirrorKeep.spinReady !== true) throw new Error('mirror-reflection keeps spin');
  if (spinMirrorKeep.spins && spinMirrorKeep.spins.length) throw new Error('mirror-reflection does not queue spin');

  const spinPick = makeState();
  resetRoom(spinPick, 0, false);
  if (spinPick.spinReady) throw new Error('spin starts false');
  spinPick.items.push({ kind: 'spin', x: spinPick.player.x, y: spinPick.player.y, r: 10, taken: false });
  update(spinPick, 0.016);
  if (spinPick.spinReady !== true) throw new Error('pick 旋爆');
  if (spinPick.toast !== TOAST.spinGet) throw new Error('捡到旋爆 pick');

  const poolPick = makeState();
  resetRoom(poolPick, 0, false);
  if (poolPick.poolReady) throw new Error('pool starts false');
  poolPick.items.push({ kind: 'pool', x: poolPick.player.x, y: poolPick.player.y, r: 10, taken: false });
  update(poolPick, 0.016);
  if (poolPick.poolReady !== true) throw new Error('pick 洼爆');
  if (poolPick.toast !== TOAST.poolGet) throw new Error('捡到洼爆 pick');

  const poolWet = makeState();
  resetRoom(poolWet, 0, false);
  poolWet.poolReady = true;
  poolWet.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(poolWet, 120, 120, false);
  if (!poolWet.sparks[0].wet) throw new Error('pool wet spark');
  for (let i = 0; i < 24; i++) update(poolWet, 0.1);
  if (poolWet.poolReady !== true) throw new Error('wet keeps 洼爆');
  if (poolWet.stats.booms !== 0) throw new Error('wet pool no boom');
  if ((poolWet.waters || []).some(function (w) { return w.temp; })) throw new Error('wet does not plant pad');

  const poolKeepDrop = makeState();
  resetRoom(poolKeepDrop, 0, false);
  poolKeepDrop.poolReady = true;
  dropSpark(poolKeepDrop, 200, 200, false);
  if (poolKeepDrop.poolReady !== true) throw new Error('dropSpark keeps 洼爆');
  poolKeepDrop.player.x = 80;
  poolKeepDrop.player.y = 80;
  poolKeepDrop.input.dash = true;
  update(poolKeepDrop, 0.016);
  if (poolKeepDrop.poolReady !== true) throw new Error('dash keeps 洼爆');
  poolKeepDrop.player.dashT = 0;
  poolKeepDrop.player.dashCd = 0;
  poolKeepDrop.hitstop = 0;
  poolKeepDrop.dashBoomReady = true;
  poolKeepDrop.input.dash = true;
  update(poolKeepDrop, 0.016);
  if (poolKeepDrop.poolReady !== true) throw new Error('冲爆 keeps 洼爆');
  if (poolKeepDrop.dashBoomReady !== false) throw new Error('冲爆 still spends with pool');

  const yun = makeState();
  resetRoom(yun, 23, false);
  if (yun.roomName !== '晕廊' || yun.roomId !== 'yunlang') throw new Error('yunlang load');
  if (yun.toast !== TOAST.haloRoom) throw new Error('晕廊 intro');
  if (yun.roomW !== 960 || yun.roomH !== 400) throw new Error('晕廊 size');
  if (yun.player.x !== 80 || yun.player.y !== 200) throw new Error('晕廊 spawn');
  if (yun.haloReady) throw new Error('晕廊 halo starts false');
  let yunStill = 0;
  let yunTide = 0;
  for (let i = 0; i < yun.waters.length; i++) {
    if (yun.waters[i].tide) yunTide += 1;
    else yunStill += 1;
  }
  if (yunStill < 1) throw new Error('晕廊 needs static 水洼');
  if (yunTide) throw new Error('晕廊 no tide');
  let yunCore = 0;
  let yunHeal = 0;
  let yunThick = 0;
  let yunHaloItem = 0;
  let yunPierceItem = 0;
  let yunSplitItem = 0;
  let yunDashItem = 0;
  let yunSuckItem = 0;
  let yunEchoItem = 0;
  let yunHasteItem = 0;
  let yunSeedItem = 0;
  for (let i = 0; i < yun.crates.length; i++) {
    if (yun.crates[i].loot === 'core') yunCore += 1;
    if (yun.crates[i].loot === 'heal') yunHeal += 1;
    if (yun.crates[i].thick) yunThick += 1;
  }
  for (let i = 0; i < yun.items.length; i++) {
    if (yun.items[i].kind === 'halo') yunHaloItem += 1;
    if (yun.items[i].kind === 'pierce') yunPierceItem += 1;
    if (yun.items[i].kind === 'split') yunSplitItem += 1;
    if (yun.items[i].kind === 'dashboom') yunDashItem += 1;
    if (yun.items[i].kind === 'suck') yunSuckItem += 1;
    if (yun.items[i].kind === 'echo') yunEchoItem += 1;
    if (yun.items[i].kind === 'haste') yunHasteItem += 1;
    if (yun.items[i].kind === 'seed') yunSeedItem += 1;
  }
  if (yunHaloItem < 1) throw new Error('晕廊 needs 环爆');
  if (yunPierceItem || yunSplitItem || yunDashItem || yunSuckItem || yunEchoItem || yunHasteItem || yunSeedItem) {
    throw new Error('晕廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆');
  }
  if (yunCore !== 1) throw new Error('晕廊 心核');
  if (yunHeal < 1) throw new Error('晕廊 回星');
  const yunBox = yun.crates.find(function (c) { return c.loot === 'core'; });
  if (!yunBox || yunBox.thick) throw new Error('晕廊 心核 crate is not thick');
  if (yunThick) throw new Error('晕廊 no thick crate');
  let yunHound = 0;
  let yunGuard = 0;
  let yunMoth = 0;
  let yunEater = 0;
  for (let i = 0; i < yun.enemies.length; i++) {
    if (isHound(yun.enemies[i])) yunHound += 1;
    else if (isMoth(yun.enemies[i])) yunMoth += 1;
    else if (isEater(yun.enemies[i])) yunEater += 1;
    else yunGuard += 1;
  }
  if (yunGuard !== 1 || yunHound !== 0 || yunMoth !== 0 || yunEater !== 0) {
    throw new Error('晕廊 烬卫 only');
  }
  if (inWater(yun, 80, 200) || inOil(yun, 80, 200)) throw new Error('晕廊 spawn dry');
  if (inWater(yun, 280, 200) || inOil(yun, 280, 200)) throw new Error('晕廊 环爆 dry');
  if (inOil(yun, 860, 188) || inWater(yun, 860, 188)) throw new Error('晕廊 core dry');
  if (!inWater(yun, 450, 350)) throw new Error('晕廊 wet bag');
  if (inWater(yun, 400, 100)) throw new Error('晕廊 north shelf wet');
  for (let i = 0; i < yun.crates.length; i++) {
    const c = yun.crates[i];
    if (circleRect(yun.player.x, yun.player.y, yun.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('晕廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 500; x += 10) {
    for (let i = 0; i < yun.crates.length; i++) {
      const c = yun.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('晕廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(yun, x, y)) throw new Error('晕廊 north puddle');
      for (let i = 0; i < yun.enemies.length; i++) {
        const e = yun.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('晕廊 north enemy');
      }
    }
  }
  const yRing = yun.crates.filter(function (c) {
    if (c.loot) return false;
    const cx = c.x + c.w * 0.5;
    const cy = c.y + c.h * 0.5;
    const spots = [
      { x: 500, y: 132 },
      { x: 568, y: 200 },
      { x: 500, y: 268 },
    ];
    for (let i = 0; i < spots.length; i++) {
      if (dist(cx, cy, spots[i].x, spots[i].y) < 8) return true;
    }
    return false;
  });
  if (yRing.length < 3) throw new Error('晕廊 three crates near plant');
  explode(yun, 500, 200, false);
  if (yRing[0].open || yRing[1].open || yRing[2].open) throw new Error('晕廊 BLAST_R opens none');
  yun.haloReady = true;
  explode(yun, 500, 200, false);
  if (!yRing[0].open || !yRing[1].open || !yRing[2].open) throw new Error('晕廊 halo opens ring');
  explode(yun, yunBox.x + yunBox.w * 0.5, yunBox.y - 20, false);
  if (!yunBox.open) throw new Error('晕廊 dry trail should open 心核');
  takeCore(yun, { x: 100, y: 100 });
  if (yun.won) throw new Error('晕廊 should not 通关');
  for (let i = 0; i < 20; i++) update(yun, 0.1);
  if (yun.roomName !== '冻廊') throw new Error('core advances to 冻廊');
  const hudYun = makeState();
  resetRoom(hudYun, 23, false);
  if (roomHudText(hudYun).indexOf('晕廊 · 24/') !== 0) throw new Error('HUD 晕廊 24/38');
  const hudLie24 = makeState();
  resetRoom(hudLie24, 21, false);
  if (roomHudText(hudLie24).indexOf('裂廊 · 22/') !== 0) throw new Error('HUD 裂廊 22/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (RING_IN !== 40) throw new Error('RING_IN 40');
  if (RING_OUT !== 80) throw new Error('RING_OUT 80');

  const dong = makeState();
  resetRoom(dong, 24, false);
  if (dong.roomName !== '冻廊' || dong.roomId !== 'donglang') throw new Error('donglang load');
  if (dong.toast !== TOAST.frostRoom) throw new Error('冻廊 intro');
  if (dong.roomW !== 960 || dong.roomH !== 400) throw new Error('冻廊 size');
  if (dong.player.x !== 80 || dong.player.y !== 200) throw new Error('冻廊 spawn');
  if (dong.frostReady) throw new Error('冻廊 frost starts false');
  let dongStill = 0;
  let dongTide = 0;
  for (let i = 0; i < dong.waters.length; i++) {
    if (dong.waters[i].tide) dongTide += 1;
    else dongStill += 1;
  }
  if (dongStill < 1) throw new Error('冻廊 needs static 水洼');
  if (dongTide) throw new Error('冻廊 no tide');
  let dongCore = 0;
  let dongHeal = 0;
  let dongThick = 0;
  let dongFrostItem = 0;
  let dongHaloItem = 0;
  let dongPierceItem = 0;
  let dongSplitItem = 0;
  let dongDashItem = 0;
  let dongSuckItem = 0;
  let dongEchoItem = 0;
  let dongHasteItem = 0;
  let dongSeedItem = 0;
  for (let i = 0; i < dong.crates.length; i++) {
    if (dong.crates[i].loot === 'core') dongCore += 1;
    if (dong.crates[i].loot === 'heal') dongHeal += 1;
    if (dong.crates[i].thick) dongThick += 1;
  }
  for (let i = 0; i < dong.items.length; i++) {
    if (dong.items[i].kind === 'frost') dongFrostItem += 1;
    if (dong.items[i].kind === 'halo') dongHaloItem += 1;
    if (dong.items[i].kind === 'pierce') dongPierceItem += 1;
    if (dong.items[i].kind === 'split') dongSplitItem += 1;
    if (dong.items[i].kind === 'dashboom') dongDashItem += 1;
    if (dong.items[i].kind === 'suck') dongSuckItem += 1;
    if (dong.items[i].kind === 'echo') dongEchoItem += 1;
    if (dong.items[i].kind === 'haste') dongHasteItem += 1;
    if (dong.items[i].kind === 'seed') dongSeedItem += 1;
  }
  if (dongFrostItem < 1) throw new Error('冻廊 needs 霜爆');
  if (dongHaloItem || dongPierceItem || dongSplitItem || dongDashItem || dongSuckItem || dongEchoItem || dongHasteItem || dongSeedItem) {
    throw new Error('冻廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆');
  }
  if (dongCore !== 1) throw new Error('冻廊 心核');
  if (dongHeal < 1) throw new Error('冻廊 回星');
  const dongBox = dong.crates.find(function (c) { return c.loot === 'core'; });
  if (!dongBox || dongBox.thick) throw new Error('冻廊 心核 crate is not thick');
  if (dongThick) throw new Error('冻廊 no thick crate');
  let dongHound = 0;
  let dongGuard = 0;
  let dongMoth = 0;
  let dongEater = 0;
  for (let i = 0; i < dong.enemies.length; i++) {
    if (isHound(dong.enemies[i])) dongHound += 1;
    else if (isMoth(dong.enemies[i])) dongMoth += 1;
    else if (isEater(dong.enemies[i])) dongEater += 1;
    else dongGuard += 1;
  }
  if (dongGuard !== 2 || dongHound !== 0 || dongMoth !== 0 || dongEater !== 0) {
    throw new Error('冻廊 烬卫 only');
  }
  if (inWater(dong, 80, 200) || inOil(dong, 80, 200)) throw new Error('冻廊 spawn dry');
  if (inWater(dong, 260, 200) || inOil(dong, 260, 200)) throw new Error('冻廊 霜爆 dry');
  if (inOil(dong, 860, 188) || inWater(dong, 860, 188)) throw new Error('冻廊 core dry');
  if (inWater(dong, 480, 200) || inOil(dong, 480, 200)) throw new Error('冻廊 plant dry');
  if (!inWater(dong, 450, 350)) throw new Error('冻廊 wet bag');
  if (inWater(dong, 400, 100)) throw new Error('冻廊 north shelf wet');
  for (let i = 0; i < dong.crates.length; i++) {
    const c = dong.crates[i];
    if (circleRect(dong.player.x, dong.player.y, dong.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('冻廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 420; x += 10) {
    for (let i = 0; i < dong.crates.length; i++) {
      const c = dong.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('冻廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(dong, x, y)) throw new Error('冻廊 north puddle');
      for (let i = 0; i < dong.enemies.length; i++) {
        const e = dong.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('冻廊 north enemy');
      }
    }
  }
  for (let i = 0; i < dong.enemies.length; i++) {
    const e = dong.enemies[i];
    if (dist(e.x, e.y, 480, 200) > BLAST_R + e.r) throw new Error('BLAST_R at plant hits both guards');
  }
  dong.player.x = 80;
  dong.player.y = 80;
  dong.frostReady = true;
  explode(dong, 480, 200, false);
  if (dong.frostReady) throw new Error('冻廊 frost spends');
  if (!(dong.enemies[0].frostT > 0) || !(dong.enemies[1].frostT > 0)) {
    throw new Error('BLAST_R at plant hits both guards and sets frostT');
  }
  if (dong.enemies[0].hp <= 0 || dong.enemies[1].hp <= 0) throw new Error('冻廊 guards survive one hit');
  dong.player.x = dong.enemies[0].x;
  dong.player.y = dong.enemies[0].y;
  dong.player.hearts = 3;
  dong.player.inv = 0;
  dong.player.dashT = 0;
  update(dong, 0.016);
  if (dong.player.hearts !== 3) throw new Error('walking into frosted guard does not hurt');
  dong.player.x = 80;
  dong.player.y = 80;
  dong.player.inv = 0;
  for (let i = 0; i < 20; i++) update(dong, 0.1);
  if (dong.enemies[0].frostT > 0 || dong.enemies[1].frostT > 0) throw new Error('冻廊 frost expires');
  dong.player.x = dong.enemies[0].x;
  dong.player.y = dong.enemies[0].y;
  dong.player.hearts = 3;
  dong.player.inv = 0;
  dong.player.dashT = 0;
  update(dong, 0.016);
  if (dong.player.hearts >= 3) throw new Error('after frost expires bump hurts again');
  explode(dong, dongBox.x + dongBox.w * 0.5, dongBox.y - 20, false);
  if (!dongBox.open) throw new Error('冻廊 dry trail should open 心核');
  takeCore(dong, { x: 100, y: 100 });
  if (dong.won) throw new Error('冻廊 should not 通关');
  for (let i = 0; i < 20; i++) update(dong, 0.1);
  if (dong.roomName !== '推廊') throw new Error('core advances to 推廊');
  const hudDong = makeState();
  resetRoom(hudDong, 24, false);
  if (roomHudText(hudDong).indexOf('冻廊 · 25/') !== 0) throw new Error('HUD 冻廊 25/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (FROST_T !== 1.8) throw new Error('FROST_T 1.8');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');

  const tui = makeState();
  resetRoom(tui, 25, false);
  if (tui.roomName !== '推廊' || tui.roomId !== 'tuilang') throw new Error('tuilang load');
  if (tui.toast !== TOAST.shoveRoom) throw new Error('推廊 intro');
  if (tui.roomW !== 960 || tui.roomH !== 400) throw new Error('推廊 size');
  if (tui.player.x !== 80 || tui.player.y !== 200) throw new Error('推廊 spawn');
  if (tui.shoveReady) throw new Error('推廊 shove starts false');
  let tuiStill = 0;
  let tuiTide = 0;
  for (let i = 0; i < tui.waters.length; i++) {
    if (tui.waters[i].tide) tuiTide += 1;
    else tuiStill += 1;
  }
  if (tuiStill < 1) throw new Error('推廊 needs static 水洼');
  if (tuiTide) throw new Error('推廊 no tide');
  let tuiCore = 0;
  let tuiHeal = 0;
  let tuiThick = 0;
  let tuiShoveItem = 0;
  let tuiFrostItem = 0;
  let tuiHaloItem = 0;
  let tuiPierceItem = 0;
  let tuiSplitItem = 0;
  let tuiDashItem = 0;
  let tuiSuckItem = 0;
  let tuiEchoItem = 0;
  let tuiHasteItem = 0;
  let tuiSeedItem = 0;
  for (let i = 0; i < tui.crates.length; i++) {
    if (tui.crates[i].loot === 'core') tuiCore += 1;
    if (tui.crates[i].loot === 'heal') tuiHeal += 1;
    if (tui.crates[i].thick) tuiThick += 1;
  }
  for (let i = 0; i < tui.items.length; i++) {
    if (tui.items[i].kind === 'shove') tuiShoveItem += 1;
    if (tui.items[i].kind === 'frost') tuiFrostItem += 1;
    if (tui.items[i].kind === 'halo') tuiHaloItem += 1;
    if (tui.items[i].kind === 'pierce') tuiPierceItem += 1;
    if (tui.items[i].kind === 'split') tuiSplitItem += 1;
    if (tui.items[i].kind === 'dashboom') tuiDashItem += 1;
    if (tui.items[i].kind === 'suck') tuiSuckItem += 1;
    if (tui.items[i].kind === 'echo') tuiEchoItem += 1;
    if (tui.items[i].kind === 'haste') tuiHasteItem += 1;
    if (tui.items[i].kind === 'seed') tuiSeedItem += 1;
  }
  if (tuiShoveItem < 1) throw new Error('推廊 needs 推爆');
  if (tuiFrostItem || tuiHaloItem || tuiPierceItem || tuiSplitItem || tuiDashItem || tuiSuckItem || tuiEchoItem || tuiHasteItem || tuiSeedItem) {
    throw new Error('推廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆');
  }
  if (tuiCore !== 1) throw new Error('推廊 心核');
  if (tuiHeal < 1) throw new Error('推廊 回星');
  const tuiBox = tui.crates.find(function (c) { return c.loot === 'core'; });
  if (!tuiBox || tuiBox.thick) throw new Error('推廊 心核 crate is not thick');
  if (tuiThick) throw new Error('推廊 no thick crate');
  let tuiHound = 0;
  let tuiGuard = 0;
  let tuiMoth = 0;
  let tuiEater = 0;
  for (let i = 0; i < tui.enemies.length; i++) {
    if (isHound(tui.enemies[i])) tuiHound += 1;
    else if (isMoth(tui.enemies[i])) tuiMoth += 1;
    else if (isEater(tui.enemies[i])) tuiEater += 1;
    else tuiGuard += 1;
  }
  if (tuiGuard !== 2 || tuiHound !== 0 || tuiMoth !== 0 || tuiEater !== 0) {
    throw new Error('推廊 烬卫 only');
  }
  if (inWater(tui, 80, 200) || inOil(tui, 80, 200)) throw new Error('推廊 spawn dry');
  if (inWater(tui, 260, 200) || inOil(tui, 260, 200)) throw new Error('推廊 推爆 dry');
  if (inOil(tui, 860, 188) || inWater(tui, 860, 188)) throw new Error('推廊 core dry');
  if (inWater(tui, 470, 200) || inOil(tui, 470, 200)) throw new Error('推廊 plant dry');
  if (!inWater(tui, 450, 350)) throw new Error('推廊 wet bag');
  if (inWater(tui, 400, 100)) throw new Error('推廊 north shelf wet');
  for (let i = 0; i < tui.crates.length; i++) {
    const c = tui.crates[i];
    if (circleRect(tui.player.x, tui.player.y, tui.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('推廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 430; x += 10) {
    for (let i = 0; i < tui.crates.length; i++) {
      const c = tui.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('推廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(tui, x, y)) throw new Error('推廊 north puddle');
      for (let i = 0; i < tui.enemies.length; i++) {
        const e = tui.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('推廊 north enemy');
      }
    }
  }
  for (let i = 0; i < tui.enemies.length; i++) {
    const e = tui.enemies[i];
    if (dist(e.x, e.y, 470, 200) > BLAST_R + e.r) throw new Error('BLAST_R at plant hits both guards');
  }
  tui.player.x = 80;
  tui.player.y = 80;
  tui.shoveReady = true;
  const gx0 = tui.enemies[0].x;
  const gx1 = tui.enemies[1].x;
  explode(tui, 470, 200, false);
  if (tui.shoveReady) throw new Error('推廊 shove spends');
  if (!(tui.enemies[0].shoveT > 0) || !(tui.enemies[1].shoveT > 0)) {
    throw new Error('BLAST_R at plant hits both guards and sets shoveT');
  }
  if (tui.enemies[0].hp <= 0 || tui.enemies[1].hp <= 0) throw new Error('推廊 guards survive one hit');
  tui.hitstop = 0;
  tui.embers.length = 0;
  tui.player.x = tui.enemies[0].x;
  tui.player.y = tui.enemies[0].y;
  tui.player.hearts = 3;
  tui.player.inv = 0;
  tui.player.dashT = 0;
  update(tui, 0.016);
  if (tui.player.hearts !== 3) throw new Error('walking into a shoving guard does not hurt');
  tui.player.x = 80;
  tui.player.y = 80;
  tui.player.inv = 0;
  tui.hitstop = 0;
  for (let i = 0; i < 8; i++) update(tui, 0.05);
  if (!(tui.enemies[0].x > 470) || !(tui.enemies[1].x > 470)) throw new Error('guards move east of plant');
  if (!(tui.enemies[0].x > gx0) || !(tui.enemies[1].x > gx1)) throw new Error('guards slide east');
  tui.player.x = 80;
  tui.player.y = 80;
  tui.player.inv = 0;
  for (let i = 0; i < 10; i++) update(tui, 0.1);
  if (tui.enemies[0].shoveT > 0 || tui.enemies[1].shoveT > 0) throw new Error('推廊 shove expires');
  tui.hitstop = 0;
  tui.embers.length = 0;
  tui.player.x = tui.enemies[0].x;
  tui.player.y = tui.enemies[0].y;
  tui.player.hearts = 3;
  tui.player.inv = 0;
  tui.player.dashT = 0;
  update(tui, 0.016);
  if (tui.player.hearts >= 3) throw new Error('after shove expires bump hurts again');
  explode(tui, tuiBox.x + tuiBox.w * 0.5, tuiBox.y - 20, false);
  if (!tuiBox.open) throw new Error('推廊 dry trail should open 心核');
  takeCore(tui, { x: 100, y: 100 });
  if (tui.won) throw new Error('推廊 should not 通关');
  for (let i = 0; i < 20; i++) update(tui, 0.1);
  if (tui.roomName !== '诱廊') throw new Error('core advances to 诱廊');
  const hudTui = makeState();
  resetRoom(hudTui, 25, false);
  if (roomHudText(hudTui).indexOf('推廊 · 26/') !== 0) throw new Error('HUD 推廊 26/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (SHOVE_V !== 280) throw new Error('SHOVE_V 280');
  if (SHOVE_T !== 0.40) throw new Error('SHOVE_T 0.40');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');

  const yin = makeState();
  resetRoom(yin, 26, false);
  if (yin.roomName !== '诱廊' || yin.roomId !== 'yinlang') throw new Error('yinlang load');
  if (yin.toast !== TOAST.baitRoom) throw new Error('诱廊 intro');
  if (yin.roomW !== 960 || yin.roomH !== 400) throw new Error('诱廊 size');
  if (yin.player.x !== 80 || yin.player.y !== 200) throw new Error('诱廊 spawn');
  if (yin.baitReady) throw new Error('诱廊 bait starts false');
  if (yin.baits && yin.baits.length) throw new Error('诱廊 baits start empty');
  let yinStill = 0;
  let yinTide = 0;
  for (let i = 0; i < yin.waters.length; i++) {
    if (yin.waters[i].tide) yinTide += 1;
    else yinStill += 1;
  }
  if (yinStill < 1) throw new Error('诱廊 needs static 水洼');
  if (yinTide) throw new Error('诱廊 no tide');
  let yinCore = 0;
  let yinHeal = 0;
  let yinThick = 0;
  let yinBaitItem = 0;
  let yinShoveItem = 0;
  let yinFrostItem = 0;
  let yinHaloItem = 0;
  let yinPierceItem = 0;
  let yinSplitItem = 0;
  let yinDashItem = 0;
  let yinSuckItem = 0;
  let yinEchoItem = 0;
  let yinHasteItem = 0;
  let yinSeedItem = 0;
  for (let i = 0; i < yin.crates.length; i++) {
    if (yin.crates[i].loot === 'core') yinCore += 1;
    if (yin.crates[i].loot === 'heal') yinHeal += 1;
    if (yin.crates[i].thick) yinThick += 1;
  }
  for (let i = 0; i < yin.items.length; i++) {
    if (yin.items[i].kind === 'bait') yinBaitItem += 1;
    if (yin.items[i].kind === 'shove') yinShoveItem += 1;
    if (yin.items[i].kind === 'frost') yinFrostItem += 1;
    if (yin.items[i].kind === 'halo') yinHaloItem += 1;
    if (yin.items[i].kind === 'pierce') yinPierceItem += 1;
    if (yin.items[i].kind === 'split') yinSplitItem += 1;
    if (yin.items[i].kind === 'dashboom') yinDashItem += 1;
    if (yin.items[i].kind === 'suck') yinSuckItem += 1;
    if (yin.items[i].kind === 'echo') yinEchoItem += 1;
    if (yin.items[i].kind === 'haste') yinHasteItem += 1;
    if (yin.items[i].kind === 'seed') yinSeedItem += 1;
  }
  if (yinBaitItem < 1) throw new Error('诱廊 needs 诱爆');
  if (yinShoveItem || yinFrostItem || yinHaloItem || yinPierceItem || yinSplitItem || yinDashItem || yinSuckItem || yinEchoItem || yinHasteItem || yinSeedItem) {
    throw new Error('诱廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆');
  }
  if (yinCore !== 1) throw new Error('诱廊 心核');
  if (yinHeal < 1) throw new Error('诱廊 回星');
  const yinBox = yin.crates.find(function (c) { return c.loot === 'core'; });
  if (!yinBox || yinBox.thick) throw new Error('诱廊 心核 crate is not thick');
  if (yinThick) throw new Error('诱廊 no thick crate');
  let yinHound = 0;
  let yinGuard = 0;
  let yinMoth = 0;
  let yinEater = 0;
  for (let i = 0; i < yin.enemies.length; i++) {
    if (isHound(yin.enemies[i])) yinHound += 1;
    else if (isMoth(yin.enemies[i])) yinMoth += 1;
    else if (isEater(yin.enemies[i])) yinEater += 1;
    else yinGuard += 1;
  }
  if (yinGuard !== 2 || yinHound !== 0 || yinMoth !== 0 || yinEater !== 0) {
    throw new Error('诱廊 烬卫 only');
  }
  if (inWater(yin, 80, 200) || inOil(yin, 80, 200)) throw new Error('诱廊 spawn dry');
  if (inWater(yin, 260, 200) || inOil(yin, 260, 200)) throw new Error('诱廊 诱爆 dry');
  if (inOil(yin, 860, 188) || inWater(yin, 860, 188)) throw new Error('诱廊 core dry');
  if (inWater(yin, 380, 200) || inOil(yin, 380, 200)) throw new Error('诱廊 plant dry');
  if (!inWater(yin, 450, 350)) throw new Error('诱廊 wet bag');
  if (inWater(yin, 400, 100)) throw new Error('诱廊 north shelf wet');
  for (let i = 0; i < yin.crates.length; i++) {
    const c = yin.crates[i];
    if (circleRect(yin.player.x, yin.player.y, yin.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('诱廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 430; x += 10) {
    for (let i = 0; i < yin.crates.length; i++) {
      const c = yin.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('诱廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(yin, x, y)) throw new Error('诱廊 north puddle');
      for (let i = 0; i < yin.enemies.length; i++) {
        const e = yin.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('诱廊 north enemy');
      }
    }
  }
  for (let i = 0; i < yin.enemies.length; i++) {
    const e = yin.enemies[i];
    if (dist(e.x, e.y, 380, 200) <= BLAST_R + e.r) throw new Error('BLAST_R at plant does not hit the guards');
    if (dist(e.x, e.y, 380, 200) > BAIT_SEE) throw new Error('BAIT_SEE from plant reaches both');
  }
  yin.player.x = yin.enemies[0].x;
  yin.player.y = yin.enemies[0].y;
  yin.player.hearts = 3;
  yin.player.inv = 0;
  yin.player.dashT = 0;
  update(yin, 0.016);
  if (yin.player.hearts >= 3) throw new Error('walking the choke without bait still bump-hurts');
  yin.player.x = 80;
  yin.player.y = 80;
  yin.player.hearts = 3;
  yin.player.inv = 0;
  yin.hitstop = 0;
  yin.embers.length = 0;
  yin.baitReady = true;
  explode(yin, 380, 200, false);
  if (yin.baitReady) throw new Error('诱廊 bait spends');
  if (!yin.baits || yin.baits.length !== 1) throw new Error('诱廊 plants one bait');
  if (yin.baits[0].x !== 380 || yin.baits[0].y !== 200) throw new Error('诱廊 bait at plant');
  if (yin.enemies[0].hp !== ENEMY_HP || yin.enemies[1].hp !== ENEMY_HP) {
    throw new Error('诱廊 plant boom misses guards');
  }
  yin.hitstop = 0;
  yin.embers.length = 0;
  yin.player.x = 860;
  yin.player.y = 80;
  const yx0 = yin.enemies[0].x;
  const yx1 = yin.enemies[1].x;
  for (let i = 0; i < 8; i++) update(yin, 0.05);
  if (!(yin.enemies[0].x < yx0) || !(yin.enemies[1].x < yx1)) {
    throw new Error('烬卫 walk west toward bait');
  }
  explode(yin, yinBox.x + yinBox.w * 0.5, yinBox.y - 20, false);
  if (!yinBox.open) throw new Error('诱廊 dry trail should open 心核');
  takeCore(yin, { x: 100, y: 100 });
  if (yin.won) throw new Error('诱廊 should not 通关');
  for (let i = 0; i < 20; i++) update(yin, 0.1);
  if (yin.roomName !== '壳廊') throw new Error('core advances to 壳廊');
  const hudYin = makeState();
  resetRoom(hudYin, 26, false);
  if (roomHudText(hudYin).indexOf('诱廊 · 27/') !== 0) throw new Error('HUD 诱廊 27/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (BAIT_T !== 2.0) throw new Error('BAIT_T 2.0');
  if (BAIT_SEE !== 240) throw new Error('BAIT_SEE 240');
  if (BAIT_R !== 11) throw new Error('BAIT_R 11');
  if (BAIT_HIT !== 16) throw new Error('BAIT_HIT 16');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');

  const qiao = makeState();
  resetRoom(qiao, 27, false);
  if (qiao.roomName !== '壳廊' || qiao.roomId !== 'qiaolang') throw new Error('qiaolang load');
  if (qiao.toast !== TOAST.shellRoom) throw new Error('壳廊 intro');
  if (qiao.roomW !== 960 || qiao.roomH !== 400) throw new Error('壳廊 size');
  if (qiao.player.x !== 80 || qiao.player.y !== 200) throw new Error('壳廊 spawn');
  let qiaoStill = 0;
  let qiaoTide = 0;
  for (let i = 0; i < qiao.waters.length; i++) {
    if (qiao.waters[i].tide) qiaoTide += 1;
    else qiaoStill += 1;
  }
  if (qiaoStill < 1) throw new Error('壳廊 needs static 水洼');
  if (qiaoTide) throw new Error('壳廊 no tide');
  let qiaoCore = 0;
  let qiaoHeal = 0;
  let qiaoThick = 0;
  for (let i = 0; i < qiao.crates.length; i++) {
    if (qiao.crates[i].loot === 'core') qiaoCore += 1;
    if (qiao.crates[i].loot === 'heal') qiaoHeal += 1;
    if (qiao.crates[i].thick) qiaoThick += 1;
  }
  if (qiao.items && qiao.items.length) throw new Error('壳廊 no ground pickup');
  if (qiaoCore !== 1) throw new Error('壳廊 心核');
  if (qiaoHeal < 1) throw new Error('壳廊 回星');
  const qiaoBox = qiao.crates.find(function (c) { return c.loot === 'core'; });
  if (!qiaoBox || qiaoBox.thick) throw new Error('壳廊 心核 crate is not thick');
  if (qiaoThick) throw new Error('壳廊 no thick crate');
  let qiaoHound = 0;
  let qiaoGuard = 0;
  let qiaoMoth = 0;
  let qiaoEater = 0;
  let qiaoShell = 0;
  for (let i = 0; i < qiao.enemies.length; i++) {
    if (isHound(qiao.enemies[i])) qiaoHound += 1;
    else if (isMoth(qiao.enemies[i])) qiaoMoth += 1;
    else if (isEater(qiao.enemies[i])) qiaoEater += 1;
    else if (isShell(qiao.enemies[i])) qiaoShell += 1;
    else qiaoGuard += 1;
  }
  if (qiaoShell !== 2 || qiaoGuard !== 0 || qiaoHound !== 0 || qiaoMoth !== 0 || qiaoEater !== 0) {
    throw new Error('壳廊 壳卫 only');
  }
  if (qiao.enemies[0].hp !== SHELL_HP || qiao.enemies[1].hp !== SHELL_HP) {
    throw new Error('壳廊 壳卫 hp');
  }
  if (qiao.enemies[0].r !== SHELL_R || qiao.enemies[1].r !== SHELL_R) {
    throw new Error('壳廊 壳卫 r');
  }
  if (inWater(qiao, 80, 200) || inOil(qiao, 80, 200)) throw new Error('壳廊 spawn dry');
  if (inOil(qiao, 860, 188) || inWater(qiao, 860, 188)) throw new Error('壳廊 core dry');
  if (inWater(qiao, 500, 200) || inOil(qiao, 500, 200)) throw new Error('壳廊 壳卫 dry');
  if (inWater(qiao, 520, 200) || inOil(qiao, 520, 200)) throw new Error('壳廊 壳卫 dry lane');
  if (!inWater(qiao, 450, 350)) throw new Error('壳廊 wet bag');
  if (inWater(qiao, 400, 100)) throw new Error('壳廊 north shelf wet');
  for (let i = 0; i < qiao.crates.length; i++) {
    const c = qiao.crates[i];
    if (circleRect(qiao.player.x, qiao.player.y, qiao.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('壳廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 460; x += 10) {
    for (let i = 0; i < qiao.crates.length; i++) {
      const c = qiao.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('壳廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(qiao, x, y)) throw new Error('壳廊 north puddle');
      for (let i = 0; i < qiao.enemies.length; i++) {
        const e = qiao.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('壳廊 north enemy');
      }
    }
  }
  qiao.player.x = qiao.enemies[0].x;
  qiao.player.y = qiao.enemies[0].y;
  qiao.player.hearts = 3;
  qiao.player.inv = 0;
  qiao.player.dashT = 0;
  qiao.hitstop = 0;
  qiao.embers.length = 0;
  update(qiao, 0.016);
  if (qiao.player.hearts >= 3) throw new Error('walking into a 壳卫 still bump-hurts');
  qiao.player.x = 80;
  qiao.player.y = 80;
  qiao.player.inv = 2;
  qiao.hitstop = 0;
  qiao.embers.length = 0;
  explode(qiao, qiao.enemies[0].x, qiao.enemies[0].y, false);
  if (qiao.enemies[0].hp !== 2 || qiao.enemies[1].hp !== 2) throw new Error('壳卫 cold boom 0 dmg');
  if (qiao.toast !== TOAST.shellClang) throw new Error('壳挡了 room');
  qiao.shellClangT = 0;
  qiao.hitstop = 0;
  explode(qiao, qiao.enemies[0].x, qiao.enemies[0].y, true);
  if (qiao.enemies[0].hp !== 1) throw new Error('壳卫 hot boom 1 dmg');
  explode(qiao, qiao.enemies[0].x, qiao.enemies[0].y, true);
  if (qiao.enemies[0].hp !== 0) throw new Error('壳卫 second hot dies');
  if (qiao.toast !== TOAST.shell) throw new Error('壳卫倒了 room');
  explode(qiao, qiaoBox.x + qiaoBox.w * 0.5, qiaoBox.y - 20, false);
  if (!qiaoBox.open) throw new Error('壳廊 dry trail should open 心核');
  takeCore(qiao, { x: 100, y: 100 });
  if (qiao.won) throw new Error('壳廊 should not 通关');
  for (let i = 0; i < 20; i++) update(qiao, 0.1);
  if (qiao.roomName !== '雷廊') throw new Error('core advances to 雷廊');
  const hudQiao = makeState();
  resetRoom(hudQiao, 27, false);
  if (roomHudText(hudQiao).indexOf('壳廊 · 28/') !== 0) throw new Error('HUD 壳廊 28/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (SHELL_HP !== 2) throw new Error('SHELL_HP 2');
  if (SHELL_R !== 14) throw new Error('SHELL_R 14');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (HOT_BLAST_R !== 56) throw new Error('HOT_BLAST_R 56');

  const lei = makeState();
  resetRoom(lei, 28, false);
  if (lei.roomName !== '雷廊' || lei.roomId !== 'leilang') throw new Error('leilang load');
  if (lei.toast !== TOAST.boltRoom) throw new Error('雷廊 intro');
  if (lei.roomW !== 960 || lei.roomH !== 400) throw new Error('雷廊 size');
  if (lei.player.x !== 80 || lei.player.y !== 200) throw new Error('雷廊 spawn');
  if (lei.boltReady) throw new Error('雷廊 bolt starts false');
  if (lei.bolts && lei.bolts.length) throw new Error('雷廊 bolts start empty');
  let leiStill = 0;
  let leiTide = 0;
  for (let i = 0; i < lei.waters.length; i++) {
    if (lei.waters[i].tide) leiTide += 1;
    else leiStill += 1;
  }
  if (leiStill < 1) throw new Error('雷廊 needs static 水洼');
  if (leiTide) throw new Error('雷廊 no tide');
  let leiCore = 0;
  let leiHeal = 0;
  let leiThick = 0;
  let leiBoltItem = 0;
  let leiBaitItem = 0;
  let leiShoveItem = 0;
  let leiFrostItem = 0;
  let leiHaloItem = 0;
  let leiPierceItem = 0;
  let leiSplitItem = 0;
  let leiDashItem = 0;
  let leiSuckItem = 0;
  let leiEchoItem = 0;
  let leiHasteItem = 0;
  let leiSeedItem = 0;
  for (let i = 0; i < lei.crates.length; i++) {
    if (lei.crates[i].loot === 'core') leiCore += 1;
    if (lei.crates[i].loot === 'heal') leiHeal += 1;
    if (lei.crates[i].thick) leiThick += 1;
  }
  for (let i = 0; i < lei.items.length; i++) {
    if (lei.items[i].kind === 'bolt') leiBoltItem += 1;
    if (lei.items[i].kind === 'bait') leiBaitItem += 1;
    if (lei.items[i].kind === 'shove') leiShoveItem += 1;
    if (lei.items[i].kind === 'frost') leiFrostItem += 1;
    if (lei.items[i].kind === 'halo') leiHaloItem += 1;
    if (lei.items[i].kind === 'pierce') leiPierceItem += 1;
    if (lei.items[i].kind === 'split') leiSplitItem += 1;
    if (lei.items[i].kind === 'dashboom') leiDashItem += 1;
    if (lei.items[i].kind === 'suck') leiSuckItem += 1;
    if (lei.items[i].kind === 'echo') leiEchoItem += 1;
    if (lei.items[i].kind === 'haste') leiHasteItem += 1;
    if (lei.items[i].kind === 'seed') leiSeedItem += 1;
  }
  if (leiBoltItem < 1) throw new Error('雷廊 needs 雷爆');
  if (leiBaitItem || leiShoveItem || leiFrostItem || leiHaloItem || leiPierceItem || leiSplitItem || leiDashItem || leiSuckItem || leiEchoItem || leiHasteItem || leiSeedItem) {
    throw new Error('雷廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆/诱爆');
  }
  if (leiCore !== 1) throw new Error('雷廊 心核');
  if (leiHeal < 1) throw new Error('雷廊 回星');
  const leiBox = lei.crates.find(function (c) { return c.loot === 'core'; });
  if (!leiBox || leiBox.thick) throw new Error('雷廊 心核 crate is not thick');
  if (leiThick) throw new Error('雷廊 no thick crate');
  let leiHound = 0;
  let leiGuard = 0;
  let leiMoth = 0;
  let leiEater = 0;
  let leiShell = 0;
  for (let i = 0; i < lei.enemies.length; i++) {
    if (isHound(lei.enemies[i])) leiHound += 1;
    else if (isMoth(lei.enemies[i])) leiMoth += 1;
    else if (isEater(lei.enemies[i])) leiEater += 1;
    else if (isShell(lei.enemies[i])) leiShell += 1;
    else leiGuard += 1;
  }
  if (leiGuard !== 3 || leiHound !== 0 || leiMoth !== 0 || leiEater !== 0 || leiShell !== 0) {
    throw new Error('雷廊 烬卫 only');
  }
  if (inWater(lei, 80, 200) || inOil(lei, 80, 200)) throw new Error('雷廊 spawn dry');
  if (inWater(lei, 250, 200) || inOil(lei, 250, 200)) throw new Error('雷廊 雷爆 dry');
  if (inOil(lei, 860, 188) || inWater(lei, 860, 188)) throw new Error('雷廊 core dry');
  if (inWater(lei, 400, 200) || inOil(lei, 400, 200)) throw new Error('雷廊 plant dry');
  if (!inWater(lei, 450, 350)) throw new Error('雷廊 wet bag');
  if (inWater(lei, 400, 100)) throw new Error('雷廊 north shelf wet');
  for (let i = 0; i < lei.crates.length; i++) {
    const c = lei.crates[i];
    if (circleRect(lei.player.x, lei.player.y, lei.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('雷廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 430; x += 10) {
    for (let i = 0; i < lei.crates.length; i++) {
      const c = lei.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('雷廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(lei, x, y)) throw new Error('雷廊 north puddle');
      for (let i = 0; i < lei.enemies.length; i++) {
        const e = lei.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('雷廊 north enemy');
      }
    }
  }
  for (let i = 0; i < lei.enemies.length; i++) {
    const e = lei.enemies[i];
    const dPlant = dist(e.x, e.y, 400, 200);
    if (dPlant <= BLAST_R + e.r) throw new Error('BLAST_R at plant does not hit the guards');
    if (dPlant > BOLT_R) throw new Error('BOLT_R from plant reaches all three');
    if (dPlant <= 50 || dPlant > 170) throw new Error('plant dist in (50, 170]');
  }
  lei.player.x = lei.enemies[0].x;
  lei.player.y = lei.enemies[0].y;
  lei.player.hearts = 3;
  lei.player.inv = 0;
  lei.player.dashT = 0;
  lei.hitstop = 0;
  lei.embers.length = 0;
  update(lei, 0.016);
  if (lei.player.hearts >= 3) throw new Error('walking the mid without bolt still bump-hurts');
  lei.player.x = 80;
  lei.player.y = 80;
  lei.player.hearts = 3;
  lei.player.inv = 0;
  lei.hitstop = 0;
  lei.embers.length = 0;
  const leiGround = lei.items.find(function (it) { return it.kind === 'bolt' && !it.taken; });
  if (!leiGround) throw new Error('雷廊 ground 雷爆 present');
  lei.player.x = leiGround.x;
  lei.player.y = leiGround.y;
  update(lei, 0.016);
  if (lei.boltReady !== true) throw new Error('pick bolt → boltReady');
  if (lei.toast !== TOAST.boltGet) throw new Error('捡到雷爆 room');
  lei.player.x = 80;
  lei.player.y = 80;
  lei.hitstop = 0;
  lei.embers.length = 0;
  explode(lei, 400, 200, false);
  if (lei.boltReady) throw new Error('雷廊 bolt spends');
  if (lei.toast !== TOAST.boltUse) throw new Error('雷劈了 room');
  if (!lei.bolts || lei.bolts.length !== 3) throw new Error('雷廊 three arcs');
  for (let i = 0; i < lei.enemies.length; i++) {
    if (lei.enemies[i].hp !== ENEMY_HP - 1) throw new Error('雷廊 plant bolt 1 dmg');
  }
  lei.boltReady = true;
  lei.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(lei, 120, 120, false);
  if (!lei.sparks[lei.sparks.length - 1].wet) throw new Error('雷廊 wet spark');
  const leiBooms = lei.stats.booms;
  for (let i = 0; i < 24; i++) update(lei, 0.1);
  if (lei.boltReady !== true) throw new Error('雷廊 wet fizzle does not consume');
  if (lei.stats.booms !== leiBooms) throw new Error('雷廊 wet no extra boom');
  lei.waters = [];
  explode(lei, 200, 200, false, false, false, { fork: true });
  if (lei.boltReady !== true) throw new Error('雷廊 fork does not consume');
  lei.echoReady = true;
  explode(lei, 200, 200, false);
  lei.boltReady = true;
  for (let i = 0; i < 12; i++) update(lei, 0.05);
  if (lei.boltReady !== true) throw new Error('雷廊 echo does not consume');
  explode(lei, leiBox.x + leiBox.w * 0.5, leiBox.y - 20, false);
  if (!leiBox.open) throw new Error('雷廊 dry trail should open 心核');
  takeCore(lei, { x: 100, y: 100 });
  if (lei.won) throw new Error('雷廊 should not 通关');
  for (let i = 0; i < 20; i++) update(lei, 0.1);
  if (lei.roomName !== '绊廊') throw new Error('core advances to 绊廊');
  const hudLei = makeState();
  resetRoom(hudLei, 28, false);
  if (roomHudText(hudLei).indexOf('雷廊 · 29/') !== 0) throw new Error('HUD 雷廊 29/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (BOLT_R !== 170) throw new Error('BOLT_R 170');
  if (BOLT_N !== 3) throw new Error('BOLT_N 3');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');

  const ban = makeState();
  resetRoom(ban, 29, false);
  if (ban.roomName !== '绊廊' || ban.roomId !== 'banlang') throw new Error('banlang load');
  if (ban.toast !== TOAST.tripRoom) throw new Error('绊廊 intro');
  if (ban.roomW !== 960 || ban.roomH !== 400) throw new Error('绊廊 size');
  if (ban.player.x !== 80 || ban.player.y !== 200) throw new Error('绊廊 spawn');
  if (ban.tripReady) throw new Error('绊廊 trip starts false');
  if (ban.trips && ban.trips.length) throw new Error('绊廊 trips start empty');
  let banStill = 0;
  let banTide = 0;
  for (let i = 0; i < ban.waters.length; i++) {
    if (ban.waters[i].tide) banTide += 1;
    else banStill += 1;
  }
  if (banStill < 1) throw new Error('绊廊 needs static 水洼');
  if (banTide) throw new Error('绊廊 no tide');
  let banCore = 0;
  let banHeal = 0;
  let banThick = 0;
  let banTripItem = 0;
  let banBoltItem = 0;
  let banBaitItem = 0;
  let banShoveItem = 0;
  let banFrostItem = 0;
  let banHaloItem = 0;
  let banPierceItem = 0;
  let banSplitItem = 0;
  let banDashItem = 0;
  let banSuckItem = 0;
  let banEchoItem = 0;
  let banHasteItem = 0;
  let banSeedItem = 0;
  for (let i = 0; i < ban.crates.length; i++) {
    if (ban.crates[i].loot === 'core') banCore += 1;
    if (ban.crates[i].loot === 'heal') banHeal += 1;
    if (ban.crates[i].thick) banThick += 1;
  }
  for (let i = 0; i < ban.items.length; i++) {
    if (ban.items[i].kind === 'trip') banTripItem += 1;
    if (ban.items[i].kind === 'bolt') banBoltItem += 1;
    if (ban.items[i].kind === 'bait') banBaitItem += 1;
    if (ban.items[i].kind === 'shove') banShoveItem += 1;
    if (ban.items[i].kind === 'frost') banFrostItem += 1;
    if (ban.items[i].kind === 'halo') banHaloItem += 1;
    if (ban.items[i].kind === 'pierce') banPierceItem += 1;
    if (ban.items[i].kind === 'split') banSplitItem += 1;
    if (ban.items[i].kind === 'dashboom') banDashItem += 1;
    if (ban.items[i].kind === 'suck') banSuckItem += 1;
    if (ban.items[i].kind === 'echo') banEchoItem += 1;
    if (ban.items[i].kind === 'haste') banHasteItem += 1;
    if (ban.items[i].kind === 'seed') banSeedItem += 1;
  }
  if (banTripItem < 1) throw new Error('绊廊 needs 绊爆');
  if (banBoltItem || banBaitItem || banShoveItem || banFrostItem || banHaloItem || banPierceItem || banSplitItem || banDashItem || banSuckItem || banEchoItem || banHasteItem || banSeedItem) {
    throw new Error('绊廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆/诱爆/雷爆');
  }
  if (banCore !== 1) throw new Error('绊廊 心核');
  if (banHeal < 1) throw new Error('绊廊 回星');
  const banBox = ban.crates.find(function (c) { return c.loot === 'core'; });
  if (!banBox || banBox.thick) throw new Error('绊廊 心核 crate is not thick');
  if (banThick) throw new Error('绊廊 no thick crate');
  let banHound = 0;
  let banGuard = 0;
  let banMoth = 0;
  let banEater = 0;
  let banShell = 0;
  for (let i = 0; i < ban.enemies.length; i++) {
    if (isHound(ban.enemies[i])) banHound += 1;
    else if (isMoth(ban.enemies[i])) banMoth += 1;
    else if (isEater(ban.enemies[i])) banEater += 1;
    else if (isShell(ban.enemies[i])) banShell += 1;
    else banGuard += 1;
  }
  if (banGuard !== 3 || banHound !== 0 || banMoth !== 0 || banEater !== 0 || banShell !== 0) {
    throw new Error('绊廊 烬卫 only');
  }
  if (inWater(ban, 80, 200) || inOil(ban, 80, 200)) throw new Error('绊廊 spawn dry');
  if (inWater(ban, 240, 200) || inOil(ban, 240, 200)) throw new Error('绊廊 绊爆 dry');
  if (inOil(ban, 860, 188) || inWater(ban, 860, 188)) throw new Error('绊廊 core dry');
  if (inWater(ban, 420, 200) || inOil(ban, 420, 200)) throw new Error('绊廊 plant dry');
  if (!inWater(ban, 350, 350)) throw new Error('绊廊 wet bag');
  if (inWater(ban, 400, 100)) throw new Error('绊廊 north shelf wet');
  for (let i = 0; i < ban.crates.length; i++) {
    const c = ban.crates[i];
    if (circleRect(ban.player.x, ban.player.y, ban.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('绊廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 450; x += 10) {
    for (let i = 0; i < ban.crates.length; i++) {
      const c = ban.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('绊廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(ban, x, y)) throw new Error('绊廊 north puddle');
      for (let i = 0; i < ban.enemies.length; i++) {
        const e = ban.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('绊廊 north enemy');
      }
    }
  }
  let banEast = null;
  for (let i = 0; i < ban.enemies.length; i++) {
    const e = ban.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('绊廊 foe too close to spawn');
    const dPlant = dist(e.x, e.y, 420, 200);
    if (Math.abs(e.y - 200) < 1 && e.x > 420 && dPlant < 140) banEast = e;
  }
  if (!banEast) throw new Error('绊廊 east 烬卫 on plant path');
  if (Math.abs(dist(banEast.x, banEast.y, 420, 200) - 100) > 8) throw new Error('plant dist ~100');
  ban.player.x = ban.enemies[0].x;
  ban.player.y = ban.enemies[0].y;
  ban.player.hearts = 3;
  ban.player.inv = 0;
  ban.player.dashT = 0;
  ban.hitstop = 0;
  ban.embers.length = 0;
  update(ban, 0.016);
  if (ban.player.hearts >= 3) throw new Error('walking the mid without trip still bump-hurts');
  ban.player.x = 80;
  ban.player.y = 80;
  ban.player.hearts = 3;
  ban.player.inv = 0;
  ban.hitstop = 0;
  ban.embers.length = 0;
  const banGround = ban.items.find(function (it) { return it.kind === 'trip' && !it.taken; });
  if (!banGround) throw new Error('绊廊 ground 绊爆 present');
  ban.player.x = banGround.x;
  ban.player.y = banGround.y;
  update(ban, 0.016);
  if (ban.tripReady !== true) throw new Error('pick trip → tripReady');
  if (ban.toast !== TOAST.tripGet) throw new Error('捡到绊爆 room');
  ban.player.x = 80;
  ban.player.y = 80;
  ban.hitstop = 0;
  ban.embers.length = 0;
  explode(ban, 420, 200, false);
  if (ban.tripReady) throw new Error('绊廊 trip spends');
  if (!ban.trips || ban.trips.length !== 1) throw new Error('绊廊 plants one trip');
  if (ban.trips[0].x !== 420 || ban.trips[0].y !== 200) throw new Error('绊廊 trip at plant');
  if (ban.toast !== TOAST.tripPlant) throw new Error('绊线埋了 room');
  for (let i = 0; i < ban.enemies.length; i++) {
    ban.enemies[i].x = 900;
    ban.enemies[i].y = 40;
  }
  ban.tripReady = true;
  ban.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(ban, 120, 120, false);
  if (!ban.sparks[ban.sparks.length - 1].wet) throw new Error('绊廊 wet spark');
  const banBooms = ban.stats.booms;
  for (let i = 0; i < 24; i++) update(ban, 0.1);
  if (ban.tripReady !== true) throw new Error('绊廊 wet fizzle does not consume');
  if (ban.stats.booms !== banBooms) throw new Error('绊廊 wet no extra boom');
  ban.waters = [];
  explode(ban, 200, 200, false, false, false, { fork: true });
  if (ban.tripReady !== true) throw new Error('绊廊 fork does not consume');
  ban.echoReady = true;
  explode(ban, 200, 200, false);
  ban.tripReady = true;
  for (let i = 0; i < 12; i++) update(ban, 0.05);
  if (ban.tripReady !== true) throw new Error('绊廊 echo does not consume');
  ban.trips = [{ x: 420, y: 200, t: TRIP_LIFE }];
  ban.enemies[0].x = 420;
  ban.enemies[0].y = 200;
  ban.enemies[0].hp = ENEMY_HP;
  ban.hitstop = 0;
  updateTrips(ban, 0.016);
  if (ban.trips.length !== 0) throw new Error('绊廊 enemy trips');
  if (ban.toast !== TOAST.tripPop) throw new Error('绊住了 room');
  explode(ban, banBox.x + banBox.w * 0.5, banBox.y - 20, false);
  if (!banBox.open) throw new Error('绊廊 dry trail should open 心核');
  takeCore(ban, { x: 100, y: 100 });
  if (ban.won) throw new Error('绊廊 should not 通关');
  for (let i = 0; i < 20; i++) update(ban, 0.1);
  if (ban.roomName !== '迟廊') throw new Error('core advances to 迟廊');
  const hudBan = makeState();
  resetRoom(hudBan, 29, false);
  if (roomHudText(hudBan).indexOf('绊廊 · 30/') !== 0) throw new Error('HUD 绊廊 30/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (TRIP_R !== 16) throw new Error('TRIP_R 16');
  if (TRIP_LIFE !== 12) throw new Error('TRIP_LIFE 12');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');

  const chi = makeState();
  resetRoom(chi, 30, false);
  if (chi.roomName !== '迟廊' || chi.roomId !== 'chilang') throw new Error('chilang load');
  if (chi.toast !== TOAST.delayRoom) throw new Error('迟廊 intro');
  if (chi.roomW !== 960 || chi.roomH !== 400) throw new Error('迟廊 size');
  if (chi.player.x !== 80 || chi.player.y !== 200) throw new Error('迟廊 spawn');
  if (chi.delayReady) throw new Error('迟廊 delay starts false');
  if (chi.delays && chi.delays.length) throw new Error('迟廊 delays start empty');
  let chiStill = 0;
  let chiTide = 0;
  for (let i = 0; i < chi.waters.length; i++) {
    if (chi.waters[i].tide) chiTide += 1;
    else chiStill += 1;
  }
  if (chiStill < 1) throw new Error('迟廊 needs static 水洼');
  if (chiTide) throw new Error('迟廊 no tide');
  let chiCore = 0;
  let chiHeal = 0;
  let chiThick = 0;
  let chiDelayItem = 0;
  let chiTripItem = 0;
  let chiBoltItem = 0;
  let chiBaitItem = 0;
  let chiShoveItem = 0;
  let chiFrostItem = 0;
  let chiHaloItem = 0;
  let chiPierceItem = 0;
  let chiSplitItem = 0;
  let chiDashItem = 0;
  let chiSuckItem = 0;
  let chiEchoItem = 0;
  let chiHasteItem = 0;
  let chiSeedItem = 0;
  let chiBounceItem = 0;
  for (let i = 0; i < chi.crates.length; i++) {
    if (chi.crates[i].loot === 'core') chiCore += 1;
    if (chi.crates[i].loot === 'heal') chiHeal += 1;
    if (chi.crates[i].thick) chiThick += 1;
  }
  for (let i = 0; i < chi.items.length; i++) {
    if (chi.items[i].kind === 'delay') chiDelayItem += 1;
    if (chi.items[i].kind === 'trip') chiTripItem += 1;
    if (chi.items[i].kind === 'bolt') chiBoltItem += 1;
    if (chi.items[i].kind === 'bait') chiBaitItem += 1;
    if (chi.items[i].kind === 'shove') chiShoveItem += 1;
    if (chi.items[i].kind === 'frost') chiFrostItem += 1;
    if (chi.items[i].kind === 'halo') chiHaloItem += 1;
    if (chi.items[i].kind === 'pierce') chiPierceItem += 1;
    if (chi.items[i].kind === 'split') chiSplitItem += 1;
    if (chi.items[i].kind === 'dashboom') chiDashItem += 1;
    if (chi.items[i].kind === 'suck') chiSuckItem += 1;
    if (chi.items[i].kind === 'echo') chiEchoItem += 1;
    if (chi.items[i].kind === 'haste') chiHasteItem += 1;
    if (chi.items[i].kind === 'seed') chiSeedItem += 1;
    if (chi.items[i].kind === 'bounce') chiBounceItem += 1;
  }
  if (chiDelayItem < 1) throw new Error('迟廊 needs 迟爆');
  if (chiTripItem || chiBoltItem || chiBaitItem || chiShoveItem || chiFrostItem || chiHaloItem || chiPierceItem || chiSplitItem || chiDashItem || chiSuckItem || chiEchoItem || chiHasteItem || chiSeedItem || chiBounceItem) {
    throw new Error('迟廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆/诱爆/雷爆/绊爆/跳爆');
  }
  if (chiCore !== 1) throw new Error('迟廊 心核');
  if (chiHeal < 1) throw new Error('迟廊 回星');
  const chiBox = chi.crates.find(function (c) { return c.loot === 'core'; });
  if (!chiBox || chiBox.thick) throw new Error('迟廊 心核 crate is not thick');
  if (chiThick) throw new Error('迟廊 no thick crate');
  let chiHound = 0;
  let chiGuard = 0;
  let chiMoth = 0;
  let chiEater = 0;
  let chiShell = 0;
  for (let i = 0; i < chi.enemies.length; i++) {
    if (isHound(chi.enemies[i])) chiHound += 1;
    else if (isMoth(chi.enemies[i])) chiMoth += 1;
    else if (isEater(chi.enemies[i])) chiEater += 1;
    else if (isShell(chi.enemies[i])) chiShell += 1;
    else chiGuard += 1;
  }
  if (chiGuard !== 3 || chiHound !== 0 || chiMoth !== 0 || chiEater !== 0 || chiShell !== 0) {
    throw new Error('迟廊 烬卫 only');
  }
  if (inWater(chi, 80, 200) || inOil(chi, 80, 200)) throw new Error('迟廊 spawn dry');
  if (inWater(chi, 240, 200) || inOil(chi, 240, 200)) throw new Error('迟廊 迟爆 dry');
  if (inOil(chi, 860, 188) || inWater(chi, 860, 188)) throw new Error('迟廊 core dry');
  if (inWater(chi, 420, 200) || inOil(chi, 420, 200)) throw new Error('迟廊 plant dry');
  if (!inWater(chi, 350, 350)) throw new Error('迟廊 wet bag');
  if (inWater(chi, 400, 100)) throw new Error('迟廊 north shelf wet');
  for (let i = 0; i < chi.crates.length; i++) {
    const c = chi.crates[i];
    if (circleRect(chi.player.x, chi.player.y, chi.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('迟廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 450; x += 10) {
    for (let i = 0; i < chi.crates.length; i++) {
      const c = chi.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('迟廊 crate on dry walk');
      }
    }
  }
  for (let x = 200; x <= 480; x += 20) {
    for (let y = 80; y <= 120; y += 20) {
      if (inWater(chi, x, y)) throw new Error('迟廊 north puddle');
      for (let i = 0; i < chi.enemies.length; i++) {
        const e = chi.enemies[i];
        if (dist(e.x, e.y, x, y) < e.r + 8) throw new Error('迟廊 north enemy');
      }
    }
  }
  let chiEast = null;
  for (let i = 0; i < chi.enemies.length; i++) {
    const e = chi.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('迟廊 foe too close to spawn');
    const dPlant = dist(e.x, e.y, 420, 200);
    if (Math.abs(e.y - 200) < 1 && e.x > 420 && dPlant < 140) chiEast = e;
  }
  if (!chiEast) throw new Error('迟廊 east 烬卫 on plant path');
  if (Math.abs(dist(chiEast.x, chiEast.y, 420, 200) - 100) > 8) throw new Error('迟廊 plant dist ~100');
  chi.player.x = chi.enemies[0].x;
  chi.player.y = chi.enemies[0].y;
  chi.player.hearts = 3;
  chi.player.inv = 0;
  chi.player.dashT = 0;
  chi.hitstop = 0;
  chi.embers.length = 0;
  update(chi, 0.016);
  if (chi.player.hearts >= 3) throw new Error('walking the mid without delay still bump-hurts');
  chi.player.x = 80;
  chi.player.y = 80;
  chi.player.hearts = 3;
  chi.player.inv = 0;
  chi.hitstop = 0;
  chi.embers.length = 0;
  const chiGround = chi.items.find(function (it) { return it.kind === 'delay' && !it.taken; });
  if (!chiGround) throw new Error('迟廊 ground 迟爆 present');
  chi.player.x = chiGround.x;
  chi.player.y = chiGround.y;
  update(chi, 0.016);
  if (chi.delayReady !== true) throw new Error('pick delay → delayReady');
  if (chi.toast !== TOAST.delayGet) throw new Error('捡到迟爆 room');
  chi.player.x = 80;
  chi.player.y = 80;
  chi.hitstop = 0;
  chi.embers.length = 0;
  explode(chi, 420, 200, false);
  if (chi.delayReady) throw new Error('迟廊 delay spends');
  if (!chi.delays || chi.delays.length !== 1) throw new Error('迟廊 plants one delay');
  if (chi.delays[0].x !== 420 || chi.delays[0].y !== 200) throw new Error('迟廊 delay at plant');
  if (Math.abs(chi.delays[0].t - DELAY_T) > 1e-9) throw new Error('迟廊 delay t');
  if (chi.toast !== TOAST.delayPlant) throw new Error('迟线埋了 room');
  chi.delays.length = 0;
  for (let i = 0; i < chi.enemies.length; i++) {
    chi.enemies[i].x = 900;
    chi.enemies[i].y = 40;
  }
  chi.delayReady = true;
  chi.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(chi, 120, 120, false);
  if (!chi.sparks[chi.sparks.length - 1].wet) throw new Error('迟廊 wet spark');
  const chiBooms = chi.stats.booms;
  for (let i = 0; i < 24; i++) update(chi, 0.1);
  if (chi.delayReady !== true) throw new Error('迟廊 wet fizzle does not consume');
  if (chi.stats.booms !== chiBooms) throw new Error('迟廊 wet no extra boom');
  chi.waters = [];
  explode(chi, 200, 200, false, false, false, { fork: true });
  if (chi.delayReady !== true) throw new Error('迟廊 fork does not consume');
  chi.echoReady = true;
  explode(chi, 200, 200, false);
  chi.delayReady = true;
  for (let i = 0; i < 12; i++) update(chi, 0.05);
  if (chi.delayReady !== true) throw new Error('迟廊 echo does not consume');
  chi.delays = [{ x: 420, y: 200, t: DELAY_T }];
  chi.enemies[0].x = 420;
  chi.enemies[0].y = 200;
  chi.enemies[0].hp = ENEMY_HP;
  chi.player.x = 80;
  chi.player.y = 80;
  chi.hitstop = 0;
  const chiDelayHp = chi.enemies[0].hp;
  updateDelays(chi, DELAY_T + 0.01);
  if (chi.delays.length !== 0) throw new Error('迟廊 delay cooks');
  if (chi.toast !== TOAST.delayPop) throw new Error('迟爆来了 room');
  if (chi.enemies[0].hp !== chiDelayHp - 2) throw new Error('迟廊 delay hot 2 dmg');
  chi.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  chi.delays = [{ x: 120, y: 120, t: DELAY_T }];
  const chiFizzBooms = chi.stats.booms;
  updateDelays(chi, 0.016);
  if (chi.delays.length !== 0) throw new Error('迟廊 puddle fizzle');
  if (chi.stats.booms !== chiFizzBooms) throw new Error('迟廊 fizzle no boom');
  if (chi.toast !== TOAST.delayFizzle) throw new Error('迟线熄了 room');
  if (chi.delayReady !== true) throw new Error('迟廊 fizzle no refund');
  chi.waters = [];
  explode(chi, chiBox.x + chiBox.w * 0.5, chiBox.y - 20, false);
  if (!chiBox.open) throw new Error('迟廊 dry trail should open 心核');
  takeCore(chi, { x: 100, y: 100 });
  if (chi.won) throw new Error('迟廊 should not 通关');
  for (let i = 0; i < 20; i++) update(chi, 0.1);
  if (chi.roomName !== '跳廊') throw new Error('core advances to 跳廊');
  const hudChi = makeState();
  resetRoom(hudChi, 30, false);
  if (roomHudText(hudChi).indexOf('迟廊 · 31/') !== 0) throw new Error('HUD 迟廊 31/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (DELAY_T !== 1.2) throw new Error('DELAY_T 1.2');
  if (DELAY_R !== 14) throw new Error('DELAY_R 14');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');

  const tiao = makeState();
  resetRoom(tiao, 31, false);
  if (tiao.roomName !== '跳廊' || tiao.roomId !== 'tiaolang') throw new Error('tiaolang load');
  if (tiao.toast !== TOAST.bounceRoom) throw new Error('跳廊 intro');
  if (tiao.roomW !== 960 || tiao.roomH !== 400) throw new Error('跳廊 size');
  if (tiao.player.x !== 80 || tiao.player.y !== 200) throw new Error('跳廊 spawn');
  if (tiao.bounceReady) throw new Error('跳廊 bounce starts false');
  if (tiao.bounceArcs && tiao.bounceArcs.length) throw new Error('跳廊 bounceArcs start empty');
  let tiaoStill = 0;
  let tiaoTide = 0;
  for (let i = 0; i < tiao.waters.length; i++) {
    if (tiao.waters[i].tide) tiaoTide += 1;
    else tiaoStill += 1;
  }
  if (tiaoStill < 1) throw new Error('跳廊 needs static 水洼');
  if (tiaoTide) throw new Error('跳廊 no tide');
  let tiaoCore = 0;
  let tiaoHeal = 0;
  let tiaoThick = 0;
  let tiaoBounceItem = 0;
  let tiaoDelayItem = 0;
  let tiaoTripItem = 0;
  let tiaoBoltItem = 0;
  let tiaoBaitItem = 0;
  let tiaoShoveItem = 0;
  let tiaoFrostItem = 0;
  let tiaoHaloItem = 0;
  let tiaoPierceItem = 0;
  let tiaoSplitItem = 0;
  let tiaoDashItem = 0;
  let tiaoSuckItem = 0;
  let tiaoEchoItem = 0;
  let tiaoHasteItem = 0;
  let tiaoSeedItem = 0;
  for (let i = 0; i < tiao.crates.length; i++) {
    if (tiao.crates[i].loot === 'core') tiaoCore += 1;
    if (tiao.crates[i].loot === 'heal') tiaoHeal += 1;
    if (tiao.crates[i].thick) tiaoThick += 1;
  }
  for (let i = 0; i < tiao.items.length; i++) {
    if (tiao.items[i].kind === 'bounce') tiaoBounceItem += 1;
    if (tiao.items[i].kind === 'delay') tiaoDelayItem += 1;
    if (tiao.items[i].kind === 'trip') tiaoTripItem += 1;
    if (tiao.items[i].kind === 'bolt') tiaoBoltItem += 1;
    if (tiao.items[i].kind === 'bait') tiaoBaitItem += 1;
    if (tiao.items[i].kind === 'shove') tiaoShoveItem += 1;
    if (tiao.items[i].kind === 'frost') tiaoFrostItem += 1;
    if (tiao.items[i].kind === 'halo') tiaoHaloItem += 1;
    if (tiao.items[i].kind === 'pierce') tiaoPierceItem += 1;
    if (tiao.items[i].kind === 'split') tiaoSplitItem += 1;
    if (tiao.items[i].kind === 'dashboom') tiaoDashItem += 1;
    if (tiao.items[i].kind === 'suck') tiaoSuckItem += 1;
    if (tiao.items[i].kind === 'echo') tiaoEchoItem += 1;
    if (tiao.items[i].kind === 'haste') tiaoHasteItem += 1;
    if (tiao.items[i].kind === 'seed') tiaoSeedItem += 1;
  }
  if (tiaoBounceItem < 1) throw new Error('跳廊 needs 跳爆');
  if (tiaoDelayItem || tiaoTripItem || tiaoBoltItem || tiaoBaitItem || tiaoShoveItem || tiaoFrostItem || tiaoHaloItem || tiaoPierceItem || tiaoSplitItem || tiaoDashItem || tiaoSuckItem || tiaoEchoItem || tiaoHasteItem || tiaoSeedItem) {
    throw new Error('跳廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆/诱爆/雷爆/绊爆/迟爆');
  }
  if (tiaoCore !== 1) throw new Error('跳廊 心核');
  if (tiaoHeal < 1) throw new Error('跳廊 回星');
  const tiaoBox = tiao.crates.find(function (c) { return c.loot === 'core'; });
  if (!tiaoBox || tiaoBox.thick) throw new Error('跳廊 心核 crate is not thick');
  if (tiaoThick) throw new Error('跳廊 no thick crate');
  let tiaoHound = 0;
  let tiaoGuard = 0;
  let tiaoMoth = 0;
  let tiaoEater = 0;
  let tiaoShell = 0;
  for (let i = 0; i < tiao.enemies.length; i++) {
    if (isHound(tiao.enemies[i])) tiaoHound += 1;
    else if (isMoth(tiao.enemies[i])) tiaoMoth += 1;
    else if (isEater(tiao.enemies[i])) tiaoEater += 1;
    else if (isShell(tiao.enemies[i])) tiaoShell += 1;
    else tiaoGuard += 1;
  }
  if (tiaoGuard !== 2 || tiaoHound !== 0 || tiaoMoth !== 0 || tiaoEater !== 0 || tiaoShell !== 0) {
    throw new Error('跳廊 烬卫 only');
  }
  if (inWater(tiao, 80, 200) || inOil(tiao, 80, 200)) throw new Error('跳廊 spawn dry');
  if (inWater(tiao, 240, 200) || inOil(tiao, 240, 200)) throw new Error('跳廊 跳爆 dry');
  if (inOil(tiao, 860, 188) || inWater(tiao, 860, 188)) throw new Error('跳廊 core dry');
  if (inWater(tiao, 400, 200) || inOil(tiao, 400, 200)) throw new Error('跳廊 plant dry');
  if (!inWater(tiao, 350, 350)) throw new Error('跳廊 wet bag');
  if (inWater(tiao, 400, 100)) throw new Error('跳廊 north shelf wet');
  for (let i = 0; i < tiao.crates.length; i++) {
    const c = tiao.crates[i];
    if (circleRect(tiao.player.x, tiao.player.y, tiao.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('跳廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 400; x += 10) {
    for (let i = 0; i < tiao.crates.length; i++) {
      const c = tiao.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('跳廊 crate on dry walk');
      }
    }
  }
  for (let i = 0; i < tiao.enemies.length; i++) {
    const e = tiao.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('跳廊 foe too close to spawn');
    const dPlant = dist(e.x, e.y, 400, 200);
    if (!(dPlant > HOT_BLAST_R && dPlant <= BOUNCE_R)) throw new Error('跳廊 烬卫 outside blast inside bounce');
  }
  const tiaoNe = tiao.enemies.find(function (e) { return Math.abs(e.x - 520) < 1 && Math.abs(e.y - 110) < 1; });
  const tiaoSe = tiao.enemies.find(function (e) { return Math.abs(e.x - 520) < 1 && Math.abs(e.y - 290) < 1; });
  if (!tiaoNe || !tiaoSe) throw new Error('跳廊 NE/SE 烬卫');
  tiao.player.x = 80;
  tiao.player.y = 80;
  tiao.player.hearts = 3;
  tiao.player.inv = 0;
  tiao.hitstop = 0;
  tiao.embers.length = 0;
  const tiaoGround = tiao.items.find(function (it) { return it.kind === 'bounce' && !it.taken; });
  if (!tiaoGround) throw new Error('跳廊 ground 跳爆 present');
  tiao.player.x = tiaoGround.x;
  tiao.player.y = tiaoGround.y;
  update(tiao, 0.016);
  if (tiao.bounceReady !== true) throw new Error('pick bounce → bounceReady');
  if (tiao.toast !== TOAST.bounceGet) throw new Error('捡到跳爆 room');
  tiao.player.x = 80;
  tiao.player.y = 80;
  tiao.player.inv = 1;
  tiao.hitstop = 0;
  tiao.embers.length = 0;
  const tiaoHpNe = tiaoNe.hp;
  const tiaoHpSe = tiaoSe.hp;
  explode(tiao, 400, 200, false);
  if (tiao.bounceReady) throw new Error('跳廊 bounce spends');
  if (tiao.toast !== TOAST.bounceUse) throw new Error('跳过去了 room');
  if (!(tiaoNe.hp < tiaoHpNe || tiaoNe.hp <= 0)) throw new Error('跳廊 NE hot dmg');
  if (!(tiaoSe.hp < tiaoHpSe || tiaoSe.hp <= 0)) throw new Error('跳廊 SE hot dmg');
  tiao.bounceReady = true;
  tiao.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(tiao, 120, 120, false);
  if (!tiao.sparks[tiao.sparks.length - 1].wet) throw new Error('跳廊 wet spark');
  const tiaoBooms = tiao.stats.booms;
  for (let i = 0; i < 24; i++) update(tiao, 0.1);
  if (tiao.bounceReady !== true) throw new Error('跳廊 wet fizzle does not consume');
  if (tiao.stats.booms !== tiaoBooms) throw new Error('跳廊 wet no extra boom');
  tiao.waters = [];
  explode(tiao, 200, 200, false, false, false, { fork: true });
  if (tiao.bounceReady !== true) throw new Error('跳廊 fork does not consume');
  tiao.echoReady = true;
  explode(tiao, 200, 200, false);
  tiao.bounceReady = true;
  for (let i = 0; i < 12; i++) update(tiao, 0.05);
  if (tiao.bounceReady !== true) throw new Error('跳廊 echo does not consume');
  tiao.waters = [];
  explode(tiao, tiaoBox.x + tiaoBox.w * 0.5, tiaoBox.y - 20, false);
  if (!tiaoBox.open) throw new Error('跳廊 dry trail should open 心核');
  takeCore(tiao, { x: 100, y: 100 });
  if (tiao.won) throw new Error('跳廊 should not 通关');
  for (let i = 0; i < 20; i++) update(tiao, 0.1);
  if (tiao.roomName !== '卷廊') throw new Error('core advances to 卷廊');
  const hudTiao = makeState();
  resetRoom(hudTiao, 31, false);
  if (roomHudText(hudTiao).indexOf('跳廊 · 32/') !== 0) throw new Error('HUD 跳廊 32/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (BOUNCE_R !== 150) throw new Error('BOUNCE_R 150');
  if (BOUNCE_N !== 2) throw new Error('BOUNCE_N 2');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');

  const juan = makeState();
  resetRoom(juan, 32, false);
  if (juan.roomName !== '卷廊' || juan.roomId !== 'juanlang') throw new Error('juanlang load');
  if (juan.toast !== TOAST.rollRoom) throw new Error('卷廊 intro');
  if (juan.roomW !== 960 || juan.roomH !== 400) throw new Error('卷廊 size');
  if (juan.player.x !== 80 || juan.player.y !== 200) throw new Error('卷廊 spawn');
  if (juan.rollReady) throw new Error('卷廊 roll starts false');
  if (juan.rolls && juan.rolls.length) throw new Error('卷廊 rolls start empty');
  let juanStill = 0;
  let juanTide = 0;
  for (let i = 0; i < juan.waters.length; i++) {
    if (juan.waters[i].tide) juanTide += 1;
    else juanStill += 1;
  }
  if (juanStill < 1) throw new Error('卷廊 needs static 水洼');
  if (juanTide) throw new Error('卷廊 no tide');
  let juanCore = 0;
  let juanHeal = 0;
  let juanThick = 0;
  let juanRollItem = 0;
  let juanMirrorItem = 0;
  let juanBounceItem = 0;
  let juanDelayItem = 0;
  let juanTripItem = 0;
  let juanBoltItem = 0;
  let juanBaitItem = 0;
  let juanShoveItem = 0;
  let juanFrostItem = 0;
  let juanHaloItem = 0;
  let juanPierceItem = 0;
  let juanSplitItem = 0;
  let juanDashItem = 0;
  let juanSuckItem = 0;
  let juanEchoItem = 0;
  let juanHasteItem = 0;
  let juanSeedItem = 0;
  for (let i = 0; i < juan.crates.length; i++) {
    if (juan.crates[i].loot === 'core') juanCore += 1;
    if (juan.crates[i].loot === 'heal') juanHeal += 1;
    if (juan.crates[i].thick) juanThick += 1;
  }
  for (let i = 0; i < juan.items.length; i++) {
    if (juan.items[i].kind === 'roll') juanRollItem += 1;
    if (juan.items[i].kind === 'mirror') juanMirrorItem += 1;
    if (juan.items[i].kind === 'bounce') juanBounceItem += 1;
    if (juan.items[i].kind === 'delay') juanDelayItem += 1;
    if (juan.items[i].kind === 'trip') juanTripItem += 1;
    if (juan.items[i].kind === 'bolt') juanBoltItem += 1;
    if (juan.items[i].kind === 'bait') juanBaitItem += 1;
    if (juan.items[i].kind === 'shove') juanShoveItem += 1;
    if (juan.items[i].kind === 'frost') juanFrostItem += 1;
    if (juan.items[i].kind === 'halo') juanHaloItem += 1;
    if (juan.items[i].kind === 'pierce') juanPierceItem += 1;
    if (juan.items[i].kind === 'split') juanSplitItem += 1;
    if (juan.items[i].kind === 'dashboom') juanDashItem += 1;
    if (juan.items[i].kind === 'suck') juanSuckItem += 1;
    if (juan.items[i].kind === 'echo') juanEchoItem += 1;
    if (juan.items[i].kind === 'haste') juanHasteItem += 1;
    if (juan.items[i].kind === 'seed') juanSeedItem += 1;
  }
  if (juanRollItem < 1) throw new Error('卷廊 needs 卷爆');
  if (juanBounceItem || juanMirrorItem || juanDelayItem || juanTripItem || juanBoltItem || juanBaitItem || juanShoveItem || juanFrostItem || juanHaloItem || juanPierceItem || juanSplitItem || juanDashItem || juanSuckItem || juanEchoItem || juanHasteItem || juanSeedItem) {
    throw new Error('卷廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆/诱爆/雷爆/绊爆/迟爆/跳爆/镜爆');
  }
  if (juanCore !== 1) throw new Error('卷廊 心核');
  if (juanHeal < 1) throw new Error('卷廊 回星');
  const juanBox = juan.crates.find(function (c) { return c.loot === 'core'; });
  if (!juanBox || juanBox.thick) throw new Error('卷廊 心核 crate is not thick');
  if (juanThick) throw new Error('卷廊 no thick crate');
  let juanHound = 0;
  let juanGuard = 0;
  let juanMoth = 0;
  let juanEater = 0;
  let juanShell = 0;
  for (let i = 0; i < juan.enemies.length; i++) {
    if (isHound(juan.enemies[i])) juanHound += 1;
    else if (isMoth(juan.enemies[i])) juanMoth += 1;
    else if (isEater(juan.enemies[i])) juanEater += 1;
    else if (isShell(juan.enemies[i])) juanShell += 1;
    else juanGuard += 1;
  }
  if (juanGuard !== 3 || juanHound !== 0 || juanMoth !== 0 || juanEater !== 0 || juanShell !== 0) {
    throw new Error('卷廊 烬卫 only');
  }
  if (inWater(juan, 80, 200) || inOil(juan, 80, 200)) throw new Error('卷廊 spawn dry');
  if (inWater(juan, 220, 200) || inOil(juan, 220, 200)) throw new Error('卷廊 卷爆 dry');
  if (inOil(juan, 860, 188) || inWater(juan, 860, 188)) throw new Error('卷廊 core dry');
  if (inWater(juan, 340, 200) || inOil(juan, 340, 200)) throw new Error('卷廊 plant dry');
  if (!inWater(juan, 350, 350)) throw new Error('卷廊 wet bag');
  if (inWater(juan, 400, 100)) throw new Error('卷廊 north shelf wet');
  for (let i = 0; i < juan.crates.length; i++) {
    const c = juan.crates[i];
    if (circleRect(juan.player.x, juan.player.y, juan.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('卷廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 340; x += 10) {
    for (let i = 0; i < juan.crates.length; i++) {
      const c = juan.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('卷廊 crate on dry walk');
      }
    }
  }
  for (let i = 0; i < juan.enemies.length; i++) {
    const e = juan.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('卷廊 foe too close to spawn');
    const dPlant = dist(e.x, e.y, 340, 200);
    if (!(dPlant > HOT_BLAST_R)) throw new Error('卷廊 烬卫 outside blast');
  }
  const juanH1 = juan.enemies.find(function (e) { return Math.abs(e.x - 430) < 1 && Math.abs(e.y - 200) < 1; });
  const juanH2 = juan.enemies.find(function (e) { return Math.abs(e.x - 520) < 1 && Math.abs(e.y - 200) < 1; });
  const juanH3 = juan.enemies.find(function (e) { return Math.abs(e.x - 610) < 1 && Math.abs(e.y - 200) < 1; });
  if (!juanH1 || !juanH2 || !juanH3) throw new Error('卷廊 hop 烬卫');
  juan.player.x = 80;
  juan.player.y = 80;
  juan.player.hearts = 3;
  juan.player.inv = 0;
  juan.hitstop = 0;
  juan.embers.length = 0;
  const juanGround = juan.items.find(function (it) { return it.kind === 'roll' && !it.taken; });
  if (!juanGround) throw new Error('卷廊 ground 卷爆 present');
  juan.player.x = juanGround.x;
  juan.player.y = juanGround.y;
  update(juan, 0.016);
  if (juan.rollReady !== true) throw new Error('pick roll → rollReady');
  if (juan.toast !== TOAST.rollGet) throw new Error('捡到卷爆 room');
  juan.player.x = 80;
  juan.player.y = 80;
  juan.player.inv = 1;
  juan.player.faceX = 1;
  juan.player.faceY = 0;
  juan.hitstop = 0;
  juan.embers.length = 0;
  const juanHp1 = juanH1.hp;
  const juanHp2 = juanH2.hp;
  const juanHp3 = juanH3.hp;
  explode(juan, 340, 200, false);
  if (juan.rollReady) throw new Error('卷廊 roll spends');
  if (juan.toast !== TOAST.rollUse) throw new Error('卷出去了 room');
  if (!juan.rolls || juan.rolls.length !== 3) throw new Error('卷廊 queues 3 hops');
  if (juanH1.hp !== juanHp1 || juanH2.hp !== juanHp2 || juanH3.hp !== juanHp3) throw new Error('卷廊 hops not instant');
  for (let i = 0; i < 3; i++) {
    juan.hitstop = 0;
    updateRolls(juan, ROLL_DT + 0.01);
  }
  if (juan.rolls.length !== 0) throw new Error('卷廊 hops fire');
  if (!(juanH1.hp < juanHp1 || juanH1.hp <= 0)) throw new Error('卷廊 hop1 hot dmg');
  if (!(juanH2.hp < juanHp2 || juanH2.hp <= 0)) throw new Error('卷廊 hop2 hot dmg');
  if (!(juanH3.hp < juanHp3 || juanH3.hp <= 0)) throw new Error('卷廊 hop3 hot dmg');
  juan.rollReady = true;
  juan.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(juan, 120, 120, false);
  if (!juan.sparks[juan.sparks.length - 1].wet) throw new Error('卷廊 wet spark');
  const juanBooms = juan.stats.booms;
  for (let i = 0; i < 24; i++) update(juan, 0.1);
  if (juan.rollReady !== true) throw new Error('卷廊 wet fizzle does not consume');
  if (juan.stats.booms !== juanBooms) throw new Error('卷廊 wet no extra boom');
  juan.waters = [];
  explode(juan, 200, 200, false, false, false, { fork: true });
  if (juan.rollReady !== true) throw new Error('卷廊 fork does not consume');
  juan.echoReady = true;
  explode(juan, 200, 200, false);
  juan.rollReady = true;
  for (let i = 0; i < 12; i++) update(juan, 0.05);
  if (juan.rollReady !== true) throw new Error('卷廊 echo does not consume');
  juan.waters = [];
  explode(juan, juanBox.x + juanBox.w * 0.5, juanBox.y - 20, false);
  if (!juanBox.open) throw new Error('卷廊 dry trail should open 心核');
  takeCore(juan, { x: 100, y: 100 });
  if (juan.won) throw new Error('卷廊 should not 通关');
  for (let i = 0; i < 20; i++) update(juan, 0.1);
  if (juan.roomName !== '镜廊') throw new Error('core advances to 镜廊');
  const hudJuan = makeState();
  resetRoom(hudJuan, 32, false);
  if (roomHudText(hudJuan).indexOf('卷廊 · 33/') !== 0) throw new Error('HUD 卷廊 33/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (ROLL_N !== 3) throw new Error('ROLL_N 3');
  if (ROLL_GAP !== 90) throw new Error('ROLL_GAP 90');
  if (ROLL_DT !== 0.16) throw new Error('ROLL_DT 0.16');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (TOAST.rollGet !== '捡到卷爆') throw new Error('捡到卷爆');
  if (TOAST.rollUse !== '卷出去了') throw new Error('卷出去了 toast');
  if (TOAST.rollRoom !== '卷过去清场') throw new Error('卷过去清场');

  const jing = makeState();
  resetRoom(jing, 33, false);
  if (jing.roomName !== '镜廊' || jing.roomId !== 'jinglang') throw new Error('jinglang load');
  if (jing.toast !== TOAST.mirrorRoom) throw new Error('镜廊 intro');
  if (jing.roomW !== 960 || jing.roomH !== 400) throw new Error('镜廊 size');
  if (jing.player.x !== 80 || jing.player.y !== 200) throw new Error('镜廊 spawn');
  if (jing.mirrorReady) throw new Error('镜廊 mirror starts false');
  if (jing.mirrors && jing.mirrors.length) throw new Error('镜廊 mirrors start empty');
  let jingStill = 0;
  let jingTide = 0;
  for (let i = 0; i < jing.waters.length; i++) {
    if (jing.waters[i].tide) jingTide += 1;
    else jingStill += 1;
  }
  if (jingStill < 1) throw new Error('镜廊 needs static 水洼');
  if (jingTide) throw new Error('镜廊 no tide');
  let jingCore = 0;
  let jingHeal = 0;
  let jingThick = 0;
  let jingMirrorItem = 0;
  let jingRollItem = 0;
  let jingBounceItem = 0;
  let jingDelayItem = 0;
  let jingTripItem = 0;
  let jingBoltItem = 0;
  let jingBaitItem = 0;
  let jingShoveItem = 0;
  let jingFrostItem = 0;
  let jingHaloItem = 0;
  let jingPierceItem = 0;
  let jingSplitItem = 0;
  let jingDashItem = 0;
  let jingSuckItem = 0;
  let jingEchoItem = 0;
  let jingHasteItem = 0;
  let jingSeedItem = 0;
  for (let i = 0; i < jing.crates.length; i++) {
    if (jing.crates[i].loot === 'core') jingCore += 1;
    if (jing.crates[i].loot === 'heal') jingHeal += 1;
    if (jing.crates[i].thick) jingThick += 1;
  }
  for (let i = 0; i < jing.items.length; i++) {
    if (jing.items[i].kind === 'mirror') jingMirrorItem += 1;
    if (jing.items[i].kind === 'roll') jingRollItem += 1;
    if (jing.items[i].kind === 'bounce') jingBounceItem += 1;
    if (jing.items[i].kind === 'delay') jingDelayItem += 1;
    if (jing.items[i].kind === 'trip') jingTripItem += 1;
    if (jing.items[i].kind === 'bolt') jingBoltItem += 1;
    if (jing.items[i].kind === 'bait') jingBaitItem += 1;
    if (jing.items[i].kind === 'shove') jingShoveItem += 1;
    if (jing.items[i].kind === 'frost') jingFrostItem += 1;
    if (jing.items[i].kind === 'halo') jingHaloItem += 1;
    if (jing.items[i].kind === 'pierce') jingPierceItem += 1;
    if (jing.items[i].kind === 'split') jingSplitItem += 1;
    if (jing.items[i].kind === 'dashboom') jingDashItem += 1;
    if (jing.items[i].kind === 'suck') jingSuckItem += 1;
    if (jing.items[i].kind === 'echo') jingEchoItem += 1;
    if (jing.items[i].kind === 'haste') jingHasteItem += 1;
    if (jing.items[i].kind === 'seed') jingSeedItem += 1;
  }
  if (jingMirrorItem < 1) throw new Error('镜廊 needs 镜爆');
  if (jingRollItem || jingBounceItem || jingDelayItem || jingTripItem || jingBoltItem || jingBaitItem || jingShoveItem || jingFrostItem || jingHaloItem || jingPierceItem || jingSplitItem || jingDashItem || jingSuckItem || jingEchoItem || jingHasteItem || jingSeedItem) {
    throw new Error('镜廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆/诱爆/雷爆/绊爆/迟爆/跳爆/卷爆');
  }
  if (jingCore !== 1) throw new Error('镜廊 心核');
  if (jingHeal < 1) throw new Error('镜廊 回星');
  const jingBox = jing.crates.find(function (c) { return c.loot === 'core'; });
  if (!jingBox || jingBox.thick) throw new Error('镜廊 心核 crate is not thick');
  if (jingThick) throw new Error('镜廊 no thick crate');
  let jingHound = 0;
  let jingGuard = 0;
  let jingMoth = 0;
  let jingEater = 0;
  let jingShell = 0;
  for (let i = 0; i < jing.enemies.length; i++) {
    if (isHound(jing.enemies[i])) jingHound += 1;
    else if (isMoth(jing.enemies[i])) jingMoth += 1;
    else if (isEater(jing.enemies[i])) jingEater += 1;
    else if (isShell(jing.enemies[i])) jingShell += 1;
    else jingGuard += 1;
  }
  if (jingGuard !== 3 || jingHound !== 0 || jingMoth !== 0 || jingEater !== 0 || jingShell !== 0) {
    throw new Error('镜廊 烬卫 only');
  }
  if (inWater(jing, 80, 200) || inOil(jing, 80, 200)) throw new Error('镜廊 spawn dry');
  if (inWater(jing, 220, 200) || inOil(jing, 220, 200)) throw new Error('镜廊 镜爆 dry');
  if (inOil(jing, 860, 188) || inWater(jing, 860, 188)) throw new Error('镜廊 core dry');
  if (inWater(jing, 280, 200) || inOil(jing, 280, 200)) throw new Error('镜廊 plant dry');
  if (inWater(jing, 680, 200) || inOil(jing, 680, 200)) throw new Error('镜廊 mirror-bank dry');
  if (inWater(jing, 680, 160) || inOil(jing, 680, 160)) throw new Error('镜廊 guard N wet/oil');
  if (inWater(jing, 680, 240) || inOil(jing, 680, 240)) throw new Error('镜廊 guard S wet/oil');
  if (!inWater(jing, 350, 350)) throw new Error('镜廊 wet bag');
  if (inWater(jing, 400, 100)) throw new Error('镜廊 north shelf wet');
  for (let i = 0; i < jing.crates.length; i++) {
    const c = jing.crates[i];
    if (circleRect(jing.player.x, jing.player.y, jing.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('镜廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 300; x += 10) {
    for (let i = 0; i < jing.crates.length; i++) {
      const c = jing.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('镜廊 crate on dry walk');
      }
    }
  }
  for (let i = 0; i < jing.enemies.length; i++) {
    const e = jing.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('镜廊 foe too close to spawn');
    const dPlant = dist(e.x, e.y, 280, 200);
    if (!(dPlant > HOT_BLAST_R)) throw new Error('镜廊 烬卫 outside plant blast');
    const dMirror = dist(e.x, e.y, 680, 200);
    if (!(dMirror <= HOT_BLAST_R + (e.r || 0))) throw new Error('镜廊 烬卫 inside mirror blast');
  }
  const jingH1 = jing.enemies.find(function (e) { return Math.abs(e.x - 680) < 1 && Math.abs(e.y - 200) < 1; });
  const jingH2 = jing.enemies.find(function (e) { return Math.abs(e.x - 680) < 1 && Math.abs(e.y - 160) < 1; });
  const jingH3 = jing.enemies.find(function (e) { return Math.abs(e.x - 680) < 1 && Math.abs(e.y - 240) < 1; });
  if (!jingH1 || !jingH2 || !jingH3) throw new Error('镜廊 bank 烬卫');
  const jingCoreCx = jingBox.x + jingBox.w * 0.5;
  const jingCoreCy = jingBox.y + jingBox.h * 0.5;
  if (!(dist(jingCoreCx, jingCoreCy, 680, 200) > HOT_BLAST_R)) throw new Error('镜廊 core outside mirror blast');
  jing.player.x = 80;
  jing.player.y = 80;
  jing.player.hearts = 3;
  jing.player.inv = 0;
  jing.hitstop = 0;
  jing.embers.length = 0;
  const jingGround = jing.items.find(function (it) { return it.kind === 'mirror' && !it.taken; });
  if (!jingGround) throw new Error('镜廊 ground 镜爆 present');
  jing.player.x = jingGround.x;
  jing.player.y = jingGround.y;
  update(jing, 0.016);
  if (jing.mirrorReady !== true) throw new Error('pick mirror → mirrorReady');
  if (jing.toast !== TOAST.mirrorGet) throw new Error('捡到镜爆 room');
  jing.player.x = 80;
  jing.player.y = 80;
  jing.player.inv = 1;
  jing.hitstop = 0;
  jing.embers.length = 0;
  const jingHp1 = jingH1.hp;
  const jingHp2 = jingH2.hp;
  const jingHp3 = jingH3.hp;
  explode(jing, 280, 200, false);
  if (jing.mirrorReady) throw new Error('镜廊 mirror spends');
  if (jing.toast !== TOAST.mirrorUse) throw new Error('对岸也炸了 room');
  if (!jing.mirrors || jing.mirrors.length !== 1) throw new Error('镜廊 queues 1 mirror');
  if (Math.abs(jing.mirrors[0].x - 680) > 1) throw new Error('镜廊 pending x');
  if (jingH1.hp !== jingHp1 || jingH2.hp !== jingHp2 || jingH3.hp !== jingHp3) throw new Error('镜廊 mirror not instant');
  jing.hitstop = 0;
  updateMirrors(jing, MIRROR_DT + 0.01);
  if (jing.mirrors.length !== 0) throw new Error('镜廊 reflection fires');
  if (!(jingH1.hp < jingHp1 || jingH1.hp <= 0)) throw new Error('镜廊 mirror hot dmg 1');
  if (!(jingH2.hp < jingHp2 || jingH2.hp <= 0)) throw new Error('镜廊 mirror hot dmg 2');
  if (!(jingH3.hp < jingHp3 || jingH3.hp <= 0)) throw new Error('镜廊 mirror hot dmg 3');
  jing.mirrorReady = true;
  jing.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(jing, 120, 120, false);
  if (!jing.sparks[jing.sparks.length - 1].wet) throw new Error('镜廊 wet spark');
  const jingBooms = jing.stats.booms;
  for (let i = 0; i < 24; i++) update(jing, 0.1);
  if (jing.mirrorReady !== true) throw new Error('镜廊 wet fizzle does not consume');
  if (jing.stats.booms !== jingBooms) throw new Error('镜廊 wet no extra boom');
  jing.waters = [];
  explode(jing, 200, 200, false, false, false, { fork: true });
  if (jing.mirrorReady !== true) throw new Error('镜廊 fork does not consume');
  jing.echoReady = true;
  explode(jing, 200, 200, false);
  jing.mirrorReady = true;
  for (let i = 0; i < 12; i++) update(jing, 0.05);
  if (jing.mirrorReady !== true) throw new Error('镜廊 echo does not consume');
  jing.rollReady = true;
  explode(jing, 200, 200, false);
  jing.mirrorReady = true;
  for (let i = 0; i < 3; i++) {
    jing.hitstop = 0;
    updateRolls(jing, ROLL_DT + 0.01);
  }
  if (jing.mirrorReady !== true) throw new Error('镜廊 roll-hop does not consume');
  jing.waters = [];
  explode(jing, jingBox.x + jingBox.w * 0.5, jingBox.y - 20, false);
  if (!jingBox.open) throw new Error('镜廊 dry trail should open 心核');
  takeCore(jing, { x: 100, y: 100 });
  if (jing.won) throw new Error('镜廊 should not 通关');
  for (let i = 0; i < 20; i++) update(jing, 0.1);
  if (jing.roomName !== '旋廊') throw new Error('core advances to 旋廊');
  const hudJing = makeState();
  resetRoom(hudJing, 33, false);
  if (roomHudText(hudJing).indexOf('镜廊 · 34/') !== 0) throw new Error('HUD 镜廊 34/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (MIRROR_DT !== 0.14) throw new Error('MIRROR_DT 0.14');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (HOT_BLAST_R !== 56) throw new Error('HOT_BLAST_R 56');
  if (TOAST.mirrorGet !== '捡到镜爆') throw new Error('捡到镜爆');
  if (TOAST.mirrorUse !== '对岸也炸了') throw new Error('对岸也炸了 toast');
  if (TOAST.mirrorRoom !== '对岸清场') throw new Error('对岸清场');

  const xuan = makeState();
  resetRoom(xuan, 34, false);
  if (xuan.roomName !== '旋廊' || xuan.roomId !== 'xuanlang') throw new Error('xuanlang load');
  if (xuan.toast !== TOAST.spinRoom) throw new Error('旋廊 intro');
  if (xuan.roomW !== 960 || xuan.roomH !== 400) throw new Error('旋廊 size');
  if (xuan.player.x !== 80 || xuan.player.y !== 200) throw new Error('旋廊 spawn');
  if (xuan.spinReady) throw new Error('旋廊 spin starts false');
  if (xuan.spins && xuan.spins.length) throw new Error('旋廊 spins start empty');
  let xuanStill = 0;
  let xuanTide = 0;
  for (let i = 0; i < xuan.waters.length; i++) {
    if (xuan.waters[i].tide) xuanTide += 1;
    else xuanStill += 1;
  }
  if (xuanStill < 1) throw new Error('旋廊 needs static 水洼');
  if (xuanTide) throw new Error('旋廊 no tide');
  let xuanCore = 0;
  let xuanHeal = 0;
  let xuanThick = 0;
  let xuanSpinItem = 0;
  let xuanMirrorItem = 0;
  let xuanRollItem = 0;
  let xuanBounceItem = 0;
  let xuanDelayItem = 0;
  let xuanTripItem = 0;
  let xuanBoltItem = 0;
  let xuanBaitItem = 0;
  let xuanShoveItem = 0;
  let xuanFrostItem = 0;
  let xuanHaloItem = 0;
  let xuanPierceItem = 0;
  let xuanSplitItem = 0;
  let xuanDashItem = 0;
  let xuanSuckItem = 0;
  let xuanEchoItem = 0;
  let xuanHasteItem = 0;
  let xuanSeedItem = 0;
  for (let i = 0; i < xuan.crates.length; i++) {
    if (xuan.crates[i].loot === 'core') xuanCore += 1;
    if (xuan.crates[i].loot === 'heal') xuanHeal += 1;
    if (xuan.crates[i].thick) xuanThick += 1;
  }
  for (let i = 0; i < xuan.items.length; i++) {
    if (xuan.items[i].kind === 'spin') xuanSpinItem += 1;
    if (xuan.items[i].kind === 'mirror') xuanMirrorItem += 1;
    if (xuan.items[i].kind === 'roll') xuanRollItem += 1;
    if (xuan.items[i].kind === 'bounce') xuanBounceItem += 1;
    if (xuan.items[i].kind === 'delay') xuanDelayItem += 1;
    if (xuan.items[i].kind === 'trip') xuanTripItem += 1;
    if (xuan.items[i].kind === 'bolt') xuanBoltItem += 1;
    if (xuan.items[i].kind === 'bait') xuanBaitItem += 1;
    if (xuan.items[i].kind === 'shove') xuanShoveItem += 1;
    if (xuan.items[i].kind === 'frost') xuanFrostItem += 1;
    if (xuan.items[i].kind === 'halo') xuanHaloItem += 1;
    if (xuan.items[i].kind === 'pierce') xuanPierceItem += 1;
    if (xuan.items[i].kind === 'split') xuanSplitItem += 1;
    if (xuan.items[i].kind === 'dashboom') xuanDashItem += 1;
    if (xuan.items[i].kind === 'suck') xuanSuckItem += 1;
    if (xuan.items[i].kind === 'echo') xuanEchoItem += 1;
    if (xuan.items[i].kind === 'haste') xuanHasteItem += 1;
    if (xuan.items[i].kind === 'seed') xuanSeedItem += 1;
  }
  if (xuanSpinItem < 1) throw new Error('旋廊 needs 旋爆');
  if (xuanMirrorItem || xuanRollItem || xuanBounceItem || xuanDelayItem || xuanTripItem || xuanBoltItem || xuanBaitItem || xuanShoveItem || xuanFrostItem || xuanHaloItem || xuanPierceItem || xuanSplitItem || xuanDashItem || xuanSuckItem || xuanEchoItem || xuanHasteItem || xuanSeedItem) {
    throw new Error('旋廊 no 焰种/急燃/回爆/吸爆/冲爆/裂爆/贯爆/环爆/霜爆/推爆/诱爆/雷爆/绊爆/迟爆/跳爆/卷爆/镜爆');
  }
  if (xuanCore !== 1) throw new Error('旋廊 心核');
  if (xuanHeal < 1) throw new Error('旋廊 回星');
  const xuanBox = xuan.crates.find(function (c) { return c.loot === 'core'; });
  if (!xuanBox || xuanBox.thick) throw new Error('旋廊 心核 crate is not thick');
  if (xuanThick) throw new Error('旋廊 no thick crate');
  let xuanHound = 0;
  let xuanGuard = 0;
  let xuanMoth = 0;
  let xuanEater = 0;
  let xuanShell = 0;
  for (let i = 0; i < xuan.enemies.length; i++) {
    if (isHound(xuan.enemies[i])) xuanHound += 1;
    else if (isMoth(xuan.enemies[i])) xuanMoth += 1;
    else if (isEater(xuan.enemies[i])) xuanEater += 1;
    else if (isShell(xuan.enemies[i])) xuanShell += 1;
    else xuanGuard += 1;
  }
  if (xuanGuard !== 4 || xuanHound !== 0 || xuanMoth !== 0 || xuanEater !== 0 || xuanShell !== 0) {
    throw new Error('旋廊 烬卫 only');
  }
  if (inWater(xuan, 80, 200) || inOil(xuan, 80, 200)) throw new Error('旋廊 spawn dry');
  if (inWater(xuan, 240, 200) || inOil(xuan, 240, 200)) throw new Error('旋廊 旋爆 dry');
  if (inOil(xuan, 860, 188) || inWater(xuan, 860, 188)) throw new Error('旋廊 core dry');
  if (inWater(xuan, 400, 200) || inOil(xuan, 400, 200)) throw new Error('旋廊 plant dry');
  if (inWater(xuan, 400, 110) || inOil(xuan, 400, 110)) throw new Error('旋廊 orbit N wet/oil');
  if (inWater(xuan, 490, 200) || inOil(xuan, 490, 200)) throw new Error('旋廊 orbit E wet/oil');
  if (inWater(xuan, 400, 290) || inOil(xuan, 400, 290)) throw new Error('旋廊 orbit S wet/oil');
  if (inWater(xuan, 310, 200) || inOil(xuan, 310, 200)) throw new Error('旋廊 orbit W wet/oil');
  if (!inWater(xuan, 670, 350)) throw new Error('旋廊 wet bag');
  if (inWater(xuan, 400, 100)) throw new Error('旋廊 north shelf wet');
  for (let i = 0; i < xuan.crates.length; i++) {
    const c = xuan.crates[i];
    if (circleRect(xuan.player.x, xuan.player.y, xuan.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('旋廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 420; x += 10) {
    for (let i = 0; i < xuan.crates.length; i++) {
      const c = xuan.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('旋廊 crate on dry walk');
      }
    }
  }
  for (let i = 0; i < xuan.enemies.length; i++) {
    const e = xuan.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('旋廊 foe too close to spawn');
    const dPlant = dist(e.x, e.y, 400, 200);
    if (!(dPlant > HOT_BLAST_R)) throw new Error('旋廊 烬卫 outside plant blast');
  }
  const xuanN = xuan.enemies.find(function (e) { return Math.abs(e.x - 400) < 1 && Math.abs(e.y - 110) < 1; });
  const xuanE = xuan.enemies.find(function (e) { return Math.abs(e.x - 490) < 1 && Math.abs(e.y - 200) < 1; });
  const xuanS = xuan.enemies.find(function (e) { return Math.abs(e.x - 400) < 1 && Math.abs(e.y - 290) < 1; });
  const xuanW = xuan.enemies.find(function (e) { return Math.abs(e.x - 310) < 1 && Math.abs(e.y - 200) < 1; });
  if (!xuanN || !xuanE || !xuanS || !xuanW) throw new Error('旋廊 ring 烬卫');
  const xuanCoreCx = xuanBox.x + xuanBox.w * 0.5;
  const xuanCoreCy = xuanBox.y + xuanBox.h * 0.5;
  if (!(dist(xuanCoreCx, xuanCoreCy, 490, 200) > HOT_BLAST_R)) throw new Error('旋廊 core outside orbit blast');
  xuan.player.x = 80;
  xuan.player.y = 80;
  xuan.player.hearts = 3;
  xuan.player.inv = 0;
  xuan.hitstop = 0;
  xuan.embers.length = 0;
  const xuanGround = xuan.items.find(function (it) { return it.kind === 'spin' && !it.taken; });
  if (!xuanGround) throw new Error('旋廊 ground 旋爆 present');
  xuan.player.x = xuanGround.x;
  xuan.player.y = xuanGround.y;
  update(xuan, 0.016);
  if (xuan.spinReady !== true) throw new Error('pick spin → spinReady');
  if (xuan.toast !== TOAST.spinGet) throw new Error('捡到旋爆 room');
  xuan.player.x = 80;
  xuan.player.y = 80;
  xuan.player.inv = 1;
  xuan.hitstop = 0;
  xuan.embers.length = 0;
  const xuanHpN = xuanN.hp;
  const xuanHpE = xuanE.hp;
  const xuanHpS = xuanS.hp;
  const xuanHpW = xuanW.hp;
  explode(xuan, 400, 200, false);
  if (xuan.spinReady) throw new Error('旋廊 spin spends');
  if (xuan.toast !== TOAST.spinUse) throw new Error('旋出去了 room');
  if (!xuan.spins || xuan.spins.length !== 4) throw new Error('旋廊 queues 4 spins');
  const xuanSeats = [
    { x: 400, y: 110 },
    { x: 490, y: 200 },
    { x: 400, y: 290 },
    { x: 310, y: 200 },
  ];
  for (let i = 0; i < xuanSeats.length; i++) {
    const seat = xuanSeats[i];
    const pending = xuan.spins.find(function (p) { return dist(p.x, p.y, seat.x, seat.y) < 2; });
    if (!pending) throw new Error('旋廊 pending seat ' + i);
  }
  if (xuanN.hp !== xuanHpN || xuanE.hp !== xuanHpE || xuanS.hp !== xuanHpS || xuanW.hp !== xuanHpW) {
    throw new Error('旋廊 spin not instant');
  }
  xuan.hitstop = 0;
  updateSpins(xuan, SPIN_DT * SPIN_N + 0.05);
  if (xuan.spins.length !== 0) throw new Error('旋廊 orbits fire');
  if (!(xuanN.hp < xuanHpN || xuanN.hp <= 0)) throw new Error('旋廊 spin hot dmg N');
  if (!(xuanE.hp < xuanHpE || xuanE.hp <= 0)) throw new Error('旋廊 spin hot dmg E');
  if (!(xuanS.hp < xuanHpS || xuanS.hp <= 0)) throw new Error('旋廊 spin hot dmg S');
  if (!(xuanW.hp < xuanHpW || xuanW.hp <= 0)) throw new Error('旋廊 spin hot dmg W');
  xuan.spinReady = true;
  xuan.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(xuan, 120, 120, false);
  if (!xuan.sparks[xuan.sparks.length - 1].wet) throw new Error('旋廊 wet spark');
  const xuanBooms = xuan.stats.booms;
  for (let i = 0; i < 24; i++) update(xuan, 0.1);
  if (xuan.spinReady !== true) throw new Error('旋廊 wet fizzle does not consume');
  if (xuan.stats.booms !== xuanBooms) throw new Error('旋廊 wet no extra boom');
  xuan.waters = [];
  explode(xuan, 200, 200, false, false, false, { fork: true });
  if (xuan.spinReady !== true) throw new Error('旋廊 fork does not consume');
  xuan.echoReady = true;
  explode(xuan, 200, 200, false);
  xuan.spinReady = true;
  for (let i = 0; i < 12; i++) update(xuan, 0.05);
  if (xuan.spinReady !== true) throw new Error('旋廊 echo does not consume');
  xuan.rollReady = true;
  explode(xuan, 200, 200, false);
  xuan.spinReady = true;
  for (let i = 0; i < 3; i++) {
    xuan.hitstop = 0;
    updateRolls(xuan, ROLL_DT + 0.01);
  }
  if (xuan.spinReady !== true) throw new Error('旋廊 roll-hop does not consume');
  xuan.mirrorReady = true;
  explode(xuan, 200, 200, false);
  xuan.spinReady = true;
  xuan.hitstop = 0;
  updateMirrors(xuan, MIRROR_DT + 0.01);
  if (xuan.spinReady !== true) throw new Error('旋廊 mirror-reflection does not consume');
  xuan.waters = [];
  explode(xuan, xuanBox.x + xuanBox.w * 0.5, xuanBox.y - 20, false);
  if (!xuanBox.open) throw new Error('旋廊 dry trail should open 心核');
  takeCore(xuan, { x: 100, y: 100 });
  if (xuan.won) throw new Error('旋廊 should not 通关');
  for (let i = 0; i < 20; i++) update(xuan, 0.1);
  if (xuan.roomName !== '爆廊') throw new Error('core advances to 爆廊');
  const hudXuan = makeState();
  resetRoom(hudXuan, 34, false);
  if (roomHudText(hudXuan).indexOf('旋廊 · 35/') !== 0) throw new Error('HUD 旋廊 35/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (SPIN_N !== 4) throw new Error('SPIN_N 4');
  if (SPIN_R !== 90) throw new Error('SPIN_R 90');
  if (SPIN_DT !== 0.14) throw new Error('SPIN_DT 0.14');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (HOT_BLAST_R !== 56) throw new Error('HOT_BLAST_R 56');
  if (TOAST.spinGet !== '捡到旋爆') throw new Error('捡到旋爆');
  if (TOAST.spinUse !== '旋出去了') throw new Error('旋出去了 toast');
  if (TOAST.spinRoom !== '围着清场') throw new Error('围着清场');

  const bao = makeState();
  resetRoom(bao, 35, false);
  if (bao.roomName !== '爆廊' || bao.roomId !== 'baolang') throw new Error('baolang load');
  if (bao.toast !== TOAST.boomerRoom) throw new Error('爆廊 intro');
  if (bao.roomW !== 960 || bao.roomH !== 400) throw new Error('爆廊 size');
  if (bao.player.x !== 80 || bao.player.y !== 200) throw new Error('爆廊 spawn');
  if (bao.boomerFuses && bao.boomerFuses.length) throw new Error('爆廊 fuses start empty');
  let baoStill = 0;
  let baoTide = 0;
  for (let i = 0; i < bao.waters.length; i++) {
    if (bao.waters[i].tide) baoTide += 1;
    else baoStill += 1;
  }
  if (baoStill < 1) throw new Error('爆廊 needs static 水洼');
  if (baoTide) throw new Error('爆廊 no tide');
  let baoCore = 0;
  let baoHeal = 0;
  let baoThick = 0;
  for (let i = 0; i < bao.crates.length; i++) {
    if (bao.crates[i].loot === 'core') baoCore += 1;
    if (bao.crates[i].loot === 'heal') baoHeal += 1;
    if (bao.crates[i].thick) baoThick += 1;
  }
  if (bao.items && bao.items.length) throw new Error('爆廊 no ground pickup');
  if (baoCore !== 1) throw new Error('爆廊 心核');
  if (baoHeal < 1) throw new Error('爆廊 回星');
  const baoBox = bao.crates.find(function (c) { return c.loot === 'core'; });
  if (!baoBox || baoBox.thick) throw new Error('爆廊 心核 crate is not thick');
  if (baoThick) throw new Error('爆廊 no thick crate');
  let baoHound = 0;
  let baoGuard = 0;
  let baoMoth = 0;
  let baoEater = 0;
  let baoShell = 0;
  let baoBoomer = 0;
  for (let i = 0; i < bao.enemies.length; i++) {
    if (isHound(bao.enemies[i])) baoHound += 1;
    else if (isMoth(bao.enemies[i])) baoMoth += 1;
    else if (isEater(bao.enemies[i])) baoEater += 1;
    else if (isShell(bao.enemies[i])) baoShell += 1;
    else if (isBoomer(bao.enemies[i])) baoBoomer += 1;
    else baoGuard += 1;
  }
  if (baoBoomer !== 2 || baoGuard !== 0 || baoHound !== 0 || baoMoth !== 0 || baoEater !== 0 || baoShell !== 0) {
    throw new Error('爆廊 爆卫 only');
  }
  if (bao.enemies[0].hp !== BOOMER_HP || bao.enemies[1].hp !== BOOMER_HP) {
    throw new Error('爆廊 爆卫 hp');
  }
  if (bao.enemies[0].r !== BOOMER_R || bao.enemies[1].r !== BOOMER_R) {
    throw new Error('爆廊 爆卫 r');
  }
  if (inWater(bao, 80, 200) || inOil(bao, 80, 200)) throw new Error('爆廊 spawn dry');
  if (inOil(bao, 860, 188) || inWater(bao, 860, 188)) throw new Error('爆廊 core dry');
  if (inWater(bao, 500, 200) || inOil(bao, 500, 200)) throw new Error('爆廊 爆卫 dry');
  if (inWater(bao, 545, 200) || inOil(bao, 545, 200)) throw new Error('爆廊 爆卫 dry lane');
  if (inWater(bao, 522, 200) || inOil(bao, 522, 200)) throw new Error('爆廊 plant dry');
  if (!inWater(bao, 450, 350)) throw new Error('爆廊 wet bag');
  if (inWater(bao, 400, 100)) throw new Error('爆廊 north shelf wet');
  for (let i = 0; i < bao.crates.length; i++) {
    const c = bao.crates[i];
    if (circleRect(bao.player.x, bao.player.y, bao.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('爆廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 460; x += 10) {
    for (let i = 0; i < bao.crates.length; i++) {
      const c = bao.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('爆廊 crate on dry walk');
      }
    }
  }
  for (let i = 0; i < bao.enemies.length; i++) {
    const e = bao.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('爆廊 foe too close to spawn');
    if (!(dist(e.x, e.y, 522, 200) <= BLAST_R + BOOMER_R)) {
      throw new Error('爆廊 爆卫 inside plant blast');
    }
  }
  const baoW = bao.enemies.find(function (e) { return Math.abs(e.x - 500) < 1 && Math.abs(e.y - 200) < 1; });
  const baoE = bao.enemies.find(function (e) { return Math.abs(e.x - 545) < 1 && Math.abs(e.y - 200) < 1; });
  if (!baoW || !baoE) throw new Error('爆廊 pair 爆卫');
  const baoCoreCx = baoBox.x + baoBox.w * 0.5;
  const baoCoreCy = baoBox.y + baoBox.h * 0.5;
  if (!(dist(baoCoreCx, baoCoreCy, 545, 200) > HOT_BLAST_R)) throw new Error('爆廊 core outside corpse blast');
  bao.player.x = 80;
  bao.player.y = 80;
  bao.player.hearts = 3;
  bao.player.inv = 2;
  bao.hitstop = 0;
  bao.embers.length = 0;
  const baoFuse0 = (bao.boomerFuses || []).length;
  explode(bao, 80, 80, false, false, false, { fork: true });
  if ((bao.boomerFuses || []).length !== baoFuse0) throw new Error('fork explode does not queue fuse');
  if (baoW.hp !== BOOMER_HP || baoE.hp !== BOOMER_HP) throw new Error('fork miss keeps 爆卫');
  bao.hitstop = 0;
  bao.embers.length = 0;
  explode(bao, 522, 200, false);
  if (baoW.hp !== 0 || baoE.hp !== 0) throw new Error('dry explode drops both 爆卫');
  if (bao.toast !== TOAST.boomer) throw new Error('爆卫倒了 room');
  if (!bao.boomerFuses || bao.boomerFuses.length !== 2) throw new Error('two fuses queued');
  bao.player.x = 80;
  bao.player.y = 80;
  bao.player.inv = 2;
  bao.hitstop = 0;
  const baoBooms = bao.stats.booms;
  updateBoomerFuses(bao, BOOMER_T + 0.05);
  if (bao.boomerFuses.length !== 0) throw new Error('爆廊 fuses fire');
  if (!(bao.stats.booms > baoBooms)) throw new Error('爆廊 corpse hot boom');
  if (bao.toast !== TOAST.boomerPop) throw new Error('爆卫炸了 room');
  const baoBooms2 = bao.stats.booms;
  bao.boomerFuses.push({ x: 470, y: 350, t: BOOMER_T });
  updateBoomerFuses(bao, 0.05);
  if (bao.boomerFuses.length !== 0) throw new Error('爆廊 puddle fizzle');
  if (bao.stats.booms !== baoBooms2) throw new Error('wet fuse no extra boom');
  if (bao.toast !== TOAST.boomerFizzle) throw new Error('爆线熄了 room');
  bao.waters = [];
  explode(bao, baoBox.x + baoBox.w * 0.5, baoBox.y - 20, false);
  if (!baoBox.open) throw new Error('爆廊 dry trail should open 心核');
  takeCore(bao, { x: 100, y: 100 });
  if (bao.won) throw new Error('爆廊 should not 通关');
  for (let i = 0; i < 20; i++) update(bao, 0.1);
  if (bao.roomName !== '洼廊') throw new Error('core advances to 洼廊');
  const hudBao = makeState();
  resetRoom(hudBao, 35, false);
  if (roomHudText(hudBao).indexOf('爆廊 · 36/') !== 0) throw new Error('HUD 爆廊 36/38');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (BOOMER_HP !== 1) throw new Error('BOOMER_HP 1');
  if (BOOMER_R !== 13) throw new Error('BOOMER_R 13');
  if (BOOMER_T !== 0.80) throw new Error('BOOMER_T 0.80');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (HOT_BLAST_R !== 56) throw new Error('HOT_BLAST_R 56');
  if (TOAST.boomer !== '爆卫倒了') throw new Error('爆卫倒了 toast');
  if (TOAST.boomerPop !== '爆卫炸了') throw new Error('爆卫炸了 toast');
  if (TOAST.boomerFizzle !== '爆线熄了') throw new Error('爆线熄了 toast');
  if (TOAST.boomerRoom !== '倒了还会炸') throw new Error('倒了还会炸');

  const wa = makeState();
  resetRoom(wa, 36, false);
  if (wa.roomName !== '洼廊' || wa.roomId !== 'walang') throw new Error('walang load');
  if (wa.toast !== TOAST.poolRoom) throw new Error('洼廊 intro');
  if (wa.roomW !== 960 || wa.roomH !== 400) throw new Error('洼廊 size');
  if (wa.player.x !== 80 || wa.player.y !== 200) throw new Error('洼廊 spawn');
  if (wa.poolReady) throw new Error('洼廊 pool starts false');
  let waStill = 0;
  let waTide = 0;
  let waTemp = 0;
  for (let i = 0; i < wa.waters.length; i++) {
    if (wa.waters[i].temp) waTemp += 1;
    else if (wa.waters[i].tide) waTide += 1;
    else waStill += 1;
  }
  if (waStill < 1) throw new Error('洼廊 needs static 水洼');
  if (waTide) throw new Error('洼廊 no tide');
  if (waTemp) throw new Error('洼廊 no temp pad at start');
  let waCore = 0;
  let waHeal = 0;
  let waThick = 0;
  let waPoolItem = 0;
  let waSpinItem = 0;
  let waMirrorItem = 0;
  let waRollItem = 0;
  for (let i = 0; i < wa.crates.length; i++) {
    if (wa.crates[i].loot === 'core') waCore += 1;
    if (wa.crates[i].loot === 'heal') waHeal += 1;
    if (wa.crates[i].thick) waThick += 1;
  }
  for (let i = 0; i < wa.items.length; i++) {
    if (wa.items[i].kind === 'pool') waPoolItem += 1;
    if (wa.items[i].kind === 'spin') waSpinItem += 1;
    if (wa.items[i].kind === 'mirror') waMirrorItem += 1;
    if (wa.items[i].kind === 'roll') waRollItem += 1;
  }
  if (waPoolItem < 1) throw new Error('洼廊 needs 洼爆');
  if (waSpinItem || waMirrorItem || waRollItem) throw new Error('洼廊 no extra pickup');
  if (waCore !== 1) throw new Error('洼廊 心核');
  if (waHeal < 1) throw new Error('洼廊 回星');
  const waBox = wa.crates.find(function (c) { return c.loot === 'core'; });
  if (!waBox || waBox.thick) throw new Error('洼廊 心核 crate is not thick');
  if (waThick) throw new Error('洼廊 no thick crate');
  let waHound = 0;
  let waGuard = 0;
  let waMoth = 0;
  let waEater = 0;
  let waShell = 0;
  let waBoomer = 0;
  for (let i = 0; i < wa.enemies.length; i++) {
    if (isHound(wa.enemies[i])) waHound += 1;
    else if (isMoth(wa.enemies[i])) waMoth += 1;
    else if (isEater(wa.enemies[i])) waEater += 1;
    else if (isShell(wa.enemies[i])) waShell += 1;
    else if (isBoomer(wa.enemies[i])) waBoomer += 1;
    else waGuard += 1;
  }
  if (waBoomer !== 2 || waGuard !== 0 || waHound !== 0 || waMoth !== 0 || waEater !== 0 || waShell !== 0) {
    throw new Error('洼廊 爆卫 only');
  }
  if (inWater(wa, 80, 200) || inOil(wa, 80, 200)) throw new Error('洼廊 spawn dry');
  if (inWater(wa, 240, 200) || inOil(wa, 240, 200)) throw new Error('洼廊 洼爆 dry');
  if (inOil(wa, 860, 188) || inWater(wa, 860, 188)) throw new Error('洼廊 core dry');
  if (inWater(wa, 520, 200) || inOil(wa, 520, 200)) throw new Error('洼廊 plant dry');
  if (inWater(wa, 500, 200) || inOil(wa, 500, 200)) throw new Error('洼廊 爆卫 dry');
  if (inWater(wa, 545, 200) || inOil(wa, 545, 200)) throw new Error('洼廊 爆卫 dry lane');
  if (!inWater(wa, 750, 350)) throw new Error('洼廊 wet bag');
  if (inWater(wa, 400, 100)) throw new Error('洼廊 north shelf wet');
  for (let i = 0; i < wa.crates.length; i++) {
    const c = wa.crates[i];
    if (circleRect(wa.player.x, wa.player.y, wa.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('洼廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 540; x += 10) {
    for (let i = 0; i < wa.crates.length; i++) {
      const c = wa.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('洼廊 crate on dry walk');
      }
    }
  }
  for (let i = 0; i < wa.enemies.length; i++) {
    const e = wa.enemies[i];
    if (dist(e.x, e.y, 80, 200) < 80) throw new Error('洼廊 foe too close to spawn');
    if (!(dist(e.x, e.y, 520, 200) <= BLAST_R + BOOMER_R)) {
      throw new Error('洼廊 爆卫 inside plant blast');
    }
  }
  const waW = wa.enemies.find(function (e) { return Math.abs(e.x - 500) < 1 && Math.abs(e.y - 200) < 1; });
  const waE = wa.enemies.find(function (e) { return Math.abs(e.x - 545) < 1 && Math.abs(e.y - 200) < 1; });
  if (!waW || !waE) throw new Error('洼廊 pair 爆卫');
  const waCoreCx = waBox.x + waBox.w * 0.5;
  const waCoreCy = waBox.y + waBox.h * 0.5;
  if (!(dist(waCoreCx, waCoreCy, 520, 200) > BLAST_R)) throw new Error('洼廊 core outside plant blast');
  wa.player.x = 80;
  wa.player.y = 80;
  wa.player.hearts = 3;
  wa.player.inv = 2;
  wa.hitstop = 0;
  wa.embers.length = 0;
  const waGround = wa.items.find(function (it) { return it.kind === 'pool' && !it.taken; });
  if (!waGround) throw new Error('洼廊 ground 洼爆 present');
  wa.player.x = waGround.x;
  wa.player.y = waGround.y;
  update(wa, 0.016);
  if (wa.poolReady !== true) throw new Error('pick pool → poolReady');
  if (wa.toast !== TOAST.poolGet) throw new Error('捡到洼爆 room');
  wa.player.x = 80;
  wa.player.y = 80;
  wa.player.inv = 2;
  wa.hitstop = 0;
  wa.embers.length = 0;
  explode(wa, 520, 200, false);
  if (wa.poolReady) throw new Error('洼廊 pool spends');
  if (wa.toast !== TOAST.poolUse) throw new Error('洼开了 room');
  if (waW.hp !== 0 || waE.hp !== 0) throw new Error('洼廊 dry explode drops both 爆卫');
  const waPad = (wa.waters || []).find(function (w) { return w.temp; });
  if (!waPad) throw new Error('洼廊 planted temp pad');
  if (!inWater(wa, 520, 200)) throw new Error('洼廊 pad covers plant');
  if (!inWater(wa, 500, 200) && !(wa.boomerFuses || []).some(function (f) { return inWater(wa, f.x, f.y); })) {
    throw new Error('洼廊 pad covers west fuse');
  }
  if (!inWater(wa, 545, 200) && !(wa.boomerFuses || []).some(function (f) { return inWater(wa, f.x, f.y); })) {
    throw new Error('洼廊 pad covers east fuse');
  }
  if (!wa.boomerFuses || wa.boomerFuses.length !== 2) throw new Error('洼廊 two fuses queued');
  for (let i = 0; i < wa.boomerFuses.length; i++) {
    if (!inWater(wa, wa.boomerFuses[i].x, wa.boomerFuses[i].y)) {
      throw new Error('洼廊 fuse in pad');
    }
  }
  wa.player.x = 80;
  wa.player.y = 80;
  wa.player.inv = 2;
  wa.hitstop = 0;
  const waBooms = wa.stats.booms;
  update(wa, 0.05);
  if (wa.boomerFuses && wa.boomerFuses.length) throw new Error('洼廊 fuses fizzle in pad');
  if (wa.stats.booms !== waBooms) throw new Error('洼廊 no corpse boom in pad');
  if (wa.toast !== TOAST.boomerFizzle && wa.toast !== TOAST.poolUse) {
    throw new Error('爆线熄了 or pad toast');
  }
  wa.poolReady = true;
  wa.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(wa, 120, 120, false);
  if (!wa.sparks[wa.sparks.length - 1].wet) throw new Error('洼廊 wet spark');
  const waBoomsWet = wa.stats.booms;
  for (let i = 0; i < 24; i++) update(wa, 0.1);
  if (wa.poolReady !== true) throw new Error('洼廊 wet fizzle does not consume');
  if (wa.stats.booms !== waBoomsWet) throw new Error('洼廊 wet no extra boom');
  wa.waters = [];
  explode(wa, 200, 200, false, false, false, { fork: true });
  if (wa.poolReady !== true) throw new Error('洼廊 fork does not consume');
  wa.echoReady = true;
  explode(wa, 200, 200, false);
  wa.poolReady = true;
  for (let i = 0; i < 12; i++) update(wa, 0.05);
  if (wa.poolReady !== true) throw new Error('洼廊 echo does not consume');
  wa.spinReady = true;
  explode(wa, 200, 200, false);
  wa.poolReady = true;
  wa.hitstop = 0;
  updateSpins(wa, SPIN_DT * SPIN_N + 0.05);
  if (wa.poolReady !== true) throw new Error('洼廊 spin-orbit does not consume');
  wa.poolReady = false;
  wa.waters = (wa.waters || []).filter(function (w) { return !w.temp; });
  explode(wa, waBox.x + waBox.w * 0.5, waBox.y - 20, false);
  if (!waBox.open) throw new Error('洼廊 dry trail should open 心核');
  takeCore(wa, { x: 100, y: 100 });
  if (ROOMS.length <= 37) {
    if (!wa.won || wa.toast !== TOAST.all) throw new Error('洼廊 should 通关');
  } else {
    if (wa.won) throw new Error('洼廊 not last');
    if (wa.toast !== TOAST.core) throw new Error('洼廊 心核到手');
  }
  const hudWa = makeState();
  resetRoom(hudWa, 36, false);
  if (roomHudText(hudWa).indexOf('洼廊 · 37/') !== 0) throw new Error('HUD 洼廊 37/n');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (POOL_R !== 52) throw new Error('POOL_R 52');
  if (POOL_LIFE !== 5.0) throw new Error('POOL_LIFE 5.0');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (HOT_BLAST_R !== 56) throw new Error('HOT_BLAST_R 56');
  if (TOAST.poolGet !== '捡到洼爆') throw new Error('捡到洼爆');
  if (TOAST.poolUse !== '洼开了') throw new Error('洼开了 toast');
  if (TOAST.poolDry !== '洼干了') throw new Error('洼干了 toast');
  if (TOAST.poolRoom !== '炸出一洼') throw new Error('炸出一洼');

  const shan = makeState();
  resetRoom(shan, 37, false);
  if (shan.roomName !== '扇廊' || shan.roomId !== 'shanlang') throw new Error('shanlang load');
  takeCore(shan, { x: 100, y: 100 });
  if (shan.won) throw new Error('扇廊 should not 通关');
  if (shan.toast !== TOAST.core) throw new Error('扇廊 过关');
  for (let i = 0; i < 20; i++) update(shan, 0.1);
  if (shan.roomName !== '鼓廊') throw new Error('core advances to 鼓廊');
  const hudShan = makeState();
  resetRoom(hudShan, 37, false);
  if (roomHudText(hudShan).indexOf('扇廊 · 38/') !== 0) throw new Error('HUD 扇廊 38/n');

  const gu = makeState();
  resetRoom(gu, 38, false);
  if (gu.roomName !== '鼓廊' || gu.roomId !== 'gulang') throw new Error('gulang load');
  if (gu.toast !== TOAST.drumRoom) throw new Error('鼓廊 intro');
  if (gu.roomW !== 960 || gu.roomH !== 400) throw new Error('鼓廊 size');
  if (gu.player.x !== 80 || gu.player.y !== 200) throw new Error('鼓廊 spawn');
  if (gu.drumReady) throw new Error('鼓廊 drum starts false');
  if (!gu.drums || gu.drums.length) throw new Error('鼓廊 drums start empty');
  let guStill = 0;
  let guTide = 0;
  for (let i = 0; i < gu.waters.length; i++) {
    if (gu.waters[i].tide) guTide += 1;
    else guStill += 1;
  }
  if (guStill < 1) throw new Error('鼓廊 needs static 水洼');
  if (guTide) throw new Error('鼓廊 no tide');
  let guCore = 0;
  let guHeal = 0;
  let guThick = 0;
  let guDrumItem = 0;
  let guFanItem = 0;
  for (let i = 0; i < gu.crates.length; i++) {
    if (gu.crates[i].loot === 'core') guCore += 1;
    if (gu.crates[i].loot === 'heal') guHeal += 1;
    if (gu.crates[i].thick) guThick += 1;
  }
  for (let i = 0; i < gu.items.length; i++) {
    if (gu.items[i].kind === 'drum') guDrumItem += 1;
    if (gu.items[i].kind === 'fan') guFanItem += 1;
  }
  if (guDrumItem < 1) throw new Error('鼓廊 needs 鼓爆');
  if (guFanItem) throw new Error('鼓廊 no extra pickup');
  if (guCore !== 1) throw new Error('鼓廊 心核');
  if (guHeal < 1) throw new Error('鼓廊 回星');
  const guBox = gu.crates.find(function (c) { return c.loot === 'core'; });
  if (!guBox || guBox.thick) throw new Error('鼓廊 心核 crate is not thick');
  if (guThick) throw new Error('鼓廊 no thick crate');
  let guHound = 0;
  let guGuard = 0;
  let guMoth = 0;
  let guEater = 0;
  let guShell = 0;
  let guBoomer = 0;
  for (let i = 0; i < gu.enemies.length; i++) {
    if (isHound(gu.enemies[i])) guHound += 1;
    else if (isMoth(gu.enemies[i])) guMoth += 1;
    else if (isEater(gu.enemies[i])) guEater += 1;
    else if (isShell(gu.enemies[i])) guShell += 1;
    else if (isBoomer(gu.enemies[i])) guBoomer += 1;
    else guGuard += 1;
  }
  if (guGuard !== 3 || guHound !== 0 || guMoth !== 0 || guEater !== 0 || guShell !== 0 || guBoomer !== 0) {
    throw new Error('鼓廊 烬卫 only');
  }
  if (inWater(gu, 80, 200) || inOil(gu, 80, 200)) throw new Error('鼓廊 spawn dry');
  if (inWater(gu, 240, 200) || inOil(gu, 240, 200)) throw new Error('鼓廊 鼓爆 dry');
  if (inWater(gu, 400, 200) || inOil(gu, 400, 200)) throw new Error('鼓廊 plant dry');
  if (inOil(gu, 860, 188) || inWater(gu, 860, 188)) throw new Error('鼓廊 core dry');
  if (inWater(gu, 490, 140) || inOil(gu, 490, 140)) throw new Error('鼓廊 烬卫 dry N');
  if (inWater(gu, 520, 200) || inOil(gu, 520, 200)) throw new Error('鼓廊 烬卫 dry E');
  if (inWater(gu, 490, 260) || inOil(gu, 490, 260)) throw new Error('鼓廊 烬卫 dry S');
  if (!inWater(gu, 750, 350)) throw new Error('鼓廊 wet bag');
  if (inWater(gu, 400, 100)) throw new Error('鼓廊 north shelf wet');
  for (let i = 0; i < gu.crates.length; i++) {
    const c = gu.crates[i];
    if (circleRect(gu.player.x, gu.player.y, gu.player.r, c.x, c.y, c.w, c.h)) {
      throw new Error('鼓廊 crate on spawn');
    }
  }
  for (let x = 80; x <= 450; x += 10) {
    for (let i = 0; i < gu.crates.length; i++) {
      const c = gu.crates[i];
      if (circleRect(x, 200, PLAYER_R, c.x, c.y, c.w, c.h)) {
        throw new Error('鼓廊 crate on dry walk');
      }
    }
  }
  const guN = gu.enemies.find(function (e) { return Math.abs(e.x - 490) < 1 && Math.abs(e.y - 140) < 1; });
  const guE = gu.enemies.find(function (e) { return Math.abs(e.x - 520) < 1 && Math.abs(e.y - 200) < 1; });
  const guS = gu.enemies.find(function (e) { return Math.abs(e.x - 490) < 1 && Math.abs(e.y - 260) < 1; });
  if (!guN || !guE || !guS) throw new Error('鼓廊 three 烬卫 seats');
  const guSeats = [guN, guE, guS];
  for (let i = 0; i < guSeats.length; i++) {
    const e = guSeats[i];
    const dPlant = dist(e.x, e.y, 400, 200);
    if (dPlant <= BLAST_R + (e.r || ENEMY_R)) throw new Error('鼓廊 primary misses 烬卫');
    if (!(dPlant < DRUM_R)) throw new Error('鼓廊 drum reaches 烬卫');
  }
  const guCoreCx = guBox.x + guBox.w * 0.5;
  const guCoreCy = guBox.y + guBox.h * 0.5;
  if (!(dist(guCoreCx, guCoreCy, 400, 200) > BLAST_R)) throw new Error('鼓廊 core outside plant blast');
  gu.player.x = 80;
  gu.player.y = 80;
  gu.player.hearts = 3;
  gu.player.inv = 2;
  gu.hitstop = 0;
  gu.embers.length = 0;
  const guGround = gu.items.find(function (it) { return it.kind === 'drum' && !it.taken; });
  if (!guGround) throw new Error('鼓廊 ground 鼓爆 present');
  gu.player.x = guGround.x;
  gu.player.y = 200;
  update(gu, 0.016);
  if (gu.drumReady !== true) throw new Error('pick drum → drumReady');
  if (gu.toast !== TOAST.drumGet) throw new Error('捡到鼓爆 room');
  gu.player.x = 80;
  gu.player.y = 80;
  gu.player.inv = 2;
  gu.hitstop = 0;
  gu.embers.length = 0;
  const guHpN = guN.hp;
  const guHpE = guE.hp;
  const guHpS = guS.hp;
  explode(gu, 400, 200, false);
  if (gu.drumReady) throw new Error('鼓廊 drum spends');
  if (gu.toast !== TOAST.drumUse) throw new Error('鼓开了 room');
  if (!gu.drums || gu.drums.length !== 1) throw new Error('鼓廊 wave spawned');
  if (Math.abs(gu.drums[0].r - BLAST_R) > 1e-6) throw new Error('鼓廊 wave starts BLAST_R');
  if (guN.hp !== guHpN || guE.hp !==  guHpE || guS.hp !== guHpS) throw new Error('鼓廊 primary misses');
  gu.hitstop = 0;
  for (let t = 0; t < 0.55; t += 0.016) updateDrums(gu, 0.016);
  if (gu.drums.length !== 0) throw new Error('鼓廊 wave finishes');
  if (!(guN.hp === guHpN - DRUM_DMG || guN.hp <= 0)) throw new Error('鼓廊 drum dmg N');
  if (!(guE.hp === guHpE - DRUM_DMG || guE.hp <= 0)) throw new Error('鼓廊 drum dmg E');
  if (!(guS.hp ===  guHpS - DRUM_DMG ||  guS.hp <= 0)) throw new Error('鼓廊 drum dmg S');
  if (!(guE.shoveT > 0) || !(guE.shoveVx > 0)) throw new Error('鼓廊 knock east');
  gu.drumReady = true;
  dropSpark(gu, 300, 80, false);
  if (gu.drumReady !== true) throw new Error('dropSpark keeps 鼓爆');
  gu.input.dash = true;
  gu.player.dashT = 0;
  gu.player.dashCd = 0;
  gu.hitstop = 0;
  update(gu, 0.016);
  if (gu.drumReady !== true) throw new Error('dash does not consume 鼓爆');
  const both = makeState();
  resetRoom(both, 0, false);
  both.fanReady = true;
  both.drumReady = true;
  both.player.x = 80;
  both.player.y = 80;
  both.player.inv = 2;
  explode(both, 200, 200, false);
  if (both.fanReady) throw new Error('same boom spends 扇爆');
  if (both.drumReady) throw new Error('same boom spends 鼓爆');
  if (!both.fans || !both.fans.length) throw new Error('same boom fans');
  if (!both.drums || !both.drums.length) throw new Error('same boom drums');
  const drumSelf = makeState();
  resetRoom(drumSelf, 0, false);
  drumSelf.drumReady = true;
  drumSelf.player.x = 400;
  drumSelf.player.y = 80;
  drumSelf.player.inv = 0;
  drumSelf.player.hearts = 3;
  explode(drumSelf, 400, 200, false);
  drumSelf.hitstop = 0;
  for (let t = 0; t < 0.55; t += 0.016) updateDrums(drumSelf, 0.016);
  if (drumSelf.player.hearts !== 2) throw new Error('own drum hurts player');
  drumSelf.player.hearts = 3;
  drumSelf.player.inv = 0;
  drumSelf.player.dashT = DASH_TIME;
  drumSelf.drums = [{ x: 400, y: 200, r: BLAST_R, hit: Object.create(null) }];
  drumSelf.hitstop = 0;
  for (let t = 0; t < 0.55; t += 0.016) updateDrums(drumSelf, 0.016);
  if (drumSelf.player.hearts !== 3) throw new Error('dash i-frames skip drum');
  gu.drumReady = true;
  gu.sparks.length = 0;
  if (gu.drums) gu.drums.length = 0;
  gu.player.x = 80;
  gu.player.y = 80;
  gu.player.dashT = 0;
  gu.player.dashCd = 0;
  gu.player.vx = 0;
  gu.player.vy = 0;
  gu.player.inv = 2;
  gu.input.x = 0;
  gu.input.y = 0;
  gu.input.dash = false;
  gu.hitstop = 0;
  gu.waters = [{ x: 80, y: 80, w: 80, h: 80 }];
  dropSpark(gu, 120, 120, false);
  if (!gu.sparks[gu.sparks.length - 1].wet) throw new Error('鼓廊 wet spark');
  const guBooms = gu.stats.booms;
  for (let i = 0; i < 24; i++) update(gu, 0.1);
  if (gu.drumReady !== true) throw new Error('鼓廊 wet fizzle does not consume');
  if (gu.stats.booms !==  guBooms) throw new Error('鼓廊 wet no extra boom');
  gu.waters = [];
  explode(gu, 200, 200, false, false, false, { fork: true });
  if (gu.drumReady !== true) throw new Error('鼓廊 fork does not consume');
  gu.echoReady = true;
  explode(gu, 200, 200, false);
  gu.drumReady = true;
  for (let i = 0; i < 12; i++) update(gu, 0.05);
  if (gu.drumReady !== true) throw new Error('鼓廊 echo does not consume');
  gu.fanReady = true;
  explode(gu, 200, 200, false);
  gu.drumReady = true;
  gu.hitstop = 0;
  updateFans(gu, FAN_DT * FAN_N + 0.05);
  if (gu.drumReady !== true) throw new Error('鼓廊 fan-fork does not consume');
  gu.spinReady = true;
  explode(gu, 200, 200, false);
  gu.drumReady = true;
  gu.hitstop = 0;
  updateSpins(gu, SPIN_DT * SPIN_N + 0.05);
  if (gu.drumReady !== true) throw new Error('鼓廊 spin-orbit does not consume');
  gu.waters = [];
  explode(gu, guBox.x + guBox.w * 0.5,  guBox.y - 20, false);
  if (!guBox.open) throw new Error('鼓廊 dry trail should open 心核');
  takeCore(gu, { x: 100, y: 100 });
  if (!gu.won || gu.toast !== TOAST.all) throw new Error('鼓廊 should 通关');
  const hudGu = makeState();
  resetRoom(hudGu, 38, false);
  if (roomHudText(hudGu).indexOf('鼓廊 · 39/') !== 0) throw new Error('HUD 鼓廊 39/n');
  if (TAIL_T !== 2) throw new Error('TAIL_T===2');
  if (TAIL_T !== 2.0) throw new Error('TAIL_T 2.0');
  if (DRUM_R !== 150) throw new Error('DRUM_R 150');
  if (DRUM_V !== 320) throw new Error('DRUM_V 320');
  if (DRUM_W !== 20) throw new Error('DRUM_W 20');
  if (DRUM_DMG !== 2) throw new Error('DRUM_DMG 2');
  if (DRUM_KB !== 220) throw new Error('DRUM_KB 220');
  if (BLAST_R !== 36) throw new Error('BLAST_R 36');
  if (HOT_BLAST_R !== 56) throw new Error('HOT_BLAST_R 56');
  if (TOAST.drumGet !== '捡到鼓爆') throw new Error('捡到鼓爆');
  if (TOAST.drumUse !== '鼓开了') throw new Error('鼓开了 toast');
  if (TOAST.drumRoom !== '鼓过去清场') throw new Error('鼓过去清场');

  const lastWin = makeState();
  resetRoom(lastWin, ROOMS.length - 1, false);
  takeCore(lastWin, { x: 100, y: 100 });
  if (!lastWin.won || lastWin.toast !== TOAST.all) throw new Error('last room 通关');


  clearProgress();
  if (loadProgress().room !== 0) throw new Error('empty save room 0');
  const persistS = makeState();
  persistS.persist = true;
  resetRoom(persistS, 14, false);
  if (loadProgress().room !== 14) throw new Error('save room 14 种廊');
  if (loadProgress().unlocked !== 14) throw new Error('unlock 14');
  const persistS2 = makeState();
  persistS2.persist = true;
  resetRoom(persistS2, loadProgress().room, false);
  if (persistS2.roomName !== '种廊') throw new Error('load 种廊');
  clearProgress();
  if (loadProgress().room !== 0) throw new Error('clear save');
  const noPersist = makeState();
  resetRoom(noPersist, 14, false);
  if (loadProgress().room !== 0) throw new Error('tests do not persist');
  if (TOAST.cont !== '续关') throw new Error('续关');
  if (TOAST.home !== '回空场') throw new Error('回空场');
  if (SAVE_KEY !== 'weihuo-progress') throw new Error('SAVE_KEY');

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
