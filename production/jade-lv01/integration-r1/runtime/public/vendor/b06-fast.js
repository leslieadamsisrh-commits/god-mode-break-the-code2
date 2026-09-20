/* B06 fast-track presentation layer.
 * Playable-first rough integration. B06-B is the only new authored key.
 * B06-A/D/E reuse accepted CE08. B06-C temporarily reuses B06-B until
 * a true right-shimmy key is authored. Presentation only; no gameplay tuning changes.
 */
(function(root){'use strict';
const B05=root.JadeB05Fast;
const RECORDS=Object.freeze({
 B06A:Object.freeze({...B05.records.CE08,id:'B06A',role:'attached-idle'}),
 B06B:Object.freeze({id:'B06B',file:'assets/b06/B06B.png',width:1312,height:1199,dimensions:[1312,1199],anchor:[650,1095],scale:.162,sha256:'02d27fdb483c5b2bbd65b020ac2ff0afe7f6db5b9918bf38adc0f7e7527d5b55'}),
 B06C:Object.freeze({id:'B06C_PLACEHOLDER',file:'assets/b06/B06B.png',width:1312,height:1199,dimensions:[1312,1199],anchor:[650,1095],scale:.162,sha256:'02d27fdb483c5b2bbd65b020ac2ff0afe7f6db5b9918bf38adc0f7e7527d5b55'}),
 B06D:Object.freeze({...B05.records.CE08,id:'B06D',role:'left-stop'}),
 B06E:Object.freeze({...B05.records.CE08,id:'B06E',role:'right-stop'})
});
function horizontalCover(p){return !!p.cover&&(p.cover.face==='south'||p.cover.face==='north');}
function select(p,time=Infinity){
 // These keys were authored for the station's south face at the right-facing
 // three-quarter view. They are not a universal replacement for every yaw.
 if(!B05.supportedAttached(p)||p.impact>0||p.cornerTravel||p.cover.edge)return null;
 // The low-ready/shimmy artwork has no firing sockets. Leave aim, shot,
 // recoil and retract presentation to the established cover/action router.
 const sinceShot=time-Number(p.lastShot);
 if(p.aimHeld||p.raise>0||p.recoil>0||(Number.isFinite(sinceShot)&&sinceShot>=0&&sinceShot<.16))return null;
 const vx=Number(p.vx)||0;
 if(vx<-20)return{record:RECORDS.B06B,role:'shimmy-left',placeholder:false,reason:'attached horizontal cover with negative lateral velocity'};
 if(vx>20)return{record:RECORDS.B06C,role:'shimmy-right-placeholder',placeholder:true,reason:'temporary reuse of B06-B until true right-shimmy art exists'};
 return{record:RECORDS.B06A,role:p.cover.edge?'edge-stop':'attached-idle',placeholder:false,reason:'attached and laterally settled'};
}
function validateImages(images){
 const r=RECORDS.B06B,im=images[r.file];
 if(!im||im.naturalWidth!==r.width||im.naturalHeight!==r.height)throw Error('B06 asset mismatch: '+r.file);
 return true;
}
const api={records:RECORDS,select,horizontalCover,validateImages};
root.JadeB06Fast=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
