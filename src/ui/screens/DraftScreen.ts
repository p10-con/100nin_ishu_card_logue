import type { Card } from '../../core/types/card';
import { store, type InitialDraftState } from '../../store/GameStore';
import { generateDraftOffers, createRun, dispatch } from '../../core/engine/GameRunner';
import { getInitialDeckSize } from '../../core/engine/UpgradeCatalog';
import { getCardDb } from '../../core/engine/CardFactory';
import { renderCard } from '../components/CardView';
import { renderRunScreen } from './RunScreen';

// ===== 初期ドラフト（ゲーム開始時の3ラウンド） =====

export function startInitialDraft(container: HTMLElement): void {
  getCardDb(); // 初期化
  const { playerProfile } = store.getState();
  const ROUNDS_TOTAL = getInitialDeckSize(playerProfile?.upgradeLevels ?? {});
  const OFFERS_COUNT = 3;

  const initialState: InitialDraftState = {
    roundsTotal: ROUNDS_TOTAL,
    roundsDone: 0,
    offersCount: OFFERS_COUNT,
    offers: generateDraftOffers([], OFFERS_COUNT),
    draftedCards: [],
  };

  store.setState({ initialDraft: initialState, screen: 'initial_draft' });
  renderInitialDraftScreen(container);
}

export function renderInitialDraftScreen(container: HTMLElement): void {
  const { initialDraft } = store.getState();
  if (!initialDraft) return;

  const { roundsDone, roundsTotal, offersCount, offers, draftedCards } = initialDraft;
  const currentRound = roundsDone + 1;

  container.innerHTML = `
    <div class="screen draft-screen">
      <div class="draft-header">
        <div class="draft-round-badge">
          第 ${currentRound} / ${roundsTotal} 首
        </div>
        <h2>句を選べ</h2>
        <p class="draft-hint">${offersCount}枚の中から1枚を選んでデッキに加える</p>
      </div>

      <div class="draft-offers" id="draft-offers"></div>

      ${draftedCards.length > 0 ? `
        <div class="draft-current-deck">
          <div class="draft-deck-label">選択済み ${draftedCards.length}首</div>
          <div class="draft-deck-mini" id="draft-deck-mini"></div>
        </div>
      ` : ''}
    </div>
  `;

  const offersEl = container.querySelector<HTMLElement>('#draft-offers')!;
  for (const card of offers) {
    const el = renderCard(card, {
      onClick: (c) => pickInitialCard(c, container),
    });
    el.classList.add('draft-offer-card');
    offersEl.appendChild(el);
  }

  // 選択済みミニ表示
  const miniEl = container.querySelector<HTMLElement>('#draft-deck-mini');
  if (miniEl) {
    for (const card of draftedCards) {
      const el = renderCard(card);
      el.style.transform = 'scale(0.75)';
      el.style.transformOrigin = 'top left';
      el.style.pointerEvents = 'none';
      miniEl.appendChild(el);
    }
  }
}

function pickInitialCard(card: Card, container: HTMLElement): void {
  const { initialDraft } = store.getState();
  if (!initialDraft) return;

  const newDraftedCards = [...initialDraft.draftedCards, card];
  const newRoundsDone = initialDraft.roundsDone + 1;

  if (newRoundsDone >= initialDraft.roundsTotal) {
    // 全ラウンド完了 → ラン開始
    store.setState({ initialDraft: null });
    const { playerProfile } = store.getState();
    const run = createRun(newDraftedCards, playerProfile ?? undefined);
    store.setState({ runState: run, battleLog: [], screen: 'run' });
    renderRunScreen(container);
  } else {
    // 次のラウンドへ
    const newOffers = generateDraftOffers(newDraftedCards, initialDraft.offersCount);
    store.setState({
      initialDraft: {
        ...initialDraft,
        roundsDone: newRoundsDone,
        offers: newOffers,
        draftedCards: newDraftedCards,
      },
    });
    renderInitialDraftScreen(container);
  }
}

// ===== インラン ドラフト（ステージクリア後） =====

export function renderInRunDraftScreen(container: HTMLElement): void {
  const { runState } = store.getState();
  if (!runState) return;

  if (runState.phase === 'draft') {
    renderOfferStep(container);
  } else {
    renderDiscardStep(container, null);
  }
}

// Step 1: 加える句を選ぶ
function renderOfferStep(container: HTMLElement): void {
  const { runState } = store.getState();
  if (!runState) return;
  const { draftOffers, deck, deckCapacity } = runState;
  const isFull = deck.cards.length >= deckCapacity;

  container.innerHTML = `
    <div class="screen draft-screen">
      <div class="draft-header">
        <div class="draft-round-badge">ステージクリア</div>
        <h2>句を選べ</h2>
        <p class="draft-hint">
          ${isFull
            ? `デッキ満杯（${deck.cards.length}/${deckCapacity}）— 選んだ句と1首を交換`
            : `${draftOffers.length}枚の中から1枚を選んでデッキに加える（${deck.cards.length}/${deckCapacity}）`
          }
        </p>
      </div>
      <div class="draft-offers" id="draft-offers"></div>
      <div style="text-align:center;margin-top:16px">
        <button class="btn btn-sm" id="btn-draft-skip" style="opacity:0.6">スキップ</button>
      </div>
    </div>
  `;

  const offersEl = container.querySelector<HTMLElement>('#draft-offers')!;
  for (const card of draftOffers) {
    const el = renderCard(card, { onClick: (c) => pickInRunCard(c, container) });
    el.classList.add('draft-offer-card');
    offersEl.appendChild(el);
  }

  container.querySelector('#btn-draft-skip')!.addEventListener('click', () => {
    const { runState } = store.getState();
    if (!runState) return;
    const result = dispatch(runState, { type: 'DRAFT_SKIP' });
    for (const ev of result.events) store.addLog(ev.message);
    store.setState({ runState: result.state });
    renderRunScreen(container);
  });
}

