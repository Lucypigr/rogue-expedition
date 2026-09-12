import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../dist/js/engine.js';
import {lotteryRarity,drawLottery} from '../dist/js/shop.js';
import {updateHealingPools} from '../dist/js/healing-pools.js';
import {createWorld,distance} from '../dist/js/world.js';
import {resolveExtraAttack,startExtraAttack} from '../dist/js/monsters.js';
const fresh=()=>{const g=new Game({seed:44});g.reset(44);g.spawnClock=10000;g.castClocks.fill(10000);return g};
test('legendary probability is 3% total and ordinary grades fill remaining 97%',()=>{
 const counts={legendary:0,epic:0,rare:0,common:0};for(let i=0;i<10000;i++)counts[lotteryRarity(i/10000)]++;
 assert.deepEqual(counts,{legendary:300,epic:1200,rare:3000,common:5500});
 for(const [roll,rarity]of [[.029999,'legendary'],[.03,'epic'],[.15,'rare'],[.45,'common']])assert.equal(lotteryRarity(roll),rarity);
 for(const [roll,rarity]of [[.1,'epic'],[.2,'rare'],[.9,'common']]){const g=fresh();g.state='forge';g.forgeUnlocked=true;g.tickets=1;g.rng=()=>roll;const r=drawLottery(g);assert.equal(r.reward.rarity,rarity);assert.equal(r.reward.kind,'weapon');assert.ok(!r.reward.intrinsic);assert.equal(g.tickets,0)}
});
test('healing pools are reproducible and accessible without obstacle overlap',()=>{
 for(let seed=0;seed<20;seed++){const w=createWorld(seed);assert.deepEqual(w.healingPools,createWorld(seed).healingPools);assert.equal(w.healingPools.length,5);for(const p of w.healingPools)assert.ok(w.obstacles.every(o=>distance(p,o)>p.r+o.r))}
});
test('contact heals, full health does not consume, cooldown prevents repeated heals and pause freezes it',()=>{
 const g=fresh(),pool=g.world.healingPools[0];g.player.x=pool.x;g.player.y=pool.y;updateHealingPools(g,.01);assert.equal(pool.cooldown,0);
 g.player.hp=50;updateHealingPools(g,.01);assert.equal(g.player.hp,75);assert.equal(pool.cooldown,45);updateHealingPools(g,1);assert.equal(g.player.hp,75);
 g.pause();updateHealingPools(g,30);assert.equal(pool.cooldown,44);g.pause();updateHealingPools(g,44);assert.equal(g.player.hp,100);assert.equal(pool.cooldown,45);
 g.reset(44);assert.equal(g.world.healingPools[0].cooldown,0);
});
test('sniper fires fast shots, mender heals living allies, bomber detonates once',()=>{
 const g=fresh(),sniper=g.spawn('sniper',1400,1200);sniper.aim=Math.PI;assert.ok(startExtraAttack(sniper,500));resolveExtraAttack(g,sniper);assert.equal(g.hostile.length,1);assert.ok(Math.hypot(g.hostile[0].vx,g.hostile[0].vy)>=359);
 const ally=g.spawn('brute',1300,1200),mender=g.spawn('mender',1350,1200);ally.hp=10;resolveExtraAttack(g,mender);assert.ok(ally.hp>10&&ally.hp<=ally.maxHp);
 const bomber=g.spawn('bomber',1220,1200);assert.ok(startExtraAttack(bomber,50));resolveExtraAttack(g,bomber);assert.ok(bomber.hp<=0);assert.ok(g.zones.some(z=>z.r===105));g.step(.01);assert.ok(g.player.hp<100);
});
