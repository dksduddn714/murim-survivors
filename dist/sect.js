'use strict';
const SectSystem=(()=>{
 const catalog=[
  {name:'금강반진',type:'ward',cd:8,color:'#efc46a',text:'주기적으로 1회 방어 · 막으면 주변에 금강 반격'},
  {name:'태극회류',type:'vortex',cd:7,color:'#85d4df',text:'제자리 태극진에 적을 끌어당기고 감속'},
  {name:'매화삼첩',type:'petals',cd:5.8,color:'#f3a2bd',text:'적 3명에 매화 표식 · 차례로 개화 폭발'},
  {name:'항룡파진',type:'dragon',cd:7,color:'#dfbd6a',text:'전방의 넓은 부채꼴 장풍 · 강한 밀쳐내기'},
  {name:'혈도단명',type:'execute',cd:5.8,color:'#e77791',text:'출혈 단일 참격 · 약해진 적에게 처형 피해'},
  {name:'만독지대',type:'venom',cd:7,color:'#94c776',text:'적 발밑에 3초 독지대 · 지속 피해와 감속'},
  {name:'귀영쌍살',type:'shadow',cd:6,color:'#b99adb',text:'강한 적부터 분신 2연격 · 짧은 회피 보호'},
  {name:'패왕단악',type:'cleaver',cd:8,color:'#e5b67e',text:'예비 동작 후 전방에 무거운 대도 일격'},
  {name:'천마낙성',type:'meteor',cd:8,color:'#c49bd9',text:'낙하지점 예고 후 운석 · 최대 6명 광역 타격'},
  {name:'혈인파열',type:'blood',cd:7,color:'#d67788',text:'혈인 3개가 순차 파열 · 표식 적 처치 시 회복'},
  {name:'귀혼연쇄',type:'spirits',cd:6,color:'#c7b2dd',text:'추적 원혼 3기 · 원혼당 최대 2명까지 연결'},
  {name:'흑염잔재',type:'embers',cd:7,color:'#ad8dcc',text:'3초간 남는 흑염 · 영역에 머문 적을 태움'}
 ];
 const config=()=>catalog[selected*4+subSect];
 function ensure(s){return s.sect??={cooldown:2.5,mastery:[0,0,0],fields:[],pending:[],fx:[],ward:0,casts:0}}
 function slots(){return WuxiaUI.SUB_SECTS[selected][subSect].sigSlots}
 function complete(s){return slots().every(i=>(s.skills[i]||0)>=5)}
 function power(s){return 1+ensure(s).mastery[0]*.12}
 function cycle(s){return config().cd*(1-ensure(s).mastery[1]*.05)}
 function size(s){return 1+ensure(s).mastery[2]*.08}
 function candidates(s,x,y,r,limit=8){const list=typeof queryGridRadius==='function'?queryGridRadius(s,x,y,r):s.enemies.filter(e=>!e.dead&&(e.x-x)**2+(e.y-y)**2<r*r);return list.sort((a,b)=>(a.x-x)**2+(a.y-y)**2-((b.x-x)**2+(b.y-y)**2)).slice(0,limit)}
 function strike(s,x,y,r,n,type='stomp',limit=8){for(const e of candidates(s,x,y,r,limit))damage(e,n,Math.atan2(e.y-y,e.x-x),'signature');VFX.cast(type,x,y,{r,color:config().color})}
 function fx(s,type,x,y,tx=x,ty=y){const q=ensure(s);q.fx.push({type,x,y,tx,ty,t:.65,max:.65,color:config().color});if(q.fx.length>12)q.fx.shift()}
 function cast(s){const q=ensure(s),cfg=config(),p=s.p,near=candidates(s,p.x,p.y,280,8),e=near[0],form=q.mastery[2],r=size(s);if(!e&&cfg.type!=='ward')return false;
  const base=(70+s.level*4)*[1,1.15,.8,.75,1,.95,.8,.85,.8,.85,.95,.95][selected*4+subSect];q.casts++;
  if(cfg.type==='ward'){q.ward=1;fx(s,'ward',p.x,p.y)}
  else if(cfg.type==='vortex'||cfg.type==='venom'||cfg.type==='embers'){q.fields.push({type:cfg.type,x:cfg.type==='vortex'?p.x:e.x,y:cfg.type==='vortex'?p.y:e.y,r:(cfg.type==='vortex'?112:90)*r,t:3,tick:0,dmg:(cfg.type==='embers'?32:cfg.type==='venom'?22:18)+s.level*.9});if(q.fields.length>3)q.fields.shift();fx(s,cfg.type,e.x,e.y)}
  else if(cfg.type==='petals'||cfg.type==='blood'){near.slice(0,3+Math.floor(form/3)).forEach((o,j)=>{if(cfg.type==='blood')o.bloodMarked=true;q.pending.push({type:cfg.type,e:o,x:o.x,y:o.y,delay:.55+j*.16,n:base*1.15,r:42*r});fx(s,cfg.type,o.x,o.y)})}
  else if(cfg.type==='cleaver'||cfg.type==='meteor'){q.pending.push({type:cfg.type,x:cfg.type==='cleaver'?p.x:e.x,y:cfg.type==='cleaver'?p.y:e.y,a:Math.atan2(e.y-p.y,e.x-p.x),delay:cfg.type==='cleaver'?.45:.7,n:base*(cfg.type==='cleaver'?2.2:2.1),r:(cfg.type==='cleaver'?175:100)*r});fx(s,cfg.type,cfg.type==='cleaver'?p.x:e.x,cfg.type==='cleaver'?p.y:e.y,e.x,e.y)}
  else if(cfg.type==='dragon'){const a=Math.atan2(e.y-p.y,e.x-p.x);for(const o of candidates(s,p.x,p.y,230*r,12)){const da=Math.atan2(Math.sin(Math.atan2(o.y-p.y,o.x-p.x)-a),Math.cos(Math.atan2(o.y-p.y,o.x-p.x)-a));if(Math.abs(da)<.8){damage(o,base*1.3,a,'signature');o.knockX=Math.cos(a)*220;o.knockY=Math.sin(a)*220}}fx(s,'dragon',p.x,p.y,p.x+Math.cos(a)*220,p.y+Math.sin(a)*220);VFX.cast('dragon_strike',e.x,e.y,{color:cfg.color})}
  else if(cfg.type==='execute'){e.bleed=Math.max(e.bleed||0,4);damage(e,base*(e.hp/e.max<.35?2.4:1.45),Math.atan2(e.y-p.y,e.x-p.x),'signature');VFX.cast('slash',e.x,e.y-20,{r:65,color:cfg.color});fx(s,'execute',e.x,e.y)}
  else if(cfg.type==='shadow'){const targets=[...near].sort((a,b)=>(b.boss?1e6:0)+b.hp-((a.boss?1e6:0)+a.hp)).slice(0,2+Math.floor(form/3));for(const o of targets){damage(o,base*1.65,0,'signature');VFX.cast('shadow_clone',o.x,o.y,{color:cfg.color})}s.inv=Math.max(s.inv,.3);fx(s,'shadow',p.x,p.y,e.x,e.y)}
  else if(cfg.type==='spirits'){for(let j=0;j<3+Math.floor(form/3);j++){const b=shot(Math.atan2(e.y-p.y,e.x-p.x)+(j-1)*.25,275,base*.75,'knife',1.1,'wraith',true);if(b){b.signature=true;b.remainingHits=2}}fx(s,'spirits',p.x,p.y,e.x,e.y)}
  return true;
 }
 function update(s,dt){const q=ensure(s);q.cooldown-=dt;if(q.cooldown<=0)q.cooldown=cast(s)?cycle(s):.2;
  compact(q.pending,m=>{m.delay-=dt;if(m.delay>0)return true;if(m.type==='cleaver'){for(const e of candidates(s,m.x,m.y,m.r,12)){const a=Math.atan2(e.y-m.y,e.x-m.x),d=Math.atan2(Math.sin(a-m.a),Math.cos(a-m.a));if(Math.abs(d)<1.15)damage(e,m.n,a,'signature')}VFX.cast('flail',m.x,m.y-20,{a:m.a,r:m.r,color:config().color})}else{const x=m.e&&!m.e.dead?m.e.x:m.x,y=m.e&&!m.e.dead?m.e.y:m.y;strike(s,x,y,m.r,m.n,m.type==='meteor'?'meteor':m.type==='petals'?'petals':'blood_burst',m.type==='meteor'?6:4)}return false});
  compact(q.fields,f=>{f.t-=dt;f.tick-=dt;if(f.tick<=0){f.tick=.3;for(const e of candidates(s,f.x,f.y,f.r,12)){if(f.type==='vortex'){if(!e.boss){e.x+=(f.x-e.x)*.1;e.y+=(f.y-e.y)*.1}e.chilled=.4}else if(f.type==='venom')e.poisoned=.5;else e.blackFlame=.5;damage(e,f.dmg*.3,0,'signature')}}return f.t>0});compact(q.fx,f=>{f.t-=dt;return f.t>0});
 }
 function block(s){if(LinkSystem.block(s))return true;const q=ensure(s);if(!q.ward)return false;q.ward=0;strike(s,s.p.x,s.p.y,120*size(s),45+s.level*2,'buddha',10);showNotice('금강반진 · 방어와 반격');return true}
 function killed(s,e){if(config().type==='blood'&&e.bloodMarked)s.p.hp=Math.min(s.p.max,s.p.hp+2)}
 function upgrades(s){const q=ensure(s),labels=['절초 위력','운기 순환','초식 확장'],texts=['고유 절초 피해 +12%','고유 절초 재사용 대기 -5%','절초 범위 +8% · 3단계마다 일부 표적 +1'];const out=[];for(let i=0;i<3;i++)if(q.mastery[i]<6)out.push({mastery:i,name:config().name+' · '+labels[i],text:texts[i]+' ('+(q.mastery[i]+1)+'/6)'});if(!out.length)out.push({mastery:3,name:'문파 운기조식',text:'심화 완성 · 체력 30 회복 및 절초 2초 당기기'});return out}
 function learn(s,i){const q=ensure(s);if(i===3){s.p.hp=Math.min(s.p.max,s.p.hp+30);q.cooldown=Math.max(0,q.cooldown-2)}else if(q.mastery[i]<6)q.mastery[i]++}
 function draw(s){const q=ensure(s);ctx.save();for(const f of q.fields){ctx.globalAlpha=Math.min(.32,f.t*.2);ctx.fillStyle=config().color;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,7);ctx.fill();ctx.globalAlpha=.7;ctx.strokeStyle=config().color;ctx.lineWidth=2;for(let j=0;j<6;j++){const a=j*6.28/6+s.time*(f.type==='vortex'?1:-.25),x=f.x+Math.cos(a)*f.r*.7,y=f.y+Math.sin(a)*f.r*.7;ctx.fillRect(x-3,y-3,6,6)}}ctx.globalAlpha=1;
  for(const f of q.fx){const u=1-f.t/f.max;ctx.strokeStyle=f.color;ctx.fillStyle=f.color;ctx.globalAlpha=Math.min(1,f.t*3);ctx.lineWidth=3;
   if(f.type==='petals'||f.type==='blood'){const r=8+u*18;for(let j=0;j<5;j++){const a=j*6.28/5+u*2;ctx.fillRect(f.x+Math.cos(a)*r-2,f.y-20+Math.sin(a)*r-2,4,4)}}
   else if(f.type==='dragon'||f.type==='shadow'||f.type==='spirits'){ctx.beginPath();ctx.moveTo(f.x,f.y-20);ctx.lineTo(f.x+(f.tx-f.x)*u,f.y+(f.ty-f.y)*u-20);ctx.stroke()}
   else if(f.type==='meteor'||f.type==='cleaver'){ctx.setLineDash([7,5]);ctx.beginPath();ctx.arc(f.type==='cleaver'?f.tx:f.x,f.type==='cleaver'?f.ty:f.y,30+u*20,0,7);ctx.stroke();ctx.setLineDash([])}
  }if(q.ward){ctx.globalAlpha=.7;ctx.strokeStyle='#e6c878';ctx.lineWidth=3;ctx.beginPath();ctx.arc(s.p.x,s.p.y-25,27,0,7);ctx.stroke()}ctx.restore();
 }
 function hud(s){const q=ensure(s),cfg=config();$('#sectSkillName').textContent=cfg.name;$('#sectSkillState').textContent=q.ward?'금강 방어 준비':q.cooldown<=0?'표적 탐색':Math.max(0,q.cooldown).toFixed(1)+'초';$('#sectSkillFill').style.width=Math.max(0,1-q.cooldown/cycle(s))*100+'%';$('#sectSkill').title=cfg.text}
 return{catalog,config,ensure,complete,slots,power,cycle,cast,update,block,killed,upgrades,learn,draw,hud};
})();
function masteryUpgrade(){
 const s=state;mode='upgrade';keys={};pointer=null;$('#trade').hidden=true;$('#modal').hidden=false;$('#modalEyebrow').textContent='전용 무공 완성 · 문파 심화';$('#modalTitle').textContent=SectSystem.config().name+'의 경지를 높이세요';$('#choices').innerHTML='';$('#again').hidden=true;$('#retry').hidden=true;$('#resume').hidden=false;$('#resume').textContent='다른 무공 비급 보기';$('#resume').onclick=()=>{upgrade(true);$('#resume').textContent='계속하기'};
 SectSystem.upgrades(s).forEach(o=>{const b=document.createElement('button');b.className='evo-ready';b.innerHTML='<div class="wx-card-tags"><span class="wx-sect-badge sig">★ 본문파 절초</span></div><strong>'+o.name+'</strong><small>'+o.text+'</small><small>'+SectSystem.config().text+'</small>';b.onclick=()=>{if(mode!=='upgrade')return;SectSystem.learn(s,o.mastery);mode='play';$('#modal').hidden=true;$('#resume').textContent='계속하기';$('#resume').onclick=pause;Sound.play('level');showNotice(o.name+' 수련')};$('#choices').append(b)})
}
