import { motion } from 'framer-motion';

const blocks = [
  { digit: 3, place: '10³', value: 3000, color: 'bg-cyan-500/20 border-cyan-400/30' },
  { digit: 4, place: '10²', value: 400, color: 'bg-blue-500/20 border-blue-400/30' },
  { digit: 5, place: '10¹', value: 50, color: 'bg-purple-500/20 border-purple-400/30' },
  { digit: 6, place: '10⁰', value: 6, color: 'bg-emerald-500/20 border-emerald-400/30' },
];

export default function BasePlaceValueStory() {
  return (
    <div className="place-story-shell">
      <h4>Place value as stacked contribution</h4>
      <div className="grid gap-2 mt-3">
        {blocks.map((b, i) => (
          <motion.div
            key={b.place}
            className={`place-block ${b.color}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="font-mono text-slate-200">{b.digit}×{b.place}</span>
            <span className="text-slate-400">=</span>
            <span className="font-mono text-slate-100">{b.value}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-slate-300 text-sm mt-3">Total = 3000 + 400 + 50 + 6 = 3456</p>
    </div>
  );
}
