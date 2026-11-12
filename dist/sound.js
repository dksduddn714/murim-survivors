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
