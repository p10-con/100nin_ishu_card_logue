import { store } from '../../store/GameStore';
import { DUNGEONS } from '../../data/dungeons/dungeons';
import { getCollection } from '../../core/engine/SaveManager';
import { startInitialDraft } from './DraftScreen';
import type { DungeonDef } from '../../core/types/dungeon';

const DIFF_STARS: Record<number, string> = { 1: '★☆☆☆', 2: '★★☆☆', 3: '★★★☆', 4: '★★★★' };
const DIFF_COLOR: Record<number, string> = { 1: 'var(--color-spring)', 2: 'var(--color-gold)', 3: 'var(--color-autumn)', 4: 'var(--color-red)' };

export function renderHomeScreen(container: HTMLElement): void {
  const collection = getCollection();
  const collectedCount = collection.size;
  const totalPoems = 100;
  const pct = Math.round((collectedCount / totalPoems) * 100);
  const { persistentScore } = store.getState();

  let selectedDungeon: DungeonDef = DUNGEONS[1]; // デフォルト: 嵐の旅路

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
            <div class="total-score">累計スコア: <strong>${persistentScore}</strong></div>
          </section>

          <!-- ダンジョン選択 -->
          <section class="home-section dungeon-section">
            <h3 class="home-section-title">🗺️ 旅先を選ぶ</h3>
            <div class="dungeon-list" id="dungeon-list">
              ${DUNGEONS.map(d => `
                <div class="dungeon-card${!d.unlocked ? ' locked' : ''}${d.id === selectedDungeon.id ? ' selected' : ''}"
                     data-dungeon-id="${d.id}">
                  <div class="dungeon-icon">${d.icon}</div>
                  <div class="dungeon-info">
                    <div class="dungeon-name">${d.name}</div>
                    <div class="dungeon-subtitle">${d.subtitle}</div>
                    <div class="dungeon-diff" style="color:${DIFF_COLOR[d.difficulty]}">${DIFF_STARS[d.difficulty]} ${d.difficultyLabel}</div>
                  </div>
                  ${!d.unlocked ? '<div class="dungeon-lock">🔒</div>' : ''}
                </div>
              `).join('')}
            </div>
            <div class="dungeon-detail" id="dungeon-detail">
              ${renderDungeonDetail(selectedDungeon)}
            </div>
          </section>

        </div>

        <div class="home-footer">
          <button class="btn btn-large" id="btn-journey">旅に出る ➤</button>
          <div class="home-sub-btns">
            <button class="btn btn-sm" id="btn-saveload">セーブ / ロード</button>
            <button class="btn btn-sm" id="btn-back-title">タイトルへ</button>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    // ダンジョン選択
    container.querySelectorAll<HTMLElement>('.dungeon-card').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.dungeonId;
        const dungeon = DUNGEONS.find(d => d.id === id);
        if (!dungeon || !dungeon.unlocked) return;

        selectedDungeon = dungeon;
        container.querySelectorAll('.dungeon-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');

        const detail = container.querySelector<HTMLElement>('#dungeon-detail');
        if (detail) detail.innerHTML = renderDungeonDetail(selectedDungeon);
      });
    });

    // 旅に出る
    container.querySelector('#btn-journey')?.addEventListener('click', () => {
      store.setState({ runState: null, battleLog: [], selectedDungeon });
      startInitialDraft(container);
    });

    // セーブ/ロード
    container.querySelector('#btn-saveload')?.addEventListener('click', () => {
      store.setState({ screen: 'save_load' });
    });

    // タイトルへ
    container.querySelector('#btn-back-title')?.addEventListener('click', () => {
      store.setState({ screen: 'title' });
    });
  };

  render();
}

function renderDungeonDetail(d: DungeonDef): string {
  const bonusTxt = d.themeBonus
    ? `<div class="dungeon-detail-bonus">テーマボーナス：${THEME_LABEL[d.themeBonus] ?? d.themeBonus}の句が強化される</div>`
    : '';
  return `
    <div class="dungeon-detail-content">
      <div class="dungeon-detail-name">${d.icon} ${d.name}</div>
      <div class="dungeon-detail-desc">${d.description}</div>
      ${bonusTxt}
      <div class="dungeon-detail-info">マップ深度: ${d.mapDepth}層　／　難度倍率: ×${d.enemyScaling}</div>
    </div>
  `;
}

const THEME_LABEL: Record<string, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬',
  love: '恋', travel: '旅', lament: '哀', nature: '自然', misc: '雑',
};
