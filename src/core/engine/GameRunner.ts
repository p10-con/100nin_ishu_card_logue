import type { RunState, RunNode, NodeType } from '../types/run';
import type { Card } from '../types/card';
import { MAX_DECK_SIZE, DEFAULT_DRAFT_OFFERS } from '../types/run';
import { createInitialPlayerStats } from '../types/player';
import { resolveCardPlay, randomEnemy, randomElite, randomBoss } from './BattleResolver';
import { buildDeck } from './DeckAnalyzer';
import { getCardDb } from './CardFactory';

const HAND_SIZE = 4;
const MAP_DEPTH = 7;
const MAP_WIDTH = 3;

function generateMap(): RunNode[][] {
  const map: RunNode[][] = [];

  for (let depth = 0; depth < MAP_DEPTH; depth++) {
    const row: RunNode[] = [];
    for (let branch = 0; branch < MAP_WIDTH; branch++) {
      let type: NodeType;
      if (depth === 0) {
        type = 'battle';
      } else if (depth === MAP_DEPTH - 1) {
        type = 'boss';
      } else if (depth % 3 === 2) {
        type = Math.random() < 0.4 ? 'elite' : 'rest';
      } else {
        const roll = Math.random();
        if (roll < 0.5) type = 'battle';
        else if (roll < 0.7) type = 'event';
        else if (roll < 0.85) type = 'rest';
        else type = 'shop';
      }

      row.push({
        id: `node-${depth}-${branch}`,
        type,
        depth,
        cleared: false,
        available: depth === 0,
      });
    }
    map.push(row);
  }
  return map;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// デッキに入っていないカードからランダムにN枚提示する
export function generateDraftOffers(currentCards: Card[], count: number = DEFAULT_DRAFT_OFFERS): Card[] {
  const all = getCardDb();
  const currentIds = new Set(currentCards.map(c => c.id));
  const available = all.filter(c => !currentIds.has(c.id));
  return shuffle(available).slice(0, count);
}

export function createRun(initialCards: Card[]): RunState {
  const deck = buildDeck('run-deck', initialCards);
  const player = createInitialPlayerStats();

  // デッキシナジーによるプレイヤー初期ステータス補正
  for (const synergy of deck.stats.synergyBonuses) {
    if (synergy.bonusType === 'stat_boost') {
      if (synergy.targetStat === 'attack') player.attack += Math.floor(synergy.value * 0.2);
      if (synergy.targetStat === 'defense') player.defense += Math.floor(synergy.value * 0.2);
      if (synergy.targetStat === 'elegance') player.elegance += Math.floor(synergy.value * 0.5);
      if (synergy.targetStat === 'pathos') player.pathos += Math.floor(synergy.value * 0.5);
    }
  }

  player.maxHp += Math.floor(deck.stats.rarityScore * 0.5);
  player.currentHp = player.maxHp;

  const map = generateMap();

  return {
    runId: `run-${Date.now()}`,
    deck,
    player,
    currentNodeId: null,
    map,
    hand: [],
    discardPile: [],
    drawPile: shuffle([...deck.cards]),
    turn: 0,
    enemy: null,
    phase: 'map',
    score: 0,
    draftOffers: [],
    draftOffersCount: DEFAULT_DRAFT_OFFERS,
    pendingDraftCard: null,
  };
}

function drawCards(state: RunState, count: number): RunState {
  let draw = [...state.drawPile];
  let discard = [...state.discardPile];
  const hand = [...state.hand];

  for (let i = 0; i < count; i++) {
    if (draw.length === 0) {
      draw = shuffle(discard);
      discard = [];
    }
    if (draw.length > 0) {
      const [card, ...rest] = draw;
      draw = rest;
      hand.push({ ...card, usedCount: card.usedCount });
    }
  }

  return { ...state, hand, drawPile: draw, discardPile: discard };
}

export type GameAction =
  | { type: 'ENTER_NODE'; nodeId: string }
  | { type: 'PLAY_CARD'; cardId: string }
  | { type: 'END_TURN' }
  | { type: 'TAKE_REST' }
  | { type: 'START_DRAFT' }               // battle_end後にドラフト開始
  | { type: 'DRAFT_PICK'; cardId: string }    // カードを選ぶ
  | { type: 'DRAFT_DISCARD'; cardId: string } // 満杯時に捨てるカードを選ぶ
  | { type: 'DRAFT_SKIP' };               // ドラフトをスキップ

export interface GameEvent {
  type: string;
  message: string;
  data?: unknown;
}

export interface DispatchResult {
  state: RunState;
  events: GameEvent[];
}

export function dispatch(state: RunState, action: GameAction): DispatchResult {
  const events: GameEvent[] = [];

  switch (action.type) {
    case 'ENTER_NODE': {
      const node = state.map.flat().find(n => n.id === action.nodeId);
      if (!node || !node.available || node.cleared) {
        return { state, events };
      }

      let next: RunState = { ...state, currentNodeId: action.nodeId };

      if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
        const depth = node.depth;
        const enemy = node.type === 'boss'
          ? randomBoss(Math.floor(depth / 3))
          : node.type === 'elite'
          ? randomElite(depth)
          : randomEnemy(depth);

        next = { ...next, enemy, phase: 'battle_start', turn: 0 };
        next = drawCards(next, HAND_SIZE);
        next = { ...next, phase: 'player_turn' };
        events.push({ type: 'BATTLE_START', message: `${enemy.name}が現れた！` });
      } else if (node.type === 'rest') {
        next = { ...next, phase: 'map' };
        // Rest handled by TAKE_REST action
        events.push({ type: 'REST_NODE', message: '休憩所に到着した。' });
      }

      return { state: next, events };
    }

    case 'PLAY_CARD': {
      if (state.phase !== 'player_turn' || !state.enemy) {
        return { state, events };
      }

      const cardIdx = state.hand.findIndex(c => c.id === action.cardId);
      if (cardIdx === -1) return { state, events };

      const card = state.hand[cardIdx];

      // エネルギーチェック（簡略化：現在は1ターンMAX_ENERGY_CARDS枚まで）
      const result = resolveCardPlay(card, state.player, state.enemy, state.deck);

      const newEnemyHp = Math.max(0, state.enemy.hp - result.damageDealt);
      const newPlayerDefense = state.player.defense + result.defenseGained;
      const newElegance = Math.min(100, state.player.elegance + result.eleganceGained);
      const newPathos = Math.min(100, state.player.pathos + result.pathosGained);

      const updatedCard: Card = { ...card, usedCount: card.usedCount + 1 };

      let next: RunState = {
        ...state,
        hand: state.hand.filter((_, i) => i !== cardIdx),
        discardPile: [...state.discardPile, updatedCard],
        enemy: { ...state.enemy, hp: newEnemyHp },
        player: {
          ...state.player,
          defense: newPlayerDefense,
          elegance: newElegance,
          pathos: newPathos,
        },
        score: state.score + result.damageDealt,
      };

      events.push({ type: 'CARD_PLAYED', message: result.logMessage });

      if (newEnemyHp <= 0) {
        // 戦闘勝利
        const map = state.map.map(row =>
          row.map(n => n.id === state.currentNodeId ? { ...n, cleared: true } : n)
        );
        // 次の深さのノードを解放
        const currentNode = state.map.flat().find(n => n.id === state.currentNodeId);
        const nextDepth = (currentNode?.depth ?? -1) + 1;
        const updatedMap = map.map(row =>
          row.map(n => n.depth === nextDepth ? { ...n, available: true } : n)
        );

        next = {
          ...next,
          map: updatedMap,
          phase: nextDepth >= MAP_DEPTH ? 'run_complete' : 'battle_end',
          score: next.score + 50,
        };
        events.push({ type: 'ENEMY_DEFEATED', message: `${state.enemy.name}を倒した！` });
      }

      return { state: next, events };
    }

    case 'END_TURN': {
      if (state.phase !== 'player_turn' || !state.enemy) {
        return { state, events };
      }

      // 敵の攻撃
      const enemyDamage = Math.max(0, state.enemy.attack - state.player.defense);
      const newHp = state.player.currentHp - enemyDamage;
      // 防御値をリセット
      const player = { ...state.player, currentHp: newHp, defense: 5 };

      events.push({ type: 'ENEMY_ATTACK', message: `${state.enemy.name}の攻撃！${enemyDamage}ダメージ` });

      if (newHp <= 0) {
        return {
          state: { ...state, player: { ...player, currentHp: 0 }, phase: 'game_over' },
          events: [...events, { type: 'GAME_OVER', message: '倒れてしまった...' }],
        };
      }

      // 新しいターン開始
      let next: RunState = { ...state, player, turn: state.turn + 1 };
      next = drawCards(next, HAND_SIZE - next.hand.length);
      next = { ...next, phase: 'player_turn' };

      return { state: next, events };
    }

    case 'TAKE_REST': {
      const heal = Math.round(state.player.maxHp * 0.3);
      const newHp = Math.min(state.player.maxHp, state.player.currentHp + heal);
      events.push({ type: 'HEALED', message: `${heal}HP回復した。` });

      const map = state.map.map(row =>
        row.map(n => n.id === state.currentNodeId ? { ...n, cleared: true } : n)
      );
      const currentNode = state.map.flat().find(n => n.id === state.currentNodeId);
      const nextDepth = (currentNode?.depth ?? -1) + 1;
      const updatedMap = map.map(row =>
        row.map(n => n.depth === nextDepth ? { ...n, available: true } : n)
      );

      return {
        state: {
          ...state,
          player: { ...state.player, currentHp: newHp },
          map: updatedMap,
          phase: 'map',
        },
        events,
      };
    }

    case 'START_DRAFT': {
      // battle_end からドラフトフェーズへ
      const offers = generateDraftOffers(state.deck.cards, state.draftOffersCount);
      return {
        state: { ...state, phase: 'draft', draftOffers: offers, enemy: null },
        events: [{ type: 'DRAFT_START', message: '新しい句が届いた。一首を選べ。' }],
      };
    }

    case 'DRAFT_PICK': {
      if (state.phase !== 'draft') return { state, events };
      const picked = state.draftOffers.find(c => c.id === action.cardId);
      if (!picked) return { state, events };

      if (state.deck.cards.length >= MAX_DECK_SIZE) {
        // デッキ満杯 → 捨て選択フェーズへ
        return {
          state: { ...state, phase: 'draft_discard', pendingDraftCard: picked },
          events: [{ type: 'DRAFT_DISCARD_NEEDED', message: 'デッキが満杯。捨てる句を選べ。' }],
        };
      }

      // デッキに追加してマップへ
      const newCards = [...state.deck.cards, picked];
      const newDeck = buildDeck('run-deck', newCards);
      return {
        state: {
          ...state,
          deck: newDeck,
          drawPile: shuffle([...newDeck.cards]),
          discardPile: [],
          hand: [],
          phase: 'map',
          draftOffers: [],
        },
        events: [{ type: 'CARD_ADDED', message: `「${picked.poem.upper.slice(0, 8)}…」をデッキに加えた。` }],
      };
    }

    case 'DRAFT_DISCARD': {
      if (state.phase !== 'draft_discard' || !state.pendingDraftCard) return { state, events };
      const discarded = state.deck.cards.find(c => c.id === action.cardId);
      if (!discarded) return { state, events };

      const newCards = [...state.deck.cards.filter(c => c.id !== action.cardId), state.pendingDraftCard];
      const newDeck = buildDeck('run-deck', newCards);
      return {
        state: {
          ...state,
          deck: newDeck,
          drawPile: shuffle([...newDeck.cards]),
          discardPile: [],
          hand: [],
          phase: 'map',
          draftOffers: [],
          pendingDraftCard: null,
        },
        events: [
          { type: 'CARD_REMOVED', message: `「${discarded.poem.upper.slice(0, 8)}…」を手放した。` },
          { type: 'CARD_ADDED', message: `「${state.pendingDraftCard.poem.upper.slice(0, 8)}…」をデッキに加えた。` },
        ],
      };
    }

    case 'DRAFT_SKIP': {
      return {
        state: { ...state, phase: 'map', draftOffers: [], pendingDraftCard: null, enemy: null },
        events: [{ type: 'DRAFT_SKIPPED', message: '今回は見送った。' }],
      };
    }

    default:
      return { state, events };
  }
}

export function getAvailableNodes(state: RunState): RunNode[] {
  return state.map.flat().filter(n => n.available && !n.cleared);
}
