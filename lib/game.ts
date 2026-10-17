import {bayCoverState,bayObject} from "./bayBridgeMap";
export type InputState={coverShapeCycle?:boolean;gripX?:number;gripY?:number;x:number;y:number;aim:number;fire:boolean;shield:boolean;coverAim:boolean;slide:boolean;melee:boolean;heavy:boolean;grip:boolean;throwMatter:boolean;cover:boolean;orbit:boolean;launchOrbit:boolean;pinball:boolean;powerup:boolean;slow:boolean;fieldCycle?:boolean;powerCycle?:boolean;weaponCycle?:boolean;powerUse?:boolean};
export type CombatConfig={chargeMoveScale:number;chargeMoveResponse:number;powerChargeSeconds:number;godDuration:number;godDrain:number;powerRecharge:number;godDamage:number;gripEnergy:number;holdEnergy:number;coverThrowEnergy:number;carryResponse:number;carryTurnResponse:number;carryMomentum:number;slideEnergy:number;dashEnergy:number;rechargeDelay:number;rechargeRate:number;weaveEnabled:number;moveSpeed:number;response:number;stopDrag:number;slideDrag:number;dashSpeed:number;dashDuration:number;doubleTapWindow:number;slideSpeed:number;slideDuration:number;slideSustain:number;slideSteer:number;slideSteerAngle:number;slideSteerResponse:number;slideBrake:number;slideCancelSpeed:number;shotCadence:number;shotSpread:number;shotDamage:number;shotSpeed:number;throwForce:number;pinballSpeed:number;pinballDuration:number;maxHealth:number;spriteScale:number;cameraZoom:number;};
export const GRIP_STRENGTH=1.2; // Grip36 experiment: +20% manipulation/launch; field reach and costs unchanged.
// Ground44 is a finite surface layer, never a hole or a collision obstacle.
export type GroundSource44={id:string;x:number;y:number;remaining:number;initial:number;peeledAt?:number;angle?:number;panel46?:boolean;revision?:number;material?:"concrete";state?:"intact"|"fractured"|"extracted"|"reconstructing"};
export type ConstructMatter44={kind:"stone"|"metal";sourceArt?:string;fragment?:number;unitId?:string;groundId?:string;originX?:number;originY?:number};
export const GROUND_44={unitsPerCover:3,assemblySeconds:.24} as const;
// Living Battlefield 15: sparse, deterministic floor ledger; no physics bodies per cell.
const FLOOR15={minX:80,maxX:920,minY:90,maxY:570,step:80} as const;
function groundSources44():GroundSource44[]{
 const cells:GroundSource44[]=[];
 for(let y=FLOOR15.minY,row=0;y<=FLOOR15.maxY;y+=FLOOR15.step,row++)
  for(let x=FLOOR15.minX,col=0;x<=FLOOR15.maxX;x+=FLOOR15.step,col++)
   cells.push({id:`floor15-${col}-${row}`,x,y,remaining:3,initial:3,material:"concrete",state:"intact",revision:0,...col===5&&row===3?{panel46:true}:{}});
 return cells;
}
export function floorCellAt15(s:GameState,x:number,y:number){
 return (s.groundSources44||[]).filter(c=>Math.abs(c.x-x)<=FLOOR15.step/2&&Math.abs(c.y-y)<=FLOOR15.step/2)
  .sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];
}
export function floorLine15(s:GameState,x:number,y:number,angle:number,range:number){
 const cells:GroundSource44[]=[];const seen=new Set<string>();
 for(let d=0;d<=range;d+=FLOOR15.step/2){const c=floorCellAt15(s,x+Math.cos(angle)*d,y+Math.sin(angle)*d);
  if(c&&!seen.has(c.id)){seen.add(c.id);cells.push(c);}}
 return cells;
}
export const DEFAULT_CONFIG:CombatConfig={chargeMoveScale:.67145,chargeMoveResponse:8,powerChargeSeconds:2.4,godDuration:12,godDrain:2,powerRecharge:26,godDamage:1.35,gripEnergy:4,holdEnergy:3,coverThrowEnergy:6,carryResponse:12,carryTurnResponse:9,carryMomentum:.65,slideEnergy:5,dashEnergy:2,rechargeDelay:.8,rechargeRate:12,weaveEnabled:1,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:430,dashDuration:.16,doubleTapWindow:.28,slideSpeed:490,slideDuration:.50,slideSustain:160,slideSteer:5,slideSteerAngle:.48,slideSteerResponse:7,slideBrake:9.5,slideCancelSpeed:150,shotCadence:.39,shotSpread:.04,shotDamage:10,shotSpeed:820,throwForce:720,pinballSpeed:830,pinballDuration:.5,maxHealth:420,spriteScale:.82,cameraZoom:1.85};
export type CoverAnchor={face:"left"|"right"|"top"|"bottom";edge:number;t:number;length:number;offset:number;half:number;nx:number;ny:number;tx:number;ty:number};
export type CoverExit={points:{x:number;y:number}[];index:number;dx:number;dy:number;until:number;travel:number;total:number;coverId:string};
export type Player={gloveHoldStarted?:number;gloveCharge?:number;coverShape?:number;meleeCombo?:MeleeCombo;meleeNextUntil?:number;meleeNextStage?:number;blastCharge?:number;blastChargeProgress?:number;blastUntil?:number;blastPoseAt?:number;botRecoverAfter?:number;botMeleeUntil?:number;gripCancelRelease?:boolean;gripGesture?:boolean;gripDrive?:number;gripDriveAt?:number;gripReleaseKind?:string;gripReleaseUntil?:number;botAvoidGrabUntil?:number;botGripStyle?:number;botGuardUntil?:number;botNextGuard?:number;pendingFireUntil?:number;botBuildFailures?:number;botSeenAction?:number;botCounterUntil?:number;botBuildId?:string;botBuildAt?:number;botNextBuild?:number;botRechargeUntil?:number;botProbeAt?:number;botProbeX?:number;botProbeY?:number;botEscapeUntil?:number;botIntent?:string;botTimeEnd?:number;botFollowUntil?:number;botReleaseUntil?:number;selectedPower?:number;selectedWeapon?:number;timeFieldActive?:boolean;timePellets?:number;timeVolleys?:number;timeAgeRemaining?:number;pendingMelee?:{heavy:boolean;until:number};reactionDeadline?:number;lastContactAt?:number;fieldLevel?:number;gripHint?:string;gripHintUntil?:number;botRouteSide?:number;botGripSince?:number;hitUntil?:number;hitAngle?:number;deathAt?:number;shells?:number;maxShells?:number;reserveShells?:number;weaponState?:"READY"|"FIRE"|"RECOIL"|"PUMP"|"EMPTY"|"RELOAD";psychicStartedAt?:number;psychicReturnUntil?:number;chargeSuppressed?:string[];x:number;y:number;vx:number;vy:number;aim:number;hp:number;battery:number;charging:boolean;chargeMotion:number;chargeAge:number;godCharge:number;godTime:number;godDuration:number;powerFlash:number;powerReturn:number;powerReleaseAge:number;powerReleaseCharge:number;godFade:number;godFadeStrength:number;powerBlocked:boolean;lastEnergyAt:number;dash:number;brake:number;slideSteerCurrent:number;lastSlideTap:number;slide:number;slideFacing:number;slideCool:number;kickScale?:number;kickStage:"none"|"burst"|"step";kickTime:number;kickAngle:number;kickNx:number;kickNy:number;coverId:string|null;coverMode:"soft"|"braced"|null;coverAnchor:CoverAnchor|null;coverLock:number;coverSpeed:number;softImpact?:number;softImpactAt?:number;peek:boolean;peekEdge:boolean;contact:number;exit:CoverExit|null;shield:boolean;gripId:string|null;gripCoverId:string|null;coverGripAngle:number;coverGripDist:number;orbitIds:string[];knock:number;pinball:number;lastShot:number;fireBlocked:boolean;fireState:number;recoil:number;returnToCover:number;boostState:number;brakeState:number;diagAuthCorrection?:number;diagNetAge?:number;gunFacing:number;lastMelee:number;score:number;rematch:boolean;input:InputState;processedInput:InputState;lastSeq:number;name:string;token:string;bot:boolean};
export type FloorSlab46={floorPanel46?:{sourceId:string;originX:number;originY:number;creator:number}};
export type Cover=FloorSlab46 & {protected45?:boolean;stamp44?:number;construction44?:"peel"|"salvage";assembly44?:ConstructMatter44[];attackId?:string;hover?:number;carryRadialSpeed?:number;carryAngularSpeed?:number;carryRotationSpeed?:number;carryBlockedAt?:number;constructOwner?:number;matterSources?:ConstructMatter44[];scarAt?:number;id:string;x:number;y:number;w:number;h:number;a:number;hp:number;maxHp:number;generated:boolean;build:number;variant:number;artId?:string;coverClass?:"waist"|"tall";born?:number;vx?:number;vy?:number;throwOwner?:number;hitIds?:string[]};
export type Matter={unitId?:string;groundId?:string;groundScatter?:boolean;spin?:number;spinVelocity?:number;height?:number;liftVelocity?:number;scatterAt?:number;attackId?:string;throwOwner?:number;hitIds?:string[];sourceArt?:string;fragment?:number;id:string;x:number;y:number;vx:number;vy:number;r:number;kind:"metal"|"stone";heldBy:number|null;orbitBy:number|null;life:number};
export type Shot={attackId?:string;source?:string;radius?:number;realAge?:number;volleyId?:string;fieldOwners?:number[];projectileScale?:number;id:string;owner:number;x:number;y:number;vx:number;vy:number;life:number;damage?:number;z?:number;renderOffsetX?:number;clearanceCoverId?:string};
export type Fx={material?:"digital"|"cyber";strength?:number;id:string;type:string;x:number;y:number;life:number;owner?:number;text?:string;z?:number;renderOffsetX?:number;angle?:number};
export type HitRegion="low"|"torso"|"head";
export type CombatEvent={incomingAngle?:number;attackId?:string;source?:string;seq:number;round:number;at:number;kind:"hit"|"shield"|"cover"|"finish";owner:number;target?:number;region?:HitRegion;damage:number;x:number;y:number;z:number;material?:"stone"|"metal"};
export const REGION_DAMAGE={low:.75,torso:1,head:1.25};
export const FINISHER_SECONDS=1.25;
export type GameState={groundSources44?:GroundSource44[];botStrategy?:"baseline"|"adaptive";botExperience?:BotExperience[];botRound?:FightRound;fightRecording?:FightRecording;actionSeq?:number;actions?:ActionOutcome[];actionCounts?:Record<string,number>;energySpent?:number[];watchPaused?:boolean;watchNextAt?:number;events?:CombatEvent[];eventSeq?:number;timeScale?:number;fightUntil?:number;build:string;mode:"bot"|"solo"|"duel"|"practice"|"watch";phase:"lobby"|"countdown"|"playing"|"finisher"|"finished";round:number;winner:number|null;countdown:number;finisher:number;createdAt:number;lastAt:number;time:number;config:CombatConfig;players:Player[];covers:Cover[];matter:Matter[];shots:Shot[];fx:Fx[]};

export type ActionOutcome={attackId?:string;context?:string;objectClass?:string;distanceBand?:string;spawnSide?:string;opponentBehavior?:string;speed?:number;mass?:number;round:number;seq:number;at:number;wallAt:number;owner:number;action:string;status:"attempted"|"activated"|"rejected"|"buffered"|"cancelled"|"contact"|"missed"|"recovered";reason?:string;objectId?:string;amount?:number};
function actionOutcome(s:GameState,owner:number,action:string,status:ActionOutcome["status"],reason?:string,objectId?:string,amount?:number,attackId?:string){
 if(status==="activated"&&action==="throw"){attackId??=uid();const obj=s.covers.find(c=>c.id===objectId)||s.matter.find(m=>m.id===objectId);if(obj)obj.attackId=attackId;else if(reason==="orbit")for(const m of s.matter)if(m.throwOwner===owner&&m.attackId===undefined&&Math.hypot(m.vx,m.vy)>140)m.attackId=attackId;}
 const e:ActionOutcome={round:s.round,seq:(s.actionSeq||0)+1,at:s.time,wallAt:s.lastAt,owner,action,status,...attackId?{attackId}:{},...reason?{reason}:{},...objectId?{objectId}:{},...amount!==undefined?{amount}:{}};s.actionSeq=e.seq;recordFightAction(s,e);(s.actions??=[]).push(e);if(s.actions.length>128)s.actions.splice(0,s.actions.length-128);const key=owner+":"+action+":"+status;(s.actionCounts??={})[key]=(s.actionCounts[key]||0)+1;return e;
}
export function combatDiagnostics(s:GameState){return{round:s.round,phase:s.phase,actionSeq:s.actionSeq||0,actions:s.actions||[],counts:s.actionCounts||{},energySpent:s.energySpent||[],units:{time:"simulation seconds",wallAt:"server milliseconds",energy:"observed battery loss"}};}
function actionRequests(p:Player,i:InputState,prev:InputState,time:number){const out:string[]=[];for(const [key,action] of [["fire",i.grip?"throw":(p.blastUntil||0)>time&&(p.blastCharge||0)>0?"glove-blast":"shotgun"],["throwMatter","throw"],["grip","grip"],["slide","movement"],["shield","shield"],["powerup","charge"],["cover","build"],["orbit","orbit"],["slow","time"],["melee","melee"],["heavy","heavy"],["pinball","pinball"]] as const)if(i[key]&&!prev[key])out.push(action);if(i.powerUse&&!prev.powerUse)out.push(["build","orbit","pinball","heavy","time"][p.selectedPower||0]);return [...new Set(out)];}
function auditTransitions(s:GameState,before:Player[],requests:string[][],firstSeq:number){
 for(let n=0;n<s.players.length;n++){const p=s.players[n],old=before[n];
  const delta=Math.max(0,old.battery-p.battery);(s.energySpent??=[])[n]=(s.energySpent[n]||0)+delta;
  const changes:[[string,boolean,boolean],...Array<[string,boolean,boolean]>]=[["charge",old.charging,p.charging],["shield",old.shield,p.shield],["time",!!old.timeFieldActive,!!p.timeFieldActive],["grip",!!(old.gripId||old.gripCoverId),!!(p.gripId||p.gripCoverId)],["orbit",!!old.orbitIds.length,!!p.orbitIds.length],["brace",old.coverMode==="braced",p.coverMode==="braced"]];
  for(const [action,was,on] of changes){if(!was&&on){actionOutcome(s,n,action,"activated");if(action==="grip"){const obj=s.covers.find(c=>c.id===p.gripCoverId)||s.matter.find(m=>m.id===p.gripId);if(obj)s.fx.push({id:uid(),type:"grip-acquire",x:obj.x,y:obj.y,life:.22,owner:n});}}if(was&&!on&&!((action==="grip"||action==="orbit")&&s.actions?.some(e=>e.seq>firstSeq&&e.owner===n&&e.action==="throw"&&e.status==="activated")))actionOutcome(s,n,action,"cancelled",p.hp<=0?"round finish":p.knock>0?"incoming hit":p.battery<=0?"exhausted":p.input.powerup?"charge cancellation":"released or replaced");}
  if(old.knock>0&&p.knock<=0)actionOutcome(s,n,"reaction","recovered");
  if(!old.dash&&p.dash>0||!old.slide&&p.slide>0||old.coverId&&!p.coverId)actionOutcome(s,n,"movement","activated",old.coverId?"cover escape":"boost/slide");
  if(old.pinball<=0&&p.pinball>0)actionOutcome(s,n,"pinball","activated");
  if(old.lastMelee!==p.lastMelee&&!s.actions?.some(e=>e.seq>firstSeq&&e.owner===n&&e.action==="melee"&&e.status==="activated"))actionOutcome(s,n,p.input.heavy||old.pendingMelee?.heavy?"heavy":"melee","activated");
  if(old.pendingFireUntil!==undefined&&p.pendingFireUntil===undefined&&old.lastShot===p.lastShot)actionOutcome(s,n,"shotgun","cancelled",s.time>old.pendingFireUntil?"buffer expired":"state changed");
  for(const action of requests[n]){if(s.actions?.some(e=>e.seq>firstSeq&&e.owner===n&&e.action===action&&(e.status==="activated"||e.status==="cancelled"||e.status==="buffered"||e.status==="rejected")))continue;const buffered=action==="shotgun"&&p.pendingFireUntil!==undefined||(action==="melee"||action==="heavy")&&!!p.pendingMelee;const reason=action==="build"||action==="grip"||action==="throw"?((p.gripHintUntil||0)>=s.time?p.gripHint:"no eligible target/action"):p.charging?"charging":p.knock>0?"reaction":p.battery<=0?"exhausted":"cooldown or incompatible state";actionOutcome(s,n,action,buffered?"buffered":"rejected",reason);}
 }
}

