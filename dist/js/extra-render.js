import {compileSkill,ACTIVE_GEMS,gemColor} from './gems.js';
const TAU=Math.PI*2;
function poly(c,p,color){c.fillStyle=color;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
export function drawExtraEnemy(c,e,clock){
 if(['sniper','bomber','mender'].includes(e.type)){c.save();c.translate(e.x,e.y);c.font='30px "Segoe UI Emoji",sans-serif';c.textAlign='center';c.fillText(e.type==='sniper'?'🏹':e.type==='bomber'?'💣':'☘',0,0);c.font='12px Arial';c.fillStyle=e.color;c.fillText(e.name,0,-34);if(e.attack>0){c.strokeStyle=e.color;c.lineWidth=2;if(e.type==='bomber'){c.beginPath();c.arc(0,0,105,0,TAU);c.stroke()}else if(e.type==='sniper'){c.setLineDash([8,8]);c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(e.aim)*650,Math.sin(e.aim)*650);c.stroke()}else{c.beginPath();c.arc(0,0,240,0,TAU);c.stroke()}}c.restore();return true}
 if(!['charger','spitter','summoner','wraith','frostBoss','broodBoss'].includes(e.type))return false;
 c.save();c.translate(e.x,e.y);const bob=Math.sin(clock*4+e.id)*2,color=e.hit>0?'#ffebc4':e.color;
 if(e.type==='charger'){
  poly(c,[[-23,3],[-20,-19],[-6,-28],[16,-23],[24,-8],[18,7]],color);poly(c,[[-18,-14],[-25,-33],[-10,-23]],'#e0c298');poly(c,[[10,-23],[26,-33],[20,-9]],'#e0c298');poly(c,[[-8,-11],[8,-11],[3,1],[-4,1]],'#554e37');circle(c,-10,-16,2,'#ffe09a');circle(c,10,-16,2,'#ffe09a');
  if(e.attack>0){c.rotate(e.aim);c.fillStyle='#f2a36e22';c.fillRect(0,-e.r,295,e.r*2);c.strokeStyle='#e8af77';c.setLineDash([8,8]);c.strokeRect(0,-e.r,295,e.r*2)}
 }else if(e.type==='spitter'){
  circle(c,0,-5+bob,19,color);for(let i=0;i<5;i++)circle(c,Math.cos(i*1.25)*16,-8+Math.sin(i*1.25)*11+bob,7,'#71873f');circle(c,0,-4+bob,9,'#c6d983');circle(c,0,-5+bob,4,'#394828');
 }else if(e.type==='summoner'){
  poly(c,[[-19,7],[-12,-18],[0,-36],[13,-20],[20,7]],color);poly(c,[[-8,-20],[8,-20],[5,-8],[-5,-8]],'#342e42');circle(c,-4,-16,2,'#f1c2ed');circle(c,4,-16,2,'#f1c2ed');c.strokeStyle='#a59073';c.lineWidth=3;c.beginPath();c.moveTo(22,7);c.lineTo(22,-32);c.stroke();circle(c,22,-33,6,'#c29edc');
 }else if(e.type==='wraith'){
  c.globalAlpha=.7;poly(c,[[-13,10],[-17,-11+bob],[-5,-27+bob],[9,-22+bob],[17,-7+bob],[10,14],[2,5],[-4,15]],color);poly(c,[[-7,-14+bob],[8,-14+bob],[4,-5+bob],[-4,-5+bob]],'#284748');circle(c,-3,-12+bob,2,'#d9f7d3');circle(c,4,-12+bob,2,'#d9f7d3');
 }else if(e.type==='frostBoss'){
  poly(c,[[-35,15],[-28,-18],[-13,-43],[14,-43],[30,-15],[38,15],[0,7]],color);poly(c,[[-17,-35],[-16,-61],[-5,-51],[0,-70],[7,-51],[20,-61],[18,-32]],'#c2e4ee');poly(c,[[-12,-34],[12,-34],[8,-16],[-8,-16]],'#365c72');circle(c,-6,-29,3,'#e7fdff');circle(c,6,-29,3,'#e7fdff');for(let i=0;i<5;i++){const a=clock+i*TAU/5,x=Math.cos(a)*53,y=Math.sin(a)*24-16;poly(c,[[x,y-8],[x+4,y],[x,y+8],[x-4,y]],'#b2e4ef')}
 }else{
  for(let i=0;i<4;i++){const side=i%2?1:-1,yy=(i<2?-18:7);poly(c,[[side*20,yy],[side*59,yy-13],[side*46,yy+18],[side*36,yy+4]],'#899458')}
  poly(c,[[-34,8],[-42,-16],[-22,-45],[20,-45],[43,-17],[32,12],[0,24]],color);circle(c,-18,-30,11,'#85974c');circle(c,17,-30,11,'#85974c');poly(c,[[-15,-19],[15,-19],[7,0],[-7,0]],'#384827');for(const x of [-12,-4,4,12])circle(c,x,-24,2.5,'#eaf5b7');
 }
 c.restore();return true;
}
export function drawGemEffects(c,game){
 for(const row of game.links){if(!ACTIVE_GEMS[row.active]?.aura||!game.auras[row.active])continue;c.save();c.strokeStyle=gemColor(row.active);c.globalAlpha=.55;c.lineWidth=2;c.beginPath();c.ellipse(game.player.x,game.player.y+5,65,35,game.time*.15,0,TAU);c.stroke();c.restore()}
 for(const f of game.fields||[]){c.save();c.globalAlpha=.25;c.fillStyle=f.skill.color;c.beginPath();c.arc(f.x,f.y,f.skill.radius,0,TAU);c.fill();c.globalAlpha=.8;c.strokeStyle=f.skill.color;c.lineWidth=2;c.beginPath();c.arc(f.x,f.y,f.type==='ball'?18:f.skill.radius*.7,game.time,game.time+5);c.stroke();c.restore()}
 for(const t of game.totems||[]){poly(c,[[t.x-10,t.y+5],[t.x-8,t.y-20],[t.x+8,t.y-20],[t.x+10,t.y+5]],'#b89a62');circle(c,t.x,t.y-25,7,'#efb86c')}

 for(const m of game.meteors){c.strokeStyle=m.skill.color;c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();c.arc(m.x,m.y,m.skill.radius,0,TAU);c.stroke();c.setLineDash([]);const y=m.y-m.timer*190;circle(c,m.x,y,9,m.skill.color);c.strokeStyle=m.skill.color;c.beginPath();c.moveTo(m.x,y);c.lineTo(m.x+25,y-60);c.stroke()}
 for(const fx of game.effects){c.save();c.globalAlpha=Math.max(0,fx.life/fx.max);c.strokeStyle=fx.color;c.lineWidth=fx.type==='arc'?3:2;
  if(fx.type==='phoenix'){const t=1-fx.life/fx.max;c.font='46px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';c.textAlign='center';c.shadowColor='#ff9b38';c.shadowBlur=20;c.fillText('🐦‍🔥',fx.x+(fx.tx-fx.x)*t,fx.y+(fx.ty-fx.y)*t-25-Math.sin(t*Math.PI)*45)}
  else if(fx.type==='arc'){c.beginPath();c.moveTo(fx.x,fx.y);for(let i=1;i<6;i++){const t=i/6;c.lineTo(fx.x+(fx.tx-fx.x)*t+(i%2?8:-8),fx.y+(fx.ty-fx.y)*t)}c.lineTo(fx.tx,fx.ty);c.stroke();c.strokeStyle='#effaff';c.lineWidth=1;c.stroke()}
  else{const r=fx.r*(1-fx.life/fx.max*.6);c.beginPath();c.arc(fx.x,fx.y,r,0,TAU);c.stroke();if(fx.type==='impact'){c.fillStyle=fx.color;c.globalAlpha*=.22;c.fill()}}
  c.restore();
 }
 for(const row of game.links){if(row.active!=='orbit')continue;const s=compileSkill(row,game.player,game.gemLevels);for(let i=0;i<2;i++){const a=game.time*2.6+i*Math.PI,x=game.player.x+Math.cos(a)*s.radius,y=game.player.y+Math.sin(a)*s.radius;c.save();c.translate(x,y);c.rotate(a);poly(c,[[0,-17],[7,-3],[3,16],[-4,3]],s.color);c.restore()}}
}
