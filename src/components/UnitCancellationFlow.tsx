import { motion } from 'framer-motion';

const terms = [
  { id: 'm', label: 'm', color: 'bg-cyan-500/25 text-cyan-300' },
  { id: 's', label: 's', color: 'bg-yellow-500/25 text-yellow-300' },
  { id: 'kg', label: 'kg', color: 'bg-purple-500/25 text-purple-300' },
];

export default function UnitCancellationFlow() {
  return (
    <div className="unit-flow-shell">
      <h4>Dimensional cancellation in motion</h4>
      <p>Watch incompatible units survive while matching units cancel.</p>

      <div className="unit-flow-row">
        <span className="text-slate-400">Numerator</span>
        <div className="flex gap-2">
          {terms.map((t, i) => (
            <motion.div key={t.id} className={`unit-chip ${t.color}`} initial={{ y: -12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
              {t.label}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="unit-flow-row">
        <span className="text-slate-400">Denominator</span>
        <div className="flex gap-2 items-center">
          {['s', 'm'].map((label, i) => (
            <motion.div key={label} className="unit-chip bg-red-500/20 text-red-300" initial={{ x: -10, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.22 + i * 0.08 }}>
              {label}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div className="unit-result" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Resulting unit: <span className="text-purple-300 font-semibold">kg</span>
      </motion.div>
    </div>
  );
}
