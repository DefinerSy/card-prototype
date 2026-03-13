import { useGameStore } from '@/store/useGameStore';
import { CardComponent } from './CardComponent';
import { FirstPersonView } from './FirstPersonView';
import { canPlayCard } from '@/game/logic/Deck';
import type { Card, CardType } from '@/game/types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '@/audio/AudioService';

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
          <div className="w-32 h-40 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#111] sketchy-border" style={{ filter: 'url(#rough-edge)' }}></div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-6xl text-red-600 relative z-10"
              style={{ fontFamily: 'var(--font-sketch)' }}
            >
              X
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
          className="absolute w-24 h-36 bg-[#e0ddd5] sketchy-border"
          style={{ filter: 'url(#rough-edge)' }}
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
          className="absolute w-20 h-32 bg-[#111] sketchy-border"
          style={{ filter: 'url(#rough-edge)' }}
        />
      ))}
    </div>
  );
}

// 卡牌列表组件 - 使用完整卡牌外观
function CardListView({ cards }: { cards: Card[] }) {
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
    <div className="bg-[#111] sketchy-border rounded-lg p-4 max-h-96 overflow-y-auto rough-bg">
      {cards.length === 0 ? (
        <p className="text-gray-500 text-xl text-center" style={{ fontFamily: 'var(--font-sketch)' }}>Empty</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {cards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`
                relative w-24 h-36 p-2
                bg-[#e0ddd5] text-[#1a1a1a]
                rough-bg sketchy-border
              `}
              style={{
                transform: `rotate(${(idx % 5) * 3 - 6}deg)`,
              }}
            >
              {/* 背景涂鸦污渍 */}
              <div className={`absolute inset-0 ${typeBgColors[card.type]} opacity-50 mix-blend-multiply`} style={{ filter: 'url(#rough-edge)' }}></div>

              {/* 费用 */}
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#111] text-[#e0ddd5] flex items-center justify-center text-sm font-bold sketchy-border z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
                {card.cost}
              </div>

              {/* 卡牌名称 */}
              <div className="text-sm font-bold text-center mb-1 leading-tight relative z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
                {card.name}
              </div>

              {/* 类型标签 */}
              <div className={`text-xs font-bold text-center mb-2 ${typeColors[card.type]} relative z-10`} style={{ fontFamily: 'var(--font-sketch)' }}>
                <span className="inline-block px-1 bg-[#111] text-current sketchy-border transform -rotate-2">
                  {typeLabels[card.type]}
                </span>
              </div>

              {/* 卡牌描述 */}
              <div className="text-xs text-center leading-tight relative z-10 mt-1" style={{ fontFamily: 'var(--font-handwriting)', fontWeight: 'bold' }}>
                {card.description}
              </div>

              {/* 稀有度标记 */}
              <div className="absolute bottom-1 right-1 text-sm font-bold z-10" style={{ fontFamily: 'var(--font-sketch)' }}>
                {card.rarity === 'legendary' && <span className="text-yellow-600">★</span>}
                {card.rarity === 'rare' && <span className="text-purple-600">♦</span>}
                {card.rarity === 'common' && <span className="text-gray-600">●</span>}
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

  // 第一人称视角动画状态
  const [currentAction, setCurrentAction] = useState<CardType | 'idle'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingCardIndex, setPendingCardIndex] = useState<number | null>(null);

  const handRef = useRef<HTMLDivElement>(null);
  const discardRef = useRef<HTMLDivElement>(null);
  const burnRef = useRef<HTMLDivElement>(null);
  const drawPileRef = useRef<HTMLDivElement>(null);

  // 记录上一次的手牌、弃牌区和燃烧区数量，用于触发动画
  const prevHandCount = useRef<number>(gameState?.hand.length || 0);
  const prevDiscardCount = useRef<number>(gameState?.discardPile.length || 0);
  const prevBurnCount = useRef<number>(gameState?.burnPile.length || 0);

  // 检查是否所有手牌都无法使用（费用不足）
  const checkGameOver = useCallback(() => {
    // 获取最新的状态，避免闭包陷阱
    const currentState = useGameStore.getState().gameState;
    if (!currentState || currentState.isGameOver) return;

    const hasPlayableCards = currentState.hand.some(card => {
      return currentState.hand.length - 1 >= card.cost;
    });

    if (!hasPlayableCards && currentState.enemy.hp > 0) {
      // 触发失败
      useGameStore.getState().endTurn();
    }
  }, []);

  // 动画完成后的回调 - 执行实际的卡牌效果
  const handleAnimationComplete = useCallback(() => {
    if (pendingCardIndex !== null) {
      // 动画完成后执行实际的卡牌效果
      const card = gameState?.hand[pendingCardIndex];
      if (card && gameState) {
        playCard(pendingCardIndex);
      }
      setPendingCardIndex(null);
      setIsAnimating(false);
      
      // 延迟一小段时间再切换回 idle，确保状态更新完成
      setTimeout(() => {
        setCurrentAction('idle');
        checkGameOver();
      }, 50);
    }
  }, [pendingCardIndex, gameState, playCard, checkGameOver]);

  // 开始动画 - 当玩家点击卡牌时
  const startCardAnimation = useCallback((index: number) => {
    const card = gameState?.hand[index];
    if (!card) return;

    // 检查是否可以打出该卡牌
    if (!canPlayCard(card, gameState)) {
      setMessage('费用不足！');
      setTimeout(() => setMessage(''), 1500);
      return;
    }

    // 播放打牌音效
    audioService.playSFX('card-play');
    if (card.type === 'damage') audioService.playSFX('slash');
    else if (card.type === 'fuel') audioService.playSFX('charge');
    else if (card.type === 'cycle' || card.type === 'buffer') audioService.playSFX('magic');

    // 设置动画类型
    setCurrentAction(card.type as CardType);
    setIsAnimating(true);
    setPendingCardIndex(index);
  }, [gameState]);

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

    // 开始第一人称视角动画
    startCardAnimation(index);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 overflow-hidden flex flex-col relative">
      {/* 涂鸦背景纹理 */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="board-hatch" width="100" height="100" patternTransform="rotate(-15 0 0)" patternUnits="userSpaceOnUse">
            <path d="M0 0 L0 100 M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100" stroke="#e0ddd5" strokeWidth="0.5" filter="url(#sketchy-line)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#board-hatch)" />
      </svg>

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col relative z-10">
        {/* 顶部：第一人称视角战斗场景 */}
        <div className="relative flex-1 min-h-[40vh] md:min-h-[50vh] sketchy-border overflow-hidden rounded-lg mb-4">
          <FirstPersonView
            gameState={gameState}
            currentAction={currentAction}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
          />
        </div>

        {/* 中部：区域信息 + 查看按钮 */}
        <div className="flex justify-center gap-2 md:gap-4 py-2 z-20" style={{ fontFamily: 'var(--font-sketch)' }}>
          <div ref={drawPileRef}>
            <button
              onClick={() => setViewMode(viewMode === 'drawPile' ? 'none' : 'drawPile')}
              className="text-center px-2 md:px-4 py-1 md:py-2 bg-[#e0ddd5] text-[#111] sketchy-border hover:bg-[#d0cdb5] transition transform hover:-rotate-2"
            >
              <div className="text-[10px] md:text-xs font-bold">DECK</div>
              <div className="text-xl md:text-2xl font-bold">{gameState.drawPile.length}</div>
            </button>
          </div>
          <div ref={discardRef}>
            <button
              onClick={() => setViewMode(viewMode === 'discardPile' ? 'none' : 'discardPile')}
              className="text-center px-2 md:px-4 py-1 md:py-2 bg-[#e0ddd5] text-yellow-700 sketchy-border hover:bg-[#d0cdb5] transition transform hover:rotate-2"
            >
              <div className="text-[10px] md:text-xs font-bold text-[#111]">DISCARD</div>
              <div className="text-xl md:text-2xl font-bold">{gameState.discardPile.length}</div>
            </button>
          </div>
          <div ref={burnRef}>
            <button
              onClick={() => setViewMode(viewMode === 'burnPile' ? 'none' : 'burnPile')}
              className="text-center px-2 md:px-4 py-1 md:py-2 bg-[#e0ddd5] text-red-600 sketchy-border hover:bg-[#d0cdb5] transition transform hover:-rotate-1"
            >
              <div className="text-[10px] md:text-xs font-bold text-[#111]">BURN</div>
              <div className="text-xl md:text-2xl font-bold">{gameState.burnPile.length}</div>
            </button>
          </div>
          <div className="text-center px-2 md:px-4 py-1 md:py-2 bg-[#111] text-[#e0ddd5] sketchy-border transform rotate-1">
            <div className="text-[10px] md:text-xs font-bold">HAND</div>
            <div className="text-xl md:text-2xl font-bold text-blue-400">{gameState.hand.length}</div>
          </div>
        </div>

        {/* 区域查看窗口 */}
        {viewMode !== 'none' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewMode('none')}>
            <div className="bg-[#e0ddd5] p-6 max-w-4xl w-full sketchy-border rough-bg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b-4 border-[#111] pb-2">
                <h2 className="text-3xl font-bold text-[#111]" style={{ fontFamily: 'var(--font-sketch)' }}>
                  {viewMode === 'drawPile' && `DECK (${gameState.drawPile.length})`}
                  {viewMode === 'discardPile' && `DISCARD (${gameState.discardPile.length})`}
                  {viewMode === 'burnPile' && `BURN (${gameState.burnPile.length})`}
                </h2>
                <button
                  onClick={() => setViewMode('none')}
                  className="text-[#111] hover:text-red-600 text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-sketch)' }}
                >
                  X
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
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
          </div>
        )}

        {/* 底部：手牌区域 */}
        <div ref={handRef} className="flex-none h-48 md:h-56 flex items-end justify-center pb-2 md:pb-4 relative z-30">
          <AnimatePresence>
            <div className="flex gap-1 md:gap-2 items-end justify-center w-full max-w-5xl overflow-visible px-2 md:px-4 pb-4 md:pb-8 pt-8 md:pt-12 scale-90 md:scale-100 origin-bottom">
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
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] text-red-500 px-8 py-4 text-3xl font-bold sketchy-border z-50 transform -rotate-3" style={{ fontFamily: 'var(--font-sketch)' }}>
            {message}
          </div>
        )}

        {/* 游戏结束覆盖层 */}
        {gameState.isGameOver && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className={`text-center p-12 sketchy-border rough-bg ${
                gameState.isVictory
                  ? 'bg-[#e0ddd5] text-[#111]'
                  : 'bg-[#111] text-red-600'
              }`}
            >
              <h2 className="text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-sketch)' }}>
                {gameState.isVictory ? 'VICTORY!' : 'DEFEATED'}
              </h2>
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-handwriting)' }}>
                {gameState.isVictory
                  ? 'THE DUNGEON IS CLEARED.'
                  : 'YOUR JOURNEY ENDS HERE...'}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
