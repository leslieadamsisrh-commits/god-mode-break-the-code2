export type DepthDomain="L0_SKY"|"L1_FAR"|"L2_BRIDGE"|"L3_COMBAT"|"L4_NEAR"|"L5_FOREGROUND";
export type BayMaterial="CONCRETE"|"STEEL"|"VEHICLE"|"ROADWAY"|"INFRASTRUCTURE";
export type BayLane="LEFT_FLANK"|"CENTER"|"RIGHT_FLANK"|"LONG_SIGHT";
export type BayMapObject={
 id:string;worldPosition:{x:number;y:number;z:number};dimensions:{w:number;h:number;z:number};rotation:number;
 depthDomain:DepthDomain;collisionHull:{shape:"box";w:number;h:number};renderedShell:string;material:BayMaterial;
 coverClass:"waist"|"tall"|null;topology:"FACE_EDGE_CORNER"|null;lane:BayLane;mass:number;rotationalInertia:number;
 shellProfile:"BARRIER"|"DIVIDER"|"SEDAN"|"VAN"|"CABINET"|"GIRDER"|"RAILING"|"EQUIPMENT"|"MODULE"|"BLOCK";planes:("TOP"|"FRONT"|"BACK"|"LEFT"|"RIGHT"|"END"|"DETAIL"|"DAMAGE"|"GLASS"|"EMISSIVE")[];
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
const obj=(id:string,x:number,y:number,w:number,h:number,rotation:number,shell:string,material:BayMaterial,coverClass:"waist"|"tall",lane:BayLane,mass:number,breakThreshold:number,label:string):BayMapObject=>({
 id,worldPosition:{x,y,z:0},dimensions:{w,h,z:coverClass==="tall"?78:46},rotation,depthDomain:"L3_COMBAT",collisionHull:{shape:"box",w,h},renderedShell:shell,material,coverClass,topology:"FACE_EDGE_CORNER",lane,mass,rotationalInertia:mass*(w*w+h*h)/12,shellProfile:profile(shell),planes:["TOP","FRONT","BACK","LEFT","RIGHT","END","DETAIL","DAMAGE",...(material==="VEHICLE"?["GLASS" as const]:[]),...(material==="INFRASTRUCTURE"?["EMISSIVE" as const]:[])],breakThreshold,gripCompatible:true,throwable:true,destructionFamily:material.toLowerCase()+"-debris",editorMetadata:{label}
});
export const BAY_OBJECTS:BayMapObject[]=[
 obj("bay-jersey-a",286,337,112,34,-.08,"damaged-jersey","CONCRETE","waist","CENTER",7,140,"Jersey A"),
 obj("bay-jersey-b",714,337,112,34,.08,"damaged-jersey","CONCRETE","waist","CENTER",7,140,"Jersey B"),
 obj("bay-divider-l",390,455,132,36,.10,"fractured-divider","CONCRETE","waist","RIGHT_FLANK",9,170,"Divider L"),
 obj("bay-divider-r",610,215,132,36,-.10,"fractured-divider","CONCRETE","waist","LEFT_FLANK",9,170,"Divider R"),
 obj("bay-sedan-l",405,235,118,48,.08,"wrecked-sedan","VEHICLE","waist","LEFT_FLANK",12,210,"Wrecked Sedan L"),
 obj("bay-sedan-r",595,435,118,48,-.08,"wrecked-sedan","VEHICLE","waist","RIGHT_FLANK",12,210,"Wrecked Sedan R"),
 obj("bay-cabinet-l",474,188,48,58,0,"maintenance-cabinet","INFRASTRUCTURE","tall","LEFT_FLANK",9,180,"Maintenance Cabinet L"),
 obj("bay-cabinet-r",526,482,48,58,0,"maintenance-cabinet","INFRASTRUCTURE","tall","RIGHT_FLANK",9,180,"Maintenance Cabinet R"),
 obj("bay-girder-center",500,350,126,32,0,"fractured-girder","STEEL","waist","CENTER",15,260,"Center Girder"),
 obj("bay-service-van",780,245,122,52,-.05,"service-van","VEHICLE","tall","LEFT_FLANK",16,250,"Service Van")
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
