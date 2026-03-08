import type { Card } from '@/game/types';

interface CardComponentProps {
  card: Card;
  index: number;
  canPlay: boolean;
  onPlay: (index: number) => void;
}

export function CardComponent({ card, index, canPlay, onPlay }: CardComponentProps) {
  const typeColors = {
    damage: 'from-red-900/80 to-red-700/80 border-red-500',
    fuel: 'from-yellow-900/80 to-yellow-700/80 border-yellow-500',
    cycle: 'from-blue-900/80 to-blue-700/80 border-blue-500',
    buffer: 'from-green-900/80 to-green-700/80 border-green-500',
  };

  const typeLabels = {
    damage: '伤害',
    fuel: '费用',
    cycle: '调度',
    buffer: '效果',
  };

  return (
    <div
      className={`
        relative w-28 h-40 rounded-lg border-2 p-2 cursor-pointer
        bg-gradient-to-br ${typeColors[card.type]}
        transition-all duration-200
        ${canPlay ? 'hover:scale-110 hover:-translate-y-4 shadow-lg' : 'opacity-50 cursor-not-allowed'}
        ${card.rarity === 'legendary' ? 'border-yellow-400 shadow-yellow-500/20' : ''}
        ${card.rarity === 'rare' ? 'border-purple-400' : ''}
      `}
      onClick={() => canPlay && onPlay(index)}
    >
      {/* 费用 */}
      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-400 flex items-center justify-center text-xs font-bold text-white">
        {card.cost}
      </div>

      {/* 卡牌名称 */}
      <div className="text-xs font-bold text-white text-center mb-1 truncate">{card.name}</div>

      {/* 类型标签 */}
      <div className="text-xs text-gray-300 text-center mb-2">{typeLabels[card.type]}</div>

      {/* 卡牌描述 */}
      <div className="text-xs text-gray-200 text-center leading-tight">{card.description}</div>

      {/* 稀有度标记 */}
      <div className="absolute bottom-1 right-1">
        {card.rarity === 'legendary' && <span className="text-yellow-400">◆</span>}
        {card.rarity === 'rare' && <span className="text-purple-400">◇</span>}
        {card.rarity === 'common' && <span className="text-gray-400">○</span>}
      </div>
    </div>
  );
}
