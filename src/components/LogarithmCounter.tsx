import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogarithmCounter() {
  const [base, setBase] = useState(2);
  const [targetValue, setTargetValue] = useState(8);
  const [currentValue, setCurrentValue] = useState(8);
  const [steps, setSteps] = useState<number[]>([8]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const logResult = Math.log(targetValue) / Math.log(base);
  const isExact = Number.isInteger(logResult) && logResult >= 0;

  const startDivision = () => {
    setIsAnimating(true);
    setCurrentValue(targetValue);
    setSteps([targetValue]);
    setShowResult(false);
  };

  useEffect(() => {
    if (isAnimating && currentValue > 1) {
      intervalRef.current = window.setTimeout(() => {
        const newValue = currentValue / base;
        setCurrentValue(newValue);
        setSteps((s) => [...s, newValue]);
      }, 700);
    } else if (isAnimating && currentValue <= 1) {
      setIsAnimating(false);
      setShowResult(true);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isAnimating, currentValue, base]);

  const reset = () => {
    setIsAnimating(false);
    setCurrentValue(targetValue);
    setSteps([targetValue]);
    setShowResult(false);
  };

  useEffect(() => {
    reset();
  }, [base, targetValue]);

  const divisions = steps.length - 1;

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Logarithms: Counting How Many Scalings Happened
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300">
          If exponents ask "apply this scaling N times", logarithms ask:
          <span className="text-purple-400 font-semibold"> "How many times was the scaling applied?"</span>
        </p>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Base: <span className="text-blue-400 font-mono">{base}</span>
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
            Target Value: <span className="text-green-400 font-mono">{targetValue}</span>
          </label>
          <input
            type="range"
            min={2}
            max={256}
            value={targetValue}
            onChange={(e) => setTargetValue(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Expression */}
      <div className="text-center mb-8">
        <div className="text-3xl font-mono mb-2">
          <span className="text-slate-400">log</span>
          <sub className="text-blue-400">{base}</sub>
          <span className="text-slate-400">(</span>
          <span className="text-green-400">{targetValue}</span>
          <span className="text-slate-400">) = </span>
          {showResult ? (
            <motion.span
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-purple-400"
            >
              {isExact ? logResult : logResult.toFixed(3)}
            </motion.span>
          ) : (
            <span className="text-slate-500">?</span>
          )}
        </div>
        <div className="text-slate-400">
          "How many times do I {isAnimating ? 'divide' : 'multiply'} by {base} to {isAnimating ? 'reach 1 from' : 'reach'} {targetValue}?"
        </div>
      </div>

      {/* Division steps visualization */}
      <div className="bg-slate-800/30 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">Divisions applied: <span className="text-purple-400 font-mono">{divisions}</span></span>
          <span className="text-sm text-slate-400">Current value: <span className="text-green-400 font-mono">{currentValue.toFixed(3)}</span></span>
        </div>

        {/* Steps display */}
        <div className="flex flex-wrap items-center gap-2 justify-center">
          {steps.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center"
            >
              <div className={`px-4 py-2 rounded-lg font-mono ${
                idx === steps.length - 1 && val <= 1
                  ? 'bg-green-500/20 text-green-400 border border-green-500'
                  : 'bg-slate-700 text-slate-200'
              }`}>
                {val >= 1 ? val : val.toFixed(3)}
              </div>
              {idx < steps.length - 1 && (
                <div className="mx-2 flex flex-col items-center">
                  <span className="text-slate-500">÷{base}</span>
                  <span className="text-slate-600">→</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={startDivision}
          disabled={isAnimating}
          className={`px-6 py-2 rounded-lg font-semibold ${
            isAnimating
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isAnimating ? 'Dividing...' : 'Count Backwards'}
        </button>
        <button onClick={reset} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg">
          Reset
        </button>
      </div>

      {/* Result explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg mb-6 ${
              isExact
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-yellow-500/20 border border-yellow-500/50'
            }`}
          >
            {isExact ? (
              <div className="text-center">
                <div className="text-green-400 font-semibold mb-2">
                  It took {logResult} division{logResult !== 1 ? 's' : ''} to reach 1!
                </div>
                <div className="text-slate-300">
                  This confirms: <span className="font-mono">{base}<sup>{logResult}</sup> = {targetValue}</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-yellow-400 font-semibold mb-2">
                  Approximately {logResult.toFixed(3)} scalings
                </div>
                <div className="text-slate-300 text-sm">
                  {targetValue} isn't a perfect power of {base}, so the answer isn't a whole number.
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick examples */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { base: 2, target: 8, result: 3 },
          { base: 10, target: 100, result: 2 },
          { base: 2, target: 16, result: 4 },
        ].map(({ base: b, target, result }) => (
          <button
            key={`${b}-${target}`}
            onClick={() => {
              setBase(b);
              setTargetValue(target);
            }}
            className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left transition-all"
          >
            <div className="font-mono text-sm">
              log<sub className="text-blue-400">{b}</sub>({target}) = {result}
            </div>
            <div className="text-xs text-slate-500">
              {b}^{result} = {target}
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Magic Property:</strong> log(a × b) = log(a) + log(b).
          Multiplying numbers = adding their logs. This turned multiplication into addition before
          calculators existed—people used log tables and slide rules!
        </p>
      </div>
    </div>
  );
}
