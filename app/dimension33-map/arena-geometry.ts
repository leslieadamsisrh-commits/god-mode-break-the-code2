/** Geometry uses coordinates on the 1536 × 1024 arena design plate. */
export const PLATE_SCALE = 1.5625;
export type ArenaLevel = 'floor' | 'bridge' | 'tower-west' | 'tower-east';
type Point = [number, number];

const polygon = (x:number,y:number,points:Point[]) => {
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [xi,yi]=points[i],[xj,yj]=points[j];
    if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
  }
  return inside;
};

// Spectator tiers, the Baron stage, and the roofs are outside this floor outline.
const floor:Point[]=[
  [445,244],[1090,244],[1240,300],[1360,400],[1470,560],[1450,710],
  [1250,840],[1010,930],[900,920],[900,945],[635,945],[635,920],
  [525,930],[286,840],[86,710],[65,560],[176,400],[296,300],
];
const westRamp:Point[]=[[393,229],[447,216],[503,306],[431,315]];
const eastRamp:Point[]=westRamp.map(([x,y])=>[1536-x,y] as Point).reverse();
const westBridge:Point[]=[[226,267],[600,180],[622,223],[267,324]];
const eastBridge:Point[]=westBridge.map(([x,y])=>[1536-x,y] as Point).reverse();
// These are the prominent diagonal catwalks beside the rocket ring.
const westDiagonal:Point[]=[[330,298],[369,305],[620,452],[580,485]];
const eastDiagonal:Point[]=westDiagonal.map(([x,y])=>[1536-x,y] as Point).reverse();
const westStep:Point[]=[[563,421],[625,437],[625,500],[560,483]];
const eastStep:Point[]=westStep.map(([x,y])=>[1536-x,y] as Point).reverse();
const rearBridge:Point[]=[[589,186],[947,186],[947,249],[589,249]];
const westTowerDeck:Point[]=[[202,224],[320,224],[359,310],[259,343]];
const eastTowerDeck:Point[]=westTowerDeck.map(([x,y])=>[1536-x,y] as Point).reverse();
const westPerch:Point[]=[[211,211],[315,211],[315,289],[211,289]];
const eastPerch:Point[]=westPerch.map(([x,y])=>[1536-x,y] as Point).reverse();
const undergroundPassages:Point[][]=[
  [[690,170],[846,170],[848,987],[688,987]],
  [[555,320],[981,320],[1005,681],[530,681]],
  [[80,225],[620,225],[650,407],[92,407]],
  [[916,225],[1456,225],[1444,407],[886,407]],
  [[110,398],[629,398],[650,688],[106,688]],
  [[907,398],[1426,398],[1430,688],[886,688]],
  [[130,682],[672,682],[687,872],[118,872]],
  [[864,682],[1406,682],[1418,872],[849,872]],
];
const undergroundWalls:[number,number,number,number][]=[
  [365,368,445,503],[1091,368,1171,503],
  [473,397,541,508],[995,397,1063,508],
  [345,658,582,716],[954,658,1191,716],
];

export const rampSide=(worldX:number,worldY:number):'west'|'east'|null=>{
  const x=worldX/PLATE_SCALE,y=worldY/PLATE_SCALE;
  return polygon(x,y,westRamp)||polygon(x,y,westStep)?'west':polygon(x,y,eastRamp)||polygon(x,y,eastStep)?'east':null;
};

export const onSurface=(worldX:number,worldY:number,level:ArenaLevel)=>{
  const x=worldX/PLATE_SCALE,y=worldY/PLATE_SCALE;
  if(level==='floor')return polygon(x,y,floor);
  if(level==='tower-west')return polygon(x,y,westPerch);
  if(level==='tower-east')return polygon(x,y,eastPerch);
  return [westRamp,eastRamp,westBridge,eastBridge,westDiagonal,eastDiagonal,westStep,eastStep,rearBridge,westTowerDeck,eastTowerDeck].some(path=>polygon(x,y,path));
};

export const onUndergroundSurface=(worldX:number,worldY:number)=>{
  const x=worldX/PLATE_SCALE,y=worldY/PLATE_SCALE;
  return undergroundPassages.some(area=>polygon(x,y,area))&&
    !undergroundWalls.some(([x1,y1,x2,y2])=>x>x1&&x<x2&&y>y1&&y<y2);
};

export const ladderSide=(worldX:number,worldY:number,level:ArenaLevel):'west'|'east'|null=>{
  const x=worldX/PLATE_SCALE,y=worldY/PLATE_SCALE;
  if(level==='bridge'){
    if(Math.hypot(x-286,y-279)<53)return 'west';
    if(Math.hypot(x-1250,y-279)<53)return 'east';
  }
  if(level==='tower-west'&&Math.hypot(x-256,y-253)<67)return 'west';
  if(level==='tower-east'&&Math.hypot(x-1280,y-253)<67)return 'east';
  return null;
};

// The follow camera has a fixed zoom. Projection affects the moving subject
// and objects she creates, so the far end reads deeper inside the same frame.
export const perspectiveAt=(worldY:number)=>{
  const y=worldY/PLATE_SCALE;
  return Math.max(.62,Math.min(1.19,.62+(y-225)*.00083));
};

export const crossingRamp=(worldX:number,worldY:number,level:ArenaLevel):ArenaLevel=>{
  const side=rampSide(worldX,worldY),y=worldY/PLATE_SCALE;
  const x=worldX/PLATE_SCALE;
  const onStep=polygon(x,y,westStep)||polygon(x,y,eastStep);
  if(level==='floor'&&side&&(onStep?y<464:y<277))return 'bridge';
  if(level==='bridge'&&side&&(onStep?y>480:y>291))return 'floor';
  return level;
};
