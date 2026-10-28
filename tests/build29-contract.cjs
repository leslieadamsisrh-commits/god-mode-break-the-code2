const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9}}).outputText,p);
const G=require('../lib/game.ts'),R=require('../lib/roomStore.ts'),S=require('../lib/psychicMatter27j.ts');
function scene(){const s=G.newGame('29','host',0,'solo');s.phase='playing';s.covers=[];s.matter=[];Object.assign(s.players[0],{x:1000,y:563,aim:0,gunFacing:0});return s;}
function tick(s,i={},n=1){G.setInput(s,0,s.players[0].lastSeq+1,{x:0,y:0,aim:0,...i});for(let k=0;k<n;k++)G.advance(s,s.lastAt+1000/60);}
function build(){const s=scene();tick(s,{cover:true});tick(s,{},25);return s;}
let s=build(),c=s.covers[0],p=s.players[0];c.hp-=17;const hp=c.hp,id=c.id,source=[c.w,c.h,c.height27j];tick(s,{coverShapeCycle:true});assert.equal(c.reshapePending27j,1);tick(s,{},4);assert.deepEqual([c.w,c.h,c.height27j],source,'source hull remains authoritative through preparation');p.knock=.2;tick(s);assert.equal(c.reshapePending27j,undefined);assert.deepEqual([c.w,c.h,c.height27j],source);assert.equal(c.hp,hp);
tick(s,{},40);tick(s,{coverShapeCycle:true});tick(s,{},20);assert.equal(c.id,id);assert.equal(c.hp,hp);assert.equal(c.height27j,80);assert.equal(p.gripCoverId,id);
// A held input edge cannot cycle repeatedly.
tick(s,{},30);tick(s,{coverShapeCycle:true},60);assert.equal(p.coverShape,2);assert.equal(c.height27j,48);assert.equal(c.w,60);
// Invalid destination preserves a catalog hull and health.
s=build();c=s.covers[0];p=s.players[0];Object.assign(c,S.SHAPES27J[2]);p.coverShape=2;const original={w:c.w,h:c.h,height:c.height27j};s.covers.push({...c,id:'obstacle',x:c.x,y:c.y+50,w:30,h:20,generated:false,build:0});tick(s,{coverShapeCycle:true});assert.equal(c.reshapePending27j,undefined);assert.deepEqual({w:c.w,h:c.h,height:c.height27j},original);
// Death never commits a shape and pending state cannot survive missing ownership.
s=build();c=s.covers[0];tick(s,{coverShapeCycle:true});s.players[0].hp=0;tick(s);assert.equal(c.reshapePending27j,undefined);assert.equal(c.height27j,48);
s=build();c=s.covers[0];tick(s,{coverShapeCycle:true});s.players[0].gripCoverId=null;tick(s);assert.equal(c.reshapePending27j,undefined);assert.equal(c.height27j,48);
// Loose covers retain ownership after analog LB release.
s=build();c=s.covers[0];c.generated=false;c.artId='floor-panel46';s.players[0].gripGesture=true;s.players[0].processedInput.grip=true;tick(s,{grip:true,gripX:1,gripY:0});tick(s,{});assert.equal(s.players[0].gripCoverId,c.id);assert.equal(c.throwOwner,undefined);
// Disconnect relinquishes ownership and removes preparation/claim state.
s=build();c=s.covers[0];tick(s,{coverShapeCycle:true});c.ripOwner27j=0;c.ripAt27j=s.time;const room={state:s,inputAt:[0],updatedAt:0};R.tickRoom(room,3000);assert.equal(s.players[0].gripCoverId,null);assert.equal(c.reshapePending27j,undefined);assert.equal(c.ripOwner27j,undefined);
console.log('PASS29 atomic reshape source hull, interrupt, commit, edge, clearance, death, orphan, loose persistent hold, disconnect cleanup');
// Elevated occluder is tested in its local height range, not at ground zero.
s=scene();p=s.players[0];Object.assign(p,{x:240,y:450,z:128,supportSurfaceId:'west-platform',aim:Math.PI/2,gunFacing:Math.PI/2});s.covers=[{id:'source',artId:'d33-nw-primary',anchored27j:true,x:240,y:600,z:128,w:98,h:30,a:0,hp:280,maxHp:280,generated:false,build:0,variant:0},{id:'blocker',x:240,y:520,z:128,w:98,h:30,a:0,hp:280,maxHp:280,generated:false,protected45:true,build:0,variant:0}];tick(s,{grip:true,aim:Math.PI/2});assert(!p.ripTarget27j);assert.equal(p.gripHint,'RIP LINE BLOCKED');
console.log('PASS29 elevated cover blocks ripping at its actual base height');
