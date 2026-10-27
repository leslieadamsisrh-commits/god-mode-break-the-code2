// Trusted physical definitions. No client supplies hulls, health or section geometry.
export const SHAPES27J=[{name:'WIDE WALL',w:128,h:28,height27j:48},{name:'TALL SLAB',w:76,h:28,height27j:80},{name:'COMPACT BLOCK',w:60,h:42,height27j:48}] as const;
export const RIP_TIME27J=.28;
export type Section27j={parentId:string;u0:number;u1:number;sourceWidth:number;anchored:boolean};
export function splitBarrier27j<T extends {id:string;x:number;y:number;w:number;h:number;a:number;hp:number;maxHp:number}>(c:T){
 return [[0,.28],[.28,.72],[.72,1]].map(([u0,u1],n)=>{const offset=((u0+u1)/2-.5)*c.w;return {...c,id:c.id+'-section-'+n,x:c.x+Math.cos(c.a)*offset,y:c.y+Math.sin(c.a)*offset,w:c.w*(u1-u0),hp:c.hp*(u1-u0),maxHp:c.maxHp*(u1-u0),section27j:{parentId:c.id,u0,u1,sourceWidth:c.w,anchored:n!==1},anchored27j:n!==1,ripOwner27j:undefined,ripAt27j:undefined};});
}
