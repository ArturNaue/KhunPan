// v1.0.0 | 2026-06-09 MEZ
import { GameState, GameSnapshot, INITIAL_BLOCKS, currentSnapshot } from './types';
import { canMove, applyMove, isWon, solve } from './logic';
import type { Direction } from './types';

const STORAGE_KEY = 'khunpan_best';

function loadBest(): number | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v ? parseInt(v, 10) : null;
}

function saveBest(moves: number): void {
  const current = loadBest();
  if (current === null || moves < current) {
    localStorage.setItem(STORAGE_KEY, String(moves));
  }
}

function makeInitialSnapshot(): GameSnapshot {
  return { blocks: INITIAL_BLOCKS, moves: 0, selectedId: null };
}

export function makeInitialState(): GameState {
  return {
    history: [makeInitialSnapshot()],
    historyIndex: 0,
    bestMoves: loadBest(),
    won: false,
    hintPath: null,
    hintStep: 0,
  };
}

export type GameAction =
  | { type: 'SELECT'; blockId: number }
  | { type: 'MOVE_SELECTED'; dir: Direction }
  | { type: 'MOVE_BLOCK'; blockId: number; dir: Direction }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'SOLVE' }
  | { type: 'HINT_NEXT' }
  | { type: 'CLEAR_HINT' };

export function reducer(state: GameState, action: GameAction): GameState {
  const snap = currentSnapshot(state);

  switch (action.type) {
    case 'SELECT': {
      const newSnap: GameSnapshot = { ...snap, selectedId: action.blockId === snap.selectedId ? null : action.blockId };
      const history = state.history.slice(0, state.historyIndex + 1);
      // Don't push to history for selection – just update current
      const newHistory = [...history.slice(0, -1), newSnap];
      return { ...state, history: newHistory };
    }

    case 'MOVE_SELECTED': {
      if (snap.selectedId === null) return state;
      const block = snap.blocks.find(b => b.id === snap.selectedId);
      if (!block || !canMove(block, action.dir, snap.blocks)) return state;
      const newBlocks = applyMove(block, action.dir, snap.blocks);
      const won = isWon(newBlocks);
      const newSnap: GameSnapshot = {
        blocks: newBlocks,
        moves: snap.moves + 1,
        selectedId: snap.selectedId,
      };
      if (won) saveBest(newSnap.moves);
      const history = [...state.history.slice(0, state.historyIndex + 1), newSnap];
      return {
        ...state,
        history,
        historyIndex: state.historyIndex + 1,
        won,
        bestMoves: won ? loadBest() : state.bestMoves,
        hintPath: null,
        hintStep: 0,
      };
    }

    case 'MOVE_BLOCK': {
      const block = snap.blocks.find(b => b.id === action.blockId);
      if (!block || !canMove(block, action.dir, snap.blocks)) return state;
      const newBlocks = applyMove(block, action.dir, snap.blocks);
      const won = isWon(newBlocks);
      const newSnap: GameSnapshot = {
        blocks: newBlocks,
        moves: snap.moves + 1,
        selectedId: action.blockId,
      };
      if (won) saveBest(newSnap.moves);
      const history = [...state.history.slice(0, state.historyIndex + 1), newSnap];
      return {
        ...state,
        history,
        historyIndex: state.historyIndex + 1,
        won,
        bestMoves: won ? loadBest() : state.bestMoves,
        hintPath: null,
        hintStep: 0,
      };
    }

    case 'UNDO': {
      if (state.historyIndex === 0) return state;
      return { ...state, historyIndex: state.historyIndex - 1, won: false, hintPath: null };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const nextIndex = state.historyIndex + 1;
      const nextSnap = state.history[nextIndex];
      const won = isWon(nextSnap.blocks);
      return { ...state, historyIndex: nextIndex, won };
    }

    case 'RESET': {
      return {
        ...makeInitialState(),
        bestMoves: loadBest(),
      };
    }

    case 'SOLVE': {
      const path = solve(snap.blocks);
      if (!path) return state;
      // Convert path (Block[][]) to GameSnapshot[]
      const snapPath: GameSnapshot[] = path.map((blocks, i) => ({
        blocks,
        moves: snap.moves + i,
        selectedId: null,
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
        ...state,
        history,
        historyIndex: state.historyIndex + 1,
        hintStep: nextStep,
        won,
        bestMoves: won ? loadBest() : state.bestMoves,
      };
    }

    case 'CLEAR_HINT':
      return { ...state, hintPath: null, hintStep: 0 };

    default:
      return state;
  }
}
