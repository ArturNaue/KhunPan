// v1.2.0 | 2026-06-09 MEZ
import { Block, BlockShape, Direction, BOARD_COLS, BOARD_ROWS, EXIT_COLS } from './types';

export function shapeDims(shape: BlockShape): [number, number] {
  switch (shape) {
    case '2x2': return [2, 2];
    case '2x1': return [1, 2];
    case '1x2': return [2, 1];
    case '1x1': return [1, 1];
  }
}

function blockCells(b: Block): [number, number][] {
  const cells: [number, number][] = [];
  const [rows, cols] = shapeDims(b.shape);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      cells.push([b.row + r, b.col + c]);
  return cells;
}

function buildOccupied(blocks: Block[], excludeId?: number): Set<string> {
  const set = new Set<string>();
  for (const b of blocks) {
    if (b.id === excludeId) continue;
    for (const [r, c] of blockCells(b)) set.add(`${r},${c}`);
  }
  return set;
}

function delta(dir: Direction): [number, number] {
  if (dir === 'UP')    return [-1, 0];
  if (dir === 'DOWN')  return [1, 0];
  if (dir === 'LEFT')  return [0, -1];
  return [0, 1];
}

export function canMove(block: Block, dir: Direction, blocks: Block[]): boolean {
  const occupied = buildOccupied(blocks, block.id);
  const [rows, cols] = shapeDims(block.shape);
  const [dr, dc] = delta(dir);
  const newRow = block.row + dr;
  const newCol = block.col + dc;

  if (newRow < 0 || newCol < 0) return false;
  if (newRow + rows > BOARD_ROWS || newCol + cols > BOARD_COLS) return false;

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (occupied.has(`${newRow + r},${newCol + c}`)) return false;
  return true;
}

export function applyMove(block: Block, dir: Direction, blocks: Block[]): Block[] {
  const [dr, dc] = delta(dir);
  return blocks.map(b =>
    b.id === block.id ? { ...b, row: b.row + dr, col: b.col + dc } : b
  );
}

export function maxStepsInDir(block: Block, dir: Direction, blocks: Block[]): number {
  let steps = 0;
  let current = block;
  let currentBlocks = blocks;
  while (canMove(current, dir, currentBlocks)) {
    currentBlocks = applyMove(current, dir, currentBlocks);
    current = currentBlocks.find(b => b.id === block.id)!;
    steps++;
    if (steps > 10) break; // safety
  }
  return steps;
}

export function moveAllTheWay(blockId: number, dir: Direction, blocks: Block[]): Block[] {
  let current = blocks;
  let block = current.find(b => b.id === blockId)!;
  while (canMove(block, dir, current)) {
    current = applyMove(block, dir, current);
    block = current.find(b => b.id === blockId)!;
  }
  return current;
}

// Gewinn: Hiker hat Ausgang oben erreicht (row=-1, also Uint8=255 nach Underflow)
// ODER Hiker steht bei row=0 und kann nach oben (wird vom Reducer abgefangen)
export function isWon(blocks: Block[]): boolean {
  const hiker = blocks.find(b => b.id === 1);
  if (!hiker) return false;
  return hiker.row <= 0 && hiker.col === EXIT_COLS[0];
}

export function getValidDirections(block: Block, blocks: Block[]): Direction[] {
  return (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).filter(d => canMove(block, d, blocks));
}

// Findet den nächsten Block in der gegebenen Richtung (gleiche Zeilen-/Spalten-Überlappung).
// Wird verwendet um beim Tastendruck in eine blockierte Richtung den nächsten Block zu selektieren.
export function findBlockInDirection(block: Block, dir: Direction, blocks: Block[]): Block | null {
  const [rows, cols] = shapeDims(block.shape);
  const rowMin = block.row, rowMax = block.row + rows - 1;
  const colMin = block.col, colMax = block.col + cols - 1;

  const candidates = blocks.filter(b => {
    if (b.id === block.id) return false;
    const [br, bc] = shapeDims(b.shape);
    const bRowMin = b.row, bRowMax = b.row + br - 1;
    const bColMin = b.col, bColMax = b.col + bc - 1;

    switch (dir) {
      case 'LEFT':  return bColMax < colMin && bRowMax >= rowMin && bRowMin <= rowMax;
      case 'RIGHT': return bColMin > colMax && bRowMax >= rowMin && bRowMin <= rowMax;
      case 'UP':    return bRowMax < rowMin && bColMax >= colMin && bColMin <= colMax;
      case 'DOWN':  return bRowMin > rowMax && bColMax >= colMin && bColMin <= colMax;
    }
  });

  if (candidates.length === 0) return null;

  // Nächstgelegenen Block wählen
  switch (dir) {
    case 'LEFT':  return candidates.reduce((a, b) => (a.col + shapeDims(a.shape)[1]) > (b.col + shapeDims(b.shape)[1]) ? a : b);
    case 'RIGHT': return candidates.reduce((a, b) => a.col < b.col ? a : b);
    case 'UP':    return candidates.reduce((a, b) => (a.row + shapeDims(a.shape)[0]) > (b.row + shapeDims(b.shape)[0]) ? a : b);
    case 'DOWN':  return candidates.reduce((a, b) => a.row < b.row ? a : b);
  }
}

// ─── BFS Solver ──────────────────────────────────────────────────────────────

function blocksKey(blocks: Block[]): string {
  return [...blocks].sort((a, b) => a.id - b.id).map(b => `${b.id}:${b.row},${b.col}`).join('|');
}

export function solve(initialBlocks: Block[]): Block[][] | null {
  const startKey = blocksKey(initialBlocks);
  const visited = new Set<string>([startKey]);
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
