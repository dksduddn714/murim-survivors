'use strict';
// Short-lived combat visuals are independent of enemy AI and capped for mobile devices.
function compact(list,keep){let w=0;for(let i=0;i<list.length;i++)if(keep(list[i]))list[w++]=list[i];list.length=w;return list}
function hitFeedback(e,n,direction,kind='sword'){
  const s=state;if(n<6)return;
  const a=direction??Math.atan2(e.y-s.p.y,e.x-s.p.x);
  const kMult=kind==='stomp'?1.25:kind==='knife'?.65:kind==='ring'?.85:1;
  const roleResist=e.role==='shield'?.35:e.role==='brute'?.55:1;
  const force=(e.boss?18:e.elite?48:74)*kMult*roleResist;
  e.knockX=Math.cos(a)*force;e.knockY=Math.sin(a)*force;e.stun=e.boss?0:(kind==='lightning'||kind==='stomp'?.08:.04);e.hit=.12;if(n>=35&&(s.impactCooldown||0)<=0){s.impactCooldown=.12;s.shake=Math.max(s.shake||0,.055)}
  s.impacts.push({x:e.x,y:e.y-28,a,t:.16,max:.16,large:n>=45||kind==='stomp'||kind==='lightning',kind});
  if(s.impacts.length>65)s.impacts.shift();
  const pCol=kind==='lightning'?'#bfe0ff':kind==='ice'?'#9ee8ff':kind==='fire'?'#ff8b54':kind==='knife'?'#ffd080':kind==='stomp'?'#ff9eb5':'#ffedb1';
  for(let i=0;i<3;i++)addParticle(e.x,e.y-28,a+(Math.random()-.5)*2.8,70+Math.random()*110,pCol,.22);
  Sound.play('hit');
}
function addParticle(x,y,a,speed,color,life){if(state.particles.length>=240)return;state.particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,t:life,max:life,color,size:2+Math.random()*3})}
function deathFeedback(e){
  const s=state,a=Math.atan2(e.y-s.p.y,e.x-s.p.x);s.corpses.push({x:e.x,y:e.y,f:e.f,boss:e.boss,role:e.role,look:e.look||0,a,turn:Math.cos(a)>0?1:-1,t:.65,max:.65});if(s.corpses.length>90)s.corpses.shift();
  for(let j=0;j<(e.boss?22:8);j++)addParticle(e.x,e.y-3,Math.random()*Math.PI*2,45+Math.random()*100,j%3===0?'#ffdfa0':factions[e.f].color,.3+Math.random()*.25);
  s.combo=(s.comboTimer>0?s.combo:0)+1;s.comboTimer=2.2;s.bestCombo=Math.max(s.bestCombo,s.combo);
  if(e.boss||e.elite){s.shake=Math.max(s.shake||0,e.boss?.25:.09);Sound.play('kill')}
  if([10,25,50,100].includes(s.combo))showNotice(s.combo+' 연속 격파!');
}
function updateFeedback(s,dt){
  s.depthClock=Math.max(0,(s.depthClock||0)-dt);s.impactCooldown=Math.max(0,(s.impactCooldown||0)-dt);
  s.comboTimer=Math.max(0,s.comboTimer-dt);s.swing=Math.max(0,(s.swing||0)-dt);
  compact(s.particles,p=>{p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-5*dt);p.vy+=85*dt;return p.t>0});
  compact(s.corpses,d=>{d.t-=dt;d.x+=Math.cos(d.a)*42*dt;d.y+=Math.sin(d.a)*28*dt;return d.t>0});
  compact(s.impacts,h=>{h.t-=dt;return h.t>0});
}
function drawCorpses(s){for(const d of s.corpses){const age=1-d.t/d.max;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.turn*Math.min(1.5,age*3.6));ctx.scale(1,1-age*.3);ctx.globalAlpha=Math.min(1,d.t/.28);WuxiaSprites.drawEnemy(ctx,{x:0,y:0,f:d.f,role:d.role,look:d.look||0,boss:d.boss,hit:d.t>.57?1:0},ambient);ctx.restore()}}
function drawImpacts(s){
  for(const p of s.particles){ctx.globalAlpha=p.t/p.max;rect(p.x,p.y,p.size,p.size,p.color)}ctx.globalAlpha=1;
  for(const h of s.impacts){
    ctx.save();ctx.translate(h.x,h.y);ctx.rotate(h.a);const k=h.t/h.max;ctx.globalAlpha=k;
    ctx.strokeStyle=h.kind==='lightning'?'#d8ecff':h.kind==='ice'?'#a8f0ff':h.kind==='stomp'?'#ffd4a8':'#ffedb1';
    ctx.lineWidth=h.large?5:3;ctx.beginPath();
    if(h.kind==='stomp'){ctx.arc(0,0,16*(1.3-k*.5),0,7)}
    else if(h.kind==='knife'){ctx.moveTo(-18,0);ctx.lineTo(18,0)}
    else{ctx.moveTo(-15,-11);ctx.lineTo(15,11);ctx.moveTo(-9,13);ctx.lineTo(9,-13)}
    ctx.stroke();ctx.restore();
  }
}
function drawEnemy(e){
  if(typeof WuxiaSprites!=='undefined'){WuxiaSprites.drawEnemy(ctx,e,ambient);return}
  ctx.save();ctx.translate(e.x,e.y);if(e.hit>0)ctx.scale(1.14,.9);sprite(0,0,e.f,false,e.boss,e.hit>0);ctx.restore();
}
function updateHUD(s,dt){
  s.hudClock=(s.hudClock||0)-dt;if(s.hudClock>0)return;s.hudClock=.08;SectSystem.hud(s);const p=s.p;
  $('#hpvalue').textContent=Math.ceil(Math.max(0,p.hp))+' / '+p.max;$('#hud').classList.toggle('critical',p.hp/p.max<.25);bossHUD();
  $('#hp').style.width=Math.max(0,p.hp/p.max*100)+'%';$('#xp').style.width=Math.min(100,s.xp/s.need*100)+'%';$('#clock').textContent=format(s.time);$('#kills').textContent=s.kills.toLocaleString();$('#level').textContent='경지 '+s.level;$('#regionLabel').textContent=stages[stageId]?.name||'';
  const curWave=Math.min(5,(s.wave||0)+1);
  $('#waveLabel').textContent='포위망 '+curWave+' / 5';
  const cap=typeof battle==='function'?battle().cap:420;
  const modeName=typeof battle==='function'?battle().name:'혈전';
  $('#enemyCount').textContent=s.siegeWarning>0?'포위 증원 접근 · 적 '+s.enemies.length:'적 무리 '+s.enemies.length+' / '+cap;
  const pr=typeof WuxiaUI!=='undefined'?WuxiaUI.pressureState(s,cap,modeName):{pct:Math.min(100,Math.round(s.enemies.length/cap*100)),label:modeName,danger:false};
  $('#pressureFill').style.width=pr.pct+'%';
  $('#pressureValue').textContent=pr.label;
  $('#pressure').classList.toggle('danger',!!pr.danger);
  $('#combo').textContent=s.comboTimer>0&&s.combo>=2?s.combo+' 연참!':'';
  $('.movehint')?.classList.toggle('active',typeof pointer!=='undefined'&&!!pointer);
  const cdMap=[[0,'sword',.52],[1,'knife',Math.max(.2,.54-s.skills[1]*.05)],[3,'stomp',s.thunder?1.15:1.75],[7,'lightning',1.55],[8,'fire',1.1],[9,'ice',1.6],[10,'flail',1.3],[11,'drain',1.25]];
  for(const [i,key,period] of cdMap)if(s.skills[i]){const el=$('#skill'+i);if(el)el.style.setProperty('--ready',Math.max(0,1-(s.cooldowns?.[key]||0)/period)*100+'%')}$('#skill3')?.classList.toggle('thunder',!!s.thunder);
  $('#dash').classList.toggle('cooling',s.dash>0);$('#dash').style.setProperty('--charge',Math.max(0,1-s.dash/2.8)*360+'deg');$('#dashLabel').textContent=s.dash>0?s.dash.toFixed(1)+'초':'경공';$('#dashHint').textContent=s.dash>0?'운기 준비':'회피 · SPACE';
}

function drawHeroFocus(s){if(s.inv>0&&Math.floor(s.inv*20)%2)return;ctx.save();ctx.strokeStyle='#143b2ee0';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(s.p.x,s.p.y+13,19,8,0,0,7);ctx.stroke();ctx.strokeStyle='#f4e5ac';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(s.p.x,s.p.y+13,19,8,0,0,7);ctx.stroke();ctx.restore()}

function renderOrder(s){if(!s.renderEnemies||s.depthClock<=0){s.renderEnemies=s.enemies.filter(e=>!e.dead).sort((a,b)=>a.y-b.y);s.depthClock=.08}return s.renderEnemies}
