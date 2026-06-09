// v1.0.0 | 2026-06-09 MEZ
import React from 'react';
import { GameAction } from '../game/reducer';

interface Props {
  moves: number;
  bestMoves: number | null;
  dispatch: React.Dispatch<GameAction>;
}

export function WinOverlay({ moves, bestMoves, dispatch }: Props) {
  const isRecord = bestMoves !== null && moves <= bestMoves;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #1a2a3a, #263238)',
        border: '2px solid #455A64',
        borderRadius: 20,
        padding: '40px 48px',
        textAlign: 'center',
        maxWidth: 340,
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      }}>
        <div style={{ fontSize: 56 }}>🏔️</div>
        <h2 style={{ color: '#ECEFF1', fontSize: 26, fontWeight: 700, margin: '12px 0 4px' }}>
          Gipfel erreicht!
        </h2>
        <p style={{ color: '#90A4AE', margin: '0 0 20px' }}>
          Der Wanderer hat den Gipfel erklommen!
        </p>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 20px', marginBottom: 20 }}>
          <div style={{ color: '#FDD835', fontSize: 22, fontWeight: 700 }}>{moves} Züge</div>
          {isRecord && <div style={{ color: '#69F0AE', fontSize: 13, marginTop: 4 }}>🏆 Neuer Rekord!</div>}
          {bestMoves !== null && !isRecord && (
            <div style={{ color: '#78909C', fontSize: 13, marginTop: 4 }}>Bestzeit: {bestMoves} Züge</div>
          )}
        </div>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          style={{
            background: '#2196F3', color: 'white',
            border: 'none', borderRadius: 10,
            padding: '12px 32px', fontSize: 15,
            fontFamily: 'inherit', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Nochmal spielen
        </button>
      </div>
    </div>
  );
}
