// Review-only export. Runtime manifest is deliberately not changed here.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/sharp');
const root=path.resolve(__dirname,'..'),sources=path.resolve(root,'../generated_images');
const defs={idle:['7d3807eb-6361-443c-b852-10041c1b92e9'],stalk:[
 '8cc037bc-cf23-4d64-bf5f-4a5eb250136f',
 '8a02d09c-5faa-4d5f-bbfa-d7168f2f3f31',
 'd5565271-6f7a-4746-85e7-f88e35d3285d',
 '150b4b87-6f99-47c7-b561-6ba60e062362'
],jog:[
 'ad3ce3b2-8c59-4f44-b0b5-99bea5154b44',
 'ecc64c6e-cf9e-43c1-9a1a-2c6ff71a4bb5',
 '632042ef-a098-411c-9677-67904ddd5e48',
 'ab929d6a-c5eb-4656-8506-12c357931540'
]};
// One source scale and pelvis/ground registration across the entire direction.
// The passing poses are ordered by their supporting leg, not generation order.
(async()=>{const records={};for(const[family,ids]of Object.entries(defs))for(let i=0;i<ids.length;i++){
 const source='exec-'+ids[i]+'.png',p=path.join(sources,source),meta=await sharp(p).metadata();
 if(!((meta.width===1199&&meta.height===1312)||(source.includes('d5565271')&&meta.width===1196&&meta.height===1315)))throw Error('Unexpected source canvas '+source);
 const {data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 // Remove generator's low-opacity background specks; retain solid character detail.
 for(let j=3;j<data.length;j+=4)if(data[j]<128)data[j]=0;
 const tile=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).resize(Math.round(meta.width*.2),Math.round(meta.height*.2)).png().toBuffer();
 const key=`${family}/front/${String(i).padStart(3,'0')}.png`,dest=path.join(root,'art-review/anatomy-correction/front-pilot',key);
 fs.mkdirSync(path.dirname(dest),{recursive:true});
 await sharp({create:{width:512,height:512,channels:4,background:'#00000000'}}).composite([{input:tile,left:136,top:196}]).png().toFile(dest);
 records[key]={anchor:[256,450],sha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex'),source,status:'review-only'};
 }
 fs.writeFileSync(path.join(root,'art-review/anatomy-correction/front-pilot/records.json'),JSON.stringify(records,null,2)+'\n');
 console.log('Exported front standing/stalk review candidates; faint alpha specks cleaned. Runtime unchanged.');
})();
