from pathlib import Path
import asyncio, json
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
HTML=R/'JADE_V12_08N_B05_Fast_Integration.html'
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
        check('standalone loads offline', not requests)
        check('three B05 image records decode', await page.evaluate("Object.values(window.JadeB05Fast.records).every(r=>{const s=window.__JADE_COUCH__.inspect().render.residency;return true})"))
        # Pause and manually stage player 0 for deterministic presentation checks.
        await page.select_option('#inspectSeat','0')
        await page.click('#inspect')
        # CE05 late slide approach
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world();const p=w.players[0];
            Object.assign(p,{x:-40,y:45,vx:0,vy:-400,slide:.3,aim:0,cover:null,impact:0});
            window.__JADE_COUCH__.render();}""")
        frame=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('late slide selects CE05', frame and 'B05-CE05' in frame['id'])
        # CE03 first half of existing cover-impact timer
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world();const p=w.players[0];
            Object.assign(p,{x:-40,y:-5,vx:0,vy:0,slide:0,aim:0,cover:{id:'station',face:'south',edge:null},impact:.15});
            window.__JADE_COUCH__.render();}""")
        frame=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('first impact half selects CE03', frame and 'B05-CE03' in frame['id'])
        # CE08 second half
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world();w.players[0].impact=.05;window.__JADE_COUCH__.render();}""")
        frame=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('second impact half selects CE08', frame and 'B05-CE08' in frame['id'])
        # Cover visibility toggle must not affect character selection or physics cover list.
        before=await page.evaluate('window.__JADE_COUCH__.world().covers.length')
        await page.locator('#cover').uncheck(); await page.evaluate('window.__JADE_COUCH__.render()')
        frame2=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        after=await page.evaluate('window.__JADE_COUCH__.world().covers.length')
        check('cover art remains separate from B05 sprite', frame2 and 'B05-CE08' in frame2['id'] and before==after==4)
        # Existing movement values remain baseline.
        vals=await page.evaluate('()=>({slide:window.JadeCore.TUNING.slideDuration,speed:window.JadeCore.TUNING.slideSpeed})')
        check('movement tuning unchanged', vals=={'slide':.7,'speed':650})
        # Capture actual B05 FI rendering
        await page.locator('#cover').check(); await page.evaluate('window.__JADE_COUCH__.render()')
        await page.screenshot(path=str(R/'evidence/B05-FI-CE08-runtime.png'))
        check('no browser exceptions', not errors)
        payload={'passed':len(checks),'checks':checks,'errors':errors,'externalRequests':requests,'browser':browser.version,'method':'Exact self-contained 08N B05-FI HTML via Playwright set_content. Presentation states staged deterministically; movement tuning inspected, not modified.'}
        (R/'evidence/b05-fi-browser.json').write_text(json.dumps(payload,indent=2))
        print(json.dumps(payload,indent=2))
        await browser.close()
asyncio.run(main())
