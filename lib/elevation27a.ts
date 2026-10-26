export type Point={x:number;y:number};
export type Surface={id:string;polygon:Point[];height:number;rise?:{axis:'x'|'y';from:number;to:number;low:number;high:number};walkable:boolean};
export type Body={x:number;y:number;z:number;vz:number;grounded:boolean;supportSurfaceId:string|null};
export const STEP=1/60,GRAVITY=900,JUMP_SPEED=355,PLAYER_HEIGHT=38;
const rect=(id:string,x:number,y:number,w:number,h:number,height:number):Surface=>({id,polygon:[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}],height,walkable:true});
export const SURFACES:Surface[]=[rect('ground',0,0,900,560,0),{...rect('stairs',170,235,190,90,0),rise:{axis:'x',from:170,to:360,low:0,high:90}},rect('upper',360,205,145,150,90),rect('bridge',505,255,170,70,90),rect('landing',715,255,115,100,35)];
export const SPAWN:Body={x:90,y:280,z:0,vz:0,grounded:true,supportSurfaceId:'ground'};
export const inside=(p:Point,s:Surface)=>{let ok=false;for(let i=0,j=s.polygon.length-1;i<s.polygon.length;j=i++){const a=s.polygon[i],b=s.polygon[j];if(((a.y>p.y)!==(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x))ok=!ok;}return ok};
export const height=(s:Surface,p:Point)=>{if(!s.rise)return s.height;const r=s.rise,v=p[r.axis],t=Math.max(0,Math.min(1,(v-r.from)/(r.to-r.from)));return r.low+(r.high-r.low)*t};
export function advanceElevation(body:Body,input:{x:number;y:number;jump?:boolean;speed?:number},dt=STEP,surfaces=SURFACES):Body{
 const p={...body};const len=Math.hypot(input.x,input.y)||1,dx=input.x/len*(input.speed??165)*dt,dy=input.y/len*(input.speed??165)*dt;
 const next={x:Math.max(10,Math.min(890,p.x+dx)),y:Math.max(10,Math.min(550,p.y+dy))};
 const available=surfaces.filter(s=>s.walkable&&inside(next,s));
 const prior=surfaces.find(s=>s.id===p.supportSurfaceId);
 const ramp=available.find(s=>s.rise&&Math.abs(height(s,next)-p.z)<=5);
 const support=ramp&&p.grounded?ramp:available.find(s=>s.id===p.supportSurfaceId);
 let floor=support?height(support,next):null;
 if(p.grounded&&support&&floor!==null&&Math.abs(floor-p.z)<=Math.max(5,165*dt*.65)){p.x=next.x;p.y=next.y;p.z=floor;p.vz=0;p.supportSurfaceId=support!.id;}
 else if(p.grounded){const linked=available.filter(s=>Math.abs(height(s,next)-p.z)<3).sort((a,b)=>height(b,next)-height(a,next))[0];if(linked){p.x=next.x;p.y=next.y;p.z=height(linked,next);p.supportSurfaceId=linked.id;}else{p.x=next.x;p.y=next.y;p.grounded=false;p.supportSurfaceId=null;}}
 else{p.x=next.x;p.y=next.y;}
 if(p.grounded&&input.jump){p.grounded=false;p.vz=JUMP_SPEED;p.supportSurfaceId=null;}
 if(!p.grounded){const before=p.z;p.vz-=GRAVITY*dt;p.z+=p.vz*dt;
 if(p.vz>0){const ceilings=available.filter(s=>height(s,next)>before+PLAYER_HEIGHT&&height(s,next)<=p.z+PLAYER_HEIGHT);if(ceilings.length){p.z=Math.min(...ceilings.map(s=>height(s,next)))-PLAYER_HEIGHT;p.vz=0;}}
 if(p.vz<=0){const landing=available.filter(s=>height(s,next)<=before+1&&height(s,next)>=p.z).sort((a,b)=>height(b,next)-height(a,next))[0];if(landing){p.z=height(landing,next);p.vz=0;p.grounded=true;p.supportSurfaceId=landing.id;}}
 if(p.z<0){p.z=0;p.vz=0;p.grounded=true;p.supportSurfaceId='ground';}}
 return p;
}
