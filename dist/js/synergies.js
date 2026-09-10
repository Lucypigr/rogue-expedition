export const SYNERGIES=[
 {id:'volatile-volley',name:'烈焰齊射',requires:{multi:1,blast:1},desc:'多重火球的爆炸波及傷害提升。',mods:{splashDamage:1.35}},
 {id:'frozen-lance',name:'霜穿長槍',requires:{frost:1,pierce:1},desc:'穿透火焰對已減速敵人造成額外傷害。',mods:{slowedDirect:1.15}},
 {id:'ember-aegis',name:'餘燼壁壘',requires:{orbit:1,ward:1},desc:'環火守護在護符加持下造成更高灼燒傷害。',mods:{orbitDamage:1.28}}
];

function hasRequirements(owned,requires){
 return Object.entries(requires).every(([id,count])=>(owned[id]?.count||0)>=count);
}

export function getActiveSynergies(owned={}){
 return SYNERGIES.filter(s=>hasRequirements(owned,s.requires));
}

export function getSynergyModifiers(owned={}){
 const out={splashDamage:1,slowedDirect:1,orbitDamage:1};
 for(const s of getActiveSynergies(owned)){
  for(const [key,value] of Object.entries(s.mods||{}))out[key]*=value;
 }
 return out;
}

export function findNewSynergies(owned={},previousIds=new Set()){
 return getActiveSynergies(owned).filter(s=>!previousIds.has(s.id));
}
