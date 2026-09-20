'use strict';
const assert=require('node:assert/strict');
globalThis.JadeB05Fast=require('../public/vendor/b05-fast.js');
const B=require('../public/vendor/b06-fast.js');
function p(o={}){return{x:0,y:0,vx:0,vy:0,aim:0,cover:{id:'station',face:'south',edge:null},impact:0,cornerTravel:null,...o};}
assert.equal(B.select(p()).record.id,'B06A');
assert.equal(B.select(p({vx:-120})).record.id,'B06B');
let q=B.select(p({vx:120}));assert.equal(q.record.id,'B06C_PLACEHOLDER');assert.equal(q.placeholder,true);
assert.equal(B.select(p({impact:.05})),null);
assert.equal(B.select(p({cover:null})),null);
assert.equal(B.select(p({cover:{id:'station',face:'east',edge:null}})),null);
console.log('B06 fast selector: 6 assertions passed');
