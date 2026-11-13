import {DEFAULT_CONFIG,type CombatConfig} from "./game";

export const MOVEMENT_PRESETS:Record<string,Partial<CombatConfig>>={
 "39T35 DEFAULT":{},
 "INSTRUCTOR 142 CLASSIC":{weaveEnabled:0,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,slideSpeed:689.15949375,slideDuration:.63,cameraZoom:1.85},
 "GOD MODE WEAVE":{weaveEnabled:1,moveSpeed:262,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:470,dashDuration:.12,doubleTapWindow:.26,slideSpeed:690,slideDuration:.68,slideSustain:520,slideSteer:11.5,slideSteerAngle:.70,slideSteerResponse:8.5,slideBrake:14.5,slideCancelSpeed:195},
 "AKIRA AGILE":{weaveEnabled:1,moveSpeed:262,dashSpeed:500,dashDuration:.13,doubleTapWindow:.30,slideSpeed:690,slideDuration:.62,slideSustain:500,slideSteer:10.5,slideSteerAngle:.78,slideSteerResponse:10,slideBrake:13.5,slideCancelSpeed:185},
 "GEARS WEIGHT":{weaveEnabled:1,moveSpeed:262,dashSpeed:350,dashDuration:.18,doubleTapWindow:.26,slideSpeed:610,slideDuration:.82,slideSustain:260,slideSteer:4.5,slideSteerAngle:.42,slideSteerResponse:5,slideBrake:6.5,slideCancelSpeed:115},
 "HIGH-SKILL WEAVE":{weaveEnabled:1,moveSpeed:262,dashSpeed:455,dashDuration:.11,doubleTapWindow:.23,slideSpeed:720,slideDuration:.66,slideSustain:560,slideSteer:12.5,slideSteerAngle:.68,slideSteerResponse:11,slideBrake:15.5,slideCancelSpeed:205}
};
const weave=MOVEMENT_PRESETS["GOD MODE WEAVE"];
MOVEMENT_PRESETS["WEAVE STEERING + BRAKE"]={
 weaveEnabled:1, slideSteer:weave.slideSteer, slideSteerAngle:weave.slideSteerAngle,
 slideSteerResponse:weave.slideSteerResponse, slideBrake:weave.slideBrake, slideCancelSpeed:weave.slideCancelSpeed
};

const keys=[...new Set(Object.values(MOVEMENT_PRESETS).flatMap(Object.keys))] as (keyof CombatConfig)[];
export function movementProfile(name:string):Partial<CombatConfig>{
 return {...Object.fromEntries(keys.map(key=>[key,DEFAULT_CONFIG[key]])),...MOVEMENT_PRESETS[name]};
}
export function activeMovementProfile(config:CombatConfig){
 return Object.keys(MOVEMENT_PRESETS).find(name=>Object.entries(movementProfile(name))
  .every(([key,value])=>Math.abs(config[key as keyof CombatConfig]-Number(value))<.001))??"CUSTOM";
}

export const MOVEMENT_CONTROLS=[
 ["dashSpeed","Dash speed",280,620,5],["dashDuration","Dash duration",.08,.28,.01],
 ["doubleTapWindow","Double-tap window",.16,.42,.01],["slideSpeed","Slide speed",420,850,5],
 ["slideDuration","Slide duration",.35,1.05,.01],["slideSustain","Slide sustain",0,700,10],
 ["slideSteer","Slide steering",1,14,.25],["slideSteerAngle","Max steer angle",.20,1.05,.01],
 ["slideSteerResponse","Steer response",2,14,.25],["slideBrake","Kinetic brake",2,18,.25],
 ["slideCancelSpeed","Stand-up speed",70,260,5]
] as const;
