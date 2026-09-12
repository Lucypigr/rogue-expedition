/** Additional enemy definitions and telegraphed attack patterns. */
export const EXTRA_ENEMIES={
 sniper:{name:'枯骨狙擊手',hp:65,speed:36,r:17,damage:24,xp:11,color:'#c6a284'},
 bomber:{name:'熾核爆破蟲',hp:40,speed:88,r:15,damage:28,xp:8,color:'#ef8b54'},
 mender:{name:'腐林治癒者',hp:100,speed:32,r:20,damage:8,xp:14,color:'#77d3a8'},
  charger:{name:'裂角衝鋒獸',hp:90,speed:56,r:20,damage:22,xp:9,color:'#bd855e'},
  spitter:{name:'腐沼毒囊',hp:60,speed:38,r:18,damage:13,xp:8,color:'#a3b75c'},
  summoner:{name:'亡語祭司',hp:110,speed:32,r:19,damage:14,xp:14,color:'#b39cc7'},
  wraith:{name:'幽影追獵者',hp:48,speed:75,r:14,damage:14,xp:7,color:'#83c3bd'},
  frostBoss:{name:'凜冬女王',boss:true,hp:2800,speed:43,r:42,damage:22,xp:120,color:'#99cee8'},
  broodBoss:{name:'腐巢之母',boss:true,hp:3400,speed:35,r:49,damage:23,xp:120,color:'#bec27b'}
};
export const BOSS_ROSTER=['boss','frostBoss','broodBoss'];
export const isBoss=e=>!!e?.boss||e?.type==='boss';
export function bossName(e){return e?.name||'灰燼守衛'}
export const BESTIARY=[
  ['苔爪爬行者','近身揮擊，留意扇形攻擊預警。'],['赤牙奔行獸','快速追擊，利用衝刺拉開距離。'],['荒野薩滿','停步蓄力後發射三連彈。'],['岩甲巨漢','厚重護甲與高傷害近戰。'],
  ...Object.entries(EXTRA_ENEMIES).map(([id,e])=>[e.name,{sniper:'遠距蓄力後射出高速單發，橫移躲避。',bomber:'接近後蓄力自爆，迅速離開爆炸圈。',mender:'定時回復附近同伴生命，優先集火。',charger:'直線蓄力衝撞，橫向移動閃避。',spitter:'在你的位置噴灑持續毒池。',summoner:'召喚奔行獸，優先擊殺可降低壓力。',wraith:'穿越地形追蹤，但攻擊前仍會停頓。',frostBoss:'冰彈扇射與延遲冰爆，半血後加速。',broodBoss:'召喚護衛、散布毒池與環形毒彈。'}[id]]),
  ['灰燼守衛','環形火彈與雙重爆炸落點，半血後狂暴。']
];
export function zone(game,x,y,r,timer,life,damage,color){if(game.zones.length<70)game.zones.push({x,y,r,timer,life,damage,color,active:false})}
export function startExtraAttack(e,dist){return e.type==='sniper'?dist<650:e.type==='mender'?dist<650:e.type==='bomber'?dist<95:e.type==='charger'?dist<370:e.type==='spitter'?dist<420:e.type==='summoner'?dist<600:isBoss(e)?dist<720:false}
export function resolveExtraAttack(game,e){
 const p=game.player;
 if(e.type==='sniper'){game.fireHostile(e,e.aim,1,360);e.cooldown=3;return true}
 if(e.type==='mender'){for(const ally of game.enemies)if(ally.hp>0&&Math.hypot(ally.x-e.x,ally.y-e.y)<240)ally.hp=Math.min(ally.maxHp,ally.hp+ally.maxHp*.12);game.burst(e.x,e.y,'#7fe4b7',16);e.cooldown=4;return true}
 if(e.type==='bomber'){zone(game,e.x,e.y,105,0,.3,e.damage,'#f79664');game.burst(e.x,e.y,'#ffb35c',20);game.hitEnemy(e,e.hp);return true}
 if(e.type==='charger'){e.charge=.65;e.cooldown=3;return true}
 if(e.type==='spitter'){zone(game,e.tx,e.ty,49,.7,3.5,13,'#aec563');e.cooldown=3.5;return true}
 if(e.type==='summoner'){for(let i=0;i<2&&game.enemies.length<110;i++){const a=e.aim+i*3.14;game.spawn('runner',e.x+Math.cos(a)*40,e.y+Math.sin(a)*40)}e.cooldown=5;game.burst(e.x,e.y,'#c3a2d2',12);return true}
 if(e.type==='frostBoss'){
   if(e.phase%2===0){game.fireHostile(e,e.aim,9,e.hp<e.maxHp*.5?185:150);for(let i=0;i<3;i++)zone(game,e.tx+(i-1)*110,e.ty,62,.8+i*.2,.4,25,'#91cbe8')}
   else for(let i=0;i<5;i++){const a=i*Math.PI*2/5;zone(game,p.x+Math.cos(a)*100,p.y+Math.sin(a)*100,65,.8,.45,26,'#91cbe8')}
   e.phase++;e.cooldown=e.hp<e.maxHp*.5?1.7:2.6;return true;
 }
 if(e.type==='broodBoss'){
   if(e.phase%3===0)for(let i=0;i<4&&game.enemies.length<110;i++)game.spawn(i%2?'runner':'spitter',e.x+Math.cos(i*1.57)*80,e.y+Math.sin(i*1.57)*80);
   else if(e.phase%3===1)for(let i=0;i<4;i++)zone(game,e.tx+(i%2?75:-75),e.ty+(i<2?65:-65),65,.85,3.5,19,'#afbe6d');
   else for(let i=0;i<16;i++)game.fireHostile(e,i*Math.PI/8,1,125);
   e.phase++;e.cooldown=e.hp<e.maxHp*.5?1.7:2.5;return true;
 }
 return false;
}
