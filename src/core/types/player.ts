import type { Attribute } from './card';

export interface PlayerStats {
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  elegance: number;
  pathos: number;
  insight: number;  // 洞察：手札枚数・選択肢に影響
}

export interface PlayerGrowth {
  totalCardsUsed: number;
  attributeAffinity: Partial<Record<Attribute, number>>;
  poemsUsed: number[];
  runsCompleted: number;
  bestScore: number;
}

export const createInitialPlayerStats = (): PlayerStats => ({
  maxHp: 50,
  currentHp: 50,
  attack: 10,
  defense: 5,
  elegance: 0,
  pathos: 0,
  insight: 0,
});

export const createInitialGrowth = (): PlayerGrowth => ({
  totalCardsUsed: 0,
  attributeAffinity: {},
  poemsUsed: [],
  runsCompleted: 0,
  bestScore: 0,
});
