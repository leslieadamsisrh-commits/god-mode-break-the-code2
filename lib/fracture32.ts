// Trusted concrete cell lattice. Network state contains occupancy, never client-authored hulls.
export type V32={x:number;y:number};
export type Fracture32={layers33?:boolean;oz?:number;seed:number;sourceId:string;width:number;depth:number;height:number;ox:number;oy:number;cells:number[];revision:number};
export type Shape32={z?:number;hover?:number;height27j?:number;x:number;y:number;w:number;h:number;a?:number;fracture32?:Fracture32};
export const hash32=(s:string)=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const cache=new Map<string,V32[][]>();
export function lattice32(f:Fracture32):V32[][]{
 const key=[f.seed,f.width,f.depth].join('/'),old=cache.get(key);if(old)return old;
 let seed=f.seed;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const grid=Array.from({length:3},(_,r)=>Array.from({length:5},(_,c)=>({x:(c/4-.5)*f.width+(c>0&&c<4?(random()-.5)*f.width*.12:0),y:(r/2-.5)*f.depth+(r===1?(random()-.5)*f.depth*.4:0)})));
 const cells=Array.from({length:8},(_,id)=>{const r=Math.floor(id/4),c=id%4;return[grid[r][c],grid[r][c+1],grid[r+1][c+1],grid[r+1][c]];});
 if(cache.size>=128)cache.delete(cache.keys().next().value!);cache.set(key,cells);return cells;
}
export const area32=(p:V32[])=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a.x*b.y-a.y*b.x;},0))/2;
export const volume32=(f:Fracture32,ids=f.cells)=>ids.reduce((n,id)=>n+area32(lattice32(f)[id%8])*(band33(f,id).high-band33(f,id).low),0);
export function initialFracture32(id:string,w:number,h:number,height=48,layers33=false):Fracture32{return{seed:hash32(id),sourceId:id,width:w,depth:h,height,ox:0,oy:0,...layers33?{layers33:true,oz:0}:{},cells:Array.from({length:layers33?24:8},(_,i)=>i),revision:0};}
export function localPolys32(c:Shape32):V32[][]{const f=c.fracture32;return f?[...new Set(f.cells.map(id=>id%8))].map(id=>lattice32(f)[id].map(p=>({x:p.x-f.ox,y:p.y-f.oy}))):[[{x:-c.w/2,y:-c.h/2},{x:c.w/2,y:-c.h/2},{x:c.w/2,y:c.h/2},{x:-c.w/2,y:c.h/2}]];}
export function worldPolys32(c:Shape32){const co=Math.cos(c.a||0),si=Math.sin(c.a||0);return localPolys32(c).map(poly=>poly.map(p=>({x:c.x+p.x*co-p.y*si,y:c.y+p.x*si+p.y*co})));}
export function edges32(c:Shape32){const polys=localPolys32(c),all=polys.flatMap(poly=>poly.map((a,i)=>({a,b:poly[(i+1)%poly.length]})));return all.filter(e=>!all.some(q=>q!==e&&Math.hypot(e.a.x-q.b.x,e.a.y-q.b.y)<1e-7&&Math.hypot(e.b.x-q.a.x,e.b.y-q.a.y)<1e-7));}
export function rayPoly32(a:V32,b:V32,poly:V32[],pad=0){let lo=0,hi=1;for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],ex=q.x-p.x,ey=q.y-p.y,len=Math.hypot(ex,ey),d0=(ex*(a.y-p.y)-ey*(a.x-p.x))/len+pad,d1=(ex*(b.y-p.y)-ey*(b.x-p.x))/len+pad;if(d0<0&&d1<0)return null;if(d0<0)lo=Math.max(lo,d0/(d0-d1));if(d1<0)hi=Math.min(hi,d0/(d0-d1));}return lo<=hi?{lo,hi}:null;}
export function circleContact32(o:V32&{z?:number},r:number,c:Shape32,bodyHeight=64){let best={hit:false,nx:0,ny:0,depth:0};for(const {poly} of prisms33(c).filter(v=>o.z===undefined||v.high+(c.z||0)+(c.hover||0)>o.z+.01&&v.low+(c.z||0)+(c.hover||0)<o.z+bodyHeight-.01)){let inside=true,d=Infinity,nx=0,ny=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ex=b.x-a.x,ey=b.y-a.y,l2=ex*ex+ey*ey,t=Math.max(0,Math.min(1,((o.x-a.x)*ex+(o.y-a.y)*ey)/l2)),dx=o.x-a.x-ex*t,dy=o.y-a.y-ey*t,dist=Math.hypot(dx,dy);if(ex*(o.y-a.y)-ey*(o.x-a.x)<0)inside=false;if(dist<d){d=dist;nx=dist?dx/dist:ey/Math.sqrt(l2);ny=dist?dy/dist:-ex/Math.sqrt(l2);}}const depth=inside?r+d:r-d;if(depth>best.depth)best={hit:true,nx:inside&&d>1e-9?-nx:nx,ny:inside&&d>1e-9?-ny:ny,depth};}return best;}
export function overlap32(a:Shape32,b:Shape32){if(Math.hypot(a.x-b.x,a.y-b.y)>(Math.hypot(a.w,a.h)+Math.hypot(b.w,b.h))/2)return{hit:false,nx:0,ny:0,depth:0};let best={hit:false,nx:0,ny:0,depth:0};for(const ap of prisms33(a))for(const bp of prisms33(b)){if(((a.z||0)+(a.hover||0)+ap.high<=(b.z||0)+(b.hover||0)+bp.low+.01||(b.z||0)+(b.hover||0)+bp.high<=(a.z||0)+(a.hover||0)+ap.low+.01))continue;const p=ap.poly,q=bp.poly;let dep=Infinity,nx=0,ny=0,hit=true;for(const poly of [p,q])for(let i=0;i<poly.length;i++){const u=poly[i],v=poly[(i+1)%poly.length],len=Math.hypot(v.x-u.x,v.y-u.y),ax=(v.y-u.y)/len,ay=-(v.x-u.x)/len,ps=p.map(t=>t.x*ax+t.y*ay),qs=q.map(t=>t.x*ax+t.y*ay),d=Math.min(Math.max(...ps)-Math.min(...qs),Math.max(...qs)-Math.min(...ps));if(d<=.01){hit=false;break;}if(d<dep){dep=d;const sign=(a.x-b.x)*ax+(a.y-b.y)*ay<0?-1:1;nx=ax*sign;ny=ay*sign;}}if(hit&&dep>best.depth)best={hit:true,nx,ny,depth:dep};}return best;}
export function rebase32<T extends Shape32>(c:T,ids:number[]):T{const f=c.fracture32!,points=ids.flatMap(id=>lattice32(f)[id%8]),xs=points.map(p=>p.x),ys=points.map(p=>p.y),ox=(Math.min(...xs)+Math.max(...xs))/2,oy=(Math.min(...ys)+Math.max(...ys))/2,dx=ox-f.ox,dy=oy-f.oy,co=Math.cos(c.a||0),si=Math.sin(c.a||0);const low=Math.min(...ids.map(id=>band33(f,id).low)),high=Math.max(...ids.map(id=>band33(f,id).high));return{...c,...f.layers33?{z:(c.z||0)+low-(f.oz||0),height27j:high-low}:{},x:c.x+dx*co-dy*si,y:c.y+dx*si+dy*co,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),fracture32:{...f,ox,oy,...f.layers33?{oz:low}:{},cells:[...ids],revision:f.revision+1}};}
export function capacity32(f:Fracture32,battery:number){return f.width*f.depth*f.height*(.28+.42*Math.max(0,Math.min(100,battery))/100);}
export function candidates32(c:Shape32,aim:V32,battery:number){const f=c.fracture32!;if(f.layers33)return candidates33(c,aim,battery);const co=Math.cos(c.a||0),si=Math.sin(c.a||0),dx=aim.x-c.x,dy=aim.y-c.y,target={x:dx*co+dy*si+f.ox,y:-dx*si+dy*co+f.oy},cells=lattice32(f),center=(id:number)=>({x:cells[id].reduce((s,p)=>s+p.x,0)/4,y:cells[id].reduce((s,p)=>s+p.y,0)/4}),distance=(id:number)=>Math.hypot(center(id).x-target.x,center(id).y-target.y),adj=(a:number,b:number)=>Math.floor(a/4)===Math.floor(b/4)&&Math.abs(a-b)===1||Math.abs(a-b)===4;
 const starts=[...f.cells].sort((a,b)=>distance(a)-distance(b)||a-b).slice(0,4),cap=capacity32(f,battery),out:number[][]=[],seen=new Set<string>();
 for(const first of starts){const selected=[first],chain:number[][]=[];if(volume32(f,selected)>cap)continue;chain.push([...selected]);while(selected.length<6){const next=f.cells.filter(id=>!selected.includes(id)&&selected.some(a=>adj(a,id))).sort((a,b)=>distance(a)-distance(b)+(hash32(f.sourceId+'/'+f.revision+'/'+a)%7-hash32(f.sourceId+'/'+f.revision+'/'+b)%7)*.4).find(id=>volume32(f,[...selected,id])<=cap);if(next===undefined)break;selected.push(next);chain.push([...selected]);}for(const ids of chain.reverse()){const key=[...ids].sort().join(',');if(!seen.has(key)){seen.add(key);out.push(ids);}}}return out.slice(0,24);}

