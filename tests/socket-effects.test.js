import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../dist/js/engine.js';
import {drawGemEffects} from '../dist/js/extra-render.js';

test('free-socket aura and orbit render with the supported combat radius',()=>{
 const g=new Game({seed:42});g.reset(42);g.state='build';
 g.bag.weapons[0].sockets=['R','B','G','W'];g.bag.weapons[0].linked=3;
 g.bag.active.push('orbit','renewalaura');g.bag.support.push('area');
 g.install(0,0,null);
 g.install(0,1,{kind:'active',id:'orbit'});
 g.install(0,2,{kind:'support',id:'area'});
 g.install(0,3,{kind:'active',id:'renewalaura'});g.toggleAura('renewalaura');
 const ellipses=[],blades=[];
 const c={save(){},restore(){},beginPath(){},closePath(){},stroke(){},fill(){},moveTo(){},lineTo(){},rotate(){},ellipse(...args){ellipses.push(args)},translate(x,y){blades.push([x,y])}};
 drawGemEffects(c,g);
 assert.equal(ellipses.length,1);assert.equal(blades.length,2);
 assert.ok(Math.abs(Math.hypot(blades[0][0]-g.player.x,blades[0][1]-g.player.y)-76*1.45)<1e-8);
 g.install(0,3,null);ellipses.length=0;blades.length=0;drawGemEffects(c,g);
 assert.equal(ellipses.length,0);assert.equal(blades.length,2);
});
