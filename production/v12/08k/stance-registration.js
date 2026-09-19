/* 08K provisional stance origin. Exact source pixels and image scale are unchanged.
 * A source foot pivot is not the actor's stance center. Translation only; no IK,
 * new frames, rigging, rotation, or anatomy completion is claimed.
 */
(function(root){
'use strict';
const C=root.JadeCore||(typeof require==='function'?require('./core.js'):null);
const Flow=root.JadeFlow||(typeof require==='function'?require('./motion-flow.js'):null);
const POSES=Object.freeze([
 Object.freeze({id:'K01',stance:Object.freeze([300,790]),pelvis:Object.freeze([300,433]),nearFoot:Object.freeze([125,790]),farFoot:Object.freeze([455,756])}),
 Object.freeze({id:'K02',stance:Object.freeze([320,790]),pelvis:Object.freeze([320,433]),nearFoot:Object.freeze([145,790]),farFoot:Object.freeze([475,756])}),
 Object.freeze({id:'K03',stance:Object.freeze([340,790]),pelvis:Object.freeze([340,433]),nearFoot:Object.freeze([163,790]),farFoot:Object.freeze([596,767])})
]);
function record(index){if(!Number.isInteger(index)||index<0||index>=POSES.length)throw Error('Unknown final pose');return POSES[index];}
function anchor(index,enabled=true){return (enabled?record(index).stance:C.FINAL[index].ground).slice();}
function transform(actor,source,origin){return{x:actor.x+(source[0]-origin[0])*C.ART_SCALE,y:actor.y,z:(origin[1]-source[1])*C.ART_SCALE};}
function socket(actor,which='muzzle',enabled=true){
 if(!enabled||!C.supported(actor))return C.sampleSocket(actor,which);
 if(!['muzzle','breech'].includes(which))throw Error('Unknown socket');
 return {...transform(actor,C.FINAL[actor.pose][which],anchor(actor.pose,true)),status:'candidate-stance-final-socket'};
}
function screenLandmarks(frame,origin,zoom){
 if(!frame.final)return null;
 const r=record(frame.poseIndex),s=frame.scale*zoom;
 const project=xy=>({x:origin.x+(xy[0]-frame.anchor[0])*s,y:origin.y+(xy[1]-frame.anchor[1])*s});
 return{pelvis:project(r.pelvis),nearFoot:project(r.nearFoot),farFoot:project(r.farFoot),
  legacyOrigin:project(C.FINAL[frame.poseIndex].ground),stance:project(r.stance),
  muzzle:project(C.FINAL[frame.poseIndex].muzzle),status:'MANUAL LANDMARK CANDIDATES; not solved 3D foot contacts'};
}
class World extends Flow.World{
 constructor(options={}){super(options);this.registrationEnabled=options.registration!==false;}
 socket(p=this.p,which='muzzle'){return socket(p,which,this.registrationEnabled!==false);}
 setRegistration(enabled){this.registrationEnabled=!!enabled;}
}
const api={POSES,anchor,transform,socket,screenLandmarks,World};root.JadeStance=api;
if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
