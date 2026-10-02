import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";

const root=process.cwd();
const runtimeBase="https://god-helmet-arcade.leslieadams-isrh.chatgpt.site/assets/shotgun-complete/runtime/";
const spriteDir=path.join(root,"public","assets","recovered");
await mkdir(spriteDir,{recursive:true});

const names=[];
for(const family of ["ready","run","slide","cover"]){
  for(let d=0;d<24;d++){
    if((family==="run"||family==="slide")&&d===3)continue;
    names.push(`${family}-d${String(d).padStart(2,"0")}.webp`);
  }
}
names.push("run.webp","slide.webp");
for(const family of ["backpedal","strafe-left","strafe-right"])for(const d of [0,6,12,18])names.push(`${family}-d${String(d).padStart(2,"0")}.webp`);

async function getBinary(name){
  const r=await fetch(new URL(name,runtimeBase),{redirect:"follow",signal:AbortSignal.timeout(30000)});
  if(!r.ok)throw new Error(`Sprite recovery failed: ${r.status} ${name}`);
  const bytes=Buffer.from(await r.arrayBuffer());
  if(bytes.length<1000)throw new Error(`Invalid sprite payload: ${name}`);
  return bytes;
}
let recovered=0;
for(let i=0;i<names.length;i+=8){
  await Promise.all(names.slice(i,i+8).map(async name=>{await writeFile(path.join(spriteDir,name),await getBinary(name));recovered++;}));
  process.stdout.write(`\rRecovered clean small Jade runtime: ${recovered}/${names.length}`);
}
console.log("\nCombat Studio asset gate complete. No map or presentation assets fetched.");
