import { motion } from 'framer-motion';

const rows = [
  { n: 0, power: 1 },
  { n: 1, power: 2 },
  { n: 2, power: 4 },
  { n: 3, power: 8 },
  { n: 4, power: 16 },
  { n: 5, power: 32 },
];

export default function LogScaleBridge() {
  return (
    <div className="log-bridge-shell">
      <h4>Exponential table ↔ Log interpretation</h4>
      <p>Each row says: “how many multiplies by 2 to reach this value?”</p>
      <div className="log-bridge-grid">
        {rows.map((r, i) => (
          <motion.div key={r.n} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="log-row">
            <span className="font-mono text-cyan-300">2^{r.n}</span>
            <span className="text-slate-400">=</span>
            <span className="font-mono text-slate-200">{r.power}</span>
            <span className="text-slate-500">→ log₂({r.power}) = {r.n}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
