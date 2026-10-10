import {arenaPoint46,DECK_SCREEN_Y,setArenaContext46} from "./bayBridgePresentation";
// One complete original illustration, drawn once. Objects render directly at
// registered anchors: no split floor, bridge rim or whole-frame texture warp.
export function beginWarScene46(canvas:HTMLCanvasElement,im:HTMLImageElement|undefined,camera:{x:number;y:number},zoom:number){
 const g=canvas.getContext("2d")!,sx=canvas.width/1000,sy=canvas.height/620,c=arenaPoint46(camera.x,camera.y),scale=1000/1536*zoom;
 g.setTransform(sx,0,0,sy,0,0);g.fillStyle="#13121d";g.fillRect(0,0,1000,620);
 g.setTransform(sx*scale,0,0,sy*scale,(500-c.x*scale)*sx,(DECK_SCREEN_Y-c.y*scale)*sy);
 if(im?.complete&&im.naturalWidth)g.drawImage(im,0,0,1536,1024);
 setArenaContext46(g,camera,zoom,sx,sy);return g;
}
export function finishWarScene46(canvas:HTMLCanvasElement){const g=canvas.getContext("2d")!;g.setTransform(canvas.width/1000,0,0,canvas.height/620,0,0);return g;}
