import type { RunState } from '../types/run';

const SAVE_PREFIX = 'hyakunin_save_';
const COLLECTION_KEY = 'hyakunin_collection';
const MAX_SLOTS = 10;

export interface SaveSlot {
  slotId: number;
  name: string;
  savedAt: string;           // ISO文字列
  dungeonId: string;
  dungeonName: string;
  runPhase: string;
  deckSize: number;
  score: number;
  hp: string;                // "currentHp/maxHp"
  runState: RunState;
  persistentScore: number;
}

export interface SlotInfo {
  slotId: number;
  isEmpty: boolean;
  data: Omit<SaveSlot, 'runState'> | null;  // 軽量サマリ（runStateを除く）
}

// ---- セーブ ----
export function saveGame(slotId: number, runState: RunState, persistentScore: number, dungeonId: string, dungeonName: string): void {
  if (slotId < 1 || slotId > MAX_SLOTS) return;

  const slot: SaveSlot = {
    slotId,
    name: `スロット ${slotId}`,
    savedAt: new Date().toISOString(),
    dungeonId,
    dungeonName,
    runPhase: runState.phase,
    deckSize: runState.deck.cards.length,
    score: runState.score,
    hp: `${runState.player.currentHp}/${runState.player.maxHp}`,
    runState,
    persistentScore,
  };

  try {
    localStorage.setItem(SAVE_PREFIX + slotId, JSON.stringify(slot));
  } catch {
    console.error('セーブに失敗しました');
  }
}

// ---- ロード ----
export function loadGame(slotId: number): SaveSlot | null {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + slotId);
    if (!raw) return null;
    return JSON.parse(raw) as SaveSlot;
  } catch {
    return null;
  }
}

// ---- 削除 ----
export function deleteSlot(slotId: number): void {
  localStorage.removeItem(SAVE_PREFIX + slotId);
}

// ---- 全スロット情報 ----
export function getAllSlots(): SlotInfo[] {
  const slots: SlotInfo[] = [];
  for (let i = 1; i <= MAX_SLOTS; i++) {
    const raw = localStorage.getItem(SAVE_PREFIX + i);
    if (!raw) {
      slots.push({ slotId: i, isEmpty: true, data: null });
      continue;
    }
    try {
      const parsed = JSON.parse(raw) as SaveSlot;
      // runStateを除いたサマリのみ
      const { runState: _rs, ...summary } = parsed;
      slots.push({ slotId: i, isEmpty: false, data: summary });
    } catch {
      slots.push({ slotId: i, isEmpty: true, data: null });
    }
  }
  return slots;
}

// ---- コレクション（集めた句番号） ----
export function getCollection(): Set<number> {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

export function addToCollection(poemNumbers: number[]): void {
  const col = getCollection();
  for (const n of poemNumbers) col.add(n);
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify([...col]));
  } catch { /* noop */ }
}

export function clearCollection(): void {
  localStorage.removeItem(COLLECTION_KEY);
}
