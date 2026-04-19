import type { UpgradeId } from '../types/profile';
import type { Theme } from '../types/poem';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  icon: string;
  category: 'deck' | 'combat' | 'attribute';
  maxLevel: number;
  cost: (currentLevel: number) => number;
  effectValue: (level: number) => number;
  effectLabel: (level: number) => string;
}

const THEMES: Theme[] = ['spring', 'summer', 'autumn', 'winter', 'love', 'travel', 'lament', 'nature', 'misc'];

const THEME_LABELS: Record<Theme, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬',
  love: '恋', travel: '旅', lament: '哀', nature: '自然', misc: '雑',
};

const THEME_ICONS: Record<Theme, string> = {
  spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️',
  love: '💕', travel: '🌿', lament: '🌙', nature: '🌲', misc: '✦',
};

const BASE_UPGRADES: UpgradeDef[] = [
  {
    id: 'deck_capacity',
    name: 'デッキ容量',
    icon: '📚',
    category: 'deck',
    maxLevel: 5,
    cost: (lv) => 3 * (lv + 1),
    effectValue: (lv) => 3 + lv,
    effectLabel: (lv) => `最大 ${3 + lv} 首まで`,
  },
  {
    id: 'sensitivity',
    name: '感受性',
    icon: '✨',
    category: 'deck',
    maxLevel: 5,
    cost: (lv) => 2 * (lv + 1),
    effectValue: (lv) => 20 + lv * 5,
    effectLabel: (lv) => `コスト合計上限 ${20 + lv * 5}`,
  },
  {
    id: 'chaining_speed',
    name: '詠み速度',
    icon: '⚡',
    category: 'combat',
    maxLevel: 3,
    cost: (lv) => 5 * (lv + 1),
    effectValue: (lv) => 2 + lv,
    effectLabel: (lv) => `1ターン ${2 + lv} 枚詠める`,
  },
];

const ATTRIBUTE_UPGRADES: UpgradeDef[] = THEMES.map(theme => ({
  id: `attr_${theme}` as UpgradeId,
  name: `${THEME_LABELS[theme]}の習熟`,
  icon: THEME_ICONS[theme],
  category: 'attribute' as const,
  maxLevel: 10,
  cost: (lv: number) => lv + 1,
  effectValue: (lv: number) => 1 + lv * 0.05,
  effectLabel: (lv: number) => `${THEME_LABELS[theme]}の句 ×${(1 + lv * 0.05).toFixed(2)}`,
}));

export const UPGRADES: UpgradeDef[] = [...BASE_UPGRADES, ...ATTRIBUTE_UPGRADES];

export function getUpgradeDef(id: UpgradeId): UpgradeDef | undefined {
  return UPGRADES.find(u => u.id === id);
}

export function getDeckCapacity(upgradeLevels: Partial<Record<UpgradeId, number>>): number {
  return 3 + (upgradeLevels['deck_capacity'] ?? 0);
}

export function getSensitivityLimit(upgradeLevels: Partial<Record<UpgradeId, number>>): number {
  return 20 + (upgradeLevels['sensitivity'] ?? 0) * 5;
}

export function getHandSize(upgradeLevels: Partial<Record<UpgradeId, number>>): number {
  return 2 + (upgradeLevels['chaining_speed'] ?? 0);
}

export function getAttributeMultiplier(
  upgradeLevels: Partial<Record<UpgradeId, number>>,
  theme: Theme,
): number {
  const lv = upgradeLevels[`attr_${theme}`] ?? 0;
  return Math.min(2.0, 1.0 + lv * 0.05);
}
