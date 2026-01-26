import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  value: number;
  children?: TreeNode[];
  isPrime: boolean;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function findSmallestFactor(n: number): number {
  if (n % 2 === 0) return 2;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return i;
  }
  return n;
}

function getPrimeFactorization(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let num = n;
  let divisor = 2;

  while (num > 1) {
    while (num % divisor === 0) {
      factors.set(divisor, (factors.get(divisor) || 0) + 1);
      num = num / divisor;
    }
    divisor++;
  }

  return factors;
}

export default function PrimeFactorTree() {
  const [inputNumber, setInputNumber] = useState(60);
  const [tree, setTree] = useState<TreeNode | null>(null);

  const initTree = useCallback(() => {
    if (inputNumber < 2) return;
    setTree({
      value: inputNumber,
      isPrime: isPrime(inputNumber),
    });
  }, [inputNumber]);

  const factorNode = (node: TreeNode): TreeNode => {
    if (isPrime(node.value) || node.value < 2) {
      return node;
    }

    const factor = findSmallestFactor(node.value);
    const other = node.value / factor;

    return {
      ...node,
      children: [
        { value: factor, isPrime: isPrime(factor) },
        { value: other, isPrime: isPrime(other) },
      ],
    };
  };

  const expandNode = (targetValue: number, currentNode: TreeNode): TreeNode => {
    if (currentNode.value === targetValue && !currentNode.children) {
      return factorNode(currentNode);
    }

    if (currentNode.children) {
      return {
        ...currentNode,
        children: currentNode.children.map((child) => expandNode(targetValue, child)),
      };
    }

    return currentNode;
  };

  const handleNodeClick = (value: number, isPrimeNode: boolean) => {
    if (isPrimeNode || value < 4) return;
    if (!tree) return;

    setTree(expandNode(value, tree));
  };

  const fullyFactor = () => {
    if (inputNumber < 2) return;

    const buildFullTree = (n: number): TreeNode => {
      if (isPrime(n) || n < 2) {
        return { value: n, isPrime: true };
      }

      const factor = findSmallestFactor(n);
      const other = n / factor;

      return {
        value: n,
        isPrime: false,
        children: [buildFullTree(factor), buildFullTree(other)],
      };
    };

    setTree(buildFullTree(inputNumber));
  };

  const primeFactors = getPrimeFactorization(inputNumber);
  const factorizationString = Array.from(primeFactors.entries())
    .map(([prime, exp]) => (exp === 1 ? `${prime}` : `${prime}^${exp}`))
    .join(' × ');

  const renderNode = (node: TreeNode, depth: number = 0, key: string = '0'): React.ReactElement => {
    const canExpand = !node.isPrime && !node.children && node.value >= 4;

    return (
      <div key={key} className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center font-mono text-lg
            cursor-pointer transition-all
            ${node.isPrime
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : canExpand
              ? 'bg-blue-500/50 text-white hover:bg-blue-500 border-2 border-dashed border-blue-400'
              : 'bg-slate-600 text-slate-200'
            }
          `}
          onClick={() => handleNodeClick(node.value, node.isPrime)}
          whileHover={canExpand ? { scale: 1.1 } : {}}
        >
          {node.value}
        </motion.div>

        {node.children && (
          <div className="flex flex-col items-center mt-2">
            {/* Connector lines */}
            <div className="flex items-start">
              <div className="w-8 h-4 border-l-2 border-b-2 border-slate-500 rounded-bl-lg" />
              <div className="w-8 h-4 border-r-2 border-b-2 border-slate-500 rounded-br-lg" />
            </div>

            <div className="flex gap-4 mt-1">
              {node.children.map((child, i) => renderNode(child, depth + 1, `${key}-${i}`))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Prime Factorization Tree
      </h3>

      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-700/30 rounded-lg text-center">
        <p className="text-slate-300 text-sm sm:text-base">
          Every integer &gt; 1 breaks down into prime factors—the "atoms" of multiplication.
          <span className="block sm:inline"> Tap non-primes to factor them!</span>
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
        <input
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(Math.max(2, parseInt(e.target.value) || 2))}
          className="flex-1 px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 font-mono text-lg sm:text-xl"
          min={2}
          max={1000}
        />
        <div className="flex gap-2">
          <button
            onClick={initTree}
            className="flex-1 sm:flex-none px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg min-h-[44px] text-sm sm:text-base"
          >
            Start
          </button>
          <button
            onClick={fullyFactor}
            className="flex-1 sm:flex-none px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg min-h-[44px] text-sm sm:text-base"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Quick examples */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {[12, 24, 60, 100, 360].map((n) => (
          <button
            key={n}
            onClick={() => setInputNumber(n)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm font-mono min-h-[40px]"
          >
            {n}
          </button>
        ))}
      </div>

      {/* Tree visualization */}
      <div className="bg-slate-800/50 rounded-lg p-8 mb-6 min-h-48 flex justify-center items-start overflow-x-auto">
        <AnimatePresence mode="wait">
          {tree ? (
            <motion.div
              key={inputNumber}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderNode(tree)}
            </motion.div>
          ) : (
            <div className="text-slate-500">Click "Start" to begin factoring</div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend - wrap on mobile */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex-shrink-0" />
          <span className="text-xs sm:text-sm text-slate-400">Prime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/50 border-2 border-dashed border-blue-400 rounded-full flex-shrink-0" />
          <span className="text-xs sm:text-sm text-slate-400">Click to expand</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-600 rounded-full flex-shrink-0" />
          <span className="text-xs sm:text-sm text-slate-400">Factored</span>
        </div>
      </div>

      {/* Result */}
      {inputNumber >= 2 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-400 mb-2 text-center">Prime Factorization</h4>
          <div className="text-center text-2xl font-mono">
            <span className="text-blue-400">{inputNumber}</span>
            <span className="text-slate-400"> = </span>
            <span className="text-green-400">{factorizationString || inputNumber}</span>
          </div>
        </div>
      )}

      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">Fundamental Theorem of Arithmetic:</strong> Every integer
          greater than 1 has a unique prime factorization (up to ordering). This is why primes are
          called the "atoms" of multiplication—and why factoring large numbers is the basis of
          modern cryptography (like RSA encryption).
        </p>
      </div>
    </div>
  );
}
