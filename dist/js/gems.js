/** Gem definitions are independent of rendering and can be extended by tag. */
export const ACTIVE_GEMS = {
  fireball: {name:'烈焰火球',icon:'✷',color:'#f3af62',tags:['spell','projectile','area','hit'],desc:'火球命中後爆炸，擅長清除密集敵群。',damage:24,rate:1.8,speed:380,blast:28},
  ice: {name:'冰霜長矛',icon:'❄',color:'#8dd9ed',tags:['spell','projectile','hit'],desc:'高速冰矛自帶一次穿透，命中緩速 35%。',damage:31,rate:1.3,speed:490,pierce:1,slow:.35},
  arc: {name:'連鎖閃電',icon:'ϟ',color:'#d5c4fa',tags:['spell','chain','hit'],desc:'瞬間擊中目標，並跳向附近另外 2 名敵人。',damage:30,rate:1.05,chain:2},
  nova: {name:'寒冰新星',icon:'✺',color:'#91c9e5',tags:['spell','area','hit'],desc:'以自身為中心釋放冰環，緩速附近所有敵人。',damage:36,rate:.65,radius:145,slow:.35},
  orbit: {name:'環刃風暴',icon:'✥',color:'#c4deb0',tags:['area','duration','hit'],desc:'兩枚刀刃持續環繞自身，切割靠近的敵人。',damage:15,rate:4,radius:76},
  meteor: {name:'隕星墜落',icon:'☄',color:'#f5b38e',tags:['spell','area','hit'],desc:'在敵人腳下標記落點，延遲 0.65 秒降下隕石。',damage:95,rate:.45,radius:95}
};
export const SUPPORT_GEMS = {
  multi: {name:'多重投射',icon:'⋔',tags:['projectile'],desc:'+2 顆投射物；每顆傷害降低 25%。',apply:s=>{s.count+=2;s.damage*=.75}},
  pierce: {name:'穿透',icon:'➶',tags:['projectile'],desc:'額外穿透 2 名敵人；傷害降低 10%。',apply:s=>{s.pierce+=2;s.damage*=.9}},
  chain: {name:'連鎖',icon:'⌁',tags:['projectile','chain'],desc:'額外連鎖 2 次；每次跳躍保留 85% 傷害。',apply:s=>{s.chain+=2;s.damage*=.9}},
  fork: {name:'分裂',icon:'⋎',tags:['projectile'],desc:'首次命中分裂為 2 枚；分裂傷害為 60%。',apply:s=>s.fork=true},
  echo: {name:'施法迴響',icon:'◎',tags:['spell'],desc:'0.22 秒後再施放一次；每次傷害降低 30%。',apply:s=>{s.echo=true;s.damage*=.7}},
  area: {name:'擴大範圍',icon:'◌',tags:['area'],desc:'範圍半徑 +45%；傷害降低 10%。',apply:s=>{s.radius*=1.45;s.blast*=1.45;s.damage*=.9}},
  swift: {name:'快速施法',icon:'↟',tags:['spell'],desc:'施法頻率 +35%；傷害降低 10%。',apply:s=>{s.rate*=1.35;s.damage*=.9}},
  burn: {name:'點燃',icon:'♨',tags:['hit'],desc:'命中後燃燒 3 秒，每秒造成命中傷害的 15%。',apply:s=>s.burn=.15},
  leech: {name:'生命偷取',icon:'♥',tags:['hit'],desc:'命中回復傷害的 3%；每秒最多回復 8 點。',apply:s=>s.leech=.03},
  execute: {name:'撲殺',icon:'✧',tags:['hit'],desc:'命中生命低於 10% 的敵人直接擊殺，包含 Boss。',apply:s=>s.execute=true}
};
export const DEFAULT_LINKS=[{active:'fireball',supports:['multi','pierce',null]},{active:'arc',supports:['chain','swift',null]},{active:'nova',supports:['area',null,null]}];
export function createLinks(source=DEFAULT_LINKS){return source.map(s=>({active:s.active,supports:[...s.supports]}))}
export function compatible(active,support){const a=ACTIVE_GEMS[active],s=SUPPORT_GEMS[support];return !!a&&!!s&&s.tags.some(tag=>a.tags.includes(tag))}
export function configureLink(links,index,kind,socket,value){
  if(!Number.isInteger(index)||!links[index])return {ok:false,reason:'技能組不存在'};
  const row=links[index];
  if(kind==='active'){
    if(!ACTIVE_GEMS[value])return {ok:false,reason:'未知主動技能'};
    if(links.some((l,i)=>i!==index&&l.active===value))return {ok:false,reason:'同一主動寶石只能裝在一組'};
    row.active=value;row.supports=row.supports.map(s=>s&&compatible(value,s)?s:null);return {ok:true};
  }
  if(kind!=='support'||!Number.isInteger(socket)||socket<0||socket>=3)return {ok:false,reason:'連線插槽不存在'};
  if(value===null){row.supports[socket]=null;return {ok:true}};
  if(!compatible(row.active,value))return {ok:false,reason:'寶石標籤不相容'};
  if(links.some((l,i)=>l.supports.some((s,j)=>s===value&&(i!==index||j!==socket))))return {ok:false,reason:'這顆寶石已裝在其他插槽，請先卸下'};
  row.supports[socket]=value;return {ok:true};
}
export function compileSkill(row,player,levels={}){
  const a=ACTIVE_GEMS[row.active],level=levels[row.active]||0;
  const s={id:row.active,color:a.color,damage:a.damage*(player.damage/24)*(1+level*.12),rate:a.rate*(player.attackRate/1.8),speed:a.speed||380,radius:a.radius||0,blast:a.blast||0,count:1,pierce:a.pierce||0,chain:a.chain||0,slow:a.slow||0,fork:false,echo:false,burn:0,leech:0,execute:false};
  for(const id of row.supports)if(id&&compatible(row.active,id))SUPPORT_GEMS[id].apply(s);
  return s;
}
export const GEM_PRESETS={
  barrage:{name:'彈幕術士',links:[{active:'fireball',supports:['multi','fork','burn']},{active:'ice',supports:['pierce','chain','leech']},{active:'arc',supports:['swift','echo','execute']}]},
  storm:{name:'雷霜風暴',links:[{active:'arc',supports:['chain','echo','leech']},{active:'nova',supports:['area','swift','burn']},{active:'ice',supports:['multi','pierce','execute']}]},
  orbit:{name:'環刃隕星',links:[{active:'orbit',supports:['area','leech','execute']},{active:'meteor',supports:['echo','burn','swift']},{active:'fireball',supports:['multi','pierce','chain']}]}
};

export function rollGemRewards(rng,passives,owned,levels){
 const pool=passives.filter(s=>['power','haste','speed','vitality','magnet','regen','ward'].includes(s.id)&&(owned[s.id]?.count||0)<(s.max||8));
 for(const [id,a] of Object.entries(ACTIVE_GEMS))if((levels[id]||0)<8)pool.push({id:`gem_${id}`,gemId:id,name:`${a.name} · 精煉`,icon:a.icon,desc:m=>`${a.name}基礎傷害 +${Math.round(Math.min(m,8-(levels[id]||0))*12)}%；保留自由裝配。`});
 const out=[];for(let i=0;i<3&&pool.length;i++){const skill=pool.splice(Math.floor(rng()*pool.length),1)[0],r=rng(),rarity=r<.62?'common':r<.91?'rare':'epic';out.push({skill,rarity})}return out;
}
