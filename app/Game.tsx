"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Session = { room: string; code?: string; token: string; slot: number };
const EMPTY = { x: 0, y: 0, aim: 0, fire: false, shield: false, slide: false, melee: false, heavy: false, grip: false, throwMatter: false, cover: false, orbit: false, launchOrbit: false, pinball: false, slow: false };
const controlMap: Record<string, keyof typeof EMPTY> = { ShiftLeft: "slide", ShiftRight: "slide", KeyF: "melee", KeyC: "heavy", KeyQ: "grip", KeyR: "throwMatter", KeyB: "cover", KeyO: "orbit", KeyP: "launchOrbit", Space: "pinball", KeyX: "slow" };

const jade = new Map<string, HTMLImageElement>();
const concepts = new Map<string, HTMLImageElement>();
const scenery: HTMLCanvasElement[][] = [];
let artStarted = false;

function preloadArt() {
  if (artStarted || typeof Image === "undefined") return;
  artStarted = true;
  for (const family of ["ready", "run", "slide", "cover"]) {
    for (let d = 0; d < 24; d++) {
      const key = `${family}-${d}`;
      const image = new Image();
      image.onload = () => jade.set(key, image);
      image.src = `/assets/jade/${family}-d${String(d).padStart(2, "0")}.webp`;
    }
  }
  const atlas = new Image();
  atlas.onload = () => buildScenery(atlas);
  atlas.src = "/assets/environment/cover-destruction-atlas.png";
  for (const [key, file] of Object.entries({ arena: "arena-blueprint.webp", war: "war-games-blueprint.webp", gloves: "dual-glove-hud.webp", lab: "training-lab.webp" })) {
    const image = new Image(); image.onload = () => concepts.set(key, image); image.src = `/assets/concepts/${file}`;
  }
}

