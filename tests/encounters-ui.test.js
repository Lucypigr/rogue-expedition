import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../dist/js/engine.js';
import {waveBudget,packSize,enemyPool} from '../dist/js/encounters.js';
import {socketStates,socketDiagram} from '../dist/js/socket-ui.js';
import {MAX_ENEMIES} from '../dist/js/data.js';
test('larger finite packs respect quota and live enemy cap; later waves mix ranged and chargers',()=>{
 assert.equal(waveBudget(1,1),22);assert.equal(waveBudget(3,14),56);
 assert.equal(waveBudget(1,5),9);assert.equal(waveBudget(3,15),15);
 assert.equal(packSize(1),6);assert.equal(packSize(3),10);
 assert.ok(enemyPool(1,6).includes('shaman'));assert.ok(enemyPool(1,6).includes('charger'));
 const g=new Game({seed:32});g.reset(32);g.spawnWave();assert.equal(g.enemies.length,6);assert.equal(g.waveRemaining,16);
 g.enemies=Array.from({length:MAX_ENEMIES},()=>({hp:1}));g.spawnWave();assert.equal(g.enemies.length,MAX_ENEMIES);assert.equal(g.waveRemaining,16);
});
test('socket map distinguishes active, working support, disconnected and unopened positions',()=>{
 const w={sockets:['B','G','R'],linked:2},row={active:'fireball',supports:['multi',null,null]};
 const states=socketStates(w,row);
 assert.deepEqual(states.map(s=>s.status),['主動技能','輔助生效','獨立空孔','未開孔']);
 assert.equal(states.filter(s=>s.powered).length,2);
 const html=socketDiagram(w,row);assert.match(html,/2 孔串連/);assert.match(html,/生效輔助 1 顆/);
 assert.equal((html.match(/socket-bridge connected/g)||[]).length,1);
 assert.equal((html.match(/socket-bridge broken/g)||[]).length,2);
 w.linked=3;assert.equal(socketStates(w,row)[2].status,'已連結・空孔');
 w.sockets.push('W');w.linked=4;assert.equal(socketStates(w,row)[3].connected,true);
 assert.doesNotThrow(()=>socketDiagram(w));
});
test('boss reinforcements are finite and remaining counter clears when boss dies',()=>{
 const g=new Game({seed:32});g.reset(32);g.wave=5;g.waveRemaining=waveBudget(1,5);g.step(.01);
 assert.ok(g.boss);assert.ok(g.enemies.length>1);g.hitEnemy(g.boss,1e9);
 assert.equal(g.waveRemaining,0);assert.equal(g.enemies.length,0);
});
