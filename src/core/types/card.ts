import type { Theme, RhetoricalDevice, PoetRank, PoemRaw, Poet } from './poem';

export type Attribute = Theme;
export type Rarity = PoetRank;

export interface CardBaseStats {
  attack: number;    // 攻撃力 0-100
  defense: number;   // 守備力 0-100
  elegance: number;  // 優雅 0-100
  pathos: number;    // 哀愁 0-100
  energy: number;    // 使用コスト 1-10
}

export interface CardSynergyTags {
  imagery: string[];
  rhetoricalDevices: RhetoricalDevice[];
  themes: Theme[];
  poetEra: number;
  poetId: string;
}

export interface Card {
  id: string;
  poemNumber: number;
  poem: PoemRaw;
  poet: Poet;
  rarity: Rarity;
  primaryAttribute: Attribute;
  stats: CardBaseStats;
  synergyTags: CardSynergyTags;
  usedCount: number;
}
