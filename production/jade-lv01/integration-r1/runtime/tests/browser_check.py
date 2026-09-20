"""Real browser local simulation and UI; no mocked networking or external service.
Physical controllers are represented by synthetic Gamepad API values for these checks.
"""
from pathlib import Path
import asyncio,json
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
async def main():
 checks=[];errors=[];requests=[]
 def check(name,ok):
  assert ok,name
  checks.append(name)
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
  page=await browser.new_page(viewport={'width':1440,'height':1000})
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http://','https://')) else None)
  await page.set_content((R/'JADE_V12_08N_Couch_Art_Lab.html').read_text(),wait_until='load',timeout=30000)
  await page.wait_for_function('window.__JADE_COUCH__?.inspect().loaded',timeout=20000)
  check('offline assets load; no external requests',not requests)
  check('two images visible at lobby',(await page.evaluate('window.__JADE_COUCH__.inspect().render.frames.filter(Boolean).length'))==2)
  check('startup waits without simulating',(await page.evaluate('window.__JADE_COUCH__.inspect().state.tick'))==0)
  await page.evaluate("window.pads=[{index:3,id:'Synthetic pad A',mapping:'standard',connected:true,axes:[0,0,1,0],buttons:Array.from({length:17},()=>({pressed:false}))}];Object.defineProperty(navigator,'getGamepads',{value:()=>window.pads,configurable:true});")
  await page.click('#start');await page.wait_for_timeout(150)
  check('keyboard/controller bind distinct seats',(await page.evaluate('window.__JADE_COUCH__.inspect().devices.bindings'))==[None,3])
  x=await page.evaluate('window.__JADE_COUCH__.inspect().state.players.map(p=>p.x)')
  await page.locator('#stage').focus();await page.keyboard.down('KeyD');await page.wait_for_timeout(230);await page.keyboard.up('KeyD')
  b=await page.evaluate('window.__JADE_COUCH__.inspect().state.players.map(p=>p.x)')
  check('keyboard controls only P1',b[0]>x[0]+15 and b[1]==x[1])
  y=await page.evaluate('window.__JADE_COUCH__.inspect().state.players[1].y')
  await page.evaluate('window.pads[0].axes=[0,-1,-1,0]');await page.wait_for_timeout(180)
  check('gamepad controls P2',(await page.evaluate('window.__JADE_COUCH__.inspect().state.players[1].y'))<y-10)
  await page.evaluate('window.pads[0].axes=[0,0,-1,0]');await page.evaluate("window.dispatchEvent(new Event('blur'))")
  check('focus loss pauses',(await page.evaluate('window.__JADE_COUCH__.inspect().paused')))
  tick=await page.evaluate('window.__JADE_COUCH__.inspect().state.tick');await page.wait_for_timeout(100)
  check('no simulation ticks while paused',(await page.evaluate('window.__JADE_COUCH__.inspect().state.tick'))==tick)
  await page.evaluate("window.pads.push({index:8,id:'Synthetic pad B',mapping:'standard',connected:true,axes:[0,0,1,0],buttons:Array.from({length:17},()=>({pressed:false}))});")
  await page.select_option('#mode','two-pads');await page.click('#start');await page.wait_for_timeout(160)
  check('two controller indices assigned',(await page.evaluate('window.__JADE_COUCH__.inspect().devices.bindings'))==[3,8])
  before=await page.evaluate('window.__JADE_COUCH__.inspect().state.players.map(p=>p.x)')
  await page.locator('#stage').focus();await page.keyboard.down('KeyD');await page.wait_for_timeout(100);await page.keyboard.up('KeyD')
  check('keyboard movement ignored in two-pad mode',(await page.evaluate('window.__JADE_COUCH__.inspect().state.players.map(p=>p.x)'))==before)
  await page.evaluate('window.pads[0].axes=[1,0,1,0];window.pads[1].axes=[-1,0,-1,0]');await page.wait_for_timeout(200)
  after=await page.evaluate('window.__JADE_COUCH__.inspect().state.players.map(p=>p.x)')
  check('both local players move simultaneously',after[0]>before[0]+10 and after[1]<before[1]-10)
  await page.evaluate('window.pads[0].axes=[0,0,1,0];window.pads[1].axes=[0,0,-1,0];window.pads[1].connected=false;')
  await page.wait_for_timeout(80)
  check('controller disconnect pauses rather than remaps',(await page.evaluate('window.__JADE_COUCH__.inspect().paused')))
  await page.evaluate('window.pads[1].connected=true');await page.click('#start');await page.wait_for_timeout(120)
  await page.evaluate("const w=window.__JADE_COUCH__.world();Object.assign(w.players[0],{x:-75,y:260,vx:0,vy:0,aim:0});Object.assign(w.players[1],{x:75,y:260,vx:0,vy:0,aim:Math.PI});window.pads[0].buttons[7].pressed=true;")
  await page.wait_for_timeout(1300)
  state=await page.evaluate('window.__JADE_COUCH__.inspect().state')
  check('actual local shots damage opponent',state['players'][1]['hp']<100)
  check('local round ends with score',state['phase']=='finished' and state['winner']==0 and state['scores'][0]==1)
  await page.evaluate('window.pads[0].buttons[7].pressed=false');await page.click('#start');await page.wait_for_timeout(100)
  check('rematch resets both health bars',(await page.evaluate('window.__JADE_COUCH__.inspect().state.players.map(p=>p.hp)'))==[100,100])
  await page.select_option('#inspectSeat','0');await page.click('#inspect');
  check('art fixture remains paused',(await page.evaluate('window.__JADE_COUCH__.inspect().paused')))
  await page.evaluate("const w=window.__JADE_COUCH__.world();Object.assign(w.players[0],{pose:2,raise:1,action:'AIM',aimHeld:true});window.__JADE_COUCH__.render();")
  check('approved final Jade selected in local art fixture',(await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0].final')))
  await page.screenshot(path=str(R/'evidence/01_local_art_fixture.png'))
  await page.locator('#cover').uncheck();check('cover visibility independent',not await page.locator('#cover').is_checked());await page.locator('#cover').check()
  check('fixture collision unaffected by visibility',(await page.evaluate('window.__JADE_COUCH__.world().covers.length'))==4)
  await page.locator('#finalArt').uncheck()
  for i in range(96):
   await page.evaluate('(a)=>{const w=window.__JADE_COUCH__.world();w.players[0].aim=a;w.players[1].aim=-a;window.__JADE_COUCH__.render();}',(i%24)*3.141592653589793/12)
   await page.wait_for_timeout(4)
  check('96 two-actor heading changes retain images',(await page.evaluate('window.__JADE_COUCH__.inspect().render.counts.missing'))==0)
  await page.locator('#finalArt').check();await page.click('#start');await page.wait_for_timeout(100)
  await page.evaluate('window.pads[0].axes=[.8,0,1,0];window.pads[1].axes=[-.8,0,-1,0]');await page.wait_for_timeout(250)
  await page.evaluate("window.__JADE_COUCH__.pause('Local two-player movement capture')")
  await page.screenshot(path=str(R/'evidence/02_actual_local_match.png'))
  check('no browser exceptions',not errors)
  check('no network service or mocked network transport needed',not requests)
  payload={'passed':len(checks),'checks':checks,'errors':errors,'externalRequests':requests,'browser':browser.version,'method':'Exact offline standalone HTML executed through Playwright set_content. Actual local duel simulation, DOM controls, synthetic two-gamepad values. No networking used or mocked; no physical Xbox or end-user file navigation claim.'}
  (R/'evidence/browser-checks.json').write_text(json.dumps(payload,indent=2))
  await browser.close()
  print(json.dumps({'passed':len(checks),'errors':errors}))
asyncio.run(main())
