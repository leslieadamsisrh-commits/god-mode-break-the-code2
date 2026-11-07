const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict'),vm=require('node:vm');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,resolveJsonModule:true}}).outputText,p);
const {coverExposed13,coverStride13}=require('../lib/raptorCover11.ts');
const source=fs.readFileSync('app/Game.tsx','utf8'),ast=ts.createSourceFile('Game.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const code=ast.statements.filter(n=>ts.isFunctionDeclaration(n)&&['spriteFacing','coverVisualOffset'].includes(n.name?.text)).map(n=>n.getText(ast)).join('\n');
const ctx={Math,coverExposed13,coverTopology:()=> 'FACE'};vm.createContext(ctx);vm.runInContext(ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText,ctx);
for(const angle of [0,Math.PI/4,Math.PI/2,Math.PI,Math.PI*1.5]){
 const p={coverId:'wall',coverMode:'braced',coverAnchor:{nx:Math.cos(angle),ny:Math.sin(angle),tx:-Math.sin(angle),ty:Math.cos(angle),face:'top'},gunFacing:angle+1,input:{coverAim:true},recoil:.2,returnToCover:.16,peek:false};
 for(const state of ['hold','brace','shuffle','retract','catch','drive']){
  const q={...p,coverState11:state};assert.equal(coverExposed13(q),false);assert.ok(Math.abs(Math.cos(ctx.spriteFacing(q,'cover',30)-angle)-1)<1e-9);
  assert.deepEqual(ctx.coverVisualOffset(q),ctx.coverVisualOffset({...q,input:{coverAim:false},recoil:0,returnToCover:0}));
 }
 for(const state of ['expose','fire'])assert.equal(ctx.spriteFacing({...p,coverState11:state},'cover',30),p.gunFacing);
}
let p={x:0,y:0,coverId:'wall',coverSpeed:60},m=coverStride13(undefined,p,0);
m=coverStride13(m,{...p,x:6},.1);assert.equal(m.phase,1/3);
const stopped=coverStride13(m,{...p,x:6,coverSpeed:0},.2);assert.equal(stopped.phase,m.phase);
const gap=coverStride13(stopped,{...p,x:6},5);assert.equal(gap.phase,0);
const teleport=coverStride13(gap,{...p,x:300},5.1);assert.equal(teleport.phase,0);
const changed=coverStride13(m,{...p,coverId:'other',x:8},.2);assert.equal(changed.phase,0);
assert.ok(!source.includes('if(splitCover&&renderIm)'),'no duplicate lower-body prepass');
console.log('PASS contact13: real renderer facing/offset under blocked aim and stale timers; five wall normals; actual-distance stride, rest/gap/teleport/reattach; single body layer.');
const {advanceRaptorPose}=require('../lib/raptorPose.ts'),manifest=require('../public/assets/raptor-v2/manifest.json');
const {loadImage}=require('@napi-rs/canvas');
for(const state of ['hold','brace','retract']){
 const r=advanceRaptorPose(undefined,{time:1,angle:-Math.PI/2,speed:0,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:true,firing:false,coverState11:state});
 assert.equal(r.frame.key,'cover-hold/back/000.png');
}
(async()=>{const key='cover-hold/back/000.png',path='public/assets/raptor-v2/'+key,bytes=fs.readFileSync(path),im=await loadImage(bytes);assert.equal(im.width,512);assert.equal(im.height,512);assert.equal(require('crypto').createHash('sha256').update(bytes).digest('hex'),manifest.frames[key].sha256);assert.deepEqual(manifest.frames[key].anchor,[250,384]);console.log('PASS rear hold/brace/retract selects saved 512px asset with verified hash and registered ground anchor')})().catch(e=>{console.error(e);process.exitCode=1});
