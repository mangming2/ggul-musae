# 껄무새 (주식 후회 계산기) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 연도/아이템/주식을 선택하면 "그때 주식 샀으면 얼마?" 를 토스 스타일로 보여주는 앱인토스 웹 미니앱 구현

**Architecture:** 상태 기반 화면 전환 (home ↔ result), calcKkeolmuse 순수 함수로 계산 로직 분리, BottomSheet 공유 컴포넌트로 모든 선택 UI 처리

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, @apps-in-toss/web-framework, Vitest

---

## 파일 맵

| 경로 | 역할 |
|------|------|
| `public/kkeolmuse_icon.png` | 앱 아이콘 (granite.config + UI 공용) |
| `src/index.css` | Tailwind CSS 진입점 |
| `src/types/index.ts` | 공유 타입 (Item, Stock, CalcInput, CalcResult) |
| `src/data/items.ts` | 연도별 소비 아이템 mock 데이터 |
| `src/data/stocks.ts` | 주식 종목 + 연도별 가격 mock 데이터 |
| `src/hooks/useKkeolmuseCalc.ts` | calcKkeolmuse 순수 함수 + hook wrapper |
| `src/hooks/useKkeolmuseCalc.test.ts` | Vitest 단위 테스트 |
| `src/components/BottomSheet.tsx` | 공유 바텀시트 모달 |
| `src/screens/home/SelectField.tsx` | 선택 필드 UI (연도/아이템/주식 공통) |
| `src/screens/home/HomeScreen.tsx` | 입력 화면 |
| `src/screens/result/CharacterDisplay.tsx` | 캐릭터 + 멘트 분기 |
| `src/screens/result/ResultScreen.tsx` | 결과 화면 |
| `src/App.tsx` | 화면 상태 관리, submit/reset 핸들링 |
| `src/main.tsx` | CSS import 추가 |
| `vite.config.ts` | Tailwind 플러그인 + Vitest 설정 |
| `granite.config.ts` | displayName, icon URL 업데이트 |
| `index.html` | title 업데이트 |

---

