import { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, Eye, Gauge, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'mfp.learning-support';
const PROGRESS_PREFIX = 'mfp.mastery.';
const PROGRESS_EVENT = 'mfp-progress-updated';

interface Preferences {
  focusMode: boolean;
  lowMotion: boolean;
  highContrast: boolean;
}

export default function LearningSupportPanel() {
  const [prefs, setPrefs] = useState<Preferences>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Preferences;
      } catch {
        // ignore bad stored state
      }
    }
    return {
      focusMode: false,
      lowMotion: false,
      highContrast: false,
    };
  });
  const [understoodCount, setUnderstoodCount] = useState(0);

  const masterySummary = useMemo(
    () => ({
      understood: understoodCount,
      target: 20,
      percent: Math.min(100, Math.round((understoodCount / 20) * 100)),
    }),
    [understoodCount],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    document.body.classList.toggle('focus-mode', prefs.focusMode);
    document.body.classList.toggle('low-motion', prefs.lowMotion);
    document.body.classList.toggle('high-contrast', prefs.highContrast);
  }, [prefs]);

  useEffect(() => {
    const refreshProgress = () => {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(PROGRESS_PREFIX));
      const understood = keys.filter((k) => localStorage.getItem(k) === 'understood').length;
      setUnderstoodCount(understood);
    };

    refreshProgress();
    window.addEventListener(PROGRESS_EVENT, refreshProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, refreshProgress);
  }, []);

  const resetProgress = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PROGRESS_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    setUnderstoodCount(0);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  };

  const toggle = (key: keyof Preferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="support-panel">
      <div className="support-panel-header">
        <p className="support-panel-title"><BrainCircuit size={18} /> Learning Support Controls</p>
        <p className="support-panel-subtitle">Tune the experience for visual, pattern-first, neurodivergent learning.</p>
      </div>

      <div className="support-toggles">
        <button onClick={() => toggle('focusMode')} className={`support-toggle ${prefs.focusMode ? 'active' : ''}`}>
          <Eye size={16} /> Focus mode
        </button>
        <button onClick={() => toggle('lowMotion')} className={`support-toggle ${prefs.lowMotion ? 'active' : ''}`}>
          <Gauge size={16} /> Low motion
        </button>
        <button onClick={() => toggle('highContrast')} className={`support-toggle ${prefs.highContrast ? 'active' : ''}`}>
          <BrainCircuit size={16} /> High contrast
        </button>
      </div>

      <div className="support-progress-wrap">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Concept mastery progress</span>
          <span className="text-cyan-300">{masterySummary.understood} understood</span>
        </div>
        <div className="support-progress-bar">
          <div className="support-progress-fill" style={{ width: `${masterySummary.percent}%` }} />
        </div>
        <button onClick={resetProgress} className="support-reset-btn">
          <RotateCcw size={14} /> Reset progress
        </button>
      </div>
    </section>
  );
}
