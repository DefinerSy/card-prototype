# 卡牌游戏原型 (Card Game Prototype)

一个基于 React + TypeScript + Vite 的卡牌游戏原型。

## 🎮 在线游玩

访问 [https://definersy.github.io/card-prototype/](https://definersy.github.io/card-prototype/) 即可直接游玩！

## 功能特性

- **卡组构筑**：从已解锁的卡牌中选择 10-30 张构建你的卡组
- **战斗系统**：击败敌人以取得胜利
- **燃烧机制**：使用卡牌需要燃烧相应数量的牌作为费用
- **卡牌效果**：每张牌有独特的效果，某些卡牌在被烧掉时还会触发额外效果
- **动画效果**：抽牌、燃烧、弃牌等动画效果

## 卡牌类型

| 类型 | 颜色 | 说明 |
|------|------|------|
| 伤害 (damage) | 红色 | 对敌人造成伤害 |
| 费用 (fuel) | 黄色 | 提供资源或被烧掉时触发效果 |
| 调度 (cycle) | 蓝色 | 抽牌/过牌效果 |
| 效果 (buffer) | 绿色 | 其他特殊效果 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (动画)
- Zustand (状态管理)

## 项目结构

```
src/
├── components/
│   ├── game/       # 游戏界面组件
│   ├── lobby/      # 大厅界面组件
│   └── ui/         # UI 基础组件
├── game/
│   ├── cards/      # 卡牌定义
│   ├── data/       # 游戏数据（敌人等）
│   ├── logic/      # 游戏逻辑
│   └── types.ts    # 类型定义
└── store/          # 状态管理
```
