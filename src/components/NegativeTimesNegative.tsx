import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NegativeTimesNegative() {
  const [flips, setFlips] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlips((f) => f + 1);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleReset = () => {
    setFlips(0);
  };

  // Current direction based on number of flips
  const currentValue = flips % 2 === 0 ? 3 : -3;
  const facingRight = flips % 2 === 0;

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Negative × Negative = Positive (The Double Flip)
      </h3>

      <div className="text-center mb-4 sm:mb-8">
        <p className="text-slate-300 text-sm sm:text-base mb-4">
          Multiplying by <span className="text-red-400 font-mono">-1</span> flips the number line.
          <span className="hidden sm:inline"> Two flips bring you back to where you started.</span>
        </p>
      </div>

      {/* Visual representation */}
      <div className="relative h-48 mb-8 overflow-hidden">
        {/* Number line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-600 rounded-full" />

        {/* Ticks - show every 3 labels on mobile to prevent overlap */}
        {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((num) => {
          const showLabel = num === 0 || num % 3 === 0;
          return (
            <div
              key={num}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${((num + 6) / 12) * 100}%` }}
            >
              <div className={`w-0.5 -ml-px ${num === 0 ? 'h-6 -mt-3 bg-yellow-500' : 'h-3 -mt-1.5 bg-slate-500'}`} />
              {showLabel && (
                <div className={`text-xs mt-4 -ml-2 ${num === 0 ? 'text-yellow-500 font-bold' : 'text-slate-500'}`}>
                  {num}
                </div>
              )}
            </div>
          );
        })}

        {/* The flipping arrow/character */}
        <motion.div
          className="absolute top-1/2"
          animate={{
            left: `${((currentValue + 6) / 12) * 100}%`,
            scaleX: facingRight ? 1 : -1,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          style={{ translateY: '-50%', translateX: '-50%' }}
        >
          {/* Character */}
          <div className="relative">
            <motion.div
              className="text-4xl"
              animate={{ rotateY: flips * 180 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              🏃
            </motion.div>
            {/* Direction arrow */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl"
              animate={{ scaleX: facingRight ? 1 : -1 }}
            >
              {facingRight ? '→' : '←'}
            </motion.div>
          </div>
        </motion.div>

        {/* Position indicator */}
        <motion.div
          className="absolute bottom-4 text-center"
          style={{ left: '50%', translateX: '-50%' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentValue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl font-mono"
            >
              Position: <span className={currentValue >= 0 ? 'text-green-400' : 'text-red-400'}>
                {currentValue > 0 ? '+' : ''}{currentValue}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={handleFlip}
          disabled={isAnimating}
          className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base min-h-[44px] ${
            isAnimating
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          × -1 (Flip!)
        </button>
        <button
          onClick={handleReset}
          className="px-4 sm:px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-all text-sm sm:text-base min-h-[44px]"
        >
          Reset
        </button>
      </div>

      {/* Flip counter and equation */}
      <div className="bg-slate-700/30 rounded-lg p-4 sm:p-6 text-center">
        <div className="text-sm sm:text-lg text-slate-400 mb-3 sm:mb-4">
          Flips: <span className="text-purple-400 font-mono">{flips}</span>
        </div>

        <div className="text-lg sm:text-2xl font-mono mb-3 sm:mb-4">
          {flips === 0 && (
            <span className="text-green-400">3</span>
          )}
          {flips === 1 && (
            <>
              <span className="text-red-400">(-1)</span>
              <span className="text-slate-400"> × </span>
              <span className="text-green-400">3</span>
              <span className="text-slate-400"> = </span>
              <span className="text-red-400">-3</span>
            </>
          )}
          {flips === 2 && (
            <>
              <span className="text-red-400">(-1)</span>
              <span className="text-slate-400"> × </span>
              <span className="text-red-400">(-1)</span>
              <span className="text-slate-400"> × </span>
              <span className="text-green-400">3</span>
              <span className="text-slate-400"> = </span>
              <span className="text-green-400">+3</span>
            </>
          )}
          {flips === 3 && (
            <>
              <span className="text-red-400">(-1)³</span>
              <span className="text-slate-400"> × </span>
              <span className="text-green-400">3</span>
              <span className="text-slate-400"> = </span>
              <span className="text-red-400">-3</span>
            </>
          )}
          {flips >= 4 && (
            <>
              <span className="text-red-400">(-1)^{flips}</span>
              <span className="text-slate-400"> × </span>
              <span className="text-green-400">3</span>
              <span className="text-slate-400"> = </span>
              <span className={currentValue >= 0 ? 'text-green-400' : 'text-red-400'}>
                {currentValue > 0 ? '+' : ''}{currentValue}
              </span>
            </>
          )}
        </div>

        <div className="text-slate-400 text-xs sm:text-base">
          {flips === 0 && "Start at +3, facing right"}
          {flips === 1 && "One flip → -3"}
          {flips === 2 && "Two flips → back to +3!"}
          {flips >= 3 && (
            <>
              {flips % 2 === 0
                ? "Even flips → positive!"
                : "Odd flips → negative"}
            </>
          )}
        </div>
      </div>

      {/* The mathematical reason */}
      <div className="mt-6 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg">
        <h4 className="text-blue-400 font-semibold mb-2">Why This MUST Be True</h4>
        <p className="text-sm text-slate-300 mb-2">
          It's not a choice—it's forced by the distributive law:
        </p>
        <div className="font-mono text-sm bg-slate-800/50 p-3 rounded">
          <div className="text-slate-400">(-1) × (1 + (-1)) = (-1) × 0 = 0</div>
          <div className="text-slate-400">Distribute: (-1)×1 + (-1)×(-1) = 0</div>
          <div className="text-slate-400">Which means: -1 + (-1)×(-1) = 0</div>
          <div className="text-green-400">Therefore: (-1)×(-1) = 1 ✓</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Pattern:</strong> Negative isn't "less than"—it's
          "opposite direction." Two opposites cancel out. This is why (-3) × (-2) = +6:
          flip once for the first negative, flip again for the second, back to positive.
        </p>
      </div>
    </div>
  );
}
