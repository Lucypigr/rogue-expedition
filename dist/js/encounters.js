// Finite packs keep wave completion deterministic and mobile entity counts bounded.
export function waveBudget(round,wave){return wave%5===0?6+round*3:16+round*4+wave*2}
export function packSize(round){return 4+round*2}
export function spawnInterval(round,wave){return Math.max(.55,1.05-round*.1-wave*.015)}
export function enemyPool(round,wave){
 const tier=(round-1)*15+wave;
 if(tier<3)return ['crawler','crawler','runner','runner'];
 if(tier<5)return ['crawler','runner','runner','shaman','brute','bomber'];
 if(tier<11)return ['crawler','runner','shaman','brute','charger','spitter','sniper','bomber'];
 return ['crawler','runner','shaman','brute','charger','spitter','summoner','wraith','sniper','bomber','mender'];
}
