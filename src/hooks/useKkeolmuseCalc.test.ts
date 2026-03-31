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
