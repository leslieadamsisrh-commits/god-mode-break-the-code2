// Build 20 environment-only registration. World hulls remain authoritative.
export const D33_BARRIER_A20 = {
 key: "d33-barrier-a20",
 path: "/assets/dimension33/build20/concrete-barrier-a.webp",
 size: [1536, 1024],
 // Source contact landmarks, reviewed against the approved isolated artwork.
 contacts: [[206, 874], [1407, 676], [206, 286]],
 objects: ["d33-nw-primary", "d33-ne-primary", "d33-sw-primary", "d33-se-primary"],
 material: "CONCRETE",
 state: "intact",
} as const;

export function usesBarrierA20(c: any) {
 return D33_BARRIER_A20.objects.includes(c.id) && c.hp > 0 && c.hp === c.maxHp
  && !c.psychicHeld && !c.generated && !c.floorPanel46 && c.build === 0
  && !(c.hover > .1) && Math.abs(c.a || 0) < .001;
}

// Three source landmarks map to the existing projected front collision face.
// This cancels the baked image slope without changing world position or hulls.
export function drawBarrierA20(g: CanvasRenderingContext2D, image: CanvasImageSource,
 c: any, z: number, project: (x: number, y: number, height: number) => {x: number; y: number}) {
 const [a,b,d] = D33_BARRIER_A20.contacts;
 const A = project(-c.w/2,c.h/2,0), B = project(c.w/2,c.h/2,0), D = project(-c.w/2,c.h/2,z);
 const ux=b[0]-a[0], uy=b[1]-a[1], vx=d[0]-a[0], vy=d[1]-a[1], det=ux*vy-vx*uy;
 const xx=((B.x-A.x)*vy-(D.x-A.x)*uy)/det, xy=((D.x-A.x)*ux-(B.x-A.x)*vx)/det;
 const yx=((B.y-A.y)*vy-(D.y-A.y)*uy)/det, yy=((D.y-A.y)*ux-(B.y-A.y)*vx)/det;
 g.save();g.transform(xx,yx,xy,yy,A.x-xx*a[0]-xy*a[1],A.y-yx*a[0]-yy*a[1]);
 g.drawImage(image,0,0);g.restore();
}
