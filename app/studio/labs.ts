export const LABS = [
 {id:"combat",name:"Combat Lab",description:"Shared combat mechanics, controller and hit-registration QA",phase:"FOUNDATION 01"},
 {id:"character",name:"Character Lab",description:"Approved character design, animation and parity inspection",phase:"FOUNDATION 01"},
 {id:"movement",name:"Movement Lab",description:"Slide, acceleration, braking and transitions",phase:"PLANNED"},
 {id:"psychic",name:"Psychic Lab",description:"Universal psychic abilities and battery rules",phase:"PLANNED"},
 {id:"animation",name:"Animation Lab",description:"Directional frames, anchors and visual QA",phase:"PLANNED"},
 {id:"world",name:"World Lab",description:"Maps, cover, depth and collision",phase:"PLANNED"},
 {id:"multiplayer",name:"Multiplayer Lab",description:"Synchronization, latency and match parity",phase:"PLANNED"},
 {id:"integration",name:"Integration Lab",description:"Regression checks and promotion gates",phase:"PLANNED"}
] as const;
export const PARITY = "One universal combat ruleset. Character differences are visual, audio and anatomical presentation only.";
