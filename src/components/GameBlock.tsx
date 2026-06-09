// v1.0.0 | 2026-06-09 MEZ
import React, { useRef } from 'react';
import { Block, Direction } from '../game/types';
import { shapeDims } from '../game/logic';
import { HikerIcon, ObstacleIcon } from './BlockIcons';

interface Props {
  block: Block;
  cellSize: number;
  isSelected: boolean;
  validDirs: Direction[];
  onSelect: (id: number) => void;
  onMove: (id: number, dir: Direction) => void;
}

const WOOD_COLORS: Record<number, string> = {
  1: 'linear-gradient(135deg, #D4A373 0%, #CCD5AE 100%)', // hiker – warm sand
  2: '#A0785A',
  3: '#8B6347',
  4: '#7A5C3C',
  9: '#8B6347',
  10: '#7A5C3C',
  5: '#C49A72',
  6: '#C49A72',
  7: '#BF8A5A',
  8: '#BF8A5A',
};

export function GameBlock({ block, cellSize, isSelected, validDirs: _validDirs, onSelect, onMove }: Props) {
  const [rowSpan, colSpan] = shapeDims(block.shape);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const width = colSpan * cellSize;
  const height = rowSpan * cellSize;
  const top = block.row * cellSize;
  const left = block.col * cellSize;

  const bg = WOOD_COLORS[block.id] ?? '#A0785A';
  const isHiker = block.id === 1;

  function handlePointerDown(e: React.PointerEvent) {
    dragStart.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onSelect(block.id);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const threshold = cellSize * 0.3;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) onMove(block.id, 'RIGHT');
      else if (dx < -threshold) onMove(block.id, 'LEFT');
    } else {
      if (dy > threshold) onMove(block.id, 'DOWN');
      else if (dy < -threshold) onMove(block.id, 'UP');
    }
    dragStart.current = null;
  }

  return (
    <div
      id={`khunpan-block-${block.id}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        top: top + 2,
        left: left + 2,
        width: width - 4,
        height: height - 4,
        background: typeof bg === 'string' ? bg : undefined,
        backgroundImage: bg.startsWith('linear') ? bg : undefined,
        borderRadius: 8,
        border: isSelected ? '2.5px solid #FFF176' : '2px solid rgba(0,0,0,0.35)',
        boxShadow: isSelected
          ? '0 0 0 2px #FFF176, 0 4px 16px rgba(0,0,0,0.5)'
          : '0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: 'top 0.12s ease, left 0.12s ease, box-shadow 0.1s',
        zIndex: isSelected ? 10 : 2,
        // Wood grain texture via repeating gradient
        backgroundSize: '8px 8px',
      }}
    >
      {/* Wood grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 7,
        background: 'repeating-linear-gradient(105deg, transparent, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 7px)',
        pointerEvents: 'none',
      }}/>

      {isHiker
        ? <HikerIcon size={Math.min(width, height) * 0.7} />
        : <ObstacleIcon blockId={block.id} shape={block.shape} width={width - 8} height={height - 8} />
      }
    </div>
  );
}
