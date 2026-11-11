'use strict';
let installPrompt=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#install').textContent='앱처럼 설치 ⤓'});
$('#install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null}else showNotice('브라우저 메뉴에서 홈 화면에 추가를 선택해 주세요')};
if('serviceWorker' in navigator)addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{ /* Private hosting or browser settings may restrict offline installation. */ })});
