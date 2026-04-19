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
  draftOffers: Card[];
  draftOffersCount: number;
  pendingDraftCard: Card | null;
  // 店・出来事
  shopOffers: Card[];
  currentEvent: RunEventDef | null;
}

export type RunPhase =
  | 'map'
  | 'battle_start'
  | 'player_turn'
  | 'enemy_turn'
  | 'battle_end'
  | 'draft'
  | 'draft_discard'
  | 'event'
  | 'shop'
  | 'reward'
  | 'game_over'
  | 'run_complete';

export interface RunEventDef {
  id: string;
  title: string;
  flavor: string;
  choices: RunEventChoice[];
}

export interface RunEventChoice {
  label: string;
  effect: 'heal' | 'damage' | 'add_card' | 'nothing' | 'gamble';
  value?: number;
  description: string;
}
