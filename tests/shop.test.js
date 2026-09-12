import {socketGems} from '../dist/js/socket-model.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../dist/js/engine.js';
import {buy,sell,drawLottery,makeLegendary,prepareShop} from '../dist/js/shop.js';
import {stashEquipment,rollLevelGems,rollLoot} from '../dist/js/progression.js';
import {ACTIVE_GEMS,SUPPORT_GEMS,compileSkill} from '../dist/js/gems.js';
import {castSkill} from '../dist/js/combat.js';
const fresh=()=>{const g=new Game({seed:88});g.reset(88);g.state='forge';g.forgeUnlocked=true;return g};
test('shop deducts gold exactly once, protects equipped gear and rejects repeated sale',()=>{
 const g=fresh();g.gold=1000;prepareShop(g);const p=g.shop.stock[0].price;
 assert.equal(buy(g,0).ok,true);assert.equal(g.gold,1000-p);assert.equal(buy(g,0).ok,false);assert.equal(g.gold,1000-p);
 assert.equal(sell(g,g.equipped[0]).ok,false);
 const w=makeLegendary(g,0);g.bag.weapons.push(w);const before=g.gold;
 assert.equal(sell(g,w.id).ok,true);assert.equal(g.gold,before+200);assert.equal(sell(g,w.id).ok,false);
 g.gold=179;assert.equal(buy(g,'ticket').ok,false);g.gold=180;assert.equal(buy(g,'ticket').ok,true);assert.equal(g.gold,0);assert.equal(g.tickets,1);
 g.state='playing';assert.equal(drawLottery(g).ok,false);assert.equal(g.tickets,1);
});
test('legendary branch spends once, spend once and never grant duplicate gems',()=>{
 const g=fresh();g.tickets=4;let rolls=0;g.rng=()=>rolls++%3===0?.01:.9;
 for(let i=0;i<3;i++){const r=drawLottery(g);assert.equal(r.ok,true);assert.equal(r.reward.kind,'gem');assert.equal(r.reward.rarity,'legendary')}
 assert.equal(new Set(g.bag.support).size,3);const r=drawLottery(g);assert.equal(r.reward.kind,'weapon');assert.equal(g.tickets,0);assert.equal(drawLottery(g).ok,false);
 g.tickets=1;while(g.bag.weapons.length<40)g.bag.weapons.push({...makeLegendary(g,1)});assert.equal(drawLottery(g).ok,false);assert.equal(g.tickets,1);
});
test('legendary skill is fixed, supports work, and replacing weapon removes intrinsic',()=>{
 const g=fresh(),w=makeLegendary(g,0);stashEquipment(g,w);const i=g.equipped.indexOf(w.id);
 assert.equal(socketGems(g.links[i])[0]?.id,'phoenix');assert.equal(g.configure(i,'active',0,'fireball').ok,false);assert.equal(g.configure(i,'active',0,null).ok,false);
 g.bag.support.push('dominion');assert.equal(g.configure(i,'support',0,'dominion').ok,true);
 assert.equal(g.craft(w.id,'recolor',{index:0,color:'R'}).ok,false);g.bag.currency.chromatic=10;assert.equal(g.craft(w.id,'reroll').ok,true);assert.equal(w.sockets[0],'W');assert.equal(socketGems(g.links[i])[0]?.id,'phoenix');
 const normal={...g.bag.weapons[0],id:'spare',sockets:['W','W']};g.bag.weapons.push(normal);assert.equal(g.equip(i,'spare').ok,true);assert.equal(socketGems(g.links[i])[0],null);
});
test('phoenix damages and heals, legendary support adds ten real projectiles',()=>{
 const g=fresh();g.state='playing';g.player.hp=20;const e=g.spawn('brute',1300,1200);e.hp=10000;
 castSkill(g,compileSkill({active:'phoenix',supports:[]},g.player));assert.equal(g.player.hp,32);assert.ok(e.hp<10000);
 const s=compileSkill({active:'fireball',supports:['infinity']},g.player);assert.equal(s.count,11);castSkill(g,s);assert.equal(g.shots.length,11);
});
test('ordinary rewards cannot grant exclusive skills or legendary gems; restart resets economy',()=>{
 const g=fresh();for(let i=0;i<30;i++){for(const r of [...rollLevelGems(g),...rollLoot(g)]){if(r.kind==='active')assert.ok(!ACTIVE_GEMS[r.id].exclusive);if(r.kind==='support')assert.ok(!SUPPORT_GEMS[r.id].rarity)}}
 g.gold=999;g.tickets=2;g.lastPrize={name:'x'};prepareShop(g);g.reset(2);assert.equal(g.gold,0);assert.equal(g.tickets,0);assert.equal(g.shop,null);assert.equal(g.lastPrize,null);
});
