const assert=require('node:assert/strict');
const base=process.env.TEST_BASE||'http://localhost:3100';
async function request(body,expected=200){const r=await fetch(base+'/api/game',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const j=await r.json();assert.equal(r.status,expected,JSON.stringify(j));return j;}
async function get(c){const r=await fetch(base+'/api/game?room='+c.room+'&token='+c.token);assert(r.ok);return r.json();}
(async()=>{
 const h=await request({action:'create',mode:'duel',name:'27H HOST'},201),host={room:h.room,token:h.token};
 const layout=structuredClone(h.state.arenaLayout);layout.name='HTTP shared layout';layout.placements=layout.placements.slice(0,8);
 const changed=await request({action:'arenaLayout',...host,layout});assert.equal(changed.state.covers.length,layout.placements.length);
 const j=await request({action:'join',room:h.room,code:h.code,name:'27H GUEST'}),guest={room:h.room,token:j.token};
 assert.deepEqual(j.state.arenaLayout,changed.state.arenaLayout);assert.deepEqual(j.state.covers,changed.state.covers);
 assert.equal((await request({action:'arenaLayout',...guest,layout},400)).error,'HOST_ONLY');
 await request({action:'arenaLayout',...host,layout},400);
 for(let i=0;i<34;i++){await new Promise(r=>setTimeout(r,100));await get(host);}
 await request({action:'input',...host,seq:1,input:{jump:true,fire:true,aim:0}});
 await new Promise(r=>setTimeout(r,70));
 const [a,b]=await Promise.all([get(host),get(guest)]);assert(a.state.players[0].z>0&&b.state.players[0].z>0);assert.equal(b.state.players[0].shells,7);
 await request({action:'input',...guest,seq:1,input:{jump:true,shield:true}});await new Promise(r=>setTimeout(r,40));
 const d=await get(host);assert(d.state.players[1].z>0&&d.state.players[1].shield);
 await request({action:'input',...host,seq:2,input:{powerUse:true}});
 await request({action:'input',...guest,seq:2,input:{powerUse:true}});
 await new Promise(r=>setTimeout(r,50));
 const fieldHost=await get(host),fieldGuest=await get(guest);
 assert(fieldHost.state.players.every(p=>p.timeFieldActive));assert(fieldGuest.state.players.every(p=>p.timeFieldActive));
 assert.deepEqual(fieldHost.state.players.map(p=>p.timeUntil27g),fieldGuest.state.players.map(p=>p.timeUntil27g));
 await request({action:'input',...host,seq:3,input:{cover:true,aim:0}});
 await new Promise(r=>setTimeout(r,70));const hold=await get(host),seenHold=await get(guest);assert(hold.state.players[0].gripCoverId);assert.equal(hold.state.players[0].gripCoverId,seenHold.state.players[0].gripCoverId);const id=hold.state.players[0].gripCoverId;assert(Math.abs(hold.state.covers.find(c=>c.id===id).z-seenHold.state.covers.find(c=>c.id===id).z)<=355*Math.abs(hold.state.time-seenHold.state.time)+1,"height difference must fit snapshot time difference");
 await request({action:'rematch',...host});const reset=await get(guest);
 assert.deepEqual(reset.state.arenaLayout,layout);assert.deepEqual(reset.state.covers,changed.state.covers);assert(reset.state.players.every(p=>p.z===0&&p.grounded));assert.equal(reset.state.round,2);assert(reset.state.players.every(p=>!p.timeFieldActive&&!p.followUntil27g));
 console.log('PASS27H HTTP two clients: shared host layout, matching objects, guest rejection, live editing rejection, airborne fire/shield replication, replicated held-cover ID and height, dedicated bullet-time fields, rematch layout/elevation/field reset');
})().catch(e=>{console.error(e);process.exitCode=1;});