// Step 2: 外す句を選ぶ / Step 3: 確認
function renderDiscardStep(container: HTMLElement, selectedForDiscard: Card | null): void {
  const { runState } = store.getState();
  if (!runState || !runState.pendingDraftCard) return;
  const { deck, pendingDraftCard } = runState;

  if (selectedForDiscard) {
    // Step 3: 確認画面
    container.innerHTML = `
      <div class="screen draft-screen">
        <div class="draft-header">
          <div class="draft-round-badge discard">交換の確認</div>
          <h2>この交換でよいですか？</h2>
        </div>
        <div class="swap-confirm-wrap">
          <div class="swap-confirm-col">
            <div class="swap-confirm-label swap-add-label">✦ デッキに加える</div>
            <div id="swap-add-wrap"></div>
          </div>
          <div class="swap-confirm-arrow">⇄</div>
          <div class="swap-confirm-col">
            <div class="swap-confirm-label swap-remove-label">✕ デッキから外す</div>
            <div id="swap-remove-wrap"></div>
          </div>
        </div>
        <div class="swap-confirm-btns">
          <button class="btn" id="btn-swap-confirm">確定する</button>
          <button class="btn btn-sm" id="btn-swap-back" style="opacity:0.7">戻る</button>
        </div>
      </div>
    `;

    const addWrap = container.querySelector<HTMLElement>('#swap-add-wrap')!;
    const addEl = renderCard(pendingDraftCard);
    addEl.style.pointerEvents = 'none';
    addWrap.appendChild(addEl);

    const removeWrap = container.querySelector<HTMLElement>('#swap-remove-wrap')!;
    const removeEl = renderCard(selectedForDiscard);
    removeEl.style.pointerEvents = 'none';
    removeWrap.appendChild(removeEl);

    container.querySelector('#btn-swap-confirm')!.addEventListener('click', () => {
      const { runState } = store.getState();
      if (!runState) return;
      const result = dispatch(runState, { type: 'DRAFT_DISCARD', cardId: selectedForDiscard.id });
      for (const ev of result.events) store.addLog(ev.message);
      store.setState({ runState: result.state });
      renderRunScreen(container);
    });

    container.querySelector('#btn-swap-back')!.addEventListener('click', () => {
      renderDiscardStep(container, null);
    });

  } else {
    // Step 2: 外す句を選ぶ
    container.innerHTML = `
      <div class="screen draft-screen">
        <div class="draft-header">
          <div class="draft-round-badge discard">交換 — デッキ (${deck.cards.length}/${runState.deckCapacity})</div>
          <h2>外す句を選べ</h2>
          <p class="draft-hint">1枚を選んで手放し、新しい句と入れ替える</p>
        </div>
        <div class="draft-swap-pending">
          <div class="swap-pending-label">加わる句</div>
          <div id="pending-card-wrap"></div>
        </div>
        <div class="draft-offers" id="draft-offers"></div>
        <div style="text-align:center;margin-top:16px">
          <button class="btn btn-sm" id="btn-draft-skip" style="opacity:0.6">交換をやめる</button>
        </div>
      </div>
    `;

    const pendingWrap = container.querySelector<HTMLElement>('#pending-card-wrap')!;
    const pendingEl = renderCard(pendingDraftCard);
    pendingEl.style.pointerEvents = 'none';
    pendingWrap.appendChild(pendingEl);

    const offersEl = container.querySelector<HTMLElement>('#draft-offers')!;
    for (const card of deck.cards) {
      const el = renderCard(card, {
        onClick: (c) => renderDiscardStep(container, c),
      });
      el.classList.add('draft-offer-card');
      offersEl.appendChild(el);
    }

    container.querySelector('#btn-draft-skip')!.addEventListener('click', () => {
      const { runState } = store.getState();
      if (!runState) return;
      const result = dispatch(runState, { type: 'DRAFT_SKIP' });
      for (const ev of result.events) store.addLog(ev.message);
      store.setState({ runState: result.state });
      renderRunScreen(container);
    });
  }
}

function pickInRunCard(card: Card, container: HTMLElement): void {
  const { runState } = store.getState();
  if (!runState) return;
  const result = dispatch(runState, { type: 'DRAFT_PICK', cardId: card.id });
  for (const ev of result.events) store.addLog(ev.message);
  store.setState({ runState: result.state });

  if (result.state.phase === 'draft_discard') {
    renderDiscardStep(container, null);
  } else {
    renderRunScreen(container);
  }
}
