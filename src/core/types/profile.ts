import type { Theme } from './poem';

export type UpgradeId =
  | 'deck_capacity'
  | 'initial_deck_size'
  | 'chaining_speed'
  | 'sensitivity'
  | `attr_${Theme}`;

export interface PlayerProfile {
  readonly version: 1;
  upgradeLevels: Partial<Record<UpgradeId, number>>;
  totalScoreEarned: number;
  upgradePointsSpent: number;
  runsCompleted: number;
  runsAttempted: number;
}

export function createInitialProfile(): PlayerProfile {
  return {
    version: 1,
    upgradeLevels: {},
    totalScoreEarned: 0,
    upgradePointsSpent: 0,
    runsCompleted: 0,
    runsAttempted: 0,
  };
}

export function getUpgradeLevel(profile: PlayerProfile, id: UpgradeId): number {
  return profile.upgradeLevels[id] ?? 0;
}

export function getAvailablePoints(profile: PlayerProfile): number {
  const earned = Math.floor(profile.totalScoreEarned / 100) + profile.runsCompleted * 5;
  return Math.max(0, earned - profile.upgradePointsSpent);
}
