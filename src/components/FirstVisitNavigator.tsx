import { Compass, PlayCircle, Route, Timer } from 'lucide-react';

interface FirstVisitNavigatorProps {
  onJump: (id: string) => void;
}

const quickPath = [
  {
    id: 'part1',
    title: '1) Number Worlds',
    why: 'Understand why new numbers are invented.',
    time: '6 min',
  },
  {
    id: 'part2',
    title: '2) Operations as Moves',
    why: 'See addition, multiplication, and division visually.',
    time: '10 min',
  },
  {
    id: 'part8',
    title: '3) Boundaries',
    why: 'Learn where rules break and why that matters.',
    time: '5 min',
  },
];

export default function FirstVisitNavigator({ onJump }: FirstVisitNavigatorProps) {
  return (
    <section className="first-visit-panel">
      <div className="first-visit-head">
        <h3><Compass size={18} /> New here? Start with this guided path.</h3>
        <p>
          This site is dense. Use this desktop-first launch path to get fast wins before exploring every section.
        </p>
      </div>

      <div className="first-visit-grid">
        {quickPath.map((step) => (
          <article key={step.id} className="first-visit-card">
            <h4>{step.title}</h4>
            <p>{step.why}</p>
            <div className="first-visit-meta">
              <span><Timer size={13} /> {step.time}</span>
              <button onClick={() => onJump(step.id)}>
                <PlayCircle size={14} /> Start
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="first-visit-cta-row">
        <button onClick={() => onJump('intro')}><Route size={14} /> Read from top</button>
        <button onClick={() => onJump('part4')}><PlayCircle size={14} /> Jump to growth race</button>
      </div>
    </section>
  );
}
