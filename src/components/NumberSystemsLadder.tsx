import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';

type NumberSystem = 'N' | 'Z' | 'Q' | 'R' | 'C';

interface SystemInfo {
  symbol: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  examples: string[];
}

const systems: Record<NumberSystem, SystemInfo> = {
  N: {
    symbol: 'ℕ',
    name: 'Natural Numbers',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500',
    description: 'Counting numbers: 0, 1, 2, 3, ...',
    examples: ['0', '1', '42', '1000'],
  },
  Z: {
    symbol: 'ℤ',
    name: 'Integers',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
    description: 'Naturals + negatives: ..., -2, -1, 0, 1, 2, ...',
    examples: ['-5', '-1', '0', '7'],
  },
  Q: {
    symbol: 'ℚ',
    name: 'Rationals',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500',
    description: 'Fractions: p/q where q ≠ 0',
    examples: ['1/2', '-3/4', '0.75', '7'],
  },
  R: {
    symbol: 'ℝ',
    name: 'Real Numbers',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500',
    description: 'All points on the number line',
    examples: ['√2', 'π', 'e', '-1.414...'],
  },
  C: {
    symbol: 'ℂ',
    name: 'Complex Numbers',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
    description: 'a + bi where i² = -1',
    examples: ['2+3i', 'i', '-1', '√(-4)=2i'],
  },
};

const systemOrder: NumberSystem[] = ['N', 'Z', 'Q', 'R', 'C'];

interface TestResult {
  works: boolean;
  result?: string;
  error?: string;
}

function evaluateInSystem(expr: string, system: NumberSystem): TestResult {
  const trimmed = expr.trim().toLowerCase();

  // Simple pattern matching for common expressions
  const subtractionMatch = trimmed.match(/^(-?\d+)\s*-\s*(\d+)$/);
  if (subtractionMatch) {
    const a = parseInt(subtractionMatch[1]);
    const b = parseInt(subtractionMatch[2]);
    const result = a - b;

    if (system === 'N' && result < 0) {
      return { works: false, error: 'Negative results not in ℕ' };
    }
    return { works: true, result: result.toString() };
  }

  const divisionMatch = trimmed.match(/^(-?\d+)\s*[÷\/]\s*(\d+)$/);
  if (divisionMatch) {
    const a = parseInt(divisionMatch[1]);
    const b = parseInt(divisionMatch[2]);

    if (b === 0) {
      return { works: false, error: 'Division by zero undefined' };
    }

    const result = a / b;

    if (system === 'N' && (result < 0 || !Number.isInteger(result))) {
      return { works: false, error: 'Result not a natural number' };
    }
    if (system === 'Z' && !Number.isInteger(result)) {
      return { works: false, error: 'Result not an integer' };
    }
    return { works: true, result: Number.isInteger(result) ? result.toString() : `${a}/${b}` };
  }

  const sqrtMatch = trimmed.match(/^√\(?(-?\d+)\)?$|^sqrt\(?(-?\d+)\)?$/);
  if (sqrtMatch) {
    const n = parseInt(sqrtMatch[1] || sqrtMatch[2]);

    if (n < 0) {
      if (system === 'C') {
        const absRoot = Math.sqrt(Math.abs(n));
        return {
          works: true,
          result: Number.isInteger(absRoot) ? `${absRoot}i` : `√${Math.abs(n)}·i`
        };
      }
      return { works: false, error: 'No real square root of negative' };
    }

    const root = Math.sqrt(n);
    if (system === 'N' && !Number.isInteger(root)) {
      return { works: false, error: 'Result not a natural number' };
    }
    if (system === 'Z' && !Number.isInteger(root)) {
      return { works: false, error: 'Result not an integer' };
    }
    if (system === 'Q' && !Number.isInteger(root) && ![1, 4, 9, 16, 25].includes(n)) {
      return { works: false, error: 'Result is irrational' };
    }

    return { works: true, result: Number.isInteger(root) ? root.toString() : `√${n}` };
  }

  return { works: true, result: expr };
}

