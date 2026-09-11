import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../dist/js/engine.js';
const fresh=()=>{const g=new Game({seed:77});g.reset(77);g.player.hp=g.player.maxHp=100000;g.castClocks.fill(10000);return g};
function chooseLevels(g){let n=0;while(g.state==='levelup'){assert.ok(++n<100);g.choose(0)}}
test('waiting alone cannot skip a wave; all scheduled enemies must be killed',()=>{const g=fresh();g.spawnClock=0;for(let i=0;i<1000;i++)g.step(.05);assert.equal(g.wave,1);assert.equal(g.waveRemaining,0);assert.ok(g.enemies.length>0);assert.equal(g.bossSpawned,false);const survivor=g.enemies[0];for(const e of [...g.enemies])if(e!==survivor)g.hitEnemy(e,100000);g.step(.01);chooseLevels(g);assert.equal(g.wave,1);g.hitEnemy(survivor,100000);g.step(.01);chooseLevels(g);assert.equal(g.wave,2);assert.equal(g.round,1)});
test('complete 45 waves: nine boss rewards, forge every fifth wave, no early finish or round four',()=>{
 const g=fresh(),bosses=[],visited=[];
 while(g.state!=='won'){
  const round=g.round,wave=g.wave;visited.push([round,wave]);assert.equal(g.finish(),false);
  if(wave%5===0){
   g.step(.01);assert.ok(g.boss);bosses.push([round,wave]);g.hitEnemy(g.boss,1e9);chooseLevels(g);
   assert.equal(g.state,'reward');assert.equal(g.nextRound(),false);assert.equal(g.takeReward(1),true);
   assert.equal(g.state,'forge');assert.equal(g.forgeUnlocked,true);
   const w=g.bag.weapons[0];g.bag.currency.chromatic+=2;
   assert.equal(g.craft(w.id,'reroll').ok,true);
   // Keep a valid starting skill when random recoloring removes it.
   w.sockets[0]='W';g.configure(0,'active',0,'fireball');
   if(round===3&&wave===15){assert.equal(g.nextRound(),false);assert.equal(g.finish(),true)}
   else {assert.equal(g.finish(),false);assert.equal(g.nextRound(),true);assert.equal(g.round,wave===15?round+1:round);assert.equal(g.wave,wave===15?1:wave+1);assert.equal(g.forgeUnlocked,false)}
  }else{
   let guard=0;while(g.wave===wave&&g.round===round){assert.ok(++guard<500);g.spawnClock=0;g.step(.05);chooseLevels(g);for(const e of [...g.enemies])g.hitEnemy(e,1e9);chooseLevels(g)}
   assert.equal(g.round,round);assert.equal(g.wave,wave+1);
  }
  assert.ok(visited.length<=45);
 }
 assert.equal(visited.length,45);assert.deepEqual(bosses,[[1,5],[1,10],[1,15],[2,5],[2,10],[2,15],[3,5],[3,10],[3,15]]);
 assert.equal(g.bossesDefeated,9);assert.equal(g.state,'won');assert.equal(g.nextRound(),false);
 g.reset(77);assert.equal(g.round,1);assert.equal(g.wave,1);assert.equal(g.bossesDefeated,0);assert.equal(g.forgeUnlocked,false);
});
