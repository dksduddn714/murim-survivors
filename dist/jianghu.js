'use strict';
// Original pixel item atlas, cached once. Generated peddler illustration is a separate asset.
const ItemArt=(()=>{
 const cache=new Map();
 function frame(kind){if(kind==='potion')kind='heal';if(cache.has(kind))return cache.get(kind);const cv=document.createElement('canvas');cv.width=cv.height=32;const g=cv.getContext('2d'),r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},O='#28303d',G='#e5c47c';
 if(kind==='heal'&&medicineImage?.complete&&medicineImage.naturalWidth){cv.width=cv.height=64;g.imageSmoothingEnabled=true;const h=64,w=h*medicineImage.naturalWidth/medicineImage.naturalHeight;g.drawImage(medicineImage,(64-w)/2,0,w,h);cache.set(kind,cv);return cv}
 const box=(x,y,w,h,c)=>{r(x-1,y-1,w+2,h+2,O);r(x,y,w,h,c)};
 if(kind==='heal'){
  // Ceramic medicine gourd, red cloth stopper and pixel 金 label. No medical cross.
  box(13,3,7,4,'#aa5541');r(11,4,11,2,'#df8c62');box(13,7,7,4,'#d4bf91');
  box(10,10,13,7,'#6b9891');box(7,17,19,10,'#467b76');r(9,19,3,6,'#a1c6b1');r(11,11,3,4,'#c1d8ba');r(8,27,16,2,'#274b50');
  r(12,16,9,10,'#ecdbac');r(16,17,2,2,'#936448');r(14,19,6,1,'#936448');r(13,21,8,1,'#936448');r(16,19,1,6,'#936448');r(14,23,5,1,'#936448');
  r(20,6,5,2,'#bd6956');r(23,8,2,5,'#bd6956');r(25,10,2,3,'#e0a079');
 }
 else if(kind==='armor'){box(10,5,12,4,'#ccba91');box(7,9,18,17,'#5c7d8b');box(3,10,5,9,'#708f9b');box(25,10,4,9,'#708f9b');r(10,10,3,13,'#9eb7b7');r(13,9,6,3,'#d5c595');r(8,21,16,3,'#c0a778');r(15,12,2,10,'#364e68');r(11,26,5,3,'#314951');r(18,26,5,3,'#314951')}
 else if(kind==='charm'){r(15,3,2,8,'#b47d61');r(10,5,12,2,'#b47d61');box(10,10,13,16,'#509387');r(12,12,3,11,'#94c6a7');r(16,14,4,7,'#d9c58e');r(10,26,13,2,'#325d58');r(14,28,2,3,'#d7ad6a');r(19,28,2,3,'#d7ad6a')}
 else if(kind==='qi'){box(10,8,12,4,'#9d7654');box(7,12,18,14,'#376c70');r(9,13,4,11,'#659c95');box(12,16,9,6,G);r(15,17,2,4,'#714b47');r(13,5,6,3,'#d3b280')}
 else if(kind==='gem'){box(13,8,6,3,'#e9d4a2');box(10,12,12,13,'#7dbcb0');r(12,13,4,10,'#bce2ca');r(10,14,12,2,G);r(15,18,2,4,'#346b67')}
 else if(kind==='magnet'){box(8,5,16,23,'#eed8a2');r(8,6,16,3,'#af6754');r(8,24,16,3,'#af6754');r(14,11,4,3,'#c04f4d');r(12,15,8,2,'#c04f4d');r(15,17,2,5,'#c04f4d');r(11,20,10,2,'#c04f4d')}
 else if(kind==='chest'){box(4,14,24,13,'#87533d');box(4,8,24,8,'#b47b4d');r(6,9,20,2,'#dbac65');r(7,8,3,19,G);r(22,8,3,19,G);r(4,16,24,3,O);box(13,15,6,7,G);r(15,18,2,3,'#6e4c38')}
 else if(kind==='silver'){box(6,16,21,9,'#9caeb9');r(8,14,4,3,'#e5e7cf');r(22,13,4,4,'#e5e7cf');r(9,18,15,4,'#edf0dc');r(13,9,8,5,'#d6ba73');r(15,10,3,2,'#766148')}
 else if(kind==='barrel'){box(7,5,18,22,'#866548');r(10,6,3,20,'#b08b59');r(20,6,2,20,'#5d4b39');r(6,9,20,3,'#48545b');r(6,21,20,3,'#48545b');box(12,13,8,6,'#e0bd79');r(14,14,4,4,'#a34e43')}
 else if(kind==='herb'){r(15,11,2,15,'#436950');box(9,21,14,6,'#67745a');r(7,12,8,4,'#8cbd81');r(9,8,5,5,'#bdd9a2');r(17,7,7,4,'#87b68d');r(17,15,9,4,'#b0cf8f');r(13,4,6,5,'#e8d49b')}
 else if(kind==='stone'){box(7,7,18,22,'#677f80');box(10,4,12,3,'#91aaa0');r(9,9,3,16,'#9cb7ab');r(16,10,3,12,'#edcd83');r(13,14,9,2,'#edcd83');r(5,27,23,3,'#475e5f')}
 else if(kind==='sword'||kind==='knife'){const len=kind==='knife'?17:24;for(let i=0;i<len;i++)r(3+i,26-i,5,5,O);for(let i=0;i<len;i++)r(4+i,27-i,3,2,'#d6e5dd');r(6,21,7,2,G);r(7,23,3,5,'#a16d50')}
 else{box(5,5,22,24,'#3f7475');r(7,7,3,20,'#b6c9b0');r(12,8,11,15,'#e8d9b1');r(15,11,5,2,'#a6754c');r(15,15,5,2,'#a6754c');r(15,19,4,2,'#a6754c')}
 cache.set(kind,cv);return cv}
 function draw(g,k,x,y,size=24){g.save();g.imageSmoothingEnabled=false;g.drawImage(frame(k),Math.round(x-size/2),Math.round(y-size*.8),size,size);g.restore()}
 function html(k){return '<img class="goods-icon" src="'+frame(k).toDataURL()+'" alt="'+({heal:'금창약',potion:'금창약',qi:'소환단',magnet:'흡성부',sword:'청강검',knife:'추혼도',silver:'은전',chest:'기연 궤짝',armor:'무복',charm:'호부'}[k]||'무공 비급')+'">'}
 return {frame,draw,html,clear:kind=>cache.delete(kind)};
})();
const medicineImage=typeof Image!=='undefined'?new Image():null;if(medicineImage){medicineImage.onload=()=>ItemArt.clear('heal');medicineImage.src='assets/medicine-gourd.png'}
const peddlerImage=typeof Image!=='undefined'?new Image():null;if(peddlerImage)peddlerImage.src='assets/peddler.png';
function initJianghu(s){
 Equipment.init(s);s.treasures=[];s.hazards=[];s.props=[];s.recoverClock=20;s.cultivation=0;s.treasureSilver=0;
 // Fixed lanes keep hazards away from the starting point and make each arena learnable.
 for(let row=-2;row<=2;row++)for(let col=-3;col<=3;col++){if(Math.abs(col)+Math.abs(row)<2)continue;const n=(row+2)*7+col+3,type=stageId===0?(n%3===0?'herb':'barrel'):stageId===1?(n%3===0?'barrel':'stone'):(n%4===0?'stone':'barrel');s.props.push({x:col*285+(row%2)*55,y:row*245,type,hp:type==='barrel'?26:1,used:false,respawn:0})}
}
function dropTreasure(s,e){if(e.treasureDropped||!(e.boss||e.siegeLeader||e.elite))return;e.treasureDropped=true;
 const tier=e.final?3:e.boss||e.siegeLeader?2:1;
 if(s.treasures.length>=24)return;
 s.treasures.push({x:e.x,y:e.y,tier,item:Equipment.roll(s.time),foundAt:s.time,phase:Math.random()*6});VFX.burst(e.x,e.y-8,'#ffdf8a',12,80);
}
function openTreasure(s,chest){
 if(chest.opened||mode!=='play')return;chest.opened=true;mode='reward';pointer=null;keys={};$('#trade').hidden=true;$('#reroll').hidden=true;
 const item=chest.item||Equipment.roll(chest.foundAt??s.time);s.pendingEquipment=item;const old=s.equipment[item.slot],g=Equipment.grades[item.rank],canEquip=!old||item.rank>old.rank;
 $('#modal').hidden=false;$('#modalEyebrow').textContent='강호 기연 · 장비 1개 · 무공 즉시 강화 없음';$('#modalTitle').textContent=g.name+' '+Equipment.name(item);$('#choices').classList.remove('merchant-choices');$('#choices').innerHTML='<div class="gear-compare"><div><small>발견한 장비</small>'+Equipment.card(item)+'</div><div><small>현재 착용</small>'+Equipment.card(old)+'</div></div><p class="gear-note">'+format(item.foundAt)+' 처치 보상 · 이번 출도에만 적용 · 부위별 하나만 착용</p>';
 const equipButton=document.createElement('button');equipButton.className='equip-action';equipButton.disabled=!canEquip;equipButton.textContent=canEquip?'착용하기 · '+Equipment.text(item):'현재 장비가 같거나 더 좋습니다';equipButton.onclick=()=>Equipment.decide(true);$('#choices').append(equipButton);
 $('#again').hidden=true;$('#retry').hidden=true;$('#resume').hidden=false;$('#resume').textContent='분해하여 은전 +'+g.salvage;$('#resume').onclick=()=>Equipment.decide(false);Sound.play('pickup');
}

