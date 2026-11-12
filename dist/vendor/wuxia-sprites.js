'use strict';
/* Project-authored C-style pixel sprites. MIT. Integer-grid art, cached frames. */
const WuxiaSprites=(()=>{
 const cache=new Map(),O='#211f2b',skin='#edb58c',light='#ffdab0',hair='#302c37',hairHi='#504550';
 const palettes=[['#e9e0ce','#acb5b1','#398c94'],['#965364','#623747','#d6a367'],['#686080','#403950','#bc7ba6']];
 const heroNames=[['소림사','무당파','화산파','개방'],['혈도객','독공술사','귀영살수','녹림도왕'],['천마신교','혈마전','귀마전','흑염전']];
 const roles=['disciple','spearman','archer','assassin','shield','brute','sorcerer','boss'];
 function build(f,role,sub,frame,hit,attack=false){
  const key=[f,role,sub,frame,hit,attack].join(':');if(cache.has(key))return cache.get(key);
  const c=document.createElement('canvas');c.width=40;c.height=40;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const hero=role==='hero',big=role==='brute'||role==='boss',monk=hero&&f===0&&sub===0;
  let [cloth,shade,accent]=palettes[f]||palettes[0];
  if(hero){const sets=[['#daaf6a','#947348','#d97a60'],['#e9e0ce','#a1aaa7','#398c94'],['#e4d4da','#a18ca6','#db8a9a'],['#8a9d78','#58694f','#d7be76']];if(f===0)[cloth,shade,accent]=sets[sub];if(f===1&&sub===1)[cloth,shade,accent]=['#687a69','#384a4a','#b7c577'];if(f===1&&sub===2)[cloth,shade,accent]=['#4d536a','#31384e','#9db8ba'];if(f===2&&sub===1)accent='#d0757f';if(f===2&&sub===3)[cloth,shade,accent]=['#4f4a62','#303044','#d69d6c'];}
  const bodyWidths={disciple:1,spearman:.82,archer:.9,assassin:.8,shield:1.18,brute:1.35,sorcerer:.86,boss:1.15};
  const bodyWidth=hero?[1.15,.85,.9,1.15,1.05,.85,.78,1.3,1,.95,.82,1.08][f*4+sub]:(bodyWidths[role]||1);
  const r=(x,y,w,h,col)=>{g.fillStyle=col;const body=y>=20;const k=body?bodyWidth:1;g.fillRect(Math.round(20+(x-20)*k),Math.round(y),Math.max(1,Math.round(w*k)),Math.max(1,Math.round(h)))};
  function line(x,y,x1,y1,col,width=1){const dx=Math.abs(x1-x),sx=x<x1?1:-1,dy=-Math.abs(y1-y),sy=y<y1?1:-1;let e=dx+dy;while(true){r(x,y,width,width,col);if(x===x1&&y===y1)break;const t=2*e;if(t>=dy){e+=dy;x+=sx}if(t<=dx){e+=dx;y+=sy}}}
  const stride=frame===1?2:frame===3?-2:0,bob=frame===1||frame===3?1:0;
  const walk=Math.abs(stride);
  r(9,36,23,2,'#18252d55');
  // Alternate whole legs, knees and feet; attack never replaces locomotion.
  const ly=30+stride,ry=30-stride;
  r(13,ly,6,6,O);r(22,ry,6,6,O);r(13,ly,4,4,'#555364');r(23,ry,4,4,'#555364');
  r(12+(stride<0?-1:0),ly+5,8,2,O);r(22+(stride>0?1:0),ry+5,8,2,O);
  r(13,ly+5,5,1,'#8b8290');r(23,ry+5,5,1,'#8b8290');
  const bx=big?10:12,bw=big?21:17;
  r(bx,19+bob,bw,12,O);r(bx+1,20+bob,bw-2,9,cloth);r(bx+2,21+bob,4,7,shade);r(bx+bw-4,21+bob,3,7,shade);
  r(18,20+bob,3,8,shade);line(15,20+bob,22,26+bob,light);r(bx+1,27+bob,bw-2,3,O);r(bx+2,27+bob,bw-4,1,accent);r(22,29+bob,3,4,accent);
  // Wide sleeves and little outlined fists.
  r(bx-3,21+bob+stride,5,7,O);r(bx-2,22+bob+stride,4,3,cloth);r(bx-2,25+bob+stride,4,3,skin);r(bx-1,25+bob+stride,2,1,light);
  r(bx+bw-1,21+bob-stride,5,7,O);r(bx+bw,22+bob-stride,3,3,shade);r(bx+bw,25+bob-stride,3,2,skin);
  // Large stepped head; cheek shadows remain a single visible pixel cluster.
  r(13,6+bob,14,2,O);r(11,8+bob,18,11,O);r(13,19+bob,14,2,O);
  r(13,8+bob,14,10,skin);r(14,9+bob,12,7,light);r(13,17+bob,13,2,skin);r(10,13+bob,3,4,O);r(11,14+bob,2,2,skin);
  if(!monk){
   r(13,5+bob,13,3,O);r(11,8+bob,18,5,hair);r(12,7+bob,16,3,hair);r(12,9+bob,4,6,hair);r(17,10+bob,4,3,hair);r(22,9+bob,5,5,hair);
   r(14,7+bob,7,2,hairHi);r(12,10+bob,2,2,hairHi);r(21,10+bob,3,1,hairHi);
   r(12,2+bob,8,4,O);r(13,2+bob,6,3,hair);r(14,2+bob,3,1,hairHi);r(11,6+bob,7,2,accent);
   r(7,6+bob,5,2,accent);r(5,8+bob,5,2,accent);r(7,10+bob,3,3,shade);
   if(hero&&sub===1){r(9,12+bob,3,10,hair);r(7,17+bob,3,5,hair);r(10,14+bob,1,6,hairHi)}
   if(hero&&sub===2){r(27,7+bob,5,3,hair);r(29,9+bob,3,6,hair);r(30,12+bob,3,4,hairHi)}
   if(hero&&sub===3){g.clearRect(12,2+bob,8,4);r(16,4+bob,10,3,hair);r(14,9+bob,13,1,accent);r(7,10+bob,5,2,accent)}
  }else{r(14,7+bob,10,1,skin);r(16,9+bob,1,1,'#bb836e');r(20,9+bob,1,1,'#bb836e');}
  if(hero){
   if(f===0&&sub===1){r(8,10+bob,4,15,hair);r(6,17+bob,3,9,hair);r(8,14+bob,1,9,hairHi);r(11,24+bob,3,7,cloth)}
   if(f===0&&sub===2){r(28,6+bob,5,4,hair);r(30,10+bob,3,9,hair);r(28,18+bob,4,5,hair);r(28,7+bob,3,2,'#d68fa5')}
   if(f===0&&sub===3){r(11,6+bob,18,4,'#665b42');r(8,9+bob,24,2,'#a58b55');r(13,20+bob,4,7,'#52664f');r(24,22+bob,3,4,skin)}
   if(f===1&&sub===0){r(11,6+bob,17,2,'#ad4c54');r(8,7+bob,4,3,'#ad4c54');r(6,10+bob,4,3,'#ad4c54');r(13,19+bob,13,3,'#b36369')}
   if(f===1&&sub===1){r(10,6+bob,19,9,'#3f594e');r(12,4+bob,15,5,'#6c8570');r(11,15+bob,3,7,'#3f594e');r(25,15+bob,4,7,'#3f594e');r(15,26+bob,3,3,'#c5d287')}
   if(f===1&&sub===2){r(10,5+bob,19,7,'#383c53');r(12,3+bob,15,5,'#42465d');r(13,17+bob,15,4,'#333548');r(25,19+bob,8,2,accent);r(30,21+bob,6,2,accent)}
   if(f===1&&sub===3){r(11,3+bob,4,6,hair);r(15,2+bob,5,5,hair);r(22,3+bob,5,4,hair);r(15,18+bob,11,3,hair);r(15,20+bob,4,7,skin)}
   if(f===2&&sub===0){r(11,6+bob,18,2,'#b7a571');r(13,3+bob,3,4,'#d2bc85');r(24,3+bob,3,4,'#d2bc85');r(9,21+bob,3,10,'#4b425c');r(29,21+bob,3,10,'#4b425c')}
   if(f===2&&sub===1){r(11,6+bob,17,2,'#c66a78');r(26,8+bob,4,9,hair);r(29,15+bob,3,7,hair);r(12,19+bob,16,3,'#9e435b')}
   if(f===2&&sub===2){r(10,6+bob,19,7,'#aaa3b5');r(10,11+bob,4,14,'#aaa3b5');r(27,10+bob,3,13,'#817c94');r(14,5+bob,12,2,'#d2c8d4')}
   if(f===2&&sub===3){r(12,4+bob,5,4,hair);r(20,3+bob,5,5,hair);r(25,5+bob,4,6,hair);r(13,19+bob,15,3,'#b17c53');r(11,22+bob,3,7,'#9b653d')}
  }
  if(role==='spearman'){r(10,7+bob,20,2,accent);r(10,13+bob,3,7,hair)}
  if(role==='archer'){r(10,7+bob,20,6,shade);r(8,11+bob,24,2,cloth)}
  if(role==='brute'){r(10,10+bob,3,7,skin);r(28,10+bob,3,7,skin);r(12,5+bob,17,3,hair);r(16,18+bob,11,4,hair)}
  // C-style dot eyes, no smooth outlines or subpixel transforms.
  r(17,14+bob,2,3,O);r(24,14+bob,2,3,O);r(16,17+bob,2,1,'#d59083');r(25,17+bob,2,1,'#d59083');
  if(!hero){r(16,12+bob,3,1,O);r(23,12+bob,3,1,O)}
  if(monk)for(let i=0;i<5;i++)r(14+i*2,22+(i<2?i:4-i)+bob,2,2,'#664a37');
  let weapon=role==='spearman'?'spear':role==='archer'?'bow':role==='sorcerer'?'staff':role==='brute'?'cleaver':'sword';
  if(hero){if(f===0&&(sub===0||sub===3))weapon='staff';if(f===1&&sub===2)weapon='dagger';if(f===1&&sub===3)weapon='cleaver';if(f===1&&sub===1||f===2&&sub===2)weapon='talisman';}
  if(role==='shield'){
   r(9,5+bob,20,6,O);r(11,4+bob,16,6,'#555866');r(14,2+bob,10,3,'#555866');r(17,1+bob,4,2,'#747783');r(10,9+bob,18,2,'#96949a');r(10,11+bob,4,9,'#414350');r(11,12+bob,2,6,'#696a78');
   for(let y=21;y<27;y+=2)r(15,y+bob,12,1,'#73717e');
   r(26,20,11,14,O);r(28,18,7,18,O);r(28,21,7,12,'#8e705c');r(29,20,2,13,'#b79577');r(33,21,2,12,'#66534d');r(27,25,9,2,'#7e8089');r(28,20,7,1,'#aaa2a0');
  }else if(role==='assassin'){
   r(13,17+bob,15,4,'#424255');r(13,19+bob,13,1,accent);r(26,19+bob,6+walk,2,accent);weapon='dagger';
  }else if(role==='brute'){
   r(12,20+bob,5,5,skin);r(24,20+bob,5,5,skin);r(17,18+bob,9,3,hair);r(19,19+bob,7,3,hair);r(16,15+bob,3,1,O);
  }else if(role==='sorcerer'){r(12,5+bob,17,4,shade);r(16,2+bob,10,3,cloth);r(18,1+bob,6,2,accent);r(19,5+bob,3,5,accent)}
  else if(role==='boss'){r(12,3+bob,17,4,O);r(14,2+bob,3,4,'#e0bd76');r(20,1+bob,3,5,'#e0bd76');r(26,2+bob,2,4,'#e0bd76');r(11,20+bob,3,11,accent);r(27,20+bob,4,11,accent);weapon='cleaver';}
  if(role!=='shield'){
   const striking=attack;
   if(weapon==='sword'||weapon==='dagger'||weapon==='cleaver'){
    const ex=striking?38:36,ey=striking?22:weapon==='dagger'?19:12;
    line(29,25,ex,ey,O,3);line(30,24,ex,ey,'#c2c9d8',weapon==='cleaver'?3:1);line(31,23,ex,ey,'#f0eade');
    r(28,25,4,2,accent);r(28,27,2,3,'#795747');
   }else if(weapon==='spear'){line(29,33,36,5,O,3);line(30,33,37,6,'#a17d58');line(35,10,38,1,O,2);line(36,9,38,2,'#dce4e8');r(34,11,4,2,accent);}
   else if(weapon==='staff'){r(32,8,3,28,O);r(33,9,1,26,'#b59664');r(31,6,5,5,O);r(32,7,3,3,accent);r(33,8,1,1,'#ffe0a0');}
   else if(weapon==='bow'){line(31,13,35,18,O,2);line(35,18,36,27,O,2);line(36,27,31,33,O,2);line(32,14,36,25,'#b58f66');line(31,14,31,32,'#d2b98b');line(27,24,39,24,'#c4cdd4');}
   else{r(30,20,6,8,O);r(31,21,4,6,'#e6c98b');r(32,22,2,1,accent);r(32,24,1,2,accent);}
  }
  if(hit){g.globalCompositeOperation='source-atop';g.fillStyle='#fff5d8aa';g.fillRect(0,0,40,40);g.globalCompositeOperation='source-over';}
  cache.set(key,c);return c;
 }
 function animationFrame(clock,moving){return moving?1+Math.floor(clock*10)%4:0}
 function paint(ctx,x,y,f,role,sub,t,swing,hit,scale,moving=true,face=1){
  const frame=animationFrame(t,moving),image=build(f,role,sub,frame,hit,swing>0);
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x),Math.round(y));
  if(face<0)ctx.scale(-1,1);
  ctx.drawImage(image,-20*scale,-34*scale,40*scale,40*scale);ctx.restore();
 }
 function drawHero(ctx,x,y,f,t,swing=0,sub=0,motion=null){const portrait=ctx.canvas&&ctx.canvas.width<=64;paint(ctx,x,y,f,'hero',sub,motion?.clock??t,swing,false,portrait?1:2,motion?.moving??false,motion?.face??1)}
 function drawEnemy(ctx,e,t){const role=e.boss?'boss':e.role||'disciple';paint(ctx,e.x,e.y,e.f||0,role,0,e.animTime??t,e.attackPose||e.charge>.4?.1:0,e.hit>0,e.boss?3:2,e.moving??false,e.face??1)}
 return {drawHero,drawEnemy,animationFrame,heroNames,roles,frame:build,get cachedFrames(){return cache.size},style:'C',cellSize:40};
})();
