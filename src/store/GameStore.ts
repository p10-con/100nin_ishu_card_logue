import type { RunState } from '../core/types/run';
import type { Card } from '../core/types/card';
import type { DungeonDef } from '../core/types/dungeon';
import type { PlayerProfile } from '../core/types/profile';

// ゲーム開始前の初期ドラフト状態
export interface InitialDraftState {
  roundsTotal: number;      // 合計ラウンド数（デフォルト3）
  roundsDone: number;       // 完了済みラウンド数
  offersCount: number;      // 何枚から選ぶか（デフォルト3、将来拡張可）
  offers: Card[];           // 現在表示中の候補
  draftedCards: Card[];     // 選択済みカード
}

export type GameScreen = 'title' | 'home' | 'initial_draft' | 'run' | 'save_load' | 'upgrade';

export interface GameStoreState {
  screen: GameScreen;
  initialDraft: InitialDraftState | null;
  runState: RunState | null;
  battleLog: string[];
  persistentScore: number;
  selectedDungeon: DungeonDef | null;
  playerProfile: PlayerProfile | null;
}

type Listener = () => void;

class GameStore {
  private state: GameStoreState = {
    screen: 'title',
    initialDraft: null,
    runState: null,
    battleLog: [],
    persistentScore: 0,
    selectedDungeon: null,
    playerProfile: null,
  };

  private listeners: Set<Listener> = new Set();

  getState(): Readonly<GameStoreState> {
    return this.state;
  }

  setState(partial: Partial<GameStoreState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  addLog(message: string): void {
    const newLog = [...this.state.battleLog, message].slice(-20);
    this.state = { ...this.state, battleLog: newLog };
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const l of this.listeners) l();
  }
}

export const store = new GameStore();
