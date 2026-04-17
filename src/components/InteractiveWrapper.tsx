import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Play, MousePointerClick, Hand, Info, Brain, Target, CheckCircle2, Lightbulb } from 'lucide-react';

interface InteractiveWrapperProps {
  children: React.ReactNode;
  title: string;
  hint: string;
  interactionType?: 'click' | 'drag' | 'input' | 'explore';
}

type MasteryLevel = 'not-started' | 'exploring' | 'understood';

interface QuickCheck {
  prompt: string;
  options: string[];
  answerIndex: number;
  rationale: string;
}

const STORAGE_PREFIX = 'mfp.mastery.';
const PROGRESS_EVENT = 'mfp-progress-updated';

const checkByInteraction: Record<NonNullable<InteractiveWrapperProps['interactionType']>, QuickCheck> = {
  click: {
    prompt: 'What learning move helps most after each click step?',
    options: ['Memorize the final answer only', 'Predict what changes before clicking', 'Click quickly until it works'],
    answerIndex: 1,
    rationale: 'Prediction before action strengthens pattern recognition and transfer.',
  },
  drag: {
    prompt: 'How should you use a slider/drag control for deeper learning?',
    options: ['Move once and stop', 'Sweep extremes and midpoint to map behavior', 'Only stay near default values'],
    answerIndex: 1,
    rationale: 'Checking extremes and midpoint helps visual minds see invariants and boundaries.',
  },
  input: {
    prompt: 'What makes an input experiment most useful?',
    options: ['Try one value and trust it', 'Test easy, edge, and weird cases', 'Avoid negative/zero values'],
    answerIndex: 1,
    rationale: 'Varied cases reveal hidden assumptions and expose domain boundaries.',
  },
  explore: {
    prompt: 'During open exploration, what should you track?',
    options: ['Only the visual style', 'What stays constant and what changes', 'Just whether it feels intuitive'],
    answerIndex: 1,
    rationale: 'Conceptual anchors come from distinguishing changing variables from preserved structure.',
  },
};

export default function InteractiveWrapper({
  children,
  title,
  hint,
  interactionType = 'click',
}: InteractiveWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [explanation, setExplanation] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkResult, setCheckResult] = useState<'correct' | 'incorrect' | null>(null);
  const [mastery, setMastery] = useState<MasteryLevel>('not-started');

  const check = useMemo(() => checkByInteraction[interactionType], [interactionType]);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${title}`) as MasteryLevel | null;
    if (stored === 'exploring' || stored === 'understood' || stored === 'not-started') {
      setMastery(stored);
    }
  }, [title]);

  const persistMastery = (level: MasteryLevel) => {
    setMastery(level);
    localStorage.setItem(`${STORAGE_PREFIX}${title}`, level);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  };

  const handleFirstInteraction = () => {
    setHasInteracted(true);
    if (mastery === 'not-started') {
      persistMastery('exploring');
    }
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === check.answerIndex;
    setCheckResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect && explanation.trim().length > 20) {
      persistMastery('understood');
    }
  };

  const InteractionIcon = {
    click: MousePointerClick,
    drag: Hand,
    input: Play,
    explore: Info,
  }[interactionType];

  const masteryLabel = {
    'not-started': 'Not started',
    exploring: 'Exploring',
    understood: 'Understood',
  }[mastery];

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 60 }}
      animate={
        prefersReducedMotion
          ? { opacity: 1, y: 0 }
          : isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 60 }
      }
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="interactive-wrapper"
      onMouseDown={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
      onKeyDown={handleFirstInteraction}
    >
      <div className="interactive-header">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="interactive-badge">
              <Play size={14} />
              <span>Interactive</span>
            </div>
            <h3 className="interactive-title">{title}</h3>
          </div>
          <span className={`mastery-chip mastery-${mastery}`}>{masteryLabel}</span>
        </div>
      </div>

      <motion.div
        className="interactive-hint"
        initial={{ opacity: 1 }}
        animate={{ opacity: hasInteracted ? 0.4 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <InteractionIcon size={16} className="hint-icon" />
        <span>{hint}</span>
      </motion.div>

      <div className="learn-loop-panel">
        <div className="learn-loop-grid">
          <div className="learn-loop-card">
            <p className="learn-loop-label"><Target size={14} /> Predict</p>
            <p className="learn-loop-text">Before interacting, what do you think will happen?</p>
            <input
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              placeholder="I predict..."
              className="learn-loop-input"
            />
          </div>

          <div className="learn-loop-card">
            <p className="learn-loop-label"><Brain size={14} /> Explain</p>
            <p className="learn-loop-text">After exploring, explain the pattern in your own words.</p>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="The pattern I noticed is..."
              className="learn-loop-input min-h-[84px]"
            />
          </div>
        </div>
      </div>

      <div className="interactive-content">{children}</div>

      <div className="quick-check-panel">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="learn-loop-label mb-0"><Lightbulb size={14} /> Quick Check</p>
          <button className="text-xs text-cyan-300 hover:text-cyan-200" onClick={() => persistMastery('understood')}>
            Mark understood
          </button>
        </div>
        <p className="text-sm text-slate-300 mb-3">{check.prompt}</p>
        <div className="space-y-2">
          {check.options.map((option, idx) => (
            <button
              key={option}
              onClick={() => setSelectedOption(idx)}
              className={`quick-check-option ${selectedOption === idx ? 'selected' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={handleCheck} className="btn-primary px-3 py-2 text-sm rounded-lg">
            Check understanding
          </button>
          {checkResult === 'correct' && (
            <span className="text-green-400 text-sm flex items-center gap-1"><CheckCircle2 size={14} /> {check.rationale}</span>
          )}
          {checkResult === 'incorrect' && (
            <span className="text-red-400 text-sm">Try again: aim for a strategy that reveals patterns, not just answers.</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
