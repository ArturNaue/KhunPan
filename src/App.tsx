// v1.2.0 | 2026-06-09 MEZ
import { useReducer, useState, useCallback, useEffect, useRef } from 'react';
import { reducer, makeInitialState } from './game/reducer';
import { currentSnapshot } from './game/types';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { WinOverlay } from './components/WinOverlay';
import type { Block } from './game/types';

const CELL_SIZE = 80;
const SOLVE_STEP_MS = 180;
type SolverMode = 'hint' | 'solve';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const [solverMode, setSolverMode] = useState<SolverMode | null>(null);
  const snap = currentSnapshot(state);
  const workerRef = useRef<Worker | null>(null);
  const solveTimerRef = useRef<number | null>(null);

  const clearSolveAnimation = useCallback(() => {
    if (solveTimerRef.current !== null) {
      window.clearTimeout(solveTimerRef.current);
      solveTimerRef.current = null;
    }
  }, []);

  const playSolutionPath = useCallback((path: Block[][]) => {
    dispatch({ type: 'SET_HINT_PATH', path });
    if (path.length <= 1) {
      setSolverMode(null);
      return;
    }

    let nextStep = 1;
    const advance = () => {
      dispatch({ type: 'HINT_NEXT' });
      nextStep++;
      if (nextStep < path.length) {
        solveTimerRef.current = window.setTimeout(advance, SOLVE_STEP_MS);
      } else {
        solveTimerRef.current = null;
        setSolverMode(null);
      }
    };

    solveTimerRef.current = window.setTimeout(advance, SOLVE_STEP_MS);
  }, []);

  const runSolver = useCallback((mode: SolverMode) => {
    // Vorherigen Worker abbrechen falls noch laufend
    workerRef.current?.terminate();
    clearSolveAnimation();
    setSolverMode(mode);

    const worker = new Worker(
      new URL('./utils/solver.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<Block[][] | null>) => {
      worker.terminate();
      workerRef.current = null;
      const path = e.data;
      if (path) {
        if (mode === 'hint') {
          dispatch({ type: 'SET_HINT_PATH', path });
          setSolverMode(null);
        } else {
          playSolutionPath(path);
        }
      } else {
        setSolverMode(null);
      }
    };

    worker.onerror = () => {
      worker.terminate();
      workerRef.current = null;
      setSolverMode(null);
    };

    worker.postMessage(snap.blocks);
  }, [clearSolveAnimation, playSolutionPath, snap.blocks]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      clearSolveAnimation();
    };
  }, [clearSolveAnimation]);

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
