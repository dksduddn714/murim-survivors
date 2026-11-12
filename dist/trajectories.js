'use strict';
function projectilePolicy(type,style,scale=1){
 if(style==='taiji')return {mode:'pierce',remainingHits:scale>1.2?4:3};
 if(style==='blood_spear')return {mode:'pierce',remainingHits:4};
 if(style==='demonic_slash')return {mode:'pierce',remainingHits:3};
 if(style==='blood_blade'||style==='cleaver_wave')return {mode:'pierce',remainingHits:2};
 if(style==='shadow_dagger'||style==='wraith')return {mode:'bounce',remainingHits:2};
 if(style==='emerald_staff'||style==='dharma_wheel')return {mode:'return',remainingHits:2,returning:false,flight:.38};
 if(style==='venom_wave')return {mode:'field',remainingHits:1,blast:48};
 if(style==='plum'||style==='plum_dagger')return {mode:'burst',remainingHits:1,blast:30};
 if(type==='fire'||style==='black_dragon')return {mode:'burst',remainingHits:1,blast:style==='black_dragon'?64:44};
 return {mode:'single',remainingHits:1};
}
function nearestShotTarget(s,b,r=270){let near=null,best=r*r;const targets=s.grid?shotTargets(s,b.x-r,b.y-r,b.x+r,b.y+r):s.enemies;for(const e of targets){if(e.dead||b.hit.has(e))continue;const d=(e.x-b.x)**2+(e.y-b.y)**2;if(d<best){best=d;near=e}}return near}
function projectileImpact(s,b,e){
 if(b.mode==='burst'){let count=0;for(const o of shotTargets(s,b.x-b.blast,b.y-b.blast,b.x+b.blast,b.y+b.blast)){if(o===e||o.dead||(o.x-e.x)**2+(o.y-e.y)**2>b.blast*b.blast)continue;damage(o,b.damage*.4,Math.atan2(o.y-e.y,o.x-e.x),b.signature?'signature':b.type);if(++count>=4)break}VFX.cast(b.style.startsWith('plum')?'petals':'impact_burst',e.x,e.y,{r:b.blast,color:b.style.startsWith('plum')?'#f2a9c1':'#f5b476'})}
 if(b.mode==='field'){s.weaponFields??=[];s.weaponFields.push({x:e.x,y:e.y,r:b.blast,t:1.5,tick:0,damage:b.damage*.14});if(s.weaponFields.length>6)s.weaponFields.shift()}
 b.remainingHits--;
 if(b.mode==='bounce'&&b.remainingHits>0){const o=nearestShotTarget(s,b,185);if(o){const speed=Math.hypot(b.vx,b.vy),a=Math.atan2(o.y-b.y,o.x-b.x);b.vx=Math.cos(a)*speed;b.vy=Math.sin(a)*speed;b.damage*=.75;b.target=o}else b.t=0}
 else if(b.mode==='return'&&b.remainingHits<=0&&!b.returning){b.returning=true;b.remainingHits=2;b.hit.clear()}
 else if(b.remainingHits<=0)b.t=0;
}
function updateWeaponFields(s,dt){if(!s.weaponFields)return;compact(s.weaponFields,f=>{f.t-=dt;f.tick-=dt;if(f.tick<=0){f.tick=.3;let count=0;for(const e of shotTargets(s,f.x-f.r,f.y-f.r,f.x+f.r,f.y+f.r)){if(e.dead||(e.x-f.x)**2+(e.y-f.y)**2>f.r*f.r)continue;e.poisoned=.4;damage(e,f.damage,0,'poison');if(++count>=6)break}}return f.t>0})}
