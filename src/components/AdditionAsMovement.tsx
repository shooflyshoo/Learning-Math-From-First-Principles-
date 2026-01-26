import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdditionAsMovement() {
  const [startPos, setStartPos] = useState(5);
  const [moveBy, setMoveBy] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentPos, setCurrentPos] = useState(5);
  const [mode, setMode] = useState<'add' | 'find'>('add');
  const [guess, setGuess] = useState('');
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null);

  const minValue = -10;
  const maxValue = 10;
  const range = maxValue - minValue;

  const getPositionPercent = (value: number) => {
    return ((value - minValue) / range) * 100;
  };

  const result = startPos + moveBy;

  const handleAnimate = () => {
    setShowResult(false);
    setIsAnimating(true);
    setCurrentPos(startPos);

    setTimeout(() => {
      setCurrentPos(result);
      setTimeout(() => {
        setShowResult(true);
        setIsAnimating(false);
      }, 800);
    }, 300);
  };

  const handleCheckGuess = () => {
    const guessNum = parseFloat(guess);
    if (guessNum === moveBy) {
      setGuessResult('correct');
    } else {
      setGuessResult('incorrect');
    }
  };

  const resetFindMode = () => {
    const newMove = Math.floor(Math.random() * 11) - 5;
    const newStart = Math.floor(Math.random() * 11) - 5;
    setStartPos(newStart);
    setMoveBy(newMove);
    setGuess('');
    setGuessResult(null);
    setCurrentPos(newStart + newMove);
    setShowResult(false);
  };

  useEffect(() => {
    setShowResult(false);
    setCurrentPos(startPos);
  }, [startPos, moveBy]);

  return (
    <div className="interactive-container">
      {/* Mobile-friendly header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-400">
          Addition as Movement
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('add'); setGuessResult(null); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              mode === 'add'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Add Mode
          </button>
          <button
            onClick={() => { setMode('find'); resetFindMode(); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              mode === 'find'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Find Move
          </button>
        </div>
      </div>

      {mode === 'add' ? (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Start at:</label>
            <input
              type="range"
              min={minValue}
              max={maxValue}
              value={startPos}
              onChange={(e) => setStartPos(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-2xl font-mono text-blue-400 mt-2">{startPos}</div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Move by: <span className={moveBy >= 0 ? 'text-green-400' : 'text-red-400'}>
                {moveBy >= 0 ? '(right →)' : '(← left)'}
              </span>
            </label>
            <input
              type="range"
              min={-10}
              max={10}
              value={moveBy}
              onChange={(e) => setMoveBy(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-2xl font-mono text-purple-400 mt-2">
              {moveBy >= 0 ? `+${moveBy}` : moveBy}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-slate-300 mb-4 text-sm sm:text-base">
            The dot moved from <span className="text-blue-400 font-mono">{startPos}</span> to{' '}
            <span className="text-green-400 font-mono">{startPos + moveBy}</span>.
            What was the move?
          </p>
          {/* Mobile-friendly stacked layout */}
          <div className="space-y-3">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter move amount"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCheckGuess}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                Check
              </button>
              <button
                onClick={resetFindMode}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm"
              >
                New Problem
              </button>
            </div>
          </div>
          <AnimatePresence>
            {guessResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  guessResult === 'correct'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {guessResult === 'correct'
                  ? `Correct! The move was ${moveBy >= 0 ? '+' : ''}${moveBy}`
                  : `Not quite. Try again! Hint: ${startPos + moveBy} - ${startPos} = ?`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Number Line */}
      <div className="relative py-12 px-4">
        {/* Main line */}
        <div className="absolute left-4 right-4 top-1/2 h-1 bg-slate-600 rounded-full" />

        {/* Ticks and labels */}
        {Array.from({ length: 21 }, (_, i) => i - 10).map((num) => (
          <div
            key={num}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${getPositionPercent(num)}% + 16px - ${getPositionPercent(num) * 0.32}px)` }}
          >
            <div className={`w-0.5 h-4 -mt-2 ${num === 0 ? 'bg-yellow-500 h-6 -mt-3' : 'bg-slate-500'}`} />
            <div className={`text-xs mt-3 -ml-2 ${num === 0 ? 'text-yellow-500 font-bold' : 'text-slate-500'}`}>
              {num}
            </div>
          </div>
        ))}

        {/* Arrow showing movement */}
        <AnimatePresence>
          {isAnimating && moveBy !== 0 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 -translate-y-1/2 h-2"
              style={{
                left: moveBy > 0
                  ? `calc(${getPositionPercent(startPos)}% + 16px - ${getPositionPercent(startPos) * 0.32}px)`
                  : `calc(${getPositionPercent(result)}% + 16px - ${getPositionPercent(result) * 0.32}px)`,
                width: `${Math.abs(moveBy) * (100 / range)}%`,
                transformOrigin: moveBy > 0 ? 'left' : 'right',
              }}
            >
              <div className={`h-1 ${moveBy > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full relative`}>
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-0 h-0
                    border-t-[6px] border-t-transparent
                    border-b-[6px] border-b-transparent
                    ${moveBy > 0
                      ? 'right-0 border-l-[8px] border-l-green-500'
                      : 'left-0 border-r-[8px] border-r-red-500'
                    }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start position marker */}
        {mode === 'add' && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-500 border-2 border-slate-400"
            style={{
              left: `calc(${getPositionPercent(startPos)}% + 16px - ${getPositionPercent(startPos) * 0.32}px - 8px)`
            }}
          />
        )}

        {/* Moving dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 shadow-lg z-10"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
          }}
          animate={{
            left: `calc(${getPositionPercent(currentPos)}% + 16px - ${getPositionPercent(currentPos) * 0.32}px - 12px)`,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />
      </div>

      {/* Controls and Result */}
      {mode === 'add' && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <button
            onClick={handleAnimate}
            disabled={isAnimating}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isAnimating
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnimating ? 'Moving...' : 'Animate Move'}
          </button>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="text-xl sm:text-3xl font-mono">
                  <span className="text-blue-400">{startPos}</span>
                  <span className="text-slate-400"> + </span>
                  <span className="text-purple-400">({moveBy >= 0 ? '+' : ''}{moveBy})</span>
                  <span className="text-slate-400"> = </span>
                  <span className="text-green-400">{result}</span>
                </div>
                <p className="text-slate-400 mt-2 text-sm sm:text-base">
                  Start at {startPos}, move {Math.abs(moveBy)} steps {moveBy >= 0 ? 'right' : 'left'}, end at {result}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
        <p className="text-sm text-slate-400">
          <strong className="text-slate-300">Key Insight:</strong> Addition is movement.
          Positive numbers move right, negative numbers move left.
          Subtraction is just adding a negative (moving left instead of right).
        </p>
      </div>
    </div>
  );
}
