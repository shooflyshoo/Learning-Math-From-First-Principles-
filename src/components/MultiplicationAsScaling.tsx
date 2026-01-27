import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MultiplicationAsScaling() {
  const [scaleFactor, setScaleFactor] = useState(2);

  const originalPoints = [-3, -2, -1, 0, 1, 2, 3];

  const getScaledPoint = (point: number) => point * scaleFactor;

  const getPositionPercent = (value: number, max: number = 10) => {
    return ((value + max) / (max * 2)) * 100;
  };

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Multiplication as Scaling (Stretching/Compressing the Number Line)
      </h3>

      <div className="mb-8">
        <label className="block text-sm text-slate-400 mb-2">
          Scale Factor: <span className="text-purple-400 font-mono">{scaleFactor.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={-3}
          max={3}
          step={0.1}
          value={scaleFactor}
          onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>-3 (flip & stretch)</span>
          <span>0 (collapse)</span>
          <span>1 (no change)</span>
          <span>3 (stretch)</span>
        </div>
      </div>

      {/* Scale factor interpretation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <motion.div
          className={`p-2 sm:p-3 rounded-lg text-center transition-colors ${Math.abs(scaleFactor) > 1 ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'}`}
          animate={Math.abs(scaleFactor) > 1 ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs sm:text-sm">|factor| &gt; 1</div>
          <div className="font-semibold text-sm sm:text-base">Stretch</div>
        </motion.div>
        <motion.div
          className={`p-2 sm:p-3 rounded-lg text-center transition-colors ${Math.abs(scaleFactor) < 1 && scaleFactor !== 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700/50 text-slate-400'}`}
          animate={Math.abs(scaleFactor) < 1 && scaleFactor !== 0 ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs sm:text-sm">|factor| &lt; 1</div>
          <div className="font-semibold text-sm sm:text-base">Compress</div>
        </motion.div>
        <motion.div
          className={`p-2 sm:p-3 rounded-lg text-center transition-colors ${scaleFactor < 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-400'}`}
          animate={scaleFactor < 0 ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs sm:text-sm">factor &lt; 0</div>
          <div className="font-semibold text-sm sm:text-base">Flip</div>
        </motion.div>
        <motion.div
          className={`p-2 sm:p-3 rounded-lg text-center transition-colors ${scaleFactor === 0 ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'bg-slate-700/50 text-slate-400'}`}
          animate={scaleFactor === 0 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: scaleFactor === 0 ? Infinity : 0 }}
        >
          <div className="text-xs sm:text-sm">factor = 0</div>
          <div className="font-semibold text-sm sm:text-base">Collapse</div>
        </motion.div>
      </div>

      {/* Original Number Line */}
      <div className="mb-2 text-sm text-slate-400 font-medium">Original Number Line</div>
      <div className="relative h-16 mb-8">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-600 rounded-full" />

        {/* Ticks - show every 5 on mobile, all on desktop */}
        {Array.from({ length: 21 }, (_, i) => i - 10).map((num) => {
          const showLabel = num === 0 || num % 5 === 0;
          return (
            <div
              key={num}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${getPositionPercent(num)}%` }}
            >
              <div className={`w-0.5 -ml-px ${num === 0 ? 'h-6 -mt-3 bg-yellow-500' : 'h-3 -mt-1.5 bg-slate-500'}`} />
              {showLabel && (
                <div className={`text-xs mt-4 -ml-2 ${num === 0 ? 'text-yellow-500' : 'text-slate-500'}`}>
                  {num}
                </div>
              )}
            </div>
          );
        })}

        {/* Original points */}
        {originalPoints.map((point) => (
          <motion.div
            key={point}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 -ml-2"
            style={{ left: `${getPositionPercent(point)}%` }}
            initial={false}
          />
        ))}
      </div>

      {/* Scaled Number Line */}
      <div className="mb-2 text-sm text-slate-400 font-medium">
        Scaled by <span className="text-purple-400 font-mono">{scaleFactor.toFixed(2)}</span>
        {scaleFactor === 0 && <span className="text-purple-400 ml-2">💥 Everything vanishes!</span>}
      </div>
      <div className="relative h-16 mb-8">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-700 rounded-full" />

        {/* Ticks for reference - show every 5 on mobile */}
        {Array.from({ length: 21 }, (_, i) => i - 10).map((num) => {
          const showLabel = num === 0 || num % 5 === 0;
          return (
            <div
              key={num}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${getPositionPercent(num)}%` }}
            >
              <div className={`w-0.5 -ml-px ${num === 0 ? 'h-6 -mt-3 bg-yellow-500' : 'h-2 -mt-1 bg-slate-600'}`} />
              {showLabel && (
                <div className={`text-xs mt-4 -ml-2 ${num === 0 ? 'text-yellow-500' : 'text-slate-600'}`}>
                  {num}
                </div>
              )}
            </div>
          );
        })}

        {/* Scaled points with connecting lines */}
        {originalPoints.map((point) => {
          const scaled = getScaledPoint(point);
          const clampedScaled = clamp(scaled, -10, 10);
          const isOutOfBounds = Math.abs(scaled) > 10;

          // Only show value labels for points that are far enough apart
          // When scale factor is small, only show for 0 and extremes
          const showLabel = Math.abs(scaleFactor) >= 0.5 ||
            point === 0 ||
            Math.abs(point) === 3;

          return (
            <motion.div
              key={point}
              className="absolute top-1/2 -translate-y-1/2"
              initial={false}
              animate={{ left: `${getPositionPercent(clampedScaled)}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              {/* Connecting line */}
              <motion.div
                className="absolute w-0.5 bg-purple-500/30"
                style={{
                  height: '60px',
                  top: '-50px',
                }}
              />
              {/* Point */}
              <motion.div
                className={`w-5 h-5 -ml-2.5 rounded-full border-2 ${
                  isOutOfBounds
                    ? 'bg-red-500/50 border-red-500'
                    : scaleFactor === 0
                      ? 'bg-purple-500 border-purple-400'
                      : 'bg-green-500 border-green-400 shadow-lg shadow-green-500/30'
                }`}
                animate={scaleFactor === 0 ? {
                  scale: [1, 1.5, 0.8, 1],
                  opacity: [1, 0.5, 1]
                } : {}}
                transition={{ duration: 0.5 }}
              />
              {showLabel && (
                <div className="text-xs text-green-400 mt-1 -ml-4 w-8 text-center font-mono">
                  {scaled.toFixed(1)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Example calculation */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <div className="text-lg font-mono text-center mb-4">
          <span className="text-blue-400">3</span>
          <span className="text-slate-400"> × </span>
          <span className="text-purple-400">{scaleFactor.toFixed(2)}</span>
          <span className="text-slate-400"> = </span>
          <span className="text-green-400">{(3 * scaleFactor).toFixed(2)}</span>
        </div>
        <p className="text-sm text-slate-400 text-center">
          {scaleFactor > 1 && "Every point moves away from zero (stretching)"}
          {scaleFactor === 1 && "No change - multiplying by 1 keeps everything in place"}
          {scaleFactor > 0 && scaleFactor < 1 && "Every point moves toward zero (compressing)"}
          {scaleFactor === 0 && "Everything collapses to zero"}
          {scaleFactor < 0 && scaleFactor > -1 && "Flip and compress toward zero"}
          {scaleFactor <= -1 && "Flip and stretch away from zero"}
        </p>
      </div>

      <div className="mt-6 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Why "repeated addition" breaks down:</strong> You can say
          3 × 4 = 3 + 3 + 3 + 3. But what's 3 × 0.5? Or 3 × (-2)? Scaling handles all of these:
          shrinking, flipping, and irrational factors like √2.
        </p>
      </div>
    </div>
  );
}
