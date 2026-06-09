// v1.0.0 | 2026-06-09 MEZ
import React, { useEffect } from 'react';
import { GameState, currentSnapshot, BOARD_COLS, BOARD_ROWS, Direction } from '../game/types';
import { getValidDirections } from '../game/logic';
import { GameBlock } from './GameBlock';
import { MountainIcon } from './BlockIcons';
import { GameAction } from '../game/reducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  cellSize: number;
}

export function GameBoard({ state, dispatch, cellSize }: Props) {
  const snap = currentSnapshot(state);
  const boardW = BOARD_COLS * cellSize;
  const boardH = BOARD_ROWS * cellSize;
  const exitW = 2 * cellSize;
  const exitLeft = cellSize; // cols 1-2

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const dirs: Record<string, Direction> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      };
      const dir = dirs[e.key];
      if (dir && snap.selectedId !== null) {
        e.preventDefault();
        dispatch({ type: 'MOVE_SELECTED', dir });
        return;
      }
      // Number keys 1-9 → select block
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 10) {
        const block = snap.blocks.find(b => b.id === num);
        if (block) dispatch({ type: 'SELECT', blockId: num });
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [snap.selectedId, snap.blocks, dispatch]);

  return (
    <div id="khunpan-board-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      {/* Exit opening above the board */}
      <div style={{
        position: 'absolute',
        top: -cellSize * 0.8,
        left: exitLeft,
        width: exitW,
        height: cellSize * 0.85,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        <MountainIcon width={exitW * 0.85} height={cellSize * 0.75} />
      </div>

      {/* Board container */}
      <div
        id="khunpan-board"
        style={{
          position: 'relative',
          width: boardW,
          height: boardH,
          background: '#37474F',
          borderRadius: 10,
          border: '3px solid #263238',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Grid lines */}
        {Array.from({ length: BOARD_ROWS + 1 }).map((_, i) => (
          <div key={`hr${i}`} style={{
            position: 'absolute', left: 0, right: 0,
            top: i * cellSize, height: 1, background: 'rgba(255,255,255,0.06)',
          }}/>
        ))}
        {Array.from({ length: BOARD_COLS + 1 }).map((_, i) => (
          <div key={`vr${i}`} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: i * cellSize, width: 1, background: 'rgba(255,255,255,0.06)',
          }}/>
        ))}

        {/* Exit highlight at top */}
        <div style={{
          position: 'absolute', top: 0, left: exitLeft,
          width: exitW, height: 4,
          background: 'linear-gradient(90deg, transparent, #81D4FA, transparent)',
          zIndex: 1,
        }}/>

        {/* Blocks */}
        {snap.blocks.map(block => {
          const validDirs = getValidDirections(block, snap.blocks);
          return (
            <GameBlock
              key={block.id}
              block={block}
              cellSize={cellSize}
              isSelected={snap.selectedId === block.id}
              validDirs={validDirs}
              onSelect={id => dispatch({ type: 'SELECT', blockId: id })}
              onMove={(id, dir) => dispatch({ type: 'MOVE_BLOCK', blockId: id, dir })}
            />
          );
        })}
      </div>
    </div>
  );
}
