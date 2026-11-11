'use strict';
// Proton (MIT), pinned in vendor/. World-space particles share the game's camera.
const VFX=(()=>{
  let engine=null,emitter=null,events=[],time=0;
  function cap(){return Profile.data.settings.effects==='low'?230:680}
  function reset(){if(engine)engine.destroy();engine=new Proton.default();emitter=new Proton.Emitter();engine.addEmitter(emitter);emitter.stop();events=[];time=0}
  function burst(x,y,color,count=20,speed=150,kind='spark',direction=null){
    if(!emitter)return;count=Math.min(count,cap()-emitter.particles.length);if(Profile.data.settings.effects==='low')count=Math.ceil(count*.5);
    for(let i=0;i<count;i++){const p=emitter.createParticle();const a=direction===null?Math.random()*Math.PI*2:direction+(Math.random()-.5)*1.2,k=speed*(.3+Math.random()*.7);p.life=.25+Math.random()*.45;p.p.x=x;p.p.y=y;p.v.x=Math.cos(a)*k;p.v.y=Math.sin(a)*k;p.fx={color,kind,size:2+Math.random()*3};p.radius=p.fx.size}
  }
  function cast(type,x,y,opts={}){
    if(!engine)return;const color=opts.color||'#8effea',life=type==='lightning'?.38:type==='stomp'?.68:.34,event={type,x,y,age:0,life,color,...opts};
    if(type==='lightning'){event.points=[];for(let i=0;i<=7;i++)event.points.push({x:x+(i===7?0:(Math.random()-.5)*45),y:y-210+i*30});burst(x,y,'#ffe6a1',18,150)}
    if(type==='stomp')burst(x,y,color,opts.evolved?65:35,240);
    if(type==='slash')burst(x,y,color,10,100,'spark',opts.a);
    if(type==='evolution')burst(x,y,'#ffe2a1',90,300);
    events.push(event);if(events.length>60)events.shift()
  }
  function update(s,dt){
    if(!engine)return;time+=dt;engine.emittersUpdate(dt);events.forEach(e=>e.age+=dt);events=events.filter(e=>e.age<e.life);
    for(const b of s.shots){b.trail=(b.trail||0)-dt;if(b.trail<=0){b.trail=.045;burst(b.x,b.y,b.type==='knife'?'#ffcd74':'#83fce1',b.type==='knife'?1:2,28,'mote')}}
  }
  function swordShape(x,y,a,length=50,color='#abfff0',alpha=1){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-length*.5,0);ctx.lineTo(length*.5,0);ctx.stroke();ctx.fillStyle='#fff9d3';ctx.beginPath();ctx.moveTo(length*.8,0);ctx.lineTo(length*.3,-4);ctx.lineTo(length*.3,4);ctx.fill();ctx.fillStyle='#d9bd78';ctx.fillRect(-length*.3,-6,3,12);ctx.restore()}
  function ground(s){
    if(!engine)return;ctx.save();
    if(s.skills[6]){let r=70+s.skills[6]*13;ctx.fillStyle='#6dbb6f14';ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,0,7);ctx.fill();for(let j=0;j<7;j++){let a=time*.8+j*6.283/7;ctx.strokeStyle=j%2?'#a4ed6f55':'#45b9a644';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(s.p.x+Math.cos(a)*r*.5,s.p.y+Math.sin(a)*r*.4,25,10,a,0,7);ctx.stroke()}}
    if(s.skills[2]){const r=65;ctx.strokeStyle=s.evolved?'#f1d18366':'#92e5dc55';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,0,7);ctx.stroke();for(let j=0;j<8;j++){let a=time*.6+j*6.283/8;ctx.save();ctx.translate(s.p.x+Math.cos(a)*r,s.p.y+Math.sin(a)*r);ctx.rotate(a);ctx.fillStyle='#c2edd899';ctx.fillRect(-3,-2,6,4);ctx.restore()}}
    ctx.restore()
  }
  function front(s){
    if(!engine)return;ctx.save();ctx.globalCompositeOperation='lighter';
    for(const p of emitter.particles){const k=Math.max(0,1-p.age/p.life),r=p.fx.size*k;ctx.fillStyle=p.fx.color;ctx.globalAlpha=k*.16;ctx.beginPath();ctx.arc(p.p.x,p.p.y,r*3.5,0,7);ctx.fill();ctx.globalAlpha=k*.8;if(p.fx.kind==='spark'){ctx.strokeStyle=p.fx.color;ctx.lineWidth=Math.max(1,r);ctx.beginPath();ctx.moveTo(p.p.x,p.p.y);ctx.lineTo(p.p.x-p.v.x*.035,p.p.y-p.v.y*.035);ctx.stroke()}else{ctx.beginPath();ctx.arc(p.p.x,p.p.y,r,0,7);ctx.fill()}}
    ctx.globalAlpha=1;
    for(const e of events){const u=e.age/e.life,k=1-u;ctx.globalAlpha=k;ctx.strokeStyle=e.color;
      if(e.type==='slash'){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.a||0);for(let i=0;i<3;i++){ctx.lineWidth=12-i*4;ctx.globalAlpha=k*(.15+i*.18);ctx.beginPath();ctx.arc(0,0,(e.r||55)+u*30+i*4,-1.1,1.1);ctx.stroke()}ctx.restore()}
      if(e.type==='stomp'||e.type==='evolution'){const r=(e.r||160)*(1-Math.pow(1-u,3));for(let i=0;i<3;i++){ctx.lineWidth=i===0?5:2;ctx.globalAlpha=k*(1-i*.25);ctx.beginPath();ctx.arc(e.x,e.y,r*(1-i*.16),0,7);ctx.stroke()}for(let j=0;j<12;j++){let a=j*6.283/12;ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*r*.8,e.y+Math.sin(a)*r*.8);ctx.lineTo(e.x+Math.cos(a)*r*1.08,e.y+Math.sin(a)*r*1.08);ctx.stroke()}ctx.font='bold 24px serif';ctx.fillStyle=e.color;ctx.textAlign='center';ctx.fillText(e.evolved?'雷':'震',e.x,e.y+8)}
      if(e.type==='lightning'){for(const [width,alpha]of [[15,.12],[6,.5],[2,1]]){ctx.lineWidth=width;ctx.globalAlpha=k*alpha;ctx.strokeStyle=width===2?'#fffbe5':e.color;ctx.beginPath();e.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke()}ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.x,e.y-100);ctx.lineTo(e.x+45,e.y-70);ctx.lineTo(e.x+25,e.y-40);ctx.stroke()}
    }
    ctx.restore()
  }
  function projectile(b,s){
    const a=Math.atan2(b.vy,b.vx);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.globalCompositeOperation='lighter';
    if(b.type==='knife'){ctx.strokeStyle=s.rain?'#a6ff9b':'#ffb65c';ctx.lineWidth=8;ctx.globalAlpha=.2;ctx.beginPath();ctx.moveTo(-42,0);ctx.lineTo(4,0);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle='#fff0b1';ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-11,-4);ctx.lineTo(-7,0);ctx.lineTo(-11,4);ctx.fill();ctx.strokeStyle='#ffc877';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-25,0);ctx.lineTo(-9,0);ctx.stroke()}
    else{const col=s.evolved?'#ffe3a6':selected===2?'#ff8dac':'#8cffee';for(let i=0;i<3;i++){ctx.globalAlpha=.14+i*.2;ctx.strokeStyle=i===2?'#fffbe0':col;ctx.lineWidth=16-i*6;ctx.beginPath();ctx.arc(-18-i*4,0,28+i*7,-1.2,1.2);ctx.stroke()}ctx.globalAlpha=.5;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-80,-8);ctx.quadraticCurveTo(-30,-16,6,-5);ctx.moveTo(-62,12);ctx.lineTo(-5,8);ctx.stroke()}
    ctx.restore()
  }
  return{reset,cast,burst,update,ground,front,projectile,swordShape,get count(){return emitter?.particles.length||0},get limit(){return cap()}};
})();
