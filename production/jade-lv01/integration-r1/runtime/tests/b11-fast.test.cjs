const test=require('node:test');const assert=require('node:assert/strict');const B=require('../public/vendor/b11-fast.js');
const A={};for(const fam of ['ready','cover'])for(let d=0;d<24;d++)A[fam+':'+d]={file:fam+d};for(const fam of ['run','slide'])for(let d=0;d<24;d++)if(d!==3)A[fam+':'+d]={file:fam+d};
test('exact principal directions stay exact',()=>{for(const fam of ['ready','cover'])for(const d of [0,3,6,9,12,15,18,21])assert.equal(B.resolve(A,fam,d).placeholder,false);});
test('missing run/slide d03 use nearest explicit placeholder',()=>{for(const fam of ['run','slide']){const q=B.resolve(A,fam,3);assert.equal(q.placeholder,true);assert.ok([2,4].includes(q.direction));assert.equal(q.requested,3);}});
