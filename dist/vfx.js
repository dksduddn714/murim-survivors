'use strict';
// Proton (MIT), pinned in vendor/. World-space particles share the game's camera.
const VFX=(()=>{
  let engine=null,emitter=null,events=[],time=0;
  function cap(){const crowd=(typeof state!=='undefined'&&state?.enemies?.length>240)?.65:1;return Math.floor((Profile.data.settings.effects==='low'?220:640)*crowd)}
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
    if(type==='petals'||type==='impact_burst')burst(x,y,color,12,120);
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
  function polygon(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill()}
  function pixelLine(ax,ay,bx,by,color,size=3){ctx.fillStyle=color;const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/size));for(let i=0;i<=n;i++){const t=i/n;ctx.fillRect(Math.round((ax+(bx-ax)*t)/2)*2,Math.round((ay+(by-ay)*t)/2)*2,size,size)}}
  function palm(x,y,scale,alpha){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha*=alpha;polygon([[-14,16],[-19,5],[-19,-6],[-14,-8],[-10,-1],[-10,-24],[-5,-26],[-3,-7],[-2,-31],[3,-31],[5,-8],[7,-27],[12,-26],[12,-5],[15,-20],[20,-18],[19,5],[11,17]],'#e6ac42');ctx.fillStyle='#fff0a1';ctx.fillRect(-5,-6,16,17);ctx.fillRect(-1,-23,3,13);ctx.fillRect(8,-18,3,11);ctx.restore()}
  function dragon(x,y,a,color,size=1){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(size,size);for(let i=6;i>=0;i--){const yy=Math.sin(time*15-i*.8)*5;ctx.fillStyle=i%2?'#f5d78a':color;ctx.fillRect(-i*7,yy-4,9,8)}polygon([[0,-8],[12,-8],[19,-3],[24,-3],[24,4],[15,4],[10,9],[1,7]],color);ctx.fillStyle='#fff0b6';ctx.fillRect(11,-5,3,3);pixelLine(3,-7,-2,-15,color,3);pixelLine(8,-7,10,-16,color,3);ctx.restore()}
  function eventArt(e,u,k){
    if(e.type==='evolution')return false;
    ctx.save();ctx.translate(e.x,e.y);ctx.globalAlpha=k;const r=e.r||90;
    if(e.type==='petals'){
      for(let j=0;j<6;j++){const a=j*6.28/6+u*2,rr=(e.r||40)*u,x=Math.cos(a)*rr,y=Math.sin(a)*rr;ctx.fillStyle=j%2?'#ffdfed':e.color;ctx.fillRect(x-4,y-2,8,5);ctx.fillRect(x-2,y-4,4,9)}
    }else if(e.type==='impact_burst'){
      for(let j=0;j<7;j++){const a=j*6.28/7,rr=(e.r||45)*u;pixelLine(Math.cos(a)*rr*.3,Math.sin(a)*rr*.3,Math.cos(a)*rr,Math.sin(a)*rr,e.color,3)}
    }else if(e.type==='slash'||e.type==='flail'){
      ctx.rotate((e.a||0)+(-.6+u*1.2));const rr=r*(.8+u*.35);
      polygon([[rr*.4,-rr*.8],[rr*.9,-rr*.45],[rr*1.1,0],[rr*.9,rr*.45],[rr*.4,rr*.8],[rr*.72,rr*.3],[rr*.82,0],[rr*.72,-rr*.3]],e.color);
      polygon([[rr*.8,-rr*.45],[rr*1.1,0],[rr*.8,rr*.45],[rr*.95,0]],'#fff7d5');
      for(let i=0;i<5;i++)pixelLine(rr*(.3+i*.08),-rr*.5+i*rr*.2,rr*(.05+i*.08),-rr*.5+i*rr*.2,e.color,2);
    }else if(e.type==='throw'){
      ctx.rotate(e.a||0);for(let j=-1;j<=1;j++){const d=15+u*65;pixelLine(0,j*5,d,j*14,e.color,2);polygon([[d+9,j*14],[d-4,j*14-3],[d,j*14],[d-4,j*14+3]],'#f4e4b8')}
    }else if(e.type==='meteor'){
      const offset=(1-Math.min(1,u*2.2))*150;pixelLine(-offset-55,-offset-100,-offset,-offset-20,'#a160c7',9);polygon([[-offset-14,-offset-38],[-offset+8,-offset-42],[-offset+25,-offset-20],[-offset+13,-offset+2],[-offset-10,-offset+8],[-offset-24,-offset-15]],'#67516d');polygon([[-offset-8,-offset-34],[-offset+6,-offset-28],[-offset+10,-offset-8],[-offset-9,-offset-4]],'#ef965e');
      if(u>.35)for(let j=0;j<6;j++){const a=j*6.28/6,rr=r*(u-.3);pixelLine(0,0,Math.cos(a)*rr,Math.sin(a)*rr,e.color,3);pixelLine(Math.cos(a)*rr*.6,Math.sin(a)*rr*.6,Math.cos(a+.3)*rr,Math.sin(a+.3)*rr,e.color,2)}
    }else if(e.type==='buddha'){palm(0,-(1-u)*30,1.7+u,1)}
    else if(e.type==='stomp'){
      for(let j=0;j<8;j++){const a=j*6.28/8,rr=r*u;pixelLine(Math.cos(a)*rr*.2,Math.sin(a)*rr*.2,Math.cos(a)*rr,Math.sin(a)*rr,e.color,4);pixelLine(Math.cos(a)*rr*.6,Math.sin(a)*rr*.6,Math.cos(a+.4)*rr*.9,Math.sin(a+.4)*rr*.9,'#bba783',2)}
      for(let j=0;j<7;j++){const a=j*2.4;ctx.fillStyle='#e5cf9f';ctx.fillRect(Math.cos(a)*r*u,Math.sin(a)*r*u-25*Math.sin(u*Math.PI),5,4)}
    }else if(e.type==='ice'){
      for(let j=0;j<7;j++){ctx.save();ctx.rotate(j*6.28/7);const h=r*(.4+.6*u);polygon([[-6,0],[0,-h],[8,-h*.35],[5,7]],'#64bbd5');polygon([[0,0],[0,-h],[5,-h*.35]],'#dbfcff');ctx.restore()}
    }else if(e.type==='blood_burst'){
      for(let j=0;j<9;j++){ctx.save();ctx.rotate(j*6.28/9);polygon([[-4,r*.15],[0,r*(.3+u*.7)],[6,r*.22],[0,0]],j%2?'#f07c95':'#ab3057');ctx.restore()}
    }else if(e.type==='poison'){
      for(let j=0;j<7;j++){const a=j*2.4,rr=r*(.3+.5*u),x=Math.cos(a)*rr,y=Math.sin(a)*rr;ctx.globalAlpha=k*.45;ctx.fillStyle=e.color;ctx.fillRect(x-10,y-5,22,12);ctx.fillRect(x-5,y-10,12,22);ctx.globalAlpha=k;ctx.strokeStyle='#bbec8c';ctx.lineWidth=2;ctx.strokeRect(x,y-15*u,4,4)}
    }else if(e.type==='dragon_strike'){dragon(0,-30+u*30,Math.PI/2,e.color,2)}
    else if(e.type==='lightning'){
      for(let j=1;j<e.points.length;j++){const a=e.points[j-1],b=e.points[j];pixelLine(a.x-e.x,a.y-e.y,b.x-e.x,b.y-e.y,e.color,6);pixelLine(a.x-e.x,a.y-e.y,b.x-e.x,b.y-e.y,'#fff7db',2)}
    }else if(e.type==='chain'){
      const dx=(e.tx||e.x)-e.x,dy=(e.ty||e.y)-e.y;for(let i=0;i<5;i++){const a=i/5,b=(i+1)/5;pixelLine(dx*a,dy*a+(i%2?5:-5),dx*b,dy*b+(i%2?-5:5),e.color,3)}
    }else if(e.type==='shadow_clone'){
      for(let j=-1;j<=1;j+=2){ctx.fillStyle='#68548d';ctx.fillRect(j*20*u-7,-25,14,15);ctx.fillRect(j*20*u-5,-9,10,16);pixelLine(j*20*u-20,-20,j*20*u+20,15,'#d7b0e8',3)}
    }else{ctx.restore();return false}
    ctx.restore();return true;
  }
  function ground(s){
    if(!engine)return;ctx.save();
    for(const f of s.weaponFields||[]){ctx.globalAlpha=Math.min(.25,f.t*.2);ctx.fillStyle='#76b586';ctx.fillRect(f.x-f.r*.7,f.y-f.r*.35,f.r*1.4,f.r*.7);ctx.globalAlpha=.6;ctx.strokeStyle='#b5de8e';ctx.lineWidth=2;ctx.strokeRect(f.x-4,f.y-10-(time*15)%15,6,6)}ctx.globalAlpha=1;
    if(s.skills[6]){
      const lv=s.skills[6],r=78+lv*14+(s.fusions?.[1]?28:0);
      ctx.fillStyle=selected===2?'#581c8724':selected===1?'#065f4622':'#83184320';
      ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,0,7);ctx.fill();
      for(let j=0;j<5+lv;j++){let a=time*.85+j*6.283/(5+lv);ctx.strokeStyle=selected===2?'#c084fc44':selected===1?'#34d39944':'#fb718544';ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(s.p.x,s.p.y,r,r*.5,a,0,7);ctx.stroke()}
    }
    if(s.skills[2]){
      const lv=s.skills[2],r=38+lv*4+(s.fusions?.[0]?12:0);ctx.strokeStyle=s.fusions?.[0]?'#ffe38f88':s.evolved?'#f1d18366':'#38bdf855';ctx.lineWidth=s.fusions?.[0]?3:2;ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,0,7);ctx.stroke();
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
    if(!engine)return;
    const cx=s.camX??s.p.x,cy=s.camY??s.p.y,vw=W/2+140,vh=H/2+140;
    ctx.save();
    for(const e of events){
      if(Math.abs(e.x-cx)>vw||Math.abs(e.y-cy)>vh)continue;
      const u=e.age/e.life,k=1-u*u;
      if(eventArt(e,u,k))continue;
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=k;ctx.strokeStyle=e.color;
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
        ctx.strokeStyle='#141824';ctx.lineWidth=7*k;ctx.globalAlpha=k*.45;ctx.beginPath();ctx.arc(e.x,e.y,r,0,7);ctx.stroke();
        ctx.strokeStyle=e.color;
        for(let i=0;i<3;i++){ctx.lineWidth=i===0?4.5:2;ctx.globalAlpha=k*(1-i*.25);ctx.beginPath();ctx.arc(e.x,e.y,r*(1-i*.16),0,7);ctx.stroke()}
        for(let j=0;j<10;j++){let a=j*6.283/10;ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*r*.78,e.y+Math.sin(a)*r*.78);ctx.lineTo(e.x+Math.cos(a)*r*1.06,e.y+Math.sin(a)*r*1.06);ctx.stroke()}
        ctx.font='bold 22px "Batang",serif';ctx.fillStyle=e.color;ctx.textAlign='center';
        const hanja=e.hanja||(e.type==='buddha'?'佛':e.type==='ice'?'氷':e.type==='meteor'?'天':e.type==='blood_burst'?'血':e.evolved?'極':'震');
        ctx.fillText(hanja,e.x,e.y+7);
      }
      if(e.type==='lightning'||e.type==='dragon_strike'){
        ctx.lineCap='round';ctx.lineJoin='round';
        for(const [width,alpha] of [[13,.18],[5.5,.65],[2.2,1]]){
          ctx.lineWidth=width;ctx.globalAlpha=k*alpha;ctx.strokeStyle=width===2.2?'#fffbe5':e.color;
          ctx.beginPath();e.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
        }
      }
      if(e.type==='chain'){
        const mx=(e.x+e.tx)/2+(Math.sin(time*40)*14),my=(e.y+e.ty)/2-(Math.cos(time*40)*14);
        ctx.lineWidth=3.2;ctx.globalAlpha=k*.88;ctx.strokeStyle=e.color||'#dff0ff';
        ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(mx,my);ctx.lineTo(e.tx,e.ty);ctx.stroke();
      }
      ctx.restore();
    }
    ctx.globalCompositeOperation='lighter';
    for(const p of emitter.particles){
      if(Math.abs(p.p.x-cx)>vw||Math.abs(p.p.y-cy)>vh)continue;
      const k=Math.max(0,1-p.age/p.life),r=Math.max(2,Math.round(p.fx.size*k));
      ctx.fillStyle=p.fx.color;ctx.globalAlpha=k*.78;
      ctx.fillRect(Math.round(p.p.x/2)*2,Math.round(p.p.y/2)*2,r,r);
    }
    ctx.restore();
  }
  function projectile(b,s){
    const a=Math.atan2(b.vy,b.vx),sc=b.scale||1,st=b.style||'default';
    ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));ctx.rotate(a);ctx.scale(sc,sc);
    if(Math.hypot(b.x-s.p.x,b.y-s.p.y)<38)ctx.globalAlpha=.6;
    if(st==='dragon_wave'||st==='black_dragon'){dragon(0,0,0,st==='dragon_wave'?'#eeb952':'#9770b7',1.1)}
    else if(st==='arhat'){palm(0,0,.7,1)}
    else if(st==='plum'||st==='plum_dagger'){
      for(let j=0;j<5;j++){const a=j*6.28/5+time*3;ctx.fillStyle=j%2?'#e897b1':'#ffd2df';ctx.fillRect(Math.round(Math.cos(a)*7)-3,Math.round(Math.sin(a)*7)-3,6,6)}ctx.fillStyle='#fff0be';ctx.fillRect(-2,-2,4,4);pixelLine(-30,0,-10,0,'#bf708f',2)
    }else if(st==='wraith'){polygon([[-18,-5],[-10,-12],[3,-10],[10,-3],[6,9],[-5,6],[-11,10],[-8,2],[-22,3]],'#a294c8');ctx.fillStyle='#f1e4ef';ctx.fillRect(0,-4,3,3);ctx.fillRect(1,2,3,3)}
    else if(st==='dharma_wheel'){ctx.save();ctx.rotate(time*8);for(let j=0;j<4;j++){ctx.rotate(Math.PI/2);pixelLine(0,0,12,0,'#edc666',4);pixelLine(12,0,12,7,'#edc666',3)}ctx.restore()}
    else if(st==='venom_wave'){for(let j=0;j<4;j++){ctx.fillStyle=j%2?'#c5de89':'#66ac80';ctx.fillRect(-j*9,Math.round(Math.sin(time*12-j)*4)-4,8,8)}}
    else if(b.type==='knife'||st==='shadow_dagger'){polygon([[18,0],[-4,-5],[-10,0],[-4,5]],'#b8accb');polygon([[18,0],[-4,-2],[-3,2]],'#f8ead2');pixelLine(-25,0,-12,0,'#9971b5',2)}
    else if(b.type==='fire'){polygon([[18,0],[6,-8],[-1,-6],[-12,-12],[-9,-2],[-25,-4],[-15,4],[-12,10],[0,7],[7,10]],'#c87a4f');polygon([[14,0],[1,-5],[-10,0],[1,5]],'#ffe1a0')}
    else if(b.type==='ice'){polygon([[18,0],[-4,-7],[-13,0],[-4,7]],'#87cddd');pixelLine(-6,0,12,0,'#f1ffff',2)}
    else if(st==='blood_spear'){polygon([[24,0],[6,-7],[9,-2],[-20,-2],[-20,2],[9,2],[6,7]],'#da7286');pixelLine(-10,0,20,0,'#ffe2cc',2)}
    else if(st==='emerald_staff'){pixelLine(-23,0,18,0,'#65b5a2',5);pixelLine(-17,-2,13,-2,'#d9f0c2',2)}
    else{const col=st==='taiji'?'#9fd4dd':st==='blood_blade'?'#e3889d':st==='cleaver_wave'?'#e6b578':st==='demonic_slash'?'#b18ed1':'#9ed9d7';polygon([[-14,-20],[7,-15],[19,0],[7,15],[-14,20],[1,10],[7,0],[1,-10]],col);polygon([[7,-15],[19,0],[7,15],[12,0]],'#fff4dc');pixelLine(-30,0,-9,0,col,2)}
    ctx.restore();
  }
  return{reset,cast,burst,update,ground,front,projectile,swordShape,get count(){return emitter?.particles.length||0},get limit(){return cap()}};
})();
