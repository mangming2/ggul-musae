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
