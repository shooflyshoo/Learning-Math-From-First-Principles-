import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Lightbulb, CheckCircle2 } from 'lucide-react';

interface TransferChallengeProps {
  title: string;
  challenge: string;
  hint: string;
  answer: string;
}

export default function TransferChallenge({ title, challenge, hint, answer }: TransferChallengeProps) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const progress = (showHint ? 1 : 0) + (showAnswer ? 1 : 0);

  return (
    <section className="transfer-challenge">
      <h4><Brain size={16} /> {title}</h4>
      <p className="transfer-challenge-question">{challenge}</p>

      <div className="transfer-meter" aria-hidden>
        <div className="transfer-meter-fill" style={{ width: `${(progress / 2) * 100}%` }} />
      </div>

      <div className="transfer-challenge-actions">
        <button onClick={() => setShowHint((v) => !v)}>
          <Lightbulb size={14} /> {showHint ? 'Hide hint' : 'Need a hint'}
        </button>
        <button onClick={() => setShowAnswer((v) => !v)}>
          <CheckCircle2 size={14} /> {showAnswer ? 'Hide answer' : 'Reveal answer'}
        </button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="transfer-hint"
          >
            Hint: {hint}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAnswer && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="transfer-answer"
          >
            Answer: {answer}
          </motion.p>
        )}
      </AnimatePresence>

      {showAnswer && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="transfer-delight"
        >
          ✨ Nice transfer—now try inventing your own real-world example.
        </motion.p>
      )}
    </section>
  );
}
