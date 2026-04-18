import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Layers, RotateCcw } from 'lucide-react';

/**
 * Function Transformer
 *
 * Visual learners struggle with f(x+2) vs f(x)+2. This makes it visceral.
 * You SEE the transformation happen, then connect it to the notation.
 *
 * Historical note: Descartes invented coordinate geometry in 1637,
 * unifying algebra and geometry. This module embodies that insight.
 */

type BaseFunction = 'parabola' | 'sine' | 'absolute' | 'cubic';

interface Transform {
  hShift: number;
  vShift: number;
  hScale: number;
  vScale: number;
  reflect: boolean;
}

const baseFunctions: Record<BaseFunction, { fn: (x: number) => number; label: string; notation: string }> = {
  parabola: { fn: (x) => x * x, label: 'Parabola', notation: 'x²' },
  sine: { fn: (x) => Math.sin(x), label: 'Wave', notation: 'sin(x)' },
  absolute: { fn: (x) => Math.abs(x), label: 'V-Shape', notation: '|x|' },
  cubic: { fn: (x) => x * x * x / 4, label: 'S-Curve', notation: 'x³' },
};

export default function FunctionTransformer() {
  const [baseFunc, setBaseFunc] = useState<BaseFunction>('parabola');
  const [transform, setTransform] = useState<Transform>({
    hShift: 0,
    vShift: 0,
    hScale: 1,
    vScale: 1,
    reflect: false,
  });
  const [showOriginal, setShowOriginal] = useState(true);

  const base = baseFunctions[baseFunc];

  const transformedFn = (x: number) => {
    const scaledX = x / transform.hScale;
    const shiftedX = scaledX - transform.hShift;
    let y = base.fn(shiftedX);
    y *= transform.vScale;
    if (transform.reflect) y = -y;
    y += transform.vShift;
    return y;
  };

  const buildNotation = () => {
    let inner = 'x';
    if (transform.hScale !== 1) inner = `${transform.hScale}x`;
    if (transform.hShift > 0) inner = `(${inner} - ${transform.hShift})`;
    else if (transform.hShift < 0) inner = `(${inner} + ${Math.abs(transform.hShift)})`;

    let notation = base.notation.replace('x', inner);

    if (transform.vScale !== 1 && transform.vScale !== -1) {
      notation = `${transform.vScale}·${notation}`;
    }
    if (transform.reflect) notation = `-${notation}`;
    if (transform.vShift > 0) notation = `${notation} + ${transform.vShift}`;
    else if (transform.vShift < 0) notation = `${notation} - ${Math.abs(transform.vShift)}`;

    return notation;
  };

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = -6; x <= 6; x += 0.1) {
      pts.push({ x, y: transformedFn(x) });
    }
    return pts;
  }, [transform, baseFunc]);

  const originalPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = -6; x <= 6; x += 0.1) {
      pts.push({ x, y: base.fn(x) });
    }
    return pts;
  }, [baseFunc]);

  const toSvg = (x: number, y: number) => ({
    x: 200 + x * 30,
    y: 150 - y * 25,
  });

  const pathFromPoints = (pts: { x: number; y: number }[]) => {
    return pts
      .filter(p => Math.abs(p.y) < 8)
      .map((p, i) => {
        const svg = toSvg(p.x, p.y);
        return `${i === 0 ? 'M' : 'L'} ${svg.x} ${svg.y}`;
      })
      .join(' ');
  };

  const resetTransform = () => {
    setTransform({ hShift: 0, vShift: 0, hScale: 1, vScale: 1, reflect: false });
  };

  const getTransformDescription = () => {
    const parts: string[] = [];
    if (transform.hShift > 0) parts.push(`shifted right ${transform.hShift}`);
    if (transform.hShift < 0) parts.push(`shifted left ${Math.abs(transform.hShift)}`);
    if (transform.vShift > 0) parts.push(`shifted up ${transform.vShift}`);
    if (transform.vShift < 0) parts.push(`shifted down ${Math.abs(transform.vShift)}`);
    if (transform.hScale > 1) parts.push(`stretched horizontally ×${transform.hScale}`);
    if (transform.hScale < 1) parts.push(`compressed horizontally`);
    if (transform.vScale > 1) parts.push(`stretched vertically ×${transform.vScale}`);
    if (transform.vScale < 1 && transform.vScale > 0) parts.push(`compressed vertically`);
    if (transform.reflect) parts.push(`flipped upside-down`);
    return parts.length ? parts.join(', ') : 'original position';
  };

  return (
    <div className="space-y-6">
      {/* Base function selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(baseFunctions) as BaseFunction[]).map((key) => (
          <button
            key={key}
            onClick={() => { setBaseFunc(key); resetTransform(); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
              baseFunc === key
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {baseFunctions[key].label}
          </button>
        ))}
      </div>

      {/* The Graph */}
      <div className="bg-slate-900/70 rounded-xl p-2 overflow-hidden">
        <svg viewBox="0 0 400 300" className="w-full h-auto">
          {/* Grid */}
          <defs>
            <pattern id="tf-grid" width="30" height="25" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#tf-grid)" />

          {/* Axes */}
          <line x1="0" y1="150" x2="400" y2="150" stroke="#475569" strokeWidth="1.5" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#475569" strokeWidth="1.5" />

          {/* Axis labels */}
          <text x="385" y="145" fill="#64748b" fontSize="12">x</text>
          <text x="205" y="15" fill="#64748b" fontSize="12">y</text>

          {/* Original function (ghost) */}
          {showOriginal && (
            <path
              d={pathFromPoints(originalPoints)}
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          )}

          {/* Transformed function */}
          <motion.path
            d={pathFromPoints(points)}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinecap="round"
            initial={false}
            animate={{ d: pathFromPoints(points) }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </svg>
      </div>

      {/* Live notation */}
      <div className="bg-slate-800/70 rounded-lg p-4 text-center">
        <div className="text-slate-400 text-sm mb-1">Current function:</div>
        <div className="text-2xl font-mono text-cyan-400">
          f(x) = {buildNotation()}
        </div>
        <div className="text-sm text-slate-500 mt-2">
          {getTransformDescription()}
        </div>
      </div>

      {/* Transform controls */}
      <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-slate-300 font-medium flex items-center gap-2">
            <Layers size={18} />
            Transform Controls
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs ${
                showOriginal ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              <Eye size={14} />
              Original
            </button>
            <button
              onClick={resetTransform}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Horizontal shift */}
          <div>
            <label className="text-sm text-slate-400 flex justify-between mb-1">
              <span>Horizontal shift</span>
              <span className="text-cyan-400 font-mono">{transform.hShift > 0 ? '+' : ''}{transform.hShift}</span>
            </label>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.5"
              value={transform.hShift}
              onChange={(e) => setTransform(t => ({ ...t, hShift: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              {transform.hShift > 0 ? '→ Right (subtract from x)' : transform.hShift < 0 ? '← Left (add to x)' : 'No shift'}
            </p>
          </div>

          {/* Vertical shift */}
          <div>
            <label className="text-sm text-slate-400 flex justify-between mb-1">
              <span>Vertical shift</span>
              <span className="text-cyan-400 font-mono">{transform.vShift > 0 ? '+' : ''}{transform.vShift}</span>
            </label>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.5"
              value={transform.vShift}
              onChange={(e) => setTransform(t => ({ ...t, vShift: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              {transform.vShift > 0 ? '↑ Up (add to output)' : transform.vShift < 0 ? '↓ Down (subtract from output)' : 'No shift'}
            </p>
          </div>

          {/* Horizontal scale */}
          <div>
            <label className="text-sm text-slate-400 flex justify-between mb-1">
              <span>Horizontal stretch</span>
              <span className="text-cyan-400 font-mono">×{transform.hScale}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={transform.hScale}
              onChange={(e) => setTransform(t => ({ ...t, hScale: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              {transform.hScale > 1 ? 'Wider (divide x)' : transform.hScale < 1 ? 'Narrower (multiply x)' : 'No stretch'}
            </p>
          </div>

          {/* Vertical scale */}
          <div>
            <label className="text-sm text-slate-400 flex justify-between mb-1">
              <span>Vertical stretch</span>
              <span className="text-cyan-400 font-mono">×{transform.vScale}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={transform.vScale}
              onChange={(e) => setTransform(t => ({ ...t, vScale: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              {transform.vScale > 1 ? 'Taller (multiply output)' : transform.vScale < 1 ? 'Shorter (divide output)' : 'No stretch'}
            </p>
          </div>
        </div>

        {/* Reflect toggle */}
        <div className="pt-2">
          <button
            onClick={() => setTransform(t => ({ ...t, reflect: !t.reflect }))}
            className={`w-full py-3 rounded-lg font-medium transition-all min-h-[44px] ${
              transform.reflect
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {transform.reflect ? '↕ Reflected (multiply by -1)' : 'Reflect over x-axis'}
          </button>
        </div>
      </div>

      {/* Key insight */}
      <div className="p-4 bg-cyan-500/10 border-l-4 border-cyan-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-cyan-400">The Pattern:</strong> Changes <em>inside</em> the function
          (to x) affect the <em>opposite</em> direction horizontally. Changes <em>outside</em> (to the output)
          go the expected direction vertically. This "backwards" behavior trips up many learners —
          but now you've <em>seen</em> it.
        </p>
      </div>
    </div>
  );
}
