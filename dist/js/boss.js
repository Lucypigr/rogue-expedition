import {WORLD_SIZE} from './data.js';
import {clamp} from './world.js';

export const BOSS_PHASES=Object.freeze({AWAKENED:1,ENRAGED:2,LAST_STAND:3});
export const BOSS_PHASE_NAMES=Object.freeze({1:'甦醒',2:'焚心',3:'末焰'});

export function syncBossPhase(game,e){
 if(e.type!=='boss')return 0;
 const ratio=e.maxHp>0?e.hp/e.maxHp:0;
 const next=ratio<=.33?BOSS_PHASES.LAST_STAND:ratio<=.66?BOSS_PHASES.ENRAGED:BOSS_PHASES.AWAKENED;
 if(!e.bossStage)e.bossStage=BOSS_PHASES.AWAKENED;
 if(next>e.bossStage){
  e.bossStage=next;
  e.attackPattern=0;
  game.shake=Math.max(game.shake,9+next*2);
  game.emit('bossPhase',{stage:next,name:BOSS_PHASE_NAMES[next]});
 }
 return e.bossStage;
}

export function bossWindup(e){return (e.bossStage||1)===1?.85:(e.bossStage===2?.72:.58)}
export function bossCooldown(e){return (e.bossStage||1)===1?2.7:(e.bossStage===2?2.15:1.65)}
export function bossSpeedMultiplier(e){return (e.bossStage||1)===1?1:(e.bossStage===2?1.18:1.38)}

function addZone(game,x,y,r,timer,damage){game.zones.push({x:clamp(x,40,WORLD_SIZE-40),y:clamp(y,40,WORLD_SIZE-40),r,timer,life:.35,active:false,damage})}

export function resolveBossAttack(game,e){
 const stage=syncBossPhase(game,e),pattern=e.attackPattern||0;e.attackPattern=pattern+1;
 if(stage===1){
  if(pattern%2===0){for(let k=0;k<12;k++)game.fireHostile(e,k*Math.PI/6+e.aim,1,140);game.fireHostile(e,e.aim,3,205)}
  else{addZone(game,e.tx,e.ty,105,.72,32);addZone(game,e.tx+105,e.ty+70,68,1.05,23)}
 }else if(stage===2){
  if(pattern%3===0){for(let k=0;k<18;k++)game.fireHostile(e,k*Math.PI/9+pattern*.14,1,155);game.fireHostile(e,e.aim,5,220)}
  else if(pattern%3===1){addZone(game,e.tx,e.ty,112,.6,34);addZone(game,e.tx-115,e.ty+55,72,.92,25);addZone(game,e.tx+115,e.ty-55,72,1.15,25)}
  else{for(let k=0;k<8;k++)game.fireHostile(e,k*Math.PI/4,1,205);game.fireHostile(e,e.aim,5,235)}
 }else{
  if(pattern%3===0){for(let k=0;k<20;k++)game.fireHostile(e,k*Math.PI/10+pattern*.2,1,175);game.fireHostile(e,e.aim,7,250)}
  else if(pattern%3===1){addZone(game,e.tx,e.ty,120,.48,38);addZone(game,e.tx+125,e.ty,78,.72,28);addZone(game,e.tx-125,e.ty,78,.9,28);addZone(game,e.tx,e.ty+125,78,1.08,28)}
  else{for(let k=0;k<12;k++)game.fireHostile(e,k*Math.PI/6+e.aim*.25,1,225);game.fireHostile(e,e.aim,7,270)}
 }
 e.cooldown=bossCooldown(e);
 game.emit('sound','boss');
}
