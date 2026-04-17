import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, RefreshCcw, Sparkles, Wand2 } from 'lucide-react';

interface VisualChallenge {
  prompt: string;
  options: string[];
  correctIndex: number;
  celebration: string;
}

interface SectionCheckpointProps {
  title: string;
  prompts: string[];
  sectionId: string;
  visualChallenge: VisualChallenge;
}

interface SavedCheckpointState {
  checked: boolean[];
  selectedOption: number | null;
  challengeSolved: boolean;
}

const STORAGE_PREFIX = 'mfp.checkpoint.';
const PROGRESS_EVENT = 'mfp-checkpoint-updated';

function normalizeSaved(raw: string | null, promptCount: number): SavedCheckpointState {
  const fallback: SavedCheckpointState = {
    checked: Array.from({ length: promptCount }, () => false),
    selectedOption: null,
    challengeSolved: false,
  };

  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as SavedCheckpointState | boolean[];
    if (Array.isArray(parsed)) {
      const checked = parsed.length === promptCount ? parsed : fallback.checked;
      return { ...fallback, checked };
    }

    if (parsed && Array.isArray(parsed.checked)) {
      return {
        checked: parsed.checked.length === promptCount ? parsed.checked : fallback.checked,
        selectedOption: typeof parsed.selectedOption === 'number' ? parsed.selectedOption : null,
        challengeSolved: Boolean(parsed.challengeSolved),
      };
    }
  } catch {
    // ignore malformed storage and fallback to defaults
  }

  return fallback;
}

export default function SectionCheckpoint({ title, prompts, sectionId, visualChallenge }: SectionCheckpointProps) {
  const storageKey = `${STORAGE_PREFIX}${sectionId}`;
  const [state, setState] = useState<SavedCheckpointState>(() => normalizeSaved(localStorage.getItem(storageKey), prompts.length));

  const done = useMemo(() => state.checked.filter(Boolean).length, [state.checked]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }, [state, storageKey]);

  const toggle = (idx: number) => {
    setState((prev) => ({
      ...prev,
      checked: prev.checked.map((v, i) => (i === idx ? !v : v)),
    }));
  };

  const chooseOption = (idx: number) => {
    setState((prev) => ({
      ...prev,
      selectedOption: idx,
      challengeSolved: idx === visualChallenge.correctIndex,
    }));
  };

  const reset = () => {
    setState({
      checked: prompts.map(() => false),
      selectedOption: null,
      challengeSolved: false,
    });
  };

  return (
    <section className="section-checkpoint">
      <div className="section-checkpoint-head">
        <h4>{title}</h4>
        <span>{done}/{prompts.length} grounded</span>
      </div>
      <div className="section-checkpoint-meter" aria-hidden>
        <div className="section-checkpoint-meter-fill" style={{ width: `${(done / prompts.length) * 100}%` }} />
      </div>

      <div className="section-checkpoint-list">
        {prompts.map((prompt, idx) => (
          <button key={prompt} onClick={() => toggle(idx)} className={`section-checkpoint-item ${state.checked[idx] ? 'done' : ''}`}>
            {state.checked[idx] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      <div className="checkpoint-challenge">
        <p className="checkpoint-challenge-title">
          <Sparkles size={15} /> Mastery remix: pick the move that best fits this section.
        </p>
        <p className="checkpoint-challenge-prompt">{visualChallenge.prompt}</p>

        <div className="checkpoint-challenge-grid">
          {visualChallenge.options.map((option, idx) => {
            const selected = state.selectedOption === idx;
            const correct = idx === visualChallenge.correctIndex;
            return (
              <button
                key={option}
                onClick={() => chooseOption(idx)}
                className={`checkpoint-choice ${selected ? 'selected' : ''} ${state.challengeSolved && correct ? 'correct' : ''}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {state.selectedOption !== null && !state.challengeSolved && (
          <p className="checkpoint-feedback warn">Not quite—try another move and watch which one preserves the section’s rule.</p>
        )}

        {state.challengeSolved && (
          <p className="checkpoint-feedback success">
            <Wand2 size={14} /> {visualChallenge.celebration}
          </p>
        )}
      </div>

      <button className="section-checkpoint-reset" onClick={reset}>
        <RefreshCcw size={13} /> Reset checkpoint
      </button>
    </section>
  );
}
