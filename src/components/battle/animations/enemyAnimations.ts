import type { Variants } from 'framer-motion';

// 敌人动画配置

export interface EnemyAnimationConfig {
  idle: Variants;
  hit: Variants;
  attack: Variants;
  death?: Variants;
}

export const enemyAnimations: EnemyAnimationConfig = {
  // 待机动画 - 轻微呼吸效果
  idle: {
    idle: {
      scale: [1, 1.02, 1],
      y: [0, -3, 0],
    },
  },

  // 受击动画 - 震动 + 闪红
  hit: {
    hit: {
      x: [0, -10, 10, -10, 10, 0],
      filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'],
      scale: [1, 0.98, 1.02, 1],
    },
  },

  // 攻击动画 - 向前冲击
  attack: {
    attack: {
      x: [0, 50, 0],
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
    },
  },

  // 死亡动画 - 倒下并消失
  death: {
    death: {
      y: [0, 50, 100],
      opacity: [1, 0.5, 0],
      rotate: [0, 15, 30],
      scale: [1, 0.8, 0.5],
    },
  },
};

// 敌人受击粒子效果
export const enemyHitParticles = {
  count: 5,
  colors: ['#ff0000', '#ff4444', '#ffffff'],
  size: { min: 3, max: 6 },
  velocity: { min: 80, max: 150 },
  spread: 360,
};

// 敌人死亡粒子效果
export const enemyDeathParticles = {
  count: 20,
  colors: ['#ff0000', '#ff4444', '#ff8888', '#666666', '#333333'],
  size: { min: 4, max: 10 },
  velocity: { min: 100, max: 250 },
  spread: 360,
  gravity: 50,
};
