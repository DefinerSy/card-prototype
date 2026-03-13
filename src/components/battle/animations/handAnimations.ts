import type { Variants } from 'framer-motion';

// 手部动画配置
// 卡牌类型：damage | fuel | cycle | buffer

export interface HandAnimationConfig {
  rightHand: Variants;
  leftHand: Variants;
  duration: number;
}

export const handAnimations: Record<'damage' | 'fuel' | 'cycle' | 'buffer', HandAnimationConfig> = {
  // ===== 伤害卡 - 挥剑劈砍动作 =====
  damage: {
    duration: 0.5,
    rightHand: {
      idle: {
        y: [0, -10, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      },
      action: {
        x: [0, 80, -150, -50],
        y: [0, -120, 50, 20],
        rotate: [0, 60, -75, -45],
        scaleX: [1, 1.1, 0.9, 1],
        scaleY: [1, 0.9, 1.2, 1],
      },
    },
    leftHand: {
      idle: {
        y: [0, -8, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
      },
      action: {
        x: [0, -60, -120, -60],
        y: [0, 30, 60, 30],
        rotate: [0, -20, -45, -20],
        scaleX: [1, 0.9, 0.8, 0.9],
        scaleY: [1, 1, 0.9, 1],
      },
    },
  },

  // ===== 费用卡 - 剑刃充能动作 =====
  fuel: {
    duration: 0.7,
    rightHand: {
      idle: {
        y: [0, -10, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      },
      action: {
        x: [0, -100, -100, -100],
        y: [0, -60, -60, -60],
        rotate: [0, -20, -20, -20],
        scaleX: [1, 1, 1.05, 1],
        scaleY: [1, 1, 0.95, 1],
      },
    },
    leftHand: {
      idle: {
        y: [0, -8, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
      },
      action: {
        x: [0, 50, 150, 50],
        y: [0, -20, -100, -20],
        rotate: [0, 30, 60, 30],
        scaleX: [1, 0.9, 1.1, 0.9],
        scaleY: [1, 1.1, 0.9, 1.1],
      },
    },
  },

  // ===== 调度卡 - 战术准备动作 =====
  cycle: {
    duration: 0.5,
    rightHand: {
      idle: {
        y: [0, -10, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      },
      action: {
        x: [0, 40, 40, 20],
        y: [0, 30, 30, 15],
        rotate: [0, 20, 20, 10],
        scaleX: [1, 0.95, 0.95, 1],
        scaleY: [1, 0.95, 0.95, 1],
      },
    },
    leftHand: {
      idle: {
        y: [0, -8, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
      },
      action: {
        x: [0, -100, -250, -150],
        y: [0, 20, 60, 40],
        rotate: [0, -15, -45, -25],
        scaleX: [1, 1, 0.85, 0.95],
        scaleY: [1, 0.9, 0.85, 0.95],
      },
    },
  },

  // ===== 效果卡 - 持剑格挡/祈祷动作 =====
  buffer: {
    duration: 0.6,
    rightHand: {
      idle: {
        y: [0, -10, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      },
      action: {
        x: [0, -120, -120, -120],
        y: [0, -80, -80, -80],
        rotate: [0, -80, -80, -80],
        scaleX: [1, 1, 1.05, 1],
        scaleY: [1, 1, 0.95, 1],
      },
    },
    leftHand: {
      idle: {
        y: [0, -8, 0],
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
      },
      action: {
        x: [0, 80, 80, 80],
        y: [0, -80, -80, -80],
        rotate: [0, 45, 45, 45],
        scaleX: [1, 1, 1.05, 1],
        scaleY: [1, 1, 0.95, 1],
      },
    },
  },
};

// 粒子效果配置
export const particleEffects = {
  damage: {
    count: 25,
    colors: ['#ff4444', '#ff6666', '#ff8888', '#ffffff', '#ff0000'],
    size: { min: 6, max: 15 },
    velocity: { min: 200, max: 400 },
    shape: 'slash',
  },
  fuel: {
    count: 30,
    colors: ['#ff6600', '#ff8800', '#ffaa00', '#ffcc00', '#ffff00'],
    size: { min: 4, max: 10 },
    velocity: { min: 100, max: 200 },
    shape: 'upward',
  },
  cycle: {
    count: 20,
    colors: ['#4488ff', '#66aaff', '#88ccff', '#aaddff', '#ffffff'],
    size: { min: 5, max: 10 },
    velocity: { min: 150, max: 250 },
    shape: 'burst',
  },
  buffer: {
    count: 25,
    colors: ['#44ff88', '#66ffaa', '#88ffcc', '#ffffff', '#00ff88'],
    size: { min: 4, max: 12 },
    velocity: { min: 80, max: 150 },
    shape: 'spiral',
  },
};

// 冲击效果配置（用于伤害卡）
export const impactEffect = {
  screenShake: {
    light: { x: [0, -3, 3, -3, 3, 0], duration: 0.2 },
    medium: { x: [0, -8, 8, -8, 8, 0], duration: 0.3 },
    heavy: { x: [0, -15, 15, -15, 15, 0], duration: 0.4 },
  },
  flash: {
    opacity: [0, 0.5, 0],
    duration: 0.3,
  },
};
