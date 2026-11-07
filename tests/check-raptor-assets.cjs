// Structural release gate. Does not certify anatomy, motion or hidden muzzle placement.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),zlib=require('zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../public/assets/raptor-v2');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const failures=[],occluded=[],verified=new Map();
const expectedDirections=['right','front-right','front','front-left','left','back-left','back','back-right'];
const counts={idle:1,run:4,sprint:4,slide:3,stalk:4,jog:4,jump:6,'cover-drive':2,'cover-hold':1,'cover-lean':1};
const check=(yes,message)=>{if(!yes)failures.push(message);};
const finitePoint=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(buffer){let c=0xffffffff;for(const byte of buffer)c=crcTable[(c^byte)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
function inspectPNG(buffer){
 assert(buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG signature');
 let offset=8,header,palette,alpha,idats=[],ended=false;
 while(offset<buffer.length){
  assert(offset+12<=buffer.length,'truncated chunk header');
  const length=buffer.readUInt32BE(offset),type=buffer.toString('ascii',offset+4,offset+8),end=offset+12+length;
  assert(end<=buffer.length,'truncated '+type+' chunk');
  const data=buffer.subarray(offset+8,offset+8+length);
  assert.equal(crc(buffer.subarray(offset+4,offset+8+length)),buffer.readUInt32BE(offset+8+length),type+' CRC');
  if(!header)assert.equal(type,'IHDR','IHDR must be first');
  if(type==='IHDR'){assert(!header,'duplicate IHDR');header=data;assert.equal(length,13);}
  if(type==='PLTE')palette=data;
  if(type==='tRNS')alpha=data;
  if(type==='IDAT')idats.push(data);
  offset=end;
  if(type==='IEND'){assert.equal(length,0);ended=true;break;}
 }
 assert(ended&&offset===buffer.length,'missing IEND or trailing bytes');
 assert.equal(header.readUInt32BE(0),512,'width');assert.equal(header.readUInt32BE(4),512,'height');
 assert.equal(header[8],8,'8-bit channels');const type=header[9];
 assert(type===6||type===3,'RGBA or palette with alpha required');
 assert.equal(header[10],0,'compression');assert.equal(header[11],0,'filter method');assert.equal(header[12],0,'noninterlaced image');
 if(type===3){assert(palette&&palette.length>0&&palette.length%3===0,'valid palette');assert(alpha&&alpha.length<=palette.length/3,'palette transparency required');}
 assert(idats.length,'IDAT required');
 const bytesPerPixel=type===6?4:1,stride=512*bytesPerPixel,data=zlib.inflateSync(Buffer.concat(idats));
 assert.equal(data.length,(stride+1)*512,'decoded size');
 let previous=Buffer.alloc(stride),visible=0,transparent=0;
 for(let y=0;y<512;y++){
  const row=Buffer.allocUnsafe(stride),start=y*(stride+1),filter=data[start];assert(filter<=4,'valid row filter');
  for(let x=0;x<stride;x++){
   const raw=data[start+1+x],left=x>=bytesPerPixel?row[x-bytesPerPixel]:0,up=previous[x],upperLeft=x>=bytesPerPixel?previous[x-bytesPerPixel]:0;
   row[x]=(raw+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):paeth(left,up,upperLeft)))&255;
  }
  for(let x=0;x<512;x++){
   const index=row[x];if(type===3)assert(index<palette.length/3,'palette index exists');
   const a=type===6?row[x*4+3]:(alpha[index]??255);if(a>0)visible++;if(a===0)transparent++;
  }
  previous=row;
 }
 assert(visible>0,'sprite cannot be fully transparent');assert(transparent>0,'sprite must retain transparent background');
 return{type:type===6?'RGBA':'indexed-alpha',visible,transparent};
}

check(JSON.stringify(manifest.size)===JSON.stringify([512,512]),'manifest size must be 512×512');
check(Array.isArray(manifest.directions)&&manifest.directions.length===8&&expectedDirections.every(d=>manifest.directions.includes(d)),'manifest must name exactly eight directions');
for(const [family,count]of Object.entries(counts))check(manifest.counts?.[family]===count,`${family}: expected count ${count}`);
for(const name of ['postureDirections','jumpDirections','standingDirections']){
 const dirs=manifest[name]||[];check(new Set(dirs).size===dirs.length,`${name}: duplicates`);
 for(const d of dirs)check(expectedDirections.includes(d),`${name}: unknown direction ${d}`);
}

for(const [key,record]of Object.entries(manifest.frames||{})){
 const match=/^(idle|run|sprint|slide|stalk|jog|jump|cover-drive|cover-hold|cover-lean)\/(right|front-right|front|front-left|left|back-left|back|back-right)\/(\d{3})\.png$/.exec(key);
 if(!match){failures.push(`${key}: invalid frame path`);continue;}
 check(Number(match[3])<counts[match[1]],`${key}: frame index exceeds family count`);
 check(finitePoint(record.anchor),`${key}: finite two-axis anchor required`);
 check(record.drawScale===undefined||(Number.isFinite(record.drawScale)&&record.drawScale>0),`${key}: drawScale must be one positive finite scalar`);
 for(const field of ['scaleX','scaleY','drawScaleX','drawScaleY','drawWidth','drawHeight','width','height'])check(!(field in record),`${key}: nonuniform registration field ${field} is forbidden`);
 if(record.muzzleVisibility==='occluded'){
  check(record.muzzle===undefined&&record.muzzleGround===undefined,`${key}: occluded barrel must not claim an invented visible socket`);
  check(record.muzzleFallback==='legacy'&&typeof record.muzzleNote==='string'&&record.muzzleNote.trim().length>0,`${key}: occluded barrel needs documented legacy fallback`);
  occluded.push(key);
 }else{
  check(finitePoint(record.muzzle),`${key}: missing/invalid visible muzzle`);
  if(finitePoint(record.muzzle)&&finitePoint(record.anchor)){
   check(record.muzzle.every(n=>n>=0&&n<=512),`${key}: muzzle must lie within source cell`);
   const ground=record.muzzleGround??[record.muzzle[0],record.anchor[1]];
   check(finitePoint(ground)&&Math.abs(ground[0]-record.muzzle[0])<1e-9&&ground[1]>record.muzzle[1],`${key}: muzzle floor point must share X and give positive finite height`);
  }
 }
 try{
  const bytes=fs.readFileSync(path.join(root,key)),hash=crypto.createHash('sha256').update(bytes).digest('hex');
  check(/^[a-f0-9]{64}$/.test(record.sha256||'')&&record.sha256===hash,`${key}: stale/missing sha256`);
  verified.set(key,{hash,...inspectPNG(bytes)});
 }catch(error){failures.push(`${key}: ${error.message}`);}
}

function requireSet(family,directions){for(const direction of directions)for(let n=0;n<counts[family];n++){
 const key=`${family}/${direction}/${String(n).padStart(3,'0')}.png`;
 check(!!manifest.frames?.[key],`${key}: enabled direction lacks manifest registration`);
 check(verified.has(key),`${key}: enabled direction lacks valid PNG`);
}}
function runtimePNGs(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
 const full=path.join(directory,entry.name);return entry.isDirectory()?runtimePNGs(full):entry.name.endsWith('.png')?[path.relative(root,full).split(path.sep).join('/')]:[];
});}
for(const key of runtimePNGs(root))check(!!manifest.frames[key],`${key}: runtime PNG lacks manifest registration`);
for(const family of ['idle','run','sprint','slide'])requireSet(family,expectedDirections);
for(const family of ['stalk','jog'])requireSet(family,manifest.postureDirections||[]);
requireSet('jump',manifest.jumpDirections||[]);

