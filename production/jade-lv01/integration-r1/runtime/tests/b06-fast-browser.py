from pathlib import Path
import asyncio, json
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
HTML=R/'JADE_V12_08N_B06_Fast_Integration.html'
async def main():
    checks=[]; errors=[]; requests=[]
    def check(name, cond):
        assert cond, name
        checks.append(name)
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
        page=await browser.new_page(viewport={'width':1440,'height':1000})
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda r: requests.append(r.url) if r.url.startswith(('http://','https://')) else None)
        await page.set_content(HTML.read_text(),wait_until='load',timeout=30000)
        await page.wait_for_function('window.__JADE_COUCH__?.inspect().loaded',timeout=20000)
        await page.select_option('#inspectSeat','0')
        await page.click('#inspect')
        check('standalone loads offline', not requests)
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];
          Object.assign(p,{x:-40,y:-5,vx:0,vy:0,slide:0,aim:0,cover:{id:'station',face:'south',edge:null},impact:0,cornerTravel:null});
          window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('attached idle uses B06A/CE08', f and 'B06-B06A' in f['id'])
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];p.vx=-120;window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('left shimmy selects authored B06B', f and 'B06-B06B' in f['id'] and f['availability']=='exact')
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];p.vx=120;window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('right shimmy uses explicit placeholder', f and 'B06-B06C_PLACEHOLDER' in f['id'] and f['availability']=='placeholder')
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];p.vx=0;p.impact=.15;window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('B05 impact retains priority', f and 'B05-CE03' in f['id'])
        vals=await page.evaluate('()=>({slide:window.JadeCore.TUNING.slideDuration,speed:window.JadeCore.TUNING.slideSpeed})')
        check('movement tuning unchanged', vals=={'slide':.7,'speed':650})
        await page.screenshot(path=str(R/'evidence/B06-fast-runtime.png'))
        check('no browser exceptions', not errors)
        payload={'passed':len(checks),'checks':checks,'errors':errors,'externalRequests':requests,'browser':browser.version,'method':'Exact self-contained B06 fast integration; right-shimmy art deliberately marked placeholder.'}
        (R/'evidence/b06-fast-browser.json').write_text(json.dumps(payload,indent=2))
        print(json.dumps(payload,indent=2))
        await browser.close()
asyncio.run(main())
