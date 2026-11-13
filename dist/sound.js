'use strict';
const Sound=(()=>{
 let audio=null,last={},noise=null;
 function unlock(){if(!Profile.data.settings.sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio??=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{})}}catch{}}
 const notes={slash:[480,.12,'triangle'],heavy:[110,.19,'sawtooth'],hit:[180,.08,'triangle'],kill:[80,.16,'triangle'],hurt:[95,.15,'sawtooth'],level:[620,.22,'sine'],dash:[360,.11,'triangle'],boss:[100,.4,'triangle'],end:[300,.25,'sine'],pickup:[900,.045,'sine']};
 function play(name){if(!Profile.data.settings.sound||!audio||audio.state!=='running')return;const now=audio.currentTime;if(now-(last[name]??-10)<(name==='hit'?.085:name==='pickup'?.065:.05))return;last[name]=now;
 try{const [hz,duration,type]=notes[name]||notes.hit,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(hz,now);o.frequency.exponentialRampToValueAtTime(name==='level'?hz*1.8:hz*.3,now+duration);g.gain.setValueAtTime(name==='heavy'?.055:.028,now);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g);g.connect(audio.destination);o.start(now);o.stop(now+duration+.02);
 if(['slash','heavy','hit','dash','kill'].includes(name)){if(!noise){noise=audio.createBuffer(1,audio.sampleRate*.25,audio.sampleRate);const a=noise.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();src.buffer=noise;filter.type='lowpass';filter.frequency.setValueAtTime(name==='slash'?4200:name==='heavy'?850:1800,now);filter.frequency.exponentialRampToValueAtTime(200,now+duration);gain.gain.setValueAtTime(name==='heavy'?.12:.045,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);src.connect(filter);filter.connect(gain);gain.connect(audio.destination);src.start(now);src.stop(now+duration)}
 }catch{}}
 return{unlock,play};
})();

// Pentatonic plucked strings and drum pulses, synthesized locally. No external recordings.
const Music=(()=>{
 let ac=null,master=null,next=0,step=0,playing=false;
 const scale=[0,2,5,7,9],melody=[0,2,3,2,1,0,4,3,2,1,3,4,2,1,0,0];
 function unlock(){if(!Profile.data.settings.bgm)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!ac){ac=new C();master=ac.createGain();master.gain.value=0;master.connect(ac.destination)}if(ac.state==='suspended')ac.resume().catch(()=>{})}catch{}}
 function pluck(at,midi,duration,vol){const hz=440*Math.pow(2,(midi-69)/12);for(let i=1;i<=3;i++){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=hz*i;g.gain.setValueAtTime(vol/(i*i),at);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(master);o.start(at);o.stop(at+duration+.03)}}
 function drum(at,strong){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(strong?125:190,at);o.frequency.exponentialRampToValueAtTime(42,at+.16);g.gain.setValueAtTime(strong?.2:.065,at);g.gain.exponentialRampToValueAtTime(.0001,at+.2);o.connect(g);g.connect(master);o.start(at);o.stop(at+.22)}
 function update(active,boss){if(!ac||ac.state!=='running')return;const on=!!active&&Profile.data.settings.bgm;if(on!==playing){playing=on;master.gain.setTargetAtTime(on?.24:0,ac.currentTime,.08);next=ac.currentTime+.04}if(!on)return;if(next<ac.currentTime-.2)next=ac.currentTime+.03;const beat=60/(boss?144:100)/2;let count=0;while(next<ac.currentTime+.13&&count++<4){const note=melody[step%melody.length],oct=step%8===7?12:0;pluck(next,50+scale[note]+oct,beat*1.8,.14);if(step%2===0)drum(next,step%8===0);if(step%8===0)pluck(next,38,beat*7,.1);step++;next+=beat}}
 function toggle(){Profile.data.settings.bgm=!Profile.data.settings.bgm;Profile.save();unlock();paint();}
 function paint(){const b=$('#bgmQuick');b.textContent='♫ BGM '+(Profile.data.settings.bgm?'켬':'끔');b.setAttribute('aria-label',Profile.data.settings.bgm?'배경음악 끄기':'배경음악 켜기');const h=$('#bgmHud');h.textContent=Profile.data.settings.bgm?'♫':'♪';h.setAttribute('aria-label',Profile.data.settings.bgm?'배경음악 끄기':'배경음악 켜기')}
 return{unlock,update,toggle,paint};
})();
