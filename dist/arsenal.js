'use strict';
let skillGlyphs=['太','梅','兩','掌','佛','梯','紫','龍','拳','棍','棒','圓'];
$('#bloodMode').onclick=()=>chooseBattle('blood');$('#hellMode').onclick=()=>chooseBattle('hell');
function chooseBattle(id){
  battleMode=id;
  $('#bloodMode').classList.toggle('active',id==='blood');
  $('#hellMode').classList.toggle('active',id==='hell');
  const sm=$('#startSmall');
  if(sm)sm.textContent=id==='hell'?'지옥의 포위망에 도전합니다':'강호가 당신을 기다립니다';
}
$('#fxDemo').onclick=()=>{Sound.unlock();start();state.demo=true;state.skills=[5,5,5,5,2,2,5,5,5,5,0,0];state.p.hp=state.p.max=700;syncSkills();VFX.cast('evolution',state.p.x,state.p.y,{r:180,color:'#ffdfa0'});showNotice('합벽절학 연출 체험 · 45초 · 은전과 전적에 반영되지 않습니다');};
function skillTiles(){
  const s=state;if(!s)return;
  const fIdx=typeof selected!=='undefined'?selected:0;
  const fSet=typeof WuxiaUI!=='undefined'?WuxiaUI.getFactionSkillSet(fIdx):null;
  if(fSet)skillGlyphs=fSet.glyphs;
  const fusions=(typeof WuxiaUI!=='undefined'&&WuxiaUI.getFactionFusions(fIdx))||[];
  const merged=new Set();
  const tiles=[];
  for(const f of fusions){
    if(s.fusions?.[f.id]){
      merged.add(f.a);merged.add(f.b);
      const icon=typeof WuxiaUI!=='undefined'?WuxiaUI.skillIcon(f.a,true,fIdx):'';
      tiles.push('<div id="skill'+f.a+'" class="skilltile legend fusion" title="합벽절학 '+f.name+'"><div class="wx-tile-top">'+icon+'<span class="skillglyph">'+f.glyph+'</span></div><b>'+f.name+'</b><small>★합벽절학★</small><i class="skillready"></i></div>');
    }
  }
  s.skills.forEach((n,i)=>{
    if(!n||merged.has(i))return;
    const isLegend=([0,1,3].includes(i)&&[s.evolved,s.rain,s.thunder][[0,1,3].indexOf(i)])||n>=5;
    const icon=typeof WuxiaUI!=='undefined'?WuxiaUI.skillIcon(i,isLegend,fIdx):'';
    const pips=typeof WuxiaUI!=='undefined'?WuxiaUI.pips(n,5):('◆'.repeat(n)+'◇'.repeat(5-n));
    const sName=(fSet&&fSet.names[i])||names[i]||'무공';
    const sectTag=(fSet&&fSet.sects&&fSet.sects[i])||'';
    const title=i===0&&s.evolved?( fusions[0]?.name||'절학' ):i===1&&s.rain?( fusions[1]?.name||'절학' ):i===3&&s.thunder?( fusions[2]?.name||'절학' ):sName;
    tiles.push('<div id="skill'+i+'" class="skilltile '+(isLegend?'legend':'')+'" title="'+(sectTag?'['+sectTag+'] ':'')+sName+' '+n+'성"><div class="wx-tile-top">'+icon+'<span class="skillglyph">'+(skillGlyphs[i]||'武')+'</span></div><b>'+title+'</b><small>'+pips+'</small><i class="skillready"></i></div>');
  });
  $('#skills').innerHTML=tiles.join('');
  const goals=[];
  for(const f of fusions){
    if(!s.fusions?.[f.id]&&(s.skills[f.a]>0||s.skills[f.b]>0)){
      goals.push(f.aName+'5★ + '+f.bName+'5★ → 【'+f.name+'】');
    }
  }
  $('#buildHint').textContent=goals[0]||'두 무공 5성 달성 시 세력 고유 합벽절학(合璧絕學)으로 합체됩니다';
}
