import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {activeReview,importRecords} from '../sprites/previews/review-model.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const catalog=JSON.parse(fs.readFileSync(new URL('../sprites/previews/review-catalog.js',import.meta.url),'utf8').replace(/^window.GM_REVIEW_DATA=/,'').trim().replace(/;$/,''));
const batch=read('sprites/manifests/batch-03-cover-contact.json');
test('saved cover checkpoint binds each source and runtime image to its actual revision',()=>{
 for(const f of batch.families){
  for(const [pathKey,hashKey]of [['sourcePath','sourceRevision'],['path','revision']]){
   const bytes=fs.readFileSync(new URL('../'+f[pathKey],import.meta.url));
   assert.equal(createHash('sha256').update(bytes).digest('hex'),f[hashKey]);
  }
  assert.equal(f.frames,6);assert.equal(f.frameRecords.length,6);
  assert.equal(catalog.families.find(c=>c.id===f.id).animationRevision,f.animationRevision);
 }
});
test('reviewed movement approval does not approve new cover or unseen movement sequences',()=>{
 const ledger=read('sprites/reviews/design-decisions.json');const records=importRecords([],ledger,catalog);
 const displayed=catalog.families.find(f=>f.id==='run-d00');
 assert.equal(activeReview(records,displayed,0,'animation').status,'approved');
 assert.equal(activeReview(records,catalog.families.find(f=>f.id==='run-d01'),0,'animation'),null);
 for(const f of batch.families)for(let i=0;i<f.frames;i++)for(const kind of ['design','animation'])assert.equal(activeReview(records,f,i,kind),null);
});
