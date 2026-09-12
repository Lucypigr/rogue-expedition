import {equippedSkills} from './socket-model.js';
import {ACTIVE_GEMS,gemColor} from './gems.js';
export function auraButtons(g){
 return equippedSkills(g).filter(row=>ACTIVE_GEMS[row.active]?.aura).map(row=>{
 const a=ACTIVE_GEMS[row.active],on=!!g.auras[row.active];
 return `<button data-aura="${row.active}" class="${on?'on':''}" style="--aura:${gemColor(row.active)}" aria-pressed="${on}" title="${a.desc}">${a.icon} ${a.name}・${on?'開':'關'}</button>`;
 }).join('');
}
