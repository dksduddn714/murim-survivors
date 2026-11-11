# Claude 협업 안내

먼저 AGENTS.md와 docs/HANDOFF.md를 읽으세요. 게임은 정적 Canvas JavaScript입니다.

* 실행: `npm run dev`, 검사: `npm test`. npm install은 필요 없습니다.
* 기능별 `feature/<name>` 브랜치에서 작업하고 PR로 합칩니다.
* dist가 곧 배포 결과물입니다. 파일 추가 시 index.html과 sw.js FILES 목록을 함께 점검합니다.
* 코드 변경 시 서비스워커 CACHE 이름을 올립니다. 진행 중인 전투를 강제로 새로고침하지 않습니다.
* 세력 관계, 레벨업 선택, 저장 호환성, 가로 화면 터치 조작을 유지합니다.
* 실제 검증하지 않은 앱 설치·스토어 출시·실기기 성능을 완료했다고 쓰지 않습니다.
