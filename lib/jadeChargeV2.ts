export const JADE_PALETTES = {
 Standard: {hue:0, near:"#64f5ff", far:"#ff49cb", hot:"#fff1fa"},
 Fire: {hue:66, near:"#ffb04a", far:"#ff482c", hot:"#fff2c0"},
 Ice: {hue:250, near:"#afffff", far:"#398fff", hot:"#f1ffff"},
 Nature: {hue:167, near:"#cdff82", far:"#2bf585", hot:"#efffbd"},
 Light: {hue:102, near:"#fffbcf", far:"#ffc746", hot:"#ffffff"},
 Dark: {hue:315, near:"#bea4ff", far:"#8638ff", hot:"#efe3ff"},
};
export type JadePalette = keyof typeof JADE_PALETTES;
export type Charge = {charging?:boolean;chargeAge?:number;godCharge?:number;powerFlash?:number;powerReturn?:number;powerReleaseAge?:number};
export type ChargeArt = {flame:HTMLImageElement;impact:HTMLImageElement};

export const JADE_CHARGE_BEATS = [
 "Ready","Focus","Kneel","Hands Down","Energy Spark","Ground Crack","Energy Rise","Rocks Lift",
 "Aura Build","DNA Helix","Full Charge","Levitate","Peak Power","Hold","Release","End Idle",
] as const;

export function jadeChargeBeat(actor:Charge,duration:number){
 if(!actor.charging)return actor.powerFlash||actor.powerReturn?15:16;
 const age=actor.chargeAge??0;
 if(age<.35)return Math.min(4,1+Math.floor(age/.085));
 const q=actor.godCharge??0;
 const thresholds=[.055,.13,.23,.36,.52,.68,.82,.94,1];
 const beat=thresholds.findIndex(value=>q<value);
 return beat>=0?5+beat:age<duration+.54?13:14;
}

function cel(g:CanvasRenderingContext2D,atlas:HTMLImageElement,index:number,x:number,y:number,w:number,h:number){
 const cw=atlas.naturalWidth/3,ch=atlas.naturalHeight/2;
 g.drawImage(atlas,index%3*cw,Math.floor(index/3)*ch,cw,ch,x,y,w,h);
}

export function drawJadeCrater(g:CanvasRenderingContext2D,atlas:HTMLImageElement,x:number,y:number,w:number,h:number,hot:number,crater:boolean,palette:JadePalette){
 g.save();
 g.filter='hue-rotate('+JADE_PALETTES[palette].hue+'deg)';
 if(crater)cel(g,atlas,5,x,y,w,h);
 if(hot>0){
  g.globalAlpha*=hot;
  cel(g,atlas,crater?4:3,x,y,w,h);
 }
 g.restore();
}

export function drawJadeShock(g:CanvasRenderingContext2D,x:number,y:number,age:number,palette:JadePalette){
 const progress=age/.54;
 if(progress<0||progress>=1)return;
 const {far,hot}=JADE_PALETTES[palette];
 const r=22+116*progress;
 g.save();
 g.globalAlpha=(1-progress)**1.65;
 g.shadowColor=far;g.shadowBlur=10;
 g.strokeStyle=far;g.lineWidth=4;
 g.beginPath();g.ellipse(x,y,r,r*.58,0,0,Math.PI*2);g.stroke();
 g.shadowBlur=0;g.strokeStyle=hot;g.lineWidth=1.2;g.stroke();
 g.restore();
}

function drawFlames(g:CanvasRenderingContext2D,atlas:HTMLImageElement,beat:number,clock:number,scale:number,palette:JadePalette,front:boolean){
 if(beat<5||beat===16)return;
 const peak=beat>=12&&beat<=14;
 const frame=peak?3+Math.floor(clock*17)%3:beat>=9&&beat<=11?2:beat>=7&&beat<=8?1:0;
 const plumeWidth=(peak?177:beat>=9?155:125)*scale;
 const plumeHeight=(peak?204:beat>=9?167:126)*scale;
 const release=beat===15;
 const w=release?plumeWidth*1.45:plumeWidth;
 const h=release?plumeHeight*.65:plumeHeight;
 g.save();
 g.filter='hue-rotate('+JADE_PALETTES[palette].hue+'deg)';
 if(front){
  g.beginPath();g.ellipse(0,-4*scale,w*.56,19*scale,0,0,Math.PI*2);g.clip();
  g.globalAlpha*=.9;
 }
 cel(g,atlas,frame,-w/2,-h*.94,w,h);
 g.restore();
}

