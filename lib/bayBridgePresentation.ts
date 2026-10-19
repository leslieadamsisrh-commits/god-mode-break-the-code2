// Presentation coordinates only. Authoritative gameplay stays on the 1000 × 620 map.
export const DECK_PITCH=.52;
export const DECK_SCREEN_Y=430;
export const DECK_SLOPE=.08;
// Lower three-quarter camera: presentation depth only, never gameplay coordinates.
export const ARENA_DEPTH20=.68;
export const ARENA_SHEAR20=.22;
// Stadium47: physical height and upright assets share one smaller presentation
// unit. Floor positions/footprints and gameplay dimensions remain unchanged.
export const ARENA_UPRIGHT_SCALE47=.64;
export const bayRenderCamera={x:500,y:310,ready:false,last:0,zoom:1.85};
export const DECK={left:0,right:1000,far:0,near:620} as const;
export function projectWorld(x:number,y:number,camera:{x:number;y:number},zoom:number,z=0){
 const p=arenaPoint46(x,y),c=arenaPoint46(camera.x,camera.y),scale=1000/1536*zoom;
 return{x:500+(p.x-c.x)*scale,y:DECK_SCREEN_Y+(p.y-c.y)*scale-z*zoom*ARENA_UPRIGHT_SCALE47};
}
export function unprojectWorld(x:number,y:number,camera:{x:number;y:number},zoom:number){
 const c=arenaPoint46(camera.x,camera.y),scale=1000/1536*zoom;
 return arenaInverse46(c.x+(x-500)/scale,c.y+(y-DECK_SCREEN_Y)/scale);
}
// Floor corners in the original1536x1024 artwork; the artwork is never stretched.
const ARENA_Q46=1-596/836,ARENA_K46=720*(1-ARENA_Q46)-285;
export function arenaPoint46(x:number,y:number){const t=y/620,d=1-ARENA_Q46*t;return{x:768+(x-500+ARENA_SHEAR20*(y-310))*.596/d,y:285+((285+ARENA_K46*t)/d-285)*ARENA_DEPTH20};}
export function arenaInverse46(x:number,y:number){const originalY=285+(y-285)/ARENA_DEPTH20,t=(originalY-285)/(ARENA_K46+originalY*ARENA_Q46),d=1-ARENA_Q46*t;return{x:500+(x-768)*d/.596-ARENA_SHEAR20*(t*620-310),y:t*620};}
export function arenaJacobian46(x:number,y:number){const d=1-ARENA_Q46*y/620;return{x:.596/d,xy:.596*(ARENA_SHEAR20/d+(x-500+ARENA_SHEAR20*(y-310))*ARENA_Q46/(620*d*d)),y:ARENA_DEPTH20*(ARENA_K46+285*ARENA_Q46)/(620*d*d)};}
const sceneContexts46=new WeakMap<object,{sx:number;sy:number;tx:number;ty:number;anchorX:number;anchorY:number}>();
export function setArenaContext46(g:CanvasRenderingContext2D,camera:{x:number;y:number},zoom:number,sx:number,sy:number){const c=arenaPoint46(camera.x,camera.y),scale=1000/1536*zoom;sceneContexts46.set(g,{sx:sx*scale,sy:sy*scale,tx:(500-c.x*scale)*sx,ty:(DECK_SCREEN_Y-c.y*scale)*sy,anchorX:camera.x,anchorY:camera.y});setWorld46(g,camera.x,camera.y);}
export function setWorld46(g:CanvasRenderingContext2D,x:number,y:number){const c=sceneContexts46.get(g);if(!c)return;const p=arenaPoint46(x,y),j=arenaJacobian46(x,y);g.setTransform(c.sx*j.x,0,c.sx*j.xy,c.sy*j.y,c.tx+c.sx*(p.x-j.x*x-j.xy*y),c.ty+c.sy*(p.y-j.y*y));}
export function relativeWorld46(x:number,y:number,dx:number,dy:number){const a=arenaPoint46(x,y),b=arenaPoint46(x+dx,y+dy),j=arenaJacobian46(x,y),ry=(b.y-a.y)/j.y;return{x:(b.x-a.x-j.xy*ry)/j.x,y:ry};}
export function withWorld46(g:CanvasRenderingContext2D,x:number,y:number,draw:()=>void){const c=sceneContexts46.get(g);if(!c){draw();return;}const ox=c.anchorX,oy=c.anchorY;g.save();c.anchorX=x;c.anchorY=y;setWorld46(g,x,y);draw();c.anchorX=ox;c.anchorY=oy;g.restore();}
export function vertical46(x:number,y:number,z:number){const j=arenaJacobian46(x,y),size=1.536*ARENA_UPRIGHT_SCALE47;return{x:j.xy*size*z/(j.x*j.y),y:-size*z/j.y};}
export function screenVector46(x:number,y:number,sx:number,sy:number){const j=arenaJacobian46(x,y),dy=sy/j.y,dx=(sx-j.xy*dy)/j.x,m=Math.min(1,Math.hypot(sx,sy)),n=Math.hypot(dx,dy)||1;return{x:dx/n*m,y:dy/n*m};}
// Preserve artwork proportions and contact anchors at the stadium's body scale.
export function withUpright(g:CanvasRenderingContext2D,x:number,y:number,draw:()=>void){
 const c=sceneContexts46.get(g);if(!c){g.save();g.translate(x,y);g.transform(1,-DECK_SLOPE/DECK_PITCH,0,1/DECK_PITCH,0,0);g.translate(-x,-y);draw();g.restore();return;}
 const run=()=>{const j=arenaJacobian46(c.anchorX,c.anchorY),size=1.536*ARENA_UPRIGHT_SCALE47;g.save();g.translate(x,y);g.transform(size/j.x,0,-j.xy*size/(j.x*j.y),size/j.y,0,0);g.translate(-x,-y);draw();g.restore();};
 if(x===0&&y===0)run();else withWorld46(g,x,y,run);
}

// Structural walls are anchored at actual world boundaries, outside the playable inset.
export function drawDeckBoundary(g:CanvasRenderingContext2D,near=false){
 const y=near?DECK.near:DECK.far,z=14/DECK_PITCH;
 g.save();g.fillStyle="#101c28";g.strokeStyle="#667482";g.lineWidth=1;
 g.beginPath();g.moveTo(0,y);g.lineTo(1000,y);g.lineTo(1000,y-z);g.lineTo(0,y-z);g.closePath();g.fill();g.stroke();
 g.strokeStyle="#ac8f73";g.lineWidth=2;g.beginPath();g.moveTo(0,y-z);g.lineTo(1000,y-z);g.stroke();
 for(let x=12;x<1000;x+=48){g.fillStyle="#354554";g.fillRect(x-2,y-z,4,z);g.fillStyle="#b09a76";g.fillRect(x-1,y-z+8,2,3)}
 if(!near)for(const x of [0,1000]){g.fillStyle="#111d2a";g.beginPath();g.moveTo(x,0);g.lineTo(x,620);g.lineTo(x,620-z);g.lineTo(x,-z);g.closePath();g.fill();g.strokeStyle="#657885";g.lineWidth=5;g.beginPath();g.moveTo(x,-z);g.lineTo(x,620-z);g.stroke()}
 g.restore();
}

