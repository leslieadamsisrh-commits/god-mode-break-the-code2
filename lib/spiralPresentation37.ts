import {relativeWorld46,vertical46} from './bayBridgePresentation';
// Cosmetic particles follow authoritative transition poses; no collision authority.
export function drawSpiral37(g:CanvasRenderingContext2D,t:any,time:number,owner:number){
 const age=Math.max(0,time-t.started),assembly=t.kind==='assemble',progress=assembly?Math.min(1,age/.2):t.phase==='cue'?Math.min(1,age/.08):.7,c=t.pose,co=Math.cos(c.a),si=Math.sin(c.a);
 const point=(x:number,y:number,z:number)=>{const q=relativeWorld46(c.x,c.y,x*co-y*si,x*si+y*co),v=vertical46(c.x,c.y,c.z+z);return{x:c.x+q.x+v.x,y:c.y+q.y+v.y};};
 g.save();const radius=assembly?48*(1-progress)+8:18;
 for(let i=0;i<24;i++){const a=i*2.399+age*18,r=radius*(.3+.7*((i%7)/6)),p=point(Math.cos(a)*r,Math.sin(a)*r,(i%5)*5+(t.phase==='cue'&&!assembly?(t.object.height27j||48):0));g.globalAlpha=.25+.55*(i%3)/2;g.fillStyle=i%4===0?'#d9e9ed':owner===0?'#65efff':'#ff82c2';g.fillRect(p.x,p.y,2+i%3,2+i%2);}
 if(assembly||t.phase==='wait'){g.globalAlpha=.22;g.strokeStyle=owner===0?'#65efff':'#ff82c2';g.lineWidth=1;const w=t.object.w/2,h=t.object.h/2,z=t.object.height27j||48,corners=[[-w,-h],[w,-h],[w,h],[-w,h]];for(const level of [0,z]){g.beginPath();corners.forEach(([x,y],i)=>{const p=point(x,y,level);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y);});g.closePath();g.stroke();}for(const [x,y] of corners){const a=point(x,y,0),b=point(x,y,z);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}}
 g.restore();
}
