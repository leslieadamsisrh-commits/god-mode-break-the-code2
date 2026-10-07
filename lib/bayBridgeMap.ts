export type DepthDomain="L0_SKY"|"L1_FAR"|"L2_BRIDGE"|"L3_COMBAT"|"L4_NEAR"|"L5_FOREGROUND";
export type BayMaterial="CONCRETE"|"STEEL"|"VEHICLE"|"ROADWAY"|"INFRASTRUCTURE";
export type BayLane="LEFT_FLANK"|"CENTER"|"RIGHT_FLANK"|"LONG_SIGHT";
export type BayMapObject={
 id:string;worldPosition:{x:number;y:number;z:number};dimensions:{w:number;h:number;z:number};rotation:number;
 depthDomain:DepthDomain;collisionHull:{shape:"box";w:number;h:number};renderedShell:string;material:BayMaterial;
 coverClass:"waist"|"tall"|null;topology:"FACE_EDGE_CORNER"|null;lane:BayLane;mass:number;rotationalInertia:number;
 shellProfile:"BARRIER"|"DIVIDER"|"SEDAN"|"VAN"|"CABINET"|"GIRDER"|"RAILING"|"EQUIPMENT"|"MODULE"|"BLOCK";planes:("TOP"|"FRONT"|"BACK"|"LEFT"|"RIGHT"|"END"|"DETAIL"|"DAMAGE"|"GLASS"|"EMISSIVE")[];
 rig:{spine:{x0:number;y0:number;z0:number;x1:number;y1:number;z1:number};ribs:{t:number;width:number;height:number}[];coverRails:{side:"FRONT"|"BACK"|"LEFT"|"RIGHT";from:number;to:number;height:number}[];contactPoints:{x:number;y:number}[];occlusionHeight:number};
 breakThreshold:number;gripCompatible:boolean;throwable:boolean;destructionFamily:string;editorMetadata:{label:string;locked?:boolean};
};
export const BAY_CAMERA={id:"CAMERA_B",pitch:31,yaw:-25,combatScaleMin:.96,combatScaleMax:1.035,weakPerspective:true} as const;
export const BAY_BOUNDS={left:70,right:930,top:90,bottom:550} as const;
export const BAY_SPAWNS=[{id:"A",x:230,y:330,z:0},{id:"B",x:780,y:330,z:0}] as const;
export const BAY_LANES=[
 {id:"LEFT_FLANK",x0:120,y0:150,x1:880,y1:260},
 {id:"CENTER",x0:150,y0:260,x1:850,y1:410},
 {id:"RIGHT_FLANK",x0:120,y0:410,x1:880,y1:520},
 {id:"LONG_SIGHT",x0:250,y0:115,x1:760,y1:175}
] as const;
const profile=(shell:string):BayMapObject["shellProfile"]=>shell.includes("sedan")?"SEDAN":shell.includes("van")?"VAN":shell.includes("cabinet")?"CABINET":shell.includes("girder")?"GIRDER":shell.includes("railing")?"RAILING":shell.includes("equipment")?"EQUIPMENT":shell.includes("module")?"MODULE":shell.includes("block")?"BLOCK":shell.includes("divider")?"DIVIDER":"BARRIER";
function rigFor(profile:BayMapObject["shellProfile"],w:number,h:number,z:number):BayMapObject["rig"]{
 const base={spine:{x0:-w*.45,y0:0,z0:z*.45,x1:w*.45,y1:0,z1:z*.45},ribs:[{t:0,width:h,height:z*.8},{t:.5,width:h,height:z},{t:1,width:h,height:z*.8}],coverRails:[{side:"FRONT" as const,from:.08,to:.92,height:z*.62},{side:"BACK" as const,from:.08,to:.92,height:z*.62}],contactPoints:[{x:-w*.38,y:h*.42},{x:w*.38,y:h*.42}],occlusionHeight:z};
 if(profile==="SEDAN")return{...base,ribs:[{t:0,width:h*.82,height:z*.42},{t:.22,width:h*.96,height:z*.62},{t:.42,width:h,height:z*.86},{t:.68,width:h*.98,height:z*.84},{t:.88,width:h*.9,height:z*.52},{t:1,width:h*.72,height:z*.38}],contactPoints:[{x:-w*.34,y:h*.48},{x:w*.34,y:h*.48}],coverRails:[{side:"FRONT",from:.08,to:.92,height:z*.52},{side:"BACK",from:.12,to:.88,height:z*.52}]};
 if(profile==="VAN")return{...base,ribs:[{t:0,width:h*.9,height:z*.68},{t:.16,width:h,height:z*.96},{t:.78,width:h,height:z},{t:1,width:h*.92,height:z*.82}],coverRails:[{side:"FRONT",from:.04,to:.96,height:z*.74},{side:"BACK",from:.04,to:.96,height:z*.74}]};
 if(profile==="GIRDER")return{...base,ribs:[{t:0,width:h*.72,height:z*.65},{t:.18,width:h,height:z},{t:.5,width:h*.8,height:z*.86},{t:.82,width:h,height:z},{t:1,width:h*.62,height:z*.58}],coverRails:[{side:"FRONT",from:.12,to:.88,height:z*.55}]};
 if(profile==="RAILING")return{...base,ribs:[{t:0,width:h*.7,height:z},{t:.25,width:h*.55,height:z},{t:.5,width:h*.55,height:z},{t:.75,width:h*.55,height:z},{t:1,width:h*.7,height:z}],coverRails:[{side:"FRONT",from:0,to:1,height:z*.48}]};
 if(profile==="CABINET"||profile==="MODULE")return{...base,ribs:[{t:0,width:h*.94,height:z*.94},{t:.5,width:h,height:z},{t:1,width:h*.94,height:z*.94}],coverRails:[{side:"FRONT",from:.04,to:.96,height:z*.72},{side:"BACK",from:.04,to:.96,height:z*.72},{side:"LEFT",from:.08,to:.92,height:z*.7},{side:"RIGHT",from:.08,to:.92,height:z*.7}]};
 if(profile==="EQUIPMENT")return{...base,ribs:[{t:0,width:h*.7,height:z*.62},{t:.28,width:h,height:z*.92},{t:.65,width:h*.9,height:z},{t:1,width:h*.62,height:z*.7}],coverRails:[{side:"FRONT",from:.12,to:.86,height:z*.58}]};
 if(profile==="DIVIDER")return{...base,ribs:[{t:0,width:h*.72,height:z*.76},{t:.2,width:h,height:z},{t:.5,width:h*.94,height:z*.92},{t:.8,width:h,height:z},{t:1,width:h*.7,height:z*.72}]};
 if(profile==="BLOCK")return{...base,ribs:[{t:0,width:h*.86,height:z*.8},{t:.18,width:h,height:z*.96},{t:.52,width:h*.92,height:z},{t:.82,width:h,height:z*.9},{t:1,width:h*.78,height:z*.7}]};
 return{...base,ribs:[{t:0,width:h*.7,height:z*.72},{t:.16,width:h,height:z},{t:.5,width:h*.9,height:z*.92},{t:.84,width:h,height:z},{t:1,width:h*.68,height:z*.7}]};
}
const obj=(id:string,x:number,y:number,w:number,h:number,rotation:number,shell:string,material:BayMaterial,coverClass:"waist"|"tall",lane:BayLane,mass:number,breakThreshold:number,label:string):BayMapObject=>({
 id,worldPosition:{x,y,z:0},dimensions:{w,h,z:coverClass==="tall"?78:46},rotation,depthDomain:"L3_COMBAT",collisionHull:{shape:"box",w,h},renderedShell:shell,material,coverClass,topology:"FACE_EDGE_CORNER",lane,mass,rotationalInertia:mass*(w*w+h*h)/12,shellProfile:profile(shell),rig:rigFor(profile(shell),w,h,coverClass==="tall"?78:46),planes:["TOP","FRONT","BACK","LEFT","RIGHT","END","DETAIL","DAMAGE",...(material==="VEHICLE"?["GLASS" as const]:[]),...(material==="INFRASTRUCTURE"?["EMISSIVE" as const]:[])],breakThreshold,gripCompatible:true,throwable:true,destructionFamily:material.toLowerCase()+"-debris",editorMetadata:{label}
});
export const BAY_OBJECTS:BayMapObject[]=[
 // CENTER: offset waist cover creates a dangerous contest without sealing the lane.
 obj("bay-jersey",342,338,112,34,-.10,"damaged-jersey","CONCRETE","waist","CENTER",7,140,"Damaged Jersey Barrier"),
 obj("bay-divider",658,338,132,36,.10,"fractured-divider","CONCRETE","waist","CENTER",9,170,"Fractured Divider"),
 // LEFT FLANK: vehicle chain supports pop-shot boost exchanges with a deliberate gap.
 obj("bay-sedan",402,232,118,48,.08,"wrecked-sedan","VEHICLE","waist","LEFT_FLANK",12,210,"Wrecked Sedan"),
 obj("bay-service-van",748,238,122,52,-.06,"service-van","VEHICLE","tall","LEFT_FLANK",16,250,"Service Vehicle"),
 // RIGHT FLANK: mixed heights create Brake/slide routing rather than a continuous wall.
 obj("bay-cabinet",438,468,48,58,0,"maintenance-cabinet","INFRASTRUCTURE","tall","RIGHT_FLANK",9,180,"Maintenance Cabinet"),
 obj("bay-girder",565,455,126,32,.08,"fractured-girder","STEEL","waist","RIGHT_FLANK",15,260,"Fractured Steel Girder"),
 obj("bay-roadwork",292,466,82,46,.10,"roadwork-equipment","INFRASTRUCTURE","waist","RIGHT_FLANK",8,160,"Roadwork Equipment"),
 obj("bay-module",756,458,112,50,-.06,"service-module","STEEL","tall","RIGHT_FLANK",18,280,"Service Module"),
 // Long sightline is interrupted at its midpoint but remains readable end-to-end.
 obj("bay-railing",505,170,142,28,0,"broken-railing","STEEL","waist","LONG_SIGHT",10,190,"Broken Railing Base"),
 // Center-right anchor creates a second cover decision without mirroring the arena mechanically.
 obj("bay-block",582,274,94,42,-.08,"maintenance-block","CONCRETE","waist","CENTER",13,230,"Concrete Maintenance Block")
];
export const BAY_DEPTH_DOMAINS=[
 {id:"L0_SKY",nominalDistance:5000,parallax:.015},
 {id:"L1_FAR",nominalDistance:1800,parallax:.035},
 {id:"L2_BRIDGE",nominalDistance:650,parallax:.08},
 {id:"L3_COMBAT",nominalDistance:0,parallax:1},
 {id:"L4_NEAR",nominalDistance:-120,parallax:1.12},
 {id:"L5_FOREGROUND",nominalDistance:-300,parallax:1.28}
] as const;
export function bayCoverState(){
 return BAY_OBJECTS.map(o=>({id:o.id,x:o.worldPosition.x,y:o.worldPosition.y,w:o.collisionHull.w,h:o.collisionHull.h,a:o.rotation,hp:o.breakThreshold,maxHp:o.breakThreshold,generated:false,build:0,variant:o.material==="STEEL"?3:o.material==="VEHICLE"?2:o.material==="INFRASTRUCTURE"?1:0,coverClass:o.coverClass as "waist"|"tall"}));
}
export function bayObject(id:string){return BAY_OBJECTS.find(o=>o.id===id)}
