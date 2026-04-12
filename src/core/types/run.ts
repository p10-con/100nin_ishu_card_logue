import type { Card } from './card';
import type { Deck } from './deck';
import type { PlayerStats } from './player';

export type NodeType = 'battle' | 'elite' | 'boss' | 'rest' | 'shop' | 'event';

export interface RunNode {
  id: string;
  type: NodeType;
  depth: number;
  cleared: boolean;
  available: boolean;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  intent: EnemyIntent;
}

export type EnemyIntentType = 'attack' | 'defend' | 'buff' | 'debuff';

export interface EnemyIntent {
  type: EnemyIntentType;
  value: number;
  description: string;
}

export const MAX_DECK_SIZE = 10;
export const DEFAULT_DRAFT_OFFERS = 3; // ゆくゆくは遺物等で4,5に増加可能

export interface RunState {
  runId: string;
  deck: Deck;
  player: PlayerStats;
  currentNodeId: string | null;
  map: RunNode[][];
  hand: Card[];
  discardPile: Card[];
  drawPile: Card[];
  turn: number;
  enemy: Enemy | null;
  phase: RunPhase;
  score: number;
  // ドラフト関連
  draftOffers: Card[];          // 現在提示中のカード候補
  draftOffersCount: number;     // 何枚から選ぶか（将来の拡張用）
  pendingDraftCard: Card | null; // 10枚満の時、捨て選択待ちのカード
}

export type RunPhase =
  | 'map'
  | 'battle_start'
  | 'player_turn'
  | 'enemy_turn'
  | 'battle_end'
  | 'draft'          // ステージクリア後ドラフト（デッキ < 10）
  | 'draft_discard'  // デッキ満杯時、捨てるカードを選ぶ
  | 'reward'
  | 'game_over'
  | 'run_complete';
