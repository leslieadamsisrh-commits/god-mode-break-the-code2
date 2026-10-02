"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Session = { room: string; code?: string; token: string; slot: number };
const EMPTY = { x: 0, y: 0, aim: 0, fire: false, shield: false, slide: false, melee: false, heavy: false, grip: false, throwMatter: false, cover: false, orbit: false, launchOrbit: false, pinball: false, slow: false };
const controlMap: Record<string, keyof typeof EMPTY> = { ShiftLeft: "slide", ShiftRight: "slide", KeyF: "melee", KeyC: "heavy", KeyQ: "grip", KeyR: "throwMatter", KeyB: "cover", KeyO: "orbit", KeyP: "launchOrbit", Space: "pinball", KeyX: "slow" };

type Calibration = {
  playerScale:number; generatedCoverScale:number; fixedCoverScale:number; matterScale:number; propScale:number;
  arenaScale:number; foregroundDepth:number; middleDepth:number; backgroundDepth:number; cameraZoom:number;
  cameraPitch:number; perspective:number; playerShadow:number; coverShadow:number; crowdScale:number; balconyScale:number;
};
const DEFAULT_CALIBRATION: Calibration = {
  playerScale:.82, generatedCoverScale:.86, fixedCoverScale:.9, matterScale:.92, propScale:1,
  arenaScale:1, foregroundDepth:1, middleDepth:1, backgroundDepth:1, cameraZoom:1,
  cameraPitch:1, perspective:1, playerShadow:1, coverShadow:1, crowdScale:1, balconyScale:1,
};
const CALIBRATION_FIELDS: {key:keyof Calibration;label:string;min:number;max:number;step:number}[] = [
  {key:"playerScale",label:"PLAYER SPRITES · LOCKED TONIGHT",min:.82,max:.82,step:.01},
  {key:"generatedCoverScale",label:"GENERATED COVER",min:.65,max:1.65,step:.05},
  {key:"fixedCoverScale",label:"FIXED COVER",min:.65,max:1.65,step:.05},
  {key:"matterScale",label:"DEBRIS / MATTER",min:.6,max:1.8,step:.05},
  {key:"propScale",label:"ENVIRONMENT PROPS",min:.7,max:1.5,step:.05},
  {key:"arenaScale",label:"ARENA FLOOR",min:.8,max:1.25,step:.025},
  {key:"foregroundDepth",label:"FOREGROUND DEPTH",min:.65,max:1.5,step:.05},
  {key:"middleDepth",label:"MIDDLE-GROUND DEPTH",min:.65,max:1.5,step:.05},
  {key:"backgroundDepth",label:"BACKGROUND DEPTH",min:.65,max:1.5,step:.05},
  {key:"cameraZoom",label:"CAMERA ZOOM",min:.82,max:1.3,step:.02},
  {key:"cameraPitch",label:"CAMERA PITCH",min:.76,max:1.18,step:.02},
  {key:"perspective",label:"PERSPECTIVE",min:.6,max:1.5,step:.05},
  {key:"playerShadow",label:"PLAYER SHADOW",min:.5,max:1.8,step:.05},
  {key:"coverShadow",label:"COVER SHADOW",min:.5,max:1.8,step:.05},
  {key:"crowdScale",label:"CROWD SCALE",min:.7,max:1.45,step:.05},
  {key:"balconyScale",label:"BALCONY SCALE",min:.7,max:1.45,step:.05},
];

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
      image.src = `/assets/shotgun-v57/${family}-d${String(d).padStart(2, "0")}.webp`;
    }
  }
  const atlas = new Image();
  atlas.onload = () => buildScenery(atlas);
  atlas.src = "/assets/environment/cover-destruction-atlas.png";
  for (const [key, file] of Object.entries({ arena: "arena-blueprint.webp", war: "war-games-blueprint.webp", gloves: "dual-glove-hud.webp", lab: "training-lab.webp", sfRuins: "dimension33-sf-ruins.webp", crowdBaron: "dimension33-crowd-baron.webp", warBoard: "dimension33-war-board.webp" })) {
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
  const [calibration, setCalibration] = useState<Calibration>(DEFAULT_CALIBRATION), [calibrationOpen, setCalibrationOpen] = useState(false), [calibrationNote, setCalibrationNote] = useState("");
  const calibrationRef = useRef<Calibration>(DEFAULT_CALIBRATION);

  const post = useCallback(async (body: any) => { const r = await fetch("/api/game", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }), v = await r.json(); if (!r.ok) throw Error(v.error || "Request failed"); return v; }, []);
  const accept = useCallback((v: any) => { if (v.state) { state.current = v.state; slot.current = v.slot; setHud({ phase: v.state.phase, mode: v.state.mode, round: v.state.round, winner: v.state.winner, countdown: v.state.countdown, finisher: v.state.finisher, players: v.state.players, slot: v.slot }); setStatus("LINKED"); } }, []);
  const create = async (mode: "bot" | "solo" = "bot") => { try { setError(""); const v = await post({ action: "create", name, mode }); const s = { room: v.room, code: v.code, token: v.token, slot: 0 }; session.current = s; sessionStorage.setItem("god_mode_session", JSON.stringify(s)); setRoom(v.room); setCode(v.code); accept(v); if (mode === "bot") { const url = `${location.origin}/?room=${v.room}&code=${v.code}&guest=1`; setInvite(url); history.replaceState(null, "", `/?room=${v.room}&code=${v.code}`); } else { setInvite(""); history.replaceState(null, "", "/"); } running.current = true; } catch (e: any) { setError(e.message); } };
  const join = async () => { try { setError(""); const v = await post({ action: "join", room: room.toUpperCase(), code, name }); const s = { room: room.toUpperCase(), token: v.token, slot: 1 }; session.current = s; sessionStorage.setItem("god_mode_session", JSON.stringify(s)); accept(v); running.current = true; } catch (e: any) { setError(e.message); } };
  const start = async () => { if (!session.current) return; try { accept(await post({ action: state.current?.phase === "finished" ? "rematch" : "start", ...session.current })); } catch (e: any) { setError(e.message); } };
  const copy = async () => { if (!invite) return; try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(invite); else throw Error("clipboard unavailable"); } catch { const box = document.createElement("textarea"); box.value = invite; box.style.position = "fixed"; box.style.opacity = "0"; document.body.appendChild(box); box.select(); document.execCommand("copy"); box.remove(); } setStatus("DROP-IN LINK COPIED"); };

  useEffect(() => { preloadArt(); try { const saved = JSON.parse(localStorage.getItem("god_mode_dimension33_calibration") || "null"); if (saved) { const next = {...DEFAULT_CALIBRATION,...saved}; calibrationRef.current = next; setCalibration(next); } } catch {} }, []);
  useEffect(() => { calibrationRef.current = calibration; }, [calibration]);
  useEffect(() => { try { const q = new URLSearchParams(location.search), qRoom = q.get("room") || "", qCode = q.get("code") || "", guest = q.get("guest") === "1", saved = JSON.parse(sessionStorage.getItem("god_mode_session") || "null"); setRoom(qRoom); setCode(qCode); if (!guest && saved?.room && (!qRoom || saved.room === qRoom)) { session.current = saved; slot.current = saved.slot; running.current = true; if (saved.code) setInvite(`${location.origin}/?room=${saved.room}&code=${saved.code}&guest=1`); } } catch { } }, []);
  useEffect(() => { const kd = (e: KeyboardEvent) => { if ((e.target as HTMLElement)?.tagName === "INPUT") return; if (["Space", "ShiftLeft", "ShiftRight"].includes(e.code)) e.preventDefault(); if (!keys.current[e.code]) edges.current[e.code] = true; keys.current[e.code] = true; }; const ku = (e: KeyboardEvent) => { keys.current[e.code] = false; }; addEventListener("keydown", kd); addEventListener("keyup", ku); return () => { removeEventListener("keydown", kd); removeEventListener("keyup", ku); }; }, []);
  useEffect(() => { let stopped = false; const tick = async () => { if (stopped) return; if (running.current && session.current) { try { const s = session.current, u = new URL("/api/game", location.origin); u.searchParams.set("room", s.room); u.searchParams.set("token", s.token); const r = await fetch(u, { cache: "no-store" }), v = await r.json(); if (!r.ok) throw Error(v.error); accept(v); } catch { setStatus("RECONNECTING"); } } setTimeout(tick, 90); }; tick(); return () => { stopped = true; }; }, [accept]);
  useEffect(() => { const timer = setInterval(async () => { const s = session.current, game = state.current; if (!s || game?.phase !== "playing") return; const p = game.players[slot.current], i: any = { ...EMPTY }; i.x = (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0); i.y = (keys.current.KeyS ? 1 : 0) - (keys.current.KeyW ? 1 : 0); i.aim = Math.atan2(mouse.current.y - p.y, mouse.current.x - p.x); i.fire = mouse.current.down; i.shield = !!keys.current.KeyE; for (const [key, action] of Object.entries(controlMap)) i[action] = !!edges.current[key]; edges.current = {}; let pad: Gamepad | undefined; try { pad = [...navigator.getGamepads()].find(Boolean) as Gamepad | undefined; } catch { } if (pad) { const dz = (v: number) => Math.abs(v) < .2 ? 0 : v; i.x = dz(pad.axes[0] || 0); i.y = dz(pad.axes[1] || 0); const rx = dz(pad.axes[2] || 0), ry = dz(pad.axes[3] || 0); if (rx || ry) i.aim = Math.atan2(ry, rx); i.slide ||= pad.buttons[0]?.pressed; i.pinball ||= pad.buttons[1]?.pressed; i.cover ||= pad.buttons[2]?.pressed; i.grip ||= pad.buttons[3]?.pressed; i.shield ||= pad.buttons[4]?.pressed; i.melee ||= pad.buttons[5]?.pressed; i.slow ||= pad.buttons[6]?.pressed; i.fire ||= pad.buttons[7]?.pressed; i.orbit ||= pad.buttons[12]?.pressed; i.launchOrbit ||= pad.buttons[13]?.pressed; i.throwMatter ||= pad.buttons[15]?.pressed; i.heavy ||= pad.buttons[14]?.pressed; } try { accept(await post({ action: "input", ...s, seq: ++seq.current, input: i })); } catch { setStatus("RECONNECTING"); } }, 66); return () => clearInterval(timer); }, [accept, post]);
  useEffect(() => { let frame = 0; const loop = () => { draw(canvas.current, state.current, slot.current, calibrationRef.current); frame = requestAnimationFrame(loop); }; frame = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame); }, []);

  const point = (e: React.PointerEvent) => { const c = canvas.current; if (!c) return; const r = c.getBoundingClientRect(), rawX = (e.clientX - r.left) / r.width * 1000, rawY = (e.clientY - r.top) / r.height * 620, q = calibrationRef.current; mouse.current.x = (rawX - 500) / q.cameraZoom + 500; mouse.current.y = (rawY - 310) / (q.cameraZoom * q.cameraPitch) + 310; };
  const touchAction = (action: keyof typeof EMPTY) => { const key = Object.keys(controlMap).find(k => controlMap[k] === action) || action; edges.current[key] = true; };
  const connected = !!hud, botActive = !!hud?.players?.some((p: any) => p.bot), mePlayer = hud?.players?.[hud?.slot || 0];
  const saveCalibration = () => { localStorage.setItem("god_mode_dimension33_calibration", JSON.stringify(calibration)); setCalibrationNote("CALIBRATION SAVED"); setTimeout(() => setCalibrationNote(""), 1400); };
  const loadCalibration = () => { try { const saved = JSON.parse(localStorage.getItem("god_mode_dimension33_calibration") || "null"); const next = {...DEFAULT_CALIBRATION,...(saved || {})}; calibrationRef.current = next; setCalibration(next); setCalibrationNote(saved ? "CALIBRATION LOADED" : "NO SAVE — DEFAULTS LOADED"); } catch { setCalibrationNote("SAVE COULD NOT BE READ"); } };
  const resetCalibration = () => { calibrationRef.current = DEFAULT_CALIBRATION; setCalibration(DEFAULT_CALIBRATION); setCalibrationNote("CURRENT DEFAULTS RESTORED"); };
  const copyCalibration = async () => { const text = JSON.stringify(calibration, null, 2); try { await navigator.clipboard.writeText(text); setCalibrationNote("VALUES COPIED"); } catch { setCalibrationNote(text); } };

  return <main className="game-shell">
    <header className="topbar"><div><span className="kicker">GOD MODE: BREAK THE CODE</span><h1>ANIME COMBAT MASTER</h1></div><div className={`net ${status !== "LINKED" ? "warn" : ""}`}><i />{status}</div></header>
    <section className="play-layout"><div className="arena-wrap">
      <canvas ref={canvas} className="arena" width="1400" height="868" tabIndex={0} onPointerMove={point} onPointerDown={e => { point(e); mouse.current.down = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }} onPointerUp={() => mouse.current.down = false} onPointerCancel={() => mouse.current.down = false} />
      {!connected && <div className="lobby-card"><span className="stamp">ANIME UPGRADE SHELL · COMBAT MASTER CORE · DIMENSION 33</span><h2>{room ? "TAKE OVER THE BOT" : "ENTER DIMENSION 33"}</h2><p>{room ? "Your brother is already fighting the Rift Hunter. Join this room and take over its combat slot instantly." : "The approved weighted slide and cover movement are back. Choose a live bot fight or an empty sandbox for movement and matter testing."}</p><label>CALLSIGN<input value={name} onChange={e => setName(e.target.value)} maxLength={24} /></label>{room && <div className="room-fields"><label>ROOM<input value={room} onChange={e => setRoom(e.target.value.toUpperCase())} /></label><label>CODE<input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} /></label></div>}{room ? <button className="primary" onClick={join}>JOIN & TAKE OVER</button> : <div className="mode-grid"><button className="primary" onClick={() => create("bot")}>PRACTICE VS BOT<br/><small>BROTHER CAN DROP IN</small></button><button onClick={() => create("solo")}>SOLO SANDBOX<br/><small>NO BOT</small></button></div>}{room && <button className="text-btn" onClick={() => { setRoom(""); setCode(""); history.replaceState(null, "", "/"); }}>Start my own session</button>}{error && <p className="error">{error}</p>}</div>}
      {connected && <div className={`match-banner ${botActive ? "bot" : ""}`}>{hud.phase === "countdown" ? `ROUND ${hud.round} // ${Math.max(1, Math.ceil(hud.countdown || 0))}` : hud.phase === "finisher" ? "FINISHER // COMBAT MASTER" : hud.phase === "finished" ? (hud.winner === null ? "DRAW" : `${hud.players[hud.winner].name} WINS`) : hud.mode === "solo" ? "SOLO SANDBOX // NO BOT // TEST EVERYTHING" : botActive ? "RIFT HUNTER ACTIVE // BROTHER CAN DROP IN" : "BROTHER LINK ACTIVE // BREAK THE CODE"}</div>}
      <button className="calibration-toggle" onClick={() => setCalibrationOpen(v => !v)}>{calibrationOpen ? "CLOSE CALIBRATION" : "ARENA CALIBRATION"}</button>
      {calibrationOpen && <div className="calibration-panel"><div className="calibration-head"><div><span>DIMENSION 33</span><b>LIVE SCALE LAB</b></div><button onClick={() => setCalibrationOpen(false)} aria-label="Close calibration panel">×</button></div><p>Visual tuning only. Multiplayer coordinates and Version 57 movement remain untouched.</p><div className="calibration-scroll">{CALIBRATION_FIELDS.map(field => <label className="calibration-row" key={field.key}><span>{field.label}<output>{calibration[field.key].toFixed(2)}</output></span><input type="range" min={field.min} max={field.max} step={field.step} value={calibration[field.key]} onChange={e => setCalibration(v => ({...v,[field.key]:Number(e.target.value)}))}/></label>)}</div><div className="calibration-actions"><button onClick={resetCalibration}>RESET DEFAULTS</button><button onClick={saveCalibration}>SAVE</button><button onClick={loadCalibration}>LOAD</button><button onClick={copyCalibration}>COPY VALUES</button></div>{calibrationNote && <div className="calibration-note">{calibrationNote}</div>}</div>}
      {connected && <div className="command-hud"><div className="glove left"><span>LEFT GLOVE // PSIONIC</span><b>{mePlayer?.gripCoverId ? "COVER HELD" : mePlayer?.gripId ? "MATTER HELD" : mePlayer?.orbitIds?.length ? `ORBIT ×${mePlayer.orbitIds.length}` : mePlayer?.shield ? "FIELD ACTIVE" : "FIELD READY"}</b></div><div className="reticle">◇</div><div className="glove right"><span>RIGHT GLOVE // CONSTRUCT</span><b>SHOTGUN · COVER READY</b></div></div>}
      <div className="mobile-actions"><button onPointerDown={() => touchAction("slide")}>SLIDE</button><button onPointerDown={() => touchAction("melee")}>HIT</button><button onPointerDown={() => touchAction("pinball")}>PINBALL</button></div>
    </div><aside className="panel">
      {connected ? <><div className="round-line"><span>{hud.mode === "solo" ? "SOLO SANDBOX" : `ROUND ${hud.round}`}</span><b>{hud.mode === "solo" ? "∞" : `${hud.players[0]?.score || 0} : ${hud.players[1]?.score || 0}`}</b></div>{hud.players.map((p: any, i: number) => <div className={`player-card p${i}`} key={i}><div><span>{p.name}{p.bot ? " · CPU" : i === hud.slot ? " · YOU" : ""}</span><strong>{Math.ceil(p.hp)} HP</strong></div><Meter value={p.hp} kind="hp" /><div className="battery-row"><span>BATTERY</span><span>{Math.ceil(p.battery)}%</span></div><Meter value={p.battery} kind="battery" /></div>)}{invite && <button onClick={copy}>COPY BROTHER DROP-IN LINK</button>}{hud.mode !== "solo" && <button className="primary" disabled={hud.phase === "playing"} onClick={start}>{hud.phase === "finished" ? botActive ? "INSTANT REMATCH VS BOT" : "REQUEST BROTHER REMATCH" : "ROUND LIVE"}</button>}</> : <div className="signal-card"><span className="kicker">MISSION</span><h3>SLIDE. BUILD.<br />GRIP THE COVER.<br />BREAK THE CODE.</h3><p>Version 57 movement, Jade’s recovered directional sprites, and the Dimension 33 arena layer are ready.</p></div>}
      {connected && hud.mode === "solo" && <button className="primary" onClick={start}>RESET NO-BOT SANDBOX</button>}
      <div className="controls"><h3>DUAL GLOVE COMMANDS</h3><Control k="WASD" v="move" /><Control k="MOUSE / RT" v="aim + shotgun" /><Control k="SHIFT / A" v="baseball slide" /><Control k="E / LB" v="shield" /><Control k="Q / Y" v="Grip matter / generated cover" /><Control k="Q again" v="release psychic hold" /><Control k="R / D-PAD →" v="throw matter" /><Control k="B / X" v="generate chunky cover" /><Control k="F / RB" v="power glove" /><Control k="C / D-PAD ←" v="heavy strike" /><Control k="O / D-PAD ↑" v="Orbit" /><Control k="P / D-PAD ↓" v="launch Orbit" /><Control k="SPACE / B" v="Pinball" /><Control k="X / LT" v="slow field" /></div>
    </aside></section>
  </main>;
}

