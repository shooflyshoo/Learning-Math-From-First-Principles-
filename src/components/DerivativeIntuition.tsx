import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gauge, ZoomIn, Info } from 'lucide-react';

/**
 * Derivative Intuition
 *
 * The derivative is THE bridge between algebra and calculus.
 * Most students see it as "a formula to memorize." Wrong.
 *
 * The derivative is: "How fast is this changing RIGHT NOW?"
 * It's the speedometer reading, not the total distance.
 *
 * Historical note: Newton and Leibniz independently invented calculus
 * in the 1680s. Both approached it from the idea of "infinitely small"
 * changes — zoom in enough and any curve looks like a straight line.
 */

type CurveType = 'parabola' | 'cubic' | 'sine' | 'exponential';

interface CurveInfo {
  fn: (x: number) => number;
  derivative: (x: number) => number;
  label: string;
  notation: string;
  derivativeNotation: string;
}

const curves: Record<CurveType, CurveInfo> = {
  parabola: {
    fn: (x) => x * x,
    derivative: (x) => 2 * x,
    label: 'Parabola',
    notation: 'f(x) = x²',
    derivativeNotation: "f'(x) = 2x",
  },
  cubic: {
    fn: (x) => x * x * x / 3,
    derivative: (x) => x * x,
    label: 'Cubic',
    notation: 'f(x) = x³/3',
    derivativeNotation: "f'(x) = x²",
  },
  sine: {
    fn: (x) => 2 * Math.sin(x),
    derivative: (x) => 2 * Math.cos(x),
    label: 'Wave',
    notation: 'f(x) = 2sin(x)',
    derivativeNotation: "f'(x) = 2cos(x)",
  },
  exponential: {
    fn: (x) => Math.exp(x / 2) - 1,
    derivative: (x) => Math.exp(x / 2) / 2,
    label: 'Exponential',
    notation: 'f(x) = eˣ/² - 1',
    derivativeNotation: "f'(x) = eˣ/²/2",
  },
};

