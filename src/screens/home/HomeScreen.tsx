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
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    if (selectedYear && selectedItem && selectedStock) {
      onSubmit(selectedYear, selectedItem, selectedStock);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8">
      <div className="flex-1">
        <img
          src="/kkeolmuse_icon.png"
          alt="껄무새"
          className="w-16 h-16 rounded-2xl mb-8"
        />
        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-10">
          아.. 그때 그거 안 사고<br />주식 샀으면 지금 얼마일까?
        </h1>

        <SelectField
          label="연도"
          value={selectedYear ? `${selectedYear}년` : null}
          placeholder="연도를 선택하세요"
          onClick={() => setActiveSheet('year')}
        />

        <SelectField
          label="소비 아이템"
          value={selectedItem?.name ?? null}
          placeholder="아이템을 선택하세요"
          disabled={selectedYear === null}
          onClick={() => setActiveSheet('item')}
        />

        <SelectField
          label="주식 종목"
          value={selectedStock?.name ?? null}
          placeholder="종목을 선택하세요"
          onClick={() => setActiveSheet('stock')}
        />
      </div>

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

      <BottomSheet
        isOpen={activeSheet === 'year'}
        onClose={() => setActiveSheet(null)}
        title="연도를 선택하세요"
        options={YEARS.map(y => ({ label: `${y}년`, value: y }))}
        onSelect={handleYearSelect}
      />

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
