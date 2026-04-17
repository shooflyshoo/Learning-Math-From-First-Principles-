import { useState } from 'react';
import { CheckCircle2, Circle, RefreshCcw } from 'lucide-react';

interface SectionCheckpointProps {
  title: string;
  prompts: string[];
}

export default function SectionCheckpoint({ title, prompts }: SectionCheckpointProps) {
  const [checked, setChecked] = useState<boolean[]>(() => prompts.map(() => false));

  const toggle = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const done = checked.filter(Boolean).length;

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

      <button className="section-checkpoint-reset" onClick={() => setChecked(prompts.map(() => false))}>
        <RefreshCcw size={13} /> Reset checklist
      </button>
    </section>
  );
}
