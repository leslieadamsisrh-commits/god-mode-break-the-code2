// All times are simulation seconds so replay stays in step with the fight.
export const SHOT_FLASH_SECONDS = .073;
export const SHOT_SMOKE_SECONDS = .43;
export const SHOT_CONTACT_SECONDS = .32;
export const SHOT_DAMAGE_SECONDS = .68;

const unit = (n:number) => Math.max(0,Math.min(1,n));

export function shotgunKick(age:number, raptor:boolean) {
 const peak=raptor?.052:.036, end=raptor?.25:.204;
 if (age<=0||age>=end) return 0;
 return age<peak ? unit(age/peak) : Math.pow(unit((end-age)/(end-peak)),2);
}

export function poseEase(age:number,duration:number) {
 return 1-Math.pow(unit(age/duration),2)*(3-2*unit(age/duration));
}

const INK="#20172d";

function inkShape(g:CanvasRenderingContext2D,fill:string,width=2){
 g.closePath();
 g.fillStyle=fill;
 g.fill();
 g.strokeStyle=INK;
 g.lineJoin="round";
 g.lineWidth=width;
 g.stroke();
}

export function shootFlash(g:CanvasRenderingContext2D,life:number){
 const k=unit(life/SHOT_FLASH_SECONDS);
 g.globalAlpha=unit(k*2);
 g.scale(.8+.2*k,.82+.18*k);
 g.beginPath();
 g.moveTo(0,0);g.lineTo(8,-5);g.lineTo(9,-11);g.lineTo(17,-6);
 g.lineTo(33,-10);g.lineTo(25,-2);g.lineTo(36,1);g.lineTo(25,5);
 g.lineTo(31,12);g.lineTo(17,7);g.lineTo(9,10);g.lineTo(8,5);
 inkShape(g,"#ffad49");
 g.beginPath();
 g.moveTo(3,0);g.lineTo(13,-3);g.lineTo(24,1);g.lineTo(13,4);
 g.closePath();g.fillStyle="#ffffd2";g.fill();
}

// A held cel silhouette with three lobes and one hard shadow.
function puff(g:CanvasRenderingContext2D,x:number,y:number,size:number,fill:string,shadow:string){
 g.save();g.translate(x,y);g.scale(size,size);
 g.beginPath();
 g.moveTo(-9,2);
 g.bezierCurveTo(-13,-1,-10,-7,-5,-6);
 g.bezierCurveTo(-5,-13,6,-13,7,-6);
 g.bezierCurveTo(14,-7,16,1,10,4);
 g.bezierCurveTo(7,9,1,7,-2,6);
 g.bezierCurveTo(-5,8,-10,6,-9,2);
 inkShape(g,fill,2);
 g.beginPath();g.moveTo(-8,1);g.quadraticCurveTo(-4,5,0,2);
 g.quadraticCurveTo(6,7,11,1);g.quadraticCurveTo(9,8,1,6);
 g.quadraticCurveTo(-9,8,-8,1);g.fillStyle=shadow;g.fill();
 g.restore();
}

export function shootSmoke(g:CanvasRenderingContext2D,life:number,angle:number){
 const age=1-unit(life/SHOT_SMOKE_SECONDS);
 const cel=Math.floor(age*8)/8;
 const drift=1-Math.exp(-cel*6);
 for(let n=2;n>=0;n--){
  const distance=(n===0?5:8+8*n)*drift;
  const x=Math.cos(angle)*distance+Math.sin(angle)*n*1.5;
  const y=Math.sin(angle)*distance-cel*(11+n*12);
  g.globalAlpha=unit(1.2-age*1.36)*unit(1.2-n*.17);
  puff(g,x,y,.33+cel*(.52+n*.12),n===2?"#eee2e8":"#e8f4f5","#9d8cae");
 }
}