function Meter({ value, kind }: { value: number; kind: string }) { return <div className={`meter ${kind}`}><i style={{ width: `${Math.max(0, value)}%` }} /></div>; }
function Control({ k, v }: { k: string; v: string }) { return <div className="control"><kbd>{k}</kbd><span>{v}</span></div>; }

function draw(canvas: HTMLCanvasElement | null, s: any, me: number, q: Calibration) {
  if (!canvas) return; const g = canvas.getContext("2d")!, W = canvas.width, H = canvas.height, sx = W / 1000, sy = H / 620;
  g.setTransform(sx, 0, 0, sy, 0, 0); g.clearRect(0, 0, 1000, 620); drawArena(g, s?.time || 0, s, q);
  if (!s) { g.fillStyle = "#57e3e7aa"; g.font = "700 18px monospace"; g.fillText("DIMENSION 33 // BOT SIGNAL READY", 35, 585); return; }
  g.save(); g.translate(500,310); g.scale(q.cameraZoom,q.cameraZoom*q.cameraPitch); g.translate(-500,-310);
  const sorted = [...(s.covers || []).map((c: any) => ({ y: c.y + c.h, draw: () => cover(g, c, q) })), ...(s.matter || []).map((m: any) => ({ y: m.y, draw: () => matter(g, m, q) })), ...(s.players || []).map((p: any, i: number) => ({ y: p.y, draw: () => fighter(g, p, i, me, s.time, q) }))].sort((a, b) => a.y - b.y);
  sorted.forEach(x => x.draw());
  for (const sh of s.shots || []) { g.strokeStyle = sh.owner === me ? "#b9ffff" : "#ff5ca8"; g.shadowColor = g.strokeStyle; g.shadowBlur = 12; g.lineWidth = 4; g.beginPath(); g.moveTo(sh.x, sh.y); g.lineTo(sh.x - sh.vx * .032, sh.y - sh.vy * .032); g.stroke(); g.shadowBlur = 0; }
  for (const f of s.fx || []) effect(g, f);
  g.restore();
  drawForegroundOcclusion(g, s.time || 0, q);
  if (s.phase === "countdown") {
    g.save(); g.setTransform(sx,0,0,sy,0,0);
    g.fillStyle="#04070cc7"; g.fillRect(0,0,1000,620);
    const n=Math.max(1,Math.ceil(s.countdown||0));
    g.textAlign="center"; g.font="900 112px Arial"; g.fillStyle="#fff"; g.shadowColor=n%2?"#ff4aa5":"#56eef0"; g.shadowBlur=28;
    g.fillText(String(n),500,328); g.shadowBlur=0; g.font="900 15px monospace"; g.fillStyle="#d7f8fb"; g.fillText("DIMENSION 33 // WAR GAMES",500,370); g.textAlign="left"; g.restore();
  }
  if (s.phase === "finisher") {
    g.save(); g.setTransform(sx,0,0,sy,0,0);
    const p=.5+.5*Math.sin((s.time||0)*34);
    g.fillStyle=`rgba(4,5,10,${.34+p*.16})`; g.fillRect(0,0,1000,620);
    g.globalCompositeOperation="screen"; g.strokeStyle=s.winner===0?"#ff4aa5":"#56eef0"; g.lineWidth=5+p*8;
    g.beginPath(); g.arc(500,330,92+p*62,0,Math.PI*2); g.stroke();
    g.globalCompositeOperation="source-over"; g.textAlign="center"; g.font="900 54px Arial"; g.fillStyle="#fff"; g.fillText("FINISHER",500,138);
    g.font="900 14px monospace"; g.fillStyle="#ffb8dd"; g.fillText("COMBAT MASTER // FREEZE · IMPACT · SLOW RETURN",500,169); g.textAlign="left"; g.restore();
  }
  g.fillStyle = "#b5d9df"; g.font = "700 13px monospace"; g.fillText(`DIMENSION 33 // ${s.build}`, 22, 596);
}

