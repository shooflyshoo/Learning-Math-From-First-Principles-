import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThreeFacesOfDivision() {
  const [dividend, setDividend] = useState(12);
  const [divisor, setDivisor] = useState(3);
  const [activePanel, setActivePanel] = useState<number | null>(null);

  const result = divisor !== 0 ? dividend / divisor : 0;
  const isWhole = Number.isInteger(result);

  const CookieIcon = () => (
    <div className="w-6 h-6 rounded-full bg-amber-600 border-2 border-amber-700 flex items-center justify-center text-xs">
      🍪
    </div>
  );

  const PersonIcon = ({ index }: { index: number }) => (
    <div className="flex flex-col items-center">
      <div className="text-2xl">👤</div>
      <div className="text-xs text-slate-400">#{index + 1}</div>
    </div>
  );

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        The Three Faces of Division (Same Equation, Different Stories)
      </h3>

      {/* Input controls */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <label className="block text-xs sm:text-sm text-slate-400 mb-2">
            Total: <span className="text-blue-400 font-mono">{dividend}</span>
          </label>
          <input
            type="range"
            min={1}
            max={24}
            value={dividend}
            onChange={(e) => setDividend(parseInt(e.target.value))}
            className="w-full h-8"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-slate-400 mb-2">
            Divisor: <span className="text-purple-400 font-mono">{divisor}</span>
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={divisor}
            onChange={(e) => setDivisor(parseInt(e.target.value))}
            className="w-full h-8"
          />
        </div>
      </div>

      {/* Central equation */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-2xl sm:text-3xl font-mono">
          <span className="text-blue-400">{dividend}</span>
          <span className="text-slate-400"> ÷ </span>
          <span className="text-purple-400">{divisor}</span>
          <span className="text-slate-400"> = </span>
          <span className={isWhole ? 'text-green-400' : 'text-yellow-400'}>
            {isWhole ? result : result.toFixed(2)}
          </span>
        </div>
        {!isWhole && (
          <p className="text-yellow-400/70 text-xs sm:text-sm mt-2">
            (Not whole - see how each interpretation handles this)
          </p>
        )}
      </div>

      {/* Three panels - stack on mobile */}
      <p className="text-xs text-slate-500 mb-2 sm:hidden">👆 Tap a panel to see it in action</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Panel 1: Partitive (Sharing) */}
        <motion.div
          className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all min-h-[80px] ${
            activePanel === 0
              ? 'bg-blue-500/20 border-2 border-blue-500'
              : 'bg-slate-700/30 border-2 border-transparent hover:border-slate-600'
          }`}
          onClick={() => setActivePanel(activePanel === 0 ? null : 0)}
          layout
        >
          <h4 className="text-blue-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">1. Sharing</h4>
          <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
            "{dividend} cookies ÷ {divisor} kids"
          </p>

          <AnimatePresence>
            {activePanel === 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Visual: Kids with cookies */}
                <div className="flex flex-wrap gap-4 justify-center mb-4">
                  {Array.from({ length: Math.min(divisor, 6) }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <PersonIcon index={i} />
                      <div className="flex flex-wrap gap-1 mt-2 max-w-16 justify-center">
                        {Array.from({ length: Math.floor(result) }).map((_, j) => (
                          <motion.div
                            key={j}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: j * 0.1 }}
                          >
                            <CookieIcon />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {divisor > 6 && (
                    <div className="text-slate-400 text-sm">+{divisor - 6} more</div>
                  )}
                </div>

                <div className="text-center text-green-400 font-mono">
                  {isWhole ? (
                    <>{result} cookies per kid</>
                  ) : (
                    <>{Math.floor(result)} cookies each + {dividend % divisor} leftover</>
                  )}
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Known: {divisor} groups. Finding: size of each group.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Panel 2: Measurement (Grouping) */}
        <motion.div
          className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all min-h-[80px] ${
            activePanel === 1
              ? 'bg-green-500/20 border-2 border-green-500'
              : 'bg-slate-700/30 border-2 border-transparent hover:border-slate-600'
          }`}
          onClick={() => setActivePanel(activePanel === 1 ? null : 1)}
          layout
        >
          <h4 className="text-green-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">2. Grouping</h4>
          <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
            "{dividend} cookies in groups of {divisor}"
          </p>

          <AnimatePresence>
            {activePanel === 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Visual: Groups of cookies */}
                <div className="flex flex-wrap gap-3 justify-center mb-4">
                  {Array.from({ length: Math.min(Math.floor(result), 8) }).map((_, groupIdx) => (
                    <motion.div
                      key={groupIdx}
                      className="border-2 border-dashed border-green-500/50 rounded-lg p-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: groupIdx * 0.15 }}
                    >
                      <div className="flex gap-1 flex-wrap max-w-16 justify-center">
                        {Array.from({ length: Math.min(divisor, 4) }).map((_, i) => (
                          <CookieIcon key={i} />
                        ))}
                        {divisor > 4 && <span className="text-xs text-slate-400">+{divisor - 4}</span>}
                      </div>
                    </motion.div>
                  ))}
                  {Math.floor(result) > 8 && (
                    <div className="text-slate-400 text-sm self-center">+{Math.floor(result) - 8} more groups</div>
                  )}
                </div>

                <div className="text-center text-green-400 font-mono">
                  {isWhole ? (
                    <>{result} groups</>
                  ) : (
                    <>{Math.floor(result)} full groups + {dividend % divisor} extra</>
                  )}
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Known: group size ({divisor}). Finding: number of groups.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Panel 3: Rate */}
        <motion.div
          className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all min-h-[80px] ${
            activePanel === 2
              ? 'bg-purple-500/20 border-2 border-purple-500'
              : 'bg-slate-700/30 border-2 border-transparent hover:border-slate-600'
          }`}
          onClick={() => setActivePanel(activePanel === 2 ? null : 2)}
          layout
        >
          <h4 className="text-purple-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">3. Rate</h4>
          <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
            "{dividend} mi in {divisor} hrs"
          </p>

          <AnimatePresence>
            {activePanel === 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Visual: Distance bar divided into time segments */}
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-1">Distance: {dividend} miles</div>
                  <div className="h-6 bg-purple-500/30 rounded-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1 }}
                    />
                    {/* Hour markers */}
                    {Array.from({ length: divisor - 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
                        style={{ left: `${((i + 1) / divisor) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0h</span>
                    {Array.from({ length: Math.min(divisor, 6) }).map((_, i) => (
                      <span key={i}>{i + 1}h</span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-purple-400 font-mono">
                  {result.toFixed(1)} miles per hour
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Division creates a "per" — a rate or ratio.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Key insight */}
      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-slate-100">The Equation Doesn't Care:</strong> All three stories
          solve the same equation: <span className="font-mono text-purple-400">{divisor}</span> × x =
          <span className="font-mono text-blue-400"> {dividend}</span>. Division just asks "what
          number fills the blank?" The story tells you which blank you're filling.
        </p>
      </div>

      <div className="mt-4 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Division Creates "Per":</strong> Notice how the answer
          often becomes a rate: cookies <em>per</em> kid, miles <em>per</em> hour, items <em>per</em> group.
          Division manufactures ratios.
        </p>
      </div>
    </div>
  );
}
