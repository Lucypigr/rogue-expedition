export const AFFIXES=[
 {id:'fierce',kind:'prefix',name:'殘暴的',stat:'damage',label:'本組傷害',unit:'%',min:12,max:22},
 {id:'spell',kind:'prefix',name:'秘法的',stat:'spell',label:'本組法術傷害',unit:'%',min:18,max:30},
 {id:'piercing',kind:'prefix',name:'穿心的',stat:'projectile',label:'本組投射物傷害',unit:'%',min:18,max:30},
 {id:'sharp',kind:'prefix',name:'銳利的',stat:'flat',label:'本組基礎命中傷害',unit:'',min:3,max:7},
 {id:'casting',kind:'suffix',name:'之迅咒',stat:'rate',label:'本組施放頻率',unit:'%',min:8,max:15},
 {id:'crit',kind:'suffix',name:'之精準',stat:'crit',label:'本組暴擊機率',unit:'%',min:5,max:10},
 {id:'guard',kind:'suffix',name:'之守護',stat:'armor',label:'角色護甲',unit:'',min:1,max:3},
 {id:'wind',kind:'suffix',name:'之疾風',stat:'speed',label:'角色移動速度',unit:'%',min:4,max:8}
];
export const affixTotal=(w,stat)=>(w?.affixes||[]).filter(a=>a.stat===stat).reduce((n,a)=>n+a.value,0);
export function rollAffixes(w,rng,stage){
 if(w.slot!=='weapon'||w.rarity==='legendary')return w;
 w.baseName??=w.name;w.affixes=[];
 const count=w.rarity==='epic'?2:w.rarity==='rare'?1:0,tier=stage>=7?1:stage>=4?2:3;
 for(const kind of ['prefix','suffix']){
  const pool=AFFIXES.filter(a=>a.kind===kind);
  for(let i=0;i<count;i++){const a=pool.splice(Math.floor(rng()*pool.length),1)[0];w.affixes.push({...a,tier,value:Math.round((a.min+rng()*(a.max-a.min))*(1+(3-tier)*.5))})}
 }
 w.name=(w.affixes.find(a=>a.kind==='prefix')?.name||'')+w.baseName+(w.affixes.find(a=>a.kind==='suffix')?.name||'');
 return w;
}
export function affixHTML(w){
 if(!w?.affixes?.length)return '';
 return '<div class="affix-list">'+w.affixes.map(a=>`<p><span>${a.kind==='prefix'?'前綴':'後綴'} · T${a.tier}</span> ${a.label} +${a.value}${a.unit}</p>`).join('')+'</div>';
}
