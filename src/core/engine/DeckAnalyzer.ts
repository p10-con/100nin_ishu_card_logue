import type { Card, Attribute } from '../types/card';
import type { Deck, DeckStats, DeckSynergyBonus } from '../types/deck';
import type { Theme } from '../types/poem';

interface SynergyRule {
  id: string;
  name: string;
  description: string;
  check: (cards: Card[]) => boolean;
  bonus: Omit<DeckSynergyBonus, 'id' | 'name' | 'description'>;
}

const SYNERGY_RULES: SynergyRule[] = [
  {
    id: 'moon_feast',
    name: '月光の宴',
    description: '月の意象を持つ句が3枚以上',
    check: cards => cards.filter(c => c.synergyTags.imagery.includes('月')).length >= 3,
    bonus: { bonusType: 'stat_boost', targetStat: 'pathos', value: 10 },
  },
  {
    id: 'rokkasen',
    name: '六歌仙の系譜',
    description: '六歌仙または三十六歌仙の句が3枚以上',
    check: cards => cards.filter(c => c.poet.isRokkkasen || c.poet.isSanjurokkkasen).length >= 3,
    bonus: { bonusType: 'stat_boost', targetStat: 'attack', value: 15 },
  },
  {
    id: 'spring_autumn',
    name: '春秋問答',
    description: '春属性と秋属性が両方3枚以上',
    check: cards => {
      const spring = cards.filter(c => c.synergyTags.themes.includes('spring')).length;
      const autumn = cards.filter(c => c.synergyTags.themes.includes('autumn')).length;
      return spring >= 3 && autumn >= 3;
    },
    bonus: { bonusType: 'special_effect', value: 1, targetAttribute: 'spring' },
  },
  {
    id: 'love_song',
    name: '恋歌集',
    description: '恋属性の句が5枚以上',
    check: cards => cards.filter(c => c.synergyTags.themes.includes('love')).length >= 5,
    bonus: { bonusType: 'stat_boost', targetStat: 'attack', value: 20 },
  },
  {
    id: 'imperial_decree',
    name: '勅撰の栄',
    description: 'legendaryまたはepicのカードが5枚以上',
    check: cards => cards.filter(c => c.rarity === 'legendary' || c.rarity === 'epic').length >= 5,
    bonus: { bonusType: 'stat_boost', targetStat: 'elegance', value: 20 },
  },
  {
    id: 'monks_path',
    name: '法師の道',
    description: '出家経験のある詠み人の句が3枚以上',
    check: cards => cards.filter(c => c.poet.hasTonsure).length >= 3,
    bonus: { bonusType: 'stat_boost', targetStat: 'defense', value: 15 },
  },
  {
    id: 'feminine_grace',
    name: '女流の雅',
    description: '女性詠み人の句が3枚以上',
    check: cards => cards.filter(c => c.poet.gender === 'female').length >= 3,
    bonus: { bonusType: 'stat_boost', targetStat: 'elegance', value: 15 },
  },
  {
    id: 'autumn_lament',
    name: '秋の嘆き',
    description: '秋+哀愁テーマが両方ある句が4枚以上',
    check: cards => cards.filter(c =>
      c.synergyTags.themes.includes('autumn') && c.synergyTags.themes.includes('lament')
    ).length >= 4,
    bonus: { bonusType: 'stat_boost', targetStat: 'pathos', value: 20 },
  },
  {
    id: 'exile_power',
    name: '流離の力',
    description: '流罪経験のある詠み人の句が2枚以上',
    check: cards => cards.filter(c => c.poet.hasExile).length >= 2,
    bonus: { bonusType: 'stat_boost', targetStat: 'attack', value: 25 },
  },
  {
    id: 'heian_peak',
    name: '王朝の絢爛',
    description: '平安中期(900-1100年)の詠み人の句が6枚以上',
    check: cards => cards.filter(c => c.poet.era >= 900 && c.poet.era <= 1100).length >= 6,
    bonus: { bonusType: 'stat_boost', targetStat: 'elegance', value: 25 },
  },
];

function detectSynergies(cards: Card[]): DeckSynergyBonus[] {
  return SYNERGY_RULES
    .filter(rule => rule.check(cards))
    .map(rule => ({
      id: rule.id,
      name: rule.name,
      description: rule.description,
      ...rule.bonus,
    }));
}

function calcRarityScore(cards: Card[]): number {
  const weights: Record<string, number> = {
    legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1,
  };
  const sum = cards.reduce((acc, c) => acc + (weights[c.rarity] ?? 1), 0);
  return Math.round((sum / cards.length) * 20);
}

function calcCohesion(cards: Card[]): number {
  const themeCounts: Partial<Record<Theme, number>> = {};
  for (const card of cards) {
    for (const theme of card.synergyTags.themes) {
      themeCounts[theme] = (themeCounts[theme] ?? 0) + 1;
    }
  }

  const maxThemeCount = Math.max(...Object.values(themeCounts).filter(Boolean) as number[]);
  let cohesion = (maxThemeCount / cards.length) * 60;

  const poetCounts: Record<string, number> = {};
  for (const card of cards) {
    poetCounts[card.poet.id] = (poetCounts[card.poet.id] ?? 0) + 1;
  }
  const multiPoets = Object.values(poetCounts).filter(n => n >= 2).length;
  cohesion += multiPoets * 10;

  return Math.min(100, Math.round(cohesion));
}

function calcVersatility(cards: Card[]): number {
  const uniqueThemes = new Set(cards.flatMap(c => c.synergyTags.themes));
  const uniqueDevices = new Set(cards.flatMap(c => c.synergyTags.rhetoricalDevices));
  const maxThemes = 8;
  const maxDevices = 6;
  return Math.round(
    (uniqueThemes.size / maxThemes) * 50 + (uniqueDevices.size / maxDevices) * 50
  );
}

export function analyzeDeck(cards: Card[]): DeckStats {
  const totalAttack = cards.reduce((s, c) => s + c.stats.attack, 0);
  const totalDefense = cards.reduce((s, c) => s + c.stats.defense, 0);
  const avgElegance = Math.round(cards.reduce((s, c) => s + c.stats.elegance, 0) / cards.length);
  const avgPathos = Math.round(cards.reduce((s, c) => s + c.stats.pathos, 0) / cards.length);

  const attrCount: Partial<Record<Attribute, number>> = {};
  for (const card of cards) {
    attrCount[card.primaryAttribute] = (attrCount[card.primaryAttribute] ?? 0) + 1;
  }

  const dominantAttribute = (Object.entries(attrCount) as [Attribute, number][])
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'misc';

  return {
    totalAttack,
    totalDefense,
    avgElegance,
    avgPathos,
    dominantAttribute,
    attributeDistribution: attrCount,
    rarityScore: calcRarityScore(cards),
    synergyBonuses: detectSynergies(cards),
    cohesion: calcCohesion(cards),
    versatility: calcVersatility(cards),
  };
}

export function buildDeck(id: string, cards: Card[], name?: string): Deck {
  return {
    id,
    name,
    cards,
    stats: analyzeDeck(cards),
  };
}

export const ALL_SYNERGY_RULES = SYNERGY_RULES;
