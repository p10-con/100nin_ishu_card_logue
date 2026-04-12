import type { Card } from '../../core/types/card';

const ATTR_LABELS: Record<string, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬',
  love: '恋', travel: '旅', lament: '哀', nature: '自然', misc: '雑',
};

export function renderCard(card: Card, options: {
  selected?: boolean;
  inHand?: boolean;
  onClick?: (card: Card) => void;
} = {}): HTMLElement {
  const el = document.createElement('div');
  el.className = 'card' + (options.selected ? ' selected' : '') + (options.inHand ? ' in-hand' : '');
  el.dataset.rarity = card.rarity;
  el.dataset.cardId = card.id;

  const attrLabel = ATTR_LABELS[card.primaryAttribute] ?? card.primaryAttribute;
  const translation = card.poem.modernTranslation ?? '';

  el.innerHTML = `
    <div class="card-number">第${card.poemNumber}首</div>
    <div class="card-poet">${card.poet.name}</div>
    <div class="card-poem">
      <div class="upper">${card.poem.upper}</div>
      <div class="lower">${card.poem.lower}</div>
    </div>
    <div class="card-translation-wrap">
      <button class="card-translation-toggle" title="現代語訳を見る">訳</button>
      <div class="card-translation" hidden>${translation}</div>
    </div>
    <div class="card-attr attr-${card.primaryAttribute}">${attrLabel}</div>
    <div class="card-stats">
      <div class="card-stat"><span class="card-stat-label">攻</span><span class="card-stat-value">${card.stats.attack}</span></div>
      <div class="card-stat"><span class="card-stat-label">守</span><span class="card-stat-value">${card.stats.defense}</span></div>
      <div class="card-stat"><span class="card-stat-label">雅</span><span class="card-stat-value">${card.stats.elegance}</span></div>
      <div class="card-stat"><span class="card-stat-label">哀</span><span class="card-stat-value">${card.stats.pathos}</span></div>
    </div>
    <div class="card-energy">${card.stats.energy}</div>
  `;

  // 訳ボタンのトグル（クリック伝播を止めてカード選択と分離）
  const toggleBtn = el.querySelector<HTMLButtonElement>('.card-translation-toggle')!;
  const translationEl = el.querySelector<HTMLElement>('.card-translation')!;
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const hidden = translationEl.hidden;
    translationEl.hidden = !hidden;
    toggleBtn.classList.toggle('active', !hidden === false ? false : true);
    toggleBtn.textContent = hidden ? '閉' : '訳';
  });

  if (options.onClick) {
    el.addEventListener('click', () => options.onClick!(card));
  }

  return el;
}
