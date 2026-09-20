'use strict';
const assert=require('node:assert/strict');
const B=require('../public/vendor/b05-fast.js');
const covers=[{id:'station',x:-150,y:-65,w:220,h:42,height:152}];
function p(o={}){return{x:-40,y:60,vx:0,vy:0,r:17,slide:0,aim:0,cover:null,impact:0,...o};}
assert.equal(B.select(p({slide:.3,vy:-400,y:45}),covers).record.id,'CE05');
assert.equal(B.select(p({cover:{id:'station',face:'south'},impact:.15}),covers).record.id,'CE03');
assert.equal(B.select(p({cover:{id:'station',face:'south'},impact:.05}),covers).record.id,'CE08');
assert.equal(B.select(p({cover:{id:'station',face:'south'},impact:0}),covers),null);
assert.equal(B.select(p({cover:{id:'station',face:'south'},impact:.15,aim:2}),covers),null);
assert.equal(B.select(p({slide:.3,vy:200,y:45}),covers),null);
console.log('B05 fast selector: 6 assertions passed');
