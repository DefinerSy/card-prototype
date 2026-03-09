// 卡牌类型定义
export type CardType = 'damage' | 'buffer' | 'fuel' | 'cycle';
export type CardRarity = 'common' | 'rare' | 'legendary';

// 卡牌定义
export interface Card {
  id: string;
  name: string;
  cost: number;                    // 费用
  type: CardType;
  rarity: CardRarity;              // 稀有度
  description: string;
  effect: (state: GameState) => void;
  onBurn?: (state: GameState) => void;  // 被烧掉时触发
}

// 敌人定义
export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  description?: string;
}

// 游戏状态（局内）
export interface GameState {
  drawPile: Card[];
  hand: Card[];
  discardPile: Card[];
  burnPile: Card[];
  enemy: Enemy;
  level: number;
  isGameOver: boolean;
  isVictory: boolean;
  damageBuff?: number;  // 伤害增益标记
}

// 玩家数据（局外 - 持久化）
export interface PlayerProfile {
  unlockedCards: string[];         // 已解锁卡牌 ID 列表
  deck: string[];                  // 当前构筑卡组（卡牌 ID）
  coins: number;                   // 金币
  stardust: number;                // 星尘
  knowledgeShards: number;         // 知识碎片
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    bestCombo: string;
  };
  achievements: string[];
}

// 初始玩家数据
export const createInitialPlayerProfile = (): PlayerProfile => ({
  unlockedCards: [],
  deck: [],
  coins: 100,
  stardust: 0,
  knowledgeShards: 0,
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    bestCombo: '',
  },
  achievements: [],
});

// 初始游戏状态（自动洗牌）
export const createInitialGameState = (deck: Card[]): GameState => {
  // 先复制牌组然后洗牌
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }

  return {
    drawPile: shuffledDeck,
    hand: [],
    discardPile: [],
    burnPile: [],
    enemy: { id: 'slime', name: '史莱姆', hp: 100, maxHp: 100 },
    level: 1,
    isGameOver: false,
    isVictory: false,
  };
};
