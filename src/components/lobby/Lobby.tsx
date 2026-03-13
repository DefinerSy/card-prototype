import { Button } from '@/components/ui/Button';
import { usePlayerStore } from '@/store/usePlayerStore';
import { allCards } from '@/game/cards';
import type { Card as CardType } from '@/game/types';
import { enemies } from '@/game/data/enemies';
import { useGameStore } from '@/store/useGameStore';
import { useState } from 'react';

// 迷你卡牌组件 - 用于卡组构筑页面
function MiniCard({ card, onClick, showAddHint, disabled, price, onBuy }: {
  card: CardType;
  onClick?: () => void;
  showAddHint?: boolean;
  disabled?: boolean;
  price?: number;
  onBuy?: () => void;
}) {
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
        relative w-24 h-36 p-2
        bg-[#e0ddd5] text-[#1a1a1a]
        rough-bg sketchy-border
        ${!disabled && onClick ? 'cursor-pointer hover:scale-105 hover:rotate-2 transition-transform duration-200' : ''}
        ${!disabled && onBuy ? 'cursor-pointer hover:scale-105 hover:rotate-2 transition-transform duration-200' : ''}
        ${disabled && !onBuy ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        ${card.rarity === 'legendary' ? 'shadow-[0_0_10px_rgba(234,179,8,0.5)]' : ''}
        ${card.rarity === 'rare' ? 'shadow-[0_0_8px_rgba(168,85,247,0.4)]' : ''}
      `}
      onClick={() => {
        if (disabled && !onBuy) return;
        if (onBuy) onBuy();
        else onClick?.();
      }}
    >
      {/* 背景涂鸦污渍 */}
      <div className={`absolute inset-0 ${typeBgColors[card.type]} opacity-50 mix-blend-multiply`} style={{ filter: 'url(#rough-edge)' }}></div>

      {/* 费用 */}
      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#111] text-[#e0ddd5] flex items-center justify-center text-sm font-bold sketchy-border z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
        {card.cost}
      </div>

      {/* 卡牌名称 */}
      <div className="text-sm font-bold text-center mb-1 leading-tight relative z-10" style={{ fontFamily: 'var(--font-sketch)' }}>{card.name}</div>

      {/* 类型标签 */}
      <div className={`text-xs font-bold text-center mb-2 ${typeColors[card.type]} relative z-10`} style={{ fontFamily: 'var(--font-sketch)' }}>
        <span className="inline-block px-1 bg-[#111] text-current sketchy-border transform -rotate-2">
          {typeLabels[card.type]}
        </span>
      </div>

      {/* 卡牌描述 */}
      <div className="text-xs text-center leading-tight relative z-10 mt-1" style={{ fontFamily: 'var(--font-handwriting)', fontWeight: 'bold' }}>{card.description}</div>

      {/* 稀有度标记 */}
      <div className="absolute bottom-1 right-1 text-sm font-bold z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
        {card.rarity === 'legendary' && <span className="text-yellow-600">★</span>}
        {card.rarity === 'rare' && <span className="text-purple-600">♦</span>}
        {card.rarity === 'common' && <span className="text-gray-600">●</span>}
      </div>

      {/* 卡组已满提示 */}
      {disabled && !onBuy && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#111]/80" style={{ filter: 'url(#rough-edge)' }}></div>
          <span className="relative text-sm text-red-500 font-bold px-1 text-center transform -rotate-12" style={{ fontFamily: 'var(--font-sketch)' }}>FULL</span>
        </div>
      )}

      {/* 价格标签 */}
      {onBuy && price !== undefined && (
        <div className="absolute bottom-1 left-1 bg-[#111] px-2 py-0.5 text-xs font-bold text-yellow-500 sketchy-border z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
          {price}G
        </div>
      )}

      {/* 添加提示 */}
      {!disabled && !onBuy && showAddHint && (
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-[#111]/60" style={{ filter: 'url(#rough-edge)' }}></div>
          <span className="relative text-lg text-[#e0ddd5] font-bold transform -rotate-12" style={{ fontFamily: 'var(--font-sketch)' }}>+ ADD</span>
        </div>
      )}

      {/* 购买提示 */}
      {onBuy && (
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-[#111]/60" style={{ filter: 'url(#rough-edge)' }}></div>
          <span className="relative text-lg text-yellow-500 font-bold transform -rotate-12" style={{ fontFamily: 'var(--font-sketch)' }}>BUY</span>
        </div>
      )}
    </div>
  );
}

interface LobbyProps {
  onStartGame: () => void;
  onResetData: () => void;
}

export function Lobby({ onStartGame, onResetData }: LobbyProps) {
  const player = usePlayerStore((state) => state.player);
  const { addToDeck, removeFromDeck, buyCard, addCoins } = usePlayerStore();
  const { startGame } = useGameStore();
  const [activeTab, setActiveTab] = useState<'deck' | 'cards' | 'shop'>('deck');
  const [selectedEnemy, setSelectedEnemy] = useState(0);

  const handleAddTestCoins = () => {
    addCoins(100);
  };

  const handleStartGame = () => {
    if (player.deck.length < 10) {
      alert('卡组至少需要 10 张牌！当前只有 ' + player.deck.length + ' 张');
      return;
    }

    // 获取卡组卡牌（包含重复的完整卡牌列表）
    const gameDeckCards = player.deck.map((id) => allCards.find((c) => c.id === id)).filter(Boolean) as CardType[];

    // 开始游戏
    startGame(gameDeckCards, enemies[selectedEnemy]);
    onStartGame();
  };

  // 当前卡组的卡牌（包含重复，用于显示）
  const deckCards = player.deck.map((id) => allCards.find((c) => c.id === id)).filter(Boolean) as CardType[];

  // 我的收藏：显示所有已解锁的卡牌类型（可以去重）
  const collectedCardsUnique = allCards.filter((card) => player.unlockedCards.includes(card.id));

  const lockedCards = allCards.filter((card) => !player.unlockedCards.includes(card.id));

  // 卡组已满 30 张
  const isDeckFull = player.deck.length >= 30;

  // 卡牌价格（根据稀有度）
  const getCardPrice = (card: CardType) => {
    if (card.rarity === 'legendary') return 100;
    if (card.rarity === 'rare') return 50;
    return 25;
  };

  const handleBuyCard = (card: CardType) => {
    const price = getCardPrice(card);
    const success = buyCard(card.id, price);
    if (!success) {
      if (player.unlockedCards.includes(card.id)) {
        alert('你已经拥有这张卡牌了！');
      } else if (player.coins < price) {
        alert('金币不足！');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* 涂鸦背景纹理 */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="lobby-hatch" width="100" height="100" patternTransform="rotate(15 0 0)" patternUnits="userSpaceOnUse">
            <path d="M0 0 L0 100 M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100" stroke="#e0ddd5" strokeWidth="0.5" filter="url(#sketchy-line)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lobby-hatch)" />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 标题和资源显示 */}
        <div className="flex justify-between items-center mb-6 border-b-4 border-[#111] pb-4">
          <h1 className="text-5xl font-bold text-[#e0ddd5]" style={{ fontFamily: 'var(--font-sketch)', letterSpacing: '2px' }}>INK & ASHES</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 font-bold" style={{ fontFamily: 'var(--font-sketch)' }}>
              <div className="bg-[#111] px-4 py-2 text-yellow-500 sketchy-border transform rotate-1">
                GOLD: {player.coins}
              </div>
              <div className="bg-[#111] px-4 py-2 text-purple-500 sketchy-border transform -rotate-1">
                DUST: {player.stardust}
              </div>
              <div className="bg-[#111] px-4 py-2 text-cyan-500 sketchy-border transform rotate-2">
                LORE: {player.knowledgeShards}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAddTestCoins} className="sketchy-border">
                +100 G
              </Button>
              <Button variant="danger" size="sm" onClick={onResetData} className="sketchy-border">
                RESET
              </Button>
            </div>
          </div>
        </div>

        {/* 选项卡 */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'deck' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('deck')}
            className={`sketchy-border text-lg ${activeTab === 'deck' ? 'transform -translate-y-1' : ''}`}
            style={{ fontFamily: 'var(--font-sketch)' }}
          >
            DECK ({player.deck.length}/30)
          </Button>
          <Button
            variant={activeTab === 'cards' ? (isDeckFull ? 'danger' : 'primary') : 'outline'}
            onClick={() => setActiveTab('cards')}
            disabled={isDeckFull}
            className={`sketchy-border text-lg ${activeTab === 'cards' ? 'transform -translate-y-1' : ''}`}
            style={{ fontFamily: 'var(--font-sketch)' }}
          >
            COLLECTION {isDeckFull && '(FULL)'}
          </Button>
          <Button
            variant={activeTab === 'shop' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('shop')}
            className={`sketchy-border text-lg ${activeTab === 'shop' ? 'transform -translate-y-1' : ''}`}
            style={{ fontFamily: 'var(--font-sketch)' }}
          >
            SHOP
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* 左侧：卡组/卡牌列表 */}
          <div className="col-span-3">
            <div className="bg-[#e0ddd5] p-6 sketchy-border rough-bg">
              <h2 className="text-2xl font-bold mb-4 text-[#111] border-b-2 border-[#111] pb-2" style={{ fontFamily: 'var(--font-sketch)' }}>
                {activeTab === 'deck' && `CURRENT DECK (${player.deck.length})`}
                {activeTab === 'cards' && `UNLOCKED CARDS (${collectedCardsUnique.length})`}
                {activeTab === 'shop' && `LOCKED CARDS (${lockedCards.length})`}
              </h2>
              
              <div className="grid grid-cols-6 gap-4 max-h-[600px] overflow-y-auto p-2">
                {activeTab === 'deck' &&
                  deckCards.map((card, idx) => (
                    <MiniCard
                      key={`${card.id}-${idx}`}
                      card={card}
                      onClick={() => removeFromDeck(card.id, idx)}
                    />
                  ))}

                {activeTab === 'cards' &&
                  collectedCardsUnique.map((card, idx) => (
                    <MiniCard
                      key={`${card.id}-${idx}`}
                      card={card}
                      onClick={() => addToDeck(card.id)}
                      showAddHint
                      disabled={isDeckFull}
                    />
                  ))}

                {activeTab === 'shop' &&
                  lockedCards.map((card) => (
                    <MiniCard
                      key={card.id}
                      card={card}
                      onBuy={() => handleBuyCard(card)}
                      price={getCardPrice(card)}
                    />
                  ))}

                {activeTab === 'deck' && player.deck.length === 0 && (
                  <div className="col-span-6 text-center text-[#111] py-12 text-2xl" style={{ fontFamily: 'var(--font-sketch)' }}>
                    DECK IS EMPTY. ADD CARDS FROM COLLECTION.
                  </div>
                )}

                {activeTab === 'cards' && isDeckFull && (
                  <div className="col-span-6 text-center text-red-600 font-bold py-4 bg-red-950/20 sketchy-border" style={{ fontFamily: 'var(--font-sketch)' }}>
                    DECK LIMIT REACHED (30)
                  </div>
                )}

                {activeTab === 'shop' && lockedCards.length === 0 && (
                  <div className="col-span-6 text-center text-green-600 font-bold py-12 text-2xl" style={{ fontFamily: 'var(--font-sketch)' }}>
                    ALL CARDS UNLOCKED!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：信息和操作 */}
          <div className="space-y-6">
            {/* 敌人选择 */}
            <div className="bg-[#e0ddd5] p-4 sketchy-border rough-bg">
              <h2 className="text-xl font-bold mb-3 text-[#111]" style={{ fontFamily: 'var(--font-sketch)' }}>SELECT TARGET</h2>
              <div className="space-y-2">
                {enemies.map((enemy, index) => (
                  <div
                    key={enemy.id}
                    className={`p-3 cursor-pointer transition-all sketchy-border ${
                      selectedEnemy === index
                        ? 'bg-[#111] text-[#e0ddd5] transform scale-105 rotate-1'
                        : 'bg-transparent text-[#111] hover:bg-[#111]/10'
                    }`}
                    onClick={() => setSelectedEnemy(index)}
                  >
                    <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-sketch)' }}>{enemy.name}</div>
                    <div className={`text-sm font-bold ${selectedEnemy === index ? 'text-red-400' : 'text-red-600'}`}>HP: {enemy.hp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 开始游戏按钮 */}
            <div className="bg-[#e0ddd5] p-4 sketchy-border rough-bg">
              <div className="space-y-2 text-center">
                <div className="text-lg font-bold text-[#111]" style={{ fontFamily: 'var(--font-sketch)' }}>
                  DECK: {player.deck.length} / 30
                </div>
                {player.deck.length < 10 && (
                  <div className="text-sm font-bold text-red-600" style={{ fontFamily: 'var(--font-handwriting)' }}>
                    NEED AT LEAST 10 CARDS
                  </div>
                )}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-4 py-4 text-2xl sketchy-border"
                  style={{ fontFamily: 'var(--font-sketch)' }}
                  onClick={handleStartGame}
                  disabled={player.deck.length < 10}
                >
                  ENTER DUNGEON
                </Button>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="bg-[#e0ddd5] p-4 sketchy-border rough-bg">
              <h2 className="text-xl font-bold mb-2 text-[#111]" style={{ fontFamily: 'var(--font-sketch)' }}>STATS</h2>
              <div className="space-y-1 text-lg font-bold text-[#111]" style={{ fontFamily: 'var(--font-handwriting)' }}>
                <div>RUNS: {player.stats.gamesPlayed}</div>
                <div>VICTORIES: {player.stats.gamesWon}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
