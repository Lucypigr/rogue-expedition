import {ACTIVE_GEMS,SUPPORT_GEMS,compatible} from './gems.js';
// Schema v2: typed gems avoid collisions such as active poison / support poison.
export const gemDefinition=gem=>gem&&(gem.kind==='active'?ACTIVE_GEMS:SUPPORT_GEMS)[gem.id];
export const gemTint=gem=>({R:'#e28e7c',G:'#aed591',B:'#91ccec',W:'#eae6d3'}[gemDefinition(gem)?.socket]||'#eae6d3');
export function socketGems(row){
 if(row?.sockets)return row.sockets;
 return [row?.active?{kind:'active',id:row.active}:null,...Array.from({length:3},(_,i)=>row?.supports?.[i]?{kind:'support',id:row.supports[i]}:null)];
}
export function skillRows(row,w){
 if(!row?.sockets)return row?.active?[{...row,socket:0}]:[];
 if(!w)return [];
 const gems=socketGems(row).slice(0,w.sockets.length);
 return gems.flatMap((gem,i)=>{
  if(gem?.kind!=='active'||!ACTIVE_GEMS[gem.id])return [];
  const supports=gems.flatMap((s,j)=>s?.kind==='support'&&i<w.linked&&j<w.linked&&compatible(gem.id,s.id)?[s.id]:[]);
  return [{active:gem.id,supports,socket:i}];
 });
}
export function equippedSkills(g){
 return g.links.flatMap((row,index)=>{
  const weapon=g.bag.weapons.find(w=>w.id===g.equipped[index]);
  return skillRows(row,weapon).map(skill=>({...skill,index,weapon,key:index+':'+skill.socket+':'+skill.active}));
 });
}
export function installGem(g,index,position,gem){
 if(!['paused','build','reward','forge','camp'].includes(g.state))return {ok:false,reason:'請先暫停或開啟背包'};
 if(!Number.isInteger(index)||!g.links[index])return {ok:false,reason:'裝備欄不存在'};
 const w=g.bag.weapons.find(w=>w.id===g.equipped[index]);
 if(!w||!Number.isInteger(position)||position<0||position>=w.sockets.length)return {ok:false,reason:'此孔尚未開啟'};
 if(w.intrinsic&&position===0)return {ok:false,reason:'傳說專屬技能固定於首孔'};
 if(gem){
  if(!['active','support'].includes(gem.kind)||!gemDefinition(gem)||!g.bag[gem.kind].includes(gem.id)||gemDefinition(gem).exclusive)return {ok:false,reason:'尚未取得此寶石'};
  if(g.links.some((r,i)=>socketGems(r).some((v,j)=>v?.kind===gem.kind&&v.id===gem.id&&(i!==index||j!==position))))return {ok:false,reason:'寶石已裝在其他孔，請先取下'};
 }
 const slots=socketGems(g.links[index]).map(v=>v?{...v}:null);
 const previous=slots[position];slots[position]=gem?{...gem}:null;
 g.links[index]={sockets:slots};
 if(previous?.kind==='active'&&ACTIVE_GEMS[previous.id]?.aura&&previous.id!==gem?.id)g.auras[previous.id]=false;
 g.socketClocks={};
 return {ok:true,reason:gem?'已裝入寶石；相連且相容的輔助自動生效':'寶石已取下'};
}
export function sanitizeSockets(g,index){
 const w=g.bag.weapons.find(w=>w.id===g.equipped[index]),row=g.links[index];
 if(!w||!row)return;
 const slots=socketGems(row).map((v,i)=>i<w.sockets.length&&v&&!gemDefinition(v)?.exclusive?v:null);
 if(w.intrinsic)slots[0]={kind:'active',id:w.intrinsic};
 g.links[index]={sockets:slots};g.socketClocks={};
 for(const id of Object.keys(g.auras))if(!equippedSkills(g).some(s=>s.active===id))g.auras[id]=false;
}
