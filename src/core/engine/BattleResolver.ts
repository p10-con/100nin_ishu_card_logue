import type { Card, Attribute } from '../types/card';
import type { Enemy } from '../types/run';
import type { PlayerStats } from '../types/player';
import type { Deck } from '../types/deck';

// 将来の属性相性テーブル（現在未使用）
export const ATTRIBUTE_BONUS: Partial<Record<Attribute, Attribute[]>> = {
  spring: ['winter'],
  summer: ['spring'],
  autumn: ['summer'],
  winter: ['autumn'],
  love: ['lament'],
};

export interface PlayResult {
  damageDealt: number;
  defenseGained: number;
  eleganceGained: number;
  pathosGained: number;
  logMessage: string;
}

export function resolveCardPlay(
  card: Card,
  player: PlayerStats,
  enemy: Enemy,
  deck: Deck
): PlayResult {
  let attack = card.stats.attack;
  let defense = card.stats.defense;

  // デッキシナジーボーナス適用
  for (const synergy of deck.stats.synergyBonuses) {
    if (synergy.bonusType === 'stat_boost') {
      if (synergy.targetStat === 'attack') attack += synergy.value * 0.5;
      if (synergy.targetStat === 'defense') defense += synergy.value * 0.5;
    }
    if (synergy.bonusType === 'attribute_boost' && synergy.targetAttribute === card.primaryAttribute) {
      attack = Math.round(attack * 1.2);
    }
  }

  // 属性相性ボーナス（将来: 敵の弱点属性と照合）
  const attributeMultiplier = 1.0;

  // プレイヤーステータスボーナス
  const eleganceBonus = Math.floor(player.elegance / 20);
  const pathosBonus = Math.floor(player.pathos / 20);

  const damageDealt = Math.max(1, Math.round((attack + eleganceBonus) * attributeMultiplier) - enemy.defense);
  const defenseGained = Math.round(defense + pathosBonus);

  const logMessage = `${card.poem.upper.slice(0, 8)}... → ${damageDealt}ダメージ / ${defenseGained}防御`;

  return {
    damageDealt,
    defenseGained,
    eleganceGained: Math.round(card.stats.elegance * 0.1),
    pathosGained: Math.round(card.stats.pathos * 0.1),
    logMessage,
  };
}

export function createEnemy(name: string, hp: number, attack: number, defense: number): Enemy {
  return {
    id: `enemy-${Date.now()}`,
    name,
    hp,
    maxHp: hp,
    attack,
    defense,
    intent: { type: 'attack', value: attack, description: `${attack}のダメージ` },
  };
}

const ENEMY_TABLE = [
  { name: '浮気な武者', hp: 30, attack: 8, defense: 3 },
  { name: '嫉妬の鬼', hp: 40, attack: 12, defense: 5 },
  { name: '恋煩いの僧', hp: 35, attack: 10, defense: 8 },
  { name: '嵐の精', hp: 45, attack: 15, defense: 4 },
  { name: '秋の鹿の霊', hp: 50, attack: 14, defense: 6 },
  { name: '月の迷い人', hp: 55, attack: 16, defense: 7 },
  { name: '忘却の霧', hp: 60, attack: 18, defense: 8 },
];

const ELITE_TABLE = [
  { name: '六条の御息所', hp: 80, attack: 22, defense: 10 },
  { name: '怒れる帝', hp: 90, attack: 25, defense: 12 },
  { name: '深山の鬼', hp: 100, attack: 28, defense: 10 },
];

const BOSS_TABLE = [
  { name: '百鬼の長', hp: 150, attack: 30, defense: 15 },
  { name: '嫉妬の業火', hp: 200, attack: 35, defense: 18 },
  { name: '時の君', hp: 250, attack: 40, defense: 20 },
];

export function randomEnemy(depth: number): Enemy {
  const table = ENEMY_TABLE;
  const idx = Math.min(depth, table.length - 1);
  const base = table[idx];
  return createEnemy(base.name, base.hp, base.attack, base.defense);
}

export function randomElite(depth: number): Enemy {
  const idx = Math.min(Math.floor(depth / 2), ELITE_TABLE.length - 1);
  const base = ELITE_TABLE[idx];
  return createEnemy(base.name, base.hp, base.attack, base.defense);
}

export function randomBoss(stage: number): Enemy {
  const idx = Math.min(stage, BOSS_TABLE.length - 1);
  const base = BOSS_TABLE[idx];
  return createEnemy(base.name, base.hp, base.attack, base.defense);
}
