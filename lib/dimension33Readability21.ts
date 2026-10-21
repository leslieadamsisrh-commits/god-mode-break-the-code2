import {constructionPreview21,gripSelection,type GameState} from './game';
import {relativeWorld46,withWorld46} from './bayBridgePresentation';

let selected21={scene:'',id:'',since:0};
function footprint(g:CanvasRenderingContext2D,c:{x:number;y:number;w:number;h:number;a?:number}){
 const co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 g.beginPath();[[-c.w/2,-c.h/2],[c.w/2,-c.h/2],[c.w/2,c.h/2],[-c.w/2,c.h/2]].forEach(([x,y],n)=>{
  const p=relativeWorld46(c.x,c.y,x*co-y*si,x*si+y*co);n?g.lineTo(c.x+p.x,c.y+p.y):g.moveTo(c.x+p.x,c.y+p.y);
 });g.closePath();
}
export function drawInteractions21(g:CanvasRenderingContext2D,s:GameState,slot:number){
 const p=s.players[slot]||s.players[0];if(!p||p.hp<=0)return;
 if(!p.gripCoverId&&!p.gripId){
  const selection=gripSelection(p,s),target=selection.cover||selection.matter||selection.panel;
  const scene=s.createdAt+'/'+s.round+'/'+slot;
  if(scene!==selected21.scene||target?.id!==selected21.id)selected21={scene,id:target?.id||'',since:s.time};
  if(target)withWorld46(g,target.x,target.y,()=>{
   g.save();g.strokeStyle='#9df9ff';g.lineWidth=1.7;g.globalAlpha=s.time-selected21.since<.55?.8:.24;
   if('w' in target)footprint(g,target);else{g.beginPath();g.ellipse(target.x,target.y,'r' in target?target.r+6:40,'r' in target?target.r+6:27,0,0,Math.PI*2);}
   g.stroke();g.restore();
  });
 }
 // Ordinary construction preview uses the same orientation/search/validation as RB.
 // LB+RB restoration remains contextual and intentionally has no build ghost.
 if(s.mode==='watch'||p.gripId||p.gripCoverId||p.input.grip||p.charging||(p.selectedPower||0)!==0)return;
 const preview=constructionPreview21(p,s,slot),c=preview.cover;if(!c)return;
 withWorld46(g,c.x,c.y,()=>{g.save();g.lineWidth=1.4;g.setLineDash([5,5]);g.globalAlpha=.42;
  g.strokeStyle=preview.valid?'#8de8cc':'#e6b77c';footprint(g,c);g.stroke();g.restore();});
}
