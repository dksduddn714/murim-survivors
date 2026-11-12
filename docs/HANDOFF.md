# HANDOFF (v1.0.0 인수인계 문서)

## 1. 이번 작업(v1.0.0) 요약
- **36종 무공 & 36종 SVG 아이콘 완전 분리 (중복 제로)**:
  - `dist/vendor/wuxia-ui-pack.js`의 `factionSkillIcons[0..2][0..11]`를 통해 정파 12종·사파 12종·마교 12종 총 36종의 무공이 서로 전혀 겹치지 않는 고유 SVG 아이콘, 소속 문파 배지(`sects`), 공격 형태 배지(`tags`)를 가집니다.
  - 레벨업 모달(`upgrade()`)에서 현재 선택한 세부 문파의 고유 비급(`sigSlots`)에 등장 우선순위와 `★` 황금 배지를 부여해 문파 정체성을 강화했습니다.
- **마교 및 전 문파 원거리 전투 개편 & 밸런스 패치**:
  - `dist/combat.js`에 12문파 고유 원거리 기본 절초(`s.cooldowns.innate`)와 유도 투사체(`b.homing`), 원거리 적 밀집지 타겟팅 폭발(`tx = target.x, ty = target.y`)을 도입하여, 마교(천마신교·혈마전·귀마전·흑염전)를 포함한 모든 캐릭터가 초반부터 원거리에서 시원하게 적을 섬멸할 수 있습니다.
  - 체력(슬롯 4)과 경공(슬롯 5) 비급도 단순 패시브에 그치지 않고 만자법륜·혈창 사출·패왕낙뢰·어검비도 등 원거리 액티브 공격을 함께 발사합니다.
- **다크 수묵·금장(Inkblade Dark Wuxia) UI 리마스터**:
  - `dist/style.css`와 `dist/index.html`을 전면 개편하여 다크 오닉스·금장 테마, 세력별 실시간 네온 광원(`body[data-theme]`), 12문파 실시간 도트 초상화 캔버스(`.sub-avatar`), 고시인성 상단/하단 HUD를 적용했습니다.

## 2. 검증 결과
- `npm test`: 총 18개 테스트 스위트 전원 통과 (`pass 18, fail 0`).
  - Test #18에서 36종 무공 이름 무중복(`size === 36`), 36종 SVG 아이콘 무중복(`size === 36`), 마교 포함 12문파 전원의 원거리(260px) 투사체 타격 및 상태이상 폭발을 자동 검증합니다.

## v1.1 상인 인수인계
merchant.js에 출현/상품/거래 로직. 현재 레벨 미사용 XP 전부로 상인당 1회 구매. 전투 중 E/터치, 거래 1~4/ESC. 거래는 shop 모드로 틱 중단. 플레이어 피격 이동 유지, 거래 종료 무적 .65초. C형 캐릭터 아트 및 적 방어 패턴은 아직 미적용.

## v1.3 아트
C 스타일 아군/적 렌더러 적용 완료. vendor/wuxia-sprites.js의 frame 빌더와 캐시 사용. characters.html에서 36개 캐릭터(12아군+24적) 비교. C 이미지의 스타일을 코드 도트로 재구성한 것으로 이미지 자체를 잘라 붙인 것이 아님. 적 방어 패턴 추가는 별도 남음.

## v1.4
스프라이트 frame(f,role,sub,locomotionFrame,hit,attack)로 공격/보행 독립. state.walkTime 및 enemy.animTime 실제 이동 시 누적. 움직이지 않으면 frame0. VFX.eventArt/projectile에서 형태별 표현. 게임 판정 변경 없음.

## v1.5 공격 시스템
combat.js의 beginAttack/updateAttackMotion에서 .42초 공격 사이클, .12초 1회 contact와 pendingShots 방출. 비주력 자동 무공은 즉시 발동 유지. sprite frame()의 attack 값은 boolean 대신 1~5 포즈. 기존 true는3으로 호환. 원본96×96, 몸체64px, 캔버스 정수 래스터. renderer cachedFrames 최대1024.

## v1.6
sect.js: 12종 절초, 위력/순환/확장 심화각6, 완성 후 운기. trajectories.js: 탄도정책/명중수/폭발/도탄/왕복/독영역. shot()은 탄환 객체 또는 풀포화시null 반환. 전체220개 제한. collision은 sweep 내 거리순 처리 후 consume. 보스damage예산은 최종배율 적용 후0.5초창당max12%. UI description도 정책에 맞춤. 공개표본은 art-samples.html 및 samples/*, 인게임아트교체없음. 시뮬레이션 검증과 실제 모바일FPS를 혼동하지 말 것.
