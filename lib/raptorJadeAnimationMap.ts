/** Raptor art presentation mapping to the EXISTING Jade runtime families.
 * Visual-only. This file must never import combat simulation or modify rules.
 * Every entry remains pending until an uncropped alpha source and anchors are verified.
 */
import {RAPTOR_POSES,findRaptorPose} from "./raptorPresentation";
export type JadeFamily="ready"|"run"|"slide"|"cover";
export type RaptorAction="idle"|"run"|"sprint"|"slide"|"soft-cover"|"brace"|"cover-move"|"fire"|"shield"|"melee"|"hit"|"knockdown"|"recover";
export type VisualMapping=Readonly<{action:RaptorAction;jadeFamily:JadeFamily;raptorRefs:readonly string[];requiresDirection:boolean}>;
export const RAPTOR_ACTION_MAP:readonly VisualMapping[]=[
 {action:"idle",jadeFamily:"ready",raptorRefs:["R001"],requiresDirection:true},
 {action:"run",jadeFamily:"run",raptorRefs:["R002","R003","R004","R005"],requiresDirection:true},
 {action:"sprint",jadeFamily:"run",raptorRefs:["R006","R037"],requiresDirection:true},
 {action:"slide",jadeFamily:"slide",raptorRefs:["R038","R019"],requiresDirection:true},
 {action:"soft-cover",jadeFamily:"cover",raptorRefs:["R020"],requiresDirection:true},
 {action:"brace",jadeFamily:"cover",raptorRefs:["R022"],requiresDirection:true},
 {action:"cover-move",jadeFamily:"cover",raptorRefs:["R021","R024"],requiresDirection:true},
 {action:"fire",jadeFamily:"ready",raptorRefs:["R007","R008","R009"],requiresDirection:true},
 {action:"shield",jadeFamily:"cover",raptorRefs:["R023","R026"],requiresDirection:true},
 {action:"melee",jadeFamily:"ready",raptorRefs:["R013","R014","R015","R016","R017","R018"],requiresDirection:true},
 {action:"hit",jadeFamily:"ready",raptorRefs:["R031","R032","R033","R034"],requiresDirection:true},
 {action:"knockdown",jadeFamily:"slide",raptorRefs:["R035"],requiresDirection:true},
 {action:"recover",jadeFamily:"ready",raptorRefs:["R036"],requiresDirection:true}
];
export function raptorArtReadiness(){
 const referenced=[...new Set(RAPTOR_ACTION_MAP.flatMap(x=>x.raptorRefs))];
 const missing=referenced.filter(id=>{const pose=findRaptorPose(id);return !pose?.validated||!pose.framePath||!pose.groundAnchor;});
 return {totalConceptPoses:RAPTOR_POSES.length,referenced:referenced.length,validated:referenced.length-missing.length,missing,ready:missing.length===0};
}
export function validateMapping(){
 const valid=new Set(RAPTOR_POSES.map(p=>p.id));
 return RAPTOR_ACTION_MAP.every(m=>m.raptorRefs.length>0&&m.raptorRefs.every(id=>valid.has(id as typeof RAPTOR_POSES[number]["id"])));
}
