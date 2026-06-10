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
type SolvePhase = 'calculating' | 'playing' | 'paused' | 'final';

interface SolvePlayback {
  path: Block[][];
  nextStep: number;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const [solverMode, setSolverMode] = useState<SolverMode | null>(null);
  const [solvePhase, setSolvePhase] = useState<SolvePhase | null>(null);
  const [solverMessage, setSolverMessage] = useState<string | null>(null);
  const snap = currentSnapshot(state);
  const workerRef = useRef<Worker | null>(null);
  const solveTimerRef = useRef<number | null>(null);
  const solvePlaybackRef = useRef<SolvePlayback | null>(null);

  const clearSolveAnimation = useCallback(() => {
    if (solveTimerRef.current !== null) {
      window.clearTimeout(solveTimerRef.current);
      solveTimerRef.current = null;
    }
  }, []);

  const resetSolverState = useCallback(() => {
    setSolverMode(null);
    setSolvePhase(null);
    solvePlaybackRef.current = null;
  }, []);

  const pauseSolveAnimation = useCallback(() => {
    clearSolveAnimation();
    setSolvePhase('paused');
  }, [clearSolveAnimation]);

  const advanceSolveStep = useCallback(() => {
    const playback = solvePlaybackRef.current;
    if (!playback) {
      resetSolverState();
      return;
    }

    dispatch({ type: 'HINT_NEXT' });
    playback.nextStep++;

    if (playback.nextStep >= playback.path.length) {
      dispatch({ type: 'CLEAR_HINT' });
      resetSolverState();
      return;
    }

    if (playback.nextStep === playback.path.length - 1) {
      clearSolveAnimation();
      setSolvePhase('final');
      return;
    }

    setSolvePhase('playing');
    solveTimerRef.current = window.setTimeout(advanceSolveStep, SOLVE_STEP_MS);
  }, [clearSolveAnimation, resetSolverState]);

  const resumeSolveAnimation = useCallback(() => {
    clearSolveAnimation();
    setSolvePhase('playing');
    solveTimerRef.current = window.setTimeout(advanceSolveStep, SOLVE_STEP_MS);
  }, [advanceSolveStep, clearSolveAnimation]);

  const playSolutionPath = useCallback((path: Block[][]) => {
    dispatch({ type: 'SET_HINT_PATH', path });
    if (path.length <= 1) {
      resetSolverState();
      return;
    }

    solvePlaybackRef.current = { path, nextStep: 1 };
    if (path.length === 2) {
      setSolvePhase('final');
      return;
    }

    setSolvePhase('playing');
    solveTimerRef.current = window.setTimeout(advanceSolveStep, SOLVE_STEP_MS);
  }, [advanceSolveStep, resetSolverState]);

  const finishFinalSolveStep = useCallback(() => {
    advanceSolveStep();
  }, [advanceSolveStep]);

  const runSolver = useCallback((mode: SolverMode) => {
    // Vorherigen Worker abbrechen falls noch laufend
    workerRef.current?.terminate();
    clearSolveAnimation();
    solvePlaybackRef.current = null;
    setSolverMessage(null);
    setSolverMode(mode);
    setSolvePhase(mode === 'solve' ? 'calculating' : null);

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
        resetSolverState();
        setSolverMessage('Keine Lösung gefunden.');
      }
    };

    worker.onerror = () => {
      worker.terminate();
      workerRef.current = null;
      resetSolverState();
      setSolverMessage('Solver-Fehler. Bitte erneut versuchen.');
    };

    worker.postMessage(snap.blocks);
  }, [clearSolveAnimation, playSolutionPath, resetSolverState, snap.blocks]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      clearSolveAnimation();
      solvePlaybackRef.current = null;
    };
  }, [clearSolveAnimation]);

  const handleHint = useCallback(() => runSolver('hint'), [runSolver]);
  const handleSolve = useCallback(() => {
    if (solverMode !== 'solve') {
      runSolver('solve');
      return;
    }

    if (solvePhase === 'playing') {
      pauseSolveAnimation();
      return;
    }

    if (solvePhase === 'paused') {
      resumeSolveAnimation();
      return;
    }

    if (solvePhase === 'final') {
      finishFinalSolveStep();
    }
  }, [finishFinalSolveStep, pauseSolveAnimation, resumeSolveAnimation, runSolver, solvePhase, solverMode]);

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
          solvePhase={solvePhase}
          solverMessage={solverMessage}
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
