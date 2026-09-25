'use client';
import { useEffect, useRef, useState } from 'react';
import { EMPTY_LAYOUT, existingCover, LAYOUT_KEY, type Layout, type Mark, type MarkKind, readLayout, lineDistance } from './markup-data';
import styles from './map.module.css';

const colors: Record<MarkKind,string> = {cover:'#4ce8fa',breakable:'#ff4eaa',scenery:'#a3aab7',blocked:'#ffe07a',route:'#66ffba'};
const labels: Record<MarkKind,string> = {cover:'COVER',breakable:'BREAKABLE',scenery:'SCENERY',blocked:'BLOCKED',route:'ROUTE'};
export default function MapMarkup({onClose,onChange}:{onClose:()=>void;onChange:(layout:Layout)=>void}) {
  const [layout,setLayout]=useState<Layout>(()=>readLayout());
  const [tool,setTool]=useState<MarkKind>('breakable');
  const [selected,setSelected]=useState<string|null>(null);
  const [draft,setDraft]=useState<Mark|null>(null);
  const [zoom,setZoom]=useState(1);
  const [message,setMessage]=useState('Draw on the map. Tap a painted cover to mark it usable or scenery.');
  const surface=useRef<SVGSVGElement>(null);
  const dragging=useRef<{mode:'draw'|'move'|'end1'|'end2';id:string;x:number;y:number}|null>(null);
  const current=useRef(layout);current.current=layout;
  useEffect(()=>{localStorage.setItem(LAYOUT_KEY,JSON.stringify(layout));onChange(layout);},[layout,onChange]);
  const point=(e:React.PointerEvent<SVGSVGElement>)=>{
    const pt=surface.current!.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;
    const out=pt.matrixTransform(surface.current!.getScreenCTM()!.inverse());
    return {x:Math.max(0,Math.min(1536,out.x)),y:Math.max(0,Math.min(1024,out.y))};
  };
  const down=(e:React.PointerEvent<SVGSVGElement>)=>{
    if(e.target instanceof Element && e.target.closest('[data-control]'))return;
    const p=point(e), mark=layout.marks.slice().reverse().find(m=>lineDistance(p.x,p.y,m)<Math.max(9,18/zoom));
    if(mark){setSelected(mark.id);const d1=Math.hypot(p.x-mark.x1,p.y-mark.y1),d2=Math.hypot(p.x-mark.x2,p.y-mark.y2);
      dragging.current={mode:d1<14?'end1':d2<14?'end2':'move',id:mark.id,x:p.x,y:p.y};
    }else{
      const coverIndex=existingCover.findIndex(([x,y,w,h])=>Math.abs(p.x-x)<w/2+9&&Math.abs(p.y-y)<h/2+9);
      if(coverIndex>=0){setLayout(v=>({...v,disabled:v.disabled.includes(coverIndex)?v.disabled.filter(n=>n!==coverIndex):[...v.disabled,coverIndex]}));setMessage('Painted cover toggled. Cyan is usable; gray is scenery.');return;}
      const id=`m${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      const next={id,kind:tool,x1:p.x,y1:p.y,x2:p.x,y2:p.y};setDraft(next);setSelected(id);
      dragging.current={mode:'draw',id,x:p.x,y:p.y};
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move=(e:React.PointerEvent<SVGSVGElement>)=>{
    const drag=dragging.current;if(!drag)return;const p=point(e);
    if(drag.mode==='draw'){setDraft(v=>v?{...v,x2:p.x,y2:p.y}:v);return;}
    setLayout(v=>({...v,marks:v.marks.map(m=>{
      if(m.id!==drag.id)return m;
      if(drag.mode==='end1')return {...m,x1:p.x,y1:p.y};
      if(drag.mode==='end2')return {...m,x2:p.x,y2:p.y};
      const dx=p.x-drag.x,dy=p.y-drag.y;
      return {...m,x1:Math.max(0,Math.min(1536,m.x1+dx)),y1:Math.max(0,Math.min(1024,m.y1+dy)),x2:Math.max(0,Math.min(1536,m.x2+dx)),y2:Math.max(0,Math.min(1024,m.y2+dy))};
    })}));drag.x=p.x;drag.y=p.y;
  };
  const up=()=>{
    if(dragging.current?.mode==='draw'&&draft&&Math.hypot(draft.x2-draft.x1,draft.y2-draft.y1)>5){setLayout(v=>({...v,marks:[...v.marks,draft]}));}
    setDraft(null);dragging.current=null;
  };
  const share=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(layout));setMessage('Layout copied. Paste the code into our chat so I can use your exact placements.');}catch{setMessage('Clipboard unavailable. Use Download layout instead.');}};
  const download=()=>{const blob=new Blob([JSON.stringify(layout,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='dimension33-cover-layout.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  return <div className={styles.editor} role="dialog" aria-label="Arena map markup" aria-modal="true">
    <div className={styles.editorTop}><div><b>DIMENSION 33 / MAP MARKUP</b><span>Draw cover edges and routes directly on the arena.</span></div><button onClick={onClose}>DONE · PLAY</button></div>
    <div className={styles.editorTools} aria-label="Markup tools">{(Object.keys(labels) as MarkKind[]).map(kind=><button key={kind} className={tool===kind?styles.activeTool:''} style={{borderColor:colors[kind]}} onClick={()=>{setTool(kind);setSelected(null)}}>{labels[kind]}</button>)}<button onClick={()=>setZoom(z=>Math.max(1,z-.25))} aria-label="Zoom out">−</button><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(z=>Math.min(3,z+.25))} aria-label="Zoom in">＋</button></div>
    <div className={styles.editorViewport}><svg ref={surface} viewBox="0 0 1536 1024" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{width:`${100*zoom}%`,touchAction:'none'}} aria-label="Arena map. Drag to draw a line; drag an existing line or its endpoints to adjust it.">
      <image href="/assets/dimension33-map/arena-war-games-hires.webp" x="0" y="0" width="1536" height="1024" preserveAspectRatio="none"/>
      {existingCover.map(([x,y,w,h],i)=><rect key={i} x={x-w/2} y={y-h/2} width={w} height={h} rx="6" fill={layout.disabled.includes(i)?'#81899855':'#43eaff33'} stroke={layout.disabled.includes(i)?'#9199a9':'#43eaff'} strokeWidth="3" strokeDasharray={layout.disabled.includes(i)?'9 6':undefined} />)}
      {[...layout.marks,...(draft?[draft]:[])].map(m=><g key={m.id}>
        <line x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke="#020917" strokeWidth="14" strokeLinecap="round"/>
        <line x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke={colors[m.kind]} strokeWidth="7" strokeLinecap="round" strokeDasharray={m.kind==='scenery'?'11 7':undefined}/>
        {selected===m.id&&<><circle cx={m.x1} cy={m.y1} r="11" fill={colors[m.kind]} stroke="#fff" strokeWidth="2"/><circle cx={m.x2} cy={m.y2} r="11" fill={colors[m.kind]} stroke="#fff" strokeWidth="2"/></>}
      </g>)}
    </svg></div>
    <div className={styles.editorFoot}><span>{message} · {layout.marks.length} lines</span><div><button disabled={!selected||!layout.marks.some(m=>m.id===selected)} onClick={()=>{setLayout(v=>({...v,marks:v.marks.filter(m=>m.id!==selected)}));setSelected(null)}}>DELETE SELECTED</button><button onClick={()=>{setLayout(EMPTY_LAYOUT);setSelected(null)}}>RESET</button><button onClick={download}>DOWNLOAD LAYOUT</button><button onClick={share}>COPY LAYOUT</button></div></div>
  </div>;
}
