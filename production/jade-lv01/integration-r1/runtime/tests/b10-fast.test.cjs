const test=require('node:test');const assert=require('node:assert/strict');
global.window=global;require('../public/vendor/action-controller.js');const C=require('../public/vendor/core.js');
test('enemy projectile creates hit reaction without changing damage amount',()=>{const w=new C.World({start:'approach',mode:'none'});w.invulnerable=false;w.p.x=0;w.p.y=0;w.shots=[{id:1,enemy:true,x:-5,y:0,z:90,vx:780,vy:0,life:1}];w.projectiles(C.DT);assert.equal(w.p.hp,93);assert.ok(w.p.hitReact>0);assert.ok(w.p.hitDx>.99);assert.ok(Math.abs(w.p.hitDy)<.01);});
