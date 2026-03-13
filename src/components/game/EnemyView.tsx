import { motion, AnimatePresence } from 'framer-motion';
import { enemyAnimations, enemyHitParticles } from '../battle/animations/enemyAnimations';
import type { Enemy } from '@/game/types';

interface EnemyViewProps {
  enemy: Enemy;
  isHit: boolean;
  onHitAnimationComplete: () => void;
}

// 敌人受击粒子
function HitParticle({
  color,
  size,
  delay,
}: {
  color: string;
  size: number;
  delay: number;
}) {
  const angle = Math.random() * 360;
  const distance = 30 + Math.random() * 60;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 0.4 + Math.random() * 0.2,
        delay,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
  );
}

function HitParticles() {
  const particles = Array.from({ length: enemyHitParticles.count }).map((_, i) => ({
    color: enemyHitParticles.colors[Math.floor(Math.random() * enemyHitParticles.colors.length)],
    size:
      enemyHitParticles.size.min +
      Math.random() * (enemyHitParticles.size.max - enemyHitParticles.size.min),
    delay: i * 0.02,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p, i) => (
        <HitParticle key={i} {...p} />
      ))}
    </div>
  );
}

// 涂鸦风格敌人 SVG
function EnemySprite({ name }: { name: string }) {
  const isSlime = name.includes('史莱姆') || name.toLowerCase().includes('slime');
  const primaryColor = isSlime ? '#111' : '#1a1a1a';
  const strokeColor = isSlime ? '#e0ddd5' : '#dc2626';

  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40">
      <g filter="url(#sketchy-line)">
        {isSlime ? (
          // 史莱姆：扭曲的液态团块，带有很多眼睛
          <>
            <path d="M20 70 Q 10 50 30 30 Q 50 10 70 30 Q 90 50 80 70 Q 90 90 50 90 Q 10 90 20 70 Z" fill={primaryColor} stroke={strokeColor} strokeWidth="3" />
            <path d="M30 80 Q 50 95 70 80" stroke={strokeColor} strokeWidth="2" fill="none" />
            
            {/* 眼睛堆 */}
            <circle cx="40" cy="45" r="8" fill="#e0ddd5" stroke="#111" strokeWidth="2" />
            <circle cx="40" cy="45" r="2" fill="#111" />
            
            <circle cx="65" cy="50" r="10" fill="#e0ddd5" stroke="#111" strokeWidth="2" />
            <circle cx="65" cy="50" r="3" fill="#111" />
            
            <circle cx="50" cy="30" r="6" fill="#e0ddd5" stroke="#111" strokeWidth="2" />
            <circle cx="50" cy="30" r="1.5" fill="#111" />
            
            <circle cx="30" cy="60" r="5" fill="#e0ddd5" stroke="#111" strokeWidth="2" />
            <circle cx="30" cy="60" r="1" fill="#111" />
          </>
        ) : (
          // 哥布林/其他：尖锐、危险的阴影生物
          <>
            <path d="M30 80 L 20 50 L 40 30 L 50 10 L 60 30 L 80 50 L 70 80 Z" fill={primaryColor} stroke={strokeColor} strokeWidth="3" />
            <path d="M20 50 L 10 40 M 80 50 L 90 40 M 40 30 L 30 20 M 60 30 L 70 20" stroke={strokeColor} strokeWidth="2" />
            
            {/* 巨大的单眼 */}
            <path d="M35 45 Q 50 35 65 45 Q 50 55 35 45 Z" fill="#e0ddd5" stroke="#111" strokeWidth="2" />
            <circle cx="50" cy="45" r="4" fill="#dc2626" />
            <path d="M50 41 L 50 49" stroke="#111" strokeWidth="2" />
            
            {/* 锯齿状嘴巴 */}
            <path d="M40 65 L 45 60 L 50 65 L 55 60 L 60 65" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        )}
        
        {/* 身体排线阴影 */}
        <path d="M30 70 L 40 85 M 40 70 L 50 85 M 50 70 L 60 85 M 60 70 L 70 85" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  );
}

export function EnemyView({ enemy, isHit, onHitAnimationComplete }: EnemyViewProps) {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className="relative flex flex-col items-center">
      {/* 敌人名称 */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-[#dc2626] mb-2 sketchy-border px-4 py-1 bg-[#111]"
        style={{ fontFamily: 'var(--font-sketch)' }}
      >
        {enemy.name}
      </motion.h2>

      {/* 血条容器 */}
      <div className="w-64 h-6 bg-[#111] sketchy-border mb-2 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#dc2626]"
          initial={{ width: '100%' }}
          animate={{ width: `${hpPercentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{ filter: 'url(#rough-edge)' }}
        />
        {/* 血条上的划痕 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDAgTCA0MCAwIiBzdHJva2U9IiMxMTEiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] pointer-events-none" />
      </div>

      {/* 血量数字 */}
      <div className="text-[#e0ddd5] text-xl mb-6" style={{ fontFamily: 'var(--font-sketch)' }}>
        {enemy.hp} / {enemy.maxHp} HP
      </div>

      {/* 敌人 sprite 容器 */}
      <motion.div
        className="relative"
        variants={enemyAnimations.idle}
        animate={isHit ? 'hit' : 'idle'}
        initial="idle"
      >
        <EnemySprite name={enemy.name} />

        {/* 受击粒子效果 */}
        <AnimatePresence>
          {isHit && <HitParticles />}
        </AnimatePresence>
      </motion.div>

      {/* 隐藏的动画完成触发器 */}
      <AnimatePresence>
        {isHit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={onHitAnimationComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
