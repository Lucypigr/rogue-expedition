/** Web Audio voices are synthesized locally: no downloads, no autoplay. */
export class AudioSystem{
 constructor(){this.enabled=true;this.ctx=null;this.last=new Map()}
 unlock(){try{if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{})}catch{}}
 toggle(){this.enabled=!this.enabled;if(this.enabled)this.unlock();return this.enabled}
 play(kind){if(!this.enabled||!this.ctx||this.ctx.state!=='running')return;const now=this.ctx.currentTime;if(now-(this.last.get(kind)??-10)<({hit:.06,cast:.08,pickup:.07}[kind]||.1))return;this.last.set(kind,now);
 const tones={cast:[420,110,.09,'triangle',.035],hit:[140,45,.11,'triangle',.065],hurt:[100,35,.2,'sawtooth',.07],pickup:[900,1300,.075,'sine',.025],level:[400,1000,.45,'sine',.085],dash:[240,60,.18,'triangle',.055],boss:[80,35,.9,'sawtooth',.06],win:[440,880,.8,'sine',.09],die:[160,30,.8,'triangle',.09]};
 const [a,b,d,type,v]=tones[kind]||tones.hit,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(a,now);o.frequency.exponentialRampToValueAtTime(b,now+d);g.gain.setValueAtTime(v,now);g.gain.exponentialRampToValueAtTime(.001,now+d);o.connect(g);g.connect(this.ctx.destination);o.start(now);o.stop(now+d);o.onended=()=>{o.disconnect();g.disconnect()};
 }
}
