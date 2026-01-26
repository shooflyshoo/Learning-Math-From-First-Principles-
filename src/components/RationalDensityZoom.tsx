import { useState, useMemo, useRef, useCallback } from 'react';

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
    <div className="interactive-container px-4 sm:px-6">
      <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-4 sm:mb-6">
        Rationals Are Dense But Have Holes
      </h3>

      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300 text-sm">
          Between any two fractions, there's always another. Yet √2
          is <span className="text-red-400 font-semibold">not a fraction</span>.
          <span className="sm:hidden"> Pinch to zoom!</span>
          <span className="hidden sm:inline"> Use the slider to zoom in on the gap!</span>
        </p>
      </div>

      {/* Mobile: Pinch instruction + slider fallback */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs">👆👆 Pinch or drag slider</span>
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

        {/* √2 marker - THE GAP */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ left: `calc(${getPosition(sqrt2)}% * 0.9 + 5%)` }}
        >
          <div className="w-1 h-8 sm:h-10 bg-red-500 rounded-full" style={{ boxShadow: '0 0 12px rgba(239,68,68,0.8)' }} />
          <div className="absolute -top-5 text-xs text-red-400 font-mono font-bold">√2</div>
          <div className="absolute top-10 sm:top-12 text-xs text-red-400 font-semibold">GAP</div>
        </div>

        {/* Fraction dots - scaled to fit within padded area */}
        {fractions.slice(0, 60).map((f) => (
          <div
            key={`${f.p}/${f.q}`}
            className="absolute top-1/2"
            style={{
              left: `calc(${getPosition(f.value)}% * 0.9 + 5%)`,
              transform: 'translate(-50%, -50%)'
            }}
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

        {/* Range labels - inside container */}
        <div className="absolute bottom-1 left-2 text-xs text-slate-500 font-mono">
          {minValue.toFixed(2)}
        </div>
        <div className="absolute bottom-1 right-2 text-xs text-slate-500 font-mono">
          {maxValue.toFixed(2)}
        </div>
      </div>

      {/* Info panel - properly sized for mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3">
          <div className="text-green-400 font-semibold text-xs mb-1">Closest</div>
          <div className="text-lg sm:text-2xl font-mono text-green-400">{closestFraction.p}/{closestFraction.q}</div>
          <div className="text-xs text-slate-400 truncate">= {closestFraction.value.toFixed(4)}</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3">
          <div className="text-red-400 font-semibold text-xs mb-1">Error</div>
          <div className="text-lg sm:text-2xl font-mono text-red-400">{error.toExponential(1)}</div>
          <div className="text-xs text-slate-400">Never zero!</div>
        </div>
      </div>

      <div className="text-center text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm">
        <span className="text-blue-400 font-mono">{fractions.length}</span> fractions
        {zoomLevel > 5 && <span className="text-slate-500"> • Gap never fills!</span>}
      </div>

      {/* Historical approximations - 2 columns always on mobile */}
      <div className="grid grid-cols-2 gap-2 mb-4 sm:mb-6">
        {[{ p: 7, q: 5 }, { p: 99, q: 70 }].map(({ p, q }) => (
          <div key={`${p}/${q}`} className="bg-slate-700/50 rounded-lg p-2 text-center">
            <div className="font-mono text-blue-400 text-sm">{p}/{q}</div>
            <div className="text-xs text-slate-500">≈{(p/q).toFixed(4)}</div>
          </div>
        ))}
      </div>

      <div className="p-3 sm:p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-xs sm:text-sm text-slate-300">
          <strong className="text-purple-400">Key Insight:</strong> No matter how far you zoom,
          you'll never find a fraction at √2. Rationals have "holes" where irrationals live.
        </p>
      </div>
    </div>
  );
}
