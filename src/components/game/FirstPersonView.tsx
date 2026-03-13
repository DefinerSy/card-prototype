import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hands } from './Hands';
import { EnemyView } from './EnemyView';
import type { GameState, CardType } from '@/game/types';

interface FirstPersonViewProps {
  gameState: GameState;
  currentAction: CardType | 'idle';
  isAnimating: boolean;
  onAnimationStart: (cardType: CardType) => void;
  onAnimationComplete: () => void;
}

// 背景场景组件
function BattleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      {/* 强烈的四周暗角 (Vignette) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-0" />
      
      {/* 顶部深邃阴影 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000] via-transparent to-transparent opacity-80" />

      {/* 涂鸦排线纹理 (模拟地牢墙壁的划痕) */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hatch" width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <path d="M0 0 L0 40 M10 0 L10 40 M20 0 L20 40 M30 0 L30 40" stroke="#fff" strokeWidth="1" filter="url(#sketchy-line)" />
          </pattern>
          <pattern id="hatch-cross" width="60" height="60" patternTransform="rotate(-30 0 0)" patternUnits="userSpaceOnUse">
            <path d="M0 0 L0 60 M15 0 L15 60 M30 0 L30 60 M45 0 L45 60" stroke="#fff" strokeWidth="0.5" filter="url(#sketchy-line)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hatch)" />
        <rect width="100%" height="100%" fill="url(#hatch-cross)" opacity="0.5" />
      </svg>

      {/* 漂浮的灰尘/孢子 */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#e0ddd5] rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0.1 + Math.random() * 0.2,
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              x: [null, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'url(#rough-edge)',
            }}
          />
        ))}
      </div>

      {/* 地面效果 (粗糙的黑色剪影) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#050505]" style={{ filter: 'url(#rough-edge)', transform: 'translateY(10px)' }} />
    </div>
  );
}

export function FirstPersonView({
  gameState,
  currentAction,
  isAnimating,
  onAnimationStart,
  onAnimationComplete,
}: FirstPersonViewProps) {
  const [isHit, setIsHit] = useState(false);
  const [showScreenShake, setShowScreenShake] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');

  // 处理动画完成
  const handleAnimationComplete = useCallback(() => {
    if (currentAction !== 'idle') {
      // 根据卡牌类型设置不同的震动强度
      let intensity: 'light' | 'medium' | 'heavy' = 'light';
      if (currentAction === 'damage') {
        intensity = 'heavy';
        setIsHit(true);
      } else if (currentAction === 'fuel' || currentAction === 'buffer') {
        intensity = 'medium';
      } else if (currentAction === 'cycle') {
        intensity = 'light';
      }

      setShakeIntensity(intensity);
      setShowScreenShake(true);

      // 延迟触发屏幕震动结束
      setTimeout(() => {
        setShowScreenShake(false);
      }, 300);
    }
    onAnimationComplete();
  }, [currentAction, onAnimationComplete]);

  // 处理敌人受击动画完成
  const handleHitAnimationComplete = useCallback(() => {
    setIsHit(false);
  }, []);

  const shakeValues = {
    light: [0, -2, 2, -2, 2, 0],
    medium: [0, -5, 5, -5, 5, 0],
    heavy: [0, -10, 10, -10, 10, 0],
  };

  return (
    <motion.div 
      className="relative w-full h-full min-h-[60vh] md:min-h-[70vh]"
      animate={showScreenShake ? { x: shakeValues[shakeIntensity], y: shakeValues[shakeIntensity].map(v => v * 0.5) } : { x: 0, y: 0 }}
      transition={{ duration: 0.3, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
    >
      {/* 背景 */}
      <BattleBackground />

      {/* 敌人区域 */}
      <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
        <EnemyView
          enemy={gameState.enemy}
          isHit={isHit}
          onHitAnimationComplete={handleHitAnimationComplete}
        />
      </div>

      {/* 手部区域 */}
      <div className="absolute inset-0">
        <Hands
          action={currentAction}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
        />
      </div>

      {/* 行动指示器 */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#e0ddd5] text-4xl font-bold bg-[#111] px-8 py-4 sketchy-border z-50"
            style={{ fontFamily: 'var(--font-sketch)' }}
          >
            {currentAction === 'damage' && 'ATTACK!'}
            {currentAction === 'fuel' && 'BURN!'}
            {currentAction === 'cycle' && 'DRAW!'}
            {currentAction === 'buffer' && 'BUFF!'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
