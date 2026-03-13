import type { Card } from '@/game/types';

interface CardComponentProps {
  card: Card;
  index: number;
  canPlay: boolean;
  onPlay: (index: number) => void;
}

export function CardComponent({ card, index, canPlay, onPlay }: CardComponentProps) {
  const typeColors = {
    damage: 'text-red-600',
    fuel: 'text-yellow-600',
    cycle: 'text-blue-600',
    buffer: 'text-green-600',
  };

  const typeBgColors = {
    damage: 'bg-red-950/30',
    fuel: 'bg-yellow-950/30',
    cycle: 'bg-blue-950/30',
    buffer: 'bg-green-950/30',
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
        relative w-24 md:w-28 h-36 md:h-40 p-1.5 md:p-2 cursor-pointer flex-shrink-0
        bg-[#e0ddd5] text-[#1a1a1a]
        transition-all duration-200
        rough-bg sketchy-border
        ${canPlay ? 'hover:scale-110 hover:-translate-y-4 hover:rotate-2 shadow-2xl z-10 hover:z-50' : 'opacity-60 cursor-not-allowed grayscale'}
        ${card.rarity === 'legendary' ? 'shadow-[0_0_15px_rgba(234,179,8,0.5)]' : ''}
        ${card.rarity === 'rare' ? 'shadow-[0_0_10px_rgba(168,85,247,0.4)]' : ''}
      `}
      onClick={() => canPlay && onPlay(index)}
      style={{
        transform: `rotate(${(index % 3) * 2 - 2}deg)`,
        marginLeft: index > 0 ? '-1rem' : '0',
      }}
    >
      {/* 背景涂鸦污渍 */}
      <div className={`absolute inset-0 ${typeBgColors[card.type]} opacity-50 mix-blend-multiply`} style={{ filter: 'url(#rough-edge)' }}></div>

      {/* 费用 */}
      <div className="absolute -top-2 md:-top-3 -left-2 md:-left-3 w-6 md:w-8 h-6 md:h-8 rounded-full bg-[#111] text-[#e0ddd5] flex items-center justify-center text-base md:text-lg font-bold sketchy-border z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
        {card.cost}
      </div>

      {/* 卡牌名称 */}
      <div className="text-sm md:text-lg font-bold text-center mb-1 leading-tight relative z-10" style={{ fontFamily: 'var(--font-sketch)', letterSpacing: '1px' }}>
        {card.name}
      </div>

      {/* 类型标签 (墨水污渍风格) */}
      <div className={`text-xs md:text-sm font-bold text-center mb-1 md:mb-2 ${typeColors[card.type]} relative z-10`} style={{ fontFamily: 'var(--font-sketch)' }}>
        <span className="inline-block px-1 md:px-2 py-0.5 bg-[#111] text-current sketchy-border transform -rotate-2">
          {typeLabels[card.type]}
        </span>
      </div>

      {/* 卡牌描述 */}
      <div className="text-xs md:text-sm text-center leading-tight relative z-10 px-0.5 md:px-1 mt-1 md:mt-2" style={{ fontFamily: 'var(--font-handwriting)', fontWeight: 'bold' }}>
        {card.description}
      </div>

      {/* 稀有度标记 */}
      <div className="absolute bottom-1 right-1 md:right-2 text-lg md:text-xl font-bold z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
        {card.rarity === 'legendary' && <span className="text-yellow-600 drop-shadow-md">★</span>}
        {card.rarity === 'rare' && <span className="text-purple-600">♦</span>}
        {card.rarity === 'common' && <span className="text-gray-600">●</span>}
      </div>
    </div>
  );
}