// Build33: 24 trusted convex prisms, three nonuniform height bands per XY cell.
// Source-space bands never change when a fragment is rebased or moved.
export function band33(f:Fracture32,id:number){
 if(!f.layers33)return{low:0,high:f.height};
 const col=id%8,layer=Math.floor(id/8),j=hash32(f.sourceId+'/band/'+col),cuts=[0,f.height*(.27+(j%10)*.01),f.height*(.64+((j>>>8)%10)*.01),f.height];
 return{low:cuts[layer],high:cuts[layer+1]};
}
export function prisms33(c:Shape32){
 const f=c.fracture32,co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 if(!f)return[{id:0,poly:worldPolys32(c)[0],low:0,high:c.height27j??78}];
 return f.cells.map(id=>{const b=band33(f,id);return{id,low:b.low-(f.oz||0),high:b.high-(f.oz||0),poly:lattice32(f)[id%8].map(p=>{const x=p.x-f.ox,y=p.y-f.oy;return{x:c.x+x*co-y*si,y:c.y+x*si+y*co};})};});
}
export function adjacent33(f:Fracture32,a:number,b:number){
 if(a===b)return false;const x=a%8,y=b%8,A=band33(f,a),B=band33(f,b);
 if(x===y)return Math.abs(A.high-B.low)<1e-6||Math.abs(B.high-A.low)<1e-6;
 return (Math.floor(x/4)===Math.floor(y/4)&&Math.abs(x-y)===1||Math.abs(x-y)===4)&&Math.min(A.high,B.high)-Math.max(A.low,B.low)>1e-6;
}
export function supported33(f:Fracture32,ids:number[]){
 const reached=new Set(ids.filter(id=>band33(f,id).low<1e-6));for(let k=0;k<24;k++){const before=reached.size;for(const id of ids)if(!reached.has(id)&&[...reached].some(a=>adjacent33(f,a,id)))reached.add(id);if(reached.size===before)break;}return reached.size===ids.length;
}
function candidates33(c:Shape32,aim:V32,battery:number){
 const f=c.fracture32!,co=Math.cos(c.a||0),si=Math.sin(c.a||0),dx=aim.x-c.x,dy=aim.y-c.y,target={x:dx*co+dy*si+f.ox,y:-dx*si+dy*co+f.oy},grid=lattice32(f),distance=(id:number)=>{const p=grid[id%8];return Math.hypot(p.reduce((n,p)=>n+p.x,0)/4-target.x,p.reduce((n,p)=>n+p.y,0)/4-target.y);};
 // Surface-first selection; low capacity bites the upper corner. More capacity
 // grows down and sideways. All candidates leave supported remaining material.
 const rank=(id:number)=>distance(id)+(2-Math.floor(id/8))*9;
 const eligible=f.cells.filter(id=>battery>33||id>=8);const starts=[...eligible].sort((a,b)=>rank(a)-rank(b)||a-b).slice(0,4),cap=capacity32(f,battery),out:number[][]=[],seen=new Set<string>();
 for(const first of starts){const selected=[first],chain:number[][]=[];for(let k=0;k<16;k++){
  const remain=f.cells.filter(id=>!selected.includes(id));if(volume32(f,selected)<=cap&&supported33(f,remain))chain.push([...selected]);
  if(selected.length>=16)break;
  const next=eligible.filter(id=>!selected.includes(id)&&selected.some(a=>adjacent33(f,a,id))).sort((a,b)=>rank(a)-rank(b)||a-b).find(id=>volume32(f,[...selected,id])<=cap);
  if(next===undefined)break;selected.push(next);
 }
 for(const ids of chain.reverse()){const key=[...ids].sort((a,b)=>a-b).join(',');if(!seen.has(key)){seen.add(key);out.push(ids);}}
 }
 return out.slice(0,48);
}
export type Face33={id:number;kind:'top'|'side'|'bottom';exterior:boolean;points:(V32&{z:number})[]};
export function visibleFractureFaces33(c:Shape32){
 const co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 return faces33(c).filter(face=>{
  if(face.kind!=='side')return face.kind==='top';
  const [a,b]=face.points;
  return (b.x-a.x)*co-(b.y-a.y)*si<0;
 });
}
const faceCache33=new Map<string,Face33[]>();
export function faces33(c:Shape32):Face33[]{
 const f=c.fracture32!,key=[f.sourceId,f.seed,f.width,f.depth,f.height,f.layers33?1:0,f.ox,f.oy,f.oz||0,f.cells.join(',')].join('/'),cached=faceCache33.get(key);if(cached)return cached;const grid=lattice32(f),out:Face33[]=[];
 const point=(p:V32,z:number)=>({x:p.x-f.ox,y:p.y-f.oy,z:z-(f.oz||0)});
 for(const id of f.cells){const poly=grid[id%8],band=band33(f,id);
  if(!f.cells.some(j=>j!==id&&j%8===id%8&&Math.abs(band33(f,j).low-band.high)<1e-6))out.push({id,kind:'top',exterior:Math.abs(band.high-f.height)<1e-6,points:poly.map(p=>point(p,band.high))});
  if(!f.cells.some(j=>j!==id&&j%8===id%8&&Math.abs(band33(f,j).high-band.low)<1e-6))out.push({id,kind:'bottom',exterior:band.low===0,points:poly.map(p=>point(p,band.low))});
  for(let k=0;k<poly.length;k++){
   const a=poly[k],b=poly[(k+1)%poly.length];let spans=[[band.low,band.high]];
   for(const other of f.cells){if(other%8===id%8)continue;const q=grid[other%8];if(!q.some((u,n)=>Math.hypot(u.x-b.x,u.y-b.y)<1e-7&&Math.hypot(q[(n+1)%q.length].x-a.x,q[(n+1)%q.length].y-a.y)<1e-7))continue;const ob=band33(f,other);spans=spans.flatMap(([lo,hi])=>ob.high<=lo||ob.low>=hi?[[lo,hi]]:[[lo,Math.min(hi,ob.low)],[Math.max(lo,ob.high),hi]].filter(([x,y])=>y-x>1e-6));}
   const exterior=Math.abs(a.x-b.x)<1e-6&&Math.abs(Math.abs(a.x)-f.width/2)<1e-6||Math.abs(a.y-b.y)<1e-6&&Math.abs(Math.abs(a.y)-f.depth/2)<1e-6;
   for(const [lo,hi] of spans)out.push({id,kind:'side',exterior,points:[point(a,lo),point(b,lo),point(b,hi),point(a,hi)]});
  }
 }
 if(faceCache33.size>=128)faceCache33.delete(faceCache33.keys().next().value!);faceCache33.set(key,out);return out;
}
