'use strict';
const Sound=(()=>{
  let audio=null,last={};
  function unlock(){if(!Profile.data.settings.sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio??=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{})}}catch{}}
  const notes={hit:[210,.035,'triangle'],hurt:[95,.12,'sawtooth'],level:[620,.15,'sine'],dash:[360,.08,'triangle'],boss:[100,.4,'triangle'],end:[300,.25,'sine'],pickup:[800,.045,'sine']};
  function play(name){if(!Profile.data.settings.sound||!audio||audio.state!=='running')return;const now=audio.currentTime;if(now-(last[name]??-10)<(name==='hit'?.07:.05))return;last[name]=now;try{const [hz,duration,type]=notes[name]||notes.hit,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(hz,now);o.frequency.exponentialRampToValueAtTime(name==='level'?hz*1.8:hz*.45,now+duration);g.gain.setValueAtTime(.035,now);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g);g.connect(audio.destination);o.start(now);o.stop(now+duration+.02)}catch{}}
  return {unlock,play};
})();
