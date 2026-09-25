type Point={x:number;y:number};
import {drawContactShadow} from './contact-shadow';
type Crop=readonly [number,number,number,number];
type Face={points:Point[];fill:string;rect:Crop;image:HTMLImageElement|undefined;alpha?:number};
// Crops name actual parts of the isolated left bridge card (source image is 3072×2048).
// They texture individual faces; the complete card is never pasted over the model.
const source={rearDeck:[650,634,187,91],rearColumn:[614,730,96,174],spanTop:[822,712,155,100],spanSide:[812,774,175,91],cyanPanel:[881,774,95,46],nearDeck:[969,811,123,96],nearColumn:[1051,880,126,142],pinkPanel:[729,745,99,109]} as const;
const concrete={wall:[65,104,397,208],end:[106,905,38,165]} as const;
const material={blue:[0,0,610,350],blueEnd:[310,20,190,350],purple:[630,626,610,430],roof:[14,34,468,76],cyan:[78,128,85,173]} as const;
const trace=(c:CanvasRenderingContext2D,p:Point[])=>{c.beginPath();p.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));c.closePath();};
function face(c:CanvasRenderingContext2D,f:Face){
 trace(c,f.points);c.fillStyle=f.fill;c.fill();const img=f.image;
 if(img?.complete&&img.naturalWidth){const [sx,sy,sw,sh]=f.rect,[tl,tr,,bl]=f.points;c.save();trace(c,f.points);c.clip();c.transform((tr.x-tl.x)/sw,(tr.y-tl.y)/sw,(bl.x-tl.x)/sh,(bl.y-tl.y)/sh,tl.x,tl.y);c.globalAlpha=f.alpha??.87;c.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);c.restore();}
 trace(c,f.points);c.strokeStyle='#050912';c.lineWidth=2.8;c.stroke();
}
export const BRIDGE_SUPPORTS=[-116,116] as const;
export function drawBridgeModel(c:CanvasRenderingContext2D,concreteAtlas:HTMLImageElement|undefined,containerAtlas:HTMLImageElement|undefined,hp:number,theta:number,part:'all'|'supports'|'deck'|'supportLeft'|'supportRight'='all',sourceImage?:HTMLImageElement){
 if(hp<=0)return;
 const cs=Math.cos(theta),sn=Math.sin(theta),project=(x:number,y:number,z:number):Point=>({x:x*cs-y*sn,y:x*sn+y*cs-z});
 type BoxArt={top:Crop;long:Crop;end:Crop;accent?:Crop;sourceAccent?:Crop;purple?:boolean};
 const box=(x:number,y:number,w:number,d:number,bottom:number,top:number,art:BoxArt,tint='#28394e')=>{
  const lo=[project(x-w/2,y-d/2,bottom),project(x+w/2,y-d/2,bottom),project(x+w/2,y+d/2,bottom),project(x-w/2,y+d/2,bottom)];
  const hi=[project(x-w/2,y-d/2,top),project(x+w/2,y-d/2,top),project(x+w/2,y+d/2,top),project(x-w/2,y+d/2,top)];
  const walls:Face[]=[
   {points:[hi[0],hi[1],lo[1],lo[0]],fill:tint,rect:art.purple?material.purple:material.blue,image:containerAtlas},
   {points:[hi[1],hi[2],lo[2],lo[1]],fill:'#223149',rect:material.blueEnd,image:containerAtlas},
   {points:[hi[3],hi[2],lo[2],lo[3]],fill:tint,rect:art.purple?material.purple:material.blue,image:containerAtlas},
   {points:[hi[0],hi[3],lo[3],lo[0]],fill:'#1a2938',rect:material.blueEnd,image:containerAtlas}];
  walls.sort((a,b)=>(a.points[2].y+a.points[3].y)-(b.points[2].y+b.points[3].y));walls.forEach(f=>face(c,f));
  face(c,{points:hi,fill:'#465069',rect:material.roof,image:containerAtlas});
  if(art.sourceAccent&&sourceImage?.complete&&sourceImage.naturalWidth){const a=hi[3],b=hi[2],d=lo[3];const pt=(u:number,v:number)=>({x:a.x+(b.x-a.x)*u+(d.x-a.x)*v,y:a.y+(b.y-a.y)*u+(d.y-a.y)*v});face(c,{points:[pt(.27,.12),pt(.75,.12),pt(.75,.58),pt(.27,.58)],fill:'#0d1d30',rect:art.sourceAccent,image:sourceImage,alpha:.94});}

 };
 if(part!=='deck'){
  for(const x of BRIDGE_SUPPORTS.filter(x=>part==='supportLeft'?x<0:part==='supportRight'?x>0:true)){const p=project(x,12,0);drawContactShadow(c,p.x,p.y,66,78,theta);}
  // The two square column feet are the only floor collision. The opening is clear.
  if(part!=='supportRight')box(-116,12,66,78,0,75,{top:material.roof,long:material.blue,end:material.blueEnd,sourceAccent:source.pinkPanel});
  if(part!=='supportLeft')box(116,12,66,78,0,75,{top:material.roof,long:material.blue,end:material.blueEnd,sourceAccent:source.nearColumn});
 }
 if(part==='all'||part==='deck'){
  // The rear rail sits behind the deck; the near rail is drawn last.
  const rail=(side:number)=>{c.save();const color=side<0?'#6eeaff':'#fa5aa8';const a=project(-141,side,101),b=project(141,side,101);c.strokeStyle=color;c.shadowColor=color;c.shadowBlur=5;c.lineWidth=1.8;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.shadowBlur=0;c.strokeStyle='#141b2c';c.lineWidth=2;for(const x of [-132,-58,18,89,130]){const p=project(x,side,100),q=project(x,side,93);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}c.restore();};
  rail(-38);
  box(-113,-10,68,66,75,88,{top:material.roof,long:material.blue,end:material.blueEnd,purple:true});
  box(-61,-10,90,56,75,94,{top:material.roof,long:material.blue,end:material.blueEnd,purple:true,sourceAccent:source.cyanPanel});
  box(25,-10,82,56,75,94,{top:material.roof,long:material.blue,end:material.blueEnd,sourceAccent:source.cyanPanel});
  box(100,-10,68,62,75,91,{top:material.roof,long:material.blue,end:material.blueEnd,sourceAccent:source.nearDeck});
  // Joint collars, inset seams and underdeck braces give the span its source silhouette.
  for(const x of [-108,-38,43,110])box(x,-10,8,59,67,78,{top:material.roof,long:material.blue,end:material.blueEnd},'#1a293b');
  for(const x of [-122,122]){box(x,-9,11,68,76,89,{top:material.roof,long:material.blue,end:material.blueEnd},'#263a50');}
  // Recessed deck lights are separate fitted plates, as in the source card.
  const deckPlate=(x:number,w:number,color:string,crop:Crop)=>{const y=-10,z=95,d=29;const corners=[project(x-w/2,y-d/2,z),project(x+w/2,y-d/2,z),project(x+w/2,y+d/2,z),project(x-w/2,y+d/2,z)];c.save();c.shadowColor=color;c.shadowBlur=9;face(c,{points:corners,fill:color,rect:crop,image:sourceImage,alpha:.82});c.restore();};
  deckPlate(-41,43,'#216aff',source.cyanPanel);
  deckPlate(35,34,'#d83165',source.nearDeck);
  // Low perimeter trim frames the span without hiding its top panels.
  box(0,-39,285,5,94,98,{top:material.roof,long:material.blue,end:material.blueEnd},'#18283a');
  box(0,21,285,5,94,98,{top:material.roof,long:material.blue,end:material.blueEnd},'#18283a');
  rail(26);
 }
 if(hp<12){const a=project(-65,20,76);c.save();c.strokeStyle='#f789b4';c.lineWidth=2.3;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x+18,a.y+12);c.lineTo(a.x+8,a.y+25);c.stroke();c.restore();}
 // Approved cover atlas remains a material source for exposed concrete during damage.
 if(hp<6&&concreteAtlas?.complete&&concreteAtlas.naturalWidth){const p=project(110,32,35);face(c,{points:[p,{x:p.x+22,y:p.y-7},{x:p.x+21,y:p.y+7},{x:p.x+2,y:p.y+13}],fill:'#263848',rect:concrete.wall,image:concreteAtlas,alpha:.7});}
}
