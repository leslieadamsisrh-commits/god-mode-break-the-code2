import Link from "next/link";
import Game from "./Game";
export default function Home(){
 return <>
  <Game/>
  <Link href="/studio" aria-label="Open Studio Labs" style={{position:"fixed",left:12,bottom:52,zIndex:2000,padding:"9px 12px",border:"1px solid #62edf0",borderRadius:8,background:"#081723",color:"#bafcff",font:"bold 11px Arial,sans-serif",textDecoration:"none",boxShadow:"0 4px 18px #0009"}}>STUDIO LABS ↗</Link>
 </>;
}
