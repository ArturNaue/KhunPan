// v1.2.0 | 2026-06-09 MEZ

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
  bestMoves: number | null;
  won: boolean;
  hintPath: GameSnapshot[] | null;
  hintStep: number;
}

export function currentSnapshot(state: GameState): GameSnapshot {
  return state.history[state.historyIndex];
}

// Board: 4 cols × 5 rows. Exit = top center (cols 1-2, row 0).
export const BOARD_COLS = 4;
export const BOARD_ROWS = 5;
export const EXIT_COLS = [1, 2];

// Korrektes Start-Layout – 180°-Rotation des knobelholz.de-Originals.
// Original (exit unten): Hiker rows 0-1, B1×2 an rows 1-2 & 3-4, leer row 4 cols 1-2.
// Rotiert  (exit oben):  Hiker rows 3-4, B1×2 an rows 0-1 & 2-3, leer row 0 cols 1-2.
//
// Solver-Gruppen (gleiche Gruppe = austauschbar im kanonischen Key):
//   A: id1  (2×2 Hiker, einzigartig)
//   B: id2, id3, id7, id8  (1×1, alle gleich)
//   C: id4, id5, id9, id10 (1×2, alle gleich)
//   D: id6  (2×1 horizontal, einzigartig)
export const INITIAL_BLOCKS: Block[] = [
  { id: 1,  shape: '2x2', row: 3, col: 1 },  // Hiker (rows 3-4, cols 1-2)
  { id: 2,  shape: '1x1', row: 2, col: 0 },  // 1×1 mitte-links  (Zeile 2)
  { id: 3,  shape: '1x1', row: 2, col: 3 },  // 1×1 mitte-rechts (Zeile 2)
  { id: 4,  shape: '1x2', row: 3, col: 0 },  // 1×2 unten-links  (rows 3-4, flankiert Hiker)
  { id: 5,  shape: '1x2', row: 3, col: 3 },  // 1×2 unten-rechts (rows 3-4, flankiert Hiker)
  { id: 6,  shape: '2x1', row: 2, col: 1 },  // 2×1 horizontal   (row 2, cols 1-2)
  { id: 7,  shape: '1x1', row: 1, col: 1 },  // 1×1 oben-mitte-links
  { id: 8,  shape: '1x1', row: 1, col: 2 },  // 1×1 oben-mitte-rechts
  { id: 9,  shape: '1x2', row: 0, col: 0 },  // 1×2 oben-links  (rows 0-1)
  { id: 10, shape: '1x2', row: 0, col: 3 },  // 1×2 oben-rechts (rows 0-1)
  // LEER: (0,1) und (0,2) = Ausgang oben Mitte
];
