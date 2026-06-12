// v1.3.0 | 2026-06-10 MEZ
import { INITIAL_BLOCKS, type Block } from './types';

export interface StartLayout {
  id: string;
  label: string;
  difficulty: string;
  sourceSteps: number | null;
  blocks: Block[];
}

type WebBlock = Omit<Block, 'row'> & { row: number };

function mirrorFromBottomExit(blocks: WebBlock[]): Block[] {
  return blocks.map(block => {
    const height = block.shape === 'square2' || block.shape === 'vertical2' ? 2 : 1;
    return { ...block, row: 5 - (block.row + height) };
  });
}

function variant(steps: number, blocks: WebBlock[]): StartLayout {
  return {
    id: `steps-${steps}`,
    label: `${steps} Schritte`,
    difficulty: `${steps} Schritte`,
    sourceSteps: steps,
    blocks: mirrorFromBottomExit(blocks),
  };
}

export const DEFAULT_START_LAYOUT: StartLayout = {
  id: 'default',
  label: 'Default',
  difficulty: 'Aktuelles Start-Layout',
  sourceSteps: null,
  blocks: INITIAL_BLOCKS,
};

// Die Knobelholz-Bilder zeigen den Ausgang unten. Die App spielt gespiegelt mit Ausgang oben.
export const START_LAYOUTS: StartLayout[] = [
  DEFAULT_START_LAYOUT,
  variant(7, [
    { id: 1, shape: 'square2', row: 2, col: 1 },
    { id: 2, shape: 'single', row: 4, col: 0 },
    { id: 3, shape: 'single', row: 4, col: 1 },
    { id: 4, shape: 'single', row: 4, col: 2 },
    { id: 5, shape: 'single', row: 4, col: 3 },
    { id: 6, shape: 'vertical2', row: 0, col: 0 },
    { id: 7, shape: 'vertical2', row: 0, col: 2 },
    { id: 8, shape: 'vertical2', row: 0, col: 3 },
    { id: 9, shape: 'vertical2', row: 2, col: 0 },
    { id: 10, shape: 'vertical2', row: 2, col: 3 },
  ]),
  variant(10, [
    { id: 1, shape: 'square2', row: 2, col: 1 },
    { id: 2, shape: 'single', row: 4, col: 0 },
    { id: 3, shape: 'single', row: 4, col: 1 },
    { id: 4, shape: 'single', row: 4, col: 2 },
    { id: 5, shape: 'single', row: 4, col: 3 },
    { id: 6, shape: 'horizontal2', row: 0, col: 1 },
    { id: 7, shape: 'horizontal2', row: 1, col: 0 },
    { id: 8, shape: 'horizontal2', row: 1, col: 2 },
    { id: 9, shape: 'vertical2', row: 2, col: 0 },
    { id: 10, shape: 'vertical2', row: 2, col: 3 },
  ]),
  variant(16, [
    { id: 1, shape: 'square2', row: 2, col: 1 },
    { id: 2, shape: 'single', row: 3, col: 0 },
    { id: 3, shape: 'single', row: 3, col: 3 },
    { id: 4, shape: 'single', row: 4, col: 0 },
    { id: 5, shape: 'single', row: 4, col: 3 },
    { id: 6, shape: 'vertical2', row: 0, col: 0 },
    { id: 7, shape: 'vertical2', row: 0, col: 1 },
    { id: 8, shape: 'vertical2', row: 0, col: 2 },
    { id: 9, shape: 'vertical2', row: 0, col: 3 },
    { id: 10, shape: 'horizontal2', row: 4, col: 1 },
  ]),
  variant(29, [
    { id: 1, shape: 'square2', row: 2, col: 1 },
    { id: 2, shape: 'single', row: 2, col: 0 },
    { id: 3, shape: 'single', row: 2, col: 3 },
    { id: 4, shape: 'single', row: 3, col: 0 },
    { id: 5, shape: 'single', row: 3, col: 3 },
    { id: 6, shape: 'horizontal2', row: 0, col: 1 },
    { id: 7, shape: 'horizontal2', row: 1, col: 0 },
    { id: 8, shape: 'horizontal2', row: 1, col: 2 },
    { id: 9, shape: 'horizontal2', row: 4, col: 0 },
    { id: 10, shape: 'horizontal2', row: 4, col: 2 },
  ]),
  variant(32, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 0, col: 0 },
    { id: 3, shape: 'single', row: 0, col: 3 },
    { id: 4, shape: 'single', row: 1, col: 0 },
    { id: 5, shape: 'single', row: 1, col: 3 },
    { id: 6, shape: 'horizontal2', row: 2, col: 1 },
    { id: 7, shape: 'horizontal2', row: 3, col: 0 },
    { id: 8, shape: 'horizontal2', row: 3, col: 2 },
    { id: 9, shape: 'horizontal2', row: 4, col: 0 },
    { id: 10, shape: 'horizontal2', row: 4, col: 2 },
  ]),
  variant(36, [
    { id: 1, shape: 'square2', row: 1, col: 1 },
    { id: 2, shape: 'single', row: 3, col: 0 },
    { id: 3, shape: 'single', row: 3, col: 3 },
    { id: 4, shape: 'single', row: 4, col: 0 },
    { id: 5, shape: 'single', row: 4, col: 3 },
    { id: 6, shape: 'horizontal2', row: 0, col: 0 },
    { id: 7, shape: 'horizontal2', row: 0, col: 2 },
    { id: 8, shape: 'vertical2', row: 1, col: 0 },
    { id: 9, shape: 'vertical2', row: 1, col: 3 },
    { id: 10, shape: 'horizontal2', row: 3, col: 1 },
  ]),
  variant(42, [
    { id: 1, shape: 'square2', row: 1, col: 1 },
    { id: 2, shape: 'single', row: 4, col: 0 },
    { id: 3, shape: 'single', row: 4, col: 1 },
    { id: 4, shape: 'single', row: 4, col: 2 },
    { id: 5, shape: 'single', row: 4, col: 3 },
    { id: 6, shape: 'horizontal2', row: 0, col: 0 },
    { id: 7, shape: 'horizontal2', row: 0, col: 2 },
    { id: 8, shape: 'vertical2', row: 2, col: 0 },
    { id: 9, shape: 'vertical2', row: 2, col: 3 },
    { id: 10, shape: 'horizontal2', row: 3, col: 1 },
  ]),
  variant(85, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 0, col: 3 },
    { id: 3, shape: 'single', row: 1, col: 3 },
    { id: 4, shape: 'single', row: 3, col: 0 },
    { id: 5, shape: 'single', row: 4, col: 0 },
    { id: 6, shape: 'vertical2', row: 0, col: 0 },
    { id: 7, shape: 'horizontal2', row: 2, col: 1 },
    { id: 8, shape: 'horizontal2', row: 3, col: 1 },
    { id: 9, shape: 'horizontal2', row: 4, col: 1 },
    { id: 10, shape: 'vertical2', row: 3, col: 3 },
  ]),
  variant(93, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 1, col: 0 },
    { id: 3, shape: 'single', row: 1, col: 3 },
    { id: 4, shape: 'single', row: 2, col: 1 },
    { id: 5, shape: 'single', row: 2, col: 2 },
    { id: 6, shape: 'vertical2', row: 2, col: 0 },
    { id: 7, shape: 'vertical2', row: 2, col: 3 },
    { id: 8, shape: 'horizontal2', row: 3, col: 1 },
    { id: 9, shape: 'horizontal2', row: 4, col: 0 },
    { id: 10, shape: 'horizontal2', row: 4, col: 2 },
  ]),
  variant(94, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 3, col: 0 },
    { id: 3, shape: 'single', row: 3, col: 1 },
    { id: 4, shape: 'single', row: 3, col: 2 },
    { id: 5, shape: 'single', row: 3, col: 3 },
    { id: 6, shape: 'vertical2', row: 0, col: 0 },
    { id: 7, shape: 'vertical2', row: 0, col: 3 },
    { id: 8, shape: 'horizontal2', row: 2, col: 1 },
    { id: 9, shape: 'horizontal2', row: 4, col: 0 },
    { id: 10, shape: 'horizontal2', row: 4, col: 2 },
  ]),
  variant(97, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 1, col: 0 },
    { id: 3, shape: 'single', row: 1, col: 3 },
    { id: 4, shape: 'single', row: 3, col: 1 },
    { id: 5, shape: 'single', row: 3, col: 2 },
    { id: 6, shape: 'vertical2', row: 2, col: 0 },
    { id: 7, shape: 'horizontal2', row: 2, col: 1 },
    { id: 8, shape: 'vertical2', row: 2, col: 3 },
    { id: 9, shape: 'horizontal2', row: 4, col: 0 },
    { id: 10, shape: 'horizontal2', row: 4, col: 2 },
  ]),
  variant(98, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 0, col: 0 },
    { id: 3, shape: 'single', row: 0, col: 3 },
    { id: 4, shape: 'single', row: 1, col: 0 },
    { id: 5, shape: 'single', row: 3, col: 3 },
    { id: 6, shape: 'vertical2', row: 1, col: 3 },
    { id: 7, shape: 'vertical2', row: 2, col: 0 },
    { id: 8, shape: 'horizontal2', row: 2, col: 1 },
    { id: 9, shape: 'horizontal2', row: 3, col: 1 },
    { id: 10, shape: 'horizontal2', row: 4, col: 1 },
  ]),
  variant(100, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 0, col: 0 },
    { id: 3, shape: 'single', row: 0, col: 3 },
    { id: 4, shape: 'single', row: 3, col: 0 },
    { id: 5, shape: 'single', row: 3, col: 3 },
    { id: 6, shape: 'vertical2', row: 1, col: 0 },
    { id: 7, shape: 'vertical2', row: 1, col: 3 },
    { id: 8, shape: 'vertical2', row: 2, col: 1 },
    { id: 9, shape: 'horizontal2', row: 4, col: 0 },
    { id: 10, shape: 'horizontal2', row: 4, col: 2 },
  ]),
  variant(101, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 3, col: 0 },
    { id: 3, shape: 'single', row: 3, col: 3 },
    { id: 4, shape: 'single', row: 4, col: 0 },
    { id: 5, shape: 'single', row: 4, col: 3 },
    { id: 6, shape: 'vertical2', row: 0, col: 0 },
    { id: 7, shape: 'vertical2', row: 0, col: 3 },
    { id: 8, shape: 'horizontal2', row: 2, col: 1 },
    { id: 9, shape: 'horizontal2', row: 3, col: 1 },
    { id: 10, shape: 'horizontal2', row: 4, col: 1 },
  ]),
  variant(104, [
    { id: 1, shape: 'square2', row: 0, col: 1 },
    { id: 2, shape: 'single', row: 4, col: 0 },
    { id: 3, shape: 'single', row: 4, col: 1 },
    { id: 4, shape: 'single', row: 4, col: 2 },
    { id: 5, shape: 'single', row: 4, col: 3 },
    { id: 6, shape: 'vertical2', row: 0, col: 0 },
    { id: 7, shape: 'vertical2', row: 0, col: 3 },
    { id: 8, shape: 'horizontal2', row: 2, col: 1 },
    { id: 9, shape: 'horizontal2', row: 3, col: 0 },
    { id: 10, shape: 'horizontal2', row: 3, col: 2 },
  ]),
];

export function getStartLayout(id: string): StartLayout {
  return START_LAYOUTS.find(layout => layout.id === id) ?? DEFAULT_START_LAYOUT;
}
