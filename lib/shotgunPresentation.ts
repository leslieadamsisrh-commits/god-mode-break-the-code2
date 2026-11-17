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

export function shootFlash(g:CanvasRenderingContext2D, life:number) {
 const k=unit(life/SHOT_FLASH_SECONDS);
 g.globalAlpha=k;
 g.fillStyle="#ff9e40";
 g.beginPath();g.moveTo(0,0);g.lineTo(7,-7);g.lineTo(17,-3);
 g.lineTo(26*k+8,-6);g.lineTo(20*k+9,1);g.lineTo(22*k+9,6);
 g.lineTo(10,4);g.closePath();g.fill();
 g.fillStyle="#fff2c9";
 g.beginPath();g.moveTo(0,-1);g.lineTo(6,-4);g.lineTo(21*k+7,0);
 g.lineTo(8,3);g.closePath();g.fill();
}

export function shootSmoke(g:CanvasRenderingContext2D,life:number,angle:number){
 const age=1-unit(life/SHOT_SMOKE_SECONDS),burst=1-Math.exp(-age*7);
 for(let n=0;n<4;n++){
  const drift=burst*(9+n*6),curl=Math.sin(age*5+n*1.45)*(1+4*age);
  const x=Math.cos(angle)*drift-Math.sin(angle)*curl;
  const y=Math.sin(angle)*drift+Math.cos(angle)*curl-age*(10+n*3);
  g.globalAlpha=unit(age*17)*Math.pow(1-age,1.5)*(.29-n*.045);
  g.fillStyle=n%2?"#b9b7b0":"#dedbd0";
  g.beginPath();g.ellipse(x,y,2.5+age*(7+n*2),2+age*(5+n),age,0,Math.PI*2);g.fill();
 }
}

export function drawShotContact(g:CanvasRenderingContext2D,kind:string,life:number,material?:string,angle=0,damage=0){
 const duration=kind==="hit"?SHOT_DAMAGE_SECONDS:SHOT_CONTACT_SECONDS;
 const age=1-unit(life/duration);
 g.globalAlpha=unit(life/(kind==="hit"?.23:.17));
 g.lineWidth=1.7;
 if(kind==="muzzle"){
  g.strokeStyle="#ffe19d";g.beginPath();g.moveTo(-4,-4);g.lineTo(4,4);g.moveTo(4,-4);g.lineTo(-4,4);g.stroke();
 }else if(kind==="shield"){
  g.strokeStyle="#6defff";g.beginPath();g.ellipse(0,0,6+age*15,4+age*10,angle,0,Math.PI*2);g.stroke();
  g.globalAlpha*=.5;g.beginPath();g.ellipse(0,0,3+age*10,2+age*7,angle,0,Math.PI*2);g.stroke();
 }else if(kind==="cover"){
  const stone=material==="stone";
  for(let n=0;n<7;n++){
   const a=angle+(n-3)*.37,travel=3+age*(8+n%3*5),x=Math.cos(a)*travel,y=Math.sin(a)*travel+age*age*6;
   if(stone){
    g.fillStyle=n%2?"#c9b8a3":"#eee1cf";g.fillRect(x,y,2+n%3,2);
   }else{
    g.strokeStyle=n%2?"#ffb052":"#fff2c4";g.beginPath();g.moveTo(x*.5,y*.5);g.lineTo(x,y);g.stroke();
   }
  }
  if(stone){
   g.globalAlpha*=.22;g.fillStyle="#b5a699";g.beginPath();g.ellipse(0,-2-age*6,5+age*12,4+age*7,0,0,Math.PI*2);g.fill();
  }
 }else if(kind==="hit"){
  if(age<.44){
   g.strokeStyle="#ff92a6";g.beginPath();
   for(const x of [-1,1])for(const y of [-1,1]){
    g.moveTo(x*9,y*4);g.lineTo(x*9,y*9);g.lineTo(x*4,y*9);
   }
   g.stroke();
  }
  g.font="bold 15px monospace";g.textAlign="center";g.lineJoin="round";g.lineWidth=3;
  const y=-22-age*12, label=Number(damage.toFixed(2)).toString();
  g.strokeStyle="#130d19";g.strokeText(label,0,y);g.fillStyle="#fff0eb";g.fillText(label,0,y);
 }
}
