import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { LeftHand } from '../battle/hands/LeftHand';
import { RightHand } from '../battle/hands/RightHand';
import { handAnimations, particleEffects } from '../battle/animations/handAnimations';
import type { CardType } from '@/game/types';

interface HandsProps {
  action: CardType | 'idle';
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

// 粒子组件
function Particle({
  color,
  size,
  delay,
  startX,
  startY,
  endX,
  endY,
  duration,
}: {
  color: string;
  size: number;
  delay: number;
  startX: string | number;
  startY: string | number;
  endX: number;
  endY: number;
  duration: number;
}) {
  return (
    <motion.div
      initial={{ left: startX, top: startY, opacity: 1, scale: 1 }}
      animate={{
        x: endX,
        y: endY,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        boxShadow: `0 0 ${size}px ${color}`,
        filter: 'url(#rough-edge)',
      }}
    />
  );
}

// 粒子效果组件
function ParticleEffect({ type }: { type: CardType }) {
  const config = particleEffects[type as keyof typeof particleEffects];
  if (!config) return null;

  const particles = Array.from({ length: config.count }).map((_, i) => {
    // 墨水飞溅风格颜色
    const color = type === 'damage' ? '#dc2626' : 
                 type === 'fuel' ? '#d97706' : 
                 type === 'cycle' ? '#2563eb' : '#16a34a';
                 
    const size = config.size.min + Math.random() * (config.size.max - config.size.min);
    const velocity = config.velocity.min + Math.random() * (config.velocity.max - config.velocity.min);
    
    let startX: string | number = '50%';
    let startY: string | number = '70%';
    let endX = 0;
    let endY = 0;
    let delay = i * 0.01;
    let duration = 0.5 + Math.random() * 0.3;

    // @ts-ignore - shape property exists in our updated config
    const shape = config.shape || 'burst';

    if (shape === 'slash') {
      // 扇形剑气，从右下向左上
      const angle = -135 + (Math.random() - 0.5) * 60; // -105 to -165 degrees
      endX = Math.cos((angle * Math.PI) / 180) * velocity;
      endY = Math.sin((angle * Math.PI) / 180) * velocity;
      startX = `calc(50% + ${50 + (Math.random() - 0.5) * 100}px)`;
      startY = `calc(70% + ${(Math.random() - 0.5) * 100}px)`;
      delay = Math.random() * 0.15;
    } else if (shape === 'upward') {
      // 向上升腾
      const angle = -90 + (Math.random() - 0.5) * 40;
      endX = Math.cos((angle * Math.PI) / 180) * velocity;
      endY = Math.sin((angle * Math.PI) / 180) * velocity;
      startX = `calc(50% + ${(Math.random() - 0.5) * 150}px)`;
      startY = `calc(80% + ${(Math.random() - 0.5) * 50}px)`;
      duration = 0.8 + Math.random() * 0.4;
    } else if (shape === 'burst') {
      // 快速爆发
      const angle = Math.random() * 360;
      endX = Math.cos((angle * Math.PI) / 180) * velocity;
      endY = Math.sin((angle * Math.PI) / 180) * velocity;
      startX = `calc(50% + ${(Math.random() - 0.5) * 50}px)`;
      startY = `calc(60% + ${(Math.random() - 0.5) * 50}px)`;
      duration = 0.4 + Math.random() * 0.2;
    } else if (shape === 'spiral') {
      // 环绕/发散
      const angle = (i / config.count) * 360 + Math.random() * 20;
      endX = Math.cos((angle * Math.PI) / 180) * velocity;
      endY = Math.sin((angle * Math.PI) / 180) * velocity;
      startX = '50%';
      startY = '60%';
      delay = (i / config.count) * 0.4;
      duration = 0.6 + Math.random() * 0.3;
    }

    return { color, size, delay, startX, startY, endX, endY, duration };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </div>
  );
}

export function Hands({ action, isAnimating, onAnimationComplete }: HandsProps) {
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (action === 'idle') {
      // 播放待机呼吸动画
      leftControls.start({ x: 0, y: [0, -8, 0], rotate: 0, scaleX: 1, scaleY: 1, transition: { duration: 3.2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut", delay: 0.2 } });
      rightControls.start({ x: 0, y: [0, -10, 0], rotate: 0, scaleX: 1, scaleY: 1, transition: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" } });
      setShowParticles(false);
      return;
    }

    const config = handAnimations[action as CardType];
    if (!config) return;

    // 播放动画
    const playAnimation = async () => {
      // 停止当前的待机动画
      leftControls.stop();
      rightControls.stop();

      // 重置到初始状态 (瞬间完成)
      leftControls.set({ x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 });
      rightControls.set({ x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 });

      if (!isMounted) return;

      // 显示粒子
      setShowParticles(true);

      // 播放动作动画
      await Promise.all([
        leftControls.start('action', {
          duration: config.duration,
          ease: 'easeInOut',
        }),
        rightControls.start('action', {
          duration: config.duration,
          ease: 'easeInOut',
        }),
      ]);

      if (!isMounted) return;

      // 动作完成后，平滑地回到初始位置
      await Promise.all([
        leftControls.start({ x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, transition: { duration: 0.15, ease: "easeOut" } }),
        rightControls.start({ x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, transition: { duration: 0.15, ease: "easeOut" } })
      ]);

      if (!isMounted) return;

      // 动画完成
      setShowParticles(false);
      onAnimationComplete();
    };

    playAnimation();

    return () => {
      isMounted = false;
    };
  }, [action, leftControls, rightControls, onAnimationComplete]);

  const config = action !== 'idle' ? handAnimations[action] : null;

  return (
    <>
      {/* 左手 */}
      <LeftHand
        variants={config?.leftHand}
        animate={leftControls}
        className={action === 'idle' ? 'opacity-80' : 'opacity-100'}
      />

      {/* 右手 */}
      <RightHand
        variants={config?.rightHand}
        animate={rightControls}
        className={action === 'idle' ? 'opacity-80' : 'opacity-100'}
      />

      {/* 粒子效果 */}
      {showParticles && action && action !== 'idle' && (
        <ParticleEffect type={action as CardType} />
      )}
    </>
  );
}
