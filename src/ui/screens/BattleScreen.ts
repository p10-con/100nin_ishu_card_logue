import { store } from '../../store/GameStore';
import { dispatch } from '../../core/engine/GameRunner';
import { renderCard } from '../components/CardView';
import { renderRunScreen } from './RunScreen';

export function renderBattleScreen(container: HTMLElement): void {
  const { runState, battleLog } = store.getState();
  if (!runState || !runState.enemy) return;

  const { player, enemy, hand, drawPile, discardPile, turn, phase } = runState;
  const isPlayerTurn = phase === 'player_turn';

  const playerHpPct = Math.max(0, (player.currentHp / player.maxHp) * 100);
  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);

  container.innerHTML = `
    <div class="screen battle-screen">
      <div class="battle-top">
        <div class="player-panel">
          <div class="panel-name">あなた</div>
          <div class="hp-bar-wrap">
            <div class="hp-label"><span>HP</span><span>${player.currentHp} / ${player.maxHp}</span></div>
            <div class="hp-bar"><div class="hp-fill player" style="width:${playerHpPct}%"></div></div>
          </div>
          <div class="mini-stats">
            <span class="mini-stat">攻: <span>${player.attack}</span></span>
            <span class="mini-stat">守: <span>${player.defense}</span></span>
            <span class="mini-stat">雅: <span>${player.elegance}</span></span>
            <span class="mini-stat">哀: <span>${player.pathos}</span></span>
          </div>
        </div>

        <div style="display:flex;align-items:center;padding-top:20px;font-size:1.5rem;color:var(--color-text-muted)">VS</div>

        <div class="enemy-panel">
          <div class="panel-name">${enemy.name}</div>
          <div class="hp-bar-wrap">
            <div class="hp-label"><span>HP</span><span>${enemy.hp} / ${enemy.maxHp}</span></div>
            <div class="hp-bar"><div class="hp-fill" style="width:${enemyHpPct}%"></div></div>
          </div>
          <div class="enemy-intent">次の行動: ${enemy.intent.description}</div>
        </div>
      </div>

      <div class="battle-log-panel" id="battle-log">
        ${battleLog.map(l => `<p>${l}</p>`).join('')}
      </div>

      <div class="hand-area">
        <div class="hand-label">
          <span>手札 ${hand.length}枚</span>
          <span style="color:var(--color-text-muted)">山札 ${drawPile.length} / 捨て ${discardPile.length} / ターン ${turn + 1}</span>
        </div>
        <div class="hand-cards" id="hand-cards"></div>
        <div class="battle-actions">
          <button class="btn" id="btn-end-turn" ${!isPlayerTurn ? 'disabled' : ''}>
            ターン終了
          </button>
          <button class="btn btn-sm" id="btn-flee" style="opacity:0.5" disabled>
            逃げる
          </button>
        </div>
      </div>
    </div>
  `;

  // ログスクロール
  const logEl = container.querySelector<HTMLElement>('#battle-log');
  if (logEl) logEl.scrollTop = logEl.scrollHeight;

  // 手札レンダリング
  const handCards = container.querySelector<HTMLElement>('#hand-cards')!;
  for (const card of hand) {
    const el = renderCard(card, {
      inHand: true,
      onClick: isPlayerTurn ? (c) => playCard(c, container) : undefined,
    });
    handCards.appendChild(el);
  }

  // ターン終了ボタン
  container.querySelector('#btn-end-turn')!.addEventListener('click', () => {
    if (!isPlayerTurn) return;
    const { runState } = store.getState();
    if (!runState) return;

    const result = dispatch(runState, { type: 'END_TURN' });
    for (const ev of result.events) store.addLog(ev.message);
    store.setState({ runState: result.state });

    if (result.state.phase === 'game_over') {
      renderRunScreen(container);
    } else if (result.state.phase === 'battle_end') {
      renderRunScreen(container);
    } else {
      renderBattleScreen(container);
    }
  });
}

function playCard(card: { id: string }, container: HTMLElement): void {
  const { runState } = store.getState();
  if (!runState || runState.phase !== 'player_turn') return;

  const result = dispatch(runState, { type: 'PLAY_CARD', cardId: card.id });
  for (const ev of result.events) store.addLog(ev.message);
  store.setState({ runState: result.state });

  if (result.state.phase === 'battle_end' || result.state.phase === 'game_over' || result.state.phase === 'run_complete') {
    renderRunScreen(container);
  } else {
    renderBattleScreen(container);
  }
}
