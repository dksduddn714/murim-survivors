'use strict';
function summonBoss(final){
 spawn(true);const e=state.enemies.at(-1);e.final=final;e.hp=e.max=(final?5200:1800)*stages[stageId].difficulty*(battleMode==='hell'?1.6:1.25);e.name=(final?['청룡검존','추혼귀왕','혈월교주']:['청운당주','흑풍채주','혈의호법'])[e.f];e.phase=1;e.blast=0;e.patternCooldown=3;Object.assign(e,keepInArena({x:state.p.x+Math.min(W/2-60,260),y:state.p.y-Math.min(H/2-90,140)},45));showNotice((final?'최종 결전 · ':'중간 관문 · ')+e.name+' 등장');Sound.play('boss');
}
function bossPattern(e,s){
 const phase=e.phase||1,damage=e.final?22:15;e.patternLock=1.25;e.patternAge=0;
 if(e.f===0){e.patternName='십자검진';for(let j=0;j<phase;j++)addHazard(s,{type:'cross',x:s.p.x+j*65,y:s.p.y-j*55,r:180,width:28,delay:.95+j*.35,life:.35,damage});}
 else if(e.f===1){e.patternName='배후 추혼';const v=s.facing||{x:1,y:0},back=keepInArena({x:s.p.x-v.x*115,y:s.p.y-v.y*115},25),end=keepInArena({x:s.p.x+v.x*105,y:s.p.y+v.y*105},25);e.ambush={x:back.x,y:back.y,tx:end.x,ty:end.y};e.x=back.x;e.y=back.y;addHazard(s,{type:'ambush',...e.ambush,width:26,delay:.9,life:.25,damage});}
 else{e.patternName='흑염낙성';const count=phase===2?5:3;for(let j=0;j<count;j++){const a=j*Math.PI*2/count;addHazard(s,{type:'meteor',x:s.p.x+(j?Math.cos(a)*90:0),y:s.p.y+(j?Math.sin(a)*90:0),r:43,delay:1+j*.18,life:1.7,damage});}}
 showNotice(e.name+' · '+e.patternName+' · 금빛 예고를 피하세요');
}
function updateBoss(e,s,dt){
 if(e.phase===1&&e.hp<e.max*.5){e.phase=2;e.speed*=1.2;showNotice(e.name+' · 광폭화!')}
 if(e.patternLock>0){e.patternLock=Math.max(0,e.patternLock-dt);e.patternAge+=dt;if(e.ambush&&e.patternAge>=.9){const u=Math.min(1,(e.patternAge-.9)/.25);e.x=e.ambush.x+(e.ambush.tx-e.ambush.x)*u;e.y=e.ambush.y+(e.ambush.ty-e.ambush.y)*u}return}
 e.patternCooldown=(e.patternCooldown??3)-dt;if(e.patternCooldown<=0){e.patternCooldown=e.phase===2?4.4:6;bossPattern(e,s)}
}
function bossHUD(){const boss=state?.enemies.find(e=>e.boss&&!e.dead),el=$('#bossbar');el.hidden=!boss;if(!boss)return;$('#bossName').textContent=boss.name+' · '+(boss.guardPulse>0?'기맥 방어':boss.patternLock>0?boss.patternName:boss.phase===2?'광폭화':'표적 추적');$('#bossHP').style.width=Math.max(0,boss.hp/boss.max*100)+'%'}
