import {weaponFor} from './progression.js';
import {castAdvanced,updateAdvanced} from './advanced-combat.js';
import {isBoss} from './monsters.js';
import {compileSkill} from './gems.js';
import {distance} from './world.js';
export function nearest(game,point,range=560,excluded=new Set()){
 let found=null,best=range;
 for(const e of game.enemies){const d=distance(point,e);if(e.hp>0&&!excluded.has(e.id)&&d<best){found=e;best=d}}
 return found;
}
export function damageWithEffects(game,e,amount,s){
 if(e.hp<=0||game.state!=='playing')return;if(s.crit&&game.rng()<s.crit)amount*=2;
 if(s.poison){e.poisonTime=3;e.poisonDamage=Math.max(e.poisonDamage||0,amount*s.poison)}
 if(s.knockback){const a=Math.atan2(e.y-game.player.y,e.x-game.player.x),v=s.knockback*(isBoss(e)?.5:1);e.x+=Math.cos(a)*v;e.y+=Math.sin(a)*v}
 const actual=Math.min(e.hp,amount);game.hitEnemy(e,amount);
 if(s.slow){e.slow=2;e.slowFactor=s.slow}
 if(s.burn&&e.hp>0){e.burnTime=3;e.burnDamage=Math.max(e.burnDamage||0,amount*s.burn)}
 if(s.leech){const heal=Math.min(actual*s.leech,game.leechBudget);game.player.hp=Math.min(game.player.maxHp,game.player.hp+heal);game.leechBudget-=heal}
 if(s.execute&&e.hp>0&&e.hp/e.maxHp<.1)game.hitEnemy(e,e.hp);
}
function effect(game,fx){if(game.effects.length<90)game.effects.push(fx)}
function projectile(game,s,x,y,a,extra={}){
 if(game.shots.length>=180)return;
 game.shots.push({...s,x,y,vx:Math.cos(a)*s.speed,vy:Math.sin(a)*s.speed,life:1.8,r:s.id==='ice'?5:6,hit:new Set(),...extra});
}
export function castSkill(game,s){
 if(!s)return false;const p=game.player,target=nearest(game,p,['nova','cyclone','shockwave'].includes(s.id)?s.radius+40:600);
 if(s.id==='orbit'){
   for(let i=0;i<2;i++){const a=game.time*2.6+i*Math.PI,point={x:p.x+Math.cos(a)*s.radius,y:p.y+Math.sin(a)*s.radius};for(const e of game.enemies)if(e.hp>0&&distance(point,e)<e.r+15)damageWithEffects(game,e,s.damage,s)}return true;
 }
 if(!target)return false;
 if(castAdvanced(game,s,target,projectile,effect,damageWithEffects)){}else if(s.id==='fireball'||s.id==='ice'){
   const a=Math.atan2(target.y-p.y,target.x-p.x);
   for(let i=0;i<s.count;i++)projectile(game,s,p.x,p.y-7,a+(i-(s.count-1)/2)*.17);
 }else if(s.id==='arc'){
   let current=target,prev={x:p.x,y:p.y-10},hit=new Set();
   for(let i=0;i<=s.chain&&current;i++){
     effect(game,{type:'arc',x:prev.x,y:prev.y,tx:current.x,ty:current.y,life:.22,max:.22,color:s.color});
     damageWithEffects(game,current,s.damage*Math.pow(.85,i),s);hit.add(current.id);prev=current;current=nearest(game,prev,190,hit);
   }
 }else if(s.id==='nova'){
   effect(game,{type:'ring',x:p.x,y:p.y,r:s.radius,life:.4,max:.4,color:s.color});
   for(const e of game.enemies)if(e.hp>0&&distance(p,e)<s.radius+e.r)damageWithEffects(game,e,s.damage,s);
 }else if(s.id==='meteor'){
   if(game.meteors.length<30)game.meteors.push({x:target.x,y:target.y,timer:.65,skill:{...s}});
 }
 p.cast=.15;game.emit('sound','cast');return true;
}
export function updateCasting(game,dt){
 for(let i=0;i<game.links.length;i++){
   if(!game.links[i].active)continue;game.castClocks[i]=(game.castClocks[i]??0)-dt;
   const s=compileSkill(game.links[i],game.player,game.gemLevels,weaponFor(game,i));
   if(game.castClocks[i]<=0&&castSkill(game,s)){
     if(game.state!=='playing')return;game.castClocks[i]=1/s.rate;
     if(s.echo&&game.echoes.length<30)game.echoes.push({timer:.22,skill:{...s,echo:false}});
   }
 }
 for(const q of game.echoes){q.timer-=dt;if(q.timer<=0)castSkill(game,q.skill)}game.echoes=game.echoes.filter(q=>q.timer>0);
 for(const m of game.meteors){m.timer-=dt;if(m.timer<=0){effect(game,{type:'impact',x:m.x,y:m.y,r:m.skill.radius,life:.45,max:.45,color:m.skill.color});game.burst(m.x,m.y,m.skill.color,24);game.shake=4;for(const e of game.enemies)if(e.hp>0&&distance(m,e)<m.skill.radius+e.r)damageWithEffects(game,e,m.skill.damage,m.skill)}}game.meteors=game.meteors.filter(m=>m.timer>0);
 updateAdvanced(game,dt,nearest,projectile,damageWithEffects,effect);
 for(const fx of game.effects)fx.life-=dt;game.effects=game.effects.filter(fx=>fx.life>0);
}
export function updateProjectiles(game,dt){
 const spawned=[];
 for(const s of game.shots){
   s.life-=dt;if(s.returning&&s.life<.9){if(!s.returned){s.hit.clear();s.returned=true}const a=Math.atan2(game.player.y-s.y,game.player.x-s.x);s.vx=Math.cos(a)*s.speed;s.vy=Math.sin(a)*s.speed;if(distance(s,game.player)<15)s.life=0}s.x+=s.vx*dt;s.y+=s.vy*dt;
   if(game.world.hash.query(s.x,s.y,50).some(o=>distance(s,o)<o.r+s.r)){if(s.ricochet>0){s.x-=s.vx*dt;s.y-=s.vy*dt;s.vx=-s.vx;s.vy=-s.vy;s.ricochet--;continue}s.life=0;game.burst(s.x,s.y,s.color||'#e8b474',3);continue}
   for(const e of game.grid.query(s.x,s.y,70)){
     if(e.hp<=0||s.hit.has(e.id)||distance(s,e)>s.r+e.r)continue;
     s.hit.add(e.id);damageWithEffects(game,e,s.damage,s);
     if(s.blast>0){effect(game,{type:'ring',x:e.x,y:e.y,r:s.blast,life:.2,max:.2,color:s.color});for(const other of game.grid.query(e.x,e.y,s.blast+50))if(other!==e&&other.hp>0&&distance(e,other)<s.blast+other.r)damageWithEffects(game,other,s.damage*.45,s)}
     game.burst(s.x,s.y,s.color||'#ffaf57',7);
     if(s.fork){const a=Math.atan2(s.vy,s.vx);spawned.push({s:{...s,damage:s.damage*.6,fork:false},x:s.x,y:s.y,a:a-.45,hit:new Set(s.hit)},{s:{...s,damage:s.damage*.6,fork:false},x:s.x,y:s.y,a:a+.45,hit:new Set(s.hit)});s.fork=false}
     // Pierce is consumed first, then chain chooses an unhit target.
     if(s.pierce>0){s.pierce--;continue}
     if(s.chain>0){const next=nearest(game,e,230,s.hit);if(next){s.chain--;s.damage*=.85;const a=Math.atan2(next.y-s.y,next.x-s.x);s.vx=Math.cos(a)*s.speed;s.vy=Math.sin(a)*s.speed;s.life=Math.max(s.life,.7);break}}
     s.life=0;break;
   }
 }
 game.shots=game.shots.filter(s=>s.life>0);
 for(const q of spawned)projectile(game,q.s,q.x,q.y,q.a,{hit:q.hit});
}
