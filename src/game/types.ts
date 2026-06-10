// v1.2.0 | 2026-06-09 MEZ

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type BlockShape = 'square2' | 'horizontal2' | 'vertical2' | 'single';

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

// Board coordinates use row/col from the top-left corner, both 0-based.
// Board: 4 cols × 5 rows. Exit = top center (cols 1-2, row 0).
export const BOARD_COLS = 4;
export const BOARD_ROWS = 5;
export const EXIT_COLS = [1, 2];

// Fachliche Start-Konstellation:
//   1 = id1                  2×2 Hauptblock bei row 3, col 1
//   2 = id6                  horizontaler 2er bei row 2, col 1
//   3 = id4, id5, id9, id10  vier vertikale 1×2-Blöcke
//   4 = id2, id3, id7, id8   vier 1×1-Blöcke
// Frei: row 0 col 1 und row 0 col 2 = Ausgang oben Mitte.
//
// Solver-Gruppen (gleiche Gruppe = austauschbar im kanonischen Key):
//   A: id1                  fachlich 1, 2×2 Hauptblock, einzigartig
//   B: id2, id3, id7, id8   fachlich 4, 1×1, austauschbar
//   C: id4, id5, id9, id10  fachlich 3, vertikale 1×2, austauschbar
//   D: id6                  fachlich 2, horizontaler 2er, einzigartig
export const INITIAL_BLOCKS: Block[] = [
  { id: 1,  shape: 'square2', row: 3, col: 1 },       // fachlich 1: Hauptblock
  { id: 2,  shape: 'single', row: 0, col: 0 },        // fachlich 4: 1×1 oben links
  { id: 3,  shape: 'single', row: 0, col: 3 },        // fachlich 4: 1×1 oben rechts
  { id: 4,  shape: 'vertical2', row: 3, col: 0 },     // fachlich 3: vertikal unten links
  { id: 5,  shape: 'vertical2', row: 3, col: 3 },     // fachlich 3: vertikal unten rechts
  { id: 6,  shape: 'horizontal2', row: 2, col: 1 },   // fachlich 2: horizontaler 2er
  { id: 7,  shape: 'single', row: 1, col: 1 },        // fachlich 4: 1×1 mitte links
  { id: 8,  shape: 'single', row: 1, col: 2 },        // fachlich 4: 1×1 mitte rechts
  { id: 9,  shape: 'vertical2', row: 1, col: 0 },     // fachlich 3: vertikal oben links
  { id: 10, shape: 'vertical2', row: 1, col: 3 },     // fachlich 3: vertikal oben rechts
  // LEER: (0,1) und (0,2) = Ausgang oben Mitte
];