function drawArena(g: CanvasRenderingContext2D, t: number, s: any, q: Calibration) {
  const skyNew = g.createLinearGradient(0, 0, 0, 620); skyNew.addColorStop(0, "#070512"); skyNew.addColorStop(.48, "#311047"); skyNew.addColorStop(1, "#090d18"); g.fillStyle = skyNew; g.fillRect(0, 0, 1000, 620);
  const ruins=concepts.get("sfRuins"), architecture=concepts.get("crowdBaron"), board=concepts.get("warBoard");
  const crowdReactionNew = s?.phase === "finished" ? 1 : (s?.fx || []).some((f:any) => ["heavy","matter-hit","break","pinball","shot-hit"].includes(f.type)) ? .72 : 0;
  if(ruins){const drift=Math.sin(t*.075)*5*q.backgroundDepth;g.save();g.globalAlpha=.97;g.drawImage(ruins,-26+drift,-5,1052,592*q.backgroundDepth);g.restore();}
  if(architecture){
    const crowdBob=Math.sin(t*3.6)*1.5+crowdReactionNew*Math.sin(t*17)*4.5;
    g.save();g.translate(500,132);g.scale(q.crowdScale,q.middleDepth);g.translate(-500,-132);g.globalCompositeOperation="screen";g.globalAlpha=.8;g.drawImage(architecture,-35,-70+crowdBob,1070,602);g.restore();
    const bw=294*q.balconyScale,bh=184*q.balconyScale;g.save();g.globalCompositeOperation="screen";g.globalAlpha=.28+crowdReactionNew*.17;g.shadowColor="#ff2f9d";g.shadowBlur=28+crowdReactionNew*22;g.drawImage(architecture,520,0,560,410,500-bw/2,5+Math.sin(t*.8)*2,bw,bh);g.restore();
  }
  if(board){const scale=q.arenaScale,w=1000*scale,h=500*scale*q.foregroundDepth;g.save();g.drawImage(board,0,145,board.width,board.height-145,500-w/2,137,w,h);g.restore();}
  if(architecture){const bob=Math.sin(t*3.6)*1.5+crowdReactionNew*Math.sin(t*17)*4;g.save();g.globalCompositeOperation="screen";g.globalAlpha=.83;g.drawImage(architecture,0,70,390,830,0,110+bob,154*q.crowdScale,430*q.middleDepth);g.drawImage(architecture,1210,70,390,830,846,110-bob,154*q.crowdScale,430*q.middleDepth);g.restore();}
  g.save();g.globalAlpha=.15+.12*crowdReactionNew;g.globalCompositeOperation="screen";for(let n=0;n<8;n++){const x=78+n*122,y=112+(n%2)*18;g.fillStyle=n%2?"#ff3f9c":"#55eef2";g.beginPath();g.arc(x,y+Math.sin(t*5+n)*3,3+crowdReactionNew*3,0,Math.PI*2);g.fill();}g.restore();
  g.fillStyle="#05070dcc";g.fillRect(355,151,290,31);g.strokeStyle="#ff45a5";g.strokeRect(360,155,280,22);g.fillStyle="#fff";g.font="900 14px Arial";g.textAlign="center";g.fillText(s?.phase==="finished"?"THE ARENA LIVES":"DIMENSION 33 // WAR GAMES",500,171);g.textAlign="left";
  return;
  const sky = g.createLinearGradient(0, 0, 0, 620); sky.addColorStop(0, "#070512"); sky.addColorStop(.22, "#2a1236"); sky.addColorStop(.48, "#a62d6d"); sky.addColorStop(1, "#071019"); g.fillStyle = sky; g.fillRect(0, 0, 1000, 620);
  const reference = concepts.get("dimension33"), crowdReaction = s?.phase === "finished" ? 1 : (s?.fx || []).some((f:any) => ["heavy","matter-hit","break","pinball","shot-hit"].includes(f.type)) ? .72 : 0;
  if (reference) {
    g.save(); g.globalAlpha = .94; const drift = Math.sin(t*.08)*4*q.backgroundDepth; g.drawImage(reference,0,0,reference.width,Math.floor(reference.height*.58),-18+drift,-8,1036,300*q.backgroundDepth); g.restore();
    const crowdBob = Math.sin(t*4.2)*2.2 + crowdReaction*Math.sin(t*18)*5;
    g.save(); g.globalAlpha=.9; g.drawImage(reference,0,170,510,360,-18,70+crowdBob,340*q.crowdScale,205*q.middleDepth); g.drawImage(reference,1026,170,510,360,678,70-crowdBob,340*q.crowdScale,205*q.middleDepth); g.restore();
    const bw=330*q.balconyScale,bh=205*q.balconyScale; g.save(); g.shadowColor="#ff2f9d"; g.shadowBlur=22+crowdReaction*18; g.drawImage(reference,500,45,540,430,500-bw/2,20+Math.sin(t*.7)*2,bw,bh); g.restore();
  }
  g.fillStyle="#050710dd"; g.fillRect(0,164,1000,32); g.strokeStyle="#ff3e9b"; g.lineWidth=3; g.beginPath(); g.moveTo(0,190); g.lineTo(1000,190); g.stroke();
  const crowdBase=150, crowdPulse=1+crowdReaction*.45; for(let band=0;band<3;band++){const y=crowdBase-band*20; for(let x=8+(band%2)*9;x<1000;x+=18){const bob=Math.sin(t*(2.2+band*.3)+x*.11)*2*crowdPulse; g.fillStyle=(x+band*13)%54<18?"#ff4ca9cc":"#6ef4f2bb"; g.beginPath(); g.arc(x,y+bob,2.3+band*.25,0,Math.PI*2); g.fill(); g.strokeStyle="#0b0a12"; g.lineWidth=2; g.beginPath(); g.moveTo(x,y+3+bob); g.lineTo(x,y+11+bob-crowdReaction*4); g.stroke(); if(crowdReaction>.2&&x%54===8){g.strokeStyle="#ffdf8b";g.beginPath();g.moveTo(x,y+5+bob);g.lineTo(x-5,y-4+bob);g.moveTo(x,y+5+bob);g.lineTo(x+5,y-4+bob);g.stroke();}}}
  g.fillStyle="#070b12"; for(let x=0;x<1000;x+=74){g.fillRect(x,158,8,45);g.fillRect(x+8,174,45,5);}
  const floor = g.createLinearGradient(0, 178, 0, 620); floor.addColorStop(0, "#293747"); floor.addColorStop(.58, "#151b27"); floor.addColorStop(1, "#090d14"); g.fillStyle = floor; g.beginPath(); g.moveTo(80-(q.arenaScale-1)*120,190); g.lineTo(920+(q.arenaScale-1)*120,190); g.lineTo(1060,620); g.lineTo(-60,620); g.closePath(); g.fill();
  g.save(); g.globalAlpha=.36; const glow=g.createLinearGradient(0,190,0,620); glow.addColorStop(0,"#ff4c9c22");glow.addColorStop(.52,"#36ecf022");glow.addColorStop(1,"#ff3d9428");g.fillStyle=glow;g.fillRect(0,190,1000,430);g.restore();
  g.strokeStyle = "#050a11cc"; g.lineWidth = 1; for (let y = 214; y < 620; y += 39) { g.beginPath(); g.moveTo(0, y); g.lineTo(1000, y); g.stroke(); } for (let x = -110; x < 1110; x += 76) { g.beginPath(); g.moveTo(500 + (x - 500) * .22/q.perspective, 190); g.lineTo(x, 620); g.stroke(); }
  g.fillStyle="#090c14";g.beginPath();g.ellipse(500,350,210*q.arenaScale,92*q.arenaScale,0,0,Math.PI*2);g.fill();g.strokeStyle="#ff3a9caa";g.lineWidth=7;g.beginPath();g.ellipse(500,350,181*q.arenaScale,78*q.arenaScale,0,0,Math.PI*2);g.stroke();g.strokeStyle="#5cf3f2aa";g.lineWidth=2;g.beginPath();g.ellipse(500,350,140*q.arenaScale,59*q.arenaScale,0,0,Math.PI*2);g.stroke();
  const floorProjection=concepts.get("arena");if(floorProjection){g.save();g.globalAlpha=.14;g.drawImage(floorProjection,402,319,196,60);g.restore();}
  for(let n=0;n<10;n++){const x=65+n*103,y=235+(n%3)*118,w=54*q.propScale;g.fillStyle=n%2?"#ff3e9917":"#54eff019";g.fillRect(x,y,w,6);g.fillStyle="#d9f8ff18";g.fillRect(x+6,y+7,w*.55,2);}
  g.fillStyle="#070910ee";g.fillRect(18,202,170,56);g.fillRect(812,202,170,56);g.strokeStyle="#4deef2";g.strokeRect(18,202,170,56);g.strokeStyle="#ff46a3";g.strokeRect(812,202,170,56);g.font="800 12px monospace";g.fillStyle="#60f5f5";g.fillText("MIND OVER MATTER",30,234);g.fillStyle="#ff5aad";g.fillText("ALL WORLDS · ONE ARENA",824,234);
  g.fillStyle="#05070d";g.fillRect(355,166,290,33);g.strokeStyle="#ff45a5";g.strokeRect(360,170,280,24);g.fillStyle="#fff";g.font="900 15px Arial";g.textAlign="center";g.fillText("DIMENSION 33 // WAR GAMES",500,188);g.textAlign="left";
  g.save();g.globalAlpha=.25*q.foregroundDepth;g.fillStyle="#ff2990";g.beginPath();g.ellipse(170,540,130,18,0,0,Math.PI*2);g.ellipse(825,470,105,14,0,0,Math.PI*2);g.fill();g.fillStyle="#49eef0";g.beginPath();g.ellipse(610,565,155,16,0,0,Math.PI*2);g.fill();g.restore();
}

