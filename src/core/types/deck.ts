import type { Card, Attribute, CardBaseStats } from './card';

export interface DeckSynergyBonus {
  id: string;
  name: string;
  bonusType: 'stat_boost' | 'attribute_boost' | 'special_effect';
  targetStat?: keyof CardBaseStats;
  targetAttribute?: Attribute;
  value: number;
  description: string;
}

export interface DeckStats {
  totalAttack: number;
  totalDefense: number;
  avgElegance: number;
  avgPathos: number;
  dominantAttribute: Attribute;
  attributeDistribution: Partial<Record<Attribute, number>>;
  rarityScore: number;
  synergyBonuses: DeckSynergyBonus[];
  cohesion: number;      // 0-100 一体感
  versatility: number;   // 0-100 多様性
}

export interface Deck {
  id: string;
  name?: string;
  cards: Card[];
  stats: DeckStats;
}
