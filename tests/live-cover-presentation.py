# Explicit live host check using ordinary public inputs; no state injection.
import urllib.request,urllib.parse,json,time,math
url='https://god-mode-playable-core-production.up.railway.app/api/game'
def post(b):return json.load(urllib.request.urlopen(urllib.request.Request(url,data=json.dumps(b).encode(),headers={'Content-Type':'application/json'}),timeout=20))
f=post({'action':'create','mode':'solo','name':'Cover Art QA'});base={'room':f['room'],'token':f['token']};seq=0

def get():return json.load(urllib.request.urlopen(url+'?'+urllib.parse.urlencode(base),timeout=20))['state']
def inp(i):
 global seq
 seq+=1;post({'action':'input',**base,'seq':seq,'input':i});return get()
s=inp({'x':1,'aim':0})
for n in range(25):
 s=get()
 if s['players'][0]['coverId']:break
 time.sleep(.05)
p=s['players'][0];assert p['coverId'],'contact missing'
s=inp({'coverAim':True,'aim':math.pi/4});p=s['players'][0];assert p['coverMode']=='braced';before=p['lastShot']
s=inp({'coverAim':True,'fire':True,'aim':math.pi/4});p=s['players'][0];assert p['lastShot']>before,'exposed fire missing';assert abs(p['gunFacing']-math.pi/4)<.01
s=inp({'aim':math.pi/4});p=s['players'][0];assert p['coverId'] and not p['input']['coverAim'],'release did not remain attached';a=p['coverAnchor']
s=inp({'slide':True,'x':a['nx'],'y':a['ny'],'aim':math.pi/4});assert not s['players'][0]['coverId'],'escape missing'
s=inp({'powerup':True,'aim':math.pi/4});assert s['players'][0]['charging'],'charge cancellation missing'
for n in range(30):
 s=get()
 if s['players'][0]['godCharge']>=1:break
 time.sleep(.08)
assert s['players'][0]['godCharge']>=1,'full charge missing'
s=inp({'aim':math.pi/4});assert not s['players'][0]['charging'] and s['players'][0]['godTime']>0,'release missing'
s=inp({'fire':True,'aim':math.pi/4});assert s['players'][0]['lastShot']>before,'combat return missing'
print('PASS live host ordinary input chain: contact -> brace -> d03 exposed fire -> LT release -> outward escape -> fresh Y -> full release -> combat. Rendering/controller/network validation separate.')
