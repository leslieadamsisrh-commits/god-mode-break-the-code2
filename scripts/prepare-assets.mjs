import { mkdir, readdir, copyFile, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root=process.cwd();

const arenaUrl="https://god-mode-anime-upgrade-v28.leslieadams-isrh.chatgpt.site/assets/dimension33-map/arena-war-games-hires.webp";
const arenaDir=path.join(root,"public","assets","dimension33-map");
await mkdir(arenaDir,{recursive:true});
const arenaResponse=await fetch(arenaUrl,{signal:AbortSignal.timeout(20000)});
if(!arenaResponse.ok) throw new Error(`Anime Upgrade arena recovery failed: HTTP ${arenaResponse.status}`);
const arenaBytes=Buffer.from(await arenaResponse.arrayBuffer());
if(arenaBytes.length<10000) throw new Error(`Anime Upgrade arena payload too small: ${arenaBytes.length}`);
await writeFile(path.join(arenaDir,"arena-war-games-hires.webp"),arenaBytes);
console.log(`Recovered exact Anime Upgrade arena plate: ${arenaBytes.length} bytes`);
const gamePath=path.join(root,"app","Game.tsx");
let gameSource=await readFile(gamePath,"utf8");
gameSource=gameSource.replace(arenaUrl,"/assets/dimension33-map/arena-war-games-hires.webp");
await writeFile(gamePath,gameSource,"utf8");
console.log("Locked runtime arena source to local baked plate");

const srcDir=path.join(root,"combat-lab","assets","cyberkitty");
const dstDir=path.join(root,"public","assets","recovered");
await mkdir(dstDir,{recursive:true});

const SOURCE_CELL=250;
const TARGET_CELL=125;
const CORE=/^(ready|run|slide|cover)-d\d{2}\.webp$/;

function sameColor(data,a,b){
  return data[a]===data[b] && data[a+1]===data[b+1] && data[a+2]===data[b+2];
}

function cleanCell(data,width,x0,y0){
  const remove=new Uint8Array(SOURCE_CELL*SOURCE_CELL);

  // Production sheets contain long flat registration lines and guide boxes.
  // Strip long exact-color runs first; character ink/shading is irregular and
  // does not create these ruler-straight runs at this length.
  for(let y=0;y<SOURCE_CELL;y++){
    let x=0;
    while(x<SOURCE_CELL){
      const i=((y0+y)*width+(x0+x))*4;
      if(data[i+3]<12){x++;continue;}
      let e=x+1;
      while(e<SOURCE_CELL){
        const j=((y0+y)*width+(x0+e))*4;
        if(data[j+3]<12 || !sameColor(data,i,j))break;
        e++;
      }
      if(e-x>=22) for(let q=x;q<e;q++) remove[y*SOURCE_CELL+q]=1;
      x=e;
    }
  }
  for(let x=0;x<SOURCE_CELL;x++){
    let y=0;
    while(y<SOURCE_CELL){
      const i=((y0+y)*width+(x0+x))*4;
      if(data[i+3]<12){y++;continue;}
      let e=y+1;
      while(e<SOURCE_CELL){
        const j=((y0+e)*width+(x0+x))*4;
        if(data[j+3]<12 || !sameColor(data,i,j))break;
        e++;
      }
      if(e-y>=22) for(let q=y;q<e;q++) remove[q*SOURCE_CELL+x]=1;
      y=e;
    }
  }

  for(let y=0;y<SOURCE_CELL;y++) for(let x=0;x<SOURCE_CELL;x++){
    if(remove[y*SOURCE_CELL+x]){
      const i=((y0+y)*width+(x0+x))*4;
      data[i+3]=0;
    }
  }

  // Keep the grounded character cluster and nearby detail, discard detached
  // registration debris. Jade's recovered runtime anchor is y=219.
  const seen=new Uint8Array(SOURCE_CELL*SOURCE_CELL);
  const comps=[];
  const alpha=(x,y)=>data[((y0+y)*width+(x0+x))*4+3]>=18;
  for(let sy=0;sy<SOURCE_CELL;sy++) for(let sx=0;sx<SOURCE_CELL;sx++){
    const seed=sy*SOURCE_CELL+sx;
    if(seen[seed]||!alpha(sx,sy))continue;
    const q=[seed]; seen[seed]=1; let head=0,area=0,minX=sx,maxX=sx,minY=sy,maxY=sy,anchorDist=1e9;
    const pixels=[];
    while(head<q.length){
      const n=q[head++],x=n%SOURCE_CELL,y=(n/SOURCE_CELL)|0;
      pixels.push(n); area++;
      if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
      const dx=x-125,dy=y-219,dd=dx*dx+dy*dy;if(dd<anchorDist)anchorDist=dd;
      for(let oy=-1;oy<=1;oy++) for(let ox=-1;ox<=1;ox++){
        if(!ox&&!oy)continue;const nx=x+ox,ny=y+oy;
        if(nx<0||ny<0||nx>=SOURCE_CELL||ny>=SOURCE_CELL)continue;
        const nn=ny*SOURCE_CELL+nx;
        if(!seen[nn]&&alpha(nx,ny)){seen[nn]=1;q.push(nn);}
      }
    }
    comps.push({pixels,area,minX,maxX,minY,maxY,anchorDist});
  }
  if(!comps.length)return;
  comps.sort((a,b)=>{
    const sa=a.area-Math.sqrt(a.anchorDist)*3;
    const sb=b.area-Math.sqrt(b.anchorDist)*3;
    return sb-sa;
  });
  const main=comps[0],pad=20;
  for(const comp of comps){
    const near=comp.maxX>=main.minX-pad&&comp.minX<=main.maxX+pad&&comp.maxY>=main.minY-pad&&comp.minY<=main.maxY+pad;
    const keep=comp===main || (comp.area>=8&&near);
    if(!keep) for(const n of comp.pixels){
      const x=n%SOURCE_CELL,y=(n/SOURCE_CELL)|0,i=((y0+y)*width+(x0+x))*4;
      data[i+3]=0;
    }
  }
}

async function cleanSheet(src,dst){
  const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(info.width%SOURCE_CELL||info.height%SOURCE_CELL) throw new Error(`Unexpected sprite grid: ${src} ${info.width}x${info.height}`);
  const buf=Buffer.from(data);
  const cols=info.width/SOURCE_CELL,rows=info.height/SOURCE_CELL;
  for(let row=0;row<rows;row++) for(let col=0;col<cols;col++) cleanCell(buf,info.width,col*SOURCE_CELL,row*SOURCE_CELL);
  await sharp(buf,{raw:{width:info.width,height:info.height,channels:4}})
    .resize(cols*TARGET_CELL,rows*TARGET_CELL,{kernel:"lanczos3"})
    .webp({lossless:true})
    .toFile(dst);
}

const files=(await readdir(srcDir)).filter(f=>CORE.test(f)).sort();
for(const file of files) await cleanSheet(path.join(srcDir,file),path.join(dstDir,file));

// The source repo omitted d03 run/slide; create a stable nearest-direction
// substitute so runtime loading is deterministic instead of a 404 fallback.
for(const family of ["run","slide"]){
  const missing=path.join(dstDir,`${family}-d03.webp`);
  const nearest=path.join(dstDir,`${family}-d02.webp`);
  await copyFile(nearest,missing);
}

async function findFile(dir,target,depth=0){
  if(depth>8)return null;
  let entries;try{entries=await readdir(dir,{withFileTypes:true});}catch{return null;}
  for(const entry of entries){
    if(entry.name===".git"||entry.name==="node_modules"||entry.name===".next"||entry.name==="recovered")continue;
    const full=path.join(dir,entry.name);
    if(entry.isFile()&&entry.name===target)return full;
    if(entry.isDirectory()){const hit=await findFile(full,target,depth+1);if(hit)return hit;}
  }
  return null;
}
const cover=await findFile(root,"cover-destruction-atlas.png");
if(cover){
  const envDir=path.join(root,"public","assets","environment");
  await mkdir(envDir,{recursive:true});
  await copyFile(cover,path.join(envDir,"cover-destruction-atlas.png"));
}
console.log(`Prepared ${files.length+2} cleaned Jade runtime sheets at 125px cells`,cover?"cover atlas copied":"cover atlas optional/missing");
