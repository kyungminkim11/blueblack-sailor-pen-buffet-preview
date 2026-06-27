# BlueBlack Fountain Pen Guide v2

블루블랙 펜샵 고객이 매장에서 직접 사용하는 만년필 검색·추천·문제 해결 웹앱입니다.

## 고객 기능

- 세 가지 시작 동선: 구매 상담 / 문제 해결 / 각인·AS·매장 정보
- 10문항 점수식 만년필 추천
- 공식몰 확인 상품과 가격 기준일 표시
- 오타·유사어·초성 대응 검색
- 상세 가이드를 앱 내부에서 열람
- 안전 중심 문제 해결 분기
- 상담 요청서와 임시 접수번호 생성
- 글자 확대, 고대비, 키보드 접근성
- 키오스크 자동 초기화
- 오프라인 기본 가이드와 업데이트 알림

## 실행 주소

- 일반 고객: `/guide/`
- 키오스크: `/guide/?mode=kiosk`
- 입구 QR: `/guide/?source=entrance`
- 시필대 QR: `/guide/?source=nib-table`
- 잉크 코너 QR: `/guide/?source=ink-zone`
- 카운터 QR: `/guide/?source=counter`

## 파일 구조

```text
guide/
├─ index.html
├─ app.css
├─ app.js
├─ manifest.webmanifest
├─ offline.html
├─ sw.js
├─ data/
│  └─ catalog.js
└─ modules/
   ├─ recommendation.js
   ├─ sanitize.js
   └─ search.js
```

## 데이터 원칙

- 가격은 `catalog.js`의 `verifiedAt` 기준일과 함께 표시합니다.
- 매장 재고를 추측하지 않고 `매장 확인 필요`로 안내합니다.
- 고객 연락처와 상담 본문은 로컬 이벤트 로그에 저장하지 않습니다.
- 검색·기능 사용 기록은 해당 브라우저의 localStorage에만 최대 500건 저장합니다.
- 상품과 콘텐츠를 변경할 때 앱 버전과 서비스워커 캐시 버전을 함께 변경합니다.

## 추천 로직

고객의 사용 경험, 목적, 글씨 크기, 종이, 필압, 사용 손, 무게, 충전 방식, 예산, 디자인 취향을 제품별 점수와 비교합니다. 결과는 구매 확정이 아니라 시필 후보 3개를 제시하는 용도입니다.

## 안전 원칙

- 닙 변형, 균열, 비정상 누출은 즉시 사용 중단으로 분기합니다.
- 닙 벌리기, 금속 도구, 뜨거운 물, 세제, 알코올 사용을 안내하지 않습니다.
- 수리 비용, 보증 적용, 실시간 재고를 단정하지 않습니다.

## 배포 전 검사

1. `node --check guide/app.js`
2. `node --check guide/data/catalog.js`
3. `node --check guide/modules/search.js`
4. `node --check guide/modules/recommendation.js`
5. 모바일과 태블릿에서 추천 10단계 완료 확인
6. 오프라인 전환 후 기본 가이드 확인
7. 공식몰 링크와 가격 기준일 확인
8. 공개 Notion 페이지에 내부 DB가 포함되지 않았는지 확인

## 현재 의도적으로 제외한 기능

- 실시간 POS·재고 자동 연동
- 직원 휴대전화 자동 푸시 알림
- 검수되지 않은 영문·일문 화면
- 사용 권한이 확인되지 않은 공식 로고·상품 사진

위 기능은 관련 계정, API, 승인된 자산이 제공된 이후 연결합니다.
