import {SOURCE_PIECES} from './source-pieces';
import {REAR_BARRICADE_SEGMENTS} from './rear-barricade-model';
export type Layer = 'floor';
export type PieceKind = 'barrier' | 'platform' | 'leftBridge' | 'curvedBarricade' | 'middleBarricade' | 'supplyContainer' | 'frontPost' | 'sniperTower';
export const APPROVED_KINDS = ['barrier','supplyContainer'] as const satisfies readonly PieceKind[];
export const TRIAL_KINDS = ['leftBridge','curvedBarricade','platform','middleBarricade','frontPost','sniperTower'] as const satisfies readonly PieceKind[];
export type Piece = { id: string; kind: PieceKind; x: number; y: number; angle: number; hp: number; scale?: number; flipX?: boolean };
export type BuilderLayout = { version: 1; pieces: Piece[] };
// Keep the old hand-built layout untouched while the source-aligned board gets
// its own editable, persistent checkpoint.
export const STORAGE_KEY = 'dimension33-reference-board-v11';
const PREVIOUS_STORAGE_KEY = 'dimension33-reference-board-v10';
const OLDER_STORAGE_KEY = 'dimension33-reference-board-v9';
const EARLIER_STORAGE_KEY = 'dimension33-reference-board-v8';
const LEGACY_STORAGE_KEY = 'dimension33-reference-board-v7';
const SIZE_REDUCTION = .93;
export const ARENA_SCALE = 1.1*1.07*1.1;
export const WORLD = { width: 1200*ARENA_SCALE, height: 720*ARENA_SCALE };
export const SPECS: Record<PieceKind,{label:string;layer:Layer;w:number;h:number;breakable:boolean;hp:number}> = {
  barrier:{label:'COVER PIECE 01',layer:'floor',w:128,h:27,breakable:true,hp:4},
  platform:{label:'CENTER PLATFORM',layer:'floor',w:240,h:155,breakable:true,hp:24},
  leftBridge:{label:'LEFT BRIDGE ASSEMBLY',layer:'floor',w:320,h:145,breakable:true,hp:18},
  curvedBarricade:{label:'REAR CENTER BARRICADE',layer:'floor',w:292,h:82,breakable:true,hp:10},
  middleBarricade:{label:'MIDDLE BARRICADE',layer:'floor',w:132,h:55,breakable:true,hp:8},
  supplyContainer:{label:'WEAPONS CONTAINER',layer:'floor',w:140,h:112,breakable:true,hp:14},
  frontPost:{label:'FRONT COVER POST',layer:'floor',w:74,h:62,breakable:true,hp:7},
  sniperTower:{label:'SNIPER TOWER BASE',layer:'floor',w:128,h:100,breakable:true,hp:18},
};
// These models project the depth of their floor blocks to 46% on screen.
// Collision and cover contact must use that same projected floor footprint.
export const floorDepth=(kind:PieceKind)=>kind==='middleBarricade'||kind==='frontPost'||kind==='sniperTower'?.46:1;
const placed=(id:string,kind:PieceKind,x:number,y:number,scale:number,angle=0,flipX=false):Piece=>({id,kind,x,y,scale,angle,flipX,hp:SPECS[kind].hp});
// Source locations projected from the 3072 × 2048 arena plate into the
// 1200 × 720 board. Large structures use their floor contact as the anchor;
// the right side duplicates the corresponding left model.
const SOURCE_LAYOUT: BuilderLayout = {version:1,pieces:[
  placed('ref-center','platform',600,344,1.12),
  placed('ref-left-bridge','leftBridge',363,283,.78,Math.PI*28/180),
  placed('ref-right-bridge','leftBridge',837,283,.78,-Math.PI*28/180,true),
  placed('ref-rear','curvedBarricade',600,197,.45),
  placed('ref-left-middle','middleBarricade',490,215,.65,-Math.PI/14),
  placed('ref-right-middle','middleBarricade',710,215,.65,Math.PI/14,true),
  placed('ref-left-tower','sniperTower',204,241,.76),
  placed('ref-right-tower','sniperTower',996,241,.76,0,true),
  placed('ref-left-container','supplyContainer',370,470,.86,-Math.PI/10),
  placed('ref-right-container','supplyContainer',830,470,.86,Math.PI/10,true),
  placed('ref-left-post','frontPost',465,520,.82),
  placed('ref-right-post','frontPost',735,520,.82,0,true),
  placed('ref-left-cover','barrier',445,420,.55,-Math.PI/6),
  placed('ref-right-cover','barrier',755,420,.55,Math.PI/6,true),
  placed('ref-front-left-cover','barrier',540,476,.55,Math.PI/2),
  placed('ref-front-right-cover','barrier',660,476,.55,Math.PI/2,true),
]};
export const INITIAL_LAYOUT: BuilderLayout = {version:1,pieces:SOURCE_LAYOUT.pieces.map(p=>({...p,x:p.x*ARENA_SCALE,y:p.y*ARENA_SCALE,scale:(p.scale||1)*SIZE_REDUCTION*ARENA_SCALE}))};
export function readBuilderLayout():BuilderLayout{
  try{
    const saved=localStorage.getItem(STORAGE_KEY);
    const previous=localStorage.getItem(PREVIOUS_STORAGE_KEY);
    const older=localStorage.getItem(OLDER_STORAGE_KEY);
    const earlier=localStorage.getItem(EARLIER_STORAGE_KEY);
    const raw=JSON.parse(saved||previous||older||earlier||localStorage.getItem(LEGACY_STORAGE_KEY)||'null');
    if(raw?.version!==1||!Array.isArray(raw.pieces))return INITIAL_LAYOUT;
    const enlargement=saved?1:previous?1.1:older?1.1*1.07:ARENA_SCALE;
    const oldReduction=!saved&&!previous&&!older&&!earlier?SIZE_REDUCTION:1;
    const pieces=raw.pieces.filter((p:Piece)=>typeof p.id==='string'&&p.id.length<80&&([...APPROVED_KINDS,...TRIAL_KINDS] as readonly PieceKind[]).includes(p.kind)&&
      Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.angle)&&p.x>=0&&p.x<=WORLD.width/enlargement&&p.y>=0&&p.y<=WORLD.height/enlargement)
      .slice(0,100).map((p:Piece)=>({...p,x:p.x*enlargement,y:p.y*enlargement,scale:Math.max(.35,Math.min(1.98,(Number.isFinite(p.scale)?p.scale!:1)*oldReduction*enlargement)),hp:SPECS[p.kind].hp,flipX:!!p.flipX}));
    return {version:1,pieces};
  }catch{return INITIAL_LAYOUT;}
}
export function pointInPiece(x:number,y:number,p:Piece,pad=0){
  const {w,h}=SPECS[p.kind],scale=p.scale||1,c=Math.cos(-p.angle),s=Math.sin(-p.angle),dx=x-p.x,dy=y-p.y;
  if(p.kind==='platform'){const lx=dx*c-dy*s,ly=dx*s+dy*c,rx=w*scale*.53+pad,ry=h*scale*.51+pad,yy=ly+16*scale;return rx>0&&ry>0&&(lx/rx)**2+(yy/ry)**2<1;}
  const localX=dx*c-dy*s,localY=dx*s+dy*c;
  if(p.kind==='curvedBarricade')return REAR_BARRICADE_SEGMENTS.some(segment=>{const cx=localX-segment.x*scale,cy=localY-segment.y*scale,co=Math.cos(-segment.angle),si=Math.sin(-segment.angle);return Math.abs(cx*co-cy*si)<segment.w*scale/2+pad&&Math.abs(cx*si+cy*co)<segment.d*scale/2+pad;});
  if(p.kind==='leftBridge')return [-116,116].some(sx=>Math.abs(localX-sx*scale)<33*scale+pad&&Math.abs(localY-12*scale)<39*scale+pad);
  return Math.abs(localX)<w*scale/2+pad&&Math.abs(localY)<h*floorDepth(p.kind)*scale/2+pad;
}
export function pointOnPiece(x:number,y:number,p:Piece,pad=0){
 if(p.kind!=='leftBridge')return pointInPiece(x,y,p,pad);
 const scale=p.scale||1,dx=x-p.x,dy=y-p.y,c=Math.cos(-p.angle),s=Math.sin(-p.angle);
 return Math.abs(dx*c-dy*s)<160*scale+pad&&Math.abs(dx*s+dy*c)<73*scale+pad;
}
