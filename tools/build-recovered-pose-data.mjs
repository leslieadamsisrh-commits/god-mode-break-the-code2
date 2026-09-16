import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await readFile(resolve(root,'recovery/shotgun-lab-v57/assets/shotgun-complete/manifest.json'),'utf8'));
const registration=JSON.parse(await readFile(resolve(root,'docs/muzzle-registration.json'),'utf8'));
const measured=new Map(registration.measurements.map(m=>[m.familyId+':'+m.frameIndex,m]));
const families=manifest.families.map(f=>({...f,muzzles:Array.from({length:f.totalFrames},(_,index)=>{
 const m=measured.get(f.id+':'+index);if(!m)return null;
 if(m.runtimeAssetSha256!==f.runtimeSha256)throw Error('Stale review: '+f.id);
 if(!Number.isFinite(m.x)||!Number.isFinite(m.y))return null;
 return {x:m.x,y:m.y,review:'new-registration:'+m.reviewClassification};
})}));
const data='// Reconstructed from the recovered manifest plus NEW image measurements.\n// This is not a byte-exact recovery of the missing original module. Null sockets remain unreviewed.\nexport const POSE_FAMILIES='+JSON.stringify(families)+';\n';
for(const folder of ['recovery/shotgun-lab-v57','experiments/shotgun-powered-duel'])await writeFile(resolve(root,folder,'lab-pose-data.js'),data);
const report={families:families.length,frames:families.reduce((n,f)=>n+f.totalFrames,0),registered:families.reduce((n,f)=>n+f.muzzles.filter(Boolean).length,0),moduleSha256:createHash('sha256').update(data).digest('hex'),status:'reconstructed-not-original'};
await writeFile(resolve(root,'docs/pose-recovery-status.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
