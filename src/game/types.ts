// v1.0.0 | 2026-06-09 MEZ

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type BlockShape = '2x2' | '2x1' | '1x2' | '1x1';

export interface Block {
  id: number;
  shape: BlockShape;
  row: number;   // top-left cell row (0-based)
  col: number;   // top-left cell col (0-based)
}

export interface GameSnapshot {
  blocks: Block[];
  moves: number;
  selectedId: number | null;
}

export interface GameState {
  history: GameSnapshot[];
  historyIndex: number;
  bestMoves: number | null; // LocalStorage highscore
  won: boolean;
  hintPath: GameSnapshot[] | null; // BFS solution steps
  hintStep: number;
}

export function currentSnapshot(state: GameState): GameSnapshot {
  return state.history[state.historyIndex];
}

// Board dimensions: 4 cols × 5 rows; exit = top, cols 1-2 (0-based)
export const BOARD_COLS = 4;
export const BOARD_ROWS = 5;
export const EXIT_ROW = 0;
export const EXIT_COLS = [1, 2]; // Hiker must reach row=0, col=1

// Initial layout from the reference image:
// Block 1 (Hiker, 2×2): row=3, col=1
// Block 2 (2×1 horizontal): row=2, col=1
// Block 3 (1×2 vertical, left): row=1, col=0  -- also row=2
// Block 3b (1×2 vertical, right): row=1, col=3 -- also row=2
// Block 4a (1×1 top-left): row=0, col=0
// Block 4b (1×1 top-right): row=0, col=3
// Block 4c (1×1): row=1, col=1
// Block 4d (1×1): row=1, col=2
// Block 5 (1×2 vertical, left-bottom): row=3, col=0
// Block 6 (1×2 vertical, right-bottom): row=3, col=3

export const INITIAL_BLOCKS: Block[] = [
  { id: 1, shape: '2x2', row: 3, col: 1 },  // Hiker
  { id: 2, shape: '2x1', row: 2, col: 1 },  // horizontal 2-wide obstacle
  { id: 3, shape: '1x2', row: 1, col: 0 },  // vertical left
  { id: 4, shape: '1x2', row: 1, col: 3 },  // vertical right
  { id: 5, shape: '1x1', row: 0, col: 0 },  // top-left corner
  { id: 6, shape: '1x1', row: 0, col: 3 },  // top-right corner
  { id: 7, shape: '1x1', row: 1, col: 1 },  // small top-center-left
  { id: 8, shape: '1x1', row: 1, col: 2 },  // small top-center-right
  { id: 9, shape: '1x2', row: 3, col: 0 },  // vertical left-bottom
  { id: 10, shape: '1x2', row: 3, col: 3 }, // vertical right-bottom
];
