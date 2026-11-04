const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('crypto').webcrypto;require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9}}).outputText,p);const G=require('../lib/game.ts');
function game(){const s=G.newGame('37','37',0,'solo');s.phase='playing';s.rules31={version:1,battery:'unlimited',opponent:'target'};s.covers=[];Object.assign(s.players[0],{x:850,y:550,aim:0,gunFacing:0});return s;}
function tick(s,i={},n=1){G.setInput(s,0,s.players[0].lastSeq+1,{aim:0,...i});for(let k=0;k<n;k++)G.advance(s,s.lastAt+1000/60);}
function build(s){tick(s,{cover:true});assert(s.players[0].arsenal37);assert(!s.players[0].gripCoverId);tick(s,{},15);assert(s.players[0].gripCoverId);return s.covers.find(c=>c.id===s.players[0].gripCoverId);}
function park(s,c,k){tick(s,{dropMatter34:true});Object.assign(c,{x:650+k*120,y:750,z:0,hover:0,build:0,vx:0,vy:0,vz:0});tick(s,{},2);}

function brace(s,wall){
 const p=s.players[0];
 Object.assign(wall,{x:820,y:550,w:23,h:95,a:0,z:0,hover:0,build:0,vx:0,vy:0,vz:0});
 Object.assign(p,{x:850,y:550,coverId:wall.id,coverMode:'braced',coverAnchor:{edge:1,face:'right',t:47.5,length:95,offset:0,half:47.5,nx:1,ny:0,tx:0,ty:1}});
}
for(const recall of [false,true]){
 const s=game(),p=s.players[0]; const a=build(s);park(s,a,0);
 if(recall){for(let k=1;k<4;k++)park(s,build(s),k);}
 brace(s,a);const x=p.x,y=p.y;
 tick(s,{cover:true});assert(p.arsenal37, 'construct or recall while attached');
 tick(s,{},120);assert(p.gripCoverId && p.gripCoverId!==a.id,'B acquired');
 assert.equal(p.coverId,a.id);assert.equal(p.x,x);assert.equal(p.y,y);
 a.hp=0;tick(s,{});assert.equal(p.coverId,null);assert.equal(p.x,x);assert.equal(p.y,y);
}
console.log('PASS39S construct/recall B from planted A, preserve position, release on A destruction');
{
 const s=game(),p=s.players[0];tick(s,{cover:true,fire:true});tick(s,{fire:true},24);
 const id=p.gripCoverId;assert(id,'holding RT during assembly cannot throw on acquisition');
 tick(s,{});const lastShot=p.lastShot;tick(s,{fire:true},1);
 assert.equal(p.gripCoverId,null);assert.equal(s.covers.find(c=>c.id===id).throwOwner,0);
 tick(s,{fire:true},45);assert.equal(p.lastShot,lastShot,'held RT cannot fire after throwing');
 tick(s,{});tick(s,{fire:true});assert(p.lastShot>lastShot,'fresh RT resumes gunfire');
}
console.log('PASS39S held and fresh RT across both ownership handoffs');
