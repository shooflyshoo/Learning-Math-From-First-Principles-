import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Skull } from 'lucide-react';

/**
 * Growth Types Race
 *
 * The point isn't just to show three lines going up.
 * It's to make you FEEL the deception of exponential growth.
 *
 * At first they all look similar. "Exponential is only a little ahead."
 * Then suddenly it's not even on the same scale.
 * That drama is the insight.
 */

interface DataPoint {
  step: number;
  linear: number;
  quadratic: number;
  exponential: number;
}

export default function GrowthTypesRace() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<DataPoint[]>([]);
  const [showDanger, setShowDanger] = useState(false);
  const [raceComplete, setRaceComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const maxSteps = 20;

  // Using values that make the race interesting
  // At step 10, exponential should start to clearly pull ahead
  // By step 15-20, it should be ridiculous
  const calculateValues = (step: number): DataPoint => ({
    step,
    linear: 5 * step, // 0, 5, 10, 15...
    quadratic: step * step, // 0, 1, 4, 9, 16, 25...
    exponential: Math.pow(2, step), // 1, 2, 4, 8, 16, 32, 64...
  });

  useEffect(() => {
    const newData: DataPoint[] = [];
    for (let i = 0; i <= currentStep; i++) {
      newData.push(calculateValues(i));
    }
    setData(newData);

    // Trigger danger warning when exponential gets scary
    if (currentStep >= 12 && !showDanger) {
      setShowDanger(true);
    }

    if (currentStep >= maxSteps) {
      setRaceComplete(true);
      setIsRunning(false);
    }
  }, [currentStep, showDanger]);

  const startRace = () => {
    setIsRunning(true);
    if (currentStep === 0) {
      setShowDanger(false);
      setRaceComplete(false);
    }
  };

  const reset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setCurrentStep(0);
    setData([calculateValues(0)]);
    setShowDanger(false);
    setRaceComplete(false);
  };

  useEffect(() => {
    if (isRunning && currentStep < maxSteps) {
      // Speed up slightly as we go to build tension
      const baseDelay = currentStep < 8 ? 600 : currentStep < 15 ? 400 : 300;
      intervalRef.current = window.setTimeout(() => {
        setCurrentStep(s => s + 1);
      }, baseDelay);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning, currentStep]);

  const current = data[data.length - 1] || calculateValues(0);

  // Calculate chart scaling - exponential will blow this up
  const maxY = Math.max(current.linear, current.quadratic, current.exponential, 50);

  // For display purposes, cap how high exponential can go on chart
  const chartMax = Math.min(maxY, current.quadratic * 3 + 100);
  const expOffChart = current.exponential > chartMax;

  const getY = (value: number, cap = chartMax) => {
    const clamped = Math.min(value, cap);
    return 280 - (clamped / cap) * 260;
  };

  const getX = (step: number) => {
    return 50 + (step / maxSteps) * 500;
  };

  // Commentary based on race progress
  const getCommentary = () => {
    if (currentStep <= 3) return { text: "They all look pretty similar...", color: "text-slate-400" };
    if (currentStep <= 6) return { text: "Exponential is starting to pull ahead slightly.", color: "text-yellow-400" };
    if (currentStep <= 9) return { text: "Wait, exponential is really moving now.", color: "text-orange-400" };
    if (currentStep <= 12) return { text: "This is getting out of hand...", color: "text-red-400" };
    if (currentStep <= 15) return { text: "EXPONENTIAL HAS LEFT THE CHAT", color: "text-red-500" };
    return { text: "Linear and quadratic aren't even visible from exponential's perspective.", color: "text-red-600" };
  };

  const commentary = getCommentary();

  return (
    <div className="space-y-6">
      {/* Race header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-slate-400">Step: </span>
          <span className="text-2xl font-mono text-white">{currentStep}</span>
          <span className="text-slate-500"> / {maxSteps}</span>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={isRunning ? () => setIsRunning(false) : startRace}
            className={`px-4 sm:px-5 py-2 sm:py-2 rounded-lg font-semibold text-sm sm:text-base transition-all min-h-[44px] ${
              isRunning
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? 'Pause' : currentStep > 0 ? 'Continue' : '▶ Start'}
          </button>
          <button
            onClick={reset}
            className="px-4 sm:px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm sm:text-base min-h-[44px]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Live commentary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={commentary.text}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`text-center py-3 px-4 bg-slate-800/50 rounded-lg ${commentary.color} font-medium`}
        >
          {commentary.text}
        </motion.div>
      </AnimatePresence>

      {/* The Chart */}
      <div className="relative bg-slate-900/70 rounded-xl p-2 overflow-hidden">
        <svg viewBox="0 0 600 320" className="w-full h-auto">
          {/* Grid */}
          <defs>
            <pattern id="growth-grid" width="50" height="40" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="50" y="20" width="500" height="260" fill="url(#growth-grid)" />

          {/* Axes */}
          <line x1="50" y1="280" x2="550" y2="280" stroke="#475569" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="280" stroke="#475569" strokeWidth="2" />

          {/* Lines */}
          {data.length > 1 && (
            <>
              {/* Linear - Blue */}
              <motion.path
                d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.step)} ${getY(d.linear)}`).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Quadratic - Green */}
              <motion.path
                d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.step)} ${getY(d.quadratic)}`).join(' ')}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Exponential - Red */}
              <motion.path
                d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.step)} ${getY(d.exponential)}`).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Current position dots */}
          {currentStep > 0 && (
            <>
              <circle cx={getX(currentStep)} cy={getY(current.linear)} r="8" fill="#3b82f6" />
              <circle cx={getX(currentStep)} cy={getY(current.quadratic)} r="8" fill="#22c55e" />
              {!expOffChart && (
                <circle cx={getX(currentStep)} cy={getY(current.exponential)} r="10" fill="#ef4444" />
              )}
            </>
          )}

          {/* "Off the chart" indicator for exponential */}
          {expOffChart && (
            <>
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <line
                  x1={getX(currentStep)}
                  y1="20"
                  x2={getX(currentStep)}
                  y2="5"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="5,3"
                />
                <polygon
                  points={`${getX(currentStep)},0 ${getX(currentStep) - 8},12 ${getX(currentStep) + 8},12`}
                  fill="#ef4444"
                />
              </motion.g>
            </>
          )}
        </svg>

        {/* Off-chart warning */}
        <AnimatePresence>
          {expOffChart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-red-900/90 border border-red-500 rounded-lg px-3 py-2 flex items-center gap-2"
            >
              <AlertTriangle className="text-red-400" size={16} />
              <span className="text-red-300 text-sm font-medium">
                Exponential: {current.exponential.toLocaleString()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score cards - stack on mobile, 3-col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-start sm:text-center">
          <div className="text-blue-400 text-xs font-semibold uppercase tracking-wide sm:mb-1">Linear</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-mono text-blue-300">
            {current.linear.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">+5 each step</div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-start sm:text-center">
          <div className="text-green-400 text-xs font-semibold uppercase tracking-wide sm:mb-1">Quadratic</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-mono text-green-300">
            {current.quadratic.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">n²</div>
        </div>

        <div className={`border rounded-lg p-3 flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-start sm:text-center transition-colors ${
          showDanger
            ? 'bg-red-900/50 border-red-500/50 animate-pulse'
            : 'bg-red-900/30 border-red-500/30'
        }`}>
          <div className="text-red-400 text-xs font-semibold uppercase tracking-wide sm:mb-1 flex items-center gap-1">
            Exponential
            {showDanger && <Skull size={12} />}
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-mono text-red-300">
            {current.exponential > 999999
              ? current.exponential.toExponential(1)
              : current.exponential.toLocaleString()
            }
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">×2 each step</div>
        </div>
      </div>

      {/* How much bigger is exponential? */}
      {currentStep >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 rounded-lg p-4 text-center"
        >
          <p className="text-slate-400 text-sm mb-2">Exponential is now...</p>
          <p className="text-xl">
            <span className="text-red-400 font-bold">
              {(current.exponential / current.linear).toFixed(1)}×
            </span>
            <span className="text-slate-500"> larger than linear, and </span>
            <span className="text-red-400 font-bold">
              {(current.exponential / Math.max(current.quadratic, 1)).toFixed(1)}×
            </span>
            <span className="text-slate-500"> larger than quadratic</span>
          </p>
        </motion.div>
      )}

      {/* Final revelation */}
      <AnimatePresence>
        {raceComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30 rounded-xl"
          >
            <h4 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
              <Skull size={24} />
              The Exponential Trap
            </h4>
            <p className="text-slate-300 mb-4">
              At step 5, exponential was only <strong>32</strong> — barely ahead of linear's 25.
              "No big deal," you might think.
            </p>
            <p className="text-slate-300 mb-4">
              At step 20, exponential is <strong>{Math.pow(2, 20).toLocaleString()}</strong>.
              Linear is at 100. Quadratic is at 400.
            </p>
            <p className="text-red-400 font-semibold">
              This is why exponential growth "looks cute at first, then eats your civilization."
              By the time you notice it's a problem, it's already too late.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
