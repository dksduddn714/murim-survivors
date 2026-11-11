'use strict';
const trainingInfo={vitality:['금강심법','시작 체력 +10 / 단계'],power:['검술 연마','모든 피해 +5% / 단계'],fortune:['흡기공','내공 획득 범위 +10 / 단계']};
function openCamp(page='training'){
  $('#camp').hidden=false;$('#campTitle').textContent=page==='training'?'다음 출도를 위한 수련':'강호행 기록';const box=$('#campContent');box.innerHTML='';
  if(page==='training'){
    $('#campSub').textContent='보유 은전 '+Profile.data.silver+' · 수련은 모든 세력에 적용됩니다';
    for(const [id,[name,detail]] of Object.entries(trainingInfo)){
      const n=Profile.data.training[id],b=document.createElement('button');b.className='training';b.disabled=n>=5||Profile.data.silver<Profile.cost(id);b.innerHTML='<strong>'+name+' <span>'+n+'/5</span></strong><small>'+detail+'</small><b>'+(n>=5?'수련 완료':Profile.cost(id)+' 은전으로 수련')+'</b>';b.onclick=()=>{if(Profile.buy(id)){updateProfile();openCamp('training')}};box.append(b)
    }
  } else {
    $('#campSub').textContent='총 '+Profile.data.totalKills+' 처치 · '+Profile.data.wins+'회 생존 성공 · 이 기기에 저장';
    if(!Profile.data.history.length)box.innerHTML='<p class="empty">첫 출도를 시작해 기록을 남겨보세요.</p>';
    for(const r of Profile.data.history){const row=document.createElement('div');row.className='record';row.textContent=factions[r.faction].name+' · '+(r.win?'생존 성공':'수련 중')+' · '+format(r.time)+' · '+r.kills+' 처치 · +'+r.reward+' 은전';box.append(row)}
  }
}
$('#training').onclick=()=>openCamp('training');$('#records').onclick=()=>openCamp('records');$('#campClose').onclick=()=>$('#camp').hidden=true;
