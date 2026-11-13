'use strict';
function updateEnemy(e,s,dt){
  e.guardPulse=Math.max(0,(e.guardPulse||0)-dt);e.moving=false;e.attackPose=Math.max(0,(e.attackPose||0)-dt);const oldX=e.x,oldY=e.y;
  if(e.knockX||e.knockY){e.x+=(e.knockX||0)*dt;e.y+=(e.knockY||0)*dt;const decay=Math.exp(-15*dt);e.knockX*=decay;e.knockY*=decay}
  if(e.poisoned>0)e.poisoned=Math.max(0,e.poisoned-dt);
  if(e.chilled>0)e.chilled=Math.max(0,e.chilled-dt);
  if(e.feared>0)e.feared=Math.max(0,e.feared-dt);
  if(e.blackFlame>0){e.blackFlame=Math.max(0,e.blackFlame-dt);e.hp-=dt*14}
  if(e.bleed>0){e.bleed=Math.max(0,e.bleed-dt*.35);e.hp-=dt*(4+e.bleed*3)}
  if(e.hp<=0){damage(e,0,0,'status');return}
  if(e.stun>0){e.stun-=dt;return}
  if(e.boss){updateBoss(e,s,dt);if(e.patternLock>0){e.moving=false;return}}
  const p=s.p,angle=Math.atan2(p.y-e.y,p.x-e.x),distance=Math.hypot(p.x-e.x,p.y-e.y);
  e.fire-=dt;
  let speed=e.speed,direction=e.feared>0?angle+Math.PI:angle;
  if(e.rush>0){e.rush-=dt;speed*=1.45}
  if(e.runner||e.role==='assassin'){
    speed*=1.3;
    if(e.feared<=0&&distance>75&&(s.facing?.x||s.facing?.y))direction=Math.atan2(p.y+(s.facing.y||0)*42-e.y,p.x+(s.facing.x||0)*42-e.x);
  }
  if(e.role==='spearman'&&distance<145)speed*=distance<95?1.32:1.2;
  if(e.poisoned>0)speed*=Math.max(.68,.88-(s.skills[6]||1)*.03);
  if(e.chilled>0)speed*=.65;
  const isRanged=e.role==='archer'||e.role==='sorcerer';
  const isCharger=e.role==='brute'||(!e.role&&e.f===2);
  if(!isRanged&&!isCharger&&distance<54&&e.fire<=0){e.attackPose=.22;e.fire=1.2}
  if(isRanged&&!isCharger&&e.feared<=0&&distance<225)speed=distance<160?-e.speed*.55:0;
  if(isCharger&&e.feared<=0){
    if(e.charge>0){e.charge-=dt;direction=e.chargeAngle;speed=e.charge>.45?0:e.speed*4}
    else if(e.fire<=0&&distance<320){e.charge=1.15;e.chargeAngle=angle;e.fire=e.elite?2.4:3.4;speed=0}
  }
  e.x+=Math.cos(direction)*speed*dt;e.y+=Math.sin(direction)*speed*dt;
  e.separationClock=(e.separationClock||0)-dt;
  if(s.grid&&!e.boss&&e.separationClock<=0){e.separationClock=.08;let sx=0,sy=0,checked=0;const gx=Math.floor(e.x/96),gy=Math.floor(e.y/96);outer:for(let yy=gy-1;yy<=gy+1;yy++)for(let xx=gx-1;xx<=gx+1;xx++)for(const o of s.grid.get(xx+','+yy)||[]){if(o===e||o.dead)continue;if(++checked>24)break outer;const dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy),r=e.role==='brute'||e.role==='shield'?15:12;if(d>0&&d<r){sx+=dx/d*(r-d);sy+=dy/d*(r-d)}}const len=Math.hypot(sx,sy),step=Math.min(1,2.8/(len||1));e.x+=sx*step;e.y+=sy*step}

  e.moving=Math.hypot(e.x-oldX,e.y-oldY)>.01;if(e.moving){e.animTime=(e.animTime||0)+dt;if(Math.abs(e.x-oldX)>.01)e.face=e.x<oldX?-1:1}
  e.aiming=isRanged&&e.fire>0&&e.fire<=.35&&distance<400?e.fire:0;
  if(isRanged&&!e.boss&&!isCharger&&e.fire<=0&&distance<400&&s.hostile.length<200){
    e.attackPose=.22;e.fire=e.boss?1.15:e.role==='sorcerer'?1.9:e.elite?1.7:3.1;
    const count=e.boss?5:e.elite?3:e.role==='sorcerer'?2:1;
    for(let j=0;j<count;j++){const aim=Math.atan2(p.y+(s.facing?.y||0)*55-e.y,p.x+(s.facing?.x||0)*55-e.x);const a=aim+(j-(count-1)/2)*.2;s.hostile.push({x:e.x,y:e.y,vx:Math.cos(a)*(e.f===1?145:115),vy:Math.sin(a)*(e.f===1?145:115),t:3,f:e.f})}
  }
}
// Swept projectile collision avoids skipping small targets during slower frames.
function segmentDistance(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(px-ax-t*dx,py-ay-t*dy)}

function buildEnemyGrid(s){s.grid=new Map();for(const e of s.enemies){if(e.dead)continue;const key=Math.floor(e.x/96)+','+Math.floor(e.y/96);let bucket=s.grid.get(key);if(!bucket)s.grid.set(key,bucket=[]);bucket.push(e)}}
function shotTargets(s,ax,ay,bx,by){if(!s.grid)return s.enemies;const list=[];for(let y=Math.floor((Math.min(ay,by)-34)/96);y<=Math.floor((Math.max(ay,by)+34)/96);y++)for(let x=Math.floor((Math.min(ax,bx)-34)/96);x<=Math.floor((Math.max(ax,bx)+34)/96);x++){const bucket=s.grid.get(x+','+y);if(bucket)list.push(...bucket)}return list}


function queryGridRadius(s,x,y,r){
  if(!s.grid)return s.enemies.filter(e=>!e.dead&&(e.x-x)**2+(e.y-y)**2<r*r);
  const out=[],r2=r*r,x0=Math.floor((x-r)/96),x1=Math.floor((x+r)/96),y0=Math.floor((y-r)/96),y1=Math.floor((y+r)/96);
  for(let gy=y0;gy<=y1;gy++)for(let gx=x0;gx<=x1;gx++){
    const b=s.grid.get(gx+','+gy);if(!b)continue;
    for(let i=0;i<b.length;i++){const e=b[i];if(!e.dead&&(e.x-x)**2+(e.y-y)**2<r2)out.push(e)}
  }
  return out;
}
