// Keep the existing logical 1000 x 620 renderer and pointer coordinates in the
// same aspect ratio. CSS stretching otherwise changes every object's proportions.
export function fitCombatViewport23(width:number,height:number){
 const scale=Math.max(0,Math.min(width/1000,height/620));
 return {width:1000*scale,height:620*scale};
}
