import {rollAffixes} from './affixes.js';
import {stashEquipment,weaponReward,WEAPON_BASES,ARMOR_BASES} from './progression.js';
import {SUPPORT_GEMS} from './gems.js';
export const TICKET_PRICE=180;
export const LOTTERY_RATES={legendary:.03,epic:.12,rare:.30,common:.55};
export const lotteryRarity=r=>r<.03?'legendary':r<.15?'epic':r<.45?'rare':'common';
export const LEGENDARY_WEAPONS=[
 {name:'不死鳥・燼羽權杖',icon:'✹',intrinsic:'phoenix',desc:'專屬：召喚鳳凰焚燒周圍敵人，並回復最大生命 12%。'},
 {name:'星界・萬箭長弓',icon:'✧',intrinsic:'astral',desc:'專屬：同時射出 5 枚穿透星矢，可串連投射物輔助。'},
 {name:'天罰・雷霆戰錘',icon:'ϟ',intrinsic:'judgment',desc:'專屬：大範圍雷霆重擊，造成高傷害並緩速 70%。'}
];
export function makeLegendary(g,index){return {...LEGENDARY_WEAPONS[index],id:'legend-'+g.nextId++,slot:'weapon',rarity:'legendary',bonus:'hit',power:50,sockets:['W','W','W','W'],linked:4}}
export const sellPrice=w=>w.rarity==='legendary'?200:Math.max(15,Math.round(w.power*2+(w.rarity==='epic'?45:0)));
export const shopOpen=g=>g.forgeUnlocked&&['forge','build'].includes(g.state);
export function prepareShop(g){
 const key=g.round+'-'+g.wave;if(g.shop?.key===key)return;
 const bases=[WEAPON_BASES[Math.floor(g.rng()*WEAPON_BASES.length)],ARMOR_BASES[0],ARMOR_BASES[2]];
 g.shop={key,stock:bases.map(b=>{const w=weaponReward(g,b).weapon;return {weapon:w,price:sellPrice(w)*3,sold:false}})};
}
const fail=reason=>({ok:false,reason});
export function buy(g,index){
 if(!shopOpen(g))return fail('每次擊敗 Boss 後商店才開放');prepareShop(g);
 if(index==='ticket'){if(g.gold<TICKET_PRICE)return fail('金幣不足');g.gold-=TICKET_PRICE;g.tickets++;return {ok:true,reason:'獲得臨界卷 ×1'}}
 if(!Number.isInteger(index))return fail('商品不存在');const item=g.shop.stock[index];
 if(!item||item.sold)return fail('此商品已售出');if(g.bag.weapons.length>=40)return fail('背包已滿，請先出售裝備');if(g.gold<item.price)return fail('金幣不足');
 g.gold-=item.price;item.sold=true;stashEquipment(g,item.weapon);g.emit('loadout');return {ok:true,reason:'已購買 '+item.weapon.name};
}
export function sell(g,id){
 if(!shopOpen(g))return fail('請在 Boss 後的商店出售');const i=g.bag.weapons.findIndex(w=>w.id===id);
 if(i<0)return fail('裝備不存在');if(g.equipped.includes(id))return fail('已裝備的物品不能出售，請先換裝');
 const w=g.bag.weapons.splice(i,1)[0],price=sellPrice(w);g.gold+=price;return {ok:true,reason:'出售 '+w.name+'，獲得 '+price+' 金幣'};
}
export function drawLottery(g){
 if(!shopOpen(g))return fail('請在商店使用臨界卷');if(g.tickets<1)return fail('需要一張臨界卷');if(g.bag.weapons.length>=40)return fail('背包已滿，請先出售裝備');
 const gems=Object.keys(SUPPORT_GEMS).filter(id=>SUPPORT_GEMS[id].rarity==='legendary'&&!g.bag.support.includes(id));
 g.tickets--;let reward;const rarity=lotteryRarity(g.rng());
 if(rarity!=='legendary'){const w=weaponReward(g).weapon;w.rarity=rarity;const tier=(g.round-1)*3+Math.ceil(g.wave/5);w.power=8+tier*3+(rarity==='epic'?20:rarity==='rare'?10:0);w.sockets=Array.from({length:rarity==='epic'?4:rarity==='rare'?3:2},()=>['R','G','B'][Math.floor(g.rng()*3)]);w.sockets[0]='W';w.linked=rarity==='epic'?3:2;rollAffixes(w,g.rng,tier);stashEquipment(g,w);reward={kind:'weapon',...w}}
 else if(gems.length&&g.rng()>=.5){const id=gems[Math.floor(g.rng()*gems.length)];g.bag.support.push(id);reward={kind:'gem',...SUPPORT_GEMS[id],id}}
 else{const w=makeLegendary(g,Math.floor(g.rng()*LEGENDARY_WEAPONS.length));stashEquipment(g,w);reward={kind:'weapon',...w}}
 g.lastPrize=reward;g.emit('loadout');g.emit('sound','win');return {ok:true,reason:(rarity==='legendary'?'傳說降臨：':'抽獎獲得：')+reward.name,reward};
}
