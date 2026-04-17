import { useState } from 'react';
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

  return (
    <section className="transfer-challenge">
      <h4><Brain size={16} /> {title}</h4>
      <p className="transfer-challenge-question">{challenge}</p>

      <div className="transfer-challenge-actions">
        <button onClick={() => setShowHint((v) => !v)}>
          <Lightbulb size={14} /> {showHint ? 'Hide hint' : 'Need a hint'}
        </button>
        <button onClick={() => setShowAnswer((v) => !v)}>
          <CheckCircle2 size={14} /> {showAnswer ? 'Hide answer' : 'Reveal answer'}
        </button>
      </div>

      {showHint && <p className="transfer-hint">Hint: {hint}</p>}
      {showAnswer && <p className="transfer-answer">Answer: {answer}</p>}
    </section>
  );
}
