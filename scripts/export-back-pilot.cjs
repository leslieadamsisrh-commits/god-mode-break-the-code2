// Review-only rear anatomy export. Source landmarks, not silhouette bounds, set placement.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/sharp');
const root=path.resolve(__dirname,'..'),sources=path.resolve(root,'../generated_images');
const defs={idle:['eb7267a1-e7d6-44f9-91c4-12926fb7dadc'],stalk:[
 'fd76e9de-b024-4ca3-9a8a-3c9280a3a0c6','dd323c32-8a93-4275-a7f8-f57162214e18',
 '58030576-6283-4e75-8edb-e432a6673506','13f651ea-05a9-4775-9b58-0a457c509996'
],jog:[
 'f37544a6-87e0-404f-821b-d333eb19b37c','6a2374ee-d2c5-4b44-97d2-0a27308ff1b3',
 '0a086db4-2266-4e5b-9613-f54fc5903356','7e9894a7-e19c-4bce-be78-ce707af56d91'
]};
// Uniform .2 source scale. Tail-root/pelvis center maps to approximately(256,312).
const placement={idle:[136,202],stalk:[146,196],jog:[146,210]};
(async()=>{const records={};for(const[family,ids]of Object.entries(defs))for(let i=0;i<ids.length;i++){
 const source='exec-'+ids[i]+'.png',p=path.join(sources,source),meta=await sharp(p).metadata();
 const expected=family==='idle'?[1199,1312]:[1108,1420];
 if(meta.width!==expected[0]||meta.height!==expected[1])throw Error('Unexpected source canvas '+source);
 const {data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let j=3;j<data.length;j+=4)if(data[j]<128)data[j]=0;
 const tile=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).resize(Math.round(meta.width*.2),Math.round(meta.height*.2)).png().toBuffer();
 const key=`${family}/back/${String(i).padStart(3,'0')}.png`,dest=path.join(root,'art-review/anatomy-correction/back-pilot',key),[left,top]=placement[family];
 fs.mkdirSync(path.dirname(dest),{recursive:true});
 await sharp({create:{width:512,height:512,channels:4,background:'#00000000'}}).composite([{input:tile,left,top}]).png().toFile(dest);
 records[key]={anchor:[256,450],sha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex'),source,status:'review-only'};
 }
 fs.writeFileSync(path.join(root,'art-review/anatomy-correction/back-pilot/records.json'),JSON.stringify(records,null,2)+'\n');
 console.log('Exported9 rear candidates for landmark/foot review; runtime unchanged.');
})();
