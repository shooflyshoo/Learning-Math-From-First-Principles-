import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, RefreshCcw, ShieldCheck } from 'lucide-react';

interface SectionCheckpointProps {
  title: string;
  prompts: string[];
  sectionId: string;
  reflectionPrompt?: string;
}

interface SavedCheckpointState {
  checked: boolean[];
  reflection: string;
}

const STORAGE_PREFIX = 'mfp.checkpoint.';
const PROGRESS_EVENT = 'mfp-checkpoint-updated';
const MIN_REFLECTION_CHARS = 60;

function normalizeSaved(raw: string | null, promptCount: number): SavedCheckpointState {
  if (!raw) {
    return { checked: Array.from({ length: promptCount }, () => false), reflection: '' };
  }

  try {
    const parsed = JSON.parse(raw) as SavedCheckpointState | boolean[];
    if (Array.isArray(parsed)) {
      const checked = parsed.length === promptCount ? parsed : Array.from({ length: promptCount }, () => false);
      return { checked, reflection: '' };
    }

    if (parsed && Array.isArray(parsed.checked)) {
      const checked = parsed.checked.length === promptCount ? parsed.checked : Array.from({ length: promptCount }, () => false);
      return { checked, reflection: parsed.reflection ?? '' };
    }
  } catch {
    // ignore malformed storage and fallback to defaults
  }

  return { checked: Array.from({ length: promptCount }, () => false), reflection: '' };
}

export default function SectionCheckpoint({ title, prompts, sectionId, reflectionPrompt }: SectionCheckpointProps) {
  const storageKey = `${STORAGE_PREFIX}${sectionId}`;
  const [state, setState] = useState<SavedCheckpointState>(() => normalizeSaved(localStorage.getItem(storageKey), prompts.length));

  const done = useMemo(() => state.checked.filter(Boolean).length, [state.checked]);
  const reflectionReady = state.reflection.trim().length >= MIN_REFLECTION_CHARS;

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

  const reset = () => {
    setState({
      checked: prompts.map(() => false),
      reflection: '',
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

      <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
        <p className="mb-2 flex items-center gap-2 text-sm text-slate-200">
          <ShieldCheck size={15} className={reflectionReady ? 'text-green-400' : 'text-amber-400'} />
          Mastery gate: explain the section in your own words.
        </p>
        <p className="mb-2 text-xs text-slate-400">
          {reflectionPrompt ?? 'Write how you would teach the core idea to a teammate in one concise paragraph.'}
        </p>
        <textarea
          value={state.reflection}
          onChange={(event) => setState((prev) => ({ ...prev, reflection: event.target.value }))}
          className="min-h-[100px] w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-200 outline-none focus:border-cyan-500"
          placeholder="Type your explanation here..."
        />
        <p className={`mt-2 text-xs ${reflectionReady ? 'text-green-300' : 'text-slate-500'}`}>
          {reflectionReady
            ? 'Gate complete: clear reflection recorded.'
            : `Need ${MIN_REFLECTION_CHARS - state.reflection.trim().length} more characters to complete this gate.`}
        </p>
      </div>

      <button className="section-checkpoint-reset" onClick={reset}>
        <RefreshCcw size={13} /> Reset checklist
      </button>
    </section>
  );
}
