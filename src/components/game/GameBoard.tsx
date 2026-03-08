import { useGameStore } from '@/store/useGameStore';
import { CardComponent } from './CardComponent';
import { canPlayCard } from '@/game/logic/Deck';
import type { Card } from '@/game/types';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameBoardProps {
  onGameEnd: (victory: boolean) => void;
}

type ViewMode = 'none' | 'drawPile' | 'discardPile' | 'burnPile';

// 燃烧效果组件
function BurnEffect({ cards, onComplete }: { cards: Card[]; onComplete: () => void }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {cards.map((card, idx) => (
        <motion.div
          key={`burn-${card.id}-${idx}`}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5, y: -50 }}
          transition={{ duration: 0.8, delay: idx * 0.1 }}
          onAnimationComplete={idx === cards.length - 1 ? onComplete : undefined}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-32 h-40 rounded-lg border-2 border-orange-500 bg-gradient-to-br from-orange-600/80 to-red-700/80 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-4xl"
            >
              🔥
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// 抽牌动画组件
function DrawCardEffect({ count, onComplete }: { count: number; onComplete: () => void }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div
          key={`draw-${idx}`}
          initial={{ x: -300, y: -50, opacity: 0, rotate: -10 }}
          animate={{
            x: idx * 5,
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: [0.8, 1.1, 1]
          }}
          transition={{
            duration: 0.6,
            delay: idx * 0.15,
            scale: { duration: 0.3, times: [0, 0.7, 1] }
          }}
          onAnimationComplete={idx === count - 1 ? onComplete : undefined}
          className="absolute w-24 h-36 rounded-lg border-2 border-blue-400 bg-gradient-to-br from-blue-900/80 to-blue-700/80"
        />
      ))}
    </div>
  );
}

// 牌库到弃牌区动画组件
function DrawToDiscardEffect({ count, onComplete }: { count: number; onComplete: () => void }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div
          key={`discard-${idx}`}
          initial={{ x: -300, y: -50, opacity: 1 }}
          animate={{
            x: 0,
            y: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.5,
            delay: idx * 0.1
          }}
          onAnimationComplete={idx === count - 1 ? onComplete : undefined}
          className="absolute w-20 h-32 rounded-lg border-2 border-yellow-600 bg-gradient-to-br from-yellow-900/60 to-yellow-700/60"
        />
      ))}
    </div>
  );
}

