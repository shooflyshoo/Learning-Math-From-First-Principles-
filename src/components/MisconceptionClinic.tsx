import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';

interface Misconception {
  myth: string;
  failureTest: string;
  correction: string;
  transfer: string;
}

interface MisconceptionClinicProps {
  sectionLabel: string;
  misconceptions: Misconception[];
}

export default function MisconceptionClinic({ sectionLabel, misconceptions }: MisconceptionClinicProps) {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<'myth' | 'failure' | 'repair'>('myth');

  const current = misconceptions[active];
  const progress = useMemo(() => `${active + 1}/${misconceptions.length}`, [active, misconceptions.length]);

  return (
    <section className="my-8 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-amber-950/20 p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Misconception clinic</p>
          <h4 className="mt-1 text-slate-100">{sectionLabel}: stress-test your intuition</h4>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Case {progress}</span>
      </div>

      <div className="mb-4 grid gap-2 md:grid-cols-3">
        {misconceptions.map((item, idx) => (
          <button
            key={item.myth}
            onClick={() => {
              setActive(idx);
              setPhase('myth');
            }}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
              active === idx
                ? 'border-amber-400 bg-amber-500/15 text-amber-100'
                : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
            }`}
          >
            {item.myth}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${active}-${phase}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-xl border border-slate-700/80 bg-slate-950/50 p-4"
        >
          {phase === 'myth' && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-amber-300">
                <AlertTriangle size={16} /> Tempting myth
              </p>
              <p className="text-slate-200">{current.myth}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPhase('failure')}
                  className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200 hover:bg-red-500/30"
                >
                  Let me believe this and test it
                </button>
                <button
                  onClick={() => setPhase('repair')}
                  className="rounded-lg bg-cyan-500/20 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/30"
                >
                  Skip to corrected model
                </button>
              </div>
            </div>
          )}

          {phase === 'failure' && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-red-300">
                <AlertTriangle size={16} /> Failure mode
              </p>
              <p className="text-slate-200">{current.failureTest}</p>
              <button
                onClick={() => setPhase('repair')}
                className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30"
              >
                Repair this model
              </button>
            </div>
          )}

          {phase === 'repair' && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={16} /> Corrected mental model
              </p>
              <p className="text-slate-200">{current.correction}</p>
              <p className="flex items-center gap-2 text-cyan-300">
                <Lightbulb size={16} /> Transfer cue
              </p>
              <p className="text-slate-300">{current.transfer}</p>
              <button
                onClick={() => setPhase('myth')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:border-slate-400"
              >
                <RotateCcw size={14} /> Re-run case
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
