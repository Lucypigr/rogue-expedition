import {waveBudget} from './encounters.js';
import {ACTIVE_GEMS,SUPPORT_GEMS,configureLink,compatible} from './gems.js';
export const SOCKET_COLORS={R:{name:'紅',hex:'#e28e7c'},G:{name:'綠',hex:'#aed591'},B:{name:'藍',hex:'#91ccec'},W:{name:'白',hex:'#eae6d3'}};
export const CURRENCIES={chromatic:{name:'幻彩石',icon:'◉',desc:'重鑄孔洞顏色'},jeweller:{name:'匠魂石',icon:'❖',desc:'增加一個孔洞'},fusing:{name:'連結石',icon:'∞',desc:'增加一段連線'}};
export const WEAPON_BASES=[{name:'燼火法杖',icon:'⚚',bonus:'spell',socket:'B'},{name:'裂風長弓',icon:'➶',bonus:'projectile',socket:'G'},{name:'斷岳戰斧',icon:'⚒',bonus:'area',socket:'R'},{name:'霜紋權杖',icon:'♜',bonus:'spell',socket:'B'},{name:'幽影匕首',icon:'†',bonus:'hit',socket:'G'},{name:'隕鐵重錘',icon:'✥',bonus:'area',socket:'R'}];
export function gemSocket(id){return ACTIVE_GEMS[id]?.socket||SUPPORT_GEMS[id]?.socket||'B'}
export function colorFits(socket,gem){return socket==='W'||socket===gemSocket(gem)}
export function resetProgress(g){
 g.gold=0;g.tickets=0;g.shop=null;g.lastPrize=null;g.round=1;g.wave=1;g.waveRemaining=waveBudget(1,1);g.roundTime=0;g.bossesDefeated=0;g.forgeUnlocked=false;g.rewardTaken=false;g.rewardOptions=[];g.levelReturn='playing';g.lootHistory=[];g.bag={active:['fireball'],support:[],weapons:[],currency:{chromatic:0,jeweller:0,fusing:0}};
 const starter={id:'starter',name:'旅人的朽木杖',icon:'⚚',slot:'weapon',rarity:'common',bonus:'spell',power:0,sockets:['B','W'],linked:2};g.bag.weapons.push(starter);g.equipped=['starter',null,null,null,null];g.links=Array.from({length:5},(_,i)=>({active:i===0?'fireball':null,supports:[null,null,null]}));
}
export const EQUIPMENT_SLOTS=['weapon','weapon','weapon','cloak','legs'];
export const SLOT_NAMES=['武器欄 01','武器欄 02','武器欄 03','披風','腿部'];
export const DROP_RATES={normal:.03,boss:.8};
export const ARMOR_BASES=[{slot:'cloak',name:'灰燼披風',icon:'◭',bonus:'spell'},{slot:'cloak',name:'暮影斗篷',icon:'◮',bonus:'hit'},{slot:'legs',name:'疾風護腿',icon:'♜',bonus:'projectile'},{slot:'legs',name:'隕鐵腿甲',icon:'♜',bonus:'area'}];
export const gearType=w=>w.slot||'weapon';
export const gearLabel=w=>`${w.name} · ${w.slot==='cloak'?'護甲 +'+w.armor:w.slot==='legs'?'移速 +'+w.speed+'%':w.power+'% 傷害'}`;
export function equipmentStats(g){return g.equipped.reduce((v,_,i)=>{const w=weaponFor(g,i);v.armor+=w?.armor||0;v.speed+=w?.speed||0;return v},{armor:0,speed:0})}
export function stashEquipment(g,w){
 if(g.bag.weapons.length>=40&&!g.bag.weapons.some(v=>!g.equipped.includes(v.id)&&v.rarity!=='legendary')){g.bag.currency.jeweller+=2;return false}
 g.bag.weapons.push(w);
 const empty=g.equipped.findIndex((id,i)=>!id&&EQUIPMENT_SLOTS[i]===gearType(w));
 if(empty>=0&&(!w.intrinsic||!g.equipped.some(id=>g.bag.weapons.find(v=>v.id===id)?.intrinsic===w.intrinsic))){g.equipped[empty]=w.id;sanitize(g,empty)}
 if(g.bag.weapons.length>40){const at=g.bag.weapons.findIndex(v=>!g.equipped.includes(v.id)&&v.id!==w.id&&v.rarity!=='legendary');if(at>=0){g.bag.weapons.splice(at,1);g.bag.currency.jeweller+=2}}
}
export function dropEquipment(g,boss=false){
 if(g.rng()>=DROP_RATES[boss?'boss':'normal'])return null;
 const pool=[...WEAPON_BASES,...ARMOR_BASES],base=pool[Math.floor(g.rng()*pool.length)];
 const w=weaponReward(g,base).weapon;stashEquipment(g,w);
 g.lootHistory.unshift(w);g.lootHistory.length=Math.min(8,g.lootHistory.length);
 g.emit('gearDrop',w);return w;
}
export function rollLevelGems(g){
 const pool=[...Object.entries(ACTIVE_GEMS).filter(([,a])=>!a.exclusive).map(([id,a])=>({id,...a,kind:'active'})),...Object.entries(SUPPORT_GEMS).filter(([id,a])=>!a.rarity&&!g.bag.support.includes(id)).map(([id,a])=>({id,...a,kind:'support'}))];
 // Prefer discoveries; once collected, active gems remain available as refinements.
 const fresh=pool.filter(a=>!g.bag[a.kind].includes(a.id)),repeats=pool.filter(a=>g.bag[a.kind].includes(a.id));
 const out=[];
 while(out.length<3){const candidates=fresh.length?fresh:repeats;const a=candidates.splice(Math.floor(g.rng()*candidates.length),1)[0],r=g.rng(),rarity=r<.62?'common':r<.91?'rare':'epic',rank=rarity==='epic'?3:rarity==='rare'?2:1;
 out.push({...a,rarity,rank,desc:`${SOCKET_COLORS[gemSocket(a.id)].name}色${a.kind==='active'?'主動':'輔助'}寶石 · ${a.desc}${a.kind==='active'?' · 精煉 +'+rank+'（每級傷害 +12%）':''}`})}
 return out;
}
export function chooseLevelGem(g,index){
 if(g.state!=='levelup'||!Number.isInteger(index)||!g.choices[index])return false;
 const a=g.choices[index];if(!g.bag[a.kind].includes(a.id))g.bag[a.kind].push(a.id);
 if(a.kind==='active')g.gemLevels[a.id]=(g.gemLevels[a.id]||0)+a.rank;
 g.choices=[];g.state=g.levelReturn;g.checkLevel();g.emit('upgrade',a);return true;
}
export const weaponFor=(g,i)=>g.bag.weapons.find(w=>w.id===g.equipped[i]);
export function configureOwned(g,i,kind,socket,value){
 if(!['paused','build','reward','forge','camp'].includes(g.state))return{ok:false,reason:'請先暫停或在休息時裝備'};
 const w=weaponFor(g,i);if(!w)return{ok:false,reason:'先在此欄位裝備對應裝備'};
 if(kind==='active'&&w.intrinsic)return{ok:false,reason:'傳說武器使用固定專屬技能，不能裝入或移除主動寶石'};
 if(kind==='active'&&value===null){g.links[i].active=null;g.links[i].supports=[null,null,null];return{ok:true}}
 if(value){const owned=kind==='active'?g.bag.active:g.bag.support;if(!owned.includes(value))return{ok:false,reason:'尚未獲得這顆寶石'};const index=kind==='active'?0:socket+1;if(index>=w.sockets.length||index>=w.linked)return{ok:false,reason:'此孔尚未開啟或連結'};if(!colorFits(w.sockets[index],value))return{ok:false,reason:'寶石與孔洞顏色不同，須到工坊改色'}}
 return configureLink(g.links,i,kind,socket,value);
}
export function equipWeapon(g,index,id){
 if(!['paused','build','reward','forge','camp'].includes(g.state)||!Number.isInteger(index)||index<0||index>=EQUIPMENT_SLOTS.length)return{ok:false,reason:'無法在此時換裝'};
 if(!g.bag.weapons.some(w=>w.id===id&&gearType(w)===EQUIPMENT_SLOTS[index])||g.equipped.some((v,i)=>i!==index&&v===id))return{ok:false,reason:'裝備類型不符、不存在或已裝備'};
 if(g.bag.weapons.find(w=>w.id===id).intrinsic&&g.equipped.some((v,k)=>k!==index&&g.bag.weapons.find(w=>w.id===v)?.intrinsic===g.bag.weapons.find(w=>w.id===id).intrinsic))return{ok:false,reason:'同一專屬技能只能裝備一把'};
 g.equipped[index]=id;sanitize(g,index);return{ok:true};
}
export function sanitize(g,index){const w=weaponFor(g,index),row=g.links[index];if(!w||!row)return;if(w.intrinsic)row.active=w.intrinsic;else if(ACTIVE_GEMS[row.active]?.exclusive)row.active=null;row.supports=row.supports.map(id=>id&&compatible(row.active,id)?id:null);if(row.active&&!colorFits(w.sockets[0],row.active)){row.active=null;row.supports.fill(null)}row.supports=row.supports.map((id,i)=>id&&i+1<w.sockets.length&&i+1<w.linked&&colorFits(w.sockets[i+1],id)?id:null)}
export function weaponReward(g,base){const tier=(g.round-1)*3+Math.ceil(g.wave/5);const b=base||WEAPON_BASES[Math.floor(g.rng()*WEAPON_BASES.length)],r=g.rng(),rarity=tier>=7&&r>.6?'epic':r>.4?'rare':'common';const power=8+tier*3+(rarity==='epic'?20:rarity==='rare'?10:0);const count=Math.min(4,2+(tier>=4?1:0)+(rarity==='epic'?1:0));const weapon={...b,slot:b.slot||'weapon',armor:b.slot==='cloak'?2+Math.floor(power/8):0,speed:b.slot==='legs'?Math.min(25,5+Math.floor(power/4)):0,id:`weapon-${g.round}-${g.nextId++}`,rarity,power,sockets:Array.from({length:count},(_,i)=>i===0?'W':['R','G','B'][Math.floor(g.rng()*3)]),linked:Math.min(count,2)};return{kind:'weapon',weapon,name:weapon.name,icon:b.icon,rarity,desc:`${b.bonus==='spell'?'法術':b.bonus==='projectile'?'投射物':b.bonus==='area'?'範圍':'命中'}傷害 +${power}% · ${count} 孔 / ${weapon.linked} 孔串連`}}
export function rollLoot(g){
 const active=Object.keys(ACTIVE_GEMS).filter(id=>!ACTIVE_GEMS[id].exclusive&&!g.bag.active.includes(id)),support=Object.keys(SUPPORT_GEMS).filter(id=>!SUPPORT_GEMS[id].rarity&&!g.bag.support.includes(id));
 const choice=(ids,kind)=>{if(!ids.length)return{kind:'currency',name:'工匠通貨袋',icon:'◈',rarity:'rare',desc:'幻彩石 ×3、匠魂石 ×2、連結石 ×2'};const id=ids[Math.floor(g.rng()*ids.length)],a=(kind==='active'?ACTIVE_GEMS:SUPPORT_GEMS)[id];return{kind,id,name:a.name,icon:a.icon,rarity:g.wave===15?'epic':'rare',desc:`${SOCKET_COLORS[gemSocket(id)].name}色${kind==='active'?'主動':'輔助'}宝石 · ${a.desc}`}};
 return[choice(active,'active'),weaponReward(g),choice(support,'support')];
}
export function bossDefeated(g){
 if(g.state!=='playing')return;g.bossesDefeated++;g.waveRemaining=0;g.state='reward';g.rewardTaken=false;g.rewardOptions=rollLoot(g);g.bag.currency.chromatic+=2;g.bag.currency.jeweller+=1;g.bag.currency.fusing+=1;g.enemies=[];g.shots=[];g.hostile=[];g.zones=[];g.echoes=[];g.meteors=[];g.fields=[];g.totems=[];g.player.hp=Math.min(g.player.maxHp,g.player.hp+g.player.maxHp*.35);g.emit('sound','win');g.checkLevel();if(g.state==='reward')g.emit('reward');
}
export function takeReward(g,index){
 if(g.state!=='reward'||g.rewardTaken||!g.rewardOptions[index])return false;const r=g.rewardOptions[index];g.rewardTaken=true;
 if(r.kind==='weapon'){stashEquipment(g,r.weapon)}
 else if(r.kind==='active'||r.kind==='support')g.bag[r.kind].push(r.id);
 else{g.bag.currency.chromatic+=3;g.bag.currency.jeweller+=2;g.bag.currency.fusing+=2}
 g.rewardOptions=[];g.state='forge';g.forgeUnlocked=true;g.emit('loot',r);return true;
}
export const TOTAL_ROUNDS=3,WAVES_PER_ROUND=15,BOSS_INTERVAL=5;
export function beginWave(g){
 g.waveRemaining=waveBudget(g.round,g.wave);
 g.bossSpawned=false;g.boss=null;g.rewardTaken=false;g.forgeUnlocked=false;g.spawnClock=.6;
 g.castClocks=g.links.map((_,i)=>i*.12);g.state='playing';g.emit('nextWave');
}
export function nextRound(g){
 if(g.state!=='forge'||!g.rewardTaken)return false;
 if(!g.links.some((r,i)=>r.active&&weaponFor(g,i)))return false;
 if(g.wave===WAVES_PER_ROUND){if(g.round>=TOTAL_ROUNDS)return false;g.round++;g.wave=1;g.roundTime=0}else g.wave++;
 beginWave(g);g.emit('nextRound');return true;
}
export function updateWaves(g){
 if(g.state!=='playing')return;
 if(g.wave%BOSS_INTERVAL===0){if(!g.bossSpawned)g.summonBoss();return}
 if(g.waveRemaining===0&&!g.enemies.some(e=>e.hp>0)){
  // Collect remaining experience before advancing; no wave reward can be lost.
  for(const gem of g.gems)if(!gem.heal)g.player.xp+=gem.value;
  g.gems=[];g.shots=[];g.hostile=[];g.zones=[];g.echoes=[];g.meteors=[];g.fields=[];g.totems=[];
  g.wave++;beginWave(g);g.checkLevel();
 }
}
export function craft(g,weaponId,action,options={}){
 if(!g.forgeUnlocked||!['forge','build'].includes(g.state))return{ok:false,reason:'每擊敗第 5、10、15 波 Boss 後可使用工坊'};
 const w=g.bag.weapons.find(v=>v.id===weaponId);if(!w)return{ok:false,reason:'找不到裝備'};
 let type,cost;
 if(action==='socket'){if(w.sockets.length>=4)return{ok:false,reason:'孔洞已達 4 個上限'};type='jeweller';cost=2}
 else if(action==='link'){if(w.linked>=w.sockets.length)return{ok:false,reason:'現有孔洞已全部連結'};type='fusing';cost=2}
 else if(action==='recolor'){if(w.intrinsic&&options.index===0)return{ok:false,reason:'傳說專屬技能孔固定為白色'};if(!Number.isInteger(options.index)||options.index<0||options.index>=w.sockets.length||!['R','G','B'].includes(options.color))return{ok:false,reason:'請選擇孔位與顏色'};if(w.sockets[options.index]===options.color)return{ok:false,reason:'已經是此顏色'};type='chromatic';cost=2}
 else if(action==='reroll'){type='chromatic';cost=1}else return{ok:false,reason:'未知製作方式'};
 if(g.bag.currency[type]<cost)return{ok:false,reason:`${CURRENCIES[type].name}不足，需要 ${cost} 顆`};
 g.bag.currency[type]-=cost;
 if(action==='socket')w.sockets.push(['R','G','B'][Math.floor(g.rng()*3)]);
 else if(action==='link')w.linked++;
 else if(action==='recolor')w.sockets[options.index]=options.color;
 else w.sockets=w.sockets.map((c,i)=>w.intrinsic&&i===0?'W':['R','G','B'][Math.floor(g.rng()*3)]);
 const equipped=g.equipped.indexOf(w.id);if(equipped>=0)sanitize(g,equipped);return{ok:true,reason:'製作完成；不合色的寶石已退回背包。'};
}
