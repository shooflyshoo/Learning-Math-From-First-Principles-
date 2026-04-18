import { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import * as THREE from 'three';
import SceneStage from './SceneStage';

const PRESETS = [
  {
    id: 'eq',
    label: 'Equal ratios 2 : 3 = 4 : 6',
    A: 2,
    B: 3,
    C: 4,
    D: 6,
  },
  {
    id: 'irr',
    label: 'Diagonal : side of unit square  (√2 : 1)',
    A: Math.SQRT2,
    B: 1,
    C: Math.PI,
    D: Math.PI / Math.SQRT2,
  },
  {
    id: 'neq',
    label: 'Unequal  3 : 4  vs  4 : 5',
    A: 3,
    B: 4,
    C: 4,
    D: 5,
  },
];

function Tower({
  height,
  x,
  color,
  label,
}: {
  height: number;
  x: number;
  color: string;
  label: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      const target = Math.max(height, 0.02);
      const current = ref.current.scale.y;
      ref.current.scale.y = THREE.MathUtils.lerp(current, target, Math.min(1, dt * 8));
      ref.current.position.y = ref.current.scale.y / 2;
    }
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={[0.55, 1, 0.55]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      <Text
        position={[0, -0.3, 0.4]}
        fontSize={0.18}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 40, 40]} />
      <meshStandardMaterial color="#0b1224" roughness={1} metalness={0.05} />
    </mesh>
  );
}

function TowerScene({
  m,
  n,
  A,
  B,
  C,
  D,
}: {
  m: number;
  n: number;
  A: number;
  B: number;
  C: number;
  D: number;
}) {
  return (
    <>
      <Floor />
      <Tower height={m * A} x={-2.4} color="#7dd3fc" label={`m·A = ${(m * A).toFixed(2)}`} />
      <Tower height={n * B} x={-1.3} color="#fde68a" label={`n·B = ${(n * B).toFixed(2)}`} />
      <Tower height={m * C} x={1.3} color="#c4b5fd" label={`m·C = ${(m * C).toFixed(2)}`} />
      <Tower height={n * D} x={2.4} color="#fca5a5" label={`n·D = ${(n * D).toFixed(2)}`} />
      <Text position={[-1.85, 3.6, 0]} fontSize={0.28} color="#7dd3fc" anchorX="center">
        A : B
      </Text>
      <Text position={[1.85, 3.6, 0]} fontSize={0.28} color="#c4b5fd" anchorX="center">
        C : D
      </Text>
      <OrbitControls
        enablePan={false}
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={5}
        maxDistance={12}
      />
    </>
  );
}

export default function EudoxusTowers3D() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [m, setM] = useState(3);
  const [n, setN] = useState(4);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const { A, B, C, D } = preset;

  const signAB = m * A - n * B;
  const signCD = m * C - n * D;
  const verdictAB = Math.abs(signAB) < 1e-9 ? '=' : signAB > 0 ? '>' : '<';
  const verdictCD = Math.abs(signCD) < 1e-9 ? '=' : signCD > 0 ? '>' : '<';
  const matches = verdictAB === verdictCD;

  const probeCount = 25;
  const allMatch = useMemo(() => {
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        const a = i * A - j * B;
        const c = i * C - j * D;
        if (Math.sign(a) !== Math.sign(c)) return false;
      }
    }
    return true;
  }, [A, B, C, D]);

  return (
    <div className="eudoxus-3d">
      <div className="eudoxus-3d-controls">
        <label>
          <span>Scenario</span>
          <select value={presetId} onChange={(e) => setPresetId(e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>m = {m}</span>
          <input
            type="range"
            min={1}
            max={8}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
          />
        </label>
        <label>
          <span>n = {n}</span>
          <input
            type="range"
            min={1}
            max={8}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
        </label>
      </div>

      <SceneStage aspect={16 / 9} bloom={0.8}>
        <TowerScene m={m} n={n} A={A} B={B} C={C} D={D} />
      </SceneStage>

      <motion.div
        key={`${presetId}-${m}-${n}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`eudoxus-3d-verdict ${matches ? 'match' : 'mismatch'}`}
      >
        <div>
          <span className="verdict-pill">mA {verdictAB} nB</span>
          <span className="verdict-pill alt">mC {verdictCD} nD</span>
          <strong>
            {matches
              ? 'Verdicts agree — Eudoxus passes this probe.'
              : 'Verdicts disagree — Eudoxus rejects equality.'}
          </strong>
        </div>
        <small>
          Sweep 25 probes (1–5 × 1–5):{' '}
          <strong>
            {allMatch ? 'every verdict matched' : 'at least one probe disagrees'}
          </strong>
          . Probe count shown:{' '}
          <span title="Visible tower pair counts as one probe">{probeCount}</span>.
        </small>
      </motion.div>
    </div>
  );
}