// Release37: bounded authoritative evidence; persistent storage is browser-local, never executable code.
export const FIGHT_SCHEMA=2, BOT_STRATEGY_ID="combat-flow38-v1";
export type ExperienceCell={trials:number;contacts:number;damage:number;blocks:number};
export type BotExperience={schema:number;strategy:string;rounds:number;cells:Record<string,ExperienceCell>};
type FighterMetrics={playerDamage:number;coverDamage:number;playerHits:number;coverHits:number;blocks:number;confirmedFollowUps:number;intentions:Record<string,number>;actions:Record<string,number>;rejections:Record<string,number>;batterySpent:number;chargingSeconds:number;blockedHoldSeconds:number;heldSeconds:number;longestBlockedHold:number;acquisitionToControl:number[];acquisitionToRelease:number[];launches:number;contacts:number;damage:number;shieldBlocks:number;followUps:number;escapes:number;recoverySeconds:number;releases:Record<string,number>};
export type FightRound={round:number;duration:number;winner:number|null;spawnSides:string[];strategy:string;profileIds:string[];fighters:FighterMetrics[];evidence:ActionOutcome[];droppedEvidence:number;completed:boolean;trials:{attackId?:string;owner:number;key:string;at:number;contact:boolean;damage:number;block:boolean}[];holds:(number|null)[];controlled:boolean[];blockedRun:number[];lastIntent:string[];follow:({attackId?:string;at:number;moved:boolean;opening:boolean}|null)[];recovering:boolean[]};
export type FightRecording={schema:number;release:string;commit:string|null;config:CombatConfig;strategy:string;active:boolean;target:number;abandoned:number;rounds:FightRound[];startingExperience:BotExperience[];finalExperience?:BotExperience[]};
const freshExperience=():BotExperience=>({schema:FIGHT_SCHEMA,strategy:BOT_STRATEGY_ID,rounds:0,cells:{}});
const copy=<T,>(v:T):T=>JSON.parse(JSON.stringify(v));
export function validateExperience(raw:unknown):BotExperience[]{
 if(!Array.isArray(raw)||raw.length!==2)throw Error("PROFILE_VERSION_MISMATCH");
 return raw.map(p=>{if(!p||p.schema!==FIGHT_SCHEMA||p.strategy!==BOT_STRATEGY_ID||typeof p.cells!=="object"||!p.cells)throw Error("PROFILE_VERSION_MISMATCH");const out=freshExperience();out.rounds=clamp(Math.floor(Number(p.rounds)||0),0,10000);
 for(const [key,v]of Object.entries(p.cells).slice(0,96)){if(!/^(open|blocked|incoming)\/(sedan|cabinet|jersey|matter)\/(near|mid|far)\/(left|right)\/(charging|guarding|moving)\/(drop|slide|launch|explicit)$/.test(key))continue;const e=v as any,number=(x:unknown)=>clamp(Number(x)||0,0,10000);out.cells[key]={trials:number(e?.trials),contacts:number(e?.contacts),damage:number(e?.damage),blocks:number(e?.blocks)};}return out;});
}
function profileId(p:BotExperience){let h=2166136261;for(const ch of JSON.stringify(p)){h=Math.imul(h^ch.charCodeAt(0),16777619);}return BOT_STRATEGY_ID+"-"+(h>>>0).toString(16);}
function ensureExperience(s:GameState){return s.botExperience??=(s.players.map(()=>freshExperience()));}
function newMetrics():FighterMetrics{return{playerDamage:0,coverDamage:0,playerHits:0,coverHits:0,blocks:0,confirmedFollowUps:0,intentions:{},actions:{},rejections:{},batterySpent:0,chargingSeconds:0,blockedHoldSeconds:0,heldSeconds:0,longestBlockedHold:0,acquisitionToControl:[],acquisitionToRelease:[],launches:0,contacts:0,damage:0,shieldBlocks:0,followUps:0,escapes:0,recoverySeconds:0,releases:{}};}
function ensureFightRound(s:GameState){if(s.mode!=="watch"&&s.mode!=="practice")return;const profiles=ensureExperience(s);return s.botRound??={round:s.round,duration:0,winner:null,spawnSides:s.players.map(p=>p.x<500?"left":"right"),strategy:s.botStrategy||"baseline",profileIds:profiles.map(profileId),fighters:s.players.map(newMetrics),evidence:[],droppedEvidence:0,completed:false,trials:[],holds:s.players.map(()=>null),controlled:s.players.map(()=>false),blockedRun:s.players.map(()=>0),lastIntent:s.players.map(()=>""),follow:s.players.map(()=>null),recovering:s.players.map(()=>false)};}
function fightContext(s:GameState,n:number,objectId?:string){const p=s.players[n],t=s.players[1-n],held=s.covers.find(c=>c.id===(objectId||p.gripCoverId)),range=t?dist(p,t):0;const objectClass=held?.artId?.includes("sedan")?"sedan":held?.artId?.includes("cabinet")?"cabinet":held?"jersey":"matter",distanceBand=range<180?"near":range<330?"mid":"far",incoming=s.shots.some(sh=>sh.owner!==n&&dist(sh,p)<125),context=incoming?"incoming":t&&s.covers.some(c=>c.hp>0&&segmentCover(p,t,c))?"blocked":"open",opponentBehavior=t?.charging?"charging":t?.shield?"guarding":"moving",spawnSide=s.botRound?.spawnSides[n]||(p.x<500?"left":"right");return{context,objectClass,distanceBand,spawnSide,opponentBehavior};}
function contextKey(e:ReturnType<typeof fightContext>,style:string){return[e.context,e.objectClass,e.distanceBand,e.spawnSide,e.opponentBehavior,style].join("/");}
function recordFightAction(s:GameState,e:ActionOutcome){const r=ensureFightRound(s);if(!r||e.owner<0||e.owner>=r.fighters.length||r.completed)return;Object.assign(e,fightContext(s,e.owner,e.objectId));const f=r.fighters[e.owner],key=e.action+":"+e.status;f.actions[key]=(f.actions[key]||0)+1;
 if(e.status==="rejected"){const reason=e.reason||"unspecified";if(Object.keys(f.rejections).length<32||reason in f.rejections)f.rejections[reason]=(f.rejections[reason]||0)+1;}
 if(e.status==="activated"&&e.action==="grip"){r.holds[e.owner]=e.at;r.controlled[e.owner]=false;}
 if(e.status==="activated"&&(e.action==="throw"||e.action==="place")){const kind=e.reason?.startsWith("gesture ")?e.reason.slice(8):"explicit";f.releases[kind]=(f.releases[kind]||0)+1;if(e.action==="throw"){f.launches++;r.follow[e.owner]={attackId:e.attackId,at:e.at,moved:false,opening:false};}const began=r.holds[e.owner];if(began!==null&&f.acquisitionToRelease.length<64)f.acquisitionToRelease.push(Math.max(0,e.at-began));r.holds[e.owner]=null;
  if(r.trials.length<96)r.trials.push({attackId:e.attackId,owner:e.owner,key:contextKey(fightContext(s,e.owner,e.objectId),kind),at:e.at,contact:false,damage:0,block:false});}
 if(e.status==="contact"){f.contacts++;f.damage+=e.amount||0;if(e.reason==="shield")f.shieldBlocks++;if(e.reason==="hit"){f.playerHits++;f.playerDamage+=e.amount||0;}else if(e.reason==="cover"){f.coverHits++;f.coverDamage+=e.amount||0;}else if(e.reason==="shield")f.blocks++;const trial=e.attackId?r.trials.find(t=>t.attackId===e.attackId):undefined;if(trial&&e.action.includes("throw")){trial.contact||=e.reason==="hit"||e.reason==="shield";if(e.reason==="hit")trial.damage+=e.amount||0;trial.block||=e.reason==="shield";}const follow=r.follow[e.owner];if(follow&&e.attackId===follow.attackId&&e.action.includes("throw")&&(e.reason==="hit"||e.reason==="cover")&&(e.amount||0)>0)follow.opening=true;if(follow&&follow.moved&&e.at-follow.at<2&&(e.action==="shotgun"||e.action==="melee")&&e.reason==="hit"){f.followUps++;if(follow.opening)f.confirmedFollowUps++;r.follow[e.owner]=null;}}
 if(e.action==="grip"&&e.status==="cancelled"){r.holds[e.owner]=null;r.controlled[e.owner]=false;}
 if(e.action==="movement"&&e.status==="activated"&&r.follow[e.owner])r.follow[e.owner]!.moved=true;
 if(e.action==="reaction"&&e.status==="recovered")r.recovering[e.owner]=true;
 // First320 events retained per round; aggregates continue. Bounds apply whether recording or not.
 if(r.evidence.length>=320){r.evidence.splice(160,1);r.droppedEvidence++;}r.evidence.push(e);
}
function measureFightStep(s:GameState,before:Player[],dt:number){const r=ensureFightRound(s);if(!r||r.completed)return;r.duration+=dt;
 s.players.forEach((p,n)=>{const f=r.fighters[n],old=before[n],held=s.covers.find(c=>c.id===p.gripCoverId)||s.matter.find(m=>m.id===p.gripId);f.batterySpent+=Math.max(0,old.battery-p.battery);if(p.charging)f.chargingSeconds+=dt;if(p.knock>0)f.recoverySeconds+=dt;
 if(p.botIntent&&p.botIntent!==r.lastIntent[n]){r.lastIntent[n]=p.botIntent;if(Object.keys(f.intentions).length<48||p.botIntent in f.intentions)f.intentions[p.botIntent]=(f.intentions[p.botIntent]||0)+1;}
 const obstructed=!!held&&"carryBlockedAt" in held&&s.time-(held.carryBlockedAt??-9)<.04;
 if(held){f.heldSeconds+=dt;if(obstructed){f.blockedHoldSeconds+=dt;r.blockedRun[n]+=dt;f.longestBlockedHold=Math.max(f.longestBlockedHold,r.blockedRun[n]);}else r.blockedRun[n]=0;
 if(!r.controlled[n]&&Math.hypot(held.vx||0,held.vy||0)>20&&r.holds[n]!==null){r.controlled[n]=true;if(f.acquisitionToControl.length<64)f.acquisitionToControl.push(Math.max(0,s.time-r.holds[n]!));}}
 else r.blockedRun[n]=0;
 if(r.recovering[n]&&Math.hypot(p.x-old.x,p.y-old.y)>1){f.escapes++;r.recovering[n]=false;}
 });
}
function finishFightRound(s:GameState){const r=ensureFightRound(s);if(!r||r.completed)return;r.completed=true;r.winner=s.winner;const profiles=ensureExperience(s);
 // Update evidence only after a completed round. Rejected requests never become failed tactical trials.
 profiles.forEach((p,n)=>{p.rounds=Math.min(10000,p.rounds+1);for(const t of r.trials.filter(t=>t.owner===n)){if(!(t.key in p.cells)&&Object.keys(p.cells).length>=96)continue;const e=p.cells[t.key]??={trials:0,contacts:0,damage:0,blocks:0};e.trials=Math.min(10000,e.trials+1);e.contacts=Math.min(10000,e.contacts+Number(t.contact));e.damage=Math.min(10000,e.damage+t.damage);e.blocks=Math.min(10000,e.blocks+Number(t.block));}});
 const recording=s.fightRecording;if(recording?.active){recording.rounds.push(copy(r));if(recording.rounds.length>=recording.target){recording.active=false;recording.finalExperience=copy(profiles);}}
}
function preferredGripStyle(s:GameState,n:number,base:number){const p=ensureExperience(s)[n],ctx=fightContext(s,n),choices=["drop","slide","launch"],cells=choices.map(style=>p.cells[contextKey(ctx,style)]),score=(e:ExperienceCell|undefined)=>e&&e.trials>=4?(e.contacts+e.blocks*.25)/e.trials+Math.min(.2,e.damage/Math.max(1,e.trials)/500):0;
 // Only one in ten acquisitions may use the stronger observed preference; no rules or costs change.
 const count=s.botRound?.fighters[n]?.actions["grip:activated"]||0;if((s.round*7+n*3+count)%10!==0)return base;let best=base;for(let i=0;i<3;i++)if(score(cells[i])>score(cells[best])+.1)best=i;return best;
}
export function fightMemorySummary(s:GameState){if(s.mode!=="watch"&&s.mode!=="practice")return undefined;return{schema:FIGHT_SCHEMA,strategy:BOT_STRATEGY_ID,mode:s.botStrategy||"baseline",experienceRounds:(s.botExperience||[]).map(p=>p.rounds),recording:!!s.fightRecording?.active,completed:s.fightRecording?.rounds.length||0,target:10,reportReady:s.fightRecording?.rounds.length===10,abandoned:s.fightRecording?.abandoned||0};}
export function fightMemoryControl(s:GameState,operation:string,profiles?:unknown,commit:string|null=null){if(s.mode!=="watch")throw Error("WATCH_ONLY");
 if(operation==="record"){if(s.fightRecording?.active)throw Error("RECORDING_ACTIVE");respawn(s);s.fightRecording={schema:FIGHT_SCHEMA,release:"Combat Flow & Melee38",commit,config:copy(s.config),strategy:BOT_STRATEGY_ID,active:true,target:10,abandoned:0,rounds:[],startingExperience:copy(ensureExperience(s))};return;}
 if(s.fightRecording?.active)throw Error("FINISH_RECORDING_FIRST");
 if(operation==="baseline")s.botStrategy="baseline";else if(operation==="adaptive"){if(profiles!==undefined)s.botExperience=validateExperience(profiles);s.botStrategy="adaptive";}else if(operation==="reset"){s.botExperience=s.players.map(freshExperience);s.botStrategy="baseline";}else throw Error("UNKNOWN_MEMORY_CONTROL");respawn(s);
}
export function fightReport(s:GameState){const r=s.fightRecording;if(!r||r.rounds.length!==10)throw Error("TEN_ROUNDS_REQUIRED");const failurePatterns:string[]=[];const spawnComparison:Record<string,{rounds:number;wins:number;launches:number;followUps:number;blockedSeconds:number}>={};
 for(const round of r.rounds)round.fighters.forEach((f,n)=>{const side=round.spawnSides[n],row=spawnComparison[side]??={rounds:0,wins:0,launches:0,followUps:0,blockedSeconds:0};row.rounds++;row.wins+=Number(round.winner===n);row.launches+=f.launches;row.followUps+=f.followUps;row.blockedSeconds+=f.blockedHoldSeconds;if(f.longestBlockedHold>1&&!failurePatterns.includes("Held objects blocked for over one second"))failurePatterns.push("Held objects blocked for over one second");if(f.launches>3&&!f.followUps&&!failurePatterns.includes("Launches without confirmed movement-to-hit follow-ups"))failurePatterns.push("Launches without confirmed movement-to-hit follow-ups");if(f.chargingSeconds>round.duration*.3&&!failurePatterns.includes("Recharge exceeds30% of an exchange"))failurePatterns.push("Recharge exceeds30% of an exchange");});
 return{...copy(r),active:false,scope:"This browser; server room is temporary. No cloud or cross-device memory.",units:{duration:"active simulation seconds; paused/countdown time excluded",energy:"observed battery loss",evidenceTime:"simulation seconds within round",wallAt:"server milliseconds"},adaptation:"Experimental bounded strategy preferences; baseline has no learned adjustments",spawnComparison,failurePatterns};
}
export function fightMemoryData(s:GameState){return{profiles:copy(ensureExperience(s)),...s.fightRecording?.rounds.length===10?{report:fightReport(s)}:{}};}

const empty=():InputState=>({x:0,y:0,aim:0,fire:false,shield:false,coverAim:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,powerup:false,slow:false});
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v)),wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a)),dist=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y),uid=()=>crypto.randomUUID().slice(0,8);
const A={left:70,right:930,top:90,bottom:550};
function player(x:number,y:number,aim:number,name:string,token:string,bot=false,hp=100):Player{return{shells:8,maxShells:8,reserveShells:24,weaponState:"READY",x,y,vx:0,vy:0,aim,hp,battery:100,charging:false,chargeMotion:1,chargeAge:0,godCharge:0,godTime:0,godDuration:0,powerFlash:0,powerReturn:0,powerReleaseAge:0,powerReleaseCharge:0,godFade:0,godFadeStrength:0,powerBlocked:false,lastEnergyAt:-9,dash:0,brake:0,slideSteerCurrent:0,lastSlideTap:-9,slide:0,slideFacing:aim,slideCool:0,kickStage:"none",kickTime:0,kickAngle:aim,kickNx:0,kickNy:0,coverId:null,coverMode:null,coverAnchor:null,coverLock:0,coverSpeed:0,softImpact:0,softImpactAt:-9,peek:false,peekEdge:false,contact:0,exit:null,shield:false,gripId:null,gripCoverId:null,coverGripAngle:aim,coverGripDist:92,orbitIds:[],knock:0,pinball:0,lastShot:-9,fireBlocked:false,fireState:0,recoil:0,returnToCover:0,boostState:0,brakeState:0,gunFacing:aim,lastMelee:-9,score:0,rematch:false,input:empty(),processedInput:empty(),lastSeq:-1,name,token,bot}}
export function newGame(name:string,token:string,now=Date.now(),mode:"bot"|"solo"|"duel"|"practice"|"watch"="solo"):GameState{
 const config={...DEFAULT_CONFIG};
 const players=[player(230,330,0,name,token,false,config.maxHealth)];
 if(mode==="bot"||mode==="practice"||mode==="watch")players.push(player(770,330,Math.PI,"RIFT HUNTER","",true,config.maxHealth));
 if(mode==="watch"){players[0].bot=true;players[0].name="CYAN BOT";players[1].name="MAGENTA BOT";}
 // Eight finite recipes in mirrored salvage clusters; no passive material spawning.
 const matter:Matter[]=[];for(let side=0;side<2;side++)for(const [station,[x,y]] of [[170,460],[240,400],[370,470],[400,150]].entries())for(let j=0;j<3;j++)matter.push({id:`salvage-${side}-${station}-${j}`,x:side?1000-x-j*18:x+j*18,y,vx:0,vy:0,r:5+j%2,kind:j===2?"metal":"stone",heldBy:null,orbitBy:null,life:999,sourceArt:j===2?"maintenance-cabinet":"damaged-jersey",fragment:j});
 const covers:Cover[]=bayCoverState();
 return{build:"COMBAT-MASTER-STUDIO-47",groundSources44:groundSources44(),mode,phase:mode==="solo"?"playing":mode==="duel"?"lobby":"countdown",round:1,winner:null,countdown:3,finisher:0,events:[],eventSeq:0,actions:[],actionCounts:{},energySpent:[],actionSeq:0,timeScale:1,fightUntil:0,createdAt:now,lastAt:now,time:0,config,players,covers,matter,shots:[],fx:[]}
}
export function updateConfig(s:GameState,patch:Partial<CombatConfig>){s.config={...s.config,...patch};for(const p of s.players)p.hp=Math.min(p.hp,s.config.maxHealth)}
export function joinGame(s:GameState,name:string,token:string){if(s.mode==="watch")throw Error("Spectator session is not joinable");if(s.mode==="practice")throw Error("Practice is not joinable");if(s.mode==="solo")throw Error("Solo session is not joinable");const b=s.players.findIndex(p=>p.bot);if(b>=0){s.players[b]={...s.players[b],name,token,bot:false,lastSeq:-1,input:empty(),processedInput:empty()};return}if(s.players.length>1)throw Error("Room is full");s.players.push(player(770,330,Math.PI,name,token,false,s.config.maxHealth))}
function respawn(s:GameState){if(s.fightRecording?.active&&s.phase!=="finished")s.fightRecording.abandoned++;const cfg={...s.config},ids=s.players.map(p=>({name:p.name,token:p.token,bot:p.bot,score:p.score})),fresh=newGame(ids[0].name,ids[0].token,s.lastAt,s.mode);fresh.config=cfg;fresh.players[0].hp=cfg.maxHealth;if(ids[1])fresh.players[1]=player(770,330,Math.PI,ids[1].name,ids[1].token,ids[1].bot,cfg.maxHealth);fresh.players.forEach((p,i)=>p.score=ids[i]?.score||0);fresh.round=s.round+1;fresh.createdAt=s.createdAt;fresh.botRound=undefined;fresh.watchNextAt=undefined;fresh.botStrategy=s.botStrategy;fresh.botExperience=s.botExperience;fresh.fightRecording=s.fightRecording;if(fresh.fightRecording?.active&&fresh.fightRecording.rounds.length%2===1){[fresh.players[0].x,fresh.players[1].x]=[fresh.players[1].x,fresh.players[0].x];fresh.players.forEach((p,i)=>p.aim=p.gunFacing=i?0:Math.PI);}fresh.phase=s.mode==="solo"?"playing":"countdown";Object.assign(s,fresh)}
export function setInput(s:GameState,slot:number,seq:number,input:Partial<InputState>){const p=s.players[slot];if(!p||s.mode==="watch"||seq<=p.lastSeq)return;p.lastSeq=seq;p.gripCancelRelease=false;let x=clamp(Number(input.x)||0,-1,1),y=clamp(Number(input.y)||0,-1,1),m=Math.hypot(x,y);if(m>1){x/=m;y/=m}let gripAxes:Partial<InputState>={};if(Number.isFinite(input.gripX)&&Number.isFinite(input.gripY)){let gx=clamp(input.gripX!,-1,1),gy=clamp(input.gripY!,-1,1),gm=Math.hypot(gx,gy);if(gm>1){gx/=gm;gy/=gm;}gripAxes={gripX:gx,gripY:gy};}p.input={...empty(),...input,gripX:undefined,gripY:undefined,...gripAxes,x,y,aim:Number.isFinite(input.aim)?wrap(input.aim as number):p.aim}}

