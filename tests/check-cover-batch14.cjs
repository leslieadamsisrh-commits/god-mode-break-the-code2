const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict'),crypto=require('crypto');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose,RAPTOR_POSE_DIRECTIONS}=require('../lib/raptorPose.ts'),manifest=require('../public/assets/raptor-v2/manifest.json');
const {raptorSpritePlacement}=require('../lib/raptorSpriteOnly.ts');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
(async()=>{
 for(let d=0;d<8;d++){
  const angle=d*Math.PI/4,base={time:1,x:100,y:100,angle,speed:0,attached:true,sliding:false,airborne:false,verticalVelocity:0,hit:false,firing:false};
  for(const state of ['hold','brace','retract']){
   const r=advanceRaptorPose(undefined,{...base,coverState11:state});assert.equal(r.frame.key,`cover-hold/${RAPTOR_POSE_DIRECTIONS[d]}/000.png`);
   const entry=manifest.frames[r.frame.key],bytes=fs.readFileSync('public/assets/raptor-v2/'+r.frame.key),im=await loadImage(bytes);assert.equal(im.width,512);assert.equal(im.height,512);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256);
   const p=raptorSpritePlacement({x:100,y:100,scale:.7},entry);assert.ok(Math.abs(p.y+entry.anchor[1]*.7*entry.drawScale-100)<1e-8);
  }
  assert.equal(advanceRaptorPose(undefined,{...base,coverState11:'catch'}).frame.family,'slide');
  assert.equal(advanceRaptorPose(undefined,{...base,attached:false,coverState11:undefined}).frame.family,'idle');
 }
 const im=await loadImage('public/assets/jade-cover14/cover-d09.png');assert.equal(im.width,1500);assert.equal(im.height,250);
 const c=createCanvas(1500,250),g=c.getContext('2d');g.drawImage(im,0,0);const data=g.getImageData(0,0,1500,250).data;let green=0;
 for(let i=0;i<data.length;i+=4)if(data[i+3]>128&&data[i+1]>150&&data[i]<70&&data[i+2]<70)green++;
 assert.equal(green,0,'no opaque green guide arrows/rectangles');
 const pixels=n=>g.getImageData(n*250,0,250,250).data;assert.deepEqual(pixels(4),pixels(1),'retract settles into the protected hold');
 assert.ok(fs.readFileSync('app/Game.tsx','utf8').includes('family==="cover"&&d===9?"/assets/jade-cover14/cover-d09.png"'));
 console.log('PASS batch14: all 8 grounded hold/brace/retract directions, saved hashes/dimensions, ground registration, catch/free movement preserved; local Jade atlas dimensions, guide removal and protected retract.');
})().catch(e=>{console.error(e);process.exitCode=1});
