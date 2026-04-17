import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, RefreshCcw } from 'lucide-react';

interface SectionCheckpointProps {
  title: string;
  prompts: string[];
  sectionId: string;
}

const STORAGE_PREFIX = 'mfp.checkpoint.';
const PROGRESS_EVENT = 'mfp-checkpoint-updated';

export default function SectionCheckpoint({ title, prompts, sectionId }: SectionCheckpointProps) {
  const storageKey = `${STORAGE_PREFIX}${sectionId}`;
  const [checked, setChecked] = useState<boolean[]>(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed) && parsed.length === prompts.length) {
          return parsed;
        }
      } catch {
        // ignore malformed storage and fallback to defaults
      }
    }
    return prompts.map(() => false);
  });

  const done = useMemo(() => checked.filter(Boolean).length, [checked]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }, [checked, storageKey]);

  const toggle = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const reset = () => {
    setChecked(prompts.map(() => false));
  };

  return (
    <section className="section-checkpoint">
      <div className="section-checkpoint-head">
        <h4>{title}</h4>
        <span>{done}/{prompts.length} grounded</span>
      </div>

      <div className="section-checkpoint-list">
        {prompts.map((prompt, idx) => (
          <button key={prompt} onClick={() => toggle(idx)} className={`section-checkpoint-item ${checked[idx] ? 'done' : ''}`}>
            {checked[idx] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      <button className="section-checkpoint-reset" onClick={reset}>
        <RefreshCcw size={13} /> Reset checklist
      </button>
    </section>
  );
}