export default function DerivativeIntuition() {
  const [curveType, setCurveType] = useState<CurveType>('parabola');
  const [xPosition, setXPosition] = useState(1.5);
  const [showTangent, setShowTangent] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const curve = curves[curveType];

  const yPosition = curve.fn(xPosition);
  const slope = curve.derivative(xPosition);

  // SVG coordinate transforms
  const viewBox = useMemo(() => {
    const baseWidth = 8 / zoomLevel;
    const baseHeight = 6 / zoomLevel;
    const centerX = xPosition;
    const centerY = yPosition;
    return {
      x: centerX - baseWidth / 2,
      y: -(centerY + baseHeight / 2),
      width: baseWidth,
      height: baseHeight,
    };
  }, [xPosition, yPosition, zoomLevel]);

  const toSvgY = (y: number) => -y;

  // Generate curve points
  const curvePoints = useMemo(() => {
    const pts: string[] = [];
    const step = 0.05 / zoomLevel;
    for (let x = viewBox.x - 1; x <= viewBox.x + viewBox.width + 1; x += step) {
      const y = curve.fn(x);
      if (Math.abs(y) < 20) {
        pts.push(`${pts.length === 0 ? 'M' : 'L'} ${x} ${toSvgY(y)}`);
      }
    }
    return pts.join(' ');
  }, [curve, viewBox, zoomLevel]);

  // Tangent line points
  const tangentPoints = useMemo(() => {
    const dx = viewBox.width / 2;
    const x1 = xPosition - dx;
    const x2 = xPosition + dx;
    const y1 = yPosition + slope * (x1 - xPosition);
    const y2 = yPosition + slope * (x2 - xPosition);
    return { x1, y1, x2, y2 };
  }, [xPosition, yPosition, slope, viewBox]);

  const handleDrag = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    setXPosition(Math.max(-3.5, Math.min(3.5, x)));
  }, [viewBox]);

  const getSlopeDescription = () => {
    if (Math.abs(slope) < 0.1) return { text: 'Nearly flat', color: 'text-slate-400' };
    if (slope > 0 && slope < 1) return { text: 'Gentle upward slope', color: 'text-green-400' };
    if (slope >= 1 && slope < 2) return { text: 'Moderate climb', color: 'text-green-500' };
    if (slope >= 2) return { text: 'Steep ascent!', color: 'text-green-600' };
    if (slope < 0 && slope > -1) return { text: 'Gentle downward slope', color: 'text-red-400' };
    if (slope <= -1 && slope > -2) return { text: 'Moderate descent', color: 'text-red-500' };
    return { text: 'Steep drop!', color: 'text-red-600' };
  };

  const slopeDesc = getSlopeDescription();

  return (
    <div className="space-y-6">
      {/* Curve selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(curves) as CurveType[]).map((key) => (
          <button
            key={key}
            onClick={() => { setCurveType(key); setXPosition(1.5); setZoomLevel(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
              curveType === key
                ? 'bg-orange-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {curves[key].label}
          </button>
        ))}
      </div>

      {/* Main visualization */}
      <div className="bg-slate-900/70 rounded-xl overflow-hidden">
        <svg
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="w-full h-64 sm:h-80 cursor-crosshair"
          onMouseMove={handleDrag}
          onClick={handleDrag}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          <defs>
            <pattern id="deriv-grid" width="1" height="1" patternUnits="userSpaceOnUse">
              <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#1e293b" strokeWidth="0.02" />
            </pattern>
          </defs>
          <rect x={viewBox.x - 10} y={viewBox.y - 10} width={viewBox.width + 20} height={viewBox.height + 20} fill="url(#deriv-grid)" />

          {/* Axes */}
          <line x1={viewBox.x - 10} y1="0" x2={viewBox.x + viewBox.width + 10} y2="0" stroke="#475569" strokeWidth="0.03" />
          <line x1="0" y1={viewBox.y - 10} x2="0" y2={viewBox.y + viewBox.height + 10} stroke="#475569" strokeWidth="0.03" />

          {/* The curve */}
          <path
            d={curvePoints}
            fill="none"
            stroke="#f97316"
            strokeWidth={0.06 / zoomLevel}
            strokeLinecap="round"
          />

          {/* Tangent line */}
          {showTangent && (
            <motion.line
              x1={tangentPoints.x1}
              y1={toSvgY(tangentPoints.y1)}
              x2={tangentPoints.x2}
              y2={toSvgY(tangentPoints.y2)}
              stroke="#22d3ee"
              strokeWidth={0.04 / zoomLevel}
              strokeDasharray={`${0.1 / zoomLevel},${0.05 / zoomLevel}`}
              initial={false}
              animate={{
                x1: tangentPoints.x1,
                y1: toSvgY(tangentPoints.y1),
                x2: tangentPoints.x2,
                y2: toSvgY(tangentPoints.y2),
              }}
            />
          )}

          {/* Current point */}
          <motion.circle
            cx={xPosition}
            cy={toSvgY(yPosition)}
            r={0.12 / zoomLevel}
            fill="#22d3ee"
            stroke="#fff"
            strokeWidth={0.03 / zoomLevel}
            initial={false}
            animate={{ cx: xPosition, cy: toSvgY(yPosition) }}
          />
        </svg>
      </div>

      {/* Speedometer-style slope display */}
      <div className="bg-slate-800/70 rounded-xl p-4">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-slate-400 text-sm mb-1">Position (x)</div>
            <div className="text-2xl font-mono text-white">{xPosition.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1 flex items-center justify-center gap-1">
              <Gauge size={14} />
              Slope (derivative)
            </div>
            <motion.div
              key={slope.toFixed(2)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-3xl font-mono ${slopeDesc.color}`}
            >
              {slope >= 0 ? '+' : ''}{slope.toFixed(2)}
            </motion.div>
            <div className={`text-xs ${slopeDesc.color}`}>{slopeDesc.text}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Value f(x)</div>
            <div className="text-2xl font-mono text-orange-400">{yPosition.toFixed(2)}</div>
          </div>
        </div>

        {/* X position slider (mobile-friendly) */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <label className="text-sm text-slate-400 block mb-2">
            Drag point along curve (or use slider):
          </label>
          <input
            type="range"
            min="-3.5"
            max="3.5"
            step="0.1"
            value={xPosition}
            onChange={(e) => setXPosition(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowTangent(!showTangent)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm min-h-[44px] ${
            showTangent ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Show tangent line
        </button>

        <div className="flex items-center gap-2">
          <ZoomIn size={16} className="text-slate-400" />
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-slate-400 text-sm">{zoomLevel}×</span>
        </div>
      </div>

      {/* Function info */}
      <div className="bg-slate-800/50 rounded-lg p-4 grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-slate-400 text-sm mb-1">Function:</div>
          <div className="text-lg font-mono text-orange-400">{curve.notation}</div>
        </div>
        <div>
          <div className="text-slate-400 text-sm mb-1">Derivative:</div>
          <div className="text-lg font-mono text-cyan-400">{curve.derivativeNotation}</div>
        </div>
      </div>

      {/* Key insight */}
      <div className="p-4 bg-orange-500/10 border-l-4 border-orange-500 rounded-r-lg">
        <p className="text-sm text-slate-300 mb-2">
          <strong className="text-orange-400">The Big Idea:</strong> The derivative is the <em>slope</em> at a single point.
          It tells you "how fast is y changing as x moves?"
        </p>
        <p className="text-sm text-slate-400">
          <Info size={14} className="inline mr-1" />
          Zoom in enough on <em>any</em> smooth curve and it looks like a straight line.
          The derivative is the slope of that line. Newton and Leibniz realized that this "local straightness"
          is the key to understanding motion, change, and growth.
        </p>
      </div>
    </div>
  );
}
