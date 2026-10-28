// Match rules are separate from tuning and future extraction-capacity policy.
export type MatchRules31={version:1;capacity32?:number;battery:"current"|"unlimited";opponent:"target"|"sparring"|"full"};
export const CURRENT_RULES31:MatchRules31={version:1,battery:"current",opponent:"full"};
export const PRACTICE_RULES31:MatchRules31={version:1,battery:"unlimited",opponent:"sparring"};
export function validateRules31(value:unknown):MatchRules31 {
 const v=value as Partial<MatchRules31>|null;
 if(!v||v.version!==1||!["current","unlimited"].includes(v.battery as string)||!["target","sparring","full"].includes(v.opponent as string)||Object.keys(v).some(k=>!["version","battery","opponent","capacity32"].includes(k)))throw Error("INVALID_MATCH_RULES");
 if(v.capacity32!==undefined&&(!Number.isFinite(v.capacity32)||v.capacity32<0||v.capacity32>100))throw Error("INVALID_MATCH_RULES");
 return {version:1,battery:v.battery!,opponent:v.opponent!,...(v.capacity32!==undefined?{capacity32:v.capacity32}:{})};
}
export const unlimited31=(s:{rules31?:MatchRules31})=>s.rules31?.battery==="unlimited";
export const availableEnergy31=(s:{rules31?:MatchRules31},p:{battery:number},required=100)=>unlimited31(s)?Math.max(100,required):p.battery;
export const canPay31=(s:{rules31?:MatchRules31},p:{battery:number},cost:number)=>unlimited31(s)||p.battery>=cost;
export function debitEnergy31(s:{rules31?:MatchRules31},p:{battery:number},cost:number){p.battery=unlimited31(s)?100:Math.max(0,p.battery-Math.max(0,cost));}
// Capacity is intentionally NOT inferred from availability above. Variable chunks are deferred.
export const SPARRING31={decisionSeconds:.3,cycleSeconds:6,offenseSeconds:2,moveScale:.5} as const;
