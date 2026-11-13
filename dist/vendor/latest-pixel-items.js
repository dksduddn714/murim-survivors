'use strict';
// Pixel goods and peddler supplied in the user's latest v1.8.9 file.
const itemSpriteCache=new Map();
function getItemCanvas(kind){
  let cv=itemSpriteCache.get(kind);if(cv)return cv;
  cv=document.createElement('canvas');
  const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
  const p=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  if(kind==='heal'){
    // 금창약 (Golden-Amber Gourd Medicine Bottle with Red Tassel & Cork)
    cv.width=24;cv.height=26;
    p(6,22,12,3,'#12182466');
    p(9,2,6,3,'#232332');p(10,3,4,2,'#d99b66');p(10,2,3,1,'#f3cba0');
    p(8,5,8,3,'#232332');p(9,6,6,2,'#fcd34d');
    p(8,7,9,2,'#991b1b');p(9,7,6,1,'#ef4444');
    p(16,8,3,2,'#dc2626');p(18,10,2,6,'#b91c1c');p(17,12,2,5,'#ef4444');
    p(6,9,12,12,'#232332');p(5,11,14,8,'#232332');
    p(7,10,10,10,'#d97706');p(6,12,12,6,'#f59e0b');
    p(7,11,4,6,'#fde047');p(8,11,2,3,'#fef9c3');
    p(8,13,8,5,'#fef3c7');p(9,14,6,3,'#fffbeb');
    p(10,15,1,2,'#78350f');p(12,14,1,3,'#78350f');p(14,15,1,2,'#78350f');
    p(8,20,8,1,'#fcd34d');
  }else if(kind==='magnet'){
    // 흡성부 (Mystic Wuxia Talisman Scroll with Vermilion Seal & Cyan Qi)
    cv.width=24;cv.height=26;
    p(6,22,12,3,'#12182466');
    p(6,3,12,2,'#232332');p(7,4,10,1,'#b45309');p(5,4,2,2,'#fbbf24');p(17,4,2,2,'#fbbf24');
    p(7,5,10,15,'#232332');p(8,5,8,14,'#fde047');p(9,6,6,12,'#fef08a');
    p(11,7,2,9,'#e11d48');p(9,9,6,2,'#e11d48');p(10,12,4,2,'#be123c');p(10,15,4,1,'#e11d48');
    p(6,19,12,2,'#232332');p(7,19,10,1,'#b45309');p(5,19,2,2,'#fbbf24');p(17,19,2,2,'#fbbf24');
    p(4,10,2,2,'#38bdf8');p(18,8,2,2,'#38bdf8');p(18,14,2,2,'#a855f7');
  }else if(kind==='gem1'||kind==='gem2'||kind==='gem3'){
    // 내공 영단 (Luminous Wuxia Inner-Qi Spirit Pill)
    cv.width=14;cv.height=14;
    const outer=kind==='gem3'?'#f59e0b':kind==='gem2'?'#0284c7':'#10b981';
    const mid=kind==='gem3'?'#fde047':kind==='gem2'?'#38bdf8':'#6ee7b7';
    const core='#ffffff';
    p(4,11,6,2,'#12182455');
    p(4,2,6,10,'#1e293b');p(2,4,10,6,'#1e293b');p(3,3,8,8,'#1e293b');
    p(4,3,6,8,outer);p(3,4,8,6,outer);
    p(4,4,6,6,mid);p(5,4,4,4,core);p(4,5,2,2,core);
  }else if(kind==='merchant_active'||kind==='merchant_done'){
    // 무협 보따리 장수 (Crisp Pixel-Art Wandering Peddler with Giant Backpack Bundle & Bamboo Hat)
    cv.width=64;cv.height=64;
    const active=kind==='merchant_active';
    const O='#232332';
    // Ground shadow
    p(14,54,36,5,'#12223155');p(18,53,28,6,'#12223155');
    // Giant Backpack Bundle (보따리) behind & left of peddler
    p(10,14,26,32,O);p(8,18,28,26,O);
    p(12,16,22,28,active?'#92400e':'#4b5563');
    p(10,20,24,22,active?'#b45309':'#6b7280');
    // Colorful scrolls, cloth rolls, medicine gourd sticking out of the bundle
    if(active){
      p(12,10,7,7,O);p(13,11,5,5,'#dc2626');p(14,12,3,3,'#fca5a5'); // Red scroll
      p(19,8,8,8,O);p(20,9,6,6,'#0284c7');p(21,10,4,3,'#7dd3fc');  // Blue silk roll
      p(27,10,7,7,O);p(28,11,5,5,'#eab308');p(29,12,3,3,'#fef08a'); // Gold scroll
      p(7,22,6,9,O);p(8,23,4,7,'#10b981');                          // Jade bottle
      // Rope straps & white shop tag (잡화/비급)
      p(11,27,23,2,'#fde68a');p(20,16,2,26,'#fde68a');
      p(13,30,6,9,O);p(14,31,4,7,'#fef3c7');p(15,33,2,3,'#78350f');
    }
    // Boots & legs
    p(26,46,6,9,O);p(36,46,6,9,O);
    p(27,46,4,6,'#475569');p(37,46,4,6,'#475569');
    p(25,52,8,3,O);p(35,52,8,3,O);
    // Peddler Robe (Blue-jade Wuxia merchant coat with waist gourd)
    p(23,28,22,20,O);
    p(25,29,18,17,active?'#1d4ed8':'#475569');
    p(26,30,16,15,active?'#2563eb':'#64748b');
    p(31,29,6,17,active?'#dbeafe':'#94a3b8');
    // Waist sash & hanging gourd (호리병)
    p(24,38,20,3,O);p(25,39,18,2,active?'#dc2626':'#9ca3af');
    p(23,40,6,7,O);p(24,41,4,5,'#f59e0b');p(25,41,2,2,'#fef08a');
    // Waving left/right arms
    p(43,24,7,11,O);p(44,25,5,8,active?'#2563eb':'#64748b');
    p(45,21,5,5,O);p(46,22,3,3,'#f7cc9e'); // Waving hand
    // Head & smiling face
    p(26,15,16,14,O);p(27,16,14,12,'#dca27d');p(28,17,12,10,'#f7cc9e');
    // Happy curved eyes & smile
    p(30,21,3,1,O);p(36,21,3,1,O);
    p(29,23,2,1,'#f43f5e88');p(38,23,2,1,'#f43f5e88');
    p(32,24,5,2,O);p(33,24,3,1,'#ffffff');
    // Conical Bamboo Hat (삿갓)
    p(17,14,34,4,O);p(21,11,26,4,O);p(26,8,16,4,O);p(31,6,6,3,O);
    p(19,15,30,2,'#d97706');p(23,12,22,3,'#f59e0b');p(28,9,12,3,'#fbbf24');p(32,7,4,2,'#fde68a');
    p(21,14,26,1,'#fef3c7');
  }
  itemSpriteCache.set(kind,cv);return cv;
}

