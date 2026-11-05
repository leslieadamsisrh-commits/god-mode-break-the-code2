/** Preserve discrete keyboard/touch transitions between animation frames. */
export class SlideInputEdges {
 private held=new Set<string>();
 private pending:{slide:boolean;x:number;y:number}[]=[];
 get pressed(){return this.held.size>0;}
 set(source:string,pressed:boolean,movement:{x:number;y:number}){
  const before=this.pressed;
  if(pressed)this.held.add(source);else this.held.delete(source);
  if(before!==this.pressed)this.pending.push({slide:this.pressed,...movement});
 }
 drain(){const events=this.pending;this.pending=[];return events;}
 reset(){this.held.clear();this.pending=[];}
}
