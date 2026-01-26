import { useState, useMemo } from 'react';
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

  // Mobile: step-through approximations
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Desktop: zoom-based exploration
  const [zoomLevel, setZoomLevel] = useState(1);

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

  // Desktop: generate fractions for zoom visualization
  const generateFractions = (center: number, zoom: number) => {
    const range = 1 / zoom;
    const fractions: { value: number; p: number; q: number }[] = [];
    const maxDenom = Math.min(100, Math.floor(zoom * 10));

    for (let q = 1; q <= maxDenom; q++) {
      for (let p = 1; p <= q * 2; p++) {
        const value = p / q;
        if (Math.abs(value - center) < range) {
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          if (gcd(p, q) === 1) {
            fractions.push({ value, p, q });
          }
        }
      }
    }
    return fractions.sort((a, b) => a.value - b.value);
  };

  const fractions = useMemo(() => generateFractions(sqrt2, zoomLevel), [zoomLevel]);

  const range = 1 / zoomLevel;
  const minValue = sqrt2 - range;
  const maxValue = sqrt2 + range;

  const getPosition = (value: number) => ((value - minValue) / (maxValue - minValue)) * 100;

  const closestFraction = fractions.reduce(
    (closest, f) => {
      const currentDiff = Math.abs(f.value - sqrt2);
      const closestDiff = Math.abs(closest.value - sqrt2);
      return currentDiff < closestDiff ? f : closest;
    },
    { value: 0, p: 0, q: 1 }
  );

  const desktopError = Math.abs(closestFraction.value - sqrt2);

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Rationals Are Dense But Have Holes
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300 text-sm sm:text-base">
          Between any two fractions, there's always another fraction. Yet √2 ≈ 1.41421356...
          is <span className="text-red-400 font-semibold">not a fraction</span>. Can you catch it?
        </p>
      </div>

      {/* ==================== MOBILE: Fraction Hunter ==================== */}
      <div className="md:hidden">
        <div className="text-center mb-6">
          <div className="text-slate-400 text-sm mb-1">THE TARGET</div>
          <div className="text-5xl font-mono text-red-400 mb-1">√2</div>
          <div className="text-slate-500 font-mono">= 1.41421356237...</div>
        </div>

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
                  <div className="text-slate-400 font-mono">= {currentValue.toFixed(10)}</div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>Distance from √2:</span>
                    <span className="text-red-400 font-mono">{currentError.toExponential(2)}</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ width: `${Math.max(3, Math.min(95, 100 - (currentStep * 10)))}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="text-sm text-slate-500 mt-2 text-center">
                    {currentStep < 3 ? "Getting warmer..." : currentStep < 6 ? "So close!" : "Still not √2!"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="text-green-400 font-mono text-lg">{currentValue.toFixed(8)}</div>
                    <div className="text-slate-500 text-xs mt-1">Your fraction</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <div className="text-red-400 font-mono text-lg">{sqrt2.toFixed(8)}</div>
                    <div className="text-slate-500 text-xs mt-1">√2 (target)</div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleTapCloser}
            disabled={currentStep >= SQRT2_APPROXIMATIONS.length - 1 && hasStarted}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all active:scale-[0.98] ${
              currentStep >= SQRT2_APPROXIMATIONS.length - 1 && hasStarted
                ? 'bg-red-900/50 text-red-300 border-2 border-red-500/50'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
            }`}
          >
            {!hasStarted ? '🎯 Start the Hunt!' : currentStep >= SQRT2_APPROXIMATIONS.length - 1 ? '🚫 No exact match!' : '👆 Find Closer'}
          </button>
          {hasStarted && (
            <button onClick={handleReset} className="px-5 py-4 bg-slate-700 text-slate-300 rounded-xl">↺</button>
          )}
        </div>

        {hasStarted && (
          <div className="flex justify-center items-center gap-2 mb-6">
            {SQRT2_APPROXIMATIONS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${idx <= currentStep ? 'bg-green-500' : 'bg-slate-600'}`}
              />
            ))}
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* ==================== DESKTOP: Zoom Number Line ==================== */}
      <div className="hidden md:block">
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">
            Zoom Level: <span className="text-purple-400 font-mono">{zoomLevel}×</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1× (wide)</span>
            <span>50× (zoomed)</span>
          </div>
        </div>

        <div className="relative h-32 bg-slate-800/50 rounded-lg mb-6 overflow-hidden">
          <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-600" />

          {/* √2 marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${getPosition(sqrt2)}%` }}
          >
            <div className="w-1 h-8 bg-red-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(239,68,68,0.6)' }} />
            <div className="absolute -top-6 text-xs text-red-400 font-mono">√2</div>
            <div className="absolute top-10 text-xs text-red-400">THE GAP</div>
          </div>

          {/* Fraction dots only - no labels */}
          {fractions.slice(0, 60).map((f) => (
            <div
              key={`${f.p}/${f.q}`}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${getPosition(f.value)}%` }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  f.p === closestFraction.p && f.q === closestFraction.q ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{
                  transform: 'translate(-50%, -50%)',
                  boxShadow: f.p === closestFraction.p && f.q === closestFraction.q
                    ? '0 0 8px rgba(34,197,94,0.6)' : undefined
                }}
              />
            </div>
          ))}

          <div className="absolute bottom-2 left-4 text-xs text-slate-500 font-mono">{minValue.toFixed(4)}</div>
          <div className="absolute bottom-2 right-4 text-xs text-slate-500 font-mono">{maxValue.toFixed(4)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-green-400 font-semibold text-sm mb-1">Closest Fraction</div>
            <div className="text-2xl font-mono text-green-400">{closestFraction.p}/{closestFraction.q}</div>
            <div className="text-sm text-slate-400">= {closestFraction.value.toFixed(8)}</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-red-400 font-semibold text-sm mb-1">Error (Gap)</div>
            <div className="text-2xl font-mono text-red-400">{desktopError.toExponential(2)}</div>
            <div className="text-sm text-slate-400">Can't hit √2!</div>
          </div>
        </div>

        <div className="text-center text-slate-400 mb-6 text-sm">
          <span className="text-blue-400 font-mono">{fractions.length}</span> fractions visible
        </div>
      </div>

      {/* Historical approximations - both views */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[{ p: 7, q: 5 }, { p: 99, q: 70 }, { p: 239, q: 169 }, { p: 577, q: 408 }].map(({ p, q }) => (
          <div key={`${p}/${q}`} className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="font-mono text-blue-400">{p}/{q}</div>
            <div className="text-xs text-slate-500">err: {Math.abs(p/q - sqrt2).toExponential(1)}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Profound Truth:</strong> No matter how close you get,
          you'll never find a fraction equal to √2. The rationals have "holes" where irrationals live.
        </p>
      </div>
    </div>
  );
}
