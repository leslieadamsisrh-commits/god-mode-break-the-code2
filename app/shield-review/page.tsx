'use client';
import {useEffect,useRef} from 'react';
import {drawShieldPose} from '../dimension33-builder/shield-pose';
import {drawCrystalShield} from '../dimension33-builder/shield-render';

const root='/assets/dimension33-map/';
const source='/assets/shotgun-v57/';
export default function ShieldReview(){
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const files={cardinal:root+'jade-shield-four-poses-v1.png',diagonal:root+'jade-shield-diagonals-v1.png',intermediate:root+'jade-shield-d01-d02-v1.png',shields:[root+'crystal-shield-right-v1.png',root+'crystal-shield-d01-v1.png',root+'crystal-shield-d02-v1.png',root+'crystal-shield-d03-v1.png'],original:[0,1,2,3].map(d=>source+`ready-d${String(d).padStart(2,'0')}.webp`)};
    const load=(url:string)=>new Promise<HTMLImageElement>(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(im);im.src=url;});
    Promise.all([load(files.cardinal),load(files.diagonal),load(files.intermediate),...files.shields.map(load),...files.original.map(load)]).then(([cardinal,diagonal,intermediate,...rest])=>{
      const ctx=canvas.current?.getContext('2d');if(!ctx)return;
      const shields=rest.slice(0,4),original=rest.slice(4);
      ctx.clearRect(0,0,1000,1120);ctx.font='bold 17px system-ui';
      for(let d=0;d<4;d++)for(let b=0;b<2;b++){
        const x=20+d*245,y=50+b*535;ctx.fillStyle=b?'#c9cbd0':'#161b28';ctx.fillRect(x,y,230,500);
        ctx.fillStyle=b?'#222533':'#f2e9fa';ctx.fillText(`d0${d} · ${d*15}°`,x+15,y+28);
        ctx.font='12px system-ui';ctx.fillText('EXISTING AIM',x+20,y+58);ctx.fillText('SHIELD HOLD',x+20,y+270);
        ctx.save();ctx.translate(x+115,y+207);ctx.scale(1.45,1.45);
        if(original[d]?.naturalWidth)ctx.drawImage(original[d],-50,-88,100,100);
        ctx.restore();
        ctx.save();ctx.translate(x+105,y+450);ctx.scale(1.45,1.45);
        drawShieldPose(ctx,cardinal,diagonal,d*Math.PI/12,intermediate);
        drawCrystalShield(ctx,d*Math.PI/12,1,0,{x:19,y:0},shields);
        ctx.restore();ctx.font='bold 17px system-ui';
      }
    });
  },[]);
  return <main style={{background:'#0c1422',color:'#f5eaf4',minHeight:'100vh',padding:'24px',fontFamily:'system-ui'}}><h1 style={{margin:'0 0 8px'}}>DIMENSION 33 · SHIELD D00–D03</h1><p style={{margin:'0 0 18px',maxWidth:760}}>First directional review group. Existing aim pose above, matching shield hold below. Compare on dark and bright floor values.</p><canvas ref={canvas} width={1000} height={1120} style={{maxWidth:'100%',height:'auto',display:'block'}}/><p><a style={{color:'#95e7f2'}} href="/dimension33-builder">Return to playable arena</a></p></main>;
}
