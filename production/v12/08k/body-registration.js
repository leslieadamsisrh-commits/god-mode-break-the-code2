/* V12 08K visual registration layer.
 * Purpose: keep different character sources attached to the same simulation root
 * without changing movement, collision radius, cover contact or Jade's design.
 * Calibration offsets are presentation-only and remain zero until measured.
 */
(function(root){
'use strict';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
function point(p,name){if(!Array.isArray(p)||p.length!==2||!p.every(finite))throw Error('Invalid '+name);return [p[0],p[1]];}
function makeRecord({id,source,canvas,rootAnchor,pelvis=null,leftFoot=null,rightFoot=null,scale=1,offset=[0,0],status='UNMEASURED'}){
 if(!id||!source)throw Error('Registration id/source required');
 if(!Array.isArray(canvas)||canvas.length!==2||!canvas.every(finite))throw Error('Invalid canvas');
 if(!finite(scale)||scale<=0)throw Error('Invalid scale');
 return Object.freeze({id,source,canvas:[...canvas],rootAnchor:point(rootAnchor,'rootAnchor'),
   pelvis:pelvis?point(pelvis,'pelvis'):null,leftFoot:leftFoot?point(leftFoot,'leftFoot'):null,
   rightFoot:rightFoot?point(rightFoot,'rightFoot'):null,scale,offset:point(offset,'offset'),status});
}
function drawOrigin(worldScreen,record){
 if(!worldScreen||!finite(worldScreen.x)||!finite(worldScreen.y))throw Error('Invalid world screen root');
 return {
   x:worldScreen.x-record.rootAnchor[0]*record.scale+record.offset[0],
   y:worldScreen.y-record.rootAnchor[1]*record.scale+record.offset[1]
 };
}
function landmarkScreen(worldScreen,record,key){
 const p=record[key];if(!p)return null;const o=drawOrigin(worldScreen,record);
 return {x:o.x+p[0]*record.scale,y:o.y+p[1]*record.scale};
}
function rootError(worldScreen,record){
 const o=drawOrigin(worldScreen,record);
 return {x:o.x+record.rootAnchor[0]*record.scale-worldScreen.x,
         y:o.y+record.rootAnchor[1]*record.scale-worldScreen.y};
}
function compare(a,b,worldScreen){
 const out={rootA:rootError(worldScreen,a),rootB:rootError(worldScreen,b),landmarks:{}};
 for(const key of ['pelvis','leftFoot','rightFoot']){
   const A=landmarkScreen(worldScreen,a,key),B=landmarkScreen(worldScreen,b,key);
   out.landmarks[key]=A&&B?{a:A,b:B,dx:B.x-A.x,dy:B.y-A.y,distance:Math.hypot(B.x-A.x,B.y-A.y)}:null;
 }
 return out;
}
function applyCalibration(record,{dx=0,dy=0,status='MEASURED_REVIEW'}={}){
 if(!finite(dx)||!finite(dy))throw Error('Invalid calibration');
 return makeRecord({...record,offset:[record.offset[0]+dx,record.offset[1]+dy],status});
}
const api={makeRecord,drawOrigin,landmarkScreen,rootError,compare,applyCalibration};
root.JadeRegistration=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
