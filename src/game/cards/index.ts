import type { Card } from '../types';
import { drawCards } from '../logic/Deck';

// ==================== 伤害卡 ====================

export const fireball: Card = {
  id: 'fireball',
  name: '烈焰冲击',
  cost: 3,
  type: 'damage',
  rarity: 'common',
  description: '造成 20 点伤害',
  effect: (state) => {
    state.enemy.hp -= 20;
  },
};

export const frostBolt: Card = {
  id: 'frostBolt',
  name: '冰霜箭',
  cost: 2,
  type: 'damage',
  rarity: 'common',
  description: '造成 12 点伤害',
  effect: (state) => {
    state.enemy.hp -= 12;
  },
};

export const thunderStrike: Card = {
  id: 'thunderStrike',
  name: '雷霆打击',
  cost: 5,
  type: 'damage',
  rarity: 'rare',
  description: '造成 35 点伤害',
  effect: (state) => {
    state.enemy.hp -= 35;
  },
};

export const shadowFlame: Card = {
  id: 'shadowFlame',
  name: '暗影烈焰',
  cost: 4,
  type: 'damage',
  rarity: 'rare',
  description: '造成 25 点伤害，抽 1 张牌',
  effect: (state) => {
    state.enemy.hp -= 25;
    drawCards(state, 1);
  },
};

export const hellfire: Card = {
  id: 'hellfire',
  name: '地狱火',
  cost: 7,
  type: 'damage',
  rarity: 'legendary',
  description: '造成 50 点伤害',
  effect: (state) => {
    state.enemy.hp -= 50;
  },
};

// ==================== 费用卡 ====================

export const fuelCell: Card = {
  id: 'fuelCell',
  name: '燃料电池',
  cost: 0,
  type: 'fuel',
  rarity: 'common',
  description: '被烧掉时：抽 1 张牌',
  onBurn: (state) => {
    drawCards(state, 1);
  },
  effect: () => {},
};

export const energyCore: Card = {
  id: 'energyCore',
  name: '能量核心',
  cost: 1,
  type: 'fuel',
  rarity: 'common',
  description: '被烧掉时：抽 2 张牌',
  onBurn: (state) => {
    drawCards(state, 2);
  },
  effect: () => {},
};

export const sacrificialPact: Card = {
  id: 'sacrificialPact',
  name: '牺牲契约',
  cost: 0,
  type: 'fuel',
  rarity: 'rare',
  description: '被烧掉时：抽 3 张牌',
  onBurn: (state) => {
    drawCards(state, 3);
  },
  effect: () => {},
};

// ==================== 调度卡 ====================

export const timeJump: Card = {
  id: 'timeJump',
  name: '时间跳跃',
  cost: 2,
  type: 'cycle',
  rarity: 'common',
  description: '抽 2 张牌',
  effect: (state) => {
    drawCards(state, 2);
  },
};

export const cardDraw: Card = {
  id: 'cardDraw',
  name: '快速过牌',
  cost: 1,
  type: 'cycle',
  rarity: 'common',
  description: '抽 1 张牌',
  effect: (state) => {
    drawCards(state, 1);
  },
};

export const prophesy: Card = {
  id: 'prophesy',
  name: '预言',
  cost: 3,
  type: 'cycle',
  rarity: 'rare',
  description: '抽 3 张牌',
  effect: (state) => {
    drawCards(state, 3);
  },
};

export const rewind: Card = {
  id: 'rewind',
  name: '时光倒流',
  cost: 4,
  type: 'cycle',
  rarity: 'legendary',
  description: '将弃牌区所有牌洗入牌库，然后抽 5 张牌',
  effect: (state) => {
    state.drawPile.push(...state.discardPile);
    state.discardPile = [];
    drawCards(state, 5);
  },
};

// ==================== 效果卡 ====================

export const energyShield: Card = {
  id: 'energyShield',
  name: '能量护盾',
  cost: 2,
  type: 'buffer',
  rarity: 'common',
  description: '治疗敌人 5 点生命值（负面效果测试用）',
  effect: (state) => {
    // 注意：这是测试用，实际应该是给玩家 buff
    // 由于是秒杀机制，这里设计为直接伤害更合理
    state.enemy.hp -= 5;
  },
};

export const powerSurge: Card = {
  id: 'powerSurge',
  name: '能量涌动',
  cost: 3,
  type: 'buffer',
  rarity: 'rare',
  description: '造成 15 点伤害，抽 1 张牌',
  effect: (state) => {
    state.enemy.hp -= 15;
    drawCards(state, 1);
  },
};

export const finalStrike: Card = {
  id: 'finalStrike',
  name: '终结一击',
  cost: 6,
  type: 'buffer',
  rarity: 'legendary',
  description: '造成 40 点伤害',
  effect: (state) => {
    state.enemy.hp -= 40;
  },
};

// 导出所有卡牌
export const allCards: Card[] = [
  // 伤害卡
  fireball,
  frostBolt,
  thunderStrike,
  shadowFlame,
  hellfire,
  // 费用卡
  fuelCell,
  energyCore,
  sacrificialPact,
  // 调度卡
  timeJump,
  cardDraw,
  prophesy,
  rewind,
  // 效果卡
  energyShield,
  powerSurge,
  finalStrike,
];

// 按稀有度分类
export const cardsByRarity = {
  common: allCards.filter((c) => c.rarity === 'common'),
  rare: allCards.filter((c) => c.rarity === 'rare'),
  legendary: allCards.filter((c) => c.rarity === 'legendary'),
};

// 初始解锁的卡牌（新手教学）- 30 张基础牌，直接满足卡组要求
export const starterCards: Card[] = [
  // 基础伤害卡 (10 张)
  fireball, fireball, fireball, fireball, fireball,
  frostBolt, frostBolt, frostBolt, frostBolt, frostBolt,
  // 基础费用卡 (8 张)
  fuelCell, fuelCell, fuelCell, fuelCell,
  energyCore, energyCore, energyCore, energyCore,
  // 基础调度卡 (8 张)
  timeJump, timeJump, timeJump, timeJump,
  cardDraw, cardDraw, cardDraw, cardDraw,
  // 基础效果卡 (4 张)
  energyShield, energyShield, energyShield, energyShield,
];
