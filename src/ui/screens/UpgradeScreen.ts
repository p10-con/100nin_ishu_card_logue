import { store } from '../../store/GameStore';
import { applyUpgrade, saveProfile } from '../../core/engine/ProfileManager';
import { UPGRADES } from '../../core/engine/UpgradeCatalog';
import { getAvailablePoints, getUpgradeLevel } from '../../core/types/profile';
import type { UpgradeId } from '../../core/types/profile';
import type { UpgradeDef } from '../../core/engine/UpgradeCatalog';

export function renderUpgradeScreen(container: HTMLElement): void {
  const render = () => {
    const { playerProfile } = store.getState();
    if (!playerProfile) return;

    const available = getAvailablePoints(playerProfile);

    const deckUpgrades = UPGRADES.filter(u => u.category === 'deck');
    const combatUpgrades = UPGRADES.filter(u => u.category === 'combat');
    const attrUpgrades = UPGRADES.filter(u => u.category === 'attribute');

    container.innerHTML = `
      <div class="screen upgrade-screen">
        <div class="upgrade-header">
          <h2>強化の間</h2>
          <div class="upgrade-points-display">
            <span class="upgrade-points-label">強化ポイント</span>
            <span class="upgrade-points-value">${available}</span>
          </div>
          <div class="upgrade-stats-sub">
            累計スコア ${playerProfile.totalScoreEarned} ／
            クリア ${playerProfile.runsCompleted} 回 ／
            挑戦 ${playerProfile.runsAttempted} 回
          </div>
        </div>

        <div class="upgrade-body">
          <section class="upgrade-category">
            <h3 class="upgrade-category-title">📚 デッキ強化</h3>
            <div class="upgrade-grid" id="cat-deck"></div>
          </section>

          <section class="upgrade-category">
            <h3 class="upgrade-category-title">⚡ 詠唱強化</h3>
            <div class="upgrade-grid" id="cat-combat"></div>
          </section>

          <section class="upgrade-category">
            <h3 class="upgrade-category-title">🌸 属性習熟</h3>
            <div class="upgrade-grid upgrade-grid-attr" id="cat-attr"></div>
          </section>
        </div>

        <div class="upgrade-footer">
          <button class="btn btn-sm" id="btn-upgrade-back">← ホームへ戻る</button>
        </div>
      </div>
    `;

    renderCategory(container, '#cat-deck', deckUpgrades, playerProfile.upgradeLevels, available);
    renderCategory(container, '#cat-combat', combatUpgrades, playerProfile.upgradeLevels, available);
    renderCategory(container, '#cat-attr', attrUpgrades, playerProfile.upgradeLevels, available);

    container.querySelector('#btn-upgrade-back')!.addEventListener('click', () => {
      store.setState({ screen: 'home' });
    });

    container.querySelectorAll<HTMLElement>('[data-upgrade-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.upgradeId as UpgradeId;
        const { playerProfile } = store.getState();
        if (!playerProfile) return;

        const result = applyUpgrade(playerProfile, id);
        if (result.success) {
          saveProfile(result.profile);
          store.setState({ playerProfile: result.profile });
          render();
        }
      });
    });
  };

  render();
}

function renderCategory(
  container: HTMLElement,
  selector: string,
  upgrades: UpgradeDef[],
  levels: Partial<Record<UpgradeId, number>>,
  available: number,
): void {
  const el = container.querySelector<HTMLElement>(selector);
  if (!el) return;

  el.innerHTML = upgrades.map(u => renderUpgradeCard(u, levels, available)).join('');
}

function renderUpgradeCard(
  u: UpgradeDef,
  levels: Partial<Record<UpgradeId, number>>,
  available: number,
): string {
  const currentLevel = getUpgradeLevel({ version: 1, upgradeLevels: levels, totalScoreEarned: 0, upgradePointsSpent: 0, runsCompleted: 0, runsAttempted: 0 }, u.id);
  const isMax = currentLevel >= u.maxLevel;
  const cost = isMax ? 0 : u.cost(currentLevel);
  const canAfford = available >= cost;
  const nextLevel = Math.min(currentLevel + 1, u.maxLevel);

  const progressPct = Math.round((currentLevel / u.maxLevel) * 100);

  return `
    <div class="upgrade-card${isMax ? ' maxed' : ''}">
      <div class="upgrade-card-icon">${u.icon}</div>
      <div class="upgrade-card-body">
        <div class="upgrade-card-name">${u.name}</div>
        <div class="upgrade-card-effect">${u.effectLabel(currentLevel)}</div>
        ${!isMax ? `<div class="upgrade-card-next">Lv${nextLevel}: ${u.effectLabel(nextLevel)}</div>` : ''}
        <div class="upgrade-progress-wrap">
          <div class="upgrade-progress-bar" style="width:${progressPct}%"></div>
        </div>
        <div class="upgrade-level-text">Lv ${currentLevel} / ${u.maxLevel}</div>
      </div>
      <div class="upgrade-card-action">
        ${isMax
          ? '<span class="upgrade-maxed-badge">MAX</span>'
          : `<button class="btn btn-sm upgrade-btn${canAfford ? '' : ' disabled'}"
              data-upgrade-id="${u.id}"
              ${canAfford ? '' : 'disabled'}>
              強化 <span class="upgrade-cost">${cost}P</span>
            </button>`
        }
      </div>
    </div>
  `;
}
