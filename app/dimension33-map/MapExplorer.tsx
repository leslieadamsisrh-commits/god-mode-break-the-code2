'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './map.module.css';
import { crossingRamp, ladderSide, onSurface, onUndergroundSurface, perspectiveAt, type ArenaLevel } from './arena-geometry';
import MapMarkup from './MapMarkup';
import { existingCover, lineDistance, readLayout, type Layout } from './markup-data';

type Cover = { x: number; y: number; w: number; h: number; hp: number; id: number; built: boolean; level: ArenaLevel };
type Projectile = { x: number; y: number; vx: number; vy: number; life: number; scrap?: boolean };
type Zone = { name: string; x: number; y: number; r: number; description: string; level?: number };
const SCALE = 1.5625;
const W = 2400;
const H = 1600;
const ZOOM = 1.68;
const p = (x: number, y: number) => ({ x: x * SCALE, y: y * SCALE });
const arenaZones: Zone[] = [
  { name: 'Rocket ring', ...p(768, 473), r: 150, description: 'The central red stage ring anchors four lanes and the arena sightlines.' },
  { name: 'Center platform', ...p(768, 259), r: 160, description: 'Raised platform overlooking the central ring and both flanks.', level: 1 },
  { name: 'Lizard Baron stage', ...p(770, 163), r: 120, description: 'The crowd and Baron occupy the far background beyond the stage barrier.', level: 1 },
  { name: 'West sniper tower', ...p(252, 275), r: 105, description: 'High perch reached from the west elevated bridge.', level: 2 },
  { name: 'East sniper tower', ...p(1280, 275), r: 105, description: 'High perch reached from the east elevated bridge.', level: 2 },
  { name: 'West vehicle bay', ...p(365, 700), r: 120, description: 'Vehicle arrival apron and protected flank route.' },
  { name: 'East vehicle bay', ...p(1172, 700), r: 120, description: 'Vehicle arrival apron and protected flank route.' },
  { name: 'Underground access', ...p(768, 890), r: 135, description: 'Walk into the illuminated access to reach the tunnels.' },
];
const undergroundZones: Zone[] = [
  { name: 'Lift chamber', ...p(768, 540), r: 170, description: 'The vertical connection back to the arena.' },
  { name: 'West service passage', ...p(400, 515), r: 180, description: 'A sheltered rotation beneath the west flank.' },
  { name: 'East service passage', ...p(1140, 515), r: 180, description: 'A sheltered rotation beneath the east flank.' },
];
// Solid pieces correspond to the large cover and vehicles painted into the arena plate.
const obstacles = [
  [425, 445, 90, 62], [1018, 445, 90, 62], [493, 562, 98, 66], [947, 562, 98, 66],
  [354, 601, 140, 76], [1042, 601, 140, 76], [566, 744, 70, 90], [902, 744, 70, 90],
].map(([x,y,w,h]) => ({ x:x*SCALE,y:y*SCALE,w:w*SCALE,h:h*SCALE }));
const breakablePositions = existingCover;
const makeCover = () => breakablePositions.map(([x,y,w,h],id): Cover => ({...p(x,y),w:w*SCALE,h:h*SCALE,hp:4,id,built:false,level:'floor'}));
const inCover = (x:number,y:number,c:Cover,pad=0) => Math.abs(x-c.x)<c.w/2+pad && Math.abs(y-c.y)<c.h/2+pad;
const spriteDirection = (angle:number) => ((Math.round(angle*12/Math.PI)%24)+24)%24;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r);
};