function drawQiGem(g){
  const kind=g.value>=10?'gem3':g.value>=3?'gem2':'gem1';
  const cv=getItemCanvas(kind);
  ctx.drawImage(cv,Math.round(g.x-7),Math.round(g.y-7));
}
function merchantOfferIcon(o){
  if(o.kind==='skill'&&typeof WuxiaUI!=='undefined'){
    return WuxiaUI.skillIcon(o.slot,true,selected);
  }
  const svg=(body)=>`<svg class="wx-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  if(o.kind==='potion'){
    return svg(`<path d="M9 3h6v3H9z" fill="#d99b66" stroke="#232332" stroke-width="1.5"/><path d="M8 6h8v2H8z" fill="#dc2626"/><path d="M16 7c3 1 4 4 3 8" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M7 9c-2 2-2 8 1 11h8c3-3 3-9 1-11H7z" fill="#f59e0b" stroke="#fde68a" stroke-width="1.5"/><rect x="9" y="12" width="6" height="5" rx="1" fill="#fef3c7"/><path d="M12 13v3m-1.5-1.5h3" stroke="#b91c1c" stroke-width="1.5"/>`);
  }
  if(o.kind==='magnet'){
    return svg(`<rect x="5" y="3" width="14" height="3" rx="1" fill="#b45309" stroke="#fde68a" stroke-width="1.2"/><rect x="7" y="6" width="10" height="12" fill="#fde047" stroke="#ca8a04" stroke-width="1.2"/><path d="M12 8v8M9 10h6M10 14h4" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round"/><rect x="5" y="18" width="14" height="3" rx="1" fill="#b45309" stroke="#fde68a" stroke-width="1.2"/><circle cx="4" cy="12" r="1.5" fill="#38bdf8"/><circle cx="20" cy="10" r="1.5" fill="#38bdf8"/>`);
  }
  if(o.kind==='sword'){
    return svg(`<path d="M18 3l3 3-11 11-3-3L18 3z" fill="#38bdf8" stroke="#e0f2fe" stroke-width="1.4"/><path d="M5 13l6 6-2 2-6-6 2-2z" fill="#fbbf24"/><path d="M4 18l2 2-3 2 1-4z" fill="#f59e0b"/>`);
  }
  return svg(`<polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill="#c084fc" stroke="#f3e8ff" stroke-width="1.4"/><circle cx="12" cy="12" r="2.5" fill="#1e1b4b"/>`);
}
