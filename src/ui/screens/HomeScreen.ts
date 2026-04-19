import { store } from '../../store/GameStore';
import { DUNGEONS } from '../../data/dungeons/dungeons';
import { getCollection } from '../../core/engine/SaveManager';
import { startInitialDraft } from './DraftScreen';
import type { DungeonDef } from '../../core/types/dungeon';
import { getAvailablePoints } from '../../core/types/profile';

const DIFF_STARS: Record<number, string> = { 1: '★☆☆☆', 2: '★★☆☆', 3: '★★★☆', 4: '★★★★' };
const DIFF_COLOR: Record<number, string> = {
  1: 'var(--attr-spring)',
  2: 'var(--color-gold)',
  3: 'var(--attr-autumn)',
  4: 'var(--color-red-bright)',
};
const DUNGEON_ATMOSPHERE: Record<string, string> = {
  'hana-no-michi':    'linear-gradient(135deg, #2a1a2a 0%, #1a2a1a 40%, #2a1810 100%)',
  'arashi-no-tabiji': 'linear-gradient(135deg, #0e1020 0%, #1a1628 40%, #0e0c08 100%)',
  'tsukiyo-no-kyochi':'linear-gradient(135deg, #0e1020 0%, #12182a 40%, #1a1020 100%)',
  'hyakki-no-utage':  'linear-gradient(135deg, #180808 0%, #200808 40%, #0e0c08 100%)',
};
const DUNGEON_ACCENT: Record<string, string> = {
  'hana-no-michi':    'var(--attr-spring)',
  'arashi-no-tabiji': 'var(--color-gold)',
  'tsukiyo-no-kyochi':'var(--attr-winter)',
  'hyakki-no-utage':  'var(--color-red-bright)',
};

