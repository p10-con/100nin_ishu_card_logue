import { store } from '../../store/GameStore';
import { dispatch } from '../../core/engine/GameRunner';
import { renderBattleScreen } from './BattleScreen';
import { renderInRunDraftScreen } from './DraftScreen';
import { addToCollection } from '../../core/engine/SaveManager';

const NODE_ICONS: Record<string, string> = {
  battle: '⚔️', elite: '👹', boss: '💀',
  rest: '🌸', shop: '🎋', event: '📜',
};
const NODE_LABELS: Record<string, string> = {
  battle: '戦い', elite: '強敵', boss: '大将',
  rest: '休息', shop: '店', event: '出来事',
};

export function renderRunScreen(container: HTMLElement): void {
  const { runState } = store.getState();

  if (!runState) {
    store.setState({ screen: 'title' });
    return;
  }

  const { phase } = runState;

  // フェーズに応じた画面ルーティング
  if (phase === 'player_turn' || phase === 'battle_start') {
    renderBattleScreen(container);
    return;
  }
  if (phase === 'game_over') {
    renderGameOver(container, runState.score);
    return;
  }
  if (phase === 'run_complete') {
    renderRunComplete(container, runState.score);
    return;
  }
  if (phase === 'battle_end') {
    renderAfterBattle(container);
    return;
  }
  if (phase === 'draft' || phase === 'draft_discard') {
    renderInRunDraftScreen(container);
    return;
  }

  // マップ画面
  renderMapScreen(container, runState);
}

function renderMapScreen(container: HTMLElement, runState: NonNullable<ReturnType<typeof store.getState>['runState']>): void {
  const deckSize = runState.deck.cards.length;

  container.innerHTML = `
    <div class="screen map-screen">
      <div class="map-header">
        <h2>流浪の旅</h2>
        <div class="mini-stats">
          <span class="mini-stat">HP: <span>${runState.player.currentHp}/${runState.player.maxHp}</span></span>
          <span class="mini-stat">手札: <span>${deckSize}首</span></span>
          <span class="mini-stat">スコア: <span>${runState.score}</span></span>
        </div>
      </div>
      <div class="map-grid" id="map-grid"></div>
      <div class="map-footer">
        <button class="btn btn-sm" id="btn-map-save">💾 セーブ</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-map-save')?.addEventListener('click', () => {
    store.setState({ screen: 'save_load' });
  });

  const mapGrid = container.querySelector<HTMLElement>('#map-grid')!;
  for (const row of runState.map) {
    const rowEl = document.createElement('div');
    rowEl.className = 'map-row';
    for (const node of row) {
      const nodeEl = document.createElement('div');
      nodeEl.className = `map-node node-${node.type}` +
        (node.cleared ? ' cleared' : '') +
        (!node.available && !node.cleared ? ' locked' : '') +
        (node.available && !node.cleared ? ' available' : '');

      nodeEl.innerHTML = `
        <div class="map-node-icon">${NODE_ICONS[node.type] ?? '?'}</div>
        <div class="map-node-label">${NODE_LABELS[node.type] ?? node.type}</div>
      `;

      if (node.available && !node.cleared) {
        nodeEl.addEventListener('click', () => {
          const { runState } = store.getState();
          if (!runState) return;
          const result = dispatch(runState, { type: 'ENTER_NODE', nodeId: node.id });
          for (const ev of result.events) store.addLog(ev.message);
          store.setState({ runState: result.state });

          if (node.type === 'rest') {
            renderRestChoice(container);
          } else {
            renderBattleScreen(container);
          }
        });
      }

      rowEl.appendChild(nodeEl);
    }
    mapGrid.appendChild(rowEl);
  }
}

// 戦闘勝利後の画面：ドラフトか休憩か選ぶ
function renderAfterBattle(container: HTMLElement): void {
  const { runState } = store.getState();
  if (!runState) return;

  const deckSize = runState.deck.cards.length;
  const canDraft = true; // 常にドラフト可能

  container.innerHTML = `
    <div class="screen rest-screen">
      <h2>⚔️ 勝利</h2>
      <p style="color:var(--color-text-dim)">
        HP: ${runState.player.currentHp} / ${runState.player.maxHp}　／
        デッキ: ${deckSize}/10首
      </p>
      <div style="display:flex;flex-direction:column;gap:12px;align-items:center;margin-top:8px">
        ${canDraft ? `
          <button class="btn" id="btn-draft">
            🎴 新しい句を選ぶ${deckSize >= 10 ? '（1首と交換）' : `（${deckSize + 1}首目）`}
          </button>
        ` : ''}
        <button class="btn btn-sm" id="btn-skip">そのまま進む</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-draft')?.addEventListener('click', () => {
    const { runState } = store.getState();
    if (!runState) return;
    const result = dispatch(runState, { type: 'START_DRAFT' });
    for (const ev of result.events) store.addLog(ev.message);
    store.setState({ runState: result.state });
    renderInRunDraftScreen(container);
  });

  container.querySelector('#btn-skip')?.addEventListener('click', () => {
    const { runState } = store.getState();
    if (!runState) return;
    const result = dispatch(runState, { type: 'DRAFT_SKIP' });
    store.setState({ runState: result.state });
    renderRunScreen(container);
  });
}

