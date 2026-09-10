import {WORLD_SIZE} from './data.js';
import {clamp,distance,moveEntity} from './world.js';

export const ENEMY_STATES=Object.freeze({
 SPAWN:'spawn',
 PURSUE:'pursue',
 REPOSITION:'reposition',
 WINDUP:'windup',
 RECOVER:'recover',
 DEAD:'dead'
});

function attackRange(e,p,dist){
 if(e.type==='boss')return dist<700;
 if(e.type==='shaman')return dist<370;
 return dist<e.r+p.r+20;
}

function beginAttack(e,p,angle){
 e.state=ENEMY_STATES.WINDUP;
 e.attack=e.type==='boss'?.85:e.type==='shaman'?.7:.42;
 e.aim=angle;
 e.tx=p.x;e.ty=p.y;
}

function resolveAttack(game,e,p,dist){
 const boss=e.type==='boss';
 if(boss){
  if(e.phase%2===0){
   for(let k=0;k<14;k++)game.fireHostile(e,k*Math.PI/7+e.aim,1,135);
   game.fireHostile(e,e.aim,5,195);
  }else{
   game.zones.push({x:e.tx,y:e.ty,r:100,timer:.7,life:.35,active:false,damage:32});
   game.zones.push({x:clamp(e.tx+100,40,WORLD_SIZE-40),y:clamp(e.ty+80,40,WORLD_SIZE-40),r:65,timer:1.1,life:.35,active:false,damage:23});
  }
  e.phase++;
  e.cooldown=e.hp<e.maxHp*.5?1.9:2.7;
  game.emit('sound','boss');
 }else if(e.type==='shaman'){
  game.fireHostile(e,e.aim,3,135);
  e.cooldown=2.5;
 }else{
  if(dist<e.r+p.r+25)game.hurt(e.damage);
  e.cooldown=.9;
 }
 e.attack=0;
 e.state=ENEMY_STATES.RECOVER;
}

function moveWithSeparation(game,e,p,dt,angle,boss){
 const dist=distance(e,p);
 let speed=e.speed*(e.slow>0?1-p.slow:1)*(boss&&e.hp<e.maxHp*.5?1.35:1);
 let moveAngle=angle;

 if(e.type==='shaman'&&dist<240){
  if(dist<160){speed*=.5;moveAngle+=Math.PI;}
  else speed=0;
 }

 if(e.state===ENEMY_STATES.REPOSITION&&e.stateTime>0){
  moveAngle=angle+e.sidestep*Math.PI/2;
  speed=Math.max(speed,e.speed*.8);
 }

 let vx=Math.cos(moveAngle)*speed,vy=Math.sin(moveAngle)*speed;
 for(const o of game.grid.query(e.x,e.y,65)){
  if(o===e||o.hp<=0)continue;
  const d=distance(e,o),min=e.r+o.r+4;
  if(d<min&&d>0){
   vx+=(e.x-o.x)/d*(min-d)*3;
   vy+=(e.y-o.y)/d*(min-d)*3;
  }
 }

 const ox=e.x,oy=e.y;
 moveEntity(e,vx*dt,vy*dt,game.world);
 const attempted=Math.hypot(vx,vy)*dt;
 const moved=Math.hypot(e.x-ox,e.y-oy);

 if(attempted>1.5&&moved<attempted*.18)e.blockedTime+=dt;
 else e.blockedTime=Math.max(0,e.blockedTime-dt*2);

 if(e.blockedTime>.35&&e.state!==ENEMY_STATES.REPOSITION){
  e.blockedTime=0;
  e.state=ENEMY_STATES.REPOSITION;
  e.stateTime=.5;
  e.sidestep=game.rng()<.5?-1:1;
 }
}

export function updateEnemyAI(game,e,dt){
 const p=game.player;
 e.hit=Math.max(0,e.hit-dt);
 e.slow=Math.max(0,e.slow-dt);
 e.cooldown-=dt;
 e.stateTime=Math.max(0,(e.stateTime||0)-dt);

 const dist=distance(e,p);
 const angle=Math.atan2(p.y-e.y,p.x-e.x);
 const boss=e.type==='boss';

 if(e.attack>0){
  e.state=ENEMY_STATES.WINDUP;
  e.attack-=dt;
  if(e.attack<=0)resolveAttack(game,e,p,dist);
  return;
 }

 if(e.cooldown<=0&&attackRange(e,p,dist)){
  beginAttack(e,p,angle);
  return;
 }

 if(e.state===ENEMY_STATES.SPAWN)e.state=ENEMY_STATES.PURSUE;
 if(e.state===ENEMY_STATES.REPOSITION&&e.stateTime<=0)e.state=ENEMY_STATES.PURSUE;
 if(e.state===ENEMY_STATES.RECOVER&&e.cooldown<=0)e.state=ENEMY_STATES.PURSUE;

 moveWithSeparation(game,e,p,dt,angle,boss);
}
