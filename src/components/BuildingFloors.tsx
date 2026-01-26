import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function BuildingFloors() {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [tripStart, setTripStart] = useState(0);
  const [tripEnd, setTripEnd] = useState(0);
  const [mode, setMode] = useState<'explore' | 'trip'>('explore');

  const floors = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
  const tripDistance = tripEnd - tripStart;

  const getFloorStyle = (floor: number) => {
    if (floor === 0) return 'bg-yellow-500/30 border-yellow-500';
    if (floor > 0) return 'bg-blue-500/20 border-blue-500/50';
    return 'bg-orange-500/20 border-orange-500/50';
  };

  const getFloorLabel = (floor: number) => {
    if (floor === 0) return 'Lobby';
    if (floor > 0) return `Floor ${floor}`;
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
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('explore')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'explore' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setMode('trip')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'trip' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Trip Calculator
        </button>
      </div>

      {mode === 'explore' && (
        <div className="space-y-4">
          {/* Building - mobile optimized */}
          <div className="relative mx-auto" style={{ maxWidth: '280px' }}>
            {/* Floors */}
            <div className="flex flex-col-reverse">
              {floors.map((floor) => (
                <motion.button
                  key={floor}
                  className={`w-full h-11 border-2 flex items-center justify-between px-3 transition-all ${
                    getFloorStyle(floor)
                  } ${currentFloor === floor ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentFloor(floor)}
                >
                  <span className="text-lg">
                    {floor === 0 ? '🚪' : floor > 0 ? '🏢' : '📦'}
                  </span>
                  <span className="font-medium text-sm">{getFloorLabel(floor)}</span>
                  <span className={`font-mono text-lg font-bold ${
                    floor === 0 ? 'text-yellow-400' : floor > 0 ? 'text-blue-400' : 'text-orange-400'
                  }`}>
                    {floor}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Ground level marker */}
            <div className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 pl-2 hidden sm:flex items-center">
              <div className="w-4 h-0.5 bg-yellow-500" />
              <span className="ml-1 text-yellow-500 text-xs whitespace-nowrap">Ground</span>
            </div>

            {/* Elevator overlay */}
            <motion.div
              className="absolute left-0 right-0 h-11 bg-slate-500/30 border-2 border-cyan-400 pointer-events-none flex items-center justify-center"
              initial={false}
              animate={{
                bottom: `${(currentFloor + 3) * 44}px`,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
              <span className="text-xl">🛗</span>
            </motion.div>
          </div>

          {/* Up/Down controls for mobile */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => moveFloor('up')}
              disabled={currentFloor >= 5}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              <ChevronUp size={20} /> Up
            </button>
            <button
              onClick={() => moveFloor('down')}
              disabled={currentFloor <= -3}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              <ChevronDown size={20} /> Down
            </button>
          </div>

          {/* Current floor info */}
          <div className="bg-slate-800/70 rounded-xl p-4 text-center">
            <div className="text-sm text-slate-400 mb-1">You are at</div>
            <div className={`text-3xl font-bold mb-2 ${
              currentFloor === 0 ? 'text-yellow-400' : currentFloor > 0 ? 'text-blue-400' : 'text-orange-400'
            }`}>
              {currentFloor === 0 ? 'Ground Level (0)' : currentFloor > 0 ? `Floor ${currentFloor}` : `Basement ${Math.abs(currentFloor)}`}
            </div>
            <div className="text-slate-300 text-sm">
              {currentFloor === 0 && 'The reference point — this is zero'}
              {currentFloor > 0 && `${currentFloor} floor${currentFloor > 1 ? 's' : ''} above ground`}
              {currentFloor < 0 && `${Math.abs(currentFloor)} floor${Math.abs(currentFloor) > 1 ? 's' : ''} below ground`}
            </div>
          </div>

          {/* Insight */}
          <div className="bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg p-4">
            <p className="text-sm text-slate-300">
              <strong className="text-purple-400">Key Insight:</strong> Negative numbers aren't
              "less than nothing" — they're real positions on the other side of zero.
              Basement floors exist! They're just below your reference point.
            </p>
          </div>
        </div>
      )}

      {mode === 'trip' && (
        <div className="space-y-4">
          {/* Trip selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">From</label>
              <select
                value={tripStart}
                onChange={(e) => setTripStart(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm"
              >
                {floors.map((f) => (
                  <option key={f} value={f}>{getFloorLabel(f)} ({f})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">To</label>
              <select
                value={tripEnd}
                onChange={(e) => setTripEnd(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm"
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
              className="bg-slate-800/70 rounded-xl p-5"
            >
              {/* Math expression */}
              <div className="text-xl font-mono text-center mb-4">
                <span className="text-blue-400">{tripEnd}</span>
                <span className="text-slate-500"> − </span>
                <span className="text-orange-400">{tripStart}</span>
                <span className="text-slate-500"> = </span>
                <span className={`text-2xl font-bold ${tripDistance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tripDistance >= 0 ? '+' : ''}{tripDistance}
                </span>
              </div>

              {/* Visual result */}
              <div className="flex items-center justify-center gap-3 py-3">
                <div className="text-center">
                  <div className="text-3xl mb-1">{tripStart >= 0 ? '🏢' : '📦'}</div>
                  <div className="text-xs text-slate-400">{getFloorLabel(tripStart)}</div>
                </div>

                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  tripDistance > 0 ? 'bg-green-500/20 text-green-400' :
                  tripDistance < 0 ? 'bg-red-500/20 text-red-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {tripDistance > 0 && <ChevronUp size={16} />}
                  {tripDistance < 0 && <ChevronDown size={16} />}
                  <span className="font-bold">{Math.abs(tripDistance)}</span>
                </div>

                <div className="text-center">
                  <div className="text-3xl mb-1">{tripEnd >= 0 ? '🏢' : '📦'}</div>
                  <div className="text-xs text-slate-400">{getFloorLabel(tripEnd)}</div>
                </div>
              </div>

              <p className="text-center text-slate-300 text-sm mt-2">
                {tripDistance === 0 ? (
                  "You stayed on the same floor"
                ) : (
                  <>
                    You traveled <strong>{Math.abs(tripDistance)}</strong> floor{Math.abs(tripDistance) !== 1 ? 's' : ''}{' '}
                    <span className={tripDistance > 0 ? 'text-green-400' : 'text-red-400'}>
                      {tripDistance > 0 ? 'UP' : 'DOWN'}
                    </span>
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Insight */}
          <div className="bg-cyan-500/10 border-l-4 border-cyan-500 rounded-r-lg p-4">
            <p className="text-sm text-slate-300">
              <strong className="text-cyan-400">Subtraction = Direction + Distance:</strong>{' '}
              The sign tells you which way, the number tells you how far.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
