// v1.1.0 | 2026-06-09 MEZ
import React from 'react';
import { GameState, currentSnapshot } from '../game/types';
import { GameAction } from '../game/reducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onSolve: () => void;
  solving: boolean;
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

export function Controls({ state, dispatch, onSolve, solving }: Props) {
  const snap = currentSnapshot(state);
  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;
  const hasHint = state.hintPath !== null;

  return (
    <div id="khunpan-controls" style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      alignItems: 'stretch', minWidth: 160,
      paddingTop: 8,
    }}>
      {/* Stats card */}
      <div style={{
        background: 'rgba(196,145,74,0.12)',
        border: '1px solid rgba(196,145,74,0.25)',
        borderRadius: 12, padding: '14px 18px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ color: '#8A7055', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Züge</div>
        <div style={{ color: '#E8C87A', fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{snap.moves}</div>
        {state.bestMoves !== null && (
          <div style={{ color: '#A89060', fontSize: 12 }}>Bestzeit: {state.bestMoves} Züge</div>
        )}
      </div>

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{ ...BTN, flex: 1,
            background: canUndo ? '#5C3310' : '#2A1A08',
            color: canUndo ? '#E8C87A' : '#5A4020',
            opacity: canUndo ? 1 : 0.5,
          }}
          disabled={!canUndo}
          onClick={() => dispatch({ type: 'UNDO' })}
        >↩ Undo</button>
        <button
          style={{ ...BTN, flex: 1,
            background: canRedo ? '#5C3310' : '#2A1A08',
            color: canRedo ? '#E8C87A' : '#5A4020',
            opacity: canRedo ? 1 : 0.5,
          }}
          disabled={!canRedo}
          onClick={() => dispatch({ type: 'REDO' })}
        >↪ Redo</button>
      </div>

      {/* Hint */}
      {!hasHint ? (
        <button
          style={{ ...BTN, background: solving ? '#2A1A08' : '#1A3A5C', color: '#90C8E8' }}
          onClick={onSolve}
          disabled={solving}
        >
          {solving ? '⏳ Berechne…' : '💡 Hinweis'}
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{ ...BTN, flex: 1, background: '#1A3A5C', color: '#90C8E8' }}
            onClick={() => dispatch({ type: 'HINT_NEXT' })}
            disabled={state.hintStep >= (state.hintPath?.length ?? 0) - 1}
          >▶ Tipp</button>
          <button
            style={{ ...BTN, background: '#3A2010', color: '#8A7055' }}
            onClick={() => dispatch({ type: 'CLEAR_HINT' })}
          >✕</button>
        </div>
      )}

      {/* Reset */}
      <button
        style={{ ...BTN, background: '#5C1A10', color: '#F0A090', marginTop: 4 }}
        onClick={() => dispatch({ type: 'RESET' })}
      >↺ Neu starten</button>

      {/* Keyboard hints */}
      <div style={{
        color: '#5A4020', fontSize: 11, lineHeight: 1.7,
        borderTop: '1px solid rgba(196,145,74,0.12)',
        paddingTop: 10, marginTop: 2,
      }}>
        <div>1–9 = Block wählen</div>
        <div>↑↓←→ = Schieben</div>
        <div>Drag / Swipe = Touch</div>
      </div>
    </div>
  );
}
