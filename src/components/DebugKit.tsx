import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 1 | 2 | 3 | 4 | 5;

interface Answer {
  step: Step;
  value: string;
}

export default function DebugKit() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  const currentStep = (answers.length + 1) as Step;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, { step: currentStep, value }];
    setAnswers(newAnswers);

    if (newAnswers.length === 5) {
      generateDiagnosis(newAnswers);
    }
  };

  const reset = () => {
    setAnswers([]);
    setDiagnosis(null);
  };

  const generateDiagnosis = (allAnswers: Answer[]) => {
    const [system, operation, isInverse, unitsMatch, atBoundary] = allAnswers.map(a => a.value);

    let d = '';

    if (atBoundary === 'yes') {
      if (system === 'N' && (operation === 'subtract' || operation === 'divide')) {
        d = `You're trying ${operation === 'subtract' ? 'subtraction' : 'division'} in ℕ (natural numbers), but the result may not be a natural number. Consider working in ℤ (integers) or ℚ (rationals).`;
      } else if (system === 'Z' && operation === 'divide') {
        d = `You're dividing in ℤ (integers), but division doesn't always yield an integer. Consider working in ℚ (rationals) where fractions exist.`;
      } else if (system === 'Q' && (operation === 'exponent' || operation === 'log')) {
        d = `Some roots and logarithms produce irrational results not in ℚ. You may need ℝ (real numbers).`;
      } else if (system === 'R' && operation === 'exponent') {
        d = `If you're taking even roots of negative numbers, you've hit the boundary of ℝ. Consider ℂ (complex numbers) where √(-1) = i.`;
      } else {
        d = `You've hit a domain boundary. Check if your operation is defined for your input in your current number system.`;
      }
    } else if (unitsMatch === 'no') {
      d = `Your units don't match! You can't add or compare quantities with different dimensions (e.g., meters + seconds). Check your dimensional analysis.`;
    } else if (isInverse === 'yes') {
      if (operation === 'subtract') {
        d = `Subtraction is the inverse of addition. You're asking "what do I add to get from A to B?" Make sure A and B are compatible quantities.`;
      } else if (operation === 'divide') {
        d = `Division is the inverse of multiplication. You're asking "what factor scales A to B?" Watch for division by zero—it's undefined.`;
      } else if (operation === 'log') {
        d = `Logarithm is the inverse of exponentiation. You're asking "how many times must I multiply by the base to reach this value?" Note: log of negative/zero is undefined in ℝ.`;
      } else {
        d = `You're solving an inverse problem. Make sure the original operation was well-defined for your inputs.`;
      }
    } else {
      d = `Your setup looks reasonable! If you're still confused, try: (1) Breaking the problem into smaller steps, (2) Checking specific numbers instead of variables, (3) Drawing a picture or number line.`;
    }

    setDiagnosis(d);
  };

  const questions = [
    {
      step: 1 as Step,
      question: 'What number system are you working in?',
      options: [
        { value: 'N', label: 'ℕ Natural (0, 1, 2, 3, ...)' },
        { value: 'Z', label: 'ℤ Integers (..., -2, -1, 0, 1, 2, ...)' },
        { value: 'Q', label: 'ℚ Rationals (fractions)' },
        { value: 'R', label: 'ℝ Reals (all decimals)' },
        { value: 'C', label: 'ℂ Complex (a + bi)' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      step: 2 as Step,
      question: 'What operation are you performing?',
      options: [
        { value: 'add', label: 'Addition (+)' },
        { value: 'subtract', label: 'Subtraction (−)' },
        { value: 'multiply', label: 'Multiplication (×)' },
        { value: 'divide', label: 'Division (÷)' },
        { value: 'exponent', label: 'Exponentiation (^)' },
        { value: 'log', label: 'Logarithm (log)' },
      ],
    },
    {
      step: 3 as Step,
      question: 'Is this an inverse problem?',
      description: 'Are you trying to "undo" an operation or find a missing value?',
      options: [
        { value: 'yes', label: 'Yes (finding what was added/multiplied/etc.)' },
        { value: 'no', label: 'No (applying an operation forward)' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      step: 4 as Step,
      question: 'Do the units/types match?',
      description: 'Are you combining compatible quantities?',
      options: [
        { value: 'yes', label: 'Yes (same units or compatible)' },
        { value: 'no', label: 'No (different units being added)' },
        { value: 'na', label: 'Not applicable (pure numbers)' },
      ],
    },
    {
      step: 5 as Step,
      question: 'Did you hit a boundary?',
      description: 'Does the operation fail or give "undefined"?',
      options: [
        { value: 'yes', label: 'Yes (error, undefined, or impossible)' },
        { value: 'no', label: 'No (operation completes)' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
  ];

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        Math Debug Kit
      </h3>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-center">
        <p className="text-slate-300">
          When math feels confusing, run through these diagnostic questions.
          Answer each one to get a targeted diagnosis.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step < currentStep
                ? 'bg-green-500 text-white'
                : step === currentStep && !diagnosis
                ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                : 'bg-slate-700 text-slate-500'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
        ))}
      </div>

      {/* Questions */}
      <AnimatePresence mode="wait">
        {!diagnosis && currentStep <= 5 && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-800/50 rounded-lg p-6 mb-6"
          >
            <h4 className="text-lg font-semibold text-slate-200 mb-2">
              Question {currentStep} of 5
            </h4>
            <p className="text-xl text-blue-400 mb-2">
              {questions[currentStep - 1].question}
            </p>
            {questions[currentStep - 1].description && (
              <p className="text-sm text-slate-400 mb-4">
                {questions[currentStep - 1].description}
              </p>
            )}

            <div className="grid gap-2">
              {questions[currentStep - 1].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="p-3 text-left bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all text-slate-200 hover:text-white"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answers summary */}
      {answers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm text-slate-400 mb-2">Your answers:</h4>
          <div className="flex flex-wrap gap-2">
            {answers.map((a) => (
              <div
                key={a.step}
                className="px-3 py-1 bg-slate-700/50 rounded text-sm"
              >
                <span className="text-slate-500">Q{a.step}:</span>{' '}
                <span className="text-slate-300">{a.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnosis */}
      <AnimatePresence>
        {diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6"
          >
            <h4 className="text-green-400 font-semibold text-lg mb-3">
              🔍 Diagnosis
            </h4>
            <p className="text-slate-200 leading-relaxed">
              {diagnosis}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset button */}
      {answers.length > 0 && (
        <div className="text-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg"
          >
            Start Over
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-purple-400">The Five Debug Questions:</strong>
          {' '}(1) What world am I in? (2) What operation? (3) Inverse problem?
          (4) Units match? (5) At a boundary? These questions transform "I'm stuck"
          into "I know exactly what's going wrong."
        </p>
      </div>
    </div>
  );
}
