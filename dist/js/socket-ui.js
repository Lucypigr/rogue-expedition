import {ACTIVE_GEMS,SUPPORT_GEMS,compatible} from './gems.js';
import {SOCKET_COLORS,colorFits} from './progression.js';
export function socketStates(w,row={active:null,supports:[]}){
 return Array.from({length:4},(_,i)=>{
  const open=i<w.sockets.length,connected=open&&i<w.linked,id=i===0?row.active:row.supports[i-1];
  const powered=!!id&&connected&&colorFits(w.sockets[i],id)&&(i===0||!!row.active&&compatible(row.active,id));
  return {index:i,open,connected,id,powered,color:w.sockets[i],status:!open?'未開孔':!connected?'未連結':i===0?(id?'主動技能':'主動空孔'):powered?'輔助生效':!row.active?'待裝主動':id?'寶石不符':'已連結・空孔'};
 });
}
export function socketDiagram(w,row){
 const states=socketStates(w,row),active=states.filter(s=>s.index>0&&s.powered).length;
 return `<div class="socket-map"><div class="socket-map-heading"><strong>${w.linked} 孔串連</strong><span>${w.sockets.length} / 4 孔已開啟</span></div><div class="socket-path" aria-label="孔洞串連狀態">${states.map((s,i)=>{
 const gem=ACTIVE_GEMS[s.id]||SUPPORT_GEMS[s.id],link=i>0?`<span aria-label="${s.connected?'已連結':s.open?'未連結':'未開孔'}" class="socket-bridge ${s.connected?'connected':'broken'}">${s.connected?'∞':'×'}</span>`:'';
 return link+`<div class="socket-node ${!s.open?'sealed':!s.connected?'detached':s.powered?'powered':'connected'}" style="--socket:${SOCKET_COLORS[s.color]?.hex||'#6d7880'}"><small>${i===0?'主動':'輔助 '+i}</small><span class="socket-orb" title="${gem?.name||s.status}">${!s.open?'＋':gem?.icon||s.color}</span><b>${s.status}</b><small>${s.open?SOCKET_COLORS[s.color].name+'孔':'匠魂石開孔'}</small></div>`;
 }).join('')}</div><p class="socket-summary">${row?.active?'生效輔助 '+active+' 顆 · 僅強化本組主動技能':'先裝入主動寶石，再配置相連的輔助孔。'}</p></div>`;
}
