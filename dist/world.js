'use strict';
const stages=[
  {name:'청죽림',sub:'첫 출도에 알맞은 대나무 숲',ground:['#8fa575','#92a878','#8ba171'],grass:'#6d915e',path:'#b5b38a',dark:'#416f4b',leaf:'#5a884e',difficulty:1},
  {name:'설산고개',sub:'차가운 설원 · 적 체력 +15%',ground:['#c3d4c9','#c8d8cd','#bdd0c7'],grass:'#a1bcae',path:'#abbdb5',dark:'#416c68',leaf:'#668e80',difficulty:1.15},
  {name:'홍월폐사',sub:'붉은 달 아래 · 적 체력 +25%',ground:['#546d68','#58716a','#506860'],grass:'#435c52',path:'#78877a',dark:'#304f48',leaf:'#6e7970',difficulty:1.25}
];let stageId=0;
const tileCache=new Map();
document.querySelector('#stageSelect').onchange=e=>{stageId=Number(e.target.value);$('#stageInfo').textContent=stages[stageId].sub};
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967296}
function getTileCanvas(stIdx,variant,isPath){
  const key=stIdx+':'+(isPath?'P':'G')+':'+variant;
  let cv=tileCache.get(key);if(cv)return cv;
  cv=document.createElement('canvas');cv.width=cv.height=64;
  const g=cv.getContext('2d'),st=stages[stIdx],n=variant/16;
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h)};
  r(0,0,64,64,st.ground[variant%3]);
  if(isPath){
    r(0,0,64,64,st.path);
    r(5,8,46,2,stages[stIdx===2?2:0].ground[0]);
    if(n>.5)r(20,43,20,2,st.grass);
  }else{
    for(let k=0;k<5;k++){
      const gx=hash(variant+k,variant*3)*56,gy=hash(variant*5,variant+k*8)*56;
      r(gx,gy,2,5,st.grass);r(gx-2,gy+3,6,2,st.grass);
    }
    if(variant===13){
      for(let k=0;k<4;k++){r(10+k*9,20+k%2*9,5,3,stIdx===2?'#b9807d':'#f1d6b5');r(12+k*9,19+k%2*9,2,5,'#e9c397')}
    }else if(variant===1){
      r(12,29,30,13,st.grass);r(15,19,26,18,stIdx===1?'#e5e8d9':'#abb59c');r(19,17,18,4,stIdx===1?'#f0f3e7':'#c2c5a9');
    }
  }
  tileCache.set(key,cv);return cv;
}
const propCache=new Map();
function getPropCanvas(kind,stIdx){
  const key=kind+':'+stIdx;let cv=propCache.get(key);if(cv)return cv;
  cv=document.createElement('canvas');
  if(kind==='pine'){
    cv.width=96;cv.height=116;const g=cv.getContext('2d'),x=48,y=108;
    g.fillStyle='#64594a';g.fillRect(x-4,y-40,8,45);
    for(let i=0;i<3;i++){
      const w=44-i*10;g.fillStyle='#718e81';g.beginPath();g.moveTo(x,y-100+i*24);g.lineTo(x-w,y-30+i*12);g.lineTo(x+w,y-30+i*12);g.fill();
      g.fillStyle='#e2e9d9';g.beginPath();g.moveTo(x,y-100+i*24);g.lineTo(x-w*.7,y-49+i*15);g.lineTo(x+w*.7,y-49+i*15);g.fill();
    }
  }else if(kind==='bamboo'){
    cv.width=72;cv.height=126;const g=cv.getContext('2d'),x=20,y=22,dark=stages[stIdx].dark,leaf=stages[stIdx].leaf;
    for(let j=0;j<3;j++){
      const bx=x+j*12;g.fillStyle=dark;g.fillRect(bx,y-j*9,5,100);
      for(let k=0;k<4;k++){
        g.fillStyle='#8b9f5c';g.fillRect(bx,y+k*23,5,2);
        g.fillStyle=leaf;g.fillRect(bx-13,y+k*23-8,14,4);g.fillRect(bx+4,y+k*23-15,18,4);
      }
    }
  }else if(kind==='lantern'){
    cv.width=32;cv.height=80;const g=cv.getContext('2d'),x=16,y=70;
    const r=(rx,ry,rw,rh,col)=>{g.fillStyle=col;g.fillRect(rx,ry,rw,rh)};
    r(x-3,y-42,6,44,'#6e6b50');r(x-10,y-48,20,6,'#494d40');r(x-8,y-64,16,16,'#cf9d64');
    r(x-5,y-61,10,9,'#f1cf8b');r(x-12,y-67,24,4,'#56624e');r(x-8,y,16,5,'#7f8970');
  }
  propCache.set(key,cv);return cv;
}
function pine(x,y){ctx.drawImage(getPropCanvas('pine',stageId),Math.round(x-48),Math.round(y-108))}
function lantern(x,y){ctx.drawImage(getPropCanvas('lantern',stageId),Math.round(x-16),Math.round(y-70))}
function pavilion(x,y){rect(x-80,y-35,160,75,'#a2a48a');rect(x-72,y-30,144,61,'#c1b28c');for(let i=0;i<5;i++)rect(x-68+i*29,y-28,3,57,'#9c957a');rect(x-65,y-80,10,108,'#785d41');rect(x+55,y-80,10,108,'#785d41');rect(x-45,y-40,90,30,'#715c42');rect(x-40,y-35,80,20,'#ad8660');for(let j=0;j<4;j++){rect(x-92+j*10,y-92-j*8,184-j*20,12,'#355a59');rect(x-92+j*10,y-92-j*8,184-j*20,3,'#6e8f82')}rect(x-102,y-92,20,4,'#294d4c');rect(x+82,y-92,20,4,'#294d4c');rect(x-55,y+31,110,7,'#828c78');rect(x-64,y+38,128,7,'#9aa08a');lantern(x-90,y+15);lantern(x+90,y+15)}
function drawWorld(p){
  const tile=64,x0=Math.floor((p.x-W/2)/tile)-1,y0=Math.floor((p.y-H/2)/tile)-1,x1=x0+Math.ceil(W/tile)+3,y1=y0+Math.ceil(H/tile)+3;
  for(let y=y0;y<y1;y++){
    const py=y*tile;
    for(let x=x0;x<x1;x++){
      const px=x*tile,v=((x*73856093^y*19349663)>>>0)&15;
      const path=Math.abs(py-Math.sin(px*.003)*60)<50;
      ctx.drawImage(getTileCanvas(stageId,v,path),px,py);
    }
  }
  const cx0=Math.floor((p.x-W/2)/320)-1,cy0=Math.floor((p.y-H/2)/320)-1,cx1=cx0+Math.ceil(W/320)+3,cy1=cy0+Math.ceil(H/320)+3;
  for(let y=cy0;y<cy1;y++)for(let x=cx0;x<cx1;x++){
    const n=hash(x+56,y+23),px=x*320+45+n*180,py=y*320+70+n*140;if(Math.abs(py-Math.sin(px*.003)*60)<110)continue;
    if(stageId===1)pine(px,py,true);else{bamboo(px,py);bamboo(px+38,py+16)}
    if(n>.7)lantern(px+76,py+12);
  }
  if(Math.hypot(p.x+230,p.y+180)<Math.max(W,H))pavilion(-230,-180);
}
