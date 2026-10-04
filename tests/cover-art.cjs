const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const text=fs.readFileSync('app/Game.tsx','utf8'),start=text.indexOf('const COVER_CONNECTOR_RECTS='),end=text.indexOf('function fighter(',start),image={};
const ctx={powerAssets:new Map([['cover-d03-connectors-v1',image]])};vm.createContext(ctx);vm.runInContext(stripTypeScriptTypes(text.slice(start,end))+';globalThis.api={coverConnectorFrame,drawCoverConnector};',ctx);
const {coverConnectorFrame:f,drawCoverConnector:draw}=ctx.api,p={coverId:'cover',coverMode:'braced',gunFacing:Math.PI/4,fireState:.1,input:{coverAim:true},kickStage:'none'};
assert.equal(f(p),0);assert.equal(f({...p,fireState:0,recoil:.01}),0);assert.equal(f({...p,fireState:0,returnToCover:.16,input:{coverAim:false}}),1);assert.equal(f({...p,fireState:0,returnToCover:.16}),null);
for(const patch of [{coverId:null},{coverMode:'soft'},{gunFacing:0},{charging:true},{powerReturn:.1},{knock:.1},{slide:.1},{dash:.1},{exit:{}},{gripCoverId:'held'},{kickStage:'step'}])assert.equal(f({...p,...patch}),null);
for(let n=0;n<2;n++){let args;assert(draw({drawImage:(...a)=>args=a},{x:300,y:330,coverPreview:n},{spriteScale:.82}));assert.equal(args[0],image);assert.equal(args[8],887*(125*143/250/638)*.82);assert(args[1]+args[3]<=1774);assert.equal(args[2]+args[4],887);}
ctx.powerAssets.clear();assert.equal(f(p),null);
assert(fs.readFileSync('public/assets/god-frame/cover-d03-connectors-v1.png').equals(fs.readFileSync('art/combat-cohesion/d03-cover/connectors-review-v1.png')));
console.log('PASS: cover recoil/retract direction, held aim, immediate charge/escape/hit/carry overrides, asset fallback, shared scale, full crops and byte-identical approved source.');
