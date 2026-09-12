import {ACTIVE_GEMS} from './gems.js';
export function refreshAuras(g){
 const p=g.player;p.auraDamage=1;p.auraSpeed=0;p.auraArmor=0;p.auraRegen=0;
 for(const row of g.links){const aura=ACTIVE_GEMS[row.active]?.aura;if(!aura||!g.auras?.[row.active])continue;p.auraDamage*=aura.damage||1;p.auraSpeed+=aura.speed||0;p.auraArmor+=aura.armor||0;p.auraRegen+=aura.regen||0}
}
export function toggleAura(g,id){
 if(!['playing','paused','build','forge','camp'].includes(g.state)||!ACTIVE_GEMS[id]?.aura||!g.links.some(r=>r.active===id))return false;
 g.auras[id]=!g.auras[id];refreshAuras(g);g.emit('loadout');return true;
}
