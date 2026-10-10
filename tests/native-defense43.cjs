const fs=require('fs'),vm=require('vm'),ts=require('typescript'),{stripTypeScriptTypes}=require('node:module'),{createCanvas}=require(process.env.CANVAS_MODULE);
const c={exports:{},Math,performance:{now:()=>1000},navigator:{getGamepads:()=>[]},crypto:require('crypto').webcrypto,setTimeout,clearTimeout};vm.createContext(c);
for(const f of ['bayBridgeMap','bayBridgePresentation','cover-occlusion','game'])vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/'+f+'.ts','utf8')).replace(/^import .*\n/gm,'').replace(/export /g,''),c);
vm.runInContext('const cameraState=bayRenderCamera;',c);
vm.runInContext(ts.transpileModule(fs.readFileSync('app/Game.tsx','utf8').replace(/^import .*\n/gm,''),{compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText+';globalThis.a={newGame,drawCombatHelmet,duelContact};',c);
const a=c.a,sheet=createCanvas(1800,816),g=sheet.getContext('2d'),labels=['DAMAGE FROM LEFT','DAMAGE FROM RIGHT','DAMAGE FROM ABOVE','DAMAGE FROM BELOW','YOUR SHIELD BLOCKED','CRITICAL COVER / ESCAPE'];
for(let n=0;n<6;n++){const s=a.newGame('Les','t',1000,'practice');s.phase='playing';s.time=1;s.covers=[];if(n<5){const angle=[0,Math.PI,Math.PI/2,-Math.PI/2,.5][n];if(n===4){s.players[0].shield=true;s.players[0].input.shield=true;}a.duelContact(s,1,s.players[0],35,Math.cos(angle)*100,Math.sin(angle)*100);}else{s.covers=[{id:'barrier',x:310,y:330,w:112,h:34,a:0,hp:45,maxHp:280,constructOwner:0}];}
 const x=n%3*600,y=Math.floor(n/3)*408;g.fillStyle='#162231';g.fillRect(x,y,600,408);g.save();g.translate(x,y+30);g.scale(.6,.6);a.drawCombatHelmet(g,s,0);g.restore();g.fillStyle='#d1eaf4';g.font='bold 12px monospace';g.fillText(labels[n],x+15,y+21);
}
const out=process.argv[2]||'../defense43-review';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/feedback43.png',sheet.toBuffer('image/png'));console.log('PASS43 native: six production HUD fixtures rendered; not an iPad/controller test.');

