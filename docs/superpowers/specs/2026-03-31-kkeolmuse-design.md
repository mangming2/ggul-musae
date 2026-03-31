# 껄무새 (주식 후회 계산기) — Design Spec

**Date:** 2026-03-31  
**App:** ggul-musae (앱인토스 웹 미니앱)  
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS + @apps-in-toss/web-framework

---

## 1. 개요

과거의 특정 소비를 주식 투자로 바꿨다면 현재 얼마가 되었을지 보여주는 토스 스타일 미니앱.  
연도 → 소비 아이템 → 주식 종목 선택 후 수익/손실을 캐릭터 반응과 함께 노출.

---

## 2. 기술 스택

| 항목 | 선택 |
|------|------|
| 스타일링 | Tailwind CSS |
| 화면 전환 | 상태 기반 (`'home' \| 'result'`) — URL 변경 없음 |
| 라우터 | 미사용 |
| 주식 모으기 버튼 | 토스 증권 딥링크 (`@apps-in-toss/web-framework` bridge) |

---

## 3. 폴더 구조

```
src/
  screens/
    home/
      HomeScreen.tsx         # 입력 화면 전체
      SelectField.tsx        # 선택 필드 (연도/아이템/주식 공통 UI)
    result/
      ResultScreen.tsx       # 결과 화면 전체
      CharacterDisplay.tsx   # 캐릭터 이미지 + 멘트 분기
  components/
    BottomSheet.tsx          # 공유 바텀시트 모달
  hooks/
    useKkeolmuseCalc.ts      # 계산 로직 전담 훅
  data/
    items.ts                 # 연도별 소비 아이템 mock 데이터
    stocks.ts                # 주식 종목 + 연도별 가격 mock 데이터
  types/
    index.ts                 # 공유 타입 정의
  assets/
    kkeolmuse_icon.png       # 앱 아이콘 (수익 시 캐릭터로도 사용)
  App.tsx                    # 화면 상태 관리, 선택값 전달
  main.tsx
```

---

## 4. 타입 정의 (`src/types/index.ts`)

```ts
export type Item = {
  year: number;
  itemId: string;
  name: string;
  price: number;
};

export type Stock = {
  stockId: string;
  name: string;
  currentPrice: number;
  historyPrices: Record<number, number>;
};

export type CalcInput = {
  item: Item;
  stock: Stock;
  year: number;
};

export type CalcResult = {
  finalAsset: number;
  returnRate: number;
  isProfit: boolean;
};
```

---

## 5. Mock 데이터

### `src/data/items.ts`

```ts
import { Item } from '../types';

export const ITEMS: Item[] = [
  { year: 2018, itemId: 'iphone-x',    name: '아이폰X',    price: 1420000 },
  { year: 2020, itemId: 'ps5',         name: '플스5',       price: 600000  },
  { year: 2020, itemId: 'iphone12',    name: '아이폰12',   price: 950000  },
  { year: 2022, itemId: 'iphone14',    name: '아이폰14',   price: 1250000 },
  { year: 2022, itemId: 'macbook-air', name: '맥북에어M2', price: 1590000 },
];

export const YEARS = [...new Set(ITEMS.map(i => i.year))].sort();
```

### `src/data/stocks.ts`

```ts
import { Stock } from '../types';

export const STOCKS: Stock[] = [
  {
    stockId: 'NVDA', name: '엔비디아',
    currentPrice: 1200000,
    historyPrices: { 2018: 18000, 2020: 53000, 2022: 140000 },
  },
  {
    stockId: 'BTC', name: '비트코인',
    currentPrice: 120000000,
    historyPrices: { 2018: 4000000, 2020: 13000000, 2022: 50000000 },
  },
  {
    stockId: '005930', name: '삼성전자',
    currentPrice: 75000,
    historyPrices: { 2018: 47000, 2020: 61000, 2022: 67000 },
  },
  {
    stockId: '035720', name: '카카오',
    currentPrice: 43000,
    historyPrices: { 2018: 13000, 2020: 45000, 2022: 58000 },
  },
];
```

---

## 6. 커스텀 훅 (`src/hooks/useKkeolmuseCalc.ts`)

