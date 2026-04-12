import { store } from '../../store/GameStore';
import { getAllSlots, saveGame, loadGame, deleteSlot } from '../../core/engine/SaveManager';
import type { SlotInfo } from '../../core/engine/SaveManager';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return iso;
  }
}

function phaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    map: 'マップ', player_turn: '戦闘中', battle_end: '勝利後',
    draft: 'ドラフト', rest: '休憩', game_over: 'ゲームオーバー',
    run_complete: 'クリア済', battle_start: '戦闘開始',
  };
  return labels[phase] ?? phase;
}

function renderSlot(slot: SlotInfo): string {
  if (slot.isEmpty || !slot.data) {
    return `
      <div class="save-slot empty" data-slot="${slot.slotId}">
        <div class="save-slot-num">${slot.slotId}</div>
        <div class="save-slot-empty">── 空きスロット ──</div>
        <div class="save-slot-actions">
          <button class="btn btn-sm save-btn" data-slot="${slot.slotId}">現在の旅をセーブ</button>
        </div>
      </div>
    `;
  }
  const d = slot.data;
  return `
    <div class="save-slot filled" data-slot="${slot.slotId}">
      <div class="save-slot-num">${slot.slotId}</div>
      <div class="save-slot-info">
        <div class="save-slot-dungeon">${d.dungeonName}</div>
        <div class="save-slot-meta">
          ${phaseLabel(d.runPhase)}　デッキ${d.deckSize}首　HP ${d.hp}　スコア ${d.score}
        </div>
        <div class="save-slot-date">${formatDate(d.savedAt)}</div>
      </div>
      <div class="save-slot-actions">
        <button class="btn btn-sm load-btn" data-slot="${slot.slotId}">ロード</button>
        <button class="btn btn-sm save-btn" data-slot="${slot.slotId}">上書き</button>
        <button class="btn btn-sm btn-danger delete-btn" data-slot="${slot.slotId}">削除</button>
      </div>
    </div>
  `;
}

export function renderSaveLoadScreen(container: HTMLElement): void {
  const rebuild = () => {
    const slots = getAllSlots();
    const { runState, persistentScore, selectedDungeon } = store.getState();
    const hasRun = runState !== null;

    container.innerHTML = `
      <div class="screen save-load-screen">
        <div class="save-load-header">
          <h2>セーブ / ロード</h2>
          <p class="save-load-note">${hasRun ? '現在の旅をセーブできます。' : '旅の途中でないため、セーブはできません。'}</p>
        </div>
        <div class="save-slot-list">
          ${slots.map(renderSlot).join('')}
        </div>
        <div class="save-load-footer">
          <button class="btn btn-sm" id="btn-back-saveload">戻る</button>
        </div>
      </div>
    `;

    // セーブ
    container.querySelectorAll<HTMLButtonElement>('.save-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!runState || !hasRun) {
          alert('旅の途中でないため、セーブできません。');
          return;
        }
        const slotId = Number(btn.dataset.slot);
        const dungeonId = selectedDungeon?.id ?? 'arashi-no-tabiji';
        const dungeonName = selectedDungeon?.name ?? '嵐の旅路';

        if (!btn.classList.contains('confirmed')) {
          btn.textContent = '確認？';
          btn.classList.add('confirmed');
          setTimeout(() => {
            btn.textContent = '上書き';
            btn.classList.remove('confirmed');
          }, 3000);
          return;
        }

        saveGame(slotId, runState, persistentScore, dungeonId, dungeonName);
        rebuild();
      });
    });

    // ロード
    container.querySelectorAll<HTMLButtonElement>('.load-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slotId = Number(btn.dataset.slot);
        const saved = loadGame(slotId);
        if (!saved) {
          alert('ロードに失敗しました。');
          return;
        }
        store.setState({
          runState: saved.runState,
          persistentScore: saved.persistentScore,
          screen: 'run',
        });
      });
    });

    // 削除
    container.querySelectorAll<HTMLButtonElement>('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.classList.contains('confirmed')) {
          btn.textContent = '確認？';
          btn.classList.add('confirmed');
          setTimeout(() => {
            btn.textContent = '削除';
            btn.classList.remove('confirmed');
          }, 3000);
          return;
        }
        const slotId = Number(btn.dataset.slot);
        deleteSlot(slotId);
        rebuild();
      });
    });

    // 戻る
    container.querySelector('#btn-back-saveload')?.addEventListener('click', () => {
      const { runState } = store.getState();
      store.setState({ screen: runState ? 'run' : 'home' });
    });
  };

  rebuild();
}
