import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExponentsAsSteps() {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState<'forward' | 'laws'>('forward');
  const intervalRef = useRef<number | null>(null);

  const values = [1]; // Start at 1
  for (let i = 0; i < Math.abs(exponent); i++) {
    if (exponent >= 0) {
      values.push(values[values.length - 1] * base);
    } else {
      values.push(values[values.length - 1] / base);
    }
  }

  const displayedValues = values.slice(0, currentStep + 1);

  const runAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isAnimating && currentStep < Math.abs(exponent)) {
      intervalRef.current = window.setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 600);
    } else if (currentStep >= Math.abs(exponent)) {
      setIsAnimating(false);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isAnimating, currentStep, exponent]);

  const reset = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  useEffect(() => {
    reset();
  }, [base, exponent]);

  const maxBarHeight = 200;
  const maxValue = Math.max(...values);
  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return (Math.abs(value) / maxValue) * maxBarHeight;
  };

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Exponents as Repeated Scaling
      </h3>

      <div className="flex gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => setMode('forward')}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm min-h-[44px] ${
            mode === 'forward' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Step by Step
        </button>
        <button
          onClick={() => setMode('laws')}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm min-h-[44px] ${
            mode === 'laws' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Exponent Laws
        </button>
      </div>

      {mode === 'forward' && (
        <>
          {/* Controls */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <label className="block text-xs sm:text-sm text-slate-400 mb-2">
                Base: <span className="text-blue-400 font-mono">{base}</span>
              </label>
              <input
                type="range"
                min={2}
                max={5}
                value={base}
                onChange={(e) => setBase(parseInt(e.target.value))}
                className="w-full h-8"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-slate-400 mb-2">
                Exponent: <span className="text-purple-400 font-mono">{exponent}</span>
              </label>
              <input
                type="range"
                min={-3}
                max={6}
                value={exponent}
                onChange={(e) => setExponent(parseInt(e.target.value))}
                className="w-full h-8"
              />
            </div>
          </div>

          {/* Expression */}
          <div className="text-center mb-6">
            <div className="text-2xl sm:text-4xl font-mono">
              <span className="text-blue-400">{base}</span>
              <sup className="text-purple-400">{exponent}</sup>
              <span className="text-slate-400"> = </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayedValues[displayedValues.length - 1]}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400"
                >
                  {exponent >= 0
                    ? displayedValues[displayedValues.length - 1]
                    : displayedValues[displayedValues.length - 1].toFixed(3)
                  }
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-slate-400 mt-2 text-sm sm:text-base">
              {exponent >= 0
                ? `Start at 1, multiply by ${base}, ${Math.abs(exponent)} time${Math.abs(exponent) !== 1 ? 's' : ''}`
                : `Start at 1, divide by ${base}, ${Math.abs(exponent)} time${Math.abs(exponent) !== 1 ? 's' : ''}`
              }
            </div>
          </div>

          {/* Visual bars - scrollable on mobile */}
          <div className="relative h-64 mb-6 bg-slate-800/30 rounded-lg p-4 overflow-x-auto">
            <div className="flex items-end justify-center gap-2 sm:gap-4 h-full min-w-fit">
              {displayedValues.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: getBarHeight(value) }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="w-8 sm:w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg relative flex-shrink-0"
                  style={{ minHeight: 20 }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-mono text-slate-200 whitespace-nowrap">
                    {value >= 1 ? value : value.toFixed(3)}
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">
                    {idx}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Step indicator */}
            <div className="absolute top-2 right-2 text-xs sm:text-sm text-slate-400 bg-slate-900/70 px-2 py-1 rounded">
              <span className="text-purple-400 font-mono">{currentStep}</span>/{Math.abs(exponent)}
            </div>
          </div>

          {/* Controls - wrap on mobile */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={runAnimation}
              disabled={isAnimating}
              className={`px-4 sm:px-6 py-3 rounded-lg font-semibold text-sm min-h-[44px] ${
                isAnimating
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isAnimating ? 'Running...' : 'Play'}
            </button>
            <button
              onClick={() => setCurrentStep(Math.abs(exponent))}
              className="px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm min-h-[44px]"
            >
              Show All
            </button>
            <button onClick={reset} className="px-4 sm:px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm min-h-[44px]">
              Reset
            </button>
          </div>

          {/* Special cases */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className={`p-4 rounded-lg ${exponent === 0 ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-slate-700/30'}`}>
              <h4 className="text-yellow-400 font-semibold mb-2">Why a⁰ = 1</h4>
              <p className="text-sm text-slate-300">
                Zero scalings means you stay at your starting point: 1.
                Also: a^n ÷ a^n = a^(n-n) = a⁰ = 1
              </p>
            </div>
            <div className={`p-4 rounded-lg ${exponent < 0 ? 'bg-red-500/20 border border-red-500/50' : 'bg-slate-700/30'}`}>
              <h4 className="text-red-400 font-semibold mb-2">Why a⁻ⁿ = 1/aⁿ</h4>
              <p className="text-sm text-slate-300">
                Negative exponents = undo scalings = divide instead of multiply.
                Each step divides by the base.
              </p>
            </div>
          </div>
        </>
      )}

      {mode === 'laws' && (
        <div className="space-y-6">
          {/* Law 1 */}
          <div className="bg-slate-700/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">Law 1: aᵐ × aⁿ = aᵐ⁺ⁿ</h4>
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <div className="font-mono text-xl">
                <span className="text-blue-400">2</span><sup className="text-purple-400">3</sup>
                <span className="text-slate-400"> × </span>
                <span className="text-blue-400">2</span><sup className="text-purple-400">2</sup>
                <span className="text-slate-400"> = </span>
                <span className="text-blue-400">2</span><sup className="text-green-400">5</sup>
                <span className="text-slate-400"> = </span>
                <span className="text-green-400">32</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              3 scalings followed by 2 more scalings = 5 total scalings.
              <span className="text-green-400 ml-2">It's just counting!</span>
            </p>
          </div>

          {/* Law 2 */}
          <div className="bg-slate-700/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">Law 2: (aᵐ)ⁿ = aᵐⁿ</h4>
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <div className="font-mono text-xl">
                <span className="text-slate-400">(</span>
                <span className="text-blue-400">2</span><sup className="text-purple-400">3</sup>
                <span className="text-slate-400">)</span><sup className="text-purple-400">2</sup>
                <span className="text-slate-400"> = </span>
                <span className="text-blue-400">2</span><sup className="text-green-400">6</sup>
                <span className="text-slate-400"> = </span>
                <span className="text-green-400">64</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              "3 scalings" repeated 2 times = 6 scalings total.
              <span className="text-green-400 ml-2">Multiply the counts!</span>
            </p>
          </div>

          {/* Law 3 */}
          <div className="bg-slate-700/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">Law 3: aᵐ ÷ aⁿ = aᵐ⁻ⁿ</h4>
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <div className="font-mono text-xl">
                <span className="text-blue-400">2</span><sup className="text-purple-400">5</sup>
                <span className="text-slate-400"> ÷ </span>
                <span className="text-blue-400">2</span><sup className="text-purple-400">2</sup>
                <span className="text-slate-400"> = </span>
                <span className="text-blue-400">2</span><sup className="text-green-400">3</sup>
                <span className="text-slate-400"> = </span>
                <span className="text-green-400">8</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              5 scalings, undo 2 of them = 3 remain.
              <span className="text-green-400 ml-2">Subtract to undo!</span>
            </p>
          </div>

          <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
            <p className="text-slate-300">
              <strong className="text-purple-400">The Pattern:</strong> These aren't arbitrary rules—they're
              inevitable consequences of exponents counting scalings. Adding counts, multiplying counts,
              subtracting counts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
