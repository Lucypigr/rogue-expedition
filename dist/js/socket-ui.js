import {ACTIVE_GEMS,compatible} from './gems.js';
import {socketGems,gemDefinition,gemTint,skillRows} from './socket-model.js';
export function socketStates(w,row){
 const gems=socketGems(row),skills=skillRows(row,w);
 return Array.from({length:4},(_,i)=>{
  const open=i<w.sockets.length,connected=open&&i<w.linked,gem=gems[i],id=gem?.id;
  const powered=open&&!!gem&&(gem.kind==='active'||skills.some(s=>s.supports.includes(id)));
  const status=!open?'未開孔':gem?.kind==='active'?(ACTIVE_GEMS[id]?.aura?'光環':'主動技能'):gem?powered?'輔助生效':'輔助未生效':connected?'已連結・空孔':'獨立空孔';
  return {index:i,open,connected,gem,id,powered,color:w.sockets[i],status};
 });
}
export function socketDiagram(w,row,index=null){
 const states=socketStates(w,row),active=states.filter(s=>s.gem?.kind==='support'&&s.powered).length;
 return '<div class="socket-map"><div class="socket-map-heading"><strong>'+w.linked+' 孔串連</strong><span>'+w.sockets.length+' / 4 自由孔</span></div><div class="socket-path" aria-label="自由孔洞串連狀態">'+states.map((s,i)=>{
 const gem=gemDefinition(s.gem),bridge=i>0?'<span class="socket-bridge '+(s.connected?'connected':'broken')+'" aria-label="'+(s.connected?'已連結':'未連結')+'">'+(s.connected?'∞':'×')+'</span>':'';
 const tag=index===null?'div':'button',attrs=index===null?'':' type="button" data-pick-row="'+index+'" data-pick-socket="'+i+'" '+(!s.open||w.intrinsic&&i===0?'disabled':'');
 return bridge+'<'+tag+attrs+' class="socket-node '+(!s.open?'sealed':s.powered?'powered':'detached')+'" style="--socket:'+gemTint(s.gem)+'"><small>孔 '+(i+1)+'</small><span class="socket-orb">'+(!s.open?'＋':gem?.icon||'◇')+'</span><b>'+s.status+'</b><small>'+(w.intrinsic&&i===0?'專屬固定':gem?.name||'不限顏色')+'</small></'+tag+'>';
 }).join('')+'</div><p class="socket-summary">生效輔助 '+active+' 顆 · 金鏈內共享相容輔助；獨立孔可施放技能或光環。</p></div>';
}