function localPoint(c:Cover,x:number,y:number){const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),dx=x-c.x,dy=y-c.y;return{x:dx*ca+dy*sa,y:-dx*sa+dy*ca}}
function worldPoint(c:Cover,x:number,y:number){const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0);return{x:c.x+x*ca-y*sa,y:c.y+x*sa+y*ca}}
function coverFace(c:Cover,p:Player|{x:number;y:number;r?:number}):CoverAnchor&{gap:number}{
 const q=localPoint(c,p.x,p.y),hw=c.w/2,hh=c.h/2,px=clamp(q.x,-hw,hw),py=clamp(q.y,-hh,hh);
 let face:"left"|"right"|"top"|"bottom";
 if(Math.abs(q.x)>hw&&Math.abs(q.y)>hh)face=Math.abs(q.x)-hw>Math.abs(q.y)-hh?(q.x<0?"left":"right"):(q.y<0?"top":"bottom");
 else if(Math.abs(q.x)>hw)face=q.x<0?"left":"right";else if(Math.abs(q.y)>hh)face=q.y<0?"top":"bottom";
 else{const ds=[q.x+hw,hw-q.x,q.y+hh,hh-q.y];face=(["left","right","top","bottom"] as const)[ds.indexOf(Math.min(...ds))]}
 const edge=face==="top"?0:face==="right"?1:face==="bottom"?2:3;
 const length=edge%2===0?c.w:c.h;
 const t=edge===0?clamp(q.x+hw,0,c.w):edge===1?clamp(q.y+hh,0,c.h):edge===2?clamp(hw-q.x,0,c.w):clamp(hh-q.y,0,c.h);
 const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0);
 const localTangents=[[1,0],[0,1],[-1,0],[0,-1]],localNormals=[[0,-1],[1,0],[0,1],[-1,0]];
 const [ltx,lty]=localTangents[edge],[lnx,lny]=localNormals[edge];
 const tx=ltx*ca-lty*sa,ty=ltx*sa+lty*ca,nx=lnx*ca-lny*sa,ny=lnx*sa+lny*ca;
 const offset=edge===0?t-hw:edge===1?t-hh:edge===2?hw-t:hh-t;
 return{face,edge,t,length,offset,half:length/2,nx,ny,tx,ty,gap:Math.hypot(q.x-px,q.y-py)-(("r" in p&&typeof p.r==="number")?p.r:18)};
}
function anchorForEdge(c:Cover,edge:number,t:number):CoverAnchor{
 const hw=c.w/2,hh=c.h/2,length=edge%2===0?c.w:c.h,tt=clamp(t,0,length),face=(["top","right","bottom","left"] as const)[edge];
 const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),localTangents=[[1,0],[0,1],[-1,0],[0,-1]],localNormals=[[0,-1],[1,0],[0,1],[-1,0]];
 const [ltx,lty]=localTangents[edge],[lnx,lny]=localNormals[edge],tx=ltx*ca-lty*sa,ty=ltx*sa+lty*ca,nx=lnx*ca-lny*sa,ny=lnx*sa+lny*ca;
 const offset=edge===0?tt-hw:edge===1?tt-hh:edge===2?hw-tt:hh-tt;
 return{face,edge,t:tt,length,offset,half:length/2,nx,ny,tx,ty};
}
function placeOnCover(p:Player,s:GameState){
 const c=s.covers.find(x=>x.id===p.coverId),a=p.coverAnchor;if(!c||!a)return;
 const r=18.5,hw=c.w/2,hh=c.h/2;let lx=0,ly=0;
 if(a.edge===0){lx=-hw+a.t;ly=-hh-r}
 else if(a.edge===1){lx=hw+r;ly=-hh+a.t}
 else if(a.edge===2){lx=hw-a.t;ly=hh+r}
 else{lx=-hw-r;ly=hh-a.t}
 const q=worldPoint(c,lx,ly);p.x=q.x;p.y=q.y;
}
function attachCover(p:Player,c:Cover,s:GameState,mode:"soft"|"braced"="soft"){if(s.time<p.coverLock)return false;const anchor=coverFace(c,p),meta=bayObject(c.artId||c.id),rail=meta?.rig?.coverRails?.find(r=>({FRONT:"bottom",BACK:"top",LEFT:"left",RIGHT:"right"} as const)[r.side]===anchor.face),railT=anchor.length?anchor.t/anchor.length:.5;if(meta&&(!rail||railT<rail.from||railT>rail.to))return false;const incoming=Math.abs(p.vx*anchor.nx+p.vy*anchor.ny),impact=clamp(incoming/Math.max(1,s.config.slideSpeed),0,1);p.coverId=c.id;p.coverMode=mode;p.coverAnchor=anchor;p.slide=0;p.dash=0;p.softImpact=mode==="soft"?impact:0;p.softImpactAt=s.time;p.vx=p.vy=0;p.coverSpeed=0;p.contact=s.time+.22;p.peek=false;placeOnCover(p,s);s.fx.push({id:uid(),type:mode==="soft"?"soft-cover":"cover-slam",x:p.x,y:p.y,life:.25,entrySpeed:incoming} as any);return true}
function releaseCover(p:Player,s:GameState,lock=.18){p.coverId=null;p.coverMode=null;p.coverAnchor=null;p.coverSpeed=0;p.peek=false;p.peekEdge=false;p.coverLock=s.time+lock}
function moveOnCover(p:Player,s:GameState,i:InputState,dt:number){
 const a=p.coverAnchor;if(!a||!p.coverId)return;const c=s.config,moveSpeed=c.moveSpeed*(p.chargeMotion??1),mag=Math.hypot(i.x,i.y),away=i.x*a.nx+i.y*a.ny;
 // Intent is measured against the cover normal, never gun aim. Deliberate
 // outward movement works in both modes, including while LT is planted.
 if(mag>.3&&away/mag>COVER_41.releaseIntent){releaseCover(p,s,.08);p.vx=i.x*moveSpeed;p.vy=i.y*moveSpeed;p.x=clamp(p.x+p.vx*dt,A.left,A.right);p.y=clamp(p.y+p.vy*dt,A.top,A.bottom);collide(p,s);return}
 // PASS07 cover grammar: soft cover follows stick intent; A commits hard brace; LT only plants/exposes hard brace.
 if(p.coverMode==="braced"&&i.coverAim){
  // PASS05 DEFINITIVE COVER GRAMMAR: LT is planted combat exposure.
  // Authoritative cover root/anchor does not translate while held. Right-stick
  // aim remains independent and immediate; A/classic cover action still escapes.
  p.coverSpeed=0;p.vx=0;p.vy=0;
  const forward=Math.cos(p.gunFacing)*a.nx+Math.sin(p.gunFacing)*a.ny;
  p.peek=true;p.peekEdge=Math.min(a.t,a.length-a.t)<18;
  placeOnCover(p,s);return;
 }
 if(c.weaveEnabled<.5){
   const cv=s.covers.find(x=>x.id===p.coverId);if(!cv){releaseCover(p,s);return}
   let edge=a.edge,cur=anchorForEdge(cv,edge,a.t),along=i.x*cur.tx+i.y*cur.ty,t=cur.t,g=0;
   if(t<.5&&along<-.1)g=-1;else if(t>cur.length-.5&&along>.1)g=1;
   if(g){
     const ne=(edge+g+4)%4,next=anchorForEdge(cv,ne,g>0?0:(ne%2===0?cv.w:cv.h)),nextDot=i.x*next.tx+i.y*next.ty;
     if(nextDot*g>.42){edge=ne;cur=next;t=g>0?0:next.length;along=nextDot}
   }
   const step=moveSpeed*dt*.78;t=clamp(t+along*step,0,cur.length);p.coverAnchor=anchorForEdge(cv,edge,t);p.coverSpeed=along*moveSpeed*.78;p.vx=p.coverAnchor.tx*p.coverSpeed;p.vy=p.coverAnchor.ty*p.coverSpeed;placeOnCover(p,s);
   if(p.coverMode==="braced"&&i.coverAim){const forward=Math.cos(p.gunFacing)*p.coverAnchor.nx+Math.sin(p.gunFacing)*p.coverAnchor.ny;p.peek=true;p.peekEdge=Math.min(p.coverAnchor.t,p.coverAnchor.length-p.coverAnchor.t)<18}else{p.peek=false;p.peekEdge=Math.min(p.coverAnchor.t,p.coverAnchor.length-p.coverAnchor.t)<18}
   return;
 }
 const along=i.x*a.tx+i.y*a.ty;
 p.coverSpeed+=(along*moveSpeed-p.coverSpeed)*Math.min(1,dt*c.response);if(Math.abs(along)<.001)p.coverSpeed*=Math.pow(c.stopDrag,dt);
 const before=a.t,raw=a.t+along*moveSpeed*dt;a.t=clamp(raw,0,a.length);
 if(p.coverMode==="soft"&&Math.abs(raw-a.t)>.1&&Math.abs(along)>.2){
   const cv=s.covers.find(x=>x.id===p.coverId);if(cv){const g=raw<0?-1:1,ne=(a.edge+g+4)%4,next=anchorForEdge(cv,ne,g>0?0:(ne%2===0?cv.w:cv.h)),nextDot=i.x*next.tx+i.y*next.ty;if(nextDot*g>.3)p.coverAnchor=next}
 }else if(a.t===before)p.coverSpeed=0;
 placeOnCover(p,s);
 if(p.coverMode==="braced"&&i.coverAim){const forward=Math.cos(p.gunFacing)*p.coverAnchor!.nx+Math.sin(p.gunFacing)*p.coverAnchor!.ny;p.peek=true;p.peekEdge=Math.min(p.coverAnchor!.t,p.coverAnchor!.length-p.coverAnchor!.t)<18}else{p.peek=false;p.peekEdge=Math.min(p.coverAnchor!.t,p.coverAnchor!.length-p.coverAnchor!.t)<18}
}
function classicCoverAction(p:Player,s:GameState,i:InputState){
 const a=p.coverAnchor,cv=s.covers.find(x=>x.id===p.coverId);if(!a||!cv)return false;
 const mag=Math.hypot(i.x,i.y),ax=mag>.18?i.x/mag:a.nx,ay=mag>.18?i.y/mag:a.ny,normal=ax*a.nx+ay*a.ny,tan=Math.abs(ax*a.tx+ay*a.ty);
 const kind=normal>.15?"outward":tan>.55&&normal>=-.05?"past":"blocked";
 if(kind==="blocked"){s.fx.push({id:uid(),type:"cover-block",x:p.x,y:p.y,life:.18});return false}
 // Every valid escape has a free base; charge funds only the bounded boost.
 const cost=Math.min(Math.max(0,p.battery),Math.max(0,s.config.slideEnergy)),scale=.55+.45*(s.config.slideEnergy>0?cost/s.config.slideEnergy:1);
 p.battery=Math.max(0,p.battery-cost);if(cost>0)p.lastEnergyAt=s.time;p.kickScale=scale;
 releaseCover(p,s,.25);p.coverLock=s.time+.25;p.slideSteerCurrent=0;
 if(kind==="past"){
   const sign=ax*a.tx+ay*a.ty<0?-1:1;p.kickAngle=Math.atan2(ay,ax);p.kickNx=a.nx;p.kickNy=a.ny;p.kickStage="burst";p.kickTime=.13;p.vx=Math.cos(p.kickAngle)*408*scale;p.vy=Math.sin(p.kickAngle)*408*scale;p.slideFacing=p.kickAngle;p.slideCool=.94;p.exit=null;s.fx.push({id:uid(),type:"dash",x:p.x,y:p.y,life:.22,text:"BURST"});return true
 }
 const dx=ax,dy=ay,len=Math.hypot(dx,dy)||1;
 p.vx=dx/len*s.config.slideSpeed*scale;p.vy=dy/len*s.config.slideSpeed*scale;p.slideFacing=Math.atan2(p.vy,p.vx);p.slide=s.config.slideDuration;p.slideCool=s.config.slideDuration;s.fx.push({id:uid(),type:"slide",x:p.x,y:p.y,life:.4,text:"KICK"});return true
}
function beginCoverExit(p:Player,s:GameState,i:InputState){
 const a=p.coverAnchor,c=s.covers.find(x=>x.id===p.coverId);if(!a||!c)return false;
 const len=Math.hypot(i.x,i.y),ix=len>.18?i.x/len:a.nx,iy=len>.18?i.y/len:a.ny,out=ix*a.nx+iy*a.ny,tan=ix*a.tx+iy*a.ty;
 if(len<=.18||out>.18){releaseCover(p,s,.7);p.lastSlideTap=-9;p.slide=s.config.slideDuration;p.slideFacing=Math.atan2(iy,ix);p.vx=ix*s.config.slideSpeed;p.vy=iy*s.config.slideSpeed;return true}
 const end=Math.abs(tan)>.18?Math.sign(tan):(a.offset<0?-1:1),toEnd=a.half-end*a.offset;if(toEnd>56)return false;
 const reach=toEnd+21,first={x:p.x+a.tx*end*reach,y:p.y+a.ty*end*reach},points=[first];
 if(out<-.18){const depth=(a.face==="left"||a.face==="right")?c.w:c.h;points.push({x:first.x-a.nx*(depth+40),y:first.y-a.ny*(depth+40)})}
 const last=points[points.length-1];points.push({x:last.x+ix*70,y:last.y+iy*70});
 releaseCover(p,s,.8);p.exit={points,index:0,dx:ix,dy:iy,until:s.time+.6,travel:0,total:points.reduce((sum,q,j)=>j?sum+Math.hypot(q.x-points[j-1].x,q.y-points[j-1].y):sum,0),coverId:c.id};return true;
}
function stepCoverExit(p:Player,s:GameState,dt:number){
 const e=p.exit;if(!e)return false;if(s.time>=e.until){p.exit=null;return true}let rem=600*dt,ox=p.x,oy=p.y;
 while(rem>.01&&e.index<e.points.length){const q=e.points[e.index],dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);if(d<.01){e.index++;continue}const tr=Math.min(d,rem);p.x+=dx/d*tr;p.y+=dy/d*tr;e.travel+=tr;rem-=tr;if(tr>=d-.01)e.index++}
 p.vx=(p.x-ox)/dt;p.vy=(p.y-oy)/dt;if(e.index>=e.points.length)p.exit=null;return true;
}
function slideCapture(p:Player,s:GameState){
 if(p.coverId||(p.slide<=0&&p.dash<=0)||s.time<p.coverLock)return;
 for(const c of s.covers){if(c.hp<=0||s.players.some(q=>q.gripCoverId===c.id))continue;const a=coverFace(c,p);if(a.gap<=COVER_41.captureGap&&p.vx*a.nx+p.vy*a.ny<-40&&attachCover(p,c,s,"soft"))return;}
}
function circleBox(o:{x:number;y:number},r:number,c:Cover){const q=localPoint(c,o.x,o.y),nx=clamp(q.x,-c.w/2,c.w/2),ny=clamp(q.y,-c.h/2,c.h/2),dx=q.x-nx,dy=q.y-ny,d=Math.hypot(dx,dy),ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),lx=d?dx/d:(q.x<0?-1:1),ly=d?dy/d:0;return{hit:d<r,nx:lx*ca-ly*sa,ny:lx*sa+ly*ca,depth:r-d}}
function collide(p:Player,s:GameState){if(p.coverId||p.exit)return;for(const cv of s.covers){if(s.players.some(q=>q.gripCoverId===cv.id))continue;const q=circleBox(p,18,cv);if(!q.hit)continue;if(s.config.weaveEnabled<.5&&s.time>=p.coverLock){attachCover(p,cv,s,"soft");return}p.x+=q.nx*(q.depth+1);p.y+=q.ny*(q.depth+1)}}
// Reuse the same rotated footprints for carry/throw contact; no new cover geometry.
export const COVER_41={projectedHp:280,reinforcedHp:360,buildEnergy:30,captureGap:8,releaseIntent:.6} as const;
export function coverDamageStage(hp:number,maxHp:number){const ratio=hp/Math.max(1,maxHp);return hp<=0?4:ratio>.8?0:ratio>.55?1:ratio>.3?2:3;}
function damageCover(cv:Cover,s:GameState,damage:number){
 if(cv.protected45||cv.hp<=0||!Number.isFinite(damage)||damage<=0)return;
 const before=coverDamageStage(cv.hp,cv.maxHp);cv.hp=Math.max(0,cv.hp-damage);
 if(cv.hp>0){if(coverDamageStage(cv.hp,cv.maxHp)>before)s.fx.push({id:uid(),type:"cover-impact",x:cv.x,y:cv.y,life:.3,angle:cv.a,text:bayObject(cv.artId||cv.id)?.material==="CONCRETE"?"stone":"metal"});return;}
 const meta=bayObject(cv.artId||cv.id),kind=meta?.material==="CONCRETE"?"stone":"metal";
 for(const p of s.players){if(p.coverId===cv.id)releaseCover(p,s,.25);if(p.gripCoverId===cv.id)p.gripCoverId=null;if(p.exit?.coverId===cv.id)p.exit=null;}
 s.fx.push({id:uid(),type:"cover-break",x:cv.x,y:cv.y,life:.8,angle:cv.a,text:kind});
 const count=Math.min(cv.matterSources?cv.matterSources.length:combatFight(s)?3:18,Math.max(0,(s.groundSources44!==undefined?128:64)-s.matter.length));for(let n=0;n<count;n++){const a=n*2.399+cv.a,speed=50+n%5*24;s.matter.push({id:uid(),x:cv.x+Math.cos(a)*cv.w*.25,y:cv.y+Math.sin(a)*cv.h*.25,vx:Math.cos(a)*speed+(cv.vx||0)*.2,vy:Math.sin(a)*speed+(cv.vy||0)*.2,r:combatFight(s)?5+n%2:3+n%4,kind:cv.matterSources?.[n]?.kind||kind,heldBy:null,orbitBy:null,life:combatFight(s)?999:5,...combatFight(s)?{unitId:cv.matterSources?.[n]?.unitId,groundId:cv.matterSources?.[n]?.groundId,sourceArt:cv.matterSources?.[n]?.sourceArt||meta?.renderedShell,fragment:cv.matterSources?.[n]?.fragment??n,throwOwner:cv.throwOwner,attackId:cv.attackId,hitIds:[]}:{}});}
}
function coverImpact(cv:Cover,s:GameState,key:string,other?:Cover){
 if(!combatFight(s)||cv.hp<=0||cv.build>=0||Math.hypot(cv.vx||0,cv.vy||0)<160||cv.hitIds?.includes(key))return;
 (cv.hitIds??=[]).push(key);const damage=Math.min(100,Math.hypot(cv.vx||0,cv.vy||0)*(bayObject(cv.artId||cv.id)?.mass||9)/90);
 if(other){damageCover(other,s,damage);if(other.build<0)(other.hitIds??=[]).push(cv.id);}damageCover(cv,s,damage);combatEvent(s,{kind:"cover",source:"cover-throw",attackId:cv.attackId,owner:cv.throwOwner??-1,damage,x:cv.x,y:cv.y,z:12,material:other&&bayObject(other.artId||other.id)?.material!=="CONCRETE"?"metal":"stone"});s.fx.push({id:uid(),type:"cover-impact",x:cv.x,y:cv.y,life:.3});
}
function settleCover(cv:Cover,s:GameState){
 const ex=Math.abs(Math.cos(cv.a))*cv.w/2+Math.abs(Math.sin(cv.a))*cv.h/2,ey=Math.abs(Math.sin(cv.a))*cv.w/2+Math.abs(Math.cos(cv.a))*cv.h/2;
 const x=clamp(cv.x,A.left+ex,A.right-ex),y=clamp(cv.y,A.top+ey,A.bottom-ey);
 if(x!==cv.x||y!==cv.y)coverImpact(cv,s,"boundary");if(x!==cv.x)cv.vx=0;if(y!==cv.y)cv.vy=0;cv.x=x;cv.y=y;
 for(const other of s.covers){
  if(other.id===cv.id||other.hp<=0)continue;
  const axes=[[Math.cos(cv.a),Math.sin(cv.a)],[-Math.sin(cv.a),Math.cos(cv.a)],[Math.cos(other.a),Math.sin(other.a)],[-Math.sin(other.a),Math.cos(other.a)]];
  let depth=Infinity,nx=0,ny=0,overlap=true;
  for(const [ax,ay]of axes){
   const radius=(c:Cover)=>Math.abs(ax*Math.cos(c.a)+ay*Math.sin(c.a))*c.w/2+Math.abs(-ax*Math.sin(c.a)+ay*Math.cos(c.a))*c.h/2;
   const delta=(cv.x-other.x)*ax+(cv.y-other.y)*ay,penetration=radius(cv)+radius(other)-Math.abs(delta);
   if(penetration<=0){overlap=false;break}
   if(penetration<depth){depth=penetration;const sign=delta<0?-1:1;nx=ax*sign;ny=ay*sign}
  }
  if(overlap){coverImpact(cv,s,other.id,other);if(other.hp<=0&&cv.hp>0){cv.vx=(cv.vx||0)*.55;cv.vy=(cv.vy||0)*.55;continue;}cv.x+=nx*(depth+.1);cv.y+=ny*(depth+.1);const toward=(cv.vx||0)*nx+(cv.vy||0)*ny;if(toward<0){cv.vx=(cv.vx||0)-toward*nx;cv.vy=(cv.vy||0)-toward*ny}}
 }
 cv.x=clamp(cv.x,A.left+ex,A.right-ex);cv.y=clamp(cv.y,A.top+ey,A.bottom-ey);
}
function spendEnergy(p:Player,s:GameState,cost:number){if(p.battery<cost){s.fx.push({id:uid(),type:"low-energy",x:p.x,y:p.y,life:.3,text:"LOW CHARGE"});p.gripHint="LOW BATTERY · HOLD Y";p.gripHintUntil=s.time+1.5;return false}p.battery=Math.max(0,p.battery-cost);p.lastEnergyAt=s.time;return true}
// Charge is vulnerable; timers use real time, never slow-time simulation time.
function powerStep(p:Player,s:GameState,dt:number){
 const i=p.input,c=s.config;
 p.powerFlash=Math.max(0,p.powerFlash-dt);if(p.powerFlash<=0)p.powerReturn=Math.max(0,p.powerReturn-dt);p.godFade=Math.max(0,p.godFade-dt);
 if(!i.powerup)p.powerBlocked=false;
 // Fresh Y can refill mid-window; a held Y still cannot restart at expiry.
 const refill=i.powerup&&!p.processedInput.powerup&&!p.powerBlocked&&p.godTime>dt&&p.battery>c.godDrain*dt;
 if(p.godTime>0&&i.powerup&&!refill)p.powerBlocked=true;
 if(p.godTime>0){const glow=.6*Math.min(1,p.godTime/Math.max(.01,p.godDuration||12));p.godTime=Math.max(0,p.godTime-dt);p.battery=Math.max(0,p.battery-c.godDrain*dt);p.lastEnergyAt=s.time;if(!p.godTime||p.battery<=0){p.godTime=0;p.godFade=.45;p.godFadeStrength=glow}}
 if((p.powerFlash>0||p.powerReturn>0)&&(i.fire||i.slide||i.grip||i.melee||i.cover||i.shield||i.coverAim||p.knock>0)){p.powerFlash=0;p.powerReturn=0}
 const interrupted=!!(i.powerUse||i.fire||i.slide||i.melee||i.heavy||i.grip||i.cover||i.shield||i.coverAim||i.slow||i.pinball||p.knock>0||p.slide>0||p.dash>0||p.exit||p.kickStage!=="none");
 if(p.charging&&(!i.powerup||interrupted)){
  if(!interrupted&&p.godCharge>=.35&&p.battery>0){p.godDuration=c.godDuration*p.godCharge;p.godTime=p.godDuration;p.powerFlash=.65;s.fx.push({id:uid(),type:"god-awaken",x:p.x,y:p.y,life:.5,text:"GOD FRAME"})}
  if(!p.blastCharge)p.blastChargeProgress=0;p.powerReleaseAge=p.chargeAge;p.powerReleaseCharge=p.godCharge;p.charging=false;p.powerReturn=interrupted?0:.24;p.chargeAge=0;p.godCharge=0;if(interrupted){p.powerBlocked=true;p.powerFlash=0;}
 }
 if(i.powerup&&!p.charging&&!p.powerBlocked&&(!p.godTime||refill)&&!interrupted){const remaining=p.battery<99.999?clamp(p.battery/100,0,1):0;p.godTime=0;p.powerFlash=0;p.charging=true;p.chargeAge=remaining>.001?.35+remaining*c.powerChargeSeconds:0;p.godCharge=remaining;p.powerReturn=0}
 if(p.charging){if((p.blastCharge||0)<1){p.blastChargeProgress=Math.min(1,(p.blastChargeProgress||0)+dt/GLOVE_BLAST_38.manufactureSeconds);if(p.blastChargeProgress>=1){p.blastCharge=1;}}p.chargeAge+=dt;p.godCharge=clamp((p.chargeAge-.35)/Math.max(.1,c.powerChargeSeconds),0,1);p.battery=Math.min(100,p.battery+c.powerRecharge*dt);p.lastEnergyAt=s.time;if(p.coverId)p.peek=false}
 const target=p.charging?clamp(c.chargeMoveScale??.67145,.35,.85):1;
 p.chargeMotion=(p.chargeMotion??1)+(target-(p.chargeMotion??1))*(1-Math.exp(-clamp(c.chargeMoveResponse??8,3,16)*dt));
}
// A rejected slide consumes only its own action, not grip/drop or build edges.
function mobilityScale(p:Player,c:CombatConfig,cost:number,min=.34){
 const available=Math.max(0,Math.min(cost,p.battery)),ratio=cost>0?available/cost:1;
 if(available>0){p.battery=Math.max(0,p.battery-available)}
 return min+(1-min)*ratio;
}
function startDash(p:Player,s:GameState,a:number){
 const c=s.config,scale=mobilityScale(p,c,c.dashEnergy,.36);
 p.dash=c.dashDuration*(.72+.28*scale);p.boostState=p.dash+.08;p.slideSteerCurrent=0;p.slideFacing=a;
 const speed=c.dashSpeed*scale;p.vx=Math.cos(a)*speed;p.vy=Math.sin(a)*speed;
 p.lastEnergyAt=s.time;s.fx.push({id:uid(),type:"dash",x:p.x,y:p.y,life:.22,owner:s.players.indexOf(p),text:"ZIP!"});
}
function startClassicSlide(p:Player,s:GameState,a:number){
 const c=s.config,scale=mobilityScale(p,c,c.slideEnergy,.52);
 p.dash=0;p.slideSteerCurrent=0;p.slide=c.slideDuration*(.84+.16*scale);p.slideFacing=a;
 const launch=c.slideSpeed*scale;p.vx=Math.cos(a)*launch;p.vy=Math.sin(a)*launch;p.slideCool=c.slideDuration;
 p.lastEnergyAt=s.time;s.fx.push({id:uid(),type:"slide",x:p.x,y:p.y,life:.48,owner:s.players.indexOf(p),text:Math.floor(s.time)%2?"SKURT!":"SKEET"});
}
function slideAction(s:GameState,n:number,prev:InputState){const p=s.players[n],i=p.input,c=s.config;
 if(!(i.slide&&!prev.slide)||p.knock>0)return false;
 const mag=Math.hypot(i.x,i.y),a=mag>.1?Math.atan2(i.y,i.x):p.gunFacing;
 const doubleTap=(s.time-p.lastSlideTap)<=c.doubleTapWindow;p.lastSlideTap=s.time;

 // Own the soft-cover A edge here, before mobility can release its anchor.
 if(p.coverId&&p.coverMode==="soft"){
   const anchor=p.coverAnchor,out=anchor&&mag>.18?(i.x*anchor.nx+i.y*anchor.ny)/mag:0;
   if(anchor&&out<=.15){p.coverMode="braced";p.vx=p.vy=p.coverSpeed=0;s.fx.push({id:uid(),type:"brace",x:p.x,y:p.y,life:.2,owner:n});return true}
   releaseCover(p,s,.055);startDash(p,s,a);return true;
 }
 // Hard brace / planted cover keeps deliberate commitment, but A is still immediate escape.
 if(p.coverId&&p.coverMode==="braced"){
   releaseCover(p,s,.085);startDash(p,s,a);return true;
 }
 if(p.exit)return false;
 if(doubleTap){
   startClassicSlide(p,s,a);return true;
 }
 startDash(p,s,a);return true;
}
export const MELEE_38=[
 {name:"PUNCH",startup:.08,active:.07,recovery:.14,range:62,damage:18,push:35},
 {name:"DRIVING KICK",startup:.10,active:.08,recovery:.17,range:70,damage:20,push:45},
 {name:"UPPERCUT",startup:.12,active:.08,recovery:.18,range:62,damage:24,push:50},
 {name:"TURNING KICK",startup:.14,active:.09,recovery:.23,range:76,damage:28,push:95},
] as const;
export const GLOVE_BLAST_38={damage:38,speed:650,lifetime:.7,manufactureSeconds:1.2,window:.65};
export type MeleeCombo={stage:number;started:number;angle:number;attackId:string;tested:boolean;queued:boolean;gloveCharge?:number};
function meleeStart(s:GameState,n:number,stage:number){const p=s.players[n];p.meleeCombo={stage,started:s.time,angle:p.aim,attackId:uid(),tested:false,queued:false};p.lastMelee=s.time;p.pendingFireUntil=undefined;p.meleeNextStage=undefined;actionOutcome(s,n,"melee","activated",MELEE_38[stage].name,undefined,undefined,p.meleeCombo.attackId);}
function meleeInput(s:GameState,n:number,prev:InputState){const p=s.players[n],i=p.input;
 if(i.fire&&!prev.fire&&!i.grip&&!i.throwMatter&&!p.gripCoverId&&!p.gripId&&!p.orbitIds.length&&(p.blastUntil||0)>s.time&&(p.blastCharge||0)>0&&!p.charging&&p.knock<=0&&!p.shield){
  const attackId=uid(),a=p.aim;p.blastCharge=0;p.blastChargeProgress=0;p.blastUntil=0;p.blastPoseAt=s.time;p.meleeCombo=undefined;p.meleeNextStage=undefined;p.fireBlocked=true;p.pendingFireUntil=undefined;
  s.shots.push({id:uid(),attackId,source:"glove-blast",owner:n,x:p.x+Math.cos(a)*26,y:p.y+Math.sin(a)*26,vx:Math.cos(a)*GLOVE_BLAST_38.speed,vy:Math.sin(a)*GLOVE_BLAST_38.speed,life:GLOVE_BLAST_38.lifetime,z:36*s.config.spriteScale,damage:GLOVE_BLAST_38.damage,realAge:0});
  actionOutcome(s,n,"glove-blast","activated","one stored charge consumed",undefined,undefined,attackId);s.fx.push({id:uid(),type:"glove-muzzle",x:p.x,y:p.y,z:36*s.config.spriteScale,angle:a,life:.25,owner:n});return;
 }
 // POWER GLOVE 01: B holds charge, release commits exactly one strike.
 // No automatic kick-chain; old MELEE_38 remains available for rollback.
 const invalid=p.hp<=0||p.charging||p.knock>0||p.coverId||p.gripCoverId||p.gripId||p.orbitIds.length||i.shield||i.slide||i.grip||i.heavy;
 if(i.melee&&!prev.melee){
  if(invalid||p.meleeCombo){actionOutcome(s,n,"melee","rejected","incompatible state");return;}
  p.gloveHoldStarted=s.time;p.gloveCharge=0;return;
 }
 if(i.melee&&p.gloveHoldStarted!==undefined){
  if(invalid){p.gloveHoldStarted=undefined;p.gloveCharge=0;actionOutcome(s,n,"melee","cancelled","charge interrupted");return;}
  const previousCharge=p.gloveCharge||0;
  p.gloveCharge=clamp((s.time-p.gloveHoldStarted)/.9,0,1);
  // Three readable wind-up milestones; visual effects only, never extra hits.
  for(const threshold of [.33,.66,1]){
   if(previousCharge<threshold&&p.gloveCharge>=threshold)s.fx.push({id:uid(),type:"glove-muzzle",x:p.x,y:p.y,z:34*s.config.spriteScale,angle:p.aim,life:.28+threshold*.15,owner:n,text:threshold===1?"MAX":""});
  }
  return;
 }
 if(!i.melee&&prev.melee&&p.gloveHoldStarted!==undefined){
  const charge=clamp((s.time-p.gloveHoldStarted)/.9,0,1);
  p.gloveHoldStarted=undefined;p.gloveCharge=0;
  if(invalid||p.meleeCombo){actionOutcome(s,n,"melee","cancelled","charge interrupted");return;}
  meleeStart(s,n,0);
  if(p.meleeCombo)p.meleeCombo.gloveCharge=charge;
  return;
 }
}
function meleeStep(s:GameState,n:number){const p=s.players[n],m=p.meleeCombo;if(!m)return;
 if(p.hp<=0||p.knock>0||p.charging||p.input.shield||p.input.slide||p.input.grip||p.coverId||p.gripId||p.gripCoverId||p.orbitIds.length){actionOutcome(s,n,"melee","cancelled",p.knock>0?"incoming hit":"state changed",undefined,undefined,m.attackId);p.meleeCombo=undefined;p.meleeNextStage=undefined;p.meleeNextUntil=0;return;}
 const spec=MELEE_38[0],charge=clamp(m.gloveCharge||0,0,1),age=s.time-m.started,heavyRecovery=charge*.18;
 if(!m.tested&&age>=spec.startup&&age<=spec.startup+spec.active+.025){m.tested=true;const end={x:p.x+Math.cos(m.angle)*(spec.range+charge*12),y:p.y+Math.sin(m.angle)*(spec.range+charge*12)},t=s.players[1-n];let block:Cover|undefined,nearest=Infinity;
  for(const cv of s.covers){if(cv.hp<=0)continue;const q=segmentCoverTime(p,end,cv);if(q!==null&&q<nearest){nearest=q;block=cv;}}
  const contact=t&&t.hp>0?sweptCircle(p,end,t,t,20):null;
  if(contact!==null&&contact<nearest){const hp=t.hp;duelContact(s,n,t,spec.damage+charge*28,Math.cos(m.angle)*(spec.push+charge*175),Math.sin(m.angle)*(spec.push+charge*175),"torso",undefined,"melee",m.attackId);if(charge>.85&&t.hp<hp){p.blastUntil=s.time+GLOVE_BLAST_38.window;}}
  else if(block){damageCover(block,s,spec.damage+charge*28);combatEvent(s,{kind:"cover",source:"melee",attackId:m.attackId,owner:n,damage:spec.damage+charge*28,x:end.x,y:end.y,z:25,material:bayObject(block.artId||block.id)?.material==="CONCRETE"?"stone":"metal"});}
  else actionOutcome(s,n,"melee","missed","whiff",undefined,undefined,m.attackId);
  s.fx.push({id:uid(),type:"melee-strike",x:end.x,y:end.y,z:30,angle:m.angle,life:.14+charge*.22,owner:n,text:charge>.8?"GOD FIST":charge>.3?"POWER HIT":spec.name});
 }
 if(age>=spec.startup+spec.active+spec.recovery+heavyRecovery){p.meleeCombo=undefined;p.meleeNextStage=undefined;p.meleeNextUntil=0;actionOutcome(s,n,"melee","recovered",spec.name,undefined,undefined,m.attackId);}
}
// Duel repairs use the existing pellet damage and action cooldown; movement tuning stays fixed.
function combatFight(s:GameState){return true} // One collision/physics contract across practice, duel and roam.
function combatEvent(s:GameState,event:Omit<CombatEvent,"seq"|"round"|"at">){
 if(event.kind!=="finish")actionOutcome(s,event.owner,event.source||"contact","contact",event.kind,event.target!==undefined?"player-"+event.target:undefined,event.damage,event.attackId);
 const e={...event,seq:(s.eventSeq||0)+1,round:s.round,at:s.time};s.eventSeq=e.seq;(s.events??=[]).push(e);s.events=s.events.slice(-64);return e;
}
function duelContact(s:GameState,owner:number,target:Player,damage:number,vx=0,vy=0,region:HitRegion="torso",point?:{x:number;y:number;z:number},source="contact",attackId?:string){
 if(target.hp<=0)return;
 const pos=point||{x:target.x,y:target.y,z:36*s.config.spriteScale},targetId=s.players.indexOf(target),attacker=s.players[owner],incomingAngle=Math.hypot(vx,vy)>.001?Math.atan2(-vy,-vx):attacker?Math.atan2(attacker.y-target.y,attacker.x-target.x):undefined;
 if(target.shield&&target.input.shield&&!target.coverId&&target.battery>0){combatEvent(s,{kind:"shield",incomingAngle,source,attackId,owner,target:targetId,damage:0,...pos});s.fx.push({id:uid(),type:"shield-block",x:pos.x,y:pos.y,z:pos.z,life:.22,owner});return;}
 const dealt=Math.min(target.hp,damage);target.hp=Math.max(0,target.hp-damage);if(s.time-(target.lastContactAt??-9)>.35)target.reactionDeadline=s.time+.60;target.lastContactAt=s.time;target.knock=Math.min(.26,Math.max(0,(target.reactionDeadline??s.time)-s.time));target.vx+=vx;target.vy+=vy;target.hitUntil=s.time+.18;target.hitAngle=Math.atan2(vy,vx);if(!target.hp)target.deathAt=s.time;
 combatEvent(s,{kind:"hit",incomingAngle,source,attackId,owner,target:targetId,region,damage:dealt,...pos});const burst=s.fx.find(f=>f.type==="hit"&&f.owner===owner&&f.life>=.319&&dist(f,pos)<35);if(burst)burst.strength=Math.min(100,(burst.strength||0)+dealt);else s.fx.push({id:uid(),type:"hit",x:pos.x,y:pos.y,z:pos.z,life:.32,owner,text:region,material:target.bot?"cyber":"digital",angle:Math.atan2(vy,vx),strength:dealt});
 // One bounded floor stain per confirmed burst; shields never reach this branch.
 if(target.bot){const last=s.fx.find(f=>f.type==="cyber-stain"&&f.owner===owner&&dist(f,target)<28&&f.life>3.94);if(!last){const stains=s.fx.filter(f=>f.type==="cyber-stain");if(stains.length>=12)s.fx=s.fx.filter(f=>f!==stains[0]);s.fx.push({id:uid(),type:"cyber-stain",x:target.x,y:target.y,life:4,angle:Math.atan2(vy,vx),owner});}}
}
// Field reach is independent of Kinetic Weave progression. Standard retains 235 world units.
export const PSYCHIC_POWERS=["BUILD COVER","ORBIT","PINBALL","HEAVY GAUNTLET","BULLET TIME"] as const;
// New 31 prototype values, separate from recovered movement/weapon balance.
export const PROJECTILE_TIME={scale:.08,baseDrain:8,pelletDrain:.2,capacity:42,maxAge:8} as const;
type ProjectileField={slot:number;x:number;y:number;radius:number};
function rayField(sh:Shot,f:ProjectileField){const speed=Math.hypot(sh.vx,sh.vy);if(speed<1e-9)return null;const ux=sh.vx/speed,uy=sh.vy/speed,dx=sh.x-f.x,dy=sh.y-f.y,b=dx*ux+dy*uy,disc=b*b-dx*dx-dy*dy+f.radius*f.radius;if(disc<=0)return null;const root=Math.sqrt(disc),lo=-b-root,hi=-b+root;return hi<=0?null:{lo:Math.max(0,lo),hi};}
export function projectileFields(s:GameState,dt:number){
 const fields=s.players.flatMap((p,slot)=>p.timeFieldActive&&p.hp>0&&p.battery>0?[{slot,x:p.x,y:p.y,radius:psychicField(p).radius}]:[]);
 s.players.forEach(p=>{p.timePellets=0;p.timeVolleys=0;p.timeAgeRemaining=PROJECTILE_TIME.maxAge});const volleys=fields.map(()=>new Set<string>());
 for(const sh of s.shots){sh.fieldOwners=[];if(sh.life<=0)continue;for(let j=0;j<fields.length;j++){const f=fields[j],p=s.players[f.slot],interval=rayField(sh,f);if(interval&&interval.lo<=Math.hypot(sh.vx,sh.vy)*dt&&(p.timePellets||0)<PROJECTILE_TIME.capacity){sh.fieldOwners.push(f.slot);p.timePellets=(p.timePellets||0)+1;p.timeAgeRemaining=Math.min(p.timeAgeRemaining??8,PROJECTILE_TIME.maxAge-(sh.realAge||0));volleys[j].add(sh.volleyId||sh.id);}}}
 fields.forEach((f,j)=>s.players[f.slot].timeVolleys=volleys[j].size);return fields;
}
export function projectileSegments(sh:Shot,fields:ProjectileField[],dt:number){
 const speed=Math.hypot(sh.vx,sh.vy);if(speed<1e-9)return[{x:sh.x,y:sh.y,start:0,end:1,travelTime:dt,scale:1}];
 const intervals=fields.map(f=>rayField(sh,f)).filter((x):x is {lo:number;hi:number}=>!!x),bounds=[...new Set([0,...intervals.flatMap(x=>[x.lo,x.hi])])].sort((a,b)=>a-b);
 const result:{x:number;y:number;start:number;end:number;travelTime:number;scale:number}[]=[];let remaining=dt,elapsed=0,distance=0;
 for(let k=0;remaining>1e-9&&k<bounds.length;k++){const lo=bounds[k],hi=bounds[k+1]??Infinity,mid=hi===Infinity?lo+1:(lo+hi)/2,scale=intervals.some(x=>mid>=x.lo&&mid<x.hi)?PROJECTILE_TIME.scale:1,available=(hi-lo)/(speed*scale),used=Math.min(remaining,available);if(used<=1e-12)continue;distance=lo+used*speed*scale;result.push({x:sh.x+sh.vx/speed*distance,y:sh.y+sh.vy/speed*distance,start:elapsed/dt,end:(elapsed+used)/dt,travelTime:used*scale,scale});elapsed+=used;remaining-=used;}
 return result;
}
export const PSYCHIC_FIELDS=[{name:"CLOSE",radius:135},{name:"STANDARD",radius:235},{name:"WIDE",radius:335}] as const;
export function psychicField(p:Player){const level=Number.isInteger(p.fieldLevel)?clamp(p.fieldLevel!,0,2):1;return{level,...PSYCHIC_FIELDS[level]};}
export function gripSelection(p:Player,s:GameState){
 const reach=psychicField(p).radius,a=p.aim,end={x:p.x+Math.cos(a)*reach,y:p.y+Math.sin(a)*reach};
 const forward=(q:{x:number;y:number})=>((q.x-p.x)*Math.cos(a)+(q.y-p.y)*Math.sin(a))/Math.max(1,dist(q,p));
 const candidates=s.covers.filter(cv=>!cv.protected45&&cv.hp>0&&(cv.generated||!!bayObject(cv.artId||cv.id)?.gripCompatible)&&!s.players.some(q=>q!==p&&(q.coverId===cv.id||q.gripCoverId===cv.id)));
 // Aim directly through the rotated whole-object footprint to choose it over incidental rubble.
 let cover=candidates.find(cv=>cv.id===p.coverId)||candidates.filter(cv=>dist(cv,p)<=reach&&segmentCoverTime(p,end,cv)!==null).sort((a,b)=>dist(a,p)-dist(b,p))[0];
 const matter=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null&&dist(m,p)<=reach&&forward(m)>.45).sort((a,b)=>dist(a,p)-dist(b,p)||forward(b)-forward(a))[0];
 const panel=!cover?(s.groundSources44||[]).filter(q=>q.panel46&&q.remaining===q.initial&&dist(q,p)<=reach&&segmentCoverTime(p,end,{x:q.x,y:q.y,w:80,h:54,a:0,hp:1} as Cover)!==null&&!s.covers.some(cv=>cv.hp>0&&circleBox(q,8,cv).hit)).sort((a,b)=>dist(a,p)-dist(b,p))[0]:undefined;
 if(!cover&&!matter&&!panel)cover=candidates.filter(cv=>dist(cv,p)<=reach&&forward(cv)>.45).sort((a,b)=>dist(a,p)-dist(b,p)||forward(b)-forward(a))[0];
 return{cover,matter:cover||panel?undefined:matter,panel};
}
function extractPanel46(p:Player,s:GameState,n:number,q:GroundSource44){
 const cv:Cover={id:uid(),x:q.x,y:q.y,w:80,h:54,a:0,hp:280,maxHp:280,generated:false,build:0,variant:0,artId:"floor-panel46",coverClass:"waist",born:s.time,stamp44:n,floorPanel46:{sourceId:q.id,originX:q.x,originY:q.y,creator:n},matterSources:Array.from({length:3},(_,k)=>({kind:"stone",sourceArt:"damaged-jersey",fragment:k,unitId:q.id+"-"+k,groundId:q.id}))};
 if(q.remaining!==3||carryBlocked(cv,cv,s)){p.gripHint="FLOOR PANEL BLOCKED · STEP CLEAR";p.gripHintUntil=s.time+1.5;return;}
 if(!spendEnergy(p,s,s.config.gripEnergy))return;
 q.remaining=0;q.peeledAt=s.time;q.angle=0;s.covers.push(cv);releaseCover(p,s,.25);p.gripCoverId=cv.id;p.coverGripAngle=Math.atan2(cv.y-p.y,cv.x-p.x);p.coverGripDist=clamp(dist(cv,p),78,psychicField(p).radius-8);p.gripGesture=false;p.gripDrive=0;p.gripDriveAt=-9;cv.build=.001;
 p.gripHint="FLOOR SLAB · RT THROW / RB FORM";p.gripHintUntil=s.time+1.5;s.fx.push({id:uid(),type:"matter-rip",x:q.x,y:q.y,life:.24,owner:n});
 actionOutcome(s,n,"peel","activated","physical floor slab",cv.id,s.config.gripEnergy);
}
// Loose matter stays physical; each construct records exactly the three units it consumes.
export function fieldMatter(p:Player,s:GameState){const slot=s.players.indexOf(p);return s.matter.filter(m=>m.life>0&&dist(m,p)<=psychicField(p).radius&&(m.heldBy===null||m.heldBy===slot)&&(m.orbitBy===null||m.orbitBy===slot)&&!(m.throwOwner!==undefined&&Math.hypot(m.vx,m.vy)>140)).sort((a,b)=>dist(a,p)-dist(b,p));}
export function peelSources44(p:Player,s:GameState){return (s.groundSources44||[]).filter(q=>q.remaining>0&&dist(q,p)<=psychicField(p).radius&&!s.covers.some(cv=>cv.hp>0&&circleBox(q,8,cv).hit)).sort((a,b)=>dist(a,p)-dist(b,p)||a.id.localeCompare(b.id));}
export function constructionSupply44(p:Player,s:GameState){const loose=fieldMatter(p,s);return{reinforced:loose.filter(m=>m.kind==="stone").length>=2&&loose.some(m=>m.kind==="metal"),looseStone:loose.filter(m=>m.kind==="stone").length,groundUnits:peelSources44(p,s).reduce((n,q)=>n+q.remaining,0)};}
function releaseOrbit(p:Player,s:GameState){for(const id of p.orbitIds){const m=s.matter.find(m=>m.id===id);if(m){m.orbitBy=null;m.vx=m.vy=0}}p.orbitIds=[];}
function constructionPlacement(p:Player,s:GameState,n:number,aim:number,id="placement"):Cover|undefined{
 const source=bayObject("war-generated-shell45")!,cv:Cover={id,x:0,y:0,w:source.collisionHull.w*(p.coverShape===1?.72:1),h:source.collisionHull.h,a:aim+Math.PI/2,hp:COVER_41.projectedHp,maxHp:COVER_41.projectedHp,generated:true,build:1,variant:0,born:s.time,artId:source.id,coverClass:source.coverClass||"waist",constructOwner:n};
 for(let d=100;d<=psychicField(p).radius;d+=20){cv.x=p.x+Math.cos(aim)*d;cv.y=p.y+Math.sin(aim)*d;if(!carryBlocked(cv,cv,s))return cv;}
}
function buildFieldCover(p:Player,s:GameState,n:number){
 const matter=fieldMatter(p,s),stones=matter.filter(m=>m.kind==="stone").slice(0,2),metal=matter.find(m=>m.kind==="metal");
 const reject=(text:string)=>{p.gripHint=text;p.gripHintUntil=s.time+1.5};
 if(p.battery<COVER_41.buildEnergy){reject("BUILD NEEDS 30 BATTERY · HOLD Y");return;}
 if(s.covers.filter(c=>c.constructOwner===n&&c.hp>0).length>=2){reject("2/2 CONSTRUCTS · BREAK OR RECYCLE FIRST");return;}
 const cv=constructionPlacement(p,s,n,p.aim,uid());
 if(!cv){reject("NO BUILD SPACE · AIM AT OPEN ROAD");return;}
 const slab=s.covers.find(q=>q.id===p.gripCoverId&&q.floorPanel46&&q.hp>0),reinforced=!slab&&stones.length===2&&!!metal,looseStone=matter.filter(m=>m.kind==="stone").slice(0,3),used=slab?[]:reinforced?[...stones,metal!]:looseStone.length===3?looseStone:[],sources=peelSources44(p,s);
 // Complete loose recipes first; ground is a finite emergency source. Legacy snapshots
 // without the new ledger retain their old non-collectible projection contract.
 if(!slab&&!used.length&&s.groundSources44!==undefined&&sources.reduce((n,q)=>n+q.remaining,0)<GROUND_44.unitsPerCover){reject("NO MATTER IN FIELD · MOVE TO FRESH GROUND");return;}
 const components:ConstructMatter44[]=slab?slab.matterSources!.map(m=>({...m,originX:slab.x,originY:slab.y})):used.map(m=>({kind:m.kind,sourceArt:m.sourceArt,fragment:m.fragment,unitId:m.unitId||m.id,groundId:m.groundId,originX:m.x,originY:m.y}));
 if(!slab&&!used.length&&s.groundSources44!==undefined){let needed=GROUND_44.unitsPerCover;for(const source of sources){const taken=Math.min(needed,source.remaining);for(let k=0;k<taken;k++)components.push({kind:"stone",sourceArt:"damaged-jersey",fragment:k,unitId:source.id+"-"+(source.initial-source.remaining+k),groundId:source.id,originX:source.x+(k-1)*9,originY:source.y});source.remaining-=taken;source.revision=(source.revision||0)+1;source.state=source.remaining===0?"extracted":"fractured";source.peeledAt=s.time;source.angle=cv.a;needed-=taken;if(!needed)break;}}
 if(slab){cv.hp=cv.maxHp*Math.max(0,Math.min(1,slab.hp/slab.maxHp));s.covers=s.covers.filter(q=>q.id!==slab.id);p.gripCoverId=null;p.gripGesture=false;}
 const ids=new Set(used.map(m=>m.id));if(reinforced)cv.hp=cv.maxHp=COVER_41.reinforcedHp;cv.matterSources=components.map(({originX,originY,...component})=>component);cv.assembly44=components;cv.stamp44=n;cv.construction44=used.length?"salvage":"peel";
 s.matter=s.matter.filter(m=>!ids.has(m.id));s.players.forEach(q=>{if(q.gripId&&ids.has(q.gripId))q.gripId=null;q.orbitIds=q.orbitIds.filter(id=>!ids.has(id));});spendEnergy(p,s,COVER_41.buildEnergy);s.covers.push(cv);p.gripHint=reinforced?"SALVAGE FORMED · 360 HP":components.length?"GROUND / STONE FORMED · 280 HP":"PROJECTED COVER · 280 HP";p.gripHintUntil=s.time+1.5;actionOutcome(s,n,"build","activated",reinforced?"reinforced":components.length?cv.construction44:"projected",cv.id,COVER_41.buildEnergy);s.fx.push({id:uid(),type:"materialize",x:cv.x,y:cv.y,life:components.length?GROUND_44.assemblySeconds:.72,owner:n,angle:cv.a});
}
function dissolveFieldCover(cv:Cover,s:GameState){damageCover(cv,s,cv.hp);const f=s.fx.findLast(f=>f.type==="cover-break"&&f.x===cv.x&&f.y===cv.y);if(f)f.type="cover-dissolve";}
function edgeActions(s:GameState,n:number,prev:InputState){const p=s.players[n],i=p.input,c=s.config;
 if(i.powerCycle&&!prev.powerCycle)p.selectedPower=((p.selectedPower||0)+1)%PSYCHIC_POWERS.length;
 if(i.weaponCycle&&!prev.weaponCycle){p.selectedWeapon=0;p.gripHint="SHOTGUN · ONLY VERIFIED WEAPON";p.gripHintUntil=s.time+1.2;}
 if(i.slow&&!prev.slow){if(p.timeFieldActive)p.timeFieldActive=false;else if(p.hp>0&&p.battery>0&&!p.charging)p.timeFieldActive=true;}
 if(i.powerUse&&!prev.powerUse){const power=PSYCHIC_POWERS[p.selectedPower||0];if(power==="BUILD COVER")i.cover=true;else if(power==="ORBIT")i.orbit=true;else if(power==="PINBALL")i.pinball=true;else if(power==="HEAVY GAUNTLET")i.heavy=true;else if(power==="BULLET TIME"){if(p.timeFieldActive)p.timeFieldActive=false;else if(p.hp>0&&p.battery>0&&!p.charging)p.timeFieldActive=true;}}
 if(i.coverShapeCycle&&!prev.coverShapeCycle)p.coverShape=(p.coverShape===1?0:1);
 if(i.fieldCycle&&!prev.fieldCycle)p.fieldLevel=(psychicField(p).level+1)%3;
 // Successful immediate brace keeps its original priority over other edges.
 slideAction(s,n,prev);
 if(i.pinball&&!prev.pinball&&p.battery<22)spendEnergy(p,s,22);
 if(i.pinball&&!prev.pinball&&p.battery>=22){p.battery-=22;p.pinball=c.pinballDuration;p.vx=Math.cos(p.aim)*c.pinballSpeed;p.vy=Math.sin(p.aim)*c.pinballSpeed;s.fx.push({id:uid(),type:"pinball",x:p.x,y:p.y,life:.5,owner:n})}
 meleeInput(s,n,prev);
 // Heavy gauntlet keeps its existing separate power path.
 if(i.heavy&&!prev.heavy)p.pendingMelee={heavy:true,until:s.time+.18};
 const pending=p.pendingMelee;
 if(pending&&pending.until<s.time){p.pendingMelee=undefined;actionOutcome(s,n,"heavy","cancelled","buffer expired");}
 else if(pending&&!p.charging&&p.knock<=0&&!p.meleeCombo&&s.time-p.lastMelee>.85){
  p.pendingMelee=undefined;p.lastMelee=s.time;const strike={x:p.x+Math.cos(p.aim)*40,y:p.y+Math.sin(p.aim)*40},target=s.players[1-n];
  s.fx.push({id:uid(),type:"heavy",...strike,life:.22,owner:n});
  if(target&&dist(strike,target)<=21&&!s.covers.some(cv=>segmentCover(p,strike,cv)))duelContact(s,n,target,34,Math.cos(p.aim)*520,Math.sin(p.aim)*520,"torso",undefined,"heavy",uid());
 }
 // Contextual floor restoration: LB + RB while aiming at a depleted nearby cell.
 // No new button. Never override a held object or ordinary RB construction.
 if(i.cover&&!prev.cover&&i.grip&&!p.gripId&&!p.gripCoverId&&!p.orbitIds.length){
  const aimX=p.x+Math.cos(p.aim)*95,aimY=p.y+Math.sin(p.aim)*95;
  const candidate=(s.groundSources44||[]).filter(c=>c.remaining<c.initial&&dist(c,p)<=psychicField(p).radius)
   .sort((a,b)=>Math.hypot(a.x-aimX,a.y-aimY)-Math.hypot(b.x-aimX,b.y-aimY)||a.id.localeCompare(b.id))[0];
  if(candidate&&Math.hypot(candidate.x-aimX,candidate.y-aimY)<=80){
   const needed=candidate.initial-candidate.remaining;
   const cost=needed*5;
   if(spendEnergy(p,s,cost)){
    candidate.remaining=candidate.initial;candidate.revision=(candidate.revision||0)+1;candidate.state="intact";
    candidate.peeledAt=s.time;candidate.angle=p.aim;
    s.fx.push({id:uid(),type:"materialize",x:candidate.x,y:candidate.y,life:.55,owner:n,angle:p.aim});
    actionOutcome(s,n,"floor-rebuild","activated","energy reconstruction",candidate.id,cost);
   }
  }else buildFieldCover(p,s,n);
 }else if(i.cover&&!prev.cover)buildFieldCover(p,s,n);
 if(!i.fire)p.fireBlocked=false;
 if(!i.grip&&prev.grip){releaseGripGesture(p,s,n,prev);}

 if(i.grip&&!prev.grip&&!i.cover&&!p.orbitIds.length){
   if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}s.fx.push({id:uid(),type:"matter-drop",x:cv?.x??p.x,y:cv?.y??p.y,life:.24,owner:n});p.gripCoverId=null}
   else if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m){m.heldBy=null;m.vx=m.vy=0;m.throwOwner=undefined;}p.gripId=null}
   else{
     const {cover:cv,matter:loose,panel}=gripSelection(p,s);
     if(cv){if(spendEnergy(p,s,c.gripEnergy)){releaseCover(p,s,.25);p.gripCoverId=cv.id;p.coverGripAngle=Math.atan2(cv.y-p.y,cv.x-p.x);p.coverGripDist=clamp(dist(cv,p),78,psychicField(p).radius-8);p.gripGesture=false;p.gripDrive=0;p.gripDriveAt=-9;cv.throwOwner=undefined;cv.hitIds=[];cv.vx=cv.vy=0;cv.build=.001;s.fx.push({id:uid(),type:"matter-rip",x:cv.x,y:cv.y,life:.42,owner:n})}}
     else if(panel)extractPanel46(p,s,n,panel);
     else{const m=combatFight(s)?loose:s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(m&&dist(m,p)<=psychicField(p).radius&&spendEnergy(p,s,c.gripEnergy)){p.gripId=m.id;p.coverGripDist=clamp(dist(m,p),42,psychicField(p).radius-8);p.coverGripAngle=p.aim;p.gripGesture=false;p.gripDrive=0;p.gripDriveAt=-9;m.throwOwner=undefined;m.hitIds=[];m.vx=m.vy=0;m.heldBy=n}else if(!m){p.gripHint="NO TARGET · AIM CLOSER";p.gripHintUntil=s.time+1.5}}
   }
 }
 const held=!!(p.gripCoverId||p.gripId);
 // LB+RT remains a psychic command even if the target vanished or acquisition failed.
 if((i.grip||i.throwMatter||i.launchOrbit)&&i.fire){p.fireBlocked=true;p.pendingFireUntil=undefined;if(!held&&!p.orbitIds.length&&!prev.fire){p.gripHint="NO HELD MATTER · RELEASE RT BEFORE SHOOTING";p.gripHintUntil=s.time+1.2;}}
 if(held&&i.fire)p.fireBlocked=true;
 if((i.throwMatter&&!prev.throwMatter)||(held&&i.grip&&i.fire&&!prev.fire)){
   if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv&&spendEnergy(p,s,c.coverThrowEnergy)){
     const a=p.aim,force=c.throwForce*.62*(p.godTime>0?1.25:1)*(combatFight(s)?Math.sqrt(12/(bayObject(cv.artId||cv.id)?.mass||12)):1),inherit=clamp(c.carryMomentum,0,1);
     // Release where it is: preserve orientation and measured carry velocity.
     cv.vx=(Math.cos(a)*force+p.vx*inherit+(cv.vx||0)*(1-inherit))*GRIP_STRENGTH;cv.vy=(Math.sin(a)*force+p.vy*inherit+(cv.vy||0)*(1-inherit))*GRIP_STRENGTH;
     cv.throwOwner=n;cv.hitIds=[];cv.build=-Math.hypot(cv.vx,cv.vy);s.fx.push({id:uid(),type:"cover-throw",x:cv.x,y:cv.y,life:.55,owner:n,text:"WHAM"});p.gripCoverId=null;actionOutcome(s,n,"throw","activated","cover",cv.id,c.coverThrowEnergy);
   }}
   else if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m&&spendEnergy(p,s,c.coverThrowEnergy)){m.heldBy=null;m.throwOwner=n;m.hitIds=[];m.vx=Math.cos(p.aim)*c.throwForce*(p.godTime>0?1.25:1)*GRIP_STRENGTH;m.vy=Math.sin(p.aim)*c.throwForce*(p.godTime>0?1.25:1)*GRIP_STRENGTH;m.life=999;p.gripId=null;actionOutcome(s,n,"throw","activated","matter",m.id,c.coverThrowEnergy)}}
 }
 if(i.orbit&&!prev.orbit){if(p.orbitIds.length)releaseOrbit(p,s);else if(p.gripCoverId){p.gripHint="RELEASE LB · DROP COVER BEFORE ORBIT";p.gripHintUntil=s.time+1.5;}else{const ms=fieldMatter(p,s).slice(0,3);if(ms.length&&spendEnergy(p,s,c.gripEnergy*ms.length)){p.gripId=null;p.orbitIds=ms.map(m=>m.id);ms.forEach(m=>{m.heldBy=null;m.orbitBy=n;m.vx=m.vy=0})}else if(!ms.length){p.gripHint="NO MATTER INSIDE FIELD";p.gripHintUntil=s.time+1.5;}}}
 const orbitThrow=p.orbitIds.length&&i.grip&&i.fire&&!prev.fire;
 if(p.orbitIds.length&&i.grip&&i.fire)p.fireBlocked=true;
 if(((i.launchOrbit&&!prev.launchOrbit)||orbitThrow)&&p.orbitIds.length&&spendEnergy(p,s,c.coverThrowEnergy)){p.orbitIds.forEach((id,j)=>{const m=s.matter.find(m=>m.id===id);if(m){m.orbitBy=null;m.throwOwner=n;m.attackId=undefined;m.hitIds=[];m.vx=Math.cos(p.aim+(j-1)*.12)*c.throwForce*1.05;m.vy=Math.sin(p.aim+(j-1)*.12)*c.throwForce*1.05;m.life=999}});p.orbitIds=[];actionOutcome(s,n,"throw","activated","orbit",undefined,c.coverThrowEnergy);}

}
function muzzleSocket(p:Player){
 const a=p.gunFacing??p.aim??0,dir=((Math.round(a/(Math.PI*2)*24)%24)+24)%24;
 // Pass05 major-family socket contract. Continuous aim owns shot direction;
 // sector data only describes the registered current-production barrel reach.
 const major=[34,35,36,36,35,34,33,33],sector=((Math.round(a/(Math.PI*2)*8)%8)+8)%8,forward=major[sector];
 const side=[0,-1,-2,-2,-1,0,1,2,2,1,0,-1,-2,-2,-1,0,1,2,2,1,0,-1,-2,-1][dir]||0;
 const px=Math.cos(a),py=Math.sin(a),sx=-py,sy=px;
 return{x:p.x+px*forward+sx*side,y:p.y+py*forward+sy*side,dir};
}
function coverMuzzleClearance(p:Player,cv:Cover|undefined,muzzle:{x:number;y:number},aim:number){
 if(!cv||!p.coverAnchor)return{allowed:true,clearance:undefined as string|undefined,mode:"FREE"};
 const a=p.coverAnchor,topology=Math.min(a.t,a.length-a.t)<18?"EDGE":"FACE";
 if(p.coverMode!=="braced"||!p.input.coverAim)return{allowed:false,clearance:undefined,mode:"PROTECTED"};
 // Tall FACE never clears over the top. EDGE/CORNER must point sufficiently
 // around/outside the owning face. Waist can expose over top from FACE.
 if(cv.coverClass==="tall"&&topology==="FACE")return{allowed:false,clearance:undefined,mode:"TALL_FACE"};
 const px=Math.cos(aim),py=Math.sin(aim),out=px*a.nx+py*a.ny,along=px*a.tx+py*a.ty;
 const sideClear=topology!=="FACE"&&Math.abs(along)>.18;
 const overClear=cv.coverClass!=="tall"&&out>-.35;
 const allowed=sideClear||overClear;
 return{allowed,clearance:allowed?cv.id:undefined,mode:sideClear?"SIDE":overClear?"OVER":"BLOCKED"};
}
// Swept contact in the existing rotated floor footprint. Exposed top fire clears only its own block.
// Earliest footprint entry. Null distinguishes a miss from a valid t=0 hit.
function segmentCoverTime(from:{x:number;y:number},to:{x:number;y:number},cv:Cover):number|null{
 const a=localPoint(cv,from.x,from.y),b=localPoint(cv,to.x,to.y);let enter=0,leave=1;
 for(const [start,delta,half]of [[a.x,b.x-a.x,cv.w/2],[a.y,b.y-a.y,cv.h/2]]){
  if(Math.abs(delta)<1e-8){if(Math.abs(start)>half)return null;continue}
  const u=(-half-start)/delta,v=(half-start)/delta;enter=Math.max(enter,Math.min(u,v));leave=Math.min(leave,Math.max(u,v));if(enter>leave)return null;
 }return leave>=0&&enter<=1?enter:null;
}
function segmentCover(from:{x:number;y:number},to:{x:number;y:number},cv:Cover){return segmentCoverTime(from,to,cv)!==null}
export function bodyRegions(p:Player,scale=.82){
 // World elevation follows the upright sprite, anchored at its existing feet.
 const h=78*scale*(p.slide>0?.58:p.coverId&&!(p.coverMode==="braced"&&p.input.coverAim)?.72:1);
 return [{region:"low" as HitRegion,min:0,max:h*.28,r:18},{region:"torso" as HitRegion,min:h*.28,max:h*.76,r:16},{region:"head" as HitRegion,min:h*.76,max:h,r:11}];
}
function sweptCircle(from:{x:number;y:number},to:{x:number;y:number},start:{x:number;y:number},end:{x:number;y:number},radius:number):number|null{
 const x=from.x-start.x,y=from.y-start.y,dx=to.x-from.x-(end.x-start.x),dy=to.y-from.y-(end.y-start.y),c=x*x+y*y-radius*radius;
 if(c<=0)return 0;const a=dx*dx+dy*dy;if(a<1e-12)return null;const b=2*(x*dx+y*dy),disc=b*b-4*a*c;if(disc<0)return null;const t=(-b-Math.sqrt(disc))/(2*a);return t>=0&&t<=1?t:null;
}
export function shotPlayerTime(from:{x:number;y:number},to:{x:number;y:number},z:number,p:Player,start:{x:number;y:number},scale=.82,radius=0){
 const r=bodyRegions(p,scale).find(r=>z>=r.min&&z<=r.max);if(!r)return null;const shield=p.shield&&p.input.shield&&!p.coverId&&p.battery>0;
 const t=sweptCircle(from,to,start,p,(shield?30:r.r)+radius);return t===null?null:{t,region:r.region};
}
// Grip 35: stick direction + magnitude selects a radial target; neutral holds it.
// Legacy clients without these axes keep their aim-driven carry and explicit RT throw.
function gripTarget(p:Player,s:GameState,minimum:number){
 const i=p.input,analog=Number.isFinite(i.gripX)&&Number.isFinite(i.gripY),max=Math.max(minimum,psychicField(p).radius-8);
 if(analog){p.gripGesture=true;const magnitude=Math.hypot(i.gripX!,i.gripY!);if(magnitude>.05){p.coverGripAngle=Math.atan2(i.gripY!,i.gripX!);p.coverGripDist=minimum+(max-minimum)*clamp(magnitude,0,1);}}
 return {angle:analog?p.coverGripAngle:p.aim,radius:clamp(p.coverGripDist,minimum,max),maximum:max};
}
function gripDrive(p:Player,s:GameState,object:{x:number;y:number;vx?:number;vy?:number},radial:number){
 const dx=object.x-p.x,dy=object.y-p.y,r=Math.hypot(dx,dy)||1,out=((object.vx||0)-p.vx)*dx/r+((object.vy||0)-p.vy)*dy/r;
 if(out>25&&radial>.1){p.gripDrive=out;p.gripDriveAt=s.time;}
}
function releaseGripGesture(p:Player,s:GameState,n:number,previous:InputState){
 const cv=s.covers.find(cv=>cv.id===p.gripCoverId),m=s.matter.find(m=>m.id===p.gripId),object=cv||m;
 if(!object){p.gripCancelRelease=false;return;}
 // KINETIC COVER 02: one intentional gesture, one clear result.
 // Stick neutral means place. Directed release means a full throw toward the stick.
 // Preserve cancellation, energy costs, momentum inheritance and authoritative impacts.
 const gx=previous.gripX||0,gy=previous.gripY||0,stick=Math.hypot(gx,gy);
 const valid=!p.gripCancelRelease&&p.knock<=0&&p.hp>0&&!p.charging;
 const wantsThrow=valid&&stick>.24;
 const propelled=wantsThrow&&spendEnergy(p,s,s.config.coverThrowEnergy);
 const kind=propelled?"launch":"drop";
 let vx=0,vy=0;
 if(propelled){
  const a=Math.atan2(gy,gx),mass=cv?(bayObject(cv.artId||cv.id)?.mass||9):3;
  const impulse=s.config.throwForce*.62*Math.sqrt(12/mass)*(p.godTime>0?1.25:1)*GRIP_STRENGTH;
  const inherit=clamp(s.config.carryMomentum,0,1);
  vx=Math.cos(a)*impulse+p.vx*inherit+(object.vx||0)*.15;
  vy=Math.sin(a)*impulse+p.vy*inherit+(object.vy||0)*.15;
  const speed=Math.hypot(vx,vy),cap=720*GRIP_STRENGTH;
  if(speed>cap){vx*=cap/speed;vy*=cap/speed;}
 }
 if(p.input.fire)p.fireBlocked=true;p.pendingFireUntil=undefined;
 object.vx=vx;object.vy=vy;object.throwOwner=propelled?n:undefined;object.hitIds=[];
 if(cv)cv.build=propelled?-Math.hypot(vx,vy):0;if(m)m.heldBy=null;
 p.gripCoverId=null;p.gripId=null;p.gripGesture=false;p.gripCancelRelease=false;p.gripDrive=0;p.gripReleaseKind=kind;p.gripReleaseUntil=s.time+.6;
 const release=actionOutcome(s,n,propelled?"throw":"place","activated","gesture "+kind,object.id,propelled?s.config.coverThrowEnergy:0);
 release.speed=Math.hypot(vx,vy);release.mass=cv?(bayObject(cv.artId||cv.id)?.mass||9):3;
 s.fx.push({id:uid(),type:propelled?"cover-throw":"matter-drop",x:object.x,y:object.y,life:propelled?.4:.22,owner:n,text:propelled?"WHAM":""});
}
// Recovered from lab-psychic-cover.js at efecc43: orbit around holder and sweep
// translation + rotated corners. Current mass response and geometry remain authoritative.
function carryCoverSwept(cv:Cover,p:Player,s:GameState,dt:number){
 const safeRadius=Math.hypot(cv.w,cv.h)/2+19,target=gripTarget(p,s,safeRadius),a=target.angle,ox=cv.x,oy=cv.y,oa=cv.a,radius=Math.hypot(cv.x-p.x,cv.y-p.y),angle=Math.atan2(cv.y-p.y,cv.x-p.x);
 const mass=bayObject(cv.artId||cv.id)?.mass||9,response=s.config.carryResponse*Math.sqrt(9/mass)*GRIP_STRENGTH,turn=Math.min(3.2,s.config.carryTurnResponse*Math.sqrt(9/mass))*GRIP_STRENGTH;
 // Clear the holder radially before turning a freshly ripped close object.
 const approach=(v:number,wanted:number,accel:number)=>v+clamp(wanted-v,-accel*dt,accel*dt),massScale=Math.sqrt(9/mass);
 // Intent is immediate; physical radial/angular velocity ramps independently. Neutral holds the target.
 const radialWanted=clamp((target.radius-radius)*response,-550*GRIP_STRENGTH,550*GRIP_STRENGTH);
 cv.carryRadialSpeed=approach(cv.carryRadialSpeed||0,radialWanted,9000*massScale*GRIP_STRENGTH);
 const radialStep=clamp(cv.carryRadialSpeed*dt,-Math.abs(target.radius-radius),Math.abs(target.radius-radius));
 cv.carryAngularSpeed=radius<safeRadius?0:approach(cv.carryAngularSpeed||0,clamp(wrap(a-angle)*response,-turn,turn),turn*18*massScale);
 const orbit=angle+(radius<safeRadius?0:clamp(cv.carryAngularSpeed*dt,-Math.abs(wrap(a-angle)),Math.abs(wrap(a-angle)))),nextRadius=radius+radialStep;
 const dx=p.x+Math.cos(orbit)*nextRadius-cv.x,dy=p.y+Math.sin(orbit)*nextRadius-cv.y,len=Math.hypot(dx,dy),travel=Math.min(len,550*GRIP_STRENGTH*dt),mx=len?dx/len*travel:0,my=len?dy/len*travel:0;
 cv.carryRotationSpeed=radius<safeRadius?0:approach(cv.carryRotationSpeed||0,clamp(wrap(a+Math.PI/2-cv.a)*s.config.carryTurnResponse,-turn,turn),turn*18*massScale);
 const da=radius<safeRadius?0:clamp(cv.carryRotationSpeed*dt,-Math.abs(wrap(a+Math.PI/2-cv.a)),Math.abs(wrap(a+Math.PI/2-cv.a))),steps=Math.max(1,Math.ceil((travel+Math.abs(da)*Math.hypot(cv.w,cv.h)/2)/3));
 for(let k=1;k<=steps;k++){const candidate={...cv,x:ox+mx*k/steps,y:oy+my*k/steps,a:oa+da*k/steps};if(carryBlocked(candidate,cv,s)){p.gripHint="CARRY BLOCKED · REPOSITION OR THROW";p.gripHintUntil=s.time+.25;cv.build=.001;cv.vx=cv.vy=0;cv.carryRadialSpeed=cv.carryAngularSpeed=cv.carryRotationSpeed=0;cv.carryBlockedAt=s.time;p.gripDrive=0;p.gripDriveAt=-9;return;}cv.x=candidate.x;cv.y=candidate.y;cv.a=candidate.a;}
 cv.vx=(cv.x-ox)/Math.max(.001,dt);cv.vy=(cv.y-oy)/Math.max(.001,dt);cv.build=.001;gripDrive(p,s,cv,clamp((nextRadius-safeRadius)/Math.max(1,target.maximum-safeRadius),0,1));
}
function carryBlocked(candidate:Cover,original:Cover,s:GameState){
 const ex=Math.abs(Math.cos(candidate.a))*candidate.w/2+Math.abs(Math.sin(candidate.a))*candidate.h/2,ey=Math.abs(Math.sin(candidate.a))*candidate.w/2+Math.abs(Math.cos(candidate.a))*candidate.h/2;
 if(candidate.x-ex<A.left||candidate.x+ex>A.right||candidate.y-ey<A.top||candidate.y+ey>A.bottom)return true;
 if(s.players.some(p=>p.hp>0&&circleBox(p,18,candidate).hit))return true;
 for(const b of s.covers){if(b.id===original.id||b.hp<=0)continue;let overlap=true;
  for(const angle of [candidate.a,candidate.a+Math.PI/2,b.a,b.a+Math.PI/2]){const ax=Math.cos(angle),ay=Math.sin(angle),r=(c:Cover)=>Math.abs(ax*Math.cos(c.a)+ay*Math.sin(c.a))*c.w/2+Math.abs(-ax*Math.sin(c.a)+ay*Math.cos(c.a))*c.h/2;if(Math.abs((candidate.x-b.x)*ax+(candidate.y-b.y)*ay)>=r(candidate)+r(b)){overlap=false;break}}
  if(overlap)return true;
 }return false;
}
// Ground scattering is presentation-friendly physics, never a free damaging throw.
function scatterMatter42(m:Matter,s:GameState,starts:{x:number;y:number}[],dt:number){
 if(m.heldBy!==null||m.orbitBy!==null)return;
 const speed=Math.hypot(m.vx,m.vy);
 if(speed<20){m.throwOwner=undefined;m.attackId=undefined;m.hitIds=[];}
 if(m.throwOwner===undefined&&s.time-(m.scatterAt??-9)>.12)for(let n=0;n<s.players.length;n++){
  const p=s.players[n];if(p.hp<=0||p.coverId||p.knock>0)continue;
  const travel=Math.hypot(p.x-starts[n].x,p.y-starts[n].y),moving=travel/Math.max(.001,dt);
  const combo=p.meleeCombo,spec=combo?MELEE_38[combo.stage]:undefined,age=combo?s.time-combo.started:0;
  const kicking=!!combo&&combo.stage%2===1&&age>=spec!.startup&&age<=spec!.startup+spec!.active;
  const boot={x:p.x+(kicking?Math.cos(combo!.angle)*28:0),y:p.y+(kicking?Math.sin(combo!.angle)*28:0)};
  if((moving>45||kicking)&&sweptCircle(starts[n],boot,m,m,m.r+16)!==null){
   const angle=kicking?combo!.angle:Math.atan2(p.y-starts[n].y,p.x-starts[n].x),strength=kicking?180:Math.min(210,moving*.48);
   m.vx=Math.cos(angle)*strength;m.vy=Math.sin(angle)*strength;m.groundScatter=true;m.scatterAt=s.time;
   m.spinVelocity=(n%2?-1:1)*(m.kind==="metal"?11:7);m.liftVelocity=kicking?60:Math.min(45,moving*.1);
   break;
  }
 }
 m.spin=(m.spin||0)+(m.spinVelocity||Math.hypot(m.vx,m.vy)*.025)*dt;
 m.spinVelocity=(m.spinVelocity||0)*Math.exp(-2*dt);
 if((m.height||0)>0||(m.liftVelocity||0)>0){m.liftVelocity=(m.liftVelocity||0)-220*dt;m.height=(m.height||0)+m.liftVelocity*dt;if(m.height<=0){m.height=0;m.liftVelocity=Math.abs(m.liftVelocity)*(m.kind==="metal"?.3:.18);if(m.liftVelocity<9)m.liftVelocity=0;}}
}

