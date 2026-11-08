// Reference review only. Does not modify runtime assets or registration.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../..');
const {createCanvas,loadImage}=require(path.join(root,'node_modules/@napi-rs/canvas'));
const m=require(path.join(root,'public/assets/raptor-v2/manifest.json'));
const poses=[
 ['Standing front','public/assets/raptor-v2/idle/front/000.png',m.frames['idle/front/000.png']],
 ['B front candidate','docs/raptor-design-b/front-candidate.png',{anchor:[239,473],drawScale:.78}],
 ['Standing side','public/assets/raptor-v2/idle/right/000.png',m.frames['idle/right/000.png']],
 ['B side candidate','docs/raptor-design-b/side-candidate.png',{anchor:[275,402],drawScale:1.08}],
 ['Approved slide','public/assets/raptor-v2/slide/front-right/001.png',m.frames['slide/front-right/001.png']],
 ['B rear candidate','docs/raptor-design-b/rear-candidate.png',{anchor:[244,466],drawScale:.85}]
];
(async()=>{const c=createCanvas(1500,1140),g=c.getContext('2d');g.fillStyle='#26383f';g.fillRect(0,0,c.width,c.height);g.fillStyle='#fff';g.font='bold 23px sans-serif';g.fillText('DESIGN B — REFERENCE CANDIDATES, NOT RUNTIME ASSETS',25,35);g.font='15px sans-serif';g.fillText('Top: enlarged registered comparison. Bottom: nominal default game scale (sprite .82 × .26, camera 1.85).',25,61);const images=await Promise.all(poses.map(p=>loadImage(path.join(root,p[1]))));for(let n=0;n<poses.length;n++){const [label,,r]=poses[n],x=250+(n%3)*500, row=Math.floor(n/3)*520;for(const [base,y]of [[.68,360+row],[.82*.26*1.85,565+row]]){const s=base*r.drawScale;g.strokeStyle='#71d9cb';g.beginPath();g.moveTo((n%3)*500+10,y);g.lineTo((n%3)*500+490,y);g.stroke();g.drawImage(images[n],x-r.anchor[0]*s,y-r.anchor[1]*s,512*s,512*s);}g.fillStyle='#fff';g.font='16px sans-serif';g.fillText(label,(n%3)*500+20,395+row);}fs.writeFileSync(path.join(__dirname,'registered-comparison.jpg'),c.toBuffer('image/jpeg'));fs.writeFileSync(path.join(__dirname,'review-registration.json'),JSON.stringify({status:'reference-only; manually estimated anatomical/foot landmarks',scaleBasis:'.82*.26 at camera1.85; static comparison, not captured game',poses:poses.map(([label,file,r])=>({label,file,...r}))},null,2)+'\n');})();
