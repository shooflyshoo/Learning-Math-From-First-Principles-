import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * The Wall Experience
 *
 * This component makes the user FEEL why natural numbers aren't enough.
 * You have 3 apples. Try to remove 5. Experience the wall.
 * Then understand why we needed to invent integers.
 */
export default function WallExperience() {
  const [apples, setApples] = useState(3);
  const [removed, setRemoved] = useState(0);
  const [hitWall, setHitWall] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const targetRemoval = 5;

  const handleRemove = () => {
    if (apples > 0) {
      setApples(a => a - 1);
      setRemoved(r => r + 1);
    } else {
      // They're trying to remove when there's nothing left
      setAttempts(a => a + 1);
      if (attempts >= 2) {
        setHitWall(true);
      }
    }
  };

  const reset = () => {
    setApples(3);
    setRemoved(0);
    setHitWall(false);
    setShowSolution(false);
    setAttempts(0);
  };

  const remaining = targetRemoval - removed;

  return (
    <div className="space-y-6">
      {/* The Challenge */}
      <div className="text-center p-4 bg-slate-800/50 rounded-lg">
        <p className="text-lg text-slate-200">
          You have <span className="text-green-400 font-bold text-2xl">{3}</span> apples.
        </p>
        <p className="text-slate-300 mt-2">
          Task: Remove <span className="text-red-400 font-bold">{targetRemoval}</span> apples.
        </p>
      </div>

      {/* Apple Display */}
      <div className="flex justify-center items-center min-h-24 gap-3 p-6 bg-slate-900/50 rounded-xl">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: apples }).map((_, i) => (
            <motion.div
              key={`apple-${i}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-5xl"
            >
              🍎
            </motion.div>
          ))}
        </AnimatePresence>

        {apples === 0 && !hitWall && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 italic"
          >
            Nothing here...
          </motion.p>
        )}
      </div>

      {/* Progress & Action */}
      {!hitWall && !showSolution && (
        <div className="text-center space-y-4">
          <p className="text-slate-400">
            Removed: <span className="text-yellow-400 font-mono">{removed}</span> / {targetRemoval}
            {remaining > 0 && apples === 0 && (
              <span className="text-red-400 ml-2">
                (Still need to remove {remaining} more...)
              </span>
            )}
          </p>

          <button
            onClick={handleRemove}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              apples > 0
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-900/50 text-red-300 border-2 border-red-500/50 animate-pulse'
            }`}
          >
            {apples > 0 ? (
              <>Remove Apple (-1)</>
            ) : (
              <>Remove... but from where? 🤔</>
            )}
          </button>

          {apples === 0 && attempts > 0 && attempts < 3 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-orange-400 text-sm"
            >
              {attempts === 1 && "There's nothing left to remove..."}
              {attempts === 2 && "Seriously, you can't remove what doesn't exist!"}
            </motion.p>
          )}
        </div>
      )}

      {/* The Wall */}
      <AnimatePresence>
        {hitWall && !showSolution && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-xl text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl"
            >
              🧱
            </motion.div>

            <h3 className="text-2xl font-bold text-red-400">You've Hit The Wall</h3>

            <p className="text-slate-300 max-w-md mx-auto">
              In the world of counting numbers (ℕ), <strong>3 − 5</strong> has no answer.
              You can't have negative apples. The operation simply... doesn't work here.
            </p>

            <p className="text-slate-400 text-sm italic">
              This isn't a limitation of your understanding. It's a limitation of the system itself.
            </p>

            <button
              onClick={() => setShowSolution(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold mt-4"
            >
              So what do we do? →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Solution */}
      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-xl text-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="text-6xl"
              >
                🔓
              </motion.div>

              <h3 className="text-2xl font-bold text-green-400">Unlock: The Integers (ℤ)</h3>

              <p className="text-slate-300 max-w-md mx-auto">
                We <em>extend</em> our number system. For every positive number, we invent its opposite.
                Now <strong>3 − 5 = −2</strong> has meaning.
              </p>

              <div className="flex justify-center items-center gap-4 py-4">
                <div className="text-center">
                  <div className="text-4xl">🍎🍎🍎</div>
                  <div className="text-green-400 font-mono">+3</div>
                </div>
                <div className="text-3xl text-slate-500">→</div>
                <div className="text-center">
                  <div className="text-4xl opacity-50">🍎🍎🍎🍎🍎</div>
                  <div className="text-red-400 font-mono">−5</div>
                </div>
                <div className="text-3xl text-slate-500">→</div>
                <div className="text-center">
                  <div className="text-4xl">📝</div>
                  <div className="text-yellow-400 font-mono">−2</div>
                  <div className="text-xs text-slate-500">(you owe 2)</div>
                </div>
              </div>

              <p className="text-cyan-400 text-sm">
                <strong>The pattern:</strong> Hit a wall → Extend the system → Gain new powers
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
              >
                ↺ Experience it again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
