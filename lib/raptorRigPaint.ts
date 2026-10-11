import type {RigPose} from "./raptorHybridRig";
/** Articulated Raptor rig visualization. Painted diagnostic parts, NOT approved cutout sprites.
 * Draws independent head, weapon, digitigrade legs, backpack and 6 tail segments.
 * Coordinates are in rig-local space. Never changes gameplay state.
 */
export function paintRaptorRig(g:CanvasRenderingContext2D,p:RigPose,showJoints:boolean){
 const b=p.bones;
 const line=(x:number,y:number,X:number,Y:number,w:number,c:string)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap="round";g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.stroke()};
 const ellipse=(x:number,y:number,rx:number,ry:number,color:string,rot=0)=>{g.save();g.translate(x,y);g.rotate(rot);g.fillStyle=color;g.beginPath();g.ellipse(0,0,rx,ry,0,0,Math.PI*2);g.fill();g.restore()};
 const joint=(x:number,y:number)=>{ellipse(x,y,3.5,3.5,"#121b24");ellipse(x,y,1.8,1.8,"#f35d82")};
 // Far leg behind torso, near leg in front; segment locations come from 2-bone IK.
 const leg=(side:"left"|"right")=>{
  const h=b[(side+"Thigh") as keyof typeof b],k=b[(side+"Shin") as keyof typeof b],f=b[(side+"Foot") as keyof typeof b];
  const shade=side==="left"?"#667947":"#9eaa63";
  line(h.x,h.y,k.x,k.y,14,"#1d2525");line(h.x,h.y,k.x,k.y,11,shade);
  line(k.x,k.y,f.x,f.y,9,"#17242e");line(k.x,k.y,f.x,f.y,6,"#6e7e87");
  line(k.x+1,k.y+4,f.x+1,f.y-2,2,"#f25765");
  ellipse(k.x,k.y,6,6,"#c2c7d0");ellipse(k.x,k.y,3,3,"#27333c");
  g.save();g.translate(f.x,f.y);g.rotate(f.angle);ellipse(4,1,12,4,"#c8a36b");
  for(let i=0;i<3;i++){line(8+i*2,1+i*2,16+i*2,4+i*2,2.5,"#161e23")}g.restore();
  if(showJoints){joint(h.x,h.y);joint(k.x,k.y);joint(f.x,f.y)}
 };
 // The tail is a chain: each section follows its own phased vertical offset.
 for(let i=5;i>=0;i--){
  const q=b[("tail"+i) as keyof typeof b],prev=i===0?{x:-12,y:-12}:b[("tail"+(i-1)) as keyof typeof b];
  line(prev.x,prev.y,q.x-9,q.y-1,Math.max(4,14-i*1.65),"#24302a");
  line(prev.x,prev.y,q.x-9,q.y-1,Math.max(3,11-i*1.45),"#8b9950");
  if(i%2===0)line(q.x-5,q.y-4,q.x-11,q.y+4,3,"#30342a");
  if(showJoints)joint(q.x,q.y);
 }
 leg("left");
 ellipse(-2,-12,26,17,"#172329",-.10);
 ellipse(-2,-12,24,15,"#849458",-.10);
 for(let i=0;i<4;i++)line(-21+i*9,-17,-13+i*9,-4,4,"#333b30");
 // Armor and battery carapace, shoulder ring.
 ellipse(-1,-24,19,9,"#d3d5d6",-.08);ellipse(0,-29,13,5,"#414852");
 for(let i=0;i<3;i++)ellipse(-12+i*10,-28,2,2,"#ff5168");
 ellipse(12,-19,8,9,"#252b35");ellipse(12,-19,5,6,"#d0cbd0");
 leg("right");
 // Neck and head independent of torso motion.
 const h=b.head;
 line(16,-18,h.x-5,h.y+4,10,"#7b8d54");
 g.save();g.translate(h.x,h.y);g.rotate(h.angle);
 ellipse(1,0,16,10,"#839453",-.08);ellipse(8,5,11,3.5,"#d5b27d",.14);
 g.fillStyle="#111820";g.beginPath();g.moveTo(3,7);g.lineTo(17,6);g.lineTo(11,11);g.closePath();g.fill();
 for(let i=0;i<4;i++)line(5+i*3,7,6+i*3,10,1.5,"#f2e9d5");
 ellipse(3,-7,8,4,"#292c33");ellipse(9,-3,4.3,4.3,"#ff4b63");ellipse(9,-3,1.7,1.7,"#ffe8b7");
 g.restore();
 // Separate arm segments and gun, stabilized against run bounce.
 const arm=b.rightUpperArm,w=b.weapon;
 line(13,-16,23,-8+Math.sin(p.phase*Math.PI/6)*1.5,8,"#849452");
 ellipse(22,-9,5,5,"#b6bbc0");
 g.save();g.translate(w.x,w.y);g.rotate(w.angle);
 ellipse(3,1,24,5,"#161d27");g.fillStyle="#858b96";g.fillRect(-7,-4,27,5);
 g.fillStyle="#ef5368";g.fillRect(4,-3,9,2);g.fillStyle="#121820";g.fillRect(20,-2,13,6);
 g.fillStyle="#a9aeb7";g.fillRect(24,-1,9,2);g.restore();
 if(showJoints){joint(0,0);joint(arm.x,arm.y);joint(w.x,w.y);joint(h.x,h.y)}
}
