from pathlib import Path
import asyncio, json
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
HTML=R/'JADE_V12_08N_B08_Fast_Integration.html'
async def main():
    checks=[]; errors=[]; requests=[]
    def check(name, cond):
        assert cond, name
        checks.append(name)
    neutral=lambda aim=0: {'x':0,'y':0,'aim':aim,'aimHeld':False,'fire':False,'slide':False,'wrap':False,'attach':False}
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
        page=await browser.new_page(viewport={'width':1440,'height':1000})
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda r: requests.append(r.url) if r.url.startswith(('http://','https://')) else None)
        await page.set_content(HTML.read_text(),wait_until='load',timeout=30000)
        await page.wait_for_function('window.__JADE_COUCH__?.inspect().loaded',timeout=20000)
        await page.select_option('#inspectSeat','0'); await page.click('#inspect')
        check('standalone loads offline', not requests)
        # Stage supported right-corner state
        await page.evaluate("""()=>{const w=window.__JADE_COUCH__.world(),p=w.players[0];
          Object.assign(p,{x:51,y:-5,vx:0,vy:0,slide:0,aim:0,lowerAim:0,aimHeld:false,cover:{id:'station',face:'south',edge:'right'},impact:0,cornerTravel:null,pose:0,raise:0,recoil:0,lastShot:-1e9});
          w.tick+=1; w.time+=1/60; window.__JADE_COUCH__.render();}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('attached aim-low placeholder is K01', f and f['id']=='K01')
        # Clear mailbox neutral requirement, then raise aim over authoritative 1/60 steps.
        await page.evaluate("""()=>{const I=[{x:0,y:0,aim:0,aimHeld:false,fire:false,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,1);}""")
        await page.evaluate("""()=>{const I=[{x:0,y:0,aim:0,aimHeld:true,fire:false,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,5);}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('pop-out/raise reaches K02 or K03', f and f['id'] in ['K02','K03'])
        # Fire one authoritative shot
        before=await page.evaluate('window.__JADE_COUCH__.world().metrics.shots')
        await page.evaluate("""()=>{const I=[{x:0,y:0,aim:0,aimHeld:true,fire:true,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,1);}""")
        after=await page.evaluate('window.__JADE_COUCH__.world().metrics.shots')
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('fire uses K03 and creates exactly one shot', f and f['id']=='K03' and after==before+1)
        check('muzzle effect remains separate runtime effect', await page.evaluate("window.__JADE_COUCH__.world().effects.some(e=>e.type==='muzzle')"))
        # Let recoil/retract settle with aim released
        await page.evaluate("""()=>{const I=[{x:0,y:0,aim:0,aimHeld:false,fire:false,slide:false,wrap:false,attach:false},{x:0,y:0,aim:3.14159,aimHeld:false,fire:false,slide:false,wrap:false,attach:false}];window.__JADE_COUCH__.step(I,30);}""")
        f=await page.evaluate('window.__JADE_COUCH__.inspect().render.frames[0]')
        check('return settles back to K01', f and f['id']=='K01')
        vals=await page.evaluate('()=>({cycle:window.JadeCore.TUNING.shotCycle,pellets:window.JadeCore.TUNING.pellets,damage:window.JadeCore.TUNING.pelletDamage})')
        check('combat tuning unchanged', vals=={'cycle':.48,'pellets':7,'damage':18})
        await page.screenshot(path=str(R/'evidence/B08-aim-fire-runtime.png'))
        check('no browser exceptions', not errors)
        payload={'passed':len(checks),'checks':checks,'errors':errors,'externalRequests':requests,'browser':browser.version,'method':'B08 rough validation uses existing 08N supported-corner K01/K02/K03 action keys as explicit legacy placeholders; no final-master B08 art claimed.'}
        (R/'evidence/b08-fast-browser.json').write_text(json.dumps(payload,indent=2))
        print(json.dumps(payload,indent=2))
        await browser.close()
asyncio.run(main())
