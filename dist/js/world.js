import {WORLD_SIZE} from './data.js';
export function seeded(seed){return()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class SpatialHash{
 constructor(size=100){this.size=size;this.map=new Map()}
 clear(){this.map.clear()}
 add(e){const k=`${Math.floor(e.x/this.size)},${Math.floor(e.y/this.size)}`;if(!this.map.has(k))this.map.set(k,[]);this.map.get(k).push(e)}
 query(x,y,r){const out=[];for(let a=Math.floor((x-r)/this.size);a<=Math.floor((x+r)/this.size);a++)for(let b=Math.floor((y-r)/this.size);b<=Math.floor((y+r)/this.size);b++){const v=this.map.get(`${a},${b}`);if(v)out.push(...v)}return out}
}
export function createWorld(seed){
 const rng=seeded(seed),obstacles=[],decor=[];
 for(let i=0;i<125;i++){const o={x:70+rng()*(WORLD_SIZE-140),y:70+rng()*(WORLD_SIZE-140),r:18+rng()*24,type:rng()<.55?'tree':'rock',variant:rng(),angle:rng()*6.28};if(Math.hypot(o.x-1200,o.y-1200)<210||obstacles.some(p=>distance(p,o)<p.r+o.r+70))continue;obstacles.push(o)}
 for(let i=0;i<1600;i++)decor.push({x:rng()*WORLD_SIZE,y:rng()*WORLD_SIZE,type:rng(),s:2+rng()*7,a:rng()*6.28});
 const hash=new SpatialHash(120);obstacles.forEach(o=>hash.add(o));
 const healingPools=[{x:1320,y:1200,r:38,cooldown:0}];
 for(let i=0;i<200&&healingPools.length<5;i++){const p={x:220+rng()*(WORLD_SIZE-440),y:220+rng()*(WORLD_SIZE-440),r:38,cooldown:0};if(obstacles.every(o=>distance(p,o)>o.r+p.r+35)&&healingPools.every(o=>distance(p,o)>450))healingPools.push(p)}
 return{seed,obstacles,decor,hash,healingPools};
}
export function moveEntity(e,dx,dy,world){
 e.x=clamp(e.x+dx,e.r+12,WORLD_SIZE-e.r-12);e.y=clamp(e.y+dy,e.r+12,WORLD_SIZE-e.r-12);
 for(const o of world.hash.query(e.x,e.y,e.r+50)){const d=distance(e,o),min=e.r+o.r;if(d<min){const angle=d>.001?Math.atan2(e.y-o.y,e.x-o.x):0;e.x=o.x+Math.cos(angle)*min;e.y=o.y+Math.sin(angle)*min}}
 e.x=clamp(e.x,e.r+12,WORLD_SIZE-e.r-12);e.y=clamp(e.y,e.r+12,WORLD_SIZE-e.r-12);
}
