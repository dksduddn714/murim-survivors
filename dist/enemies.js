'use strict';
function updateEnemy(e,s,dt){
  if(e.knockX||e.knockY){e.x+=(e.knockX||0)*dt;e.y+=(e.knockY||0)*dt;const decay=Math.exp(-14*dt);e.knockX*=decay;e.knockY*=decay}if(e.stun>0){e.stun-=dt;return}if(e.boss)updateBoss(e,s,dt);const p=s.p,angle=Math.atan2(p.y-e.y,p.x-e.x),distance=Math.hypot(p.x-e.x,p.y-e.y);e.fire-=dt;
  let speed=e.speed,direction=angle;if(e.rush>0){e.rush-=dt;speed*=1.5}if(e.runner)speed*=1.3;
  if(e.f===1&&distance<230)speed=distance<165?-e.speed*.55:0;
  if(e.f===2){
    if(e.charge>0){e.charge-=dt;direction=e.chargeAngle;speed=e.charge>.45?0:e.speed*4}
    else if(e.fire<=0&&distance<320){e.charge=1.15;e.chargeAngle=angle;e.fire=e.elite?2.4:3.4;speed=0}
  }
  e.x+=Math.cos(direction)*speed*dt;e.y+=Math.sin(direction)*speed*dt;
  if(e.f!==2&&e.fire<=0&&distance<400&&s.hostile.length<200){
    e.fire=e.boss?1.15:e.elite?1.7:3.1;
    const count=e.boss?5:e.elite?3:1;
    for(let j=0;j<count;j++){const aim=Math.atan2(p.y+(s.facing?.y||0)*55-e.y,p.x+(s.facing?.x||0)*55-e.x);const a=aim+(j-(count-1)/2)*.2;s.hostile.push({x:e.x,y:e.y,vx:Math.cos(a)*(e.f===1?145:110),vy:Math.sin(a)*(e.f===1?145:110),t:3,f:e.f})}
  }
}
// Swept projectile collision avoids skipping small targets during slower frames.
function segmentDistance(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(px-ax-t*dx,py-ay-t*dy)}

function buildEnemyGrid(s){s.grid=new Map();for(const e of s.enemies){if(e.dead)continue;const key=Math.floor(e.x/96)+','+Math.floor(e.y/96);let bucket=s.grid.get(key);if(!bucket)s.grid.set(key,bucket=[]);bucket.push(e)}}
function shotTargets(s,ax,ay,bx,by){if(!s.grid)return s.enemies;const list=[];for(let y=Math.floor((Math.min(ay,by)-34)/96);y<=Math.floor((Math.max(ay,by)+34)/96);y++)for(let x=Math.floor((Math.min(ax,bx)-34)/96);x<=Math.floor((Math.max(ax,bx)+34)/96);x++){const bucket=s.grid.get(x+','+y);if(bucket)list.push(...bucket)}return list}
