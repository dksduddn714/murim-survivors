'use strict';
const stages=[
  {name:'청죽림',sub:'첫 출도에 알맞은 대나무 숲',ground:['#8fa575','#92a878','#8ba171'],grass:'#6d915e',path:'#b5b38a',dark:'#416f4b',leaf:'#5a884e',difficulty:1},
  {name:'설산고개',sub:'차가운 설원 · 적 체력 +15%',ground:['#c3d4c9','#c8d8cd','#bdd0c7'],grass:'#a1bcae',path:'#abbdb5',dark:'#416c68',leaf:'#668e80',difficulty:1.15},
  {name:'홍월폐사',sub:'붉은 달 아래 · 적 체력 +25%',ground:['#546d68','#58716a','#506860'],grass:'#435c52',path:'#78877a',dark:'#304f48',leaf:'#6e7970',difficulty:1.25}
];let stageId=0;
$('#stageSelect').onchange=e=>{stageId=Number(e.target.value);$('#stageInfo').textContent=stages[stageId].sub};
function hash(x,y){let n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n)}
function pine(x,y,snow){rect(x-4,y-40,8,45,'#64594a');for(let i=0;i<3;i++){const w=44-i*10;ctx.fillStyle=snow?'#718e81':'#4a7550';ctx.beginPath();ctx.moveTo(x,y-100+i*24);ctx.lineTo(x-w,y-30+i*12);ctx.lineTo(x+w,y-30+i*12);ctx.fill();if(snow){ctx.fillStyle='#e2e9d9';ctx.beginPath();ctx.moveTo(x,y-100+i*24);ctx.lineTo(x-w*.7,y-49+i*15);ctx.lineTo(x+w*.7,y-49+i*15);ctx.fill()}}}
function lantern(x,y){rect(x-3,y-42,6,44,'#6e6b50');rect(x-10,y-48,20,6,'#494d40');rect(x-8,y-64,16,16,'#cf9d64');rect(x-5,y-61,10,9,'#f1cf8b');rect(x-12,y-67,24,4,'#56624e');rect(x-8,y,16,5,'#7f8970')}
function pavilion(x,y){rect(x-80,y-35,160,75,'#a2a48a');rect(x-72,y-30,144,61,'#c1b28c');for(let i=0;i<5;i++)rect(x-68+i*29,y-28,3,57,'#9c957a');rect(x-65,y-80,10,108,'#785d41');rect(x+55,y-80,10,108,'#785d41');rect(x-45,y-40,90,30,'#715c42');rect(x-40,y-35,80,20,'#ad8660');for(let j=0;j<4;j++){rect(x-92+j*10,y-92-j*8,184-j*20,12,'#355a59');rect(x-92+j*10,y-92-j*8,184-j*20,3,'#6e8f82')}rect(x-102,y-92,20,4,'#294d4c');rect(x+82,y-92,20,4,'#294d4c');rect(x-55,y+31,110,7,'#828c78');rect(x-64,y+38,128,7,'#9aa08a');lantern(x-90,y+15);lantern(x+90,y+15)}
function drawWorld(p){
  const st=stages[stageId],tile=64,x0=Math.floor((p.x-W/2)/tile)-1,y0=Math.floor((p.y-H/2)/tile)-1;
  for(let y=y0;y<y0+H/tile+3;y++)for(let x=x0;x<x0+W/tile+3;x++){
    const n=hash(x,y),px=x*tile,py=y*tile;rect(px,py,tile,tile,st.ground[Math.floor(n*3)]);
    const path=Math.abs(py-Math.sin(px*.003)*60)<50;
    if(path){rect(px,py,64,64,st.path);rect(px+5,py+8,46,2,stages[stageId===2?2:0].ground[0]);if(n>.5)rect(px+20,py+43,20,2,st.grass)}
    else for(let k=0;k<5;k++){let gx=px+hash(x+k,y)*58,gy=py+hash(x,y+k+8)*60;rect(gx,gy,2,5,st.grass);rect(gx-2,gy+3,6,2,st.grass)}
    if(!path&&n>.85&&n<.91){for(let k=0;k<4;k++){rect(px+10+k*9,py+20+k%2*9,5,3,stageId===2?'#b9807d':'#f1d6b5');rect(px+12+k*9,py+19+k%2*9,2,5,'#e9c397')}}
    if(!path&&n<.075){rect(px+12,py+29,30,13,st.grass);rect(px+15,py+19,26,18,stageId===1?'#e5e8d9':'#abb59c');rect(px+19,py+17,18,4,stageId===1?'#f0f3e7':'#c2c5a9')}
  }
  const cx0=Math.floor((p.x-W/2)/320)-1,cy0=Math.floor((p.y-H/2)/320)-1;
  for(let y=cy0;y<cy0+H/320+3;y++)for(let x=cx0;x<cx0+W/320+3;x++){
    const n=hash(x+56,y+23),px=x*320+45+n*180,py=y*320+70+n*140;if(Math.abs(py-Math.sin(px*.003)*60)<110)continue;
    if(stageId===1)pine(px,py,true);else{bamboo(px,py);bamboo(px+38,py+16)}
    if(n>.7)lantern(px+76,py+12);
  }
  if(Math.hypot(p.x+230,p.y+180)<Math.max(W,H))pavilion(-230,-180);
}
