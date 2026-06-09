// v1.0.0 | 2026-06-09 MEZ
import React from 'react';
import { GameState, currentSnapshot } from '../game/types';
import { GameAction } from '../game/reducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onSolve: () => void;
  solving: boolean;
}

export function Controls({ state, dispatch, onSolve, solving }: Props) {
  const snap = currentSnapshot(state);
  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;
  const hasHint = state.hintPath !== null;

  const btnBase: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: 'inherit',
    fontWeight: 600,
    letterSpacing: '0.03em',
    transition: 'opacity 0.15s, transform 0.1s',
  };

  return (
    <div id="khunpan-controls" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch', minWidth: 160 }}>
      {/* Stats */}
      <div style={{
        background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ color: '#90A4AE', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Züge</div>
        <div style={{ color: '#ECEFF1', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{snap.moves}</div>
        {state.bestMoves !== null && (
          <div style={{ color: '#FDD835', fontSize: 12 }}>Bestzeit: {state.bestMoves} Züge</div>
        )}
      </div>

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{ ...btnBase, flex: 1, background: canUndo ? '#455A64' : '#263238', color: canUndo ? '#ECEFF1' : '#546E7A', opacity: canUndo ? 1 : 0.5 }}
          disabled={!canUndo}
          onClick={() => dispatch({ type: 'UNDO' })}
        >↩ Undo</button>
        <button
          style={{ ...btnBase, flex: 1, background: canRedo ? '#455A64' : '#263238', color: canRedo ? '#ECEFF1' : '#546E7A', opacity: canRedo ? 1 : 0.5 }}
          disabled={!canRedo}
          onClick={() => dispatch({ type: 'REDO' })}
        >↪ Redo</button>
      </div>

      {/* Hint */}
      {!hasHint ? (
        <button
          style={{ ...btnBase, background: solving ? '#263238' : '#1565C0', color: '#BBDEFB' }}
          onClick={onSolve}
          disabled={solving}
        >
          {solving ? '⏳ Berechne…' : '💡 Hinweis'}
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{ ...btnBase, flex: 1, background: '#1565C0', color: '#BBDEFB' }}
            onClick={() => dispatch({ type: 'HINT_NEXT' })}
            disabled={state.hintStep >= (state.hintPath?.length ?? 0) - 1}
          >▶ Tipp</button>
          <button
            style={{ ...btnBase, background: '#37474F', color: '#90A4AE' }}
            onClick={() => dispatch({ type: 'CLEAR_HINT' })}
          >✕</button>
        </div>
      )}

      {/* Reset */}
      <button
        style={{ ...btnBase, background: '#B71C1C', color: '#FFCDD2', marginTop: 4 }}
        onClick={() => dispatch({ type: 'RESET' })}
      >↺ Neu starten</button>

      {/* Keyboard help */}
      <div style={{ color: '#546E7A', fontSize: 11, lineHeight: 1.5, marginTop: 4 }}>
        <div>1–9 = Block wählen</div>
        <div>↑↓←→ = Bewegen</div>
        <div>Drag / Swipe = Touch</div>
      </div>
    </div>
  );
}