function drawForegroundOcclusion(g:CanvasRenderingContext2D,t:number,q:Calibration){
  const board=concepts.get("warBoard");if(!board)return;const scale=q.arenaScale,w=1000*scale,h=500*scale*q.foregroundDepth,x=500-w/2,y=137,sourceY=Math.floor(board.height*.72);g.save();g.globalAlpha=.94;g.drawImage(board,0,sourceY,board.width,board.height-sourceY,x,y+h*.72,w,h*.28);g.globalCompositeOperation="screen";g.globalAlpha=.14;g.fillStyle="#ff3f9c";g.fillRect(0,607+Math.sin(t*2)*2,1000,5);g.restore();
}

function cover(g: CanvasRenderingContext2D, c: any, q: Calibration) {
  const ratio=c.maxHp?c.hp/c.maxHp:0, depth=.84+(c.y-208)/320*.16*q.perspective, visualScale=c.generated?q.generatedCoverScale:q.fixedCoverScale, width=c.w*depth*visualScale, center=c.x+c.w/2,base=c.y+c.h;
  g.save();g.fillStyle="#000b";g.beginPath();g.ellipse(center,base+8,width*.42,12*depth*q.coverShadow,-.03,0,Math.PI*2);g.fill();drawConstructedCover(g,c,depth*visualScale,c.generated,ratio);g.restore();
}

