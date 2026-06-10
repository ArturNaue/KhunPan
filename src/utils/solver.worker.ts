// v1.2.0 | 2026-06-09 MEZ
// BFS-Solver mit kanonischem State-Key (gleiche Blöcke = austauschbar → 24× weniger States)
import type { Block, Direction } from '../game/types';
import { BOARD_COLS, BOARD_ROWS, EXIT_COLS } from '../game/types';
import { applyMove, isWon, shapeDims } from '../game/logic';

// Gruppen identischer Blöcke (austauschbar → sortiert in State-Key)
// A: fachlich 1 / id1, B: fachlich 4 / 1×1-Blöcke,
// C: fachlich 3 / vertikale 1×2-Blöcke, D: fachlich 2 / id6.
function blockGroup(id: number): string {
  if (id === 1) return 'A';
  if (id === 6) return 'D';
  const b = INITIAL_SHAPES[id - 1];
  if (b === 'single') return 'B';
  return 'C';
}

// Wird beim Worker-Start aus den gesendeten Blöcken befüllt
let INITIAL_SHAPES: Block['shape'][] = [];

function buildGrid(grid: Uint8Array, blocks: Block[]) {
  grid.fill(0);
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.row < 0 || b.row >= BOARD_ROWS) continue;
    const [rs, cs] = shapeDims(b.shape);
    for (let r = 0; r < rs; r++)
      for (let c = 0; c < cs; c++)
        grid[(b.row + r) * BOARD_COLS + (b.col + c)] = i + 1;
  }
}

function canMove(b: Block, dir: Direction, grid: Uint8Array, idx: number): boolean {
  const [rs, cs] = shapeDims(b.shape);
  let nr = b.row, nc = b.col;
  if (dir === 'UP')    nr--;
  else if (dir === 'DOWN')  nr++;
  else if (dir === 'LEFT')  nc--;
  else                      nc++;

  // Hiker exit through top
  if (b.id === 1 && dir === 'UP' && nr === -1) return b.col === EXIT_COLS[0];

  if (nr < 0 || nc < 0 || nr + rs > BOARD_ROWS || nc + cs > BOARD_COLS) return false;
  for (let r = 0; r < rs; r++)
    for (let c = 0; c < cs; c++) {
      const v = grid[(nr + r) * BOARD_COLS + (nc + c)];
      if (v !== 0 && v !== idx + 1) return false;
    }
  return true;
}

// Kanonischer Key: Blöcke nach Gruppe gruppieren, innerhalb Gruppe sortieren
function stateKey(blocks: Block[]): string {
  const groups: Record<string, string[]> = { A: [], B: [], C: [], D: [] };
  for (const b of blocks) {
    const grp = b.row < 0 ? 'A' : blockGroup(b.id);
    groups[grp].push(`${b.row < 0 ? -1 : b.row},${b.col}`);
  }
  return `A:${groups.A}|B:${groups.B.sort()}|C:${groups.C.sort()}|D:${groups.D}`;
}

self.onmessage = (e: MessageEvent<Block[]>) => {
  const initial = e.data;
  INITIAL_SHAPES = initial.map(b => b.shape);

  const startKey = stateKey(initial);
  const visited = new Map<string, { blocks: Block[]; parentKey: string | null }>();
  visited.set(startKey, { blocks: initial, parentKey: null });

  const queue: string[] = [startKey];
  const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const grid = new Uint8Array(BOARD_ROWS * BOARD_COLS);

  while (queue.length > 0) {
    const key = queue.shift()!;
    const { blocks } = visited.get(key)!;

    if (isWon(blocks)) {
      // Pfad rekonstruieren
      const path: Block[][] = [];
      let k: string | null = key;
      while (k !== null) {
        path.unshift(visited.get(k)!.blocks);
        k = visited.get(k)!.parentKey;
      }
      self.postMessage(path);
      return;
    }

    buildGrid(grid, blocks);

    for (let i = 0; i < blocks.length; i++) {
      for (const dir of dirs) {
        if (!canMove(blocks[i], dir, grid, i)) continue;
        const next = applyMove(blocks[i], dir, blocks);
        const nextKey = stateKey(next);
        if (visited.has(nextKey)) continue;
        visited.set(nextKey, { blocks: next, parentKey: key });
        queue.push(nextKey);
      }
    }
  }

  self.postMessage(null);
};