function buildScenery(atlas: HTMLImageElement) {
  for (let row = 0; row < 4; row++) {
    scenery[row] = [];
    for (let col = 0; col < 8; col++) {
      const x0 = Math.floor(col * atlas.width / 8), x1 = Math.floor((col + 1) * atlas.width / 8);
      const y0 = Math.floor(row * atlas.height / 4), y1 = Math.floor((row + 1) * atlas.height / 4);
      const c = document.createElement("canvas"); c.width = x1 - x0; c.height = y1 - y0;
      const cx = c.getContext("2d", { willReadFrequently: true })!; cx.drawImage(atlas, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
      const image = cx.getImageData(0, 0, c.width, c.height), data = image.data, seen = new Uint8Array(c.width * c.height), queue: number[] = [];
      const background = (n: number) => { const i = n * 4, r = data[i], g = data[i + 1], b = data[i + 2]; return Math.max(r, g, b) - Math.min(r, g, b) < 13 && Math.min(r, g, b) > 166; };
      const seed = (n: number) => { if (!seen[n] && background(n)) { seen[n] = 1; queue.push(n); } };
      for (let x = 0; x < c.width; x++) { seed(x); seed((c.height - 1) * c.width + x); }
      for (let y = 0; y < c.height; y++) { seed(y * c.width); seed(y * c.width + c.width - 1); }
      for (let head = 0; head < queue.length; head++) {
        const n = queue[head], x = n % c.width, y = Math.floor(n / c.width); data[n * 4 + 3] = 0;
        if (x) seed(n - 1); if (x < c.width - 1) seed(n + 1); if (y) seed(n - c.width); if (y < c.height - 1) seed(n + c.width);
      }
      cx.putImageData(image, 0, 0); scenery[row][col] = c;
    }
  }
}

export default function Game() {
  const canvas = useRef<HTMLCanvasElement>(null), session = useRef<Session | null>(null), state = useRef<any>(null), slot = useRef(0), seq = useRef(0), keys = useRef<Record<string, boolean>>({}), edges = useRef<Record<string, boolean>>({}), mouse = useRef({ x: 500, y: 310, down: false }), running = useRef(false);
  const [name, setName] = useState("Les"), [room, setRoom] = useState(""), [code, setCode] = useState(""), [status, setStatus] = useState("OFFLINE"), [error, setError] = useState(""), [invite, setInvite] = useState(""), [hud, setHud] = useState<any>(null);

  const post = useCallback(async (body: any) => { const r = await fetch("/api/game", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }), v = await r.json(); if (!r.ok) throw Error(v.error || "Request failed"); return v; }, []);
  const accept = useCallback((v: any) => { if (v.state) { state.current = v.state; slot.current = v.slot; setHud({ phase: v.state.phase, mode: v.state.mode, round: v.state.round, winner: v.state.winner, players: v.state.players, slot: v.slot }); setStatus("LINKED"); } }, []);
  const create = async (mode: "bot" | "solo" = "bot") => { try { setError(""); const v = await post({ action: "create", name, mode }); const s = { room: v.room, code: v.code, token: v.token, slot: 0 }; session.current = s; sessionStorage.setItem("god_mode_session", JSON.stringify(s)); setRoom(v.room); setCode(v.code); accept(v); if (mode === "bot") { const url = `${location.origin}/?room=${v.room}&code=${v.code}&guest=1`; setInvite(url); history.replaceState(null, "", `/?room=${v.room}&code=${v.code}`); } else { setInvite(""); history.replaceState(null, "", "/"); } running.current = true; } catch (e: any) { setError(e.message); } };
  const join = async () => { try { setError(""); const v = await post({ action: "join", room: room.toUpperCase(), code, name }); const s = { room: room.toUpperCase(), token: v.token, slot: 1 }; session.current = s; sessionStorage.setItem("god_mode_session", JSON.stringify(s)); accept(v); running.current = true; } catch (e: any) { setError(e.message); } };
  const start = async () => { if (!session.current) return; try { accept(await post({ action: state.current?.phase === "finished" ? "rematch" : "start", ...session.current })); } catch (e: any) { setError(e.message); } };
  const copy = async () => { if (!invite) return; try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(invite); else throw Error("clipboard unavailable"); } catch { const box = document.createElement("textarea"); box.value = invite; box.style.position = "fixed"; box.style.opacity = "0"; document.body.appendChild(box); box.select(); document.execCommand("copy"); box.remove(); } setStatus("DROP-IN LINK COPIED"); };

  useEffect(() => { preloadArt(); }, []);
  useEffect(() => { try { const q = new URLSearchParams(location.search), qRoom = q.get("room") || "", qCode = q.get("code") || "", guest = q.get("guest") === "1", saved = JSON.parse(sessionStorage.getItem("god_mode_session") || "null"); setRoom(qRoom); setCode(qCode); if (!guest && saved?.room && (!qRoom || saved.room === qRoom)) { session.current = saved; slot.current = saved.slot; running.current = true; if (saved.code) setInvite(`${location.origin}/?room=${saved.room}&code=${saved.code}&guest=1`); } } catch { } }, []);
  useEffect(() => { const kd = (e: KeyboardEvent) => { if ((e.target as HTMLElement)?.tagName === "INPUT") return; if (["Space", "ShiftLeft", "ShiftRight"].includes(e.code)) e.preventDefault(); if (!keys.current[e.code]) edges.current[e.code] = true; keys.current[e.code] = true; }; const ku = (e: KeyboardEvent) => { keys.current[e.code] = false; }; addEventListener("keydown", kd); addEventListener("keyup", ku); return () => { removeEventListener("keydown", kd); removeEventListener("keyup", ku); }; }, []);
  useEffect(() => { let stopped = false; const tick = async () => { if (stopped) return; if (running.current && session.current) { try { const s = session.current, u = new URL("/api/game", location.origin); u.searchParams.set("room", s.room); u.searchParams.set("token", s.token); const r = await fetch(u, { cache: "no-store" }), v = await r.json(); if (!r.ok) throw Error(v.error); accept(v); } catch { setStatus("RECONNECTING"); } } setTimeout(tick, 90); }; tick(); return () => { stopped = true; }; }, [accept]);
  useEffect(() => { const timer = setInterval(async () => { const s = session.current, game = state.current; if (!s || game?.phase !== "playing") return; const p = game.players[slot.current], i: any = { ...EMPTY }; i.x = (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0); i.y = (keys.current.KeyS ? 1 : 0) - (keys.current.KeyW ? 1 : 0); i.aim = Math.atan2(mouse.current.y - p.y, mouse.current.x - p.x); i.fire = mouse.current.down; i.shield = !!keys.current.KeyE; for (const [key, action] of Object.entries(controlMap)) i[action] = !!edges.current[key]; edges.current = {}; let pad: Gamepad | undefined; try { pad = [...navigator.getGamepads()].find(Boolean) as Gamepad | undefined; } catch { } if (pad) { const dz = (v: number) => Math.abs(v) < .2 ? 0 : v; i.x = dz(pad.axes[0] || 0); i.y = dz(pad.axes[1] || 0); const rx = dz(pad.axes[2] || 0), ry = dz(pad.axes[3] || 0); if (rx || ry) i.aim = Math.atan2(ry, rx); i.slide ||= pad.buttons[0]?.pressed; i.pinball ||= pad.buttons[1]?.pressed; i.cover ||= pad.buttons[2]?.pressed; i.grip ||= pad.buttons[3]?.pressed; i.shield ||= pad.buttons[4]?.pressed; i.melee ||= pad.buttons[5]?.pressed; i.slow ||= pad.buttons[6]?.pressed; i.fire ||= pad.buttons[7]?.pressed; i.orbit ||= pad.buttons[12]?.pressed; i.launchOrbit ||= pad.buttons[13]?.pressed; i.throwMatter ||= pad.buttons[15]?.pressed; i.heavy ||= pad.buttons[14]?.pressed; } try { accept(await post({ action: "input", ...s, seq: ++seq.current, input: i })); } catch { setStatus("RECONNECTING"); } }, 66); return () => clearInterval(timer); }, [accept, post]);
  useEffect(() => { let frame = 0; const loop = () => { draw(canvas.current, state.current, slot.current); frame = requestAnimationFrame(loop); }; frame = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame); }, []);

  const point = (e: React.PointerEvent) => { const c = canvas.current; if (!c) return; const r = c.getBoundingClientRect(); mouse.current.x = (e.clientX - r.left) / r.width * 1000; mouse.current.y = (e.clientY - r.top) / r.height * 620; };
  const touchAction = (action: keyof typeof EMPTY) => { const key = Object.keys(controlMap).find(k => controlMap[k] === action) || action; edges.current[key] = true; };
  const connected = !!hud, botActive = !!hud?.players?.some((p: any) => p.bot), mePlayer = hud?.players?.[hud?.slot || 0];

  return <main className="game-shell">
    <header className="topbar"><div><span className="kicker">GOD MODE: BREAK THE CODE</span><h1>ARCADE BROTHER BUILD</h1></div><div className={`net ${status !== "LINKED" ? "warn" : ""}`}><i />{status}</div></header>
    <section className="play-layout"><div className="arena-wrap">
      <canvas ref={canvas} className="arena" width="1400" height="868" tabIndex={0} onPointerMove={point} onPointerDown={e => { point(e); mouse.current.down = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }} onPointerUp={() => mouse.current.down = false} onPointerCancel={() => mouse.current.down = false} />
      {!connected && <div className="lobby-card"><span className="stamp">BUILD R3 · VERSION 57 MOVEMENT · ARENA DEPTH</span><h2>{room ? "TAKE OVER THE BOT" : "ENTER DIMENSION 33"}</h2><p>{room ? "Your brother is already fighting the Rift Hunter. Join this room and take over its combat slot instantly." : "The approved weighted slide and cover movement are back. Choose a live bot fight or an empty sandbox for movement and matter testing."}</p><label>CALLSIGN<input value={name} onChange={e => setName(e.target.value)} maxLength={24} /></label>{room && <div className="room-fields"><label>ROOM<input value={room} onChange={e => setRoom(e.target.value.toUpperCase())} /></label><label>CODE<input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} /></label></div>}{room ? <button className="primary" onClick={join}>JOIN & TAKE OVER</button> : <div className="mode-grid"><button className="primary" onClick={() => create("bot")}>PRACTICE VS BOT<br/><small>BROTHER CAN DROP IN</small></button><button onClick={() => create("solo")}>SOLO SANDBOX<br/><small>NO BOT</small></button></div>}{room && <button className="text-btn" onClick={() => { setRoom(""); setCode(""); history.replaceState(null, "", "/"); }}>Start my own session</button>}{error && <p className="error">{error}</p>}</div>}
      {connected && <div className={`match-banner ${botActive ? "bot" : ""}`}>{hud.phase === "finished" ? (hud.winner === null ? "DRAW" : `${hud.players[hud.winner].name} WINS`) : hud.mode === "solo" ? "SOLO SANDBOX // NO BOT // TEST EVERYTHING" : botActive ? "RIFT HUNTER ACTIVE // BROTHER CAN DROP IN" : "BROTHER LINK ACTIVE // BREAK THE CODE"}</div>}
      {connected && <div className="command-hud"><div className="glove left"><span>LEFT GLOVE // PSIONIC</span><b>{mePlayer?.gripCoverId ? "COVER HELD" : mePlayer?.gripId ? "MATTER HELD" : mePlayer?.orbitIds?.length ? `ORBIT ×${mePlayer.orbitIds.length}` : mePlayer?.shield ? "FIELD ACTIVE" : "FIELD READY"}</b></div><div className="reticle">◇</div><div className="glove right"><span>RIGHT GLOVE // CONSTRUCT</span><b>SHOTGUN · COVER READY</b></div></div>}
      <div className="mobile-actions"><button onPointerDown={() => touchAction("slide")}>SLIDE</button><button onPointerDown={() => touchAction("melee")}>HIT</button><button onPointerDown={() => touchAction("pinball")}>PINBALL</button></div>
    </div><aside className="panel">
      {connected ? <><div className="round-line"><span>{hud.mode === "solo" ? "SOLO SANDBOX" : `ROUND ${hud.round}`}</span><b>{hud.mode === "solo" ? "∞" : `${hud.players[0]?.score || 0} : ${hud.players[1]?.score || 0}`}</b></div>{hud.players.map((p: any, i: number) => <div className={`player-card p${i}`} key={i}><div><span>{p.name}{p.bot ? " · CPU" : i === hud.slot ? " · YOU" : ""}</span><strong>{Math.ceil(p.hp)} HP</strong></div><Meter value={p.hp} kind="hp" /><div className="battery-row"><span>BATTERY</span><span>{Math.ceil(p.battery)}%</span></div><Meter value={p.battery} kind="battery" /></div>)}{invite && <button onClick={copy}>COPY BROTHER DROP-IN LINK</button>}{hud.mode !== "solo" && <button className="primary" disabled={hud.phase === "playing"} onClick={start}>{hud.phase === "finished" ? botActive ? "INSTANT REMATCH VS BOT" : "REQUEST BROTHER REMATCH" : "ROUND LIVE"}</button>}</> : <div className="signal-card"><span className="kicker">MISSION</span><h3>SLIDE. BUILD.<br />GRIP THE COVER.<br />BREAK THE CODE.</h3><p>Version 57 movement, Jade’s recovered directional sprites, and the Dimension 33 arena layer are ready.</p></div>}
      <div className="controls"><h3>DUAL GLOVE COMMANDS</h3><Control k="WASD" v="move" /><Control k="MOUSE / RT" v="aim + shotgun" /><Control k="SHIFT / A" v="baseball slide" /><Control k="E / LB" v="shield" /><Control k="Q / Y" v="Grip matter / generated cover" /><Control k="Q again" v="release psychic hold" /><Control k="R / D-PAD →" v="throw matter" /><Control k="B / X" v="generate chunky cover" /><Control k="F / RB" v="power glove" /><Control k="C / D-PAD ←" v="heavy strike" /><Control k="O / D-PAD ↑" v="Orbit" /><Control k="P / D-PAD ↓" v="launch Orbit" /><Control k="SPACE / B" v="Pinball" /><Control k="X / LT" v="slow field" /></div>
    </aside></section>
  </main>;
}

