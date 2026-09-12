import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../dist/js/engine.js';
import {ACTIVE_GEMS,SUPPORT_GEMS,compileSkill,gemColor} from '../dist/js/gems.js';
import {rollAffixes} from '../dist/js/affixes.js';
import {refreshAuras} from '../dist/js/auras.js';
import {rollLevelGems,SOCKET_COLORS,gemSocket} from '../dist/js/progression.js';
function fresh(){const g=new Game({seed:42});g.reset(42);g.spawnClock=1000;g.player.invincible=100;return g}
test('trails require movement, damage enemies and expire after stopping',()=>{
 for(const id of ['embertrail','frosttrail','toxictrail']){
  const g=fresh();g.links=[{active:id,supports:[]}];g.castClocks=[0];
  const e=g.spawn('brute',1220,1200);e.hp=e.maxHp=10000;e.speed=0;
  g.step(1/60);assert.equal(g.fields.length,0);
  for(let i=0;i<30;i++)g.step(1/60,{x:1,y:0});
  assert.ok(g.fields.length>0,id);assert.ok(e.hp<10000,id);
  for(let i=0;i<300;i++)g.step(1/60);
  assert.equal(g.fields.length,0,id);
 }
});
test('auras are opt-in, reversible, scoped to equipped gems and reset on death/restart',()=>{
 const g=fresh(),base=g.player.damage;g.links=[{active:'swiftaura',supports:[]},{active:'wrathaura',supports:[]}];refreshAuras(g);
 assert.equal(g.player.auraDamage,1);assert.equal(g.toggleAura('renewalaura'),false);
 assert.equal(g.toggleAura('swiftaura'),true);assert.equal(g.player.auraSpeed,35);assert.equal(g.player.auraDamage,.75);
 g.toggleAura('wrathaura');assert.equal(g.player.auraDamage,.75*1.45);assert.equal(g.player.auraArmor,-4);
 g.toggleAura('swiftaura');assert.equal(g.player.auraSpeed,0);assert.equal(g.player.auraDamage,1.45);
 g.links=[];refreshAuras(g);assert.equal(g.player.auraDamage,1);assert.equal(g.player.auraArmor,0);assert.equal(g.player.damage,base);
 g.reset(42);assert.deepEqual(g.auras,{});
});
test('owned auras never become useless refinement rewards',()=>{
 const g=fresh();g.bag.active=Object.keys(ACTIVE_GEMS);g.bag.support=Object.keys(SUPPORT_GEMS);
 for(let i=0;i<100;i++){const options=rollLevelGems(g);assert.equal(options.length,3);assert.equal(new Set(options.map(o=>o.id)).size,3);assert.ok(options.every(o=>!o.aura))}
});
test('affix counts, unique families, tier scaling and fixed legendary powers',()=>{
 for(const [rarity,count] of [['common',0],['rare',2],['epic',4]]){
  const w=rollAffixes({slot:'weapon',name:'長杖',rarity},()=>.4,7);
  assert.equal(w.affixes.length,count);assert.equal(new Set(w.affixes.map(a=>a.id)).size,count);assert.ok(w.affixes.every(a=>a.tier===1));
  const again=rollAffixes({slot:'weapon',name:'長杖',rarity},()=>.4,7);assert.deepEqual(w,again);
 }
 const w={slot:'weapon',name:'鳳凰',rarity:'legendary',exclusive:'phoenix'};assert.deepEqual(rollAffixes({...w},()=>0,9),w);
});
test('weapon damage affixes stay local and respect spell tags',()=>{
 const g=fresh(),row={active:'fireball',supports:[]};
 const base=compileSkill(row,g.player),w={affixes:[{stat:'spell',value:20},{stat:'rate',value:10}]};
 const boosted=compileSkill(row,g.player,{},w);
 assert.ok(Math.abs(boosted.damage-base.damage*1.2)<.001);assert.ok(Math.abs(boosted.rate-base.rate*1.1)<.001);
 assert.deepEqual(compileSkill(row,g.player),base);
});
test('all gem names use their socket palette',()=>{
 for(const id of [...Object.keys(ACTIVE_GEMS),...Object.keys(SUPPORT_GEMS)])assert.equal(gemColor(id),SOCKET_COLORS[gemSocket(id)].hex,id);
});
