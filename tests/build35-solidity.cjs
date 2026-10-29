const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9}}).outputText,p);
const G=require('../lib/game.ts'),O=require('../lib/cover-occlusion.ts'),C=require('../lib/contact35.ts'),P=require('../lib/bayBridgePresentation.ts');
const shape={id:'test',x:1000,y:550,z:40,w:80,h:40,a:0,height27j:60,hp:1000,maxHp:1000,generated:true,build:0,variant:0};
assert.deepEqual(C.contactPoint35(shape,{x:1100,y:550,z:72}),{x:1040,y:550,z:72});
assert.deepEqual(C.contactPoint35(shape,{x:1000,y:550,z:150}),{x:1000,y:550,z:100});
assert.deepEqual(C.contactPoint35({...shape,a:Math.PI/2},{x:1100,y:550,z:72}),{x:1020,y:550,z:72});
// Capture actual clipping paths. Aiming or attachment must never carve a visibility hole.
function mask(owner,exposed){const paths=[];let p=[];const m={a:1,b:0,c:0,d:1,e:0,f:0};const g={canvas:{width:2200,height:1100},save(){},restore(){},getTransform:()=>m,setTransform(){},beginPath(){p=[]},moveTo(x,y){p.push([x,y])},lineTo(x,y){p.push([x,y])},closePath(){},clip(rule){assert.equal(rule,'evenodd');paths.push(p)}};O.withCoverOcclusion(g,[shape,{...shape,id:'neighbor',x:1030}],520,10,()=>{},owner,exposed);return paths;}
const ordinary=mask(null,false);assert(ordinary.length>0);assert.deepEqual(mask('test',true),ordinary,'firing does not expose pixels through solid faces');assert.deepEqual(mask('test',false),ordinary,'neighbors still conceal attached fighters');
function inPoly(poly,p){let b=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){let a=poly[i],c=poly[j];if((a.y>p.y)!==(c.y>p.y)&&p.x<(c.x-a.x)*(p.y-a.y)/(c.y-a.y)+a.x)b=!b;}return b;}
const grounded={...shape,z:0,height27j:90};const polys=O.coverOccluders(grounded,520);const at=z=>{const v=P.vertical46(1000,520,z);return{x:1000+v.x,y:520+v.y}};
assert(polys.some(p=>inPoly(p,at(40))),'torso behind tall cover hidden');assert(!polys.some(p=>inPoly(p,at(160))),'legitimate height above top stays visible');
// Simulation: same throw is hit/block/miss according to actual defense and geometry.
function run(kind){const s=G.newGame('35','35',0,'solo');s.phase='playing';s.rules31={version:1,battery:'unlimited',opponent:'target'};s.covers=[];const p=s.players[0];Object.assign(p,{x:1200,y:550,aim:Math.PI});const rock={...shape,id:'rock',x:1100,y:kind==='miss'?680:550,z:0,height27j:50,w:35,h:35,vx:700,vy:0,vz:0,throwOwner:1,attackId:'throw35',build:-700,hitIds:[]};s.covers=[rock];const hp=p.hp;
 for(let k=0;k<20;k++){G.setInput(s,0,p.lastSeq+1,{aim:Math.PI,shield:kind==='block'});G.advance(s,s.lastAt+1000/60);}
 const events=s.events.filter(e=>e.source==='cover-throw'&&e.target===0);
 if(kind==='hit'){assert.equal(events.length,1);assert.equal(events[0].kind,'hit');assert(p.hp<hp);assert(events[0].x<p.x,'contact on approach side rather than fighter center');assert.equal(events[0].z,32);}
 if(kind==='block'){assert.equal(events.length,1);assert.equal(events[0].kind,'shield');assert.equal(p.hp,hp);assert(!s.events.some(e=>e.kind==='hit'));}
 if(kind==='miss'){assert.equal(events.length,0);assert.equal(p.hp,hp);}
 assert.equal(new Set(s.events.map(e=>e.seq)).size,s.events.length);assert(!JSON.stringify(s).includes('NaN'));return events;
}
for(const kind of ['hit','block','miss'])run(kind);
console.log('PASS35 contact witnesses at real height/rotation; all-cover masks independent of aim/attachment; high exposed point; hit/block/miss and unique events');

const I=require('../lib/presentation35.ts');
const lifted=I.interpolateCover35({...shape,z:0},{...shape,x:1020,z:80},.5,()=>false);assert.equal(lifted.x,1010);assert.equal(lifted.z,40);
const start={...shape,z:0};assert.equal(I.interpolateCover35(start,{...shape,x:1100,z:80},.8,c=>c.x>1030&&c.x<1060),start,'cannot smooth through an intervening wall');
assert.equal(I.interpolateCover35(start,{...shape,height27j:100},.5,()=>false),start,'shape transition never invents an intermediate hull');
console.log('PASS35 XYZ interpolation and swept rejection; shape identity remains discrete');

