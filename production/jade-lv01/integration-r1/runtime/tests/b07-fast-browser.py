from pathlib import Path
import asyncio, json
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
HTML=R/'JADE_V12_08N_B07_Fast_Integration.html'
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
        await page.select_option('#inspectSeat','0'); await page.click('#inspect')
        check('standalone loads offline', not requests)
        # Left edge peek
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];
          Object.assign(p,{x:-131,y:-5,vx:0,vy:0,slide:0,aim:0,aimHeld:true,cover:{id:'station',face:'south',edge:'left'},impact:0,cornerTravel:null});
          w.tick+=1; w.time+=1/60; window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('left edge uses recovered peek placeholder', f and (not f['final']) and 'PEEK' in f['label'])
        # Right edge peek
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];
          Object.assign(p,{x:51,y:-5,vx:0,vy:0,aim:0,aimHeld:true,cover:{id:'station',face:'south',edge:'right'},impact:0,cornerTravel:null});
          w.tick+=1; w.time+=1/60; window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('right edge uses existing legacy final-art placeholder', f and f['final'] and f['id']=='K01')
        # B06 interior still works
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];
          Object.assign(p,{x:-40,y:-5,vx:-120,vy:0,aim:0,aimHeld:false,cover:{id:'station',face:'south',edge:null},impact:0,cornerTravel:null});
          w.tick+=1; w.time+=1/60; window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('B06 interior shimmy still selects authored key', f and 'B06-B06B' in f['id'])
        vals=await page.evaluate('()=>({slide:window.JadeCore.TUNING.slideDuration,speed:window.JadeCore.TUNING.slideSpeed})')
        check('movement tuning unchanged', vals=={'slide':.7,'speed':650})
        await page.screenshot(path=str(R/'evidence/B07-corner-peek-placeholder.png'))
        check('no browser exceptions', not errors)
        payload={'passed':len(checks),'checks':checks,'errors':errors,'externalRequests':requests,'browser':browser.version,'method':'B07 rough validation uses existing recovered cover-router peek role as explicit placeholder; final B07 art remains pending.'}
        (R/'evidence/b07-fast-browser.json').write_text(json.dumps(payload,indent=2))
        print(json.dumps(payload,indent=2))
        await browser.close()
asyncio.run(main())
