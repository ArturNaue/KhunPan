// v1.1.0 | 2026-06-09 MEZ
import React, { useEffect } from 'react';
import { GameState, currentSnapshot, BOARD_COLS, BOARD_ROWS, Direction } from '../game/types';
import { GameBlock } from './GameBlock';
import { MountainIcon } from './BlockIcons';
import { GameAction } from '../game/reducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  cellSize: number;
}

const BOARD_BG   = '#C4914A'; // warm medium wood
const FRAME_BG   = '#7A4E1E'; // dark wood frame
const FRAME_W    = 14;        // frame thickness px

export function GameBoard({ state, dispatch, cellSize }: Props) {
  const snap = currentSnapshot(state);
  const boardW = BOARD_COLS * cellSize;
  const boardH = BOARD_ROWS * cellSize;
  const exitW  = 2 * cellSize;
  const exitLeft = cellSize; // cols 1-2

  // Keyboard: arrows move selected block, numbers select block
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const dirs: Record<string, Direction> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      };
      const dir = dirs[e.key];
      if (dir) {
        e.preventDefault();
        dispatch({ type: 'MOVE_SELECTED', dir });
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 10) {
        const block = snap.blocks.find(b => b.id === num);
        if (block) dispatch({ type: 'SELECT', blockId: num });
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [snap.blocks, dispatch]);

  const totalW = boardW + FRAME_W * 2;
  const totalH = boardH + FRAME_W * 2;
  const exitNotchH = FRAME_W + 4;

  return (
    <div
      id="khunpan-board-wrapper"
      role="group"
      aria-label="Khun Pan Spielfeld"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Mountain decoration above exit */}
      <div style={{
        position: 'absolute',
        top: -(cellSize * 0.72),
        left: FRAME_W + exitLeft,
        width: exitW,
        height: cellSize * 0.7,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <MountainIcon width={exitW - 4} height={cellSize * 0.68} />
      </div>

      {/* Outer frame */}
      <div style={{
        position: 'relative',
        width: totalW,
        height: totalH,
        background: FRAME_BG,
        borderRadius: 18,
        boxShadow: `
          0 12px 40px rgba(0,0,0,0.65),
          inset 0 2px 4px rgba(255,255,255,0.15),
          inset 0 -2px 4px rgba(0,0,0,0.4)
        `,
        // Wood frame grain
        backgroundImage: [
          `repeating-linear-gradient(92deg, transparent, transparent 12px, rgba(0,0,0,0.04) 12px, rgba(0,0,0,0.04) 13px)`,
          `linear-gradient(to bottom, ${FRAME_BG}ee, ${FRAME_BG})`,
        ].join(', '),
      }}>
        {/* Exit notch in frame (top center) */}
        <div style={{
          position: 'absolute',
          top: 0, left: FRAME_W + exitLeft,
          width: exitW, height: exitNotchH,
          background: '#1a1008',
          borderRadius: '0 0 6px 6px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
        }}/>

        {/* Board surface */}
        <div
          id="khunpan-board"
          style={{
            position: 'absolute',
            top: FRAME_W, left: FRAME_W,
            width: boardW, height: boardH,
            background: BOARD_BG,
            overflow: 'visible',
            // Multi-layer wood grain
            backgroundImage: [
              `repeating-linear-gradient(102deg, transparent, transparent 9px, rgba(0,0,0,0.025) 9px, rgba(0,0,0,0.025) 10px)`,
              `repeating-linear-gradient(14deg, transparent, transparent 18px, rgba(0,0,0,0.018) 18px, rgba(0,0,0,0.018) 19px)`,
              `linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 50%)`,
              `linear-gradient(to bottom, ${BOARD_BG}, #B87840)`,
            ].join(', '),
          }}
        >
          {/* Subtle grid */}
          {Array.from({ length: BOARD_ROWS + 1 }).map((_, i) => (
            <div key={`h${i}`} style={{
              position: 'absolute', left: 0, right: 0,
              top: i * cellSize, height: 1,
              background: 'rgba(0,0,0,0.08)',
            }}/>
          ))}
          {Array.from({ length: BOARD_COLS + 1 }).map((_, i) => (
            <div key={`v${i}`} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: i * cellSize, width: 1,
              background: 'rgba(0,0,0,0.08)',
            }}/>
          ))}

          {/* Blocks */}
          {snap.blocks.map(block => (
            <GameBlock
              key={block.id}
              block={block}
              blocks={snap.blocks}
              cellSize={cellSize}
              isSelected={snap.selectedId === block.id}
              onSelect={id => dispatch({ type: 'SELECT', blockId: id })}
              onMove={(id, dir, steps) => dispatch({ type: 'MOVE_BLOCK', blockId: id, dir, steps })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
