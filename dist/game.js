'use strict';
window.MURIM_VERSION='1.11.0';
const survivalTimeLimit=300;
const $=s=>document.querySelector(s),c=$('#world'),ctx=c.getContext('2d');let W,H,dpr;function resize(){dpr=1;W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false}addEventListener('resize',resize);resize();
const factions=[{name:'정파',color:'#38bdf8',enemy:[1,2],weapon:'태극·매화·금강·항룡'},{name:'사파',color:'#f43f5e',enemy:[0,2],weapon:'혈도·독공·귀영·녹림'},{name:'마교',color:'#c084fc',enemy:[0,1],weapon:'천마·혈마·귀마·흑염'}];let selected=0,subSect=0,mode='menu',state=null,keys={},pointer=null,last=0,ambient=0;
let names=['태극검법','매화검법','양의검법','대력금강장','금강불괴신공','무당제운종','자하신공','항룡십팔장','나한권','항마곤법','타구봉법','태극권'];
let desc=[
  '[무당파] 청백색 태극 검기 파동을 원거리 관통 발사 · 5성+양의검법5성 합벽: 【태극양의검진】',
  '[화산파] 매화 꽃잎을 흩날리는 원거리 다연발 쾌검 사출 · 5성+자하신공5성 합벽: 【이십사수매화검법】',
  '[무당파] 음양 쌍검이 회전하며 원거리 적에게 검기 탄환 사출 · 5성+태극검법5성 합벽: 【태극양의검진】',
  '[소림사] 전방 원거리 적 무리에 거대한 황금 불장(佛掌) 낙하 폭격 · 5성+항룡십팔장5성 합벽: 【금강항룡신장】',
  '[소림사] 체력 +25·회복 및 원거리 적을 관통하는 황금 만(卍)자 법륜 사출 · 5성+타구봉법5성 합벽: 【천하무구불괴진】',
  '[무당파] 이속 +15 증가 및 이동 시 후방 적에게 원거리 태극 비검 사출 · 5성+태극권5성 합벽: 【무당진무태극공】',
  '[화산파] 원거리 적 진영에 자색 매화 검기 폭풍을 일으켜 둔화·연타 · 5성+매화검법5성 합벽: 【이십사수매화검법】',
  '[개방] 하늘을 가르는 황금 신룡 장풍이 원거리 적들을 연쇄 폭격 · 5성+대력금강장5성 합벽: 【금강항룡신장】',
  '[소림사] 황금빛 나한 권풍 탄환을 원거리 적에게 고속 연사 · 5성+항마곤법5성 합벽: 【소림항마나한진】',
  '[소림사] 거대한 황금 항마곤 환영이 원거리 적들을 내리쳐 광역 기절 · 5성+나한권5성 합벽: 【소림항마나한진】',
  '[개방] 취옥봉에서 초록빛 선풍 봉기를 원거리 사출해 집단 넉백 · 5성+금강불괴신공5성 합벽: 【천하무구불괴진】',
  '[무당파] 원거리 적들에게 태극 기공포를 발사해 끌어당기며 내력 회복 · 5성+무당제운종5성 합벽: 【무당진무태극공】'
];
function syncFactionCatalog(){
  if(document.body?.dataset)document.body.dataset.theme=String(selected);
  const fSet=typeof WuxiaUI!=='undefined'?WuxiaUI.getFactionSkillSet(selected):null;
  if(fSet){names=fSet.names.slice();desc=fSet.desc.slice()}
}
function renderSubSects(){
  syncFactionCatalog();
  const box=$('#subSects');if(!box||typeof WuxiaUI==='undefined'||!WuxiaUI.SUB_SECTS)return;
  const list=WuxiaUI.SUB_SECTS[selected]||[];
  box.innerHTML=list.map((s,idx)=>{
    const pills=(s.skillsSummary||[]).map(k=>'<span class="subpill">'+k+'</span>').join('');
    return '<button type="button" data-sub="'+idx+'" class="subsect'+(idx===subSect?' selected':'')+'" style="--sub-accent:'+(s.color||'#e9c37d')+'"><div class="subcard-top"><div class="sub-avatar-wrap"><canvas class="sub-avatar" width="56" height="56"></canvas></div><div class="subcard-head"><span class="sub-ranged-badge">문파 고유 절초</span><strong>'+s.name+(Profile.data.seals[selected*4+idx]?'<span class="sect-seal">출도 완수</span>':'')+' <em>'+s.hanja+'</em></strong><small class="subweapon">'+s.weapon+'</small></div><b>'+s.hanja.charAt(0)+'</b></div><span class="subtrait">'+SectSystem.catalog[selected*4+idx].name+' · '+SectSystem.catalog[selected*4+idx].text+'</span><div class="subpills">'+pills+'</div></button>';
  }).join('');
  box.querySelectorAll('[data-sub]').forEach((btn,idx)=>{
    btn.onclick=()=>{
      subSect=+btn.dataset.sub;
      renderSubSects();
    };
    const cv=btn.querySelector('canvas');
    if(cv&&typeof WuxiaSprites!=='undefined'&&cv.getContext){
      const actx=cv.getContext('2d');
      if(actx&&typeof actx.save==='function'){
        WuxiaSprites.drawHero(actx,28,36,selected,.4,.15,idx);
      }
    }
  });
}
syncFactionCatalog();renderSubSects();
function updateProfile(){$('#best').textContent='은전 '+Profile.data.silver+' · 최고 '+Profile.data.best+' 처치 · 출도 '+Profile.data.runs+'회'+(Profile.available?'':' · 이 브라우저에서는 저장할 수 없습니다')}updateProfile();
document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{selected=+b.dataset.f;subSect=0;document.querySelectorAll('[data-f]').forEach(x=>x.classList.toggle('selected',x===b));$('#enemyInfo').textContent='상대 세력 · '+factions[selected].enemy.map(i=>factions[i].name).join(' / ');renderSubSects()});
function start(){
  $('#trade').hidden=true;$('#choices').classList.remove('merchant-choices');VFX.reset();clearTimeout(showNotice.timer);$('#notice').classList.remove('show');
  syncFactionCatalog();
  state={p:{x:0,y:0,hp:110+Profile.data.training.vitality*10,max:110+Profile.data.training.vitality*10},time:0,spawn:0,atk:0,ring:0,stomp:0,kills:0,level:1,xp:0,need:12,enemies:[],shots:[],gems:[],effects:[],skills:[1,0,0,0,0,0,0,0,0,0,0,0],fusions:[false,false,false,false,false,false],seenRoles:{},dash:0,inv:0,boss:false,hostile:[],texts:[],drops:[],evolved:false,wave:0,particles:[],corpses:[],impacts:[],combo:0,comboTimer:0,bestCombo:0};
  if(selected===1)state.skills=[0,1,0,0,0,0,0,0,0,0,0,0];
  if(selected===2)state.skills=[1,0,0,1,0,0,0,0,0,0,0,0];
  const sub=(typeof WuxiaUI!=='undefined'&&WuxiaUI.SUB_SECTS?.[selected]?.[subSect])||null;
  if(sub&&sub.startSkill!=null){state.skills=Array(12).fill(0);state.skills[sub.startSkill]=1}
  if(selected===0){state.p.max+=24+(subSect===0?18:0);state.p.hp=state.p.max}
  state.p.max+=Profile.data.seals.filter(Boolean).length;state.p.hp=state.p.max;state.rerolls=Profile.data.training.destiny;state.skills[sub.startSkill]=Math.min(5,state.skills[sub.startSkill]+Profile.data.training.origin);initJianghu(state);
  last=performance.now();keys={};pointer=null;mode='play';$('#menu').hidden=true;$('#modal').hidden=true;$('#hud').hidden=false;Equipment.paint(state);$('#postTraining').hidden=true;$('#sectLabel').textContent=factions[selected].name+(sub?' · '+sub.name:' · '+factions[selected].weapon);LinkSystem.init(state);syncSkills();for(let i=0;i<22;i++)spawn();updateHUD(state,0)
}
$('#start').onclick=()=>{Sound.unlock();Music.unlock();start();Sound.play('level');showNotice('자동 공격 · 적 곁에서 검격 · SPACE / 경공으로 포위 탈출')};
function syncSkills(){
  while(state.skills.length<12)state.skills.push(0);
  state.fusions??=[false,false,false,false,false,false];
  const beforeEvo=[state.evolved,state.rain,state.thunder];
  const beforeFus=[...state.fusions];
  state.evolved=state.skills[0]>=4&&state.skills[2]>=2;
  state.rain=state.skills[1]>=4&&state.skills[6]>=2;
  state.thunder=state.skills[3]>=4&&state.skills[7]>=2;
  const fFusions=(typeof WuxiaUI!=='undefined'&&WuxiaUI.getFactionFusions(selected))||[];
  const pairs=fFusions.length?fFusions.map(f=>[f.a,f.b,f.name]):[[0,2,'태극양의검진'],[1,6,'이십사수매화검법'],[3,7,'금강항룡신장'],[8,9,'소림항마나한진'],[10,4,'천하무구불괴진'],[11,5,'무당진무태극공']];
  let newFusion=null;
  pairs.forEach(([a,b,fname],idx)=>{
    state.fusions[idx]=(state.skills[a]>=5&&state.skills[b]>=5);
    if(state.fusions[idx]&&!beforeFus[idx])newFusion=fname;
  });
  LinkSystem.sync(state);skillTiles();
  const afterEvo=[state.evolved,state.rain,state.thunder];
  if(newFusion){
    VFX.cast('evolution',state.p.x,state.p.y,{r:205,color:'#ffe596'});
    showNotice('合璧絕學 · 5성 합벽 【'+newFusion+'】 융합 완성!');
  }else if(afterEvo.some((v,i)=>v&&!beforeEvo[i])){
    VFX.cast('evolution',state.p.x,state.p.y,{r:170,color:'#ffdfa0'});
    showNotice('絕學覺醒 · 새로운 절학을 깨우쳤습니다!');
  }
}
function pause(){if(!$('#camp').hidden){$('#campClose').onclick();return}$('#trade').hidden=true;if(mode==='shop'){closeMerchant();return}keys={};pointer=null;if(mode==='play'){mode='pause';$('#again').hidden=true;$('#modal').hidden=false;$('#modalEyebrow').textContent='잠시 운기조식';$('#modalTitle').textContent='강호는 기다려줍니다';$('#choices').innerHTML=typeof WuxiaUI!=='undefined'?WuxiaUI.pauseSummaryHTML(state,names):'';$('#resume').hidden=false;$('#retry').hidden=false}else if(mode==='pause'){last=performance.now();mode='play';$('#modal').hidden=true}}
$('#pause').onclick=pause;$('#resume').onclick=pause;$('#again').onclick=()=>{Sound.unlock();start();$('#retry').hidden=true};$('#retry').onclick=()=>{mode='menu';state=null;$('#minimap').hidden=true;$('#equipmentDock').hidden=true;$('#postTraining').hidden=true;$('#menu').hidden=false;$('#hud').hidden=true;$('#modal').hidden=true;renderSubSects()};
function dash(){if(mode==='play'&&state.dash<=0){Sound.play('dash');state.dash=Math.max(1.8,2.6-Profile.data.training.mobility*.1);state.inv=.48;let v=movement();if(!v.x&&!v.y){v.x=state.facing?.x||1;v.y=state.facing?.y||0}const sx=state.p.x,sy=state.p.y;state.p.x+=v.x*165;state.p.y+=v.y*165;keepInArena(state.p);state.afterimages??=[];for(let i=0;i<3;i++){const u=i/3;state.afterimages.push({x:sx+(state.p.x-sx)*u,y:sy+(state.p.y-sy)*u,f:selected,sub:subSect,face:v.x<0?-1:1,clock:(state.walkTime||0)+i*.08,pose:3,t:.22+i*.05,max:.28})}if(selected===1&&subSect===2)VFX.cast('shadow_clone',state.p.x,state.p.y,{color:'#c77dff'});state.effects.push({x:state.p.x,y:state.p.y,r:48,t:.4,max:.4,color:selected===2?'#c084fc':selected===1?'#f43f5e':'#38bdf8'})}}$('#dash').addEventListener('pointerdown',e=>{e.preventDefault();dash()});
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();if(mode==='upgrade'&&['1','2','3'].includes(e.key)){const btn=$('#choices')?.children[Number(e.key)-1];if(btn?.onclick)btn.onclick();return}if(e.key===' '&&!e.repeat)dash();if(e.key==='Escape')pause()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>{keys={};pointer=null;if(mode==='play')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause()});
c.addEventListener('pointerdown',e=>{if(mode==='play'&&!pointer){pointer={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0};c.setPointerCapture(e.pointerId)}});c.addEventListener('pointermove',e=>{if(pointer&&pointer.id===e.pointerId){pointer.dx=e.clientX-pointer.x;pointer.dy=e.clientY-pointer.y}});function release(){pointer=null}c.addEventListener('pointerup',release);c.addEventListener('pointercancel',release);
function movement(){let x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),y=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);if(pointer){x=Math.abs(pointer.dx)>5?pointer.dx/42:0;y=Math.abs(pointer.dy)>5?pointer.dy/42:0}let l=Math.hypot(x,y);return l>0?{x:x/Math.max(1,l),y:y/Math.max(1,l)}:{x:0,y:0}}
function skillDelta(i,cur,next){
 if(cur===0)return '새 무공 해금 · '+skillDelta(i,1,2).split(' → ')[0]+'부터 시작';
 if(i===0)return '검기 '+(1+Math.floor(cur/2))+' → '+(1+Math.floor(next/2))+'발 · 타격 '+(22+cur*9)+' → '+(22+next*9);
 if(i===1)return '비도 '+(1+Math.floor(Math.max(0,cur-1)*.6))+' → '+(1+Math.floor(Math.max(0,next-1)*.6))+'발 · 타격 '+(17+cur*7)+' → '+(17+next*7);
 if(i===2)return '회전 무기 '+Math.min(6,cur)+' → '+Math.min(6,next)+'개';
 if(i===4)return '최대 체력 +25 · 즉시 회복 +45 · 보조 무기 강화';
 if(i===5)return '이동 속도 +15 · 추격 회피 강화';
 if(i===6)return '영역 반경 '+(82+cur*15)+' → '+(82+next*15)+' · 지속 피해 증가';
 const values={3:[26,12],7:[24,13],8:[20,10],9:[18,9],10:[25,13],11:[18,9]},v=values[i];
 return v?'기본 타격 '+(v[0]+cur*v[1])+' → '+(v[0]+next*v[1])+' · 무공 범위 / 연사 강화':'새로운 전투 방식 해금';
}
function upgrade(forceGeneral=false){$('#trade').hidden=true;
  if(!forceGeneral&&state.level%3===0&&(state.weaponGrowth||[0,0,0]).some(n=>n<5)){weaponGrowthUpgrade();return}
  syncFactionCatalog();
  const fSet=typeof WuxiaUI!=='undefined'?WuxiaUI.getFactionSkillSet(selected):null;
  const sub=(typeof WuxiaUI!=='undefined'&&WuxiaUI.SUB_SECTS?.[selected]?.[subSect])||null;
  const sigSet=new Set(sub?.sigSlots||[]);
  if(SectSystem.complete(state)&&!forceGeneral){masteryUpgrade();return}
  $('#resume').onclick=pause;
  $('#again').hidden=true;Sound.play('level');mode='upgrade';pointer=null;$('#modal').hidden=false;$('#modalEyebrow').textContent='내공 돌파 · 경지 '+state.level;$('#modalTitle').textContent='비급 전수 · 수련할 무공을 선택하세요';$('#resume').hidden=true;$('#retry').hidden=true;
  let pool=names.map((_,i)=>i).filter(i=>(state.skills[i]||0)<5);
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  let options=pool.slice(0,3);const signature=pool.find(i=>sigSet.has(i));
  if(signature!==undefined&&!options.some(i=>sigSet.has(i)))options[options.length-1]=signature;
  if(!options.length){state.p.hp=Math.min(state.p.max,state.p.hp+35);mode='play';$('#modal').hidden=true;showNotice('운기조식 · 체력 +35');return}
  $('#choices').innerHTML='';
  renderReroll(state);
  options.forEach((i,slot)=>{
    let b=document.createElement('button');b.dataset.skill=String(i);
    const cur=state.skills[i]||0,next=cur+1;
    const link=LinkSystem.recipes.find(r=>(r.a===i||r.b===i)&&!state.links.known[LinkSystem.recipes.indexOf(r)]);const linkText=link?'연계 '+link.names[selected]+' · '+names[link.a]+' '+Math.min(3,state.skills[link.a])+'/3 + '+names[link.b]+' '+Math.min(3,state.skills[link.b])+'/3':'';
    const rec=typeof WuxiaUI!=='undefined'?WuxiaUI.recipeStatus(state,i,selected):{text:desc[i],ready:false};
    const icon=typeof WuxiaUI!=='undefined'?WuxiaUI.skillIcon(i,rec.ready||next>=5,selected):'⚔️';
    const pips=typeof WuxiaUI!=='undefined'?WuxiaUI.pips(next,5):'';
    const badge=typeof WuxiaUI!=='undefined'?WuxiaUI.slotBadges[slot]:(slot+1);
    const sectName=(fSet?.sects&&fSet.sects[i])||factions[selected].name;
    const tagName=(fSet?.tags&&fSet.tags[i])||'원거리 비급';
    const isSig=sigSet.has(i);
    if(rec.ready)b.className='evo-ready';
    b.title=rec.text;
    b.innerHTML='<div class="wx-card-head"><div class="wx-icon-box">'+icon+'</div><div class="wx-card-tags"><span class="wx-sect-badge'+(isSig?' sig':'')+'">'+(isSig?'★ ':'')+sectName+'</span><span class="wx-type-badge">'+tagName+'</span></div><span class="wx-slot-badge">'+badge+'</span></div><strong>'+names[i]+' <small>'+(cur===0?'신규 1성':cur+'성 ➔ '+next+'성')+'</small></strong>'+(pips?'<div class="wx-pips">'+pips+'</div>':'')+'<div class="upgrade-delta">'+skillDelta(i,cur,next)+'</div><small>'+desc[i]+'</small><small class="link-recipe">'+linkText+'</small><small class="recipe '+(rec.ready?'ready':'')+'">'+rec.text+'</small>';
    b.onclick=()=>{
      if(mode!=='upgrade')return;
      state.skills[i]=(state.skills[i]||0)+1;$('#reroll').hidden=true;
      if(typeof Sound!=='undefined')Sound.play('level');
      if(i===4){state.p.max+=25;state.p.hp=Math.min(state.p.max,state.p.hp+45)}
      syncSkills();
      $('#modal').hidden=true;mode='play';
    };
    $('#choices').append(b);
  });
}
function end(win){$('#trade').hidden=true;if(mode==='end')return;state.hudClock=0;updateHUD(state,0);Sound.play('end');const reward=state.demo?0:Profile.finish({faction:selected,kills:state.kills,time:Math.floor(state.time),subSect,win});updateProfile();mode='end';$('#modal').hidden=false;$('#modalEyebrow').textContent=win?'강호에 이름을 새기다':'다시 일어설 시간';$('#modalTitle').textContent=state.demo?'무공 연출 체험 종료':win?'포위망 돌파!':'강호는 아직 넓습니다';$('#choices').innerHTML='<div class="resultstats"><div><b>'+state.kills+'</b><small>격파</small></div><div><b>'+format(state.time)+'</b><small>생존 시간</small></div><div><b>'+state.bestCombo+'</b><small>최고 연속 격파</small></div></div><p class="reward">은전 +'+reward+' · '+(state.demo?'체험 기록은 저장되지 않습니다':'모은 은전으로 영구 수련을 이어가세요')+'</p><p id="postBalance" class="gear-note"></p>';$('#again').hidden=false;$('#resume').hidden=true;$('#retry').hidden=false;$('#reroll').hidden=true;paintPostRunTraining()}
function pickEnemyRole(t,boss,elite){
  if(boss)return 'boss';
  const r=Math.random();
  if(t<=15){if(r<.1)return 'archer';if(r<.35)return 'spearman';return 'disciple'}
  if(t>140&&r<.16)return 'sorcerer';
  if(t>105&&r<.30)return 'brute';
  if(t>75&&r<.44)return 'shield';
  if(t>50&&r<.58)return 'assassin';
  if(t>32&&r<.72)return 'archer';
  if(t>15&&r<.86)return 'spearman';
  return elite?'brute':'disciple';
}
const roleMeta={
  disciple:{hp:1,spd:1,label:['화산 검수','사파 혈도낭인','천마 전투대']},
  spearman:{hp:1.25,spd:1.08,label:['무당 도사','녹림 장창병','혈마전 창병']},
  archer:{hp:.92,spd:.96,label:['정파 신궁수','당문 암기수','귀마전 혈침수']},
  assassin:{hp:.9,spd:1.25,label:['매화 검객','귀영 살수','귀마전 야행자객']},
  shield:{hp:2.15,spd:.82,label:['소림 금강승','녹림 중갑병','흑염전 마갑호법']},
  brute:{hp:1.85,spd:.94,label:['개방 타구대','녹림 거한','혈마전 마존전사']},
  sorcerer:{hp:1.15,spd:.92,label:['무당 태극도사','독공 주술사','귀마전 광명좌사']},
  boss:{hp:1,spd:1,label:['정파 무림맹 장로','사파 녹림총채주','마교 광명우사·대장로']}
};
function spawn(boss=false){
  const s=state,p=s.p;const edge=Math.floor(Math.random()*4),margin=24;let x=p.x,y=p.y;
  if(edge<2){x+=(Math.random()-.5)*W;y+=(edge?1:-1)*(H/2+margin)}else{x+=(edge==2?1:-1)*(W/2+margin);y+=(Math.random()-.5)*H}
  const position=keepInArena({x,y},24);x=position.x;y=position.y;
  const f=factions[selected].enemy[Math.random()<.5?0:1],elite=!boss&&s.time>55&&Math.random()<.11;
  const role=pickEnemyRole(s.time,boss,elite),rm=roleMeta[role]||roleMeta.disciple;
  const hp=(boss?820:26+s.time*.33+(s.wave||0)*11)*rm.hp*(elite?2.6:1)*stages[stageId].difficulty*battle().hp;
  const spd=(boss?45:46+Math.random()*15+s.time*.065)*rm.spd*(elite?1.12:1)*battle().speed;
  const name=boss?rm.label[f]:elite?['화산 장문인','독공 장로','마교 호법·마존'][f]:rm.label[f];
  s.enemies.push({x,y,f,role,look:Math.floor(Math.random()*3),guardHits:role==='shield'&&s.time>=75?2:elite&&s.time>=120?1:0,hp,max:hp,speed:spd,boss,elite,hit:0,fire:1.4+Math.random()*1.8,charge:0,runner:role==='assassin'||(!boss&&!elite&&Math.random()<.16),name});
  if(!boss&&role!=='disciple'&&s.seenRoles&&!s.seenRoles[role]){
    s.seenRoles[role]=true;
    showNotice('신규 적 합류 · '+rm.label[f]+' 출현!');
  }
}

