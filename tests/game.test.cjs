const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function harness(saved,html){
  const nodes=new Map(),store=new Map(saved?Object.entries(saved):[]);let clock=0;
  function element(){let html='';return {children:[],dataset:{},style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},hidden:false,textContent:'',get innerHTML(){return html},set innerHTML(v){html=v;this.children=[]},append(e){this.children.push(e)},querySelector(){return null},querySelectorAll(){return []},insertAdjacentHTML(){},setAttribute(){},addEventListener(){},setPointerCapture(){},toDataURL(){return 'data:image/png;base64,'},getContext(){return new Proxy({},{get:()=>()=>({})})}}}
  const sandbox={console,Math,Date,Set,Map,JSON,Number,Object,performance:{now:()=>clock},innerWidth:960,innerHeight:540,devicePixelRatio:1,addEventListener(){},setTimeout(){return 1},clearTimeout(){},setInterval(){},requestAnimationFrame(){},navigator:{},window:{},screen:{},document:{hidden:false,body:{dataset:{}},querySelector(s){if(!nodes.has(s)){const e=element();if(s==='#camp')e.hidden=true;nodes.set(s,e)}return nodes.get(s)},querySelectorAll(){return []},createElement:element,addEventListener(){}},localStorage:{getItem(k){return store.get(k)||null},setItem(k,v){store.set(k,v)}}};
  vm.createContext(sandbox);if(html){for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],sandbox)}else for(const file of ['vendor/proton.min','vendor/wuxia-ui-pack','vendor/wuxia-sprites','vendor/latest-pixel-items','vendor/jianghu-fx','profile','sound','world','bosses','enemies','sect','trajectories','combat','feedback','siege','vfx','arena','equipment','jianghu','links','progression','game','merchant','camp','controls','arsenal','app'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file+'.js'),'utf8'),sandbox,{filename:file+'.js'});
  return {run:code=>vm.runInContext(code,sandbox),nodes,store,advance(ms){clock+=ms;vm.runInContext('tick(performance.now())',sandbox)}}
}
test('all stages, factions, combat and rendering remain finite for a two-minute run',()=>{for(let f=0;f<3;f++){const h=harness();h.run(`selected=${f};stageId=${f};start();state.p.hp=state.p.max=1e8;`);for(let i=0;i<2400;i++)h.run("if(mode==='reward')closeTreasure();if(mode==='upgrade')$('#choices').children[0].onclick();if(mode==='reward')closeTreasure();if(mode==='play')update(.05)");assert.ok(h.run('state.time')>100);assert.ok(h.run('state.kills')>0);assert.ok(h.run('state.enemies.every(e=>e.f!==selected)'));assert.ok(h.run('Number.isFinite(state.p.x)&&Number.isFinite(state.p.hp)'));h.run('render()')}});
test('elapsed-time loop, pause and pointer reset',()=>{const h=harness();h.run('start()');for(let i=0;i<40;i++)h.advance(50);assert.ok(h.run('state.time')>=1.9);h.run("pointer={dx:40,dy:0};keys.d=true;pause()");assert.equal(h.run('mode'),'pause');assert.equal(h.run('pointer'),null);assert.ok(h.nodes.get('#choices').innerHTML.includes('wx-pause-box'));const t=h.run('state.time');h.advance(100);assert.equal(h.run('state.time'),t);h.run('pause()');assert.equal(h.run('mode'),'play')});
test('each weapon attacks independently and evolution recipes activate',()=>{const h=harness();h.run('start();state.skills=[4,4,2,4,0,0,2,2];syncSkills();state.enemies=[{x:40,y:0,hp:10000,f:1,max:10000}];runAttacks(state,.01)');assert.equal(h.run('state.evolved&&state.rain&&state.thunder'),true);assert.ok(h.run("state.shots.some(b=>b.type==='sword')&&state.shots.some(b=>b.type==='knife')"));assert.ok(h.run('state.enemies[0].hp')<10000)});
test('charge direction locks and projectile collision sweeps a segment',()=>{const h=harness();h.run("start();state.enemies=[{x:90,y:0,f:2,hp:100,max:100,speed:30,fire:0,charge:0}];updateEnemy(state.enemies[0],state,.01)");const a=h.run('state.enemies[0].chargeAngle');h.run('state.p.y=200;updateEnemy(state.enemies[0],state,.01)');assert.equal(h.run('state.enemies[0].chargeAngle'),a);assert.equal(h.run('segmentDistance(50,0,0,0,100,0)'),0)});
test('midboss does not satisfy final boss victory condition',()=>{const h=harness();h.run('start();summonBoss(false);for(let i=0;i<10;i++){state.time+=.51;damage(state.enemies.at(-1),1e6)}');assert.notEqual(h.run('state.bossDead'),true);h.run('summonBoss(true);for(let i=0;i<10;i++){state.time+=.51;damage(state.enemies.at(-1),1e6)}');assert.equal(h.run('state.bossDead'),true)});
test('run payout is idempotent; training charges once and respects cap',()=>{const h=harness();h.run('start();state.kills=30;state.time=20;end(false)');assert.equal(h.run('Profile.data.silver'),32);h.run('end(false)');assert.equal(h.run('Profile.data.runs'),1);assert.equal(h.run("Profile.buy('power')"),false);h.run('Profile.data.silver=5000');for(let i=0;i<8;i++)h.run("Profile.buy('power')");assert.equal(h.run('Profile.data.training.power'),5);assert.equal(h.run('Profile.data.silver'),4100);assert.equal(h.run("Profile.buy('__proto__')"),false)});
test('save schema clamps invalid values and recovers malformed storage',()=>{let h=harness({'murim.profile.v1':'broken'});assert.equal(h.run('Profile.data.silver'),0);h=harness({'murim.profile.v1':JSON.stringify({version:1,silver:-99,training:{power:100},history:[null,{kills:9,faction:99}]})});assert.equal(h.run('Profile.data.silver'),0);assert.equal(h.run('Profile.data.training.power'),5);assert.equal(h.run('Profile.data.history[0].faction'),2)});
test('all referenced scripts, manifest icons and precache files exist',()=>{const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(m[1].startsWith('http'))continue;assert.ok(fs.existsSync(path.join(root,'dist',m[1].split('?')[0])),m[1])}const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist/manifest.webmanifest')));assert.equal(manifest.orientation,'landscape');for(const i of manifest.icons)assert.ok(fs.existsSync(path.join(root,'dist',i.src)));const sw=fs.readFileSync(path.join(root,'dist/sw.js'),'utf8'),files=sw.match(/const FILES=\[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g);for(const f of files)assert.ok(fs.existsSync(path.join(root,'dist',f[1]==='./'?'index.html':f[1])),f[1]);for(const file of fs.readdirSync(path.join(root,'dist')).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,'dist',file),'utf8'),{filename:file})});
test('five-minute run terminates once, spawns final boss and preserves reward',()=>{const h=harness();h.run('start();state.p.hp=state.p.max=1e8;state.skills=[5,5,5,5,5,5,5,5,5,5,5,5];syncSkills()');for(let i=0;i<6200;i++)h.run("if(mode==='upgrade')$('#choices').children[0].onclick();if(mode==='reward')closeTreasure();if(mode==='play')update(.05)");assert.equal(h.run('mode'),'end');assert.equal(h.run('Profile.data.runs'),1);assert.equal(h.run('state.boss'),true);assert.ok(h.run('state.enemies.length')<=422);assert.ok(h.run('state.hostile.length')<240)});
test('discrete hits recoil and death creates a transient body without duplicate kills',()=>{const h=harness();h.run('start();const victim={x:40,y:0,f:1,hp:100,max:100,speed:40,hit:0};damage(victim,20,0)');assert.ok(h.run('victim.knockX')>0);assert.ok(h.run('state.impacts.length')>0);h.run('damage(victim,200,0);damage(victim,200,0)');assert.equal(h.run('state.kills'),1);assert.equal(h.run('state.corpses.length'),1);assert.ok(h.run('state.particles.length')>0);h.run('updateFeedback(state,1)');assert.equal(h.run('state.corpses.length'),0);assert.equal(h.run('state.particles.length'),0)});
test('horde reaches high density while respecting the live enemy cap',()=>{const h=harness();h.run('start();state.skills.fill(0);state.sect.cooldown=999;state.props=[];state.p.hp=state.p.max=1e8;for(let i=0;i<1200;i++)update(.05)');assert.ok(h.run('state.enemies.length')>=350);assert.ok(h.run('state.enemies.length')<=420)});
test('spatial broad phase retains every possible swept collision',()=>{const h=harness();h.run('start();state.enemies=[];for(let y=-150;y<151;y+=20)for(let x=-150;x<151;x+=20)state.enemies.push({x,y});buildEnemyGrid(state)');assert.equal(h.run('state.enemies.filter(e=>segmentDistance(e.x,e.y,-120,-25,130,35)<30).every(e=>shotTargets(state,-120,-25,130,35).includes(e))'),true);assert.ok(h.run('shotTargets(state,-10,0,10,0).length')<h.run('state.enemies.length'))});
test('real Proton engine drives bounded skill particles and releases them on reset',()=>{const h=harness();h.run("start();for(let i=0;i<50;i++)VFX.cast('stomp',0,0,{r:140,color:'#8ffdd'});");assert.ok(h.run('VFX.count')<=h.run('VFX.limit'));assert.ok(h.run('VFX.count')>0);h.run("for(let i=0;i<100;i++)VFX.update(state,.02);VFX.front(state);VFX.ground(state)");assert.equal(h.run('VFX.count'),0);h.run("VFX.burst(0,0,'#fff',100);VFX.reset()");assert.equal(h.run('VFX.count'),0)});
test('hell mode raises enemy pressure and skill showcase never awards currency',()=>{const h=harness();h.run("battleMode='hell';start();state.skills.fill(0);state.sect.cooldown=999;state.props=[];state.p.hp=state.p.max=1e8;for(let i=0;i<700;i++)update(.05)");assert.ok(h.run('state.enemies.length')>420);assert.ok(h.run('state.enemies.length')<=540);h.run("$('#fxDemo').onclick();state.time=45;update(.01)");assert.equal(h.run('mode'),'end');assert.equal(h.run('Profile.data.runs'),0);assert.equal(h.run('Profile.data.silver'),0)});
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
      h.run(`selected=${f};subSect=${s};renderSubSects();start();state.enemies=[{x:130,y:0,f:(${f}+1)%3,hp:120,max:120,speed:50,fire:1,charge:0,bleed:2,poisoned:.5,blackFlame:.5},{x:165,y:0,f:(${f}+1)%3,hp:300,max:300,speed:50,fire:1,charge:0}];runAttacks(state,.02);render()`);
      assert.ok(h.run('state.shots.length+(state.pendingShots?.length||0)')>0, `Faction ${f} subSect ${s} must fire ranged projectiles against distant enemy`);
      h.run('damage(state.enemies[0],500,0)');
      assert.ok(h.run('state.enemies[1].hp')<300);
    }
  }
});
test('merchant spawns in world, keeps four offers, freezes combat and consumes current XP once',()=>{
 const h=harness();h.run('start();state.time=65;updateMerchant(state,.1)');
 assert.equal(h.run('state.merchant.offers.length'),4);
 h.run('state.p.x=state.merchant.x;state.p.y=state.merchant.y;state.xp=9;state.gems=[{x:999,y:999,value:3}];state.merchant.offers[0]={kind:"equipment",name:"수련 철검",item:{slot:"weapon",rank:0,foundAt:65}};openMerchant()');
 assert.equal(h.run('mode'),'shop');const t=h.run('state.time');h.advance(100);assert.equal(h.run('state.time'),t);
 const level=h.run('state.level'),need=h.run('state.need');assert.equal(h.run('buyMerchant(0)'),true);
 assert.equal(h.run('state.xp'),0);assert.equal(h.run('state.level'),level);assert.equal(h.run('state.need'),need);
 assert.equal(h.run('Equipment.bonus(state,"attack")'),.04);assert.equal(h.run('state.gems.length'),1);assert.equal(h.run('buyMerchant(0)'),false);
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
 assert.equal(h.run('WuxiaSprites.frame(0,"hero",0,0,false).width'),96);
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
test('primary attack prepares, releases once and keeps movement enabled',()=>{
 const h=harness();h.run('start();state.skills.fill(0);state.skills[4]=1;state.cooldowns={guard:999,innate:0};state.enemies=[{x:50,y:0,f:1,hp:1000,max:1000,speed:0,fire:99}];runAttacks(state,.01)');
 assert.equal(h.run('state.attack.phase'),1);assert.equal(h.run('state.pendingShots?.length||0'),0);assert.equal(h.run('state.shots.length'),0);
 h.run('updateAttackMotion(state,.06)');assert.equal(h.run('state.attack.phase'),2);assert.equal(h.run('state.shots.length'),0);
 h.run('updateAttackMotion(state,.07)');assert.equal(h.run('state.attack.phase'),3);assert.ok(h.run('state.enemies[0].hp')<1000);assert.equal(h.run('state.shots.length'),0);assert.equal(h.run('state.weaponArcs.length'),1);
 const hp=h.run('state.enemies[0].hp'),count=h.run('state.shots.length');h.run('updateAttackMotion(state,.03)');assert.equal(h.run('state.enemies[0].hp'),hp);assert.equal(h.run('state.shots.length'),count);
 h.run('keys.d=true;state.inv=999;const before=state.p.x;update(.01);');assert.ok(h.run('state.p.x')>0);
});
test('64px artwork rasterizes different preparation and strike poses',()=>{
 const h=harness();const poses=h.run(`(()=>{const old=document.createElement;const out=[];for(let p=1;p<=5;p++){let ops=[];const g={fillRect(...args){ops.push([this.fillStyle,...args])},translate(){}};document.createElement=()=>({getContext:()=>g});const image=WuxiaSprites.frame(2,'hero',3,8,true,p);out.push(JSON.stringify(ops));if(image.width!==96)throw Error('cell size')}document.createElement=old;return out})()`);
 assert.equal(new Set(poses).size,5);assert.equal(h.run('WuxiaSprites.characterPixels'),64);
});
test('opening wave includes human enemy variety and corpses preserve appearances',()=>{
 const h=harness();h.run('start();state.enemies=[];for(let i=0;i<180;i++)spawn()');assert.ok(h.run('new Set(state.enemies.map(e=>e.role)).size')>=3);assert.ok(h.run('new Set(state.enemies.map(e=>e.look)).size')>=3);
 h.run('const chosen=state.enemies.find(e=>e.look===2);chosen.hp=1;damage(chosen,1000,0)');assert.equal(h.run('state.corpses.at(-1).look'),2);
});

test('single projectiles stop at nearest hit and piercing has a finite target limit',()=>{
 const h=harness();h.run('start();state.skills.fill(0);state.sect.cooldown=999;state.spawn=state.siegeNext=999;state.enemies=[100,140,180].map(x=>({x,y:0,f:1,hp:1000,max:1000,speed:0,fire:999}));shot(0,1000,20,"knife",1,"default");update(.2)');
 assert.ok(h.run('state.enemies[0].hp')<1000);assert.equal(h.run('state.enemies[1].hp'),1000);assert.equal(h.run('state.enemies[2].hp'),1000);assert.equal(h.run('state.shots.length'),0);
 h.run('state.enemies=[40,70,100,130,160].map(x=>({x,y:0,f:1,hp:1000,max:1000,speed:0,fire:999}));shot(0,1000,20,"sword",1,"blood_spear",false,5);update(.2)');
 assert.equal(h.run('state.enemies.filter(e=>e.hp<1000).length'),4);assert.equal(h.run('state.shots.length'),0);
});
test('projectile pool is bounded and distinct impact policies are explicit',()=>{
 const h=harness();h.run('start();state.shots=[];for(let i=0;i<500;i++)shot(0,100,20,"knife")');assert.equal(h.run('state.shots.length'),220);
 const modes=['taiji','wraith','emerald_staff','venom_wave','plum'].map(style=>h.run(`projectilePolicy('sword','${style}').mode`));assert.equal(new Set(modes).size,5);
 assert.equal(h.run('projectilePolicy("fire","black_dragon").remainingHits'),1);
});
test('all 12 sects have an available innate skill and all mastered signatures continue to sect growth',()=>{
 const h=harness();assert.equal(h.run('new Set(SectSystem.catalog.map(c=>c.type)).size'),12);
 for(let f=0;f<3;f++)for(let sub=0;sub<4;sub++){
  h.run(`selected=${f};subSect=${sub};start();state.enemies=[{x:100,y:0,f:(${f}+1)%3,hp:10000,max:10000,speed:0,fire:999}];state.sect.cooldown=0;SectSystem.update(state,.01)`);assert.equal(h.run('state.sect.casts'),1);assert.equal(h.run('state.skills.filter(Boolean).length'),1);
  h.run('for(const i of SectSystem.slots())state.skills[i]=5;upgrade()');assert.equal(h.run('mode'),'upgrade');assert.equal(h.nodes.get('#choices').children.length,3);assert.ok(h.nodes.get('#modalEyebrow').textContent.includes('문파 심화'));
  h.nodes.get('#choices').children[0].onclick();assert.equal(h.run('state.sect.mastery[0]'),1);assert.equal(h.run('mode'),'play');
 }
 h.run('for(let j=0;j<50;j++)for(let i=0;i<3;i++)SectSystem.learn(state,i)');assert.equal(h.run('state.sect.mastery.every(n=>n===6)'),true);assert.equal(h.run('SectSystem.upgrades(state)[0].mastery'),3);
});
test('unfinished signature is guaranteed and ordinary manuals remain optional after mastery',()=>{
 const h=harness();h.run('selected=0;subSect=2;start();state.skills.fill(5);state.skills[1]=4;upgrade()');assert.equal(h.nodes.get('#choices').children[0].dataset.skill,'1');
 h.run('state.skills[1]=5;state.skills[3]=0;upgrade()');assert.ok(h.nodes.get('#modalTitle').textContent.includes('매화삼첩'));h.nodes.get('#resume').onclick();assert.equal(h.nodes.get('#choices').children[0].dataset.skill,'3');
});
test('boss burst guard, late shields, and lethal damage-over-time resolve correctly',()=>{
 const h=harness();h.run('start();state.enemies=[{x:100,y:0,f:1,hp:1000,max:1000,boss:true}];Profile.data.training.power=5;damage(state.enemies[0],100000,0);damage(state.enemies[0],100000,0)');assert.equal(h.run('state.enemies[0].hp'),880);
 h.run('state.time+=.51;damage(state.enemies[0],100000,0)');assert.equal(h.run('state.enemies[0].hp'),760);
 h.run('state.enemies=[{x:100,y:0,f:1,hp:100,max:100,guardHits:2}];damage(state.enemies[0],20,0)');assert.equal(h.run('state.enemies[0].guardHits'),1);assert.ok(h.run('state.enemies[0].hp')>90);
 h.run('state.enemies=[{x:100,y:0,f:1,hp:1,max:100,bleed:4,speed:0,fire:999}];updateEnemy(state.enemies[0],state,.2)');assert.equal(h.run('state.enemies[0].dead'),true);
});

test('primary melee has finite reach and target budget, ranged retains delayed release',()=>{
 const h=harness();h.run("selected=0;subSect=2;start();state.skills.fill(0);state.skills[1]=1;state.cooldowns={knife:999,innate:0};state.enemies=Array.from({length:8},(_,i)=>({x:45+i*2,y:0,hp:1000,max:1000,f:1}));runAttacks(state,.01);updateAttackMotion(state,.13)");
 assert.equal(h.run('state.enemies.filter(e=>e.hp<1000).length'),1);
 h.run("selected=1;subSect=1;start();state.skills.fill(0);state.skills[6]=1;state.enemies=[{x:280,y:0,hp:1000,max:1000,f:0}];runAttacks(state,.01)");assert.ok(h.run('state.pendingShots.length')>0);h.run('updateAttackMotion(state,.13)');assert.ok(h.run('state.shots.length')>0);
});
test('weapon growth changes damage reach cadence and allows ordinary manuals',()=>{
 const h=harness();h.run('start();state.level=3;const baseWeapon=primaryStats(state);upgrade()');assert.equal(h.run('mode'),'upgrade');assert.equal(h.nodes.get('#choices').children.length,3);
 h.run("$('#choices').children[0].onclick()");assert.equal(h.run('state.weaponGrowth[0]'),1);assert.ok(h.run('primaryStats(state).damage>baseWeapon.damage'));
 h.run("upgrade();$('#resume').onclick()");assert.ok(h.nodes.get('#choices').children.every(b=>b.dataset.skill!==undefined));
 h.run("state.weaponGrowth=[5,5,5];upgrade()");assert.ok(h.nodes.get('#choices').children.length>0);
});
test('enemy attack depends on role rather than faction, without overlapping-body teleport',()=>{
 const h=harness();h.run("start();state.enemies=[{x:190,y:0,hp:100,max:100,speed:40,f:1,role:'disciple',fire:0},{x:191,y:0,hp:100,max:100,speed:40,f:2,role:'archer',fire:0}];buildEnemyGrid(state);updateEnemy(state.enemies[0],state,.02)");assert.equal(h.run('state.hostile.length'),0);
 h.run('updateEnemy(state.enemies[1],state,.02)');assert.equal(h.run('state.hostile.length'),1);assert.ok(h.run('Math.hypot(state.enemies[0].x-190,state.enemies[0].y)<4'));
});

test('all twelve fresh sects start with one projectile and one melee target before growth',()=>{
 for(let f=0;f<3;f++)for(let sub=0;sub<4;sub++){const h=harness();h.run(`selected=${f};subSect=${sub};start();state.enemies=[{x:100,y:0,hp:1000,max:1000,f:(${f}+1)%3}];runAttacks(state,.01)`);assert.equal(h.run('(state.pendingShots?.length||0)+state.shots.length'),1,`${f}/${sub}`);assert.equal(h.run('primaryStats(state).targets'),1);assert.equal(h.run('state.shots.concat(state.pendingShots||[]).every(b=>b.remainingHits===1&&b.mode==="single")'),true);assert.equal(h.run('canUseSkill(state,WuxiaUI.SUB_SECTS[selected][subSect].startSkill)'),false)}
});
test('relic pickup continues combat, locks grade at drop time and gives no free skill ranks',()=>{
 const h=harness();h.run('start();state.xp=7;state.time=65;const elite={x:0,y:0,elite:true};dropTreasure(state,elite,()=>0);dropTreasure(state,elite,()=>0)');assert.equal(h.run('state.treasures.length'),1);assert.ok(h.run('state.treasures[0].item.rank')<=2);h.run('state.time=250;updateJianghu(state,.01)');assert.equal(h.run('mode'),'play');assert.equal(h.run('state.equipment.weapon.foundAt'),65);assert.equal(h.run('state.xp'),7);assert.equal(h.run('state.skills.reduce((a,b)=>a+b,0)'),1);assert.equal(h.run('Profile.data.silver'),0);assert.equal(h.run('state.treasures.length'),0);assert.equal(h.run('Equipment.decide(false)'),false);
 h.run('openTreasure(state,{item:{slot:"armor",rank:0,foundAt:10}});Equipment.decide(false)');assert.equal(h.run('Profile.data.silver'),3);assert.equal(h.run('state.xp'),7);
});
test('boss factions create different telegraphed patterns, never instant damage',()=>{
 for(let f=0;f<3;f++){const h=harness();h.run(`start();state.enemies=[];state.inv=0;const b={x:90,y:0,f:${f},hp:100,max:100,phase:1,speed:30};bossPattern(b,state)`);assert.equal(h.run('state.hazards[0].type'),['cross','ambush','meteor'][f]);const hp=h.run('state.p.hp');h.run('updateJianghu(state,.5)');assert.equal(h.run('state.p.hp'),hp);h.run('updateJianghu(state,.65)');assert.ok(h.run('state.p.hp')<hp);h.run('drawJianghu(state)')}
});
test('explosive jars and cultivation objects work once with cooldown and no frame-rate dependence',()=>{
 const h=harness();h.run("start();state.enemies=[{x:40,y:0,f:1,hp:500,max:500}];const jar={x:0,y:0,type:'barrel',hp:26};breakProp(state,jar,100)");const hp=h.run('state.enemies[0].hp');assert.ok(hp<500);h.run('breakProp(state,jar,100)');assert.equal(h.run('state.enemies[0].hp'),hp);
 h.run("state.p.hp=50;state.props=[{x:0,y:0,type:'herb',used:false}];updateJianghu(state,.01)");assert.equal(h.run('state.p.hp'),62);assert.equal(h.run('state.cultivation'),8);h.run('updateJianghu(state,1)');assert.equal(h.run('state.p.hp'),62);
});
test('legacy profile migrates seven training paths and first-clear seals grant once',()=>{
 const h=harness({'murim.profile.v1':JSON.stringify({version:1,silver:123,training:{power:2},settings:{sound:true}})});assert.equal(h.run('Object.keys(Profile.data.training).length'),7);assert.equal(h.run('Profile.data.training.mobility'),0);assert.equal(h.run('Profile.data.silver'),123);h.run('Profile.finish({faction:2,subSect:3,kills:0,time:300,win:true})');assert.equal(h.run('Profile.data.seals[11]'),true);const balance=h.run('Profile.data.silver');h.run('Profile.finish({faction:2,subSect:3,kills:0,time:300,win:true})');assert.equal(h.run('Profile.data.silver')-balance,150);h.run('selected=0;subSect=0;start()');assert.equal(h.run('state.p.max'),153);
});
test('training perks affect movement dash healing start ranks and rerolls without XP spending',()=>{
 const h=harness();h.run('Profile.data.training.mobility=5;Profile.data.training.origin=1;Profile.data.training.destiny=2;Profile.data.training.recovery=3;start();state.props=[];state.enemies=[];state.spawn=state.siegeNext=999;keys.d=true;update(.1)');assert.ok(h.run('state.p.x')>=18);assert.equal(h.run('state.skills[WuxiaUI.SUB_SECTS[selected][subSect].startSkill]'),2);h.run('dash()');assert.ok(h.run('state.dash')<=2.1);h.run('state.p.hp=50;state.recoverClock=.1;updateJianghu(state,.2)');assert.equal(h.run('state.p.hp'),53);h.run("state.xp=7;upgrade(true);$('#reroll').onclick()");assert.equal(h.run('state.rerolls'),1);assert.equal(h.run('state.xp'),7);
});
test('pentatonic music schedules bounded notes and fades while paused',()=>{
 const h=harness();h.run(`var starts=0,targets=[];const param={value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(v){targets.push(v)}};const node=()=>({gain:param,frequency:param,connect(){},start(){starts++},stop(){}});window.AudioContext=class{constructor(){this.state='running';this.currentTime=0;this.destination={}}createGain(){return node()}createOscillator(){return node()}resume(){return Promise.resolve()}};Music.toggle();Music.update(true,false)`);assert.ok(h.run('starts')>0);h.run('Music.update(false,false)');assert.equal(h.run('targets.at(-1)'),0);h.run('Music.toggle()');assert.equal(h.run('Profile.data.settings.bgm'),false);
});

test('five gear grades unlock by survival time and probabilities total one hundred',()=>{
 const h=harness();for(const t of [0,59,60,119,120,179,180,239,240,999])assert.equal(h.run(`Equipment.weights(${t}).reduce((a,b)=>a+b,0)`),100);
 assert.equal(h.run('Equipment.weights(0)[2]'),0);assert.equal(h.run('Equipment.weights(119)[3]'),0);assert.equal(h.run('Equipment.weights(179)[4]'),0);assert.equal(h.run('Equipment.roll(0,()=>.999).rank'),1);assert.equal(h.run('Equipment.roll(60,()=>.999).rank'),2);assert.equal(h.run('Equipment.roll(120,()=>.999).rank'),3);assert.equal(h.run('Equipment.roll(240,()=>.999).rank'),4);
});
test('equipment replaces rather than stacks and resets each run',()=>{
 const h=harness();h.run('start();Equipment.equip(state,{slot:"weapon",rank:0});Equipment.equip(state,{slot:"weapon",rank:4})');assert.equal(h.run('Equipment.bonus(state,"attack")'),.19);assert.equal(h.run('Equipment.equip(state,{slot:"weapon",rank:3})'),false);assert.equal(h.run('Equipment.equip(state,{slot:"weapon",rank:99})'),false);h.run('const enemy={x:0,y:0,hp:1000,max:1000,f:1};damage(enemy,100,0)');assert.ok(Math.abs(h.run('enemy.hp')-881)<.01);h.run('start()');assert.equal(h.run('Equipment.bonus(state,"attack")'),0);
});
test('end screen offers affordable permanent training and returning keeps run payout idempotent',()=>{
 const h=harness();h.run('start();state.kills=180;end(false)');assert.equal(h.nodes.get('#postTraining').hidden,false);assert.equal(h.nodes.get('#postTraining').disabled,false);const count=h.run('Profile.data.runs');h.run("$('#postTraining').onclick();Profile.buy('power');paintPostRunTraining();$('#campClose').onclick()");assert.equal(h.run('mode'),'end');assert.equal(h.run('Profile.data.training.power'),1);h.run('end(false)');assert.equal(h.run('Profile.data.runs'),count);h.run('start()');assert.equal(h.run('Profile.data.training.power'),1);
});

test('uploaded latest regression: exported standalone starts, advances, renders and terminates',()=>{
 const os=require('node:os'),cp=require('node:child_process'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'murim-export-')),file=path.join(dir,'game.html');
 try{cp.execFileSync(process.execPath,[path.join(root,'scripts/export-single.cjs'),file]);const html=fs.readFileSync(file,'utf8');assert.ok(!/<script src=/.test(html));assert.ok(html.includes('PixelFx-LICENSE'));const h=harness(null,html);h.run('start();update(.016);render()');assert.ok(h.run('state.time')>0);assert.equal(h.run('survivalTimeLimit'),300);h.run('state.time=300;update(.01)');assert.equal(h.run('mode'),'end')}finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test('all twelve equipment variants have distinct bonuses, roll in correct slots and reset',()=>{
 const h=harness();h.run('start()');assert.equal(h.run('Equipment.types.length'),12);assert.equal(h.run('new Set(Equipment.types.map(t=>JSON.stringify(t.stats(2)))).size'),12);
 for(const slot of ['weapon','armor','charm'])for(const r of [.01,.26,.51,.99])assert.equal(h.run(`Equipment.roll(240,()=>${r},'${slot}').slot`),slot);
 h.run('Equipment.equip(state,{slot:"weapon",variant:"spear",rank:2})');assert.equal(h.run('Equipment.bonus(state,"reach")'),14);assert.equal(h.run('primaryStats(state).targets'),1);h.run('Equipment.equip(state,{slot:"armor",variant:"leather",rank:2});Equipment.equip(state,{slot:"charm",variant:"bell",rank:2})');assert.equal(h.run('Equipment.bonus(state,"speed")'),8);assert.equal(h.run('Equipment.bonus(state,"magnet")'),30);assert.equal(h.run('Equipment.valid({slot:"weapon",variant:"bell",rank:2})'),false);
 h.run('start()');assert.equal(h.run('Equipment.bonus(state,"reach")'),0);assert.equal(h.run('state.lootBag.length'),0);
});
test('nonboss chests respect chance boundary, shared cooldown, cap and duplicate prevention',()=>{
 const h=harness();h.run('start();state.time=60');assert.equal(h.run('dropTreasure(state,{x:0,y:0,elite:true},()=>.08)'),false);assert.equal(h.run('dropTreasure(state,{x:0,y:0,elite:true},()=>.079)'),true);assert.equal(h.run('dropTreasure(state,{x:0,y:0,siegeLeader:true},()=>0)'),false);
 h.run('state.time=80');assert.equal(h.run('dropTreasure(state,{x:0,y:0,siegeLeader:true},()=>.3)'),false);assert.equal(h.run('dropTreasure(state,{x:0,y:0,siegeLeader:true},()=>.299)'),true);
 h.run('for(let i=0;i<8;i++){state.time+=21;dropTreasure(state,{x:0,y:0,elite:true},()=>0)}');assert.equal(h.run('state.randomRelics'),5);assert.equal(h.run('state.treasures.length'),5);assert.equal(h.run('dropTreasure(state,{x:0,y:0,boss:true},()=>.999)'),true);
});
test('alternative gear is banked without interruption; optional compare swaps once and keeps old gear',()=>{
 const h=harness();h.run('start();Equipment.equip(state,{slot:"weapon",variant:"jian",rank:2});const chest={item:{slot:"weapon",variant:"saber",rank:1,foundAt:120}};Equipment.collect(state,chest);Equipment.collect(state,chest)');assert.equal(h.run('mode'),'play');assert.equal(h.run('state.lootBag.length'),1);assert.equal(h.run('state.equipment.weapon.variant'),'jian');h.run('Equipment.open();Equipment.inspect(state.lootBag[0].lootId)');assert.equal(h.run('mode'),'reward');assert.equal(h.run('Equipment.decide(true)'),true);assert.equal(h.run('Equipment.decide(true)'),false);assert.equal(h.run('state.equipment.weapon.variant'),'saber');assert.equal(h.run('state.lootBag[0].variant'),'jian');assert.equal(h.run('Profile.data.silver'),0);
 h.run('Equipment.open();Equipment.inspect(state.lootBag[0].lootId);closeTreasure()');assert.equal(h.run('state.lootBag.length'),1);assert.equal(h.run('mode'),'play');
});
test('bag overflow and duplicates salvage once with demo persistence disabled',()=>{
 const h=harness();h.run('start();state.demo=true;Equipment.equip(state,{slot:"weapon",variant:"jian",rank:4});for(let i=0;i<15;i++)Equipment.collect(state,{item:{slot:"weapon",variant:"saber",rank:0}})');assert.equal(h.run('state.lootBag.length'),12);assert.equal(h.run('Profile.data.silver'),0);h.run('state.demo=false;const duplicate={item:{slot:"weapon",variant:"jian",rank:0}};Equipment.collect(state,duplicate);Equipment.collect(state,duplicate)');assert.equal(h.run('Profile.data.silver'),3);
});
test('rank-3 links unlock separately from legacy fusions, telegraph damage and cap target budgets',()=>{
 for(let i=0;i<6;i++){const h=harness();h.run(`start();state.skills.fill(0);const recipe=LinkSystem.recipes[${i}];state.skills[recipe.a]=3;state.skills[recipe.b]=3;syncSkills();state.enemies=Array.from({length:20},(_,j)=>({x:40+j,y:0,hp:10000,max:10000,f:1}));LinkSystem.cast(state,${i})`);assert.equal(h.run(`state.links.known[${i}]`),true);assert.equal(h.run('state.fusions.some(Boolean)'),false);h.run('LinkSystem.update(state,.2)');assert.equal(h.run('state.enemies.every(e=>e.hp===10000)'),true);h.run('for(let j=0;j<20;j++)LinkSystem.update(state,.1);LinkSystem.draw(state,false);LinkSystem.draw(state,true)');const cap=[3,9,4,6,6,5][i];assert.ok(h.run('state.enemies.filter(e=>e.hp<10000).length')<=cap);assert.ok(h.run('state.links.events.length')<=3)}
});
test('link defensive charge blocks once, lockout prevents simultaneous chain casts and book returns cleanly',()=>{
 const h=harness();h.run('start();state.skills.fill(3);syncSkills();state.links.cd.fill(0);state.enemies=[{x:40,y:0,hp:1e7,max:1e7,f:1}];LinkSystem.update(state,.01)');assert.equal(h.run('state.links.casts'),1);h.run('LinkSystem.update(state,.1)');assert.equal(h.run('state.links.casts'),1);h.run('state.links.ward=4');assert.equal(h.run('LinkSystem.block(state)'),true);assert.equal(h.run('LinkSystem.block(state)'),false);h.run('LinkSystem.open()');assert.equal(h.run('mode'),'pause');assert.equal(h.nodes.get('#camp').hidden,false);h.run("$('#campClose').onclick()");assert.equal(h.run('mode'),'play');h.run("openCamp();$('#campClose').onclick()");assert.equal(h.run('mode'),'play');
});

test('all twelve sect primary damage budgets stay within a bounded range and retain one initial target',()=>{
 const h=harness(),dps=[];for(let f=0;f<3;f++)for(let sub=0;sub<4;sub++){h.run(`selected=${f};subSect=${sub};start()`);const n=h.run('primaryStats(state).damage/primaryStats(state).period*(primaryStats(state).ranged?.9:1)*(selected===2?1.16:1)');dps.push(n);assert.equal(h.run('primaryStats(state).targets'),1)}assert.ok(Math.max(...dps)/Math.min(...dps)<1.35);
});
test('defensive art growth is bounded, heals only once and retains owned upgrade choices',()=>{
 const h=harness();h.run('start();state.skills.fill(0);state.skills[0]=2;state.skills[4]=0;state.level=2;upgrade(true)');assert.ok(h.run("$('#choices').children.some(b=>state.skills[+b.dataset.skill]>0)"));
 h.run('state.skills.fill(0);state.skills[4]=4;upgrade(true)');const hp=h.run('state.p.max');h.run("$('#choices').children.find(b=>b.dataset.skill==='4').onclick()");assert.equal(h.run('state.p.max')-hp,6);
});
test('silver preparations charge once, cap stock and are consumed once outside demos',()=>{
 const h=harness();h.run('Profile.data.silver=1000');for(let i=0;i<5;i++)h.run("Progression.buy('medicine')");assert.equal(h.run('Profile.data.supplies.medicine'),3);assert.equal(h.run('Profile.data.silver'),820);h.run('start();state.demo=true;Progression.begin(state)');assert.equal(h.run('Profile.data.supplies.medicine'),3);h.run('state.demo=false;Progression.begin(state);Progression.begin(state)');assert.equal(h.run('Profile.data.supplies.medicine'),2);h.run('state.p.hp=10;Progression.update(state)');assert.equal(h.run('state.p.hp'),35);h.run('Progression.update(state)');assert.equal(h.run('state.p.hp'),35);
});
test('local rankings keep stage mode preparation and training context and sort by kills',()=>{
 const h=harness();h.run("Profile.finish({faction:0,subSect:1,kills:30,time:100,battle:'blood',stage:1,training:2});Profile.finish({faction:2,subSect:3,kills:90,time:90,battle:'hell',stage:2,assisted:true,training:4})");assert.equal(h.run('Profile.data.ranking[0].kills'),90);assert.equal(h.run('Profile.data.ranking[0].battle'),'hell');assert.equal(h.run('Profile.data.ranking[0].assisted'),true);h.run('start();state.demo=true;end(false)');assert.equal(h.run('Profile.data.ranking.length'),2);h.run("Progression.open('ranking')");assert.ok(h.nodes.get('#campSub').textContent.includes('온라인 경쟁 순위가 아닙니다'));
});
test('medicine drops use low-health odds and a shared cooldown without guaranteed leader healing',()=>{
 const h=harness();h.run('start();state.time=20');assert.equal(h.run("dropSupplies(state,{x:0,y:0,siegeLeader:true},()=>.5);state.drops.length"),0);h.run('dropSupplies(state,{x:0,y:0},()=>.008)');assert.equal(h.run('state.drops[0].type'),'heal');h.run('dropSupplies(state,{x:0,y:0},()=>0)');assert.equal(h.run('state.drops.length'),1);h.run('state.time=24;state.p.hp=20;dropSupplies(state,{x:0,y:0},()=>.021)');assert.equal(h.run('state.drops.length'),2);
});
test('equipment set bonuses switch off on replacement rather than accumulate',()=>{
 const h=harness();h.run("start();Equipment.equip(state,{slot:'weapon',variant:'spear',rank:0});Equipment.equip(state,{slot:'armor',variant:'leather',rank:0})");assert.equal(h.run('Equipment.bonus(state,"reach")'),14);h.run("Equipment.equip(state,{slot:'armor',variant:'robe',rank:0})");assert.equal(h.run('Equipment.bonus(state,"reach")'),8);
});
test('tempo: opening enemies arrive nearby, movement remains real-time and fast attacks retain a windup',()=>{
 const h=harness();h.run('selected=0;subSect=2;start();state.props=[]');assert.ok(h.run('state.enemies.every(e=>Math.hypot(e.x,e.y)>=159&&Math.hypot(e.x,e.y)<=241)'));assert.ok(h.run('primaryStats(state).windup')<.1);h.run('state.enemies=[];state.spawn=state.siegeNext=999;keys.d=true;update(.1)');assert.equal(h.run('state.p.x'),18);h.run('keys={};const foe={x:100,y:0,hp:10000,max:10000,f:1,role:"disciple",speed:50,fire:999};state.enemies=[foe];state.skills.fill(0);state.sect.cooldown=999;state.impactBeat=.05;update(.01)');assert.ok(h.run('foe.x')<99.6);
});
test('experience pull uses exponential time steps with equal outcomes at equal real time',()=>{
 function sample(dt){const h=harness();h.run('start();state.skills.fill(0);state.sect.cooldown=999;state.enemies=[];state.spawn=state.siegeNext=999;state.props=[];state.gems=[{x:100,y:0,value:1}];state.need=999');for(let i=0;i<Math.round(.1/dt);i++)h.run(`update(${dt})`);return h.run('state.gems[0].x')};assert.ok(Math.abs(sample(.05)-sample(.01))<.001);
});
