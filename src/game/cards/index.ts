import type { Card } from '../types';
import { drawCards, shuffleDeck, searchRandomFromDiscardPile, buffHandDamage, burnRandomFromHand, burnCheapestFromHand, discardHandByType, duplicateRandomHand } from '../logic/Deck';

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

// 新增伤害卡
export const arcaneBlast: Card = {
  id: 'arcaneBlast',
  name: '奥术爆击',
  cost: 1,
  type: 'damage',
  rarity: 'common',
  description: '造成 6 点伤害',
  effect: (state) => {
    state.enemy.hp -= 6;
  },
};

export const poisonDart: Card = {
  id: 'poisonDart',
  name: '毒液飞镖',
  cost: 1,
  type: 'damage',
  rarity: 'common',
  description: '造成 8 点伤害',
  effect: (state) => {
    state.enemy.hp -= 8;
  },
};

export const meteor: Card = {
  id: 'meteor',
  name: '陨石坠落',
  cost: 6,
  type: 'damage',
  rarity: 'rare',
  description: '造成 42 点伤害',
  effect: (state) => {
    state.enemy.hp -= 42;
  },
};

export const soulFire: Card = {
  id: 'soulFire',
  name: '灵魂之火',
  cost: 5,
  type: 'damage',
  rarity: 'rare',
  description: '造成 32 点伤害，抽 1 张牌',
  effect: (state) => {
    state.enemy.hp -= 32;
    drawCards(state, 1);
  },
};

export const doomsday: Card = {
  id: 'doomsday',
  name: '世界末日',
  cost: 8,
  type: 'damage',
  rarity: 'legendary',
  description: '造成 60 点伤害，抽 2 张牌',
  effect: (state) => {
    state.enemy.hp -= 60;
    drawCards(state, 2);
  },
};

export const voidStrike: Card = {
  id: 'voidStrike',
  name: '虚空打击',
  cost: 4,
  type: 'damage',
  rarity: 'common',
  description: '造成 22 点伤害',
  effect: (state) => {
    state.enemy.hp -= 22;
  },
};

export const iceStorm: Card = {
  id: 'iceStorm',
  name: '冰风暴',
  cost: 5,
  type: 'damage',
  rarity: 'rare',
  description: '造成 30 点伤害',
  effect: (state) => {
    state.enemy.hp -= 30;
  },
};

