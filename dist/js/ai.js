import {distance,moveEntity} from './world.js';
import {bossSpeedMultiplier,bossWindup,resolveBossAttack,syncBossPhase} from './boss.js';

export const ENEMY_STATES=Object.freeze({SPAWN:'spawn',PURSUE:'pursue',FLANK:'flank',KITE:'kite',REPOSITION:'reposition',WINDUP:'windup',RECOVER:'recover',DEAD:'dead'});

function attackRange(e,p,dist){if(e.type==='boss')return dist<700;if(e.type==='shaman')return dist<370;if(e.type==='runner')return dist<190;if(e.type==='brute')return dist<e.r+p.r+55;return dist<e.r+p.r+20}
function windupFor(e){if(e.type==='boss')return bossWindup(e);if(e.type==='runner')return .30;if(e.type==='brute')return .78;if(e.type==='shaman')return .7;return .42}
function beginAttack(e,p,angle){e.state=ENEMY_STATES.WINDUP;e.attack=windupFor(e);e.aim=angle;e.chargeAngle=angle;e.tx=p.x;e.ty=p.y}

function resolveAttack(game,e,p,dist){
 if(e.type==='boss'){resolveBossAttack(game,e)}
 else if(e.type==='shaman'){game.fireHostile(e,e.aim,3,135);e.cooldown=2.5}
 else if(e.type==='runner'){
  moveEntity(e,Math.cos(e.chargeAngle)*125,Math.sin(e.chargeAngle)*125,game.world);
  if(distance(e,p)<e.r+p.r+38)game.hurt(e.damage*1.15);
  e.cooldown=1.35;
 }else if(e.type==='brute'){
  if(dist<e.r+p.r+50)game.hurt(e.damage*1.25);
  e.cooldown=1.8;game.shake=Math.max(game.shake,4);
 }else{if(dist<e.r+p.r+25)game.hurt(e.damage);e.cooldown=.9}
 e.attack=0;e.state=ENEMY_STATES.RECOVER;
}

function desiredMotion(game,e,p,angle,dist){
 let speed=e.speed,moveAngle=angle,state=ENEMY_STATES.PURSUE;
 if(e.type==='boss')speed*=bossSpeedMultiplier(e);
 else if(e.type==='runner'){
  state=ENEMY_STATES.FLANK;
  if(dist>105)moveAngle=angle+Math.sin(game.time*3.4+e.id)*.52;
  else if(e.cooldown>0){moveAngle=angle+Math.PI;speed*=.72}
  speed*=1.08;
 }else if(e.type==='shaman'){
  state=ENEMY_STATES.KITE;
  if(dist<175){moveAngle=angle+Math.PI;speed*=.9}
  else if(dist>295){moveAngle=angle;speed*=.9}
  else{moveAngle=angle+e.sidestep*Math.PI/2;speed*=.58}
 }else if(e.type==='brute')speed*=dist<120?.72:1;
 return{speed,moveAngle,state};
}

function moveWithSeparation(game,e,p,dt,angle){
 const dist=distance(e,p),keepRecover=e.state===ENEMY_STATES.RECOVER&&e.cooldown>0;let{speed,moveAngle,state}=desiredMotion(game,e,p,angle,dist);
 speed*=e.slow>0?1-p.slow:1;
 if(e.state===ENEMY_STATES.REPOSITION&&e.stateTime>0){state=ENEMY_STATES.REPOSITION;moveAngle=angle+e.sidestep*Math.PI/2;speed=Math.max(speed,e.speed*.85)}
 e.state=keepRecover?ENEMY_STATES.RECOVER:state;
 let vx=Math.cos(moveAngle)*speed,vy=Math.sin(moveAngle)*speed;
 for(const o of game.grid.query(e.x,e.y,65)){if(o===e||o.hp<=0)continue;const d=distance(e,o),min=e.r+o.r+4;if(d<min&&d>0){vx+=(e.x-o.x)/d*(min-d)*3;vy+=(e.y-o.y)/d*(min-d)*3}}
 const ox=e.x,oy=e.y;moveEntity(e,vx*dt,vy*dt,game.world);const attempted=Math.hypot(vx,vy)*dt,moved=Math.hypot(e.x-ox,e.y-oy);
 if(attempted>1.5&&moved<attempted*.18)e.blockedTime+=dt;else e.blockedTime=Math.max(0,e.blockedTime-dt*2);
 if(e.blockedTime>.35&&e.state!==ENEMY_STATES.REPOSITION){e.blockedTime=0;e.state=ENEMY_STATES.REPOSITION;e.stateTime=.5;e.sidestep=game.rng()<.5?-1:1}
}

export function updateEnemyAI(game,e,dt){
 const p=game.player;e.hit=Math.max(0,e.hit-dt);e.slow=Math.max(0,e.slow-dt);e.cooldown-=dt;e.stateTime=Math.max(0,(e.stateTime||0)-dt);
 if(e.type==='boss')syncBossPhase(game,e);
 const dist=distance(e,p),angle=Math.atan2(p.y-e.y,p.x-e.x);
 if(e.attack>0){e.state=ENEMY_STATES.WINDUP;e.attack-=dt;if(e.attack<=0)resolveAttack(game,e,p,dist);return}
 if(e.cooldown<=0&&attackRange(e,p,dist)){beginAttack(e,p,angle);return}
 if(e.state===ENEMY_STATES.SPAWN)e.state=ENEMY_STATES.PURSUE;
 if(e.state===ENEMY_STATES.REPOSITION&&e.stateTime<=0)e.state=ENEMY_STATES.PURSUE;
 if(e.state===ENEMY_STATES.RECOVER&&e.cooldown<=0)e.state=ENEMY_STATES.PURSUE;
 moveWithSeparation(game,e,p,dt,angle);
}
