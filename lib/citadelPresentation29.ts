import {relativeWorld46,vertical46,withWorld46} from './bayBridgePresentation';
// Nonplayable broadcast architecture, wholly north of y118. No gameplay volumes.
export function drawCitadel29(g:CanvasRenderingContext2D,images:Map<string,HTMLImageElement>){
 const anchor={x:1100,y:80};
 withWorld46(g,anchor.x,anchor.y,()=>{
  const p=(x:number,z:number)=>{const r=relativeWorld46(anchor.x,anchor.y,x-anchor.x,0),h=vertical46(anchor.x,anchor.y,z);return{x:anchor.x+r.x+h.x,y:anchor.y+r.y+h.y};};
  const panel=(x:number,z:number,w:number,h:number,fill:string)=>{const a=p(x,z+h),b=p(x+w,z+h),c=p(x+w,z),d=p(x,z);g.beginPath();g.moveTo(a.x,a.y);for(const v of [b,c,d])g.lineTo(v.x,v.y);g.closePath();g.fillStyle=fill;g.fill();g.strokeStyle='#0b1422';g.lineWidth=3;g.stroke();};
  g.save();
  // Gallery bays share the same construction line. Dark bays remain background.
  panel(103,0,1994,100,'#172635');
  for(let x=130;x<2050;x+=160){panel(x,18,138,64,'#243a4c');panel(x+8,30,122,38,'#0b1829');panel(x+12,21,114,3,'#b1804f');}
  panel(865,70,470,230,'#172333');panel(882,88,436,196,'#394459');panel(896,100,408,172,'#080f1b');
  const im=images.get('baron29'),a=p(902,266),b=p(1298,266),d=p(902,106);
  if(im?.complete&&im.naturalWidth){g.save();g.transform((b.x-a.x)/im.naturalWidth,(b.y-a.y)/im.naturalWidth,(d.x-a.x)/im.naturalHeight,(d.y-a.y)/im.naturalHeight,a.x,a.y);g.globalAlpha=.72;g.drawImage(im,0,0);g.restore();}
  // Structural beacon and sign, outside the match boundary.
  for(const x of [841,1335]){panel(x,0,24,325,'#28394a');panel(x+8,145,8,130,'#c38e56');}
  panel(1000,292,200,42,'#182637');
  const title=p(1100,308);g.fillStyle='#eeb97c';g.font='bold 21px monospace';g.textAlign='center';g.fillText('TOWER 33',title.x,title.y);
  const label=p(1100,78);g.fillStyle='#c3cbd2';g.font='bold 10px monospace';g.fillText("THE BARON’S WAR GAMES",label.x,label.y);
  g.restore();
 });
}
