// Diagnostic compositing only: source PNG bytes are never modified.
const {createCanvas,loadImage}=require('@napi-rs/canvas'),fs=require('node:fs');
(async()=>{
 const names=['B06C-right-step.png','B06P-passing.png','B06L-left-step.png'];
 const bg=['#000000','#ffffff','#808080','#ff00ff','#00ffff'];
 const c=createCanvas(1000,690),g=c.getContext('2d');g.fillStyle='#19202c';g.fillRect(0,0,1000,690);
 for(let row=0;row<3;row++){const im=await loadImage('public/assets/b06-r3/'+names[row]);
 for(let col=0;col<5;col++){const x=col*200,y=row*230;g.fillStyle=bg[col];g.fillRect(x,y,200,210);g.drawImage(im,x,y+10,197,180);g.fillStyle='#ffffff';g.font='11px monospace';g.fillText(names[row].replace('.png','')+' '+bg[col],x+4,y+225);}}
 fs.writeFileSync('evidence/cutout-background-check.png',c.toBuffer('image/png'));
})();
