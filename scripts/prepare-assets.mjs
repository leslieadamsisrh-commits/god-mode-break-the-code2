import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root=process.cwd();
const runtimeBase="https://god-helmet-arcade.leslieadams-isrh.chatgpt.site/assets/shotgun-complete/runtime/";
const arenaUrl="https://god-mode-anime-upgrade-v28.leslieadams-isrh.chatgpt.site/assets/dimension33-map/arena-war-games-hires.webp";
const spriteDir=path.join(root,"public","assets","recovered");
const arenaDir=path.join(root,"public","assets","dimension33-map");
await mkdir(spriteDir,{recursive:true});
await mkdir(arenaDir,{recursive:true});

const names=[];
for(const family of ["ready","run","slide","cover"]){
  for(let d=0;d<24;d++){
    if((family==="run"||family==="slide")&&d===3) continue;
    names.push(`${family}-d${String(d).padStart(2,"0")}.webp`);
  }
}
names.push("run.webp","slide.webp");
for(const family of ["backpedal","strafe-left","strafe-right"]){
  for(const d of [0,6,12,18]) names.push(`${family}-d${String(d).padStart(2,"0")}.webp`);
}

async function getBinary(url,label){
  const response=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(30000)});
  if(!response.ok) throw new Error(`Runtime asset recovery failed: ${response.status} ${label}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<1000) throw new Error(`Runtime asset recovery returned an invalid payload: ${label} ${bytes.length} bytes`);
  return bytes;
}

let recovered=0;
for(let i=0;i<names.length;i+=8){
  await Promise.all(names.slice(i,i+8).map(async name=>{
    const bytes=await getBinary(new URL(name,runtimeBase),name);
    await writeFile(path.join(spriteDir,name),bytes);
    recovered++;
  }));
  process.stdout.write(`\rRecovered approved clean Jade runtime art: ${recovered}/${names.length}`);
}
console.log();

const arenaBytes=await getBinary(arenaUrl,"V28 Dimension 33 arena-war-games-hires.webp");
await writeFile(path.join(arenaDir,"arena-war-games-hires.webp"),arenaBytes);
console.log(`Recovered exact V28 Dimension 33 arena plate: ${arenaBytes.length} bytes`);
console.log("GOD MODE runtime authority: clean V57/V12 Jade sprites + V28 Anime Upgrade arena.");
