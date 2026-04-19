import type { PlayerProfile, UpgradeId } from '../types/profile';
import { createInitialProfile, getAvailablePoints, getUpgradeLevel } from '../types/profile';
import { getUpgradeDef } from './UpgradeCatalog';

const PROFILE_KEY = 'hyakunin_profile_v1';

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return createInitialProfile();
    const parsed = JSON.parse(raw) as PlayerProfile;
    if (parsed.version !== 1) {
      localStorage.setItem(PROFILE_KEY + '_backup', raw);
      return createInitialProfile();
    }
    return parsed;
  } catch {
    return createInitialProfile();
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch { /* noop */ }
}

export interface UpgradeResult {
  success: boolean;
  reason?: string;
  profile: PlayerProfile;
  cost: number;
}

export function applyUpgrade(profile: PlayerProfile, id: UpgradeId): UpgradeResult {
  const def = getUpgradeDef(id);
  if (!def) return { success: false, reason: '不明な強化', profile, cost: 0 };

  const currentLevel = getUpgradeLevel(profile, id);
  if (currentLevel >= def.maxLevel) {
    return { success: false, reason: '最大レベルに達しています', profile, cost: 0 };
  }

  const cost = def.cost(currentLevel);
  const available = getAvailablePoints(profile);
  if (available < cost) {
    return { success: false, reason: 'ポイントが不足しています', profile, cost };
  }

  const updated: PlayerProfile = {
    ...profile,
    upgradeLevels: { ...profile.upgradeLevels, [id]: currentLevel + 1 },
    upgradePointsSpent: profile.upgradePointsSpent + cost,
  };

  return { success: true, profile: updated, cost };
}

export function awardPointsFromRun(
  profile: PlayerProfile,
  score: number,
  cleared: boolean,
): PlayerProfile {
  return {
    ...profile,
    totalScoreEarned: profile.totalScoreEarned + score,
    runsCompleted: cleared ? profile.runsCompleted + 1 : profile.runsCompleted,
    runsAttempted: profile.runsAttempted + 1,
  };
}
