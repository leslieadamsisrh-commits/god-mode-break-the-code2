from pathlib import Path
import asyncio, json
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
HTML=R/'JADE_V12_08N_B09_Fast_Integration.html'
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
        # Stage interior attached-ready state.
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];
          Object.assign(p,{x:-40,y:-5,vx:0,vy:0,slide:0,aim:0,lowerAim:0,aimHeld:false,cover:{id:'station',face:'south',edge:null},impact:0,cornerTravel:null,kick:0,reattach:0});
          w.tick+=1;w.time+=1/60;window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('exit prep uses attached B06A/CE08', f and 'B06-B06A' in f['id'])
        # Clear input mailbox neutral requirement.
        await page.evaluate("""()=>{const I=[{x:0,y:0,aim:0,aimHeld:false,fire:false,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,1);}""")
        # Slide while attached -> authoritative cover kick / push-off.
        await page.evaluate("""()=>{const I=[{x:0,y:1,aim:0,aimHeld:false,fire:false,slide:true,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,1);}""")
        state=await page.evaluate("()=>{const p=window.__JADE_COUCH__.world().players[0];return {cover:p.cover,kick:p.kick,vx:p.vx,vy:p.vy,state:p.state}}")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('push-off detaches and enters cover-kick', state['cover'] is None and state['kick']>0 and 'KICK' in f['label'])
        # Continue outward; kick art remains while kick timer active.
        await page.evaluate("""()=>{const I=[{x:0,y:1,aim:0,aimHeld:false,fire:false,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,4);}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('exit step remains readable during kick', f and ('KICK' in f['label'] or 'RUN' in f['label']))
        # Let kick expire while continuing outward into open locomotion.
        await page.evaluate("""()=>{const I=[{x:0,y:1,aim:0,aimHeld:false,fire:false,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,12);}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        if f and 'loading run-' in f['label']:
            await page.wait_for_timeout(150)
            await page.evaluate('window.__JADE_COUCH__.render()')
            f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('reopens to recovered run locomotion', f and 'RUN' in f['label'])
        # Release input and settle.
        await page.evaluate("""()=>{const I=[{x:0,y:0,aim:0,aimHeld:false,fire:false,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,35);}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('open locomotion recovery reaches ready', f and 'READY' in f['label'])
        vals=await page.evaluate('()=>({speed:window.JadeCore.TUNING.speed,slide:window.JadeCore.TUNING.slideDuration})')
        check('movement tuning unchanged', vals=={'speed':262,'slide':.7})
        await page.screenshot(path=str(R/'evidence/B09-cover-exit-runtime.png'))
        check('no browser exceptions', not errors)
        payload={'passed':len(checks),'checks':checks,'errors':errors,'externalRequests':requests,'browser':browser.version,'method':'B09 rough validation uses authoritative cover detach/kick and existing recovered kick/run/ready art placeholders; no final-master B09 art claimed.'}
        (R/'evidence/b09-fast-browser.json').write_text(json.dumps(payload,indent=2))
        print(json.dumps(payload,indent=2))
        await browser.close()
asyncio.run(main())
