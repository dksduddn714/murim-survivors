'use strict';
/* Original 64px character art in 96px animation cells. Integer scanline rasterization. MIT. */
const WuxiaSprites=(()=>{
 const cache=new Map(),O='#232332',skin='#dca27d',skinLight='#f7cc9e',skinShade='#b47360';
 const heroNames=[['소림사','무당파','화산파','개방'],['혈도객','독공술사','귀영살수','녹림도왕'],['천마신교','혈마전','귀마전','흑염전']];
 const roles=['disciple','spearman','archer','assassin','shield','brute','sorcerer','boss'];
 const outfits=[
  {main:'#c69655',light:'#ecd29a',shade:'#875c3d',accent:'#a34b3e',hair:'bald',body:'monk',weapon:'staff'},
  {main:'#deddd1',light:'#fff0d8',shade:'#929f9b',accent:'#4b929b',hair:'long',body:'robe',weapon:'sword'},
  {main:'#cdb6c9',light:'#f7d9db',shade:'#897895',accent:'#c97592',hair:'ponytail',body:'dress',weapon:'sword'},
  {main:'#8b9a70',light:'#c0c49a',shade:'#53654c',accent:'#d3b467',hair:'hat',body:'ragged',weapon:'staff'},
  {main:'#965367',light:'#cb8b8f',shade:'#583448',accent:'#d99c6e',hair:'bandana',body:'vest',weapon:'cleaver'},
  {main:'#64877a',light:'#a6b79a',shade:'#3c5255',accent:'#d6d796',hair:'hood',body:'robe',weapon:'talisman'},
  {main:'#515b76',light:'#8c9eb0',shade:'#30354e',accent:'#a0c4c2',hair:'mask',body:'ninja',weapon:'dagger'},
  {main:'#a17d51',light:'#d9b581',shade:'#674832',accent:'#b77553',hair:'spiky',body:'muscle',weapon:'cleaver'},
  {main:'#69617f',light:'#a99cba',shade:'#3b394f',accent:'#d7bd79',hair:'crown',body:'mantle',weapon:'sword'},
  {main:'#9c5268',light:'#d89b9f',shade:'#5b3549',accent:'#d4b480',hair:'high',body:'dress',weapon:'spear'},
  {main:'#858298',light:'#cfbcd2',shade:'#464660',accent:'#be8eaf',hair:'silver',body:'robe',weapon:'talisman'},
  {main:'#56546c',light:'#9b93a9',shade:'#303347',accent:'#cd9b6f',hair:'mohawk',body:'mantle',weapon:'sword'}
 ];
 const bodyTypes={disciple:{w:19,leg:12,head:27},spearman:{w:15,leg:17,head:25},archer:{w:17,leg:14,head:25},assassin:{w:15,leg:11,head:25},shield:{w:26,leg:10,head:26},brute:{w:32,leg:9,head:30},sorcerer:{w:17,leg:12,head:24},boss:{w:25,leg:14,head:28}};
 function attackFrame(progress){if(progress<0)return 0;return Math.min(5,Math.floor(progress*6))}
 function animationFrame(clock,moving){return moving?1+Math.floor(clock*10)%8:0}
 function build(f,role,sub,walkFrame,hit,attack=0){
  const pose=attack===true?3:Number(attack)||0,key=[f,role,sub,walkFrame,hit,pose].join(':');if(cache.has(key))return cache.get(key);
  const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.translate(-9,0);
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // Scanline polygons keep every source pixel crisp instead of antialiased paths.
  function poly(points,col){let lo=Math.ceil(Math.min(...points.map(p=>p[1]))),hi=Math.floor(Math.max(...points.map(p=>p[1])));for(let y=lo;y<=hi;y++){const xs=[];for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)r(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,col)}}
  function line(ax,ay,bx,by,col,width=1){let n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)));for(let i=0;i<=n;i++)r(ax+(bx-ax)*i/n-width/2,ay+(by-ay)*i/n-width/2,width,width,col)}
  function orb(x,y,rad,col){for(let dy=-rad;dy<=rad;dy++){const dx=Math.floor(Math.sqrt(rad*rad-dy*dy));r(x-dx,y+dy,dx*2+1,1,col)}}
  const hero=role==='hero',base=outfits[f*4+sub]||outfits[0];let cfg={...base};
  if(!hero){const color=[outfits[1],outfits[4],outfits[8]][f];cfg={...color,hair:role==='archer'?'hat':role==='assassin'?'mask':role==='sorcerer'?'hood':role==='boss'?'crown':role==='brute'?'spiky':'high',body:role==='brute'?'muscle':role==='shield'?'armor':role==='sorcerer'?'robe':role==='assassin'?'ninja':role==='boss'?'mantle':'vest',weapon:role==='spearman'?'spear':role==='archer'?'bow':role==='sorcerer'?'staff':role==='brute'?'cleaver':'sword'};if(role==='shield'&&f===0){cfg.hair='bald';cfg.body='monk'}}
  if(!hero&&sub){
   if(role==='disciple')cfg.hair=sub===1?'bandana':'ponytail';
   if(role==='brute')cfg.hair=sub===1?'bald':'bandana';
   if(role==='spearman')cfg.hair=sub===1?'long':'bandana';
   if(role==='archer')cfg.hair=sub===1?'mask':'high';
  }
  const dim=hero?{w:cfg.body==='muscle'?29:cfg.body==='ninja'?16:cfg.body==='monk'?24:19,leg:cfg.body==='robe'?12:14,head:cfg.body==='muscle'?29:27}:{...(bodyTypes[role]||bodyTypes.disciple)};
  if(!hero){dim.w+=sub===1?-2:sub===2?2:0;dim.head+=sub===2?2:0}
  const phase=walkFrame?((walkFrame-1)%8)*Math.PI/4:0,stride=walkFrame?Math.round(Math.sin(phase)*4):0;
  const bob=walkFrame?Math.round(Math.abs(Math.cos(phase))*2):0,lean=pose===2?-2:pose===3?3:pose===4?4:pose===5?1:0;
  const cx=46+lean,ground=80,hip=ground-dim.leg,shoulder=hip-20+bob,headY=shoulder-29+bob;
  // Ground shadow, shaped boots and articulated shins.
  r(29,81,34,3,'#12223144');r(33,80,26,5,'#12223144');
  function leg(x,offset){const kneeY=hip+6+offset/2,footY=ground+offset;poly([[x-4,hip-1],[x+4,hip-1],[x+4,kneeY],[x+2,footY],[x-4,footY]],O);poly([[x-2,hip],[x+2,hip],[x+1,kneeY],[x-2,footY-2]],'#666272');r(x-4,footY-2,10,4,O);r(x-3,footY-2,6,1,'#96909a');r(x+2,footY-1,3,1,'#453c4d')}
  leg(cx-6,stride);leg(cx+7,-stride);
  if(cfg.body==='mantle'){poly([[cx-14,shoulder-2],[cx+14,shoulder-2],[cx+20,hip+8],[cx+8,hip+4],[cx,hip+8],[cx-18,hip+6]],O);poly([[cx-12,shoulder],[cx+11,shoulder],[cx+17,hip+5],[cx+4,hip+2],[cx-15,hip+4]],cfg.shade);line(cx-11,shoulder+2,cx-14,hip+3,cfg.accent,2)}
  // Tailored torso silhouettes: no width-scaled copy of one body.
  let left=cx-dim.w/2,right=cx+dim.w/2;
  const hem=cfg.body==='robe'||cfg.body==='dress'?hip+8:hip;
  poly([[left,shoulder],[cx-5,shoulder-3],[cx+5,shoulder-3],[right,shoulder],[right+3,hem],[cx+3,hem+2],[cx-2,hem],[left-3,hem+1]],O);
  poly([[left+2,shoulder+1],[cx-3,shoulder-1],[cx+4,shoulder-1],[right-2,shoulder+2],[right,hem-2],[cx+2,hem],[left-1,hem-1]],cfg.main);
  poly([[left+2,shoulder+3],[left+7,shoulder+4],[left+5,hem-2],[left,hem-1]],cfg.shade);
  poly([[right-6,shoulder+3],[right-2,shoulder+2],[right,hem-2],[right-4,hem-1]],cfg.shade);
  line(cx-5,shoulder,cx+6,shoulder+13,cfg.light,2);line(cx-4,shoulder+2,cx+5,shoulder+14,cfg.shade,1);
  r(left+1,hip-5,dim.w-2,4,O);r(left+2,hip-5,dim.w-4,2,cfg.accent);r(cx+3,hip-4,3,11,cfg.accent);r(cx+7,hip-3,2,7,cfg.light);
  for(let j=0;j<3;j++)line(left+5+j*5,hip-1,left+4+j*5,hem-1,cfg.shade,1);
  if(cfg.body==='muscle'){poly([[left+2,shoulder+1],[cx-2,shoulder+1],[cx,hip-6],[left+4,hip-6]],skin);poly([[cx+3,shoulder+1],[right-2,shoulder+2],[right-3,hip-6],[cx+3,hip-6]],skinLight);line(cx-1,shoulder+7,cx-8,shoulder+8,skinShade,1);line(cx+4,shoulder+7,cx+10,shoulder+8,skinShade,1)}
  if(cfg.body==='armor'){for(let y=shoulder+4;y<hip-5;y+=4){r(left+2,y,dim.w-4,2,'#797c8b');r(left+3,y+2,dim.w-6,1,'#424858')}r(left-3,shoulder+1,9,6,'#8b8b99');r(right-6,shoulder+1,9,6,'#8b8b99')}
  // Rear sleeve/arm swings opposite the forward leg.
  const armY=shoulder+9+stride/2;
  poly([[left+1,shoulder+1],[left-6,shoulder+4],[left-7,armY+7],[left,armY+10],[left+4,shoulder+8]],O);
  poly([[left,shoulder+3],[left-4,shoulder+5],[left-4,armY+4],[left+1,armY+6],[left+2,shoulder+8]],cfg.body==='muscle'?skin:cfg.main);
  r(left-5,armY+5,6,5,skin);r(left-4,armY+5,4,2,skinLight);
  // Head and ears: rounded stepped silhouette with skin ramps and ear light.
  const hw=dim.head/2,hx=cx-1,hy=headY;
  poly([[hx-hw+5,hy],[hx+hw-5,hy],[hx+hw,hy+5],[hx+hw,hy+21],[hx+hw-5,hy+26],[hx-hw+4,hy+26],[hx-hw,hy+21],[hx-hw,hy+5]],O);
  poly([[hx-hw+5,hy+2],[hx+hw-5,hy+2],[hx+hw-2,hy+6],[hx+hw-2,hy+20],[hx+hw-6,hy+24],[hx-hw+5,hy+23],[hx-hw+2,hy+19],[hx-hw+2,hy+6]],skin);
  poly([[hx-hw+5,hy+4],[hx+hw-5,hy+3],[hx+hw-3,hy+7],[hx+hw-3,hy+17],[hx-2,hy+21],[hx-hw+4,hy+18]],skinLight);
  r(hx-hw-2,hy+13,4,7,O);r(hx-hw-1,hy+14,3,4,skin);r(hx-hw,hy+14,2,2,skinLight);
  const hc=cfg.hair==='silver'?'#aeb2c9':'#353342',hl=cfg.hair==='silver'?'#e4dce0':'#626071',hs=cfg.hair==='silver'?'#777c98':'#272938';
  if(cfg.hair!=='bald'){
   poly([[hx-hw,hy+11],[hx-hw-1,hy+4],[hx-hw+4,hy-2],[hx+3,hy-4],[hx+hw-2,hy],[hx+hw+2,hy+7],[hx+hw-1,hy+16],[hx+hw-5,hy+11],[hx+3,hy+8],[hx-2,hy+14],[hx-7,hy+9],[hx-10,hy+15]],hs);
   poly([[hx-hw+2,hy+5],[hx-hw+6,hy],[hx+3,hy-2],[hx+hw-4,hy+2],[hx+hw-2,hy+7],[hx+4,hy+5],[hx-1,hy+10],[hx-7,hy+6]],hc);
   line(hx-hw+6,hy+2,hx+1,hy+1,hl,2);line(hx+5,hy+2,hx+hw-4,hy+5,hl,1);
   if(['long','silver'].includes(cfg.hair)){poly([[hx-hw,hy+4],[hx-hw-5,hy+17],[hx-hw-4,hy+37],[hx-hw-10,hy+39],[hx-hw-7,hy+24],[hx-hw-5,hy+7]],hs);line(hx-hw-3,hy+12,hx-hw-5,hy+30,hl,2)}
   if(['high','ponytail','long'].includes(cfg.hair)){poly([[hx-8,hy-2],[hx-10,hy-8],[hx-2,hy-11],[hx+5,hy-8],[hx+3,hy-2]],hs);r(hx-7,hy-7,9,3,hc);r(hx-5,hy-7,5,1,hl);r(hx-8,hy-1,12,2,cfg.accent);if(cfg.hair==='ponytail')poly([[hx+9,hy],[hx+19,hy+2],[hx+23,hy+13],[hx+19,hy+24],[hx+23,hy+30],[hx+16,hy+28],[hx+16,hy+14],[hx+11,hy+6]],hc)}
   if(cfg.hair==='spiky'||cfg.hair==='mohawk'){poly([[hx-hw,hy+4],[hx-9,hy-5],[hx-7,hy-1],[hx,hy-10],[hx+1,hy-3],[hx+9,hy-8],[hx+10,hy],[hx+hw,hy-3],[hx+hw+2,hy+7]],hc);line(hx-1,hy-7,hx-3,hy-2,hl,2)}
  }else{line(hx-8,hy+4,hx+3,hy+3,'#ffe0b0',1);for(let i=0;i<3;i++)r(hx-5+i*4,hy+6,1,1,skinShade)}
  // Fine face pixels, iris glint, lower eyelid and small mouth.
  r(hx-6,hy+15,3,5,O);r(hx+5,hy+15,3,5,O);r(hx-6,hy+15,1,1,'#fff5d7');r(hx+5,hy+15,1,1,'#fff5d7');r(hx-7,hy+20,4,1,skinShade);r(hx+5,hy+20,4,1,skinShade);r(hx+1,hy+20,2,1,skinShade);r(hx-1,hy+23,3,1,'#9d6463');
  if(!hero){line(hx-8,hy+12,hx-3,hy+13,O,2);line(hx+4,hy+13,hx+9,hy+12,O,2)}
  if(!hero&&sub===1){line(hx+8,hy+17,hx+6,hy+21,skinShade,1)}
  if(!hero&&role==='brute'){poly([[hx-8,hy+22],[hx+8,hy+22],[hx+5,hy+28],[hx-4,hy+29]],'#4f3e40')}
  if(cfg.hair==='mask'){poly([[hx-hw+1,hy+2],[hx+hw,hy+3],[hx+hw,hy+10],[hx-hw,hy+9]],cfg.shade);poly([[hx-hw+2,hy+21],[hx+hw-2,hy+19],[hx+hw-3,hy+25],[hx-hw+5,hy+26]],cfg.shade);r(hx+hw-1,hy+22,10+stride,3,cfg.accent)}
  if(cfg.hair==='hood'){poly([[hx-hw-4,hy+5],[hx-hw+3,hy-6],[hx+7,hy-7],[hx+hw+4,hy+4],[hx+hw+3,hy+26],[hx+hw-2,hy+29],[hx+hw-1,hy+10],[hx+6,hy+4],[hx-6,hy+5],[hx-hw+1,hy+11],[hx-hw,hy+29],[hx-hw-5,hy+24]],cfg.shade);line(hx-hw+2,hy-2,hx+5,hy-4,cfg.light,2)}
  if(cfg.hair==='hat'){poly([[hx-hw+2,hy-3],[hx+hw-4,hy-3],[hx+hw+1,hy+4],[hx+hw+7,hy+7],[hx-hw-7,hy+7],[hx-hw-1,hy+4]],O);poly([[hx-hw+4,hy-1],[hx+hw-6,hy-1],[hx+hw-2,hy+4],[hx-hw+1,hy+4]],'#9c825b');r(hx-hw-5,hy+5,dim.head+10,2,'#c5b184')}
  if(cfg.hair==='bandana'){r(hx-hw,hy+6,dim.head,3,cfg.accent);poly([[hx-hw,hy+7],[hx-hw-10,hy+11],[hx-hw-6,hy+14],[hx-hw-14,hy+18],[hx-hw-1,hy+14]],cfg.accent)}
  if(cfg.hair==='crown'){r(hx-hw,hy+3,dim.head,3,'#c7ae70');for(let j=0;j<3;j++){r(hx-10+j*9,hy-3-j%2*3,3,6+j%2*3,'#ecd39a')}r(hx-2,hy+2,3,4,'#a05f7b')}
  if(role==='shield'&&f!==0){poly([[hx-hw-1,hy+12],[hx-hw-2,hy+3],[hx-8,hy-5],[hx+7,hy-5],[hx+hw+2,hy+3],[hx+hw+1,hy+12]],O);poly([[hx-hw,hy+6],[hx-7,hy-3],[hx+5,hy-3],[hx+hw,hy+6]],'#666c80');line(hx-4,hy-2,hx+6,hy+1,'#9b9ca9',2);r(hx-hw-1,hy+8,dim.head+2,3,'#a7a2a8');r(hx-hw-2,hy+11,5,15,'#52576b');r(hx+hw-3,hy+11,5,15,'#52576b')}
  if(cfg.body==='monk'){for(let j=0;j<7;j++){const a=j*Math.PI/6;orb(cx-12+4*j,shoulder+5+Math.round(Math.sin(a)*8),2,'#5a4437');r(cx-12+4*j,shoulder+4+Math.round(Math.sin(a)*8),1,1,'#e3bc7b')}}
  // Articulated front arm follows preparation, strike and recovery, not a binary pose.
  const angles=[-.95,-1.7,-2.2,-.05,.65,.25],wa=angles[pose]??-.95;
  const sx=right-1,sy=shoulder+5,handX=sx+Math.cos(wa+.5)*12,handY=sy+Math.sin(wa+.5)*12;
  line(sx,sy,handX,handY,O,9);line(sx,sy,handX,handY,cfg.body==='muscle'?skin:cfg.main,6);line(sx-1,sy-1,handX-1,handY-1,cfg.body==='muscle'?skinLight:cfg.light,2);orb(handX,handY,3,skin);r(handX-1,handY-2,3,2,skinLight);
  const wx=handX,wy=handY;
  function blade(angle,len,width){const dx=Math.cos(angle),dy=Math.sin(angle),nx=-dy,ny=dx;const bx=wx+dx*4,by=wy+dy*4,tx=wx+dx*len,ty=wy+dy*len;poly([[bx+nx*width,by+ny*width],[tx+nx,ty+ny],[tx+dx*3,ty+dy*3],[tx-nx,ty-ny],[bx-nx*width,by-ny*width]],O);poly([[bx+nx*(width-1),by+ny*(width-1)],[tx,ty],[bx-nx*(width-1),by-ny*(width-1)]],'#a0b4cc');line(bx,by,tx,ty,'#eff0e9',1);line(wx-nx*5,wy-ny*5,wx+nx*5,wy+ny*5,cfg.accent,3);line(wx,wy,wx-dx*6,wy-dy*6,'#725b4d',3)}
  if(pose===3||pose===4){const rad=cfg.weapon==='cleaver'?31:26;const pts=[];for(let j=0;j<7;j++){const a=-1.7+j*.36;pts.push([wx+Math.cos(a)*rad,wy+Math.sin(a)*rad])}for(let j=6;j>=0;j--){const a=-1.7+j*.36;pts.push([wx+Math.cos(a)*(rad-4),wy+Math.sin(a)*(rad-4)])}poly(pts,cfg.accent+'88')}
  if(cfg.weapon==='sword'||cfg.weapon==='dagger'||cfg.weapon==='cleaver'){blade(wa,cfg.weapon==='dagger'?17:cfg.weapon==='cleaver'?29:27,cfg.weapon==='cleaver'?5:3);if(cfg.weapon==='dagger')line(left-4,armY,left+5,armY-14,'#c3ccd8',3)}
  else if(cfg.weapon==='staff'||cfg.weapon==='spear'){const a=pose===3?-.1:pose===4?.45:-1.3,dx=Math.cos(a),dy=Math.sin(a);line(wx-dx*20,wy-dy*20,wx+dx*28,wy+dy*28,O,4);line(wx-dx*19,wy-dy*19,wx+dx*28,wy+dy*28,'#b29066',2);if(cfg.weapon==='spear'){poly([[wx+dx*33,wy+dy*33],[wx+dx*23-dy*4,wy+dy*23+dx*4],[wx+dx*23+dy*4,wy+dy*23-dx*4]],'#e2e7e3')}else{orb(wx+dx*28,wy+dy*28,4,cfg.accent);orb(wx+dx*28,wy+dy*28,2,'#f6d28e')}}
  else if(cfg.weapon==='talisman'){r(wx-3,wy-10,9,15,O);r(wx-2,wy-9,7,13,'#e6cc8e');line(wx,wy-6,wx+2,wy+1,cfg.accent,2);r(wx-1,wy-4,4,1,cfg.accent);if(pose===3){orb(wx+12,wy-4,5,cfg.accent);orb(wx+12,wy-4,2,'#f3e9c5')}}
  else if(cfg.weapon==='bow'){poly([[wx+2,wy-17],[wx+10,wy-10],[wx+13,wy],[wx+10,wy+11],[wx+2,wy+18],[wx+7,wy+7],[wx+8,wy],[wx+7,wy-8]],'#b99b73');line(wx+2,wy-17,wx+(pose===2?-5:2),wy,'#eee0b7',1);line(wx+(pose===2?-5:2),wy,wx+2,wy+18,'#eee0b7',1);line(wx-8,wy,wx+19,wy,'#d2d9df',2)}
  if(role==='shield'){poly([[right+3,hip-23],[right+16,hip-20],[right+18,hip-5],[right+11,hip+8],[right+1,hip+3],[right-2,hip-12]],O);poly([[right+4,hip-21],[right+14,hip-18],[right+15,hip-5],[right+10,hip+5],[right+3,hip+1],[right,hip-12]],'#8e7c69');for(let j=0;j<3;j++)line(right+3+j*4,hip-18,right+4+j*3,hip+1,'#b6a18a',1);line(right+1,hip-10,right+15,hip-8,'#9199a7',3);orb(right+7,hip-9,3,'#c3c1bb')}
  if(hit){g.globalCompositeOperation='source-atop';g.fillStyle='#fff2cf88';g.fillRect(0,0,96,96);g.globalCompositeOperation='source-over'}
  if(cache.size>=1024)cache.delete(cache.keys().next().value);cache.set(key,c);return c;
 }
 function paint(ctx,x,y,f,role,sub,t,attack,hit,scale,moving,face){const image=build(f,role,sub,animationFrame(t,moving),hit,attack);ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x),Math.round(y));if(face<0)ctx.scale(-1,1);if(hit){ctx.translate(-2,1)}ctx.drawImage(image,-37*scale,-80*scale,96*scale,96*scale);ctx.restore()}
 function drawHero(ctx,x,y,f,t,swing=0,sub=0,motion=null){const portrait=ctx.canvas&&ctx.canvas.width<=64;const attack=motion?.attackPhase??(swing>0?3:0);paint(ctx,x,y,f,'hero',sub,motion?.clock??t,attack,false,portrait?.48:1,motion?.moving??false,motion?.face??1)}
 function drawEnemy(ctx,e,t){const pose=e.aiming>0?2:e.attackPose>.12?3:e.attackPose>.06?4:e.attackPose>0?5:e.charge>.45?2:e.charge>0?3:0;paint(ctx,e.x,e.y,e.f||0,e.boss?'boss':e.role||'disciple',e.look||0,e.animTime??t,pose,e.hit>0,e.boss?2:1,e.moving??false,e.face??1)}
 return{drawHero,drawEnemy,animationFrame,attackFrame,heroNames,roles,frame:build,style:'C',cellSize:96,characterPixels:64,get cachedFrames(){return cache.size}};
})();