입력을 받아 불변 결과 객체를 반환하는 순수 함수 기반 훅.  
내부 상태 없음, 사이드 이펙트 없음.

```ts
// 수익률 = ((현재가 - 과거가) / 과거가) * 100
// 최종 자산 = 아이템 가격 * (1 + 수익률 / 100)
// isProfit = returnRate > 0
```

UI에서 "껄무새 소환하기" 버튼 클릭 시 호출, 반환값을 Result 화면에 전달.

---

## 7. 화면 설계

### 화면 A — HomeScreen

- **헤더:** "아.. 그때 그거 안 사고 주식 샀으면 지금 얼마일까?" (큰 폰트, 상단)
- **SelectField × 3:** 연도 → 아이템(연도 선택 후 활성화) → 주식 종목
  - 각 필드 탭 시 BottomSheet 슬라이드업
  - 미선택 시 placeholder 텍스트 노출
- **CTA 버튼:** "껄무새 소환하기 🦜" — 3개 항목 모두 선택 시 활성화

### 화면 B — ResultScreen

- **조건 텍스트:** "N년에 [아이템](N만원) 안 사고 [주식] 샀으면..."
- **캐릭터 표시 (CharacterDisplay):**
  - 수익: 아이콘 이미지 + "주인님.. 그때 샀어야죠 꽥! 😭"
  - 손실: 아이콘 이미지 + "휴! 차라리 [아이템] 산 게 이득이었네요 꽥! 🕺"
- **결과 숫자:** "현재 XXX만원" (큰 폰트) + 수익률 (수익 빨강 / 손실 파랑)
- **하단 고정 버튼:**
  - Primary: "지금이라도 주식 모으기" → 토스 증권 딥링크
  - Secondary: "다시 계산하기" → Home으로 리셋

### BottomSheet

- 공유 컴포넌트, 옵션 배열 + 선택 콜백 받음
- 오버레이 탭 시 닫힘
- 슬라이드업 CSS transition 애니메이션

---

## 8. App.tsx 상태 구조

```ts
type Screen = 'home' | 'result';
type AppState = {
  screen: Screen;
  selectedYear: number | null;
  selectedItem: Item | null;
  selectedStock: Stock | null;
  calcResult: CalcResult | null;
};
```

Result로 이동 시 calcResult를 포함하여 전달.  
"다시 계산하기" 시 전체 상태 초기화 후 home으로.

---

## 9. 아이콘 설정

- `/Users/jiho/Downloads/kkeolmuse_icon.png` → `src/assets/kkeolmuse_icon.png` 복사
- `granite.config.ts` `brand.icon` 필드에 URL 설정
- `CharacterDisplay`에서도 동일 이미지 사용 (수익/손실 공통, 텍스트로 감정 분기)

---

## 10. 토스 증권 딥링크

`@apps-in-toss/web-framework`의 bridge API를 통해 앱인토스 내 토스 증권으로 이동.  
구체적인 딥링크 스킴은 구현 시 확인 후 결정. fallback으로 `alert('준비 중입니다')` 처리.

---

## 11. UI 스타일 원칙 (토스 스타일)

- 배경: 흰색 (`#FFFFFF`)
- 주요 색상: `#3182F6` (토스 블루)
- 수익 색상: `#F04452` (빨강)
- 손실 색상: `#3182F6` (파랑)
- 폰트: 시스템 폰트, 굵은 숫자
- 버튼: 크고 둥근 (`rounded-2xl`), 전체 너비
- 여백: 넉넉한 패딩 (`px-6 py-5`)
- SelectField: 카드형 (`rounded-2xl border`), 탭하면 BottomSheet

---

## 12. 구현 순서 (writing-plans에서 상세화)

1. Tailwind CSS 설치 및 설정
2. 아이콘 복사 + granite.config.ts 업데이트
3. 타입 + 데이터 파일 작성
4. useKkeolmuseCalc 훅 작성
5. BottomSheet 컴포넌트
6. SelectField 컴포넌트
7. HomeScreen
8. CharacterDisplay + ResultScreen
9. App.tsx 상태 연결
