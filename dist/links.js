'use strict';
// Rank-3 links add six limited, telegraphed attacks; legacy 5+5 fusions remain.
const LinkSystem=(()=>{
 const recipes=[
 {a:0,b:7,type:'storm',cd:10,names:['천룡검우','혈룡참뢰','천마혈뢰'],text:'표적 3명 · 차례로 검뢰 낙하',color:'#a8e8f2'},
 {a:1,b:6,type:'petals',cd:9,names:['자하만개','독영만화','귀염만개'],text:'표식 3개 · 지연 개화 · 폭발당 최대 3명',color:'#edb3de'},
 {a:3,b:4,type:'ward',cd:12,names:['금강진천','혈강호신','천마호신'],text:'4초간 1회 방어 · 충격파 최대 4명',color:'#f6d78d'},
 {a:8,b:9,type:'meteor',cd:11,names:['나한강림','만독천겁','흑염낙성'],text:'낙하 예고 후 광역 일격 · 최대 6명',color:'#f0af80'},
 {a:2,b:11,type:'vortex',cd:10,names:['양의귀원','귀영회류','만귀혈진'],text:'2초간 인력장 · 일반 적 흡인 · 보스 감속',color:'#9ddbc5'},
 {a:5,b:10,type:'lance',cd:9,names:['취옥유성','패왕추혼','군림마검'],text:'고정 방향 260px 검로 · 최대 5명',color:'#bad3ff'}
 ];
 function init(s){s.links={known:Array(6).fill(false),cd:Array(6).fill(3),fx:[],events:[],fields:[],ward:0,gate:0,cursor:0,casts:0}}
 function ensure(s){if(!s.links)init(s);return s.links}
 function sync(s){const q=ensure(s);recipes.forEach((r,i)=>{const ready=s.skills[r.a]>=3&&s.skills[r.b]>=3;if(ready&&!q.known[i]){q.cd[i]=1.2;showNotice('연계 개방 · '+r.names[selected]+' · '+names[r.a]+' 3성 + '+names[r.b]+' 3성')}q.known[i]=ready})}
 const near=(s,x,y,r,n)=>s.enemies.filter(e=>!e.dead&&(e.x-x)**2+(e.y-y)**2<r*r).sort((a,b)=>(a.x-x)**2+(a.y-y)**2-((b.x-x)**2+(b.y-y)**2)).slice(0,n);
 function cast(s,i){const q=ensure(s),r=recipes[i],p=s.p,target=near(s,p.x,p.y,480,1)[0];if(!q.known[i]||!target||q.fx.length>=6)return false;const x=r.type==='ward'||r.type==='vortex'||r.type==='lance'?p.x:target.x,y=r.type==='ward'||r.type==='vortex'||r.type==='lance'?p.y:target.y,a=Math.atan2(target.y-p.y,target.x-p.x),base=38+s.level*2.2;
  const fx={i,type:r.type,x,y,a,age:0,life:r.type==='vortex'?2.5:1.45,r:r.type==='meteor'?112:r.type==='ward'?110:r.type==='lance'?85:90};q.fx.push(fx);q.casts++;
  if(r.type==='storm'||r.type==='petals'){near(s,p.x,p.y,480,3).forEach((e,j)=>q.events.push({i,type:r.type,x:e.x,y:e.y,delay:.4+j*.16,n:base*(r.type==='storm'?1.1:.8),r:r.type==='storm'?28:46,limit:r.type==='storm'?1:3}));fx.targets=q.events.filter(e=>e.i===i).map(e=>({x:e.x,y:e.y,delay:e.delay}))}
  else if(r.type==='vortex')q.fields.push({x,y,t:2,tick:0,delay:.4,n:base*.15});
  else{q.events.push({i,type:r.type,x,y,a,delay:r.type==='meteor'?.65:.4,n:base*(r.type==='meteor'?1.7:1.25),r:fx.r,limit:r.type==='ward'?4:r.type==='meteor'?6:5});if(r.type==='ward')q.ward=4}
  q.gate=2.4;q.cd[i]=r.cd*(1-Equipment.bonus(s,'linkCycle'));return true;
 }
 function update(s,dt){const q=ensure(s);q.gate-=dt;q.ward=Math.max(0,q.ward-dt);for(let i=0;i<6;i++)q.cd[i]=Math.max(0,q.cd[i]-dt);if(q.gate<=0)for(let j=0;j<6;j++){const i=(q.cursor+j)%6;if(q.known[i]&&q.cd[i]<=0&&cast(s,i)){q.cursor=(i+1)%6;break}}
  compact(q.events,e=>{e.delay-=dt;if(e.delay>0)return true;let victims;if(e.type==='lance'){const tx=e.x+Math.cos(e.a)*260,ty=e.y+Math.sin(e.a)*260;victims=near(s,e.x,e.y,280,100).filter(o=>segmentDistance(o.x,o.y,e.x,e.y,tx,ty)<24).slice(0,e.limit)}else victims=near(s,e.x,e.y,e.r,e.limit);for(const o of victims){damage(o,e.n,Math.atan2(o.y-e.y,o.x-e.x),'link');if(e.type==='meteor'&&!o.boss)o.stun=.2}VFX.burst(e.x,e.y-15,recipes[e.i].color,Profile.data.settings.effects==='low'?4:10,100);Sound.play(e.type==='meteor'?'heavy':'slash');return false});
  compact(q.fields,f=>{f.delay-=dt;if(f.delay>0)return true;f.t-=dt;f.tick-=dt;if(f.tick<=0){f.tick=.4;for(const e of near(s,f.x,f.y,108,6)){if(!e.boss){e.x+=(f.x-e.x)*.08;e.y+=(f.y-e.y)*.08}e.chilled=.45;damage(e,f.n,0,'link')}}return f.t>0});compact(q.fx,f=>{f.age+=dt;return f.age<f.life});
 }
 function block(s){const q=ensure(s);if(q.ward<=0)return false;q.ward=0;VFX.burst(s.p.x,s.p.y-12,'#f6d78d',10,80);return true}
 function draw(s,front){const q=ensure(s),low=Profile.data.settings.effects==='low'||s.enemies.length>300;ctx.save();
  for(const f of q.fx){const r=recipes[f.i],t=f.age,fade=Math.min(1,(f.life-t)*2),impact=Math.max(0,t-.4);ctx.globalAlpha=fade*.85;ctx.strokeStyle=r.color;ctx.fillStyle=r.color;
   if(!front){ctx.globalAlpha=fade*.55;JianghuFX.formation(ctx,f.x,f.y,f.r*(.65+Math.min(.35,t)),s.time*.6,r.color,low);if(f.targets)for(const p of f.targets){ctx.beginPath();ctx.ellipse(p.x,p.y,27,13,0,0,7);ctx.stroke()}continue}
   if(f.type==='storm'){for(const [j,p] of (f.targets||[]).entries()){const v=t-.4-j*.16;if(v<0||v>.6)continue;ctx.globalAlpha=fade*(1-v/.6);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x-25,p.y-185);ctx.lineTo(p.x+12,p.y-105);ctx.lineTo(p.x-9,p.y-60);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.strokeStyle='#fff6df';ctx.lineWidth=2;ctx.stroke();JianghuFX.slash(ctx,p.x,p.y-18,48,-.4,1.4,v/.6,r.color,low)}}
   else if(f.type==='petals'){for(const [j,p] of (f.targets||[]).entries()){const v=t-.4-j*.16;if(v<0)continue;for(let k=0;k<(low?5:10);k++){const a=k*6.28/(low?5:10)+v*2,rr=14+v*55;ctx.save();ctx.translate(p.x+Math.cos(a)*rr,p.y-18+Math.sin(a)*rr*.7);ctx.rotate(a);ctx.fillRect(-3,-7,6,14);ctx.restore()}JianghuFX.slash(ctx,p.x,p.y-20,60,j*1.2,2,v,r.color,low)}}
   else if(f.type==='meteor'){const fall=Math.min(1,t/.65),my=f.y-220*(1-fall);if(t<.75){ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(f.x-40,my-60);ctx.lineTo(f.x,my);ctx.stroke();ctx.fillStyle='#fff0c9';ctx.beginPath();ctx.arc(f.x,my,11,0,7);ctx.fill()}if(t>=.65){ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(f.x,f.y,Math.min(150,20+(t-.65)*200),Math.min(75,10+(t-.65)*100),0,0,7);ctx.stroke();for(let j=0;j<(low?5:12);j++){const a=j*6.28/12;ctx.fillRect(f.x+Math.cos(a)*impact*150,f.y+Math.sin(a)*impact*70-35*impact,3,7)}}}
   else if(f.type==='lance'){if(t>=.4){const v=Math.min(1,impact*5),tx=f.x+Math.cos(f.a)*260*v,ty=f.y+Math.sin(f.a)*260*v;ctx.lineWidth=12*(1-impact/f.life);ctx.beginPath();ctx.moveTo(f.x,f.y-18);ctx.lineTo(tx,ty-18);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#fff6e3';ctx.stroke();for(let j=1;j<4;j++)JianghuFX.slash(ctx,f.x+Math.cos(f.a)*j*65,f.y+Math.sin(f.a)*j*65-15,48,f.a,1.2,Math.min(1,impact+.1*j),r.color,low)}}
   else if(f.type==='ward'){for(let j=0;j<3;j++)JianghuFX.slash(ctx,f.x,f.y-20,55+j*18,j*2.1,1.5,t/1.45,r.color,low);if(q.ward>0){ctx.beginPath();ctx.ellipse(s.p.x,s.p.y-18,25,35,0,0,7);ctx.stroke()}}
   else{for(let j=0;j<(low?3:6);j++){const a=t*4+j*6.28/(low?3:6);JianghuFX.slash(ctx,f.x+Math.cos(a)*30,f.y-18+Math.sin(a)*15,70,a,1.8,(t*.6+j*.12)%1,r.color,low)}}
  }ctx.restore();
 }
 function hud(s){const q=ensure(s),n=q.known.filter(Boolean).length;$('#linkButton').textContent='연계 '+n+'/6 [J]';const next=recipes.map((r,i)=>({r,i,score:Math.min(3,s.skills[r.a])+Math.min(3,s.skills[r.b])})).filter(o=>!q.known[o.i]).sort((a,b)=>b.score-a.score)[0];$('#linkHint').textContent=next?next.r.names[selected]+' · '+Math.min(3,s.skills[next.r.a])+'/3 + '+Math.min(3,s.skills[next.r.b])+'/3':n?'연계 완성 · 자동 발동':'3성 무공 두 개로 연계 개방'}
 function open(){if(mode!=='play'&&mode!=='menu')return;const playing=mode==='play';if(playing)pause();const s=state||{skills:Array(12).fill(0)},q=s.links;$('#camp').hidden=false;$('#campTitle').textContent='연계 무공 · 세력별 6식';$('#campSub').textContent='두 무공 각각 3성 → 자동 연계 / 기존 5성 + 5성 합벽은 유지 · 동시 난사 제한';$('#campContent').innerHTML=recipes.map((r,i)=>{const a=Math.min(3,s.skills[r.a]),b=Math.min(3,s.skills[r.b]),ready=q?.known[i];return '<article class="link-card '+(ready?'ready':'')+'"><span class="link-number">0'+(i+1)+'</span><div><small>'+(ready?'개방 완료':'3성 + 3성')+'</small><h3>'+r.names[selected]+'</h3><p>'+names[r.a]+' <b>'+a+'/3</b> ＋ '+names[r.b]+' <b>'+b+'/3</b></p><small>'+r.text+' · '+r.cd+'초</small></div></article>'}).join('');$('#campClose').onclick=()=>{$('#camp').hidden=true;if(playing&&mode==='pause')pause()}}
 return {recipes,init,ensure,sync,cast,update,block,draw,hud,open};
})();
