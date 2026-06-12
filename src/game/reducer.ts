// v1.1.0 | 2026-06-09 MEZ
import { GameState, GameSnapshot, currentSnapshot } from './types';
import { applyMove, canMove, moveAllTheWay, isWon, findBlockInDirection } from './logic';
import type { Block, Direction } from './types';
import { DEFAULT_START_LAYOUT, getStartLayout } from './startLayouts';

const STORAGE_KEY = 'khunpan_best';

function bestKey(startLayoutId: string): string {
  return `${STORAGE_KEY}_${startLayoutId}`;
}

function loadBest(startLayoutId: string): number | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(bestKey(startLayoutId));
  return v ? parseInt(v, 10) : null;
}

function saveBest(startLayoutId: string, moves: number): void {
  if (typeof localStorage === 'undefined') return;
  const current = loadBest(startLayoutId);
  if (current === null || moves < current)
    localStorage.setItem(bestKey(startLayoutId), String(moves));
}

function makeInitialSnapshot(startLayoutId: string): GameSnapshot {
  return { blocks: getStartLayout(startLayoutId).blocks, moves: 0, selectedId: 1 }; // hiker pre-selected
}

export function makeInitialState(startLayoutId = DEFAULT_START_LAYOUT.id): GameState {
  return {
    startLayoutId,
    history: [makeInitialSnapshot(startLayoutId)],
    historyIndex: 0,
    bestMoves: loadBest(startLayoutId),
    won: false,
    hintPath: null,
    hintStep: 0,
  };
}

export type GameAction =
  | { type: 'SELECT'; blockId: number }
  | { type: 'MOVE_SELECTED'; dir: Direction }
  | { type: 'MOVE_BLOCK'; blockId: number; dir: Direction; steps: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'SET_START_LAYOUT'; startLayoutId: string }
  | { type: 'SET_HINT_PATH'; path: Block[][] }
  | { type: 'HINT_NEXT' }
  | { type: 'CLEAR_HINT' };

function setSelected(state: GameState, id: number | null): GameState {
  const snap = currentSnapshot(state);
  const newSnap: GameSnapshot = { ...snap, selectedId: id };
  const newHistory = state.history.map((s, i) => i === state.historyIndex ? newSnap : s);
  return { ...state, history: newHistory };
}


function commitMove(state: GameState, newBlocks: GameSnapshot['blocks'], selectedId: number | null): GameState {
  const snap = currentSnapshot(state);
  const newMoves = snap.moves + 1;
  const won = isWon(newBlocks);
  if (won) saveBest(state.startLayoutId, newMoves);
  const newSnap: GameSnapshot = { blocks: newBlocks, moves: newMoves, selectedId };
  const history = [...state.history.slice(0, state.historyIndex + 1), newSnap];
  return {
    ...state, history,
    historyIndex: state.historyIndex + 1,
    won,
    bestMoves: won ? loadBest(state.startLayoutId) : state.bestMoves,
    hintPath: null, hintStep: 0,
  };
}

export function reducer(state: GameState, action: GameAction): GameState {
  const snap = currentSnapshot(state);

  switch (action.type) {
    case 'SELECT':
      return setSelected(state, action.blockId === snap.selectedId ? null : action.blockId);

    case 'MOVE_SELECTED': {
      const block = snap.blocks.find(b => b.id === snap.selectedId);
      if (!block) return setSelected(state, 1);

      if (!canMove(block, action.dir, snap.blocks)) {
        // Kann nicht bewegt werden → nächsten Block in dieser Richtung selektieren
        const nextBlock = findBlockInDirection(block, action.dir, snap.blocks);
        if (nextBlock) return setSelected(state, nextBlock.id);
        return state; // kein Block in diese Richtung → nichts tun
      }
      // Block bis zum nächsten Hindernis schieben
      const newBlocks = moveAllTheWay(block.id, action.dir, snap.blocks);
      return commitMove(state, newBlocks, block.id);
    }

    case 'MOVE_BLOCK': {
      const block = snap.blocks.find(b => b.id === action.blockId);
      if (!block) return state;
      let newBlocks = snap.blocks;
      for (let i = 0; i < action.steps; i++) {
        const b = newBlocks.find(x => x.id === action.blockId)!;
        if (!canMove(b, action.dir, newBlocks)) break;
        newBlocks = applyMove(b, action.dir, newBlocks);
      }
      if (newBlocks === snap.blocks) return state;
      return commitMove(state, newBlocks, action.blockId);
    }

    case 'UNDO':
      if (state.historyIndex === 0) return state;
      return { ...state, historyIndex: state.historyIndex - 1, won: false, hintPath: null };

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const next = state.history[state.historyIndex + 1];
      return { ...state, historyIndex: state.historyIndex + 1, won: isWon(next.blocks) };
    }

    case 'RESET':
      return makeInitialState(state.startLayoutId);

    case 'SET_START_LAYOUT':
      return makeInitialState(action.startLayoutId);

    case 'SET_HINT_PATH': {
      const snapPath: GameSnapshot[] = action.path.map((blocks, i) => ({
        blocks, moves: snap.moves + i, selectedId: null,
      }));
      return { ...state, hintPath: snapPath, hintStep: 0 };
    }

    case 'HINT_NEXT': {
      if (!state.hintPath) return state;
      const nextStep = state.hintStep + 1;
      if (nextStep >= state.hintPath.length) return state;
      const hintSnap = state.hintPath[nextStep];
      const won = isWon(hintSnap.blocks);
      const history = [...state.history.slice(0, state.historyIndex + 1), hintSnap];
      return {
        ...state, history,
        historyIndex: state.historyIndex + 1,
        hintStep: nextStep, won,
        bestMoves: won ? loadBest(state.startLayoutId) : state.bestMoves,
      };
    }

    case 'CLEAR_HINT':
      return { ...state, hintPath: null, hintStep: 0 };

    default:
      return state;
  }
}
