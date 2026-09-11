import {distance} from './world.js';
export function castAdvanced(game,s,target,projectile,effect,damage){
 const p=game.player,a=Math.atan2(target.y-p.y,target.x-p.x);
 if(['spark','poison','spectral','magma'].includes(s.id)){for(let i=0;i<s.count;i++)projectile(game,s,p.x,p.y-7,a+(i-(s.count-1)/2)*.24);return true}
 if(s.id==='barrage'){for(let i=0;i<4;i++)if(game.echoes.length<30)game.echoes.push({timer:.07+i*.09,skill:{...s,id:'ice',pierce:0,count:s.count}});return true}
 if(s.id==='ball'){if(game.fields.length<35)game.fields.push({type:'ball',x:p.x,y:p.y,vx:Math.cos(a)*s.speed,vy:Math.sin(a)*s.speed,life:s.duration,clock:0,skill:{...s}});return true}
 if(s.id==='blizzard'){if(game.fields.length<35)game.fields.push({type:'blizzard',x:target.x,y:target.y,vx:0,vy:0,life:s.duration,clock:0,skill:{...s}});return true}
 if(s.id==='totem'){if(game.totems.length<8)game.totems.push({x:p.x+30,y:p.y+10,life:s.duration,clock:0,skill:{...s}});return true}
 if(['frostbomb','bladefall'].includes(s.id)){const n=s.id==='bladefall'?3:1;for(let i=0;i<n&&game.meteors.length<30;i++)game.meteors.push({x:target.x+(i-(n-1)/2)*45,y:target.y,timer:(s.id==='frostbomb'?1:.3)+i*.2,skill:{...s}});return true}
 if(s.id==='shockwave'||s.id==='cyclone'){
 effect(game,{type:'ring',x:p.x,y:p.y,r:s.radius,life:.3,max:.3,color:s.color});for(const e of game.enemies){const ang=Math.atan2(e.y-p.y,e.x-p.x),delta=Math.atan2(Math.sin(ang-a),Math.cos(ang-a));if(e.hp>0&&distance(p,e)<s.radius+e.r&&(s.id==='cyclone'||Math.abs(delta)<.95))damage(game,e,s.damage,s)}return true;
 }return false;
}
export function updateAdvanced(game,dt,nearest,projectile,damage,effect){
 for(const f of game.fields){f.life-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.clock-=dt;if(f.clock<=0){f.clock=f.type==='ball'?.3:.5;for(const e of game.enemies)if(e.hp>0&&distance(f,e)<f.skill.radius+e.r)damage(game,e,f.skill.damage,f.skill)}}game.fields=game.fields.filter(f=>f.life>0);
 for(const t of game.totems){t.life-=dt;t.clock-=dt;if(t.clock<=0){const e=nearest(game,t,450);if(e){projectile(game,{...t.skill,id:'fireball',speed:360,blast:22,pierce:0,chain:0},t.x,t.y-20,Math.atan2(e.y-t.y,e.x-t.x));t.clock=.6}}}game.totems=game.totems.filter(t=>t.life>0);
}
