import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, MousePointerClick, Hand, Info } from 'lucide-react';

interface InteractiveWrapperProps {
  children: React.ReactNode;
  title: string;
  hint: string;
  interactionType?: 'click' | 'drag' | 'input' | 'explore';
}

export default function InteractiveWrapper({
  children,
  title,
  hint,
  interactionType = 'click',
}: InteractiveWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
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
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="interactive-wrapper"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      {/* Header */}
      <div className="interactive-header">
        <div className="interactive-badge">
          <Play size={14} />
          <span>Interactive</span>
        </div>
        <h3 className="interactive-title">{title}</h3>
      </div>

      {/* Hint bar - fades after interaction */}
      <motion.div
        className="interactive-hint"
        initial={{ opacity: 1 }}
        animate={{ opacity: hasInteracted ? 0.3 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <InteractionIcon size={16} className="hint-icon" />
        <span>{hint}</span>
      </motion.div>

      {/* Content */}
      <div className="interactive-content">
        {children}
      </div>
    </motion.div>
  );
}
