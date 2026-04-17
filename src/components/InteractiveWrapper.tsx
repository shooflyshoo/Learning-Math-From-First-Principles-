import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Play, MousePointerClick, Hand, Info, Sparkles } from 'lucide-react';

interface InteractiveWrapperProps {
  children: React.ReactNode;
  title: string;
  hint: string;
  interactionType?: 'click' | 'drag' | 'input' | 'explore';
}

const observationPrompt: Record<NonNullable<InteractiveWrapperProps['interactionType']>, string> = {
  click: 'Watch what changes after each click—and what stays invariant.',
  drag: 'Sweep slowly across extremes, then return to midpoint to spot patterns.',
  input: 'Try a friendly case, then an edge case, then a weird case.',
  explore: 'Track one variable at a time so your mental model stays stable.',
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

  const InteractionIcon = {
    click: MousePointerClick,
    drag: Hand,
    input: Play,
    explore: Info,
  }[interactionType];

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
      animate={
        prefersReducedMotion
          ? { opacity: 1, y: 0 }
          : isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 50 }
      }
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="interactive-wrapper"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      <div className="interactive-header">
        <div className="interactive-badge">
          <Play size={14} />
          <span>Interactive</span>
        </div>
        <h3 className="interactive-title">{title}</h3>
      </div>

      <motion.div
        className="interactive-hint"
        initial={{ opacity: 1 }}
        animate={{ opacity: hasInteracted ? 0.4 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <InteractionIcon size={16} className="hint-icon" />
        <span>{hint}</span>
      </motion.div>

      <div className="interactive-observation-bar">
        <Sparkles size={14} className="text-cyan-300" />
        <span>{observationPrompt[interactionType]}</span>
      </div>

      <div className="interactive-content">{children}</div>
    </motion.div>
  );
}
