/** Cosmetic-only character renderer for Raptor Combat Lab.
 * This vector diagnostic is NOT approved Raptor V3.0 sprite artwork.
 * It never changes movement, hitboxes, damage or simulation input.
 */
export type LabSkin="raptor"|"jade";
export type LabPose="IDLE"|"RUN"|"SPRINT"|"SLIDE"|"BRAKE"|"SHIELD"|"FIRE"|"COVER";
export type VisualActor={x:number;y:number;vx:number;vy:number;slide:number;shield:boolean;coverId:string|null;fireState:number;aim:number};
export function resolveLabPose(p:VisualActor,fire:boolean):LabPose{
 const speed=Math.hypot(p.vx,p.vy);
 if(p.slide>0)return "SLIDE";
 if(p.shield)return "SHIELD";
 if(p.coverId)return "COVER";
 if(fire)return "FIRE";
 if(speed>310)return "SPRINT";
 if(speed>35)return "RUN";
 if(speed>5)return "BRAKE";
 return "IDLE";
}
export function drawLabActor(g:CanvasRenderingContext2D,p:VisualActor,skin:LabSkin,fire:boolean,t:number){
 const pose=resolveLabPose(p,fire),raptor=skin==="raptor",speed=Math.hypot(p.vx,p.vy);
 const a=speed>8?Math.atan2(p.vy,p.vx):p.aim;
 const run=pose==="RUN"||pose==="SPRINT",phase=t*(pose==="SPRINT"?17:11);
 const bob=run?Math.sin(phase)*2:0,lean=pose==="SPRINT"?.5:pose==="SLIDE"?.75:0;
 g.save();g.rotate(a);g.translate(0,bob);
 // Consistent cosmetic anchor: actor's world center at (0,0).
 g.fillStyle="#0009";g.beginPath();g.ellipse(0,14,29,9,0,0,Math.PI*2);g.fill();
 if(raptor){
  // Extended, elevated striped tail remains visible during running.
  g.strokeStyle="#66794b";g.lineWidth=11;g.lineCap="round";g.beginPath();g.moveTo(-13,3);g.quadraticCurveTo(-39,-7-lean*12,-59,-25-lean*16+Math.sin(phase*.3)*3);g.stroke();
  g.strokeStyle="#25372b";g.lineWidth=3;for(let k=0;k<4;k++){const x=-23-k*9;g.beginPath();g.moveTo(x,-3-k*4);g.lineTo(x+4,4-k*4);g.stroke()}
 }
 g.rotate(lean*.22);
 // Hind legs and stance motion; deliberately schematic, not sprite replacements.
 const leg=run?Math.sin(phase)*9:pose==="SLIDE"?12:0;
 g.strokeStyle=raptor?"#6e8250":"#c9d5e5";g.lineWidth=9;g.lineCap="round";
 for(const side of [-1,1]){g.beginPath();g.moveTo(-6,side*8);g.lineTo(-14+leg*side,side*12+5);g.lineTo(-20+leg*side,side*15+11);g.stroke()}
 g.fillStyle=raptor?"#758c52":"#e2e7f0";g.strokeStyle=raptor?"#ed5da7":"#6cecf2";g.lineWidth=2.5;
 g.beginPath();g.ellipse(0,0,18,14,0,0,Math.PI*2);g.fill();g.stroke();
 g.fillStyle=raptor?"#d5d8d7":"#e85dba";g.fillRect(-12,-11,24,7);
 if(raptor){
  g.fillStyle="#91a85d";g.beginPath();g.moveTo(10,-9);g.lineTo(27,-7);g.lineTo(31,1);g.lineTo(14,5);g.closePath();g.fill();
  g.fillStyle="#fa395b";g.fillRect(23,-7,5,5);
 }else{g.fillStyle="#1b2738";g.fillRect(13,-7,12,7)}
 // Same weapon socket / range for either skin.
 g.strokeStyle="#17202b";g.lineWidth=7;g.beginPath();g.moveTo(10,1);g.lineTo(35,1);g.stroke();
 if(fire){g.fillStyle="#ffd58c";g.beginPath();g.moveTo(36,0);g.lineTo(49,-7);g.lineTo(44,0);g.lineTo(49,7);g.closePath();g.fill()}
 if(p.shield){g.strokeStyle="#6feefa";g.lineWidth=4;g.beginPath();g.arc(0,0,34,-1.3,1.3);g.stroke()}
 g.restore();
 return pose;
}
