import type { Card } from '../../core/types/card';
import type { Theme } from '../../core/types/poem';
import { store } from '../../store/GameStore';
import { getCardDb } from '../../core/engine/CardFactory';
import { buildDeck, analyzeDeck } from '../../core/engine/DeckAnalyzer';
import { renderCard } from '../components/CardView';

const DECK_SIZE = 10;

const FILTERS: { label: string; value: string }[] = [
  { label: 'すべて', value: 'all' },
  { label: '春', value: 'spring' },
  { label: '夏', value: 'summer' },
  { label: '秋', value: 'autumn' },
  { label: '冬', value: 'winter' },
  { label: '恋', value: 'love' },
  { label: '旅', value: 'travel' },
  { label: '哀', value: 'lament' },
  { label: '自然', value: 'nature' },
  { label: 'レジェンダリー', value: 'legendary' },
  { label: 'エピック', value: 'epic' },
];

export function renderDeckBuilderScreen(container: HTMLElement): void {
  const allCards = getCardDb();

  // ローカル状態 (storeに書かない → 再描画ループを防ぐ)
  let selectedCards: Card[] = [];
  let activeFilter = 'all';

  const rebuild = () => {
    const grid = container.querySelector<HTMLElement>('.card-grid');
    const counter = container.querySelector<HTMLElement>('.count-num');
    const startBtn = container.querySelector<HTMLButtonElement>('#btn-start-run');

    if (!grid || !counter || !startBtn) return;

    const filtered = filterCards(allCards, activeFilter);

    grid.innerHTML = '';
    for (const card of filtered) {
      const isSelected = selectedCards.some(c => c.id === card.id);
      const el = renderCard(card, {
        selected: isSelected,
        onClick: (c) => toggleCard(c),
      });
      grid.appendChild(el);
    }

    const count = selectedCards.length;
    counter.textContent = String(count);
    counter.className = 'count-num' + (count === DECK_SIZE ? ' full' : '');
    startBtn.disabled = count !== DECK_SIZE;

    if (count > 0) {
      updateDeckPreview(container, selectedCards);
    }
  };

  const toggleCard = (card: Card) => {
    const idx = selectedCards.findIndex(c => c.id === card.id);
    if (idx >= 0) {
      selectedCards = selectedCards.filter((_, i) => i !== idx);
    } else if (selectedCards.length < DECK_SIZE) {
      selectedCards = [...selectedCards, card];
    } else {
      return;
    }
    rebuild();
  };

  container.innerHTML = `
    <div class="screen deck-builder-screen">
      <div class="deck-builder-header">
        <h2>デッキ構築</h2>
        <div class="deck-count">
          <span class="count-num">0</span> / ${DECK_SIZE}枚
        </div>
      </div>
      <div class="filter-bar"></div>
      <div id="deck-preview" style="width:100%;margin-bottom:12px;"></div>
      <div class="card-grid"></div>
      <div class="deck-footer">
        <button class="btn" id="btn-back">戻る</button>
        <button class="btn" id="btn-start-run" disabled>出陣する</button>
      </div>
    </div>
  `;

  // フィルタボタン
  const filterBar = container.querySelector('.filter-bar')!;
  for (const f of FILTERS) {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (f.value === 'all' ? ' active' : '');
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      activeFilter = f.value;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rebuild();
    });
    filterBar.appendChild(btn);
  }

  container.querySelector('#btn-back')!.addEventListener('click', () => {
    store.setState({ screen: 'title' });
  });

  container.querySelector('#btn-start-run')!.addEventListener('click', () => {
    if (selectedCards.length !== DECK_SIZE) return;
    buildDeck('player-deck', selectedCards, '選択デッキ'); // 未使用だが統計確認用に残す
    store.setState({ screen: 'title' }); // DeckBuilderは現在使用しないのでタイトルに戻す
  });

  rebuild();
}

function filterCards(cards: Card[], filter: string): Card[] {
  if (filter === 'all') return cards;
  if (['legendary', 'epic', 'rare', 'uncommon', 'common'].includes(filter)) {
    return cards.filter(c => c.rarity === filter);
  }
  return cards.filter(c => c.synergyTags.themes.includes(filter as Theme));
}

function updateDeckPreview(container: HTMLElement, cards: Card[]): void {
  const preview = container.querySelector<HTMLElement>('#deck-preview');
  if (!preview || cards.length === 0) return;

  const stats = analyzeDeck(cards);
  const ATTR_LABELS: Record<string, string> = {
    spring: '春', summer: '夏', autumn: '秋', winter: '冬',
    love: '恋', travel: '旅', lament: '哀', nature: '自然', misc: '雑',
  };

  const synergyHtml = stats.synergyBonuses.length > 0
    ? `<div class="synergy-list">${stats.synergyBonuses.map(s =>
        `<span class="synergy-tag">✦ ${s.name}</span>`
      ).join('')}</div>`
    : '<p style="font-size:0.75rem;color:var(--color-text-muted)">シナジーなし</p>';

  preview.innerHTML = `
    <div class="deck-stats-panel">
      <h3>デッキ統計</h3>
      <div class="stats-grid">
        <div class="stat-item"><div class="stat-label">総攻撃力</div><div class="stat-value">${stats.totalAttack}</div></div>
        <div class="stat-item"><div class="stat-label">総守備力</div><div class="stat-value">${stats.totalDefense}</div></div>
        <div class="stat-item"><div class="stat-label">平均優雅</div><div class="stat-value">${stats.avgElegance}</div></div>
        <div class="stat-item"><div class="stat-label">平均哀愁</div><div class="stat-value">${stats.avgPathos}</div></div>
        <div class="stat-item"><div class="stat-label">一体感</div><div class="stat-value">${stats.cohesion}</div></div>
        <div class="stat-item"><div class="stat-label">多様性</div><div class="stat-value">${stats.versatility}</div></div>
        <div class="stat-item"><div class="stat-label">主属性</div><div class="stat-value attr-${stats.dominantAttribute}" style="font-size:0.9rem;padding:2px 8px;border-radius:8px">${ATTR_LABELS[stats.dominantAttribute] ?? stats.dominantAttribute}</div></div>
        <div class="stat-item"><div class="stat-label">レアリティ</div><div class="stat-value">${stats.rarityScore}</div></div>
      </div>
      ${synergyHtml}
    </div>
  `;
}
