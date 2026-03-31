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
        <p className="text-base text-gray-500 font-medium leading-relaxed">
          {year}년에 {item.name}({(item.price / 10000).toFixed(0)}만원) 안 사고
        </p>
        <p className="text-base text-gray-500 font-medium mb-2">
          {stock.name} 샀으면...
        </p>

        <CharacterDisplay isProfit={isProfit} itemName={item.name} />

        <div className="text-center mt-2">
          <p className="text-3xl font-bold text-gray-900 mb-3">
            현재 {formatWon(finalAsset)}
          </p>
          <p className={`text-xl font-bold ${rateColor}`}>
            수익률 {rateSign}{returnRate.toFixed(1)}%
          </p>
        </div>
      </div>

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
