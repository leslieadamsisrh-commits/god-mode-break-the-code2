const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{stripTypeScriptTypes}=require('node:module');
let now=1000;class Clock extends Date{static now(){return now}}
const ctx={Math,Date:Clock,crypto:require('crypto').webcrypto,Response,Request,URL};vm.createContext(ctx);
for(const file of ['lib/bayBridgeMap.ts','lib/game.ts','app/api/game/route.ts'])vm.runInContext(stripTypeScriptTypes(fs.readFileSync(file,'utf8')).replace(/^import .*\n/gm,'').replace(/export /g,''),ctx);
vm.runInContext('globalThis.api={GET,POST,rooms,advance,startOrRematch};',ctx);
(async()=>{const a=ctx.api;async function post(b){const r=await a.POST(new Request('http://audit/api/game',{method:'POST',body:JSON.stringify(b)}));return{status:r.status,...await r.json()}}
const host=await post({action:'create',mode:'duel',name:'Les'});assert.equal(host.status,201);assert.equal(host.state.phase,'lobby');assert.equal(host.state.players.length,1);assert(!('token' in host.state.players[0]));
assert.equal((await post({action:'start',room:host.room,token:host.token})).status,400);
assert.equal((await post({action:'join',room:host.room,code:'wrong'})).status,400);
const guest=await post({action:'join',room:host.room,code:host.code,name:'James'});assert.equal(guest.slot,1);assert.equal(guest.state.players.length,2);assert.equal((await post({action:'join',room:host.room,code:host.code})).status,409);
assert.equal((await post({action:'config',room:host.room,token:guest.token,patch:{moveSpeed:1}})).status,400);
let v=await post({action:'start',room:host.room,token:host.token});assert.equal(v.state.phase,'countdown');const s=a.rooms.get(host.room).state;now+=3100;for(let i=0;i<13;i++){now+=250;a.advance(s,now)}assert.equal(s.phase,'playing');
const before=s.players.map(p=>({x:p.x,y:p.y}));await post({action:'input',room:host.room,token:guest.token,seq:1,input:{x:-1,aim:Math.PI}});for(let i=0;i<15;i++){now+=16;a.advance(s,now)}assert(s.players[1].x<before[1].x);assert.equal(s.players[0].x,before[0].x);assert.equal(s.players[1].lastSeq,1);
assert.equal((await post({action:'input',room:host.room,token:'invalid',seq:1,input:{fire:true}})).status,403);
s.covers=[];s.players[0].x=400;s.players[0].y=310;s.players[1].x=500;s.players[1].y=310;s.players[1].hp=10;s.players[1].vx=s.players[1].vy=0;s.players[1].input.x=0;
s.shots.push({id:'lethal',x:500,y:310,z:30,vx:0,vy:0,life:1,owner:0,damage:10});now+=16;a.advance(s,now);assert.equal(s.phase,'finished');assert.equal(s.winner,0);assert.equal(s.players[0].score,1);assert.equal(s.players[1].hp,0);
now+=16;a.advance(s,now);assert.equal(s.players[0].score,1);v=await post({action:'rematch',room:host.room,token:guest.token});assert.equal(v.state.phase,'finished');v=await post({action:'rematch',room:host.room,token:host.token});assert.equal(v.state.phase,'countdown');assert.equal(v.state.players[1].hp,v.state.config.maxHealth);assert.equal(v.state.players[0].score,1);
console.log('PASS: two API clients; private join, full-room rejection, token ownership, guest-only movement, host-only config/start/rematch, lethal shotgun round completion and retained score.');})().catch(e=>{console.error(e);process.exitCode=1});
