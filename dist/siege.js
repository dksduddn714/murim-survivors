'use strict';
let battleMode='blood';
const battles={blood:{name:'혈전',cap:420,interval:.3,batch:5,hp:1.25,speed:1.16},hell:{name:'지옥',cap:540,interval:.23,batch:7,hp:1.65,speed:1.3}};
function battle(){return battles[battleMode]}
function updateSiege(s,dt){
  s.siegeNext=(s.siegeNext??16)-dt;s.siegeWarning=Math.max(0,(s.siegeWarning||0)-dt);
  if(s.siegeNext<=0){s.siegeNext=Math.max(13,24-s.time*.025);s.siegeWarning=2.2;const count=battleMode==='hell'?32:22;for(let i=0;i<count;i++){if(s.enemies.length>=battle().cap)break;spawn();const e=s.enemies.at(-1),a=i*Math.PI*2/count;e.x=s.p.x+Math.cos(a)*(W/2+32);e.y=s.p.y+Math.sin(a)*(H/2+32);e.rush=2.6}showNotice('四面楚歌 · 사방에서 추격대가 몰려옵니다!')}
}
function siegeOverlay(s){if(!s.siegeWarning)return;ctx.save();ctx.globalAlpha=Math.min(.7,s.siegeWarning)*(.55+Math.sin(s.time*16)*.2);ctx.strokeStyle='#ed8666';ctx.lineWidth=5;ctx.strokeRect(5,5,W-10,H-10);ctx.fillStyle='#ffc197';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('포위 증원 · 이동하세요',W/2,Math.min(H-110,150));ctx.restore()}
