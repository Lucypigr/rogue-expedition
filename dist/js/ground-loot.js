import {ACTIVE_GEMS,SUPPORT_GEMS} from './gems.js';
import {stashEquipment} from './progression.js';
import {gemTint} from './socket-model.js';
export const GEM_DROP_RATES={normal:.05,boss:.35};
export function dropGem(g,boss=false,point=g.player){
 if(g.rng()>=GEM_DROP_RATES[boss?'boss':'normal'])return null;
 const pool=[...Object.entries(ACTIVE_GEMS).filter(([,a])=>!a.exclusive).map(([id])=>({kind:'active',id})),...Object.entries(SUPPORT_GEMS).filter(([,a])=>!a.rarity).map(([id])=>({kind:'support',id}))];
 const gem=pool[Math.floor(g.rng()*pool.length)],a=(gem.kind==='active'?ACTIVE_GEMS:SUPPORT_GEMS)[gem.id];
 const loot={x:point.x+12,y:point.y,kind:'gem',gem,name:a.name,rarity:'common'};
 g.groundLoot.push(loot);return loot;
}
export function pickupLoot(g){
 if(g.state!=='playing')return;
 g.groundLoot=g.groundLoot.filter(loot=>{
  if(Math.hypot(loot.x-g.player.x,loot.y-g.player.y)>g.player.r+22)return true;
  if(loot.kind==='weapon')stashEquipment(g,loot.weapon);
  else{
   const {kind,id}=loot.gem;
   if(!g.bag[kind].includes(id))g.bag[kind].push(id);
   else if(kind==='active'&&!ACTIVE_GEMS[id].aura)g.gemLevels[id]=(g.gemLevels[id]||0)+1;
   else g.bag.currency.jeweller++;
  }
  g.lootHistory.unshift({name:loot.name});g.lootHistory.length=Math.min(8,g.lootHistory.length);
  g.emit('gearDrop',loot);g.emit('sound','pickup');return false;
 });
}
export function drawGroundLoot(c,g,clock,visible){
 for(const loot of g.groundLoot){
  if(!visible(loot,100))continue;
  const color=loot.kind==='gem'?gemTint(loot.gem):loot.rarity==='epic'?'#d4a3ff':loot.rarity==='rare'?'#f4d07d':'#e9e2c9';
  c.save();c.translate(loot.x,loot.y);c.shadowColor=color;c.shadowBlur=12;
  const beam=c.createLinearGradient(0,-65,0,0);beam.addColorStop(0,'transparent');beam.addColorStop(1,color);c.globalAlpha=.4+.1*Math.sin(clock*3);c.fillStyle=beam;c.fillRect(-4,-65,8,65);c.globalAlpha=1;
  c.fillStyle=color;c.beginPath();c.moveTo(0,-9);c.lineTo(7,0);c.lineTo(0,7);c.lineTo(-7,0);c.closePath();c.fill();
  c.shadowBlur=0;c.font='12px sans-serif';c.textAlign='center';const label=(loot.kind==='gem'?'◆ ':'▣ ')+loot.name;
  const width=c.measureText(label).width+12;c.fillStyle='#10211eef';c.fillRect(-width/2,13,width,21);c.fillStyle=color;c.fillText(label,0,28);c.restore();
 }
}