export function drawShotContact(g:CanvasRenderingContext2D,kind:string,life:number,material?:string,angle=0){
 const duration=kind==="hit"?SHOT_DAMAGE_SECONDS:SHOT_CONTACT_SECONDS;
 const age=1-unit(life/duration);
 if(kind==="hit"&&age>.38)return;
 g.globalAlpha=unit(life/.15)*(kind==="hit"?unit(1-age*2.5):1);
 if(kind==="muzzle"){
  g.lineCap="round";
  for(const width of [5,2.4]){
   g.strokeStyle=width===5?INK:"#ffcf91";g.lineWidth=width;
   g.beginPath();g.moveTo(-4,-4);g.lineTo(4,4);g.moveTo(4,-4);g.lineTo(-4,4);g.stroke();
  }
  return;
 }
 if(kind==="shield"){
  g.rotate(angle);
  for(const rim of [0,6]){
   const spread=7+age*13+rim;
   g.beginPath();
   g.moveTo(-4-rim,-spread);g.quadraticCurveTo(14+age*9+rim,0,-4-rim,spread);
   g.strokeStyle=INK;g.lineWidth=5;g.stroke();
   g.strokeStyle=rim?"#53c9f5":"#c6ffff";g.lineWidth=2.6;g.stroke();
  }
  return;
 }
 if(kind==="cover"&&material==="stone"){
  puff(g,0,-1-age*7,.56+age*.72,"#e5c6a4","#9f7d82");
  for(let n=0;n<3;n++){
   const a=angle+(n-1)*.65,travel=6+age*(12+n*4);
   g.save();g.translate(Math.cos(a)*travel,Math.sin(a)*travel+age*age*7);g.rotate(a+age);
   g.beginPath();g.moveTo(-3,-2);g.lineTo(1,-4);g.lineTo(4,1);g.lineTo(-1,3);
   inkShape(g,n%2?"#d29366":"#f9dcc3",1.3);g.restore();
  }
  return;
 }
 // The silhouette alone separates the round stone puff and shield arc
 // from the sharp star used for steel and the smaller body-hit burst.
 const hit=kind==="hit",outer=hit?11+age*9:12+age*11;
 g.rotate(angle);
 g.beginPath();
 for(let n=0;n<10;n++){
  const a=n*Math.PI/5,r=n%2?outer*.35:outer*(n===0?1.3:1);
  const x=Math.cos(a)*r,y=Math.sin(a)*r;
  if(n===0)g.moveTo(x,y);else g.lineTo(x,y);
 }
 inkShape(g,hit?"#ff8fbb":"#ffd056");
 g.beginPath();g.arc(0,0,3,0,Math.PI*2);g.fillStyle="#fff4cc";g.fill();
}

export type ShotCaption={text:string;color:string;size:number;fade:number;damage:boolean};

export function shotCaption(type:string,life:number,material?:string,damage?:number):ShotCaption|undefined{
 if(type==="shot-result-hit"&&damage!==undefined){
  return {text:Number(damage.toFixed(2)).toString(),color:"#fff2ee",size:19,fade:unit(life/.19),damage:true};
 }
 const cue=type==="shotgun-smoke"?["BLAM!","#ffdb73",20]:
  type==="shot-result-muzzle"?["KLIK","#ffd3a2",15]:
  type==="shot-result-shield"?["VWOOM","#bcf9ff",17]:
  type==="shot-result-cover"?(material==="stone"?["KRAK!","#f5c8a5",17]:["KLANG!","#ffe391",17]):undefined;
 if(!cue)return;
 const [text,color,size]=cue as [string,string,number];
 const visible=type==="shotgun-smoke"?life-.12:life;
 if(visible<=0)return;
 return {text,color,size,fade:unit(visible/.12),damage:false};
}

export function drawShotCaption(g:CanvasRenderingContext2D,cue:ShotCaption,x:number,y:number){
 g.save();g.translate(x,y);
 if(!cue.damage)g.rotate(-.09);
 g.globalAlpha=cue.fade;
 g.font=`900 ${cue.damage?"":"italic "}${cue.size}px system-ui, sans-serif`;
 g.textAlign="center";g.textBaseline="middle";
 g.lineJoin="round";g.lineWidth=3.6;
 g.strokeStyle=INK;g.strokeText(cue.text,0,0);
 g.fillStyle=cue.color;g.fillText(cue.text,0,0);
 g.restore();
}
