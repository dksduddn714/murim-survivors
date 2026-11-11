'use strict';
function updateEnemy(e,s,dt){
  if(e.boss)updateBoss(e,s,dt);const p=s.p,angle=Math.atan2(p.y-e.y,p.x-e.x),distance=Math.hypot(p.x-e.x,p.y-e.y);e.fire-=dt;
  let speed=e.speed,direction=angle;
  if(e.f===1&&distance<230)speed=distance<165?-e.speed*.55:0;
  if(e.f===2){
    if(e.charge>0){e.charge-=dt;direction=e.chargeAngle;speed=e.charge>.45?0:e.speed*4}
    else if(e.fire<=0&&distance<320){e.charge=1.15;e.chargeAngle=angle;e.fire=e.elite?3.2:4.5;speed=0}
  }
  e.x+=Math.cos(direction)*speed*dt;e.y+=Math.sin(direction)*speed*dt;
  if(e.f!==2&&e.fire<=0&&distance<400&&s.hostile.length<200){
    e.fire=e.boss?1.4:e.elite?2.4:4.5;
    const count=e.boss?5:e.elite?3:1;
    for(let j=0;j<count;j++){const a=angle+(j-(count-1)/2)*.2;s.hostile.push({x:e.x,y:e.y,vx:Math.cos(a)*(e.f===1?145:110),vy:Math.sin(a)*(e.f===1?145:110),t:3,f:e.f})}
  }
}
// Swept projectile collision avoids skipping small targets during slower frames.
function segmentDistance(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(px-ax-t*dx,py-ay-t*dy)}
