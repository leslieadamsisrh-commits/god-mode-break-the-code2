import {PSYCHIC_POWERS, psychicField} from './game';

// A reconnect with a held selector is not a fresh press. Keep levels so the
// existing authoritative edge detector and network input queue remain in charge.
export class SelectorGate22 {
 private device=''; private blocked=new Set<number>();
 sample(pad:{id:string;index:number;buttons:readonly {pressed:boolean;value:number}[]}|null){
  if(!pad){this.device='';this.blocked.clear();return [false,false,false,false];}
  const device=pad.index+':'+pad.id;
  const down=[12,13,14,15].map(n=>!!(pad.buttons[n]?.pressed||pad.buttons[n]?.value>.25));
  if(device!==this.device){this.device=device;this.blocked=new Set(down.flatMap((v,n)=>v?[n]:[]));}
  return down.map((v,n)=>{if(!v)this.blocked.delete(n);return v&&!this.blocked.has(n);});
 }
}

export function selectionCards22(p:any,s:any){
 const field=psychicField(p),power=p.selectedPower||0;
 const cost=power===0?'30 BAT':power===1?`${s.config.gripEnergy}/PIECE + ${s.config.holdEnergy}/SEC`:power===2?'22 BAT':power===3?'0 BAT':power===4?`${8+.2*(p.timePellets||0)} BAT/SEC`:`${s.lab21?.repulse?.cost??16} BAT`;
 return [
  {key:'weapon',label:'UP · WEAPON',name:'SHOTGUN',detail:'RT FIRE',value:p.selectedWeapon||0},
  {key:'power',label:'DOWN · POWER',name:power===5?'REPULSE · LAB':PSYCHIC_POWERS[power]||PSYCHIC_POWERS[0],detail:'X · '+cost,value:power},
  {key:'field',label:'LEFT · AREA',name:['SMALL','MEDIUM','LARGE'][field.level],detail:`${field.radius}u REACH`,value:field.level},
  {key:'shape',label:'RIGHT · COVER',name:p.coverShape===1?'COMPACT':'WIDE',detail:'RB · 30 BAT',value:p.coverShape||0},
 ];
}

const selectionVisual22=new Map<string,{values:number[];changed:number[];time:number}>();
export function drawSelection22(g:CanvasRenderingContext2D,p:any,s:any,slot:number){
 const cards=selectionCards22(p,s),key=s.createdAt+'/'+s.round+'/'+slot;
 let visual=selectionVisual22.get(key);
 if(!visual||s.time<visual.time){selectionVisual22.clear();visual={values:cards.map(c=>c.value),changed:cards.map(()=>-9),time:s.time};selectionVisual22.set(key,visual);}
 visual.time=s.time;
 g.save();g.textAlign='left';
 cards.forEach((c,n)=>{
  if(c.value!==visual!.values[n]){visual!.values[n]=c.value;visual!.changed[n]=s.time;}
  const active=s.time-visual!.changed[n]<.8,x=112+n*196,y=554;
  g.fillStyle='#091521ed';g.fillRect(x,y,190,57);g.strokeStyle=active?'#fff0b1':n===1?'#d56baf':'#5796a6';g.lineWidth=active?2:1;g.strokeRect(x,y,190,57);
  g.fillStyle=active?'#fff0b1':'#91b9c7';g.font='9px monospace';g.fillText(c.label,x+8,y+12);
  g.fillStyle=n===1?'#f0b0db':'#dbfaff';g.font='bold 12px monospace';g.fillText(c.name,x+8,y+29,173);
  g.fillStyle='#aac4d0';g.font='9px monospace';g.fillText(c.detail,x+8,y+45,173);
  // Small vector silhouettes reuse the existing cyan/magenta HUD language.
  g.strokeStyle='#9deaf0';g.lineWidth=1.4;
  if(n===0){g.strokeRect(x+151,y+5,27,3);g.strokeRect(x+150,y+8,8,4);}
  if(n===1){g.beginPath();g.arc(x+174,y+9,4,0,Math.PI*2);g.stroke();}
  if(n===2){g.beginPath();g.ellipse(x+173,y+9,4+c.value*2,3,0,0,Math.PI*2);g.stroke();}
  if(n===3)g.strokeRect(x+158,y+5,c.value===1?13:22,7);
 });g.restore();
}

// Camera target only; projection, movement, hitboxes and competitive rules stay
// authoritative. Nearby opponents influence framing without pulling in distant ones.
export function encounterCamera22(p:any,enemy:any,close:boolean){
 const separation=enemy?Math.hypot(enemy.x-p.x,enemy.y-p.y):Infinity;
 const near=Math.max(0,Math.min(1,(300-separation)/200));
 const zoom=close?2.65+near*.12:1.95+near*.32;
 const angle=p.gunFacing??p.aim??0;
 const dx=Math.cos(angle)*22+Math.max(-18,Math.min(18,(p.vx||0)*.045));
 const dy=Math.sin(angle)*16+Math.max(-12,Math.min(12,(p.vy||0)*.035));
 const weight=enemy&&separation<300?.13:0;
 const half=500/zoom;
 return {zoom,x:Math.max(half,Math.min(1000-half,p.x+dx+(enemy?enemy.x-p.x:0)*weight)),y:Math.max(135,Math.min(485,p.y+dy+(enemy?enemy.y-p.y:0)*weight))};
}
