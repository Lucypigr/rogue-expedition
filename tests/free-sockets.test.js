import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../dist/js/engine.js';
import {equippedSkills,socketGems} from '../dist/js/socket-model.js';
import {compileSkill} from '../dist/js/gems.js';
import {updateCasting} from '../dist/js/combat.js';
import {dropGem,pickupLoot} from '../dist/js/ground-loot.js';
import {dropEquipment} from '../dist/js/progression.js';
import {socketEditor} from '../dist/js/socket-editor.js';
function setup(){
 const g=new Game({seed:42});g.reset(42);g.state='build';
 const w=g.bag.weapons[0];w.sockets=['R','G','B','R'];w.linked=3;
 g.bag.active.push('ice','renewalaura','poison');g.bag.support.push('multi','poison','chain');
 return g;
}
test('all colors and types fit any open socket; connected support boosts two real casts',()=>{
 const g=setup();
 assert.equal(g.install(0,0,{kind:'support',id:'multi'}).ok,true);
 assert.equal(g.install(0,1,{kind:'active',id:'fireball'}).ok,true);
 assert.equal(g.install(0,2,{kind:'active',id:'ice'}).ok,true);
 assert.equal(g.install(0,3,{kind:'active',id:'renewalaura'}).ok,true);
 const rows=equippedSkills(g);assert.equal(rows.length,3);
 assert.deepEqual(rows.map(r=>compileSkill(r,g.player).count),[3,3,1]);
 assert.equal(g.toggleAura('renewalaura'),true);assert.equal(g.player.auraRegen,4);
 g.state='playing';g.spawn('brute',1400,1200);updateCasting(g,.01);
 assert.equal(g.shots.length,6);assert.equal(g.shots.filter(s=>s.id==='fireball').length,3);assert.equal(g.shots.filter(s=>s.id==='ice').length,3);
 g.state='build';g.install(0,3,null);assert.equal(g.player.auraRegen,0);
});
test('unlinked and incompatible supports can be stored but do not affect damage or count',()=>{
 const g=setup();g.bag.weapons[0].linked=1;
 g.install(0,1,{kind:'support',id:'multi'});
 assert.equal(compileSkill(equippedSkills(g)[0],g.player).count,1);
 g.bag.weapons[0].linked=2;assert.equal(compileSkill(equippedSkills(g)[0],g.player).count,3);
 g.bag.active.push('nova');g.install(0,0,{kind:'active',id:'nova'});
 assert.equal(equippedSkills(g)[0].supports.length,0);
 assert.equal(socketGems(g.links[0])[1].id,'multi');
});
test('typed poison gems are distinct; duplicates and invalid positions fail without mutation',()=>{
 const g=setup();g.install(0,0,{kind:'active',id:'poison'});
 assert.equal(g.install(0,1,{kind:'support',id:'poison'}).ok,true);
 assert.equal(equippedSkills(g)[0].supports[0],'poison');
 const before=JSON.stringify(g.links);
 for(const position of [-1,4,1.5])assert.equal(g.install(0,position,{kind:'active',id:'ice'}).ok,false);
 assert.equal(g.install(0,2,{kind:'support',id:'poison'}).ok,false);
 assert.equal(JSON.stringify(g.links),before);
 g.state='playing';assert.equal(g.install(0,1,null).ok,false);
});
test('normal gem 5% and boss gem 35% boundaries; ground loot waits and picks up exactly once',()=>{
 for(const [boss,rate] of [[false,.05],[true,.35]])for(const [roll,expected] of [[rate-1e-6,true],[rate,false]]){
 const g=setup();g.state='playing';let first=true;g.rng=()=>{if(first){first=false;return roll}return .1};
 assert.equal(!!dropGem(g,boss,{x:1800,y:1800}),expected);
 pickupLoot(g);assert.equal(g.groundLoot.length,expected?1:0);
 g.player.x=1800;g.player.y=1800;pickupLoot(g);assert.equal(g.groundLoot.length,0);
 const before=JSON.stringify(g.bag);pickupLoot(g);assert.equal(JSON.stringify(g.bag),before);
 }
});
test('equipment is not auto-collected at death; loot survives waves and resets with run',()=>{
 const g=setup();g.state='playing';g.rng=()=>0;
 dropEquipment(g,false,{x:1800,y:1800});assert.equal(g.bag.weapons.length,1);assert.equal(g.groundLoot.length,1);
 g.waveRemaining=0;g.enemies=[];g.step(.01);assert.equal(g.groundLoot.length,1);
 g.player.x=1800;g.player.y=1800;g.step(.01);assert.equal(g.bag.weapons.length,2);assert.equal(g.groundLoot.length,0);
 dropGem(g,false);g.reset(42);assert.equal(g.groundLoot.length,0);
});
test('socket editor exposes touch buttons and distinct active/support poison choices',()=>{
 const g=setup(),html=socketEditor(g,g.bag.weapons[0],g.links[0],0,{row:0,socket:1});
 assert.match(html,/data-pick-socket="3"/);assert.match(html,/data-gem-kind="active" data-gem-id="poison"/);
 assert.match(html,/data-gem-kind="support" data-gem-id="poison"/);assert.match(html,/data-gem-remove/);
});
