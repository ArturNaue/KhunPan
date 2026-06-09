// v1.2.0 | 2026-06-09 MEZ
import React, { useRef, useState } from 'react';
import { Block, Direction } from '../game/types';
import { shapeDims, maxStepsInDir } from '../game/logic';
import { BlockIcon } from './BlockIcons';

interface Props {
  block: Block;
  blocks: Block[];         // all blocks (for drag constraint computation)
  cellSize: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onMove: (id: number, dir: Direction, steps: number) => void;
}

// Wood tones per block id
const WOOD: Record<number, string> = {
  1:  '#D4AA70', // hiker – light warm sand
  2:  '#B8895A',
  3:  '#A0724A',
  4:  '#9A6B40',
  5:  '#C8A070',
  6:  '#C8A070',
  7:  '#BE9660',
  8:  '#BE9660',
  9:  '#8A6035',
  10: '#956838',
};

interface DragState {
  startX: number; startY: number;
  axis: 'h' | 'v' | null;
  maxNegPx: number; maxPosPx: number;
  moved: boolean;
}

export function GameBlock({ block, blocks, cellSize, isSelected, onSelect, onMove }: Props) {
  const [rowSpan, colSpan] = shapeDims(block.shape);
  const dragRef = useRef<DragState | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [noTransition, setNoTransition] = useState(false);

  const w = colSpan * cellSize;
  const h = rowSpan * cellSize;
  const top  = block.row * cellSize;
  const left = block.col * cellSize;
  const bg   = WOOD[block.id] ?? '#B89060';

  function handlePointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onSelect(block.id);
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      axis: null, maxNegPx: 0, maxPosPx: 0, moved: false,
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    // Determine axis on first significant movement
    if (!d.axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        d.axis = 'h';
        d.maxNegPx = maxStepsInDir(block, 'LEFT',  blocks) * cellSize;
        d.maxPosPx = maxStepsInDir(block, 'RIGHT', blocks) * cellSize;
      } else {
        d.axis = 'v';
        d.maxNegPx = maxStepsInDir(block, 'UP',   blocks) * cellSize;
        d.maxPosPx = maxStepsInDir(block, 'DOWN', blocks) * cellSize;
      }
    }

    if (d.axis === 'h') {
      const cx = Math.max(-d.maxNegPx, Math.min(d.maxPosPx, dx));
      setOffset({ x: cx, y: 0 });
      d.moved = Math.abs(cx) > 4;
    } else if (d.axis === 'v') {
      const cy = Math.max(-d.maxNegPx, Math.min(d.maxPosPx, dy));
      setOffset({ x: 0, y: cy });
      d.moved = Math.abs(cy) > 4;
    }
  }

  function handlePointerUp(_e: React.PointerEvent) {
    const d = dragRef.current;
    dragRef.current = null;

    if (!d || !d.moved || !d.axis) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    // Transition deaktivieren: Block soll direkt am Zielfeld erscheinen (kein Sprung zurück)
    setNoTransition(true);
    setOffset({ x: 0, y: 0 });

    if (d.axis === 'h') {
      const steps = Math.round(offset.x / cellSize);
      if (steps > 0)  onMove(block.id, 'RIGHT', steps);
      else if (steps < 0) onMove(block.id, 'LEFT', -steps);
    } else {
      const steps = Math.round(offset.y / cellSize);
      if (steps > 0)  onMove(block.id, 'DOWN', steps);
      else if (steps < 0) onMove(block.id, 'UP', -steps);
    }

    // Transition nach zwei Frames wieder aktivieren (für Tastatur-Bewegungen)
    requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)));
  }

  const iconPad = 8;

  return (
    <div
      id={`khunpan-block-${block.id}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        top:  top  + 3,
        left: left + 3,
        width:  w - 6,
        height: h - 6,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        background: bg,
        borderRadius: 7,
        // Depth shadow top-left (highlight) + bottom-right (shadow) for carved look
        boxShadow: isSelected
          ? `inset 1px 1px 0 rgba(255,255,255,0.35), inset -1px -1px 0 rgba(0,0,0,0.3),
             0 0 0 3px #FFD700, 0 6px 20px rgba(0,0,0,0.55)`
          : `inset 1px 1px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.25),
             0 3px 8px rgba(0,0,0,0.45)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: (offset.x !== 0 || offset.y !== 0) ? 20 : isSelected ? 10 : 2,
        transition: (noTransition || offset.x !== 0 || offset.y !== 0)
          ? 'none'
          : 'top 0.12s ease, left 0.12s ease, box-shadow 0.15s',
        // Wood grain via repeating gradient
        backgroundImage: [
          `repeating-linear-gradient(108deg, transparent, transparent 7px, rgba(0,0,0,0.03) 7px, rgba(0,0,0,0.03) 8px)`,
          `linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 60%)`,
          `linear-gradient(to bottom right, ${bg}, ${bg}cc)`,
        ].join(', '),
      }}
    >
      <BlockIcon id={block.id} w={w - iconPad * 2} h={h - iconPad * 2} />
    </div>
  );
}
