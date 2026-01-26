import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DivisionByZero() {
  const [target, setTarget] = useState(12);
  const [searchResults, setSearchResults] = useState<Array<{ x: number; result: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const runSearch = () => {
    setIsSearching(true);
    setSearchResults([]);

    const values = [1, 10, 100, 1000, 10000, 100000, 1000000];
    let index = 0;

    const interval = setInterval(() => {
      if (index < values.length) {
        const x = values[index];
        setSearchResults((prev) => [...prev, { x, result: 0 * x }]);
        index++;
      } else {
        clearInterval(interval);
        setIsSearching(false);
      }
    }, 500);
  };

  // For the graph visualization
  const graphPoints = [];
  for (let d = 0.01; d <= 2; d += 0.02) {
    graphPoints.push({ d, result: 1 / d });
  }

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Why Division by Zero is Undefined (The Impossible Search)
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300 text-center">
          Asking <span className="font-mono text-blue-400">{target} ÷ 0</span> is asking:{' '}
          <span className="text-purple-400">"Find x so that 0 × x = {target}"</span>
        </p>
      </div>

      {/* Target selector */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">
          Target value (a): <span className="text-blue-400 font-mono">{target}</span>
        </label>
        <div className="flex gap-2">
          {[0, 1, 5, 12, 100].map((t) => (
            <button
              key={t}
              onClick={() => { setTarget(t); setSearchResults([]); }}
              className={`px-4 py-2 rounded-lg font-mono ${
                target === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* The search visualization */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4">
          🤖 Robot searches for x where 0 × x = {target}
        </h4>

        <div className="flex justify-center mb-4">
          <button
            onClick={runSearch}
            disabled={isSearching}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isSearching
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isSearching ? 'Searching...' : 'Start Search'}
          </button>
        </div>

        {/* Search results */}
        <div className="space-y-2">
          <AnimatePresence>
            {searchResults.map(({ x, result }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg"
              >
                <span className="text-slate-400">Try x = </span>
                <span className="text-blue-400 font-mono w-24">{x.toLocaleString()}</span>
                <span className="text-slate-400">→ 0 × {x.toLocaleString()} = </span>
                <span className="text-yellow-400 font-mono">{result}</span>
                <span className="text-red-400 ml-auto">
                  {target !== 0 ? `≠ ${target}` : '= 0 ✓'}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isSearching && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg ${
              target === 0
                ? 'bg-yellow-500/20 border border-yellow-500/50'
                : 'bg-red-500/20 border border-red-500/50'
            }`}
          >
            {target === 0 ? (
              <div className="text-center">
                <div className="text-yellow-400 font-semibold text-lg mb-2">
                  Infinite Solutions!
                </div>
                <p className="text-slate-300">
                  Every x works! 0 × 1 = 0, 0 × 100 = 0, 0 × anything = 0.
                  When there are infinitely many answers, the operation is undefined.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-red-400 font-semibold text-lg mb-2">
                  No Solution Exists!
                </div>
                <p className="text-slate-300">
                  No matter what x we try, 0 × x is always 0, never {target}.
                  The search is hopeless.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Visual: approaching zero */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4">What happens as the divisor approaches 0?</h4>

        <div className="relative h-48">
          <svg viewBox="0 0 400 180" className="w-full h-full">
            {/* Axes */}
            <line x1="50" y1="150" x2="380" y2="150" stroke="#64748b" strokeWidth="2" />
            <line x1="50" y1="10" x2="50" y2="150" stroke="#64748b" strokeWidth="2" />

            {/* Labels */}
            <text x="380" y="170" fill="#64748b" fontSize="12">divisor</text>
            <text x="10" y="15" fill="#64748b" fontSize="12">result</text>
            <text x="55" y="165" fill="#64748b" fontSize="10">0</text>

            {/* The curve 1/x */}
            <path
              d={graphPoints.map((p, i) => {
                const x = 50 + p.d * 160;
                const y = 150 - Math.min(p.result * 10, 140);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />

            {/* Arrow pointing up at 0 */}
            <line x1="50" y1="140" x2="50" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
            <polygon points="50,10 45,25 55,25" fill="#ef4444" />
            <text x="60" y="30" fill="#ef4444" fontSize="12">→ ∞</text>
          </svg>
        </div>

        <div className="text-center text-slate-400 text-sm mt-4">
          As the divisor gets smaller, the result gets larger... approaching infinity.
          But infinity isn't a number you can reach!
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <h4 className="text-red-400 font-semibold mb-2">If a ≠ 0</h4>
          <p className="text-sm text-slate-300">
            <span className="font-mono">a ÷ 0</span> has <strong>no solution</strong>.
            There's no x where 0 × x = a (a nonzero number).
          </p>
        </div>
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <h4 className="text-yellow-400 font-semibold mb-2">If a = 0</h4>
          <p className="text-sm text-slate-300">
            <span className="font-mono">0 ÷ 0</span> has <strong>infinitely many solutions</strong>.
            Every x satisfies 0 × x = 0.
          </p>
        </div>
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Key Insight:</strong> Division by zero isn't
          "forbidden"—it's <em>undefined</em>. The question simply doesn't have a unique answer,
          and math requires operations to give exactly one result. It's not a rule; it's a
          logical necessity.
        </p>
      </div>
    </div>
  );
}
