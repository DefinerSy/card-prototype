import { Button } from '@/components/ui/Button';
import { Card as UICard, CardHeader, CardContent } from '@/components/ui/Card';
import { usePlayerStore } from '@/store/usePlayerStore';
import { allCards } from '@/game/cards';
import type { Card as CardType } from '@/game/types';
import { enemies } from '@/game/data/enemies';
import { useGameStore } from '@/store/useGameStore';
import { useState } from 'react';

interface LobbyProps {
  onStartGame: () => void;
  onResetData: () => void;
}

export function Lobby({ onStartGame, onResetData }: LobbyProps) {
  const player = usePlayerStore((state) => state.player);
  const { addToDeck, removeFromDeck } = usePlayerStore();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题和资源显示 */}
        <div className="flex justify-between items-center mb-8">
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
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'deck' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('deck')}
          >
            卡组构筑 ({player.deck.length}/30)
          </Button>
          <Button
            variant={activeTab === 'cards' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('cards')}
          >
            我的收藏
          </Button>
          <Button
            variant={activeTab === 'shop' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('shop')}
          >
            卡牌商店
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* 左侧：卡组/卡牌列表 */}
          <div className="col-span-2">
            <UICard>
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {activeTab === 'deck' && `当前卡组 (${player.deck.length} 张)`}
                  {activeTab === 'cards' && `已解锁卡牌 (${collectedCardsUnique.length} 种，可无限复制)`}
                  {activeTab === 'shop' && `可解锁卡牌 (${lockedCards.length} 张)`}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                  {activeTab === 'deck' &&
                    deckCards.map((card, idx) => (
                      <div
                        key={`${card.id}-${idx}`}
                        className="relative bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition"
                        onClick={() => removeFromDeck(card.id, idx)}
                      >
                        <div
                          className={`text-xs font-semibold ${
                            card.type === 'damage'
                              ? 'text-red-400'
                              : card.type === 'fuel'
                              ? 'text-yellow-400'
                              : card.type === 'cycle'
                              ? 'text-blue-400'
                              : 'text-green-400'
                          }`}
                        >
                          {card.name}
                        </div>
                        <div className="text-xs text-gray-400">费用：{card.cost}</div>
                      </div>
                    ))}

                  {activeTab === 'cards' &&
                    collectedCardsUnique.map((card, idx) => (
                      <div
                        key={`${card.id}-${idx}`}
                        className="relative bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition"
                        onClick={() => addToDeck(card.id)}
                      >
                        <div
                          className={`text-xs font-semibold ${
                            card.type === 'damage'
                              ? 'text-red-400'
                              : card.type === 'fuel'
                              ? 'text-yellow-400'
                              : card.type === 'cycle'
                              ? 'text-blue-400'
                              : 'text-green-400'
                          }`}
                        >
                          {card.name}
                        </div>
                        <div className="text-xs text-gray-400">费用：{card.cost}</div>
                        <div className="text-xs text-gray-500 mt-1">点击复制加入卡组</div>
                      </div>
                    ))}

                  {activeTab === 'shop' &&
                    lockedCards.map((card) => (
                      <div
                        key={card.id}
                        className="relative bg-gray-800 rounded-lg p-2 border border-gray-600 opacity-60"
                      >
                        <div className="text-xs font-semibold text-gray-500">{card.name}</div>
                        <div className="text-xs text-gray-600">费用：{card.cost}</div>
                        <div className="text-xs text-red-400 mt-1">未解锁</div>
                      </div>
                    ))}

                  {activeTab === 'deck' && player.deck.length === 0 && (
                    <div className="col-span-4 text-center text-gray-400 py-8">
                      卡组为空，从"我的收藏"中添加卡牌
                    </div>
                  )}
                </div>
              </CardContent>
            </UICard>
          </div>

          {/* 右侧：信息和操作 */}
          <div className="space-y-4">
            {/* 敌人选择 */}
            <UICard>
              <CardHeader>
                <h2 className="text-lg font-semibold">选择敌人</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {enemies.map((enemy, index) => (
                    <div
                      key={enemy.id}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedEnemy === index
                          ? 'bg-red-900/30 border border-red-500'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedEnemy(index)}
                    >
                      <div className="font-semibold text-white">{enemy.name}</div>
                      <div className="text-sm text-gray-400">生命值：{enemy.hp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </UICard>

            {/* 开始游戏按钮 */}
            <UICard>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    卡组：{player.deck.length} 张牌
                  </div>
                  <div className="text-sm text-gray-400">
                    提示：至少需要 10 张牌才能开始游戏
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-4"
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
              <CardHeader>
                <h2 className="text-lg font-semibold">统计</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
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
