import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function RationalDensityZoom() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [centerOn] = useState(Math.SQRT2);

  const sqrt2 = Math.SQRT2; // approximately 1.41421356...

  // Generate fractions near the center point
  const generateFractions = (center: number, zoom: number) => {
    const range = 1 / zoom;
    const fractions: { value: number; p: number; q: number }[] = [];

    // Generate fractions with denominators up to a limit based on zoom
    const maxDenom = Math.min(100, Math.floor(zoom * 10));

    for (let q = 1; q <= maxDenom; q++) {
      for (let p = 1; p <= q * 2; p++) {
        const value = p / q;
        if (Math.abs(value - center) < range) {
          // Check if this fraction is in lowest terms
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          if (gcd(p, q) === 1) {
            fractions.push({ value, p, q });
          }
        }
      }
    }

    return fractions.sort((a, b) => a.value - b.value);
  };

  const fractions = useMemo(
    () => generateFractions(centerOn, zoomLevel),
    [centerOn, zoomLevel]
  );

  const range = 1 / zoomLevel;
  const minValue = centerOn - range;
  const maxValue = centerOn + range;

  const getPosition = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  // Find closest fraction to sqrt2
  const closestFraction = fractions.reduce(
    (closest, f) => {
      const currentDiff = Math.abs(f.value - sqrt2);
      const closestDiff = Math.abs(closest.value - sqrt2);
      return currentDiff < closestDiff ? f : closest;
    },
    { value: 0, p: 0, q: 1 }
  );

  const error = Math.abs(closestFraction.value - sqrt2);

  // Collision detection for labels - only show labels that are far enough apart
  const labelsToShow = useMemo(() => {
    // Increase minimum distance at low zoom levels where more fractions are visible
    const minDistance = zoomLevel < 5 ? 18 : zoomLevel < 15 ? 14 : 10;
    const shownPositions: number[] = [];
    const showSet = new Set<string>();

    // Always show the closest fraction first
    const closestKey = `${closestFraction.p}/${closestFraction.q}`;
    if (closestFraction.q <= 10) {
      const closestPos = getPosition(closestFraction.value);
      showSet.add(closestKey);
      shownPositions.push(closestPos);
    }

    // Sort by denominator (simpler fractions first) - prioritize showing 1/1, 3/2, etc.
    const sortedForLabels = [...fractions]
      .filter(f => f.q <= 10 && `${f.p}/${f.q}` !== closestKey)
      .sort((a, b) => a.q - b.q || a.value - b.value);

    // Add labels that don't collide with ANY already-shown label
    for (const f of sortedForLabels) {
      const pos = getPosition(f.value);
      const key = `${f.p}/${f.q}`;

      // Check if this position is far enough from ALL shown positions
      const isFarEnough = shownPositions.every(
        shownPos => Math.abs(pos - shownPos) >= minDistance
      );

      if (isFarEnough) {
        showSet.add(key);
        shownPositions.push(pos);
      }
    }

    return showSet;
  }, [fractions, closestFraction, zoomLevel, minValue, maxValue]);

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Rationals Are Dense But Have Holes (Zoom to √2)
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300">
          Between any two fractions, there's always another fraction. Yet √2 ≈ 1.41421356...
          is <span className="text-red-400">not a fraction</span>. Watch as we zoom in—fractions get
          denser and denser, but never hit √2 exactly.
        </p>
      </div>

      {/* Zoom control */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">
          Zoom Level: <span className="text-purple-400 font-mono">{zoomLevel}×</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          step={1}
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1× (wide view)</span>
          <span>50× (zoomed in)</span>
        </div>
      </div>

      {/* Number line */}
      <div className="relative h-32 bg-slate-800/50 rounded-lg mb-6 overflow-hidden">
        {/* Main line */}
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-600" />

        {/* √2 marker (the gap) */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ left: `calc(${getPosition(sqrt2)}% + 16px - ${getPosition(sqrt2) * 0.32}px)` }}
          initial={false}
          animate={{ left: `calc(${getPosition(sqrt2)}%)` }}
        >
          <div className="w-1 h-8 bg-red-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)' }} />
          <div className="absolute -top-8 text-xs text-red-400 whitespace-nowrap font-mono">√2</div>
          <div className="absolute top-10 text-xs text-red-400 whitespace-nowrap">THE GAP</div>
        </motion.div>

        {/* Fraction markers */}
        {fractions.slice(0, 50).map((f, idx) => {
          const key = `${f.p}/${f.q}`;
          const shouldShowLabel = labelsToShow.has(key);

          return (
            <motion.div
              key={key}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${getPosition(f.value)}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  f === closestFraction ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{
                  boxShadow: f === closestFraction
                    ? '0 0 8px rgba(34, 197, 94, 0.6)'
                    : undefined,
                }}
              />
              {shouldShowLabel && (
                <div className="absolute top-4 -translate-x-1/2 text-xs text-slate-400 font-mono whitespace-nowrap">
                  {f.p}/{f.q}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Range labels */}
        <div className="absolute bottom-2 left-4 text-xs text-slate-500 font-mono">
          {minValue.toFixed(4)}
        </div>
        <div className="absolute bottom-2 right-4 text-xs text-slate-500 font-mono">
          {maxValue.toFixed(4)}
        </div>
      </div>

      {/* Info panel */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <h4 className="text-green-400 font-semibold mb-1 text-sm">Closest Fraction</h4>
          <div className="text-xl sm:text-2xl font-mono text-green-400">
            {closestFraction.p}/{closestFraction.q}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            = {closestFraction.value.toFixed(6)}
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <h4 className="text-red-400 font-semibold mb-1 text-sm">Error (Gap)</h4>
          <div className="text-xl sm:text-2xl font-mono text-red-400">
            {error.toExponential(2)}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            Can't hit √2!
          </div>
        </div>
      </div>

      {/* Visible fractions counter */}
      <div className="text-center text-slate-400 mb-6 text-sm">
        <span className="text-blue-400 font-mono">{fractions.length}</span> fractions visible
        {zoomLevel > 1 && (
          <span className="text-slate-500 block sm:inline"> (denom ≤ {Math.min(100, Math.floor(zoomLevel * 10))})</span>
        )}
      </div>

      {/* Famous approximations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[
          { p: 7, q: 5, error: Math.abs(7/5 - sqrt2) },
          { p: 99, q: 70, error: Math.abs(99/70 - sqrt2) },
          { p: 239, q: 169, error: Math.abs(239/169 - sqrt2) },
          { p: 577, q: 408, error: Math.abs(577/408 - sqrt2) },
        ].map(({ p, q, error }) => (
          <div key={`${p}/${q}`} className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="font-mono text-blue-400">{p}/{q}</div>
            <div className="text-xs text-slate-500">error: {error.toExponential(2)}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Profound Truth:</strong> No matter how far you zoom,
          you'll never find a fraction that equals √2. The ancient Greeks proved this, and it shocked them.
          The rationals are infinitely dense, yet have "holes" where irrational numbers live.
          This is why we need the real numbers ℝ.
        </p>
      </div>
    </div>
  );
}
