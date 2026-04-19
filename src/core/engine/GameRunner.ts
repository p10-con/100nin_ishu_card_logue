import type { RunState, RunNode, NodeType, RunEventDef } from '../types/run';
import type { Card } from '../types/card';
import type { PlayerProfile } from '../types/profile';
import { DEFAULT_DRAFT_OFFERS } from '../types/run';
import { getDeckCapacity, getSensitivityLimit, getHandSize } from './UpgradeCatalog';
import { createInitialPlayerStats } from '../types/player';
import { resolveCardPlay, randomEnemy, randomElite, randomBoss } from './BattleResolver';
import { buildDeck } from './DeckAnalyzer';
import { getCardDb } from './CardFactory';

const MAP_DEPTH = 7;
const MAP_WIDTH = 3;

const EVENTS: RunEventDef[] = [
  {
    id: 'traveler',
    title: '旅人との出会い',
    flavor: '道中、一人の旅人が声をかけてきた。「この句を旅の供に」と、古びた巻物を差し出す。',
    choices: [
      { label: '受け取る', effect: 'add_card', description: '新しい句がデッキに加わる' },
      { label: '辞退する', effect: 'nothing', description: '何も変わらない' },
    ],
  },
  {
    id: 'shrine',
    title: '古い社',
    flavor: '苔むした社に差し掛かった。祠の前に立つと、不思議な力が体を包む。',
    choices: [
      { label: '祈りを捧げる', effect: 'heal', value: 20, description: 'HP 20 回復する' },
      { label: '試練を受ける', effect: 'gamble', value: 30, description: '50%の確率でHP +30、失敗すると -15' },
    ],
  },
  {
    id: 'rain',
    title: '雨宿りの庵',
    flavor: '突然の雨。軒先を借りた庵の主人が、温かい茶と共に長話を聞かせてくれた。',
    choices: [
      { label: 'ゆっくり休む', effect: 'heal', value: 15, description: 'HP 15 回復する' },
      { label: 'すぐに旅を続ける', effect: 'nothing', description: '何も変わらない' },
    ],
  },
  {
    id: 'monument',
    title: '詩の碑',
    flavor: '道端に建つ石碑。刻まれた古歌を読み解くと、言葉の力が体に宿った。',
    choices: [
      { label: '碑文を写し取る', effect: 'add_card', description: '新しい句がデッキに加わる' },
      { label: '力を授かる', effect: 'heal', value: 10, description: 'HP 10 回復する' },
    ],
  },
  {
    id: 'spirit',
    title: '言霊の試練',
    flavor: '突如として言霊が現れ、「汝の詩心を見せよ」と問いかけた。',
    choices: [
      { label: '詠み上げる（賭け）', effect: 'gamble', value: 25, description: '70%で HP +25、失敗すると -20' },
      { label: '静かに通り過ぎる', effect: 'nothing', description: '何も変わらない' },
    ],
  },
];

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

