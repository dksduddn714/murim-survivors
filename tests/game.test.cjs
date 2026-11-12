const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function harness(saved){
  const nodes=new Map(),store=new Map(saved?Object.entries(saved):[]);let clock=0;
  function element(){let html='';return {children:[],dataset:{},style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},hidden:false,textContent:'',get innerHTML(){return html},set innerHTML(v){html=v;this.children=[]},append(e){this.children.push(e)},querySelector(){return null},querySelectorAll(){return []},insertAdjacentHTML(){},setAttribute(){},addEventListener(){},setPointerCapture(){},getContext(){return new Proxy({},{get:()=>()=>({})})}}}
  const sandbox={console,Math,Date,Set,Map,JSON,Number,Object,performance:{now:()=>clock},innerWidth:960,innerHeight:540,devicePixelRatio:1,addEventListener(){},setTimeout(){return 1},clearTimeout(){},setInterval(){},navigator:{},window:{},screen:{},document:{hidden:false,body:{dataset:{}},querySelector(s){if(!nodes.has(s))nodes.set(s,element());return nodes.get(s)},querySelectorAll(){return []},createElement:element,addEventListener(){}},localStorage:{getItem(k){return store.get(k)||null},setItem(k,v){store.set(k,v)}}};
  vm.createContext(sandbox);for(const file of ['vendor/proton.min','vendor/wuxia-ui-pack','vendor/wuxia-sprites','profile','sound','world','bosses','enemies','combat','feedback','siege','vfx','arena','game','merchant','camp','controls','arsenal','app'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file+'.js'),'utf8'),sandbox,{filename:file+'.js'});
  return {run:code=>vm.runInContext(code,sandbox),nodes,store,advance(ms){clock+=ms;vm.runInContext('tick()',sandbox)}}
}
test('all stages, factions, combat and rendering remain finite for a two-minute run',()=>{for(let f=0;f<3;f++){const h=harness();h.run(`selected=${f};stageId=${f};start();state.p.hp=state.p.max=1e8;`);for(let i=0;i<2400;i++)h.run("if(mode==='upgrade')$('#choices').children[0].onclick();if(mode==='play')update(.05)");assert.ok(h.run('state.time')>100);assert.ok(h.run('state.kills')>0);assert.ok(h.run('state.enemies.every(e=>e.f!==selected)'));assert.ok(h.run('Number.isFinite(state.p.x)&&Number.isFinite(state.p.hp)'));h.run('render()')}});
test('elapsed-time loop, pause and pointer reset',()=>{const h=harness();h.run('start()');for(let i=0;i<20;i++)h.advance(100);assert.ok(h.run('state.time')>=1.9);h.run("pointer={dx:40,dy:0};keys.d=true;pause()");assert.equal(h.run('mode'),'pause');assert.equal(h.run('pointer'),null);assert.ok(h.nodes.get('#choices').innerHTML.includes('wx-pause-box'));const t=h.run('state.time');h.advance(100);assert.equal(h.run('state.time'),t);h.run('pause()');assert.equal(h.run('mode'),'play')});
test('each weapon attacks independently and evolution recipes activate',()=>{const h=harness();h.run('start();state.skills=[4,4,2,4,0,0,2,2];syncSkills();state.enemies=[{x:40,y:0,hp:10000,f:1,max:10000}];runAttacks(state,.01)');assert.equal(h.run('state.evolved&&state.rain&&state.thunder'),true);assert.ok(h.run("state.shots.some(b=>b.type==='sword')&&state.shots.some(b=>b.type==='knife')"));assert.ok(h.run('state.enemies[0].hp')<10000)});
test('charge direction locks and projectile collision sweeps a segment',()=>{const h=harness();h.run("start();state.enemies=[{x:90,y:0,f:2,hp:100,max:100,speed:30,fire:0,charge:0}];updateEnemy(state.enemies[0],state,.01)");const a=h.run('state.enemies[0].chargeAngle');h.run('state.p.y=200;updateEnemy(state.enemies[0],state,.01)');assert.equal(h.run('state.enemies[0].chargeAngle'),a);assert.equal(h.run('segmentDistance(50,0,0,0,100,0)'),0)});
test('midboss does not satisfy final boss victory condition',()=>{const h=harness();h.run('start();summonBoss(false);damage(state.enemies.at(-1),1e6)');assert.notEqual(h.run('state.bossDead'),true);h.run('summonBoss(true);damage(state.enemies.at(-1),1e6)');assert.equal(h.run('state.bossDead'),true)});
test('run payout is idempotent; training charges once and respects cap',()=>{const h=harness();h.run('start();state.kills=30;state.time=20;end(false)');assert.equal(h.run('Profile.data.silver'),32);h.run('end(false)');assert.equal(h.run('Profile.data.runs'),1);assert.equal(h.run("Profile.buy('power')"),false);h.run('Profile.data.silver=5000');for(let i=0;i<8;i++)h.run("Profile.buy('power')");assert.equal(h.run('Profile.data.training.power'),5);assert.equal(h.run('Profile.data.silver'),4100);assert.equal(h.run("Profile.buy('__proto__')"),false)});
test('save schema clamps invalid values and recovers malformed storage',()=>{let h=harness({'murim.profile.v1':'broken'});assert.equal(h.run('Profile.data.silver'),0);h=harness({'murim.profile.v1':JSON.stringify({version:1,silver:-99,training:{power:100},history:[null,{kills:9,faction:99}]})});assert.equal(h.run('Profile.data.silver'),0);assert.equal(h.run('Profile.data.training.power'),5);assert.equal(h.run('Profile.data.history[0].faction'),2)});
test('all referenced scripts, manifest icons and precache files exist',()=>{const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(m[1].startsWith('http'))continue;assert.ok(fs.existsSync(path.join(root,'dist',m[1].split('?')[0])),m[1])}const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist/manifest.webmanifest')));assert.equal(manifest.orientation,'landscape');for(const i of manifest.icons)assert.ok(fs.existsSync(path.join(root,'dist',i.src)));const sw=fs.readFileSync(path.join(root,'dist/sw.js'),'utf8'),files=sw.match(/const FILES=\[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g);for(const f of files)assert.ok(fs.existsSync(path.join(root,'dist',f[1]==='./'?'index.html':f[1])),f[1]);for(const file of fs.readdirSync(path.join(root,'dist')).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,'dist',file),'utf8'),{filename:file})});
test('five-minute run terminates once, spawns final boss and preserves reward',()=>{const h=harness();h.run('start();state.p.hp=state.p.max=1e8;state.skills=[5,5,5,5,5,5,5,5,5,5,5,5];syncSkills()');for(let i=0;i<6002;i++)h.run("if(mode==='play')update(.05)");assert.equal(h.run('mode'),'end');assert.equal(h.run('Profile.data.runs'),1);assert.equal(h.run('state.boss'),true);assert.ok(h.run('state.enemies.length')<=422);assert.ok(h.run('state.hostile.length')<240)});
test('discrete hits recoil and death creates a transient body without duplicate kills',()=>{const h=harness();h.run('start();const victim={x:40,y:0,f:1,hp:100,max:100,speed:40,hit:0};damage(victim,20,0)');assert.ok(h.run('victim.knockX')>0);assert.ok(h.run('state.impacts.length')>0);h.run('damage(victim,200,0);damage(victim,200,0)');assert.equal(h.run('state.kills'),1);assert.equal(h.run('state.corpses.length'),1);assert.ok(h.run('state.particles.length')>0);h.run('updateFeedback(state,1)');assert.equal(h.run('state.corpses.length'),0);assert.equal(h.run('state.particles.length'),0)});
test('horde reaches high density while respecting the live enemy cap',()=>{const h=harness();h.run('start();state.skills.fill(0);state.p.hp=state.p.max=1e8;for(let i=0;i<1200;i++)update(.05)');assert.ok(h.run('state.enemies.length')>=350);assert.ok(h.run('state.enemies.length')<=420)});
test('spatial broad phase retains every possible swept collision',()=>{const h=harness();h.run('start();state.enemies=[];for(let y=-150;y<151;y+=20)for(let x=-150;x<151;x+=20)state.enemies.push({x,y});buildEnemyGrid(state)');assert.equal(h.run('state.enemies.filter(e=>segmentDistance(e.x,e.y,-120,-25,130,35)<30).every(e=>shotTargets(state,-120,-25,130,35).includes(e))'),true);assert.ok(h.run('shotTargets(state,-10,0,10,0).length')<h.run('state.enemies.length'))});
test('real Proton engine drives bounded skill particles and releases them on reset',()=>{const h=harness();h.run("start();for(let i=0;i<50;i++)VFX.cast('stomp',0,0,{r:140,color:'#8ffdd'});");assert.ok(h.run('VFX.count')<=h.run('VFX.limit'));assert.ok(h.run('VFX.count')>0);h.run("for(let i=0;i<100;i++)VFX.update(state,.02);VFX.front(state);VFX.ground(state)");assert.equal(h.run('VFX.count'),0);h.run("VFX.burst(0,0,'#fff',100);VFX.reset()");assert.equal(h.run('VFX.count'),0)});
test('hell mode raises enemy pressure and skill showcase never awards currency',()=>{const h=harness();h.run("battleMode='hell';start();state.skills.fill(0);state.p.hp=state.p.max=1e8;for(let i=0;i<700;i++)update(.05)");assert.ok(h.run('state.enemies.length')>420);assert.ok(h.run('state.enemies.length')<=540);h.run("$('#fxDemo').onclick();state.time=45;update(.01)");assert.equal(h.run('mode'),'end');assert.equal(h.run('Profile.data.runs'),0);assert.equal(h.run('Profile.data.silver'),0)});
test('wuxia UI pack icons, recipe readiness, pressure HUD and mode subtitle update cleanly',()=>{const h=harness();h.run("chooseBattle('hell')");assert.ok(h.nodes.get('#startSmall').textContent.includes('지옥'));h.run('start();state.skills=[4,0,1,0,0,0,0,0,0,0,0,0];state.wave=2;state.combo=7;state.comboTimer=1.5;state.hudClock=0;updateHUD(state,.1)');assert.equal(h.run('WuxiaUI.recipeStatus(state,2).ready'),true);assert.ok(h.run("WuxiaUI.skillIcon(0,true).includes('<svg')"));assert.equal(h.nodes.get('#waveLabel').textContent,'포위망 3 / 5');assert.equal(h.nodes.get('#combo').textContent,'7 연참!');assert.ok(h.nodes.get('#pressureValue').textContent.length>0)});
test('poison mist slows enemies, level-3 lightning chains, and siege spawns a breakthrough leader',()=>{const h=harness();h.run('start();state.enemies=[{x:30,y:0,f:1,hp:500,max:500,speed:100,fire:2,charge:0},{x:80,y:0,f:1,hp:500,max:500,speed:100,fire:2,charge:0}];state.skills=[0,0,0,0,0,0,3,3,0,0,0,0];runAttacks(state,.1)');assert.ok(h.run('state.enemies[0].poisoned')>0);assert.ok(h.run('state.enemies[1].hp')<500);h.run('state.siegeNext=.01;updateSiege(state,.05)');assert.ok(h.run('state.enemies.some(e=>e.siegeLeader)'))});
test('12 base skills, dual 5-star fusions (합벽절학) and 8 enemy archetypes work cleanly',()=>{const h=harness();h.run('start();state.skills=[5,5,5,5,5,5,5,5,5,5,5,5];syncSkills();state.enemies=[{x:35,y:0,f:1,role:"shield",hp:5000,max:5000,speed:60,fire:1,charge:0}];runAttacks(state,.02);render()');assert.equal(h.run('state.fusions.every(Boolean)'),true);assert.ok(h.nodes.get('#skills').innerHTML.includes('태극양의검진'));assert.ok(h.nodes.get('#skills').innerHTML.includes('이십사수매화검법'));h.run('state.time=160;for(let i=0;i<120;i++)spawn()');assert.ok(h.run('new Set(state.enemies.map(e=>e.role)).size>=4'))});
test('36 unique skills, 36 unique SVG icons, ranged Demonic Cult offense, and 12 sub-sect status explosions',()=>{
  const h=harness();
  assert.equal(h.run('new Set(WuxiaUI.FACTION_SKILLS.flatMap(f=>f.names)).size'),36);
  const icons=[];
  for(let f=0;f<3;f++)for(let i=0;i<12;i++)icons.push(h.run(`WuxiaUI.skillIcon(${i},false,${f})`));
  assert.equal(new Set(icons).size,36);
  for(let f=0;f<3;f++){
    for(let s=0;s<4;s++){
      h.run(`selected=${f};subSect=${s};renderSubSects();start();state.enemies=[{x:260,y:0,f:(${f}+1)%3,hp:120,max:120,speed:50,fire:1,charge:0,bleed:2,poisoned:.5,blackFlame:.5},{x:295,y:0,f:(${f}+1)%3,hp:300,max:300,speed:50,fire:1,charge:0}];runAttacks(state,.02);render()`);
      assert.ok(h.run('state.shots.length')>0, `Faction ${f} subSect ${s} must fire ranged projectiles against distant enemy`);
      h.run('damage(state.enemies[0],500,0)');
      assert.ok(h.run('state.enemies[1].hp')<300);
    }
  }
});
test('merchant spawns in world, keeps four offers, freezes combat and consumes current XP once',()=>{
 const h=harness();h.run('start();state.time=65;updateMerchant(state,.1)');
 assert.equal(h.run('state.merchant.offers.length'),4);
 h.run('state.p.x=state.merchant.x;state.p.y=state.merchant.y;state.xp=9;state.gems=[{x:999,y:999,value:3}];state.merchant.offers[0]={kind:"sword",name:"청강검"};openMerchant()');
 assert.equal(h.run('mode'),'shop');const t=h.run('state.time');h.advance(100);assert.equal(h.run('state.time'),t);
 const level=h.run('state.level'),need=h.run('state.need');assert.equal(h.run('buyMerchant(0)'),true);
 assert.equal(h.run('state.xp'),0);assert.equal(h.run('state.level'),level);assert.equal(h.run('state.need'),need);
 assert.equal(h.run('state.gear.sword'),.18);assert.equal(h.run('state.gems.length'),1);assert.equal(h.run('buyMerchant(0)'),false);
 h.run('openMerchant()');assert.equal(h.run('mode'),'play');
});
test('merchant rejects zero XP, supports leave and return, potion and skill cap',()=>{
 const h=harness();h.run('start();state.time=70;updateMerchant(state,.1);state.p.x=state.merchant.x;state.p.y=state.merchant.y;openMerchant()');
 assert.equal(h.run('buyMerchant(0)'),false);h.run('closeMerchant();state.xp=5;openMerchant()');assert.equal(h.run('mode'),'shop');
 h.run('closeMerchant();state.skills.fill(5)');assert.equal(h.run('merchantOffers(state).every(o=>o.kind!=="skill")'),true);
 h.run('state.merchant.offers[0]={kind:"potion",name:"약"};state.p.hp=1;openMerchant();buyMerchant(0)');assert.equal(h.run('state.p.hp'),46);
});
test('magnet marks only existing gems and player contact damage does not block movement',()=>{
 const h=harness();h.run('start();state.gems=[{x:700,y:0,value:3}];collectExperience(state);state.gems.push({x:700,y:20,value:2})');
 assert.equal(h.run('state.gems[0].magnet'),true);assert.equal(h.run('!!state.gems[1].magnet'),false);
 h.run('state.enemies=[{x:0,y:0,hp:99999,max:99999,f:1,speed:0,fire:999,charge:0}];state.skills.fill(0);keys.d=true;update(.01)');
 assert.ok(h.run('state.inv')>0);const x=h.run('state.p.x'),hp=h.run('state.p.hp');h.run('update(.01)');assert.ok(h.run('state.p.x')>x);assert.equal(h.run('state.p.hp'),hp);
});
test('arena limits walking and dash, and world points map consistently to minimap',()=>{
 const h=harness();h.run('start();state.p.x=1190;state.p.y=790;keys.d=true;keys.s=true;state.inv=999;update(.1);state.dash=0;dash()');
 assert.ok(h.run('state.p.x')<=1182);assert.ok(h.run('state.p.y')<=782);
 assert.equal(h.run('minimapPoint(0,0).x'),80);assert.equal(h.run('minimapPoint(0,0).y'),56);
 assert.equal(h.run('minimapPoint(99999,-99999).x'),152);assert.equal(h.run('minimapPoint(99999,-99999).y'),8);
 h.run('state.time=70;updateMerchant(state,.1);render()');assert.ok(h.run('Math.abs(state.merchant.x)')<=1140);assert.ok(h.run('Math.abs(state.merchant.y)')<=740);
 assert.equal(h.nodes.get('#minimap').hidden,false);
});
test('edge reinforcements stay inside arena and minimap handles a dense battlefield',()=>{
 const h=harness();h.run('start();state.p.x=-1182;state.p.y=-782;state.time=160;state.siegeNext=0;updateSiege(state,.1);drawMinimap(state)');
 assert.ok(h.run('state.enemies.every(e=>e.x>=-1200&&e.x<=1200&&e.y>=-800&&e.y<=800)'));
 h.run('end(false);drawMinimap(state)');assert.equal(h.nodes.get('#minimap').hidden,false);
});
test('C sprite catalogue covers all factions and roles with cached pixel frames',()=>{
 const h=harness();assert.equal(h.run('WuxiaSprites.style'),'C');
 assert.equal(h.run('WuxiaSprites.heroNames.flat().length'),12);assert.equal(h.run('WuxiaSprites.roles.length'),8);
 h.run('for(let f=0;f<3;f++){for(let sub=0;sub<4;sub++)for(let frame=0;frame<3;frame++)WuxiaSprites.frame(f,"hero",sub,frame,false);for(const role of WuxiaSprites.roles){WuxiaSprites.frame(f,role,0,0,false);WuxiaSprites.frame(f,role,0,1,true)}}');
 assert.equal(h.run('WuxiaSprites.frame(1,"shield",0,0,false)===WuxiaSprites.frame(1,"shield",0,0,false)'),true);
 assert.equal(h.run('WuxiaSprites.frame(0,"hero",0,0,false).width'),40);
 assert.ok(h.run('WuxiaSprites.cachedFrames')<300);
 h.run('start();for(const role of WuxiaSprites.roles)deathFeedback({x:0,y:0,f:1,role,boss:role==="boss"});drawCorpses(state)');
});
test('locomotion has four phases, idles still, and remains independent of attack',()=>{
 const h=harness();assert.equal(h.run('WuxiaSprites.animationFrame(5,false)'),0);
 const phases=[0,.1,.2,.3].map(t=>h.run(`WuxiaSprites.animationFrame(${t},true)`));assert.equal(new Set(phases).size,4);
 h.run('start();state.inv=999;keys.d=true;update(.05)');const clock=h.run('state.walkTime');assert.ok(clock>0);assert.equal(h.run('state.moving'),true);
 h.run('keys={};update(.05)');assert.equal(h.run('state.moving'),false);assert.equal(h.run('state.walkTime'),clock);
 h.run('keys.a=true;update(.05)');assert.equal(h.run('state.face'),-1);
 assert.notEqual(h.run('WuxiaSprites.frame(0,"hero",1,1,false,true)'),h.run('WuxiaSprites.frame(0,"hero",1,3,false,true)'));
 h.run('state.enemies=[{x:300,y:200,f:0,role:"spearman",speed:80,fire:99,hp:999,max:999}];updateEnemy(state.enemies[0],state,.1)');assert.equal(h.run('state.enemies[0].moving'),true);assert.ok(h.run('state.enemies[0].animTime')>0);
});
test('redesigned skill silhouettes render every cast and projectile family',()=>{
 const h=harness();h.run('start()');
 for(const type of ['slash','throw','meteor','buddha','stomp','ice','blood_burst','poison','dragon_strike','lightning','chain','shadow_clone'])h.run(`VFX.cast('${type}',0,0,{tx:80,ty:20,r:80});VFX.update(state,.1);VFX.front(state)`);
 for(const style of ['dragon_wave','black_dragon','arhat','plum','wraith','dharma_wheel','venom_wave','shadow_dagger','blood_spear','emerald_staff','taiji','blood_blade','cleaver_wave','demonic_slash'])h.run(`VFX.projectile({x:0,y:0,vx:100,vy:0,style:'${style}',type:'sword'},state)`);
});
