import { useState } from 'react';
import { motion } from 'framer-motion';

type NumberSystem = 'N' | 'Z' | 'Q' | 'R' | 'C';

interface Expression {
  text: string;
  description: string;
  results: Record<NumberSystem, { works: boolean; result?: string; reason?: string }>;
}

const expressions: Expression[] = [
  {
    text: '3 - 5',
    description: 'Subtraction with negative result',
    results: {
      N: { works: false, reason: 'Negative results don\'t exist' },
      Z: { works: true, result: '-2' },
      Q: { works: true, result: '-2' },
      R: { works: true, result: '-2' },
      C: { works: true, result: '-2' },
    },
  },
  {
    text: '7 ÷ 3',
    description: 'Division with non-integer result',
    results: {
      N: { works: false, reason: 'Result not a natural number' },
      Z: { works: false, reason: 'Result not an integer' },
      Q: { works: true, result: '7/3 ≈ 2.333...' },
      R: { works: true, result: '7/3 ≈ 2.333...' },
      C: { works: true, result: '7/3 ≈ 2.333...' },
    },
  },
  {
    text: '√2',
    description: 'Irrational square root',
    results: {
      N: { works: false, reason: 'Not a counting number' },
      Z: { works: false, reason: 'Not an integer' },
      Q: { works: false, reason: 'Irrational—no fraction equals √2' },
      R: { works: true, result: '≈ 1.41421356...' },
      C: { works: true, result: '≈ 1.41421356...' },
    },
  },
  {
    text: '√(-1)',
    description: 'Square root of negative',
    results: {
      N: { works: false, reason: 'Negative under square root' },
      Z: { works: false, reason: 'No integer squared is negative' },
      Q: { works: false, reason: 'No rational squared is negative' },
      R: { works: false, reason: 'No real squared is negative' },
      C: { works: true, result: 'i' },
    },
  },
  {
    text: '1 ÷ 0',
    description: 'Division by zero',
    results: {
      N: { works: false, reason: 'Undefined: no solution' },
      Z: { works: false, reason: 'Undefined: no solution' },
      Q: { works: false, reason: 'Undefined: no solution' },
      R: { works: false, reason: 'Undefined: no solution' },
      C: { works: false, reason: 'Undefined: no solution' },
    },
  },
  {
    text: 'log(-1)',
    description: 'Logarithm of negative',
    results: {
      N: { works: false, reason: 'Not applicable' },
      Z: { works: false, reason: 'Not applicable' },
      Q: { works: false, reason: 'Not applicable' },
      R: { works: false, reason: 'Exponentials stay positive' },
      C: { works: true, result: 'πi (or πi + 2πni)' },
    },
  },
];

const systemInfo: Record<NumberSystem, { name: string; color: string }> = {
  N: { name: 'ℕ Natural', color: 'text-emerald-400' },
  Z: { name: 'ℤ Integers', color: 'text-blue-400' },
  Q: { name: 'ℚ Rationals', color: 'text-yellow-400' },
  R: { name: 'ℝ Reals', color: 'text-orange-400' },
  C: { name: 'ℂ Complex', color: 'text-purple-400' },
};

const systems: NumberSystem[] = ['N', 'Z', 'Q', 'R', 'C'];

export default function DomainBoundaryExplorer() {
  const [selectedExpression, setSelectedExpression] = useState<Expression | null>(null);

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Domain Boundary Explorer
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-center">
        <p className="text-slate-300">
          Each number system has boundaries—expressions that don't have valid results.
          Click an expression to see where it works and where it fails.
        </p>
      </div>

      {/* Expression selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {expressions.map((expr) => (
          <button
            key={expr.text}
            onClick={() => setSelectedExpression(expr)}
            className={`p-4 rounded-lg text-left transition-all ${
              selectedExpression?.text === expr.text
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="font-mono text-lg">{expr.text}</div>
            <div className="text-xs opacity-70">{expr.description}</div>
          </button>
        ))}
      </div>

      {/* Results table */}
      {selectedExpression && (
        <motion.div
          key={selectedExpression.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h4 className="text-lg font-semibold text-center mb-4">
            <span className="font-mono text-blue-400">{selectedExpression.text}</span>
            {' '}in each number system:
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left bg-slate-800 border border-slate-700">System</th>
                  <th className="px-4 py-3 text-left bg-slate-800 border border-slate-700">Works?</th>
                  <th className="px-4 py-3 text-left bg-slate-800 border border-slate-700">Result / Reason</th>
                </tr>
              </thead>
              <tbody>
                {systems.map((sys) => {
                  const result = selectedExpression.results[sys];
                  return (
                    <motion.tr
                      key={sys}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: systems.indexOf(sys) * 0.1 }}
                      className={result.works ? 'bg-green-500/10' : 'bg-red-500/10'}
                    >
                      <td className={`px-4 py-3 border border-slate-700 ${systemInfo[sys].color} font-semibold`}>
                        {systemInfo[sys].name}
                      </td>
                      <td className="px-4 py-3 border border-slate-700">
                        <span className={`text-2xl ${result.works ? 'text-green-400' : 'text-red-400'}`}>
                          {result.works ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border border-slate-700 text-slate-300">
                        {result.works ? (
                          <span className="font-mono text-green-400">{result.result}</span>
                        ) : (
                          <span className="text-red-400">{result.reason}</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* The boundary map */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-slate-200 mb-4 text-center">Boundary Map</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left bg-slate-700 border border-slate-600">Boundary</th>
                <th className="px-3 py-2 text-left bg-slate-700 border border-slate-600">What Breaks</th>
                <th className="px-3 py-2 text-left bg-slate-700 border border-slate-600">Resolution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-slate-700 font-mono">3 - 5 in ℕ</td>
                <td className="px-3 py-2 border border-slate-700">No additive inverses</td>
                <td className="px-3 py-2 border border-slate-700 text-blue-400">Extend to ℤ</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-700 font-mono">7 ÷ 3 in ℤ</td>
                <td className="px-3 py-2 border border-slate-700">No multiplicative inverses</td>
                <td className="px-3 py-2 border border-slate-700 text-yellow-400">Extend to ℚ</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-700 font-mono">√2 in ℚ</td>
                <td className="px-3 py-2 border border-slate-700">Gaps in the number line</td>
                <td className="px-3 py-2 border border-slate-700 text-orange-400">Extend to ℝ</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-700 font-mono">√(-1) in ℝ</td>
                <td className="px-3 py-2 border border-slate-700">No square roots of negatives</td>
                <td className="px-3 py-2 border border-slate-700 text-purple-400">Extend to ℂ</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-700 font-mono">a ÷ 0 in any</td>
                <td className="px-3 py-2 border border-slate-700">No unique solution</td>
                <td className="px-3 py-2 border border-slate-700 text-red-400">Accept as undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Boundaries Are Diagnostic:</strong> When you hit a wall,
          you have two choices: accept the limitation, or extend the system. Most of mathematics
          grew by choosing to extend—preserving the old rules while adding new objects to make
          previously-impossible operations possible.
        </p>
      </div>
    </div>
  );
}
