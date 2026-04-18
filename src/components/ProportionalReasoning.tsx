import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingUp, Zap } from 'lucide-react';

/**
 * Proportional Reasoning
 *
 * The insight: When two quantities have a constant ratio, their relationship
 * is a straight line through the origin. This is the foundation of linear
 * thinking — and knowing when it breaks is the foundation of advanced math.
 *
 * Historical context: Ancient merchants used proportions for trade.
 * Archimedes used them to calculate pi. Newton's laws are proportions.
 */

interface Scenario {
  name: string;
  unit1: string;
  unit2: string;
  rate: number;
  rateLabel: string;
  icon: string;
  isLinear: boolean;
}

const scenarios: Scenario[] = [
  { name: 'Distance & Time', unit1: 'hours', unit2: 'miles', rate: 60, rateLabel: '60 mph', icon: '🚗', isLinear: true },
  { name: 'Cost & Quantity', unit1: 'items', unit2: 'dollars', rate: 4.5, rateLabel: '$4.50 each', icon: '🛒', isLinear: true },
  { name: 'Recipe Scaling', unit1: 'servings', unit2: 'cups flour', rate: 0.5, rateLabel: '½ cup per serving', icon: '🧁', isLinear: true },
  { name: 'Compound Growth', unit1: 'years', unit2: 'value', rate: 1.1, rateLabel: '10% per year', icon: '📈', isLinear: false },
];

