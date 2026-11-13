'use strict';
// Encounter-local inventory; only the current level's unspent experience is currency.
function merchantOffers(s){
  const pool=[
    ...Equipment.slots.map(slot=>{const item=Equipment.roll(s.time,Math.random,slot);return {name:Equipment.grades[item.rank].name+' '+item.name,text:Equipment.text(item)+' · 기존 장비와 교체',kind:'equipment',item}}),
    {name:'금창약',text:'체력 '+Math.round(45*(1+Profile.data.training.destiny*.05))+' 회복 · 최대 체력 +10',kind:'potion'},
    {name:'소환단',text:'현재 내공 +8 · 구매 후 돌파에 사용',kind:'qi'},
    {name:'흡성부',text:'현재 바닥의 경험치를 전부 회수',kind:'magnet'},
    ...names.map((name,i)=>({name:name+' 비급',text:((s.skills[i]||0)===0?'새 무공 습득':'무공 1성 상승')+' · '+((s.skills[i]||0)+1)+'성',kind:'skill',slot:i})).filter(o=>(s.skills[o.slot]||0)<5)
  ];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  return pool.slice(0,4);
}
function updateMerchant(s,dt){
  s.merchantNext??=40+Math.random()*20;
  let m=s.merchant;
  if(m&&s.time>=m.until){s.merchant=null;m=null}
  if(!m&&s.time>=s.merchantNext&&!s.demo){
    const a=Math.random()*Math.PI*2,r=Math.max(75,Math.min(W,H)*.3);
    s.merchant=m={x:s.p.x+Math.cos(a)*r,y:s.p.y+Math.sin(a)*r,until:s.time+45,bought:false,offers:merchantOffers(s)};
    keepInArena(m,60);s.merchantNext=s.time+65+Math.random()*20;showNotice('떠돌이 상인 출현 · 지도 위 보따리를 찾아가세요');
  }
  const near=!!m&&!m.bought&&Math.hypot(m.x-s.p.x,m.y-s.p.y)<75;
  $('#trade').hidden=!near||mode!=='play';
  if(near)$('#trade').textContent='상인 거래 [E] · 경험치 '+Math.floor(s.xp);
}
function openMerchant(){
  const s=state,m=s?.merchant;
  if(mode!=='play'||!m||m.bought||Math.hypot(m.x-s.p.x,m.y-s.p.y)>=75)return;
  mode='shop';keys={};pointer=null;$('#trade').hidden=true;
  $('#modal').hidden=false;$('#modalEyebrow').textContent='떠돌이 상인 · 방문당 단 하나';
  $('#modalTitle').textContent='현재 경험치 '+Math.floor(s.xp)+' / '+s.need+' 전부로 하나 구매';
  $('#choices').innerHTML='';$('#choices').classList.add('merchant-choices');
  m.offers.forEach((o,i)=>{
    const b=document.createElement('button');if(o.kind==='equipment')b.style.borderColor=Equipment.grades[o.item.rank].color;b.disabled=!(s.xp>0)||(o.kind==='equipment'&&!Equipment.canEquip(s,o.item));
    b.innerHTML=(o.kind==='skill'?WuxiaUI.skillIcon(o.slot,true,selected):ItemArt.html(o.kind==='equipment'?Equipment.art(o.item):o.kind==='potion'?'heal':o.kind))+'<small>상품 '+(i+1)+'</small><strong>'+o.name+'</strong><small>'+o.text+'</small><small>대가: 현재 경험치 전부 · 레벨 유지</small>';
    b.onclick=()=>buyMerchant(i);$('#choices').append(b);
  });
  $('#again').hidden=true;$('#retry').hidden=true;$('#resume').hidden=false;
  $('#resume').textContent=s.xp>0?'구매하지 않고 떠나기':'경험치가 없습니다 · 돌아가기';
}
function closeMerchant(){if(mode!=='shop')return;mode='play';keys={};pointer=null;$('#modal').hidden=true;$('#choices').classList.remove('merchant-choices');$('#resume').textContent='계속하기';state.inv=Math.max(state.inv,.65);previousTick=performance.now()}
function collectExperience(s){for(const g of s.gems)g.magnet=true}
function buyMerchant(index){
  const s=state,m=s?.merchant,o=m?.offers[index];
  if(mode!=='shop'||!m||m.bought||!o||!(s.xp>0))return false;
  // Commit once before effects; queued clicks cannot buy again.
  if(o.kind==='equipment'&&!Equipment.purchase(s,o.item))return false;
  m.bought=true;s.xp=0;
  if(o.kind==='potion'){s.p.max+=10;s.p.hp=Math.min(s.p.max,s.p.hp+45*(1+Profile.data.training.destiny*.05))}
  if(o.kind==='qi')s.xp+=8;
  if(o.kind==='magnet')collectExperience(s);
  if(o.kind==='skill'){s.skills[o.slot]++;if(o.slot===4){s.p.max+=s.skills[4]===1?12:6;s.p.hp=Math.min(s.p.max,s.p.hp+18)}syncSkills()}
  closeMerchant();s.hudClock=0;updateHUD(s,0);Sound.play('level');showNotice(o.name+' 구매 · 현재 경험치 소모');return true;
}
function drawMerchant(s){
  const m=s.merchant;if(!m)return;
  ctx.save();ctx.translate(Math.round(m.x),Math.round(m.y));
  ctx.fillStyle='#233c3544';ctx.beginPath();ctx.ellipse(0,4,20,7,0,0,7);ctx.fill();
  const cv=getItemCanvas(m.bought?'merchant_done':'merchant_active');ctx.imageSmoothingEnabled=false;ctx.drawImage(cv,-32,-58,64,64);
  ctx.textAlign='center';ctx.font='bold 12px sans-serif';ctx.fillStyle='#ffedb3';ctx.fillText(m.bought?'거래 완료':'떠돌이 상인',0,-68);ctx.restore();
}
$('#trade').onclick=openMerchant;
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e'&&!e.repeat)openMerchant();else if(mode==='shop'){if(e.key==='Escape')closeMerchant();else if(['1','2','3','4'].includes(e.key)&&!e.repeat)buyMerchant(Number(e.key)-1)}});
