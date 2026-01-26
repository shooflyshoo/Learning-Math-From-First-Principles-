import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (floor === 0) return 'Lobby (Ground)';
    if (floor > 0) return `Floor ${floor}`;
    return `Basement ${Math.abs(floor)}`;
  };

  const getFloorIcon = (floor: number) => {
    if (floor === 0) return '🚪';
    if (floor > 0) return '🏢';
    return '📦';
  };

  return (
    <div className="interactive-container">
      <h3 className="text-xl font-semibold text-blue-400 mb-6">
        The Building Floors Analogy (Understanding Negative Numbers)
      </h3>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('explore')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mode === 'explore' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Explore Floors
        </button>
        <button
          onClick={() => setMode('trip')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mode === 'trip' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Trip Calculator
        </button>
      </div>

      <div className="flex gap-8">
        {/* Building visualization */}
        <div className="relative flex-shrink-0">
          <div className="flex flex-col-reverse">
            {floors.map((floor) => (
              <motion.div
                key={floor}
                className={`w-48 h-14 border-2 flex items-center justify-between px-4 cursor-pointer transition-all ${
                  getFloorStyle(floor)
                } ${currentFloor === floor ? 'ring-2 ring-white/50' : ''}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  if (mode === 'explore') {
                    setCurrentFloor(floor);
                  }
                }}
              >
                <span className="text-2xl">{getFloorIcon(floor)}</span>
                <span className={`font-mono text-lg ${
                  floor === 0 ? 'text-yellow-400' : floor > 0 ? 'text-blue-400' : 'text-orange-400'
                }`}>
                  {floor >= 0 ? floor : floor}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Ground level indicator */}
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-8 h-0.5 bg-yellow-500" />
            <span className="ml-2 text-yellow-500 text-sm">Ground Level</span>
          </div>

          {/* Elevator */}
          <motion.div
            className="absolute left-0 w-full h-14 bg-slate-600/50 border-2 border-slate-400 flex items-center justify-center"
            initial={false}
            animate={{
              bottom: `${(currentFloor + 3) * 56}px`,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <span className="text-2xl">🛗</span>
            <span className="ml-2 font-mono text-slate-200">Floor {currentFloor}</span>
          </motion.div>
        </div>

        {/* Info panel */}
        <div className="flex-1">
          {mode === 'explore' && (
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">Current Location</h4>
                <div className="text-3xl font-mono mb-2">
                  <span className={currentFloor >= 0 ? 'text-blue-400' : 'text-orange-400'}>
                    {getFloorLabel(currentFloor)}
                  </span>
                </div>
                <p className="text-slate-400">
                  {currentFloor === 0 && 'The reference point - ground level (zero)'}
                  {currentFloor > 0 && `${currentFloor} floors above the lobby`}
                  {currentFloor < 0 && `${Math.abs(currentFloor)} floors below the lobby`}
                </p>
              </div>

              <div className="bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg p-4">
                <p className="text-sm text-slate-300">
                  <strong className="text-purple-400">Key Insight:</strong> Negative numbers aren't
                  "less than nothing"—they're just on the other side of zero. Basement floors are
                  real floors! They just happen to be below your reference point.
                </p>
              </div>

              {/* Floor buttons */}
              <div className="flex flex-wrap gap-2">
                {floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setCurrentFloor(floor)}
                    className={`px-3 py-2 rounded-lg font-mono transition-all ${
                      currentFloor === floor
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {floor >= 0 ? floor : floor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'trip' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Start Floor</label>
                  <select
                    value={tripStart}
                    onChange={(e) => setTripStart(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
                  >
                    {floors.map((f) => (
                      <option key={f} value={f}>{getFloorLabel(f)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">End Floor</label>
                  <select
                    value={tripEnd}
                    onChange={(e) => setTripEnd(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
                  >
                    {floors.map((f) => (
                      <option key={f} value={f}>{getFloorLabel(f)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${tripStart}-${tripEnd}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-700/30 rounded-lg p-4"
                >
                  <div className="text-2xl font-mono text-center mb-4">
                    <span className="text-blue-400">{tripEnd}</span>
                    <span className="text-slate-400"> − </span>
                    <span className="text-orange-400">{tripStart}</span>
                    <span className="text-slate-400"> = </span>
                    <span className={tripDistance >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {tripDistance >= 0 ? '+' : ''}{tripDistance}
                    </span>
                  </div>

                  <p className="text-center text-slate-300">
                    You traveled <strong>{Math.abs(tripDistance)}</strong> floor{Math.abs(tripDistance) !== 1 ? 's' : ''}{' '}
                    <span className={tripDistance >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {tripDistance > 0 ? 'UP ↑' : tripDistance < 0 ? 'DOWN ↓' : '(no movement)'}
                    </span>
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg p-4">
                <p className="text-sm text-slate-300">
                  <strong className="text-blue-400">Subtraction = Finding the Difference:</strong>{' '}
                  End position minus start position tells you how far and which direction you moved.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
