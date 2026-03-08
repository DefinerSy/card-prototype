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

  // 3. 触发卡牌效果
  card.effect(state);

  // 4. 打出的牌进入弃牌区
  state.discardPile.push(card);

  // 5. 检查胜负
  if (state.enemy.hp <= 0) {
    state.enemy.hp = 0;
    state.isVictory = true;
    state.isGameOver = true;
  }

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
