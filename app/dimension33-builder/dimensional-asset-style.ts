import type {PieceKind} from './layout';
import {drawContactShadow} from './contact-shadow';

type Point={x:number;y:number};
type UV=readonly [number,number];
type Quad=readonly [UV,UV,UV,UV];
export const DIMENSIONAL_STYLE={ink:'#070d17',edge:'#afb8b4',shadow:'#050917a8',cyan:'#4bdcff',magenta:'#ff3b9b',amber:'#ffb458'} as const;
// Each UV quad traces only a real face in the original 3072 × 2048 plate.
// The old rectangular crops accidentally included floor, crowd, and adjacent props.
const faceMap={
 middleBarricade:{roof:[[1240,578],[1298,556],[1324,565],[1250,585]],front:[[1250,585],[1324,565],[1325,616],[1250,633]],side:[[1192,571],[1250,585],[1250,633],[1192,620]],accent:DIMENSIONAL_STYLE.amber},
 frontPost:{roof:[[1160,1387],[1252,1389],[1240,1462],[1139,1462]],front:[[1144,1464],[1238,1464],[1233,1622],[1144,1626]],side:[[1238,1463],[1270,1432],[1270,1570],[1238,1640]],accent:DIMENSIONAL_STYLE.cyan},
 sniperLower:{roof:[[420,540],[545,519],[582,543],[460,563]],front:[[462,550],[580,526],[580,652],[462,656]],side:[[420,540],[462,550],[462,656],[420,642]],accent:DIMENSIONAL_STYLE.magenta},
 sniperUpper:{roof:[[412,452],[500,405],[580,441],[464,470]],front:[[464,470],[580,441],[580,526],[464,551]],side:[[420,463],[464,470],[464,551],[420,532]],accent:DIMENSIONAL_STYLE.amber},
} as const satisfies Record<string,{roof:Quad;front:Quad;side:Quad;accent:string}>;
function polygon(c:CanvasRenderingContext2D,points:Point[]){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();}
function triangle(c:CanvasRenderingContext2D,img:HTMLImageElement,uv:Quad,dest:Point[],indices:readonly [number,number,number]){
 const [i,j,k]=indices,[a,b,d]=[uv[i],uv[j],uv[k]],[p,q,r]=[dest[i],dest[j],dest[k]];
 const determinant=(a[0]-d[0])*(b[1]-d[1])-(b[0]-d[0])*(a[1]-d[1]);if(Math.abs(determinant)<.001)return;
 const A=((p.x-r.x)*(b[1]-d[1])-(q.x-r.x)*(a[1]-d[1]))/determinant;
 const C=((q.x-r.x)*(a[0]-d[0])-(p.x-r.x)*(b[0]-d[0]))/determinant;
 const B=((p.y-r.y)*(b[1]-d[1])-(q.y-r.y)*(a[1]-d[1]))/determinant;
 const D=((q.y-r.y)*(a[0]-d[0])-(p.y-r.y)*(b[0]-d[0]))/determinant;
 const E=r.x-A*d[0]-C*d[1],F=r.y-B*d[0]-D*d[1];
 const minX=Math.floor(Math.min(...uv.map(v=>v[0]))),minY=Math.floor(Math.min(...uv.map(v=>v[1])));
 const width=Math.ceil(Math.max(...uv.map(v=>v[0])))-minX,height=Math.ceil(Math.max(...uv.map(v=>v[1])))-minY;
 c.save();polygon(c,[p,q,r]);c.clip();c.transform(A,B,C,D,E,F);c.drawImage(img,minX,minY,width,height,minX,minY,width,height);c.restore();
}
function paintedFace(c:CanvasRenderingContext2D,img:HTMLImageElement|undefined,points:Point[],uv:Quad,fill:string,opacity=1){
 polygon(c,points);c.fillStyle=fill;c.fill();
 if(img?.complete&&img.naturalWidth){c.save();c.globalAlpha=opacity;triangle(c,img,uv,points,[0,1,2]);triangle(c,img,uv,points,[0,2,3]);c.restore();}
 polygon(c,points);c.strokeStyle=DIMENSIONAL_STYLE.ink;c.lineWidth=2.8;c.stroke();
}
type Box={w:number;d:number;bottom:number;top:number;cx?:number;cy?:number;skin:typeof faceMap[keyof typeof faceMap];damage?:boolean};
function drawBlock(c:CanvasRenderingContext2D,img:HTMLImageElement|undefined,angle:number,box:Box){
 const {w,d,bottom,top,skin}=box,x=w/2,y=d/2,cx=box.cx||0,cy=box.cy||0,co=Math.cos(angle),si=Math.sin(angle);
 const at=(xx:number,yy:number,z:number):Point=>{const px=cx+xx,py=cy+yy;return{x:px*co-py*si,y:(px*si+py*co)*.46-z};};
 const floor=[at(-x,-y,bottom),at(x,-y,bottom),at(x,y,bottom),at(-x,y,bottom)];
 const roof=[at(-x,-y,top),at(x,-y,top),at(x,y,top),at(-x,y,top)];
 // Each visible wall is a true rectangle with its own texture and outline.
 const near=co>=0?[roof[3],roof[2],floor[2],floor[3]]:[roof[0],roof[1],floor[1],floor[0]];
 const end=si>=0?[roof[1],roof[2],floor[2],floor[1]]:[roof[0],roof[3],floor[3],floor[0]];
 paintedFace(c,img,near,skin.front,'#263745');paintedFace(c,img,end,skin.side,'#364252',.87);paintedFace(c,img,roof,skin.roof,'#899095');
 c.save();c.strokeStyle=DIMENSIONAL_STYLE.edge;c.lineWidth=1.7;c.beginPath();roof.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.stroke();
 for(const xx of [-x+7,x-7]){const a=at(xx,y+1,bottom+7),b=at(xx,y+1,top-7);c.strokeStyle=skin.accent;c.shadowColor=skin.accent;c.shadowBlur=7;c.lineWidth=2.4;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}c.restore();
 if(box.damage){const a=at(-x*.3,y+2,(bottom+top)*.57);c.strokeStyle='#ffc2de';c.lineWidth=2;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x+8,a.y+8);c.lineTo(a.x+3,a.y+16);c.stroke();}
}
export function drawDimensionalStructure(c:CanvasRenderingContext2D,source:HTMLImageElement|undefined,kind:PieceKind,w:number,d:number,hp:number,maxHp:number,angle:number){
 if(hp<=0)return;
 if(kind==='platform'){drawCenterPlatform(c,source,w,d,hp,maxHp,angle);return;}
 if(kind!=='middleBarricade'&&kind!=='frontPost'&&kind!=='sniperTower')return;
 drawContactShadow(c,0,0,w,d*.46,angle);
 if(kind==='sniperTower'){
  // Two aligned blocks, rather than one tall face. Upper armor breaks away at half integrity.
  drawBlock(c,source,angle,{w,d,bottom:0,top:50,skin:faceMap.sniperLower,damage:hp<maxHp*.35});
  if(hp>maxHp/2){drawBlock(c,source,angle,{w:w*.91,d:d*.82,bottom:50,top:105,cy:-d*.07,skin:faceMap.sniperUpper,damage:hp<maxHp*.77});}
  else{const co=Math.cos(angle),si=Math.sin(angle);c.save();c.strokeStyle=DIMENSIONAL_STYLE.magenta;c.shadowColor=DIMENSIONAL_STYLE.magenta;c.shadowBlur=11;c.lineWidth=3;c.beginPath();c.moveTo(-w*.32*co+d*.3*si,-w*.32*si-d*.3*co-50);c.lineTo(w*.32*co+d*.3*si,w*.32*si-d*.3*co-50);c.stroke();c.restore();}
 }else{
  const height=kind==='middleBarricade'?46:68,skin=kind==='middleBarricade'?faceMap.middleBarricade:faceMap.frontPost;
  drawBlock(c,source,angle,{w,d,bottom:0,top:height,skin,damage:hp<maxHp*.6});

 }
}
function drawCenterPlatform(c:CanvasRenderingContext2D,source:HTMLImageElement|undefined,w:number,d:number,hp:number,maxHp:number,angle:number){
 const rx=w*.53,ry=d*.51,cy=-16,sections=12,height=29,co=Math.cos(angle),si=Math.sin(angle);
 const at=(theta:number,z:number):Point=>{const x=Math.cos(theta)*rx,y=cy+Math.sin(theta)*ry;return{x:x*co-y*si,y:x*si+y*co-z};};
 drawContactShadow(c,0,cy,rx*2,ry*2,angle);
 const walls=Array.from({length:sections},(_,i)=>{const a=i*2*Math.PI/sections,b=(i+1)*2*Math.PI/sections;return {a,b,depth:(Math.sin(a)+Math.sin(b))/2};});
 for(const s of walls.filter(q=>q.depth>-.05).sort((a,b)=>a.depth-b.depth)){
  const p=[at(s.a,height),at(s.b,height),at(s.b,0),at(s.a,0)];
  paintedFace(c,source,p,[[1463,1033],[1510,1033],[1510,1115],[1463,1115]],'#293845',.82);
  const lamp=at((s.a+s.b)/2,height*.62);c.save();c.fillStyle=s.a%1<.5?DIMENSIONAL_STYLE.magenta:DIMENSIONAL_STYLE.cyan;c.shadowColor=c.fillStyle;c.shadowBlur=10;c.fillRect(lamp.x-4,lamp.y-3,8,6);c.restore();
 }
 const top=Array.from({length:sections},(_,i)=>at(i*2*Math.PI/sections,height));polygon(c,top);c.fillStyle='#2a3342';c.fill();
 if(source?.complete&&source.naturalWidth){c.save();polygon(c,top);c.clip();c.translate(-cy*si,cy*co-height);c.rotate(angle);c.globalAlpha=.94;c.drawImage(source,1210,795,650,300,-rx,-ry,rx*2,ry*2);c.restore();}
 polygon(c,top);c.strokeStyle=DIMENSIONAL_STYLE.ink;c.lineWidth=5;c.stroke();
 c.save();c.strokeStyle=DIMENSIONAL_STYLE.magenta;c.shadowColor=DIMENSIONAL_STYLE.magenta;c.shadowBlur=14;c.lineWidth=4;c.beginPath();top.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.stroke();c.restore();
 if(hp<maxHp*.6){const a=at(.25,height+1);c.strokeStyle='#f1d5e4';c.lineWidth=2.5;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x-18,a.y-12);c.lineTo(a.x-8,a.y-24);c.stroke();}
}
