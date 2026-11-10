const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,p);
const load=p=>require('../lib/'+p+'.ts');
const {coverOccluders}=load('cover-occlusion');
const {drawSection27j}=load('psychicPresentation27j');
const {initialFracture32}=load('fracture32');
const {withStructureOcclusion27e}=load('arenaPresentation27e');
const {structureFaces27e,COMBAT_SURFACES}=load('arenaStructures27e');
const {relativeWorld46,vertical46}=load('bayBridgePresentation');
function paths(){
 const fills=[],clips=[];let polygon=[];
 const g={fillStyle:'',strokeStyle:'',lineWidth:1,beginPath(){polygon=[]},moveTo(x,y){polygon.push({x,y})},lineTo(x,y){polygon.push({x,y})},closePath(){},fill(){fills.push({color:this.fillStyle,polygon:[...polygon]})},clip(){clips.push([...polygon])},stroke(){},save(){},restore(){},rect(){},fillRect(){}};
 return {g,fills,clips};
}
function inside(p,poly){
 let hit=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)hit=!hit;
 }
 return hit;
}
for(const a of [0,Math.PI/12,Math.PI/2])for(const fractured of [false,true]){
 const wall={id:'qa-mask',x:950,y:550,w:144,h:20,a,height27j:100,z:0,hp:280,maxHp:280,build:0,coverClass:'tall'};
 if(fractured){
  wall.fracture32=initialFracture32(wall.id,wall.w,wall.h,wall.height27j,true);
  wall.fracture32.cells=wall.fracture32.cells.filter(i=>i!==19&&i!==20&&i!==21);
 }
 const {g,fills}=paths();
 drawSection27j(g,wall,0,new Map());
 const solidColors=new Set(['#697785','#344451','#53616d','#a4a49a','#87918f','#85877d','#5e6d73']);
 const solid=fills.filter(f=>solidColors.has(f.color)).map(f=>f.polygon);
 const masks=coverOccluders(wall,wall.y-120);
 const bounds=solid.flat();let samples=0;
 for(let y=Math.min(...bounds.map(p=>p.y))+.13;y<Math.max(...bounds.map(p=>p.y));y+=2.7)
 for(let x=Math.min(...bounds.map(p=>p.x))+.3;x<Math.max(...bounds.map(p=>p.x));x+=2.7){
  const p={x,y};assert.equal(masks.some(poly=>inside(p,poly)),solid.some(poly=>inside(p,poly)),JSON.stringify({a,fractured,p}));samples++;
 }
 console.log(fractured?'fractured':'intact',a,samples,'mask equals rendered face samples');
}
const ramp=COMBAT_SURFACES.find(s=>s.rise);
const point=v=>{const r=relativeWorld46(750,420,v.x-750,v.y-420),z=vertical46(750,420,v.z);return{x:750+r.x+z.x,y:420+r.y+z.y}};
const face=structureFaces27e().find(f=>f.surfaceId===ramp.id&&f.kind==='top');
const mean=face.vertices.reduce((c,p)=>({x:c.x+p.x/4,y:c.y+p.y/4,z:c.z+p.z/4}),{x:0,y:0,z:0});
const expected=face.vertices.map(point);
const behind={x:mean.x,y:Math.min(...face.vertices.map(p=>p.y))-15,z:0};
const low=paths(),support=paths(),air=paths();
withStructureOcclusion27e(low.g,behind,()=>{});
assert.ok(low.clips.some(poly=>JSON.stringify(poly)===JSON.stringify(expected)));
withStructureOcclusion27e(support.g,{...behind,supportSurfaceId:ramp.id},()=>{});
assert.ok(!support.clips.some(poly=>JSON.stringify(poly)===JSON.stringify(expected)));
withStructureOcclusion27e(air.g,{...behind,z:500},()=>{});
assert.equal(air.clips.length,0);
console.log('Ramp face clips the grounded actor behind it and clears the ramp occupant and high airborne actor');