function Meter({ value, kind }: { value: number; kind: string }) { return <div className={`meter ${kind}`}><i style={{ width: `${Math.max(0, value)}%` }} /></div>; }
function Control({ k, v }: { k: string; v: string }) { return <div className="control"><kbd>{k}</kbd><span>{v}</span></div>; }

function draw(canvas: HTMLCanvasElement | null, s: any, me: number) {
  if (!canvas) return; const g = canvas.getContext("2d")!, W = canvas.width, H = canvas.height, sx = W / 1000, sy = H / 620;
  g.setTransform(sx, 0, 0, sy, 0, 0); g.clearRect(0, 0, 1000, 620); drawArena(g, s?.time || 0);
  if (!s) { g.fillStyle = "#57e3e7aa"; g.font = "700 18px monospace"; g.fillText("DIMENSION 33 // BOT SIGNAL READY", 35, 585); return; }
  const sorted = [...(s.covers || []).map((c: any) => ({ y: c.y + c.h, draw: () => cover(g, c) })), ...(s.matter || []).map((m: any) => ({ y: m.y, draw: () => matter(g, m) })), ...(s.players || []).map((p: any, i: number) => ({ y: p.y, draw: () => fighter(g, p, i, me, s.time) }))].sort((a, b) => a.y - b.y);
  sorted.forEach(x => x.draw());
  for (const sh of s.shots || []) { g.strokeStyle = sh.owner === me ? "#b9ffff" : "#ff5ca8"; g.shadowColor = g.strokeStyle; g.shadowBlur = 12; g.lineWidth = 4; g.beginPath(); g.moveTo(sh.x, sh.y); g.lineTo(sh.x - sh.vx * .032, sh.y - sh.vy * .032); g.stroke(); g.shadowBlur = 0; }
  for (const f of s.fx || []) effect(g, f);
  g.fillStyle = "#b5d9df"; g.font = "700 13px monospace"; g.fillText(`HAIGHT COMBAT LAB // ${s.build}`, 22, 596);
}

