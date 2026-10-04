const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const text=fs.readFileSync('app/Game.tsx','utf8'),start=text.indexOf('const COVER_CONNECTOR_RECTS='),end=text.indexOf('function fighter(',start),image={};
const ctx={powerAssets:new Map([['cover-d03-exposure-v1',image],['cover-d03-connectors-v1',{}]])};vm.createContext(ctx);vm.runInContext(stripTypeScriptTypes(text.slice(start,end))+';globalThis.api={coverExposureFrame,drawCoverExposure};',ctx);
const {coverExposureFrame:f,drawCoverExposure:draw}=ctx.api,p={x:300,y:330,coverId:'wall',coverMode:'braced',peek:true,gunFacing:Math.PI/4,input:{coverAim:true},kickStage:'none'};
assert.equal(f(p),0);assert.equal(f({...p,fireState:.1}),1);
for(const patch of [{peek:false},{input:{coverAim:false}},{coverMode:'soft'},{gunFacing:0},{charging:true},{knock:.1},{slide:.1},{gripId:'held'},{exit:{}}])assert.equal(f({...p,...patch}),null);
const game={crypto:require('node:crypto').webcrypto};vm.createContext(game);vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/game.ts','utf8')).replace(/export /g,'')+';globalThis.api={newGame,attachCover,setInput,advance};',game);
const m=game.api,s=m.newGame('socket','host',1000,'solo'),q=s.players[0],cv={id:'wall',x:500,y:320,w:160,h:42,a:0,hp:140,maxHp:140,generated:false,build:0};s.covers=[cv];s.matter=[];q.x=500;q.y=280.5;m.attachCover(q,cv,s,'braced');m.setInput(s,0,1,{coverAim:true,fire:true,aim:Math.PI/4});m.advance(s,1016);
assert(s.shots.length===7);const sh=s.shots[0],flash=s.fx.find(x=>x.type==='muzzle'),unit=125*143/250/638*.82;
assert(Math.abs(flash.x+flash.renderOffsetX-(q.x+(1688-1363)*unit))<1e-9);assert(Math.abs(flash.y-flash.z-(q.y+(250-814)*unit))<1e-9);
assert(sh.z>47.036);assert.equal(s.fx.find(x=>x.type==='muzzle').renderOffsetX,sh.renderOffsetX);
for(let frame=0;frame<2;frame++){let args;draw({drawImage:(...a)=>args=a},{...p,coverPreview:frame+2},{spriteScale:.82});assert.equal(args[0],image);assert.equal(args[4],887);assert(args[1]+args[3]<=1774);const bottom=frame?841:844;assert(Math.abs(args[6]+(bottom-args[2])*unit-(p.y+27*unit))<1e-9);}
assert(fs.readFileSync('public/assets/god-frame/cover-d03-exposure-v1.png').equals(fs.readFileSync('art/combat-cohesion/d03-over-cover/aim-recoil-review-v1.png')));
console.log('PASS: approved exposure routing, immediate interruptions, isolated silhouettes, identical sole baseline, host/recoil visual socket parity, byte-identical source. Floor shot trajectory unchanged.');
