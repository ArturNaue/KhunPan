// v1.0.0 | 2026-06-09 MEZ
import { Block, BlockShape, Direction, BOARD_COLS, BOARD_ROWS, EXIT_ROW, EXIT_COLS } from './types';

function blockCells(b: Block): [number, number][] {
  const cells: [number, number][] = [];
  const [rows, cols] = shapeDims(b.shape);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      cells.push([b.row + r, b.col + c]);
  return cells;
}

export function shapeDims(shape: BlockShape): [number, number] {
  switch (shape) {
    case '2x2': return [2, 2];
    case '2x1': return [1, 2]; // 1 row, 2 cols
    case '1x2': return [2, 1]; // 2 rows, 1 col
    case '1x1': return [1, 1];
  }
}

function buildOccupied(blocks: Block[], excludeId?: number): Set<string> {
  const set = new Set<string>();
  for (const b of blocks) {
    if (b.id === excludeId) continue;
    for (const [r, c] of blockCells(b)) set.add(`${r},${c}`);
  }
  return set;
}

export function canMove(block: Block, dir: Direction, blocks: Block[]): boolean {
  const occupied = buildOccupied(blocks, block.id);
  const [rows, cols] = shapeDims(block.shape);

  let dr = 0, dc = 0;
  if (dir === 'UP')    dr = -1;
  if (dir === 'DOWN')  dr = 1;
  if (dir === 'LEFT')  dc = -1;
  if (dir === 'RIGHT') dc = 1;

  const newRow = block.row + dr;
  const newCol = block.col + dc;

  // Boundary check (allow hiker to exit through top opening)
  if (block.id === 1 && dir === 'UP' && newRow === EXIT_ROW - 1) {
    // Hiker moves from row=0 upward — only valid if cols match exit
    if (block.col === EXIT_COLS[0]) return true;
  }

  if (newRow < 0 || newCol < 0) return false;
  if (newRow + rows > BOARD_ROWS || newCol + cols > BOARD_COLS) return false;

  // Check new cells are empty
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (occupied.has(`${newRow + r},${newCol + c}`)) return false;
    }
  }
  return true;
}

export function applyMove(block: Block, dir: Direction, blocks: Block[]): Block[] {
  let dr = 0, dc = 0;
  if (dir === 'UP')    dr = -1;
  if (dir === 'DOWN')  dr = 1;
  if (dir === 'LEFT')  dc = -1;
  if (dir === 'RIGHT') dc = 1;
  return blocks.map(b =>
    b.id === block.id ? { ...b, row: b.row + dr, col: b.col + dc } : b
  );
}

export function isWon(blocks: Block[]): boolean {
  const hiker = blocks.find(b => b.id === 1);
  if (!hiker) return false;
  // Hiker (2×2) has exited when its top row is above the board
  return hiker.row <= EXIT_ROW - 2 && hiker.col === EXIT_COLS[0];
}

// ─── BFS Solver ──────────────────────────────────────────────────────────────

function blocksKey(blocks: Block[]): string {
  return [...blocks]
    .sort((a, b) => a.id - b.id)
    .map(b => `${b.id}:${b.row},${b.col}`)
    .join('|');
}

export function solve(initialBlocks: Block[]): Block[][] | null {
  const startKey = blocksKey(initialBlocks);
  const visited = new Set<string>([startKey]);
  // Queue: [blocks, path of block-states]
  const queue: Array<{ blocks: Block[]; path: Block[][] }> = [
    { blocks: initialBlocks, path: [initialBlocks] }
  ];
  const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  while (queue.length > 0) {
    const { blocks, path } = queue.shift()!;
    if (isWon(blocks)) return path;

    for (const block of blocks) {
      for (const dir of dirs) {
        if (!canMove(block, dir, blocks)) continue;
        const next = applyMove(block, dir, blocks);
        const key = blocksKey(next);
        if (visited.has(key)) continue;
        visited.add(key);
        queue.push({ blocks: next, path: [...path, next] });
      }
    }
  }
  return null;
}

export function getValidDirections(block: Block, blocks: Block[]): Direction[] {
  return (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).filter(d => canMove(block, d, blocks));
}
