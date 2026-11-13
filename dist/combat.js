'use strict';
// A weapon's reach, recovery and target budget are intentional weaknesses.
function canUseSkill(s,i){const start=WuxiaUI.SUB_SECTS[selected][subSect].startSkill;return (s.skills[i]||0)>0&&(i!==start||s.skills[i]>=2)}
function primaryStats(s){
 const id=selected*4+subSect,heavy=[0,3,7].includes(id),ranged=[5,9,10,11].includes(id),swift=[2,6].includes(id),g=s.weaponGrowth||[0,0,0];
 return {id,heavy,ranged,swift,reach:(heavy?84:swift?66:75)+g[1]*11,damage:(heavy?28:swift?18:23)+s.level*1.15+g[0]*7,period:Math.max(.34,(heavy?.92:swift?.56:.72)-g[2]*.05),targets:1+Math.floor(g[1]/2),arc:heavy?1.05:.78};
}
function beginAttack(s,angle){const w=primaryStats(s);s.attack={age:0,duration:Math.min(.46,w.period*.7),phase:1,angle,face:Math.cos(angle)<0?-1:1,weapon:w};}
function weaponGrowthUpgrade(){
 const s=state,g=s.weaponGrowth??=[0,0,0],labels=['날 세우기','검로 확장','연격 수련'],details=['기본 타격 +7 · 강한 한 방',primaryStats(s).ranged?'주력 탄 크기 +8% · 3회 수련 시 명중 +1':'사거리 +11 · 2회마다 타격 대상 +1','기본 공격 간격 −0.05초'];
 mode='upgrade';pointer=null;keys={};$('#modal').hidden=false;$('#modalEyebrow').textContent='주력 무기 수련 · 경지 '+s.level;$('#modalTitle').textContent='싸우는 방식을 단련하세요';$('#again').hidden=true;$('#retry').hidden=true;$('#choices').innerHTML='';
 for(let i=0;i<3;i++){if(g[i]>=5)continue;const b=document.createElement('button');b.innerHTML='<span class="wx-sect-badge sig">주력 무기</span><strong>'+labels[i]+' <small>'+g[i]+' → '+(g[i]+1)+'</small></strong><small>'+details[i]+'</small>';b.onclick=()=>{if(mode!=='upgrade')return;g[i]++;(s.cooldowns??={}).innate=0;$('#modal').hidden=true;mode='play';$('#resume').onclick=pause;$('#resume').textContent='계속하기';Sound.play('level');showNotice(labels[i]+' · 다음 공격부터 적용')};$('#choices').append(b)}
 $('#resume').hidden=false;$('#resume').textContent='문파 비급 배우기';$('#resume').onclick=()=>{upgrade(true);$('#resume').textContent='계속하기';$('#resume').onclick=pause};
}
function drawWeaponArcs(s){
  for(const h of s.weaponArcs||[]){
    const k=h.t/h.max,ease=1-Math.pow(1-k,2),a=h.a,spread=h.arc;
    ctx.save();ctx.translate(h.x,h.y-10);ctx.rotate(a);ctx.lineCap='round';
    ctx.globalAlpha=ease*.85;ctx.strokeStyle='#191d28';ctx.lineWidth=9*ease+1.5;
    ctx.beginPath();ctx.arc(0,0,h.r,-spread,spread);ctx.stroke();
    ctx.globalAlpha=ease;ctx.strokeStyle=h.color;ctx.lineWidth=5.5*ease+1;
    ctx.beginPath();ctx.arc(0,0,h.r,-spread*.92,spread);ctx.stroke();
    ctx.strokeStyle='#fff7df';ctx.lineWidth=2.2*ease;
    ctx.beginPath();ctx.arc(0,0,h.r-2,-spread*.55,spread*.82);ctx.stroke();
    ctx.restore();
  }
}

