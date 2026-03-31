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
