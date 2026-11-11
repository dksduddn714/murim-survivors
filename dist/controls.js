'use strict';
async function fullscreen(){
  try{if(document.fullscreenElement)await document.exitFullscreen();else{await document.documentElement.requestFullscreen();try{await screen.orientation.lock('landscape')}catch{}}}catch{showNotice('이 브라우저에서는 직접 가로로 돌려주세요')}
}
$('#fullscreen').onclick=fullscreen;
$('#options').onclick=()=>{
  $('#camp').hidden=false;$('#campTitle').textContent='강호 설정';$('#campSub').textContent='조작 · 드래그 / WASD / 방향키 · 경공 SPACE · 일시정지 ESC';
  $('#campContent').innerHTML='<button id="soundToggle" class="training"></button><button id="shakeToggle" class="training"></button><button id="screenToggle" class="training"><strong>전체 화면으로 플레이 ⛶</strong><small>기기와 브라우저에 따라 지원 여부가 다릅니다.</small></button>';
  const paint=()=>{$('#soundToggle').innerHTML='<strong>효과음 '+(Profile.data.settings.sound?'켜짐':'꺼짐')+'</strong><small>선택 시 저장됩니다.</small>';$('#shakeToggle').innerHTML='<strong>화면 흔들림 '+(Profile.data.settings.shake?'켜짐':'꺼짐')+'</strong>'};paint();
  $('#soundToggle').onclick=()=>{Profile.data.settings.sound=!Profile.data.settings.sound;Profile.save();if(typeof Sound!=='undefined')Sound.unlock();paint()};$('#shakeToggle').onclick=()=>{Profile.data.settings.shake=!Profile.data.settings.shake;Profile.save();paint()};$('#screenToggle').onclick=fullscreen;
};
