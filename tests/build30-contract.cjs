const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('crypto').webcrypto;require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9}}).outputText,p);
const G=require('../lib/game.ts');
const s=G.newGame('30','host',0,'duel');G.joinGame(s,'guest','guest');s.phase='playing';s.covers=[];s.matter=[];Object.assign(s.players[0],{x:1000,y:560,z:60});
const block={id:'test',x:1000,y:560,z:0,w:60,h:42,a:0,hp:100,maxHp:100,height27j:48,generated:true,build:0,variant:0};
assert.equal(G.carryBlockReason21(block,block,s),null,'fighter above short object is not blocked by obsolete 78-unit volume');
assert.equal(G.carryBlockReason21({...block,height27j:80},block,s),'FIGHTER IN FOOTPRINT','tall slab blocks overlapping fighter');
Object.assign(s.players[0],{x:700,y:560,z:0});
s.covers=[{...block,id:'upper',z:60,height27j:48}];
assert.equal(G.carryBlockReason21(block,block,s),null,'vertically separate cover volumes may pass');
assert.equal(G.carryBlockReason21({...block,hover:20},block,s),'EXISTING COVER','hover elevation participates in clearance');
s.covers=[{...block,id:'tall',z:90,height27j:48}];
assert.equal(G.carryBlockReason21({...block,height27j:100},block,s),'EXISTING COVER','actual tall volume blocks even with base separation greater than78');
// A contested tear has one claimant and a rejected rival does not spend energy.
s.covers=[{...block,id:'source',artId:'d33-nw-primary',x:850,y:560,w:128,h:28,generated:false,anchored27j:true}];s.phase='playing';Object.assign(s.players[1],{x:850,y:650,aim:-Math.PI/2});Object.assign(s.players[0],{x:850,y:470,aim:Math.PI/2});
function tick(inputs){for(let n=0;n<2;n++)G.setInput(s,n,s.players[n].lastSeq+1,{x:0,y:0,aim:n?-Math.PI/2:Math.PI/2,...inputs[n]});G.advance(s,s.lastAt+1000/60);}
for(let k=0;k<14;k++)tick([{grip:true},{grip:true}]);tick([{},{}]);const claims=s.players.filter(p=>p.ripTarget27j);assert.equal(claims.length,1);const winner=s.players.indexOf(claims[0]);assert.equal(s.covers[0].ripOwner27j,winner);const loser=s.players[1-winner];assert.equal(loser.battery,100);for(let n=0;n<24;n++)tick([{},{}]);assert.equal(s.covers.filter(c=>c.section27j?.parentId==='source').length,3);assert.equal(s.players.filter(p=>p.gripCoverId).length,1);assert.equal(s.events.filter(e=>e.source==='rip').length,1);console.log('PASS30 exact vertical clearance, hover, tall objects and simultaneous section ownership');
