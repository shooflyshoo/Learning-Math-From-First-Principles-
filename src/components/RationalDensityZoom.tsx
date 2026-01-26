import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Famous convergents of √2 from continued fraction expansion
const SQRT2_APPROXIMATIONS = [
  { p: 1, q: 1 },
  { p: 3, q: 2 },
  { p: 7, q: 5 },
  { p: 17, q: 12 },
  { p: 41, q: 29 },
  { p: 99, q: 70 },
  { p: 239, q: 169 },
  { p: 577, q: 408 },
  { p: 1393, q: 985 },
  { p: 3363, q: 2378 },
];

export default function RationalDensityZoom() {
  const sqrt2 = Math.SQRT2;
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const currentApprox = SQRT2_APPROXIMATIONS[currentStep];
  const currentValue = currentApprox.p / currentApprox.q;
  const currentError = Math.abs(currentValue - sqrt2);

  const handleTapCloser = () => {
    if (!hasStarted) {
      setHasStarted(true);
    } else if (currentStep < SQRT2_APPROXIMATIONS.length - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setHasStarted(false);
  };

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Hunt for √2: Can Fractions Catch It?
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300 text-sm sm:text-base">
          Between any two fractions, there's always another fraction. Yet √2 ≈ 1.41421356...
          is <span className="text-red-400 font-semibold">not a fraction</span>. Tap to hunt for it!
        </p>
      </div>

      {/* Target display */}
      <div className="text-center mb-6">
        <div className="text-slate-400 text-sm mb-1">THE TARGET</div>
        <div className="text-5xl font-mono text-red-400 mb-1">√2</div>
        <div className="text-slate-500 font-mono text-lg">= 1.41421356237...</div>
      </div>

      {/* Current approximation card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-slate-800/50 rounded-xl p-6 mb-6"
        >
          {!hasStarted ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-slate-300 text-lg">Can any fraction equal √2?</p>
              <p className="text-slate-500 text-sm mt-2">Tap below to find out...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="text-slate-400 text-sm mb-1">ATTEMPT #{currentStep + 1}</div>
                <div className="text-5xl font-mono text-green-400 mb-2">
                  {currentApprox.p}/{currentApprox.q}
                </div>
                <div className="text-slate-400 font-mono text-lg">
                  = {currentValue.toFixed(10)}
                </div>
              </div>

              {/* Visual error bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>Distance from √2:</span>
                  <span className="text-red-400 font-mono">{currentError.toExponential(2)}</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{
                      width: `${Math.max(3, Math.min(95, 100 - (currentStep * 10)))}%`
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <div className="text-sm text-slate-500 mt-2 text-center">
                  {currentStep < 3 ? "Getting warmer..." :
                   currentStep < 6 ? "So close! But still not exact..." :
                   "Incredibly close—but STILL not √2!"}
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="text-green-400 font-mono text-xl">{currentValue.toFixed(8)}</div>
                  <div className="text-slate-500 text-xs mt-1">Your fraction</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="text-red-400 font-mono text-xl">{sqrt2.toFixed(8)}</div>
                  <div className="text-slate-500 text-xs mt-1">√2 (target)</div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleTapCloser}
          disabled={currentStep >= SQRT2_APPROXIMATIONS.length - 1 && hasStarted}
          className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all active:scale-[0.98] ${
            currentStep >= SQRT2_APPROXIMATIONS.length - 1 && hasStarted
              ? 'bg-red-900/50 text-red-300 border-2 border-red-500/50'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
          }`}
        >
          {!hasStarted
            ? '🎯 Start the Hunt!'
            : currentStep >= SQRT2_APPROXIMATIONS.length - 1
              ? '🚫 No exact match exists!'
              : '👆 Find Closer Fraction'}
        </button>
        {hasStarted && (
          <button
            onClick={handleReset}
            className="px-5 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors"
          >
            ↺
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {hasStarted && (
        <div className="flex justify-center items-center gap-2 mb-6">
          {SQRT2_APPROXIMATIONS.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < currentStep ? 'bg-green-500' :
                idx === currentStep ? 'bg-green-400 ring-2 ring-green-400/50' :
                'bg-slate-600'
              }`}
            />
          ))}
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse ml-1" title="√2 (unreachable)" />
          <span className="text-xs text-slate-500 ml-2">← √2</span>
        </div>
      )}

      {/* Famous approximations reference */}
      <div className="mb-6">
        <h4 className="text-sm text-slate-400 mb-3 text-center">Historical Approximations</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { p: 7, q: 5 },
            { p: 99, q: 70 },
            { p: 239, q: 169 },
            { p: 577, q: 408 },
          ].map(({ p, q }) => (
            <div key={`${p}/${q}`} className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="font-mono text-blue-400">{p}/{q}</div>
              <div className="text-xs text-slate-500">
                err: {Math.abs(p/q - sqrt2).toExponential(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The profound insight */}
      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Profound Truth:</strong> No matter how close you get,
          you'll <em>never</em> find a fraction equal to √2. The ancient Greeks proved this around 500 BCE,
          and it shattered their belief that "all is number." The rationals have infinitely many "holes"
          where irrational numbers live—this is why we need the real numbers ℝ.
        </p>
      </div>
    </div>
  );
}
