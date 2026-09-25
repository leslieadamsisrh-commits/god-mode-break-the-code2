import {floorDepth,SPECS, type Piece} from './layout';
import {REAR_BARRICADE_SEGMENTS} from './rear-barricade-model';

export type CoverNormal = {nx:number;ny:number;tx:number;ty:number};

// The exit uses the actual floor footprint, not the rectangle surrounding the art.
export function coverNormal(piece:Piece,x:number,y:number):CoverNormal{
  const scale=piece.scale||1;
  if(piece.kind==='platform'){
    const c=Math.cos(piece.angle),s=Math.sin(piece.angle);
    const lx=(x-piece.x)*c+(y-piece.y)*s;
    const ly=-(x-piece.x)*s+(y-piece.y)*c+16*scale;
    const rx=SPECS.platform.w*scale*.53,ry=SPECS.platform.h*scale*.51;
    const theta=Math.atan2(ly/ry,lx/rx);
    const nx=Math.cos(theta)/rx*c-Math.sin(theta)/ry*s;
    const ny=Math.cos(theta)/rx*s+Math.sin(theta)/ry*c;
    const length=Math.hypot(nx,ny)||1;
    return {nx:nx/length,ny:ny/length,tx:-ny/length,ty:nx/length};
  }
  const rectangles=piece.kind==='curvedBarricade'
    ? REAR_BARRICADE_SEGMENTS.map(segment=>({x:segment.x*scale,y:segment.y*scale,a:segment.angle,w:segment.w*scale,h:segment.d*scale}))
    : piece.kind==='leftBridge'
      ? [-116,116].map(px=>({x:px*scale,y:12*scale,a:0,w:66*scale,h:78*scale}))
      : [{x:0,y:0,a:0,w:SPECS[piece.kind].w*scale,h:SPECS[piece.kind].h*floorDepth(piece.kind)*scale}];
  const pc=Math.cos(piece.angle),ps=Math.sin(piece.angle);
  let best:{dist:number;nx:number;ny:number}|null=null;
  for(const rect of rectangles){
    const cx=piece.x+rect.x*pc-rect.y*ps,cy=piece.y+rect.x*ps+rect.y*pc;
    const a=piece.angle+rect.a,c=Math.cos(a),s=Math.sin(a);
    const dx=x-cx,dy=y-cy,lx=dx*c+dy*s,ly=-dx*s+dy*c;
    const hx=rect.w/2,hy=rect.h/2;
    const nearX=Math.max(-hx,Math.min(hx,lx)),nearY=Math.max(-hy,Math.min(hy,ly));
    let vx=lx-nearX,vy=ly-nearY;
    if(Math.hypot(vx,vy)<.001){
      const gapX=hx-Math.abs(lx),gapY=hy-Math.abs(ly);
      if(gapX<gapY){vx=lx>=0?1:-1;vy=0;}else{vx=0;vy=ly>=0?1:-1;}
    }
    const dist=Math.hypot(lx-nearX,ly-nearY);
    if(!best||dist<best.dist){const n=Math.hypot(vx,vy)||1;best={dist,nx:(vx*c-vy*s)/n,ny:(vx*s+vy*c)/n};}
  }
  const nx=best?.nx??1,ny=best?.ny??0;
  return {nx,ny,tx:-ny,ty:nx};
}

export function coverExit(aim:number,normal:CoverNormal):'outward'|'past'|'blocked'{
  const ax=Math.cos(aim),ay=Math.sin(aim);
  const outward=ax*normal.nx+ay*normal.ny;
  const along=Math.abs(ax*normal.tx+ay*normal.ty);
  if(outward>.42)return 'outward';
  if(along>.55&&outward>-.35)return 'past';
  return 'blocked';
}

// The peek pose is a positional cue at an exposed end of a cover line.
// A continuous platform rim has no end to peek around.
export function atCoverEdge(piece:Piece,x:number,y:number):boolean{
  if(piece.kind==='platform')return false;
  const scale=piece.scale||1,c=Math.cos(piece.angle),s=Math.sin(piece.angle);
  const lx=(x-piece.x)*c+(y-piece.y)*s,ly=-(x-piece.x)*s+(y-piece.y)*c;
  if(piece.kind==='curvedBarricade'){
    const outer=REAR_BARRICADE_SEGMENTS[0];
    return Math.abs(lx)>(Math.abs(outer.x)+outer.w/2)*scale-11;
  }
  if(piece.kind==='leftBridge'){
    const rx=lx-(lx<0?-116*scale:116*scale),ry=ly-12*scale;
    const hx=33*scale,hy=39*scale;
    return Math.abs(Math.abs(rx)-hx)<Math.abs(Math.abs(ry)-hy)
      ?Math.abs(ry)>hy-11:Math.abs(rx)>hx-11;
  }
  const halfW=SPECS[piece.kind].w*scale/2,halfH=SPECS[piece.kind].h*floorDepth(piece.kind)*scale/2;
  const dx=Math.abs(Math.abs(lx)-halfW),dy=Math.abs(Math.abs(ly)-halfH);
  return dx<dy?Math.abs(ly)>halfH-11:Math.abs(lx)>halfW-11;
}