function damage(e,n,direction,kind='sword'){
  if(e.dead)return;
  if(kind==='signature')n*=SectSystem.power(state);
  if(e.guardHits>0&&n>=5&&kind!=='poison'){e.guardHits--;n*=.25;VFX.burst(e.x,e.y-20,'#c8d4e4',4,70)}

  const crit=kind!=='poison'&&kind!=='ring'&&kind!=='status'&&Math.random()<Equipment.bonus(state,'crit');if(crit)n*=1.5;
  n*=1+Equipment.bonus(state,'attack');
  n*=(1+Profile.data.training.power*.05)*(selected==2?1.16:1);
  if(e.bleed>0)n*=1+Math.min(.35,e.bleed*.07);
  if(e.boss&&n>0){const window=Math.floor(state.time*2);if(e.damageWindow!==window){e.damageWindow=window;e.damageSpent=0}const allowance=e.max*.12-(e.damageSpent||0);n=Math.min(n,Math.max(0,allowance));if(n<=0){e.guardPulse=.15;return}e.damageSpent=(e.damageSpent||0)+n}
  e.hp-=n;hitFeedback(e,n,direction,kind);
  if(n>=16&&kind!=='poison'&&kind!=='ring'&&state.texts.length<14){const jitter=((state.texts.length%3)-1)*11;state.texts.push({x:e.x+jitter,y:e.y-36-(state.texts.length%2)*6,t:.58,max:.58,n:Math.round(n),crit:crit||n>=55||kind==='signature'})}
  if(e.hp<=0&&!e.dead){
    e.dead=true;deathFeedback(e);SectSystem.killed(state,e);state.kills++;
    const gemVal=e.boss?28:e.siegeLeader?14:e.elite?5:(e.role==='shield'||e.role==='brute'||e.role==='sorcerer')?2:1;
    state.gems.push({x:e.x,y:e.y,value:gemVal});
    dropTreasure(state,e);
    if(e.siegeLeader||Math.random()<0.032)state.drops.push({x:e.x,y:e.y,type:e.siegeLeader?'heal':['heal','qi','magnet'][Math.floor(Math.random()*3)]});
    if(e.final)state.bossDead=true;
    if(selected===2&&subSect===1)state.p.hp=Math.min(state.p.max,state.p.hp+.1);
    if(!state._chainLock){
      state._chainLock=true;
      if((selected===1&&(e.bleed>0||subSect===0))||e.bleed>=2){
        VFX.cast('blood_burst',e.x,e.y,{r:86,color:'#ff2a55'});
        const bDmg=20+(state.skills[1]||1)*7;
        for(const o of queryGridRadius(state,e.x,e.y,86)){o.bleed=(o.bleed||0)+1;damage(o,bDmg,Math.atan2(o.y-e.y,o.x-e.x),'stomp')}
      }
      if(selected===1&&(e.poisoned>0||subSect===1)){
        const pDmg=16+(state.skills[6]||1)*5;
        for(const o of queryGridRadius(state,e.x,e.y,80)){o.poisoned=.85;damage(o,pDmg,null,'poison')}
      }
      if(selected===2&&(e.blackFlame>0||subSect===3)){
        VFX.cast('stomp',e.x,e.y,{r:78,color:'#9d4edd',hanja:'炎'});
        const fDmg=18+(state.skills[8]||1)*6;
        for(const o of queryGridRadius(state,e.x,e.y,78)){o.blackFlame=.9;damage(o,fDmg,Math.atan2(o.y-e.y,o.x-e.x),'fire')}
      }
      state._chainLock=false;
    }
  }
}
function update(dt){let s=state,p=s.p,v=movement();s.moving=!!(v.x||v.y);if(s.moving){s.facing=v;s.walkTime=(s.walkTime||0)+dt;if(v.x)s.face=v.x<0?-1:1}s.time+=dt;let wave=Math.floor(s.time/60);if(wave>s.wave){s.wave=wave;for(let i=0;i<14;i++)if(s.enemies.length<battle().cap)spawn();showNotice(['','추격대와 장창병이 합류합니다','중갑방패병·정예 무인 출현','술사와 역사 포위망이 좁혀집니다','장로 출현 · 제한 시간 안에 처치'][Math.min(4,wave)])}s.shake=Math.max(0,s.shake-dt);s.hitFlash=Math.max(0,s.hitFlash-dt);s.dash-=dt;s.inv-=dt;updateJianghu(s,dt);if(mode!=='play')return;const moveSpd=165+Profile.data.training.mobility*4+Equipment.bonus(s,'speed')+s.skills[5]*15+(s.fusions?.[5]?22:0)+(selected===1?12+(subSect===2?8:0):0);p.x+=v.x*moveSpd*dt;p.y+=v.y*moveSpd*dt;keepInArena(p);s.spawn-=dt;if(s.spawn<=0){for(let i=0;i<(battleMode==='blood'&&s.time<20?3:battle().batch+Math.floor(s.time/36));i++)if(s.enemies.length<battle().cap)spawn();s.spawn=battleMode==='blood'&&s.time<20?.38:Math.max(.11,battle().interval-s.time/1500)}if(s.time>=110&&!s.miniboss){s.miniboss=true;summonBoss(false)}if(s.time>=240&&!s.boss){s.boss=true;summonBoss(true)}if(s.demo&&s.time>=45){end(false);return}if(s.time>=300){end(!s.boss||!!s.bossDead);return}
const camTargetX=p.x+(v.x||0)*18,camTargetY=p.y+(v.y||0)*14,camLerp=1-Math.exp(-16*dt);
s.camX=s.camX===undefined?p.x:s.camX+(camTargetX-s.camX)*camLerp;
s.camY=s.camY===undefined?p.y:s.camY+(camTargetY-s.camY)*camLerp;
buildEnemyGrid(s);
s.impactBeat=Math.max(0,(s.impactBeat||0)-dt);updateSiege(s,dt);updateFeedback(s,dt);VFX.update(s,dt);runAttacks(s,dt);SectSystem.update(s,dt);LinkSystem.update(s,dt);
const ringLv=canUseSkill(s,2)?s.skills[2]:0,fused0=!!s.fusions?.[0],ringCount=fused0?8:Math.min(6,ringLv),ringR=38+ringLv*4+(fused0?12:0),ringSpd=(fused0?3.4:2.3)+ringLv*.22;
const orbit=[];if(ringLv||fused0)for(let j=0;j<ringCount;j++){const a=s.ring*ringSpd+j*Math.PI*2/ringCount;orbit.push({x:p.x+Math.cos(a)*ringR,y:p.y+Math.sin(a)*ringR})}
const armorReduction=(1-Equipment.bonus(s,'armor'))*(s.fusions?.[4]?.75:1)*(selected===0&&subSect===0?.85:1);
for(let e of s.enemies){if(e.dead)continue;updateEnemy(e,s,dt*(s.impactBeat>0?.22:1));
e.hit-=dt;if(Math.hypot(e.x-p.x,e.y-p.y)<(e.boss?17:10)&&s.inv<=0){if(!SectSystem.block(s))p.hp-=Math.max(1,(e.boss?24:9)*armorReduction);s.shake=.18;s.hitFlash=.15;Sound.play('hurt');s.inv=.65;if(p.hp<=0){end(false);return}}if(ringLv||fused0)for(let j=0;j<ringCount;j++){const {x:bx,y:by}=orbit[j];if(Math.hypot(e.x-bx,e.y-by)<16){if(selected===1)e.bleed=(e.bleed||0)+dt*2;if(selected===2&&!e.boss)e.feared=.4;damage(e,dt*(26+ringLv*13)*(fused0?1.45:1),Math.atan2(e.y-p.y,e.x-p.x),'ring')}}}
buildEnemyGrid(s);compact(s.shots,b=>{
  if(b.mode==='return'){b.flight-=dt;if(b.flight<=0&&!b.returning){b.returning=true;b.remainingHits=2;b.hit.clear()}if(b.returning){const a=Math.atan2(p.y-b.y,p.x-b.x),sp=Math.hypot(b.vx,b.vy);b.vx=Math.cos(a)*sp;b.vy=Math.sin(a)*sp;if(Math.hypot(p.x-b.x,p.y-b.y)<18)return false}}
  if(b.homing&&!b.returning){b.seek=(b.seek||0)-dt;if(b.seek<=0||!b.target||b.target.dead){b.target=nearestShotTarget(s,b);b.seek=.12}if(b.target){const sp=Math.hypot(b.vx,b.vy)||440,ta=Math.atan2(b.target.y-b.y,b.target.x-b.x),mix=1-Math.exp(-12*dt);b.vx+=(Math.cos(ta)*sp-b.vx)*mix;b.vy+=(Math.sin(ta)*sp-b.vy)*mix}}
  let oldX=b.x,oldY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.t-=dt;const hitR=(b.scale||1)>.95?16:13;if(projectilePropHit(s,b,oldX,oldY)){return false}
  const hits=shotTargets(s,oldX,oldY,b.x,b.y).filter(e=>!e.dead&&!b.hit.has(e)&&segmentDistance(e.x,e.y,oldX,oldY,b.x,b.y)<(e.boss?20:hitR));
  const dx=b.x-oldX,dy=b.y-oldY;hits.sort((a,c)=>((a.x-oldX)*dx+(a.y-oldY)*dy)-((c.x-oldX)*dx+(c.y-oldY)*dy));
  for(let e of hits){
    if(!e.dead&&!b.hit.has(e)&&segmentDistance(e.x,e.y,oldX,oldY,b.x,b.y)<(e.boss?20:hitR)){
      if(b.type==='ice')e.chilled=1.5;
      if(b.style==='blood_blade'||b.style==='blood_spear')e.bleed=(e.bleed||0)+1;
      if(b.style==='venom_wave')e.poisoned=.9;
      if(b.style==='black_dragon'||b.style==='demonic_slash')e.blackFlame=1.1;
      if(b.style==='wraith'&&!e.boss&&Math.random()<.35)e.feared=.45;
      damage(e,b.damage,Math.atan2(b.vy,b.vx),b.signature?'signature':b.type);b.hit.add(e);projectileImpact(s,b,e);if(b.t<=0||b.mode==='bounce'||b.mode==='return')break;
    }
  }
  return b.t>0;
});
updateWeaponFields(s,dt);
for(let b of s.hostile){let oldX=b.x,oldY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.t-=dt;if(s.inv<=0&&segmentDistance(p.x,p.y,oldX,oldY,b.x,b.y)<10){if(!SectSystem.block(s))p.hp-=Math.max(1,7*armorReduction);s.shake=.18;s.hitFlash=.15;Sound.play('hurt');s.inv=.55;b.t=0;if(p.hp<=0){end(false);return}}}compact(s.hostile,b=>b.t>0);
compact(s.texts,t=>{t.t-=dt;t.y-=dt*25;return t.t>0});
compact(s.drops,d=>{if(Math.hypot(d.x-p.x,d.y-p.y)<26){d.dead=true;if(d.type==='heal'){p.hp=Math.min(p.max,p.hp+32);showNotice('금창약 · 체력 +32')}else if(d.type==='qi'){s.xp+=5+s.level;showNotice('소환단 · 내공 +'+(5+s.level))}else{collectExperience(s);showNotice('흡성부 · 흩어진 내공 회수')}}return !d.dead});
for(const e of s.enemies)keepInArena(e,8);const maxDist=Math.max(W,H)*1.6;compact(s.enemies,e=>!e.dead&&(e.boss||Math.hypot(e.x-p.x,e.y-p.y)<maxDist));compact(s.gems,g=>{let d=Math.hypot(g.x-p.x,g.y-p.y);if(g.magnet||d<105+Profile.data.training.fortune*14+Equipment.bonus(s,'magnet')){const step=g.magnet?Math.min(1,dt*14):dt*8;g.x+=(p.x-g.x)*step;g.y+=(p.y-g.y)*step}if(d<16){s.xp+=g.value;g.dead=true;Sound.play('pickup')}return !g.dead});if(s.gems.length>450){let g=s.gems.shift();let near=s.gems.reduce((a,b)=>Math.hypot(a.x-g.x,a.y-g.y)<Math.hypot(b.x-g.x,b.y-g.y)?a:b);near.value+=g.value}if(s.drops.length>35)s.drops.shift();compact(s.effects,e=>{e.t-=dt;return e.t>0});if(s.xp>=s.need){s.xp-=s.need;s.level++;s.need=Math.floor(12+s.level*7+Math.pow(s.level,1.35)*2);upgrade()}updateHUD(s,dt)}
function format(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')}
function rect(x,y,w,h,col){ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function sprite(x,y,f,hero=false,boss=false,hit=false){
  if(typeof WuxiaSprites!=='undefined'){
    if(hero)WuxiaSprites.drawHero(ctx,x,y,f,ambient,state?.swing||0,subSect,{moving:state?.moving||false,clock:state?.walkTime||0,face:state?.attack?.face||state?.face||1,attackPhase:state?.attack?.phase||0});
    else WuxiaSprites.drawEnemy(ctx,{x,y,f,boss,hit:hit?1:0,role:boss?'boss':'disciple'},ambient);
    return;
  }
  let scale=boss?2.1:1.65;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);rect(-5,-12,10,20,factions[f]?.color||'#6abfc0');ctx.restore();
}
function bamboo(x,y){ctx.drawImage(getPropCanvas('bamboo',stageId),Math.round(x-20),Math.round(y-94))}
function render(){drawMinimap(state);ambient+=.016;let p=state?.p||{x:ambient*8,y:0},cam={x:state?.camX??p.x,y:state?.camY??p.y};ctx.fillStyle='#819361';ctx.fillRect(0,0,W,H);ctx.save();if(state?.shake&&Profile.data.settings.shake)ctx.translate((Math.random()-.5)*(state.shake>.2?11:5),(Math.random()-.5)*(state.shake>.2?11:5));ctx.translate(Math.round(W/2-cam.x),Math.round(H/2-cam.y));drawWorld(cam);if(state)drawArenaBoundary(cam);if(state){drawJianghu(state);LinkSystem.draw(state,false);drawMerchant(state);SectSystem.draw(state);VFX.ground(state);drawCorpses(state);drawAfterimages(state);for(let d of state.drops)drawDropItem(state,d);
const gvw=W/2+24,gvh=H/2+24;for(const g of state.gems){if(Math.abs(g.x-cam.x)>gvw||Math.abs(g.y-cam.y)>gvh)continue;drawQiGem(g)}for(let e of renderOrder(state)){if(e.dead)continue;if(e.blast>0){const br=45+(1.05-e.blast)*35;ctx.strokeStyle='#1b090bcc';ctx.lineWidth=5;ctx.beginPath();ctx.arc(e.x,e.y,br,0,7);ctx.stroke();ctx.strokeStyle='#ff9a84';ctx.fillStyle='#df6c5a24';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(e.x,e.y,br,0,7);ctx.fill();ctx.stroke()}if(e.charge>.45){let a=e.chargeAngle;ctx.strokeStyle='#1a0d08bb';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(a)*180,e.y+Math.sin(a)*180);ctx.stroke();ctx.strokeStyle='#ffcf70';ctx.lineWidth=2.2;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(a)*180,e.y+Math.sin(a)*180);ctx.stroke();ctx.setLineDash([])}if(e.aiming>0){ctx.strokeStyle='#ffe28acc';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y-7,6+e.aiming*11,0,7);ctx.stroke()}drawEnemy(e);if(e.elite){ctx.strokeStyle=e.siegeLeader?'#ff9270':'#f5c771';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,13,0,7);ctx.stroke();rect(e.x-11,e.y-42,22,2.5,'#35472d');rect(e.x-11,e.y-42,22*Math.max(0,e.hp/e.max),2.5,e.siegeLeader?'#ff8661':'#ebbe6b')}if(e.boss){rect(e.x-20,e.y-74,40,3.5,'#25392d');rect(e.x-20,e.y-74,40*e.hp/e.max,3.5,'#c95765');ctx.fillStyle='#fff0c2';ctx.font='10.5px sans-serif';ctx.textAlign='center';ctx.fillText(e.name,e.x,e.y-80)}}ctx.save();if(state.inv>0&&Math.floor(state.inv*20)%2===1)ctx.globalAlpha=.65;sprite(p.x,p.y,selected,true);ctx.restore();for(let b of state.hostile){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));rect(-7,-2,14,4,b.f===1?'#f6c37a':'#ef9d8b');rect(-10,-1,7,2,'#fff4cd');ctx.restore()}VFX.front(state);LinkSystem.draw(state,true);drawWeaponArcs(state);drawImpacts(state);drawHeroFocus(state);ctx.save();ctx.textAlign='center';for(let t of state.texts){ctx.globalAlpha=Math.min(1,t.t*3.2);ctx.strokeStyle='#16231e';ctx.lineWidth=3;ctx.font=(t.crit?'900 16px':'800 14px')+' sans-serif';ctx.strokeText(t.n,t.x,t.y);ctx.fillStyle=t.crit?'#fde047':'#fff1bc';ctx.fillText(t.n,t.x,t.y)}ctx.restore();
if(state.skills[6]){ctx.fillStyle=selected===0?'#c77dff18':selected===1?'#52b78820':'#5a189a24';ctx.beginPath();ctx.arc(p.x,p.y,78+state.skills[6]*14+(state.fusions?.[1]?28:0),0,7);ctx.fill();ctx.strokeStyle=selected===0?'#e0aaff88':selected===1?'#74c69d88':'#9d4edd99';ctx.lineWidth=2;ctx.stroke()}for(let b of state.shots)VFX.projectile(b,state);if(canUseSkill(state,2)||state.fusions?.[0]){const ringLv=state.skills[2],fused0=!!state.fusions?.[0],ringCount=fused0?8:Math.min(6,ringLv),ringR=38+ringLv*4+(fused0?12:0),ringSpd=(fused0?3.4:2.3)+ringLv*.22;const bladeCol=selected===0?(fused0?'#ffe899':'#38bdf8'):selected===1?(fused0?'#ff4d6d':'#c77dff'):(fused0?'#ff0a54':'#e0aaff');for(let j=0;j<ringCount;j++){let a=state.ring*ringSpd+j*Math.PI*2/ringCount;ctx.save();ctx.translate(p.x+Math.cos(a)*ringR,p.y+Math.sin(a)*ringR);ctx.rotate(a);rect(-1.5,-9-ringLv,3,17+ringLv*1.5,bladeCol);rect(-4,4,8,2,selected===2?'#5a189a':'#d6b56a');ctx.restore()}}for(let e of state.effects){if(e.lightning){ctx.strokeStyle='#fff2b3';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(e.x-5,e.y-100);ctx.lineTo(e.x+10,e.y-60);ctx.lineTo(e.x-8,e.y-35);ctx.lineTo(e.x,e.y);ctx.stroke()}ctx.strokeStyle=e.color;ctx.globalAlpha=e.t/e.max;ctx.lineWidth=6;ctx.beginPath();ctx.arc(e.x,e.y,e.r*(1-e.t/e.max),0,7);ctx.stroke();ctx.globalAlpha=1}}else{const roles=['disciple','spearman','archer','assassin','shield','brute','sorcerer'];for(let i=0;i<14;i++){let a=i*2.4;if(typeof WuxiaSprites!=='undefined')WuxiaSprites.drawEnemy(ctx,{x:p.x+Math.cos(a)*230,y:p.y+Math.sin(a)*170,f:i%3,role:roles[i%roles.length],boss:false,hit:0},ambient);else sprite(p.x+Math.cos(a)*230,p.y+Math.sin(a)*170,i%3)}sprite(p.x,p.y,selected,true)}ctx.restore();if(state?.hitFlash){ctx.fillStyle='#df706e22';ctx.fillRect(0,0,W,H)}if(state){siegeOverlay(state);const boss=state.enemies.find(e=>e.boss&&!e.dead);if(boss){let bx=boss.x-p.x+W/2,by=boss.y-p.y+H/2;if(bx<30||bx>W-30||by<90||by>H-70){const a=Math.atan2(by-H/2,bx-W/2),x=Math.max(25,Math.min(W-25,bx)),y=Math.max(95,Math.min(H-75,by));ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#f5b279';ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-8);ctx.lineTo(-8,8);ctx.fill();ctx.restore()}}}if(pointer&&mode==='play'){ctx.strokeStyle='#f3ebbe88';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(pointer.x,pointer.y,36,0,7);ctx.stroke();ctx.fillStyle='#f3ebbeaa';ctx.beginPath();let l=Math.max(1,Math.hypot(pointer.dx,pointer.dy)/36);ctx.arc(pointer.x+pointer.dx/l,pointer.y+pointer.dy/l,15,0,7);ctx.fill()}}
function showNotice(text){const n=$('#notice');n.textContent=text;n.classList.add('show');clearTimeout(showNotice.timer);showNotice.timer=setTimeout(()=>{n.classList.remove('show')},2500)}
let previousTick=performance.now();function tick(now=performance.now()){const dt=Math.max(0,Math.min((now-previousTick)/1000,.065));previousTick=now;Music.update(!document.hidden&&mode==='play',!!state?.enemies.some(e=>e.boss&&!e.dead));if(!document.hidden){if(mode==='play'){update(dt);if(mode==='play')updateMerchant(state,dt);render()}else if(mode==='menu')render()}requestAnimationFrame(tick)}requestAnimationFrame(tick);
