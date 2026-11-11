'use strict';
/*!
 * Wuxia Pixel Character & Enemy Archetype Renderer v0.9 (MIT / CC0-1.0)
 * Renders 12 distinct Playable Heroes (3 Factions x 4 Sub-Sects/Characters)
 * matching the design references:
 * - 정파(0): 소림사(0), 무당파(1), 화산파(2), 개방(3)
 * - 사파(1): 혈도객(0), 독공술사(1), 귀영살수(2), 녹림도왕(3)
 * - 마교(2): 천마신교(0), 혈마전(1), 귀마전(2), 흑염전(3)
 * Plus 8 distinct Wuxia enemy archetypes.
 */
const WuxiaSprites = (() => {
  function px(ctx, x, y, w, h, col) {
    ctx.fillStyle = col;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  function drawHero(ctx, x, y, faction, ambient, swing = 0, sub = 0) {
    const step = Math.sin(ambient * 14 + x * 0.03) * 2;
    const bob = Math.abs(Math.cos(ambient * 14)) * 1.1;
    const wave = Math.sin(ambient * 10) * 2.4;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(1.75, 1.75);

    // Ground shadow
    ctx.fillStyle = '#071c1766';
    ctx.beginPath();
    ctx.ellipse(0, 12, sub === 3 && faction === 1 ? 13 : 10.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (faction === 0) {
      // ==================== 정파 (正派) 4대 문파 ====================
      if (sub === 0) {
        // 0-0: 소림사 (少林寺) - 삭발 고승, 백·적색 금란가사, 대염주, 황금 석장(항마곤)
        ctx.strokeStyle = '#ffd16655';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -4 - bob, 15, 0, Math.PI * 2);
        ctx.stroke();
        // Monk boots & white leggings
        px(ctx, -5, 8, 4, 4 + step, '#d9d2c5');
        px(ctx, 2, 8, 4, 4 - step, '#d9d2c5');
        px(ctx, -6, 11 + step, 5, 2, '#3d352e');
        px(ctx, 2, 11 - step, 5, 2, '#3d352e');
        // White inner robe & crimson-gold Kasaya (금란가사)
        px(ctx, -8, -4 - bob, 16, 12, '#f4efe6');
        px(ctx, -6, -4 - bob, 12, 12, '#c92a2a');
        px(ctx, -7, -4 - bob, 5, 11, '#f4efe6');
        px(ctx, -6, 3 - bob, 12, 2, '#ffd166');
        // Large golden prayer beads (염주)
        for (let i = -4; i <= 4; i += 2) px(ctx, i, -3 - bob + Math.abs(i) * 0.4, 2, 2, '#ffb703');
        // Shaved head with 6戒疤 (계율 자국)
        px(ctx, -5, -14 - bob, 11, 10, '#f3c697');
        px(ctx, -4, -15 - bob, 9, 2, '#ebba88');
        px(ctx, -2, -14 - bob, 1, 1, '#c97a50');
        px(ctx, 0, -14 - bob, 1, 1, '#c97a50');
        px(ctx, 2, -14 - bob, 1, 1, '#c97a50');
        px(ctx, -2, -9 - bob, 2, 2, '#222');
        px(ctx, 3, -9 - bob, 2, 2, '#222');
        // Golden Ringed Monk Staff (황금 석장 / 항마곤)
        ctx.save();
        ctx.translate(10, 2 - bob);
        ctx.rotate(swing > 0 ? -1.4 + swing * 7.5 : -0.25);
        px(ctx, -1, -22, 3, 28, '#d49b35');
        px(ctx, -4, -26, 9, 6, '#ffe169');
        px(ctx, -2, -24, 5, 2, '#c92a2a');
        ctx.restore();
      } else if (sub === 1) {
        // 0-1: 무당파 (武當派) - 청백 도포, 상투관, 등 뒤 검집, 태극검과 음양 기류
        px(ctx, -12, -12 + wave * 0.4, 5, 2, '#8ecae6');
        px(ctx, -5, 8, 4, 4 + step, '#1d3557');
        px(ctx, 2, 8, 4, 4 - step, '#1d3557');
        px(ctx, -6, 11 + step, 5, 2, '#f1faee');
        px(ctx, 2, 11 - step, 5, 2, '#f1faee');
        // Blue-and-white Daoist robe (무당 도포)
        px(ctx, -8, -4 - bob, 16, 12, '#1d4e89');
        px(ctx, -5, -4 - bob, 10, 12, '#f1faee');
        px(ctx, -3, -4 - bob, 6, 7, '#2b6cb0');
        px(ctx, -7, 3 - bob, 14, 2, '#90e0ef');
        // Wide white-blue sleeves
        px(ctx, -10, -3 - bob, 4, 7, '#e0fbfc');
        px(ctx, 6, -3 - bob, 4, 7, '#e0fbfc');
        // Topknot & silver-jade Daoist crown
        px(ctx, -6, -14 - bob, 12, 10, '#f5cea0');
        px(ctx, -7, -16 - bob, 14, 4, '#14213d');
        px(ctx, -3, -20 - bob, 6, 4, '#14213d');
        px(ctx, -2, -21 - bob, 4, 2, '#a8dadc');
        px(ctx, -2, -9 - bob, 2, 2, '#14213d');
        px(ctx, 3, -9 - bob, 2, 2, '#14213d');
        // Taiji Sword (태극검)
        ctx.save();
        ctx.translate(9, 2 - bob);
        ctx.rotate(swing > 0 ? -1.6 + swing * 7.5 : -0.55);
        px(ctx, -4, -1, 8, 2, '#a8dadc');
        px(ctx, -2, -22, 4, 21, '#e0fbfc');
        px(ctx, -1, -24, 2, 23, '#48cae4');
        ctx.restore();
      } else if (sub === 2) {
        // 0-2: 화산파 (華山派) - 흑·자주색 매화 무복, 흩날리는 분홍 매화잎, 예리한 매화검
        px(ctx, -14, -12 + wave, 6, 3, '#ff758f');
        px(ctx, -5, 8, 4, 4 + step, '#1f1a24');
        px(ctx, 2, 8, 4, 4 - step, '#1f1a24');
        // Dark slate robe with plum-blossom crimson lapels (화산 도복)
        px(ctx, -7, -4 - bob, 14, 12, '#2b2d42');
        px(ctx, -5, -4 - bob, 10, 11, '#3c3f58');
        px(ctx, -4, -4 - bob, 3, 7, '#ff4d6d');
        px(ctx, 1, -4 - bob, 3, 7, '#ff4d6d');
        px(ctx, -6, 3 - bob, 12, 2, '#ff8fa3');
        // High ponytail hair & plum headband
        px(ctx, -6, -14 - bob, 12, 10, '#f7d5b1');
        px(ctx, -7, -16 - bob, 14, 4, '#1a1821');
        px(ctx, -4, -20 - bob, 7, 4, '#1a1821');
        px(ctx, -2, -19 - bob, 3, 2, '#ff4d6d');
        px(ctx, -2, -9 - bob, 2, 2, '#2b2d42');
        px(ctx, 3, -9 - bob, 2, 2, '#2b2d42');
        // Floating plum blossom petals around hero
        const pa = ambient * 6;
        px(ctx, Math.cos(pa) * 13, Math.sin(pa) * 8 - 6, 3, 3, '#ff8fa3');
        px(ctx, -Math.cos(pa * 0.8) * 12, -Math.sin(pa * 0.8) * 9 - 4, 2, 2, '#ffb3c1');
        // Plum Blossom Rapier (매화검)
        ctx.save();
        ctx.translate(9, 2 - bob);
        ctx.rotate(swing > 0 ? -1.7 + swing * 8 : -0.5);
        px(ctx, -4, -1, 8, 2, '#ff758f');
        px(ctx, -1, -23, 3, 22, '#fff0f3');
        px(ctx, 0, -25, 2, 24, '#ff4d6d');
        ctx.restore();
      } else {
        // 0-3: 개방 (丐幫) - 협객 복장, 녹옥 타구봉, 전신을 휘감는 황금 용 아우라(항룡십팔장)
        // Golden Dragon Aura coiling around the hero
        ctx.strokeStyle = '#ffb703aa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -3 - bob, 14, ambient * 5, ambient * 5 + 4.2);
        ctx.stroke();
        px(ctx, -5, 8, 4, 4 + step, '#3d2c1e');
        px(ctx, 2, 8, 4, 4 - step, '#3d2c1e');
        // Rugged martial vest & bandages
        px(ctx, -8, -4 - bob, 16, 12, '#6c584c');
        px(ctx, -5, -4 - bob, 10, 11, '#a98467');
        px(ctx, -3, -4 - bob, 6, 6, '#f3c697');
        px(ctx, -7, 3 - bob, 14, 2, '#ffb703');
        // Head & wild hair with headband
        px(ctx, -6, -14 - bob, 12, 10, '#f0c08d');
        px(ctx, -7, -16 - bob, 14, 4, '#2b2118');
        px(ctx, -7, -13 - bob, 14, 2, '#d97706');
        px(ctx, -2, -9 - bob, 2, 2, '#1f1812');
        px(ctx, 3, -9 - bob, 2, 2, '#1f1812');
        // Green Jade Dog-Beating Staff (녹옥 타구봉) & Golden Dragon Fist glow
        px(ctx, -11, -1 - bob, 4, 4, '#ffd166');
        ctx.save();
        ctx.translate(9, 2 - bob);
        ctx.rotate(swing > 0 ? -1.5 + swing * 7.5 : -0.35);
        px(ctx, -1, -21, 3, 27, '#2d936c');
        px(ctx, 0, -21, 2, 27, '#57cc99');
        px(ctx, -2, -23, 5, 3, '#ffd166');
        ctx.restore();
      }
    } else if (faction === 1) {
      // ==================== 사파 (邪派) 4대 고수 ====================
      if (sub === 0) {
        // 1-0: 혈도객 (血刀客) - 흑적색 무복, 긴 흑발 포니테일, 붉은 비단 띠, 적혈도
        // Long flowing crimson sash & black ponytail
        px(ctx, -15, -4 + wave, 7, 3, '#e63946');
        px(ctx, -13, -15 + wave * 0.6, 6, 4, '#1a161b');
        px(ctx, -5, 8, 3, 4 + step, '#1d161a');
        px(ctx, 2, 8, 3, 4 - step, '#1d161a');
        // Black-and-crimson agile blade-dancer attire
        px(ctx, -7, -4 - bob, 14, 11, '#1d161a');
        px(ctx, -5, -4 - bob, 10, 10, '#9e1b2b');
        px(ctx, -3, -4 - bob, 6, 6, '#241a1e');
        px(ctx, -6, 3 - bob, 12, 2, '#ff4d6d');
        // Head, hair & crimson hairpin
        px(ctx, -5, -14 - bob, 10, 10, '#fae0ce');
        px(ctx, -7, -16 - bob, 14, 4, '#1a161b');
        px(ctx, -7, -13 - bob, 3, 8, '#1a161b');
        px(ctx, 4, -13 - bob, 3, 8, '#1a161b');
        px(ctx, -3, -18 - bob, 5, 3, '#e63946');
        px(ctx, -2, -9 - bob, 2, 2, '#9e1b2b');
        px(ctx, 3, -9 - bob, 2, 2, '#9e1b2b');
        // Crimson Blood Blade (혈도)
        ctx.save();
        ctx.translate(9, 2 - bob);
        ctx.rotate(swing > 0 ? -1.6 + swing * 8 : -0.45);
        px(ctx, -3, -1, 7, 2, '#d4a373');
        px(ctx, -2, -20, 4, 19, '#ff2a55');
        px(ctx, 0, -21, 2, 19, '#ffb3c1');
        ctx.restore();
      } else if (sub === 1) {
        // 1-1: 독공술사 (毒功術士) - 청록색 장발, 흑백 도포, 초록 독화염이 타오르는 독검
        px(ctx, -14, -12 + wave, 6, 10, '#2a6f62');
        px(ctx, -5, 8, 4, 4 + step, '#182026');
        px(ctx, 2, 8, 4, 4 - step, '#182026');
        // Dark-and-silver robe with jade poison ornaments
        px(ctx, -8, -4 - bob, 16, 12, '#1f2833');
        px(ctx, -5, -4 - bob, 10, 12, '#d8e2dc');
        px(ctx, -3, -4 - bob, 6, 10, '#293241');
        px(ctx, -7, 2 - bob, 14, 2, '#52b788');
        // Wide dark sleeves
        px(ctx, -11, -3 - bob, 4, 8, '#1f2833');
        px(ctx, 7, -3 - bob, 4, 8, '#1f2833');
        // Pale face & emerald-green hair
        px(ctx, -5, -14 - bob, 10, 10, '#edf2f4');
        px(ctx, -7, -16 - bob, 14, 4, '#2d6a4f');
        px(ctx, -7, -13 - bob, 3, 9, '#40916c');
        px(ctx, 4, -13 - bob, 3, 9, '#40916c');
        px(ctx, -2, -9 - bob, 2, 2, '#52b788');
        px(ctx, 3, -9 - bob, 2, 2, '#52b788');
        // Venom-Flame Sword (오독검)
        ctx.save();
        ctx.translate(10, 2 - bob);
        ctx.rotate(swing > 0 ? -1.5 + swing * 7.5 : -0.4);
        px(ctx, -4, -1, 8, 2, '#52b788');
        px(ctx, -2, -22, 4, 21, '#40916c');
        px(ctx, -1, -24, 3, 22, '#80ff9f');
        ctx.restore();
      } else if (sub === 2) {
        // 1-2: 귀영살수 (鬼影殺手) - 백발 포니테일, 검은 복면, 보라색 귀신 환영 아우라, 역수 암영검
        // Looming purple phantom silhouette behind the assassin
        ctx.fillStyle = '#9d4edd44';
        ctx.beginPath();
        ctx.arc(0, -10 - bob + wave * 0.4, 14, 0, Math.PI * 2);
        ctx.fill();
        px(ctx, -6, -24 - bob, 3, 5, '#c77dff66');
        px(ctx, 3, -24 - bob, 3, 5, '#c77dff66');
        px(ctx, -5, 8, 4, 4 + step, '#151426');
        px(ctx, 2, 8, 4, 4 - step, '#151426');
        // Dark indigo assassin armor with cyan sash
        px(ctx, -7, -4 - bob, 14, 12, '#1f1d36');
        px(ctx, -5, -4 - bob, 10, 11, '#3f3351');
        px(ctx, -6, 3 - bob, 12, 2, '#4cc9f0');
        // Masked face & high white ponytail
        px(ctx, -5, -13 - bob, 10, 9, '#f1e3d3');
        px(ctx, -6, -9 - bob, 12, 5, '#151426');
        px(ctx, -7, -16 - bob, 14, 4, '#f8f9fa');
        px(ctx, -5, -21 - bob, 10, 5, '#ffffff');
        px(ctx, -2, -10 - bob, 2, 2, '#e0aaff');
        px(ctx, 3, -10 - bob, 2, 2, '#e0aaff');
        // Reverse-grip horizontal purple phantom katana
        ctx.save();
        ctx.translate(8, -2 - bob);
        ctx.rotate(swing > 0 ? -1.8 + swing * 8.5 : -0.9);
        px(ctx, -3, -1, 6, 2, '#7209b7');
        px(ctx, -2, -22, 3, 21, '#e0aaff');
        px(ctx, 0, -23, 2, 22, '#9d4edd');
        ctx.restore();
      } else {
        // 1-3: 녹림도왕 (綠林刀王) - 거구 근육질 산적왕, 검은 털가죽 망토, 거대한 톱니 참마도
        // Heavy muscular frame & black fur pelt
        px(ctx, -6, 8, 5, 4 + step, '#2b2118');
        px(ctx, 2, 8, 5, 4 - step, '#2b2118');
        px(ctx, -10, -5 - bob, 20, 13, '#8c5a3c');
        px(ctx, -7, -5 - bob, 14, 12, '#c68b59');
        // Black fur shoulder pelt (검은 털가죽 망토)
        px(ctx, -11, -7 - bob, 14, 6, '#222222');
        px(ctx, -9, -2 - bob, 10, 4, '#333333');
        px(ctx, -8, 3 - bob, 16, 3, '#3d2c1e');
        // Fierce bearded head & topknot
        px(ctx, -6, -15 - bob, 12, 10, '#d49a6a');
        px(ctx, -6, -9 - bob, 12, 4, '#2b2623');
        px(ctx, -2, -19 - bob, 4, 4, '#222222');
        px(ctx, -3, -11 - bob, 2, 2, '#ffb703');
        px(ctx, 2, -11 - bob, 2, 2, '#ffb703');
        // Giant Serrated Cleaver (거대 참마도)
        ctx.save();
        ctx.translate(11, 2 - bob);
        ctx.rotate(swing > 0 ? -1.7 + swing * 8 : -0.2);
        px(ctx, -1, 0, 3, 7, '#5c3c24');
        px(ctx, -3, -26, 7, 26, '#495057');
        px(ctx, 1, -26, 3, 26, '#adb5bd');
        for (let k = -24; k < -4; k += 5) px(ctx, -5, k, 2, 3, '#dee2e6');
        ctx.restore();
      }
    } else {
      // ==================== 마교 (魔敎) 4대 전(殿) ====================
      if (sub === 0) {
        // 2-0: 천마신교 (天魔神敎) - 흑금색 제왕 장포, 긴 흑발과 수염, 붉은 마기 왕좌 후광
        ctx.strokeStyle = '#e6394666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -5 - bob, 15, 0, Math.PI * 2);
        ctx.stroke();
        px(ctx, -12, -12 + wave * 0.5, 24, 14, '#1a1118');
        px(ctx, -5, 8, 4, 4 + step, '#140d12');
        px(ctx, 2, 8, 4, 4 - step, '#140d12');
        // Black-and-gold Heavenly Demon Emperor robe
        px(ctx, -9, -4 - bob, 18, 12, '#1a141b');
        px(ctx, -6, -4 - bob, 12, 12, '#2b1e28');
        px(ctx, -5, -4 - bob, 3, 10, '#d4af37');
        px(ctx, 2, -4 - bob, 3, 10, '#d4af37');
        px(ctx, -8, 3 - bob, 16, 2, '#ffd166');
        // Regal bearded face & golden crown
        px(ctx, -5, -14 - bob, 10, 10, '#f2d0b6');
        px(ctx, -7, -16 - bob, 14, 4, '#111111');
        px(ctx, -3, -8 - bob, 6, 3, '#111111');
        px(ctx, -3, -20 - bob, 6, 4, '#d4af37');
        px(ctx, -2, -10 - bob, 2, 2, '#ff2a55');
        px(ctx, 3, -10 - bob, 2, 2, '#ff2a55');
        // Heavenly Demon Greatsword (천마검)
        ctx.save();
        ctx.translate(10, 2 - bob);
        ctx.rotate(swing > 0 ? -1.6 + swing * 7.5 : -0.45);
        px(ctx, -5, -1, 10, 2, '#d4af37');
        px(ctx, -2, -24, 5, 23, '#2b0912');
        px(ctx, -1, -25, 3, 24, '#ff2a55');
        ctx.restore();
      } else if (sub === 1) {
        // 2-1: 혈마전 (血魔殿) - 진홍색 혈포, 흩날리는 흑발, 붉은 혈기 아우라
        px(ctx, -14, -10 + wave, 7, 13, '#800f2f');
        px(ctx, -5, 8, 4, 4 + step, '#2b0912');
        px(ctx, 2, 8, 4, 4 - step, '#2b0912');
        // Crimson Blood Demon robe
        px(ctx, -8, -4 - bob, 16, 12, '#800f2f');
        px(ctx, -5, -4 - bob, 10, 12, '#c9184a');
        px(ctx, -2, -3 - bob, 4, 9, '#ff4d6d');
        px(ctx, -7, 3 - bob, 14, 2, '#590d22');
        // Pale face, long black hair & glowing blood eyes
        px(ctx, -5, -14 - bob, 10, 10, '#fae0e4');
        px(ctx, -7, -16 - bob, 14, 4, '#160f12');
        px(ctx, -8, -13 - bob, 3, 10, '#160f12');
        px(ctx, 5, -13 - bob, 3, 10, '#160f12');
        px(ctx, -2, -9 - bob, 2, 2, '#ff0a54');
        px(ctx, 3, -9 - bob, 2, 2, '#ff0a54');
        // Floating Blood-Lotus Qi Orbs
        px(ctx, 9, -6 - bob, 5, 5, '#ff0a54');
        px(ctx, 10, -5 - bob, 3, 3, '#ffccd5');
      } else if (sub === 2) {
        // 2-2: 귀마전 (鬼魔殿) - 흑보라 귀기 망토, 해골/귀신 뿔 후광, 보라색 원혼 불꽃
        // Horned Wraith Mantle & floating ghost wisps
        ctx.fillStyle = '#7209b755';
        ctx.beginPath();
        ctx.arc(0, -8 - bob, 15, 0, Math.PI * 2);
        ctx.fill();
        px(ctx, -9, -22 - bob, 3, 6, '#e0aaff');
        px(ctx, 6, -22 - bob, 3, 6, '#e0aaff');
        // Tattered violet-black cloak
        px(ctx, -10, -5 - bob, 20, 14, '#10002b');
        px(ctx, -7, -4 - bob, 14, 12, '#3c096c');
        px(ctx, -4, -3 - bob, 8, 9, '#ff6d00');
        // Ghostly skull-masked head
        px(ctx, -5, -14 - bob, 10, 9, '#e0aaff');
        px(ctx, -2, -10 - bob, 2, 2, '#ff007f');
        px(ctx, 3, -10 - bob, 2, 2, '#ff007f');
        // Orbiting Ghost Flames (원혼 귀화)
        const ga = ambient * 7;
        px(ctx, Math.cos(ga) * 14 - 2, Math.sin(ga) * 7 - 5, 4, 5, '#c77dff');
        px(ctx, -Math.cos(ga) * 14 - 2, -Math.sin(ga) * 7 - 5, 4, 5, '#e0aaff');
      } else {
        // 2-3: 흑염전 (黑炎殿) - 흑자색 마갑과 뿔 투구, 타오르는 검보라색 흑염과 마염 대검
        // Rising black-purple flames around armor
        px(ctx, -11, -12 + wave * 0.5, 4, 9, '#7209b7');
        px(ctx, 7, -12 - wave * 0.5, 4, 9, '#9d4edd');
        px(ctx, -5, 8, 4, 4 + step, '#10002b');
        px(ctx, 2, 8, 4, 4 - step, '#10002b');
        // Dark-steel demon armor
        px(ctx, -9, -4 - bob, 18, 12, '#191326');
        px(ctx, -6, -4 - bob, 12, 11, '#312244');
        px(ctx, -11, -6 - bob, 5, 4, '#5a189a');
        px(ctx, 6, -6 - bob, 5, 4, '#5a189a');
        px(ctx, -7, 3 - bob, 14, 2, '#c77dff');
        // Horned Black-Flame Helmet & glowing violet eyes
        px(ctx, -6, -15 - bob, 12, 10, '#191326');
        px(ctx, -9, -20 - bob, 3, 6, '#9d4edd');
        px(ctx, 6, -20 - bob, 3, 6, '#9d4edd');
        px(ctx, -3, -22 - bob, 6, 6, '#240046');
        px(ctx, -3, -10 - bob, 2, 2, '#e0aaff');
        px(ctx, 2, -10 - bob, 2, 2, '#e0aaff');
        // Black-Flame Greatsword (마염대검)
        ctx.save();
        ctx.translate(10, 2 - bob);
        ctx.rotate(swing > 0 ? -1.6 + swing * 8 : -0.4);
        px(ctx, -4, -1, 8, 2, '#9d4edd');
        px(ctx, -2, -24, 5, 23, '#10002b');
        px(ctx, 0, -25, 3, 24, '#c77dff');
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawEnemy(ctx, e, ambient) {
    const f = e.f || 0;
    const hit = e.hit > 0;
    const role = e.boss ? 'boss' : e.siegeLeader ? 'leader' : (e.role || 'disciple');
    const scale = e.boss ? 2.25 : e.siegeLeader ? 1.95 : role === 'brute' || role === 'shield' ? 1.82 : 1.62;
    const step = Math.sin(ambient * 13 + e.x * 0.025) * 1.8;

    ctx.save();
    ctx.translate(Math.round(e.x), Math.round(e.y));
    if (hit) ctx.scale(1.14, 0.9);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#0e292248';
    ctx.beginPath();
    ctx.ellipse(0, 10, role === 'shield' || role === 'brute' ? 12 : 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    const mainCol = hit ? '#fff8dd' : ['#5fb8be', '#df9f4c', '#cf536f'][f] || '#df9f4c';
    const darkCol = ['#2c5968', '#784820', '#591c31'][f] || '#591c31';
    const skin = hit ? '#fffbe8' : '#ebb988';

    px(ctx, -5, 6, 4, 5 + step, '#223133');
    px(ctx, 2, 6, 4, 5 - step, '#223133');

    if (role === 'shield') {
      px(ctx, -8, -5, 16, 12, '#3d4c52');
      px(ctx, -6, -4, 12, 10, mainCol);
      px(ctx, -7, -14, 14, 9, skin);
      px(ctx, -8, -16, 16, 5, '#52646b');
      px(ctx, -2, -19, 4, 3, '#d9534f');
      px(ctx, -11, -7, 9, 15, '#2b393d');
      px(ctx, -10, -6, 7, 13, '#c7a456');
      px(ctx, -8, -4, 3, 9, '#52646b');
      px(ctx, 8, -9, 3, 12, '#8c9ba0');
    } else if (role === 'spearman') {
      px(ctx, -7, -4, 14, 11, darkCol);
      px(ctx, -5, -4, 10, 10, mainCol);
      px(ctx, -6, 3, 12, 2, '#e0c079');
      px(ctx, -6, -13, 12, 9, skin);
      px(ctx, -7, -15, 14, 4, '#24343b');
      px(ctx, -6, -13, 12, 2, '#d94b4b');
      ctx.save();
      ctx.rotate(0.22);
      px(ctx, -14, 1, 30, 2, '#6e4e2e');
      px(ctx, 13, -1, 4, 5, '#e63946');
      px(ctx, 16, 0, 7, 3, '#e8f1f2');
      ctx.restore();
    } else if (role === 'archer') {
      px(ctx, -6, -4, 12, 10, darkCol);
      px(ctx, -4, -4, 8, 10, mainCol);
      px(ctx, -5, -13, 10, 9, skin);
      px(ctx, -11, -13, 22, 2, '#b88c4a');
      px(ctx, -7, -15, 14, 2, '#d4aa63');
      px(ctx, 6, -5, 4, 10, '#d9b26f');
      px(ctx, 8, -2, 6, 2, '#fff3c4');
    } else if (role === 'assassin') {
      px(ctx, -6, -3, 12, 10, '#1c2429');
      px(ctx, -4, -3, 8, 9, '#2f3d44');
      px(ctx, -5, 2, 10, 2, mainCol);
      px(ctx, -5, -12, 10, 9, '#1c2429');
      px(ctx, -4, -9, 8, 3, skin);
      px(ctx, -2, -8, 2, 2, '#ffea79');
      px(ctx, 2, -8, 2, 2, '#ffea79');
      px(ctx, -11, 0, 5, 2, '#d8f3dc');
      px(ctx, 7, -2, 6, 2, '#d8f3dc');
    } else if (role === 'brute') {
      px(ctx, -9, -6, 18, 13, darkCol);
      px(ctx, -7, -6, 14, 12, mainCol);
      px(ctx, -5, -5, 10, 6, skin);
      px(ctx, -6, -4, 2, 2, '#f4a261');
      px(ctx, -2, -2, 2, 2, '#f4a261');
      px(ctx, 2, -2, 2, 2, '#f4a261');
      px(ctx, 5, -4, 2, 2, '#f4a261');
      px(ctx, -6, -15, 12, 9, skin);
      px(ctx, -3, -11, 2, 2, '#ff3b3b');
      px(ctx, 2, -11, 2, 2, '#ff3b3b');
      px(ctx, 9, -18, 4, 24, '#4a4e69');
      px(ctx, 8, -16, 6, 10, '#c9ada7');
    } else if (role === 'sorcerer') {
      const floatY = Math.sin(ambient * 9 + e.x) * 2;
      px(ctx, -7, -4 + floatY, 14, 12, '#2d1e3e');
      px(ctx, -5, -4 + floatY, 10, 12, mainCol);
      px(ctx, -2, -4 + floatY, 4, 11, '#f3d58d');
      px(ctx, -5, -13 + floatY, 10, 9, skin);
      px(ctx, -6, -15 + floatY, 12, 3, '#1f162b');
      px(ctx, -3, -19 + floatY, 6, 4, '#e9c37d');
      const ta = ambient * 5 + e.x * 0.1;
      px(ctx, Math.cos(ta) * 12 - 2, Math.sin(ta) * 6 - 6, 4, 6, '#ffe66d');
      px(ctx, -Math.cos(ta) * 12 - 2, -Math.sin(ta) * 6 - 6, 4, 6, '#ff6b6b');
    } else if (role === 'boss' || role === 'leader') {
      px(ctx, -8, -26, 2, 22, '#d4a373');
      px(ctx, -16, -25, 8, 11, mainCol);
      px(ctx, -14, -23, 4, 7, '#fff3b0');
      px(ctx, -9, -5, 18, 13, darkCol);
      px(ctx, -7, -5, 14, 12, mainCol);
      px(ctx, -11, -6, 4, 5, '#e9c37d');
      px(ctx, 7, -6, 4, 5, '#e9c37d');
      px(ctx, -7, 3, 14, 2, '#ffe169');
      px(ctx, -6, -14, 12, 9, skin);
      px(ctx, -8, -16, 16, 4, '#1d282e');
      px(ctx, -4, -20, 8, 4, '#e9c37d');
      px(ctx, -2, -10, 2, 2, '#ff2a55');
      px(ctx, 3, -10, 2, 2, '#ff2a55');
      px(ctx, 10, -22, 4, 28, '#f8f9fa');
      px(ctx, 8, -24, 7, 9, '#ffd166');
    } else {
      px(ctx, -7, -3, 14, 10, darkCol);
      px(ctx, -5, -3, 10, 11, mainCol);
      px(ctx, -5, 5, 11, 2, '#e4cc89');
      px(ctx, -6, -13, 12, 10, skin);
      px(ctx, -7, -15, 14, 4, '#233640');
      px(ctx, -3, -18, 6, 3, '#233640');
      px(ctx, -4, -14, 9, 2, mainCol);
      px(ctx, 0, -8, 2, 2, '#293e42');
      px(ctx, 4, -8, 2, 2, '#293e42');
      px(ctx, 9, -15, 3, 18, '#e8f1f2');
      px(ctx, 7, 1, 7, 2, '#d2ae5e');
    }

    // Status effect overlays: bleed (출혈), poison (중독), blackFlame (흑염), fear (공포), chill (빙결)
    if (e.bleed > 0) {
      ctx.fillStyle = '#ff2a55cc';
      px(ctx, -3, -18, 2, 3, '#ff2a55');
      px(ctx, 2, -20, 2, 3, '#ff2a55');
    }
    if (e.poisoned > 0) {
      ctx.fillStyle = '#8ee37dbb';
      ctx.beginPath();
      ctx.arc(-5, -18, 2.2, 0, 7);
      ctx.arc(5, -21, 1.8, 0, 7);
      ctx.fill();
    }
    if (e.blackFlame > 0) {
      px(ctx, -4, -20, 3, 4, '#9d4edd');
      px(ctx, 1, -22, 3, 5, '#3c096c');
    }
    if (e.feared > 0) {
      ctx.fillStyle = '#e0aaff';
      px(ctx, -1, -24, 2, 4, '#e0aaff');
    }
    if (e.chilled > 0) {
      px(ctx, -6, 7, 12, 3, '#8ce8ffaa');
    }
    ctx.restore();
  }

  return { drawHero, drawEnemy };
})();
if (typeof window !== 'undefined') window.WuxiaSprites = WuxiaSprites;
