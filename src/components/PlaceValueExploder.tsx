import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlaceValueExploder() {
  const [number, setNumber] = useState(3456);
  const [base, setBase] = useState(10);

  const convertToBase = (num: number, b: number): string[] => {
    if (num === 0) return ['0'];
    const digits: string[] = [];
    let n = Math.abs(num);
    while (n > 0) {
      const remainder = n % b;
      digits.unshift(remainder < 10 ? remainder.toString() : String.fromCharCode(55 + remainder));
      n = Math.floor(n / b);
    }
    return digits;
  };

  const digits = convertToBase(number, base);

  const getPlaceValue = (position: number): number => {
    return Math.pow(base, position);
  };

  const getDigitValue = (digit: string): number => {
    if (digit >= '0' && digit <= '9') return parseInt(digit);
    return digit.charCodeAt(0) - 55; // A=10, B=11, etc.
  };

  const bases = [
    { value: 2, label: 'Binary', desc: 'Computers' },
    { value: 8, label: 'Octal', desc: 'Legacy Unix' },
    { value: 10, label: 'Decimal', desc: 'Human standard' },
    { value: 16, label: 'Hexadecimal', desc: 'Programming' },
  ];

  // Calculate expanded form
  const expandedParts = digits.map((d, i) => {
    const position = digits.length - 1 - i;
    const digitValue = getDigitValue(d);
    const placeValue = getPlaceValue(position);
    return { digit: d, digitValue, position, placeValue, total: digitValue * placeValue };
  });

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Place Value Exploder (Number Bases)
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-center">
        <p className="text-slate-300">
          The same number can be written in different bases. Base 10 uses powers of 10,
          base 2 uses powers of 2. Same quantity, different encoding!
        </p>
      </div>

      {/* Input controls */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Number (in base 10): <span className="text-blue-400 font-mono">{number}</span>
          </label>
          <input
            type="range"
            min={0}
            max={9999}
            value={number}
            onChange={(e) => setNumber(parseInt(e.target.value))}
            className="w-full"
          />
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Math.max(0, parseInt(e.target.value) || 0))}
            className="mt-2 w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Base</label>
          <div className="grid grid-cols-2 gap-2">
            {bases.map((b) => (
              <button
                key={b.value}
                onClick={() => setBase(b.value)}
                className={`p-3 rounded-lg text-left transition-all ${
                  base === b.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="font-semibold">Base {b.value}</div>
                <div className="text-xs opacity-70">{b.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main display */}
      <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 mb-6">
        <div className="text-center mb-6">
          <div className="text-sm text-slate-400 mb-2">In base {base}:</div>
          <div className="text-3xl sm:text-5xl font-mono text-blue-400 tracking-wider break-all">
            {digits.join('')}
            <sub className="text-base sm:text-lg text-slate-500">{base}</sub>
          </div>
        </div>

        {/* Exploded view */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${number}-${base}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {expandedParts.map((part, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-700/50 rounded-lg p-2 sm:p-4 text-center min-w-[4.5rem] sm:min-w-24"
              >
                <div className="text-2xl sm:text-3xl font-mono text-green-400 mb-1 sm:mb-2">
                  {part.digit}
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  × {base}<sup>{part.position}</sup>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                  = {part.digit} × {part.placeValue}
                </div>
                <div className="text-sm sm:text-lg font-mono text-yellow-400 mt-1 sm:mt-2">
                  {part.total}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Sum - scrollable on mobile */}
        <div className="mt-6 text-center overflow-x-auto">
          <div className="text-base sm:text-xl font-mono whitespace-nowrap inline-block">
            {expandedParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-slate-400"> + </span>}
                <span className="text-yellow-400">{part.total}</span>
              </span>
            ))}
            <span className="text-slate-400"> = </span>
            <span className="text-green-400">{number}</span>
            <span className="text-slate-500">₁₀</span>
          </div>
        </div>
      </div>

      {/* All bases comparison */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-slate-200 mb-3 text-center">Same Number, Different Bases</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {bases.map((b) => (
            <div
              key={b.value}
              className={`p-3 rounded-lg text-center ${
                b.value === base
                  ? 'bg-blue-500/20 border border-blue-500'
                  : 'bg-slate-800/50'
              }`}
            >
              <div className="text-xs text-slate-400 mb-1">{b.label}</div>
              <div className="font-mono text-lg">
                <span className={b.value === base ? 'text-blue-400' : 'text-slate-300'}>
                  {convertToBase(number, b.value).join('')}
                </span>
                <sub className="text-slate-500 text-xs">{b.value}</sub>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fun facts */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-700/30 rounded-lg">
          <h4 className="font-semibold text-purple-400 mb-2">Why Binary?</h4>
          <p className="text-sm text-slate-300">
            Electronic switches have two states: on/off. Base 2 maps directly to hardware.
            Every digit is either 0 or 1—perfect for circuits.
          </p>
        </div>
        <div className="p-4 bg-slate-700/30 rounded-lg">
          <h4 className="font-semibold text-purple-400 mb-2">Why Hexadecimal?</h4>
          <p className="text-sm text-slate-300">
            Each hex digit = exactly 4 binary digits. It's compact shorthand:
            <span className="font-mono"> FF₁₆ = 11111111₂ = 255₁₀</span>
          </p>
        </div>
      </div>

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Key Insight:</strong> Base 10 isn't special—you have
          10 fingers, that's all. Mathematically, any base works. The number "eleven" is 11₁₀ = 1011₂ = B₁₆.
          Same quantity, different representation.
        </p>
      </div>
    </div>
  );
}