export function renderHomeScreen(container: HTMLElement): void {
  const collection = getCollection();
  const collectedCount = collection.size;
  const totalPoems = 100;
  const pct = Math.round((collectedCount / totalPoems) * 100);
  const { persistentScore, playerProfile } = store.getState();
  const availablePoints = playerProfile ? getAvailablePoints(playerProfile) : 0;

  let selectedDungeon: DungeonDef = DUNGEONS[1];

  const render = () => {
    container.innerHTML = `
      <div class="screen home-screen">
        <div class="home-header">
          <h1 class="home-title">百人一首　カード刻</h1>
          <p class="home-subtitle">～ Hyakunin Isshu Roguelite ～</p>
        </div>

        <div class="home-body">

          <!-- コレクション -->
          <section class="home-section collection-section">
            <h3 class="home-section-title">📚 句集の記録</h3>
            <div class="collection-stats">
              <div class="collection-bar-wrap">
                <div class="collection-bar" style="width:${pct}%"></div>
              </div>
              <div class="collection-numbers">
                <span class="collection-count">${collectedCount}<span class="collection-total"> / ${totalPoems}</span></span>
                <span class="collection-pct">${pct}%</span>
              </div>
              <div class="collection-grid">
                ${Array.from({ length: totalPoems }, (_, i) => {
                  const num = i + 1;
                  const has = collection.has(num);
                  return `<div class="coll-dot${has ? ' collected' : ''}" title="第${num}首"></div>`;
                }).join('')}
              </div>
            </div>
            <div class="total-score">
              累計スコア: <strong>${persistentScore}</strong>
              　強化P: <strong class="upgrade-point-badge">${availablePoints}</strong>
            </div>
          </section>

          <!-- ダンジョン選択 -->
          <section class="home-section dungeon-section">
            <h3 class="home-section-title">🗺️ どの旅に出るか</h3>

            <div class="journey-tabs" id="journey-tabs">
              ${DUNGEONS.map(d => `
                <button class="journey-tab${d.id === selectedDungeon.id ? ' active' : ''}${!d.unlocked ? ' locked' : ''}"
                        data-dungeon-id="${d.id}"
                        style="--tab-accent:${DUNGEON_ACCENT[d.id] ?? 'var(--color-gold)'}">
                  <span class="journey-tab-icon">${d.unlocked ? d.icon : '🔒'}</span>
                  <span class="journey-tab-name">${d.name}</span>
                  <span class="journey-tab-diff" style="color:${DIFF_COLOR[d.difficulty]}">${d.difficultyLabel}</span>
                </button>
              `).join('')}
            </div>

            <div class="journey-hero" id="journey-hero">
              ${renderJourneyHero(selectedDungeon)}
            </div>
          </section>

        </div>

        <div class="home-footer">
          <button class="btn btn-journey" id="btn-journey"
                  style="--journey-accent:${DUNGEON_ACCENT[selectedDungeon.id] ?? 'var(--color-gold)'}">
            ${selectedDungeon.icon} 「${selectedDungeon.name}」へ旅立つ ➤
          </button>
          <div class="home-sub-btns">
            <button class="btn btn-sm" id="btn-upgrade">✦ 強化${availablePoints > 0 ? ` (${availablePoints}P)` : ''}</button>
            <button class="btn btn-sm" id="btn-saveload">セーブ / ロード</button>
            <button class="btn btn-sm" id="btn-back-title">タイトルへ</button>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    container.querySelectorAll<HTMLElement>('.journey-tab').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.dungeonId;
        const dungeon = DUNGEONS.find(d => d.id === id);
        if (!dungeon || !dungeon.unlocked) return;

        selectedDungeon = dungeon;
        container.querySelectorAll('.journey-tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');

        const hero = container.querySelector<HTMLElement>('#journey-hero');
        if (hero) {
          hero.style.animation = 'none';
          hero.offsetHeight; // reflow
          hero.style.animation = '';
          hero.innerHTML = renderJourneyHero(selectedDungeon);
        }

        const btn = container.querySelector<HTMLElement>('#btn-journey');
        if (btn) {
          btn.textContent = `${selectedDungeon.icon} 「${selectedDungeon.name}」へ旅立つ ➤`;
          (btn as HTMLElement).style.setProperty('--journey-accent', DUNGEON_ACCENT[selectedDungeon.id] ?? 'var(--color-gold)');
        }
      });
    });

    container.querySelector('#btn-journey')?.addEventListener('click', () => {
      store.setState({ runState: null, battleLog: [], selectedDungeon });
      startInitialDraft(container);
    });

    container.querySelector('#btn-upgrade')?.addEventListener('click', () => {
      store.setState({ screen: 'upgrade' });
    });

    container.querySelector('#btn-saveload')?.addEventListener('click', () => {
      store.setState({ screen: 'save_load' });
    });

    container.querySelector('#btn-back-title')?.addEventListener('click', () => {
      store.setState({ screen: 'title' });
    });
  };

  render();
}

function renderJourneyHero(d: DungeonDef): string {
  const accent = DUNGEON_ACCENT[d.id] ?? 'var(--color-gold)';
  const atmosphere = DUNGEON_ATMOSPHERE[d.id] ?? 'linear-gradient(135deg, #1a1610, #0e0c08)';
  const bonusTxt = d.themeBonus
    ? `<div class="journey-bonus">✦ ${THEME_LABEL[d.themeBonus] ?? d.themeBonus}の句が強化される</div>`
    : '';
  return `
    <div class="journey-hero-inner" style="background:${atmosphere};--hero-accent:${accent}">
      <div class="journey-hero-left">
        <div class="journey-hero-icon">${d.icon}</div>
        <div class="journey-hero-depth">
          <span class="journey-hero-depth-num">${d.mapDepth}</span>
          <span class="journey-hero-depth-label">層の旅</span>
        </div>
      </div>
      <div class="journey-hero-right">
        <div class="journey-hero-name">${d.name}</div>
        <div class="journey-hero-subtitle">${d.subtitle}</div>
        <div class="journey-hero-desc">${d.description}</div>
        <div class="journey-hero-meta">
          <span class="journey-hero-diff" style="color:${DIFF_COLOR[d.difficulty]}">
            ${DIFF_STARS[d.difficulty]}　${d.difficultyLabel}
          </span>
          <span class="journey-hero-scaling">敵強度 ×${d.enemyScaling}</span>
        </div>
        ${bonusTxt}
      </div>
    </div>
  `;
}

const THEME_LABEL: Record<string, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬',
  love: '恋', travel: '旅', lament: '哀', nature: '自然', misc: '雑',
};
