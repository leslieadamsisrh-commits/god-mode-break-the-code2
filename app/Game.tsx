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
  const animeArena = new Image();
  animeArena.onload = () => concepts.set("animeArena", animeArena);
  animeArena.src = "https://god-mode-anime-upgrade-v28.leslieadams-isrh.chatgpt.site/assets/dimension33-map/arena-war-games-hires.webp";
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
  const [calibration, setCalibration] = useState<Calibration>(DEFAULT_CALIBRATION), [calibrationOpen, setCalibrationOpen] = useState(false), [calibrationNote, setCalibrationNote] = useState(""), [menuOpen,setMenuOpen]=useState(false);
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

  const point = (e: React.PointerEvent) => { const cv = canvas.current; if (!cv) return; const r = cv.getBoundingClientRect(), rawX = (e.clientX - r.left) / r.width * 1000, rawY = (e.clientY - r.top) / r.height * 620, q = calibrationRef.current, cam = cameraFrame(state.current, slot.current, q); mouse.current.x = (rawX - 500) / cam.zoom + cam.x; mouse.current.y = (rawY - 310) / cam.zoom + cam.y; };
  const touchAction = (action: keyof typeof EMPTY) => { const key = Object.keys(controlMap).find(k => controlMap[k] === action) || action; edges.current[key] = true; };
  const connected = !!hud, botActive = !!hud?.players?.some((p: any) => p.bot), mePlayer = hud?.players?.[hud?.slot || 0], opponent = hud?.players?.[(hud?.slot || 0) === 0 ? 1 : 0];
  const saveCalibration = () => { localStorage.setItem("god_mode_dimension33_calibration", JSON.stringify(calibration)); setCalibrationNote("CALIBRATION SAVED"); setTimeout(() => setCalibrationNote(""), 1400); };
  const loadCalibration = () => { try { const saved = JSON.parse(localStorage.getItem("god_mode_dimension33_calibration") || "null"); const next = {...DEFAULT_CALIBRATION,...(saved || {})}; calibrationRef.current = next; setCalibration(next); setCalibrationNote(saved ? "CALIBRATION LOADED" : "NO SAVE — DEFAULTS LOADED"); } catch { setCalibrationNote("SAVE COULD NOT BE READ"); } };
  const resetCalibration = () => { calibrationRef.current = DEFAULT_CALIBRATION; setCalibration(DEFAULT_CALIBRATION); setCalibrationNote("CURRENT DEFAULTS RESTORED"); };
  const copyCalibration = async () => { const text = JSON.stringify(calibration, null, 2); try { await navigator.clipboard.writeText(text); setCalibrationNote("VALUES COPIED"); } catch { setCalibrationNote(text); } };

  return <main className="game-shell">
    <header className="topbar"><div><span className="kicker">GOD MODE: BREAK THE CODE</span><h1>ANIME COMBAT MASTER</h1></div><div className={`net ${status !== "LINKED" ? "warn" : ""}`}><i />{status}</div></header>
    <section className="play-layout"><div className="arena-wrap">
      <canvas ref={canvas} className="arena" width="1400" height="868" tabIndex={0} onPointerMove={point} onPointerDown={e => { point(e); mouse.current.down = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }} onPointerUp={() => mouse.current.down = false} onPointerCancel={() => mouse.current.down = false} />
      {!connected && <div className="lobby-card"><span className="stamp">ANIME UPGRADE SHELL · COMBAT MASTER CORE · DIMENSION 33</span><h2>{room ? "TAKE OVER THE BOT" : "ENTER DIMENSION 33"}</h2><p>{room ? "Your brother is already fighting the Rift Hunter. Join this room and take over its combat slot instantly." : "The approved weighted slide and cover movement are back. Choose a live bot fight or an empty sandbox for movement and matter testing."}</p><label>CALLSIGN<input value={name} onChange={e => setName(e.target.value)} maxLength={24} /></label>{room && <div className="room-fields"><label>ROOM<input value={room} onChange={e => setRoom(e.target.value.toUpperCase())} /></label><label>CODE<input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} /></label></div>}{room ? <button className="primary" onClick={join}>JOIN & TAKE OVER</button> : <div className="mode-grid"><button className="primary" onClick={() => create("bot")}>PRACTICE VS BOT<br/><small>BROTHER CAN DROP IN</small></button><button onClick={() => create("solo")}>SOLO SANDBOX<br/><small>NO BOT</small></button></div>}{room && <button className="text-btn" onClick={() => { setRoom(""); setCode(""); history.replaceState(null, "", "/"); }}>Start my own session</button>}{error && <p className="error">{error}</p>}</div>}
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
  const animeArena = new Image();
  animeArena.onload = () => concepts.set("animeArena", animeArena);
  animeArena.src = "https://god-mode-anime-upgrade-v28.leslieadams-isrh.chatgpt.site/assets/dimension33-map/arena-war-games-hires.webp";
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
  const [calibration, setCalibration] = useState<Calibration>(DEFAULT_CALIBRATION), [calibrationOpen, setCalibrationOpen] = useState(false), [calibrationNote, setCalibrationNote] = useState(""), [menuOpen,setMenuOpen]=useState(false);
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

  const point = (e: React.PointerEvent) => { const cv = canvas.current; if (!cv) return; const r = cv.getBoundingClientRect(), rawX = (e.clientX - r.left) / r.width * 1000, rawY = (e.clientY - r.top) / r.height * 620, q = calibrationRef.current, cam = cameraFrame(state.current, slot.current, q); mouse.current.x = (rawX - 500) / cam.zoom + cam.x; mouse.current.y = (rawY - 310) / cam.zoom + cam.y; };
  const touchAction = (action: keyof typeof EMPTY) => { const key = Object.keys(controlMap).find(k => controlMap[k] === action) || action; edges.current[key] = true; };
  const connected = !!hud, botActive = !!hud?.players?.some((p: any) => p.bot), mePlayer = hud?.players?.[hud?.slot || 0], opponent = hud?.players?.[(hud?.slot || 0) === 0 ? 1 : 0];
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
      {!connected && <button className="calibration-toggle" onClick={() => setCalibrationOpen(v => !v)}>{calibrationOpen ? "CLOSE CALIBRATION" : "ARENA CALIBRATION"}</button>
      {calibrationOpen && <div className="calibration-panel"><div className="calibration-head"><div><span>DIMENSION 33</span><b>LIVE SCALE LAB</b></div><button onClick={() => setCalibrationOpen(false)} aria-label="Close calibration panel">×</button></div><p>Visual tuning only. Multiplayer coordinates and Version 57 movement remain untouched.</p><div className="calibration-scroll">{CALIBRATION_FIELDS.map(field => <label className="calibration-row" key={field.key}><span>{field.label}<output>{calibration[field.key].toFixed(2)}</output></span><input type="range" min={field.min} max={field.max} step={field.step} value={calibration[field.key]} onChange={e => setCalibration(v => ({...v,[field.key]:Number(e.target.value)}))}/></label>)}</div><div className="calibration-actions"><button onClick={resetCalibration}>RESET DEFAULTS</button><button onClick={saveCalibration}>SAVE</button><button onClick={loadCalibration}>LOAD</button><button onClick={copyCalibration}>COPY VALUES</button></div>{calibrationNote && <div className="calibration-note">{calibrationNote}</div>}</div>}
      {connected && <div className="command-hud"><div className="glove left"><span>LEFT GLOVE // PSIONIC</span><b>{mePlayer?.gripCoverId ? "COVER HELD" : mePlayer?.gripId ? "MATTER HELD" : mePlayer?.orbitIds?.length ? `ORBIT ×${mePlayer.orbitIds.length}` : mePlayer?.shield ? "FIELD ACTIVE" : "FIELD READY"}</b></div><div className="reticle">◇</div><div className="glove right"><span>RIGHT GLOVE // CONSTRUCT</span><b>SHOTGUN · COVER READY</b></div></div>}
      {connected && <div className="anime-upgrade-hud">
        <div className="helmet-rail top-left">
          <div className="portrait-disc cyan">J</div>
          <div className="rail-copy"><small>{mePlayer?.name || "JADE"} · YOU</small><div className="segbar cyan">{Array.from({length:10},(_,n)=><i key={n} className={(mePlayer?.hp||0) >= (n+1)*10 ? "on" : ""}/>)}</div></div>
        </div>
        <div className="helmet-rail top-right">
          <div className="rail-copy right"><small>{opponent?.name || (hud.mode==="solo"?"NO TARGET":"RIVAL")}</small><div className="segbar pink">{Array.from({length:10},(_,n)=><i key={n} className={(opponent?.hp||0) >= (n+1)*10 ? "on" : ""}/>)}</div></div>
          <div className="portrait-disc pink">{opponent?.bot ? "R" : "2"}</div>
        </div>
        <div className="round-pod"><b>ROUND {hud.round}</b><strong>{hud.players?.[0]?.score||0}<em>—</em>{hud.players?.[1]?.score||0}</strong><small>{hud.phase==="countdown" ? "ROUND START" : hud.phase==="finisher" ? "FINISHER" : "WAR GAMES"}</small></div>
        <div className="battery-pods">{[80,60,40,20].map(v=><i key={v} className={(mePlayer?.battery||0)>=v ? "on" : ""}/>)}</div>
        <button className="hud-menu-button" onClick={()=>setMenuOpen(true)}>MENU ≡</button>
        <div className="power-rack">
          {[
            ["SHIELD","shield"],["SLOW","slow"],["GRAB","grip"],["ORBIT","orbit"],["PINBALL","pinball"],["COVER","cover"]
          ].map(([label,action])=><button key={label} onPointerDown={()=>touchAction(action as keyof typeof EMPTY)}><span>{label}</span><i/></button>)}
        </div>
        <div className="weapon-console"><small>RIGHT GLOVE // WEAPON</small><b>SG-01</b><span>SHOTGUN</span><em>READY</em></div>
        <div className="field-reticle"><i/><span>FIELD // {Math.ceil(mePlayer?.battery||0)}%</span></div>
      </div>}
      {connected && menuOpen && <div className="war-menu-backdrop">
        <div className="war-menu">
          <small>GOD MODE / DIMENSION 33</small>
          <h2>WAR GAMES</h2>
          <button className="resume" onClick={()=>setMenuOpen(false)}>PLAY / RESUME</button>
          <p>Menu pauses your controls. Return to the fight when ready.</p>
          <div className="war-menu-grid"><button>POWERS ↑</button><button>WEAPONS ↓</button><button onClick={()=>setCalibrationOpen(v=>!v)}>FIELD SIZE ← · CLOSE</button><button>COVER SHAPES →</button></div>
          {hud.phase==="finished" && <button className="reboot" onClick={async()=>{setMenuOpen(false);await start();}}>REBOOT HELMET / REMATCH</button>}
          {invite && <button onClick={copy}>COPY BROTHER DROP-IN LINK</button>}
          <button onClick={()=>{setMenuOpen(false);}}>MAIN MENU</button>
          <details><summary>Controls & help</summary><p>Left stick/WASD move · right stick/mouse aim · A/Shift slide · RT fire · LB shield · LT Slow Time · Y/Q Grip · X/B cover.</p></details>
        </div>
      </div>}
      <div className="mobile-actions"><button onPointerDown={() => touchAction("slide")}>SLIDE</button><button onPointerDown={() => touchAction("melee")}>HIT</button><button onPointerDown={() => touchAction("pinball")}>PINBALL</button></div>
    </div>{!connected && <aside className="panel">
      {connected ? <><div className="round-line"><span>{hud.mode === "solo" ? "SOLO SANDBOX" : `ROUND ${hud.round}`}</span><b>{hud.mode === "solo" ? "∞" : `${hud.players[0]?.score || 0} : ${hud.players[1]?.score || 0}`}</b></div>{hud.players.map((p: any, i: number) => <div className={`player-card p${i}`} key={i}><div><span>{p.name}{p.bot ? " · CPU" : i === hud.slot ? " · YOU" : ""}</span><strong>{Math.ceil(p.hp)} HP</strong></div><Meter value={p.hp} kind="hp" /><div className="battery-row"><span>BATTERY</span><span>{Math.ceil(p.battery)}%</span></div><Meter value={p.battery} kind="battery" /></div>)}{invite && <button onClick={copy}>COPY BROTHER DROP-IN LINK</button>}{hud.mode !== "solo" && <button className="primary" disabled={hud.phase === "playing"} onClick={start}>{hud.phase === "finished" ? botActive ? "INSTANT REMATCH VS BOT" : "REQUEST BROTHER REMATCH" : "ROUND LIVE"}</button>}</> : <div className="signal-card"><span className="kicker">MISSION</span><h3>SLIDE. BUILD.<br />GRIP THE COVER.<br />BREAK THE CODE.</h3><p>Version 57 movement, Jade’s recovered directional sprites, and the Dimension 33 arena layer are ready.</p></div>}
      {connected && hud.mode === "solo" && <button className="primary" onClick={start}>RESET NO-BOT SANDBOX</button>}
      <div className="controls"><h3>DUAL GLOVE COMMANDS</h3><Control k="WASD" v="move" /><Control k="MOUSE / RT" v="aim + shotgun" /><Control k="SHIFT / A" v="baseball slide" /><Control k="E / LB" v="shield" /><Control k="Q / Y" v="Grip matter / generated cover" /><Control k="Q again" v="release psychic hold" /><Control k="R / D-PAD →" v="throw matter" /><Control k="B / X" v="generate chunky cover" /><Control k="F / RB" v="power glove" /><Control k="C / D-PAD ←" v="heavy strike" /><Control k="O / D-PAD ↑" v="Orbit" /><Control k="P / D-PAD ↓" v="launch Orbit" /><Control k="SPACE / B" v="Pinball" /><Control k="X / LT" v="slow field" /></div>
    </aside></section>
  </main>;
}

function Meter({ value, kind }: { value: number; kind: string }) { return <div className={`meter ${kind}`}><i style={{ width: `${Math.max(0, value)}%` }} /></div>; }
function Control({ k, v }: { k: string; v: string }) { return <div className="control"><kbd>{k}</kbd><span>{v}</span></div>; }

function cameraFrame(s:any, me:number, q:Calibration){
  const z=Math.max(1, q.cameraZoom || 1);
  const p=s?.players?.[me] || {x:500,y:310};
  const halfW=500/z, halfH=310/z;
  return {
    zoom:z,
    x:Math.max(halfW,Math.min(1000-halfW,p.x ?? 500)),
    y:Math.max(halfH,Math.min(620-halfH,p.y ?? 310))
  };
}

function draw(canvas: HTMLCanvasElement | null, s: any, me: number, q: Calibration) {
  if (!canvas) return; const g = canvas.getContext("2d")!, W = canvas.width, H = canvas.height, sx = W / 1000, sy = H / 620;
  g.setTransform(sx, 0, 0, sy, 0, 0); g.clearRect(0, 0, 1000, 620); drawArena(g, s?.time || 0, s, q, me);
  if (!s) { g.fillStyle = "#57e3e7aa"; g.font = "700 18px monospace"; g.fillText("DIMENSION 33 // BOT SIGNAL READY", 35, 585); return; }
  g.save(); const cam=cameraFrame(s,me,q); g.translate(500,310); g.scale(cam.zoom,cam.zoom); g.translate(-cam.x,-cam.y);
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

function drawArena(g: CanvasRenderingContext2D, t: number, s: any, q: Calibration, me:number) {
  g.fillStyle="#05060b";
  g.fillRect(0,0,1000,620);
  const image=concepts.get("animeArena");
  if(!image){
    const glow=g.createRadialGradient(500,310,40,500,310,620);
    glow.addColorStop(0,"#3a0d34"); glow.addColorStop(.55,"#111526"); glow.addColorStop(1,"#05060b");
    g.fillStyle=glow; g.fillRect(0,0,1000,620);
    g.fillStyle="#74edf0"; g.font="800 15px monospace"; g.fillText("LOADING DIMENSION 33 // ANIME UPGRADE ARENA",28,588);
    return;
  }
  const cam=cameraFrame(s,me,q);
  const sw=image.naturalWidth/cam.zoom, sh=image.naturalHeight/cam.zoom;
  const cx=(cam.x/1000)*image.naturalWidth, cy=(cam.y/620)*image.naturalHeight;
  const sx=Math.max(0,Math.min(image.naturalWidth-sw,cx-sw/2));
  const sy=Math.max(0,Math.min(image.naturalHeight-sh,cy-sh/2));
  g.imageSmoothingEnabled=true; g.imageSmoothingQuality="high";
  g.drawImage(image,sx,sy,sw,sh,0,0,1000,620);
  // Keep the arena readable under particles without repainting any legacy map art.
  const vignette=g.createRadialGradient(500,310,180,500,310,650);
  vignette.addColorStop(0,"rgba(0,0,0,0)");
  vignette.addColorStop(1,"rgba(3,2,8,.28)");
  g.fillStyle=vignette; g.fillRect(0,0,1000,620);
}

function drawForegroundOcclusion(g:CanvasRenderingContext2D,t:number,q:Calibration){
  // Disabled on the Anime Upgrade plate. The old Brother-build foreground
  // compositor is deliberately not allowed to leak into this container.
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
