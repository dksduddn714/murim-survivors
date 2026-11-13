'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const output=process.argv[2];if(!output||!path.isAbsolute(output))throw Error('Pass an absolute output .html path');
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace(/<link rel="manifest"[^>]*>/g,'');
for(const [file,mime] of [['icon.svg','image/svg+xml'],['icon-192.png','image/png']])html=html.replace('href="'+file+'"','href="data:'+mime+';base64,'+fs.readFileSync(path.join(dist,file)).toString('base64')+'"');
html=html.replace(/<link rel="stylesheet" href="([^"?]+)[^"]*">/g,(_,file)=>'<style>\n'+fs.readFileSync(path.join(dist,file),'utf8')+'\n#install{display:none!important}\n</style>');
html=html.replace(/<script src="([^"?]+)[^"]*"><\/script>/g,(_,file)=>{
 let code=fs.readFileSync(path.join(dist,file),'utf8');
 if(file==='app.js')code=code.replace(/if\('serviceWorker' in navigator&&location.protocol==='https:'\)addEventListener\('load',\(\)=>navigator.serviceWorker.register\('\.\/sw.js'\).catch\(\(\)=>\{\}\)\);/,'');
 if(file==='jianghu.js')code=code.replace("peddlerImage.src='assets/peddler.png'", "peddlerImage.src='data:image/png;base64,"+fs.readFileSync(path.join(dist,'assets/peddler.png')).toString('base64')+"'");
 return '<script>\n'+code.replace(/<\/script/gi,'<\\/script')+'\n</script>';
});
const escape=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
let licenses=fs.readFileSync(path.join(root,'THIRD_PARTY_NOTICES.md'),'utf8');for(const file of fs.readdirSync(path.join(dist,'vendor')).filter(f=>/LICENSE/i.test(f)))licenses+='\n'+file+'\n'+fs.readFileSync(path.join(dist,'vendor',file),'utf8');
html=html.replace('</body>','<template id="third-party-license-notices">'+escape(licenses)+'</template></body>');
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,html);console.log(output);