function drawArena(g: CanvasRenderingContext2D, t: number) {
  const sky = g.createLinearGradient(0, 0, 0, 620); sky.addColorStop(0, "#090815"); sky.addColorStop(.34, "#17182b"); sky.addColorStop(1, "#071019"); g.fillStyle = sky; g.fillRect(0, 0, 1000, 620);
  g.fillStyle = "#05080f"; for (let x = -20; x < 1050; x += 52) { const h = 55 + ((x * 17) % 105 + 105) % 105; g.fillRect(x, 112 - h, 42, h); g.fillStyle = x % 104 ? "#ff3d9a55" : "#44eff055"; g.fillRect(x + 8, 100 - h, 3, 8); g.fillRect(x + 25, 82 - h, 3, 5); g.fillStyle = "#05080f"; }
  g.fillStyle = "#111925"; g.fillRect(0, 103, 1000, 82); g.fillStyle = "#1b2632"; g.fillRect(0, 108, 1000, 9);
  for (let x = 15; x < 1000; x += 96) { g.fillStyle = "#263746"; g.fillRect(x, 116, 58, 48); g.fillStyle = x % 192 ? "#f52f9155" : "#43e8ef55"; g.fillRect(x + 7, 124, 44, 5); g.strokeStyle = "#080d15"; g.strokeRect(x, 116, 58, 48); }
  const leftProjection = concepts.get("war"), rightProjection = concepts.get("lab");
  if (leftProjection) { g.save(); g.globalAlpha = .38; g.drawImage(leftProjection, 0, 0, leftProjection.width, leftProjection.height, 24, 112, 280, 58); g.restore(); }
  if (rightProjection) { g.save(); g.globalAlpha = .38; g.drawImage(rightProjection, 0, 0, rightProjection.width, rightProjection.height, 696, 112, 280, 58); g.restore(); }
  g.fillStyle = "#080d15"; g.fillRect(353, 121, 294, 48); g.strokeStyle = "#ff3d9a"; g.lineWidth = 2; g.strokeRect(362, 128, 276, 33); g.fillStyle = "#ff5bad"; g.font = "900 18px Arial"; g.textAlign = "center"; g.fillText("DIMENSION 33 // WAR GAMES", 500, 151); g.textAlign = "left";
  g.fillStyle = "#0b111a"; g.fillRect(0, 169, 1000, 18); g.fillStyle = "#314252"; for (let x = 8; x < 1000; x += 68) { g.fillRect(x, 154, 7, 42); g.fillRect(x + 34, 163, 28, 5); }
  const floor = g.createLinearGradient(0, 175, 0, 620); floor.addColorStop(0, "#263441"); floor.addColorStop(1, "#101821"); g.fillStyle = floor; g.beginPath(); g.moveTo(0, 185); g.lineTo(1000, 185); g.lineTo(1000, 620); g.lineTo(0, 620); g.fill();
  g.strokeStyle = "#101821"; g.lineWidth = 1; for (let y = 205; y < 620; y += 38) { g.beginPath(); g.moveTo(0, y); g.lineTo(1000, y); g.stroke(); } for (let x = -100; x < 1100; x += 82) { g.beginPath(); g.moveTo(500 + (x - 500) * .28, 185); g.lineTo(x, 620); g.stroke(); }
  g.fillStyle = "#090f17"; g.beginPath(); g.ellipse(500, 352, 175, 77, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#f13c9877"; g.lineWidth = 5; g.beginPath(); g.ellipse(500, 352, 144, 61, 0, 0, Math.PI * 2); g.stroke(); g.strokeStyle = "#57edf077"; g.lineWidth = 2; g.beginPath(); g.ellipse(500, 352, 112, 47, 0, 0, Math.PI * 2); g.stroke();
  const floorProjection = concepts.get("arena"); if (floorProjection) { g.save(); g.globalAlpha = .12; g.drawImage(floorProjection, 0, 0, floorProjection.width, floorProjection.height, 408, 326, 184, 52); g.restore(); }
  g.fillStyle = "#bb246844"; g.beginPath(); g.moveTo(0, 310); g.lineTo(1000, 310); g.lineTo(1000, 371); g.lineTo(0, 371); g.fill();
  g.strokeStyle = "#67edf055"; g.setLineDash([42, 28]); g.lineWidth = 4; g.beginPath(); g.moveTo(0, 340); g.lineTo(1000, 340); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#050910"; g.fillRect(18, 196, 168, 58); g.fillRect(814, 196, 168, 58); g.strokeStyle = "#2ddce3"; g.strokeRect(18, 196, 168, 58); g.strokeStyle = "#ff3d9a"; g.strokeRect(814, 196, 168, 58); g.font = "800 12px monospace"; g.fillStyle = "#55f1f2"; g.fillText("MIND OVER MATTER", 30, 228); g.fillStyle = "#ff55aa"; g.fillText("KILL · CREATE · OBEY", 829, 228);
  g.globalAlpha = .24 + Math.sin(t * 2.5) * .05; g.fillStyle = "#ff3d9a"; g.fillRect(361, 128, 278, 34); g.globalAlpha = 1;
}

function cover(g: CanvasRenderingContext2D, c: any) {
  const ratio = c.maxHp ? c.hp / c.maxHp : 0, stage = c.hp <= 0 ? 3 : ratio > .66 ? 0 : ratio > .33 ? 1 : 2, col = Number.isInteger(c.art) ? c.art % 8 : 0, image = scenery[stage]?.[col];
  const depth = .78 + (c.y / 620) * .3, width = Math.max(108, c.w * 1.35) * depth, height = width;
  g.save(); g.fillStyle = "#0008"; g.beginPath(); g.ellipse(c.x + c.w / 2, c.y + c.h + 8, width * .36, 15 * depth, -.04, 0, Math.PI * 2); g.fill();
  if (c.generated && c.hp > 0) { drawConstructedCover(g, c, depth); }
  else if (image) { g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.drawImage(image, c.x + c.w / 2 - width / 2, c.y + c.h + 18 - height, width, height); }
  else { const h = 46 * depth; g.fillStyle = c.generated ? "#244b56" : "#67727b"; g.strokeStyle = c.generated ? "#67eff0" : "#f05aa8"; g.lineWidth = 3; g.fillRect(c.x, c.y - h + c.h, c.w, h); g.strokeRect(c.x, c.y - h + c.h, c.w, h); }
  g.restore();
}

function drawConstructedCover(g: CanvasRenderingContext2D, c: any, depth: number) {
  const progress = 1 - Math.max(0, Math.min(1, c.build || 0)), blockW = c.w / 3, baseY = c.y + c.h;
  for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++) {
    const n = row * 3 + col, reveal = Math.max(0, Math.min(1, progress * 1.7 - n * .12)); if (reveal <= 0) continue;
    const bw = blockW - 2, bh = 24 * depth, lift = (1 - reveal) * (76 + n * 9), x = c.x + col * blockW, y = baseY - row * bh - bh - lift, ex = 8 * depth, ey = -7 * depth;
    g.globalAlpha = .35 + reveal * .65; g.fillStyle = row ? "#59616c" : "#68717b"; g.strokeStyle = "#0a0d12"; g.lineWidth = 2; g.fillRect(x, y, bw, bh); g.strokeRect(x, y, bw, bh);
    g.fillStyle = "#858b94"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + ex, y + ey); g.lineTo(x + bw + ex, y + ey); g.lineTo(x + bw, y); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#343c47"; g.beginPath(); g.moveTo(x + bw, y); g.lineTo(x + bw + ex, y + ey); g.lineTo(x + bw + ex, y + bh + ey); g.lineTo(x + bw, y + bh); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = n % 2 ? "#ff48a1" : "#60eff2"; g.globalAlpha = .55 * reveal; g.beginPath(); g.moveTo(x + 6, y + bh * .66); g.lineTo(x + bw - 8, y + bh * .48); g.stroke();
    if (progress < 1) { g.fillStyle = n % 2 ? "#ff48a1" : "#60eff2"; for (let q = 0; q < 2; q++) { const a = n + q * Math.PI; g.fillRect(x + bw / 2 + Math.cos(a) * (24 + lift * .14), y + Math.sin(a) * 16, 4, 4); } }
  }
  g.globalAlpha = 1; g.strokeStyle = "#6cf9ff"; g.shadowColor = "#6cf9ff"; g.shadowBlur = 14; g.lineWidth = 2; g.strokeRect(c.x - 3, baseY - 49 * depth, c.w + 8 * depth, 50 * depth); g.shadowBlur = 0;
}