export function createRun(initialCards: Card[], profile?: PlayerProfile): RunState {
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
  const upgradeLevels = profile?.upgradeLevels ?? {};

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
    shopOffers: [],
    currentEvent: null,
    deckCapacity: getDeckCapacity(upgradeLevels),
    handSize: getHandSize(upgradeLevels),
    sensitivityLimit: getSensitivityLimit(upgradeLevels),
    upgradeLevels,
    pointsAwarded: false,
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
  | { type: 'START_DRAFT' }
  | { type: 'DRAFT_PICK'; cardId: string }
  | { type: 'DRAFT_DISCARD'; cardId: string }
  | { type: 'DRAFT_SKIP' }
  | { type: 'EVENT_CHOICE'; choiceIndex: number }
  | { type: 'SHOP_BUY_CARD'; cardId: string }
  | { type: 'SHOP_HEAL' }
  | { type: 'SHOP_LEAVE' };

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
        next = drawCards(next, state.handSize);
        next = { ...next, phase: 'player_turn' };
        events.push({ type: 'BATTLE_START', message: `${enemy.name}が現れた！` });
      } else if (node.type === 'rest') {
        next = { ...next, phase: 'map' };
        events.push({ type: 'REST_NODE', message: '休憩所に到着した。' });
      } else if (node.type === 'event') {
        const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        next = { ...next, phase: 'event', currentEvent: ev };
        events.push({ type: 'EVENT_NODE', message: `出来事：${ev.title}` });
      } else if (node.type === 'shop') {
        const offers = generateDraftOffers(state.deck.cards, 3);
        next = { ...next, phase: 'shop', shopOffers: offers };
        events.push({ type: 'SHOP_NODE', message: '行商人の店に立ち寄った。' });
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
      const result = resolveCardPlay(card, state.player, state.enemy, state.deck, state.upgradeLevels);

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
      next = drawCards(next, state.handSize - next.hand.length);
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

      // 感受性チェック
      const currentEnergy = state.deck.cards.reduce((s, c) => s + c.stats.energy, 0);
      if (currentEnergy + picked.stats.energy > state.sensitivityLimit) {
        return {
          state,
          events: [{ type: 'SENSITIVITY_EXCEEDED', message: `感受性が足りない。この句（コスト${picked.stats.energy}）は受け入れられない。` }],
        };
      }

      if (state.deck.cards.length >= state.deckCapacity) {
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

    case 'EVENT_CHOICE': {
      if (state.phase !== 'event' || !state.currentEvent) return { state, events };
      const choice = state.currentEvent.choices[action.choiceIndex];
      if (!choice) return { state, events };

      const clearedMap = clearCurrentNode(state);
      let player = { ...state.player };

      if (choice.effect === 'heal' && choice.value) {
        player = { ...player, currentHp: Math.min(player.maxHp, player.currentHp + choice.value) };
        events.push({ type: 'EVENT_HEAL', message: `HP が ${choice.value} 回復した。` });
      } else if (choice.effect === 'damage' && choice.value) {
        player = { ...player, currentHp: Math.max(0, player.currentHp - choice.value) };
        events.push({ type: 'EVENT_DAMAGE', message: `HP が ${choice.value} 減った。` });
      } else if (choice.effect === 'add_card') {
        const [newCard] = generateDraftOffers(state.deck.cards, 1);
        if (newCard && state.deck.cards.length < state.deckCapacity) {
          const newCards = [...state.deck.cards, newCard];
          const newDeck = buildDeck('run-deck', newCards);
          events.push({ type: 'CARD_ADDED', message: `「${newCard.poem.upper.slice(0, 8)}…」をデッキに加えた。` });
          return {
            state: { ...clearedMap, player, deck: newDeck, drawPile: shuffle([...newDeck.cards]), phase: 'map', currentEvent: null },
            events,
          };
        }
      } else if (choice.effect === 'gamble' && choice.value) {
        const success = Math.random() < 0.5;
        if (success) {
          player = { ...player, currentHp: Math.min(player.maxHp, player.currentHp + choice.value) };
          events.push({ type: 'EVENT_GAMBLE_WIN', message: `言霊が応えた！HP が ${choice.value} 回復した。` });
        } else {
          const penalty = Math.round(choice.value * 0.6);
          player = { ...player, currentHp: Math.max(1, player.currentHp - penalty) };
          events.push({ type: 'EVENT_GAMBLE_LOSE', message: `言霊に弾かれた。HP が ${penalty} 減った。` });
        }
      } else {
        events.push({ type: 'EVENT_NOTHING', message: '旅を続けた。' });
      }

      return { state: { ...clearedMap, player, phase: 'map', currentEvent: null }, events };
    }

    case 'SHOP_BUY_CARD': {
      if (state.phase !== 'shop') return { state, events };
      const card = state.shopOffers.find(c => c.id === action.cardId);
      if (!card) return { state, events };

      const clearedMap = clearCurrentNode(state);
      if (state.deck.cards.length >= state.deckCapacity) {
        return {
          state: { ...clearedMap, phase: 'draft_discard', pendingDraftCard: card, shopOffers: [] },
          events: [{ type: 'DRAFT_DISCARD_NEEDED', message: 'デッキが満杯。捨てる句を選べ。' }],
        };
      }

      const newCards = [...state.deck.cards, card];
      const newDeck = buildDeck('run-deck', newCards);
      events.push({ type: 'CARD_ADDED', message: `「${card.poem.upper.slice(0, 8)}…」を手に入れた。` });
      return {
        state: { ...clearedMap, deck: newDeck, drawPile: shuffle([...newDeck.cards]), phase: 'map', shopOffers: [] },
        events,
      };
    }

    case 'SHOP_HEAL': {
      if (state.phase !== 'shop') return { state, events };
      const clearedMap = clearCurrentNode(state);
      const heal = Math.round(state.player.maxHp * 0.3);
      const newHp = Math.min(state.player.maxHp, state.player.currentHp + heal);
      events.push({ type: 'HEALED', message: `薬草で HP が ${heal} 回復した。` });
      return {
        state: { ...clearedMap, player: { ...state.player, currentHp: newHp }, phase: 'map', shopOffers: [] },
        events,
      };
    }

    case 'SHOP_LEAVE': {
      if (state.phase !== 'shop') return { state, events };
      const clearedMap = clearCurrentNode(state);
      return {
        state: { ...clearedMap, phase: 'map', shopOffers: [] },
        events: [{ type: 'SHOP_LEFT', message: '店を後にした。' }],
      };
    }

    default:
      return { state, events };
  }
}

export function getAvailableNodes(state: RunState): RunNode[] {
  return state.map.flat().filter(n => n.available && !n.cleared);
}

function clearCurrentNode(state: RunState): RunState {
  const map = state.map.map(row =>
    row.map(n => n.id === state.currentNodeId ? { ...n, cleared: true } : n)
  );
  const currentNode = state.map.flat().find(n => n.id === state.currentNodeId);
  const nextDepth = (currentNode?.depth ?? -1) + 1;
  const updatedMap = map.map(row =>
    row.map(n => n.depth === nextDepth ? { ...n, available: true } : n)
  );
  return { ...state, map: updatedMap };
}
