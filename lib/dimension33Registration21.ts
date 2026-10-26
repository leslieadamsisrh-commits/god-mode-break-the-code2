import frames from './dimension33Frames20.json';

type Point={x:number;y:number};
type Quad=readonly [Point,Point,Point,Point];
// Pixel landmarks on approved face interiors, ordered TL, TR, BR, BL.
// These unwrap painted material onto the existing rib shell. They are not
// new silhouettes, collision hulls, or purported generated 3D rotations.
const faces={
 concrete:{key:'concrete/barrier-a-front',front:[{x:112,y:104},{x:350,y:51},{x:351,y:174},{x:112,y:233}] as Quad,
  top:[{x:115,y:86},{x:335,y:37},{x:350,y:51},{x:112,y:104}] as Quad,
  end:[{x:50,y:130},{x:87,y:139},{x:88,y:190},{x:42,y:207}] as Quad},
 cabinet:{key:'props/utility-cabinet',front:[{x:65,y:69},{x:176,y:80},{x:174,y:267},{x:62,y:249}] as Quad,
  top:[{x:64,y:52},{x:163,y:36},{x:204,y:55},{x:176,y:74}] as Quad,
  end:[{x:188,y:78},{x:211,y:63},{x:211,y:126},{x:186,y:137}] as Quad},
};
export function coverMaterial21(images:Map<string,HTMLImageElement>,c:{id:string;artId?:string;floorPanel46?:unknown;w?:number;h?:number}){
 if(c.floorPanel46)return null;
 const id=c.artId||c.id;
 if(!/^(d33-|war-shelter-|war-generated-shell45$)/.test(id))return null;
 const spec=id.endsWith('-node')?faces.cabinet:faces.concrete;
 const frame=(frames as any)[spec.key],image=images.get('d33-map20-'+frame.atlas);
 if(!image?.complete||!image.naturalWidth)return null;
 // Broad roofs use the approved flat plating tile, never an enlarged painted
 // bevel/light strip. End panels use a broad concrete face or equipment plating.
 const flat=(frames as any)['floor/industrial-plating'];
 const flatImage=images.get('d33-map20-'+flat.atlas);
 const useFlat=(col:number,row:number)=>!!flatImage?.complete&&!!flatImage.naturalWidth&&((col===0&&row===0)||(row===1&&spec===faces.cabinet));
 const uv=(q:Quad,u:number,v:number)=>({x:frame.rect[0]+(1-v)*(q[0].x+(q[1].x-q[0].x)*u)+v*(q[3].x+(q[2].x-q[3].x)*u),y:frame.rect[1]+(1-v)*(q[0].y+(q[1].y-q[0].y)*u)+v*(q[3].y+(q[2].y-q[3].y)*u)});
 return {image,key:spec.key,trimPoint:(u:number,v:number)=>uv(spec.top,u,v),imageFor:(col:number,row:number)=>useFlat(col,row)?flatImage!:image,point:(col:number,row:number,u:number,v:number)=>{
  if(useFlat(col,row))return{x:flat.rect[0]+8+u*(flat.rect[2]-16),y:flat.rect[1]+8+v*(flat.rect[3]-16)};
  // Reuse concrete panel material without stretching a narrow sculpted end cap.
  const q=col===0&&row===0?spec.top:spec.front;
  return{x:frame.rect[0]+(1-v)*(q[0].x+(q[1].x-q[0].x)*u)+v*(q[3].x+(q[2].x-q[3].x)*u),
   y:frame.rect[1]+(1-v)*(q[0].y+(q[1].y-q[0].y)*u)+v*(q[3].y+(q[2].y-q[3].y)*u)};
 }};
}

// Upright heights use the same presentation unit as fighter feet-to-helmet
// height. Footprints and physical heights of combat objects remain authoritative.
export const D33_SCENERY21=[
 {key:'architecture/industrial-facade',x:-100,y:420,height:220},
 {key:'architecture/industrial-facade',x:1600,y:420,height:220},
 // Solid service buildings connect the rear perimeter beneath the bridges.
 // Decorative only, behind the combat boundary; no new collision/traversal.
 {key:'architecture/industrial-facade',x:300,y:-70,height:140},
 {key:'architecture/industrial-facade',x:1200,y:-70,height:140},
 {key:'architecture/industrial-facade',x:-170,y:75,height:260},
 {key:'architecture/industrial-facade',x:1670,y:75,height:260},
 {key:'architecture/watchtower-magenta',x:25,y:68,height:205},
 {key:'architecture/watchtower-cyan',x:1475,y:68,height:205},
 {key:'architecture/central-tower-33-front',x:750,y:12,height:310},
 {key:'props/crowd-screen',x:1010,y:0,height:90},
] as const;

