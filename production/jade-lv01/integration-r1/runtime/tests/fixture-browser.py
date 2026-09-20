"""Test native DOM fixture selection and local duel, synthetic gamepad only."""
from pathlib import Path
import asyncio,json
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
async def main():
 checks=[];errors=[];requests=[]
 def check(name,passed):
  assert passed,name
  checks.append(name)
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
  page=await browser.new_page(viewport={'width':1440,'height':1000})
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http://','https://')) else None)
  await page.set_content((R/'JADE_V12_08N_Couch_Art_Lab.html').read_text(),wait_until='load')
  await page.wait_for_function('window.__JADE_COUCH__?.inspect().loaded')
  await page.evaluate("window.testPads=[{index:3,id:'Synthetic controller',mapping:'standard',connected:true,axes:[0,0,1,0],buttons:Array.from({length:17},()=>({pressed:false}))}];Object.defineProperty(navigator,'getGamepads',{value:()=>window.testPads,configurable:true});")
  await page.click('#inspect')
  s=await page.evaluate('window.__JADE_COUCH__.inspect()')
  check('automatic controller fixture selects P2',s['fixtureInfo']['slot']==1 and s['state']['players'][1]['cover']['id']=='station')
  check('fixture begins paused',s['paused'])
  check('unchanged final design draws for P2',s['render']['frames'][1]['final'])
  check('keyboard-plus-controller mode is not changed',(await page.input_value('#mode'))=='keyboard-pad')
  await page.click('#pause');await page.wait_for_timeout(150)
  s=await page.evaluate('window.__JADE_COUCH__.inspect()')
  check('Resume binds the real device index to P2',s['devices']['bindings']==[None,3])
  await page.evaluate('window.testPads[0].buttons[6].pressed=true')
  await page.wait_for_timeout(250)
  s=await page.evaluate('window.__JADE_COUCH__.inspect()')
  check('synthetic LT raises the selected P2 pose',s['state']['players'][1]['pose']==2 and s['render']['frames'][1]['final'])
  await page.evaluate("window.__JADE_COUCH__.pause('P2 art inspection — unchanged K03')")
  await page.screenshot(path=str(R/'evidence/03_controller_p2_fixture.png'))
  await page.evaluate('window.testPads[0].buttons[6].pressed=false')
  await page.select_option('#inspectSeat','0');await page.click('#inspect')
  s=await page.evaluate('window.__JADE_COUCH__.inspect()')
  check('explicit P1 fixture is respected',s['fixtureInfo']['slot']==0 and s['state']['players'][0]['cover']['id']=='station')
  await page.select_option('#inspectSeat','1');await page.click('#lineOfFire');await page.click('#pause');await page.wait_for_timeout(180)
  s=await page.evaluate('window.__JADE_COUCH__.inspect()')
  check('clear-shot has two full-health opponents',s['state']['players'][0]['hp']==100 and s['state']['players'][1]['hp']==100)
  await page.evaluate('window.testPads[0].buttons[7].pressed=true');await page.wait_for_timeout(45);await page.evaluate('window.testPads[0].buttons[7].pressed=false')
  await page.wait_for_timeout(500)
  s=await page.evaluate('window.__JADE_COUCH__.inspect()')
  check('RT shot from P2 damages P1',s['state']['players'][0]['hp']<100 and s['state']['players'][1]['hp']==100)
  check('one trigger produced one shot event',s['state']['metrics']['shots']==1)
  await page.screenshot(path=str(R/'evidence/04_clear_shot_result.png'))
  await page.click('#start');await page.wait_for_timeout(80)
  s=await page.evaluate('window.__JADE_COUCH__.inspect()')
  check('Start returns to normal spawn without inspection',not s['inspection'] and s['fixtureInfo'] is None and s['state']['players'][0]['x']==-265)
  check('no JavaScript errors',not errors)
  check('offline no HTTP transport',not requests)
  report={'passed':len(checks),'checks':checks,'errors':errors,'externalRequests':requests,'browser':browser.version,'method':'Exact self-contained HTML via Playwright set_content; DOM controls, actual local duel; one synthetic Gamepad. Not physical Xbox, file-navigation or human-play certification.'}
  (R/'evidence/fixture-browser-checks.json').write_text(json.dumps(report,indent=2))
  await browser.close()
  print(json.dumps(report))
asyncio.run(main())
