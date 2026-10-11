/** Raptor Combat Lab roadmap. No simulation modifications. */
export type RaptorLabStage="COMPLETE"|"IN_PROGRESS"|"BLOCKED"|"PLANNED";
export const RAPTOR_LAB_MILESTONES=[
 {id:1,title:"Freeze shared movement baseline",stage:"COMPLETE",evidence:"Railway commit 4bf6f19c; existing LocalCombat"},
 {id:2,title:"Render simulated cover and camera",stage:"COMPLETE",evidence:"Cover geometry and follow camera committed; runtime user confirmed movement"},
 {id:3,title:"Character presentation adapter",stage:"PLANNED",evidence:"No runtime adapter yet"},
 {id:4,title:"Registered clean Raptor sprites",stage:"BLOCKED",evidence:"Approved reference sheets are clipped/composited; no validated alpha assets"},
 {id:5,title:"Jurassic Sprint",stage:"PLANNED",evidence:"Animation and foot-anchor QA required"},
 {id:6,title:"Slide and cover transitions",stage:"PLANNED",evidence:"Reuse universal simulation"},
 {id:7,title:"Weapon presentation",stage:"PLANNED",evidence:"Reuse shared firing and damage"},
 {id:8,title:"Psychic presentation",stage:"PLANNED",evidence:"Reuse shared shield, Grip and battery"},
 {id:9,title:"Jade opponent",stage:"PLANNED",evidence:"Second actor and renderer not implemented"},
 {id:10,title:"Controller-tested sparring",stage:"PLANNED",evidence:"Two-character runtime QA required"}
] as const;
