import {arenaPoint46,DECK_SCREEN_Y,setArenaContext46,ARENA_DEPTH20} from "./bayBridgePresentation";
import {drawMapBackdrop20} from './dimension33MapArt20';
// One complete original illustration, drawn once. Objects render directly at
// registered anchors: no split floor, bridge rim or whole-frame texture warp.
export function beginWarScene46(canvas:HTMLCanvasElement,im:HTMLImageElement|undefined,camera:{x:number;y:number},zoom:number,images?:Map<string,HTMLImageElement>){
 const g=canvas.getContext("2d")!,sx=canvas.width/1000,sy=canvas.height/620,c=arenaPoint46(camera.x,camera.y),scale=1000/1536*zoom;
 g.setTransform(sx,0,0,sy,0,0);g.fillStyle="#13121d";g.fillRect(0,0,1000,620);
 g.setTransform(sx*scale,0,0,sy*scale,(500-c.x*scale)*sx,(DECK_SCREEN_Y-c.y*scale)*sy);
 if(!images||!drawMapBackdrop20(g,images,camera))if(im?.complete&&im.naturalWidth){g.save();g.translate(0,285);g.scale(1,ARENA_DEPTH20);g.translate(0,-285);g.drawImage(im,0,0,1536,1024);g.restore();}
 setArenaContext46(g,camera,zoom,sx,sy);return g;
}
export function finishWarScene46(canvas:HTMLCanvasElement){const g=canvas.getContext("2d")!;g.setTransform(canvas.width/1000,0,0,canvas.height/620,0,0);return g;}

