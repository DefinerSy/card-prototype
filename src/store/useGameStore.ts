import { create } from 'zustand';
import type { GameState, Card } from '../game/types';
import { createInitialGameState } from '../game/types';
import { startTurn, playCard as playCardLogic } from '../game/logic/Deck';

interface GameStore {
  gameState: GameState | null;
  isPlaying: boolean;

  // Actions
  startGame: (deck: Card[], enemy?: { id: string; name: string; hp: number; maxHp: number }) => void;
  playCard: (cardIndex: number) => { success: boolean; message?: string };
  endTurn: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  isPlaying: false,

  startGame: (deck, enemy) => {
    const state = createInitialGameState(deck);
    if (enemy) {
      state.enemy = enemy;
    }
    startTurn(state);
    set({ gameState: state, isPlaying: true });
  },

  playCard: (cardIndex) => {
    const { gameState } = get();
    if (!gameState) return { success: false, message: '游戏未开始' };

    // 创建新的状态对象
    const newState: GameState = {
      ...gameState,
      drawPile: [...gameState.drawPile],
      hand: [...gameState.hand],
      discardPile: [...gameState.discardPile],
      burnPile: [...gameState.burnPile],
      enemy: { ...gameState.enemy },
    };

    const result = playCardLogic(newState, cardIndex);
    
    // 检查手牌是否为空（在打出卡牌并结算抽牌等效果之后）
    // 或者检查是否所有手牌都无法使用（费用不足）
    const hasPlayableCards = newState.hand.some(card => {
      // 检查是否有足够的其他卡牌作为费用燃烧
      return newState.hand.length - 1 >= card.cost;
    });

    if (result.success && !hasPlayableCards && newState.enemy.hp > 0) {
      newState.isGameOver = true;
      newState.isVictory = false;
    }

    set({ gameState: newState });
    return result;
  },

  endTurn: () => {
    const { gameState } = get();
    if (!gameState) return;

    // 检查是否胜利
    if (gameState.enemy.hp <= 0) {
      set({ gameState: { ...gameState, isVictory: true, isGameOver: true }, isPlaying: false });
      return;
    }

    // 否则失败（因为是一回合机制）
    set({ gameState: { ...gameState, isVictory: false, isGameOver: true }, isPlaying: false });
  },

  resetGame: () => {
    set({ gameState: null, isPlaying: false });
  },
}));
