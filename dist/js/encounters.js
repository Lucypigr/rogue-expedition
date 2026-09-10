import {seeded,distance} from './world.js';
import {WORLD_SIZE} from './data.js';

export const ENCOUNTER_TYPES={
 emberShrine:{id:'emberShrine',name:'餘燼祭壇',desc:'獻上殘火，提升生命上限並回復生命。'},
 lostCache:{id:'lostCache',name:'失落靈匣',desc:'取得封存靈晶，立即獲得經驗值。'},
 ashAltar:{id:'ashAltar',name:'灰誓祭壇',desc:'以少量生命交換本局永久法術傷害。'}
};

function clearOfObstacles(world,p,r=38){
 return !world.obstacles.some(o=>distance(o,p)<o.r+r);
}

export function createEncounters(seed,world,count=3){
 const rng=seeded(seed^0x51A7E11),types=Object.values(ENCOUNTER_TYPES),out=[];
 for(let i=0;i<count;i++){
  let p=null;
  for(let tries=0;tries<80;tries++){
   const a=rng()*Math.PI*2,d=420+rng()*620;
   const candidate={
    x:Math.max(80,Math.min(WORLD_SIZE-80,1200+Math.cos(a)*d)),
    y:Math.max(80,Math.min(WORLD_SIZE-80,1200+Math.sin(a)*d))
   };
   if(Math.hypot(candidate.x-1200,candidate.y-1200)<330)continue;
   if(!clearOfObstacles(world,candidate))continue;
   if(out.some(e=>distance(e,candidate)<260))continue;
   p=candidate;break;
  }
  if(!p)continue;
  const type=types[i%types.length];
  out.push({id:`enc-${i}`,type:type.id,name:type.name,desc:type.desc,x:p.x,y:p.y,resolved:false});
 }
 return out;
}

export function encounterMarkers(encounters){
 return encounters.map(e=>({x:e.x,y:e.y,r:8,value:99,encounterId:e.id}));
}

export function applyEncounter(game,encounter){
 if(!encounter||encounter.resolved)return false;
 const p=game.player;
 encounter.resolved=true;
 if(encounter.type==='emberShrine'){
  p.maxHp+=8;
  p.hp=Math.min(p.maxHp,p.hp+26);
 }else if(encounter.type==='lostCache'){
  p.xp+=Math.max(6,Math.round(p.nextXp*.65));
 }else if(encounter.type==='ashAltar'){
  p.hp=Math.max(1,p.hp-12);
  p.damage*=1.12;
 }
 game.emit('encounter',encounter);
 return true;
}
