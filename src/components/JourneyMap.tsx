import { Compass, Flag, Sparkles, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyMapProps {
  onJump: (id: string) => void;
}

const route = [
  {
    id: 'part1',
    title: 'Number Worlds',
    objective: 'See why each number system exists.',
    signature: 'Hit a wall → extend the world',
    time: '8 min',
  },
  {
    id: 'part2',
    title: 'Operations as Moves',
    objective: 'Feel addition/multiplication as geometry.',
    signature: 'Move, scale, invert',
    time: '12 min',
  },
  {
    id: 'part3',
    title: 'Exponents + Logs',
    objective: 'Internalize inverse thinking.',
    signature: 'Repeated scale ↔ count of scales',
    time: '10 min',
  },
  {
    id: 'part8',
    title: 'Boundaries + Debug',
    objective: 'Turn confusion into diagnosis.',
    signature: 'Undefined = signal, not failure',
    time: '7 min',
  },
];

export default function JourneyMap({ onJump }: JourneyMapProps) {
  return (
    <section className="journey-map">
      <header>
        <h3><Compass size={18} /> Suggested first journey (desktop)</h3>
        <p>
          Follow this path once, then free-explore. It is designed to build one durable mental model before adding detail.
        </p>
      </header>

      <div className="journey-grid">
        {route.map((step, idx) => (
          <motion.article
            key={step.id}
            className="journey-card"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
          >
            <div className="journey-topline">
              <span className="journey-step">Step {idx + 1}</span>
              <span className="journey-time"><Timer size={12} /> {step.time}</span>
            </div>
            <h4>{step.title}</h4>
            <p className="journey-objective">{step.objective}</p>
            <div className="journey-signature"><Sparkles size={13} /> {step.signature}</div>
            <button onClick={() => onJump(step.id)} className="journey-start-btn">
              <Flag size={14} /> Start this step
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
