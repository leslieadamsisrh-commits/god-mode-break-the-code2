const assert=require('node:assert/strict');const base=process.env.TEST_BASE||'http://127.0.0.1:3100';
async function post(body,status=200){const r=await fetch(base+'/api/game',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const v=await r.json();assert.equal(r.status,status,JSON.stringify(v));return v;}
(async()=>{
 const rules={version:1,battery:'unlimited',opponent:'sparring'};
 await post({action:'create',mode:'duel',rules31:{...rules,battery:'invalid'}},400);
 const h=await post({action:'create',mode:'duel',rules31:rules},201),host={room:h.room,token:h.token};assert.deepEqual(h.state.rules31,rules);
 await post({action:'rules31',...host,rules31:{...rules,version:2}},400);
 const g=await post({action:'join',room:h.room,code:h.code}),guest={room:g.room,token:g.token};assert.deepEqual(g.state.rules31,rules);
 assert.match((await post({action:'rules31',...guest,rules31:{...rules,battery:'current'}},400)).error,/HOST_ONLY/);
 assert.match((await post({action:'rules31',...host,rules31:{...rules,battery:'current'}},400)).error,/RULES_LOCKED/);
 for(let i=0;i<34;i++){await new Promise(r=>setTimeout(r,100));await fetch(base+'/api/game?'+new URLSearchParams(host));}
 await post({action:'input',...host,seq:1,input:{cover:true,aim:0}});await new Promise(r=>setTimeout(r,300)); // Build37 assembly is intentionally not instant.
 const a=await (await fetch(base+'/api/game?'+new URLSearchParams(host))).json(),b=await (await fetch(base+'/api/game?'+new URLSearchParams(guest))).json();
 assert.equal(a.state.players[0].battery,100);assert.equal(b.state.players[0].battery,100);assert(a.state.players[0].gripCoverId);assert.equal(a.state.players[0].gripCoverId,b.state.players[0].gripCoverId);
 const reset=await post({action:'reset',...host});assert.deepEqual(reset.state.rules31,rules);assert(!reset.state.players.some(p=>p.gripCoverId));
 const old=await post({action:'create',mode:'duel'},201);assert.equal(old.state.rules31,undefined);
 console.log('PASS31 HTTP: validated host rules, guest rejection, active-round lock, independent client agreement, unlimited build, rematch and missing-rule compatibility');
})().catch(e=>{console.error(e);process.exitCode=1});
