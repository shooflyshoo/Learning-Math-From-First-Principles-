import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Skull, Sliders, RotateCcw } from 'lucide-react';

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

const realWorldExamples = [
  { name: 'Virus spread', base: 2, linear: 10, desc: 'Each infected person infects 2 more' },
  { name: 'Compound interest (7%)', base: 1.07, linear: 7, desc: 'Money doubles every ~10 years' },
  { name: 'Social media viral', base: 3, linear: 50, desc: 'Each share gets 3 reshares' },
  { name: 'Moore\'s Law', base: 2, linear: 1, desc: 'Transistors double every 2 years' },
];

export default function GrowthTypesRace() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<DataPoint[]>([]);
  const [showDanger, setShowDanger] = useState(false);
  const [raceComplete, setRaceComplete] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Adjustable parameters
  const [linearRate, setLinearRate] = useState(5);
  const [expBase, setExpBase] = useState(2);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);

  const maxSteps = 20;

  const calculateValues = (step: number): DataPoint => ({
    step,
    linear: linearRate * step,
    quadratic: step * step,
    exponential: Math.pow(expBase, step),
  });

  useEffect(() => {
    const newData: DataPoint[] = [];
    for (let i = 0; i <= currentStep; i++) {
      newData.push(calculateValues(i));
    }
    setData(newData);

    // Trigger danger warning when exponential gets scary
    const expVal = Math.pow(expBase, currentStep);
    const linVal = linearRate * currentStep;
    if (expVal > linVal * 10 && !showDanger) {
      setShowDanger(true);
    }

    if (currentStep >= maxSteps) {
      setRaceComplete(true);
      setIsRunning(false);
    }
  }, [currentStep, linearRate, expBase, showDanger]);

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

  const applyPreset = (preset: typeof realWorldExamples[0]) => {
    reset();
    setExpBase(preset.base);
    setLinearRate(preset.linear);
    setActivePreset(preset.name);
  };

  useEffect(() => {
    if (isRunning && currentStep < maxSteps) {
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

  const maxY = Math.max(current.linear, current.quadratic, current.exponential, 50);
  const chartMax = Math.min(maxY, current.quadratic * 3 + 100);
  const expOffChart = current.exponential > chartMax;

  const getY = (value: number, cap = chartMax) => {
    const clamped = Math.min(value, cap);
    return 280 - (clamped / cap) * 260;
  };

  const getX = (step: number) => {
    return 50 + (step / maxSteps) * 500;
  };

  const getCommentary = () => {
    const ratio = current.exponential / Math.max(current.linear, 1);
    if (ratio < 1.5) return { text: "They all look pretty similar...", color: "text-slate-400" };
    if (ratio < 3) return { text: "Exponential is starting to pull ahead slightly.", color: "text-yellow-400" };
    if (ratio < 10) return { text: "Wait, exponential is really moving now.", color: "text-orange-400" };
    if (ratio < 50) return { text: "This is getting out of hand...", color: "text-red-400" };
    if (ratio < 500) return { text: "EXPONENTIAL HAS LEFT THE CHAT", color: "text-red-500" };
    return { text: "Linear and quadratic aren't even visible anymore.", color: "text-red-600" };
  };

  const commentary = getCommentary();

  return (
    <div className="space-y-6">
      {/* Parameter controls toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => setShowControls(!showControls)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all min-h-[44px] ${
            showControls ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Sliders size={16} />
          {showControls ? 'Hide Controls' : 'Adjust Parameters'}
        </button>

        {activePreset && (
          <span className="text-sm text-purple-400">
            Scenario: {activePreset}
          </span>
        )}
      </div>

      {/* Parameter controls panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-800/70 rounded-xl p-4 space-y-4">
              {/* Sliders */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">
                    Linear rate: <span className="text-blue-400 font-mono">+{linearRate}</span> per step
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={linearRate}
                    onChange={(e) => { setLinearRate(Number(e.target.value)); setActivePreset(null); reset(); }}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">
                    Exponential base: <span className="text-red-400 font-mono">×{expBase}</span> per step
                  </label>
                  <input
                    type="range"
                    min="1.05"
                    max="3"
                    step="0.05"
                    value={expBase}
                    onChange={(e) => { setExpBase(Number(e.target.value)); setActivePreset(null); reset(); }}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              </div>

              {/* Real-world presets */}
              <div>
                <div className="text-sm text-slate-400 mb-2">Real-world scenarios:</div>
                <div className="flex flex-wrap gap-2">
                  {realWorldExamples.map((ex) => (
                    <button
                      key={ex.name}
                      onClick={() => applyPreset(ex)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all min-h-[40px] ${
                        activePreset === ex.name
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                      title={ex.desc}
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>

              {activePreset && (
                <p className="text-sm text-slate-400 italic">
                  {realWorldExamples.find(e => e.name === activePreset)?.desc}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="px-4 sm:px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm sm:text-base min-h-[44px] flex items-center gap-2"
          >
            <RotateCcw size={16} />
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
