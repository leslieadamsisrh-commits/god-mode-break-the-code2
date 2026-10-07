// Presentation coordinates only. Authoritative gameplay stays on the 1000 × 620 map.
export const DECK_PITCH=.35;
export const DECK_SCREEN_Y=460;
export const bayRenderCamera={x:500,y:310,ready:false,last:0};
export const DECK={left:0,right:1000,far:0,near:620} as const;
export function projectWorld(x:number,y:number,camera:{x:number;y:number},zoom:number,z=0){
 return{x:500+(x-camera.x)*zoom,y:DECK_SCREEN_Y+(y-camera.y)*zoom*DECK_PITCH-z*zoom};
}
export function unprojectWorld(x:number,y:number,camera:{x:number;y:number},zoom:number){
 return{x:camera.x+(x-500)/zoom,y:camera.y+(y-DECK_SCREEN_Y)/(zoom*DECK_PITCH)};
}
// Upright art retains the approved size; only its contact plane changes pitch.
export function withUpright(g:CanvasRenderingContext2D,x:number,y:number,draw:()=>void){
 g.save();g.translate(x,y);g.scale(1,1/DECK_PITCH);g.translate(-x,-y);draw();g.restore();
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
