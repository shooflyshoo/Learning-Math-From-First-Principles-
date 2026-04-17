import { motion } from 'framer-motion';

const cases = [
  { expr: '1 / 0', valid: false, reason: 'division by zero' },
  { expr: 'sqrt(-1) in R', valid: false, reason: 'outside reals' },
  { expr: 'log(10)', valid: true, reason: 'positive input' },
  { expr: 'log(-3)', valid: false, reason: 'negative argument' },
  { expr: 'sqrt(9)', valid: true, reason: 'real root exists' },
  { expr: '7 / 3 in Q', valid: true, reason: 'rational result' },
];

export default function DomainHeatmap() {
  return (
    <div className="domain-heatmap-shell">
      <h4>Domain truth table</h4>
      <p>Green = valid move in current world. Red = boundary signal.</p>
      <div className="domain-grid">
        {cases.map((c, i) => (
          <motion.div
            key={c.expr}
            className={`domain-cell ${c.valid ? 'valid' : 'invalid'}`}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="font-mono text-sm">{c.expr}</div>
            <div className="text-xs text-slate-300 mt-1">{c.reason}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
