import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const operations = [
  { key: 'add', label: 'Add +3', fn: (x: number) => x + 3, formula: 'f(x)=x+3' },
  { key: 'mul', label: 'Scale ×2', fn: (x: number) => x * 2, formula: 'f(x)=2x' },
  { key: 'pow', label: 'Power x²', fn: (x: number) => x * x, formula: 'f(x)=x²' },
] as const;

export default function OperationMachine() {
  const [input, setInput] = useState(4);
  const [opKey, setOpKey] = useState<(typeof operations)[number]['key']>('add');

  const operation = useMemo(() => operations.find((o) => o.key === opKey) ?? operations[0], [opKey]);
  const output = operation.fn(input);

  return (
    <div className="op-machine-shell">
      <h4>Operation machine</h4>
      <p>Change input and machine type to feel how operation choice changes the world.</p>

      <div className="op-machine-controls">
        <label>
          Input: <span className="font-mono text-cyan-300">{input}</span>
          <input type="range" min={-5} max={8} value={input} onChange={(e) => setInput(parseInt(e.target.value, 10))} />
        </label>
        <div className="flex gap-2 flex-wrap">
          {operations.map((op) => (
            <button key={op.key} onClick={() => setOpKey(op.key)} className={`op-mode-btn ${opKey === op.key ? 'active' : ''}`}>
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div key={`${opKey}-${input}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="op-machine-lane">
        <span className="op-node">{input}</span>
        <span className="op-arrow">→</span>
        <span className="op-rule">{operation.formula}</span>
        <span className="op-arrow">→</span>
        <span className="op-node output">{output}</span>
      </motion.div>
    </div>
  );
}
