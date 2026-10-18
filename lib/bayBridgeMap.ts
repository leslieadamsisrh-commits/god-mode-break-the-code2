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
export const BAY_SPAWNS=[{id:"A",x:230,y:330,z:0},{id:"B",x:770,y:330,z:0}] as const;
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
const shelter45=(id:string,x:number)=>({...obj(id,x,330,34,118,0,"maintenance-block","CONCRETE","tall","CENTER",100,9999,"Anchored Spawn Shelter"),gripCompatible:false,throwable:false,editorMetadata:{label:"Anchored Spawn Shelter",locked:true}});
// Legacy export names are retained for existing combat/render imports, not an old map.
// Dimension 33 Arena Evolution — reference-locked symmetric combat topology.
// Previous geometry remains recoverable in Git history. Gameplay is mirrored around x=500.
export const BAY_OBJECTS:BayMapObject[]=[
 // Mirrored spawn-side defensive shelters and industrial flank nodes.
 shelter45("war-shelter-a",290),shelter45("war-shelter-b",710),
 obj("d33-west-north-node",190,158,48,58,0,"maintenance-cabinet","INFRASTRUCTURE","tall","LEFT_FLANK",9,180,"West Industrial Node"),
 obj("d33-east-north-node",810,158,48,58,0,"maintenance-cabinet","INFRASTRUCTURE","tall","LEFT_FLANK",9,180,"East Industrial Node"),
 obj("d33-west-south-node",190,502,48,58,0,"maintenance-cabinet","INFRASTRUCTURE","tall","RIGHT_FLANK",9,180,"West Salvage Node"),
 obj("d33-east-south-node",810,502,48,58,0,"maintenance-cabinet","INFRASTRUCTURE","tall","RIGHT_FLANK",9,180,"East Salvage Node"),
 // Northern and southern platform approaches: symmetrical low cover at stair feet.
 obj("d33-north-west-step",435,170,68,28,0,"damaged-jersey","CONCRETE","waist","LEFT_FLANK",7,140,"North Platform West Approach"),
 obj("d33-north-east-step",565,170,68,28,0,"damaged-jersey","CONCRETE","waist","LEFT_FLANK",7,140,"North Platform East Approach"),
 obj("d33-south-west-step",435,490,68,28,0,"damaged-jersey","CONCRETE","waist","RIGHT_FLANK",7,140,"South Platform West Approach"),
 obj("d33-south-east-step",565,490,68,28,0,"damaged-jersey","CONCRETE","waist","RIGHT_FLANK",7,140,"South Platform East Approach"),
 // Primary lane cover: mirrored left/right and north/south.
 obj("d33-nw-primary",355,235,98,30,0,"damaged-jersey","CONCRETE","waist","LEFT_FLANK",7,160,"North West Primary Cover"),
 obj("d33-ne-primary",645,235,98,30,0,"damaged-jersey","CONCRETE","waist","LEFT_FLANK",7,160,"North East Primary Cover"),
 obj("d33-sw-primary",355,425,98,30,0,"damaged-jersey","CONCRETE","waist","RIGHT_FLANK",7,160,"South West Primary Cover"),
 obj("d33-se-primary",645,425,98,30,0,"damaged-jersey","CONCRETE","waist","RIGHT_FLANK",7,160,"South East Primary Cover"),
 // Central circular combat objective represented by four radial, destructible segments.
 obj("d33-center-nw",446,288,70,26,-.5,"fractured-divider","CONCRETE","waist","CENTER",9,180,"Central Ring NW"),
 obj("d33-center-ne",554,288,70,26,.5,"fractured-divider","CONCRETE","waist","CENTER",9,180,"Central Ring NE"),
 obj("d33-center-sw",446,372,70,26,.5,"fractured-divider","CONCRETE","waist","CENTER",9,180,"Central Ring SW"),
 obj("d33-center-se",554,372,70,26,-.5,"fractured-divider","CONCRETE","waist","CENTER",9,180,"Central Ring SE"),
 // Outer flank gates leave open lanes between cover clusters.
 obj("d33-west-north-flank",290,300,64,34,0,"fractured-divider","CONCRETE","waist","LEFT_FLANK",8,145,"West North Flank"),
 obj("d33-east-north-flank",710,300,64,34,0,"fractured-divider","CONCRETE","waist","LEFT_FLANK",8,145,"East North Flank"),
 obj("d33-west-south-flank",290,360,64,34,0,"fractured-divider","CONCRETE","waist","RIGHT_FLANK",8,145,"West South Flank"),
 obj("d33-east-south-flank",710,360,64,34,0,"fractured-divider","CONCRETE","waist","RIGHT_FLANK",8,145,"East South Flank")
];
// Authored low arena slabs, distinct from unchanged46u generated protection.
for(const o of BAY_OBJECTS)if(o.coverClass==="waist"){o.dimensions.z=32;o.rig=rigFor(o.shellProfile,o.dimensions.w,o.dimensions.h,32);}
export const BAY_DEPTH_DOMAINS=[
 {id:"L0_SKY",nominalDistance:5000,parallax:.015},
 {id:"L1_FAR",nominalDistance:1800,parallax:.035},
 {id:"L2_BRIDGE",nominalDistance:650,parallax:.08},
 {id:"L3_COMBAT",nominalDistance:0,parallax:1},
 {id:"L4_NEAR",nominalDistance:-120,parallax:1.12},
 {id:"L5_FOREGROUND",nominalDistance:-300,parallax:1.28}
] as const;
export function bayCoverState(){
 return BAY_OBJECTS.map(o=>({id:o.id,protected45:!!o.editorMetadata.locked,x:o.worldPosition.x,y:o.worldPosition.y,w:o.collisionHull.w,h:o.collisionHull.h,a:o.rotation,hp:o.breakThreshold,maxHp:o.breakThreshold,generated:false,build:0,variant:o.material==="STEEL"?3:o.material==="VEHICLE"?2:o.material==="INFRASTRUCTURE"?1:0,coverClass:o.coverClass as "waist"|"tall"}));
}
const generatedShell45=obj("war-generated-shell45",0,0,112,34,0,"damaged-jersey","CONCRETE","waist","CENTER",7,140,"Generated Concrete Shell");
const floorShell46=obj("floor-panel46",0,0,80,54,0,"damaged-jersey","CONCRETE","waist","CENTER",7,280,"Extracted Floor Slab");floorShell46.dimensions.z=14;floorShell46.rig=rigFor("BLOCK",80,54,14);
export function bayObject(id:string){return id===floorShell46.id?floorShell46:id===generatedShell45.id?generatedShell45:BAY_OBJECTS.find(o=>o.id===id)}

