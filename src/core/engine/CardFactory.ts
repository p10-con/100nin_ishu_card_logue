import type { Card, CardBaseStats } from '../types/card';
import type { PoemRaw, Poet, Theme } from '../types/poem';
import { POEMS_RAW } from '../../data/poems/poems-raw';
import { POETS } from '../../data/poets/poets';

const RARITY_ATTACK_MULT: Record<string, number> = {
  legendary: 1.3, epic: 1.2, rare: 1.1, uncommon: 1.0, common: 0.95,
};

const RARITY_ENERGY: Record<string, number> = {
  legendary: 30, epic: 20, rare: 10, uncommon: 5, common: 0,
};

const STRONG_IMAGERY = new Set(['嵐', '波', '滝', '涙', '雷', '嵐', '乱れ', '砕ける', '燃える']);
const STABLE_IMAGERY = new Set(['山', '岩', '松', '雪', '氷', '石', '守る']);
const PATHOS_IMAGERY = new Set(['露', '霞', '紅葉', '散る', '暮れ', '月', '夢', '涙', '散る', '秋', '哀れ', '命', '老い', '古い', '昔']);

function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

function calcAttack(poem: PoemRaw, poet: Poet): number {
  let val = 20;

  for (const device of poem.rhetoricalDevices) {
    if (device === 'kakekotoba') val += 15;
    if (device === 'jokotoba') val += 10;
  }

  for (const img of poem.imagery) {
    if (STRONG_IMAGERY.has(img)) val += 5;
  }

  const themeBonus: Partial<Record<Theme, number>> = { love: 10, travel: 5, lament: 5 };
  for (const theme of poem.themes) {
    val += themeBonus[theme] ?? 0;
  }

  val *= RARITY_ATTACK_MULT[poet.rank] ?? 1.0;

  if (poet.gender === 'female') val -= 5;

  return clamp(poem.overrides?.attack ?? val);
}

function calcDefense(poem: PoemRaw, poet: Poet): number {
  let val = 20;

  for (const img of poem.imagery) {
    if (STABLE_IMAGERY.has(img)) val += 7;
  }

  if (poem.rhetoricalDevices.includes('makurakotoba')) val += 10;

  const themeBonus: Partial<Record<Theme, number>> = { nature: 10, misc: 5 };
  for (const theme of poem.themes) {
    val += themeBonus[theme] ?? 0;
  }

  val *= RARITY_ATTACK_MULT[poet.rank] ?? 1.0;

  return clamp(poem.overrides?.defense ?? val);
}

function calcElegance(poem: PoemRaw, poet: Poet): number {
  let val = poem.rhetoricalDevices.length * 15;

  if (poem.rhetoricalDevices.includes('honkadori')) val += 20;
  if (poem.rhetoricalDevices.includes('taigendome')) val += 10;

  // 平安中期の全盛期ボーナス
  if (poet.era >= 900 && poet.era <= 1100) val += 10;

  if (poet.gender === 'female') val += 5;

  return clamp(poem.overrides?.elegance ?? val);
}

function calcPathos(poem: PoemRaw, poet: Poet): number {
  let val = 20;

  for (const img of poem.imagery) {
    if (PATHOS_IMAGERY.has(img)) val += 8;
  }

  const themeBonus: Partial<Record<Theme, number>> = {
    lament: 20, love: 10, autumn: 15,
  };
  for (const theme of poem.themes) {
    val += themeBonus[theme] ?? 0;
  }

  if (poet.hasExile || poet.hasTonsure) val += 10;
  if (poet.gender === 'female') val += 10;

  return clamp(poem.overrides?.pathos ?? val);
}

function calcEnergy(elegance: number, pathos: number, poet: Poet): number {
  const base = ((elegance + pathos) / 2) * 0.05;
  const rarityBonus = RARITY_ENERGY[poet.rank] ?? 0;
  return clamp(base + rarityBonus, 1, 100);
}

export function buildCard(poem: PoemRaw): Card {
  const poet = POETS[poem.poetId];
  if (!poet) {
    throw new Error(`Unknown poetId: ${poem.poetId} (poem #${poem.number})`);
  }

  const attack = calcAttack(poem, poet);
  const defense = calcDefense(poem, poet);
  const elegance = calcElegance(poem, poet);
  const pathos = calcPathos(poem, poet);
  const energy = calcEnergy(elegance, pathos, poet);

  const stats: CardBaseStats = { attack, defense, elegance, pathos, energy };

  const primaryAttribute = poem.themes[0];

  return {
    id: `poem-${poem.number}`,
    poemNumber: poem.number,
    poem,
    poet,
    rarity: poet.rank,
    primaryAttribute,
    stats,
    synergyTags: {
      imagery: poem.imagery,
      rhetoricalDevices: poem.rhetoricalDevices,
      themes: poem.themes,
      poetEra: poet.era,
      poetId: poet.id,
    },
    usedCount: 0,
  };
}

export function buildAllCards(): Card[] {
  return POEMS_RAW.map(buildCard);
}

let _cardDb: Card[] | null = null;

export function getCardDb(): Card[] {
  if (!_cardDb) {
    _cardDb = buildAllCards();
  }
  return _cardDb;
}

export function getCardByNumber(num: number): Card | undefined {
  return getCardDb().find(c => c.poemNumber === num);
}
