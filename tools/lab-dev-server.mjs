import {createServer} from 'node:http';
import {readFile,stat,realpath} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {LabSessionManager} from '../experiments/shotgun-powered-duel/lab-session-manager.js';
const root=resolve(import.meta.dirname,'..'),manager=new LabSessionManager();
const args=process.argv.slice(2),value=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1]};
const port=Number(value('--port',process.env.PORT||5173)),host=value('--host','0.0.0.0');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.md':'text/plain'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname.startsWith('/api/duel/shotgun-next/')){
  if(req.method!=='POST'){res.writeHead(405).end();return;}
  if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){res.writeHead(403).end();return;}
  let bytes=0,chunks=[];for await(const c of req){bytes+=c.length;if(bytes>4096){res.writeHead(413).end();return;}chunks.push(c);}
  let body;try{body=JSON.parse(Buffer.concat(chunks).toString());}catch{res.writeHead(400).end();return;}
  const result=manager.handle(u.pathname.split('/').at(-1),body);res.writeHead(result.status,{'content-type':'application/json','cache-control':'no-store'}).end(JSON.stringify(result.body));return;
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return;}
 let path=decodeURIComponent(u.pathname);if(path==='/'){res.writeHead(302,{location:'/experiments/shotgun-powered-duel/shotgun-combat-lab.html'+u.search}).end();return;}
 if(path.split('/').some(s=>s.startsWith('.')||s==='node_modules')){res.writeHead(404).end();return;}
 const file=await realpath(resolve(root,'.'+path));if(!file.startsWith(root+sep)){res.writeHead(404).end();return;}
 const info=await stat(file);if(!info.isFile()){res.writeHead(404).end();return;}
 res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(req.method==='HEAD'?undefined:await readFile(file));
 }catch(error){res.writeHead(error.code==='ENOENT'?404:500).end('Unavailable');}});
const ticker=setInterval(()=>manager.tick(),1000/60);server.on('close',()=>clearInterval(ticker));
server.listen(port,host,()=>console.log('Shotgun integration preview http://'+host+':'+port));
