'use strict';
/* Canvas2D adaptation of PixelFx sword-slash/onArc/crescent and arcane GLYPHS.
 * https://github.com/patch-gg/pixelfx @ 5294518ce7c72e48b6100a744596e0acf57f2826
 * MIT (c) 2026 Patch, Hugo Duprez. See PixelFx-LICENSE.txt. No gallery fonts used.
 * Modified: bounded polygon ribbons, game-space coordinates and adaptive detail. */
const JianghuFX=(()=>{
 const GLYPHS=[[".#.","#.#",".#.",".#.","#.#"],["#.#","#.#",".#.","#.#","#.#"],["##.","#.#","##.","#..","#.."],["#..","#.#","###","#.#","..#"],[".##","#..",".#.","..#","##."],["###",".#.","###",".#.",".#."],["#.#","###","#.#","..#","..#"],[".#.",".##",".#.","##.",".#."]];
 const clamp=x=>Math.max(0,Math.min(1,x)),outExpo=x=>x>=1?1:1-Math.pow(2,-10*x),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 function onArc(s,r,a){const lx=Math.cos(a)*r,ly=Math.sin(a)*r*s.sy,c=Math.cos(s.rot),n=Math.sin(s.rot);return [s.cx+lx*c-ly*n,s.cy+lx*n+ly*c]}
 function slash(g,x,y,r,rot,spread,age,color,low=false){if(age<0||age>1)return;const head=outExpo(clamp(age/.25)),tail=smooth((age-.32)/.68),a0=-spread,a1=spread,s={cx:x,cy:y,sy:.72,rot},steps=low?12:24;
  g.save();g.globalAlpha*=1-age*.75;
  for(let echo=1;echo>=0;echo--){const radius=r*(echo?.78:1),width=r*(echo?.06:.17),start=a0+(a1-a0)*tail,end=a0+(a1-a0)*head;if(end<=start)continue;
   const points=[];for(let j=0;j<=steps;j++){const v=j/steps,a=start+(end-start)*v,w=width*Math.pow(Math.sin(Math.PI*Math.pow(v,2.2)),.6);points.push({a,w})}
   g.beginPath();points.forEach((q,j)=>{const p=onArc(s,radius,q.a);j?g.lineTo(...p):g.moveTo(...p)});for(let j=points.length-1;j>=0;j--){const q=points[j];g.lineTo(...onArc(s,radius-q.w,q.a))}g.closePath();g.fillStyle=echo?'#d8eee3':color;g.fill();
   g.strokeStyle='#fff9df';g.lineWidth=echo?1:1.8;g.beginPath();points.slice(Math.floor(steps*.5)).forEach((q,j)=>{const p=onArc(s,radius,q.a);j?g.lineTo(...p):g.moveTo(...p)});g.stroke();
   if(!low&&tail>.02){g.fillStyle=color;for(let j=0;j<16;j++){const p=onArc(s,radius,a0+(a1-a0)*tail*j/16);g.fillRect(Math.round(p[0]),Math.round(p[1]),2,2)}}
  }const tip=onArc(s,r,a0+(a1-a0)*head);if(age<.55){g.strokeStyle='#fff6ce';g.lineWidth=2;g.beginPath();g.moveTo(tip[0]-6,tip[1]);g.lineTo(tip[0]+6,tip[1]);g.moveTo(tip[0],tip[1]-6);g.lineTo(tip[0],tip[1]+6);g.stroke()}g.restore();
 }
 function glyph(g,i,x,y,color,size=2){g.fillStyle=color;GLYPHS[i%8].forEach((row,yy)=>{for(let xx=0;xx<3;xx++)if(row[xx]==='#')g.fillRect(Math.round(x+(xx-1)*size),Math.round(y+(yy-4)*size),size,size)})}
 function formation(g,x,y,r,phase,color,low=false){g.save();g.strokeStyle=color;g.lineWidth=1.5;for(const k of [.65,1]){g.beginPath();g.ellipse(x,y,r*k,r*.5*k,0,0,Math.PI*2);g.stroke()}const count=low?4:8;g.beginPath();for(let j=0;j<=6;j++){const a=phase+j*Math.PI*4/6,px=x+Math.cos(a)*r*.57,py=y+Math.sin(a)*r*.285;j?g.lineTo(px,py):g.moveTo(px,py)}g.stroke();for(let j=0;j<count;j++){const a=j*Math.PI*2/count-phase*.4;glyph(g,j,x+Math.cos(a)*r*.85,y+Math.sin(a)*r*.425,color,low?1:2)}g.restore()}
 return {slash,glyph,formation,onArc};
})();
