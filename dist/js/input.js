export class Input{
 constructor(onPause,onDash){this.keys=new Set();this.touch={x:0,y:0};this.pointer=null;this.onDash=onDash;
 window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.repeat)return;this.keys.add(e.key.toLowerCase());if(e.key==='Escape'||e.key.toLowerCase()==='p')onPause();if(e.code==='Space')onDash()});
 window.addEventListener('keyup',e=>this.keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>this.reset());
 const pad=document.getElementById('joystick'),stick=document.getElementById('stick');this.stick=stick;
 const update=e=>{const r=pad.getBoundingClientRect(),max=r.width*.32;let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,d=Math.hypot(x,y);if(d>max){x=x/d*max;y=y/d*max}this.touch={x:x/max,y:y/max};stick.style.transform=`translate(${x}px,${y}px)`};
 pad.addEventListener('pointerdown',e=>{if(this.pointer!==null)return;this.pointer=e.pointerId;pad.setPointerCapture(e.pointerId);update(e);e.preventDefault()});pad.addEventListener('pointermove',e=>{if(this.pointer===e.pointerId)update(e)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(ev,e=>{if(this.pointer===e.pointerId){this.pointer=null;this.touch={x:0,y:0};stick.style.transform=''}});
 document.getElementById('dashTouch').addEventListener('pointerdown',e=>{e.preventDefault();onDash()});
 }
 reset(){this.keys.clear();this.touch={x:0,y:0};this.pointer=null;if(this.stick)this.stick.style.transform=''}
 direction(){let x=(this.keys.has('d')||this.keys.has('arrowright')?1:0)-(this.keys.has('a')||this.keys.has('arrowleft')?1:0)+this.touch.x,y=(this.keys.has('s')||this.keys.has('arrowdown')?1:0)-(this.keys.has('w')||this.keys.has('arrowup')?1:0)+this.touch.y;const d=Math.hypot(x,y);if(d>1){x/=d;y/=d}return{x,y}}
}
