import { useMemo, useState } from 'react';
import { Line, OrbitControls, Text, Billboard } from '@react-three/drei';
import SceneStage from './SceneStage';

function Hyperbola({ aSq, positive = true, color }: { aSq: number; positive?: boolean; color: string }) {
  const pts = useMemo(() => {
    const arr: [number, number, number][] = [];
    const a = Math.sqrt(Math.abs(aSq));
    if (aSq > 0) {
      // timelike: ct^2 - x^2 = a^2, so ct = ±sqrt(x^2 + a^2)
      for (let x = -3; x <= 3; x += 0.05) {
        const ct = positive ? Math.sqrt(x * x + a * a) : -Math.sqrt(x * x + a * a);
        arr.push([x, ct, 0]);
      }
    } else if (aSq < 0) {
      // spacelike: x^2 - ct^2 = a^2
      for (let ct = -3; ct <= 3; ct += 0.05) {
        const x = positive ? Math.sqrt(ct * ct + a * a) : -Math.sqrt(ct * ct + a * a);
        arr.push([x, ct, 0]);
      }
    }
    return arr;
  }, [aSq, positive]);
  return <Line points={pts} color={color} lineWidth={2} transparent opacity={0.9} />;
}

function Lightcone() {
  return (
    <>
      <Line points={[[-3, -3, 0], [3, 3, 0]]} color="#fde68a" lineWidth={1.5} />
      <Line points={[[-3, 3, 0], [3, -3, 0]]} color="#fde68a" lineWidth={1.5} />
    </>
  );
}

function BoostedAxes({ beta }: { beta: number }) {
  // Lorentz-boosted t' and x' axes (rapidity phi where tanh(phi) = beta)
  const phi = Math.atanh(Math.max(-0.99, Math.min(0.99, beta)));
  const cosh = Math.cosh(phi);
  const sinh = Math.sinh(phi);
  // t' axis direction = (sinh, cosh)
  const tEnd: [number, number, number] = [sinh * 2.8, cosh * 2.8, 0];
  const xEnd: [number, number, number] = [cosh * 2.8, sinh * 2.8, 0];
  return (
    <>
      <Line points={[[0, 0, 0], tEnd]} color="#c4b5fd" lineWidth={3} />
      <Line points={[[0, 0, 0], xEnd]} color="#7dd3fc" lineWidth={3} />
      <Billboard position={[tEnd[0] + 0.2, tEnd[1] + 0.1, 0]}>
        <Text fontSize={0.22} color="#c4b5fd">ct'</Text>
      </Billboard>
      <Billboard position={[xEnd[0] + 0.2, xEnd[1] + 0.1, 0]}>
        <Text fontSize={0.22} color="#7dd3fc">x'</Text>
      </Billboard>
    </>
  );
}

function LabAxes() {
  return (
    <>
      <Line points={[[0, 0, 0], [3, 0, 0]]} color="#475569" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, 3, 0]]} color="#475569" lineWidth={2} />
      <Billboard position={[3.1, 0, 0]}>
        <Text fontSize={0.22} color="#94a3b8">x</Text>
      </Billboard>
      <Billboard position={[0, 3.1, 0]}>
        <Text fontSize={0.22} color="#94a3b8">ct</Text>
      </Billboard>
    </>
  );
}

function Event({ x, ct, beta }: { x: number; ct: number; beta: number }) {
  // Compute boosted coordinates for display
  const phi = Math.atanh(Math.max(-0.99, Math.min(0.99, beta)));
  const xPrime = Math.cosh(phi) * x - Math.sinh(phi) * ct;
  const ctPrime = -Math.sinh(phi) * x + Math.cosh(phi) * ct;
  const invariant = ct * ct - x * x;
  return (
    <group>
      <mesh position={[x, ct, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={1} />
      </mesh>
      <Billboard position={[x + 0.25, ct + 0.25, 0]}>
        <Text fontSize={0.18} color="#fde68a" anchorX="left">
          {`lab: (x=${x.toFixed(2)}, ct=${ct.toFixed(2)})`}
        </Text>
      </Billboard>
      <Billboard position={[x + 0.25, ct - 0.1, 0]}>
        <Text fontSize={0.16} color="#7dd3fc" anchorX="left">
          {`boosted: (x'=${xPrime.toFixed(2)}, ct'=${ctPrime.toFixed(2)})`}
        </Text>
      </Billboard>
      <Billboard position={[x + 0.25, ct - 0.42, 0]}>
        <Text fontSize={0.18} color={invariant > 0 ? '#86efac' : '#f472b6'} anchorX="left">
          {`s² = ${invariant.toFixed(3)}  (invariant)`}
        </Text>
      </Billboard>
    </group>
  );
}

export default function MinkowskiLightcone() {
  const [beta, setBeta] = useState(0);
  const [ex, setEx] = useState(1.2);
  const [ect, setEct] = useState(2.0);

  return (
    <div className="minkowski">
      <div className="minkowski-controls">
        <label>
          <span>β = v/c = {beta.toFixed(2)}</span>
          <input
            type="range"
            min={-0.95}
            max={0.95}
            step={0.01}
            value={beta}
            onChange={(e) => setBeta(Number(e.target.value))}
          />
        </label>
        <label>
          <span>event x = {ex.toFixed(2)}</span>
          <input
            type="range"
            min={-2.5}
            max={2.5}
            step={0.05}
            value={ex}
            onChange={(e) => setEx(Number(e.target.value))}
          />
        </label>
        <label>
          <span>event ct = {ect.toFixed(2)}</span>
          <input
            type="range"
            min={-2.5}
            max={2.5}
            step={0.05}
            value={ect}
            onChange={(e) => setEct(Number(e.target.value))}
          />
        </label>
      </div>

      <SceneStage aspect={1} bloom={0.9}>
        <Lightcone />
        <Hyperbola aSq={1} color="#86efac" />
        <Hyperbola aSq={1} positive={false} color="#86efac" />
        <Hyperbola aSq={-1} color="#f472b6" />
        <Hyperbola aSq={-1} positive={false} color="#f472b6" />
        <LabAxes />
        <BoostedAxes beta={beta} />
        <Event x={ex} ct={ect} beta={beta} />
        <OrbitControls enablePan={false} enableRotate={false} minDistance={5} maxDistance={12} makeDefault />
      </SceneStage>

      <p className="minkowski-caption">
        The yellow diagonals are the light cone. Two observers (lab axes in
        grey, boosted axes in blue/purple) disagree about x and ct, but
        <em> every</em> observer measures the same invariant{' '}
        <code>s² = c²t² − x²</code>. Timelike hyperbolas (green) have s² &gt; 0,
        spacelike (pink) have s² &lt; 0. At β = 0 the boosted axes coincide with
        the lab axes.
      </p>
    </div>
  );
}
