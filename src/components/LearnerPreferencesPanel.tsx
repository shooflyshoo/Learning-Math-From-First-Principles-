import { BrainCircuit, Contrast, Focus, Minimize2, RotateCcw } from 'lucide-react';
import type { ComponentType } from 'react';

type LearnerPreferences = {
  focusMode: boolean;
  highContrast: boolean;
  lowMotion: boolean;
  conciseText: boolean;
};

interface LearnerPreferencesPanelProps {
  value: LearnerPreferences;
  onChange: (next: LearnerPreferences) => void;
}

const toggles: Array<{
  key: keyof LearnerPreferences;
  label: string;
  icon: ComponentType<{ size?: number }>;
}> = [
  { key: 'focusMode', label: 'Focus mode', icon: Focus },
  { key: 'highContrast', label: 'High contrast', icon: Contrast },
  { key: 'lowMotion', label: 'Low motion', icon: Minimize2 },
  { key: 'conciseText', label: 'Concise text', icon: BrainCircuit },
];

export default function LearnerPreferencesPanel({ value, onChange }: LearnerPreferencesPanelProps) {
  const toggle = (key: keyof LearnerPreferences) => {
    onChange({
      ...value,
      [key]: !value[key],
    });
  };

  const reset = () => {
    onChange({
      focusMode: false,
      highContrast: false,
      lowMotion: false,
      conciseText: false,
    });
  };

  return (
    <section className="support-panel" aria-label="Learning supports">
      <h3 className="support-panel-title">
        <BrainCircuit size={18} /> Learning supports
      </h3>
      <p className="support-panel-subtitle">
        Tune motion, contrast, and text density so each lesson stays readable and predictable.
      </p>

      <div className="support-toggles">
        {toggles.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.key}
              onClick={() => toggle(option.key)}
              className={`support-toggle ${value[option.key] ? 'active' : ''}`}
              aria-pressed={value[option.key]}
            >
              <Icon size={14} />
              {option.label}
            </button>
          );
        })}
      </div>

      <button className="support-reset-btn" onClick={reset}>
        <RotateCcw size={13} /> Reset supports
      </button>
    </section>
  );
}
