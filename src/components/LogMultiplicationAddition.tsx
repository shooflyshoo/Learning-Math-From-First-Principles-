import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LogMultiplicationAddition() {
  const [a, setA] = useState(8);
  const [b, setB] = useState(4);
  const [base, setBase] = useState(2);

  const logA = Math.log(a) / Math.log(base);
  const logB = Math.log(b) / Math.log(base);
  const product = a * b;
  const logProduct = Math.log(product) / Math.log(base);

  const isLogAInt = Number.isInteger(logA) && logA >= 0;
  const isLogBInt = Number.isInteger(logB) && logB >= 0;
  const isLogProductInt = Number.isInteger(logProduct) && logProduct >= 0;

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Logarithms Turn Multiplication into Addition
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-center">
        <div className="text-2xl font-mono">
          <span className="text-slate-400">log(</span>
          <span className="text-blue-400">a</span>
          <span className="text-slate-400"> × </span>
          <span className="text-green-400">b</span>
          <span className="text-slate-400">) = log(</span>
          <span className="text-blue-400">a</span>
          <span className="text-slate-400">) + log(</span>
          <span className="text-green-400">b</span>
          <span className="text-slate-400">)</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Base: <span className="text-purple-400 font-mono">{base}</span>
          </label>
          <input
            type="range"
            min={2}
            max={10}
            value={base}
            onChange={(e) => setBase(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            a: <span className="text-blue-400 font-mono">{a}</span>
          </label>
          <input
            type="range"
            min={1}
            max={64}
            value={a}
            onChange={(e) => setA(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            b: <span className="text-green-400 font-mono">{b}</span>
          </label>
          <input
            type="range"
            min={1}
            max={64}
            value={b}
            onChange={(e) => setB(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Multiplication world */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h4 className="text-blue-400 font-semibold mb-4 text-center">Multiplication World</h4>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-mono text-blue-400">{a}</span>
              </div>
              <span className="text-2xl text-slate-400">×</span>
              <div className="w-20 h-20 bg-green-500/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-mono text-green-400">{b}</span>
              </div>
            </div>

            <div className="text-center text-slate-400">=</div>

            <div className="flex justify-center">
              <motion.div
                key={product}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-yellow-500/30 rounded-lg flex items-center justify-center"
              >
                <span className="text-3xl font-mono text-yellow-400">{product}</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Logarithm world */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
          <h4 className="text-purple-400 font-semibold mb-4 text-center">
            Logarithm World (base {base})
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-blue-500/30 rounded-lg flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400">log₂({a})</span>
                <span className="text-xl font-mono text-blue-400">
                  {isLogAInt ? logA : logA.toFixed(2)}
                </span>
              </div>
              <span className="text-2xl text-slate-400">+</span>
              <div className="w-20 h-20 bg-green-500/30 rounded-lg flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400">log₂({b})</span>
                <span className="text-xl font-mono text-green-400">
                  {isLogBInt ? logB : logB.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-center text-slate-400">=</div>

            <div className="flex justify-center">
              <motion.div
                key={logProduct}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-yellow-500/30 rounded-lg flex flex-col items-center justify-center"
              >
                <span className="text-xs text-slate-400">log₂({product})</span>
                <span className="text-2xl font-mono text-yellow-400">
                  {isLogProductInt ? logProduct : logProduct.toFixed(2)}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* The connection arrow */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-700/50 rounded-lg p-4 inline-flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm text-slate-400">Multiply</div>
            <div className="font-mono text-xl">
              <span className="text-blue-400">{a}</span>
              <span className="text-slate-400"> × </span>
              <span className="text-green-400">{b}</span>
              <span className="text-slate-400"> = </span>
              <span className="text-yellow-400">{product}</span>
            </div>
          </div>

          <div className="text-3xl text-purple-400">⟺</div>

          <div className="text-center">
            <div className="text-sm text-slate-400">Add the logs</div>
            <div className="font-mono text-xl">
              <span className="text-blue-400">{isLogAInt ? logA : logA.toFixed(2)}</span>
              <span className="text-slate-400"> + </span>
              <span className="text-green-400">{isLogBInt ? logB : logB.toFixed(2)}</span>
              <span className="text-slate-400"> = </span>
              <span className="text-yellow-400">{isLogProductInt ? logProduct : logProduct.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Number scales */}
      <div className="mb-6">
        <h4 className="text-sm text-slate-400 mb-2">Multiplicative Scale (exponential spacing)</h4>
        <div className="relative h-12 bg-slate-800/50 rounded-lg overflow-hidden">
          {[1, 2, 4, 8, 16, 32, 64].map((n) => {
            const pos = (n / 64) * 100;
            return (
              <div
                key={n}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${pos}%` }}
              >
                <div className="w-1 h-4 bg-blue-500 -ml-px" />
                <div className="text-xs text-slate-400 absolute -top-5 -translate-x-1/2">{n}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm text-slate-400 mb-2">Logarithmic Scale (linear spacing)</h4>
        <div className="relative h-12 bg-slate-800/50 rounded-lg overflow-hidden">
          {[0, 1, 2, 3, 4, 5, 6].map((n) => {
            const pos = (n / 6) * 100;
            const value = Math.pow(base, n);
            return (
              <div
                key={n}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${pos}%` }}
              >
                <div className="w-1 h-4 bg-purple-500 -ml-px" />
                <div className="text-xs text-purple-400 absolute -top-5 -translate-x-1/2">{n}</div>
                <div className="text-xs text-slate-500 absolute top-5 -translate-x-1/2">({value})</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Historical Revolution:</strong> Before calculators,
          multiplying large numbers was tedious. With log tables, people could: (1) look up log(a),
          (2) look up log(b), (3) add them, (4) look up what number has that log. Multiplication
          became addition! This is how slide rules worked.
        </p>
      </div>
    </div>
  );
}
