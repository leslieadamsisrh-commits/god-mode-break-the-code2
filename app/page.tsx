import Link from "next/link";
import Game from "./Game";
export default function Home(){
 return <>
  <Game/>
  <nav aria-label="Studio access" style={{position:"fixed",right:12,top:12,zIndex:2147483647,pointerEvents:"auto"}}>
   <Link href="/studio" prefetch={false} style={{display:"block",minHeight:52,padding:"15px 18px",border:"2px solid #62edf0",borderRadius:12,background:"#07131f",color:"#eaffff",font:"900 13px Arial,sans-serif",textDecoration:"none",boxShadow:"0 8px 25px #000d",touchAction:"manipulation"}}>OPEN STUDIO LABS ↗</Link>
  </nav>
 </>;
}
