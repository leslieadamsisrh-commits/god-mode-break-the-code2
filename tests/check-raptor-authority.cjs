const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
global.crypto??=require('node:crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const inventory=require('../public/assets/raptor-v2/manifest.json');
const {LocalCombat}=require('../lib/localCombat.ts');
const G=require('../lib/game.ts'),{barrelSocket27d}=require('../lib/ballistics27d.ts'),{raptorBarrelSocket}=require('../lib/raptorSocket.ts');
const close=(a,b,label)=>assert(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
const session=new LocalCombat('Raptor','solo',0,undefined,'raptor');
assert.equal(session.state.players[0].character,'raptor');
assert.equal(session.reply().state.players[0].raptorFrame.family,'idle');
assert(!('raptorPose' in session.reply().state.players[0]),'private pose history is not transmitted');
assert(!('token' in session.reply().state.players[0]));
for(const value of [undefined,'jade','RAPTOR','other',{},1])assert.equal(new LocalCombat('Default','solo',0,undefined,value).state.players[0].character,'jade');
session.command({token:session.token,room:session.room,action:'reset'});
assert.equal(session.state.players[0].character,'raptor','reset preserves chosen character');
assert.equal(session.state.players[0].raptorFrame.family,'idle','reset starts fresh pose history');
G.setInput(session.state,0,1,{character:'jade',raptorFrame:{key:'fake'},fire:false});
assert.equal(session.state.players[0].character,'raptor','input cannot change actor identity');
assert.notEqual(session.state.players[0].raptorFrame.key,'fake','input cannot inject an authoritative frame');
const p=session.state.players[0];p.x=750;p.y=420;p.gunFacing=p.aim=0;
G.refreshRaptorPose(p,session.state.time,session.state.config.slideDuration);
const record=inventory.frames[p.raptorFrame.key],original=JSON.parse(JSON.stringify(record));
delete record.muzzle;delete record.muzzleGround;
assert(!barrelSocket27d(p).raptorAligned,'unregistered frame explicitly remains on fallback');
record.muzzle=[record.anchor[0]+100,record.anchor[1]-120];
record.muzzleGround=[record.muzzle[0],record.anchor[1]-12];
let expected=raptorBarrelSocket(p,record,session.state.config.spriteScale),actual=barrelSocket27d(p,session.state.config.spriteScale);
assert(actual.raptorAligned);for(const axis of ['x','y','z'])close(actual[axis],expected[axis],'registered '+axis);
assert(!barrelSocket27d({...p,character:'jade'}).raptorAligned,'Jade ignores Raptor metadata');

// Synthetic muzzle fixture is process-local and never writes manifest/artwork.
session.state.covers=[];session.state.matter=[];session.state.config.shotSpread=0;
G.setInput(session.state,0,2,{x:0,y:0,aim:0,fire:true,aimX:expected.x+200,aimY:expected.y,aimZ:expected.z+40});
G.advance(session.state,1000/60);
const fx=session.state.fx.find(f=>f.type==='muzzle');assert(fx,'normal input fired');
expected=barrelSocket27d(p,session.state.config.spriteScale);
for(const axis of ['x','y','z'])close(fx[axis],expected[axis],'shared muzzle FX '+axis);
assert.equal(session.state.shots.length,7,'pellet count unchanged');
for(const shot of session.state.shots){
 close(shot.vx,session.state.config.shotSpeed,'projectile speed preserved');close(shot.vy,0,'projectile heading preserved');
 close(shot.vz,session.state.config.shotSpeed*.2,'vertical aiming uses the same muzzle XY');
 assert.equal(shot.damage,session.state.config.shotDamage);
}
assert.equal(p.raptorFrame.key,'idle/right/000.png','rendered frame identifies shot socket');
delete record.muzzle;delete record.muzzleGround;Object.assign(record,original);

for(let direction=0;direction<8;direction++){
 const local=new LocalCombat('direction','solo',0,undefined,'raptor'),s=local.state,actor=s.players[0],angle=direction*Math.PI/4;
 s.covers=[];s.matter=[];actor.x=750;actor.y=420;actor.gunFacing=actor.aim=angle;
 G.refreshRaptorPose(actor,s.time,s.config.slideDuration);
 const registration=inventory.frames[actor.raptorFrame.key],saved=JSON.parse(JSON.stringify(registration));
 registration.muzzle=[registration.anchor[0]+Math.cos(angle)*80,registration.anchor[1]-120+Math.sin(angle)*10];
 registration.muzzleGround=[registration.muzzle[0],registration.anchor[1]];
 delete registration.muzzleVisibility;delete registration.muzzleFallback;delete registration.muzzleNote;
 G.setInput(s,0,1,{aim:angle,fire:true});G.advance(s,1000/60);
 const source=barrelSocket27d(actor,s.config.spriteScale),flash=s.fx.find(f=>f.type==='muzzle');assert(source.raptorAligned&&flash);
 for(const axis of ['x','y','z'])close(flash[axis],source[axis],'direction '+direction+' source '+axis);
 assert.equal(s.shots.length,7);assert.equal(actor.raptorFrame.key.split('/')[1],['right','front-right','front','front-left','left','back-left','back','back-right'][direction]);
 delete registration.muzzle;delete registration.muzzleGround;Object.assign(registration,saved);
}

// A nearby physical barrier still consumes registered-origin projectiles.
const blocked=new LocalCombat('wall','solo',0,undefined,'raptor'),wallState=blocked.state,wallActor=wallState.players[0];
wallActor.x=750;wallActor.y=420;wallActor.gunFacing=wallActor.aim=0;wallState.matter=[];
G.refreshRaptorPose(wallActor,0,wallState.config.slideDuration);
const wallRecord=inventory.frames[wallActor.raptorFrame.key],wallSaved=JSON.parse(JSON.stringify(wallRecord));
wallRecord.muzzle=[wallRecord.anchor[0]+100,wallRecord.anchor[1]-120];
wallRecord.muzzleGround=[wallRecord.muzzle[0],wallRecord.anchor[1]];
const start=barrelSocket27d(wallActor,wallState.config.spriteScale),wall={...wallState.covers[0],id:'socket-test-wall',fracture32:undefined,artId:undefined,x:start.x+8,y:start.y,w:4,h:80,a:0,hp:1000,maxHp:1000,height27j:200,z:0,hover:0,coverClass:'tall'};
wallState.covers=[wall];G.setInput(wallState,0,1,{aim:0,fire:true});G.advance(wallState,1000/60);
assert.equal(wallState.shots.length,0,'near-wall volley is consumed by existing swept collision');assert(wall.hp<1000);
delete wallRecord.muzzle;delete wallRecord.muzzleGround;Object.assign(wallRecord,wallSaved);

// Identically named independent local simulations must not share animation memory.
const a=new LocalCombat('same','solo',0,undefined,'raptor'),b=new LocalCombat('same','solo',0,undefined,'raptor');
a.state.covers=[];b.state.covers=[];
for(let i=1;i<=20;i++){G.setInput(a.state,0,i,{x:1,y:0,aim:0});G.advance(a.state,i*1000/60);G.advance(b.state,i*1000/60);}
assert.equal(b.state.players[0].raptorFrame.family,'idle');
assert.notEqual(a.state.players[0].raptorFrame.family,'idle');
assert.notStrictEqual(a.state.players[0].raptorPose,b.state.players[0].raptorPose);
console.log('PASS local identity validation/reset, per-room pose isolation, safeState privacy, input isolation, explicit missing-socket fallback, eight-direction shared shot/FX origin, shared vertical aim, seven-pellet ballistics and near-wall obstruction');
