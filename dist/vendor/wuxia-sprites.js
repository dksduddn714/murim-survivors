'use strict';
/* Project-authored C-style pixel sprites. MIT. Integer-grid art, cached frames. */
const WuxiaSprites=(()=>{
 const cache=new Map(),O='#211f2b',skin='#edb58c',light='#ffdab0',hair='#302c37',hairHi='#504550';
 const palettes=[['#e9e0ce','#acb5b1','#398c94'],['#965364','#623747','#d6a367'],['#686080','#403950','#bc7ba6']];
 const heroNames=[['소림사','무당파','화산파','개방'],['혈도객','독공술사','귀영살수','녹림도왕'],['천마신교','혈마전','귀마전','흑염전']];
 const roles=['disciple','spearman','archer','assassin','shield','brute','sorcerer','boss'];
 function build(f,role,sub,frame,hit){
  const key=[f,role,sub,frame,hit].join(':');if(cache.has(key))return cache.get(key);
  const c=document.createElement('canvas');c.width=40;c.height=40;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const hero=role==='hero',big=role==='brute'||role==='boss',monk=hero&&f===0&&sub===0;
  let [cloth,shade,accent]=palettes[f]||palettes[0];
  if(hero){const sets=[['#daaf6a','#947348','#d97a60'],['#e9e0ce','#a1aaa7','#398c94'],['#e4d4da','#a18ca6','#db8a9a'],['#8a9d78','#58694f','#d7be76']];if(f===0)[cloth,shade,accent]=sets[sub];if(f===1&&sub===1)[cloth,shade,accent]=['#687a69','#384a4a','#b7c577'];if(f===1&&sub===2)[cloth,shade,accent]=['#4d536a','#31384e','#9db8ba'];if(f===2&&sub===1)accent='#d0757f';if(f===2&&sub===3)[cloth,shade,accent]=['#4f4a62','#303044','#d69d6c'];}
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  function line(x,y,x1,y1,col,width=1){const dx=Math.abs(x1-x),sx=x<x1?1:-1,dy=-Math.abs(y1-y),sy=y<y1?1:-1;let e=dx+dy;while(true){r(x,y,width,width,col);if(x===x1&&y===y1)break;const t=2*e;if(t>=dy){e+=dy;x+=sx}if(t<=dx){e+=dx;y+=sy}}}
  const walk=frame===1?1:0,bob=frame===1?1:0;
  // Stepped pixel shadow, boots and trouser folds.
  r(9,35,23,2,'#18252d55');r(12,34,17,3,'#18252d55');
  r(13,29,6,6-walk,O);r(22,29,6,6+walk,O);r(13,34-walk,7,3,O);r(22,34+walk,8,2,O);
  r(14,29,4,4-walk,'#50505b');r(23,29,4,4+walk,'#50505b');r(14,34-walk,4,1,'#78717b');
  const bx=big?10:12,bw=big?21:17;
  r(bx,19+bob,bw,12,O);r(bx+1,20+bob,bw-2,9,cloth);r(bx+2,21+bob,4,7,shade);r(bx+bw-4,21+bob,3,7,shade);
  r(18,20+bob,3,8,shade);line(15,20+bob,22,26+bob,light);r(bx+1,27+bob,bw-2,3,O);r(bx+2,27+bob,bw-4,1,accent);r(22,29+bob,3,4,accent);
  // Wide sleeves and little outlined fists.
  r(bx-3,21+bob,5,7,O);r(bx-2,22+bob,4,3,cloth);r(bx-2,25+bob,4,3,skin);r(bx-1,25+bob,2,1,light);
  r(bx+bw-1,21+bob,5,7,O);r(bx+bw,22+bob,3,3,shade);r(bx+bw,25+bob,3,2,skin);
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
   const attack=frame===2;
   if(weapon==='sword'||weapon==='dagger'||weapon==='cleaver'){
    const ex=attack?38:36,ey=attack?22:weapon==='dagger'?19:12;
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
 function paint(ctx,x,y,f,role,sub,t,swing,hit,scale){
  const frame=swing>0?2:Math.floor(t*7)%2;
  const image=build(f,role,sub,frame,hit);
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.drawImage(image,Math.round(x)-20*scale,Math.round(y)-34*scale,40*scale,40*scale);ctx.restore();
 }
 function drawHero(ctx,x,y,f,t,swing=0,sub=0){const portrait=ctx.canvas&&ctx.canvas.width<=64;paint(ctx,x,y,f,'hero',sub,t,swing,false,portrait?1:2)}
 function drawEnemy(ctx,e,t){const role=e.boss?'boss':e.role||'disciple';paint(ctx,e.x,e.y,e.f||0,role,0,t+(e.x||0)*.01,e.charge>.4?.1:0,e.hit>0,e.boss?3:2)}
 return {drawHero,drawEnemy,heroNames,roles,frame:build,get cachedFrames(){return cache.size},style:'C',cellSize:40};
})();
