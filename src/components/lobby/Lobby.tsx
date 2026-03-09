import { Button } from '@/components/ui/Button';
import { Card as UICard, CardHeader, CardContent } from '@/components/ui/Card';
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
        relative w-24 h-36 rounded-lg border-2 p-2
        bg-gradient-to-br ${typeColors[card.type]}
        ${!disabled && onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}
        ${!disabled && onBuy ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}
        ${disabled && !onBuy ? 'opacity-50 cursor-not-allowed' : ''}
        ${card.rarity === 'legendary' ? 'border-yellow-400 shadow-yellow-500/20' : ''}
        ${card.rarity === 'rare' ? 'border-purple-400' : ''}
      `}
      onClick={() => {
        if (disabled && !onBuy) return;
        if (onBuy) onBuy();
        else onClick?.();
      }}
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

      {/* 卡组已满提示 */}
      {disabled && !onBuy && (
        <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
          <span className="text-xs text-red-400 font-semibold px-1 text-center">卡组已满</span>
        </div>
      )}

      {/* 价格标签 */}
      {onBuy && price !== undefined && (
        <div className="absolute bottom-1 left-1 bg-yellow-600/80 px-2 py-1 rounded text-xs font-bold text-yellow-100">
          {price}金
        </div>
      )}

      {/* 添加提示 */}
      {!disabled && !onBuy && showAddHint && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-xs text-white font-semibold">加入卡组</span>
        </div>
      )}

      {/* 购买提示 */}
      {onBuy && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-xs text-yellow-400 font-semibold">点击购买</span>
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
  const { addToDeck, removeFromDeck, buyCard } = usePlayerStore();
  const { startGame } = useGameStore();
  const [activeTab, setActiveTab] = useState<'deck' | 'cards' | 'shop'>('deck');
  const [selectedEnemy, setSelectedEnemy] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题和资源显示 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-white">卡牌游戏</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <div className="bg-yellow-600/20 px-4 py-2 rounded-lg text-yellow-400">
                金币：{player.coins}
              </div>
              <div className="bg-purple-600/20 px-4 py-2 rounded-lg text-purple-400">
                星尘：{player.stardust}
              </div>
              <div className="bg-cyan-600/20 px-4 py-2 rounded-lg text-cyan-400">
                知识：{player.knowledgeShards}
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={onResetData}>
              重置数据
            </Button>
          </div>
        </div>

        {/* 选项卡 */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'deck' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('deck')}
          >
            卡组构筑 ({player.deck.length}/30)
          </Button>
          <Button
            variant={activeTab === 'cards' ? (isDeckFull ? 'danger' : 'primary') : 'outline'}
            onClick={() => setActiveTab('cards')}
            disabled={isDeckFull}
          >
            我的收藏 {isDeckFull && '(已满)'}
          </Button>
          <Button
            variant={activeTab === 'shop' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('shop')}
          >
            卡牌商店
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* 左侧：卡组/卡牌列表 */}
          <div className="col-span-3">
            <UICard>
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {activeTab === 'deck' && `当前卡组 (${player.deck.length} 张)`}
                  {activeTab === 'cards' && `已解锁卡牌 (${collectedCardsUnique.length} 种，可无限复制)`}
                  {activeTab === 'shop' && `可解锁卡牌 (${lockedCards.length} 张)`}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2 max-h-[600px] overflow-y-auto">
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
                    <div className="col-span-6 text-center text-gray-400 py-8">
                      卡组为空，从"我的收藏"中添加卡牌
                    </div>
                  )}

                  {activeTab === 'cards' && isDeckFull && (
                    <div className="col-span-6 text-center text-red-400 font-semibold py-4 bg-red-900/20 rounded-lg">
                      卡组已达上限（30 张），无法继续添加
                    </div>
                  )}

                  {activeTab === 'shop' && lockedCards.length === 0 && (
                    <div className="col-span-6 text-center text-green-400 font-semibold py-8">
                      所有卡牌都已解锁！
                    </div>
                  )}
                </div>
              </CardContent>
            </UICard>
          </div>

          {/* 右侧：信息和操作 */}
          <div className="space-y-3">
            {/* 敌人选择 */}
            <UICard>
              <CardHeader className="px-3 py-2">
                <h2 className="text-base font-semibold">选择敌人</h2>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <div className="space-y-1">
                  {enemies.map((enemy, index) => (
                    <div
                      key={enemy.id}
                      className={`p-2 rounded-lg cursor-pointer transition ${
                        selectedEnemy === index
                          ? 'bg-red-900/30 border border-red-500'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedEnemy(index)}
                    >
                      <div className="font-semibold text-white text-sm">{enemy.name}</div>
                      <div className="text-xs text-gray-400">生命值：{enemy.hp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </UICard>

            {/* 开始游戏按钮 */}
            <UICard>
              <CardContent className="px-3 py-2">
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">
                    卡组：{player.deck.length} 张牌
                  </div>
                  <div className="text-xs text-gray-400">
                    提示：至少需要 10 张牌才能开始游戏
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                    onClick={handleStartGame}
                    disabled={player.deck.length < 10}
                  >
                    开始游戏
                  </Button>
                </div>
              </CardContent>
            </UICard>

            {/* 统计信息 */}
            <UICard>
              <CardHeader className="px-3 py-2">
                <h2 className="text-base font-semibold">统计</h2>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <div className="space-y-1 text-xs">
                  <div className="text-gray-400">
                    已玩局数：<span className="text-white">{player.stats.gamesPlayed}</span>
                  </div>
                  <div className="text-gray-400">
                    胜利局数：<span className="text-white">{player.stats.gamesWon}</span>
                  </div>
                </div>
              </CardContent>
            </UICard>
          </div>
        </div>
      </div>
    </div>
  );
}
