/* Actual game renderer + actual decoded PNG/WebP pixels, without a browser.
 * Canvas checks do not certify browser input, DOM layout or physical controllers.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const R=path.resolve(__dirname,'..'),P=path.join(R,'public');
async function main(){
 const ctx=vm.createContext({console,setTimeout,clearTimeout,devicePixelRatio:1,ResizeObserver:class{observe(){}}});ctx.window=ctx;
 for(const name of ['vendor/assets.js','vendor/asset-residency.js','vendor/cover-presentation.js','vendor/b05-fast.js','vendor/b06-fast.js','vendor/crouch-cycle.js','vendor/b11-fast.js','vendor/action-controller.js','vendor/core.js','vendor/motion-flow.js','vendor/stance-registration.js','vendor/cover-metadata.js','vendor/cover-router.js','slide-gate.js','duel-browser.js','fixture-setup.js','render.js'])vm.runInContext(fs.readFileSync(path.join(P,name),'utf8'),ctx,{filename:name});
 ctx.JadeResidency.browserLoader=()=>async file=>{
  const im=await loadImage(path.join(P,file));
  if(im.naturalWidth===undefined)Object.defineProperties(im,{naturalWidth:{get:()=>im.width},naturalHeight:{get:()=>im.height}});
  return im;
 };
 const canvas=createCanvas(1100,760);canvas.getBoundingClientRect=()=>({width:1100,height:760,left:0,top:0});
 const errors=[],renderer=new ctx.DuelRenderer(canvas,e=>errors.push(String(e)));await renderer.load();
 const w=new ctx.JadeLocalDuel.Duel();w.begin();Object.assign(w.players[1],{x:340,y:180,aim:Math.PI});
 const cases=[
  {name:'01-cover-contact',patch:{impact:.15}},
  {name:'02-attached-ready',patch:{}},
  {name:'03-left-crouch-candidate',patch:{vx:-120}},
  {name:'04-right-crouch-candidate',patch:{vx:120}},
  {name:'05-north-facing-fallback',patch:{aim:Math.PI,cover:{id:'station',face:'north',edge:null},y:-83}},
  {name:'06-corner-firing-legacy',patch:{cover:{id:'station',face:'south',edge:'right'},x:51,pose:2,raise:1,recoil:.1,aimHeld:true}}
 ];
 const shots=[];
 for(const spec of cases){
  w.players[0]=Object.assign(ctx.JadeCore.actor(-45,-5),{aim:0,cover:{id:'station',face:'south',edge:null}},spec.patch);
  renderer.accept({state:w.snapshot(),slot:0,names:['Jade','Jade']});renderer.draw();
  const file=path.join(R,'evidence',spec.name+'.png');fs.writeFileSync(file,canvas.toBuffer('image/png'));
  shots.push({file:path.relative(R,file),frame:renderer.inspect().frames[0]});
 }
 // Exercise real simulation travel with decoded art; record each selected frame.
 const sequence=[];ctx.JadeFixture.setup(w,0,'cover-movement');
 for(let tick=0;tick<100;tick++){
  const x=tick<15?-1:tick<45?0:tick<60?1:0;
  w.advance([{x,aim:0},{aim:Math.PI}]);renderer.accept({state:w.snapshot(),slot:0});renderer.draw();
  if(['R3-PASS','R3-LEFT','R3-RIGHT'].includes(renderer.inspect().frames[0]?.id))fs.writeFileSync(path.join(R,'evidence',renderer.inspect().frames[0].id+'.png'),canvas.toBuffer('image/png'));
  sequence.push({tick,x:w.players[0].x,vx:w.players[0].vx,frame:renderer.inspect().frames[0]});
 }
 fs.writeFileSync(path.join(R,'evidence/cover-motion-sequence.json'),JSON.stringify(sequence,null,2));
 const selected=[...new Set(sequence.map(s=>s.frame.id))];if(!['R3-PASS','R3-LEFT','R3-RIGHT'].every(id=>selected.includes(id)))throw Error('Incomplete new cycle: '+selected);
 const result={selected,method:'native Canvas, actual game renderer and decoded source images; not a browser playtest',errors,shots,renderer:renderer.inspect()};
 fs.writeFileSync(path.join(R,'evidence/native-render-check.json'),JSON.stringify(result,null,2));
 if(errors.length||result.renderer.counts.missing)throw Error('Render failed: '+JSON.stringify(result));
 console.log(JSON.stringify({scenes:shots.length,errors,missingDraws:result.renderer.counts.missing,decodedPixelBytes:result.renderer.residency.decodedPixelBytes}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
