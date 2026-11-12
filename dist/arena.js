'use strict';
const ARENA=Object.freeze({left:-1200,right:1200,top:-800,bottom:800,width:2400,height:1600});
function keepInArena(entity,margin=18){entity.x=Math.max(ARENA.left+margin,Math.min(ARENA.right-margin,entity.x));entity.y=Math.max(ARENA.top+margin,Math.min(ARENA.bottom-margin,entity.y));return entity}
function drawArenaBoundary(p){
  ctx.save();ctx.fillStyle='#121c2bd9';
  const x=p.x-W/2-128,y=p.y-H/2-128,w=W+256,h=H+256;
  if(x<ARENA.left)ctx.fillRect(x,y,ARENA.left-x,h);
  if(x+w>ARENA.right)ctx.fillRect(ARENA.right,y,x+w-ARENA.right,h);
  if(y<ARENA.top)ctx.fillRect(ARENA.left,y,ARENA.width,ARENA.top-y);
  if(y+h>ARENA.bottom)ctx.fillRect(ARENA.left,ARENA.bottom,ARENA.width,y+h-ARENA.bottom);
  ctx.strokeStyle='#cead6e';ctx.lineWidth=5;ctx.strokeRect(ARENA.left,ARENA.top,ARENA.width,ARENA.height);ctx.restore();
}
function minimapPoint(x,y){return {x:8+(Math.max(ARENA.left,Math.min(ARENA.right,x))-ARENA.left)/ARENA.width*144,y:8+(Math.max(ARENA.top,Math.min(ARENA.bottom,y))-ARENA.top)/ARENA.height*96}}
function drawMinimap(s){
  const canvas=$('#minimap');canvas.hidden=!s||mode==='menu';if(!s)return;
  const m=canvas.getContext('2d');m.clearRect(0,0,160,132);m.fillStyle='#101825ed';m.fillRect(0,0,160,132);
  m.strokeStyle='#bd9d65';m.lineWidth=1;m.strokeRect(8,8,144,96);
  const v=minimapPoint(s.p.x-W/2,s.p.y-H/2),v2=minimapPoint(s.p.x+W/2,s.p.y+H/2);
  m.fillStyle='#c0d2d815';m.fillRect(v.x,v.y,v2.x-v.x,v2.y-v.y);m.strokeStyle='#b0c9db80';m.strokeRect(v.x,v.y,v2.x-v.x,v2.y-v.y);
  function dot(e,color,size){const p=minimapPoint(e.x,e.y);m.fillStyle=color;m.fillRect(Math.round(p.x-size/2),Math.round(p.y-size/2),size,size)}
  for(const e of s.enemies)if(!e.dead)dot(e,e.boss?'#ff5470':'#e98b79',e.boss?5:2);
  for(const d of s.drops)if(!d.dead)dot(d,d.type==='magnet'?'#b99cff':'#95d789',3);
  if(s.merchant){const a=minimapPoint(s.merchant.x,s.merchant.y);m.fillStyle=s.merchant.bought?'#7e7b72':'#ffd66b';m.fillRect(a.x-3,a.y-3,6,6);m.strokeStyle='#372918';m.strokeRect(a.x-3,a.y-3,6,6)}
  dot(s.p,'#6ee7ed',5);m.fillStyle='#d8e5eb';m.font='9px sans-serif';m.textAlign='left';m.fillText('나  · 적  ◆상인',10,118);m.fillStyle='#6ee7ed';m.fillRect(9,125,4,3);m.fillStyle='#e98b79';m.fillRect(46,125,4,3);m.fillStyle='#ffd66b';m.fillRect(84,125,4,3);
}
