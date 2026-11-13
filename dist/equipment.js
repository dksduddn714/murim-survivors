'use strict';
const Equipment=(()=>{
 const grades=[
  {name:'일반',color:'#d1d5d1',attack:4,armor:3,cycle:2,salvage:3},
  {name:'희귀',color:'#8acb9e',attack:7,armor:5,cycle:3,salvage:5},
  {name:'레어',color:'#7cb9ef',attack:10,armor:7,cycle:5,salvage:8},
  {name:'유니크',color:'#c697e8',attack:14,armor:10,cycle:7,salvage:12},
  {name:'전설',color:'#efc66b',attack:19,armor:14,cycle:10,salvage:18}
 ];
 const slots=['weapon','armor','charm'],labels={weapon:'무기',armor:'무복',charm:'호부'};
 const names={weapon:['수련 철검','청강검','백련검','자하명검','천하무쌍검'],armor:['삼베 무복','청운 무복','백련 경갑','천잠보의','금강선의'],charm:['나무 호부','청옥 호부','백옥 영패','자하 영패','태극천령패']};
 const bands=[[85,15,0,0,0],[65,28,7,0,0],[42,38,18,2,0],[22,35,32,10,1],[10,24,38,23,5]];
 function weights(seconds){return bands[Math.min(4,Math.max(0,Math.floor((Number(seconds)||0)/60)))].slice()}
 function roll(seconds,rng=Math.random){const w=weights(seconds);let draw=Math.min(.999999,Math.max(0,rng()))*100,rank=0;for(;rank<4;rank++){if(draw<w[rank])break;draw-=w[rank]}const slot=slots[Math.min(2,Math.floor(Math.max(0,rng())*3))];return {slot,rank,name:names[slot][rank],foundAt:Math.max(0,Number(seconds)||0)}}
 function valid(item){return !!item&&slots.includes(item.slot)&&Number.isInteger(item.rank)&&item.rank>=0&&item.rank<5}
 function init(s){s.equipment={weapon:null,armor:null,charm:null};s.pendingEquipment=null}
 function bonus(s,key){const slot=key==='attack'?'weapon':key==='armor'?'armor':'charm',item=s?.equipment?.[slot];return valid(item)?grades[item.rank][key]/100:0}
 function text(item){if(!valid(item))return '미착용';const g=grades[item.rank];return item.slot==='weapon'?'모든 피해 +'+g.attack+'%':item.slot==='armor'?'받는 피해 −'+g.armor+'%':'모든 무공 재사용 시간 −'+g.cycle+'%'}
 function art(item){return item?.slot==='weapon'?'sword':item?.slot==='armor'?'armor':'charm'}
 function name(item){return valid(item)?names[item.slot][item.rank]:'미착용'}
 function equip(s,item){if(!valid(item))return false;s.equipment??={weapon:null,armor:null,charm:null};const old=s.equipment[item.slot];if(valid(old)&&old.rank>=item.rank)return false;s.equipment[item.slot]={...item,name:name(item)};paint(s);return true}
 function salvage(s,item){if(!valid(item))return 0;const n=grades[item.rank].salvage;if(!s.demo){Profile.data.silver+=n;Profile.save();updateProfile()}return n}
 function card(item){if(!valid(item))return '<div class="gear-card empty">미착용</div>';const g=grades[item.rank];return '<div class="gear-card" style="--rarity:'+g.color+'">'+ItemArt.html(art(item))+'<span class="rarity">'+g.name+' · '+labels[item.slot]+'</span><strong>'+name(item)+'</strong><small>'+text(item)+'</small></div>'}
 function paint(s){const box=$('#equipmentDock');box.hidden=!s||mode==='menu';if(!s)return;box.innerHTML=slots.map(slot=>{const item=s.equipment?.[slot],g=valid(item)?grades[item.rank]:null;return '<button class="gear-slot" style="--rarity:'+(g?.color||'#8b9896')+'" title="'+labels[slot]+' · '+name(item)+' · '+text(item)+'">'+(item?ItemArt.html(art(item)):'<span class="empty-slot">'+({weapon:'劍',armor:'衣',charm:'玉'}[slot])+'</span>')+'<small>'+(g?.name||labels[slot])+'</small></button>'}).join('');box.querySelectorAll('button').forEach(b=>b.onclick=open)}
 function open(){if(mode!=='play')return;pause();$('#modalEyebrow').textContent='행낭 · 장비는 이번 출도에만 적용';$('#modalTitle').textContent='장비는 부위당 하나 · 같은 부위 효과 중첩 없음';$('#choices').innerHTML=slots.map(slot=>'<div><small>'+labels[slot]+'</small>'+card(state.equipment[slot])+'</div>').join('')+'<p class="gear-note">'+weights(state.time).map((n,i)=>grades[i].name+' '+n+'%').join(' · ')+'<br>다음 궤짝의 등급 확률 · 처치 시간에 확정됩니다.</p>'}
 function decide(equipItem){const s=state,item=s?.pendingEquipment;if(mode!=='reward'||!valid(item))return false;if(equipItem){if(!equip(s,item))return false;showNotice(grades[item.rank].name+' '+name(item)+' 착용')}else{const n=salvage(s,item);showNotice('장비 분해 · 은전 +'+n+(s.demo?' (시연 · 미저장)':''))}s.pendingEquipment=null;closeTreasure();return true}
 return {grades,slots,labels,weights,roll,valid,init,bonus,text,art,name,equip,salvage,card,paint,open,decide};
})();
function drawDropItem(s,d){
 const size=d.type==='heal'?42:26,y=d.y+Math.sin(s.time*3+d.x)*1.5;
 if(d.type==='heal'){ctx.save();ctx.strokeStyle='#f1cc8199';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(d.x,d.y+5,14,5,0,0,7);ctx.stroke();ctx.restore()}
 ItemArt.draw(ctx,d.type,d.x,y,size);
 if(d.type==='heal'&&Math.hypot(d.x-s.p.x,d.y-s.p.y)<150){ctx.save();ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#213329';ctx.strokeText('금창약',d.x,d.y+15);ctx.fillStyle='#ffe0a3';ctx.fillText('금창약',d.x,d.y+15);ctx.restore()}
}
function paintPostRunTraining(){const b=$('#postTraining');b.hidden=mode!=='end'||!state||!!state.demo;if(b.hidden)return;const paths=Object.keys(Profile.data.training).filter(k=>Profile.data.training[k]<Profile.limit(k)),affordable=paths.filter(k=>Profile.data.silver>=Profile.cost(k));b.disabled=!affordable.length;b.textContent=affordable.length?'은전 '+Profile.data.silver+' · 영구 수련하기 ('+affordable.length+'종)':paths.length?'보유 은전 '+Profile.data.silver+' · 수련까지 '+Math.max(0,Math.min(...paths.map(k=>Profile.cost(k)))-Profile.data.silver)+' 필요':'모든 영구 수련 완료';const n=$('#postBalance');if(n)n.textContent='보유 은전 '+Profile.data.silver+' · 이번 출도 장비는 다음 판에 초기화됩니다.'}
