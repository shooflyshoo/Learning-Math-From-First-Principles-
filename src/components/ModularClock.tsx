import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ModularClock() {
  const [modulus, setModulus] = useState(12);
  const [startValue, setStartValue] = useState(10);
  const [addValue, setAddValue] = useState(5);
  const [showSteps, setShowSteps] = useState(false);

  const result = ((startValue + addValue) % modulus + modulus) % modulus;

  // Calculate the path for animation
  const steps: number[] = [];
  let current = startValue;
  for (let i = 0; i <= Math.abs(addValue); i++) {
    steps.push(current % modulus);
    current = addValue >= 0 ? current + 1 : current - 1;
  }

  const getPosition = (value: number) => {
    const angle = (value / modulus) * 2 * Math.PI - Math.PI / 2;
    const radius = 120;
    return {
      x: 150 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle),
    };
  };

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Modular Arithmetic (Clock Math)
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-slate-300">
          In mod {modulus}, numbers wrap around: after {modulus - 1} comes 0 again.
          <span className="text-purple-400"> Just like a clock!</span>
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <label className="block text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
            Mod: <span className="text-purple-400 font-mono">{modulus}</span>
          </label>
          <input
            type="range"
            min={5}
            max={24}
            value={modulus}
            onChange={(e) => setModulus(parseInt(e.target.value))}
            className="w-full h-8"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
            Start: <span className="text-blue-400 font-mono">{startValue}</span>
          </label>
          <input
            type="range"
            min={0}
            max={modulus - 1}
            value={startValue % modulus}
            onChange={(e) => setStartValue(parseInt(e.target.value))}
            className="w-full h-8"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
            Add: <span className="text-green-400 font-mono">{addValue >= 0 ? '+' : ''}{addValue}</span>
          </label>
          <input
            type="range"
            min={-12}
            max={20}
            value={addValue}
            onChange={(e) => setAddValue(parseInt(e.target.value))}
            className="w-full h-8"
          />
        </div>
      </div>

      {/* Result - shown prominently BEFORE visualization on mobile */}
      <motion.div
        className="bg-slate-700/30 rounded-lg p-3 sm:p-4 mb-4 text-center"
        key={`${startValue}-${addValue}-${modulus}`}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-xl sm:text-2xl font-mono mb-1">
          <span className="text-blue-400">{startValue}</span>
          <span className="text-slate-400"> + </span>
          <span className="text-green-400">{addValue}</span>
          <span className="text-slate-400"> ≡ </span>
          <span className="text-purple-400 font-bold">{result}</span>
          <span className="text-slate-500 text-sm sm:text-base"> (mod {modulus})</span>
        </div>
        {addValue !== 0 && Math.abs(startValue + addValue) >= modulus && (
          <div className="text-purple-300 text-xs sm:text-sm">
            Wrapped {Math.floor(Math.abs(startValue + addValue) / modulus)}×
          </div>
        )}
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-center">
        {/* Clock face */}
        <div className="relative w-full max-w-[240px] md:max-w-[288px]">
          <svg viewBox="0 0 300 300" className="w-full h-auto">
            {/* Clock face background */}
            <circle cx="150" cy="150" r="140" fill="#1e293b" stroke="#475569" strokeWidth="3" />

            {/* Tick marks and numbers */}
            {Array.from({ length: modulus }).map((_, i) => {
              const angle = (i / modulus) * 2 * Math.PI - Math.PI / 2;
              const innerRadius = 105;

              return (
                <g key={i}>
                  {/* Tick */}
                  <line
                    x1={150 + 125 * Math.cos(angle)}
                    y1={150 + 125 * Math.sin(angle)}
                    x2={150 + 135 * Math.cos(angle)}
                    y2={150 + 135 * Math.sin(angle)}
                    stroke={i === 0 ? '#eab308' : '#64748b'}
                    strokeWidth={i === 0 ? 3 : 2}
                  />
                  {/* Number */}
                  <text
                    x={150 + innerRadius * Math.cos(angle)}
                    y={150 + innerRadius * Math.sin(angle) + 5}
                    fill={i === 0 ? '#eab308' : '#94a3b8'}
                    fontSize="14"
                    fontWeight={i === 0 ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Path line showing movement */}
            {showSteps && (
              <motion.path
                d={steps.slice(0, -1).map((step, idx) => {
                  const from = getPosition(step);
                  const to = getPosition(steps[idx + 1]);
                  return idx === 0
                    ? `M ${from.x} ${from.y} L ${to.x} ${to.y}`
                    : `L ${to.x} ${to.y}`;
                }).join(' ')}
                stroke="#a855f7"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: Math.abs(addValue) * 0.2 }}
              />
            )}

            {/* Start position */}
            <motion.circle
              cx={getPosition(startValue % modulus).x}
              cy={getPosition(startValue % modulus).y}
              r="10"
              fill="#3b82f6"
              initial={false}
            />

            {/* Result position */}
            <motion.circle
              cx={getPosition(result).x}
              cy={getPosition(result).y}
              r="12"
              fill="#22c55e"
              initial={false}
              animate={{
                cx: getPosition(result).x,
                cy: getPosition(result).y,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))' }}
            />

            {/* Hand/arrow from center to result */}
            <motion.line
              x1="150"
              y1="150"
              x2={getPosition(result).x}
              y2={getPosition(result).y}
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              initial={false}
              animate={{
                x2: getPosition(result).x,
                y2: getPosition(result).y,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            />

            {/* Center */}
            <circle cx="150" cy="150" r="6" fill="#475569" />
          </svg>
        </div>

        {/* Controls for visualization */}
        <div className="text-center">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className={`px-4 py-3 rounded-lg transition-all min-h-[44px] text-sm ${
              showSteps
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {showSteps ? 'Hide Path' : 'Show Path'}
          </button>
        </div>
      </div>

      {/* Quick presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
        <button
          onClick={() => { setModulus(12); setStartValue(10); setAddValue(5); }}
          className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm"
        >
          <div className="text-slate-200">Clock: 10 + 5</div>
          <div className="text-slate-500 text-xs">= 3 (mod 12)</div>
        </button>
        <button
          onClick={() => { setModulus(7); setStartValue(5); setAddValue(4); }}
          className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm"
        >
          <div className="text-slate-200">Week: Fri + 4</div>
          <div className="text-slate-500 text-xs">= 2 (Tue)</div>
        </button>
        <button
          onClick={() => { setModulus(10); setStartValue(7); setAddValue(8); }}
          className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm"
        >
          <div className="text-slate-200">Last digit</div>
          <div className="text-slate-500 text-xs">7 + 8 ends in 5</div>
        </button>
        <button
          onClick={() => { setModulus(24); setStartValue(22); setAddValue(5); }}
          className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm"
        >
          <div className="text-slate-200">24h: 22:00 + 5h</div>
          <div className="text-slate-500 text-xs">= 03:00</div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Real-World Uses:</strong> Cryptography (RSA encryption),
          error checking (ISBN, credit cards), hash functions, and scheduling cycles all use modular
          arithmetic. It's the math of things that repeat.
        </p>
      </div>
    </div>
  );
}
