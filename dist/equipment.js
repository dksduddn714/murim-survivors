'use strict';
const Equipment=(()=>{
 const grades=[{name:'일반',color:'#d1d5d1',attack:4,armor:3,cycle:2,salvage:3},{name:'희귀',color:'#8acb9e',attack:7,armor:5,cycle:3,salvage:5},{name:'레어',color:'#7cb9ef',attack:10,armor:7,cycle:5,salvage:8},{name:'유니크',color:'#c697e8',attack:14,armor:10,cycle:7,salvage:12},{name:'전설',color:'#efc66b',attack:19,armor:14,cycle:10,salvage:18}];
 const slots=['weapon','armor','charm'],labels={weapon:'무기',armor:'무복',charm:'장신구'};
 const types=[
 {id:'jian',slot:'weapon',name:'청강검',art:'sword',stats:r=>({attack:grades[r].attack})},
 {id:'saber',slot:'weapon',name:'파군도',art:'saber',stats:r=>({attack:Math.round(grades[r].attack*.65),crit:4+r*2})},
 {id:'spear',slot:'weapon',name:'유성창',art:'spear',stats:r=>({attack:Math.round(grades[r].attack*.55),reach:8+r*3})},
 {id:'gauntlet',slot:'weapon',name:'금강수',art:'gauntlet',stats:r=>({attack:Math.round(grades[r].attack*.45),knock:12+r*6})},
 {id:'robe',slot:'armor',name:'청운무복',art:'armor',stats:r=>({armor:grades[r].armor})},
 {id:'leather',slot:'armor',name:'야행의',art:'leather',stats:r=>({armor:Math.round(grades[r].armor*.55),speed:4+r*2})},
 {id:'scale',slot:'armor',name:'철린갑',art:'mail',stats:r=>({armor:Math.round(grades[r].armor*1.2),speed:-4-r})},
 {id:'monk',slot:'armor',name:'운기법의',art:'monk',stats:r=>({armor:Math.round(grades[r].armor*.6),regen:1+r})},
 {id:'jade',slot:'charm',name:'청옥패',art:'charm',stats:r=>({cycle:grades[r].cycle})},
 {id:'bell',slot:'charm',name:'섭혼령',art:'bell',stats:r=>({magnet:10+r*10})},
 {id:'seal',slot:'charm',name:'연무인',art:'seal',stats:r=>({linkCycle:[5,7,10,12,15][r]})},
 {id:'tiger',slot:'charm',name:'백호아',art:'tiger',stats:r=>({attack:Math.round(grades[r].attack*.25),crit:[2,3,4,6,8][r]})}
 ];
 const bands=[[85,15,0,0,0],[65,28,7,0,0],[42,38,18,2,0],[22,35,32,10,1],[10,24,38,23,5]];
 function weights(seconds){return bands[Math.min(4,Math.max(0,Math.floor((Number(seconds)||0)/60)))].slice()}
 function type(item){return types.find(t=>t.id===item?.variant&&t.slot===item?.slot)||types.find(t=>t.slot===item?.slot)}
 function valid(item){return !!item&&slots.includes(item.slot)&&Number.isInteger(item.rank)&&item.rank>=0&&item.rank<5&&(!item.variant||types.some(t=>t.id===item.variant&&t.slot===item.slot))}
 function roll(seconds,rng=Math.random,forcedSlot){const w=weights(seconds);let draw=Math.min(.999999,Math.max(0,rng()))*100,rank=0;for(;rank<4;rank++){if(draw<w[rank])break;draw-=w[rank]}const slot=slots.includes(forcedSlot)?forcedSlot:slots[Math.min(2,Math.floor(Math.max(0,rng())*3))],pool=types.filter(t=>t.slot===slot),t=pool[Math.min(3,Math.floor(Math.max(0,rng())*4))];return {slot,variant:t.id,rank,name:t.name,foundAt:Math.max(0,Number(seconds)||0)}}
 function init(s){s.equipment={weapon:null,armor:null,charm:null};s.pendingEquipment=null;s.lootBag=[];s.lootSerial=0;s.lootToast=null;s.gearBonuses={};$('#lootToast').hidden=true;paint(s)}
 function stats(item){return valid(item)?type(item).stats(item.rank):{}}
 function recalculate(s){const out={};for(const item of Object.values(s.equipment||{}))for(const [k,n] of Object.entries(stats(item)))out[k]=(out[k]||0)+n;for(const k of ['attack','armor','cycle','crit','knock','linkCycle'])if(out[k])out[k]/=100;s.gearBonuses=out}
 function bonus(s,key){if(!s)return 0;if(!s.gearBonuses)recalculate(s);return s.gearBonuses[key]||0}
 function text(item){if(!valid(item))return '미착용';const labels={attack:'모든 피해',armor:'피해 감소',cycle:'무공 회복',crit:'치명 확률',knock:'밀쳐내기',linkCycle:'연계 회복',reach:'주력 사거리',speed:'이동 속도',magnet:'획득 범위',regen:'20초당 회복'};return Object.entries(stats(item)).map(([k,n])=>labels[k]+' '+(n>0?'+':'')+n+(['reach','magnet'].includes(k)?'px':['speed','regen'].includes(k)?'':'%')).join(' · ')}
 function art(item){return type(item)?.art||'skill'}
 function name(item){return valid(item)?type(item).name:'미착용'}
 function same(a,b){return valid(a)&&valid(b)&&type(a).id===type(b).id}
 function canEquip(s,item){const old=s.equipment?.[item?.slot];return valid(item)&&(!valid(old)||!same(old,item)||item.rank>old.rank)}
 function equip(s,item){if(!canEquip(s,item))return false;s.equipment??={weapon:null,armor:null,charm:null};s.equipment[item.slot]={...item,name:name(item)};recalculate(s);paint(s);return true}
 function purchase(s,item){const old=s.equipment?.[item?.slot];if(!equip(s,item))return false;if(valid(old)&&!same(old,item))store(s,old);paint(s);return true}
 function salvage(s,item){if(!valid(item))return 0;const n=grades[item.rank].salvage;if(!s.demo){Profile.data.silver+=n;Profile.save();updateProfile()}return n}
 function card(item){if(!valid(item))return '<div class="gear-card empty">미착용</div>';const g=grades[item.rank];return '<div class="gear-card" style="--rarity:'+g.color+'">'+ItemArt.html(art(item))+'<span class="rarity">'+g.name+' · '+labels[item.slot]+'</span><strong>'+name(item)+'</strong><small>'+text(item)+'</small></div>'}
 function notify(s,title,detail,item){s.lootToast={title,detail,item,until:s.time+4.5};const b=$('#lootToast');b.hidden=false;b.innerHTML=ItemArt.html(art(item))+'<div><strong>'+title+'</strong><small>'+detail+'</small></div>';paint(s)}
 function store(s,item){if(s.lootBag.length>=12){const n=salvage(s,item);notify(s,'행낭 가득 · 분해','은전 +'+n,item);return false}s.lootBag.push({...item,lootId:++s.lootSerial});return true}
 function collect(s,chest){if(chest.opened)return false;chest.opened=true;const item=chest.item||roll(chest.foundAt??s.time),old=s.equipment[item.slot];if(!old||(same(old,item)&&item.rank>old.rank)){equip(s,item);notify(s,'자동 착용 · '+name(item),grades[item.rank].name+' · '+text(item),item)}else if(same(old,item)&&item.rank<=old.rank){const n=salvage(s,item);notify(s,'중복 장비 분해','은전 +'+n,item)}else if(store(s,item))notify(s,'행낭에 보관 · '+name(item),'장비 버튼 [B]에서 비교 · 전투는 계속됩니다',item);Sound.play('pickup');paint(s);return true}
 function paint(s){const box=$('#equipmentDock');box.hidden=!s||mode==='menu';if(!s)return;box.innerHTML=slots.map(slot=>{const item=s.equipment?.[slot],g=valid(item)?grades[item.rank]:null;return '<button class="gear-slot" style="--rarity:'+(g?.color||'#8b9896')+'" title="'+labels[slot]+' · '+name(item)+' · '+text(item)+'">'+(item?ItemArt.html(art(item)):'<span class="empty-slot">'+({weapon:'劍',armor:'衣',charm:'玉'}[slot])+'</span>')+'<small>'+(g?.name||labels[slot])+'</small></button>'}).join('');box.querySelectorAll('button').forEach(b=>b.onclick=()=>open());const b=$('#bagButton');b.textContent='행낭 '+(s.lootBag?.length||0)+' [B]';b.classList.toggle('has-loot',!!s.lootBag?.length)}
 function open(){if(mode!=='play')return;pause();$('#modalEyebrow').textContent='行囊 · 이번 출도의 장비';$('#modalTitle').textContent='무기 · 무복 · 장신구';$('#choices').innerHTML='<div class="inventory-current">'+slots.map(slot=>'<div><small>'+labels[slot]+'</small>'+card(state.equipment[slot])+'</div>').join('')+'</div><div class="inventory-heading">보관한 장비 <b>'+state.lootBag.length+'/12</b><small>다른 종류는 직접 비교 · 같은 종류 상위 등급은 자동 착용</small></div><div class="inventory-bag">'+(state.lootBag.length?state.lootBag.map(item=>'<button class="bag-item" data-loot="'+item.lootId+'">'+card(item)+'<span>비교하기 →</span></button>').join(''):'<p class="empty">새 장비를 주우면 여기에 보관합니다.</p>')+'</div><details class="gear-catalog"><summary>장비 도감 · 12종 / 5등급</summary><div class="inventory-bag">'+types.map(t=>card({slot:t.slot,variant:t.id,rank:0})).join('')+'</div></details><p class="gear-note">'+weights(state.time).map((n,i)=>grades[i].name+' '+n+'%').join(' · ')+'<br>드랍 순간의 생존 시간으로 등급 확정 · 장비 효과 중첩 없음</p>';$('#choices').querySelectorAll('[data-loot]').forEach(b=>b.onclick=()=>inspect(+b.dataset.loot));$('#resume').onclick=pause;$('#resume').textContent='전투로 돌아가기'}
 function inspect(id){if(mode!=='pause')return;const item=state.lootBag.find(i=>i.lootId===id);if(!item)return;state.pendingLootId=id;openTreasure(state,{item,fromBag:true})}
 function decide(equipItem){const s=state,item=s?.pendingEquipment;if(mode!=='reward'||!valid(item))return false;if(equipItem&&!canEquip(s,item))return false;const old=s.equipment[item.slot];s.lootBag=s.lootBag.filter(i=>i.lootId!==s.pendingLootId);s.pendingLootId=null;if(equipItem){equip(s,item);if(valid(old)&&!same(old,item))store(s,old);showNotice(name(item)+' 착용')}else{const n=salvage(s,item);showNotice('장비 분해 · 은전 +'+n+(s.demo?' (시연 · 미저장)':''))}closeTreasure();paint(s);return true}
 return {grades,types,slots,labels,weights,roll,valid,init,stats,bonus,text,art,name,same,canEquip,equip,purchase,salvage,card,paint,open,inspect,decide,collect};
})();
function drawDropItem(s,d){
 const size=d.type==='heal'?42:26,y=d.y+Math.sin(s.time*3+d.x)*1.5;
 if(d.type==='heal'){ctx.save();ctx.strokeStyle='#f1cc8199';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(d.x,d.y+5,14,5,0,0,7);ctx.stroke();ctx.restore()}
 ItemArt.draw(ctx,d.type,d.x,y,size);
 if(d.type==='heal'&&Math.hypot(d.x-s.p.x,d.y-s.p.y)<150){ctx.save();ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#213329';ctx.strokeText('금창약',d.x,d.y+15);ctx.fillStyle='#ffe0a3';ctx.fillText('금창약',d.x,d.y+15);ctx.restore()}
}
function paintPostRunTraining(){const b=$('#postTraining');b.hidden=mode!=='end'||!state||!!state.demo;if(b.hidden)return;const paths=Object.keys(Profile.data.training).filter(k=>Profile.data.training[k]<Profile.limit(k)),affordable=paths.filter(k=>Profile.data.silver>=Profile.cost(k));b.disabled=!affordable.length;b.textContent=affordable.length?'은전 '+Profile.data.silver+' · 영구 수련하기 ('+affordable.length+'종)':paths.length?'보유 은전 '+Profile.data.silver+' · 수련까지 '+Math.max(0,Math.min(...paths.map(k=>Profile.cost(k)))-Profile.data.silver)+' 필요':'모든 영구 수련 완료';const n=$('#postBalance');if(n)n.textContent='보유 은전 '+Profile.data.silver+' · 이번 출도 장비는 다음 판에 초기화됩니다.'}