type HelixPoint = {x:number;y:number;depth:number};
function drawHelix(g:CanvasRenderingContext2D,q:number,t:number,scale:number,palette:JadePalette,front:boolean){
 const colors=JADE_PALETTES[palette],height=(86+49*q)*scale;
 const point=(u:number,strand:number):HelixPoint=>{
  const a=u*12.7-t*8.6+strand*Math.PI;
  const r=(36+11*q+4*Math.sin(u*7))*scale;
  const depth=Math.sin(a);
  return {x:Math.cos(a)*r,y:-u*height+depth*r*.33-8*scale,depth};
 };
 // Above waist level the near arc is only visible outside the face and torso.
 const visible=(p:HelixPoint)=>front?p.depth>=0&&(p.y>-39*scale||p.y<-95*scale||Math.abs(p.x)>29*scale):p.depth<0;
 const stroke=(a:HelixPoint,b:HelixPoint)=>{
  g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();
 };
 g.save();g.lineCap="round";
 for(let strand=0;strand<2;strand++){
  const color=strand===0?colors.near:colors.far;
  g.beginPath();
  let pen=false;
  for(let n=0;n<=64;n++){
   const p=point(n/64,strand);
   if(!visible(p)){pen=false;continue;}
   if(pen)g.lineTo(p.x,p.y);
   else g.moveTo(p.x,p.y);
   pen=true;
  }
  g.globalAlpha=front?.95:.46;
  g.strokeStyle=color;g.shadowColor=color;g.shadowBlur=front?9:3;
  g.lineWidth=(front?4.6:2)*scale;
  g.stroke();
  if(front){g.shadowBlur=0;g.strokeStyle=colors.hot;g.lineWidth=1.45*scale;g.stroke();}
 }
 g.shadowBlur=0;g.lineWidth=1.05*scale;g.strokeStyle=colors.far;
 for(let n=1;n<16;n++){
  const a=point(n/16,0),b=point(n/16,1);
  // Split the rung at the centre plane for separate foreground and rear passes.
  const mid={x:0,y:(a.y+b.y)/2,depth:0};
  const end=(a.depth>=0)===front?a:b;
  if(!visible(end)||(front&&end.y<=-39*scale&&end.y>=-95*scale))continue;
  g.globalAlpha=front?.72:.27;stroke(mid,end);
 }
 g.restore();
}

function drawRocks(g:CanvasRenderingContext2D,atlas:HTMLImageElement,beat:number,q:number,clock:number,scale:number,front:boolean,releaseAge:number){
 if(beat<8||beat===16)return;
 const count=beat<10?5:12;
 for(let n=0;n<count;n++){
  const small=n%3===2;
  const angle=n*2.399+clock*(small?2.1:1.08);
  const depth=Math.sin(angle);
  if((depth>=0)!==front)continue;
  const release=beat===15;
  const lift=(clock*(small?1.22:.51)+n*.414)%1;
  const r=(31+q*15+n%3*5+(release?releaseAge*116:0))*scale;
  const x=Math.cos(angle)*r,y=((release?-.42+releaseAge*.6:-lift)*104*q+depth*15)*scale;
  if(front&&Math.abs(x)<25*scale&&y<-40*scale&&y>-95*scale)continue;
  const size=(small?9:15+n%4*3)*(1+depth*.24)*scale;
  g.save();
  g.globalAlpha*=release?Math.max(0,1-releaseAge/.57):Math.min(1,lift*6,(1-lift)*10)*(front?1:.72);
  g.translate(x,y);g.rotate(n+clock*(small?3:1.3));
  cel(g,atlas,n%3,-size/2,-size/2,size,size);
  g.restore();
 }
}

export function drawJadeChargeV2(g:CanvasRenderingContext2D,art:ChargeArt,actor:Charge,x:number,floorY:number,footY:number,scale:number,duration:number,palette:JadePalette,front:boolean){
 const beat=jadeChargeBeat(actor,duration);
 if(beat===16)return;
 const flash=actor.powerFlash??0;
 const releaseAge=.65-flash;
 const clock=actor.charging?(actor.chargeAge??0):(actor.powerReleaseAge??0)+releaseAge;
 const q=actor.charging?actor.godCharge??0:1;
 g.save();g.translate(x,floorY);
 if(!actor.charging)g.globalAlpha*=flash?Math.min(1,flash/.16):Math.min(.38,(actor.powerReturn??0)*1.6);
 drawFlames(g,art.flame,beat,clock,scale,palette,front);
 if(beat!==15||flash>0)drawRocks(g,art.impact,beat,q,clock,scale,front,releaseAge);
 if(beat>=10&&beat<=14){
  g.translate(0,footY-floorY);
  drawHelix(g,q,clock,scale,palette,front);
 }
 g.restore();
}