function updateAttackMotion(s,dt){
 if(s.attack){s.attack.age+=dt;
  if(s.attack.age>=.12&&!s.attack.contact){s.attack.contact=true;const a=s.attack.angle;
   const w=s.attack.weapon||primaryStats(s);
   if(!w.ranged){
    (s.weaponArcs??=[]).push({x:s.p.x,y:s.p.y,a,r:w.reach,arc:w.arc,t:.18,max:.18,color:factions[selected].color});
    const victims=queryGridRadius(s,s.p.x,s.p.y,w.reach).filter(e=>Math.abs(Math.atan2(Math.sin(Math.atan2(e.y-s.p.y,e.x-s.p.x)-a),Math.cos(Math.atan2(e.y-s.p.y,e.x-s.p.x)-a)))<w.arc).sort((e,o)=>(e.x-s.p.x)**2+(e.y-s.p.y)**2-((o.x-s.p.x)**2+(o.y-s.p.y)**2)).slice(0,w.targets);
    strikeProps(s,a,w.reach,w.damage);
    for(const e of victims)damage(e,w.damage,a,w.heavy?'stomp':'sword');
    Sound.play(w.heavy?'heavy':'slash');if(victims.length){s.heroKick=.11;s.impactBeat=Math.max(s.impactBeat||0,w.heavy?.035:.018)}
   }
  }
 const t=s.attack.age;s.attack.phase=t<.055?1:t<.12?2:t<.2?3:t<.3?4:t<.42?5:0;if(t>=s.attack.duration)s.attack=null}
 if(s.pendingShots){for(const b of s.pendingShots){b.delay-=dt;if(b.delay<=0){b.x=s.p.x;b.y=s.p.y-7;delete b.delay;s.shots.push(b);Sound.play('slash')}}compact(s.pendingShots,b=>b.delay>0)}
}
function shot(a,spd,dmg,type,scale=1,style='default',homing=false,lv=1){
 if(state.shots.length+(state.pendingShots?.length||0)>=220)return null;
 const b={...projectilePolicy(type,style,scale,lv),x:state.p.x,y:state.p.y-7,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,t:scale>1.2?1.45:1.18,damage:dmg,type,scale:scale*.76,style,homing,hit:new Set()};
 if(state._windup){const g=state.weaponGrowth||[0,0,0];if(primaryStats(state).ranged){b.scale*=1+g[1]*.08;if(b.blast)b.blast*=1+g[1]*.08;if(g[1]>=3)b.remainingHits=(b.remainingHits||1)+1}b.delay=.12;(state.pendingShots??=[]).push(b)}else state.shots.push(b);return b;
}
function runAttacks(s,dt){
  updateAttackMotion(s,dt);
  const p=s.p;
  const f=typeof selected!=='undefined'?selected:0;
  const sub=typeof subSect!=='undefined'?subSect:0;
  s.ring+=dt;
  s.cooldowns??={sword:0,knife:0,stomp:0,poison:0,lightning:0,fire:0,ice:0,flail:0,drain:0,guard:0,step:0,orb:0,innate:0};
  for(const k of Object.keys(s.cooldowns))s.cooldowns[k]=Math.max(0,s.cooldowns[k]-dt);
  let target=null,best=540*540;
  const nearPool=s.grid?queryGridRadius(s,p.x,p.y,540):s.enemies;
  for(let i=0;i<nearPool.length;i++){const e=nearPool[i];if(e.dead)continue;const d2=(e.x-p.x)**2+(e.y-p.y)**2;if(d2<best){best=d2;target=e}}
  best=Math.sqrt(best);
  const angle=target?Math.atan2(target.y-p.y,target.x-p.x):(s.facing?Math.atan2(s.facing.y,s.facing.x):0);

  // 0. 12문파 기본 공격 (근접 문파는 근접 베기 중심 + 단발 잔상, 원거리 문파는 단일 타격 기본탄)
  if(target&&s.skills.some(Boolean)&&s.cooldowns.innate<=0){
    const w=primaryStats(s);s.cooldowns.innate=w.period;beginAttack(s,angle);s._windup=true;
    const baseDmg=w.ranged?w.damage*.85:w.damage*.45;
    if(w.ranged||(best>w.reach&&best<w.reach*2.1)){
    if(f===0){
      const st=sub===0?'arhat':sub===1?'taiji':sub===2?'plum':'dragon_wave';
      const tp=sub===2?'knife':sub===0?'fire':'sword';
      shot(angle,410,baseDmg,tp,.95,st,false,0);
    }else if(f===1){
      const st=sub===0?'blood_blade':sub===1?'venom_wave':sub===2?'shadow_dagger':'cleaver_wave';
      const tp=sub===1?'fire':sub===2?'knife':'sword';
      shot(angle,420,baseDmg,tp,.95,st,false,0);
    }else{
      const st=sub===0?'demonic_slash':sub===1?'blood_spear':sub===2?'wraith':'black_dragon';
      const tp=sub===2?'knife':sub===3?'fire':'sword';
      shot(angle,425,baseDmg,tp,1.0,st,sub===2,0);
    }
    }
  }

  s._windup=false;

  // Slot 0: 정파[태극검법] / 사파[혈도참] / 마교[천마검법] (원거리 관통 검기)
  if(target&&(canUseSkill(s,0)||s.fusions?.[0])&&s.cooldowns.sword<=0){
    const lv=s.skills[0]||1,fused=!!s.fusions?.[0],evo=s.evolved||fused;
    s.cooldowns.sword=fused?.28:evo?.34:Math.max(.36,.68-lv*.06);
    const n=fused?6:evo?4:1+Math.floor(lv/2),dmg=(22+lv*9)*(fused?1.6:evo?1.35:1);
    const style=f===0?'taiji':f===1?'blood_blade':'demonic_slash';
    const col=f===0?'#38bdf8':f===1?'#f43f5e':'#f59e0b';
    for(let j=0;j<n;j++){
      const a=fused?(s.ring*2.8+j*Math.PI*2/n):angle+(j-(n-1)/2)*.18;
      shot(a,435+lv*18,dmg,'sword',fused?1.5:evo?1.3:(1+lv*.06),style,f===0&&lv>=3,lv);
    }
    s.swing=.22;Sound.play('slash');
    VFX.cast('slash',p.x,p.y,{a:angle,color:col,evolved:evo,lv,r:56+lv*7+(fused?28:0)});
  }

  // Slot 1: 정파[매화검법] / 사파[암영비도] / 마교[귀혼공 유도원혼탄]
  if(target&&(canUseSkill(s,1)||s.fusions?.[1])&&s.cooldowns.knife<=0){
    const lv=s.skills[1]||1,fused=!!s.fusions?.[1],evo=s.rain||fused;
    s.cooldowns.knife=fused?.30:evo?.36:Math.max(.35,.66-lv*.05);
    const count=fused?6:evo?5:1+Math.floor((lv-1)*.6),dmg=(17+lv*7)*(fused?1.5:evo?1.25:1);
    const style=f===0?'plum_dagger':f===1?'shadow_dagger':'wraith';
    const col=f===0?'#fb7185':f===1?'#a855f7':'#c084fc';
    for(let j=0;j<count;j++){
      const a=evo?(s.ring*2.4+j*Math.PI*2/count):angle+(j-(count-1)/2)*.13;
      shot(a,485+lv*16,dmg,'knife',fused?1.3:evo?1.15:(1+lv*.05),style,f===2||(f===1&&lv>=3),lv);
    }
    VFX.cast('throw',p.x,p.y,{a:angle,color:col,rain:evo,lv});
  }

  // Slot 2: 정파[양의검법] / 사파[귀영분신] / 마교[만귀소환술] — 궤도 회전 + 원거리 사격!
  if(target&&(canUseSkill(s,2)||s.fusions?.[0])&&s.cooldowns.orb<=0){
    const lv=s.skills[2]||1,fused=!!s.fusions?.[0];
    s.cooldowns.orb=fused?.55:Math.max(.65,1.25-lv*.1);
    const dmg=(18+lv*8)*(fused?1.5:1);
    if(f===0){
      shot(angle+.08,460,dmg,'sword',1.0,'taiji',true,lv);
      if(lv>=2||fused)shot(angle-.08,460,dmg,'sword',1.0,'taiji',true,lv);
    }else if(f===1){
      VFX.cast('shadow_clone',target.x,target.y,{color:'#c77dff'});
      for(const e of queryGridRadius(s,target.x,target.y,88)){
        e.bleed=(e.bleed||0)+1;
        damage(e,dmg*1.25,Math.atan2(e.y-p.y,e.x-p.x),'knife');
      }
    }else{
      shot(angle,480,dmg*1.15,'knife',1.05,'wraith',true,lv);
      VFX.cast('chain',p.x,p.y,{tx:target.x,ty:target.y,color:'#e879f9'});
    }
  }

  // Slot 3: 정파[대력금강장 원거리 불장] / 사파[혈기폭발 원거리 혈옥] / 마교[천마신공 원거리 천마운석]
  if((canUseSkill(s,3)||s.fusions?.[2])&&s.cooldowns.stomp<=0){
    const lv=s.skills[3]||1,fused=!!s.fusions?.[2],evo=s.thunder||fused;
    s.cooldowns.stomp=fused?.82:evo?.98:Math.max(.95,1.35-lv*.07);
    const r=92+lv*16+(fused?45:evo?25:0),dmg=(26+lv*12)*(fused?1.65:evo?1.35:1);
    const col=f===0?'#fbbf24':f===1?'#f43f5e':'#f59e0b';
    const hanja=f===0?'佛':f===1?'血':'天';
    const tx=target?target.x:p.x,ty=target?target.y:p.y;

    VFX.cast(f===2?'meteor':f===1?'blood_burst':'stomp',tx,ty,{r,color:col,thunder:evo,lv,hanja});

    for(const e of queryGridRadius(s,tx,ty,r)){{
        if(f===0&&!e.boss)e.stun=.32;
        if(f===1)e.bleed=(e.bleed||0)+2;
        if(f===2)e.blackFlame=1.2;
        damage(e,dmg,Math.atan2(e.y-p.y,e.x-p.x),'stomp');
      }
    }
  }

  // Slot 4: 정파[금강불괴 만자법륜] / 사파[혈신강기 혈기환영참] / 마교[혈마신공 원거리 혈창사출]
  if(target&&(canUseSkill(s,4)||s.fusions?.[4])&&s.cooldowns.guard<=0){
    const lv=s.skills[4]||1,fused=!!s.fusions?.[4];
    s.cooldowns.guard=fused?.75:Math.max(.85,1.45-lv*.1);
    const count=fused?6:1+Math.floor(lv/2),dmg=(18+lv*8)*(fused?1.5:1);
    const st=f===0?'dharma_wheel':f===1?'blood_blade':'blood_spear';
    for(let j=0;j<count;j++){
      const a=angle+(j-(count-1)/2)*.24;
      shot(a,430+lv*15,dmg,'sword',1.2,st,f===2,lv);
    }
    if(f===2)p.hp=Math.min(p.max,p.hp+1.2);
  }

  // Slot 5: 정파[무당제운종 어검] / 사파[귀영순보 잔영수리검] / 마교[천마군림보 원거리 패왕낙뢰]
  if(target&&(canUseSkill(s,5)||s.fusions?.[5])&&s.cooldowns.step<=0){
    const lv=s.skills[5]||1,fused=!!s.fusions?.[5];
    s.cooldowns.step=fused?.70:Math.max(.80,1.35-lv*.1);
    const dmg=(19+lv*8)*(fused?1.5:1);
    if(f===2){
      VFX.cast('lightning',target.x,target.y,{color:'#fbbf24',sx:p.x,sy:p.y});
      for(const e of queryGridRadius(s,target.x,target.y,85)){
        e.blackFlame=1.0;
        damage(e,dmg*1.2,Math.atan2(e.y-p.y,e.x-p.x),'lightning');
      }
    }else{
      const st=f===0?'taiji':'shadow_dagger';
      shot(angle,480,dmg,'knife',1.0,st,true,lv);
      if(lv>=2||fused)shot(angle+Math.PI,440,dmg*.85,'knife',.95,st,true,lv);
    }
  }

  // Slot 6: 정파[자하신공 원거리 자하검풍] / 사파[만독연무 원거리 독무탄] / 마교[흑염마공 원거리 흑염화구]
  if(canUseSkill(s,6)||s.fusions?.[1]){
    const lv=s.skills[6]||1,fused=!!s.fusions?.[1];
    const r=82+lv*15+(fused?32:0);
    const col=f===0?'#c084fc':f===1?'#10b981':'#9333ea';
    const tx=target?target.x:p.x,ty=target?target.y:p.y;
    if(s.cooldowns.poison<=0){
      s.cooldowns.poison=fused?.5:.65;
      VFX.cast('poison',tx,ty,{r:r*.85,color:col,lv});
    }
    s.poisonTick=(s.poisonTick||0)+dt;
    if(!s.poisonStarted||s.poisonTick>=.12){const elapsed=s.poisonTick;s.poisonTick=0;s.poisonStarted=true;
    for(const e of s.enemies)if(!e.dead&&(Math.hypot(e.x-p.x,e.y-p.y)<r||Math.hypot(e.x-tx,e.y-ty)<r*.9)){
      e.poisoned=.45;
      if(f===2)e.blackFlame=.95;
      damage(e,elapsed*(9+lv*7.5)*(fused?1.55:1),null,'poison');
    }
    }
  }

  // Slot 7: 정파[항룡십팔장 원거리 신룡파] / 사파[부골독폭 원거리 연쇄독뢰] / 마교[혈폭술 원거리 연쇄혈폭]
  if(target&&(canUseSkill(s,7)||s.fusions?.[2])&&s.cooldowns.lightning<=0){
    const lv=s.skills[7]||1,fused=!!s.fusions?.[2];
    s.cooldowns.lightning=fused?.88:Math.max(.92,1.38-lv*.07);
    const live=queryGridRadius(s,p.x,p.y,520).sort((a,b)=>(a.x-p.x)**2+(a.y-p.y)**2-((b.x-p.x)**2+(b.y-p.y)**2));
    const targets=live.slice(0,lv+(fused?3:0));
    const col=f===0?'#fbbf24':f===1?'#10b981':'#e11d48';
    for(const e of targets){
      const dmg=(24+lv*13)*(fused?1.45:1);
      if(f===2){p.hp=Math.min(p.max,p.hp+.2);e.bleed=(e.bleed||0)+2}
      if(f===1)e.poisoned=.9;
      damage(e,dmg,Math.atan2(e.y-p.y,e.x-p.x),f===0?'stomp':'lightning');
      VFX.cast(f===0?'dragon_strike':f===2?'blood_burst':'lightning',e.x,e.y,{color:col,sx:p.x,sy:p.y,r:68});
      if(lv>=2||fused||f===1||f===2){
        const arcTarget=live.find(o=>o!==e&&!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<135);
        if(arcTarget){
          if(f===1)arcTarget.poisoned=.8;
          if(f===2)arcTarget.bleed=(arcTarget.bleed||0)+1;
          damage(arcTarget,dmg*.6,null,'lightning');
          VFX.cast('chain',e.x,e.y,{tx:arcTarget.x,ty:arcTarget.y,color:col});
        }
      }
    }
  }

  // Slot 8: 정파[나한권 원거리 권풍연사] / 사파[오독검기 원거리 오독비검] / 마교[흑염폭룡 원거리 흑염용파]
  if(target&&(canUseSkill(s,8)||s.fusions?.[3])&&s.cooldowns.fire<=0){
    const lv=s.skills[8]||1,fused=!!s.fusions?.[3];
    s.cooldowns.fire=fused?.48:Math.max(.52,1.05-lv*.09);
    const count=fused?5:1+Math.floor(lv/2),dmg=(20+lv*10)*(fused?1.55:1);
    const style=f===0?'arhat':f===1?'venom_wave':'black_dragon';
    for(let j=0;j<count;j++){
      const a=fused?(s.ring*2.4+j*Math.PI*2/count):angle+(j-(count-1)/2)*.18;
      shot(a,420+lv*18,dmg,'fire',fused?1.45:(1.1+lv*.08),style,f===2&&lv>=3,lv);
    }
    VFX.cast('slash',p.x,p.y,{a:angle,color:f===0?'#fbbf24':f===1?'#10b981':'#9333ea',r:58+lv*6,lv});
  }

  // Slot 9: 정파[항마곤법 원거리 곤격] / 사파[만독고충술 원거리 고충떼] / 마교[귀영보 원거리 환술공포진]
  if((canUseSkill(s,9)||s.fusions?.[3])&&s.cooldowns.ice<=0){
    const lv=s.skills[9]||1,fused=!!s.fusions?.[3];
    s.cooldowns.ice=fused?.88:Math.max(.92,1.52-lv*.1);
    const r=94+lv*15+(fused?36:0),dmg=(18+lv*9)*(fused?1.55:1);
    const col=f===0?'#fbbf24':f===1?'#34d399':'#c084fc';
    const hanja=f===0?'棍':f===1?'蠱':'幻';
    const tx=target?target.x:p.x,ty=target?target.y:p.y;
    VFX.cast('ice',tx,ty,{r,color:col,evolved:fused,lv,hanja});
    for(const e of queryGridRadius(s,tx,ty,r)){{
        e.chilled=1.6;
        if(f===0&&!e.boss)e.stun=.28;
        if(f===1)e.poisoned=.95;
        if(f===2&&!e.boss)e.feared=.85;
        damage(e,dmg,Math.atan2(e.y-p.y,e.x-p.x),'ice');
      }
    }
  }

  // Slot 10: 정파[타구봉법 원거리 취옥봉기] / 사파[녹림참마도 원거리 대도열파] / 마교[마염검법 원거리 마염기둥]
  if((canUseSkill(s,10)||s.fusions?.[4])&&s.cooldowns.flail<=0){
    const lv=s.skills[10]||1,fused=!!s.fusions?.[4];
    s.cooldowns.flail=fused?.78:Math.max(.75,1.28-lv*.09);
    const r=105+lv*16+(fused?40:0),dmg=(25+lv*13)*(fused?1.65:1);
    const col=f===0?'#34d399':f===1?'#f59e0b':'#a855f7';
    const tx=target?target.x:p.x,ty=target?target.y:p.y;
    VFX.cast(fused?'buddha':'flail',tx,ty,{a:angle,r,color:col,evolved:fused,lv,hanja:f===0?'棒':f===1?'斬':'炎'});
    shot(angle,450,dmg*.85,'sword',1.15,f===0?'emerald_staff':f===1?'cleaver_wave':'demonic_slash',false,lv);
    if(fused)p.hp=Math.min(p.max,p.hp+3);
    for(const e of queryGridRadius(s,tx,ty,r)){{
        if(f===1)e.bleed=(e.bleed||0)+2;
        if(f===2)e.blackFlame=1.3;
        damage(e,dmg,Math.atan2(e.y-p.y,e.x-p.x),'stomp');
      }
    }
  }

  // Slot 11: 정파[태극권 원거리 인력장] / 사파[광풍선풍참 원거리 회오리] / 마교[혈영장 원거리 흡혈마수]
  if(target&&(canUseSkill(s,11)||s.fusions?.[5])&&s.cooldowns.drain<=0){
    const lv=s.skills[11]||1,fused=!!s.fusions?.[5];
    s.cooldowns.drain=fused?.72:Math.max(.72,1.25-lv*.09);
    const r=210+lv*22+(fused?55:0),dmg=(18+lv*9)*(fused?1.6:1);
    const col=f===0?'#38bdf8':f===1?'#f59e0b':'#f43f5e';
    const victims=queryGridRadius(s,p.x,p.y,r).slice(0,lv+(fused?4:0));
    if(victims.length){
      p.hp=Math.min(p.max,p.hp+(fused?2:1));
      for(const e of victims){
        if(fused&&!e.boss){e.x+=(p.x-e.x)*.16;e.y+=(p.y-e.y)*.16}
        if(f===1)VFX.cast('shadow_clone',e.x,e.y,{color:'#fbbf24'});
        if(f===2)e.bleed=(e.bleed||0)+1;
        damage(e,dmg,Math.atan2(p.y-e.y,p.x-e.x),'drain');
        VFX.cast('chain',p.x,p.y,{tx:e.x,ty:e.y,color:col});
      }
    }
  }
}
