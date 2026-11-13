'use strict';
let installPrompt=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#install').textContent='앱처럼 설치';$('#install').style.display='inline-block'});
$('#install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#install').style.display='none'}};

if('serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

$('#bgmQuick').onclick=Music.toggle;Music.paint();

$('#bgmHud').onclick=Music.toggle;

$('#postTraining').onclick=()=>{if(mode==='end'&&!state.demo)openCamp('training')};