function drawConstructedCover(g: CanvasRenderingContext2D, c: any, depth: number, generated=true, ratio=1) {
  const progress=1-Math.max(0,Math.min(1,c.build||0)),damageRow=ratio>.67?0:ratio>.34?1:ratio>0?2:3,column=generated?0:Math.abs(c.art||0)%8,sprite=scenery[damageRow]?.[column]||scenery[damageRow]?.[0],baseY=c.y+c.h;
  const targetW=c.w*depth,targetH=Math.max(58,c.w*.57)*depth,x=c.x+c.w/2-targetW/2,y=baseY-targetH;
  if(sprite){
    if(generated&&progress<.98){
      for(let part=0;part<3;part++){const reveal=Math.max(0,Math.min(1,progress*1.65-part*.18));if(!reveal)continue;const sw=sprite.width/3,dw=targetW/3+1,lift=(1-reveal)*(64+part*13);g.save();g.globalAlpha=.3+reveal*.7;g.shadowColor=part%2?"#ff4da7":"#62eff1";g.shadowBlur=14;g.drawImage(sprite,part*sw,0,sw,sprite.height,x+part*targetW/3,y-lift,dw,targetH);g.restore();}
      g.save();g.globalCompositeOperation="screen";for(let n=0;n<9;n++){const a=n*Math.PI*2/9+progress*5,r=24+(1-progress)*34;g.fillStyle=n%2?"#ff4da7":"#62eff1";g.fillRect(c.x+c.w/2+Math.cos(a)*r,c.y+c.h/2+Math.sin(a)*r*.48,3,3);}g.restore();
    }else{g.drawImage(sprite,x,y,targetW,targetH);}
  }else{
    g.fillStyle=generated?"#6f7d82":"#796f69";g.strokeStyle="#0a0c10";g.lineWidth=3;g.fillRect(x,y,targetW,targetH);g.strokeRect(x,y,targetW,targetH);
  }
  if(ratio>0){g.strokeStyle=generated?"#67f4f1":"#ff58aa";g.globalAlpha=generated?.62:.34;g.lineWidth=2;g.beginPath();g.moveTo(x+targetW*.12,y+targetH*.62);g.lineTo(x+targetW*.88,y+targetH*.54);g.stroke();g.globalAlpha=1;}
}

