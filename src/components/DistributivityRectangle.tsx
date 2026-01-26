import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DistributivityRectangle() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [c, setC] = useState(4);
  const [isSplit, setIsSplit] = useState(false);

  const totalArea = a * (b + c);
  const area1 = a * b;
  const area2 = a * c;

  const maxWidth = 300;
  const maxHeight = 200;
  const scale = Math.min(maxWidth / (b + c), maxHeight / a, 30);

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Distributivity: The Rectangle Split
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-center">
        <div className="text-2xl font-mono">
          <span className="text-blue-400">a</span>
          <span className="text-slate-400">(</span>
          <span className="text-green-400">b</span>
          <span className="text-slate-400"> + </span>
          <span className="text-purple-400">c</span>
          <span className="text-slate-400">) = </span>
          <span className="text-blue-400">a</span>
          <span className="text-green-400">b</span>
          <span className="text-slate-400"> + </span>
          <span className="text-blue-400">a</span>
          <span className="text-purple-400">c</span>
        </div>
        <p className="text-slate-400 mt-2 text-sm">
          Scaling a combined thing = scaling each part and recombining
        </p>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            a (width): <span className="text-blue-400 font-mono">{a}</span>
          </label>
          <input
            type="range"
            min={1}
            max={6}
            value={a}
            onChange={(e) => setA(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            b (height 1): <span className="text-green-400 font-mono">{b}</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={b}
            onChange={(e) => setB(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            c (height 2): <span className="text-purple-400 font-mono">{c}</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={c}
            onChange={(e) => setC(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Rectangle visualization */}
      <div className="flex justify-center mb-8">
        <div className="relative" style={{ height: maxHeight + 60 }}>
          <motion.div
            className="relative"
            animate={{
              gap: isSplit ? '20px' : '0px',
            }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Top rectangle (b portion) */}
            <motion.div
              className="bg-green-500/30 border-2 border-green-500 relative"
              style={{
                width: a * scale,
                height: b * scale,
              }}
              animate={{
                y: isSplit ? -10 : 0,
              }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-green-400 font-mono text-lg">
                {area1}
              </span>
              {/* b label */}
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-green-400 font-mono">
                b={b}
              </span>
            </motion.div>

            {/* Dividing line */}
            <motion.div
              className="bg-yellow-500"
              style={{
                width: a * scale,
                height: 2,
              }}
              animate={{
                opacity: isSplit ? 0 : 1,
              }}
            />

            {/* Bottom rectangle (c portion) */}
            <motion.div
              className="bg-purple-500/30 border-2 border-purple-500 relative"
              style={{
                width: a * scale,
                height: c * scale,
              }}
              animate={{
                y: isSplit ? 10 : 0,
              }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-purple-400 font-mono text-lg">
                {area2}
              </span>
              {/* c label */}
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-purple-400 font-mono">
                c={c}
              </span>
            </motion.div>

            {/* Width label */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-blue-400 font-mono">
              a={a}
            </span>

            {/* Total height label */}
            <motion.span
              className="absolute -left-12 top-1/2 -translate-y-1/2 text-yellow-400 font-mono whitespace-nowrap"
              animate={{ opacity: isSplit ? 0 : 1 }}
            >
              b+c={b + c}
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Split/Combine button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setIsSplit(!isSplit)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            isSplit
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSplit ? 'Combine' : 'Split'}
        </button>
      </div>

      {/* Area calculations */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <motion.div
          className={`p-4 rounded-lg border-2 transition-all ${
            !isSplit ? 'bg-yellow-500/20 border-yellow-500' : 'bg-slate-700/30 border-slate-600'
          }`}
        >
          <h4 className="font-semibold text-yellow-400 mb-2">Combined View</h4>
          <div className="font-mono text-xl">
            <span className="text-blue-400">{a}</span>
            <span className="text-slate-400"> × (</span>
            <span className="text-green-400">{b}</span>
            <span className="text-slate-400"> + </span>
            <span className="text-purple-400">{c}</span>
            <span className="text-slate-400">) = </span>
            <span className="text-blue-400">{a}</span>
            <span className="text-slate-400"> × </span>
            <span className="text-yellow-400">{b + c}</span>
            <span className="text-slate-400"> = </span>
            <span className="text-yellow-400">{totalArea}</span>
          </div>
        </motion.div>

        <motion.div
          className={`p-4 rounded-lg border-2 transition-all ${
            isSplit ? 'bg-green-500/20 border-green-500' : 'bg-slate-700/30 border-slate-600'
          }`}
        >
          <h4 className="font-semibold text-green-400 mb-2">Split View</h4>
          <div className="font-mono text-xl">
            <span className="text-blue-400">{a}</span>
            <span className="text-slate-400">×</span>
            <span className="text-green-400">{b}</span>
            <span className="text-slate-400"> + </span>
            <span className="text-blue-400">{a}</span>
            <span className="text-slate-400">×</span>
            <span className="text-purple-400">{c}</span>
            <span className="text-slate-400"> = </span>
            <span className="text-green-400">{area1}</span>
            <span className="text-slate-400"> + </span>
            <span className="text-purple-400">{area2}</span>
            <span className="text-slate-400"> = </span>
            <span className="text-yellow-400">{area1 + area2}</span>
          </div>
        </motion.div>
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Why This Matters:</strong> Distributivity is the
          "interoperability contract" between addition and multiplication. It's what makes algebra
          possible—expanding, factoring, simplifying. Without it, you couldn't go from 3(x + 2) to
          3x + 6.
        </p>
      </div>
    </div>
  );
}
