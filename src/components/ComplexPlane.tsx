import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplexNumber {
  real: number;
  imag: number;
}

export default function ComplexPlane() {
  const [point, setPoint] = useState<ComplexNumber>({ real: 1, imag: 0 });
  const [rotations, setRotations] = useState(0);
  const [mode, setMode] = useState<'explore' | 'rotate'>('explore');
  const [trail, setTrail] = useState<ComplexNumber[]>([{ real: 1, imag: 0 }]);
  const svgRef = useRef<SVGSVGElement>(null);

  const scale = 40; // pixels per unit
  const centerX = 200;
  const centerY = 200;

  const toScreen = (c: ComplexNumber) => ({
    x: centerX + c.real * scale,
    y: centerY - c.imag * scale, // y is flipped in SVG
  });

  const toComplex = (screenX: number, screenY: number): ComplexNumber => ({
    real: Math.round((screenX - centerX) / scale * 2) / 2,
    imag: Math.round((centerY - screenY) / scale * 2) / 2,
  });

  const multiply = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  });

  const i: ComplexNumber = { real: 0, imag: 1 };

  const handleMultiplyByI = () => {
    const newPoint = multiply(point, i);
    setPoint(newPoint);
    setRotations((r) => r + 1);
    setTrail((t) => [...t, newPoint]);
  };

  const handleReset = () => {
    setPoint({ real: 1, imag: 0 });
    setRotations(0);
    setTrail([{ real: 1, imag: 0 }]);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'explore') return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPoint = toComplex(x, y);
    setPoint(newPoint);
    setTrail([newPoint]);
    setRotations(0);
  };

  const magnitude = Math.sqrt(point.real * point.real + point.imag * point.imag);
  const angle = Math.atan2(point.imag, point.real) * (180 / Math.PI);

  const screenPoint = toScreen(point);

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-4 sm:mb-6">
        The Complex Plane (2D Number Space)
      </h3>

      {/* Mode toggle with inline feedback */}
      <div className="mb-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode('explore')}
            className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm transition-all min-h-[44px] ${
              mode === 'explore'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setMode('rotate')}
            className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm transition-all min-h-[44px] ${
              mode === 'rotate'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Rotate (×i)
          </button>
        </div>

        {/* Immediate feedback under mode buttons - this is what changed */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {mode === 'explore' ? (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-slate-300">
                👇 <strong className="text-blue-400">Tap the grid below</strong> to place a complex number anywhere.
              </div>
            ) : (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <button
                    onClick={handleMultiplyByI}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm min-h-[44px] whitespace-nowrap"
                  >
                    × i (rotate 90°)
                  </button>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-purple-400 font-mono">{rotations}×</span>
                    <span className="text-slate-400">
                      {rotations === 0 && 'at 1 →'}
                      {rotations === 1 && 'at i ↑'}
                      {rotations === 2 && 'at -1 ←'}
                      {rotations === 3 && 'at -i ↓'}
                      {rotations === 4 && '🎉 back to 1!'}
                      {rotations > 4 && `= ${rotations % 4} rotations`}
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-slate-500 hover:text-slate-300 text-xs underline"
                    >
                      reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Current point - always visible, compact on mobile */}
      <div className="bg-slate-700/30 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="text-lg font-mono text-blue-400">
          {point.real >= 0 ? '' : ''}{point.real}
          {point.imag >= 0 ? ' + ' : ' − '}
          {Math.abs(point.imag)}i
        </div>
        <div className="text-xs text-slate-400">
          |z| = <span className="text-yellow-400">{magnitude.toFixed(2)}</span>
          <span className="mx-2">•</span>
          θ = <span className="text-yellow-400">{angle.toFixed(0)}°</span>
        </div>
      </div>

      {/* Complex Plane SVG */}
      <div className="mb-4">
        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          className="w-full max-w-md mx-auto bg-slate-800/50 rounded-lg cursor-crosshair"
          onClick={handleClick}
        >
          {/* Grid */}
          <defs>
            <pattern id="complexGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
              <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#complexGrid)" />

          {/* Axes */}
          <line x1="0" y1={centerY} x2="400" y2={centerY} stroke="#64748b" strokeWidth="2" />
          <line x1={centerX} y1="0" x2={centerX} y2="400" stroke="#64748b" strokeWidth="2" />

          {/* Axis labels */}
          <text x="385" y={centerY - 10} fill="#64748b" fontSize="14">Re</text>
          <text x={centerX + 10} y="15" fill="#64748b" fontSize="14">Imag</text>

          {/* Tick marks and labels */}
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((n) => (
            <g key={`x-${n}`}>
              <line
                x1={centerX + n * scale}
                y1={centerY - 5}
                x2={centerX + n * scale}
                y2={centerY + 5}
                stroke="#64748b"
              />
              <text
                x={centerX + n * scale}
                y={centerY + 20}
                fill="#64748b"
                fontSize="12"
                textAnchor="middle"
              >
                {n}
              </text>
            </g>
          ))}
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((n) => (
            <g key={`y-${n}`}>
              <line
                x1={centerX - 5}
                y1={centerY - n * scale}
                x2={centerX + 5}
                y2={centerY - n * scale}
                stroke="#64748b"
              />
              <text
                x={centerX - 15}
                y={centerY - n * scale + 4}
                fill="#64748b"
                fontSize="12"
                textAnchor="middle"
              >
                {n}i
              </text>
            </g>
          ))}

          {/* Origin */}
          <text x={centerX - 15} y={centerY + 20} fill="#eab308" fontSize="12">0</text>

          {/* Key points */}
          <circle cx={centerX + scale} cy={centerY} r="4" fill="#22c55e" />
          <text x={centerX + scale + 8} y={centerY - 8} fill="#22c55e" fontSize="11">1</text>

          <circle cx={centerX - scale} cy={centerY} r="4" fill="#ef4444" />
          <text x={centerX - scale - 15} y={centerY - 8} fill="#ef4444" fontSize="11">-1</text>

          <circle cx={centerX} cy={centerY - scale} r="4" fill="#a855f7" />
          <text x={centerX + 8} y={centerY - scale - 8} fill="#a855f7" fontSize="11">i</text>

          <circle cx={centerX} cy={centerY + scale} r="4" fill="#f97316" />
          <text x={centerX + 8} y={centerY + scale + 15} fill="#f97316" fontSize="11">-i</text>

          {/* Trail */}
          {mode === 'rotate' && trail.length > 1 && (
            <>
              {/* Connecting lines */}
              {trail.slice(0, -1).map((p, idx) => {
                const next = trail[idx + 1];
                const from = toScreen(p);
                const to = toScreen(next);
                return (
                  <line
                    key={idx}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity={0.5}
                  />
                );
              })}
              {/* Trail points */}
              {trail.slice(0, -1).map((p, idx) => {
                const screen = toScreen(p);
                return (
                  <circle
                    key={idx}
                    cx={screen.x}
                    cy={screen.y}
                    r="5"
                    fill="#a855f7"
                    opacity={0.3}
                  />
                );
              })}
            </>
          )}

          {/* Vector from origin to point */}
          <line
            x1={centerX}
            y1={centerY}
            x2={screenPoint.x}
            y2={screenPoint.y}
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Current point */}
          <motion.circle
            cx={screenPoint.x}
            cy={screenPoint.y}
            r="8"
            fill="#3b82f6"
            initial={false}
            animate={{ cx: screenPoint.x, cy: screenPoint.y }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))' }}
          />

          {/* Angle arc */}
          {magnitude > 0.1 && (
            <path
              d={`M ${centerX + 30} ${centerY} A 30 30 0 ${Math.abs(angle) > 180 ? 1 : 0} ${angle > 0 ? 0 : 1} ${centerX + 30 * Math.cos(angle * Math.PI / 180)} ${centerY - 30 * Math.sin(angle * Math.PI / 180)}`}
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>

      {/* Discovery moment when i²=-1 is demonstrated */}
      <AnimatePresence>
        {mode === 'rotate' && rotations === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
          >
            <div className="text-green-400 font-semibold mb-1">💡 i² = -1 makes sense now!</div>
            <p className="text-slate-300 text-sm">
              Two 90° rotations = 180° = opposite direction = ×(-1)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 sm:p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-xs sm:text-sm text-slate-300">
          <strong className="text-purple-400">Key Insight:</strong> Complex numbers are 2D numbers.
          Multiplying by i rotates 90° counterclockwise—that's why i² = -1 (two quarter turns = half turn = opposite).
        </p>
      </div>
    </div>
  );
}
