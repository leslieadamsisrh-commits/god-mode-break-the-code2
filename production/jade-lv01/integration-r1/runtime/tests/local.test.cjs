'use strict';
const t=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const I=require('../public/local-input.js'),S=require('../source/duel.cjs');
const pad=(index,x=0,y=0)=>({index,mapping:'standard',connected:true,axes:[x,y,0,0],buttons:Array.from({length:17},()=>({pressed:false}))});
t('one keyboard and one controller route to different seats',()=>{const r=new I.DeviceRouter(),p=pad(4,0,-1);r.bind([p]);const v=r.sample([p],{...I.neutral(0),x:1},[0,Math.PI]);a.equal(v.slots[0].x,1);a.equal(v.slots[0].y,0);a.equal(v.slots[1].x,0);a.equal(v.slots[1].y,-1);a.deepEqual(r.bindings,[null,4]);});
t('two controllers bind actual indices, not array positions',()=>{const r=new I.DeviceRouter(),p=pad(7),q=pad(2);r.bind([p,q],'two-pads');a.deepEqual(r.bindings,[2,7]);});
t('two controllers fire independently',()=>{const r=new I.DeviceRouter(),p=pad(0),q=pad(1);r.bind([p,q],'two-pads');q.buttons[7].pressed=true;const v=r.sample([p,q],I.neutral(0),[0,Math.PI]);a.equal(v.slots[0].fire,false);a.equal(v.slots[1].fire,true);});
t('new device does not hijack disconnected slot',()=>{const r=new I.DeviceRouter(),p=pad(2),q=pad(7);r.bind([p,q],'two-pads');const v=r.sample([p,pad(4)],I.neutral(0),[0,Math.PI]);a.deepEqual(v.missing,[false,true]);a.deepEqual(r.bindings,[2,7]);a.equal(v.slots[1].x,0);});
t('swapping controllers explicitly reverses assignments',()=>{const r=new I.DeviceRouter();r.bind([pad(2),pad(7)],'two-pads',true);a.deepEqual(r.bindings,[7,2]);});
t('partial analog movement stays below full speed',()=>{const v=I.fromPad(pad(0,.5,0));a.ok(v.x>0&&v.x<1);});
t('nonfinite axes neutralized; aim remembered at rest',()=>{const v=I.fromPad(pad(0,NaN,Infinity),1.2);a.equal(v.x,0);a.equal(v.y,0);a.equal(v.aim,1.2);});
t('neutral input rearm after pause prevents held slide/fire',()=>{const b=new S.InputMailbox();b.accept({seq:0,...I.neutral(0),fire:true,slide:true},0);const r=b.take(0);a.equal(r.fire,false);a.equal(r.slide,false);b.accept({seq:1,...I.neutral(0)},10);b.accept({seq:2,...I.neutral(0),slide:true},20);a.equal(b.take(20).slide,true);});
t('browser wrapper preserves 08L duel methods across 3600 mixed input ticks',()=>{
 const ctx=vm.createContext({console});const p=path.join(__dirname,'../public');
 for(const f of ['vendor/action-controller.js','vendor/core.js','vendor/motion-flow.js','vendor/stance-registration.js','slide-gate.js','duel-browser.js'])vm.runInContext(fs.readFileSync(path.join(p,f),'utf8'),ctx);
 const local=new ctx.JadeLocalDuel.Duel(),server=new S.Duel();local.begin();server.begin();
 for(let k=0;k<3600;k++){
  const input=[{x:Math.sin(k*.037),y:Math.cos(k*.041),aim:k*.021,slide:k%33===0,wrap:k%67===0,attach:k%151===0,fire:k%13===0,aimHeld:k%43<21},{x:Math.sin(k*.019),y:Math.cos(k*.031),aim:Math.PI-k*.019,slide:k%47===0,fire:k%17===0,aimHeld:k%29<14}];
  server.advance(input);local.advance(input);a.deepEqual(JSON.parse(JSON.stringify(local.snapshot())),server.snapshot());
  if(server.phase==='finished'){local.begin();server.begin();}
 }
});
