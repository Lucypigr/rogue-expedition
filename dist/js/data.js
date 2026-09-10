export const WORLD_SIZE=2400;
export const BOSS_TIME=180;
export const MAX_ENEMIES=110;
export const MAX_PARTICLES=450;
export const RARITIES={common:{name:'普通',color:'#b1c68e',mult:1},rare:{name:'稀有',color:'#79c8e8',mult:1.5},epic:{name:'史詩',color:'#c79aec',mult:2}};
export const SKILLS=[
{id:'power',name:'熾熱核心',icon:'✷',desc:m=>`火球傷害 +${Math.round(25*m)}%`,apply:(p,m)=>p.damage*=1+.25*m},
{id:'haste',name:'疾速詠唱',icon:'ϟ',desc:m=>`施法頻率 +${Math.round(18*m)}%`,apply:(p,m)=>p.attackRate*=1+.18*m},
{id:'multi',name:'多重投射',icon:'⋔',min:'rare',max:3,desc:()=>`每次施法增加 2 顆火球`,apply:p=>p.projectiles+=2},
{id:'blast',name:'焰爆',icon:'✺',max:4,desc:m=>`爆炸半徑 +${Math.round(18*m)}，波及附近敵人`,apply:(p,m)=>p.blast+=18*m},
{id:'speed',name:'疾風步',icon:'↟',max:4,desc:m=>`移動速度 +${Math.round(12*m)}%`,apply:(p,m)=>p.speed*=1+.12*m},
{id:'vitality',name:'生命枝芽',icon:'✣',desc:m=>`生命上限 +${Math.round(25*m)}，回復等量生命`,apply:(p,m)=>{p.maxHp+=Math.round(25*m);p.hp=Math.min(p.maxHp,p.hp+Math.round(25*m))}},
{id:'magnet',name:'靈晶引力',icon:'◇',max:4,desc:m=>`拾取範圍 +${Math.round(45*m)}`,apply:(p,m)=>p.magnet+=45*m},
{id:'regen',name:'復甦之息',icon:'❋',max:4,desc:m=>`每秒回復 ${(m*.5).toFixed(1)} 生命`,apply:(p,m)=>p.regen+=m*.5},
{id:'pierce',name:'穿透之焰',icon:'➶',min:'rare',max:3,desc:()=>`火球可額外穿透 1 名敵人`,apply:p=>p.pierce++},
{id:'frost',name:'霜火',icon:'❄',min:'rare',max:2,desc:()=>`命中使敵人減速 35%，持續 2 秒`,apply:p=>{p.slow=.35;p.damage*=1.1}},
{id:'orbit',name:'環火守護',icon:'☼',min:'epic',max:3,desc:()=>`增加 1 顆環繞火球，持續灼傷近敵`,apply:p=>p.orbits++},
{id:'ward',name:'餘燼護符',icon:'◈',max:4,desc:m=>`受到傷害減少 ${Math.round(m*3)} 點`,apply:(p,m)=>p.armor+=m*3}
];
export function rollChoices(rng,owned={}){
 const pool=SKILLS.filter(s=>(owned[s.id]?.count||0)<(s.max||8)),out=[];
 for(let i=0;i<3&&pool.length;i++){
  const skill=pool.splice(Math.floor(rng()*pool.length),1)[0],r=rng();
  let rarity=r<.62?'common':r<.91?'rare':'epic';
  if(skill.min==='epic')rarity='epic';
  if(skill.min==='rare'&&rarity==='common')rarity='rare';
  out.push({skill,rarity});
 }return out;
}
export function makePlayer(){return{x:1200,y:1200,r:13,hp:100,maxHp:100,speed:185,damage:24,attackRate:1.8,projectiles:1,blast:26,magnet:85,regen:0,pierce:0,slow:0,orbits:0,armor:0,level:1,xp:0,nextXp:12,invincible:0,dashTime:0,dashCooldown:0,dirX:0,dirY:1,cast:0,walk:0};}
export const ENEMIES={crawler:{hp:34,speed:65,r:15,damage:13,xp:4},runner:{hp:24,speed:108,r:12,damage:10,xp:4},shaman:{hp:58,speed:47,r:17,damage:15,xp:7},brute:{hp:150,speed:40,r:25,damage:24,xp:12},boss:{hp:2700,speed:47,r:47,damage:27,xp:100}};
