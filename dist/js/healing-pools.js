export const POOL_COOLDOWN=45,POOL_HEAL=.25;
export function updateHealingPools(g,dt){
 if(g.state!=='playing')return;
 for(const pool of g.world.healingPools||[]){
  pool.cooldown=Math.max(0,pool.cooldown-dt);const p=g.player;
  if(pool.cooldown===0&&p.hp<p.maxHp&&p.hp>0&&Math.hypot(p.x-pool.x,p.y-pool.y)<pool.r+p.r){
   const heal=Math.min(p.maxHp-p.hp,p.maxHp*POOL_HEAL);p.hp+=heal;pool.cooldown=POOL_COOLDOWN;
   g.burst(pool.x,pool.y,'#72f0cb',22);g.emit('sound','pickup');
   if(g.texts.length<70)g.texts.push({x:p.x,y:p.y-35,text:'生命 +'+Math.round(heal),life:1,color:'#88ffd6'});
  }
 }
}
export function drawHealingPools(c,g,clock,visible){
 for(const p of g.world.healingPools||[]){if(!visible(p,70))continue;c.save();const ready=p.cooldown<=0;c.fillStyle=ready?'#207f7999':'#344c4c99';c.strokeStyle=ready?'#80f5d7':'#748f92';c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y,p.r,p.r*.7,0,0,Math.PI*2);c.fill();c.stroke();if(ready){c.globalAlpha=.4+Math.sin(clock*3)*.15;c.beginPath();c.ellipse(p.x,p.y,p.r+6,p.r*.7+6,0,0,Math.PI*2);c.stroke()}c.globalAlpha=1;c.fillStyle=ready?'#bbffe2':'#9eb6b6';c.font='bold 25px Arial';c.textAlign='center';c.fillText('+',p.x,p.y+8);c.font='14px Arial';c.fillText(ready?'回血池・恢復 25%':Math.ceil(p.cooldown)+' 秒後恢復',p.x,p.y-p.r-8);c.restore()}
}
