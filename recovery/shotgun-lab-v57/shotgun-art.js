// Isolated Movement Lab presentation. This module never changes combat rules.
export async function loadShotgunArt(){
 const response=await fetch('assets/shotgun-test/manifest.json');if(!response.ok)throw Error('Shotgun artwork is unavailable');
 const manifest=await response.json(),cache=new Map();
 for(const family of manifest.families){
  if(family.status!=='lab-test')continue;
  const im=new Image();await new Promise((ok,no)=>{im.onload=ok;im.onerror=()=>no(Error('Cannot load '+family.id));im.src=family.url});
  const frames=[],size=250,scale=size/family.cell[0];
  for(let i=0;i<family.totalFrames;i++){
   const tile=document.createElement('canvas');tile.width=size;tile.height=size;
   const c=tile.getContext('2d');c.drawImage(im,i%family.grid[0]*family.cell[0],Math.floor(i/family.grid[0])*family.cell[1],family.cell[0],family.cell[1],0,0,size,size);
   frames.push(tile);
  }
  cache.set(family.id,{...family,frames,anchor:family.anchor.map(v=>Math.round(v*scale))});
 }
 return {manifest,select(actor,now){
   // This release explicitly supplies a fixed front-right art study, not 24 direction coverage.
   let id='idle',index=0;
   if(now<actor.slideUntil){id='slide';index=Math.floor((1-(actor.slideUntil-now)/.64)*24)}
   else if(actor.attached){id='cover';index=actor.side<0?1:4}
   else if(Math.hypot(actor.vx,actor.vy)>8){id='run';index=Math.floor(actor.travel/9)}
   else if(actor.state==='fire'&&now-actor.stateAt<.3){id='fire';index=Math.floor((now-actor.stateAt)/.3*6)}
   else index=Math.floor(now*5);
   const item=cache.get(id);if(!item)return null;
   index=id==='run'||id==='idle'?((index%item.frames.length)+item.frames.length)%item.frames.length:Math.max(0,Math.min(item.frames.length-1,index));
   return {family:item.id,frame:index,total:item.frames.length,bitmap:item.frames[index],anchor:item.anchor,view:item.view};
 },draw(ctx,spec,x,y){ctx.drawImage(spec.bitmap,Math.round(x-spec.anchor[0]),Math.round(y-spec.anchor[1]))}};
}
