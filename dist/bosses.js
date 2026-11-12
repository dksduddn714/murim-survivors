'use strict';
function summonBoss(final){
  spawn(true);const e=state.enemies.at(-1);e.final=final;e.hp=e.max=(final?5200:1800)*stages[stageId].difficulty*(battleMode==='hell'?1.6:1.25);e.name=(final?['청룡검존','추혼귀왕','혈월교주']:['청운당주','흑풍채주','혈의호법'])[e.f];e.phase=1;e.blast=0;e.blastCooldown=3;e.x=state.p.x+Math.min(W/2-60,260);e.y=state.p.y-Math.min(H/2-90,140);showNotice((final?'최종 결전 · ':'중간 관문 · ')+e.name+' 등장');if(typeof Sound!=='undefined')Sound.play('boss')
}
function updateBoss(e,s,dt){
  if(e.phase===1&&e.hp<e.max*.5){e.phase=2;e.speed*=1.2;showNotice(e.name+' · 광폭화!')}
  e.blastCooldown-=dt;
  if(e.blast>0){e.blast-=dt;if(e.blast<=0&&s.hostile.length<180){const count=e.phase===2?16:10;for(let i=0;i<count;i++){let a=i*Math.PI*2/count;s.hostile.push({x:e.x,y:e.y,vx:Math.cos(a)*105,vy:Math.sin(a)*105,t:3.6,f:e.f})}}e.blastCooldown=e.phase===2?3.5:5}
  else if(e.blastCooldown<=0){e.blast=1.05}
}
function bossHUD(){
  const boss=state?.enemies.find(e=>e.boss&&!e.dead),el=$('#bossbar');el.hidden=!boss;if(!boss)return;$('#bossName').textContent=boss.name+' · '+(boss.guardPulse>0?'기맥 방어':boss.phase===2?'광폭화':'제1식');$('#bossHP').style.width=Math.max(0,boss.hp/boss.max*100)+'%';
}
