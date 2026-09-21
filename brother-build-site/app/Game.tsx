"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Session = { room: string; code?: string; token: string; slot: number };
const EMPTY = { x: 0, y: 0, aim: 0, fire: false, shield: false, slide: false, melee: false, heavy: false, grip: false, throwMatter: false, cover: false, orbit: false, launchOrbit: false, pinball: false, slow: false };
const controlMap: Record<string, keyof typeof EMPTY> = { ShiftLeft: "slide", ShiftRight: "slide", KeyF: "melee", KeyC: "heavy", KeyQ: "grip", KeyR: "throwMatter", KeyB: "cover", KeyO: "orbit", KeyP: "launchOrbit", Space: "pinball", KeyX: "slow" };

const jade = new Map<string, HTMLImageElement>();
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
  const accept = useCallback((v: any) => { if (v.state) { state.current = v.state; slot.current = v.slot; setHud({ phase: v.state.phase, round: v.state.round, winner: v.state.winner, players: v.state.players, slot: v.slot }); setStatus("LINKED"); } }, []);
  const create = async () => { try { setError(""); const v = await post({ action: "create", name }); const s = { room: v.room, code: v.code, token: v.token, slot: 0 }; session.current = s; sessionStorage.setItem("god_mode_session", JSON.stringify(s)); setRoom(v.room); setCode(v.code); accept(v); const url = `${location.origin}/?room=${v.room}&code=${v.code}&guest=1`; setInvite(url); history.replaceState(null, "", `/?room=${v.room}&code=${v.code}`); running.current = true; } catch (e: any) { setError(e.message); } };
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
  const connected = !!hud, botActive = !!hud?.players?.some((p: any) => p.bot);

  return <main className="game-shell">
    <header className="topbar"><div><span className="kicker">GOD MODE: BREAK THE CODE</span><h1>ARCADE BROTHER BUILD</h1></div><div className={`net ${status !== "LINKED" ? "warn" : ""}`}><i />{status}</div></header>
    <section className="play-layout"><div className="arena-wrap">
      <canvas ref={canvas} className="arena" width="1400" height="868" tabIndex={0} onPointerMove={point} onPointerDown={e => { point(e); mouse.current.down = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }} onPointerUp={() => mouse.current.down = false} onPointerCancel={() => mouse.current.down = false} />
      {!connected && <div className="lobby-card"><span className="stamp">BUILD R2 · BOT WARM-UP · BROTHER DROP-IN</span><h2>{room ? "TAKE OVER THE BOT" : "ENTER THE COMBAT LAB"}</h2><p>{room ? "Your brother is already fighting the Rift Hunter. Join this room and take over its combat slot instantly." : "Start fighting immediately against a live combat bot. Copy the room link whenever your brother is ready—he replaces the bot without rebuilding the match."}</p><label>CALLSIGN<input value={name} onChange={e => setName(e.target.value)} maxLength={24} /></label>{room && <div className="room-fields"><label>ROOM<input value={room} onChange={e => setRoom(e.target.value.toUpperCase())} /></label><label>CODE<input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} /></label></div>}<button className="primary" onClick={room ? join : create}>{room ? "JOIN & TAKE OVER" : "PLAY NOW VS BOT"}</button>{room && <button className="text-btn" onClick={() => { setRoom(""); setCode(""); history.replaceState(null, "", "/"); }}>Start my own bot fight</button>}{error && <p className="error">{error}</p>}</div>}
      {connected && <div className={`match-banner ${botActive ? "bot" : ""}`}>{hud.phase === "finished" ? (hud.winner === null ? "DRAW" : `${hud.players[hud.winner].name} WINS`) : botActive ? "RIFT HUNTER ACTIVE // BROTHER CAN DROP IN" : "BROTHER LINK ACTIVE // BREAK THE CODE"}</div>}
      <div className="mobile-actions"><button onPointerDown={() => touchAction("slide")}>SLIDE</button><button onPointerDown={() => touchAction("melee")}>HIT</button><button onPointerDown={() => touchAction("pinball")}>PINBALL</button></div>
    </div><aside className="panel">
      {connected ? <><div className="round-line"><span>ROUND {hud.round}</span><b>{hud.players[0]?.score || 0} : {hud.players[1]?.score || 0}</b></div>{hud.players.map((p: any, i: number) => <div className={`player-card p${i}`} key={i}><div><span>{p.name}{p.bot ? " · CPU" : i === hud.slot ? " · YOU" : ""}</span><strong>{Math.ceil(p.hp)} HP</strong></div><Meter value={p.hp} kind="hp" /><div className="battery-row"><span>BATTERY</span><span>{Math.ceil(p.battery)}%</span></div><Meter value={p.battery} kind="battery" /></div>)}{invite && <button onClick={copy}>COPY BROTHER DROP-IN LINK</button>}<button className="primary" disabled={hud.phase === "playing"} onClick={start}>{hud.phase === "finished" ? botActive ? "INSTANT REMATCH VS BOT" : "REQUEST BROTHER REMATCH" : "ROUND LIVE"}</button></> : <div className="signal-card"><span className="kicker">MISSION</span><h3>FIGHT NOW.<br />BROTHER DROPS IN.<br />BOT DROPS OUT.</h3><p>The recovered Jade sprite system and destructible Bay Area cover are active in the arena.</p></div>}
      <div className="controls"><h3>COMBAT GRID</h3><Control k="WASD" v="move" /><Control k="MOUSE / RT" v="aim + shotgun" /><Control k="SHIFT / A" v="baseball slide" /><Control k="E / LB" v="shield" /><Control k="Q / Y" v="Grip matter" /><Control k="R / D-PAD →" v="throw" /><Control k="B / X" v="generate cover" /><Control k="F / RB" v="power glove" /><Control k="C / D-PAD ←" v="heavy strike" /><Control k="O / D-PAD ↑" v="Orbit" /><Control k="P / D-PAD ↓" v="launch Orbit" /><Control k="SPACE / B" v="Pinball" /><Control k="X / LT" v="slow field" /></div>
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
  const sky = g.createLinearGradient(0, 0, 0, 620); sky.addColorStop(0, "#182735"); sky.addColorStop(.38, "#273344"); sky.addColorStop(1, "#070d15"); g.fillStyle = sky; g.fillRect(0, 0, 1000, 620);
  g.fillStyle = "#0b111a"; for (let x = -20; x < 1050; x += 58) { const h = 62 + ((x * 17) % 95 + 95) % 95; g.fillRect(x, 92 - h, 49, h); g.fillStyle = x % 116 ? "#14212d" : "#111725"; g.fillRect(x + 7, 81 - h, 4, 4); g.fillRect(x + 25, 63 - h, 4, 4); g.fillStyle = "#0b111a"; }
  g.fillStyle = "#263442"; g.beginPath(); g.moveTo(0, 95); g.lineTo(1000, 55); g.lineTo(1000, 620); g.lineTo(0, 620); g.fill();
  g.fillStyle = "#1b252f"; g.beginPath(); g.moveTo(0, 185); g.lineTo(1000, 125); g.lineTo(1000, 550); g.lineTo(0, 620); g.fill();
  g.strokeStyle = "#40505a"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 282); g.lineTo(1000, 230); g.moveTo(0, 394); g.lineTo(1000, 357); g.stroke();
  g.strokeStyle = "#111a22"; g.lineWidth = 1; for (let y = 175; y < 620; y += 38) { g.beginPath(); g.moveTo(0, y); g.lineTo(1000, y - 54); g.stroke(); } for (let x = -80; x < 1100; x += 86) { g.beginPath(); g.moveTo(500 + (x - 500) * .25, 125); g.lineTo(x, 620); g.stroke(); }
  g.fillStyle = "#b9276d48"; g.beginPath(); g.moveTo(0, 300); g.lineTo(1000, 255); g.lineTo(1000, 329); g.lineTo(0, 377); g.fill();
  g.strokeStyle = "#67edf044"; g.setLineDash([44, 32]); g.lineWidth = 4; g.beginPath(); g.moveTo(0, 338); g.lineTo(1000, 292); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#0a1118"; g.fillRect(0, 104, 1000, 18); g.fillStyle = "#334453"; for (let x = 10; x < 1000; x += 72) g.fillRect(x, 93, 7, 38);
  g.fillStyle = "#e74b9d"; g.globalAlpha = .28 + Math.sin(t * 2) * .08; g.fillRect(756, 52, 118, 5); g.globalAlpha = 1;
}