export default function ProportionalReasoning() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [inputValue, setInputValue] = useState(2);
  const [customRate, setCustomRate] = useState(activeScenario.rate);
  const [showTable, setShowTable] = useState(true);

  const calculate = (input: number, rate: number, isLinear: boolean) => {
    if (isLinear) return input * rate;
    return Math.pow(rate, input) * 100; // compound growth from base 100
  };

  const outputValue = useMemo(() => {
    return calculate(inputValue, customRate, activeScenario.isLinear);
  }, [inputValue, customRate, activeScenario]);

  const tableData = useMemo(() => {
    const data: { input: number; output: number; ratio: string }[] = [];
    for (let i = 1; i <= 6; i++) {
      const out = calculate(i, customRate, activeScenario.isLinear);
      data.push({
        input: i,
        output: out,
        ratio: activeScenario.isLinear ? customRate.toFixed(2) : (out / i).toFixed(2),
      });
    }
    return data;
  }, [customRate, activeScenario]);

  const graphPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const maxX = 6;
    const maxY = Math.max(...tableData.map(d => d.output));
    for (let i = 0; i <= maxX; i += 0.2) {
      const y = calculate(i, customRate, activeScenario.isLinear);
      pts.push({
        x: 40 + (i / maxX) * 260,
        y: 180 - (y / maxY) * 150,
      });
    }
    return pts;
  }, [customRate, activeScenario, tableData]);

  const pathD = graphPoints
    .filter(p => p.y > 10 && p.y < 190)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.name}
            onClick={() => {
              setActiveScenario(s);
              setCustomRate(s.rate);
              setInputValue(2);
            }}
            className={`px-3 py-2 rounded-lg text-sm transition-all min-h-[44px] flex items-center gap-2 ${
              activeScenario.name === s.name
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Interactive calculator */}
      <div className="bg-slate-800/70 rounded-xl p-4">
        <div className="grid sm:grid-cols-3 gap-4 items-center">
          {/* Input */}
          <div className="text-center">
            <label className="text-slate-400 text-sm block mb-2">{activeScenario.unit1}</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Math.max(0, Number(e.target.value)))}
              className="w-24 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-center text-2xl font-mono text-white"
              min="0"
              step="0.5"
            />
          </div>

          {/* Rate */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
              {activeScenario.isLinear ? <Scale size={20} /> : <TrendingUp size={20} />}
              <span className="text-sm">{activeScenario.isLinear ? 'constant rate' : 'compound rate'}</span>
            </div>
            <div className="text-xl font-mono text-emerald-300">
              {activeScenario.isLinear ? `×${customRate}` : `×${customRate} each`}
            </div>
          </div>

          {/* Output */}
          <div className="text-center">
            <label className="text-slate-400 text-sm block mb-2">{activeScenario.unit2}</label>
            <motion.div
              key={outputValue}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-3xl font-mono text-cyan-400"
            >
              {outputValue.toFixed(activeScenario.isLinear ? 1 : 0)}
            </motion.div>
          </div>
        </div>

        {/* Rate slider */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <label className="text-sm text-slate-400 flex justify-between mb-2">
            <span>Adjust the rate:</span>
            <span className="text-emerald-400">{customRate.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={activeScenario.isLinear ? '0.5' : '1.01'}
            max={activeScenario.isLinear ? Math.max(10, activeScenario.rate * 2).toString() : '1.5'}
            step={activeScenario.isLinear ? '0.5' : '0.01'}
            value={customRate}
            onChange={(e) => setCustomRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Visual comparison: Table + Graph */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Table */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-300 font-medium">Value Table</h4>
            <button
              onClick={() => setShowTable(!showTable)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              {showTable ? 'Hide' : 'Show'}
            </button>
          </div>

          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2 px-2">{activeScenario.unit1}</th>
                    <th className="text-left py-2 px-2">{activeScenario.unit2}</th>
                    <th className="text-left py-2 px-2">ratio (out÷in)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr
                      key={row.input}
                      className={`border-b border-slate-800 ${
                        row.input === Math.floor(inputValue) ? 'bg-emerald-900/30' : ''
                      }`}
                    >
                      <td className="py-2 px-2 font-mono">{row.input}</td>
                      <td className="py-2 px-2 font-mono text-cyan-400">{row.output.toFixed(1)}</td>
                      <td className={`py-2 px-2 font-mono ${
                        activeScenario.isLinear ? 'text-emerald-400' : 'text-yellow-400'
                      }`}>
                        {row.ratio}
                        {!activeScenario.isLinear && row.input > 1 && (
                          <span className="text-yellow-600 text-xs ml-1">varies!</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Key observation */}
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            activeScenario.isLinear
              ? 'bg-emerald-900/30 border border-emerald-500/30 text-emerald-300'
              : 'bg-yellow-900/30 border border-yellow-500/30 text-yellow-300'
          }`}>
            {activeScenario.isLinear ? (
              <>
                <Zap size={14} className="inline mr-1" />
                <strong>Constant ratio!</strong> No matter how much input, output/input = {customRate}
              </>
            ) : (
              <>
                <TrendingUp size={14} className="inline mr-1" />
                <strong>Changing ratio!</strong> Each step multiplies, so the ratio keeps growing.
              </>
            )}
          </div>
        </div>

        {/* Graph */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-slate-300 font-medium mb-3">Visual Graph</h4>
          <svg viewBox="0 0 320 200" className="w-full h-auto">
            {/* Grid */}
            <defs>
              <pattern id="prop-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="40" y="20" width="260" height="160" fill="url(#prop-grid)" />

            {/* Axes */}
            <line x1="40" y1="180" x2="300" y2="180" stroke="#475569" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#475569" strokeWidth="1.5" />

            {/* Axis labels */}
            <text x="170" y="198" fill="#64748b" fontSize="11" textAnchor="middle">{activeScenario.unit1}</text>
            <text x="20" y="100" fill="#64748b" fontSize="11" textAnchor="middle" transform="rotate(-90, 20, 100)">{activeScenario.unit2}</text>

            {/* The line/curve */}
            <motion.path
              d={pathD}
              fill="none"
              stroke={activeScenario.isLinear ? '#10b981' : '#eab308'}
              strokeWidth="3"
              strokeLinecap="round"
              initial={false}
              animate={{ d: pathD }}
            />

            {/* Current point */}
            {inputValue > 0 && inputValue <= 6 && (
              <motion.circle
                cx={40 + (inputValue / 6) * 260}
                cy={180 - (outputValue / Math.max(...tableData.map(d => d.output))) * 150}
                r="8"
                fill="#22d3ee"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}

            {/* Origin line (for linear - shows constant slope) */}
            {activeScenario.isLinear && (
              <line
                x1="40"
                y1="180"
                x2={40 + (inputValue / 6) * 260}
                y2={180 - (outputValue / Math.max(...tableData.map(d => d.output))) * 150}
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            )}
          </svg>

          {/* Graph insight */}
          <p className="text-xs text-slate-500 mt-2 text-center">
            {activeScenario.isLinear
              ? 'Straight line through origin = constant rate'
              : 'Curve = rate changes as you go'
            }
          </p>
        </div>
      </div>

      {/* Deep insight */}
      <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-emerald-400">The Core Insight:</strong> When you see "per" — miles <em>per</em> hour,
          dollars <em>per</em> item — you're seeing a <em>ratio</em>. If that ratio stays constant,
          the relationship is <em>linear</em> (a straight line). If the ratio changes as inputs grow,
          you're in exponential or polynomial territory. Recognizing which is which is half of calculus.
        </p>
      </div>
    </div>
  );
}
