'use strict';
function nearest(s){let target=null,best=Infinity;for(const e of s.enemies){if(e.dead)continue;const d=Math.hypot(e.x-s.p.x,e.y-s.p.y);if(d<best){best=d;target=e}}return target}
function runAttacks(s,dt){
  const p=s.p;s.ring+=dt;s.cooldowns??={sword:0,knife:0,stomp:0,lightning:0};for(const k in s.cooldowns)s.cooldowns[k]-=dt;
  const target=nearest(s),angle=target?Math.atan2(target.y-p.y,target.x-p.x):0;
  function shot(a,speed,power,type){s.shots.push({x:p.x,y:p.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,t:1.6,hit:new Set(),damage:power,type})}
  if(target&&s.skills[0]&&s.cooldowns.sword<=0){s.cooldowns.sword=.46;s.swing=.16;const count=s.evolved?7:1+Math.floor(s.skills[0]/2);for(let j=0;j<count;j++)shot(angle+(j-(count-1)/2)*.24,430,20+s.skills[0]*10,'sword')}
  if(target&&s.skills[1]&&s.cooldowns.knife<=0){s.cooldowns.knife=Math.max(.18,.5-s.skills[1]*.05);const count=s.rain?12:1+Math.floor(s.skills[1]/2);for(let j=0;j<count;j++)shot(s.rain?j*Math.PI*2/count:angle+(j-(count-1)/2)*.13,540,14+s.skills[1]*6,'knife')}
  if(s.skills[3]&&s.cooldowns.stomp<=0){s.cooldowns.stomp=s.thunder?1.1:1.65;const r=80+s.skills[3]*14;s.effects.push({x:p.x,y:p.y,r,t:.45,max:.45,color:s.thunder?'#f9c87b':factions[selected].color});for(const e of s.enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<r)damage(e,(22+s.skills[3]*13)*(s.thunder?1.5:1))}
  if(s.skills[6])for(const e of s.enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<70+s.skills[6]*13)damage(e,dt*(7+s.skills[6]*8));
  if(target&&s.skills[7]&&s.cooldowns.lightning<=0){s.cooldowns.lightning=1.5;const targets=s.enemies.filter(e=>!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<500).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,1+s.skills[7]);for(const e of targets){damage(e,25+s.skills[7]*15);s.effects.push({x:e.x,y:e.y,r:22,t:.3,max:.3,color:'#ffe5a1',lightning:true})}}
}
