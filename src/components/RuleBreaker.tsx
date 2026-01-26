import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Rule Breaker: What if (-1) × (-1) = -1?
 *
 * This component lets the user TRY to break the rule.
 * They'll see that if we make (-1)×(-1) = -1, the distributive
 * property collapses. Math falls apart.
 *
 * The insight: This rule isn't arbitrary. It's the ONLY choice
 * that keeps everything consistent.
 */
export default function RuleBreaker() {
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);

  const handleChoice = (choice: number) => {
    setUserChoice(choice);
    setTimeout(() => setShowConsequence(true), 500);
  };

  const reset = () => {
    setUserChoice(null);
    setShowConsequence(false);
  };

  return (
    <div className="space-y-6">
      {/* The Setup */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <p className="text-slate-300 mb-3">
          We all learn that <span className="text-cyan-400 font-mono">(−1) × (−1) = +1</span>.
          But why? What if we just... decided differently?
        </p>
        <p className="text-slate-400 text-sm">
          Let's test what happens if we change this rule.
        </p>
      </div>

      {/* The Choice */}
      {userChoice === null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h3 className="text-xl text-slate-200">
            What should <span className="font-mono text-yellow-400">(−1) × (−1)</span> equal?
          </h3>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleChoice(1)}
              className="px-8 py-4 bg-green-600/20 border-2 border-green-500 rounded-xl hover:bg-green-600/30 transition-all group"
            >
              <span className="text-3xl font-mono text-green-400 group-hover:scale-110 block transition-transform">
                +1
              </span>
              <span className="text-sm text-slate-400">(the standard rule)</span>
            </button>

            <button
              onClick={() => handleChoice(-1)}
              className="px-8 py-4 bg-red-600/20 border-2 border-red-500 rounded-xl hover:bg-red-600/30 transition-all group"
            >
              <span className="text-3xl font-mono text-red-400 group-hover:scale-110 block transition-transform">
                −1
              </span>
              <span className="text-sm text-slate-400">(let's try this!)</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* The Consequence */}
      <AnimatePresence>
        {showConsequence && userChoice === -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* The Test */}
            <div className="p-6 bg-slate-800/70 rounded-xl space-y-4">
              <h4 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" size={20} />
                Let's test the distributive property
              </h4>

              <p className="text-slate-300">
                The distributive law says: <span className="font-mono text-cyan-400">a × (b + c) = a×b + a×c</span>
              </p>

              <p className="text-slate-300">
                Let's try <span className="font-mono text-yellow-400">(-1) × (1 + (-1))</span>
              </p>
            </div>

            {/* Method 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 bg-blue-900/20 border border-blue-500/30 rounded-xl"
            >
              <h5 className="text-blue-400 font-semibold mb-3">Method 1: Simplify inside first</h5>
              <div className="font-mono text-lg space-y-2">
                <div className="text-slate-300">
                  (-1) × (<span className="text-green-400">1 + (-1)</span>)
                </div>
                <div className="text-slate-300">
                  = (-1) × <span className="text-green-400">0</span>
                </div>
                <div className="text-yellow-400 text-xl">
                  = <span className="bg-yellow-500/20 px-2 rounded">0</span>
                </div>
              </div>
            </motion.div>

            {/* Method 2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-5 bg-purple-900/20 border border-purple-500/30 rounded-xl"
            >
              <h5 className="text-purple-400 font-semibold mb-3">Method 2: Distribute first</h5>
              <div className="font-mono text-lg space-y-2">
                <div className="text-slate-300">
                  (-1)×1 + (-1)×(-1)
                </div>
                <div className="text-slate-300">
                  = <span className="text-red-400">-1</span> + <span className="text-red-400 bg-red-500/20 px-1 rounded">(-1)</span>
                  <span className="text-xs text-slate-500 ml-2">(using YOUR rule)</span>
                </div>
                <div className="text-yellow-400 text-xl">
                  = <span className="bg-red-500/30 px-2 rounded text-red-400">-2</span>
                </div>
              </div>
            </motion.div>

            {/* The Contradiction */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="p-6 bg-gradient-to-br from-red-900/40 to-orange-900/40 border-2 border-red-500/50 rounded-xl text-center"
            >
              <XCircle className="mx-auto text-red-400 mb-3" size={48} />
              <h4 className="text-2xl font-bold text-red-400 mb-2">
                0 ≠ -2
              </h4>
              <p className="text-slate-300 mb-4">
                The same expression gives two different answers.
                <br />
                <span className="text-red-400 font-semibold">The distributive property is broken.</span>
              </p>
              <p className="text-slate-400 text-sm">
                Without distributivity, we can't expand brackets, factor expressions,
                or do basically any algebra. Math collapses.
              </p>
            </motion.div>

            <div className="text-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
              >
                ↺ Try again
              </button>
            </div>
          </motion.div>
        )}

        {showConsequence && userChoice === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Quick verification */}
            <div className="p-6 bg-slate-800/70 rounded-xl space-y-4">
              <h4 className="text-lg font-semibold text-slate-200">
                Let's verify this works with the distributive property
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="font-mono">
                    (-1) × (1 + (-1))<br />
                    = (-1) × 0<br />
                    = <span className="text-yellow-400">0</span>
                  </div>
                </div>
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <div className="font-mono">
                    (-1)×1 + (-1)×(-1)<br />
                    = -1 + <span className="text-green-400">1</span><br />
                    = <span className="text-yellow-400">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-gradient-to-br from-green-900/40 to-cyan-900/40 border-2 border-green-500/50 rounded-xl text-center"
            >
              <CheckCircle className="mx-auto text-green-400 mb-3" size={48} />
              <h4 className="text-2xl font-bold text-green-400 mb-2">
                0 = 0 ✓
              </h4>
              <p className="text-slate-300 mb-4">
                Both methods give the same answer.
                <br />
                <span className="text-green-400 font-semibold">The distributive property holds.</span>
              </p>
            </motion.div>

            {/* The Insight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-5 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-l-4 border-cyan-500 rounded-r-xl"
            >
              <h4 className="text-cyan-400 font-semibold mb-2">The Insight</h4>
              <p className="text-slate-300">
                <strong>(−1) × (−1) = +1</strong> isn't an arbitrary convention.
                It's the <em>only</em> value that keeps the distributive property working.
              </p>
              <p className="text-slate-400 text-sm mt-2">
                The rule was <em>forced</em> by the need for internal consistency.
                This is how math works: rules emerge from the requirement that everything fits together.
              </p>
            </motion.div>

            <div className="text-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
              >
                ↺ Try breaking the rule
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
