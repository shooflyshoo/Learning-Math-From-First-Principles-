import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FractionalExponents() {
  const [target, setTarget] = useState(4);
  const [guess, setGuess] = useState('');
  const [guessResult, setGuessResult] = useState<{ value: number; product: number } | null>(null);
  const [showAutoSolve, setShowAutoSolve] = useState(false);
  const [autoSteps, setAutoSteps] = useState<Array<{ guess: number; product: number; comparison: string }>>([]);

  const actualRoot = Math.sqrt(target);

  const checkGuess = () => {
    const g = parseFloat(guess);
    if (isNaN(g) || g <= 0) return;

    const product = g * g;
    setGuessResult({ value: g, product });
  };

  const runBinarySearch = () => {
    setShowAutoSolve(true);
    setAutoSteps([]);

    let low = 0;
    let high = target > 1 ? target : 1;
    const steps: Array<{ guess: number; product: number; comparison: string }> = [];

    for (let i = 0; i < 10; i++) {
      const mid = (low + high) / 2;
      const product = mid * mid;
      let comparison: string;

      if (product < target) {
        comparison = 'too low';
        low = mid;
      } else if (product > target) {
        comparison = 'too high';
        high = mid;
      } else {
        comparison = 'exact!';
      }

      steps.push({ guess: mid, product, comparison });
    }

    // Animate the steps
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        setAutoSteps((prev) => [...prev, steps[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  };

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Fractional Exponents as Roots (The Reverse Search)
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-center">
        <div className="text-xl mb-2">
          <span className="text-blue-400 font-mono">{target}</span>
          <sup className="text-purple-400">1/2</sup>
          <span className="text-slate-400"> asks: </span>
          <span className="text-green-400">"What number, when multiplied by itself, gives {target}?"</span>
        </div>
        <p className="text-slate-400 text-sm">
          That's the same as asking: what is √{target}?
        </p>
      </div>

      {/* Target selector */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">
          Target value: <span className="text-blue-400 font-mono">{target}</span>
        </label>
        <input
          type="range"
          min={1}
          max={25}
          value={target}
          onChange={(e) => {
            setTarget(parseInt(e.target.value));
            setGuessResult(null);
            setShowAutoSolve(false);
            setAutoSteps([]);
          }}
          className="w-full"
        />
      </div>

      {/* Manual guess section */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-slate-200 mb-4">Try to Find √{target}</h4>

        <div className="flex gap-4 mb-4">
          <input
            type="number"
            step="0.01"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 font-mono"
          />
          <button
            onClick={checkGuess}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Check
          </button>
        </div>

        <AnimatePresence>
          {guessResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-lg bg-slate-700/50"
            >
              <div className="text-xl font-mono text-center mb-2">
                <span className="text-blue-400">{guessResult.value}</span>
                <span className="text-slate-400"> × </span>
                <span className="text-blue-400">{guessResult.value}</span>
                <span className="text-slate-400"> = </span>
                <span className={
                  Math.abs(guessResult.product - target) < 0.001
                    ? 'text-green-400'
                    : guessResult.product < target
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }>
                  {guessResult.product.toFixed(4)}
                </span>
              </div>
              <div className="text-center text-sm">
                {Math.abs(guessResult.product - target) < 0.001 ? (
                  <span className="text-green-400">Perfect! √{target} ≈ {guessResult.value}</span>
                ) : guessResult.product < target ? (
                  <span className="text-yellow-400">Too low! Need a bigger number.</span>
                ) : (
                  <span className="text-red-400">Too high! Need a smaller number.</span>
                )}
              </div>

              {/* Visual bar comparison */}
              <div className="mt-4 flex items-end gap-4 justify-center h-24">
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 bg-blue-500 rounded-t"
                    style={{ height: `${Math.min(guessResult.product / target * 80, 80)}px` }}
                  />
                  <span className="text-xs text-slate-400 mt-1">Your: {guessResult.product.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 bg-green-500 rounded-t" style={{ height: '80px' }} />
                  <span className="text-xs text-slate-400 mt-1">Target: {target}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auto-solve with binary search */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-slate-200">Binary Search (Computer Method)</h4>
          <button
            onClick={runBinarySearch}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
          >
            Run Auto-Solve
          </button>
        </div>

        <AnimatePresence>
          {showAutoSolve && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {autoSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-2 bg-slate-700/50 rounded text-sm"
                >
                  <span className="text-slate-500 w-8">#{idx + 1}</span>
                  <span className="font-mono text-blue-400 w-24">{step.guess.toFixed(6)}</span>
                  <span className="text-slate-400">× itself =</span>
                  <span className="font-mono text-yellow-400 w-24">{step.product.toFixed(6)}</span>
                  <span className={
                    step.comparison === 'exact!'
                      ? 'text-green-400'
                      : step.comparison === 'too low'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }>
                    {step.comparison}
                  </span>
                </motion.div>
              ))}

              {autoSteps.length === 10 && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg mt-4">
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">Converged to √{target} ≈ {actualRoot.toFixed(8)}</div>
                    {!Number.isInteger(actualRoot) && (
                      <div className="text-sm text-slate-400 mt-2">
                        This is an irrational number—the decimals never repeat!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The connection to fractional exponents */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-slate-200 mb-3">Why a^(1/2) = √a</h4>
        <div className="font-mono text-lg text-center mb-3">
          a<sup>1/2</sup> × a<sup>1/2</sup> = a<sup>(1/2 + 1/2)</sup> = a<sup>1</sup> = a
        </div>
        <p className="text-slate-400 text-sm text-center">
          If multiplying the number by itself gives a, that number is the square root of a!
        </p>
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Pattern:</strong> Fractional exponents are roots.
          a^(1/n) is the nth root of a—the number that, when raised to the nth power, gives a.
          a^(m/n) = (ⁿ√a)^m or equivalently ⁿ√(a^m).
        </p>
      </div>
    </div>
  );
}
