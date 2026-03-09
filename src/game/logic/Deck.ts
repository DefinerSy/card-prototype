import type { Card, GameState } from '../types';

/**
 * 洗牌函数 - Fisher-Yates 算法
 */
export function shuffleDeck<T>(deck: T[]): T[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 抽牌
 */
export function drawCards(state: GameState, count: number): void {
  for (let i = 0; i < count; i++) {
    if (state.drawPile.length === 0) {
      // 牌库为空，将弃牌区洗牌后放回
      if (state.discardPile.length > 0) {
        state.drawPile = shuffleDeck(state.discardPile);
        state.discardPile = [];
      } else {
        break; // 没有牌可抽
      }
    }
    const card = state.drawPile.pop();
    if (card) {
      state.hand.push(card);
    }
  }
}

/**
 * 检查是否可以出牌
 */
export function canPlayCard(card: Card, state: GameState): boolean {
  const available = state.discardPile.length + state.drawPile.length;
  return available >= card.cost;
}

/**
 * 使用卡牌
 */
export function playCard(state: GameState, cardIndex: number): { success: boolean; message?: string } {
  const card = state.hand[cardIndex];
  if (!card) {
    return { success: false, message: '无效的卡牌' };
  }

  // 检查费用是否足够
  if (!canPlayCard(card, state)) {
    return { success: false, message: '费用不足！' };
  }

  // 1. 从手牌移除
  state.hand.splice(cardIndex, 1);

  // 2. 计算需要烧掉的牌
  let cardsToBurn = card.cost;
  const burnedCards: Card[] = [];

  // 先烧弃牌区
  while (cardsToBurn > 0 && state.discardPile.length > 0) {
    const burned = state.discardPile.pop()!;
    burnedCards.push(burned);
    cardsToBurn--;
  }

  // 弃牌区不够，从抽牌库移
  while (cardsToBurn > 0 && state.drawPile.length > 0) {
    state.discardPile.push(state.drawPile.pop()!);
    cardsToBurn--;
  }

  // 触发被烧牌的 onBurn 效果
  for (const burned of burnedCards) {
    if (burned.onBurn) {
      burned.onBurn(state);
    }
    state.burnPile.push(burned);
  }

  // 应用伤害 buff 到伤害卡
  const originalEffect = card.effect;
  if (card.type === 'damage' && (state as any).damageBuff) {
    card.effect = (s) => {
      originalEffect(s);
      // 额外伤害
      s.enemy.hp -= (state as any).damageBuff;
    };
  }

  // 3. 触发卡牌效果
  card.effect(state);

  // 恢复原效果函数
  if (card.type === 'damage' && (state as any).damageBuff) {
    card.effect = originalEffect;
  }

  // 4. 打出的牌进入弃牌区
  state.discardPile.push(card);

  // 5. 检查胜负
  if (state.enemy.hp <= 0) {
    state.enemy.hp = 0;
    state.isVictory = true;
    state.isGameOver = true;
  }

  // 清除回合 buff
  (state as any).damageBuff = 0;

  return { success: true };
}

/**
 * 开始回合 - 抽 5 张牌
 */
export function startTurn(state: GameState): void {
  // 先清空手牌
  state.hand = [];
  // 洗牌
  state.drawPile = shuffleDeck(state.drawPile);
  // 抽 5 张牌
  drawCards(state, 5);
}

/**
 * 检查游戏状态
 */
export function checkGameState(state: GameState): void {
  // 检查是否胜利
  if (state.enemy.hp <= 0) {
    state.isVictory = true;
    state.isGameOver = true;
  }

  // 检查是否失败（牌库和弃牌区都没有牌了，但敌人还活着）
  const totalCards = state.hand.length + state.discardPile.length + state.drawPile.length;
  if (totalCards === 0 && state.enemy.hp > 0) {
    state.isVictory = false;
    state.isGameOver = true;
  }
}

/**
 * 从弃牌区检索卡牌到手牌
 */
export function searchDiscardPile(state: GameState, cardId: string): Card | null {
  const index = state.discardPile.findIndex(c => c.id === cardId);
  if (index !== -1) {
    const card = state.discardPile[index];
    state.discardPile.splice(index, 1);
    state.hand.push(card);
    return card;
  }
  return null;
}

/**
 * 从弃牌区随机检索一张卡牌到手牌
 */
export function searchRandomFromDiscardPile(state: GameState): Card | null {
  if (state.discardPile.length === 0) return null;
  const index = Math.floor(Math.random() * state.discardPile.length);
  const card = state.discardPile[index];
  state.discardPile.splice(index, 1);
  state.hand.push(card);
  return card;
}

/**
 * 从燃烧区检索卡牌到手牌
 */
export function searchBurnPile(state: GameState, cardId: string): Card | null {
  const index = state.burnPile.findIndex(c => c.id === cardId);
  if (index !== -1) {
    const card = state.burnPile[index];
    state.burnPile.splice(index, 1);
    state.hand.push(card);
    return card;
  }
  return null;
}

/**
 * 增加手牌中所有卡牌的伤害（临时 buff，本回合有效）
 */
export function buffHandDamage(state: GameState, bonus: number): void {
  // 由于伤害是在卡牌 effect 中直接计算的，这里我们无法直接修改卡牌
  // 所以我们用一个变通方法：给一个全局 buff 标记
  (state as any).damageBuff = ((state as any).damageBuff || 0) + bonus;
}

/**
 * 燃烧指定数量的随机手牌
 */
export function burnRandomFromHand(state: GameState, count: number): Card[] {
  const burned: Card[] = [];
  for (let i = 0; i < count && state.hand.length > 0; i++) {
    const index = Math.floor(Math.random() * state.hand.length);
    const card = state.hand[index];
    state.hand.splice(index, 1);
    if (card.onBurn) {
      card.onBurn(state);
    }
    state.burnPile.push(card);
    burned.push(card);
  }
  return burned;
}

/**
 * 燃烧手牌中费用最低的卡牌
 */
export function burnCheapestFromHand(state: GameState): Card | null {
  if (state.hand.length === 0) return null;
  const cheapestIndex = state.hand.reduce(
    (minIdx, card, idx) => card.cost < state.hand[minIdx].cost ? idx : minIdx,
    0
  );
  const card = state.hand[cheapestIndex];
  state.hand.splice(cheapestIndex, 1);
  if (card.onBurn) {
    card.onBurn(state);
  }
  state.burnPile.push(card);
  return card;
}

/**
 * 燃烧手牌中费用最高的卡牌
 */
export function burnMostExpensiveFromHand(state: GameState): Card | null {
  if (state.hand.length === 0) return null;
  const expensiveIndex = state.hand.reduce(
    (maxIdx, card, idx) => card.cost > state.hand[maxIdx].cost ? idx : maxIdx,
    0
  );
  const card = state.hand[expensiveIndex];
  state.hand.splice(expensiveIndex, 1);
  if (card.onBurn) {
    card.onBurn(state);
  }
  state.burnPile.push(card);
  return card;
}

/**
 * 将手牌中所有指定类型的卡牌置入弃牌区
 */
export function discardHandByType(state: GameState, type: string): number {
  let count = 0;
  for (let i = state.hand.length - 1; i >= 0; i--) {
    if (state.hand[i].type === type) {
      state.discardPile.push(state.hand[i]);
      state.hand.splice(i, 1);
      count++;
    }
  }
  return count;
}

/**
 * 复制手牌中的一张随机卡牌（创建临时复制）
 */
export function duplicateRandomHand(state: GameState): Card | null {
  if (state.hand.length === 0) return null;
  const index = Math.floor(Math.random() * state.hand.length);
  const card = state.hand[index];
  // 创建一个临时复制
  const copy: Card = {
    ...card,
    id: `copy_${card.id}_${Date.now()}`,
    name: `${card.name}(复制)`,
    cost: 0, // 复制品费用为 0
  };
  state.hand.push(copy);
  return copy;
}
