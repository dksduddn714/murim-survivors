'use strict';
const skillGlyphs=['劍','刃','御','震','心','步','毒','雷'];
$('#bloodMode').onclick=()=>chooseBattle('blood');$('#hellMode').onclick=()=>chooseBattle('hell');
function chooseBattle(id){battleMode=id;$('#bloodMode').classList.toggle('active',id==='blood');$('#hellMode').classList.toggle('active',id==='hell');$('#start small').textContent=id==='hell'?'지옥의 포위망에 도전합니다':'강호가 당신을 기다립니다'}
$('#fxDemo').onclick=()=>{Sound.unlock();start();state.demo=true;state.skills=[4,4,2,4,2,2,2,2];state.p.hp=state.p.max=700;syncSkills();VFX.cast('evolution',state.p.x,state.p.y,{r:180,color:'#ffdfa0'});showNotice('무공 연출 체험 · 45초 · 은전과 전적에 반영되지 않습니다')};
function skillTiles(){
  const s=state;$('#skills').innerHTML=s.skills.map((n,i)=>n?'<div id="skill'+i+'" class="skilltile '+([0,1,3].includes(i)&&[s.evolved,s.rain,s.thunder][[0,1,3].indexOf(i)]?'legend':'')+'" title="'+names[i]+' '+n+'중"><span class="skillglyph">'+skillGlyphs[i]+'</span><b>'+(i===0&&s.evolved?'만검귀종':i===1&&s.rain?'만천화우':i===3&&s.thunder?'혈뢰천강':names[i])+'</b><small>'+('◆'.repeat(n))+('◇'.repeat(5-n))+'</small><i class="skillready"></i></div>':'').join('');
  const goals=[];if(!s.evolved&&s.skills[0])goals.push('검기4 + 호신검2 → 만검귀종');if(!s.rain&&s.skills[1])goals.push('비도4 + 독무2 → 만천화우');if(!s.thunder&&s.skills[3])goals.push('진각4 + 천뢰장2 → 혈뢰천강');$('#buildHint').textContent=goals[0]||'절학의 힘으로 포위망을 돌파하세요';
}
