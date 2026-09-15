#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const base='https://god-helmet-arcade.leslieadams-isrh.chatgpt.site/';
const checks=(await readFile(resolve(root,'CHECKSUMS.sha256'),'utf8')).trim().split('\n').map(line=>{
  const [sha,...parts]=line.trim().split(/\s+/);
  const original=parts.join(' ').replace(/^recovered-shotgun-v57\//,'');
  return {sha,path:original};
}).filter(x=>x.path.startsWith('assets/'));

let complete=0;
for(const item of checks){
  const target=resolve(root,item.path);
  await mkdir(dirname(target),{recursive:true});
  const response=await fetch(new URL(item.path,base));
  if(!response.ok)throw new Error(`${response.status} ${item.path}`);
  const data=Buffer.from(await response.arrayBuffer());
  const actual=createHash('sha256').update(data).digest('hex');
  if(actual!==item.sha)throw new Error(`Checksum mismatch: ${item.path}`);
  await writeFile(target,data);
  complete++;
  process.stdout.write(`\rVerified assets: ${complete}/${checks.length}`);
}
console.log('\nVersion 57 Shotgun Lab assets recovered and verified.');
