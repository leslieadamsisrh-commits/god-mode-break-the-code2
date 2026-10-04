import urllib.request,urllib.parse,json,time,sys
url='https://god-mode-playable-core-production.up.railway.app/api/game'
def post(b):return json.load(urllib.request.urlopen(urllib.request.Request(url,data=json.dumps(b).encode(),headers={'Content-Type':'application/json'}),timeout=20))
f=post({'action':'create','mode':'solo','name':'Escape QA'});base={'room':f['room'],'token':f['token']};seq=0
def get():return json.load(urllib.request.urlopen(url+'?'+urllib.parse.urlencode(base),timeout=20))['state']
def inp(i):
 global seq
 seq+=1;post({'action':'input',**base,'seq':seq,'input':i});return get()
# Drain in free space, while continuously holding shield, using ordinary public inputs.
s=inp({'shield':True,'aim':0})
for n in range(45):
 s=get()
 if s['players'][0]['battery']==0:break
 time.sleep(.15)
assert s['players'][0]['battery']==0,'shield drain did not reach zero'
# Approach the first static cover with shield held to suppress passive recharge.
s=inp({'x':1,'shield':True,'aim':0})
for n in range(15):
 s=get()
 if s['players'][0]['coverId']:break
 time.sleep(.05)
p=s['players'][0];assert p['coverId'],'did not contact cover'
s=inp({'aim':0,'coverAim':True});p=s['players'][0];assert p['coverMode']=='braced'
# Preserve authoritative zero by existing host lab recharge control, not state injection.
# If it recovered during request timing, consume it using normal slow-time input.
s=inp({'slow':True,'aim':0})
for n in range(20):
 s=get()
 if s['players'][0]['battery']==0:break
 time.sleep(.05)
p=s['players'][0];assert p['coverId'] and p['battery']==0
start=(p['x'],p['y']);a=p['coverAnchor'];s=inp({'slide':True,'slow':True,'x':a['nx'],'y':a['ny'],'aim':0});p=s['players'][0]
assert p['coverId'] is None,'zero battery exit remained attached'
assert p['slide']>0 or ((p['x']-start[0])**2+(p['y']-start[1])**2)**.5>10,'no live escape movement'
print(json.dumps({'zero_battery_braced_escape':'PASS','position_before':start,'position_after':[p['x'],p['y']],'battery_after':p['battery']}))
s=inp({'powerup':True,'aim':0});assert s['players'][0]['charging'];print('live escape -> fresh Y charge: PASS')