const registration=r=>r&&({anchor:r.anchor,drawScale:r.drawScale??1,muzzle:r.muzzle,muzzleGround:r.muzzleGround,muzzleVisibility:r.muzzleVisibility,muzzleFallback:r.muzzleFallback,muzzleNote:r.muzzleNote});
function requireAlias(a,b,label){
 check(verified.get(a)?.hash===verified.get(b)?.hash&&verified.has(a)&&verified.has(b),`${label}: ${a} and ${b} must share image bytes`);
 check(JSON.stringify(registration(manifest.frames[a]))===JSON.stringify(registration(manifest.frames[b])),`${label}: ${a} and ${b} registration differs`);
}
for(const d of expectedDirections)for(let n=0;n<4;n++)requireAlias(`run/${d}/${String(n).padStart(3,'0')}.png`,`sprint/${d}/${String(n).padStart(3,'0')}.png`,'run alias');
for(const d of manifest.jumpDirections||[])requireAlias(`idle/${d}/000.png`,`jump/${d}/005.png`,'recovery-to-idle continuity');
if(failures.length){console.error(`FAIL Raptor asset gate (${failures.length}):\n`+failures.join('\n'));process.exitCode=1;}
else console.log(`PASS Raptor asset gate: ${verified.size} transparent512×512 frames, SHA/PNG integrity, complete enabled families, uniform registration,32 run aliases, recovery/idle continuity; ${occluded.length} explicitly documented occluded-muzzle legacy fallbacks`);
if(occluded.length)console.log('Occluded muzzle fallback frames: '+occluded.join(', '));

