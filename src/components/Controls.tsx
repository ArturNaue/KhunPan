// v1.1.0 | 2026-06-09 MEZ
import React from 'react';
import { GameState, currentSnapshot } from '../game/types';
import { GameAction } from '../game/reducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onHint: () => void;
  onSolve: () => void;
  solverMode: 'hint' | 'solve' | null;
  solvePhase: 'calculating' | 'playing' | 'paused' | 'final' | null;
  solverMessage: string | null;
  compact: boolean;
}

const BTN: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 8,
  border: '1px solid rgba(0,0,0,0.35)',
  cursor: 'pointer',
  fontSize: 13,
  fontFamily: 'inherit',
  fontWeight: 600,
  letterSpacing: '0.02em',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.4)',
};

export function Controls({ state, dispatch, onHint, onSolve, solverMode, solvePhase, solverMessage, compact }: Props) {
  const snap = currentSnapshot(state);
  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;
  const hasHint = state.hintPath !== null;
  const isWorking = solverMode !== null;
  const isSolving = solverMode === 'solve';
  const solveLabel = solvePhase === 'paused'
    ? '▶ Weiter'
    : solvePhase === 'final'
      ? '✓ Abschließen'
      : solvePhase === 'calculating' || solvePhase === 'playing'
        ? '⏳ Löse…'
        : '✓ Lösen';

  return (
    <div id="khunpan-controls" style={{
      display: 'flex', flexDirection: 'column', gap: compact ? 8 : 12,
      alignItems: 'stretch',
      width: compact ? 'min(100%, 348px)' : 176,
      minWidth: compact ? 0 : 160,
      paddingTop: compact ? 0 : 8,
    }}>
      {/* Stats card */}
      <div style={{
        background: 'rgba(196,145,74,0.12)',
        border: '1px solid rgba(196,145,74,0.25)',
        borderRadius: 8,
        padding: compact ? '9px 12px' : '14px 18px',
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        alignItems: compact ? 'center' : 'stretch',
        justifyContent: compact ? 'space-between' : 'flex-start',
        gap: compact ? 10 : 6,
      }}>
        <div style={{ color: '#8A7055', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Züge</div>
        <div style={{ color: '#E8C87A', fontSize: compact ? 24 : 32, fontWeight: 700, lineHeight: 1 }}>{snap.moves}</div>
        {state.bestMoves !== null && (
          <div style={{ color: '#A89060', fontSize: 12, marginLeft: compact ? 'auto' : 0 }}>Bestzeit: {state.bestMoves} Züge</div>
        )}
      </div>

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{ ...BTN, flex: 1,
            padding: compact ? '8px 10px' : BTN.padding,
            background: canUndo ? '#5C3310' : '#2A1A08',
            color: canUndo ? '#E8C87A' : '#5A4020',
            opacity: canUndo && !isWorking ? 1 : 0.5,
          }}
          disabled={!canUndo || isWorking}
          onClick={() => dispatch({ type: 'UNDO' })}
        >↩ Undo</button>
        <button
          style={{ ...BTN, flex: 1,
            padding: compact ? '8px 10px' : BTN.padding,
            background: canRedo ? '#5C3310' : '#2A1A08',
            color: canRedo ? '#E8C87A' : '#5A4020',
            opacity: canRedo && !isWorking ? 1 : 0.5,
          }}
          disabled={!canRedo || isWorking}
          onClick={() => dispatch({ type: 'REDO' })}
        >↪ Redo</button>
      </div>

      {/* Hint */}
      {!hasHint ? (
        <button
          style={{ ...BTN, padding: compact ? '8px 10px' : BTN.padding, background: solverMode === 'hint' ? '#2A1A08' : '#1A3A5C', color: '#90C8E8' }}
          onClick={onHint}
          disabled={isWorking || state.won}
        >
          {solverMode === 'hint' ? '⏳ Berechne…' : '💡 Hinweis'}
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{ ...BTN, flex: 1, padding: compact ? '8px 10px' : BTN.padding, background: '#1A3A5C', color: '#90C8E8' }}
            onClick={() => dispatch({ type: 'HINT_NEXT' })}
            disabled={isWorking || state.hintStep >= (state.hintPath?.length ?? 0) - 1}
          >▶ Tipp</button>
          <button
            style={{ ...BTN, padding: compact ? '8px 10px' : BTN.padding, background: '#3A2010', color: '#8A7055' }}
            onClick={() => dispatch({ type: 'CLEAR_HINT' })}
            disabled={isWorking}
          >✕</button>
        </div>
      )}

      <button
        style={{ ...BTN, padding: compact ? '8px 10px' : BTN.padding, background: solverMode === 'solve' ? '#2A1A08' : '#315C1A', color: '#BEE890' }}
        onClick={onSolve}
        disabled={(isWorking && !isSolving) || state.won || solvePhase === 'calculating'}
      >
        {solveLabel}
      </button>

      {solverMessage && (
        <div style={{
          color: '#D9B06D',
          fontSize: 12,
          lineHeight: 1.4,
          padding: '0 2px',
        }}>
          {solverMessage}
        </div>
      )}

      {/* Reset */}
      <button
        style={{ ...BTN, padding: compact ? '8px 10px' : BTN.padding, background: '#5C1A10', color: '#F0A090', marginTop: compact ? 0 : 4, opacity: isWorking ? 0.5 : 1 }}
        onClick={() => dispatch({ type: 'RESET' })}
        disabled={isWorking}
      >↺ Neu starten</button>

      {/* Keyboard hints */}
      <div style={{
        color: '#5A4020', fontSize: 11, lineHeight: 1.7,
        borderTop: '1px solid rgba(196,145,74,0.12)',
        paddingTop: compact ? 8 : 10, marginTop: compact ? 0 : 2,
      }}>
        <div>1–9 = Block wählen</div>
        <div>↑↓←→ = Schieben</div>
        <div>Drag / Swipe = Touch</div>
      </div>
    </div>
  );
}
