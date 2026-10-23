// Headless actual-renderer QA, not a browser/controller/performance test.
// Requires @napi-rs/canvas installed locally. Optional --baseline <git-ref>.
const fs=require('fs'),path=require('path'),Module=require('module'),ts=require('typescript'),cp=require('child_process'),assert=require('assert/strict');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const at=process.argv.indexOf('--baseline'),baseline=at>=0?process.argv[at+1]:null,tag=process.env.QA_TAG|| (baseline?'before21':'after21');
const source=p=>baseline?cp.execFileSync('git',['show',baseline+':'+path.relative(process.cwd(),p)],{encoding:'utf8',maxBuffer:4e6}):fs.readFileSync(p,'utf8');
const compile=s=>ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
require.extensions['.ts']=require.extensions['.tsx']=(m,p)=>m._compile(compile(source(p)+(p.endsWith('/lib/game.ts')?'\nexport {damageCover as qaDamageCover,coverImpact as qaCoverImpact};':'')),p);
global.crypto??=require('crypto').webcrypto;global.document={hidden:false,createElement:()=>createCanvas(300,150)};
const file=path.resolve('app/Game.tsx'),mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(path.dirname(file));mod._compile(compile(source(file)+'\nexport {draw as qaDraw,environmentAssets as qaAssets,coverCache46 as qaCache,jade as qaJade};'),file);
const {qaDraw,qaAssets,qaCache,qaJade}=mod.exports,{newGame,qaDamageCover,qaCoverImpact}=require('../lib/game.ts'),{D33_ATLASES20,d33ImageKey20}=require('../lib/dimension33MapArt20.ts'),{bayRenderCamera}=require('../lib/bayBridgePresentation.ts');
async function image(p){const im=await loadImage(p);Object.defineProperties(im,{complete:{value:true},naturalWidth:{value:im.width},naturalHeight:{value:im.height}});return im;}
(async()=>{
 for(const k of D33_ATLASES20)qaAssets.set(d33ImageKey20(k),await image('public/assets/dimension33/map20/'+k+'.webp'));
 qaAssets.set('war-foundation45',await image('public/assets/dimension33/arena-evolution.svg'));
 const jadeFile=process.env.JADE_QA_IMAGE||'.qa/ready-d03.webp';qaJade.set('ready-3',await image(jadeFile));
 const fresh=()=>{const s=newGame('QA','qa',1000,'watch');s.local=true;s.phase='playing';s.time=2;s.players.forEach((p,n)=>Object.assign(p,{bot:false,x:440+n*120,y:330,aim:Math.PI/4,gunFacing:Math.PI/4}));return s;};
 const render=(name,s,skin='jade')=>{const only=process.argv.indexOf('--only');if(only>=0&&!process.argv[only+1].split(',').includes(name))return;bayRenderCamera.ready=false;qaCache.clear();const c=createCanvas(Number(process.env.QA_WIDTH)||1000,Number(process.env.QA_HEIGHT)||620);qaDraw(c,s,2000,{x:500,y:310,down:false},{},-1,-1,0,skin,'close');fs.writeFileSync('.qa/'+tag+'-'+name+'.jpg',c.toBuffer('image/jpeg',90));};
 if(process.argv.includes('--motion')){
  // Identical deterministic presentation route in both revisions. These are
  // scripted render states, not proof of controller input or collision behavior.
  const dir='.qa/'+tag+'-motion';fs.mkdirSync(dir,{recursive:true});
  const s=fresh(),p=s.players[0],enemy=s.players[1],cv=s.covers.find(c=>c.id==='d33-nw-primary');
  const route=[[230,330],[230,210],[450,210],[500,330],[650,440],[800,440],[600,330]];
  const c=createCanvas(Number(process.env.QA_WIDTH)||1000,Number(process.env.QA_HEIGHT)||620);bayRenderCamera.ready=false;qaCache.clear();
  let clock=2000;Object.defineProperty(global,'performance',{configurable:true,value:{now:()=>clock}});
  for(let n=0;n<240;n++){
   const t=n/20,k=Math.min(route.length-2,Math.floor(t/2)),f=Math.min(1,(t-k*2)/2),a=route[k],b=route[k+1];
   Object.assign(p,{x:a[0]+(b[0]-a[0])*f,y:a[1]+(b[1]-a[1])*f,vx:(b[0]-a[0])/2,vy:(b[1]-a[1])/2});
   Object.assign(enemy,{x:Math.min(880,p.x+130),y:p.y});s.time=2+t;clock=2000+t*1000;
   if(t>=8&&t<10){p.gripCoverId=cv.id;Object.assign(cv,{x:p.x+55,y:p.y,build:-1,vx:p.vx,vy:p.vy,a:.3});}
   if(t>=10){p.gripCoverId=null;Object.assign(cv,{x:855+(t-10)*100,y:440,build:-1,throwOwner:0,vx:200,vy:0,a:.3+(t-10)});}
   qaDraw(c,s,clock,{x:500,y:310,down:false},{},-1,-1,0,'jade','close');
   fs.writeFileSync(dir+'/'+String(n).padStart(4,'0')+'.jpg',c.toBuffer('image/jpeg',85));
  }
  console.log('PASS scripted 12-second presentation sequence; not simulated gameplay or browser capture.');return;
 }
 for(const [name,x,y] of [['center',440,330],['north',440,145],['south',440,485],['west',190,330],['east',750,330]]){const s=fresh();s.players[0].x=x;s.players[0].y=y;s.players[1].x=x+100;s.players[1].y=y;render(name,s);}
 for(const mode of ['scale','held','thrown','damage','destruction']){const s=fresh(),cv=s.covers.find(c=>c.id==='d33-nw-primary');assert(cv);Object.assign(cv,{x:500,y:330,a:0});s.players[0].x=410;s.players[1].x=610;
  if(mode==='held'){s.players[0].gripCoverId=cv.id;Object.assign(cv,{build:-1,vx:40,vy:0,a:.4});}
  if(mode==='thrown')Object.assign(cv,{build:-1,throwOwner:0,vx:300,vy:50,a:.7});
  if(mode==='damage')cv.hp=cv.maxHp*.3;
  if(mode==='destruction'){qaDamageCover(cv,s,1e6);s.covers=s.covers.filter(c=>c.hp>0);assert(!s.covers.includes(cv));assert(s.fx.some(f=>f.type==='cover-break'));}
  render(mode,s);
 }
 const scale=fresh(),barrier=scale.covers.find(c=>c.id==='d33-nw-primary');Object.assign(barrier,{x:500,y:330,a:0});scale.covers=[barrier];scale.players[0].x=390;scale.players[1].x=610;render('raptor-scale',scale,'raptor');
 for(const mode of ['solid','glancing']){const s=fresh(),cv=s.covers.find(c=>c.id==='d33-nw-primary'),target=s.covers.find(c=>c.id==='d33-ne-primary');Object.assign(cv,{x:480,y:330,build:-1,vx:mode==='solid'?400:40,vy:mode==='solid'?0:400,throwOwner:0});Object.assign(target,{x:520,y:330});s.covers=[cv,target];qaCoverImpact(cv,s,target.id,target,{x:-1,y:0});render(mode,s);}
 const defeated=fresh();defeated.mode='duel';defeated.phase='finished';defeated.winner=1;defeated.players[1].score=3;defeated.players[0].hp=0;defeated.players[0].deathAt=1.8;render('defeat',defeated);
 qaAssets.clear();render('fallback',fresh());
 console.log('PASS '+tag+': actual Game.tsx headless center/N/S/E/W, matching-depth Jade/Raptor, held/thrown/damage/destruction fixtures and missing assets. Approved Jade ready-d03 only; animation/browser/controller not verified here.');
})().catch(e=>{console.error(e);process.exit(1)});
