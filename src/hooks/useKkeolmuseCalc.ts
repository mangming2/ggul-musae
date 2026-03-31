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
