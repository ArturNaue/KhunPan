// v1.2.0 | 2026-06-09 MEZ
import { useReducer, useState, useCallback, useRef } from 'react';
import { reducer, makeInitialState } from './game/reducer';
import { currentSnapshot } from './game/types';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { WinOverlay } from './components/WinOverlay';
import type { Block } from './game/types';

const CELL_SIZE = 80;
type SolverMode = 'hint' | 'solve';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const [solverMode, setSolverMode] = useState<SolverMode | null>(null);
  const snap = currentSnapshot(state);
  const workerRef = useRef<Worker | null>(null);

  const runSolver = useCallback((mode: SolverMode) => {
    // Vorherigen Worker abbrechen falls noch laufend
    workerRef.current?.terminate();
    setSolverMode(mode);

    const worker = new Worker(
      new URL('./utils/solver.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      worker.terminate();
      workerRef.current = null;
      setSolverMode(null);
      const path = e.data as Block[][] | null;
      if (path) {
        dispatch(mode === 'hint'
          ? { type: 'SET_HINT_PATH', path }
          : { type: 'APPLY_SOLUTION_PATH', path }
        );
      }
    };

    worker.onerror = () => {
      worker.terminate();
      workerRef.current = null;
      setSolverMode(null);
    };

    worker.postMessage(snap.blocks);
  }, [snap.blocks]);

  const handleHint = useCallback(() => runSolver('hint'), [runSolver]);
  const handleSolve = useCallback(() => runSolver('solve'), [runSolver]);

  return (
    <div id="khunpan-app" style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a120a 0%, #0d0a06 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Exo 2', sans-serif",
      padding: '24px 16px',
    }}>
      {/* Header */}
      <div id="khunpan-header" style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{
          color: '#E8C87A',
          fontSize: 30, fontWeight: 700,
          letterSpacing: '0.08em', margin: 0,
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}>⛰ Khun Pan</h1>
        <p style={{ color: '#8A7055', fontSize: 13, margin: '4px 0 0' }}>
          Führe den Wanderer zum Gipfel
        </p>
      </div>

      {/* Game layout */}
      <div id="khunpan-layout" style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 28,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <div style={{ paddingTop: CELL_SIZE * 0.75 }}>
          <GameBoard state={state} dispatch={dispatch} cellSize={CELL_SIZE} />
        </div>
        <Controls
          state={state}
          dispatch={dispatch}
          onHint={handleHint}
          onSolve={handleSolve}
          solverMode={solverMode}
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
