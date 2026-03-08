import type { Enemy } from '../types';

export const slime: Enemy = {
  id: 'slime',
  name: '史莱姆',
  hp: 80,
  maxHp: 80,
  description: '一只普通的史莱姆',
};

export const golem: Enemy = {
  id: 'golem',
  name: '石巨人',
  hp: 150,
  maxHp: 150,
  description: '巨大的岩石傀儡',
};

export const dragon: Enemy =
  {
    id: 'dragon',
    name: '暗影龙',
    hp: 200,
    maxHp: 200,
    description: '古老的暗影巨龙',
  };

export const enemies: Enemy[] = [slime, golem, dragon];