export default function NumberSystemsLadder() {
  const [currentSystem, setCurrentSystem] = useState<NumberSystem>('N');
  const [expression, setExpression] = useState('3 - 5');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [shakingLevel, setShakingLevel] = useState<NumberSystem | null>(null);
  const { showToast } = useToast();
  const towerRef = useRef<HTMLDivElement>(null);

  const currentIndex = systemOrder.indexOf(currentSystem);

  // Handle clicking on a locked level
  const handleLockedClick = (sys: NumberSystem) => {
    setShakingLevel(sys);
    setTimeout(() => setShakingLevel(null), 500);

    const info = systems[sys];
    showToast(`${info.symbol} ${info.name} is locked!`, {
      type: 'warning',
      icon: '🔒',
    });
  };

  const handleTest = () => {
    const result = evaluateInSystem(expression, currentSystem);
    setTestResult(result);
    setShowUpgrade(!result.works && currentIndex < systemOrder.length - 1);
  };

  const handleUpgrade = () => {
    if (currentIndex < systemOrder.length - 1) {
      const nextSystem = systemOrder[currentIndex + 1];
      const nextInfo = systems[nextSystem];
      setCurrentSystem(nextSystem);
      setTestResult(evaluateInSystem(expression, nextSystem));
      setShowUpgrade(false);

      // Show toast and scroll to reveal the unlocked level
      showToast(`${nextInfo.symbol} ${nextInfo.name} unlocked!`, {
        type: 'success',
        icon: '🔓',
        action: {
          label: 'View',
          onClick: () => {
            towerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }
  };

  const handleReset = () => {
    setCurrentSystem('N');
    setTestResult(null);
    setShowUpgrade(false);
  };

  const presetExpressions = [
    { expr: '3 - 5', desc: 'Hits wall at ℕ' },
    { expr: '7 / 3', desc: 'Hits wall at ℤ' },
    { expr: '√2', desc: 'Hits wall at ℚ' },
    { expr: '√(-1)', desc: 'Hits wall at ℝ' },
  ];

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        The Number Systems Ladder (Video Game World Unlocks)
      </h3>

      {/* The Tower */}
      <div ref={towerRef} className="flex flex-col-reverse gap-2 mb-8">
        {systemOrder.map((sys, index) => {
          const info = systems[sys];
          const isUnlocked = index <= currentIndex;
          const isCurrent = sys === currentSystem;

          return (
            <motion.div
              key={sys}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isUnlocked
                  ? `${info.bgColor} ${info.borderColor} ${isCurrent ? 'ring-2 ring-white/20' : ''}`
                  : 'bg-slate-800/50 border-slate-700 opacity-50 hover:opacity-60'
              }`}
              onClick={() => isUnlocked ? setCurrentSystem(sys) : handleLockedClick(sys)}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              animate={
                shakingLevel === sys
                  ? { x: [0, -8, 8, -8, 8, -4, 4, 0], scale: 1 }
                  : isCurrent
                    ? { scale: 1.02, x: 0 }
                    : { scale: 1, x: 0 }
              }
              transition={shakingLevel === sys ? { duration: 0.4 } : { type: 'spring' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-serif ${isUnlocked ? info.color : 'text-slate-600'}`}>
                    {info.symbol}
                  </span>
                  <div>
                    <div className={`font-semibold ${isUnlocked ? info.color : 'text-slate-600'}`}>
                      {info.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {info.description}
                    </div>
                  </div>
                </div>
                {!isUnlocked && (
                  <motion.div
                    className="text-2xl"
                    animate={shakingLevel === sys ? { rotate: [0, -15, 15, -15, 15, 0] } : { rotate: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    🔒
                  </motion.div>
                )}
                {isCurrent && (
                  <div className="text-xl">📍</div>
                )}
              </div>

              {isUnlocked && isCurrent && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {info.examples.map((ex) => (
                    <span
                      key={ex}
                      className="text-xs px-2 py-1 bg-slate-900/50 rounded text-slate-300 font-mono"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Expression Tester */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
        <div className="text-sm text-slate-400 mb-3">Test an expression in current world:</div>

        {/* Mobile-friendly stacked layout */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={expression}
            onChange={(e) => {
              setExpression(e.target.value);
              setTestResult(null);
              setShowUpgrade(false);
            }}
            placeholder="e.g., 3 - 5, 7/3, √2, √(-1)"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 font-mono"
          />
          <div className="flex gap-2">
            <button
              onClick={handleTest}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
            >
              Test in {systems[currentSystem].symbol}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {presetExpressions.map(({ expr, desc }) => (
            <button
              key={expr}
              onClick={() => {
                setExpression(expr);
                setTestResult(null);
                setShowUpgrade(false);
              }}
              className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
            >
              {expr} <span className="text-slate-500">({desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      <AnimatePresence mode="wait">
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg mb-6 ${
              testResult.works
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-red-500/20 border border-red-500/50'
            }`}
          >
            {testResult.works ? (
              <div className="text-center">
                <div className="text-green-400 font-semibold mb-2">✓ Works in {systems[currentSystem].symbol}!</div>
                <div className="text-2xl font-mono">
                  {expression} = <span className="text-green-400">{testResult.result}</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-red-400 font-semibold mb-2">✗ WALL HIT!</div>
                <div className="text-slate-300 mb-2">{testResult.error}</div>
                <div className="text-sm text-slate-400">
                  This expression has no valid result in {systems[currentSystem].name}.
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Prompt */}
      <AnimatePresence>
        {showUpgrade && currentIndex < systemOrder.length - 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              🔓 Unlock {systems[systemOrder[currentIndex + 1]].name}?
            </button>
            <p className="text-sm text-slate-400 mt-2">
              Extending to {systems[systemOrder[currentIndex + 1]].symbol} will make this solvable!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Pattern:</strong> Each level exists because someone hit
          a wall and decided to extend the system. The contracts stay consistent; the world grows.
        </p>
      </div>
    </div>
  );
}
