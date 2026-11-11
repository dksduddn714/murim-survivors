/*
 * Wuxia Secret Manual & 36-Skill / 12-Sect Pack for Murim Survivors (v1.0)
 * License: MIT / CC0 1.0 Compatible
 * Attribution:
 *  - 36 Unique Martial Arts SVG Icons inspired by Game-Icons.net (Lorc, Delapouite, Skoll - CC BY 3.0 / MIT) & RPG-Awesome
 *  - Dark Wuxia Ink-and-Gold UI palette inspired by Inkblade Dark Wuxia Theme (MIT)
 */
'use strict';

const WuxiaUI = (() => {
  const svgWrap = (body, accent = '#e9c37d', cls = 'wx-svg') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

  // 12 Playable Sub-Sects (4 per Faction) with 3 exclusive signature skill slots each (4 * 3 = 12 per faction, 36 total)
  const SUB_SECTS = [
    // 0: 정파 (Orthodox — 소림사, 무당파, 화산파, 개방)
    [
      {
        id: 'shaolin', name: '소림사', hanja: '少林寺', title: '천하무공출소림',
        weapon: '대력금강장 · 나한권 · 항마곤법',
        trait: '원거리 금강불장·나한권풍 연사 · 피해감소 15% · 광역 기절',
        color: '#fbbf24', startSkill: 8, sigSlots: [3, 4, 8, 9],
        skillsSummary: ['대력금강장', '금강불괴신공', '나한권', '항마곤법']
      },
      {
        id: 'wudang', name: '무당파', hanja: '武當派', title: '태극유연검',
        weapon: '태극검법 · 양의검법 · 태극권',
        trait: '원거리 태극검기 파동 · 음양 쌍검 사출 · 내력 흡인 반격',
        color: '#38bdf8', startSkill: 0, sigSlots: [0, 2, 5, 11],
        skillsSummary: ['태극검법', '양의검법', '무당제운종', '태극권']
      },
      {
        id: 'mount_hua', name: '화산파', hanja: '華山派', title: '천하제일매화검',
        weapon: '매화검법 · 자하신공 · 매화만개',
        trait: '원거리 매화쾌검 다연발 · 자하 검기폭풍 · 치명타 폭발',
        color: '#fb7185', startSkill: 1, sigSlots: [1, 6],
        skillsSummary: ['매화검법', '자하신공', '이십사수매화검법']
      },
      {
        id: 'beggars', name: '개방', hanja: '丐幫', title: '천하제일방',
        weapon: '항룡십팔장 · 타구봉법',
        trait: '원거리 황금 신룡 장풍 폭격 · 취옥봉 선풍 파동 · 강력 넉백',
        color: '#34d399', startSkill: 7, sigSlots: [7, 10],
        skillsSummary: ['항룡십팔장', '타구봉법', '금강항룡신장']
      }
    ],
    // 1: 사파 (Unorthodox — 혈도객, 독공술사, 귀영살수, 녹림도왕)
    [
      {
        id: 'blood_blade', name: '혈도객', hanja: '血刀客', title: '혈하참마',
        weapon: '혈도참 · 혈기폭발 · 혈신강기',
        trait: '원거리 혈도 비참파 발사 · 출혈 중첩 · 처치 시 연쇄 혈기 폭발',
        color: '#f43f5e', startSkill: 0, sigSlots: [0, 3, 4],
        skillsSummary: ['혈도참', '혈기폭발', '혈신강기']
      },
      {
        id: 'poison_master', name: '독공술사', hanja: '毒功術士', title: '만독진인',
        weapon: '오독검기 · 만독연무 · 부골독폭',
        trait: '원거리 오독비검·맹독구름 투척 · 중독 적 처치 시 연쇄 독폭발',
        color: '#10b981', startSkill: 8, sigSlots: [6, 7, 8, 9],
        skillsSummary: ['만독연무', '부골독폭', '오독검기', '만독고충술']
      },
      {
        id: 'shadow_assassin', name: '귀영살수', hanja: '鬼影殺手', title: '무영추혼',
        weapon: '암영비도 · 귀영분신 · 귀영순보',
        trait: '원거리 추혼수리검 다연발 · 원거리 그림자 분신 암살 · 경공 잔영',
        color: '#a855f7', startSkill: 1, sigSlots: [1, 2, 5],
        skillsSummary: ['암영비도', '귀영분신', '귀영순보']
      },
      {
        id: 'bandit_king', name: '녹림도왕', hanja: '綠林刀王', title: '흑풍패왕',
        weapon: '녹림참마도 · 광풍선풍참',
        trait: '원거리 참마대도 지면 열파 · 거대 칼바람 회오리 사출 · 광역 제압',
        color: '#f59e0b', startSkill: 10, sigSlots: [10, 11],
        skillsSummary: ['녹림참마도', '광풍선풍참', '녹림패왕파천도']
      }
    ],
    // 2: 마교 (Demonic Cult — 천마신교, 혈마전, 귀마전, 흑염전)
    [
      {
        id: 'heavenly_demon', name: '천마신교', hanja: '天魔神敎', title: '천마군림',
        weapon: '천마검법 · 천마신공 · 천마군림보',
        trait: '원거리 흑금 천마검기 관통파 · 원거리 천마운석 폭격 · 마기 지배',
        color: '#f59e0b', startSkill: 0, sigSlots: [0, 3, 5],
        skillsSummary: ['천마검법', '천마신공', '천마군림보']
      },
      {
        id: 'blood_demon', name: '혈마전', hanja: '血魔殿', title: '혈해마존',
        weapon: '혈폭술 · 혈영장 · 혈마신공',
        trait: '원거리 혈창 다연발 · 원거리 연쇄 피의 폭발 · 생명력 대량 흡수',
        color: '#e11d48', startSkill: 7, sigSlots: [4, 7, 11],
        skillsSummary: ['혈마신공', '혈폭술', '혈영장']
      },
      {
        id: 'ghost_demon', name: '귀마전', hanja: '鬼魔殿', title: '만귀야행',
        weapon: '귀혼공 · 만귀소환술 · 귀영보',
        trait: '원거리 자동추적 원혼탄 · 백귀야행 유령 광선 · 광역 공포 도주',
        color: '#c084fc', startSkill: 1, sigSlots: [1, 2, 9],
        skillsSummary: ['귀혼공', '만귀소환술', '귀영보']
      },
      {
        id: 'black_flame', name: '흑염전', hanja: '黑炎殿', title: '흑염마제',
        weapon: '흑염폭룡 · 흑염마공 · 마염검법',
        trait: '원거리 흑염폭룡 사출 · 원거리 마염 화구 투척 · 처치 시 흑염 폭발',
        color: '#9333ea', startSkill: 8, sigSlots: [6, 8, 10],
        skillsSummary: ['흑염마공', '흑염폭룡', '마염검법']
      }
    ]
  ];

  // 36 Completely Distinct Skills (12 per Faction, Zero Overlap)
  const FACTION_SKILLS = [
    // 0: 정파 12비급
    {
      names: ['태극검법', '매화검법', '양의검법', '대력금강장', '금강불괴신공', '무당제운종', '자하신공', '항룡십팔장', '나한권', '항마곤법', '타구봉법', '태극권'],
      glyphs: ['太', '梅', '兩', '掌', '佛', '梯', '紫', '龍', '拳', '棍', '棒', '圓'],
      sects: ['무당파', '화산파', '무당파', '소림사', '소림사', '무당파', '화산파', '개방', '소림사', '소림사', '개방', '무당파'],
      tags: ['원거리·태극검기', '원거리·매화연참', '궤도·음양쌍검', '원거리·금강불장', '원거리·만자법륜', '경공·어가비검', '원거리·자하검풍', '원거리·황금신룡', '원거리·권풍연사', '원거리·금강곤격', '원거리·취옥봉기', '원거리·태극인력'],
      desc: [
        '[무당파] 청백색 태극 검기 파동을 원거리 관통 발사 · 5성+양의검법5성 합벽: 【태극양의검진】',
        '[화산파] 매화 꽃잎을 흩날리는 원거리 다연발 쾌검 사출 · 5성+자하신공5성 합벽: 【이십사수매화검법】',
        '[무당파] 음양 쌍검이 회전하며 원거리 적에게 검기 탄환 사출 · 5성+태극검법5성 합벽: 【태극양의검진】',
        '[소림사] 전방 원거리 적 무리에 거대한 황금 불장(佛掌) 낙하 폭격 · 5성+항룡십팔장5성 합벽: 【금강항룡신장】',
        '[소림사] 체력 +25·회복 및 원거리 적을 관통하는 황금 만(卍)자 법륜 사출 · 5성+타구봉법5성 합벽: 【천하무구불괴진】',
        '[무당파] 이속 +15 증가 및 이동 시 후방 적에게 원거리 태극 비검 사출 · 5성+태극권5성 합벽: 【무당진무태극공】',
        '[화산파] 원거리 적 진영에 자색 매화 검기 폭풍을 일으켜 둔화·연타 · 5성+매화검법5성 합벽: 【이십사수매화검법】',
        '[개방] 하늘을 가르는 황금 신룡 장풍이 원거리 적들을 연쇄 폭격 · 5성+대력금강장5성 합벽: 【금강항룡신장】',
        '[소림사] 황금빛 나한 권풍 탄환을 원거리 적에게 고속 연사 · 5성+항마곤법5성 합벽: 【소림항마나한진】',
        '[소림사] 거대한 황금 항마곤 환영이 원거리 적들을 내리쳐 광역 기절 · 5성+나한권5성 합벽: 【소림항마나한진】',
        '[개방] 취옥봉에서 초록빛 선풍 봉기를 원거리 사출해 집단 넉백 · 5성+금강불괴신공5성 합벽: 【천하무구불괴진】',
        '[무당파] 원거리 적들에게 태극 기공포를 발사해 끌어당기며 내력 회복 · 5성+무당제운종5성 합벽: 【무당진무태극공】'
      ]
    },
    // 1: 사파 12비급
    {
      names: ['혈도참', '암영비도', '귀영분신', '혈기폭발', '혈신강기', '귀영순보', '만독연무', '부골독폭', '오독검기', '만독고충술', '녹림참마도', '광풍선풍참'],
      glyphs: ['血', '暗', '影', '爆', '罡', '瞬', '毒', '腐', '五', '蠱', '斬', '狂'],
      sects: ['혈도객', '귀영살수', '귀영살수', '혈도객', '혈도객', '귀영살수', '독공술사', '독공술사', '독공술사', '독공술사', '녹림도왕', '녹림도왕'],
      tags: ['원거리·출혈검기', '원거리·추혼암기', '원거리·분신암살', '원거리·혈옥폭파', '원거리·혈기환영', '경공·잔영수리검', '원거리·맹독구름', '원거리·연쇄독뢰', '원거리·오독비검', '원거리·고충사출', '원거리·참마열파', '원거리·칼바람폭풍'],
      desc: [
        '[혈도객] 붉은 초승달 혈도 검기를 원거리 발사해 출혈 중첩 · 5성+귀영분신5성 합벽: 【혈영만단참】',
        '[귀영살수] 보랏빛 추혼 수리검과 암기를 원거리 다연발 투척 · 5성+만독연무5성 합벽: 【당문만천화우】',
        '[귀영살수] 그림자 분신이 원거리 적에게 순간이동해 십자 암살 · 5성+혈도참5성 합벽: 【혈영만단참】',
        '[혈도객] 원거리 적 밀집지에 혈옥을 폭파시켜 광역 출혈·폭발 · 5성+부골독폭5성 합벽: 【혈독멸절진】',
        '[혈도객] 체력 +25·회복 및 사방 원거리로 핏빛 혈기 칼날 방사 · 5성+녹림참마도5성 합벽: 【녹림패왕파천도】',
        '[귀영살수] 이속 +15 증가 및 이동 궤적에서 원거리 유도 암기 사출 · 5성+광풍선풍참5성 합벽: 【무영귀살섬】',
        '[독공술사] 원거리 적 무리에 맹독 연무탄을 투척해 중독·둔화 · 5성+암영비도5성 합벽: 【당문만천화우】',
        '[독공술사] 원거리의 중독된 적들을 연쇄 폭파시키는 취록색 부골독뢰 · 5성+혈기폭발5성 합벽: 【혈독멸절진】',
        '[독공술사] 녹색 독염이 타오르는 오독 비검 파동을 원거리 연사 · 5성+만독고충술5성 합벽: 【만독구천신공】',
        '[독공술사] 원거리 적들에게 맹독 고충 떼를 날려 마비·연쇄 중독 · 5성+오독검기5성 합벽: 【만독구천신공】',
        '[녹림도왕] 거대 참마도로 지면을 가르는 원거리 대도 열파 발사 · 5성+혈신강기5성 합벽: 【녹림패왕파천도】',
        '[녹림도왕] 원거리 적들을 휩쓰는 거대 칼바람 회오리 참격 사출 · 5성+귀영순보5성 합벽: 【무영귀살섬】'
      ]
    },
    // 2: 마교 12비급 (전면 원거리·중장거리 마공 체계)
    {
      names: ['천마검법', '귀혼공', '만귀소환술', '천마신공', '혈마신공', '천마군림보', '흑염마공', '혈폭술', '흑염폭룡', '귀영보', '마염검법', '혈영장'],
      glyphs: ['天', '魂', '鬼', '魔', '血', '君', '炎', '爆', '龍', '幻', '劍', '吸'],
      sects: ['천마신교', '귀마전', '귀마전', '천마신교', '혈마전', '천마신교', '흑염전', '혈마전', '흑염전', '귀마전', '흑염전', '혈마전'],
      tags: ['원거리·천마검기', '원거리·유도원혼', '원거리·백귀광선', '원거리·천마운석', '원거리·혈창사출', '원거리·패왕낙뢰', '원거리·흑염화구', '원거리·연쇄혈폭', '원거리·흑염마룡', '원거리·환술공포', '원거리·마염기둥', '원거리·흡혈마수'],
      desc: [
        '[천마신교] 공간을 가르는 흑금색 거대 천마 검기를 원거리 관통 발사 · 5성+만귀소환술5성 합벽: 【천마만귀멸세검】',
        '[귀마전] 원거리 적들을 자동 추적해 폭발하는 원혼 해골탄 다연발 사출 · 5성+흑염마공5성 합벽: 【흑염만귀야행】',
        '[귀마전] 소환된 원혼 군단이 회전하며 원거리 적에게 귀화 광선 사격 · 5성+천마검법5성 합벽: 【천마만귀멸세검】',
        '[천마신교] 원거리 적 진영 머리 위로 거대한 천마 흑성 운석을 낙하 폭격 · 5성+혈폭술5성 합벽: 【천마혈해군림】',
        '[혈마전] 체력 +25·회복 및 원거리 적들을 꿰뚫는 핏빛 혈창(血槍) 사출 · 5성+마염검법5성 합벽: 【혈마흑염신검】',
        '[천마신교] 이속 +15 증가 및 이동 시 원거리 적에게 흑금색 천마 벼락 강타 · 5성+혈영장5성 합벽: 【무상혈마군림】',
        '[흑염전] 원거리 적 무리에 검은 마염 화구를 투척해 지속 흑염 화상 부여 · 5성+귀혼공5성 합벽: 【흑염만귀야행】',
        '[혈마전] 원거리 적들의 혈기를 원격 폭파시켜 연쇄 피의 폭발과 흡혈 · 5성+천마신공5성 합벽: 【천마혈해군림】',
        '[흑염전] 전방 원거리 끝까지 날아가 모든 것을 삼키는 흑염 폭룡 사출 · 5성+귀영보5성 합벽: 【흑염귀룡파천】',
        '[귀마전] 원거리 적 진영에 귀마 환술진을 터뜨려 집단 공포 도주 유발 · 5성+흑염폭룡5성 합벽: 【흑염귀룡파천】',
        '[흑염전] 흑염대검을 휘둘러 원거리 적들을 가르는 흑자색 마염 검기 기둥 발사 · 5성+혈마신공5성 합벽: 【혈마흑염신검】',
        '[혈마전] 원거리 적들에게 핏빛 혈영 마수를 날려 생명력 흡수와 출혈 부여 · 5성+천마군림보5성 합벽: 【무상혈마군림】'
      ]
    }
  ];

  const FACTION_FUSIONS = [
    // 0: 정파 6대 합벽절학
    [
      { id: 0, a: 0, b: 2, name: '태극양의검진', aName: '태극검법', bName: '양의검법', glyph: '太', color: '#38bdf8' },
      { id: 1, a: 1, b: 6, name: '이십사수매화검법', aName: '매화검법', bName: '자하신공', glyph: '梅', color: '#fb7185' },
      { id: 2, a: 3, b: 7, name: '금강항룡신장', aName: '대력금강장', bName: '항룡십팔장', glyph: '龍', color: '#fbbf24' },
      { id: 3, a: 8, b: 9, name: '소림항마나한진', aName: '나한권', bName: '항마곤법', glyph: '佛', color: '#f59e0b' },
      { id: 4, a: 10, b: 4, name: '천하무구불괴진', aName: '타구봉법', bName: '금강불괴신공', glyph: '棒', color: '#34d399' },
      { id: 5, a: 11, b: 5, name: '무당진무태극공', aName: '태극권', bName: '무당제운종', glyph: '眞', color: '#60a5fa' }
    ],
    // 1: 사파 6대 합벽절학
    [
      { id: 0, a: 0, b: 2, name: '혈영만단참', aName: '혈도참', bName: '귀영분신', glyph: '血', color: '#f43f5e' },
      { id: 1, a: 1, b: 6, name: '당문만천화우', aName: '암영비도', bName: '만독연무', glyph: '雨', color: '#10b981' },
      { id: 2, a: 3, b: 7, name: '혈독멸절진', aName: '혈기폭발', bName: '부골독폭', glyph: '滅', color: '#ec4899' },
      { id: 3, a: 8, b: 9, name: '만독구천신공', aName: '오독검기', bName: '만독고충술', glyph: '毒', color: '#34d399' },
      { id: 4, a: 10, b: 4, name: '녹림패왕파천도', aName: '녹림참마도', bName: '혈신강기', glyph: '覇', color: '#f59e0b' },
      { id: 5, a: 11, b: 5, name: '무영귀살섬', aName: '광풍선풍참', bName: '귀영순보', glyph: '鬼', color: '#a855f7' }
    ],
    // 2: 마교 6대 합벽절학
    [
      { id: 0, a: 0, b: 2, name: '천마만귀멸세검', aName: '천마검법', bName: '만귀소환술', glyph: '天', color: '#f59e0b' },
      { id: 1, a: 1, b: 6, name: '흑염만귀야행', aName: '귀혼공', bName: '흑염마공', glyph: '魂', color: '#c084fc' },
      { id: 2, a: 3, b: 7, name: '천마혈해군림', aName: '천마신공', bName: '혈폭술', glyph: '血', color: '#e11d48' },
      { id: 3, a: 8, b: 9, name: '흑염귀룡파천', aName: '흑염폭룡', bName: '귀영보', glyph: '炎', color: '#9333ea' },
      { id: 4, a: 10, b: 4, name: '혈마흑염신검', aName: '마염검법', bName: '혈마신공', glyph: '魔', color: '#ec4899' },
      { id: 5, a: 11, b: 5, name: '무상혈마군림', aName: '혈영장', bName: '천마군림보', glyph: '皇', color: '#f43f5e' }
    ]
  ];

  // 36 Distinct Custom SVG Icons (3 Factions x 12 Skills)
  const factionSkillIcons = [
    // 0: 정파 12 Icons
    [
      // 0: 태극검법 (Taiji Sword Wave)
      (c) => `<circle cx="12" cy="12" r="9" stroke="${c}" stroke-width="1.6" stroke-dasharray="6 2"/><path d="M18 4l2 2-10 10-3-1 1-3 10-8z" fill="#e0f2fe"/><path d="M5 17l3-1-2 4-2-2 1-1z" fill="#fbbf24"/>`,
      // 1: 매화검법 (Plum Blossom Multi-Sword)
      (c) => `<circle cx="12" cy="7" r="2.5" fill="#fda4af"/><circle cx="16.5" cy="10.5" r="2.5" fill="#fb7185"/><circle cx="14.5" cy="16" r="2.5" fill="#fda4af"/><circle cx="9.5" cy="16" r="2.5" fill="#fb7185"/><circle cx="7.5" cy="10.5" r="2.5" fill="#fda4af"/><path d="M4 20L20 4" stroke="#fff1f2" stroke-width="2.2"/>`,
      // 2: 양의검법 (Twin Yin-Yang Blades)
      (c) => `<path d="M6 3l3 3-5 12-2-2 4-13zm12 0l2 2-4 13-3-3 5-12z" fill="${c}"/><circle cx="12" cy="12" r="3.5" stroke="#fde047" stroke-width="1.8" fill="#0f172a"/>`,
      // 3: 대력금강장 (Golden Buddha Palm)
      (c) => `<path d="M8 11V5a1 1 0 012 0v5m0 0V4a1 1 0 012 0v6m0 0V5a1 1 0 012 0v6m0 0V7a1 1 0 012 0v7c0 4-3 6-6 6s-6-2-6-6v-3a1 1 0 012 0v2" stroke="#fde047" stroke-width="1.8" fill="${c}44"/><circle cx="12" cy="14" r="2.4" fill="#fef08a"/>`,
      // 4: 금강불괴신공 (Diamond Dharma Wheel)
      (c) => `<polygon points="12,2 20,7 20,17 12,22 4,17 4,7" stroke="#fbbf24" stroke-width="2" fill="#78350f66"/><path d="M9 9h6v6H9z" stroke="#fef08a" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="#fff"/>`,
      // 5: 무당제운종 (Cloud Stepping Sword)
      (c) => `<path d="M4 16c3-3 6-3 9 0s6 3 7-1" stroke="#38bdf8" stroke-width="2.2" fill="none"/><path d="M6 11l12-6-3 7-9-1z" fill="#e0f2fe"/><circle cx="7" cy="18" r="2" fill="#bae6fd"/>`,
      // 6: 자하신공 (Violet Mist Crest)
      (c) => `<circle cx="12" cy="12" r="8" stroke="#c084fc" stroke-width="2" stroke-dasharray="4 2"/><path d="M7 13c2-4 8-4 10 0-2 4-8 4-10 0z" fill="#e879f988"/><circle cx="12" cy="12" r="2.5" fill="#fae8ff"/>`,
      // 7: 항룡십팔장 (Golden Dragon Wave)
      (c) => `<path d="M4 17c2-6 6-9 11-8l-2-4 7 4-5 6-1-3c-4 0-6 2-8 6l-2-1z" fill="#fbbf24"/><circle cx="17" cy="8" r="1.5" fill="#fff"/>`,
      // 8: 나한권 (Arhat Rapid Fist Barrage)
      (c) => `<rect x="5" y="7" width="10" height="8" rx="3" fill="#f59e0b" stroke="#fef08a" stroke-width="1.6"/><path d="M15 9h6m-6 3h7m-7 3h5" stroke="#fef08a" stroke-width="2"/>`,
      // 9: 항마곤법 (Demon-Subduing Golden Staff)
      (c) => `<path d="M4 20L20 4" stroke="#fbbf24" stroke-width="3.2"/><circle cx="19" cy="5" r="3" stroke="#fef08a" stroke-width="1.6" fill="#d97706"/><circle cx="5" cy="19" r="2.5" fill="#fef08a"/>`,
      // 10: 타구봉법 (Emerald Jade Bamboo Staff)
      (c) => `<path d="M5 19L19 5" stroke="#10b981" stroke-width="3.5"/><path d="M8 14l2 2m3-7l2 2m3-7l2 2" stroke="#a7f3d0" stroke-width="2"/><circle cx="18" cy="6" r="4" stroke="#6ee7b7" stroke-width="1.4" fill="none"/>`,
      // 11: 태극권 (Taiji Vortex Palm)
      (c) => `<circle cx="12" cy="12" r="9" stroke="#38bdf8" stroke-width="2"/><path d="M12 3a4.5 4.5 0 010 9 4.5 4.5 0 000 9 9 9 0 000-18z" fill="#0284c7"/><circle cx="12" cy="7.5" r="1.5" fill="#fff"/><circle cx="12" cy="16.5" r="1.5" fill="#0284c7"/>`
    ],
    // 1: 사파 12 Icons
    [
      // 0: 혈도참 (Crimson Crescent Blood Blade)
      (c) => `<path d="M5 18c2-9 8-14 15-14-3 5-4 10-2 15-4-2-9-2-13-1z" fill="#f43f5e" stroke="#fecdd3" stroke-width="1.5"/><circle cx="16" cy="10" r="1.8" fill="#ffe4e6"/>`,
      // 1: 암영비도 (Shadow Throwing Shuriken)
      (c) => `<polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill="#a855f7" stroke="#f3e8ff" stroke-width="1.4"/><circle cx="12" cy="12" r="2.5" fill="#1e1b4b"/>`,
      // 2: 귀영분신 (Twin Phantom Clones)
      (c) => `<path d="M8 6a3 3 0 110 6 3 3 0 010-6zm8 0a3 3 0 110 6 3 3 0 010-6z" fill="#c084fc"/><path d="M3 19c1-4 4-5 5-5s4 1 5 5m-2 0c1-4 4-5 5-5s4 1 5 5" stroke="#e9d5ff" stroke-width="1.8"/>`,
      // 3: 혈기폭발 (Blood Nova Detonation)
      (c) => `<polygon points="12,2 14,8 21,6 16,12 21,18 14,16 12,22 10,16 3,18 8,12 3,6 10,8" fill="#e11d48" stroke="#fda4af" stroke-width="1.2"/><circle cx="12" cy="12" r="3" fill="#fff1f2"/>`,
      // 4: 혈신강기 (Blood God Blade Shield)
      (c) => `<path d="M12 2l8 4v6c0 5.5-3.5 9-8 10-4.5-1-8-4.5-8-10V6l8-4z" fill="#881337" stroke="#fb7185" stroke-width="1.8"/><path d="M12 6v12M8 10l8 4m0-4l-8 4" stroke="#ffe4e6" stroke-width="1.6"/>`,
      // 5: 귀영순보 (Phantom Blink Kunai)
      (c) => `<path d="M3 12h8m-6-4h6m-6 8h6" stroke="#c084fc" stroke-width="2"/><polygon points="21,12 12,6 14,12 12,18" fill="#e9d5ff"/>`,
      // 6: 만독연무 (Venom Cloud Bomb)
      (c) => `<circle cx="9" cy="13" r="5" fill="#10b98188"/><circle cx="15" cy="13" r="5" fill="#05966988"/><circle cx="12" cy="9" r="5" fill="#34d399aa"/><circle cx="10" cy="9" r="1.2" fill="#064e3b"/><circle cx="14" cy="9" r="1.2" fill="#064e3b"/>`,
      // 7: 부골독폭 (Bone-Rot Poison Lightning)
      (c) => `<path d="M13 2L5 13h6l-2 9 10-12h-6l2-8z" fill="#10b981" stroke="#a7f3d0" stroke-width="1.4"/><circle cx="6" cy="6" r="2" fill="#6ee7b7"/><circle cx="18" cy="18" r="2" fill="#6ee7b7"/>`,
      // 8: 오독검기 (Five-Venom Emerald Sword Wave)
      (c) => `<path d="M4 19L19 4l2 2-15 15-2-2z" fill="#34d399"/><path d="M9 6c3-3 8-2 11 1M6 9c-2 4 0 8 4 10" stroke="#10b981" stroke-width="2" fill="none"/>`,
      // 9: 만독고충술 (Venom Gu Swarm)
      (c) => `<ellipse cx="12" cy="13" rx="5" ry="6" fill="#059669" stroke="#a7f3d0" stroke-width="1.5"/><path d="M9 5l3 3 3-3M4 11l3 1m10-1l3-1M4 15l3-1m10 1l3 1" stroke="#6ee7b7" stroke-width="1.8"/>`,
      // 10: 녹림참마도 (Giant Bandit Cleaver)
      (c) => `<path d="M6 3h9l4 11-9 3L6 3z" fill="#f59e0b" stroke="#fef3c7" stroke-width="1.6"/><path d="M10 17l-2 5" stroke="#fcd34d" stroke-width="3"/><circle cx="13" cy="7" r="1.5" fill="#78350f"/>`,
      // 11: 광풍선풍참 (Raging Cyclone Slash)
      (c) => `<path d="M12 4c5 0 8 3 8 7 0 3-3 5-6 5-2 0-4-1-4-3 0-1.5 1.5-2.5 3-2.5" stroke="#fbbf24" stroke-width="2.2" fill="none"/><path d="M12 20c-5 0-8-3-8-7 0-3 3-5 6-5" stroke="#f59e0b" stroke-width="2.2" fill="none"/>`
    ],
    // 2: 마교 12 Icons (Ranged Demonic Arts)
    [
      // 0: 천마검법 (Heavenly Demon Great-Slash)
      (c) => `<path d="M12 2l3 13-3 7-3-7 3-13z" fill="#f59e0b" stroke="#fef08a" stroke-width="1.4"/><path d="M4 9c5 3 11 3 16 0" stroke="#e11d48" stroke-width="2.4" fill="none"/>`,
      // 1: 귀혼공 (Homing Wraith Skulls)
      (c) => `<path d="M12 4a7 7 0 00-7 7c0 3 1.5 5 3 6v3h8v-3c1.5-1 3-3 3-6a7 7 0 00-7-7z" fill="#9333ea" stroke="#f3e8ff" stroke-width="1.5"/><circle cx="9.5" cy="11" r="1.6" fill="#fff"/><circle cx="14.5" cy="11" r="1.6" fill="#fff"/>`,
      // 2: 만귀소환술 (Ten-Thousand Ghosts Orbit)
      (c) => `<circle cx="12" cy="12" r="8" stroke="#c084fc" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="12" cy="4" r="2.5" fill="#e879f9"/><circle cx="19" cy="16" r="2.5" fill="#c084fc"/><circle cx="5" cy="16" r="2.5" fill="#e879f9"/><circle cx="12" cy="12" r="3" fill="#fae8ff"/>`,
      // 3: 천마신공 (Heavenly Demon Falling Meteor)
      (c) => `<circle cx="10" cy="14" r="6" fill="#e11d48" stroke="#fde047" stroke-width="1.8"/><path d="M14 4l6 6m-9-7l8 4m-11-1l5 5" stroke="#fbbf24" stroke-width="2"/>`,
      // 4: 혈마신공 (Blood Spear Volley)
      (c) => `<path d="M4 18L18 4m-8 16L20 10M4 10L14 2" stroke="#f43f5e" stroke-width="2.4"/><polygon points="20,2 14,4 18,8" fill="#ffe4e6"/>`,
      // 5: 천마군림보 (Demonic Sovereign Sky-Thunder)
      (c) => `<polygon points="12,2 16,10 22,9 14,22 13,14 6,15" fill="#fbbf24" stroke="#e11d48" stroke-width="1.5"/>`,
      // 6: 흑염마공 (Black Flame Fireball Barrage)
      (c) => `<path d="M12 2c4 4 7 8 6 13-1 4-4 7-6 7s-5-3-6-7c-1-5 2-9 6-13z" fill="#7e22ce" stroke="#e9d5ff" stroke-width="1.5"/><circle cx="12" cy="15" r="3" fill="#f3e8ff"/>`,
      // 7: 혈폭술 (Remote Blood Detonation)
      (c) => `<circle cx="12" cy="12" r="6" fill="#be123c"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8l3 3m0-14l-3 3M8 16l-3 3" stroke="#fda4af" stroke-width="2"/>`,
      // 8: 흑염폭룡 (Black Flame Dragon Cannon)
      (c) => `<path d="M3 17c3-7 7-11 13-11l-2-3 7 4-5 6-1-3c-4 0-7 3-9 8l-3-1z" fill="#9333ea" stroke="#f3e8ff" stroke-width="1.3"/><circle cx="17" cy="8" r="1.5" fill="#fde047"/>`,
      // 9: 귀영보 (Phantom Fear Eye Sigil)
      (c) => `<path d="M2 12c3-6 7-8 10-8s7 2 10 8c-3 6-7 8-10 8s-7-2-10-8z" stroke="#c084fc" stroke-width="2" fill="#3b0764"/><circle cx="12" cy="12" r="3.5" fill="#e879f9"/><circle cx="12" cy="12" r="1.5" fill="#fff"/>`,
      // 10: 마염검법 (Demonic Flame Pillar Slash)
      (c) => `<rect x="10" y="2" width="4" height="16" rx="1" fill="#a855f7" stroke="#f3e8ff" stroke-width="1.4"/><path d="M6 16h12l-2 4H8l-2-4z" fill="#fbbf24"/>`,
      // 11: 혈영장 (Vampiric Blood Claw Wave)
      (c) => `<path d="M5 4c4 5 4 11 1 16m6-16c4 5 4 11 1 16m6-16c4 5 4 11 1 16" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>`
    ]
  ];

  const trainingBodies = {
    vitality: (col) => `<path d="M12 4l6 4v6c0 4-3 6-6 7-3-1-6-3-6-7V8l6-4z" stroke="${col}" stroke-width="2" fill="#1e293b"/><path d="M11 8h2v8h-2V8zm-3 3h8v2H8v-2z" fill="#ffe49e"/>`,
    power: (col) => `<path d="M18 3h3v3l-9 9-3-3 9-9z" fill="${col}"/><path d="M6 12l6 6-2 2-6-6 2-2zm-2 6l2 2-2 2-2-2 2-2z" fill="#e9c37d"/>`,
    fortune: (col) => `<circle cx="12" cy="12" r="8" stroke="${col}" stroke-width="2" fill="#1e293b"/><rect x="9" y="9" width="6" height="6" stroke="#ffe49e" stroke-width="1.6"/>`
  };

  const skillColors = [
    '#38bdf8', '#fb7185', '#60a5fa', '#fbbf24',
    '#f59e0b', '#2dd4bf', '#c084fc', '#facc15',
    '#fb923c', '#a78bfa', '#34d399', '#f43f5e'
  ];
  const rankNumerals = ['零', '壹', '貳', '參', '肆', '伍'];
  const slotBadges = ['壹 · 1', '貳 · 2', '參 · 3'];

  function getFactionFusions(f = 0) {
    return FACTION_FUSIONS[f] || FACTION_FUSIONS[0];
  }

  function getFactionSkillSet(f = 0) {
    return FACTION_SKILLS[f] || FACTION_SKILLS[0];
  }

  function skillIcon(index, evolved = false, fIdx = null) {
    const f = fIdx != null ? fIdx : (typeof selected !== 'undefined' ? selected : 0);
    const set = factionSkillIcons[f] || factionSkillIcons[0];
    const fn = set[index] || set[0];
    const col = evolved ? '#fde047' : (skillColors[index] || '#e9c37d');
    return svgWrap(fn(col, evolved), col, 'wx-svg wx-skill-svg');
  }

  function trainingIcon(id) {
    const fn = trainingBodies[id] || trainingBodies.vitality;
    return svgWrap(fn('#e9c37d'), '#e9c37d', 'wx-svg wx-train-svg');
  }

  function pips(level, max = 5) {
    const n = Math.max(0, Math.min(max, Number(level) || 0));
    return '◆'.repeat(n) + '◇'.repeat(Math.max(0, max - n));
  }

  function recipeStatus(s, index, fOverride = null) {
    if (!s || !Array.isArray(s.skills)) return null;
    const fIdx = fOverride != null ? fOverride : (typeof selected !== 'undefined' ? selected : 0);
    const fusions = getFactionFusions(fIdx);
    const f = fusions.find(x => x.a === index || x.b === index);
    if (!f) return { text: '문파 비전 무공 · 상시 발동', ready: false, done: false };
    const fused = !!(s.fusions && s.fusions[f.id]);
    const curA = s.skills[f.a] || 0;
    const curB = s.skills[f.b] || 0;
    const nextA = index === f.a ? curA + 1 : curA;
    const nextB = index === f.b ? curB + 1 : curB;
    const willFuse5 = !fused && nextA >= 5 && nextB >= 5;
    const willEvo42 = (f.id === 0 && !s.evolved && nextA >= 4 && nextB >= 2) ||
                      (f.id === 1 && !s.rain && nextA >= 4 && nextB >= 2) ||
                      (f.id === 2 && !s.thunder && nextA >= 4 && nextB >= 2);
    const ready = willFuse5 || willEvo42;
    const text = fused
      ? `합벽절학 【${f.name}】 완성!`
      : willFuse5
        ? `★ 선택 시 5성 합벽절학 【${f.name}】 융합 완성!`
        : willEvo42
          ? `★ 선택 시 절학 각성 · 5성+5성 시 【${f.name}】 합벽!`
          : `합벽식 【${f.name}】 · ${f.aName} ${curA}/5 + ${f.bName} ${curB}/5`;
    return { text, ready, done: fused, fusion: f };
  }

  function pressureState(s, cap = 420, modeName = '혈전') {
    if (!s) return { pct: 0, label: modeName, danger: false };
    const count = s.enemies ? s.enemies.length : 0;
    const rawPct = Math.min(100, Math.round((count / Math.max(1, cap)) * 100));
    const siege = (s.siegeWarning || 0) > 0;
    const pct = siege ? Math.max(rawPct, 88) : rawPct;
    let label = modeName + ' · 평온';
    if (siege) label = '사면초가 · 포위망!';
    else if (pct >= 80) label = modeName + ' · 사투';
    else if (pct >= 50) label = modeName + ' · 격전';
    else if (pct >= 25) label = modeName + ' · 접전';
    return { pct, label, danger: siege || pct >= 75 };
  }

  function pauseSummaryHTML(s, skillNames) {
    if (!s || !Array.isArray(s.skills)) return '';
    const fIdx = typeof selected !== 'undefined' ? selected : 0;
    const fSet = getFactionSkillSet(fIdx);
    const fusions = getFactionFusions(fIdx);
    const learned = s.skills
      .map((lv, i) => lv > 0 ? `<div class="wx-pause-skill">${skillIcon(i, lv >= 5, fIdx)}<span><small class="wx-sect-pill">${(fSet.sects&&fSet.sects[i])||''}</small> ${(skillNames&&skillNames[i])||'무공'} <b>${lv===5?'5★':lv+'성'}</b></span></div>` : '')
      .filter(Boolean)
      .join('');
    const ult = fusions.map(f => {
      const done = s.fusions && s.fusions[f.id];
      return done ? `★${f.name}(合璧)` : `${f.name}(${s.skills[f.a]||0}/5·${s.skills[f.b]||0}/5)`;
    }).join(' · ');
    return `<div class="wx-pause-box"><div class="wx-pause-grid">${learned || '<small>습득한 무공이 없습니다</small>'}</div><small class="wx-pause-ult">세력 전용 5★+5★ 합벽절학: ${ult}</small></div>`;
  }

  return {
    SUB_SECTS,
    FACTION_SKILLS,
    FACTION_FUSIONS,
    get FUSIONS() { return getFactionFusions(typeof selected !== 'undefined' ? selected : 0); },
    getFactionFusions,
    getFactionSkillSet,
    skillIcon,
    trainingIcon,
    pips,
    recipeStatus,
    pressureState,
    pauseSummaryHTML,
    rankNumerals,
    slotBadges
  };
})();
if (typeof window !== 'undefined') window.WuxiaUI = WuxiaUI;
