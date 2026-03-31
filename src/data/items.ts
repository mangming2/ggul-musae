import { Item } from '../types';

export const ITEMS: Item[] = [
  { year: 2018, itemId: 'iphone-x',    name: '아이폰X',    price: 1420000 },
  { year: 2020, itemId: 'ps5',         name: '플스5',       price: 600000  },
  { year: 2020, itemId: 'iphone12',    name: '아이폰12',   price: 950000  },
  { year: 2022, itemId: 'iphone14',    name: '아이폰14',   price: 1250000 },
  { year: 2022, itemId: 'macbook-air', name: '맥북에어M2', price: 1590000 },
];

export const YEARS: number[] = [...new Set(ITEMS.map(i => i.year))].sort((a, b) => a - b);
