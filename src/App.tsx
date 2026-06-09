// v1.0.0 | 2026-06-09 MEZ
import React, { useReducer, useState, useCallback } from 'react';
import { reducer, makeInitialState } from './game/reducer';
import { solve } from './game/logic';
import { currentSnapshot } from './game/types';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { WinOverlay } from './components/WinOverlay';

const CELL_SIZE = 80;

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const [solving, setSolving] = useState(false);
  const snap = currentSnapshot(state);

  const handleSolve = useCallback(() => {
    setSolving(true);
    // Run BFS in a timeout to not block the UI
    setTimeout(() => {
      const path = solve(snap.blocks);
      if (path) {
        // Store as GameSnapshot path via SOLVE action
        dispatch({ type: 'SOLVE' });
      }
      setSolving(false);
    }, 10);
  }, [snap.blocks]);

  return (
    <div id="khunpan-app" style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a2a3a 0%, #0d1b2a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Exo 2', sans-serif",
      padding: '24px 16px',
    }}>
      {/* Header */}
      <div id="khunpan-header" style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{
          color: '#ECEFF1', fontSize: 28, fontWeight: 700,
          letterSpacing: '0.05em', margin: 0,
        }}>⛰ Khun Pan</h1>
        <p style={{ color: '#78909C', fontSize: 13, margin: '4px 0 0' }}>
          Führe den Wanderer zum Gipfel
        </p>
      </div>

      {/* Game layout */}
      <div id="khunpan-layout" style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <div style={{ paddingTop: CELL_SIZE * 0.8 }}>
          <GameBoard state={state} dispatch={dispatch} cellSize={CELL_SIZE} />
        </div>
        <Controls
          state={state}
          dispatch={dispatch}
          onSolve={handleSolve}
          solving={solving}
        />
      </div>

      {state.won && (
        <WinOverlay
          moves={snap.moves}
          bestMoves={state.bestMoves}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}
