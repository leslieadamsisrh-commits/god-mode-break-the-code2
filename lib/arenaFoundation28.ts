import type {Surface} from './elevation27a';
// Layout is gameplay data. Themes below contain no physics or placement fields.
export const ARENA28={id:'dimension33-foundation',version:1,width:2200,height:1100,bodyHeight:63.96,platformHeight:128,orientation:'east-west' as const};
export const THEME28={id:'dimension33-citadel',floor:'#394b5a',panel:['#415461','#3e505e','#435562'],seam:'#263744',edge:'#111c29',top:'#596f80',wall:'#293f54',wallLight:'#354e63',lamp:'#f3b56b',cyan:'#58cbd9',magenta:'#d46da7'} as const;
const rect=(id:string,x:number,y:number,w:number,h:number,z:number):Surface=>({id,polygon:[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}],height:z,walkable:true});
export function foundationSurfaces28(orientation:'east-west'|'north-south'=ARENA28.orientation):Surface[]{
 const floor=rect('ground',0,0,2200,1100,0);
 if(orientation==='north-south')return [floor,rect('north-platform',740,0,720,280,128),rect('south-platform',740,820,720,280,128),...[780,1220].flatMap((x,i)=>[
 {...rect('north-stairs-'+i,x,280,200,180,0),rise:{axis:'y' as const,from:460,to:280,low:0,high:128}},
 {...rect('south-stairs-'+i,x,640,200,180,0),rise:{axis:'y' as const,from:640,to:820,low:0,high:128}}])];
 return [floor,rect('west-platform',103,203,280,720,128),rect('east-platform',1817,203,280,720,128),...[243,683].flatMap((y,i)=>[
 {...rect('west-stairs-'+i,383,y,180,200,0),rise:{axis:'x' as const,from:563,to:383,low:0,high:128}},
 {...rect('east-stairs-'+i,1637,y,180,200,0),rise:{axis:'x' as const,from:1637,to:1817,low:0,high:128}}])];
}
// Shared world-space floor painter: gameplay cache and construction views use it.
export function drawFoundationFloor28(g:CanvasRenderingContext2D,theme=THEME28){
 g.save();g.beginPath();g.rect(0,0,2200,1100);g.clip();g.fillStyle=theme.floor;g.fillRect(0,0,2200,1100);
 // Panels are about 2.5 standing body heights long, staggered without random runtime layout.
 for(let row=0,y=0;y<1100;row++,y+=104)for(let col=-1,x=(row%2)*80-160;x<2200;col++,x+=160){
  g.fillStyle=theme.panel[((row*7+col)%3+3)%3];g.fillRect(x+1,y+1,158,102);g.strokeStyle=theme.seam;g.lineWidth=1;g.strokeRect(x+1,y+1,158,102);
  g.strokeStyle='#74859035';g.beginPath();g.moveTo(x+8,y+3);g.lineTo(x+150,y+3);g.stroke();
  if((row+col*3)%7===0){g.fillStyle='#172731';g.fillRect(x+8,y+8,2,2);g.fillRect(x+148,y+92,2,2);}
 }
 // Flush perimeter service drains. No implied walls or collision.
 for(const y of [145,970]){g.fillStyle='#152532';g.fillRect(145,y,1910,18);g.strokeStyle='#536575';g.lineWidth=1;g.strokeRect(145,y,1910,18);for(let x=150;x<2050;x+=12){g.beginPath();g.moveTo(x,y+3);g.lineTo(x,y+15);g.stroke();}}
 for(const [x,color,sign] of [[700,theme.cyan,1],[1500,theme.magenta,-1]] as const){g.strokeStyle=color;g.lineWidth=3;g.beginPath();g.moveTo(x-45*sign,523);g.lineTo(x-65*sign,523);g.lineTo(x-65*sign,603);g.lineTo(x-45*sign,603);g.stroke();}
 g.strokeStyle=theme.edge;g.lineWidth=5;g.strokeRect(103,118,1994,890);
 for(let x=140;x<2080;x+=160)for(const y of [112,1012]){g.fillStyle='#182734';g.fillRect(x,y,38,7);g.fillStyle=theme.lamp;g.fillRect(x+4,y+2,30,3);}
 g.restore();
}
