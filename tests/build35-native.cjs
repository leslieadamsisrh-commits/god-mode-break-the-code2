const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9}}).outputText,p);
const G=require('../lib/game.ts'),O=require('../lib/cover-occlusion.ts'),C=require('../lib/contact35.ts'),P=require('../lib/bayBridgePresentation.ts');
const shape={id:'test',x:1000,y:550,z:40,w:80,h:40,a:0,height27j:60,hp:1000,maxHp:1000,generated:true,build:0,variant:0};
assert.deepEqual(C.contactPoint35(shape,{x:1100,y:550,z:72}),{x:1040,y:550,z:72});
assert.deepEqual(C.contactPoint35(shape,{x:1000,y:550,z:150}),{x:1000,y:550,z:100});
assert.deepEqual(C.contactPoint35({...shape,a:Math.PI/2},{x:1100,y:550,z:72}),{x:1020,y:550,z:72});
// Capture actual clipping paths. Aiming or attachment must never carve a visibility hole.
function mask(owner,exposed){const paths=[];let p=[];const m={a:1,b:0,c:0,d:1,e:0,f:0};const g={canvas:{width:2200,height:1100},save(){},restore(){},getTransform:()=>m,setTransform(){},beginPath(){p=[]},moveTo(x,y){p.push([x,y])},lineTo(x,y){p.push([x,y])},closePath(){},clip(rule){assert.equal(rule,'evenodd');paths.push(p)}};O.withCoverOcclusion(g,[shape,{...shape,id:'neighbor',x:1030}],520,10,()=>{},owner,exposed);return paths;}
const ordinary=mask(null,false);assert(ordinary.length>0);assert.deepEqual(mask('test',true),ordinary,'firing does not expose pixels through solid faces');assert.deepEqual(mask('test',false),ordinary,'neighbors still conceal attached fighters');
function inPoly(poly,p){let b=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){let a=poly[i],c=poly[j];if((a.y>p.y)!==(c.y>p.y)&&p.x<(c.x-a.x)*(p.y-a.y)/(c.y-a.y)+a.x)b=!b;}return b;}
const grounded={...shape,z:0,height27j:90};const polys=O.coverOccluders(grounded,520);const at=z=>{const v=P.vertical46(1000,520,z);return{x:1000+v.x,y:520+v.y}};
assert(polys.some(p=>inPoly(p,at(40))),'torso behind tall cover hidden');assert(!polys.some(p=>inPoly(p,at(160))),'legitimate height above top stays visible');
// Raster mask diagnostic, not gameplay: actual Canvas clipping must suppress the
// same solid pixels regardless of attached aim state, including a neighboring face.
const {createCanvas}=require('@napi-rs/canvas');
function pixels(owner,exposed){const canvas=createCanvas(2200,1100),g=canvas.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,2200,1100);O.withCoverOcclusion(g,[grounded,{...grounded,id:'other',x:1070}],520,10,()=>{g.fillStyle='#ff0000';g.fillRect(900,100,250,480);},owner,exposed);return {canvas,data:g.getImageData(0,0,2200,1100).data};}
const free=pixels(null,false),aim=pixels('test',true);assert.deepEqual(aim.data,free.data);const torso=at(40),sky=at(160);assert.equal(aim.data[(Math.floor(torso.y)*2200+Math.floor(torso.x))*4+1],255,'actual hidden torso pixel removed');assert.equal(aim.data[(Math.floor(sky.y)*2200+Math.floor(sky.x))*4+1],0,'exposed pixel remains');
console.log('PASS35 native Canvas pixel mask: no aiming bypass, no lost legitimate upper exposure');
