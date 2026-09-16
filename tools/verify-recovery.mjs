import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../recovery/shotgun-lab-v57');
const checks=(await readFile(resolve(root,'CHECKSUMS.sha256'),'utf8')).trim().split('\n');let assets=0,source=0;
for(const line of checks){const [expected,...parts]=line.trim().split(/\s+/),path=parts.join(' ').replace(/^recovered-shotgun-v57\//,'');const data=await readFile(resolve(root,path));if(createHash('sha256').update(data).digest('hex')!==expected)throw Error('Recovery mismatch: '+path);if(path.startsWith('assets/'))assets++;else source++;}
console.log({assets,source,allChecksumsMatch:true});
