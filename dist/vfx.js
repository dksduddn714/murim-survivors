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
    if(!engine)return;
    const color=opts.color||'#8effea';
    const life=type==='lightning'||type==='dragon_strike'?.38:type==='chain'||type==='shadow_clone'?.28:type==='stomp'||type==='buddha'||type==='ice'||type==='meteor'||type==='blood_burst'?.58:.36;
    const event={type,x,y,age:0,life,color,...opts};
    if(type==='lightning'||type==='dragon_strike'){
      event.points=[];
      for(let i=0;i<=7;i++)event.points.push({x:x+(i===7?0:(Math.random()-.5)*45),y:y-210+i*30});
      burst(x,y,'#ffe6a1',18,150);
    }
    if(type==='chain'||type==='shadow_clone'){burst(opts.tx??x,opts.ty??y,color,10,120,'spark')}
    if(type==='stomp'||type==='buddha'||type==='ice'||type==='meteor'||type==='blood_burst')burst(x,y,color,opts.evolved?48:24,210);
    if(type==='slash'||type==='flail'||type==='throw')burst(x,y,color,8+(opts.lv||1)*2,100+(opts.lv||1)*12,'spark',opts.a);
    if(type==='poison')burst(x+(Math.random()-.5)*(opts.r||50),y+(Math.random()-.5)*(opts.r||50),color,4,45,'mote');
    if(type==='evolution')burst(x,y,'#ffe2a1',80,290);
    events.push(event);if(events.length>60)events.shift();
  }
  function update(s,dt){
    if(!engine)return;time+=dt;engine.emittersUpdate(dt);
    let w=0;for(let i=0;i<events.length;i++){const e=events[i];e.age+=dt;if(e.age<e.life)events[w++]=e}events.length=w;
    for(const b of s.shots){b.trail=(b.trail||0)-dt;if(b.trail<=0){b.trail=.045;const col=b.type==='fire'?'#ff7b54':b.type==='ice'?'#8ce8ff':b.type==='knife'?'#c084fc':'#38bdf8';burst(b.x,b.y,col,b.type==='knife'?1:2,28,'mote')}}
  }
  function swordShape(x,y,a,length=50,color='#abfff0',alpha=1){
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-length*.5,0);ctx.lineTo(length*.5,0);ctx.stroke();ctx.fillStyle='#fff9d3';ctx.beginPath();ctx.moveTo(length*.8,0);ctx.lineTo(length*.3,-4);ctx.lineTo(length*.3,4);ctx.fill();ctx.fillStyle='#d9bd78';ctx.fillRect(-length*.3,-6,3,12);ctx.restore()
  }
  function ground(s){
    if(!engine)return;ctx.save();
    if(s.skills[6]){
      const lv=s.skills[6],r=78+lv*14+(s.fusions?.[1]?28:0);
      ctx.fillStyle=selected===2?'#581c8724':selected===1?'#065f4622':'#83184320';
      ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,0,7);ctx.fill();
      for(let j=0;j<5+lv;j++){let a=time*.85+j*6.283/(5+lv);ctx.strokeStyle=selected===2?'#c084fc44':selected===1?'#34d39944':'#fb718544';ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(s.p.x,s.p.y,r,r*.5,a,0,7);ctx.stroke()}
    }
    if(s.skills[2]){
      const lv=s.skills[2],r=64+lv*5+(s.fusions?.[0]?18:0);ctx.strokeStyle=s.fusions?.[0]?'#ffe38f88':s.evolved?'#f1d18366':'#38bdf855';ctx.lineWidth=s.fusions?.[0]?3:2;ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,0,7);ctx.stroke();
      for(let j=0;j<8;j++){let a=time*(s.fusions?.[0]?1.1:.65)+j*6.283/8;ctx.save();ctx.translate(s.p.x+Math.cos(a)*r,s.p.y+Math.sin(a)*r);ctx.rotate(a);ctx.fillStyle=s.fusions?.[0]?'#ffe6a3cc':'#bae6fd99';ctx.fillRect(-4,-2,8,4);ctx.restore()}
    }
    if(s.fusions?.[3]){
      for(let d=0;d<2;d++){
        const a=time*2.6+d*Math.PI,r=86+Math.sin(time*4)*10;
        const dx=s.p.x+Math.cos(a)*r,dy=s.p.y+Math.sin(a)*r;
        ctx.strokeStyle=d===0?'#f59e0baa':'#c084fcaa';ctx.lineWidth=5;
        ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,a-.9,a);ctx.stroke();
        ctx.fillStyle=d===0?'#ffe29a':'#f3e8ff';ctx.beginPath();ctx.arc(dx,dy,6,0,7);ctx.fill();
      }
    }
    if(s.fusions?.[5]){
      ctx.strokeStyle='#f43f5e66';ctx.lineWidth=2.5;ctx.setLineDash([8,6]);
      ctx.beginPath();ctx.arc(s.p.x,s.p.y,120,time,time+6);ctx.stroke();ctx.setLineDash([]);
    }
    ctx.restore()
  }
  function front(s){
    if(!engine)return;ctx.save();ctx.globalCompositeOperation='lighter';
    for(const p of emitter.particles){const k=Math.max(0,1-p.age/p.life),r=p.fx.size*k;ctx.fillStyle=p.fx.color;ctx.globalAlpha=k*.14;ctx.beginPath();ctx.arc(p.p.x,p.p.y,r*3.2,0,7);ctx.fill();ctx.globalAlpha=k*.72;if(p.fx.kind==='spark'){ctx.strokeStyle=p.fx.color;ctx.lineWidth=Math.max(1,r);ctx.beginPath();ctx.moveTo(p.p.x,p.p.y);ctx.lineTo(p.p.x-p.v.x*.035,p.p.y-p.v.y*.035);ctx.stroke()}else{ctx.beginPath();ctx.arc(p.p.x,p.p.y,r,0,7);ctx.fill()}}
    ctx.globalAlpha=1;
    for(const e of events){
      const u=e.age/e.life,k=1-u;ctx.globalAlpha=k;ctx.strokeStyle=e.color;
      if(e.type==='slash'||e.type==='flail'){
        ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.a||0);const arcs=e.evolved?4:3;
        for(let i=0;i<arcs;i++){ctx.lineWidth=(12+(e.lv||1))-i*3;ctx.globalAlpha=k*(.14+i*.17);ctx.beginPath();ctx.arc(0,0,(e.r||55)+u*32+i*5,e.type==='flail'?-1.8:-1.15,e.type==='flail'?1.8:1.15);ctx.stroke()}
        ctx.restore();
      }
      if(e.type==='shadow_clone'){
        ctx.save();ctx.translate(e.x,e.y);ctx.strokeStyle='#e879f9';ctx.lineWidth=4;
        ctx.beginPath();ctx.moveTo(-28,-28);ctx.lineTo(28,28);ctx.moveTo(28,-28);ctx.lineTo(-28,28);ctx.stroke();
        ctx.restore();
      }
      if(e.type==='stomp'||e.type==='evolution'||e.type==='buddha'||e.type==='ice'||e.type==='meteor'||e.type==='blood_burst'){
        const r=(e.r||110)*(1-Math.pow(1-u,3));
        for(let i=0;i<3;i++){ctx.lineWidth=i===0?5:2;ctx.globalAlpha=k*(1-i*.25);ctx.beginPath();ctx.arc(e.x,e.y,r*(1-i*.16),0,7);ctx.stroke()}
        for(let j=0;j<10;j++){let a=j*6.283/10;ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*r*.78,e.y+Math.sin(a)*r*.78);ctx.lineTo(e.x+Math.cos(a)*r*1.06,e.y+Math.sin(a)*r*1.06);ctx.stroke()}
        ctx.font='bold 22px "Batang",serif';ctx.fillStyle=e.color;ctx.textAlign='center';
        const hanja=e.hanja||(e.type==='buddha'?'佛':e.type==='ice'?'氷':e.type==='meteor'?'天':e.type==='blood_burst'?'血':e.evolved?'極':'震');
        ctx.fillText(hanja,e.x,e.y+7);
      }
      if(e.type==='lightning'||e.type==='dragon_strike'){
        for(const [width,alpha] of [[14,.15],[5,.55],[2,1]]){
          ctx.lineWidth=width;ctx.globalAlpha=k*alpha;ctx.strokeStyle=width===2?'#fffbe5':e.color;
          ctx.beginPath();e.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
        }
      }
      if(e.type==='chain'){
        const mx=(e.x+e.tx)/2+(Math.sin(time*40)*14),my=(e.y+e.ty)/2-(Math.cos(time*40)*14);
        ctx.lineWidth=3.2;ctx.globalAlpha=k*.88;ctx.strokeStyle=e.color||'#dff0ff';
        ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(mx,my);ctx.lineTo(e.tx,e.ty);ctx.stroke();
      }
    }
    ctx.restore()
  }
  function projectile(b,s){
    const a=Math.atan2(b.vy,b.vx),sc=b.scale||1,st=b.style||'default';
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.scale(sc,sc);ctx.globalCompositeOperation='lighter';
    if(st==='plum'||st==='plum_dagger'){
      ctx.strokeStyle='#fb7185';ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(-2,0,12,-1.15,1.15);ctx.stroke();
      ctx.fillStyle='#ffe4e6';
      for(let i=0;i<5;i++){const pa=i*Math.PI*2/5;ctx.beginPath();ctx.arc(Math.cos(pa)*4.5,Math.sin(pa)*4.5,2.2,0,7);ctx.fill()}
    }else if(st==='taiji'){
      ctx.strokeStyle='#38bdf8';ctx.lineWidth=4;ctx.beginPath();ctx.arc(-2,0,13,-1.2,1.2);ctx.stroke();
      ctx.fillStyle='#e0f2fe';ctx.fillRect(-8,-2,15,4);
    }else if(st==='dharma_wheel'){
      ctx.strokeStyle='#fbbf24';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,10,0,7);ctx.stroke();
      ctx.fillStyle='#fef08a';ctx.fillRect(-7,-2,14,4);ctx.fillRect(-2,-7,4,14);
    }else if(st==='emerald_staff'||st==='dragon_wave'){
      ctx.fillStyle=st==='dragon_wave'?'#fbbf24':'#34d399';
      ctx.beginPath();ctx.arc(3,0,8.5,0,7);ctx.fill();
      ctx.fillStyle='#fff';ctx.fillRect(-11,-2.2,15,4.4);
    }else if(st==='blood_blade'||st==='blood_spear'){
      ctx.strokeStyle='#f43f5e';ctx.lineWidth=4.5;ctx.beginPath();ctx.arc(-2,0,13,-1.25,1.25);ctx.stroke();
      ctx.fillStyle='#ffe4e6';ctx.fillRect(-9,-2,16,4);
    }else if(st==='cleaver_wave'){
      ctx.strokeStyle='#f59e0b';ctx.lineWidth=5.5;ctx.beginPath();ctx.arc(-3,0,14,-1.3,1.3);ctx.stroke();
      ctx.fillStyle='#fef3c7';ctx.fillRect(-9,-2.5,15,5);
    }else if(st==='demonic_slash'){
      ctx.strokeStyle='#f59e0b';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-2,0,15,-1.3,1.3);ctx.stroke();
      ctx.strokeStyle='#e11d48';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,11,-1.1,1.1);ctx.stroke();
    }else if(st==='shadow_dagger'){
      ctx.fillStyle='#c084fc';ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-5.5);ctx.lineTo(-3,0);ctx.lineTo(-8,5.5);ctx.closePath();ctx.fill();
    }else if(st==='wraith'){
      ctx.fillStyle='#c084fc';ctx.beginPath();ctx.arc(2,0,7.5,0,7);ctx.fill();
      ctx.fillStyle='#f3e8ff';ctx.fillRect(-12,-3.2,11,6.4);
    }else if(st==='arhat'){
      ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(2,0,7.5,0,7);ctx.fill();
      ctx.fillStyle='#fef08a';ctx.fillRect(-9,-3,10,6);
    }else if(st==='venom_wave'){
      ctx.fillStyle='#10b981';ctx.beginPath();ctx.arc(2,0,7,0,7);ctx.fill();
      ctx.fillStyle='#a7f3d0';ctx.fillRect(-10,-2.8,11,5.6);
    }else if(st==='black_dragon'){
      ctx.fillStyle='#9333ea';ctx.beginPath();ctx.arc(3,0,8.5,0,7);ctx.fill();
      ctx.strokeStyle='#f3e8ff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-13,-4.5);ctx.lineTo(7,0);ctx.lineTo(-13,4.5);ctx.stroke();
    }else if(b.type==='knife'){
      ctx.fillStyle='#fff0b1';ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-11,-4);ctx.lineTo(-7,0);ctx.lineTo(-11,4);ctx.fill();
    }else if(b.type==='fire'){
      ctx.fillStyle='#ff6b35aa';ctx.beginPath();ctx.arc(-6,0,12,0,7);ctx.fill();ctx.fillStyle='#ffe699';ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-10,-7);ctx.lineTo(-10,7);ctx.fill();
    }else{
      const col=s.fusions?.[0]?'#ffe899':s.evolved?'#ffe3a6':selected==2?'#c084fc':'#38bdf8';
      for(let i=0;i<3;i++){ctx.globalAlpha=.14+i*.2;ctx.strokeStyle=i===2?'#fffbe0':col;ctx.lineWidth=16-i*6;ctx.beginPath();ctx.arc(-18-i*4,0,28+i*7,-1.2,1.2);ctx.stroke()}
    }
    ctx.restore();
  }
  return{reset,cast,burst,update,ground,front,projectile,swordShape,get count(){return emitter?.particles.length||0},get limit(){return cap()}};
})();