// Brother Build 768e3c3: flying matter deals 22 to fighters, 28 to cover,
// with 360 impulse and .45 cover rebound. Sweeps/ownership make that port safe.
function matterContactSwept(m:Matter,from:{x:number;y:number},s:GameState,starts:{x:number;y:number}[]){
 const speed=Math.hypot(m.vx,m.vy);if(speed<=140)return;let nearest=Infinity,cv:Cover|undefined,target:Player|undefined,slot=-1;
 for(const c of s.covers){if(c.hp<=0||m.hitIds?.includes(c.id))continue;const t=segmentCoverTime(from,m,{...c,w:c.w+2*m.r,h:c.h+2*m.r});if(t!==null&&t<nearest){nearest=t;cv=c;}}
 if(speed>170)for(let n=0;n<s.players.length;n++){const p=s.players[n];if(n===m.throwOwner||p.hp<=0||m.hitIds?.includes("player-"+n))continue;const t=sweptCircle(from,m,starts[n],p,m.r+19);if(t!==null&&t<nearest){nearest=t;target=p;slot=n;cv=undefined;}}
 if(!Number.isFinite(nearest))return;m.x=from.x+(m.x-from.x)*nearest;m.y=from.y+(m.y-from.y)*nearest;
 if(target){(m.hitIds??=[]).push("player-"+slot);duelContact(s,m.throwOwner??-1,target,22,m.vx/speed*360,m.vy/speed*360,"low",{x:m.x,y:m.y,z:8},"matter-throw",m.attackId);m.vx*=.25;m.vy*=.25;}
 else if(cv){(m.hitIds??=[]).push(cv.id);damageCover(cv,s,28);m.vx*=-.45;m.vy*=-.45;const material=m.kind;combatEvent(s,{kind:"cover",source:"matter-throw",attackId:m.attackId,owner:m.throwOwner??-1,damage:28,x:m.x,y:m.y,z:8,material});s.fx.push({id:uid(),type:"cover-hit",x:m.x,y:m.y,z:8,life:.25,text:material});}
}
// Spectator bots issue ordinary authoritative inputs, never fabricated damage or teleports.
function watchBotInput(s:GameState,n:number,opponent:InputState){
 const p=s.players[n],t=s.players[1-n];if(!t||p.hp<=0){p.input=empty();return;}const a=Math.atan2(t.y-p.y,t.x-p.x),range=dist(p,t),blocked=s.covers.some(cv=>cv.hp>0&&segmentCover(p,t,cv)),side=p.x<t.x?1:-1,cycle=(s.time+((s.round-1+n)%2)*4)%12;
 const fresh=(s.actions||[]).filter(e=>e.owner===n&&e.seq>(p.botSeenAction||0));p.botSeenAction=s.actionSeq||0;
 if(fresh.some(e=>(e.action==="throw"||e.action==="place")&&e.status==="activated")){p.botGripStyle=((p.botGripStyle||0)+1)%3;p.botAvoidGrabUntil=s.time+.65;}

 if(fresh.some(e=>e.action==="throw"&&e.status==="activated")){p.botReleaseUntil=s.time+.09;p.botFollowUntil=s.time+1.3;}
 if(fresh.some(e=>e.action==="build"&&e.status==="rejected")){p.botBuildFailures=(p.botBuildFailures||0)+1;p.botNextBuild=s.time+.65;p.botBuildAt=undefined;p.botEscapeUntil=s.time+.65;}
 if(fresh.some(e=>e.status==="contact"&&e.reason==="shield")){p.botFollowUntil=0;p.botEscapeUntil=s.time+.4;}
 if(fresh.some(e=>e.action.includes("throw")&&e.status==="contact"&&e.reason==="hit"))p.botFollowUntil=s.time+1.1;
 const blockedIncoming=(s.events||[]).some(e=>e.kind==="shield"&&e.target===n&&s.time-e.at<.16);if(blockedIncoming)p.botCounterUntil=s.time+.4;
 const base={...empty(),aim:a,x:blocked?-Math.sin(a)*side*.8:Math.cos(a)*(range>260?.8:range<150?-.35:0),y:blocked?Math.cos(a)*side*.8:Math.sin(a)*(range>260?.8:range<150?-.35:0)};
 const set=(intent:string,i:Partial<InputState>)=>{p.botIntent=intent;p.input={...base,...i};};
 // Persist flank direction, detect lack of progress, and choose a clear local step.
 if(s.time>=(p.botProbeAt||0)){if(p.botProbeX!==undefined&&Math.hypot(p.x-p.botProbeX,p.y-(p.botProbeY||0))<10&&Math.hypot(p.input.x,p.input.y)>.3){p.botEscapeUntil=s.time+1.1;p.botRouteSide=-(p.botRouteSide||side);}p.botProbeAt=s.time+.7;p.botProbeX=p.x;p.botProbeY=p.y;}
 const safe=(x:number,y:number)=>{const q={x:p.x+x*55,y:p.y+y*55};return q.x>=90&&q.x<=910&&q.y>=110&&q.y<=530&&!s.covers.some(cv=>cv.hp>0&&segmentCover(p,q,{...cv,w:cv.w+30,h:cv.h+30}));};
 const route=p.botRouteSide??side,escaping=s.time<(p.botEscapeUntil||0);
 if(blocked||escaping){let best=-Infinity;for(const angle of [a+route*Math.PI/2,a+route*.8,a-route*.8,a-route*Math.PI/2,a+Math.PI,a]){const x=Math.cos(angle)*.8,y=Math.sin(angle)*.8;if(!safe(x,y))continue;const score=escaping?Math.cos(angle-a-route*Math.PI/2):Math.cos(angle-a)*.4+Math.sin(angle-a)*route*.6;if(score>best){best=score;base.x=x;base.y=y;}}if(!Number.isFinite(best)){base.x=base.y=0;}}
 const own=s.covers.filter(cv=>cv.constructOwner===n&&cv.hp>0),resources=fieldMatter(p,s),recipe=resources.filter(m=>m.kind==="stone").length>=2&&resources.some(m=>m.kind==="metal");
 if((p.blastUntil||0)>s.time&&(p.blastCharge||0)>0&&!blocked){set("TURNING KICK → GLOVE BLAST",{fire:!p.processedInput.fire,x:0,y:0});return;}
 if(p.meleeCombo){const spec=MELEE_38[p.meleeCombo.stage],age=s.time-p.meleeCombo.started,total=spec.startup+spec.active+spec.recovery;set("PHYSICAL COMBO → "+spec.name,{melee:p.meleeCombo.stage<3&&age>=total-.15&&!p.meleeCombo.queued&&!p.processedInput.melee,fire:false,x:range>55?Math.cos(a)*.25:0,y:range>55?Math.sin(a)*.25:0});return;}
 if(range<74&&!blocked&&p.knock<=0&&!p.charging&&s.time>=(p.botRecoverAfter||0)&&!p.gripCoverId&&!p.gripId&&!p.orbitIds.length){set("CLOSE OPENING → PHYSICAL COMBO",{melee:!p.processedInput.melee,fire:false,x:0,y:0});return;}
 // Commit to a recharge until 90 or a bounded interruption window; never fire/shield while holding Y.
 if(p.battery<32||(recipe&&own.length<2&&p.battery<43)||p.charging){p.botRechargeUntil??=s.time+4;}
 if(p.botRechargeUntil!==undefined){
  if(p.battery>=80||s.time>=p.botRechargeUntil){p.botRechargeUntil=undefined;p.botNextBuild=s.time+.8;p.botRecoverAfter=s.time+.5;set(p.battery>=80?"CHARGE COMPLETE → RE-ENGAGE":"RECHARGE WINDOW → REPOSITION",{x:base.x,y:base.y});return;}
  const incoming=s.shots.some(sh=>sh.owner!==n&&sh.life>0&&dist(sh,p)<150);
  const exposed=!blocked&&range<300,unsafe=p.knock>0||incoming||exposed;
  if(unsafe){p.botRecoverAfter=s.time+.3;const rx=-Math.cos(a)*.8,ry=-Math.sin(a)*.8;set("BREAK LINE → SAFE RECHARGE",{powerup:false,x:safe(rx,ry)?rx:base.x,y:safe(rx,ry)?ry:base.y,slide:p.battery>=s.config.dashEnergy&&s.time>=(p.botEscapeUntil||0)&&!p.processedInput.slide});if(p.input.slide)p.botEscapeUntil=s.time+.8;return;}
  if(s.time<(p.botRecoverAfter||0)||p.powerBlocked){set("RECOVER → REPOSITION",{powerup:false});return;}
  set("PROTECTED WINDOW → RECHARGE",{powerup:true,x:blocked?0:base.x,y:blocked?0:base.y});return;
 }
 // Observe actual completed creation, then acquire that same shell with ordinary Grip input.
 if(p.botBuildAt!==undefined&&!p.botBuildId){const built=own.find(cv=>(cv.born??-1)>=p.botBuildAt-.05);if(built)p.botBuildId=built.id;else if(s.time-p.botBuildAt>.2)p.botBuildAt=undefined;}
 if(p.botBuildId&&!p.gripCoverId){const built=s.covers.find(cv=>cv.id===p.botBuildId&&cv.hp>0);if(!built||dist(built,p)>psychicField(p).radius){p.botBuildId=undefined;p.botBuildAt=undefined;}else if(s.time-(p.botBuildAt||0)<2.2){set("CONSTRUCT → PSYCHIC GRIP",{x:0,y:0,aim:Math.atan2(built.y-p.y,built.x-p.x),grip:!p.processedInput.grip});return;}else{p.botBuildId=undefined;p.botBuildAt=undefined;}}
 if(p.gripCoverId||p.gripId||p.orbitIds.length){if(p.botGripSince===undefined&&s.botStrategy==="adaptive")p.botGripStyle=preferredGripStyle(s,n,p.botGripStyle??((s.round+n)%3));p.botGripSince??=s.time;const age=s.time-p.botGripSince;
  if(p.orbitIds.length){set("ORBIT → AIM → THROW",{grip:true,fire:!p.processedInput.fire&&age>.08});return;}
  const heldObject=s.covers.find(cv=>cv.id===p.gripCoverId)||s.matter.find(m=>m.id===p.gripId);
  const chosen=p.botGripStyle??((s.round+n)%3),defensive=blocked||t.input.fire&&range<260||p.hp<s.config.maxHealth*.25,style=chosen===0&&!defensive?1:chosen,settle=false,angle=a,magnitude=style===0?.16:style===1?.55:1;
  const held=s.covers.find(cv=>cv.id===p.gripCoverId)||s.matter.find(m=>m.id===p.gripId),radialSpeed=held?(((held.vx||0)-p.vx)*(held.x-p.x)+((held.vy||0)-p.vy)*(held.y-p.y))/Math.max(1,dist(held,p)):0;
  const minimum=held&&"w" in held?Math.hypot(held.w,held.h)/2+19:42,radial=held?clamp((dist(held,p)-minimum)/Math.max(1,psychicField(p).radius-8-minimum),0,1):0;
  const ready=style===0?age>.08&&radial<.14&&Math.hypot(held?.vx||0,held?.vy||0)<100:age>.08&&radialSpeed>(style===2?95:45)&&radial>(style===2?.34:.12);
  // A blocked gesture gets an ordinary RT throw after a bounded wait.
  const constrained=!!(heldObject&&"carryBlockedAt" in heldObject&&s.time-(heldObject.carryBlockedAt??-9)<.1);
  const explicit=!ready&&(constrained&&age>.18||age>.85),strafeX=-Math.sin(a)*side*.35,strafeY=Math.cos(a)*side*.35,arcStep=settle&&safe(strafeX,strafeY);
  set(settle?"GRIP → ARC → SETTLE":ready?style===0?"PLACE → RELEASE LB":style===1?"SLIDE → RELEASE LB":"FLING → RELEASE LB":explicit?"BLOCKED GRIP → RT THROW":"GRIP → PUSH OUTWARD",{grip:!ready,fire:explicit,gripX:Math.cos(angle)*magnitude,gripY:Math.sin(angle)*magnitude,x:blocked?base.x:arcStep?strafeX:0,y:blocked?base.y:arcStep?strafeY:0});return;}
 p.botGripSince=undefined;p.botBuildId=undefined;p.botBuildAt=undefined;
 if(s.time<(p.botReleaseUntil||0)){set("THROW → RELEASE TRIGGER",{fire:false});return;}
 if(s.time<(p.botFollowUntil||0)){set("THROW → ADVANCE → ATTACK",{x:blocked?base.x:Math.cos(a),y:blocked?base.y:Math.sin(a),slide:range>200&&!p.processedInput.slide&&p.dash<=0&&p.slide<=0,fire:!blocked&&range>=74,melee:range<74&&!p.processedInput.melee});return;}
 if(p.coverId){set(p.coverMode==="soft"?"SOFT COVER → BRACE":"BRACE → EXPOSE → FIRE",{slide:p.coverMode==="soft",coverAim:true,fire:!blocked||p.coverMode==="braced",x:0,y:0});if(cycle>9){set("COVER → ESCAPE",{slide:!p.processedInput.slide,x:-Math.cos(a),y:-Math.sin(a)});}return;}
 const incoming=s.shots.some(sh=>sh.owner!==n&&sh.life>0&&Math.hypot(sh.x-p.x,sh.y-p.y)<125&&((p.x-sh.x)*sh.vx+(p.y-sh.y)*sh.vy)>0);
 const incomingCover=s.covers.some(cv=>cv.hp>0&&cv.build<0&&cv.throwOwner!==n&&Math.hypot(cv.vx||0,cv.vy||0)>160&&dist(cv,p)<Math.hypot(cv.w,cv.h)/2+125&&((p.x-cv.x)*(cv.vx||0)+(p.y-cv.y)*(cv.vy||0))>0);
 if((incoming||incomingCover)&&!p.coverId&&p.battery>=22&&s.time>=(p.botNextGuard||0)){p.botGuardUntil=s.time+(incomingCover?.32:.22);p.botNextGuard=s.time+1.8;}
 if(s.time<(p.botGuardUntil||0)){set(incomingCover?"INCOMING COVER → SHIELD":"INCOMING SHOTS → SHIELD",{shield:true,x:0,y:0,fire:false});return;}
 if(!blocked&&p.battery>=43&&(t.charging||s.time<(p.botCounterUntil||0))){set(t.charging?"PUNISH EXPOSED CHARGE":"SHIELD BLOCK → COUNTER",{shield:false,fire:true,x:range>230?Math.cos(a)*.8:0,y:range>230?Math.sin(a)*.8:0,melee:range<62&&!p.processedInput.melee});return;}
 if(own.length<2&&recipe&&p.battery>=43&&s.time>=(p.botNextBuild??(2.2+n*.4))&&!p.processedInput.cover){const angle=[a+side*Math.PI/3,a-side*Math.PI/3,a+side*Math.PI/2,a-side*Math.PI/2,a+Math.PI].find(angle=>constructionPlacement(p,s,n,angle));if(angle!==undefined){p.botBuildAt=s.time;p.botNextBuild=s.time+6;set("SALVAGE → BUILD COVER",{cover:true,x:0,y:0,aim:angle});return;}p.botNextBuild=s.time+.65;p.botEscapeUntil=s.time+.65;set("NO BUILD SPACE → REPOSITION",{x:base.x,y:base.y});return;}
 if(cycle<3&&p.battery>30&&s.time>=(p.botAvoidGrabUntil||0)){if(resources.length&&((s.round+n)%2===0)){set("GATHER → ORBIT",{orbit:!p.processedInput.orbit});return;}const cv=s.covers.filter(cv=>!cv.protected45&&cv.hp>0&&dist(cv,p)<psychicField(p).radius&&!s.players.some(q=>q.coverId===cv.id||q.gripCoverId===cv.id)).sort((x,y)=>dist(x,p)-dist(y,p))[0];if(cv){set("SELECT COVER → GRIP",{aim:Math.atan2(cv.y-p.y,cv.x-p.x),grip:true,fire:false});return;}if(fieldMatter(p,s).length){set("GATHER → ORBIT",{orbit:!p.processedInput.orbit});return;}}
 if(cycle>=3&&cycle<6&&!blocked&&p.battery>25){if(p.botTimeEnd===undefined)p.botTimeEnd=s.time+1.4;set("BULLET FIELD → VOLLEY → RELEASE",{slow:!p.timeFieldActive&&s.time<p.botTimeEnd||!!p.timeFieldActive&&s.time>=p.botTimeEnd,fire:true});return;}
 p.botTimeEnd=undefined;
 if(p.timeFieldActive){set("RELEASE BULLET FIELD",{slow:!p.processedInput.slow});return;}
 if(!recipe&&own.length<2&&p.battery>45&&cycle>=6&&cycle<9){const need=resources.filter(m=>m.kind==="stone").length<2?"stone":"metal",salvage=s.matter.filter(m=>m.life>0&&m.kind===need&&m.heldBy===null&&m.orbitBy===null&&Math.hypot(m.vx,m.vy)<140).sort((x,y)=>dist(x,p)-dist(y,p))[0];if(salvage){const angle=Math.atan2(salvage.y-p.y,salvage.x-p.x),x=Math.cos(angle)*.7,y=Math.sin(angle)*.7;set("REPOSITION → SALVAGE",{x:safe(x,y)?x:base.x,y:safe(x,y)?y:base.y});return;}}
 if(range>260&&!blocked&&p.battery>55&&cycle>=8&&cycle<8.05&&!p.processedInput.pinball){set("PINBALL → CLOSE DISTANCE",{pinball:true});return;}
 const heavy=range<62&&p.battery>30&&cycle>=8&&cycle<9;
 const guard=opponent.fire&&!blocked&&cycle>9.5&&cycle<10.3;
 set(guard?"SHIELD → COUNTER":heavy?"HEAVY GAUNTLET → SHOTGUN":range<62?"MELEE → SHOTGUN":blocked?"FLANK BLOCKED SIGHTLINE":"ADVANCE → SHOTGUN",{shield:guard,fire:!guard&&!blocked&&range<450&&(s.time+n*.25)%1.1<.45,heavy:heavy&&!p.processedInput.heavy,melee:!heavy&&range<62&&!p.processedInput.melee,slide:range>330&&!blocked&&(s.time+n*.3)%4<.03});
}
function botInput(s:GameState){
 if(s.mode==="watch"||s.mode==="practice"){const prior=s.players.map(p=>({...p.input}));for(let n=0;n<s.players.length;n++)if(s.players[n].bot)watchBotInput(s,n,prior[1-n]);return;}
 const n=s.players.findIndex(p=>p.bot);if(n<0)return;const p=s.players[n],t=s.players[1-n];if(!t)return;const a=Math.atan2(t.y-p.y,t.x-p.x),d=dist(p,t),blocked=s.covers.some(cv=>cv.hp>0&&segmentCover(p,t,cv)),side=Math.sin(s.time*.7)>=0?1:-1;
 p.input={...empty(),x:blocked?-Math.sin(a)*side*.65:Math.cos(a)*(d>260?.7:d<140?-.4:0),y:blocked?Math.cos(a)*side*.65:Math.sin(a)*(d>260?.7:d<140?-.4:0),aim:a,fire:!blocked&&d<520&&s.time%1.4<.1};
}
// A fresh Y press cancels voluntary actions; only already-held buttons are
// consumed until released. New combat inputs and incoming hits still interrupt.
function chargeIntent(p:Player,s:GameState,raw:InputState,dt:number){
 const i={...raw},fresh=raw.powerup&&!p.processedInput.powerup;
 const actions=["fire","shield","coverAim","slide","melee","heavy","grip","throwMatter","cover","orbit","launchOrbit","pinball","slow","powerUse"];
 if(fresh&&!p.powerBlocked&&p.knock<=0&&(!p.godTime||p.godTime>dt&&p.battery>s.config.godDrain*dt)){
  p.chargeSuppressed=actions.filter(key=>(raw as any)[key]);
  p.timeFieldActive=false;p.meleeCombo=undefined;p.meleeNextStage=undefined;p.blastUntil=0;p.pendingMelee=undefined;p.pendingFireUntil=undefined;releaseOrbit(p,s);p.slide=p.dash=p.pinball=p.brake=0;p.exit=null;p.kickStage="none";p.kickTime=0;p.shield=false;p.peek=false;
  if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}p.gripCoverId=null}
  if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m){m.heldBy=null;m.vx=m.vy=0;m.throwOwner=undefined;}p.gripId=null}
 }
 if(!raw.powerup)p.chargeSuppressed=[];
 else{p.chargeSuppressed=(p.chargeSuppressed||[]).filter(key=>(raw as any)[key]);for(const key of p.chargeSuppressed)(i as any)[key]=false}
 return i;
}
function step(s:GameState,dt:number,prev:InputState[]){const before=s.players.map(p=>({...p,orbitIds:[...p.orbitIds]})),requests=s.players.map((p,n)=>actionRequests(p,p.input,prev[n]||empty(),s.time)),firstSeq=s.actionSeq||0;requests.forEach((xs,n)=>xs.forEach(action=>actionOutcome(s,n,action,"attempted")));const c=s.config,rawInputs=s.players.map(p=>p.input),playerStarts=s.players.map(p=>({x:p.x,y:p.y}));
 s.players.forEach((p,n)=>p.input=chargeIntent(p,s,rawInputs[n],dt));
 if(combatFight(s))s.players.forEach(p=>p.shield=p.input.shield&&!p.coverId&&p.battery>0);
 const d=dt;s.timeScale=1; // Projectile time never slows bodies or action timers.
 for(let n=0;n<s.players.length;n++){const p=s.players[n],i=p.input,wasHolding=!!(p.gripId||p.gripCoverId||p.orbitIds.length);if(p.hp<=0)p.timeFieldActive=false;p.aim=i.aim;powerStep(p,s,dt);
  const coverContext=!!p.coverId;
  // PASS07: soft cover stays mobile/athletic. A commits hard brace; LT only plants an existing hard brace.
  const moveAngle=Math.hypot(p.vx,p.vy)>35?Math.atan2(p.vy,p.vx):p.gunFacing;
  if(p.charging&&!p.coverId){if(Math.hypot(i.x,i.y)>.18)p.gunFacing=Math.atan2(i.y,i.x)}
  else if(p.coverId&&p.coverMode==="braced"&&i.coverAim)p.gunFacing=i.aim;
  else{const maxTwist=145*Math.PI/180,deltaAim=Math.atan2(Math.sin(i.aim-moveAngle),Math.cos(i.aim-moveAngle));p.gunFacing=moveAngle+clamp(deltaAim,-maxTwist/2,maxTwist/2)}
  p.fireState=Math.max(0,p.fireState-dt);p.recoil=Math.max(0,p.recoil-dt);p.returnToCover=Math.max(0,p.returnToCover-dt);p.boostState=Math.max(0,p.boostState-dt);p.brakeState=Math.max(0,p.brakeState-dt);
  const beforeEnergy=p.battery;edgeActions(s,n,prev[n]||empty());if(p.battery<beforeEnergy)p.lastEnergyAt=s.time;p.shield=i.shield&&!coverContext&&!p.coverId&&p.battery>0;if(p.shield)p.battery=Math.max(0,p.battery-18*dt);if(p.timeFieldActive&&p.battery>0)p.battery=Math.max(0,p.battery-(PROJECTILE_TIME.baseDrain+PROJECTILE_TIME.pelletDrain*(p.timePellets||0))*dt);if(p.gripId||p.gripCoverId||p.orbitIds.length)p.battery=Math.max(0,p.battery-c.holdEnergy*dt);const constructs=s.covers.filter(cv=>cv.constructOwner===n&&cv.hp>0).length;if(constructs)p.battery=Math.max(0,p.battery-constructs*dt);if(p.shield||p.timeFieldActive||p.gripId||p.gripCoverId||p.orbitIds.length||constructs)p.lastEnergyAt=s.time;else if(!p.charging&&!p.godTime&&s.time-(p.lastEnergyAt??-9)>=c.rechargeDelay&&!p.slide&&!p.dash&&!p.kickStage?.match(/burst|step/))p.battery=Math.min(100,p.battery+c.rechargeRate*dt);
  if(p.coverMode==="braced"&&prev[n]?.coverAim&&!i.coverAim)p.returnToCover=Math.max(p.returnToCover,.16);
  if(p.battery<=0){p.timeFieldActive=false;releaseOrbit(p,s);if(p.gripId){const held=s.matter.find(m=>m.id===p.gripId);if(held){held.heldBy=null;held.vx=held.vy=0;held.throwOwner=undefined;}p.gripId=null}if(p.gripCoverId){const cv=s.covers.find(cv=>cv.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}}p.gripCoverId=null}
  p.brake=Math.max(0,p.brake-dt);p.slideCool=Math.max(0,p.slideCool-dt);
  if(p.kickStage!=="none"){
    p.kickTime-=dt;
    if(p.kickTime<=0&&p.kickStage==="burst"){p.kickStage="step";p.kickTime=.09;p.vx=(Math.cos(p.kickAngle)*c.moveSpeed+p.kickNx*81)*(p.kickScale??1);p.vy=(Math.sin(p.kickAngle)*c.moveSpeed+p.kickNy*81)*(p.kickScale??1)}
    else if(p.kickTime<=0&&p.kickStage==="step"){p.kickStage="none";p.slide=c.slideDuration;p.vx=Math.cos(p.kickAngle)*c.slideSpeed*(p.kickScale??1);p.vy=Math.sin(p.kickAngle)*c.slideSpeed*(p.kickScale??1);p.slideFacing=p.kickAngle}
    p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);collide(p,s)
  }
  else if(p.knock>0){p.knock-=dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);if(combatFight(s)&&!p.coverId){p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);collide(p,s);}}
  else if(p.exit){stepCoverExit(p,s,d)}
  // A edges are handled exactly once by slideAction; LT planting remains in moveOnCover.
  else if(p.coverId){moveOnCover(p,s,i,d)}
  else if(combatFight(s)&&p.shield&&p.slide<=0&&p.dash<=0){p.vx=p.vy=0;}
  else if(p.dash>0){
    const dashBefore=p.dash,phase=1-clamp(dashBefore/Math.max(.001,c.dashDuration),0,1);
    p.dash=Math.max(0,p.dash-dt);
    // KINETIC WEAVE LOCK 10: Advanced-Warfare-class response shape.
    // First ~58% holds the committed vector; final segment releases weight smoothly.
    if(phase>=.58){const release=(phase-.58)/.42,damp=.055-.03*clamp(release,0,1);p.vx*=Math.pow(damp,dt);p.vy*=Math.pow(damp,dt)}
    p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);slideCapture(p,s);collide(p,s);
  }
  else if(p.slide>0||p.pinball>0){
    p.slide=Math.max(0,p.slide-dt);p.pinball=Math.max(0,p.pinball-dt);
    if(p.slide>0){
      const speed=Math.hypot(p.vx,p.vy)||1,travel=Math.atan2(p.vy,p.vx),mag=Math.hypot(i.x,i.y);
      // Base Jade Kinetic Brake: promote the previously playtested weave brake into Classic
      // without enabling weave steering, mini-boost, or changing top/slide speed.
      if(mag>.12){
        const inputA=Math.atan2(i.y,i.x),delta=Math.atan2(Math.sin(inputA-travel),Math.cos(inputA-travel)),forward=Math.cos(delta);
        if(forward<-.15){
          const brake=Math.max(0,1-c.slideBrake*d);p.vx*=brake;p.vy*=brake;
          if(Math.hypot(p.vx,p.vy)<c.slideCancelSpeed){
            p.slide=0;p.slideSteerCurrent=0;p.brake=.18;p.brakeState=.24;
            const residual=.22,redirect=Math.max(0,Math.min(1,mag))*c.moveSpeed*.38;
            p.vx=p.vx*residual+i.x*redirect;p.vy=p.vy*residual+i.y*redirect;
            const oldAngle=travel,newAngle=Math.atan2(i.y,i.x),redirectAngle=Math.abs(wrap(newAngle-oldAngle)),hard=redirectAngle>Math.PI*.42&&speed>c.slideSpeed*.62;
            s.fx.push({id:uid(),type:"brake",x:p.x,y:p.y,life:.42,owner:n,text:hard?"SKRRK!":"",entrySpeed:speed,oldAngle,newAngle,redirectAngle,hard} as any);
          }
        }else if(c.weaveEnabled>=.5){
          const targetSteer=clamp(delta,-c.slideSteerAngle,c.slideSteerAngle)*c.slideSteer,steerBlend=1-Math.exp(-c.slideSteerResponse*d);
          p.slideSteerCurrent+=(targetSteer-p.slideSteerCurrent)*steerBlend;const next=travel+p.slideSteerCurrent*d,boost=Math.max(0,forward)*c.slideSustain*d,newSpeed=Math.min(c.slideSpeed*1.08,speed+boost);
          p.vx=Math.cos(next)*newSpeed;p.vy=Math.sin(next)*newSpeed;p.slideFacing=next;
        }else{p.vx*=Math.pow(c.slideDrag,d);p.vy*=Math.pow(c.slideDrag,d)}
      }else{p.vx*=Math.pow(c.weaveEnabled>=.5?.12:c.slideDrag,d);p.vy*=Math.pow(c.weaveEnabled>=.5?.12:c.slideDrag,d)}
    }else{p.vx*=Math.pow(.72,d);p.vy*=Math.pow(.72,d)}
    p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);slideCapture(p,s);collide(p,s)
  }
  else{const chargeMove=p.chargeMotion??1,r=1-Math.exp(-c.response*d),m=Math.hypot(i.x,i.y);p.vx+=(i.x*c.moveSpeed*chargeMove-p.vx)*r;p.vy+=(i.y*c.moveSpeed*chargeMove-p.vy)*r;if(m<.05){p.vx*=Math.pow(c.stopDrag,d);p.vy*=Math.pow(c.stopDrag,d)}p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);collide(p,s)}
  const holding=!!(p.gripId||p.gripCoverId||p.orbitIds.length);if(holding&&!wasHolding){p.psychicStartedAt=s.time;p.psychicReturnUntil=0}else if(!holding&&wasHolding)p.psychicReturnUntil=s.time+.16;
  meleeStep(s,n);
  if(p.pendingFireUntil!==undefined&&(s.time>p.pendingFireUntil||p.hp<=0||p.charging||i.grip||p.gripId||p.gripCoverId||p.orbitIds.length||p.fireBlocked))p.pendingFireUntil=undefined;
  if(i.fire&&!prev[n]?.fire&&!p.meleeCombo&&s.time>=(p.blastPoseAt??-9)+.3&&!p.charging&&!i.grip&&!p.gripId&&!p.gripCoverId&&!p.orbitIds.length&&!p.fireBlocked)p.pendingFireUntil=s.time+.12;
  if((i.fire||p.pendingFireUntil!==undefined)&&!p.meleeCombo&&s.time>=(p.blastPoseAt??-9)+.3&&!p.charging&&p.powerReturn<=0&&!p.fireBlocked&&!p.gripId&&!p.gripCoverId&&s.time-p.lastShot>=c.shotCadence*(p.godTime>0?.7:1)&&(!p.coverId||p.coverMode==="soft"||i.coverAim)){
   const attachedCover=p.coverId?s.covers.find(cv=>cv.id===p.coverId):undefined;
   const muzzle=muzzleSocket(p),physical=coverMuzzleClearance(p,attachedCover,muzzle,p.gunFacing);
   // PASS06 TRIGGER AUTHORITY: cover never vetoes a ready trigger. If exposure
   // is invalid, the attached cover remains collidable and consumes the blast.
   const clearance=physical.allowed?physical.clearance:undefined;
   const exposedD03=!!clearance&&muzzle.dir===3,artUnit=(125*143/250/638)*c.spriteScale;
   const neighbor=!!clearance?(muzzle.dir===2?{anchor:[1202,525.1677115987461],muzzle:[1424,97]}:muzzle.dir===4?{anchor:[1189,993.1677115987461],muzzle:[1420,624]}:null):null,neighborUnit=125*143/250/445*c.spriteScale;
   if(exposedD03)muzzle.x=p.x+(1688-1363)*artUnit;
   if(neighbor)muzzle.x=p.x+(neighbor.muzzle[0]-neighbor.anchor[0])*neighborUnit;
   const renderOffsetX=0,shotHeight=neighbor?(muzzle.y-p.y)+(neighbor.anchor[1]-neighbor.muzzle[1])*neighborUnit:exposedD03?(muzzle.y-p.y)+(814-250)*artUnit:clearance?Math.max(44*c.spriteScale,15616/332+4):44*c.spriteScale;
   const volleyId=uid();p.pendingFireUntil=undefined;actionOutcome(s,n,"shotgun","activated",undefined,undefined,undefined,volleyId);p.lastShot=s.time;p.fireState=.11;p.recoil=.12;p.weaponState="FIRE";
   // Foundation only: counters are explicit/configurable, but EMPTY/RELOAD gating is deferred
   // until the duel-balance pass so this playtest measures trigger/cadence without a reload interruption.
   if(typeof p.shells==="number")p.shells=Math.max(0,p.shells-1);
   if(p.coverId)p.returnToCover=.28;
   for(let j=-3;j<=3;j++){const a=p.gunFacing+j*c.shotSpread;s.shots.push({id:uid(),attackId:volleyId,source:"shotgun",volleyId,realAge:0,owner:n,x:muzzle.x,y:muzzle.y,vx:Math.cos(a)*c.shotSpeed,vy:Math.sin(a)*c.shotSpeed,life:.5,damage:c.shotDamage*(p.godTime>0?c.godDamage:1),z:shotHeight,renderOffsetX,clearanceCoverId:clearance})}
   s.fx.push({id:uid(),type:"muzzle",x:muzzle.x,y:muzzle.y,life:.18,owner:n,z:shotHeight,renderOffsetX,text:"BOOM",angle:p.gunFacing});
  }
 }
 for(const cv of s.covers){if(cv.constructOwner===undefined||cv.hp<=0)continue;const owner=s.players[cv.constructOwner];if(!owner||owner.hp<=0||owner.battery<=0||dist(cv,owner)>psychicField(owner).radius)dissolveFieldCover(cv,s);}

 for(let n=0;n<s.players.length;n++){
   const p=s.players[n];if(!p.gripCoverId)continue;const cv=s.covers.find(c=>c.id===p.gripCoverId);if(!cv){p.gripCoverId=null;continue}
   carryCoverSwept(cv,p,s,d);
 }
 for(const cv of s.covers){
   if(cv.build>=0||cv.hp<=0)continue;
   cv.vx??=Math.cos(cv.a-Math.PI/2)*-cv.build;cv.vy??=Math.sin(cv.a-Math.PI/2)*-cv.build;
   const parts=Math.max(1,Math.ceil(Math.hypot(cv.vx,cv.vy)*d/8));
   for(let k=0;k<parts&&cv.hp>0;k++){cv.x+=cv.vx*d/parts;cv.y+=cv.vy*d/parts;settleCover(cv,s);if(combatFight(s)&&cv.hp>0&&Math.hypot(cv.vx||0,cv.vy||0)>160)for(let n=0;n<s.players.length;n++){
    if(n===cv.throwOwner||s.players[n].hp<=0||cv.hitIds?.includes("player-"+n))continue;const target=s.players[n],q=localPoint(cv,target.x,target.y);
    if(Math.hypot(q.x-clamp(q.x,-cv.w/2,cv.w/2),q.y-clamp(q.y,-cv.h/2,cv.h/2))<=17){(cv.hitIds??=[]).push("player-"+n);const speed=Math.hypot(cv.vx||0,cv.vy||0),damage=Math.min(100,speed*(bayObject(cv.artId||cv.id)?.mass||9)/90),shielding=target.shield&&target.input.shield&&!target.coverId&&target.battery>0,cost=damage*.22,available=target.battery;
     // One shield contest per release: impact consumes energy; an overwhelmed block passes residual force.
     if(shielding&&available>=cost){spendEnergy(target,s,cost);combatEvent(s,{kind:"shield",incomingAngle:Math.atan2(-(cv.vy||0),-(cv.vx||0)),source:"cover-throw",attackId:cv.attackId,owner:cv.throwOwner??1-n,target:n,damage:0,x:target.x,y:target.y,z:28});s.fx.push({id:uid(),type:"shield-block",x:target.x,y:target.y,z:28,life:.22,owner:cv.throwOwner});}
     else{const residual=shielding?1-available/Math.max(.001,cost):1;if(shielding){target.battery=0;target.lastEnergyAt=s.time;target.shield=false;s.fx.push({id:uid(),type:"shield-block",x:target.x,y:target.y,z:28,life:.22,owner:cv.throwOwner});}duelContact(s,cv.throwOwner??1-n,target,damage*residual,(cv.vx||0)*.25*residual,(cv.vy||0)*.25*residual,"torso",undefined,"cover-throw",cv.attackId);}
     damageCover(cv,s,damage);cv.vx*=shielding?.2:.35;cv.vy*=shielding?.2:.35;}
   }}
   if(combatFight(s)&&Math.hypot(cv.vx,cv.vy)>80&&s.time-(cv.scarAt??-9)>.09){cv.scarAt=s.time;const scars=s.fx.filter(f=>f.type==="cover-scrape");if(scars.length<24)s.fx.push({id:uid(),type:"cover-scrape",x:cv.x,y:cv.y,life:1.8,angle:Math.atan2(cv.vy,cv.vx),text:bayObject(cv.artId||cv.id)?.material==="CONCRETE"?"stone":"metal"});}
   cv.vx*=Math.pow(.09,d);cv.vy*=Math.pow(.09,d);cv.build=-Math.hypot(cv.vx,cv.vy);
   if(-cv.build<35){cv.build=0;cv.vx=cv.vy=0}
 }
 for(const m of s.matter){
  if(m.heldBy!==null){const p=s.players[m.heldBy];if(Number.isFinite(p.input.gripX)){const target=gripTarget(p,s,42),ox=m.x,oy=m.y,angle=Math.atan2(m.y-p.y,m.x-p.x),r=dist(m,p),next=angle+clamp(wrap(target.angle-angle),-4*GRIP_STRENGTH*d,4*GRIP_STRENGTH*d),nr=r+(target.radius-r)*(1-Math.exp(-c.carryResponse*GRIP_STRENGTH*d));const to={x:clamp(p.x+Math.cos(next)*nr,A.left+m.r,A.right-m.r),y:clamp(p.y+Math.sin(next)*nr,A.top+m.r,A.bottom-m.r)};if(!s.covers.some(cv=>cv.hp>0&&segmentCover({x:ox,y:oy},to,{...cv,w:cv.w+2*m.r,h:cv.h+2*m.r}))){m.x=to.x;m.y=to.y;m.vx=(m.x-ox)/Math.max(.001,d);m.vy=(m.y-oy)/Math.max(.001,d);gripDrive(p,s,m,clamp((nr-42)/Math.max(1,target.maximum-42),0,1));}else{m.vx=m.vy=0;p.gripDrive=0;}}else{m.x=clamp(p.x+Math.cos(p.aim)*70,A.left,A.right);m.y=clamp(p.y+Math.sin(p.aim)*70,A.top,A.bottom);}continue}
  if(m.orbitBy!==null){const p=s.players[m.orbitBy],j=p.orbitIds.indexOf(m.id),a=s.time*4+j*2.1;m.x=clamp(p.x+Math.cos(a)*62,A.left,A.right);m.y=clamp(p.y+Math.sin(a)*62,A.top,A.bottom);continue}
  scatterMatter42(m,s,playerStarts,d);
  const from={x:m.x,y:m.y};m.x+=m.vx*d;m.y+=m.vy*d;
  if(m.groundScatter&&m.throwOwner===undefined){let first=Infinity;for(const cv of s.covers){if(cv.hp<=0)continue;const t=segmentCoverTime(from,m,{...cv,w:cv.w+2*m.r,h:cv.h+2*m.r});if(t!==null)first=Math.min(first,t);}if(Number.isFinite(first)){m.x=from.x+(m.x-from.x)*Math.max(0,first-.01);m.y=from.y+(m.y-from.y)*Math.max(0,first-.01);m.vx*=-.35;m.vy*=-.35;}}
  else if(combatFight(s))matterContactSwept(m,from,s,playerStarts);
  m.vx*=Math.pow(.35,d);m.vy*=Math.pow(.35,d);if(m.life<999)m.life-=dt;
  if(m.x<A.left||m.x>A.right){m.x=clamp(m.x,A.left,A.right);m.vx*=-.6}if(m.y<A.top||m.y>A.bottom){m.y=clamp(m.y,A.top,A.bottom);m.vy*=-.6}
 }
 const fields=projectileFields(s,dt);
 for(const sh of s.shots){
  if(sh.life<=0)continue;sh.realAge=(sh.realAge||0)+dt;if(sh.realAge>PROJECTILE_TIME.maxAge){sh.life=0;continue;}
  const segments=projectileSegments(sh,fields.filter(f=>sh.fieldOwners?.includes(f.slot)),dt);
  for(const segment of segments){if(sh.life<=0)break;const from={x:sh.x,y:sh.y};sh.x=segment.x;sh.y=segment.y;sh.life-=segment.travelTime;sh.projectileScale=segment.scale;
  const z=sh.z??36*c.spriteScale,target=s.players[1-sh.owner];let nearest=Infinity,block:Cover|undefined;
  for(const cv of s.covers){if(cv.hp<=0||cv.id===sh.clearanceCoverId)continue;const height=bayObject(cv.artId||cv.id)?.dimensions.z??(cv.coverClass==="tall"?78:15616/332);if(z>height)continue;const t=segmentCoverTime(from,sh,sh.source==="glove-blast"?{...cv,w:cv.w+16,h:cv.h+16}:cv);if(t!==null&&t<nearest){nearest=t;block=cv}}
  const hit=target&&target.hp>0?shotPlayerTime(from,sh,z,{...target,x:playerStarts[1-sh.owner].x+(target.x-playerStarts[1-sh.owner].x)*segment.end,y:playerStarts[1-sh.owner].y+(target.y-playerStarts[1-sh.owner].y)*segment.end},{x:playerStarts[1-sh.owner].x+(target.x-playerStarts[1-sh.owner].x)*segment.start,y:playerStarts[1-sh.owner].y+(target.y-playerStarts[1-sh.owner].y)*segment.start},c.spriteScale,sh.source==="glove-blast"?8:0):null;
  if(hit&&hit.t<nearest){const point={x:from.x+(sh.x-from.x)*hit.t,y:from.y+(sh.y-from.y)*hit.t,z};duelContact(s,sh.owner,target,(sh.damage??c.shotDamage)*REGION_DAMAGE[hit.region],sh.vx*.1,sh.vy*.1,hit.region,point,sh.source||"shotgun",sh.attackId||sh.volleyId);sh.life=0;}
  else if(block){const point={x:from.x+(sh.x-from.x)*nearest,y:from.y+(sh.y-from.y)*nearest,z},material=bayObject(block.artId||block.id)?.material==="CONCRETE"?"stone":"metal";damageCover(block,s,sh.damage??c.shotDamage);combatEvent(s,{kind:"cover",source:sh.source||"shotgun",attackId:sh.attackId||sh.volleyId,owner:sh.owner,damage:sh.damage??c.shotDamage,material,...point});sh.life=0;s.fx.push({id:uid(),type:"cover-hit",life:.25,owner:sh.owner,text:material,...point});}
 }
 }

 if(s.mode!=="solo"&&s.phase==="playing"&&s.players.some(p=>p.hp<=0)){
  const alive=s.players.map((p,n)=>p.hp>0?n:-1).filter(n=>n>=0);s.winner=alive.length===1?alive[0]:null;
  if(s.winner!==null)s.players[s.winner].score++;s.phase="finisher";s.finisher=FINISHER_SECONDS;s.timeScale=1;s.shots=[];
  const dead=s.players.find(p=>p.hp<=0)!;combatEvent(s,{kind:"finish",owner:s.winner??-1,damage:0,x:dead.x,y:dead.y,z:30});
  for(const cv of s.covers)if(cv.constructOwner!==undefined&&s.players[cv.constructOwner]?.hp<=0&&cv.hp>0)dissolveFieldCover(cv,s);
  for(const p of s.players){p.timeFieldActive=false;p.timePellets=p.timeVolleys=0;p.meleeCombo=undefined;p.meleeNextStage=undefined;p.blastUntil=0;p.pendingMelee=undefined;p.pendingFireUntil=undefined;p.input=empty();p.processedInput=empty();p.shield=false;if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}}p.gripCoverId=null;p.gripId=null;p.orbitIds=[];}
  for(const m of s.matter){m.heldBy=null;m.orbitBy=null;}
 }
 // Recovered 12-unit hover and response14. Visual only: all collision hulls stay on the deck.
 for(const cv of s.covers){const held=s.players.some(p=>p.gripCoverId===cv.id),constrained=s.time-(cv.carryBlockedAt??-9)<.12;cv.hover=((cv.hover||0)+((held&&!constrained?12:0)-(cv.hover||0))*(1-Math.exp(-14*dt)));if(!held)cv.carryRadialSpeed=cv.carryAngularSpeed=cv.carryRotationSpeed=0;}
 s.covers=s.covers.filter(cv=>cv.hp>0);
 measureFightStep(s,before,dt);
 auditTransitions(s,before,requests,firstSeq);
 s.players.forEach((p,n)=>p.input=rawInputs[n]);
 s.shots=s.shots.filter(x=>x.life>0);s.matter=s.matter.filter(x=>x.life>0);s.fx.forEach(f=>f.life-=dt);s.fx=s.fx.filter(f=>f.life>0);
}
function aftermath(s:GameState,elapsed:number){
 while(elapsed>1e-9&&s.finisher>0){const dt=Math.min(1/60,elapsed,s.finisher),age=FINISHER_SECONDS-s.finisher,t=clamp(age/.35,0,1);s.timeScale=1-.08*(t*t*(3-2*t));const d=dt*s.timeScale;s.time+=d;s.finisher=Math.max(0,s.finisher-dt);
  for(const p of s.players){p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);p.vx*=Math.pow(.08,d);p.vy*=Math.pow(.08,d);p.knock=Math.max(0,p.knock-d);p.recoil=Math.max(0,p.recoil-d);collide(p,s);}
  for(const cv of s.covers){cv.hover=(cv.hover||0)*Math.exp(-14*d);if(cv.build>=0)continue;cv.x=clamp(cv.x+(cv.vx||0)*d,A.left+cv.w/2,A.right-cv.w/2);cv.y=clamp(cv.y+(cv.vy||0)*d,A.top+cv.h/2,A.bottom-cv.h/2);cv.vx=(cv.vx||0)*Math.pow(.09,d);cv.vy=(cv.vy||0)*Math.pow(.09,d);cv.build=-Math.hypot(cv.vx,cv.vy);}
  for(const m of s.matter){m.x=clamp(m.x+m.vx*d,A.left,A.right);m.y=clamp(m.y+m.vy*d,A.top,A.bottom);m.vx*=Math.pow(.35,d);m.vy*=Math.pow(.35,d);if(m.life<999)m.life-=d;}
  s.matter=s.matter.filter(m=>m.life>0);s.fx.forEach(f=>f.life-=d);s.fx=s.fx.filter(f=>f.life>0);elapsed-=dt;
 }if(s.finisher<=1e-9){s.finisher=0;s.phase="finished";finishFightRound(s);s.timeScale=.92;for(const p of s.players)p.vx=p.vy=0;}
}
export function advance(s:GameState,now=Date.now()){
 let elapsed=clamp((now-s.lastAt)/1000,0,.25);s.lastAt=now;
 if(s.mode==="watch"&&s.watchPaused)return;
 if(s.mode==="watch"&&s.phase==="finished"){s.watchNextAt??=now+2000;if(now>=s.watchNextAt)respawn(s);return;}
 if(s.phase==="countdown"){s.countdown=Math.max(0,s.countdown-elapsed);s.players.forEach(p=>p.processedInput={...p.input});if(!s.countdown){s.phase="playing";s.fightUntil=s.time+.65;}return;}
 if(s.phase==="finisher"){aftermath(s,elapsed);return;}
 if(s.phase!=="playing"||(s.mode!=="solo"&&s.players.length<2))return;
 let prev=s.players.map(p=>({...p.processedInput}));while(elapsed>1e-9){const dt=Math.min(1/60,elapsed);s.time+=dt;botInput(s);step(s,dt,prev);s.players.forEach(p=>p.processedInput={...p.input});prev=s.players.map(p=>({...p.input}));elapsed-=dt;if(s.phase!=="playing"){if(s.phase==="finisher")aftermath(s,elapsed);break;}}
}
export function startOrRematch(s:GameState,slot:number){if(s.mode==="solo"){respawn(s);return}if(slot===0){respawn(s)}}
export function safeState(s:GameState){const {actions,actionCounts,energySpent,botExperience,botRound,fightRecording,...publicState}=s;return{...publicState,fightMemory:fightMemorySummary(s),players:s.players.map(({token,...p})=>p)}}




