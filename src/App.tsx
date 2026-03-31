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
