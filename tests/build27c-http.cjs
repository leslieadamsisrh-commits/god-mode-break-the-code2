const assert=require('node:assert/strict');
const base=process.env.TEST_BASE||'http://localhost:3100';
async function request(body,expected=200){const r=await fetch(base+'/api/game',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const j=await r.json();assert.equal(r.status,expected,JSON.stringify(j));return j;}
async function get(c){const r=await fetch(base+'/api/game?room='+c.room+'&token='+c.token);assert(r.ok);return r.json();}
(async()=>{
 const h=await request({action:'create',mode:'duel',name:'27C HOST'},201),host={room:h.room,token:h.token};
 const layout=structuredClone(h.state.arenaLayout);layout.name='HTTP shared layout';layout.placements=layout.placements.slice(0,8);
 const changed=await request({action:'arenaLayout',...host,layout});assert.equal(changed.state.covers.length,8);
 const j=await request({action:'join',room:h.room,code:h.code,name:'27C GUEST'}),guest={room:h.room,token:j.token};
 assert.deepEqual(j.state.arenaLayout,changed.state.arenaLayout);assert.deepEqual(j.state.covers,changed.state.covers);
 assert.equal((await request({action:'arenaLayout',...guest,layout},400)).error,'HOST_ONLY');
 await request({action:'arenaLayout',...host,layout},400);
 for(let i=0;i<34;i++){await new Promise(r=>setTimeout(r,100));await get(host);}
 await request({action:'input',...host,seq:1,input:{jump:true,fire:true,aim:0}});
 await new Promise(r=>setTimeout(r,70));
 const [a,b]=await Promise.all([get(host),get(guest)]);assert(a.state.players[0].z>0&&b.state.players[0].z>0);assert.equal(b.state.players[0].shells,7);
 await request({action:'input',...guest,seq:1,input:{jump:true,shield:true}});await new Promise(r=>setTimeout(r,40));
 const d=await get(host);assert(d.state.players[1].z>0&&d.state.players[1].shield);
 await request({action:'rematch',...host});const reset=await get(guest);
 assert.deepEqual(reset.state.arenaLayout,layout);assert.deepEqual(reset.state.covers,changed.state.covers);assert(reset.state.players.every(p=>p.z===0&&p.grounded));assert.equal(reset.state.round,2);
 console.log('PASS27C HTTP two clients: shared host layout, matching objects, guest rejection, live editing rejection, airborne fire/shield replication, rematch layout and elevation reset');
})().catch(e=>{console.error(e);process.exitCode=1;});