function cover(g: CanvasRenderingContext2D, c: any) {
  const ratio = c.maxHp ? c.hp / c.maxHp : 0, stage = c.hp <= 0 ? 3 : ratio > .66 ? 0 : ratio > .33 ? 1 : 2, col = Number.isInteger(c.art) ? c.art % 8 : 0, image = scenery[stage]?.[col];
  const depth = .78 + (c.y / 620) * .3, width = Math.max(108, c.w * 1.35) * depth, height = width;
  g.save(); g.fillStyle = "#0008"; g.beginPath(); g.ellipse(c.x + c.w / 2, c.y + c.h + 8, width * .36, 15 * depth, -.04, 0, Math.PI * 2); g.fill();
  if (image) { g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.drawImage(image, c.x + c.w / 2 - width / 2, c.y + c.h + 18 - height, width, height); }
  else { const h = 46 * depth; g.fillStyle = c.generated ? "#244b56" : "#67727b"; g.strokeStyle = c.generated ? "#67eff0" : "#f05aa8"; g.lineWidth = 3; g.fillRect(c.x, c.y - h + c.h, c.w, h); g.strokeRect(c.x, c.y - h + c.h, c.w, h); }
  if (c.generated && c.hp > 0) { g.strokeStyle = "#6cf9ff"; g.shadowColor = "#6cf9ff"; g.shadowBlur = 14; g.lineWidth = 2; g.strokeRect(c.x - 3, c.y - 25, c.w + 6, 32); g.shadowBlur = 0; }
  g.restore();
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
  const colors: Record<string, string> = { muzzle: "#fff4b0", "shot-hit": "#ff345d", melee: "#ff345d", heavy: "#ff174f", "matter-hit": "#bc6cff", materialize: "#69eff4", pinball: "#ff4eb4", "shield-hit": "#77f5ff", break: "#ff9a55", join: "#ffffff" };
  g.save(); g.globalAlpha = Math.min(1, f.life * 5); g.strokeStyle = colors[f.type] || "#f45aaa"; g.shadowColor = g.strokeStyle; g.shadowBlur = 14; g.lineWidth = 4; for (let n = 0; n < 8; n++) { const a = n * Math.PI / 4, r = 8 + (1 - f.life) * 25; g.beginPath(); g.moveTo(f.x + Math.cos(a) * 4, f.y + Math.sin(a) * 4); g.lineTo(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r); g.stroke(); } g.restore();
}
