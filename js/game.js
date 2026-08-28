/* 尾火 v0 · 一房可玩。无 CDN。 SHIP-FRESH */
(function (root) {
  "use strict";

  var TAIL_T = 2.0;
  var SPARK_GAP = 18;
  var BLAST_R = 36;
  var BLAST_R_HOT = 50;
  var MAX_HEART = 3;
  var HITSTOP_MS = 80;
  var CAM_PUNCH = 6;
  var NAMES = ["焰辙", "烬卫", "箱", "水洼", "心核", "回星"];

  function blastRadius(hot) {
    return hot ? BLAST_R_HOT : BLAST_R;
  }

  function hypot(ax, ay) {
    return Math.sqrt(ax * ax + ay * ay);
  }

  function sparkDropsForPath(pts, gap) {
    gap = gap == null ? SPARK_GAP : gap;
    var n = 0;
    var acc = 0;
    var i, dx, dy, d;
    for (i = 1; i < pts.length; i++) {
      dx = pts[i].x - pts[i - 1].x;
      dy = pts[i].y - pts[i - 1].y;
      d = hypot(dx, dy);
      if (d < 1e-6) {
        acc = 0;
        continue;
      }
      acc += d;
      while (acc >= gap) {
        n += 1;
        acc -= gap;
      }
    }
    return n;
  }

  function inPuddle(x, y, puddles) {
    var i, p;
    for (i = 0; i < puddles.length; i++) {
      p = puddles[i];
      if (hypot(x - p.x, y - p.y) < p.r) return true;
    }
    return false;
  }

  function selfCheck() {
    if (TAIL_T !== 2) throw new Error("TAIL_T must be 2");
    var stand = [];
    var i;
    for (i = 0; i < 48; i++) stand.push({ x: 40, y: 40 });
    if (sparkDropsForPath(stand) !== 0) throw new Error("standing must drop 0");
    var walk = [{ x: 0, y: 0 }, { x: SPARK_GAP * 5, y: 0 }];
    if (sparkDropsForPath(walk) < 4) throw new Error("moving should drop sparks");
    if (blastRadius(false) !== 36) throw new Error("blast r");
    if (blastRadius(true) !== 50) throw new Error("dash blast r");
    var puddles = [{ x: 0, y: 0, r: 20 }];
    if (!inPuddle(4, 0, puddles) || inPuddle(80, 0, puddles)) {
      throw new Error("puddle test");
    }
    var src;
    try {
      src = require("fs").readFileSync(__filename, "utf8");
    } catch (e) {
      src = NAMES.join("");
    }
    for (i = 0; i < NAMES.length; i++) {
      if (src.indexOf(NAMES[i]) < 0) throw new Error("missing name " + NAMES[i]);
    }
    var banned = ["\u4f20\u9001", "\u98de\u884c", "\u4e09\u53c9\u621f", "\u6fc0\u6012", "\u5929\u4f7f", "\u6076\u9b54"];
    for (i = 0; i < banned.length; i++) {
      if (src.indexOf(banned[i]) >= 0) throw new Error("banned " + banned[i]);
    }
    if (typeof console !== "undefined" && console.log) console.log("selfCheck ok");
    return true;
  }

  if (typeof document === "undefined") {
    selfCheck();
    if (typeof process !== "undefined" && process.exit) process.exit(0);
    return;
  }

  var C = {
    bg: "#14080a",
    ember: "#ff6a1a",
    gold: "#ffd24a",
    water: "#3a6b8c",
    core: "#ff5d8f",
    ash: "#6b5344",
    heart: "#ff5d8f"
  };

  var W = 960;
  var H = 540;
  var FLOOR = { x: 36, y: 68, w: 888, h: 448 };

  var reduce = false;
  try {
    reduce = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (e) {}

  var hitMs = reduce ? 20 : HITSTOP_MS;
  var punchPx = reduce ? 0 : CAM_PUNCH;
  var pMul = reduce ? 0.5 : 1;

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var heartsEl = document.getElementById("hearts");
  var toastEl = document.getElementById("toast");
  var touchEl = document.getElementById("touch");
  var stickEl = document.getElementById("stick");
  var knobEl = document.getElementById("knob");
  var dashBtn = document.getElementById("dashBtn");

  var view = { scale: 1, ox: 0, oy: 0, dpr: 1 };
  var cam = { x: 0, y: 0, tx: 0, ty: 0 };
  var keys = {};
  var stick = { x: 0, y: 0, on: false };
  var mouseT = null;
  var last = 0;
  var hitstop = 0;
  var accMove = 0;
  var phase = "play";
  var toast = { text: "", t: 0, color: C.gold };
  var player, sparks, enemies, boxes, puddles, items, parts, blasts, ashMarks;

  function sfx(name) {
    var a = root.WeiHuoAudio || root.AudioFx;
    if (a && typeof a[name] === "function") a[name]();
  }

  function say(text, color, hold) {
    toast.text = text;
    toast.t = hold ? 99 : 1.1;
    toast.color = color || C.gold;
    if (hold && toastEl) {
      toastEl.textContent = text;
      toastEl.hidden = false;
      toastEl.style.color = toast.color;
    } else if (toastEl && phase === "play") {
      toastEl.hidden = true;
    }
  }

  function hudHearts() {
    if (heartsEl) heartsEl.textContent = "心×" + player.hearts;
  }

  function fit() {
    var wrap = document.getElementById("wrap") || document.body;
    var dpr = Math.min(2, root.devicePixelRatio || 1);
    var cw = wrap.clientWidth || root.innerWidth;
    var ch = wrap.clientHeight || root.innerHeight;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    canvas.width = (cw * dpr) | 0;
    canvas.height = (ch * dpr) | 0;
    view.dpr = dpr;
    view.scale = Math.min(cw / W, ch / H);
    view.ox = (cw - W * view.scale) * 0.5;
    view.oy = (ch - H * view.scale) * 0.5;
  }

  function worldFromEvent(ev) {
    var rect = canvas.getBoundingClientRect();
    var x = (ev.clientX - rect.left - view.ox) / view.scale - cam.x;
    var y = (ev.clientY - rect.top - view.oy) / view.scale - cam.y;
    return { x: x, y: y };
  }

  function kick(fromX, fromY, mag) {
    if (!mag) return;
    var dx = player.x - fromX;
    var dy = player.y - fromY;
    var d = hypot(dx, dy) || 1;
    cam.tx += (dx / d) * mag;
    cam.ty += (dy / d) * mag;
  }

  function burst(x, y, n, cols, life, spd, up) {
    n = Math.max(2, (n * pMul) | 0);
    var i, a, v, col;
    for (i = 0; i < n; i++) {
      a = Math.random() * Math.PI * 2;
      v = spd * (0.35 + Math.random());
      col = cols[(Math.random() * cols.length) | 0];
      parts.push({
        x: x, y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - (up ? 30 : 0),
        t: life, life: life,
        r: 1.6 + Math.random() * 2.2,
        col: col
      });
    }
  }

  function resetRoom() {
    phase = "play";
    accMove = 0;
    hitstop = 0;
    cam.x = cam.y = cam.tx = cam.ty = 0;
    sparks = [];
    parts = [];
    blasts = [];
    ashMarks = [];
    items = [];
    if (toastEl) toastEl.hidden = true;
    toast.t = 0;

    player = {
      x: 128, y: 300, r: 11,
      vx: 0, vy: 0,
      fx: 1, fy: 0,
      hearts: MAX_HEART,
      inv: 0,
      dashT: 0,
      dashCd: 0,
      flash: 0
    };

    puddles = [
      { x: 340, y: 292, r: 52, name: "水洼" },
      { x: 776, y: 438, r: 46, name: "水洼" }
    ];

    boxes = [
      { x: 248, y: 158, r: 16, open: false, loot: "" },
      { x: 428, y: 136, r: 16, open: false, loot: "回星" },
      { x: 586, y: 228, r: 16, open: false, loot: "" },
      { x: 470, y: 404, r: 16, open: false, loot: "" },
      { x: 708, y: 312, r: 16, open: false, loot: "" },
      { x: 838, y: 154, r: 16, open: false, loot: "心核" }
    ];

    enemies = [
      { x: 392, y: 206, r: 13, hp: 3, flash: 0 },
      { x: 552, y: 368, r: 13, hp: 3, flash: 0 },
      { x: 704, y: 148, r: 13, hp: 3, flash: 0 },
      { x: 292, y: 448, r: 13, hp: 3, flash: 0 },
      { x: 854, y: 318, r: 13, hp: 3, flash: 0 }
    ];

    hudHearts();
    say("夜市还亮着", C.gold);
  }

  function inputDir() {
    var x = 0, y = 0;
    if (keys.KeyW || keys.ArrowUp) y -= 1;
    if (keys.KeyS || keys.ArrowDown) y += 1;
    if (keys.KeyA || keys.ArrowLeft) x -= 1;
    if (keys.KeyD || keys.ArrowRight) x += 1;
    if (stick.on && (stick.x || stick.y)) {
      x += stick.x;
      y += stick.y;
    }
    if (!x && !y && mouseT && phase === "play") {
      var mx = mouseT.x - player.x;
      var my = mouseT.y - player.y;
      if (hypot(mx, my) > 8) {
        x = mx;
        y = my;
      } else {
        mouseT = null;
      }
    }
    var d = hypot(x, y);
    if (d > 1) {
      x /= d;
      y /= d;
    } else if (d > 0.12) {
      x /= d;
      y /= d;
    } else {
      x = 0;
      y = 0;
    }
    return { x: x, y: y };
  }

  function tryDash() {
    if (phase !== "play") {
      resetRoom();
      return;
    }
    if (player.dashCd > 0 || player.dashT > 0) return;
    var dir = inputDir();
    if (!dir.x && !dir.y) {
      dir.x = player.fx;
      dir.y = player.fy;
    }
    var d = hypot(dir.x, dir.y) || 1;
    player.fx = dir.x / d;
    player.fy = dir.y / d;
    player.dashT = 0.16;
    player.dashCd = 0.52;
    sfx("dash");
    say("冲出去", C.ember);
    burst(player.x, player.y, 4, [C.ember, C.gold], 0.12, 80, false);
    hitstop = Math.max(hitstop, reduce ? 0.02 : 0.04);
    kick(player.x - player.fx * 20, player.y - player.fy * 20, reduce ? 0 : 3);
  }

  function dropSpark(x, y, hot) {
    if (inPuddle(x, y, puddles)) {
      sfx("fizzle");
      say("水洼熄了", C.water);
      burst(x, y, 5, [C.water, C.ash], 0.22, 40, true);
      ashMarks.push({ x: x, y: y, t: 0.35 });
      return;
    }
    sparks.push({ x: x, y: y, age: 0, hot: !!hot });
    if (hot) say("烫辙", C.gold);
  }

  function spawnItem(kind, x, y) {
    items.push({ kind: kind, x: x, y: y, r: kind === "心核" ? 12 : 9, bob: 0 });
  }

  function openBox(b) {
    if (b.open) return;
    b.open = true;
    say("箱开了", C.gold);
    burst(b.x, b.y, 8, [C.ash, C.gold], 0.24, 70, false);
    if (b.loot) spawnItem(b.loot, b.x, b.y - 6);
  }

  function hurt(fromX, fromY, why) {
    if (phase !== "play" || player.inv > 0) return;
    player.hearts -= 1;
    player.inv = 0.78;
    player.flash = 0.18;
    var dx = player.x - fromX;
    var dy = player.y - fromY;
    var d = hypot(dx, dy) || 1;
    player.vx += (dx / d) * 220;
    player.vy += (dy / d) * 220;
    sfx("hurt");
    say(why, C.heart);
    burst(player.x, player.y, 6, [C.heart, C.gold], 0.2, 90, false);
    hitstop = Math.max(hitstop, hitMs / 1000);
    kick(fromX, fromY, punchPx);
    hudHearts();
    if (player.hearts <= 0) {
      phase = "fail";
      say("心空了", C.heart, true);
    }
  }

  function boom(s) {
    var r = blastRadius(s.hot);
    var hit = false;
    var i, e, b, d;

    blasts.push({
      x: s.x, y: s.y, r: r, hot: s.hot, t: 0, life: 0.096
    });

    if (phase === "play" && player.inv <= 0 && hypot(player.x - s.x, player.y - s.y) < r + player.r) {
      hurt(s.x, s.y, "别踩自己的尾");
      hit = true;
    }

    for (i = 0; i < enemies.length; i++) {
      e = enemies[i];
      if (e.hp <= 0) continue;
      if (hypot(e.x - s.x, e.y - s.y) < r + e.r) {
        e.hp -= s.hot ? 2 : 1;
        e.flash = 0.16;
        hit = true;
        if (e.hp <= 0) {
          burst(e.x, e.y, 12, [C.ember, C.ash], 0.32, 90, false);
          say("烬卫倒了", C.ember);
        }
      }
    }

    for (i = 0; i < boxes.length; i++) {
      b = boxes[i];
      if (b.open) continue;
      d = hypot(b.x - s.x, b.y - s.y);
      if (d < r + b.r) {
        openBox(b);
        hit = true;
      }
    }

    sfx("explode");
    burst(s.x, s.y, s.hot ? 16 : 10, s.hot ? [C.gold, C.ember] : [C.ember, C.gold], s.hot ? 0.36 : 0.28, s.hot ? 140 : 110, false);
    if (hit) {
      hitstop = Math.max(hitstop, hitMs / 1000);
      kick(s.x, s.y, punchPx);
      if (phase === "play") say(s.hot ? "烫辙" : "焰辙爆了", C.gold);
    } else {
      kick(s.x, s.y, reduce ? 0 : 2);
    }
  }

  function clampPlayer() {
    var minX = FLOOR.x + player.r;
    var maxX = FLOOR.x + FLOOR.w - player.r;
    var minY = FLOOR.y + player.r;
    var maxY = FLOOR.y + FLOOR.h - player.r;
    var out = player.x < minX || player.x > maxX || player.y < minY || player.y > maxY;
    if (out) {
      player.x = Math.max(minX, Math.min(maxX, player.x));
      player.y = Math.max(minY, Math.min(maxY, player.y));
      if (phase === "play") hurt(W * 0.5, H * 0.5, "出界了");
    }
  }

  function update(dt) {
    var i, e, it, s, p, b, dir, speed, running, step, nx, ny, d, j, e2, push;

    cam.x += (cam.tx - cam.x) * 0.38;
    cam.y += (cam.ty - cam.y) * 0.38;
    cam.tx *= 0.78;
    cam.ty *= 0.78;

    if (toast.t > 0 && toast.t < 90) toast.t -= dt;

    for (i = parts.length - 1; i >= 0; i--) {
      p = parts[i];
      p.t -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 40 * dt;
      if (p.t <= 0) parts.splice(i, 1);
    }
    for (i = blasts.length - 1; i >= 0; i--) {
      blasts[i].t += dt;
      if (blasts[i].t >= blasts[i].life) blasts.splice(i, 1);
    }
    for (i = ashMarks.length - 1; i >= 0; i--) {
      ashMarks[i].t -= dt;
      if (ashMarks[i].t <= 0) ashMarks.splice(i, 1);
    }

    if (hitstop > 0) {
      hitstop -= dt;
      return;
    }
    if (phase !== "play") return;

    dir = inputDir();
    player.dashCd = Math.max(0, player.dashCd - dt);
    player.inv = Math.max(0, player.inv - dt);
    player.flash = Math.max(0, player.flash - dt);

    if (player.dashT > 0) {
      player.dashT -= dt;
      speed = 470;
      player.vx = player.fx * speed;
      player.vy = player.fy * speed;
      running = true;
    } else {
      speed = 176;
      if (dir.x || dir.y) {
        player.fx = dir.x;
        player.fy = dir.y;
        player.vx = dir.x * speed;
        player.vy = dir.y * speed;
        running = true;
      } else {
        player.vx *= 0.72;
        player.vy *= 0.72;
        running = false;
      }
    }

    player.x += player.vx * dt;
    player.y += player.vy * dt;
    clampPlayer();

    if (running) {
      step = hypot(player.vx, player.vy) * dt;
      accMove += step;
      while (accMove >= SPARK_GAP) {
        accMove -= SPARK_GAP;
        nx = player.x - player.fx * 8;
        ny = player.y - player.fy * 8;
        dropSpark(nx, ny, player.dashT > 0);
      }
    } else {
      accMove = 0;
    }

    for (i = sparks.length - 1; i >= 0; i--) {
      s = sparks[i];
      s.age += dt;
      if (s.age >= TAIL_T) {
        sparks.splice(i, 1);
        boom(s);
      }
    }

    for (i = 0; i < enemies.length; i++) {
      e = enemies[i];
      e.flash = Math.max(0, e.flash - dt);
      if (e.hp <= 0) continue;
      d = hypot(player.x - e.x, player.y - e.y);
      if (d > 1) {
        e.x += ((player.x - e.x) / d) * 54 * dt;
        e.y += ((player.y - e.y) / d) * 54 * dt;
      }
      for (j = 0; j < enemies.length; j++) {
        if (i === j) continue;
        e2 = enemies[j];
        if (e2.hp <= 0) continue;
        push = hypot(e.x - e2.x, e.y - e2.y);
        if (push < 26 && push > 0.01) {
          e.x += ((e.x - e2.x) / push) * 20 * dt;
          e.y += ((e.y - e2.y) / push) * 20 * dt;
        }
      }
      e.x = Math.max(FLOOR.x + e.r, Math.min(FLOOR.x + FLOOR.w - e.r, e.x));
      e.y = Math.max(FLOOR.y + e.r, Math.min(FLOOR.y + FLOOR.h - e.r, e.y));
      if (hypot(player.x - e.x, player.y - e.y) < player.r + e.r - 1) {
        hurt(e.x, e.y, "撞上了");
      }
    }

    for (i = 0; i < boxes.length; i++) {
      b = boxes[i];
      if (b.open) continue;
      d = hypot(player.x - b.x, player.y - b.y);
      if (d < player.r + b.r) {
        push = player.r + b.r - d;
        if (d < 0.01) d = 1;
        player.x += ((player.x - b.x) / d) * push;
        player.y += ((player.y - b.y) / d) * push;
      }
    }

    for (i = items.length - 1; i >= 0; i--) {
      it = items[i];
      it.bob += dt;
      if (hypot(player.x - it.x, player.y - it.y) < player.r + it.r) {
        if (it.kind === "心核") {
          phase = "win";
          sfx("win");
          burst(it.x, it.y, 18, [C.core, C.gold], 0.4, 120, false);
          hitstop = Math.max(hitstop, hitMs / 1000);
          kick(it.x, it.y, punchPx);
          items.splice(i, 1);
          say("过关", C.core, true);
        } else if (it.kind === "回星") {
          player.hearts = Math.min(MAX_HEART, player.hearts + 1);
          hudHearts();
          sfx("pickup");
          say("回了一心", C.heart);
          burst(it.x, it.y, 8, [C.heart, C.gold], 0.26, 80, false);
          items.splice(i, 1);
        }
      }
    }
  }

  function lerpHex(a, b, t) {
    function hex(s) {
      return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
    }
    var A = hex(a), B = hex(b);
    var r = (A[0] + (B[0] - A[0]) * t) | 0;
    var g = (A[1] + (B[1] - A[1]) * t) | 0;
    var bl = (A[2] + (B[2] - A[2]) * t) | 0;
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  function glow(x, y, r, col, a) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFloor() {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1b0c0f";
    ctx.fillRect(FLOOR.x, FLOOR.y, FLOOR.w, FLOOR.h);
    ctx.strokeStyle = "rgba(255,106,26,0.22)";
    ctx.lineWidth = 2;
    ctx.strokeRect(FLOOR.x + 1, FLOOR.y + 1, FLOOR.w - 2, FLOOR.h - 2);
    var x, y;
    ctx.fillStyle = "rgba(107,83,68,0.18)";
    for (y = FLOOR.y + 18; y < FLOOR.y + FLOOR.h; y += 28) {
      for (x = FLOOR.x + 18; x < FLOOR.x + FLOOR.w; x += 28) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
    ctx.fillStyle = "rgba(255,210,74,0.16)";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("焰辙 · 烬卫 · 箱 · 水洼 · 心核", FLOOR.x + 12, FLOOR.y + FLOOR.h - 12);
  }

  function drawPuddle(p) {
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = C.water;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r, p.r * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "#7aa7c4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r * 0.62, p.r * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawBox(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    if (b.open) {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = C.ash;
      ctx.fillRect(-15, -6, 30, 14);
    } else {
      ctx.fillStyle = "#4a382e";
      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.rect(-15, -15, 30, 30);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(15, 0);
      ctx.moveTo(0, -15);
      ctx.lineTo(0, 15);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEnemy(e) {
    if (e.hp <= 0) {
      glow(e.x, e.y, 7, C.ash, 0.35);
      return;
    }
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.fillStyle = e.flash > 0 ? C.gold : C.ash;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(11, 8);
    ctx.lineTo(-11, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = C.ember;
    ctx.beginPath();
    ctx.arc(-3.5, -2, 2, 0, Math.PI * 2);
    ctx.arc(3.5, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSpark(s) {
    var u = Math.min(1, s.age / TAIL_T);
    var col = lerpHex(C.ember, C.gold, u);
    var rad = 3.1 + u * 2.6 + (s.hot ? 1.4 : 0);
    glow(s.x, s.y, rad * 2.2, col, 0.18 + u * 0.2);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(s.x, s.y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBlast(b) {
    var u = b.t / b.life;
    var peak = b.hot ? 1.5 : 1.35;
    var sc;
    if (b.t < 0.016) sc = 0.7 + (peak - 0.7) * (b.t / 0.016);
    else sc = peak * (1 - (b.t - 0.016) / 0.08);
    if (sc < 0) sc = 0;
    ctx.save();
    ctx.globalAlpha = 0.85 * (1 - u);
    ctx.strokeStyle = u < 0.35 ? C.ember : C.gold;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * sc, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.28 * (1 - u);
    ctx.fillStyle = C.gold;
    ctx.fill();
    ctx.restore();
  }

  function drawPlayer() {
    var blink = player.inv > 0 && ((player.inv * 16) | 0) % 2 === 0;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(Math.atan2(player.fy, player.fx));
    glow(0, 0, 18, player.flash > 0 ? C.heart : C.ember, blink ? 0.12 : 0.32);
    ctx.fillStyle = blink ? "#ffb08a" : C.ember;
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.lineTo(-8, 8);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-8, -8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = C.gold;
    ctx.beginPath();
    ctx.arc(1, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawItem(it) {
    var bob = Math.sin(it.bob * 4) * 3;
    ctx.save();
    ctx.translate(it.x, it.y + bob);
    glow(0, 0, it.r * 2, it.kind === "心核" ? C.core : C.heart, 0.35);
    ctx.fillStyle = it.kind === "心核" ? C.core : C.heart;
    ctx.beginPath();
    ctx.arc(0, 0, it.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.gold;
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(it.kind, 0, it.r + 12);
    ctx.restore();
  }

  function drawToastCanvas() {
    if (toast.t <= 0 || !toast.text) return;
    if (toast.t > 90) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, toast.t / 0.2);
    ctx.fillStyle = toast.color;
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(toast.text, W * 0.5, FLOOR.y + 22);
    ctx.restore();
  }

  function render() {
    var cw = canvas.width / view.dpr;
    var ch = canvas.height / view.dpr;
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, cw, ch);
    ctx.save();
    ctx.translate(view.ox + cam.x, view.oy + cam.y);
    ctx.scale(view.scale, view.scale);

    drawFloor();
    var i;
    for (i = 0; i < puddles.length; i++) drawPuddle(puddles[i]);
    for (i = 0; i < ashMarks.length; i++) {
      glow(ashMarks[i].x, ashMarks[i].y, 4, C.ash, 0.5);
    }
    for (i = 0; i < boxes.length; i++) drawBox(boxes[i]);
    for (i = 0; i < sparks.length; i++) drawSpark(sparks[i]);
    for (i = 0; i < enemies.length; i++) drawEnemy(enemies[i]);
    for (i = 0; i < items.length; i++) drawItem(items[i]);
    for (i = 0; i < blasts.length; i++) drawBlast(blasts[i]);
    for (i = 0; i < parts.length; i++) {
      ctx.globalAlpha = Math.max(0, parts[i].t / parts[i].life);
      ctx.fillStyle = parts[i].col;
      ctx.beginPath();
      ctx.arc(parts[i].x, parts[i].y, parts[i].r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (phase !== "fail" || player.flash > 0) drawPlayer();
    drawToastCanvas();
    ctx.restore();
  }

  function frame(now) {
    if (!last) last = now;
    var dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    root.requestAnimationFrame(frame);
  }

  function onKey(e, down) {
    keys[e.code] = down;
    if (!down) return;
    if (e.code === "Space") {
      e.preventDefault();
      tryDash();
    }
    if (e.code === "KeyR") {
      sfx("beep");
      say("再来", C.gold);
      resetRoom();
    }
  }

  function bindTouch() {
    var coarse = false;
    try {
      coarse = ("ontouchstart" in root) || (root.matchMedia && root.matchMedia("(pointer: coarse)").matches);
    } catch (e) {}
    if (!coarse || !touchEl) return;
    touchEl.hidden = false;

    function setStick(ev) {
      if (!stickEl) return;
      var rect = stickEl.getBoundingClientRect();
      var cx = rect.left + rect.width * 0.5;
      var cy = rect.top + rect.height * 0.5;
      var x = ev.clientX - cx;
      var y = ev.clientY - cy;
      var max = rect.width * 0.5 - 8;
      var d = hypot(x, y);
      if (d > max) {
        x = (x / d) * max;
        y = (y / d) * max;
      }
      stick.on = true;
      stick.x = x / max;
      stick.y = y / max;
      if (knobEl) {
        knobEl.style.transform = "translate(" + x + "px," + y + "px)";
      }
    }
    function endStick() {
      stick.on = false;
      stick.x = 0;
      stick.y = 0;
      if (knobEl) knobEl.style.transform = "";
    }
    stickEl.addEventListener("pointerdown", function (ev) {
      stickEl.setPointerCapture(ev.pointerId);
      setStick(ev);
    });
    stickEl.addEventListener("pointermove", function (ev) {
      if (stick.on) setStick(ev);
    });
    stickEl.addEventListener("pointerup", endStick);
    stickEl.addEventListener("pointercancel", endStick);
    if (dashBtn) {
      dashBtn.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        tryDash();
      });
    }
  }

  root.addEventListener("keydown", function (e) { onKey(e, true); });
  root.addEventListener("keyup", function (e) { onKey(e, false); });
  canvas.addEventListener("pointerdown", function (ev) {
    if (phase !== "play") {
      resetRoom();
      return;
    }
    mouseT = worldFromEvent(ev);
  });
  root.addEventListener("resize", fit);
  bindTouch();
  fit();
  resetRoom();
  root.requestAnimationFrame(frame);

  root.WeiHuo = {
    TAIL_T: TAIL_T,
    selfCheck: selfCheck,
    sparkDropsForPath: sparkDropsForPath
  };
})(typeof window !== "undefined" ? window : this);
