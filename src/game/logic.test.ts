import { describe, expect, it } from 'vitest';
import { applyMove, canMove, isWon, moveAllTheWay } from './logic';
import { INITIAL_BLOCKS, currentSnapshot, type Block, type Direction, type GameState } from './types';
import { reducer } from './reducer';
import { START_LAYOUTS } from './startLayouts';

const dims: Record<Block['shape'], [number, number]> = {
  square2: [2, 2],
  horizontal2: [1, 2],
  vertical2: [2, 1],
  single: [1, 1],
};

function occupiedCells(blocks: Block[]): string[] {
  return blocks.flatMap(block => {
    const [rows, cols] = dims[block.shape];
    const cells: string[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        cells.push(`${block.row + r},${block.col + c}`);
    return cells;
  }).sort();
}

function testState(blocks = INITIAL_BLOCKS): GameState {
  return {
    startLayoutId: 'default',
    history: [{ blocks, moves: 0, selectedId: 1 }],
    historyIndex: 0,
    bestMoves: null,
    won: false,
    hintPath: null,
    hintStep: 0,
  };
}

function changedBlock(before: Block[], after: Block[]): { block: Block; dir: Direction } | null {
  const changed = after.filter(next => {
    const prev = before.find(block => block.id === next.id);
    return prev && (prev.row !== next.row || prev.col !== next.col);
  });
  if (changed.length !== 1) return null;

  const block = before.find(item => item.id === changed[0].id);
  if (!block) return null;
  const dr = changed[0].row - block.row;
  const dc = changed[0].col - block.col;
  if (Math.abs(dr) + Math.abs(dc) !== 1) return null;
  const dir: Direction = dr === -1 ? 'UP' : dr === 1 ? 'DOWN' : dc === -1 ? 'LEFT' : 'RIGHT';
  return { block, dir };
}

describe('Khun Pan game rules', () => {
  it('uses the requested start layout with only the top-center exit empty', () => {
    const allCells = Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 4 }, (__, col) => `${row},${col}`)
    ).flat();

    const occupied = occupiedCells(INITIAL_BLOCKS);
    const free = allCells.filter(cell => !occupied.includes(cell));

    expect(new Set(occupied).size).toBe(18);
    expect(free).toEqual(['0,1', '0,2']);
    expect(INITIAL_BLOCKS.find(block => block.id === 1)).toMatchObject({ shape: 'square2', row: 3, col: 1 });
    expect(INITIAL_BLOCKS.find(block => block.id === 6)).toMatchObject({ shape: 'horizontal2', row: 2, col: 1 });
  });

  it('defines valid non-overlapping cells for every start layout', () => {
    for (const layout of START_LAYOUTS) {
      const occupied = occupiedCells(layout.blocks);

      expect(layout.blocks).toHaveLength(10);
      expect(new Set(layout.blocks.map(block => block.id)).size).toBe(10);
      expect(new Set(occupied).size).toBe(18);
      expect(occupied.every(cell => {
        const [row, col] = cell.split(',').map(Number);
        return row >= 0 && row < 5 && col >= 0 && col < 4;
      })).toBe(true);
    }
  });

  it('switches start layouts and resets the current layout', () => {
    const changed = reducer(testState(), { type: 'SET_START_LAYOUT', startLayoutId: 'steps-7' });
    expect(changed.startLayoutId).toBe('steps-7');
    expect(currentSnapshot(changed).moves).toBe(0);
    expect(currentSnapshot(changed).blocks).toBe(START_LAYOUTS.find(layout => layout.id === 'steps-7')?.blocks);

    const moved = reducer(changed, { type: 'MOVE_BLOCK', blockId: 2, dir: 'RIGHT', steps: 1 });
    const reset = reducer(moved, { type: 'RESET' });
    expect(reset.startLayoutId).toBe('steps-7');
    expect(currentSnapshot(reset).blocks).toBe(currentSnapshot(changed).blocks);
  });

  it('blocks board edges and collisions', () => {
    const topLeft = INITIAL_BLOCKS.find(block => block.id === 2)!;
    const hiker = INITIAL_BLOCKS.find(block => block.id === 1)!;

    expect(canMove(topLeft, 'UP', INITIAL_BLOCKS)).toBe(false);
    expect(canMove(topLeft, 'LEFT', INITIAL_BLOCKS)).toBe(false);
    expect(canMove(topLeft, 'RIGHT', INITIAL_BLOCKS)).toBe(true);
    expect(canMove(hiker, 'UP', INITIAL_BLOCKS)).toBe(false);
  });

  it('moves a block all the way until the next obstacle', () => {
    const moved = moveAllTheWay(2, 'RIGHT', INITIAL_BLOCKS);
    expect(moved.find(block => block.id === 2)).toMatchObject({ row: 0, col: 2 });
    expect(moved.find(block => block.id === 3)).toMatchObject({ row: 0, col: 3 });
  });

  it('recognizes the winning position at the top-center exit', () => {
    const winning = INITIAL_BLOCKS.map(block =>
      block.id === 1 ? { ...block, row: 0, col: 1 } : block
    );

    expect(isWon(INITIAL_BLOCKS)).toBe(false);
    expect(isWon(winning)).toBe(true);
  });

  it('supports reducer undo and redo for committed moves', () => {
    const moved = reducer(testState(), { type: 'MOVE_BLOCK', blockId: 2, dir: 'RIGHT', steps: 2 });
    expect(currentSnapshot(moved).moves).toBe(1);
    expect(currentSnapshot(moved).blocks.find(block => block.id === 2)).toMatchObject({ col: 2 });

    const undone = reducer(moved, { type: 'UNDO' });
    expect(currentSnapshot(undone).moves).toBe(0);
    expect(currentSnapshot(undone).blocks.find(block => block.id === 2)).toMatchObject({ col: 0 });

    const redone = reducer(undone, { type: 'REDO' });
    expect(currentSnapshot(redone).moves).toBe(1);
    expect(currentSnapshot(redone).blocks.find(block => block.id === 2)).toMatchObject({ col: 2 });
  });

  it('applies hint and animated solve path steps from the current state', () => {
    const firstStep = applyMove(INITIAL_BLOCKS.find(block => block.id === 2)!, 'RIGHT', INITIAL_BLOCKS);
    const secondStep = applyMove(firstStep.find(block => block.id === 2)!, 'RIGHT', firstStep);
    const path = [INITIAL_BLOCKS, firstStep, secondStep];
    const withPath = reducer(testState(), { type: 'SET_HINT_PATH', path });

    expect(withPath.hintPath?.[0].blocks).toBe(INITIAL_BLOCKS);
    const first = reducer(withPath, { type: 'HINT_NEXT' });
    const second = reducer(first, { type: 'HINT_NEXT' });

    expect(currentSnapshot(first).moves).toBe(1);
    expect(currentSnapshot(first).blocks.find(block => block.id === 2)).toMatchObject({ col: 1 });
    expect(currentSnapshot(second).moves).toBe(2);
    expect(currentSnapshot(second).blocks.find(block => block.id === 2)).toMatchObject({ col: 2 });

    for (let i = 1; i < path.length; i++) {
      const move = changedBlock(path[i - 1], path[i]);
      expect(move).not.toBeNull();
      expect(canMove(move!.block, move!.dir, path[i - 1])).toBe(true);
    }
  });
});
