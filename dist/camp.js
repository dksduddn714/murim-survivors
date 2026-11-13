'use strict';
const trainingInfo={vitality:['금강심법','시작 체력 +10 / 단계'],power:['검술 연마','모든 피해 +5% / 단계'],fortune:['흡기공','내공 획득 범위 +14 / 단계'],mobility:['신행백변','이속 +4 · 경공 재사용 −0.1초 / 단계'],destiny:['기연심법','매 출도 비급 재추첨 +1회 · 구매 회복 효과 +5% / 단계'],origin:['무극내공','시작 문파 비급 +1성 / 단계 (최대 5성)'],recovery:['운기조식','20초마다 체력 +1 / 단계']};
function openCamp(page='training'){
  $('#campClose').onclick=()=>$('#camp').hidden=true;$('#camp').hidden=false;$('#campTitle').textContent=page==='training'?'다음 출도를 위한 수련':'강호행 기록';const box=$('#campContent');box.innerHTML='';
  if(page==='training'){
    $('#campSub').textContent='보유 은전 '+Profile.data.silver+' · 수련은 모든 세력에 적용됩니다';
    for(const [id,[name,detail]] of Object.entries(trainingInfo)){
      const cap=Profile.limit(id),n=Profile.data.training[id],b=document.createElement('button');b.className='training';b.disabled=n>=cap||Profile.data.silver<Profile.cost(id);
      const icon=typeof WuxiaUI!=='undefined'?WuxiaUI.trainingIcon(id):'';
      const pips=typeof WuxiaUI!=='undefined'?WuxiaUI.pips(n,cap):(n+'/'+cap);
      b.innerHTML='<div class="wx-train-row">'+icon+'<div class="wx-train-body"><strong>'+name+' <span>'+pips+' ('+n+'/'+cap+')</span></strong><small>'+detail+'</small><b>'+(n>=cap?'수련 완료':Profile.cost(id)+' 은전으로 수련')+'</b></div></div>';
      b.onclick=()=>{if(Profile.buy(id)){updateProfile();paintPostRunTraining();openCamp('training')}};box.append(b)
    }
  } else {
    $('#campSub').textContent='출도 금장 '+Profile.data.seals.filter(Boolean).length+'/12 · 총 '+Profile.data.totalKills+' 처치 · '+Profile.data.wins+'회 생존 성공 · 이 기기에 저장';
    if(!Profile.data.history.length)box.innerHTML='<p class="empty">첫 출도를 시작해 기록을 남겨보세요.</p>';
    for(const r of Profile.data.history){const row=document.createElement('div');row.className='record';row.textContent=factions[r.faction].name+' · '+(r.win?'생존 성공':'수련 중')+' · '+format(r.time)+' · '+r.kills+' 처치 · +'+r.reward+' 은전';box.append(row)}
  }
}
$('#training').onclick=()=>openCamp('training');$('#records').onclick=()=>openCamp('records');$('#campClose').onclick=()=>$('#camp').hidden=true;
