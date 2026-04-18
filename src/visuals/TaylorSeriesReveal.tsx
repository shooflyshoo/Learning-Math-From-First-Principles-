import { useMemo, useState } from 'react';
import { Line, OrbitControls, Text, Billboard } from '@react-three/drei';
import SceneStage from './SceneStage';

type TargetId = 'sin' | 'exp' | 'cos' | 'log1p';

const TARGETS: Record<TargetId, { label: string; fn: (x: number) => number; taylor: (x: number, n: number) => number; formula: string }> = {
  sin: {
    label: 'f(x) = sin x',
    fn: (x) => Math.sin(x),
    taylor: (x, n) => {
      let sum = 0;
      for (let k = 0; k <= n; k++) {
        const sign = k % 2 === 0 ? 1 : -1;
        const power = 2 * k + 1;
        sum += (sign * Math.pow(x, power)) / factorial(power);
      }
      return sum;
    },
    formula: 'x − x³/6 + x⁵/120 − …',
  },
  cos: {
    label: 'f(x) = cos x',
    fn: (x) => Math.cos(x),
    taylor: (x, n) => {
      let sum = 0;
      for (let k = 0; k <= n; k++) {
        const sign = k % 2 === 0 ? 1 : -1;
        const power = 2 * k;
        sum += (sign * Math.pow(x, power)) / factorial(power);
      }
      return sum;
    },
    formula: '1 − x²/2 + x⁴/24 − …',
  },
  exp: {
    label: 'f(x) = eˣ',
    fn: (x) => Math.exp(x),
    taylor: (x, n) => {
      let sum = 0;
      for (let k = 0; k <= n; k++) sum += Math.pow(x, k) / factorial(k);
      return sum;
    },
    formula: '1 + x + x²/2 + x³/6 + …',
  },
  log1p: {
    label: 'f(x) = ln(1+x),  |x| < 1',
    fn: (x) => Math.log(1 + x),
    taylor: (x, n) => {
      let sum = 0;
      for (let k = 1; k <= n + 1; k++) {
        const sign = k % 2 === 1 ? 1 : -1;
        sum += (sign * Math.pow(x, k)) / k;
      }
      return sum;
    },
    formula: 'x − x²/2 + x³/3 − x⁴/4 + …',
  },
};

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function CurvesScene({ targetId, order }: { targetId: TargetId; order: number }) {
  const target = TARGETS[targetId];
  const domain = targetId === 'log1p' ? [-0.95, 0.95] : [-Math.PI, Math.PI];
  const [minX, maxX] = domain;

  const truePts = useMemo(() => {
    const arr: [number, number, number][] = [];
    const steps = 240;
    for (let i = 0; i <= steps; i++) {
      const x = minX + ((maxX - minX) * i) / steps;
      const y = target.fn(x);
      arr.push([x, y, 0]);
    }
    return arr;
  }, [minX, maxX, target]);

  const approxPts = useMemo(() => {
    const arr: [number, number, number][] = [];
    const steps = 240;
    for (let i = 0; i <= steps; i++) {
      const x = minX + ((maxX - minX) * i) / steps;
      const y = target.taylor(x, order);
      if (Math.abs(y) < 5) arr.push([x, y, 0]);
    }
    return arr;
  }, [minX, maxX, order, target]);

  return (
    <>
      <Line points={[[minX, 0, 0], [maxX, 0, 0]]} color="#475569" lineWidth={1} />
      <Line points={[[0, -3, 0], [0, 3, 0]]} color="#475569" lineWidth={1} />
      {/* Gridlines */}
      {[-2, -1, 1, 2].map((y) => (
        <Line
          key={y}
          points={[[minX, y, 0], [maxX, y, 0]]}
          color="#1e293b"
          lineWidth={1}
        />
      ))}
      <Line points={truePts} color="#fde68a" lineWidth={3} />
      <Line points={approxPts} color="#7dd3fc" lineWidth={3} />

      <Billboard position={[maxX * 0.9, target.fn(maxX * 0.9), 0]}>
        <Text fontSize={0.22} color="#fde68a">
          true
        </Text>
      </Billboard>
      <Billboard position={[maxX * 0.6, target.taylor(maxX * 0.6, order), 0]}>
        <Text fontSize={0.22} color="#7dd3fc">
          order {order}
        </Text>
      </Billboard>
      <OrbitControls enablePan={false} enableRotate={false} minDistance={4} maxDistance={10} makeDefault />
    </>
  );
}

export default function TaylorSeriesReveal() {
  const [targetId, setTargetId] = useState<TargetId>('sin');
  const [order, setOrder] = useState(2);
  const target = TARGETS[targetId];

  return (
    <div className="taylor-reveal">
      <div className="taylor-reveal-controls">
        <label>
          <span>Target function</span>
          <select value={targetId} onChange={(e) => setTargetId(e.target.value as TargetId)}>
            {Object.entries(TARGETS).map(([id, t]) => (
              <option key={id} value={id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>order = {order}</span>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </label>
        <div className="taylor-reveal-formula">
          <span>Taylor series around 0</span>
          <code>{target.formula}</code>
        </div>
      </div>

      <SceneStage aspect={16 / 9} bloom={0.6}>
        <CurvesScene targetId={targetId} order={order} />
      </SceneStage>

      <p className="taylor-caption">
        The <span style={{ color: '#fde68a' }}>true curve</span> is approximated by
        a polynomial whose coefficients come from derivatives at 0. Slide the order
        up — the <span style={{ color: '#7dd3fc' }}>approximation</span> peels
        outward from the origin, locking onto the true curve farther and farther
        from 0. Local information rebuilds the whole.
      </p>
    </div>
  );
}