export const holyNova: Card = {
  id: 'holyNova',
  name: '神圣新星',
  cost: 3,
  type: 'damage',
  rarity: 'common',
  description: '造成 16 点伤害',
  effect: (state) => {
    state.enemy.hp -= 16;
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

// 新增费用卡
export const manaCrystal: Card = {
  id: 'manaCrystal',
  name: '法力水晶',
  cost: 0,
  type: 'fuel',
  rarity: 'common',
  description: '被烧掉时：抽 1 张牌',
  onBurn: (state) => {
    drawCards(state, 1);
  },
  effect: () => {},
};

export const powerCore: Card = {
  id: 'powerCore',
  name: '动力核心',
  cost: 2,
  type: 'fuel',
  rarity: 'rare',
  description: '被烧掉时：抽 4 张牌',
  onBurn: (state) => {
    drawCards(state, 4);
  },
  effect: () => {},
};

export const darkRitual: Card = {
  id: 'darkRitual',
  name: '黑暗仪式',
  cost: 1,
  type: 'fuel',
  rarity: 'rare',
  description: '被烧掉时：抽 3 张牌',
  onBurn: (state) => {
    drawCards(state, 3);
  },
  effect: () => {},
};

export const celestialFuel: Card = {
  id: 'celestialFuel',
  name: '星界燃料',
  cost: 3,
  type: 'fuel',
  rarity: 'legendary',
  description: '被烧掉时：抽 5 张牌',
  onBurn: (state) => {
    drawCards(state, 5);
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

// 新增调度卡
export const scholar: Card = {
  id: 'scholar',
  name: '学者',
  cost: 1,
  type: 'cycle',
  rarity: 'common',
  description: '抽 1 张牌',
  effect: (state) => {
    drawCards(state, 1);
  },
};

export const explore: Card = {
  id: 'explore',
  name: '探索',
  cost: 2,
  type: 'cycle',
  rarity: 'common',
  description: '抽 2 张牌',
  effect: (state) => {
    drawCards(state, 2);
  },
};

export const inspiration: Card = {
  id: 'inspiration',
  name: '灵感爆发',
  cost: 4,
  type: 'cycle',
  rarity: 'rare',
  description: '抽 4 张牌',
  effect: (state) => {
    drawCards(state, 4);
  },
};

export const timeWarp: Card = {
  id: 'timeWarp',
  name: '时间扭曲',
  cost: 5,
  type: 'cycle',
  rarity: 'legendary',
  description: '抽 6 张牌',
  effect: (state) => {
    drawCards(state, 6);
  },
};

export const divination: Card = {
  id: 'divination',
  name: '占卜',
  cost: 3,
  type: 'cycle',
  rarity: 'common',
  description: '抽 3 张牌',
  effect: (state) => {
    drawCards(state, 3);
  },
};

// ==================== 效果卡 ====================

export const energyShield: Card = {
  id: 'energyShield',
  name: '能量护盾',
  cost: 2,
  type: 'buffer',
  rarity: 'common',
  description: '造成 5 点伤害',
  effect: (state) => {
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

// 新增效果卡
export const barrier: Card = {
  id: 'barrier',
  name: '能量屏障',
  cost: 1,
  type: 'buffer',
  rarity: 'common',
  description: '造成 8 点伤害',
  effect: (state) => {
    state.enemy.hp -= 8;
  },
};

export const healingSpring: Card = {
  id: 'healingSpring',
  name: '治疗之泉',
  cost: 2,
  type: 'buffer',
  rarity: 'common',
  description: '造成 12 点伤害',
  effect: (state) => {
    state.enemy.hp -= 12;
  },
};

export const berserk: Card = {
  id: 'berserk',
  name: '狂暴',
  cost: 4,
  type: 'buffer',
  rarity: 'rare',
  description: '造成 28 点伤害',
  effect: (state) => {
    state.enemy.hp -= 28;
  },
};

export const divineIntervention: Card = {
  id: 'divineIntervention',
  name: '神之干预',
  cost: 7,
  type: 'buffer',
  rarity: 'legendary',
  description: '造成 45 点伤害，抽 3 张牌',
  effect: (state) => {
    state.enemy.hp -= 45;
    drawCards(state, 3);
  },
};

export const curse: Card = {
  id: 'curse',
  name: '诅咒',
  cost: 2,
  type: 'buffer',
  rarity: 'common',
  description: '造成 14 点伤害',
  effect: (state) => {
    state.enemy.hp -= 14;
  },
};

export const spellweaving: Card = {
  id: 'spellweaving',
  name: '法术编织',
  cost: 3,
  type: 'buffer',
  rarity: 'rare',
  description: '造成 18 点伤害，抽 1 张牌',
  effect: (state) => {
    state.enemy.hp -= 18;
    drawCards(state, 1);
  },
};

// ==================== 新机制卡牌 ====================

// ---- 弃牌区检索 ----

export const recall: Card = {
  id: 'recall',
  name: '回忆',
  cost: 1,
  type: 'cycle',
  rarity: 'common',
  description: '从弃牌区随机检索 1 张牌到手牌',
  effect: (state) => {
    searchRandomFromDiscardPile(state);
  },
};

export const fetchArtifact: Card = {
  id: 'fetchArtifact',
  name: '检索遗物',
  cost: 2,
  type: 'cycle',
  rarity: 'common',
  description: '从弃牌区检索 1 张费用卡到手牌',
  effect: (state) => {
    const fuelCard = state.discardPile.find(c => c.type === 'fuel');
    if (fuelCard) {
      const idx = state.discardPile.findIndex(c => c.id === fuelCard.id);
      state.discardPile.splice(idx, 1);
      state.hand.push(fuelCard);
    }
  },
};

export const memoryResidue: Card = {
  id: 'memoryResidue',
  name: '记忆残片',
  cost: 3,
  type: 'cycle',
  rarity: 'rare',
  description: '从弃牌区检索 2 张牌到手牌',
  effect: (state) => {
    searchRandomFromDiscardPile(state);
    searchRandomFromDiscardPile(state);
  },
};

export const timeRetrieve: Card = {
  id: 'timeRetrieve',
  name: '时光回溯',
  cost: 4,
  type: 'cycle',
  rarity: 'legendary',
  description: '从燃烧区随机检索 2 张牌到手牌',
  effect: (state) => {
    if (state.burnPile.length > 0) {
      const idx1 = Math.floor(Math.random() * state.burnPile.length);
      const card1 = state.burnPile[idx1];
      state.burnPile.splice(idx1, 1);
      state.hand.push(card1);
    }
    if (state.burnPile.length > 0) {
      const idx2 = Math.floor(Math.random() * state.burnPile.length);
      const card2 = state.burnPile[idx2];
      state.burnPile.splice(idx2, 1);
      state.hand.push(card2);
    }
  },
};

// ---- 伤害增益 ----

export const battleFrenzy: Card = {
  id: 'battleFrenzy',
  name: '战斗狂热',
  cost: 2,
  type: 'buffer',
  rarity: 'common',
  description: '本回合手牌中所有伤害卡 +5 伤害',
  effect: (state) => {
    buffHandDamage(state, 5);
  },
};

export const powerOverwhelming: Card = {
  id: 'powerOverwhelming',
  name: '力量涌动',
  cost: 3,
  type: 'buffer',
  rarity: 'rare',
  description: '本回合手牌中所有伤害卡 +10 伤害',
  effect: (state) => {
    buffHandDamage(state, 10);
  },
};

export const deadlyStrike: Card = {
  id: 'deadlyStrike',
  name: '致命打击',
  cost: 4,
  type: 'damage',
  rarity: 'rare',
  description: '造成 20 点伤害，本回合手牌中所有伤害卡 +5 伤害',
  effect: (state) => {
    state.enemy.hp -= 20;
    buffHandDamage(state, 5);
  },
};

export const ultimatePower: Card = {
  id: 'ultimatePower',
  name: '终极力量',
  cost: 5,
  type: 'buffer',
  rarity: 'legendary',
  description: '本回合手牌中所有伤害卡 +15 伤害，抽 2 张牌',
  effect: (state) => {
    buffHandDamage(state, 15);
    drawCards(state, 2);
  },
};

// ---- 燃烧机制 ----

export const quickBurn: Card = {
  id: 'quickBurn',
  name: '快速燃烧',
  cost: 0,
  type: 'fuel',
  rarity: 'common',
  description: '被烧掉时：抽 1 张牌。打出：燃烧 1 张随机手牌',
  onBurn: (state) => {
    drawCards(state, 1);
  },
  effect: (state) => {
    burnRandomFromHand(state, 1);
  },
};

export const sacrifice: Card = {
  id: 'sacrifice',
  name: '牺牲',
  cost: 1,
  type: 'fuel',
  rarity: 'common',
  description: '被烧掉时：抽 2 张牌。打出：燃烧费用最低的 1 张手牌',
  onBurn: (state) => {
    drawCards(state, 2);
  },
  effect: (state) => {
    burnCheapestFromHand(state);
  },
};

export const darkOffering: Card = {
  id: 'darkOffering',
  name: '黑暗祭品',
  cost: 2,
  type: 'fuel',
  rarity: 'rare',
  description: '被烧掉时：抽 3 张牌。打出：燃烧 2 张随机手牌',
  onBurn: (state) => {
    drawCards(state, 3);
  },
  effect: (state) => {
    burnRandomFromHand(state, 2);
  },
};

export const infernalPact: Card = {
  id: 'infernalPact',
  name: '地狱契约',
  cost: 3,
  type: 'fuel',
  rarity: 'legendary',
  description: '被烧掉时：抽 5 张牌。打出：燃烧所有手牌',
  onBurn: (state) => {
    const count = state.hand.length;
    drawCards(state, count + 2);
  },
  effect: (state) => {
    burnRandomFromHand(state, state.hand.length);
  },
};

export const purge: Card = {
  id: 'purge',
  name: '净化',
  cost: 2,
  type: 'damage',
  rarity: 'common',
  description: '造成 10 点伤害，燃烧 1 张随机手牌',
  effect: (state) => {
    state.enemy.hp -= 10;
    burnRandomFromHand(state, 1);
  },
};

export const burningStorm: Card = {
  id: 'burningStorm',
  name: '燃烧风暴',
  cost: 5,
  type: 'damage',
  rarity: 'rare',
  description: '造成 25 点伤害，燃烧 2 张随机手牌，每燃烧 1 张抽 1 张牌',
  effect: (state) => {
    state.enemy.hp -= 25;
    const burned = burnRandomFromHand(state, 2);
    drawCards(state, burned.length);
  },
};

// ---- 弃牌利用 ----

export const discardPower: Card = {
  id: 'discardPower',
  name: '弃牌力量',
  cost: 2,
  type: 'buffer',
  rarity: 'common',
  description: '弃置 1 张手牌，每弃置 1 张造成 10 点伤害',
  effect: (state) => {
    if (state.hand.length > 0) {
      const idx = Math.floor(Math.random() * state.hand.length);
      state.discardPile.push(state.hand[idx]);
      state.hand.splice(idx, 1);
      state.enemy.hp -= 10;
    }
  },
};

export const massDiscard: Card = {
  id: 'massDiscard',
  name: '批量弃置',
  cost: 3,
  type: 'cycle',
  rarity: 'rare',
  description: '弃置所有调度卡，每张抽 2 张牌',
  effect: (state) => {
    const count = discardHandByType(state, 'cycle');
    drawCards(state, count * 2);
  },
};

export const recycle: Card = {
  id: 'recycle',
  name: '回收',
  cost: 1,
  type: 'cycle',
  rarity: 'common',
  description: '将弃牌区所有费用卡洗入牌库，每回收 1 张抽 1 张牌',
  effect: (state) => {
    const fuelCards = state.discardPile.filter(c => c.type === 'fuel');
    const otherCards = state.discardPile.filter(c => c.type !== 'fuel');
    state.drawPile.push(...fuelCards);
    state.discardPile = otherCards;
    drawCards(state, fuelCards.length);
  },
};

// ---- 复制机制 ----

export const mirror: Card = {
  id: 'mirror',
  name: '镜像',
  cost: 2,
  type: 'buffer',
  rarity: 'rare',
  description: '随机复制 1 张手牌（复制品费用为 0）',
  effect: (state) => {
    duplicateRandomHand(state);
  },
};

export const clone: Card = {
  id: 'clone',
  name: '克隆',
  cost: 3,
  type: 'buffer',
  rarity: 'legendary',
  description: '复制手牌中费用最高的卡牌（复制品费用为 0）',
  effect: (state) => {
    if (state.hand.length === 0) return;
    const expensiveIndex = state.hand.reduce(
      (maxIdx, card, idx) => card.cost > state.hand[maxIdx].cost ? idx : maxIdx,
      0
    );
    const card = state.hand[expensiveIndex];
    const copy: Card = {
      ...card,
      id: `copy_${card.id}_${Date.now()}`,
      name: `${card.name}(复制)`,
      cost: 0,
    };
    state.hand.push(copy);
  },
};

// ---- 特殊机制 ----

export const exchange: Card = {
  id: 'exchange',
  name: '交换',
  cost: 2,
  type: 'cycle',
  rarity: 'rare',
  description: '将手牌所有牌洗入牌库，然后抽 5 张牌',
  effect: (state) => {
    state.drawPile.push(...state.hand);
    state.hand = [];
    state.drawPile = shuffleDeck(state.drawPile);
    drawCards(state, 5);
  },
};

export const gamble: Card = {
  id: 'gamble',
  name: '赌博',
  cost: 1,
  type: 'cycle',
  rarity: 'common',
  description: '50% 概率抽 3 张牌，50% 概率燃烧 1 张随机手牌',
  effect: (state) => {
    if (Math.random() < 0.5) {
      drawCards(state, 3);
    } else {
      burnRandomFromHand(state, 1);
    }
  },
};

export const allIn: Card = {
  id: 'allIn',
  name: '全力以赴',
  cost: 0,
  type: 'damage',
  rarity: 'rare',
  description: '造成等同于已燃烧卡牌数量 x3 的伤害',
  effect: (state) => {
    const damage = state.burnPile.length * 3;
    state.enemy.hp -= damage;
  },
};

export const vengeance: Card = {
  id: 'vengeance',
  name: '复仇',
  cost: 1,
  type: 'damage',
  rarity: 'rare',
  description: '每有 1 张牌在燃烧区，造成 5 点伤害',
  effect: (state) => {
    const damage = state.burnPile.length * 5;
    state.enemy.hp -= damage;
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
  arcaneBlast,
  poisonDart,
  meteor,
  soulFire,
  doomsday,
  voidStrike,
  iceStorm,
  holyNova,
  purge,
  burningStorm,
  allIn,
  vengeance,
  deadlyStrike,
  // 费用卡
  fuelCell,
  energyCore,
  sacrificialPact,
  manaCrystal,
  powerCore,
  darkRitual,
  celestialFuel,
  quickBurn,
  sacrifice,
  darkOffering,
  infernalPact,
  // 调度卡
  timeJump,
  cardDraw,
  prophesy,
  rewind,
  scholar,
  explore,
  inspiration,
  timeWarp,
  divination,
  recall,
  fetchArtifact,
  memoryResidue,
  timeRetrieve,
  exchange,
  gamble,
  recycle,
  // 效果卡
  energyShield,
  powerSurge,
  finalStrike,
  barrier,
  healingSpring,
  berserk,
  divineIntervention,
  curse,
  spellweaving,
  battleFrenzy,
  powerOverwhelming,
  ultimatePower,
  discardPower,
  massDiscard,
  mirror,
  clone,
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