export default function MapExplorer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ x: 1200, y: 1078, camX: 0, camY: 0, scene: 'arena' as 'arena'|'underground', level:'floor' as ArenaLevel, climb:0, climbFrom:null as {x:number;y:number}|null, facing: 1, moving: false, elapsed: 0, keys: new Set<string>(), stick: { x: 0, y: 0 }, touchAim:{x:0,y:0}, pointer:null as null|{x:number;y:number}, aim:-Math.PI/2, moveAngle:-Math.PI/2, near: '', inspect: false, cover:makeCover(), layout:{version:1,marks:[],disabled:[]} as Layout, markHp:{} as Record<string,number>, heldCover:null as number|null, shots:[] as Projectile[], debris:[] as Projectile[], scars:[] as {x:number;y:number;a:number;age:number;scene:string}[], scraps:0, slide:0, slideCooldown:0, slideAngle:0, fireCooldown:0, shooting:false, padSlide:false, padCover:false, padThrow:false, practice:false, bot:{x:1460,y:770,hp:100,shot:0,respawn:0}, health:100, enemyShots:[] as Projectile[], battery:100, shield:false, touchShield:false, slow:false, padSlow:false });
  const [place, setPlace] = useState('South approach');
  const [scene, setScene] = useState<'arena'|'underground'>('arena');
  const [help, setHelp] = useState(false);
  const [details, setDetails] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [scraps,setScraps] = useState(0);
  const [coverRemaining,setCoverRemaining] = useState(12);
  const [height,setHeight] = useState('FLOOR');
  const [editing,setEditing] = useState(false);
  const editingRef=useRef(false);
  const [practice,setPractice] = useState(false);
  const [health,setHealth] = useState(100);
  const [botHealth,setBotHealth] = useState(100);
  const [battery,setBattery] = useState(100);
  const action = useRef<() => void>(() => {});
  const commands = useRef({slide:()=>{},shoot:()=>{},build:()=>{},release:()=>{},throwDebris:()=>{}});
  const joystick = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = state.current;
    s.layout=readLayout();
    const onVisibility=()=>{if(document.hidden){s.keys.clear();s.stick={x:0,y:0};s.shooting=false;}};
    document.addEventListener('visibilitychange',onVisibility);
    const onDown = (e: KeyboardEvent) => {
      if(editingRef.current)return;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Tab'].includes(e.key)) e.preventDefault();
      s.keys.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') action.current();
      if (e.key.toLowerCase() === 'm') setMapOpen(v => !v);
      if(e.key.toLowerCase()==='x'&&!e.repeat)s.slow=!s.slow;
      if (e.repeat && [' ','c','q'].includes(e.key.toLowerCase())) return;
      if (e.key === ' ') commands.current.slide();
      if (e.key.toLowerCase() === 'c') commands.current.build();
      if (e.key.toLowerCase() === 'q') commands.current.throwDebris();
    };
    const onUp = (e: KeyboardEvent) => { s.keys.delete(e.key.toLowerCase()); if(e.key.toLowerCase()==='c')commands.current.release(); };
    const onBlur = () => { s.keys.clear(); s.stick = {x:0,y:0}; s.shooting=false;commands.current.release(); };
    window.addEventListener('keydown',onDown); window.addEventListener('keyup',onUp); window.addEventListener('blur',onBlur);
    const onPointer=(e:PointerEvent)=>{if(e.target===canvas.current)s.pointer={x:e.clientX,y:e.clientY};};
    const onPointerDown=(e:PointerEvent)=>{if(e.target===canvas.current){s.pointer={x:e.clientX,y:e.clientY};s.shooting=true;commands.current.shoot();}};
    const onPointerUp=()=>s.shooting=false;
    window.addEventListener('pointermove',onPointer);window.addEventListener('pointerdown',onPointerDown);window.addEventListener('pointerup',onPointerUp);
    const cvs = canvas.current!;
    const ctx = cvs.getContext('2d', { alpha: false })!;
    const art: Record<string, HTMLImageElement> = {};
    for (const [key,url] of Object.entries({ arena:'/assets/dimension33-map/arena-war-games-hires.webp',underground:'/assets/dimension33-map/underground-access-hires.webp',...Object.fromEntries(Array.from({length:4},(_,i)=>[`cover${i}`,`/assets/dimension33-map/cover-stage-${i}.webp`])),...Object.fromEntries(Array.from({length:4},(_,i)=>[`rubble${i}`,`/assets/dimension33-map/cover-rubble-${i}.webp`])),...Object.fromEntries(Array.from({length:24},(_,i)=>[`ready${i}`,`/assets/jade/ready-d${String(i).padStart(2,'0')}.webp`])),...Object.fromEntries(Array.from({length:24},(_,i)=>[`run${i}`,`/assets/jade/run-d${String(i).padStart(2,'0')}.webp`])),...Object.fromEntries(Array.from({length:24},(_,i)=>[`slide${i}`,`/assets/jade/slide-d${String(i).padStart(2,'0')}.webp`]))})) {
      const im = new Image(); im.src = url; art[key] = im;
    }
    let id = 0, last = performance.now(), lastZone = '';
    let lastHeight = '', batteryShown=100;
    const fragment=(c:Cover)=>{
      for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2,r=Math.random()*c.w*.4;s.debris.push({x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r*.55,vx:Math.cos(a)*(90+Math.random()*160),vy:Math.sin(a)*(90+Math.random()*160),life:15});}
      setCoverRemaining(s.cover.filter(v=>v.hp>0&&!s.layout.disabled.includes(v.id)).length);
    };
    const damage=(c:Cover,power=1)=>{if(c.hp<=0)return;c.hp=Math.max(0,c.hp-power);if(c.hp===0)fragment(c);};
    const slide=()=>{if(s.slide||s.slideCooldown||s.climb)return;s.slide=.7;s.slideCooldown=.95;s.slideAngle=s.moveAngle;};
    const shoot=()=>{if(s.fireCooldown>0||s.climb)return;s.fireCooldown=.14;const a=s.aim,depth=perspectiveAt(s.y);s.shots.push({x:s.x+Math.cos(a)*43*depth,y:s.y-23*depth+Math.sin(a)*43*depth,vx:Math.cos(a)*1350*depth,vy:Math.sin(a)*1350*depth,life:.8});};
    const build=()=>{
      if(s.scene!=='arena')return;
      const depth=perspectiveAt(s.y);
      const near=s.cover.find(c=>c.hp>0&&!s.layout.disabled.includes(c.id)&&c.level===s.level&&Math.hypot(c.x-s.x,c.y-s.y)<135*depth);
      if(near){s.heldCover=near.id;return;}
      const x=s.x+Math.cos(s.aim)*150*depth,y=s.y+Math.sin(s.aim)*150*depth;
      if(isBlocked(x,y,s.level)||s.cover.some(c=>c.hp>0&&c.level===s.level&&!s.layout.disabled.includes(c.id)&&Math.hypot(c.x-x,c.y-y)<130*depth))return;
      const c={x,y,w:145*depth,h:84*depth,hp:4,id:Date.now()+Math.random(),built:true,level:s.level};s.cover.push(c);s.heldCover=c.id;setCoverRemaining(s.cover.filter(v=>v.hp>0).length);
    };
    const release=()=>{s.heldCover=null;};
    const throwDebris=()=>{if(s.scraps<1)return;s.scraps--;setScraps(s.scraps);s.debris.push({x:s.x,y:s.y-18,vx:Math.cos(s.aim)*950,vy:Math.sin(s.aim)*950,life:.82,scrap:true});};
    commands.current={slide,shoot,build,release,throwDebris};
    const isBlocked = (x:number,y:number,level:ArenaLevel=s.level) => {
      if (s.scene === 'underground') return !onUndergroundSurface(x,y);
      if (!onSurface(x,y,level)) return true;
      if(level==='floor'&&s.layout.marks.some(m=>['cover','breakable','blocked'].includes(m.kind)&&s.markHp[m.id]!==0&&lineDistance(x/SCALE,y/SCALE,m)<10))return true;
      if(level==='floor'){
        // Structural vehicle bodies, side supports and tower walls.
        if (obstacles.some(o => x>o.x-12 && x<o.x+o.w+12 && y>o.y-10 && y<o.y+o.h+10)) return true;
        const sourceX=x/SCALE,sourceY=y/SCALE;
        if((sourceX>210&&sourceX<310||sourceX>1226&&sourceX<1326)&&sourceY>305&&sourceY<387)return true;
        // The rocket ring has a raised rim with a south-facing opening.
        const radial=Math.hypot((sourceX-768)/146,(sourceY-473)/109);
        if(radial>.77&&radial<1.07&&!(Math.abs(sourceX-768)<42&&sourceY>525))return true;
      }
      return s.cover.some(c=>c.hp>0&&c.level===level&&c.id!==s.heldCover&&!s.layout.disabled.includes(c.id)&&inCover(x,y,c,12*perspectiveAt(y)));
    };
    action.current = () => {
      if(s.scene==='arena'){
        const side=ladderSide(s.x,s.y,s.level);
        if(side){
          release();s.slide=0;s.climb=.5;s.climbFrom={x:s.x,y:s.y};
          if(s.level==='bridge'){
            s.level=side==='west'?'tower-west':'tower-east';
            const dest=p(side==='west'?256:1280,253);s.x=dest.x;s.y=dest.y;
            setDetails(`${side==='west'?'West':'East'} tower perch · use the ladder to return to the bridge.`);
          }else{
            s.level='bridge';
            const dest=p(side==='west'?286:1250,279);s.x=dest.x;s.y=dest.y;
            setDetails('Back on the elevated bridge. Follow the ramp to reach the arena floor.');
          }
          return;
        }
      }
      const portal = s.scene === 'arena' ? p(768,890) : p(768,540);
      if ((s.scene==='underground'||s.level==='floor')&&Math.hypot(s.x-portal.x,s.y-portal.y)<175) {
        if (s.scene === 'arena') { s.scene='underground'; s.level='floor'; const entrance=p(768,900);s.x=entrance.x;s.y=entrance.y; setScene('underground'); setDetails('Underground access · follow the central passage to the lift chamber.'); }
        else { s.scene='arena'; s.level='floor'; const exit=p(768,750);s.x=exit.x;s.y=exit.y; setScene('arena'); setDetails('Back on the arena floor.'); }
        s.camX=s.x-innerWidth/ZOOM/2; s.camY=s.y-innerHeight/ZOOM*.62;
      } else if (s.near) {
        const z = (s.scene==='arena'?arenaZones:undergroundZones).find(q=>q.name===s.near);
        if (z) setDetails(`${z.name}${z.level ? ` · elevation ${z.level}` : ''} — ${z.description}`);
      }
    };
    function frame(now:number) {
      const dt = Math.min(.04,(now-last)/1000); last=now; if(!editingRef.current)s.elapsed+=dt;
      const dpr = Math.min(devicePixelRatio||1,2), vw=window.innerWidth, vh=window.innerHeight;
      if (cvs.width!==Math.round(vw*dpr)||cvs.height!==Math.round(vh*dpr)) { cvs.width=Math.round(vw*dpr); cvs.height=Math.round(vh*dpr); }
      ctx.setTransform(dpr,0,0,dpr,0,0);
      if(editingRef.current){id=requestAnimationFrame(frame);return;}
      const k=s.keys;
      const gp=navigator.getGamepads?.()?.find(Boolean);
      let dx=Number(k.has('d')||k.has('arrowright'))-Number(k.has('a')||k.has('arrowleft'))+s.stick.x+(gp && Math.abs(gp.axes[0])>.16?gp.axes[0]:0);
      let dy=Number(k.has('s')||k.has('arrowdown'))-Number(k.has('w')||k.has('arrowup'))+s.stick.y+(gp && Math.abs(gp.axes[1])>.16?gp.axes[1]:0);
      if (gp?.buttons[1]?.pressed && !s.inspect) { s.inspect=true; action.current(); } else if (!gp?.buttons[1]?.pressed) s.inspect=false;
      const mag=Math.hypot(dx,dy); s.moving=mag>.05;
      if (mag) { dx/=Math.max(1,mag);dy/=Math.max(1,mag);s.moveAngle=Math.atan2(dy,dx); }
      const rx=(Math.abs(gp?.axes[2]||0)>.18?gp!.axes[2]:0)+s.touchAim.x,ry=(Math.abs(gp?.axes[3]||0)>.18?gp!.axes[3]:0)+s.touchAim.y;
      if(Math.hypot(rx,ry)>.2)s.aim=Math.atan2(ry,rx);
      else if(s.pointer)s.aim=Math.atan2((s.pointer.y-vh*.62)/ZOOM+s.camY-s.y,(s.pointer.x-vw*.5)/ZOOM+s.camX-s.x);
      else if(mag>.05)s.aim=s.moveAngle;
      const padSlide=!!gp?.buttons[0]?.pressed;if(padSlide&&!s.padSlide)slide();s.padSlide=padSlide;
      const padCover=!!gp?.buttons[5]?.pressed;if(padCover&&!s.padCover)build();if(!padCover&&s.padCover)release();s.padCover=padCover;
      const padThrow=!!gp?.buttons[4]?.pressed;if(padThrow&&!s.padThrow)throwDebris();s.padThrow=padThrow;
      const padSlow=!!gp?.buttons[2]?.pressed;if(padSlow&&!s.padSlow)s.slow=!s.slow;s.padSlow=padSlow;
      s.shield=(k.has('g')||!!gp?.buttons[6]?.pressed||s.touchShield)&&s.battery>0;
      if(s.battery<=0)s.slow=false;
      s.battery=clamp(s.battery+(s.slow?-14:s.shield?-20:11)*dt,0,100);
      if(Math.floor(s.battery)!==batteryShown){batteryShown=Math.floor(s.battery);setBattery(batteryShown);}
      s.slide=Math.max(0,s.slide-dt);s.slideCooldown=Math.max(0,s.slideCooldown-dt);s.fireCooldown=Math.max(0,s.fireCooldown-dt);
      if(s.shooting||k.has('f')||gp?.buttons[7]?.pressed)shoot();
      const depth=perspectiveAt(s.y);
      s.climb=Math.max(0,s.climb-dt);
      if(s.heldCover!==null){const c=s.cover.find(v=>v.id===s.heldCover);if(c){const x=s.x+Math.cos(s.aim)*150*depth,y=s.y+Math.sin(s.aim)*150*depth;if(!isBlocked(x,y,s.level)||Math.hypot(c.x-x,c.y-y)<c.w){c.x+=(x-c.x)*Math.min(1,dt*15);c.y+=(y-c.y)*Math.min(1,dt*15);c.level=s.level;if(c.built){c.w=145*perspectiveAt(c.y);c.h=84*perspectiveAt(c.y);}}}}
      if ((mag||s.slide>0)&&s.climb===0) { const sx=s.slide>0?Math.cos(s.slideAngle):dx,sy=s.slide>0?Math.sin(s.slideAngle):dy;
        const speed=(s.slide>0?670:(k.has('shift')||gp?.buttons[10]?.pressed)?420:285)*depth;
        const nx=s.x+sx*speed*dt, ny=s.y+sy*speed*dt;
        const step=(x:number,y:number)=>{
          const nextLevel=s.scene==='arena'?crossingRamp(x,y,s.level):s.level;
          if(isBlocked(x,y,nextLevel))return false;
          s.x=x;s.y=y;s.level=nextLevel;
          const held=s.cover.find(c=>c.id===s.heldCover);if(held)held.level=nextLevel;
          return true;
        };
        if(!step(nx,s.y)&&s.slide>0)s.slide=0;
        if(!step(s.x,ny)&&s.slide>0)s.slide=0;
        if (Math.abs(sx)>.1) s.facing=sx>0?1:-1;
        if(s.slide>0&&Math.random()<.55)s.scars.push({x:s.x-sx*28,y:s.y-sy*20,a:s.slideAngle,age:0,scene:s.scene});
      }
      for(const mark of s.scars)mark.age+=dt;
      s.scars=s.scars.filter(mark=>mark.age<4.8);
      for(const shot of s.shots){
        shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;
        const hit=s.scene==='arena'?s.cover.find(c=>c.hp>0&&c.level===s.level&&!s.layout.disabled.includes(c.id)&&inCover(shot.x,shot.y,c,6)):undefined;
        if(hit){damage(hit);shot.life=0;}
        if(s.scene==='arena'&&s.level==='floor'){
          const marked=s.layout.marks.find(m=>['cover','breakable','blocked'].includes(m.kind)&&s.markHp[m.id]!==0&&[0,.33,.66,1].some(t=>lineDistance((shot.x-shot.vx*dt*(1-t))/SCALE,(shot.y-shot.vy*dt*(1-t))/SCALE,m)<8));
          if(marked){shot.life=0;if(marked.kind==='breakable'){
            s.markHp[marked.id]=(s.markHp[marked.id]??4)-1;
            if(s.markHp[marked.id]<=0){for(let i=0;i<9;i++){const t=Math.random(),x=(marked.x1+(marked.x2-marked.x1)*t)*SCALE,y=(marked.y1+(marked.y2-marked.y1)*t)*SCALE,a=Math.random()*Math.PI*2;s.debris.push({x,y,vx:Math.cos(a)*140,vy:Math.sin(a)*140,life:15});}}
          }}
        }
        if(s.practice&&s.scene==='arena'&&s.level==='floor'&&s.bot.hp>0&&Math.hypot(shot.x-s.bot.x,shot.y-s.bot.y)<35){s.bot.hp=Math.max(0,s.bot.hp-14);setBotHealth(s.bot.hp);shot.life=0;if(s.bot.hp===0)s.bot.respawn=2.5;}
      }
      s.shots=s.shots.filter(v=>v.life>0&&v.x>0&&v.x<W&&v.y>0&&v.y<H);
      for(const bit of s.debris){bit.life-=dt;if(bit.scrap){bit.x+=bit.vx*dt;bit.y+=bit.vy*dt;const hit=s.cover.find(c=>c.hp>0&&!s.layout.disabled.includes(c.id)&&inCover(bit.x,bit.y,c,12));if(hit){damage(hit,2);bit.life=0;}if(s.practice&&s.bot.hp>0&&Math.hypot(bit.x-s.bot.x,bit.y-s.bot.y)<40){s.bot.hp=Math.max(0,s.bot.hp-40);setBotHealth(s.bot.hp);bit.life=0;if(s.bot.hp===0)s.bot.respawn=2.5;}}else{bit.x+=bit.vx*dt;bit.y+=bit.vy*dt;bit.vx*=Math.exp(-5*dt);bit.vy*=Math.exp(-5*dt);if(Math.hypot(bit.x-s.x,bit.y-s.y)<73&&bit.life<14.6){s.scraps=Math.min(99,s.scraps+1);setScraps(s.scraps);bit.life=0;}}}
      s.debris=s.debris.filter(v=>v.life>0);
      if(s.practice&&s.scene==='arena'){
        const b=s.bot;
        if(b.hp===0){b.respawn-=dt;if(b.respawn<=0){b.x=1460;b.y=770;b.hp=100;setBotHealth(100);}}
        else if(s.level==='floor'){
          const distance=Math.hypot(s.x-b.x,s.y-b.y),toward=Math.atan2(s.y-b.y,s.x-b.x);
          const side=Math.sin(s.elapsed*.9)*.65,stepX=Math.cos(toward+side)*(distance>360?95:distance<240?-70:25)*dt*(s.slow?.4:1),stepY=Math.sin(toward+side)*(distance>360?95:distance<240?-70:25)*dt*(s.slow?.4:1);
          if(onSurface(b.x+stepX,b.y+stepY,'floor')&&!obstacles.some(o=>b.x+stepX>o.x&&b.x+stepX<o.x+o.w&&b.y+stepY>o.y&&b.y+stepY<o.y+o.h)){b.x+=stepX;b.y+=stepY;}
          b.shot-=dt;
          if(distance<810&&b.shot<=0){b.shot=1.1;s.enemyShots.push({x:b.x,y:b.y-25,vx:Math.cos(toward)*600,vy:Math.sin(toward)*600,life:1.5});}
        }
      }
      for(const shot of s.enemyShots){shot.x+=shot.vx*dt*(s.slow?.4:1);shot.y+=shot.vy*dt*(s.slow?.4:1);shot.life-=dt;
        const blocked=s.cover.some(c=>c.hp>0&&!s.layout.disabled.includes(c.id)&&c.level==='floor'&&inCover(shot.x,shot.y,c,5))||s.layout.marks.some(m=>['cover','breakable','blocked'].includes(m.kind)&&s.markHp[m.id]!==0&&lineDistance(shot.x/SCALE,shot.y/SCALE,m)<7);
        if(blocked)shot.life=0;
        else if(s.scene==='arena'&&s.level==='floor'&&s.slide===0&&Math.hypot(shot.x-s.x,shot.y-s.y)<34){shot.life=0;if(!s.shield){s.health=Math.max(0,s.health-10);setHealth(s.health);if(s.health===0){s.health=100;s.x=1200;s.y=1078;setHealth(100);}}}
      }
      s.enemyShots=s.enemyShots.filter(v=>v.life>0);
      const zones=s.scene==='arena'?arenaZones:undergroundZones;
      const closest=zones.reduce<{z:Zone|null,d:number}>((a,z)=>{const dist=Math.hypot(s.x-z.x,s.y-z.y);return dist<a.d?{z,d:dist}:a},{z:null,d:Infinity});
      s.near=closest.d<closest.z!.r+75?closest.z!.name:'';
      const current=closest.d<260?closest.z!.name:(s.scene==='arena'?'Arena floor':'Underground passage');
      if (current!==lastZone) { lastZone=current; setPlace(current); }
      const elevation=s.scene==='underground'?'BELOW':s.level==='floor'?'FLOOR':s.level==='bridge'?'CATWALK':'SNIPER PERCH';
      if(elevation!==lastHeight){lastHeight=elevation;setHeight(elevation);}
      const climbProgress=s.climbFrom&&s.climb>0?1-s.climb/.5:1;
      const actorX=s.climbFrom?s.climbFrom.x+(s.x-s.climbFrom.x)*climbProgress:s.x;
      const actorY=s.climbFrom?s.climbFrom.y+(s.y-s.climbFrom.y)*climbProgress-Math.sin(climbProgress*Math.PI)*28:s.y;
      if(s.climb===0)s.climbFrom=null;
      const actorScale=perspectiveAt(actorY);
      const targetX=clamp(actorX-vw/ZOOM*.5,0,Math.max(0,W-vw/ZOOM));
      const targetY=clamp(actorY-vh/ZOOM*.62,0,Math.max(0,H-vh/ZOOM));
      const blend=1-Math.exp(-18*dt);
      s.camX+=(targetX-s.camX)*blend; s.camY+=(targetY-s.camY)*blend;
      ctx.fillStyle='#080714';ctx.fillRect(0,0,vw,vh);
      ctx.save();ctx.scale(ZOOM,ZOOM);ctx.translate(-s.camX,-s.camY);
      const im=art[s.scene]; if (im.complete && im.naturalWidth) ctx.drawImage(im,0,0,W,H);
      for(const mark of s.scars){if(mark.scene!==s.scene)continue;ctx.save();ctx.translate(mark.x,mark.y);ctx.rotate(mark.a);ctx.globalAlpha=Math.min(1,(4.8-mark.age)/2.7);ctx.strokeStyle='#181323';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-29,-13);ctx.lineTo(25,-11);ctx.moveTo(-31,13);ctx.lineTo(25,11);ctx.stroke();ctx.strokeStyle='#f2389b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-29,-17);ctx.lineTo(7,-15);ctx.moveTo(-25,17);ctx.lineTo(16,15);ctx.stroke();ctx.restore();}
      const drawCover=(c:Cover)=>{
        ctx.save();ctx.translate(c.x,c.y);
        if(c.hp===0){
          ctx.fillStyle='rgba(8,9,18,.86)';ctx.beginPath();ctx.ellipse(0,0,c.w*.64,c.h*.57,0,0,Math.PI*2);ctx.fill();
          const rubble=art[`rubble${Math.floor(c.id)%4}`];
          if(rubble.complete&&rubble.naturalWidth){ctx.filter='brightness(.48) saturate(1.4)';ctx.drawImage(rubble,-c.w*.56,-c.h*.34,c.w*1.12,c.h*.72);ctx.filter='none';}
        }else if(c.built){
          ctx.fillStyle='rgba(0,0,0,.36)';ctx.beginPath();ctx.ellipse(0,c.h*.18,c.w*.55,c.h*.22,0,0,Math.PI*2);ctx.fill();
          const sprite=art[`cover${4-c.hp}`];
          if(sprite.complete&&sprite.naturalWidth){ctx.filter='brightness(.52) saturate(1.35)';ctx.drawImage(sprite,-c.w*.55,-c.h*.68,c.w*1.1,c.h*1.02);ctx.filter='none';}
          ctx.strokeStyle='rgba(255,43,154,.38)';ctx.shadowColor='#ff2699';ctx.shadowBlur=9;ctx.strokeRect(-c.w*.52,-c.h*.45,c.w*1.04,c.h*.58);
        }else if(c.hp<4){
          // Existing barriers are already in the painted plate. Mark their actual surface.
          ctx.strokeStyle='rgba(10,13,25,.9)';ctx.lineWidth=2.5;
          for(let i=0;i<4-c.hp;i++){
            const x=(-.34+i*.23)*c.w;
            ctx.beginPath();ctx.moveTo(x,-c.h*.5);ctx.lineTo(x+c.w*.08,-c.h*.12);
            ctx.lineTo(x-c.w*.03,c.h*.1);ctx.lineTo(x+c.w*.12,c.h*.35);ctx.stroke();
          }
          ctx.strokeStyle='rgba(255,77,148,.68)';ctx.lineWidth=1.5;
          ctx.beginPath();ctx.moveTo(-c.w*.32,-c.h*.45);ctx.lineTo(c.w*.04,-c.h*.13);ctx.lineTo(c.w*.2,c.h*.2);ctx.stroke();
        }
        ctx.restore();
      };
      if(s.scene==='arena'){
        s.cover.filter(c=>!s.layout.disabled.includes(c.id)&&(c.level!==s.level||c.y<actorY)).sort((a,b)=>a.y-b.y).forEach(drawCover);
      }
      if(s.scene==='arena')for(const mark of s.layout.marks){
        if(mark.kind==='scenery'||mark.kind==='route'||s.markHp[mark.id]===0)continue;
        ctx.save();ctx.strokeStyle=mark.kind==='breakable'?'#ff4fa8':mark.kind==='blocked'?'#e0bd66':'#53def2';ctx.lineWidth=4;ctx.globalAlpha=.64;
        ctx.beginPath();ctx.moveTo(mark.x1*SCALE,mark.y1*SCALE);ctx.lineTo(mark.x2*SCALE,mark.y2*SCALE);ctx.stroke();ctx.restore();
      }
      for(const bit of s.debris){ctx.save();ctx.translate(bit.x,bit.y);ctx.scale(perspectiveAt(bit.y),perspectiveAt(bit.y));ctx.fillStyle=bit.scrap?'#f845a7':'#abb3bc';ctx.strokeStyle='#111827';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-9,-6);ctx.lineTo(7,-8);ctx.lineTo(12,7);ctx.lineTo(-6,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
      for(const shot of s.shots){ctx.beginPath();ctx.moveTo(shot.x-shot.vx*.018,shot.y-shot.vy*.018);ctx.lineTo(shot.x,shot.y);ctx.strokeStyle='#ffe0a4';ctx.lineWidth=6*perspectiveAt(shot.y);ctx.shadowColor='#ff329a';ctx.shadowBlur=13;ctx.stroke();ctx.shadowBlur=0;}
      for(const shot of s.enemyShots){ctx.beginPath();ctx.moveTo(shot.x-shot.vx*.025,shot.y-shot.vy*.025);ctx.lineTo(shot.x,shot.y);ctx.strokeStyle='#a8ff6b';ctx.lineWidth=5;ctx.stroke();}
      if(s.practice&&s.scene==='arena'&&s.bot.hp>0){
        const b=s.bot,botDepth=perspectiveAt(b.y);
        ctx.save();ctx.translate(b.x,b.y);ctx.scale(botDepth,botDepth);
        ctx.fillStyle='#050d0b';ctx.strokeStyle='#8aff4d';ctx.lineWidth=3;ctx.shadowColor='#7cff42';ctx.shadowBlur=14;
        roundRect(ctx,-20,-72,40,65,8);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
        ctx.fillStyle='#a9ff5f';ctx.fillRect(-13,-57,26,5);ctx.fillRect(-17,-83,34*(b.hp/100),4);
        ctx.restore();
      }
      ctx.save(); ctx.translate(actorX,actorY);ctx.scale(actorScale,actorScale);
      if(s.shield){ctx.strokeStyle='#63f4ff';ctx.shadowColor='#63f4ff';ctx.shadowBlur=21;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,-40,49,67,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
      ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.ellipse(0,9,26,9,0,0,Math.PI*2);ctx.fill();
      ctx.shadowColor=s.slide>0?'#ff349c':'#04edff';ctx.shadowBlur=10;ctx.strokeStyle=s.slide>0?'#ff349c':'rgba(55,240,255,.75)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,9,27,10,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
      const dir=spriteDirection(s.slide>0?s.slideAngle:s.moving?s.moveAngle:s.aim);
      const family=s.slide>0?'slide':s.moving?'run':'ready';
      const sprite=art[`${family}${dir}`];
      if (sprite.complete && sprite.naturalWidth) {
        if(family!=='ready') { const index=Math.floor(s.elapsed*(family==='slide'?17:12))%12;ctx.drawImage(sprite,(index%6)*125,Math.floor(index/6)*125,125,125,-52,-94,104,104); }
        else ctx.drawImage(sprite,-52,-94,104,104);
      }
      if(s.slide>0){ctx.strokeStyle='rgba(251,54,157,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-Math.cos(s.slideAngle)*34,-Math.sin(s.slideAngle)*34);ctx.lineTo(-Math.cos(s.slideAngle)*115,-Math.sin(s.slideAngle)*115);ctx.stroke();}
      ctx.restore();
      if(s.scene==='arena')s.cover.filter(c=>!s.layout.disabled.includes(c.id)&&c.level===s.level&&c.y>=actorY).sort((a,b)=>a.y-b.y).forEach(drawCover);
      // Repaint the real structure artwork over Jade when her feet are behind its front face.
      // Bridge decks stay underneath Jade after she has taken a ramp onto them.
      if(s.scene==='arena'&&s.level==='floor'&&im.complete&&im.naturalWidth){
        const drawFront=(poly:number[][])=>{
          const points=poly.map(([x,y])=>p(x,y));
          ctx.save();ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
          for(const q of points.slice(1))ctx.lineTo(q.x,q.y);
          ctx.closePath();ctx.clip();ctx.drawImage(im,0,0,W,H);ctx.restore();
        };
        const lips=[[[310,303],[558,437],[604,475],[521,455],[268,324]],[[1226,303],[978,437],[932,475],[1015,455],[1268,324]],[[538,754],[649,782],[653,904],[594,896]],[[998,754],[887,782],[883,904],[942,896]]];
        for(const poly of lips){const points=poly.map(([x,y])=>p(x,y));let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++)if((points[i].y>actorY)!==(points[j].y>actorY)&&actorX<(points[j].x-points[i].x)*(actorY-points[i].y)/(points[j].y-points[i].y)+points[i].x)inside=!inside;
          if(inside)drawFront(poly);
        }
        const px=actorX/SCALE,py=actorY/SCALE;
        const walls=[[205,265,325,390],[1211,265,1331,390],[320,520,460,615],[1076,520,1216,615],
          [377,604,540,728],[996,604,1159,728],[550,718,663,839],[873,718,986,839]];
        for(const [x1,y1,x2,y2] of walls){
          if(px>x1-16&&px<x2+16&&py>y1+8&&py<y2+10)drawFront([[x1,y1],[x2,y1],[x2,y2],[x1,y2]]);
        }
        if(px>600&&px<936&&py>244&&py<263)drawFront([[595,213],[941,213],[941,258],[595,258]]);
      }
      if(s.scene==='underground'&&im.complete&&im.naturalWidth){
        const px=actorX/SCALE,py=actorY/SCALE;
        const walls=[[265,172,391,349],[1145,172,1271,349],[372,370,527,573],[1009,370,1164,573],
          [385,615,646,738],[890,615,1151,738],[583,665,691,842],[845,665,953,842]];
        for(const [x1,y1,x2,y2] of walls){
          if(px<x1-15||px>x2+15||py<y1+15||py>y2+12)continue;
          ctx.save();ctx.beginPath();ctx.rect(x1*SCALE,y1*SCALE,(x2-x1)*SCALE,(y2-y1)*SCALE);
          ctx.clip();ctx.drawImage(im,0,0,W,H);ctx.restore();
        }
      }
      const ladder=s.scene==='arena'?ladderSide(s.x,s.y,s.level):null;
      if(ladder){
        const at=s.level==='bridge'?p(ladder==='west'?286:1250,279):p(ladder==='west'?256:1280,253);
        const label=s.level==='bridge'?'E  CLIMB TOWER':'E  DESCEND LADDER';
        ctx.font='700 12px Arial';const width=ctx.measureText(label).width+24;
        ctx.fillStyle='rgba(5,13,24,.92)';ctx.fillRect(at.x-width/2,at.y-82,width,28);
        ctx.strokeStyle='#61eafa';ctx.strokeRect(at.x-width/2,at.y-82,width,28);
        ctx.textAlign='center';ctx.fillStyle='#e7fcff';ctx.fillText(label,at.x,at.y-63);
      }
      if (s.near) {
        const z=zones.find(q=>q.name===s.near)!;
        const tx=z.x,ty=z.y;
        ctx.save();ctx.font='600 12px system-ui';ctx.textAlign='center';
        const label=(z.name==='Underground access'||z.name==='Lift chamber'?'E  ENTER  ·  ':'E  INSPECT  ·  ')+z.name.toUpperCase();
        const width=ctx.measureText(label).width+28;
        roundRect(ctx,tx-width/2,ty-85,width,29,5);ctx.fillStyle='rgba(3,9,20,.86)';ctx.fill();ctx.strokeStyle='#52e9f2';ctx.lineWidth=1;ctx.stroke();
        ctx.fillStyle='#e6fdff';ctx.fillText(label,tx,ty-66);ctx.restore();
      }
      ctx.restore();
      id=requestAnimationFrame(frame);
    }
    id=requestAnimationFrame(frame);
    return () => {cancelAnimationFrame(id);document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);window.removeEventListener('blur',onBlur);window.removeEventListener('pointermove',onPointer);window.removeEventListener('pointerdown',onPointerDown);window.removeEventListener('pointerup',onPointerUp);};
  },[]);
  const moveStick=(e:React.PointerEvent<HTMLDivElement>)=>{
    const r=joystick.current!.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)/(r.width/2),y=(e.clientY-r.top-r.height/2)/(r.height/2),m=Math.max(1,Math.hypot(x,y));
    state.current.stick={x:x/m,y:y/m};
  };
  const moveAim=(e:React.PointerEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/(r.width/2),y=(e.clientY-r.top-r.height/2)/(r.height/2),m=Math.max(1,Math.hypot(x,y));state.current.touchAim={x:x/m,y:y/m};
  };
  return <main className={styles.screen}>
    <canvas ref={canvas} className={styles.canvas} aria-label="Dimension 33 solo arena movement, cover and shooting lab" />
    <div className={styles.top}><div className={styles.brand}><b>GOD MODE</b><small>DIMENSION 33 <em>·</em> WAR GAMES ARENA 01</small></div><div className={styles.badge}>SOLO ARENA LAB <span>{height}</span></div></div>
    <div className={styles.resource}><span>DEBRIS <b>{scraps}</b></span><span>COVER <b>{coverRemaining}</b></span><span>BATTERY <b>{battery}</b></span>{practice&&<><span>JADE <b>{health}</b></span><span>BOT <b>{botHealth}</b></span></>}<small>BREAK COVER · COLLECT · THROW</small></div>
    <div className={styles.bottom}><div><small>NOW EXPLORING</small><strong>{place}</strong><span>{scene==='arena'?'Arena surface':'Underground level'}</span></div><div className={styles.controls}><button onClick={()=>setMapOpen(true)}>MAP <kbd>M</kbd></button><button onClick={()=>{const s=state.current;s.practice=!s.practice;s.enemyShots=[];s.bot={x:1460,y:770,hp:100,shot:0,respawn:0};s.health=100;setHealth(100);setBotHealth(100);setPractice(s.practice)}}>{practice?'END PRACTICE':'BOT PRACTICE'}</button><button onClick={()=>{window.location.href='/dimension33-builder'}}>DROP-IN TEST</button><button onClick={()=>{editingRef.current=true;state.current.keys.clear();state.current.shooting=false;setEditing(true)}}>EDIT MAP</button><button onClick={()=>setHelp(v=>!v)}>CONTROLS <kbd>?</kbd></button></div></div>
    {details&&<div className={styles.details} onClick={()=>setDetails('')}><button aria-label="Close description">×</button>{details}</div>}
    {help&&<div className={styles.help}><button className={styles.close} onClick={()=>setHelp(false)}>×</button><h2>Arena controls</h2><p><b>WASD / left stick</b> move · <b>Mouse / right stick</b> aim<br/><b>Space / A</b> slide · <b>C / RB</b> create or carry cover<br/><b>Click / RT</b> shoot · <b>Q / LB</b> throw debris<br/><b>G / LT</b> shield · <b>X / X</b> slow time<br/><b>E / B</b> climb ladders, enter tunnel or inspect · <b>M</b> map</p><p>EDIT MAP lets you draw edges and mark painted barriers usable or scenery. Your layout saves on this device; use COPY LAYOUT or DOWNLOAD LAYOUT to send it to me. BOT PRACTICE adds a single sparring target you can turn off any time.</p></div>}
    {mapOpen&&<div className={styles.modal} onClick={()=>setMapOpen(false)}><div className={styles.mapPanel} onClick={e=>e.stopPropagation()}><button className={styles.close} onClick={()=>setMapOpen(false)}>×</button><h2>DIMENSION 33 / ARENA 01</h2><img src="/assets/dimension33-map/source-board.webp" alt="Original arena design board with arena layout, camera angles, key areas, routes and vertical section"/><p>Original design board · the close camera follows you through the arena and its underground route.</p></div></div>}
    {editing&&<MapMarkup onClose={()=>{editingRef.current=false;setEditing(false)}} onChange={layout=>{state.current.layout=layout;setCoverRemaining(state.current.cover.filter(c=>c.hp>0&&!layout.disabled.includes(c.id)).length)}}/>}
    <div className={styles.touchStick} ref={joystick} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);moveStick(e)}} onPointerMove={e=>{if(e.buttons)moveStick(e)}} onPointerUp={()=>state.current.stick={x:0,y:0}}><i /></div>
    <div className={styles.touchAim} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);moveAim(e)}} onPointerMove={e=>{if(e.buttons)moveAim(e)}} onPointerUp={()=>state.current.touchAim={x:0,y:0}}><i /></div>
    <div className={styles.touchButtons}><button onPointerDown={()=>commands.current.slide()}>SLIDE</button><button onPointerDown={()=>commands.current.build()} onPointerUp={()=>commands.current.release()}>COVER</button><button onPointerDown={()=>{state.current.shooting=true;commands.current.shoot()}} onPointerUp={()=>state.current.shooting=false}>FIRE</button><button onPointerDown={()=>commands.current.throwDebris()}>THROW</button><button onPointerDown={()=>action.current()}>USE</button><button onPointerDown={()=>{state.current.touchShield=true}} onPointerUp={()=>{state.current.touchShield=false}} onPointerCancel={()=>{state.current.touchShield=false}}>SHIELD</button><button onPointerDown={()=>{state.current.slow=!state.current.slow}}>SLOW</button></div>
  </main>;
}
