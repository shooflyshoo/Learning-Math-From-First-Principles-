import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RationalDensityZoom() {
  const sqrt2 = Math.SQRT2;
  const [zoomLevel, setZoomLevel] = useState(1);

  // Mobile touch zoom handling
  const touchRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const lastZoom = useRef(1);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
      lastZoom.current = zoomLevel;
    }
  }, [zoomLevel]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = distance / lastTouchDistance.current;
      const newZoom = Math.max(1, Math.min(50, lastZoom.current * scale));
      setZoomLevel(Math.round(newZoom));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null;
  }, []);

  // Generate fractions - key insight: show FEWER at low zoom, MORE as you zoom in
  const generateFractions = (center: number, zoom: number) => {
    const range = 1 / zoom;
    const minVal = center - range;
    const maxVal = center + range;
    const fractions: { value: number; p: number; q: number }[] = [];

    // At low zoom: only simple fractions (small denominators)
    // At high zoom: allow larger denominators to reveal density
    const maxDenom = zoom < 5 ? Math.floor(zoom * 3 + 2) : Math.min(150, Math.floor(zoom * 8));

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    for (let q = 1; q <= maxDenom; q++) {
      for (let p = 1; p <= q * 3; p++) {
        const value = p / q;
        if (value > minVal && value < maxVal && gcd(p, q) === 1) {
          fractions.push({ value, p, q });
        }
      }
    }

    // Sort by value
    fractions.sort((a, b) => a.value - b.value);

    // At low zoom, filter to ensure minimum spacing between dots
    if (zoom < 10) {
      const minSpacing = 0.08 / zoom; // Require more spacing at low zoom
      const filtered: typeof fractions = [];
      let lastValue = -Infinity;

      for (const f of fractions) {
        if (f.value - lastValue >= minSpacing) {
          filtered.push(f);
          lastValue = f.value;
        }
      }
      return filtered;
    }

    return fractions;
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

  const error = Math.abs(closestFraction.value - sqrt2);

  return (
    <div className="interactive-container px-4 sm:px-6">
      <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-4 sm:mb-6">
        The Uncatchable Number
      </h3>

      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300 text-sm">
          Fractions seem to fill the number line completely. Between 1/2 and 1/3? There's 2/5.
          Between <em>any</em> two? Always another.
        </p>
        <p className="text-slate-300 text-sm mt-2">
          <span className="text-yellow-400">Challenge:</span> Can fractions catch <span className="text-red-400 font-mono">√2</span>?
          Zoom in and see how close they get...
        </p>
      </div>

      {/* Mobile: Pinch instruction + slider fallback */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs">Zoom in to chase √2</span>
          <span className="text-purple-400 font-mono text-sm font-bold">{zoomLevel}×</span>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseInt(e.target.value))}
          className="w-full h-8"
        />
      </div>

      {/* Desktop: Slider */}
      <div className="hidden sm:block mb-6">
        <label className="block text-sm text-slate-400 mb-2">
          Zoom in to chase √2: <span className="text-purple-400 font-mono">{zoomLevel}×</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Number line - with proper padding */}
      <div
        ref={touchRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-28 sm:h-32 bg-slate-800/50 rounded-lg mb-4 sm:mb-6 overflow-hidden touch-none mx-0"
      >
        {/* The line itself - inset from edges */}
        <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-1/2 h-0.5 bg-slate-600" />

        {/* √2 marker - THE TARGET */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ left: `calc(${getPosition(sqrt2)}% * 0.9 + 5%)` }}
        >
          <div className="w-1 h-8 sm:h-10 bg-red-500 rounded-full" style={{ boxShadow: '0 0 12px rgba(239,68,68,0.8)' }} />
          <div className="absolute -top-5 text-xs text-red-400 font-mono font-bold">√2</div>
          <div className="absolute top-10 sm:top-12 text-xs text-red-400 font-semibold">target</div>
        </div>

        {/* Fraction dots - larger at low zoom, smaller at high zoom */}
        {fractions.slice(0, 80).map((f) => {
          const isClosest = f.p === closestFraction.p && f.q === closestFraction.q;
          // Bigger dots at low zoom so they're visible and distinct
          const dotSize = zoomLevel < 5 ? 'w-3 h-3' : zoomLevel < 15 ? 'w-2.5 h-2.5' : 'w-2 h-2';

          return (
            <motion.div
              key={`${f.p}/${f.q}`}
              className="absolute top-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
              style={{
                left: `calc(${getPosition(f.value)}% * 0.9 + 5%)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.div
                className={`${dotSize} rounded-full ${isClosest ? 'bg-green-500' : 'bg-blue-500'}`}
                animate={isClosest ? {
                  scale: [1, 1.3, 1],
                  boxShadow: ['0 0 10px rgba(34,197,94,0.9)', '0 0 20px rgba(34,197,94,1)', '0 0 10px rgba(34,197,94,0.9)']
                } : {}}
                transition={isClosest ? { duration: 1.5, repeat: Infinity } : {}}
                style={{
                  boxShadow: isClosest ? '0 0 10px rgba(34,197,94,0.9)' : '0 0 4px rgba(59,130,246,0.5)'
                }}
              />
            </motion.div>
          );
        })}

        {/* Range labels - inside container */}
        <div className="absolute bottom-1 left-2 text-xs text-slate-500 font-mono">
          {minValue.toFixed(2)}
        </div>
        <div className="absolute bottom-1 right-2 text-xs text-slate-500 font-mono">
          {maxValue.toFixed(2)}
        </div>
      </div>

      {/* Info panel - reframed as "the chase" */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3">
          <div className="text-green-400 font-semibold text-xs mb-1">Best attempt</div>
          <div className="text-lg sm:text-2xl font-mono text-green-400">{closestFraction.p}/{closestFraction.q}</div>
          <div className="text-xs text-slate-400 truncate">= {closestFraction.value.toFixed(6)}</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3">
          <div className="text-red-400 font-semibold text-xs mb-1">Still misses by</div>
          <div className="text-lg sm:text-2xl font-mono text-red-400">{error.toExponential(1)}</div>
          <div className="text-xs text-slate-400">
            {zoomLevel < 10 ? "Zoom in more..." : "Never reaches zero!"}
          </div>
        </div>
      </div>

      {/* The reveal - changes based on zoom level with smooth transitions */}
      <motion.div
        className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 transition-colors duration-500 ${
          zoomLevel < 5
            ? 'bg-slate-700/30'
            : zoomLevel < 20
              ? 'bg-yellow-500/10 border border-yellow-500/30'
              : 'bg-purple-500/10 border-l-4 border-purple-500'
        }`}
        layout
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={zoomLevel < 5 ? 'early' : zoomLevel < 20 ? 'mid' : 'late'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xs sm:text-sm text-slate-300"
          >
            {zoomLevel < 5 && (
              <>Fractions crowd around √2, getting closer and closer. Surely one will hit it?</>
            )}
            {zoomLevel >= 5 && zoomLevel < 20 && (
              <><span className="text-yellow-400">Interesting...</span> No matter how close we zoom, there's always a gap. The fractions keep missing.</>
            )}
            {zoomLevel >= 20 && (
              <><strong className="text-purple-400">The truth:</strong> √2 is <em>unreachable</em> by fractions. It exists in the gaps—a number that's real but not rational. The ancient Greeks discovered this and called it "irrational."</>
            )}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Historical "good tries" */}
      <div className="text-center text-slate-500 text-xs mb-2">Famous attempts to catch √2:</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[{ p: 7, q: 5, who: 'simple' }, { p: 99, q: 70, who: 'better' }, { p: 577, q: 408, who: 'ancient' }].map(({ p, q, who }) => (
          <div key={`${p}/${q}`} className="bg-slate-700/50 rounded-lg p-2 text-center">
            <div className="font-mono text-blue-400 text-sm">{p}/{q}</div>
            <div className="text-xs text-slate-500">{who}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
