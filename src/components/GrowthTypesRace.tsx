import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  x: number;
  linear: number;
  quadratic: number;
  exponential: number;
}

export default function GrowthTypesRace() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [maxSteps] = useState(15);
  const [data, setData] = useState<DataPoint[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Parameters
  const linearSlope = 3;
  const expBase = 1.5;

  const calculateValues = (x: number) => ({
    x,
    linear: linearSlope * x,
    quadratic: x * x,
    exponential: Math.pow(expBase, x),
  });

  useEffect(() => {
    const newData: DataPoint[] = [];
    for (let i = 0; i <= currentStep; i++) {
      newData.push(calculateValues(i));
    }
    setData(newData);
  }, [currentStep]);

  const startRace = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setData([calculateValues(0)]);
  };

  const stopRace = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetRace = () => {
    stopRace();
    setCurrentStep(0);
    setData([calculateValues(0)]);
  };

  useEffect(() => {
    if (isRunning && currentStep < maxSteps) {
      intervalRef.current = window.setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 1000 / speed);
    } else if (currentStep >= maxSteps) {
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isRunning, currentStep, speed, maxSteps]);

  const maxY = data.length > 0
    ? Math.max(...data.map(d => Math.max(d.linear, d.quadratic, d.exponential)), 10)
    : 10;

  const getY = (value: number) => {
    const chartHeight = 300;
    return chartHeight - (value / maxY) * chartHeight;
  };

  const getX = (step: number) => {
    const chartWidth = 600;
    return (step / maxSteps) * chartWidth;
  };

  const currentValues = data[data.length - 1] || calculateValues(0);

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Growth Types Race: Linear vs Polynomial vs Exponential
      </h3>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={isRunning ? stopRace : startRace}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? 'Pause' : currentStep > 0 ? 'Resume' : 'Start Race'}
        </button>
        <button
          onClick={resetRace}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold"
        >
          Reset
        </button>
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Speed:</label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-24"
          />
          <span className="text-slate-300 font-mono">{speed}x</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Jump to step:</label>
          <input
            type="number"
            min={0}
            max={25}
            value={currentStep}
            onChange={(e) => {
              stopRace();
              setCurrentStep(Math.min(25, Math.max(0, parseInt(e.target.value) || 0)));
            }}
            className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="relative bg-slate-800/50 rounded-lg p-4 mb-6 overflow-hidden">
        <svg viewBox="0 0 650 350" className="w-full h-auto">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="25" y="10" width="600" height="300" fill="url(#grid)" />

          {/* Axes */}
          <line x1="25" y1="310" x2="625" y2="310" stroke="#64748b" strokeWidth="2" />
          <line x1="25" y1="10" x2="25" y2="310" stroke="#64748b" strokeWidth="2" />

          {/* Y-axis labels */}
          <text x="20" y="315" fill="#64748b" fontSize="10" textAnchor="end">0</text>
          <text x="20" y="165" fill="#64748b" fontSize="10" textAnchor="end">{Math.round(maxY / 2)}</text>
          <text x="20" y="15" fill="#64748b" fontSize="10" textAnchor="end">{Math.round(maxY)}</text>

          {/* Lines */}
          {data.length > 1 && (
            <>
              {/* Linear */}
              <motion.path
                d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${25 + getX(d.x)} ${10 + getY(d.linear)}`).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />

              {/* Quadratic */}
              <motion.path
                d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${25 + getX(d.x)} ${10 + getY(d.quadratic)}`).join(' ')}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />

              {/* Exponential */}
              <motion.path
                d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${25 + getX(d.x)} ${10 + getY(Math.min(d.exponential, maxY))}`).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            </>
          )}

          {/* Current points */}
          {data.length > 0 && (
            <>
              <circle cx={25 + getX(currentStep)} cy={10 + getY(currentValues.linear)} r="6" fill="#3b82f6" />
              <circle cx={25 + getX(currentStep)} cy={10 + getY(currentValues.quadratic)} r="6" fill="#22c55e" />
              <circle
                cx={25 + getX(currentStep)}
                cy={10 + getY(Math.min(currentValues.exponential, maxY))}
                r="6"
                fill="#ef4444"
              />
            </>
          )}
        </svg>

        {/* Step indicator */}
        <div className="absolute top-4 right-4 bg-slate-900/80 px-3 py-1 rounded-lg">
          <span className="text-slate-400">Step: </span>
          <span className="text-white font-mono">{currentStep}</span>
        </div>
      </div>

      {/* Legend and current values */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-blue-400 font-semibold">Linear</span>
            <span className="text-slate-500 text-sm">(y = {linearSlope}x)</span>
          </div>
          <div className="text-3xl font-mono text-blue-400">
            {currentValues.linear.toFixed(1)}
          </div>
          <div className="text-sm text-slate-400">+{linearSlope} each step</div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-green-400 font-semibold">Quadratic</span>
            <span className="text-slate-500 text-sm">(y = x²)</span>
          </div>
          <div className="text-3xl font-mono text-green-400">
            {currentValues.quadratic.toFixed(1)}
          </div>
          <div className="text-sm text-slate-400">
            {currentStep > 0
              ? `+${currentValues.quadratic - (currentStep - 1) * (currentStep - 1)} this step`
              : 'Starts slow, accelerates'
            }
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-red-400 font-semibold">Exponential</span>
            <span className="text-slate-500 text-sm">(y = {expBase}^x)</span>
          </div>
          <div className="text-3xl font-mono text-red-400">
            {currentValues.exponential > 1000000
              ? currentValues.exponential.toExponential(2)
              : currentValues.exponential.toFixed(1)
            }
          </div>
          <div className="text-sm text-slate-400">×{expBase} each step</div>
        </div>
      </div>

      {/* Ratio comparison */}
      {currentStep > 0 && (
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <div className="text-sm text-slate-400 mb-2">Exponential vs Linear ratio:</div>
          <div className="text-xl font-mono">
            <span className="text-red-400">{currentValues.exponential.toFixed(1)}</span>
            <span className="text-slate-500"> / </span>
            <span className="text-blue-400">{currentValues.linear.toFixed(1)}</span>
            <span className="text-slate-500"> = </span>
            <span className="text-purple-400">
              {(currentValues.exponential / currentValues.linear).toFixed(2)}×
            </span>
          </div>
        </div>
      )}

      {/* Key insight */}
      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Pattern:</strong> Linear adds the same amount each step
          (constant first differences). Quadratic adds increasing amounts (constant second differences).
          Exponential multiplies by the same factor (constant ratios).
          {currentStep >= 10 && (
            <span className="text-red-400"> Notice how exponential looks harmless at first but then explodes!</span>
          )}
        </p>
      </div>
    </div>
  );
}