function closeTreasure(){if(mode!=='reward')return;state.pendingEquipment=null;mode='play';$('#modal').hidden=true;$('#resume').textContent='계속하기';$('#resume').onclick=pause;state.inv=Math.max(state.inv,.8);previousTick=performance.now()}
function hurtFromHazard(s,n){if(s.inv>0||mode!=='play')return;if(!SectSystem.block(s))s.p.hp-=Math.max(1,n*(1-Equipment.bonus(s,'armor')));s.inv=.7;s.hitFlash=.15;Sound.play('hurt');if(s.p.hp<=0)end(false)}
function addHazard(s,h){if(s.hazards.length<36)s.hazards.push({...h,age:0,hit:false})}
function updateJianghu(s,dt){
 s.recoverClock-=dt;if(s.recoverClock<=0){s.recoverClock=20;s.p.hp=Math.min(s.p.max,s.p.hp+Profile.data.training.recovery)}
 s.cultivation=Math.max(0,s.cultivation-dt);if(s.sect&&Equipment.bonus(s,'cycle')>0)s.sect.cooldown=Math.max(0,s.sect.cooldown-dt*Equipment.bonus(s,'cycle')/(1-Equipment.bonus(s,'cycle')));if(Equipment.bonus(s,'cycle')>0&&s.cooldowns)for(const k of Object.keys(s.cooldowns))s.cooldowns[k]=Math.max(0,s.cooldowns[k]-dt*Equipment.bonus(s,'cycle')/(1-Equipment.bonus(s,'cycle')));if(s.cultivation>0&&s.cooldowns)for(const k of Object.keys(s.cooldowns))s.cooldowns[k]=Math.max(0,s.cooldowns[k]-dt*.25);
 for(const o of s.props){if(o.used){o.respawn-=dt;if(o.type!=='barrel'&&o.respawn<=0)o.used=false;continue}if(o.type!=='barrel'&&Math.hypot(o.x-s.p.x,o.y-s.p.y)<30){o.used=true;o.respawn=30;s.cultivation=8;if(o.type==='herb')s.p.hp=Math.min(s.p.max,s.p.hp+12);showNotice(o.type==='herb'?'영초 · 체력 +12 · 8초간 무공 회복 +25%':'오도비 · 8초간 무공 회복 +25%')}}
 for(const h of s.hazards){h.age+=dt;if(h.age<h.delay)continue;const x=s.p.x,y=s.p.y,hit=h.type==='cross'?(Math.abs(x-h.x)<h.width/2&&Math.abs(y-h.y)<h.r||Math.abs(y-h.y)<h.width/2&&Math.abs(x-h.x)<h.r):h.type==='ambush'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width/2:Math.hypot(x-h.x,y-h.y)<h.r;
  if(hit)hurtFromHazard(s,h.damage);if(h.age>=h.delay+h.life)h.dead=true;
 }compact(s.hazards,h=>!h.dead);
 for(const chest of s.treasures)if(!chest.opened&&Math.hypot(chest.x-s.p.x,chest.y-s.p.y)<23){openTreasure(s,chest);break}compact(s.treasures,c=>!c.opened);
}
function breakProp(s,o,n){if(o.used||o.type!=='barrel')return false;o.hp-=n;if(o.hp>0)return true;o.used=true;VFX.cast('blood_burst',o.x,o.y,{r:115,color:'#e5aa64'});Sound.play('heavy');let count=0;for(const e of queryGridRadius(s,o.x,o.y,115)){damage(e,130+s.level*4,Math.atan2(e.y-o.y,e.x-o.x),'stomp');if(++count>=24)break}showNotice('霹靂酒甕 · 주변 적 폭파!');return true}
function strikeProps(s,a,r,n){for(const o of s.props||[]){if(o.used||o.type!=='barrel'||Math.hypot(o.x-s.p.x,o.y-s.p.y)>r)continue;const da=Math.atan2(Math.sin(Math.atan2(o.y-s.p.y,o.x-s.p.x)-a),Math.cos(Math.atan2(o.y-s.p.y,o.x-s.p.x)-a));if(Math.abs(da)<.9){breakProp(s,o,n);return}}}
function projectilePropHit(s,b,oldX,oldY){let near=null,d=Infinity;for(const o of s.props||[]){if(o.used||o.type!=='barrel'||o.x<Math.min(oldX,b.x)-14||o.x>Math.max(oldX,b.x)+14||o.y<Math.min(oldY,b.y)-14||o.y>Math.max(oldY,b.y)+14||segmentDistance(o.x,o.y,oldX,oldY,b.x,b.y)>14)continue;const q=(o.x-oldX)**2+(o.y-oldY)**2;if(q<d){d=q;near=o}}if(!near)return false;const closer=shotTargets(s,oldX,oldY,b.x,b.y).some(e=>!e.dead&&!b.hit.has(e)&&segmentDistance(e.x,e.y,oldX,oldY,b.x,b.y)<16&&(e.x-oldX)**2+(e.y-oldY)**2<d);if(closer)return false;breakProp(s,near,b.damage);return true}
function drawJianghu(s){
 for(const o of s.props||[])if(!o.used)ItemArt.draw(ctx,o.type,o.x,o.y,o.type==='barrel'?30:34);
 for(const chest of s.treasures||[]){ctx.save();ctx.globalAlpha=.35+.15*Math.sin(s.time*4+chest.phase);ctx.strokeStyle='#ffe098';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(chest.x,chest.y+3,20,8,0,0,7);ctx.stroke();ctx.restore();ItemArt.draw(ctx,'chest',chest.x,chest.y,32)}
 for(const h of s.hazards||[]){const active=h.age>=h.delay;ctx.save();ctx.translate(h.x,h.y);ctx.globalAlpha=active?.65:.45+.2*Math.sin(s.time*14);ctx.strokeStyle=active?'#ffe2b0':'#facc75';ctx.fillStyle=active?(h.type==='meteor'?'#712b59':'#b95c48'):'#e29e5128';ctx.lineWidth=active?3:2;ctx.setLineDash(active?[]:[5,4]);
  if(h.type==='cross'){ctx.fillRect(-h.r,-h.width/2,h.r*2,h.width);ctx.fillRect(-h.width/2,-h.r,h.width,h.r*2);ctx.strokeRect(-h.r,-h.width/2,h.r*2,h.width);ctx.strokeRect(-h.width/2,-h.r,h.width,h.r*2)}
  else if(h.type==='ambush'){ctx.lineWidth=h.width;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(h.tx-h.x,h.ty-h.y);ctx.stroke()}
  else{ctx.beginPath();ctx.arc(0,0,h.r,0,7);ctx.fill();ctx.stroke();if(active){ctx.fillStyle='#e5a779';for(let i=0;i<5;i++){const a=i*6.28/5+s.time;ctx.fillRect(Math.cos(a)*h.r*.55-3,Math.sin(a)*h.r*.55-5,6,10)}}}
  ctx.restore();
 }if(s.cultivation>0){ctx.save();ctx.strokeStyle='#a3d9c0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.p.x,s.p.y+3,18,8,0,0,7);ctx.stroke();ctx.restore()}
}
function renderReroll(s){const b=$('#reroll');b.hidden=!s.rerolls;b.textContent='비급 재추첨 · '+s.rerolls+'회';b.onclick=()=>{if(mode!=='upgrade'||s.rerolls<=0)return;s.rerolls--;upgrade(true)}}
addEventListener('keydown',e=>{if(mode==='reward'&&(e.key==='Enter'||e.key===' '||e.key==='Escape')){e.preventDefault();Equipment.decide(false)}});
