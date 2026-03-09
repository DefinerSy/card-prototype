import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerProfile } from '../game/types';
import { createInitialPlayerProfile } from '../game/types';

interface PlayerStore {
  player: PlayerProfile;
  setPlayer: (player: Partial<PlayerProfile>) => void;
  addCoins: (amount: number) => void;
  addStardust: (amount: number) => void;
  unlockCard: (cardId: string) => void;
  buyCard: (cardId: string, cost: number) => boolean;  // 购买卡牌，返回是否成功
  addToDeck: (cardId: string) => void;
  removeFromDeck: (cardId: string, index?: number) => void;
  resetPlayer: () => void;
  getPlayer: () => PlayerProfile;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      player: createInitialPlayerProfile(),

      getPlayer: () => get().player,

      setPlayer: (player) =>
        set((state) => ({
          player: { ...state.player, ...player },
        })),

      addCoins: (amount) =>
        set((state) => ({
          player: { ...state.player, coins: state.player.coins + amount },
        })),

      addStardust: (amount) =>
        set((state) => ({
          player: { ...state.player, stardust: state.player.stardust + amount },
        })),

      unlockCard: (cardId) =>
        set((state) => {
          if (state.player.unlockedCards.includes(cardId)) {
            return state;
          }
          return {
            player: {
              ...state.player,
              unlockedCards: [...state.player.unlockedCards, cardId],
              knowledgeShards: state.player.knowledgeShards + 1,
            },
          };
        }),

      buyCard: (cardId, cost) => {
        const state = get();
        // 检查是否已经拥有
        if (state.player.unlockedCards.includes(cardId)) {
          return false;
        }
        // 检查金币是否足够
        if (state.player.coins < cost) {
          return false;
        }
        // 扣费并解锁卡牌
        set(() => ({
          player: {
            ...state.player,
            coins: state.player.coins - cost,
            unlockedCards: [...state.player.unlockedCards, cardId],
          },
        }));
        return true;
      },

      addToDeck: (cardId) =>
        set((state) => {
          // 卡组最多 30 张
          if (state.player.deck.length >= 30) {
            return state;
          }
          return {
            player: {
              ...state.player,
              deck: [...state.player.deck, cardId],
            },
          };
        }),

      removeFromDeck: (cardId, index) =>
        set((state) => {
          if (index !== undefined) {
            // 删除指定索引的牌
            const newDeck = [...state.player.deck];
            newDeck.splice(index, 1);
            return {
              player: {
                ...state.player,
                deck: newDeck,
              },
            };
          }
          // 不传索引时删除第一张匹配的牌
          const idx = state.player.deck.indexOf(cardId);
          if (idx === -1) return state;
          const newDeck = [...state.player.deck];
          newDeck.splice(idx, 1);
          return {
            player: {
              ...state.player,
              deck: newDeck,
            },
          };
        }),

      resetPlayer: () =>
        set({
          player: createInitialPlayerProfile(),
        }),
    }),
    {
      name: 'card-game-storage',
    }
  )
);
