// One approved illustrated foundation; dimensional actors use the existing world camera.
// Floor pixels are registered to the combat plane, not screen-space obstacles.
const warFloorCache45=new WeakMap<object,HTMLCanvasElement>();
function triangle45(g:CanvasRenderingContext2D,im:CanvasImageSource,s:{x:number;y:number}[],d:{x:number;y:number}[]){
 const [a,b,c]=s,[u,v,w]=d,det=(b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);if(Math.abs(det)<.001)return;
 const ax=((v.x-u.x)*(c.y-a.y)-(w.x-u.x)*(b.y-a.y))/det,bx=((w.x-u.x)*(b.x-a.x)-(v.x-u.x)*(c.x-a.x))/det;
 const ay=((v.y-u.y)*(c.y-a.y)-(w.y-u.y)*(b.y-a.y))/det,by=((w.y-u.y)*(b.x-a.x)-(v.y-u.y)*(c.x-a.x))/det;
 g.save();g.beginPath();g.moveTo(u.x,u.y);g.lineTo(v.x,v.y);g.lineTo(w.x,w.y);g.closePath();g.clip();g.transform(ax,ay,bx,by,u.x-ax*a.x-bx*a.y,u.y-ay*a.x-by*a.y);g.drawImage(im,0,0);g.restore();
}
export function registeredFloor45(im:HTMLImageElement){
 const hit=warFloorCache45.get(im);if(hit)return hit;if(typeof document==="undefined")return null;
 const canvas=document.createElement("canvas");canvas.width=1000;canvas.height=620;const g=canvas.getContext("2d");if(!g)return null;
 g.fillStyle="#353139";g.fillRect(0,0,1000,620);
 const source=(u:number,v:number)=>{const y=v<=.5?240+456*v:468+624*(v-.5),left=620-(y-240)*.79,right=916+(y-240)*.79;return{x:(left+(right-left)*u)*im.naturalWidth/1536,y:y*im.naturalHeight/1024}};
 // A bounded, one-time texture registration. Never tessellate on every frame.
 for(let row=0;row<16;row++)for(let col=0;col<8;col++){const us=[col/8,(col+1)/8],vs=[row/16,(row+1)/16],s=[source(us[0],vs[0]),source(us[1],vs[0]),source(us[1],vs[1]),source(us[0],vs[1])],d=[{x:us[0]*1000,y:vs[0]*620},{x:us[1]*1000,y:vs[0]*620},{x:us[1]*1000,y:vs[1]*620},{x:us[0]*1000,y:vs[1]*620}];triangle45(g,im,[s[0],s[1],s[2]],[d[0],d[1],d[2]]);triangle45(g,im,[s[0],s[2],s[3]],[d[0],d[2],d[3]]);}
 warFloorCache45.set(im,canvas);return canvas;
}
export function drawWarBackdrop45(g:CanvasRenderingContext2D,im?:HTMLImageElement){
 g.fillStyle="#13121d";g.fillRect(0,88,1000,104);if(im?.complete&&im.naturalWidth)g.drawImage(im,0,0,im.naturalWidth,240/1024*im.naturalHeight,0,88,1000,104);
 g.fillStyle="#e7d7e8";g.font="bold 8px monospace";g.textAlign="center";g.fillText("DIMENSION 33 · WAR GAMES · VOX VICTIS BROADCAST",500,187);
}
export function drawWarFloor45(g:CanvasRenderingContext2D,im?:HTMLImageElement){
 g.save();g.beginPath();g.rect(0,0,1000,620);g.clip();g.fillStyle="#35313a";g.fillRect(0,0,1000,620);const floor=im?.complete&&im.naturalWidth?registeredFloor45(im):null;if(floor)g.drawImage(floor,0,0);
 // Sealed future access: no apparent hole or promise of current lower-level collision.
 g.fillStyle="#292e38";g.strokeStyle="#666779";g.lineWidth=2;g.fillRect(466,493,68,30);g.strokeRect(466,493,68,30);for(const x of [472,523]){g.fillStyle="#ac905e";g.fillRect(x,498,5,20)}g.fillStyle="#b9bbc5";g.font="8px monospace";g.textAlign="center";g.fillText("SEALED",500,513);g.restore();
}
