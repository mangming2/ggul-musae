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
