'use strict';
let battleMode='blood';
const battles={blood:{name:'혈전',cap:420,interval:.3,batch:5,hp:1.25,speed:1.16},hell:{name:'지옥',cap:540,interval:.23,batch:7,hp:1.65,speed:1.3}};
function battle(){return battles[battleMode]}
function updateSiege(s,dt){
  s.siegeNext=(s.siegeNext??16)-dt;s.siegeWarning=Math.max(0,(s.siegeWarning||0)-dt);
  if(s.siegeNext<=0){
    s.siegeNext=Math.max(13,24-s.time*.025);s.siegeWarning=2.2;
    const count=battleMode==='hell'?32:22,gap=Math.floor(Math.random()*count);
    for(let i=0;i<count;i++){
      if(s.enemies.length>=battle().cap)break;
      spawn();const e=s.enemies.at(-1),a=i*Math.PI*2/count;
      const distMult=Math.abs(i-gap)<=1?1.24:1;
      e.x=s.p.x+Math.cos(a)*(W/2+32)*distMult;e.y=s.p.y+Math.sin(a)*(H/2+32)*distMult;
      e.rush=2.6;
      if(i===0){e.elite=true;e.siegeLeader=true;e.hp=e.max*=1.8;e.name='포위 선봉장'}
      else if(i%4===0)e.runner=true;
    }
    showNotice('四面楚歌 · 사방에서 포위망이 좁혀옵니다! (선봉장 처치 시 내공 대량 획득)');
  }
}
function siegeOverlay(s){if(!s.siegeWarning)return;ctx.save();ctx.globalAlpha=Math.min(.7,s.siegeWarning)*(.55+Math.sin(s.time*16)*.2);ctx.strokeStyle='#ed8666';ctx.lineWidth=5;ctx.strokeRect(5,5,W-10,H-10);ctx.fillStyle='#ffc197';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('포위 증원 · 선봉장을 베거나 빈틈으로 돌파하세요',W/2,Math.min(H-110,150));ctx.restore()}
