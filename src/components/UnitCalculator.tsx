import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Unit {
  name: string;
  exponent: number;
}

export default function UnitCalculator() {
  const [q1Value, setQ1Value] = useState(5);
  const [q1Unit, setQ1Unit] = useState('m');
  const [q2Value, setQ2Value] = useState(3);
  const [q2Unit, setQ2Unit] = useState('m');
  const [operation, setOperation] = useState<'multiply' | 'divide'>('multiply');

  const parseUnit = (unitStr: string): Unit[] => {
    const units: Unit[] = [];
    const matches = unitStr.match(/([a-z]+)(\^-?\d+)?/gi);
    if (matches) {
      for (const match of matches) {
        const [, name, exp] = match.match(/([a-z]+)(\^-?\d+)?/i) || [];
        if (name) {
          units.push({
            name,
            exponent: exp ? parseInt(exp.slice(1)) : 1,
          });
        }
      }
    }
    return units;
  };

  const formatUnits = (units: Unit[]): string => {
    if (units.length === 0) return '(dimensionless)';

    const simplified: { [key: string]: number } = {};
    for (const u of units) {
      simplified[u.name] = (simplified[u.name] || 0) + u.exponent;
    }

    const parts: string[] = [];
    for (const [name, exp] of Object.entries(simplified)) {
      if (exp === 0) continue;
      if (exp === 1) parts.push(name);
      else parts.push(`${name}^${exp}`);
    }

    return parts.length > 0 ? parts.join('·') : '(dimensionless)';
  };

  const combineUnits = (u1: Unit[], u2: Unit[], op: 'multiply' | 'divide'): Unit[] => {
    const result: Unit[] = [...u1];
    for (const u of u2) {
      result.push({
        name: u.name,
        exponent: op === 'multiply' ? u.exponent : -u.exponent,
      });
    }
    return result;
  };

  const units1 = parseUnit(q1Unit);
  const units2 = parseUnit(q2Unit);
  const resultUnits = combineUnits(units1, units2, operation);
  const resultValue = operation === 'multiply' ? q1Value * q2Value : q1Value / q2Value;

  const presets = [
    { label: 'Area', q1: { v: 5, u: 'm' }, q2: { v: 3, u: 'm' }, op: 'multiply' as const },
    { label: 'Speed', q1: { v: 60, u: 'miles' }, q2: { v: 2, u: 'hours' }, op: 'divide' as const },
    { label: 'Check Speed×Time', q1: { v: 30, u: 'miles/hour' }, q2: { v: 3, u: 'hours' }, op: 'multiply' as const },
    { label: 'Volume', q1: { v: 2, u: 'm^2' }, q2: { v: 3, u: 'm' }, op: 'multiply' as const },
  ];

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Units as Type Labels (Dimensional Analysis)
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-center">
        <p className="text-slate-300">
          Units behave like variables with exponents:{' '}
          <span className="font-mono text-blue-400">m × m = m²</span>,{' '}
          <span className="font-mono text-green-400">m² ÷ m = m</span>
        </p>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setQ1Value(preset.q1.v);
              setQ1Unit(preset.q1.u);
              setQ2Value(preset.q2.v);
              setQ2Unit(preset.q2.u);
              setOperation(preset.op);
            }}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input section */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <label className="block text-sm text-slate-400 mb-2">Quantity 1</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={q1Value}
              onChange={(e) => setQ1Value(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200 font-mono"
            />
            <input
              type="text"
              value={q1Unit}
              onChange={(e) => setQ1Unit(e.target.value)}
              placeholder="e.g., m, m^2"
              className="flex-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-blue-400 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setOperation('multiply')}
              className={`px-4 py-2 rounded-lg text-xl ${
                operation === 'multiply'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              ×
            </button>
            <button
              onClick={() => setOperation('divide')}
              className={`px-4 py-2 rounded-lg text-xl ${
                operation === 'divide'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              ÷
            </button>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <label className="block text-sm text-slate-400 mb-2">Quantity 2</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={q2Value}
              onChange={(e) => setQ2Value(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200 font-mono"
            />
            <input
              type="text"
              value={q2Unit}
              onChange={(e) => setQ2Unit(e.target.value)}
              placeholder="e.g., m, hours"
              className="flex-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-green-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${resultValue}-${formatUnits(resultUnits)}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6"
        >
          <h4 className="text-center text-slate-400 mb-4">Result</h4>
          <div className="text-center text-3xl font-mono">
            <span className="text-blue-400">{q1Value}</span>
            <span className="text-blue-400/70 text-lg ml-1">{q1Unit}</span>
            <span className="text-yellow-400 mx-4">{operation === 'multiply' ? '×' : '÷'}</span>
            <span className="text-green-400">{q2Value}</span>
            <span className="text-green-400/70 text-lg ml-1">{q2Unit}</span>
            <span className="text-slate-400 mx-4">=</span>
            <span className="text-yellow-400">{resultValue.toFixed(2)}</span>
            <span className="text-yellow-400/70 text-lg ml-1">{formatUnits(resultUnits)}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Unit algebra explanation */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-slate-200 mb-3">Unit Algebra</h4>
        <div className="font-mono text-lg text-center">
          <span className="text-blue-400">{formatUnits(units1)}</span>
          <span className="text-slate-400 mx-2">{operation === 'multiply' ? '×' : '÷'}</span>
          <span className="text-green-400">{formatUnits(units2)}</span>
          <span className="text-slate-400 mx-2">=</span>
          <span className="text-yellow-400">{formatUnits(resultUnits)}</span>
        </div>
        <p className="text-sm text-slate-400 text-center mt-2">
          {operation === 'multiply'
            ? 'Multiply → exponents add'
            : 'Divide → exponents subtract'
          }
        </p>
      </div>

      {/* Common patterns */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="font-mono text-sm text-center">
            <span className="text-blue-400">m</span> × <span className="text-blue-400">m</span> = <span className="text-yellow-400">m²</span>
          </div>
          <div className="text-xs text-slate-500 text-center">Length × Length = Area</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="font-mono text-sm text-center">
            <span className="text-blue-400">miles</span> ÷ <span className="text-green-400">hours</span> = <span className="text-yellow-400">miles/hour</span>
          </div>
          <div className="text-xs text-slate-500 text-center">Distance ÷ Time = Speed</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="font-mono text-sm text-center">
            <span className="text-blue-400">m/s</span> × <span className="text-green-400">s</span> = <span className="text-yellow-400">m</span>
          </div>
          <div className="text-xs text-slate-500 text-center">Speed × Time = Distance</div>
        </div>
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Type Checking for Math:</strong> If units don't match
          on both sides of an equation, something is wrong—before you even do any calculations!
          This is dimensional analysis: the built-in error checker for physics and engineering.
        </p>
      </div>
    </div>
  );
}
