const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const text=fs.readFileSync('app/Game.tsx','utf8'),start=text.indexOf('const PSYCHIC_RECTS='),end=text.indexOf('function fighter(',start),image={};
const ctx={powerDirection:p=>p.dir,powerAssets:new Map([['psychic-d03-v1',image]])};vm.createContext(ctx);vm.runInContext(stripTypeScriptTypes(text.slice(start,end))+';globalThis.api={psychicFrame,drawPsychicPose};',ctx);
const {psychicFrame:f,drawPsychicPose:draw}=ctx.api;const p={dir:3,gripCoverId:'cover',psychicStartedAt:1};
assert.equal(f(p,1.05),0);assert.equal(f(p,1.2),1);assert.equal(f({...p,dir:4},1.2),null);assert.equal(f({...p,charging:true},1.2),null);assert.equal(f({...p,slide:.2},1.2),null);
assert.equal(f({dir:3,psychicReturnUntil:1.3},1.2),2);assert.equal(f({dir:3,psychicReturnUntil:1.3,input:{fire:true}},1.2),null);assert.equal(f({dir:3,psychicReturnUntil:1.3},1.4),null);
for(let n=0;n<3;n++){let args;assert(draw({drawImage:(...a)=>args=a},{x:300,y:330,psychicPreview:n},1,{spriteScale:.82}));assert.equal(args[0],image);assert.equal(args[8],768*(125*178/250/697)*.82);assert(args[1]+args[3]<=2048);assert.equal(args[2]+args[4],768);}
ctx.powerAssets.clear();assert.equal(f(p,1.2),null);
assert.equal(fs.readFileSync('public/assets/god-frame/psychic-d03-v1.png').equals(fs.readFileSync('art/combat-cohesion/d03-psychic/sequence-review.png')),true);
console.log('PASS: psychic reach/hold/retract routing, immediate overrides, direction/asset fallback, uniform scale and byte-identical source.');
