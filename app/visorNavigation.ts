import {useEffect,useRef} from "react";

export function useVisorNavigation(onMenu:()=>void,onBack:()=>void,onLost:()=>void){
 const handlers=useRef({onMenu,onBack,onLost});
 handlers.current={onMenu,onBack,onLost};
 useEffect(()=>{
  let frame=0,previous:boolean[]=[],lastRoot:Element|null=null,hadPad=false;
  const root=()=>document.querySelector(".visorLab")||document.querySelector(".gmMenu,.gmTitle,.roundResult");
  function handle(action:number){
   const panel=root();
   if(action===9){
    if(panel?.matches(".gmTitle"))(panel.querySelector("button") as HTMLElement)?.click();
    else if(!panel?.matches(".gmMenu"))handlers.current.onMenu();
    return;
   }
   if(!panel)return;
   const buttons=Array.from(panel.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")).filter(b=>b.offsetWidth);
   if(!buttons.length)return;
   const i=buttons.indexOf(document.activeElement as HTMLButtonElement);
   if(action===0)(buttons[Math.max(i,0)])?.click();
   else if(action===1){
    const back=panel.querySelector<HTMLButtonElement>(".gmBack");if(back)back.click();else handlers.current.onBack();
   }else buttons[(Math.max(0,i)+(action===2?-1:1)+buttons.length)%buttons.length]?.focus();
  }
  function poll(){
   const panel=root(),pad=Array.from(navigator.getGamepads?.()||[]).find(Boolean);
   if(hadPad&&!pad)handlers.current.onLost();
   hadPad=!!pad;
   if(panel&&(panel!==lastRoot||!panel.contains(document.activeElement)))panel.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
   lastRoot=panel;
   const b=(i:number)=>!!pad?.buttons[i]?.pressed;
   const now=[b(0),b(1),b(12)||b(14)||(pad?.axes[1]??0)<-.55||(pad?.axes[0]??0)<-.55,
    b(13)||b(15)||(pad?.axes[1]??0)>.55||(pad?.axes[0]??0)>.55];
   now[9]=b(9);
   now.forEach((v,i)=>{if(v&&!previous[i])handle(i);});previous=now;
   frame=requestAnimationFrame(poll);
  }
  function key(e:KeyboardEvent){
   if(e.code==="Escape"&&!e.repeat){e.preventDefault();handle(root()?.matches(".visorLab,.gmMenu")?1:9);}
  }
  frame=requestAnimationFrame(poll);addEventListener("keydown",key);
  return()=>{cancelAnimationFrame(frame);removeEventListener("keydown",key);};
 },[]);
}