// 卡牌列表组件 - 使用完整卡牌外观
function CardListView({ cards }: { cards: Card[] }) {
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
    <div className="bg-gray-800/90 rounded-lg p-4 max-h-96 overflow-y-auto">
      {cards.length === 0 ? (
        <p className="text-gray-500 text-sm">空</p>
      ) : (
        <div className="flex flex-wrap gap-3 justify-center">
          {cards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`
                relative w-24 h-36 rounded-lg border-2 p-2
                bg-gradient-to-br ${typeColors[card.type as keyof typeof typeColors]}
              `}
            >
              {/* 费用 */}
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-400 flex items-center justify-center text-xs font-bold text-white">
                {card.cost}
              </div>

              {/* 卡牌名称 */}
              <div className="text-xs font-bold text-white text-center mb-1 truncate">
                {card.name}
              </div>

              {/* 类型标签 */}
              <div className="text-xs text-gray-300 text-center mb-2">
                {typeLabels[card.type as keyof typeof typeLabels]}
              </div>

              {/* 卡牌描述 */}
              <div className="text-xs text-gray-200 text-center leading-tight">
                {card.description}
              </div>

              {/* 稀有度标记 */}
              <div className="absolute bottom-1 right-1">
                {card.rarity === 'legendary' && <span className="text-yellow-400">◆</span>}
                {card.rarity === 'rare' && <span className="text-purple-400">◇</span>}
                {card.rarity === 'common' && <span className="text-gray-400">○</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GameBoard({ onGameEnd }: GameBoardProps) {
  const { gameState, playCard } = useGameStore();
  const [message, setMessage] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('none');
  const [burnAnimation, setBurnAnimation] = useState<Card[] | null>(null);
  const [drawAnimation, setDrawAnimation] = useState<number>(0);
  const [moveToDiscardAnimation, setMoveToDiscardAnimation] = useState<number>(0);
  const handRef = useRef<HTMLDivElement>(null);
  const discardRef = useRef<HTMLDivElement>(null);
  const burnRef = useRef<HTMLDivElement>(null);
  const drawPileRef = useRef<HTMLDivElement>(null);

  // 记录上一次的手牌、弃牌区和燃烧区数量，用于触发动画
  const prevHandCount = useRef<number>(gameState?.hand.length || 0);
  const prevDiscardCount = useRef<number>(gameState?.discardPile.length || 0);
  const prevBurnCount = useRef<number>(gameState?.burnPile.length || 0);

  useEffect(() => {
    if (!gameState) return;

    const handDiff = gameState.hand.length - prevHandCount.current;
    const discardDiff = gameState.discardPile.length - prevDiscardCount.current;
    const burnDiff = gameState.burnPile.length - prevBurnCount.current;

    // 检测燃烧动画（燃烧区增加）
    if (burnDiff > 0) {
      const burnedCards = gameState.burnPile.slice(-burnDiff);
      setBurnAnimation(burnedCards);
    }

    // 检测从牌库到弃牌区的动画（弃牌区增加且燃烧区没有增加）
    if (discardDiff > 0 && burnDiff === 0) {
      setMoveToDiscardAnimation(discardDiff);
    }

    // 检测抽牌动画（手牌增加）
    // 注意：onBurn 触发的抽牌会在燃烧动画之后，所以手牌增加可能是抽牌效果
    if (handDiff > 0) {
      setDrawAnimation(handDiff);
    }

    prevHandCount.current = gameState.hand.length;
    prevDiscardCount.current = gameState.discardPile.length;
    prevBurnCount.current = gameState.burnPile.length;
  }, [gameState?.hand.length, gameState?.discardPile.length, gameState?.burnPile.length]);

  useEffect(() => {
    if (gameState?.isGameOver) {
      const timer = setTimeout(() => {
        onGameEnd(gameState.isVictory);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState?.isGameOver, onGameEnd]);

  if (!gameState) {
    return null;
  }

  const handlePlayCard = (index: number) => {
    const card = gameState.hand[index];
    if (!card) return;

    const result = playCard(index);
    if (!result.success && result.message) {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        {/* 顶部：敌人区域 */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-900/30 border-2 border-red-500 rounded-xl p-6 min-w-64"
            >
              <h2 className="text-2xl font-bold text-red-400 mb-2">{gameState.enemy.name}</h2>
              <div className="w-64 h-6 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(gameState.enemy.hp / gameState.enemy.maxHp) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
              <div className="mt-2 text-white font-semibold">
                {gameState.enemy.hp} / {gameState.enemy.maxHp} HP
              </div>
            </motion.div>
          </div>
        </div>

        {/* 中部：区域信息 + 查看按钮 */}
        <div className="flex justify-center gap-4 py-4">
          <div ref={drawPileRef}>
            <button
              onClick={() => setViewMode(viewMode === 'drawPile' ? 'none' : 'drawPile')}
              className="text-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              <div className="text-xs text-gray-400">牌库</div>
              <div className="text-2xl font-bold text-white">{gameState.drawPile.length}</div>
              <div className="text-xs text-gray-500">点击查看</div>
            </button>
          </div>
          <div ref={discardRef}>
            <button
              onClick={() => setViewMode(viewMode === 'discardPile' ? 'none' : 'discardPile')}
              className="text-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              <div className="text-xs text-gray-400">弃牌区</div>
              <div className="text-2xl font-bold text-yellow-400">{gameState.discardPile.length}</div>
              <div className="text-xs text-gray-500">点击查看</div>
            </button>
          </div>
          <div ref={burnRef}>
            <button
              onClick={() => setViewMode(viewMode === 'burnPile' ? 'none' : 'burnPile')}
              className="text-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              <div className="text-xs text-gray-400">燃烧区</div>
              <div className="text-2xl font-bold text-red-400">{gameState.burnPile.length}</div>
              <div className="text-xs text-gray-500">点击查看</div>
            </button>
          </div>
          <div className="text-center px-4 py-2">
            <div className="text-xs text-gray-400">手牌</div>
            <div className="text-2xl font-bold text-blue-400">{gameState.hand.length}</div>
          </div>
        </div>

        {/* 区域查看窗口 */}
        {viewMode !== 'none' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewMode('none')}>
            <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {viewMode === 'drawPile' && `牌库 (${gameState.drawPile.length}张)`}
                  {viewMode === 'discardPile' && `弃牌区 (${gameState.discardPile.length}张)`}
                  {viewMode === 'burnPile' && `燃烧区 (${gameState.burnPile.length}张)`}
                </h2>
                <button
                  onClick={() => setViewMode('none')}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              {viewMode === 'drawPile' && (
                <CardListView cards={gameState.drawPile} />
              )}
              {viewMode === 'discardPile' && (
                <CardListView cards={gameState.discardPile} />
              )}
              {viewMode === 'burnPile' && (
                <CardListView cards={gameState.burnPile} />
              )}
            </div>
          </div>
        )}

        {/* 底部：手牌区域 */}
        <div ref={handRef} className="flex-1 flex items-end justify-center pb-8 relative">
          <AnimatePresence>
            <div className="flex gap-2 items-center">
              {gameState.hand.map((card, index) => (
                <CardComponent
                  key={`${card.id}-${index}`}
                  card={card}
                  index={index}
                  canPlay={canPlayCard(card, gameState)}
                  onPlay={handlePlayCard}
                />
              ))}
            </div>
          </AnimatePresence>

          {/* 抽牌动画 */}
          <AnimatePresence>
            {drawAnimation > 0 && (
              <DrawCardEffect
                count={drawAnimation}
                onComplete={() => setDrawAnimation(0)}
              />
            )}
          </AnimatePresence>

          {/* 燃烧动画 */}
          <AnimatePresence>
            {burnAnimation && (
              <BurnEffect
                cards={burnAnimation}
                onComplete={() => setBurnAnimation(null)}
              />
            )}
          </AnimatePresence>

          {/* 从牌库到弃牌区动画 */}
          <AnimatePresence>
            {moveToDiscardAnimation > 0 && (
              <DrawToDiscardEffect
                count={moveToDiscardAnimation}
                onComplete={() => setMoveToDiscardAnimation(0)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg">
            {message}
          </div>
        )}

        {/* 游戏结束覆盖层 */}
        {gameState.isGameOver && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-center p-8 rounded-xl ${
                gameState.isVictory
                  ? 'bg-green-900/80 border-2 border-green-500'
                  : 'bg-red-900/80 border-2 border-red-500'
              }`}
            >
              <h2 className="text-4xl font-bold mb-4">
                {gameState.isVictory ? '胜利！' : '失败'}
              </h2>
              <p className="text-gray-300">
                {gameState.isVictory
                  ? '你成功击败了敌人！'
                  : '未能在本回合击败敌人...'}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
