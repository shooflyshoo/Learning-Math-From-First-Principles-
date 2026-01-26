import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Building Floors - Negative Numbers as Real Positions
 *
 * Completely mobile-first design:
 * - Single column layout, no side-by-side
 * - No absolute positioning that could overflow
 * - Clear, stacked sections
 */
export default function BuildingFloors() {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [tripStart, setTripStart] = useState(0);
  const [tripEnd, setTripEnd] = useState(0);
  const [mode, setMode] = useState<'explore' | 'trip'>('explore');

  const floors = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
  const tripDistance = tripEnd - tripStart;

  const getFloorColor = (floor: number) => {
    if (floor === 0) return 'bg-yellow-500/30 border-yellow-500 text-yellow-400';
    if (floor > 0) return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
  };

  const getFloorLabel = (floor: number) => {
    if (floor === 0) return 'G';
    if (floor > 0) return `${floor}`;
    return `B${Math.abs(floor)}`;
  };

  const moveFloor = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentFloor < 5) {
      setCurrentFloor(f => f + 1);
    } else if (direction === 'down' && currentFloor > -3) {
      setCurrentFloor(f => f - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('explore')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'explore' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setMode('trip')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'trip' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Calculate Trip
        </button>
      </div>

      {mode === 'explore' && (
        <>
          {/* Building visualization - compact and centered */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="max-w-[200px] mx-auto">
              {/* Floors from top to bottom */}
              <div className="flex flex-col">
                {[...floors].reverse().map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setCurrentFloor(floor)}
                    className={`h-9 border-2 flex items-center justify-between px-3 transition-all ${
                      getFloorColor(floor)
                    } ${currentFloor === floor ? 'ring-2 ring-cyan-400 scale-[1.02]' : ''}`}
                  >
                    <span className="text-sm">
                      {floor === 0 ? '🚪' : floor > 0 ? '🏢' : '📦'}
                    </span>
                    <span className="text-xs font-medium">{getFloorLabel(floor)}</span>
                    <span className="font-mono text-sm font-bold">
                      {floor >= 0 ? floor : floor}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-3 text-xs text-slate-400">
              <span>🏢 Above</span>
              <span className="text-yellow-400">🚪 Ground</span>
              <span>📦 Below</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => moveFloor('up')}
              disabled={currentFloor >= 5}
              className="flex items-center gap-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm"
            >
              <ChevronUp size={18} /> Up
            </button>
            <button
              onClick={() => moveFloor('down')}
              disabled={currentFloor <= -3}
              className="flex items-center gap-1 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm"
            >
              <ChevronDown size={18} /> Down
            </button>
          </div>

          {/* Current position display */}
          <div className="bg-slate-800/70 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-400 mb-1">Current Position</div>
            <div className={`text-2xl font-bold mb-1 ${
              currentFloor === 0 ? 'text-yellow-400' : currentFloor > 0 ? 'text-blue-400' : 'text-orange-400'
            }`}>
              {currentFloor === 0 ? 'Ground (0)' : currentFloor > 0 ? `Floor ${currentFloor}` : `Basement ${Math.abs(currentFloor)}`}
            </div>
            <div className="text-slate-300 text-sm">
              {currentFloor === 0 && 'Zero = reference point'}
              {currentFloor > 0 && `${currentFloor} above ground`}
              {currentFloor < 0 && `${Math.abs(currentFloor)} below ground`}
            </div>
          </div>

          {/* Key insight */}
          <div className="bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg p-3">
            <p className="text-sm text-slate-300">
              <strong className="text-purple-400">Insight:</strong> Negatives are real positions, just on the other side of zero. Basement floors exist!
            </p>
          </div>
        </>
      )}

      {mode === 'trip' && (
        <>
          {/* Trip selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Start</label>
              <select
                value={tripStart}
                onChange={(e) => setTripStart(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm"
              >
                {floors.map((f) => (
                  <option key={f} value={f}>{getFloorLabel(f)} ({f})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">End</label>
              <select
                value={tripEnd}
                onChange={(e) => setTripEnd(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm"
              >
                {floors.map((f) => (
                  <option key={f} value={f}>{getFloorLabel(f)} ({f})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trip result */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tripStart}-${tripEnd}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-800/70 rounded-xl p-4 text-center"
            >
              {/* Math formula */}
              <div className="text-lg font-mono mb-3">
                <span className="text-blue-400">{tripEnd}</span>
                <span className="text-slate-500"> − </span>
                <span className="text-orange-400">{tripStart}</span>
                <span className="text-slate-500"> = </span>
                <span className={`text-xl font-bold ${tripDistance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tripDistance >= 0 ? '+' : ''}{tripDistance}
                </span>
              </div>

              {/* Visual */}
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="text-center">
                  <div className="text-2xl">{tripStart >= 0 ? '🏢' : '📦'}</div>
                  <div className="text-xs text-slate-400">{getFloorLabel(tripStart)}</div>
                </div>

                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                  tripDistance > 0 ? 'bg-green-500/20 text-green-400' :
                  tripDistance < 0 ? 'bg-red-500/20 text-red-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {tripDistance > 0 && <ChevronUp size={14} />}
                  {tripDistance < 0 && <ChevronDown size={14} />}
                  <span className="font-bold">{Math.abs(tripDistance)}</span>
                </div>

                <div className="text-center">
                  <div className="text-2xl">{tripEnd >= 0 ? '🏢' : '📦'}</div>
                  <div className="text-xs text-slate-400">{getFloorLabel(tripEnd)}</div>
                </div>
              </div>

              <p className="text-slate-300 text-sm mt-2">
                {tripDistance === 0 ? (
                  "Same floor"
                ) : (
                  <>
                    <strong>{Math.abs(tripDistance)}</strong> floor{Math.abs(tripDistance) !== 1 ? 's' : ''}{' '}
                    <span className={tripDistance > 0 ? 'text-green-400' : 'text-red-400'}>
                      {tripDistance > 0 ? 'UP' : 'DOWN'}
                    </span>
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Key insight */}
          <div className="bg-cyan-500/10 border-l-4 border-cyan-500 rounded-r-lg p-3">
            <p className="text-sm text-slate-300">
              <strong className="text-cyan-400">Subtraction:</strong> Sign = direction, number = distance.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
