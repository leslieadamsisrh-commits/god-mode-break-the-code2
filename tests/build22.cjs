const fs=require('fs'),path=require('path'),Module=require('module'),ts=require('typescript'),assert=require('assert/strict');
global.crypto??=require('crypto').webcrypto;
const compile=s=>ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
require.extensions['.ts']=(m,p)=>m._compile(compile(fs.readFileSync(p,'utf8')),p);
const file=path.resolve('lib/game.ts'),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m._compile(compile(fs.readFileSync(file,'utf8')+'\nexport {coverImpact,attachCover,moveOnCover};'),file);const a=m.exports;
const {SelectorGate22,selectionCards22,encounterCamera22}=require('../lib/combatPresentation22.ts');
const gate=new SelectorGate22(),pad={id:'test',index:0,buttons:Array.from({length:16},()=>({pressed:false,value:0}))};
assert.deepEqual(gate.sample(pad),[false,false,false,false]);pad.buttons[13].pressed=true;assert(gate.sample(pad)[1]);assert(gate.sample(pad)[1]);gate.sample(null);assert(!gate.sample(pad)[1]);pad.buttons[13].pressed=false;gate.sample(pad);pad.buttons[13].pressed=true;assert(gate.sample(pad)[1]);
function fixture(){const s=a.newGame('QA','qa',1000,'practice');s.phase='playing';s.fightUntil=0;s.covers=[];s.matter=[];s.players.forEach((p,n)=>Object.assign(p,{bot:false,x:350+n*400,y:330,aim:0,gunFacing:0}));return s;}
function tick(s,i){a.setInput(s,0,s.players[0].lastSeq+1,i);a.advance(s,s.lastAt+1000/60);}
for(const [button,key,total] of [['powerCycle','selectedPower',5],['fieldCycle','fieldLevel',3],['coverShapeCycle','coverShape',2]]){
 const s=fixture(),p=s.players[0],start=key==='fieldLevel'?a.psychicField(p).level:p[key]||0;
 for(let n=0;n<30;n++)tick(s,{[button]:true,x:1,aim:0});
 assert.equal(p[key],(start+1)%total,button+' hold repeats');assert(p.x>350,'selection stopped movement');
 tick(s,{});tick(s,{[button]:true});assert.equal(p[key],(start+2)%total);
}
// Selector presses must not alter an existing slide or a committed glove action.
for(const mode of ['slide','glove']){
 const states=[fixture(),fixture()];states.forEach(s=>{if(mode==='slide')Object.assign(s.players[0],{slide:.4,vx:490,slideFacing:0});});
 for(let k=0;k<12;k++)states.forEach((s,n)=>tick(s,{x:1,aim:0,melee:mode==='glove',powerCycle:n===1&&k===3,coverShapeCycle:n===1&&k===5}));
 for(const key of ['x','y','vx','vy','slide','battery','gloveHoldStarted','gloveCharge','lastMelee'])assert.equal(states[0].players[0][key],states[1].players[0][key],mode+'/'+key);
}
// Existing soft-cover traversal and deliberate outward escape, independent of aim.
let s=fixture(),p=s.players[0],cv={id:'fixture',x:400,y:330,w:100,h:24,a:0,z:32,hp:280,maxHp:280,build:0};s.covers=[cv];p.x=400;p.y=365;assert(a.attachCover(p,cv,s));const anchor={...p.coverAnchor},before={x:p.x,y:p.y};a.moveOnCover(p,s,{...p.input,x:anchor.tx,y:anchor.ty},.1);assert(Math.hypot(p.x-before.x,p.y-before.y)>0);a.moveOnCover(p,s,{...p.input,x:anchor.nx,y:anchor.ny,aim:Math.PI,coverAim:true},.016);assert.equal(p.coverId,null);
// Actual impact: material and contact location, normal strength, damage unchanged.
function impact(vx,vy){const s=fixture(),moving={...cv,id:'moving',x:450,y:330,w:40,build:-1,vx,vy,throwOwner:0},wall={...cv,id:'wall',x:480,y:330,w:40};s.covers=[moving,wall];a.coverImpact(moving,s,wall.id,wall,{x:-1,y:0});return {s,moving,fx:s.fx.at(-1)};}
const solid=impact(400,0),glance=impact(40,400);assert.equal(solid.fx.x,460);assert.equal(solid.fx.y,330);assert.equal(solid.fx.strength,1);assert(glance.fx.strength<.2);assert.equal(solid.moving.hp,240);assert.equal(solid.fx.text,'metal');
const cards=selectionCards22(p,s);assert.equal(cards.length,4);assert.equal(cards[0].name,'SHOTGUN');assert.equal(cards[3].name,'WIDE');
for(const x of [100,500,900])for(const y of [100,330,520]){const c=encounterCamera22({x,y,aim:0,vx:222,vy:0},{x:x+100,y},true);assert(c.zoom>=2.65&&c.zoom<=2.77+1e-9);assert(Number.isFinite(c.x)&&Number.isFinite(c.y));}
// Exercise the actual API handlers as two authenticated clients, with deterministic clock.
(async()=>{const {POST,GET}=require('../app/api/game/route.ts'),store=require('../lib/roomStore.ts');let now=100000;const original=Date.now;Date.now=()=>now;
 const post=async b=>{const r=await POST(new Request('http://qa/api/game',{method:'POST',body:JSON.stringify(b)}));return {status:r.status,...await r.json()};};
 const host=await post({action:'create',mode:'duel',name:'Host'}),guest=await post({action:'join',room:host.room,code:host.code,name:'Guest'});assert.equal(guest.slot,1);assert.equal(guest.state.phase,'countdown');assert(!JSON.stringify(guest.state).includes(host.token));
 const room=store.readRoom(host.room);room.state.phase='playing';room.state.fightUntil=0;
 assert.equal((await post({action:'input',room:host.room,token:'bad',seq:1,input:{}})).status,403);
 for(let k=1;k<=8;k++){now+=17;for(const client of [host,guest])await post({action:'input',room:host.room,token:client.token,seq:k,input:{powerCycle:true,coverShapeCycle:true}});}
 const read=async client=>(await (await GET(new Request('http://qa/api/game?room='+host.room+'&token='+client.token))).json()).state;
 const h=await read(host),g=await read(guest);assert.deepEqual(h,g);assert.equal(h.players[0].selectedPower,1);assert.equal(h.players[1].selectedPower,1);assert.equal(h.players[0].coverShape,1);
 now+=500;store.tickRoom(room,now);assert.equal(room.state.players[0].input.coverShapeCycle,false);
 room.state.phase='finished';room.state.players[0].score=3;await post({action:'rematch',room:host.room,token:host.token});await post({action:'rematch',room:host.room,token:guest.token});assert.equal(room.state.phase,'countdown');assert(room.state.players.every(p=>p.score===0));
 store.rooms.delete(host.room);Date.now=original;console.log('PASS22 selectors hold/release/reconnect; movement/slide/commitment invariance; soft traverse/escape; contact feedback; camera bounds; actual API two-client auth, selections, identical snapshots, stale input and rematch. Not a browser or physical-controller test.');
})().catch(e=>{console.error(e);process.exitCode=1;});
