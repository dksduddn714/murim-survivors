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
    const color=type==='evolution'?'#dfc78a':martialColor();opts={...opts,color};
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
    for(const b of s.shots){b.trail=(b.trail||0)-dt;if(b.trail<=0){b.trail=.045;const col=martialColor();burst(b.x,b.y,col,b.type==='knife'?1:2,28,'mote')}}
  }
  function swordShape(x,y,a,length=50,color='#abfff0',alpha=1){
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-length*.5,0);ctx.lineTo(length*.5,0);ctx.stroke();ctx.fillStyle='#fff9d3';ctx.beginPath();ctx.moveTo(length*.8,0);ctx.lineTo(length*.3,-4);ctx.lineTo(length*.3,4);ctx.fill();ctx.fillStyle='#d9bd78';ctx.fillRect(-length*.3,-6,3,12);ctx.restore()
  }
  function polygon(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill()}
  function pixelLine(ax,ay,bx,by,color,size=3){ctx.fillStyle=color;const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/size));for(let i=0;i<=n;i++){const t=i/n;ctx.fillRect(Math.round((ax+(bx-ax)*t)/2)*2,Math.round((ay+(by-ay)*t)/2)*2,size,size)}}
  function palm(x,y,scale,alpha){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha*=alpha;polygon([[-14,16],[-19,5],[-19,-6],[-14,-8],[-10,-1],[-10,-24],[-5,-26],[-3,-7],[-2,-31],[3,-31],[5,-8],[7,-27],[12,-26],[12,-5],[15,-20],[20,-18],[19,5],[11,17]],'#e6ac42');ctx.fillStyle='#fff0a1';ctx.fillRect(-5,-6,16,17);ctx.fillRect(-1,-23,3,13);ctx.fillRect(8,-18,3,11);ctx.restore()}
  function dragon(x,y,a,color,size=1){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(size,size);for(let i=6;i>=0;i--){const yy=Math.sin(time*15-i*.8)*5;ctx.fillStyle=i%2?'#f5d78a':color;ctx.fillRect(-i*7,yy-4,9,8)}polygon([[0,-8],[12,-8],[19,-3],[24,-3],[24,4],[15,4],[10,9],[1,7]],color);ctx.fillStyle='#fff0b6';ctx.fillRect(11,-5,3,3);pixelLine(3,-7,-2,-15,color,3);pixelLine(8,-7,10,-16,color,3);ctx.restore()}
  // Original martial brushwork: short sword routes, pressure palms and impact marks.
  function martialColor(){return selected===0?'#b9d9c4':selected===1?'#cf8e83':'#b7a4c9'}
  function plumPetal(x,y,a,size,col){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,-size);ctx.quadraticCurveTo(size,size*.2,0,size*.65);ctx.quadraticCurveTo(-size,size*.2,0,-size);ctx.fill();ctx.restore()}
  function eventArt(e,u,k){
    if(e.type==='evolution')return false;
    const col=martialColor(),r=Math.min(135,e.r||70),low=Profile.data.settings.effects==='low';ctx.save();ctx.globalAlpha=k;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2;
    if(['slash','flail','throw','shadow_clone'].includes(e.type)){
      const a=e.a??(e.tx!==undefined?Math.atan2(e.ty-e.y,e.tx-e.x):-.4);JianghuFX.slash(ctx,e.x,e.y-13,r,a,1.2,u,col,low);
      if(!low)JianghuFX.slash(ctx,e.x-4,e.y-12,r*.72,a+.15,1.1,Math.min(1,u+.15),'#ede5c9',true);
    }else if(e.type==='petals'){
      for(let j=0;j<(low?5:9);j++){const a=j*2.4+u*.8,d=r*(.15+u*.65);plumPetal(e.x+Math.cos(a)*d,e.y-12+Math.sin(a)*d*.7,a,3+u*2,j%2?'#c78391':'#e6c8bc')}
      JianghuFX.slash(ctx,e.x,e.y-10,r*.75,-.5,1.5,u,'#d5b4ba',low);
    }else if(e.type==='poison'){
      ctx.globalAlpha=k*.16;ctx.beginPath();ctx.arc(e.x,e.y,r,0,7);ctx.fill();ctx.globalAlpha=k*.7;ctx.setLineDash([10,7]);ctx.beginPath();ctx.arc(e.x,e.y,r,0,7);ctx.stroke();ctx.setLineDash([]);
      for(let j=0;j<4;j++){const a=j*1.57+u;ctx.beginPath();ctx.ellipse(e.x+Math.cos(a)*r*.5,e.y+Math.sin(a)*r*.4,14,3,a,0,Math.PI);ctx.stroke()}
    }else if(e.type==='chain'){
      ctx.beginPath();ctx.moveTo(e.x,e.y-12);ctx.quadraticCurveTo((e.x+e.tx)/2,(e.y+e.ty)/2-25,e.tx,e.ty-12);ctx.stroke();
    }else if(['lightning','dragon_strike'].includes(e.type)){
      // A directional palm pressure trail, not a bolt descending from the sky.
      const sx=e.sx??e.x-50,sy=e.sy??e.y;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx,sy-12);ctx.quadraticCurveTo((sx+e.x)/2,(sy+e.y)/2-25,e.x,e.y-12);ctx.stroke();for(let j=0;j<3;j++)JianghuFX.slash(ctx,e.x,e.y-10,25+j*10,Math.atan2(e.y-sy,e.x-sx),1,u,col,low);
    }else{
      const impact=u<.28?0:(u-.28)/.72;
      if(['meteor','buddha','ice'].includes(e.type)&&u<.55){const a=-Math.PI/2;const yy=e.y-100*(1-u/.55);swordShape(e.x,yy,a,50+u*35,'#ece0b6',k);ctx.beginPath();ctx.moveTo(e.x,yy-35);ctx.lineTo(e.x,yy-70);ctx.stroke()}
      for(let j=0;j<(low?5:8);j++){const a=j*6.28/(low?5:8),rr=r*impact;ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*rr*.55,e.y+Math.sin(a)*rr*.5);ctx.lineTo(e.x+Math.cos(a)*rr,e.y+Math.sin(a)*rr*.7);ctx.stroke()}
      if(impact>0){ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e.x,e.y,r*impact,r*impact*.45,0,0,7);ctx.stroke();JianghuFX.slash(ctx,e.x,e.y-10,r*.6,-.4,1.6,impact,col,low)}
    }ctx.restore();return true;
  }
  function ground(s){
    if(!engine)return;ctx.save();
    for(const f of s.weaponFields||[]){ctx.globalAlpha=Math.min(.25,f.t*.2);ctx.fillStyle='#76b586';ctx.fillRect(f.x-f.r*.7,f.y-f.r*.35,f.r*1.4,f.r*.7);ctx.globalAlpha=.6;ctx.strokeStyle='#b5de8e';ctx.lineWidth=2;ctx.strokeRect(f.x-4,f.y-10-(time*15)%15,6,6)}ctx.globalAlpha=1;
    if(canUseSkill(s,6)||s.fusions?.[1]){const r=58+(s.skills[6]||1)*8+(s.fusions?.[1]?16:0);ctx.globalAlpha=.10;ctx.fillStyle=martialColor();ctx.beginPath();ctx.arc(s.p.x,s.p.y,r,0,7);ctx.fill();ctx.globalAlpha=.45;ctx.strokeStyle=martialColor();ctx.lineWidth=1;ctx.setLineDash([12,6]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
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
    const a=Math.atan2(b.vy,b.vx),st=b.style||'',sc=b.scale||1,col=martialColor();ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y)-8);ctx.rotate(a);ctx.scale(sc,sc);
    // Restrained blade trails, steel/cloth palettes and small plum petals.
    if(st.startsWith('plum')){for(let j=0;j<3;j++)plumPetal(-j*7,Math.sin(time*6+j)*4,-.4+j,3,j%2?'#d397a4':'#e9d0c6');ctx.strokeStyle='#f2e3c9';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(10,0);ctx.stroke()}
    else if(['arhat','dragon_wave','black_dragon','venom_wave'].includes(st)){for(let j=0;j<3;j++){ctx.strokeStyle=j===1?'#efe0b9':col;ctx.lineWidth=3-j*.6;ctx.beginPath();ctx.moveTo(-20-j*5,-8+j*8);ctx.quadraticCurveTo(20,-12+j*8,12+j*2,8-j*2);ctx.stroke()}}
    else if(st==='dharma_wheel'||st==='emerald_staff'){ctx.rotate(time*7);swordShape(0,0,0,28,col);swordShape(0,0,Math.PI/2,28,'#e4d0a0')}
    else{ctx.fillStyle='#ecdfbd';ctx.beginPath();ctx.moveTo(17,0);ctx.lineTo(-5,-3);ctx.lineTo(-10,0);ctx.lineTo(-5,3);ctx.closePath();ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-30,0);ctx.lineTo(-9,0);ctx.stroke();ctx.strokeStyle='#777f79';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-22,-3);ctx.lineTo(-6,-2);ctx.stroke()}
    ctx.restore();
  }
  return{reset,cast,burst,update,ground,front,projectile,swordShape,get count(){return emitter?.particles.length||0},get limit(){return cap()}};
})();
