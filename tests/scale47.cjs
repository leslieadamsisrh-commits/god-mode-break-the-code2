const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{stripTypeScriptTypes}=require('node:module');
const c={Math};vm.createContext(c);vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/bayBridgePresentation.ts','utf8')).replace(/export /g,'')+';globalThis.a={setArenaContext46,withUpright,projectWorld,vertical46,withWorld46,ARENA_UPRIGHT_SCALE47};',c);const a=c.a;
// Canvas matrix fixture measures the actual sprite transform at its registered
// foot and compares a physical elevation with the same upright pixel distance.
let m={a:1,b:0,c:0,d:1,e:0,f:0},stack=[];
const g={setTransform(a,b,c,d,e,f){m={a,b,c,d,e,f};},save(){stack.push({...m});},restore(){m=stack.pop();},transform(a,b,c,d,e,f){const q=m;m={a:q.a*a+q.c*b,b:q.b*a+q.d*b,c:q.a*c+q.c*d,d:q.b*c+q.d*d,e:q.a*e+q.c*f+q.e,f:q.b*e+q.d*f+q.f};},translate(x,y){this.transform(1,0,0,1,x,y);}};
const point=(x,y)=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f});let count=0;
for(const zoom of [1.25,1.85,2.15])for(const p of [{x:230,y:330},{x:500,y:330},{x:770,y:330},{x:500,y:120},{x:500,y:510}]){
 const cam={x:500,y:330};a.setArenaContext46(g,cam,zoom,1,1);const floor=a.projectWorld(p.x,p.y,cam,zoom),top=a.projectWorld(p.x,p.y,cam,zoom,70);
 a.withUpright(g,p.x,p.y,()=>{const foot=point(p.x,p.y),head=point(p.x,p.y-70),right=point(p.x+70,p.y);assert(Math.hypot(foot.x-floor.x,foot.y-floor.y)<1e-8);assert(Math.hypot(head.x-top.x,head.y-top.y)<1e-8);assert(Math.abs(right.x-foot.x-70*zoom*.64)<1e-8);assert(Math.abs(right.y-foot.y)<1e-8);});
 a.withWorld46(g,p.x,p.y,()=>{const v=a.vertical46(p.x,p.y,70),raised=point(p.x+v.x,p.y+v.y);assert(Math.hypot(raised.x-top.x,raised.y-top.y)<1e-8);});count++;
}
assert.equal(a.ARENA_UPRIGHT_SCALE47,.64);
console.log('PASS47: '+count+' anchor/height/width registrations; upright characters, physical cover/effect elevation share64% presentation scale. Floor and aim mapping unchanged.');
