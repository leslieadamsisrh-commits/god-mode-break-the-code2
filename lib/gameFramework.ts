export type ModeId="story"|"war_1v1"|"war_2v2"|"war_ffa4"|"arcade"|"training";
export type MatchDefinition={id:string;mode:ModeId;arena:string;players:number;teams:number;bots:number;rounds:number;victory:"story"|"rounds"|"score"|"training";respawn:boolean;networked:boolean;powerRules:"standard"|"story"|"training";status:"PLAYABLE"|"DEVELOPMENT"};
export type CharacterDefinition={id:string;name:string;status:"PLAYABLE"|"LOCKED"|"DEVELOPMENT";role:string;combatAuthority?:boolean};
export type ArenaDefinition={id:string;name:string;status:"PLAYABLE"|"DEVELOPMENT";camera:string;materialSet:string[]};
export type GodTier={id:string;label:string;accel:number;brake:number;redirect:number;slide:number;psychic:number;fx:number};

export const CHARACTERS:CharacterDefinition[]=[
 {id:"jade",name:"JADE",status:"PLAYABLE",role:"Psychic combatant",combatAuthority:true},
 {id:"gorilla-milk",name:"GORILLA MILK",status:"DEVELOPMENT",role:"Cybernetic power fighter"},
 {id:"adamus-prime",name:"ADAMUS PRIME",status:"DEVELOPMENT",role:"War Games champion"}
];
export const COMPANIONS=[{id:"ruby",name:"RUBY",status:"DEVELOPMENT"}] as const;
export const ARENAS:ArenaDefinition[]=[
 {id:"bay-bridge",name:"BAY BRIDGE",status:"DEVELOPMENT",camera:"COMIC_DEPTH_B_31",materialSet:["CONCRETE","STEEL","ROADWAY","VEHICLE"]},
 {id:"dimension-33",name:"DIMENSION 33",status:"PLAYABLE",camera:"COMIC_DEPTH",materialSet:["STEEL","INTERDIMENSIONAL"]},
 {id:"oakland",name:"OAKLAND",status:"DEVELOPMENT",camera:"COMIC_DEPTH",materialSet:["CONCRETE","ROADWAY"]},
 {id:"ukiah",name:"UKIAH",status:"DEVELOPMENT",camera:"COMIC_DEPTH",materialSet:["STONE","WOOD"]},
 {id:"santa-cruz-lab",name:"SANTA CRUZ LAB",status:"DEVELOPMENT",camera:"COMIC_DEPTH",materialSet:["STEEL","LAB"]}
];
export const POWERS=["SLOW_TIME","SHIELD","GRIP","GENERATE_COVER","UNMAKE","ORBIT","PINBALL","GOD_EVOLUTION"] as const;
export const WEAPONS=["SHOTGUN","HANDGUN","ASSAULT_RIFLE","SNIPER_RAIL"] as const;
export const MODES:Record<ModeId,MatchDefinition>={
 story:{id:"story-01",mode:"story",arena:"dimension-33",players:1,teams:1,bots:0,rounds:1,victory:"story",respawn:false,networked:false,powerRules:"story",status:"DEVELOPMENT"},
 war_1v1:{id:"war-1v1",mode:"war_1v1",arena:"dimension-33",players:2,teams:2,bots:1,rounds:3,victory:"rounds",respawn:false,networked:true,powerRules:"standard",status:"DEVELOPMENT"},
 war_2v2:{id:"war-2v2",mode:"war_2v2",arena:"dimension-33",players:4,teams:2,bots:2,rounds:3,victory:"rounds",respawn:false,networked:true,powerRules:"standard",status:"DEVELOPMENT"},
 war_ffa4:{id:"war-ffa4",mode:"war_ffa4",arena:"dimension-33",players:4,teams:4,bots:3,rounds:3,victory:"score",respawn:true,networked:true,powerRules:"standard",status:"DEVELOPMENT"},
 arcade:{id:"arcade-01",mode:"arcade",arena:"dimension-33",players:1,teams:2,bots:1,rounds:1,victory:"score",respawn:false,networked:false,powerRules:"standard",status:"DEVELOPMENT"},
 training:{id:"training",mode:"training",arena:"dimension-33",players:1,teams:1,bots:1,rounds:1,victory:"training",respawn:true,networked:false,powerRules:"training",status:"PLAYABLE"}
};
export const MATCH_LIFECYCLE=["BOOT","TITLE","MAIN_MENU","MODE_SELECT","CHARACTER_SELECT","ARENA_SELECT","LOADING","MATCH_INTRO","FIGHT","ROUND_END","RESULTS","REMATCH_MENU"] as const;
export const GOD_TIERS:GodTier[]=[
 {id:"base",label:"BASE",accel:1,brake:1,redirect:1,slide:1,psychic:1,fx:0},
 {id:"tier1",label:"TIER I",accel:1.06,brake:1.08,redirect:1.06,slide:1.03,psychic:1.08,fx:.25},
 {id:"tier2",label:"TIER II",accel:1.12,brake:1.16,redirect:1.12,slide:1.06,psychic:1.18,fx:.5},
 {id:"tier3",label:"TIER III",accel:1.2,brake:1.26,redirect:1.2,slide:1.1,psychic:1.3,fx:.75},
 {id:"god",label:"GOD FRAME",accel:1.32,brake:1.4,redirect:1.32,slide:1.16,psychic:1.5,fx:1}
];
// Data only. Tier modifiers are not applied to frozen Base Jade until a dedicated playtest pass.

