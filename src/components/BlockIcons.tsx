// v1.0.0 | 2026-06-09 MEZ
import React from 'react';
import { BlockShape } from '../game/types';

interface IconProps {
  size: number;
}

// Block 1 – Hiker (2×2)
export function HikerIcon({ size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="40" cy="14" r="8" fill="#f5cba7" stroke="#8B4513" strokeWidth="2"/>
      {/* Hat */}
      <ellipse cx="40" cy="8" rx="11" ry="4" fill="#5D4037"/>
      <rect x="32" y="4" width="16" height="5" rx="2" fill="#5D4037"/>
      {/* Body */}
      <path d="M32 22 Q40 20 48 22 L50 45 H30 Z" fill="#4CAF50"/>
      {/* Left arm with hiking pole */}
      <line x1="32" y1="25" x2="18" y2="42" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round"/>
      <line x1="18" y1="42" x2="14" y2="62" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Right arm */}
      <line x1="48" y1="25" x2="58" y2="38" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round"/>
      {/* Backpack */}
      <rect x="44" y="22" width="12" height="16" rx="3" fill="#FF8F00"/>
      {/* Left leg */}
      <path d="M34 45 L28 65 L24 65" stroke="#5D4037" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* Right leg */}
      <path d="M46 45 L50 63 L55 58" stroke="#5D4037" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* Boots */}
      <ellipse cx="23" cy="65" rx="5" ry="3" fill="#3E2723"/>
      <ellipse cx="56" cy="57" rx="5" ry="3" fill="#3E2723"/>
    </svg>
  );
}

// Rock obstacle (for 2×1 horizontal)
export function RockIcon({ size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="25" rx="35" ry="18" fill="#78909C"/>
      <ellipse cx="40" cy="22" rx="33" ry="16" fill="#90A4AE"/>
      <ellipse cx="30" cy="18" rx="12" ry="7" fill="#B0BEC5"/>
      <ellipse cx="52" cy="20" rx="8" ry="5" fill="#B0BEC5"/>
      <path d="M10 28 Q25 20 40 26 Q55 20 70 28" stroke="#607D8B" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

// Waterfall (for 1×2 vertical)
export function WaterfallIcon({ size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cliff */}
      <rect x="5" y="2" width="30" height="25" rx="3" fill="#8D6E63"/>
      <rect x="8" y="4" width="24" height="20" rx="2" fill="#A1887F"/>
      {/* Water streams */}
      <path d="M18 27 Q16 40 18 55 Q16 65 18 78" stroke="#64B5F6" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9"/>
      <path d="M26 27 Q28 42 25 56 Q27 66 25 78" stroke="#90CAF9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M22 27 Q24 45 22 60 Q20 68 22 78" stroke="#BBDEFB" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* Pool */}
      <ellipse cx="22" cy="76" rx="14" ry="4" fill="#42A5F5" opacity="0.6"/>
    </svg>
  );
}

// Forest / Tree (for 1×2 vertical)
export function ForestIcon({ size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trunk */}
      <rect x="17" y="55" width="6" height="22" rx="2" fill="#5D4037"/>
      {/* Tree layers */}
      <polygon points="20,5 35,32 5,32" fill="#2E7D32"/>
      <polygon points="20,18 36,42 4,42" fill="#388E3C"/>
      <polygon points="20,30 37,55 3,55" fill="#43A047"/>
      {/* Snow caps */}
      <polygon points="20,5 28,20 12,20" fill="white" opacity="0.7"/>
    </svg>
  );
}

// Snow / Snowflake (for 1×1)
export function SnowflakeIcon({ size }: IconProps) {
  const s = size * 0.7;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#90CAF9" strokeWidth="2.5" strokeLinecap="round">
        <line x1="20" y1="4" x2="20" y2="36"/>
        <line x1="4" y1="20" x2="36" y2="20"/>
        <line x1="8" y1="8" x2="32" y2="32"/>
        <line x1="32" y1="8" x2="8" y2="32"/>
        {/* Branches */}
        <line x1="20" y1="10" x2="16" y2="6"/><line x1="20" y1="10" x2="24" y2="6"/>
        <line x1="20" y1="30" x2="16" y2="34"/><line x1="20" y1="30" x2="24" y2="34"/>
        <line x1="10" y1="20" x2="6" y2="16"/><line x1="10" y1="20" x2="6" y2="24"/>
        <line x1="30" y1="20" x2="34" y2="16"/><line x1="30" y1="20" x2="34" y2="24"/>
      </g>
      <circle cx="20" cy="20" r="3" fill="#BBDEFB"/>
      {/* suppress unused var warning */}
      <rect width={s} height={s} opacity="0"/>
    </svg>
  );
}

// Mountain peak (decorative, for top exit area)
export function MountainIcon({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,2 78,58 2,58" fill="#546E7A"/>
      <polygon points="40,2 60,35 20,35" fill="#B0BEC5"/>
      {/* Snow cap */}
      <polygon points="40,2 52,22 28,22" fill="white" opacity="0.9"/>
      {/* Peak glow */}
      <circle cx="40" cy="6" r="4" fill="white" opacity="0.6"/>
    </svg>
  );
}

// Map shape→icon for obstacle blocks
export function ObstacleIcon({ blockId, shape, width, height }: {
  blockId: number;
  shape: BlockShape;
  width: number;
  height: number;
}) {
  const size = Math.min(width, height) * 0.75;
  // Assign icons by blockId
  if (blockId === 2) return <RockIcon size={size} />;
  if (blockId === 3 || blockId === 9) return <WaterfallIcon size={size} />;
  if (blockId === 4 || blockId === 10) return <ForestIcon size={size} />;
  // 1×1 blocks (ids 5,6,7,8) → snowflake
  return <SnowflakeIcon size={size} />;
}
