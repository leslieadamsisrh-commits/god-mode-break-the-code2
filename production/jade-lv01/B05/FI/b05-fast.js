/* B05-FI playable-first presentation layer.
 * Presentation only: never mutates movement, collision, camera, shots or damage.
 * Uses exact accepted CE05/CE03/CE08 PNGs. Cover remains separate world geometry.
 */
(function(root){'use strict';
const RECORDS=Object.freeze({
 CE05:Object.freeze({id:'CE05',file:'assets/b05/CE05.png',width:1024,height:1536,dimensions:[1024,1536],anchor:[545,1395],scale:.139,sha256:'62352e395e2f638c890b0e144ea28df7623d45901a858c4a2cbb9bbf0df67049'}),
 CE03:Object.freeze({id:'CE03',file:'assets/b05/CE03.png',width:1312,height:1199,dimensions:[1312,1199],anchor:[650,1128],scale:.161,sha256:'9f6d02a1b4af1557f711befcf0678837d3a0d9eca3a963accc3f93c5167f2dcb'}),
 CE08:Object.freeze({id:'CE08',file:'assets/b05/CE08.png',width:1312,height:1199,dimensions:[1312,1199],anchor:[645,1120],scale:.162,sha256:'c6fbcb046be331d795bbbbb613552435c4cd5639503193646b816f109471e91f'})
});
function absWrap(a){return Math.abs(Math.atan2(Math.sin(a),Math.cos(a)));}
function nearStationApproach(p,covers){
 const r=covers.find(c=>c.id==='station');if(!r||p.slide<=0)return false;
 const withinX=p.x>=r.x-35&&p.x<=r.x+r.w+35;
 const southGap=p.y-(r.y+r.h+p.r);
 return withinX&&p.vy<0&&southGap>=-2&&southGap<=72;
}
function supportedAttached(p){return !!p.cover&&p.cover.id==='station'&&p.cover.face==='south'&&absWrap(p.aim)<=.65;}
function select(p,covers){
 if(nearStationApproach(p,covers))return{record:RECORDS.CE05,role:'compression',reason:'late-slide proximity before cover contact'};
 if(supportedAttached(p)&&p.impact>0){
  if(p.impact>.09)return{record:RECORDS.CE03,role:'contact',reason:'first half of existing 0.18s COVER IMPACT'};
  return{record:RECORDS.CE08,role:'settle',reason:'second half of existing 0.18s COVER IMPACT'};
 }
 return null;
}
const api={records:RECORDS,select,nearStationApproach,supportedAttached};
root.JadeB05Fast=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);