const assert=require("node:assert/strict"),fs=require("node:fs"),ts=require("typescript");
require.extensions[".ts"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,"utf8"),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,f);
const {LocalCombat}=require("../lib/localCombat.ts");
function drill(character,mode="practice",unlimited=false){
 const l=new LocalCombat(character,mode,0,{version:1,battery:unlimited?"unlimited":"current",opponent:"target"},character,()=>true);
 const s=l.state,p=s.players[0];s.phase="playing";s.covers=[];s.matter=[];s.players[1].bot=false;
 let frame=0;l.frame(0,{},[]);
 const tick=(input={},n=1)=>{while(n--)l.frame(++frame*1000/60,{aim:0,...input},[])};
 return {s,p,tick};
}
for(const character of ["jade","raptor"])for(const mode of ["bot","practice"]){
 const {s,p,tick}=drill(character,mode);assert.equal(p.shells,8);
 p.shells=0;p.battery=100;tick({},120);assert.equal(p.shells,0);
 tick({fire:true});assert.equal(s.fx.filter(f=>f.type==="empty-click").length,1);
 tick({powerup:true,fire:true},29);assert.equal(p.shells,0);
 tick({powerup:true,fire:true});assert.equal(p.shells,1);
 tick({fire:true},60);assert.equal(p.shells,1);
 tick({});tick({fire:true});assert.equal(p.shells,0);
 tick({});tick({powerup:true},239);assert.equal(p.shells,7);tick({powerup:true});assert.equal(p.shells,8);
 tick({powerup:true},45);assert.equal(p.shells,8);assert.equal(p.shellLoad,0);
 const b=drill(character,mode);b.p.battery=5;b.tick({powerup:true},60);assert.ok(b.p.battery>5);assert.equal(b.p.shells,8);
 const d=drill(character,mode);d.p.shells=2;d.tick({powerup:true},45);assert.equal(d.p.shells,3);
 d.tick({slide:true,x:1});assert.equal(d.p.shellLoad,0);assert.equal(d.p.shells,3);
 d.tick({},50);d.tick({fire:true});assert.equal(d.p.shells,2);
}
const u=drill("jade","practice",true);u.tick({fire:true});assert.equal(u.p.shells,8);
console.log("PASS finite War/Training both fighters, independent meters, interruption, held RT, dry trigger, unlimited Training.");