function matter(g: CanvasRenderingContext2D, m: any) {
  const depth = .78 + m.y / 620 * .3; g.save(); g.translate(m.x, m.y); g.rotate((m.x + m.y) * .02); g.scale(depth, depth); g.fillStyle = m.kind === "metal" ? "#426f8a" : "#81716b"; g.strokeStyle = m.orbitBy !== null ? "#f653b1" : m.heldBy !== null ? "#61edf0" : "#d5d2cf"; g.shadowColor = g.strokeStyle; g.shadowBlur = m.orbitBy !== null || m.heldBy !== null ? 15 : 0; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 7; i++) { const a = i * Math.PI * 2 / 7, r = m.r * (i % 2 ? .72 : 1); i ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); g.restore();
}

function fighter(g: CanvasRenderingContext2D, p: any, i: number, me: number, t: number) {
  const color = i === 0 ? "#ff4aa5" : "#56eef0", speed = Math.hypot(p.vx || 0, p.vy || 0), family = p.coverId ? "cover" : (p.slide > 0 || p.pinball > 0 || p.knock > .32) ? "slide" : speed > 34 ? "run" : "ready";
  const angle = family === "slide" && Number.isFinite(p.slideFacing) ? p.slideFacing : family === "run" && speed > 55 ? Math.atan2(p.vy, p.vx) : p.aim || 0;
  const direction = ((Math.round(angle / (Math.PI * 2) * 24) % 24) + 24) % 24;
  const image = jade.get(`${family}-${direction}`) || jade.get(`ready-${direction}`), cell = 125, frames = image ? Math.max(1, Math.floor(image.width / cell) * Math.floor(image.height / cell)) : 1;
  let frame = family === "ready" ? 0 : Math.floor(t * (family === "run" ? 10 : 7)) % frames;
  if (family === "slide" && p.slide > 0) frame = Math.min(frames - 1, Math.max(0, Math.floor((1 - p.slide / .7) * frames)));
  const cols = Math.max(1, Math.floor((image?.width || cell) / cell)), depth = .72 + p.y / 620 * .34, scale = depth * 1.02, sx = (frame % cols) * cell, sy = Math.floor(frame / cols) * cell;
  g.save(); g.fillStyle = "#0009"; g.beginPath(); g.ellipse(p.x, p.y + 7, 31 * depth, 10 * depth, 0, 0, Math.PI * 2); g.fill();
  if (p.shield) { const pulse = 1 + Math.sin(t * 18) * .04; g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 20; g.lineWidth = 5; g.globalAlpha = .78; g.beginPath(); g.ellipse(p.x, p.y - 34 * depth, 42 * pulse * depth, 62 * pulse * depth, 0, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1; g.shadowBlur = 0; }
  if (image) { g.globalAlpha = p.hp <= 0 ? .38 : 1; g.imageSmoothingEnabled = false; g.drawImage(image, sx, sy, cell, cell, p.x - 62.5 * scale, p.y - 109.5 * scale, cell * scale, cell * scale); }
  else { g.translate(p.x, p.y); g.fillStyle = "#151923"; g.strokeStyle = color; g.lineWidth = 3; g.beginPath(); g.moveTo(-16, 10); g.lineTo(-11, -44); g.lineTo(13, -44); g.lineTo(18, 10); g.closePath(); g.fill(); g.stroke(); }
  g.restore();
  g.strokeStyle = color; g.globalAlpha = .65; g.lineWidth = i === me ? 3 : 2; g.beginPath(); g.ellipse(p.x, p.y + 5, 28 * depth, 9 * depth, 0, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1;
  g.fillStyle = color; g.font = "700 12px monospace"; g.fillText(`${i === me ? "YOU" : p.bot ? "CPU" : "P" + (i + 1)} // ${p.name}`, p.x - 48, p.y + 43 * depth);
  g.fillStyle = "#111a22"; g.fillRect(p.x - 36, p.y - 122 * depth, 72, 6); g.fillStyle = color; g.fillRect(p.x - 36, p.y - 122 * depth, 72 * Math.max(0, p.hp) / 100, 6);
  if (t < .8) { g.strokeStyle = color; g.globalAlpha = 1 - t / .8; for (let n = 0; n < 4; n++) { g.beginPath(); g.arc(p.x, p.y, 24 + n * 7 + t * 30, 0, Math.PI * 2); g.stroke(); } g.globalAlpha = 1; }
}

function effect(g: CanvasRenderingContext2D, f: any) {
  const colors: Record<string, string> = { muzzle: "#fff4b0", "shot-hit": "#ff345d", melee: "#ff345d", heavy: "#ff174f", "matter-hit": "#bc6cff", materialize: "#69eff4", "grip-cover": "#b86cff", pinball: "#ff4eb4", "shield-hit": "#77f5ff", break: "#ff9a55", join: "#ffffff" };
  g.save(); g.globalAlpha = Math.min(1, f.life * 5); g.strokeStyle = colors[f.type] || "#f45aaa"; g.shadowColor = g.strokeStyle; g.shadowBlur = 14; g.lineWidth = 4; for (let n = 0; n < 8; n++) { const a = n * Math.PI / 4, r = 8 + (1 - f.life) * 25; g.beginPath(); g.moveTo(f.x + Math.cos(a) * 4, f.y + Math.sin(a) * 4); g.lineTo(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r); g.stroke(); } g.restore();
}
