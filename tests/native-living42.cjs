const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict'),{stripTypeScriptTypes}=require('node:module'),{performance}=require('perf_hooks'),{createCanvas,loadImage}=require(process.env.CANVAS_MODULE);
(async()=>{
const c={exports:{},Math,performance,navigator:{getGamepads:()=>[]},crypto:require('crypto').webcrypto,setTimeout,clearTimeout};vm.createContext(c);
for(const f of ['bayBridgeMap','bayBridgePresentation','cover-occlusion','game'])vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/'+f+'.ts','utf8')).replace(/^import .*\n/gm,'').replace(/export /g,''),c);
vm.runInContext('const cameraState=bayRenderCamera;',c);
vm.runInContext(ts.transpileModule(fs.readFileSync('app/Game.tsx','utf8').replace(/^import .*\n/gm,''),{compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText+';globalThis.a={matter,updateChips42,drawChip42,chips42,environmentAssets,newGame,setInput,advance,draw,safeState,jade,BAY_OBJECTS,cameraState,cover,fx};',c);
const a=c.a;async function im(file){const i=await loadImage(file);Object.defineProperties(i,{complete:{value:true},naturalWidth:{value:i.width},naturalHeight:{value:i.height}});return i;}
a.environmentAssets.set('matter42',await im('public/assets/matter42/tumble-atlas.webp'));
for(const shell of ['world-road','world-bridge','world-far',...new Set(a.BAY_OBJECTS.map(o=>o.renderedShell))])a.environmentAssets.set(shell,await im('public/assets/bay-bridge/manga-v13/'+shell+'.webp'));
const jade=await im('../reference/jade-ready-d03.webp');for(let n=0;n<24;n++)a.jade.set('ready-'+n,jade);
const output=process.argv[2]||'../matter42-review';fs.mkdirSync(output,{recursive:true});fs.mkdirSync(output+'/frames',{recursive:true});
const s=a.newGame('Les','t',1000,'practice');s.phase='playing';s.covers=[];s.players.forEach(p=>p.bot=false);s.players[0].x=190;s.players[0].y=460;s.players[1].x=850;s.players[1].y=500;
a.updateChips42(s);assert.equal(a.chips42.length,144);assert(a.chips42.every(ch=>ch.rest));
const before=JSON.stringify(s.matter);s.fx=[{id:'human',type:'hit',material:'digital',x:300,y:300,life:.32}];a.updateChips42(s);assert.equal(a.chips42.length,144,'human hits do not create cyberfluid');
s.fx.push({id:'bot',type:'hit',material:'cyber',x:450,y:300,life:.32});a.updateChips42(s);assert.equal(a.chips42.filter(ch=>ch.kind==='cyber').length,18);a.updateChips42(s);assert.equal(a.chips42.length,162,'effect consumed once');
for(let n=0;n<30;n++)s.fx.push({id:'break'+n,type:'cover-break',x:400,y:300,life:.8,text:n%2?'metal':'stone'});a.updateChips42(s);assert.equal(a.chips42.length,192);assert.equal(JSON.stringify(s.matter),before,'cosmetics do not mutate resources');
s.round++;s.fx=[];a.updateChips42(s);assert.equal(a.chips42.length,144,'round reset clears chips/events');
const sheet=createCanvas(1200,720),g=sheet.getContext('2d');g.fillStyle='#162231';g.fillRect(0,0,1200,720);
for(let row=0;row<6;row++)for(let col=0;col<8;col++){g.save();g.translate(60+col*150,75+row*110);g.scale(4,4);a.matter(g,{x:0,y:0,r:8,kind:row<3?'stone':'metal',fragment:row%3,spin:col*Math.PI/4,heldBy:null,orbitBy:null});g.restore();}
fs.writeFileSync(output+'/families.png',sheet.toBuffer('image/png'));
// Production room renderer: approved ready artwork is used only for this static QA fixture.
a.cameraState.ready=false;const scene=createCanvas(1000,620);a.draw(scene,a.safeState(s),0,{x:500,y:310,down:false},{},-1,-1,0);fs.writeFileSync(output+'/room.png',scene.toBuffer('image/png'));
// Actual cosmetic simulation and production sprite renderer, without substituting procedural shards.
s.createdAt++;s.players[0].x=165;s.players[0].y=460;a.updateChips42(s);const canvas=createCanvas(700,400),cg=canvas.getContext('2d'),timings=[];
for(let frame=0;frame<150;frame++){s.time+=1/60;s.players[0].vx=frame<65?430:0;s.players[0].vy=0;if(frame<65)s.players[0].x+=430/60;
 const begin=performance.now();a.updateChips42(s);cg.fillStyle='#162231';cg.fillRect(0,0,700,400);cg.save();cg.translate(-70,-280);cg.scale(1.4,1.4);for(const chip of a.chips42)a.drawChip42(cg,chip);for(const m of s.matter)a.matter(cg,m);cg.fillStyle='#75edff';cg.beginPath();cg.ellipse(s.players[0].x,s.players[0].y,9,5,0,0,Math.PI*2);cg.fill();cg.restore();timings.push(performance.now()-begin);if(frame%3===0)fs.writeFileSync(output+'/frames/'+String(frame).padStart(3,'0')+'.png',canvas.toBuffer('image/png'));
}
assert(a.chips42.some(ch=>ch.lastKick>0),'actual boots disturb cosmetic rubble');
for(let n=0;n<600;n++){s.time+=1/60;a.updateChips42(s);}assert(a.chips42.every(ch=>ch.rest||ch.life<=0),'chips settle and sleep');
timings.sort((a,b)=>a-b);console.log('PASS42 native production sprites/pool/reset/bot-only cyberfluid/scattering/sleep. Native CPU effect update+draw milliseconds:',JSON.stringify({median:timings[75],p95:timings[142],max:timings[149],count:a.chips42.length}));console.log('QA room is a static-art fixture, not a live controller or iPad FPS measurement.');
})().catch(e=>{console.error(e);process.exitCode=1});

