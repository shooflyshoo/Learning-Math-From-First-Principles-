import { useState, useMemo, useRef, useCallback } from 'react';

export default function RationalDensityZoom() {
  const sqrt2 = Math.SQRT2;

  // Shared zoom state
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

  // Generate fractions for visualization
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

  const error = Math.abs(closestFraction.value - sqrt2);

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Rationals Are Dense But Have Holes
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300 text-sm sm:text-base">
          Between any two fractions, there's always another. Yet √2
          is <span className="text-red-400 font-semibold">not a fraction</span>.
          <span className="md:hidden"> Pinch to zoom in on the gap!</span>
          <span className="hidden md:inline"> Use the slider to zoom in on the gap!</span>
        </p>
      </div>

      {/* ==================== UNIFIED: Zoomable Number Line ==================== */}

      {/* Mobile: Pinch-to-zoom instruction */}
      <div className="md:hidden text-center mb-3">
        <span className="text-slate-400 text-sm">👆👆 Pinch to zoom • </span>
        <span className="text-purple-400 font-mono text-sm">{zoomLevel}×</span>
      </div>

      {/* Desktop: Slider */}
      <div className="hidden md:block mb-6">
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

      {/* Number line - touch-zoomable on mobile */}
      <div
        ref={touchRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-32 bg-slate-800/50 rounded-lg mb-6 overflow-hidden touch-none"
      >
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-600" />

        {/* √2 marker - THE GAP */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ left: `${getPosition(sqrt2)}%` }}
        >
          <div className="w-1 h-10 bg-red-500 rounded-full" style={{ boxShadow: '0 0 12px rgba(239,68,68,0.8)' }} />
          <div className="absolute -top-6 text-xs text-red-400 font-mono font-bold">√2</div>
          <div className="absolute top-12 text-xs text-red-400 font-semibold whitespace-nowrap">THE GAP</div>
        </div>

        {/* Fraction dots */}
        {fractions.slice(0, 80).map((f) => (
          <div
            key={`${f.p}/${f.q}`}
            className="absolute top-1/2"
            style={{ left: `${getPosition(f.value)}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                f.p === closestFraction.p && f.q === closestFraction.q ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{
                boxShadow: f.p === closestFraction.p && f.q === closestFraction.q
                  ? '0 0 8px rgba(34,197,94,0.8)' : undefined
              }}
            />
          </div>
        ))}

        {/* Range labels */}
        <div className="absolute bottom-2 left-4 text-xs text-slate-500 font-mono">{minValue.toFixed(4)}</div>
        <div className="absolute bottom-2 right-4 text-xs text-slate-500 font-mono">{maxValue.toFixed(4)}</div>
      </div>

      {/* Info panel */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-green-400 font-semibold text-xs sm:text-sm mb-1">Closest Fraction</div>
          <div className="text-xl sm:text-2xl font-mono text-green-400">{closestFraction.p}/{closestFraction.q}</div>
          <div className="text-xs sm:text-sm text-slate-400">= {closestFraction.value.toFixed(6)}</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-red-400 font-semibold text-xs sm:text-sm mb-1">Error (Gap)</div>
          <div className="text-xl sm:text-2xl font-mono text-red-400">{error.toExponential(2)}</div>
          <div className="text-xs sm:text-sm text-slate-400">Can't hit √2!</div>
        </div>
      </div>

      <div className="text-center text-slate-400 mb-6 text-sm">
        <span className="text-blue-400 font-mono">{fractions.length}</span> fractions visible
        {zoomLevel > 5 && <span className="text-slate-500"> • Zoom in more to see the gap never fills!</span>}
      </div>

      {/* Historical approximations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[{ p: 7, q: 5 }, { p: 99, q: 70 }, { p: 239, q: 169 }, { p: 577, q: 408 }].map(({ p, q }) => (
          <div key={`${p}/${q}`} className="bg-slate-700/50 rounded-lg p-2 sm:p-3 text-center">
            <div className="font-mono text-blue-400 text-sm sm:text-base">{p}/{q}</div>
            <div className="text-xs text-slate-500">err: {Math.abs(p/q - sqrt2).toExponential(1)}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Profound Truth:</strong> No matter how far you zoom,
          you'll never find a fraction at √2. The rationals have "holes" where irrationals live.
        </p>
      </div>
    </div>
  );
}