function matter(g: CanvasRenderingContext2D, m: any, q: Calibration) {
  const depth = (.78 + m.y / 620 * .3*q.perspective)*q.matterScale; g.save(); g.translate(m.x, m.y); g.rotate((m.x + m.y) * .02); g.scale(depth, depth); g.fillStyle = m.kind === "metal" ? "#426f8a" : "#81716b"; g.strokeStyle = m.orbitBy !== null ? "#f653b1" : m.heldBy !== null ? "#61edf0" : "#d5d2cf"; g.shadowColor = g.strokeStyle; g.shadowBlur = m.orbitBy !== null || m.heldBy !== null ? 15 : 0; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 7; i++) { const a = i * Math.PI * 2 / 7, r = m.r * (i % 2 ? .72 : 1); i ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); g.restore();
}

function fighter(g: CanvasRenderingContext2D, p: any, i: number, me: number, t: number, q: Calibration) {
  const color = i === 0 ? "#ff4aa5" : "#56eef0";
  const speed = Math.hypot(p.vx || 0, p.vy || 0);
  const family = p.coverId ? "cover" : (p.slide > 0 || p.pinball > 0 || p.knock > .32) ? "slide" : speed > 34 ? "run" : "ready";
  const angle = family === "slide" && Number.isFinite(p.slideFacing)
    ? p.slideFacing
    : family === "run" && speed > 55
      ? Math.atan2(p.vy, p.vx)
      : p.aim || 0;
  const direction = ((Math.round(angle / (Math.PI * 2) * 24) % 24) + 24) % 24;

  // Combat Master master atlases use 250×250 source cells. Keep that source
  // resolution, but render Jade at the smaller approved in-game footprint.
  const nearest = (fam: string, dir: number) => {
    for (let offset = 0; offset < 12; offset++) {
      const choices = offset === 0 ? [dir] : [dir + offset, dir - offset];
      for (const raw of choices) {
        const d = ((raw % 24) + 24) % 24;
        const candidate = jade.get(`${fam}-${d}`);
        if (candidate) return candidate;
      }
    }
    return undefined;
  };

  const image = nearest(family, direction) || nearest("ready", direction);
  const SOURCE_CELL = 250;
  const DISPLAY_CELL = 125;
  const cols = image ? Math.max(1, Math.floor(image.naturalWidth / SOURCE_CELL)) : 1;
  const rows = image ? Math.max(1, Math.floor(image.naturalHeight / SOURCE_CELL)) : 1;
  const frames = Math.max(1, cols * rows);
  let frame = family === "ready" ? 0 : Math.floor(t * (family === "run" ? 10 : 7)) % frames;
  if (family === "slide" && p.slide > 0) {
    frame = Math.min(frames - 1, Math.max(0, Math.floor((1 - p.slide / .7) * frames)));
  }

  const sx = (frame % cols) * SOURCE_CELL;
  const sy = Math.floor(frame / cols) * SOURCE_CELL;
  const depth = .72 + p.y / 620 * .34 * q.perspective;
  const scale = depth * 1.02 * q.playerScale;

  g.save();
  g.fillStyle = "#0009";
  g.beginPath();
  g.ellipse(p.x, p.y + 7, 31 * depth * q.playerShadow, 10 * depth * q.playerShadow, 0, 0, Math.PI * 2);
  g.fill();

  if (p.shield) {
    const pulse = 1 + Math.sin(t * 18) * .04;
    g.strokeStyle = color;
    g.shadowColor = color;
    g.shadowBlur = 20;
    g.lineWidth = 5;
    g.globalAlpha = .78;
    g.beginPath();
    g.ellipse(p.x, p.y - 34 * depth, 42 * pulse * depth, 62 * pulse * depth, 0, 0, Math.PI * 2);
    g.stroke();
    g.globalAlpha = 1;
    g.shadowBlur = 0;
  }

  if (image) {
    g.globalAlpha = p.hp <= 0 ? .38 : 1;
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = "high";
    g.drawImage(
      image,
      sx, sy, SOURCE_CELL, SOURCE_CELL,
      p.x - DISPLAY_CELL * .5 * scale,
      p.y - DISPLAY_CELL * .876 * scale,
      DISPLAY_CELL * scale,
      DISPLAY_CELL * scale
    );
  } else {
    g.translate(p.x, p.y);
    g.fillStyle = "#151923";
    g.strokeStyle = color;
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-16, 10);
    g.lineTo(-11, -44);
    g.lineTo(13, -44);
    g.lineTo(18, 10);
    g.closePath();
    g.fill();
    g.stroke();
  }
  g.restore();

  g.strokeStyle = color;
  g.globalAlpha = .65;
  g.lineWidth = i === me ? 3 : 2;
  g.beginPath();
  g.ellipse(p.x, p.y + 5, 28 * depth, 9 * depth, 0, 0, Math.PI * 2);
  g.stroke();
  g.globalAlpha = 1;
  g.fillStyle = color;
  g.font = "700 12px monospace";
  g.fillText(`${i === me ? "YOU" : p.bot ? "CPU" : "P" + (i + 1)} // ${p.name}`, p.x - 48, p.y + 43 * depth);
  g.fillStyle = "#111a22";
  g.fillRect(p.x - 36, p.y - 122 * depth, 72, 6);
  g.fillStyle = color;
  g.fillRect(p.x - 36, p.y - 122 * depth, 72 * Math.max(0, p.hp) / 100, 6);
  if (t < .8) {
    g.strokeStyle = color;
    g.globalAlpha = 1 - t / .8;
    for (let n = 0; n < 4; n++) {
      g.beginPath();
      g.arc(p.x, p.y, 24 + n * 7 + t * 30, 0, Math.PI * 2);
      g.stroke();
    }
    g.globalAlpha = 1;
  }
}

function effect(g: CanvasRenderingContext2D, f: any) {
  const colors: Record<string, string> = { muzzle: "#fff4b0", "shot-hit": "#ff345d", melee: "#ff345d", heavy: "#ff174f", "matter-hit": "#bc6cff", materialize: "#69eff4", "grip-cover": "#b86cff", pinball: "#ff4eb4", "shield-hit": "#77f5ff", break: "#ff9a55", join: "#ffffff" };
  g.save(); g.globalAlpha = Math.min(1, f.life * 5); g.strokeStyle = colors[f.type] || "#f45aaa"; g.shadowColor = g.strokeStyle; g.shadowBlur = 14; g.lineWidth = 4; for (let n = 0; n < 8; n++) { const a = n * Math.PI / 4, r = 8 + (1 - f.life) * 25; g.beginPath(); g.moveTo(f.x + Math.cos(a) * 4, f.y + Math.sin(a) * 4); g.lineTo(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r); g.stroke(); } g.restore();
}