## Task 1: Tailwind CSS + Vitest 설치 및 설정

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/index.css`
- Modify: `src/main.tsx`
- Modify: `index.html`

- [ ] **Step 1: 패키지 설치**

```bash
cd /Users/jiho/Documents/GitHub/ggul-musae
pnpm add tailwindcss @tailwindcss/vite
pnpm add -D vitest
```

Expected: `node_modules/.bin/vitest` 생성됨

- [ ] **Step 2: package.json에 test 스크립트 추가**

`package.json`의 `scripts` 섹션을 다음으로 교체:

```json
"scripts": {
  "dev": "node node_modules/@apps-in-toss/web-framework/bin.js dev",
  "build": "ait build",
  "deploy": "ait deploy",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: vite.config.ts 업데이트**

`vite.config.ts` 전체를 다음으로 교체:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 4: src/index.css 생성**

```css
@import "tailwindcss";
```

- [ ] **Step 5: src/main.tsx에 CSS import 추가**

`src/main.tsx` 전체를 다음으로 교체:

```tsx
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

- [ ] **Step 6: index.html title 업데이트**

`index.html`의 `<title>ggul-musae</title>`를 다음으로 교체:

```html
<title>껄무새</title>
```

- [ ] **Step 7: Tailwind 동작 확인**

`src/App.tsx`를 임시로 다음으로 교체해서 Tailwind가 작동하는지 확인:

```tsx
export default function App() {
  return <div className="text-2xl font-bold text-blue-500 p-8">껄무새 테스트</div>;
}
```

Run: `pnpm run dev`  
브라우저에서 파란색 굵은 텍스트 "껄무새 테스트" 확인

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "feat: add Tailwind CSS v4 and Vitest"
```

---

## Task 2: 앱 아이콘 복사 + granite.config.ts 업데이트

**Files:**
- Create: `public/kkeolmuse_icon.png`
- Modify: `granite.config.ts`

- [ ] **Step 1: 아이콘을 public 폴더에 복사**

```bash
mkdir -p /Users/jiho/Documents/GitHub/ggul-musae/public
cp /Users/jiho/Downloads/kkeolmuse_icon.png /Users/jiho/Documents/GitHub/ggul-musae/public/kkeolmuse_icon.png
```

Expected: `public/kkeolmuse_icon.png` 파일 생성

- [ ] **Step 2: granite.config.ts 업데이트**

`granite.config.ts` 전체를 다음으로 교체:

```ts
import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ggul-musae',
  brand: {
    displayName: '껄무새',
    primaryColor: '#3182F6',
    icon: 'http://localhost:5173/kkeolmuse_icon.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
```

- [ ] **Step 3: 커밋**

```bash
git add public/kkeolmuse_icon.png granite.config.ts
git commit -m "feat: add app icon and update granite config"
```

---

## Task 3: 타입 정의 + Mock 데이터 작성

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/items.ts`
- Create: `src/data/stocks.ts`

- [ ] **Step 1: src/types/index.ts 생성**

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

- [ ] **Step 2: src/data/items.ts 생성**

```ts
import { Item } from '../types';

export const ITEMS: Item[] = [
  { year: 2018, itemId: 'iphone-x',    name: '아이폰X',    price: 1420000 },
  { year: 2020, itemId: 'ps5',         name: '플스5',       price: 600000  },
  { year: 2020, itemId: 'iphone12',    name: '아이폰12',   price: 950000  },
  { year: 2022, itemId: 'iphone14',    name: '아이폰14',   price: 1250000 },
  { year: 2022, itemId: 'macbook-air', name: '맥북에어M2', price: 1590000 },
];

export const YEARS: number[] = [...new Set(ITEMS.map(i => i.year))].sort((a, b) => a - b);
```

- [ ] **Step 3: src/data/stocks.ts 생성**

```ts
import { Stock } from '../types';

export const STOCKS: Stock[] = [
  {
    stockId: 'NVDA',
    name: '엔비디아',
    currentPrice: 1200000,
    historyPrices: { 2018: 18000, 2020: 53000, 2022: 140000 },
  },
  {
    stockId: 'BTC',
    name: '비트코인',
    currentPrice: 120000000,
    historyPrices: { 2018: 4000000, 2020: 13000000, 2022: 50000000 },
  },
  {
    stockId: '005930',
    name: '삼성전자',
    currentPrice: 75000,
    historyPrices: { 2018: 47000, 2020: 61000, 2022: 67000 },
  },
  {
    stockId: '035720',
    name: '카카오',
    currentPrice: 43000,
    historyPrices: { 2018: 13000, 2020: 45000, 2022: 58000 },
  },
];
```

- [ ] **Step 4: 커밋**

```bash
git add src/types/index.ts src/data/items.ts src/data/stocks.ts
git commit -m "feat: add types and mock data"
```

---

## Task 4: calcKkeolmuse 순수 함수 — TDD

**Files:**
- Create: `src/hooks/useKkeolmuseCalc.ts`
- Create: `src/hooks/useKkeolmuseCalc.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/hooks/useKkeolmuseCalc.test.ts` 생성:

```ts
import { describe, it, expect } from 'vitest';
import { calcKkeolmuse } from './useKkeolmuseCalc';
import { Item, Stock } from '../types';

const mockItem: Item = { year: 2020, itemId: 'ps5', name: '플스5', price: 600000 };

const profitStock: Stock = {
  stockId: 'NVDA',
  name: '엔비디아',
  currentPrice: 1200000,
  historyPrices: { 2020: 53000 },
};

const lossStock: Stock = {
  stockId: 'TEST',
  name: '테스트',
  currentPrice: 5000,
  historyPrices: { 2020: 10000 },
};

describe('calcKkeolmuse', () => {
  it('수익 케이스: isProfit true, finalAsset > item.price', () => {
    // returnRate = (1200000 - 53000) / 53000 * 100 ≈ 2164.15%
    // finalAsset = 600000 * (1 + 2164.15 / 100) ≈ 13584906
    const result = calcKkeolmuse({ item: mockItem, stock: profitStock, year: 2020 });

    expect(result.isProfit).toBe(true);
    expect(result.returnRate).toBeGreaterThan(0);
    expect(result.finalAsset).toBeGreaterThan(mockItem.price);
  });

  it('손실 케이스: isProfit false, finalAsset < item.price', () => {
    // returnRate = (5000 - 10000) / 10000 * 100 = -50%
    // finalAsset = 600000 * (1 + (-50 / 100)) = 300000
    const result = calcKkeolmuse({ item: mockItem, stock: lossStock, year: 2020 });

    expect(result.isProfit).toBe(false);
    expect(result.returnRate).toBeCloseTo(-50, 1);
    expect(result.finalAsset).toBe(300000);
  });

  it('같은 입력에 항상 새 객체 반환 (불변)', () => {
    const r1 = calcKkeolmuse({ item: mockItem, stock: profitStock, year: 2020 });
    const r2 = calcKkeolmuse({ item: mockItem, stock: profitStock, year: 2020 });

    expect(r1).not.toBe(r2);
    expect(r1).toEqual(r2);
  });

  it('수익률 소수점 1자리로 반올림', () => {
    const result = calcKkeolmuse({ item: mockItem, stock: profitStock, year: 2020 });
    const decimals = result.returnRate.toString().split('.')[1];
    expect(decimals === undefined || decimals.length <= 1).toBe(true);
  });
});
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm test
```

Expected: `Error: Cannot find module './useKkeolmuseCalc'`

- [ ] **Step 3: calcKkeolmuse 구현**

`src/hooks/useKkeolmuseCalc.ts` 생성:

```ts
import { CalcInput, CalcResult } from '../types';

export function calcKkeolmuse({ item, stock, year }: CalcInput): CalcResult {
  const pastPrice = stock.historyPrices[year];
  const returnRate = Math.round(((stock.currentPrice - pastPrice) / pastPrice) * 1000) / 10;
  const finalAsset = Math.round(item.price * (1 + returnRate / 100));

  return {
    finalAsset,
    returnRate,
    isProfit: returnRate > 0,
  };
}

export function useKkeolmuseCalc() {
  return { calc: calcKkeolmuse };
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm test
```

Expected:
```
✓ src/hooks/useKkeolmuseCalc.test.ts (4)
  ✓ calcKkeolmuse > 수익 케이스: isProfit true, finalAsset > item.price
  ✓ calcKkeolmuse > 손실 케이스: isProfit false, finalAsset < item.price
  ✓ calcKkeolmuse > 같은 입력에 항상 새 객체 반환 (불변)
  ✓ calcKkeolmuse > 수익률 소수점 1자리로 반올림

Test Files  1 passed (1)
Tests       4 passed (4)
```

- [ ] **Step 5: 커밋**

```bash
git add src/hooks/useKkeolmuseCalc.ts src/hooks/useKkeolmuseCalc.test.ts
git commit -m "feat: add calcKkeolmuse pure function with tests"
```

---

## Task 5: BottomSheet 컴포넌트

**Files:**
- Create: `src/components/BottomSheet.tsx`

- [ ] **Step 1: BottomSheet.tsx 생성**

```tsx
type Option<T> = {
  label: string;
  value: T;
};

type BottomSheetProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: Option<T>[];
  onSelect: (value: T) => void;
};

export function BottomSheet<T>({ isOpen, onClose, title, options, onSelect }: BottomSheetProps<T>) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="px-6 pt-5 pb-10">
          {/* Handle bar */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

          <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>

          <ul className="space-y-1">
            {options.map((option, idx) => (
              <li key={idx}>
                <button
                  className="w-full text-left px-4 py-4 rounded-2xl text-gray-800 font-medium text-base hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/BottomSheet.tsx
git commit -m "feat: add BottomSheet component"
```

---

## Task 6: SelectField 컴포넌트

**Files:**
- Create: `src/screens/home/SelectField.tsx`

- [ ] **Step 1: SelectField.tsx 생성**

```tsx
type SelectFieldProps = {
  label: string;
  value: string | null;
  placeholder: string;
  disabled?: boolean;
  onClick: () => void;
};

export function SelectField({
  label,
  value,
  placeholder,
  disabled = false,
  onClick,
}: SelectFieldProps) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
      <button
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-colors ${
          disabled
            ? 'border-gray-100 bg-gray-50 cursor-not-allowed'
            : value
            ? 'border-[#3182F6] bg-white'
            : 'border-gray-200 bg-white hover:border-[#3182F6]'
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className={`text-base font-medium ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value ?? placeholder}
        </span>
        <span className="text-gray-400 text-lg">›</span>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/screens/home/SelectField.tsx
git commit -m "feat: add SelectField component"
```

---

## Task 7: HomeScreen

**Files:**
- Create: `src/screens/home/HomeScreen.tsx`

- [ ] **Step 1: HomeScreen.tsx 생성**

```tsx
import { useState } from 'react';
import { Item, Stock } from '../../types';
import { ITEMS, YEARS } from '../../data/items';
import { STOCKS } from '../../data/stocks';
import { SelectField } from './SelectField';
import { BottomSheet } from '../../components/BottomSheet';

type ActiveSheet = 'year' | 'item' | 'stock' | null;

type HomeScreenProps = {
  onSubmit: (year: number, item: Item, stock: Stock) => void;
};

export function HomeScreen({ onSubmit }: HomeScreenProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  const availableItems = selectedYear ? ITEMS.filter(i => i.year === selectedYear) : [];
  const isReady = selectedYear !== null && selectedItem !== null && selectedStock !== null;

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectedItem(null); // 연도 바뀌면 아이템 초기화
  };

  const handleSubmit = () => {
    if (selectedYear && selectedItem && selectedStock) {
      onSubmit(selectedYear, selectedItem, selectedStock);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8">
      <div className="flex-1">
        {/* 아이콘 */}
        <img
          src="/kkeolmuse_icon.png"
          alt="껄무새"
          className="w-16 h-16 rounded-2xl mb-8"
        />

        {/* 헤더 카피 */}
        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-10">
          아.. 그때 그거 안 사고<br />주식 샀으면 지금 얼마일까?
        </h1>

        {/* 연도 선택 */}
        <SelectField
          label="연도"
          value={selectedYear ? `${selectedYear}년` : null}
          placeholder="연도를 선택하세요"
          onClick={() => setActiveSheet('year')}
        />

        {/* 소비 아이템 선택 */}
        <SelectField
          label="소비 아이템"
          value={selectedItem?.name ?? null}
          placeholder="아이템을 선택하세요"
          disabled={selectedYear === null}
          onClick={() => setActiveSheet('item')}
        />

        {/* 주식 종목 선택 */}
        <SelectField
          label="주식 종목"
          value={selectedStock?.name ?? null}
          placeholder="종목을 선택하세요"
          onClick={() => setActiveSheet('stock')}
        />
      </div>

      {/* CTA 버튼 */}
      <button
        className={`w-full py-5 rounded-2xl text-base font-bold transition-colors ${
          isReady
            ? 'bg-[#3182F6] text-white active:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        disabled={!isReady}
        onClick={handleSubmit}
      >
        껄무새 소환하기 🦜
      </button>

      {/* 연도 BottomSheet */}
      <BottomSheet
        isOpen={activeSheet === 'year'}
        onClose={() => setActiveSheet(null)}
        title="연도를 선택하세요"
        options={YEARS.map(y => ({ label: `${y}년`, value: y }))}
        onSelect={handleYearSelect}
      />

      {/* 아이템 BottomSheet */}
      <BottomSheet
        isOpen={activeSheet === 'item'}
        onClose={() => setActiveSheet(null)}
        title="소비 아이템을 선택하세요"
        options={availableItems.map(i => ({
          label: `${i.name} (${(i.price / 10000).toFixed(0)}만원)`,
          value: i,
        }))}
        onSelect={setSelectedItem}
      />

      {/* 주식 BottomSheet */}
      <BottomSheet
        isOpen={activeSheet === 'stock'}
        onClose={() => setActiveSheet(null)}
        title="주식 종목을 선택하세요"
        options={STOCKS.map(s => ({ label: s.name, value: s }))}
        onSelect={setSelectedStock}
      />
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/screens/home/HomeScreen.tsx
git commit -m "feat: add HomeScreen with BottomSheet selection"
```

---

## Task 8: CharacterDisplay 컴포넌트

**Files:**
- Create: `src/screens/result/CharacterDisplay.tsx`

- [ ] **Step 1: CharacterDisplay.tsx 생성**

```tsx
type CharacterDisplayProps = {
  isProfit: boolean;
  itemName: string;
};

export function CharacterDisplay({ isProfit, itemName }: CharacterDisplayProps) {
  const message = isProfit
    ? '주인님.. 그때 샀어야죠 꽥! 😭'
    : `휴! 차라리 ${itemName} 산 게 이득이었네요 꽥! 🕺`;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <img
        src="/kkeolmuse_icon.png"
        alt="껄무새"
        className="w-36 h-36 rounded-3xl"
      />
      <p className="text-base font-medium text-gray-700 text-center leading-relaxed">
        {message}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/screens/result/CharacterDisplay.tsx
git commit -m "feat: add CharacterDisplay component"
```

---

## Task 9: ResultScreen

**Files:**
- Create: `src/screens/result/ResultScreen.tsx`

- [ ] **Step 1: ResultScreen.tsx 생성**

```tsx
import { Item, Stock, CalcResult } from '../../types';
import { CharacterDisplay } from './CharacterDisplay';

type ResultScreenProps = {
  year: number;
  item: Item;
  stock: Stock;
  result: CalcResult;
  onReset: () => void;
};

function formatWon(amount: number): string {
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

export function ResultScreen({ year, item, stock, result, onReset }: ResultScreenProps) {
  const { finalAsset, returnRate, isProfit } = result;
  const rateColor = isProfit ? 'text-[#F04452]' : 'text-[#3182F6]';
  const rateSign = isProfit ? '+' : '';

  const handleInvest = () => {
    try {
      window.location.href = 'supertoss://present?screenName=STOCK_MAIN';
    } catch {
      alert('토스 앱에서 이용해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8">
      <div className="flex-1">
        {/* 조건 텍스트 */}
        <p className="text-base text-gray-500 font-medium leading-relaxed">
          {year}년에 {item.name}({(item.price / 10000).toFixed(0)}만원) 안 사고
        </p>
        <p className="text-base text-gray-500 font-medium mb-2">
          {stock.name} 샀으면...
        </p>

        {/* 캐릭터 */}
        <CharacterDisplay isProfit={isProfit} itemName={item.name} />

        {/* 결과 숫자 */}
        <div className="text-center mt-2">
          <p className="text-3xl font-bold text-gray-900 mb-3">
            현재 {formatWon(finalAsset)}
          </p>
          <p className={`text-xl font-bold ${rateColor}`}>
            수익률 {rateSign}{returnRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="space-y-3">
        <button
          className="w-full py-5 rounded-2xl bg-[#3182F6] text-white text-base font-bold active:bg-blue-700 transition-colors"
          onClick={handleInvest}
        >
          지금이라도 주식 모으기
        </button>
        <button
          className="w-full py-5 rounded-2xl bg-gray-100 text-gray-700 text-base font-bold active:bg-gray-200 transition-colors"
          onClick={onReset}
        >
          다시 계산하기
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/screens/result/ResultScreen.tsx
git commit -m "feat: add ResultScreen"
```

---

## Task 10: App.tsx 연결 + 전체 통합

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: App.tsx 전체 교체**

```tsx
import { useState } from 'react';
import { Item, Stock, CalcResult } from './types';
import { HomeScreen } from './screens/home/HomeScreen';
import { ResultScreen } from './screens/result/ResultScreen';
import { calcKkeolmuse } from './hooks/useKkeolmuseCalc';

type Screen = 'home' | 'result';

type Selection = {
  year: number;
  item: Item;
  stock: Stock;
  result: CalcResult;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selection, setSelection] = useState<Selection | null>(null);

  const handleSubmit = (year: number, item: Item, stock: Stock) => {
    const result = calcKkeolmuse({ year, item, stock });
    setSelection({ year, item, stock, result });
    setScreen('result');
  };

  const handleReset = () => {
    setSelection(null);
    setScreen('home');
  };

  if (screen === 'result' && selection) {
    return (
      <ResultScreen
        year={selection.year}
        item={selection.item}
        stock={selection.stock}
        result={selection.result}
        onReset={handleReset}
      />
    );
  }

  return <HomeScreen onSubmit={handleSubmit} />;
}
```

- [ ] **Step 2: 전체 빌드 확인**

```bash
pnpm run dev
```

브라우저 `http://localhost:5173` 에서:
1. 홈 화면 렌더 확인
2. 연도 선택 → BottomSheet 슬라이드업 확인
3. 아이템 선택 (연도 선택 전엔 비활성 확인)
4. 주식 선택 → "껄무새 소환하기" 버튼 활성화 확인
5. 버튼 클릭 → 결과 화면 전환 확인
6. 수익/손실 텍스트 색상 확인
7. "다시 계산하기" → 홈 초기화 확인

- [ ] **Step 3: 테스트 재실행 확인**

```bash
pnpm test
```

Expected: `Tests 4 passed (4)`

- [ ] **Step 4: 최종 커밋**

```bash
git add src/App.tsx
git commit -m "feat: wire App.tsx — kkeolmuse complete"
```