function renderRestChoice(container: HTMLElement): void {
  const { runState } = store.getState();
  if (!runState) return;

  container.innerHTML = `
    <div class="screen rest-screen">
      <h2>🌸 休憩所</h2>
      <p style="color:var(--color-text-dim)">
        HP: ${runState.player.currentHp} / ${runState.player.maxHp}
      </p>
      <p style="color:var(--color-text-dim);font-size:0.9rem">
        休息すると HP が 30% 回復します
      </p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn" id="btn-rest">休む (HP+30%)</button>
        <button class="btn btn-sm" id="btn-skip-rest">そのまま進む</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-rest')!.addEventListener('click', () => {
    const { runState } = store.getState();
    if (!runState) return;
    const result = dispatch(runState, { type: 'TAKE_REST' });
    for (const ev of result.events) store.addLog(ev.message);
    store.setState({ runState: result.state });
    renderRunScreen(container);
  });

  container.querySelector('#btn-skip-rest')!.addEventListener('click', () => {
    const { runState } = store.getState();
    if (!runState) return;
    const result = dispatch(runState, { type: 'DRAFT_SKIP' });
    store.setState({ runState: result.state });
    renderRunScreen(container);
  });
}

function saveCollectionFromRun(): void {
  const { runState } = store.getState();
  if (runState) {
    const nums = runState.deck.cards.map(c => c.poemNumber);
    addToCollection(nums);
  }
}

function renderGameOver(container: HTMLElement, score: number): void {
  saveCollectionFromRun();
  const { persistentScore } = store.getState();
  const newTotal = persistentScore + score;

  container.innerHTML = `
    <div class="screen result-screen game-over">
      <h1>敗北</h1>
      <div class="result-score">${score}</div>
      <p style="color:var(--color-text-dim)">スコア　（累計: ${newTotal}）</p>
      <button class="btn" id="btn-retry">もう一度</button>
      <button class="btn btn-sm" id="btn-home" style="margin-top:8px">ホームへ</button>
    </div>
  `;
  store.setState({ persistentScore: newTotal });
  container.querySelector('#btn-retry')!.addEventListener('click', () => {
    store.setState({ runState: null, screen: 'home' });
  });
  container.querySelector('#btn-home')!.addEventListener('click', () => {
    store.setState({ runState: null, screen: 'home' });
  });
}

function renderRunComplete(container: HTMLElement, score: number): void {
  saveCollectionFromRun();
  const { persistentScore } = store.getState();
  const newTotal = persistentScore + score + 200; // クリアボーナス

  container.innerHTML = `
    <div class="screen result-screen run-complete">
      <h1>旅の終わり</h1>
      <div class="result-score">${score}</div>
      <p style="color:var(--color-text-dim)">最終スコア　（累計: ${newTotal}）</p>
      <p style="color:var(--color-gold);font-family:var(--font-serif);font-size:1.1rem;margin:16px 0">
        百首の声が共鳴し、新たな境地に達した。
      </p>
      <button class="btn" id="btn-again">再び旅へ</button>
      <button class="btn btn-sm" id="btn-home" style="margin-top:8px">ホームへ</button>
    </div>
  `;
  store.setState({ persistentScore: newTotal });
  container.querySelector('#btn-again')!.addEventListener('click', () => {
    store.setState({ runState: null, screen: 'home' });
  });
  container.querySelector('#btn-home')!.addEventListener('click', () => {
    store.setState({ runState: null, screen: 'home' });
  });
}
