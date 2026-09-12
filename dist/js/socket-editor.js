import {ACTIVE_GEMS,SUPPORT_GEMS,compileSkill} from './gems.js';
import {socketGems,gemDefinition,gemTint,skillRows} from './socket-model.js';
import {socketDiagram} from './socket-ui.js';
export function socketEditor(g,w,row,index,selected){
 const skills=skillRows(row,w);
 return socketDiagram(w,row,index)+skills.map(s=>{
 const a=ACTIVE_GEMS[s.active],stats=compileSkill(s,g.player,g.gemLevels,w);
 return '<p class="active-description" style="color:'+gemTint({kind:'active',id:s.active})+'">'+a.name+' · 孔 '+(s.socket+1)+'<br>'+a.desc+'</p>'+(a.aura?'<button data-aura="'+s.active+'" aria-pressed="'+!!g.auras[s.active]+'">'+(g.auras[s.active]?'關閉':'開啟')+' '+a.name+'</button>':'<div class="link-stats"><span>'+Math.round(stats.damage)+' 傷害 · '+stats.rate.toFixed(2)+'/s · '+s.supports.length+' 顆輔助</span></div>');
 }).join('')+(selected?.row===index?gemPicker(g,index,selected.socket):'');
}
export function gemPicker(g,row,socket){
 const gems=[...g.bag.active.map(id=>({kind:'active',id})),...g.bag.support.map(id=>({kind:'support',id}))];
 return '<div class="gem-picker" aria-label="選擇孔 '+(socket+1)+' 的寶石"><h3>孔 '+(socket+1)+' · 點選寶石裝入</h3><button class="secondary" data-gem-remove>取下此孔寶石</button><div class="gem-picks">'+gems.map(gem=>{
 const a=gemDefinition(gem),used=g.links.some((r,i)=>socketGems(r).some((v,j)=>v?.kind===gem.kind&&v.id===gem.id&&(i!==row||j!==socket)));
 return '<button type="button" data-gem-kind="'+gem.kind+'" data-gem-id="'+gem.id+'" '+(used?'disabled':'')+' style="color:'+gemTint(gem)+'"><strong>'+a.icon+' '+a.name+'</strong><small>'+(used?'已裝在其他孔':a.aura?'光環':gem.kind==='active'?'主動':'輔助')+'</small><span>'+a.desc+'</span></button>';
 }).join('')+'</div></div>';
}
