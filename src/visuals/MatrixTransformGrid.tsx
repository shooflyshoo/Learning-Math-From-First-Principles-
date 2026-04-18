import { useMemo, useState } from 'react';
import { Line, OrbitControls, Text, Billboard } from '@react-three/drei';
import SceneStage from './SceneStage';

type Matrix2 = [number, number, number, number]; // [a, b, c, d] for row-major

const PRESETS: { id: string; label: string; m: Matrix2 }[] = [
  { id: 'identity', label: 'Identity', m: [1, 0, 0, 1] },
  { id: 'rotate', label: 'Rotation 45°', m: [Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4), Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)] },
  { id: 'scale', label: 'Scale (2, 0.5)', m: [2, 0, 0, 0.5] },
  { id: 'shear', label: 'Shear (x+=0.7y)', m: [1, 0.7, 0, 1] },
  { id: 'reflect', label: 'Reflect across y=x', m: [0, 1, 1, 0] },
  { id: 'negate', label: 'Multiply by -1', m: [-1, 0, 0, -1] },
];

function apply(m: Matrix2, x: number, y: number): [number, number] {
  const [a, b, c, d] = m;
  return [a * x + b * y, c * x + d * y];
}

function TransformedGrid({ m, t }: { m: Matrix2; t: number }) {
  const lines = useMemo(() => {
    const size = 4;
    const segments: [number, number, number][][] = [];
    // lerp identity -> m
    const I: Matrix2 = [1, 0, 0, 1];
    const mix: Matrix2 = [
      I[0] + (m[0] - I[0]) * t,
      I[1] + (m[1] - I[1]) * t,
      I[2] + (m[2] - I[2]) * t,
      I[3] + (m[3] - I[3]) * t,
    ];
    for (let i = -size; i <= size; i++) {
      const col: [number, number, number][] = [];
      const row: [number, number, number][] = [];
      for (let j = -size; j <= size; j += 0.2) {
        const [cx, cy] = apply(mix, i, j);
        col.push([cx, cy, 0]);
        const [rx, ry] = apply(mix, j, i);
        row.push([rx, ry, 0]);
      }
      segments.push(col);
      segments.push(row);
    }
    return segments;
  }, [m, t]);

  return (
    <group>
      {lines.map((seg, i) => (
        <Line
          key={i}
          points={seg}
          color={i % 2 === 0 ? '#334155' : '#1e293b'}
          lineWidth={1}
          transparent
          opacity={0.75}
        />
      ))}
    </group>
  );
}

function BasisVectors({ m, t }: { m: Matrix2; t: number }) {
  const I: Matrix2 = [1, 0, 0, 1];
  const mix: Matrix2 = [
    I[0] + (m[0] - I[0]) * t,
    I[1] + (m[1] - I[1]) * t,
    I[2] + (m[2] - I[2]) * t,
    I[3] + (m[3] - I[3]) * t,
  ];
  const [ix, iy] = apply(mix, 1, 0);
  const [jx, jy] = apply(mix, 0, 1);
  return (
    <>
      <Line points={[[0, 0, 0], [ix, iy, 0]]} color="#7dd3fc" lineWidth={4} />
      <mesh position={[ix, iy, 0]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={1} />
      </mesh>
      <Line points={[[0, 0, 0], [jx, jy, 0]]} color="#f472b6" lineWidth={4} />
      <mesh position={[jx, jy, 0]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
      </mesh>
      <Billboard position={[ix + 0.2, iy + 0.2, 0]}>
        <Text fontSize={0.2} color="#7dd3fc">î' = ({ix.toFixed(2)}, {iy.toFixed(2)})</Text>
      </Billboard>
      <Billboard position={[jx + 0.2, jy + 0.2, 0]}>
        <Text fontSize={0.2} color="#f472b6">ĵ' = ({jx.toFixed(2)}, {jy.toFixed(2)})</Text>
      </Billboard>
    </>
  );
}

function Shape({ m, t }: { m: Matrix2; t: number }) {
  // Unit square -> transformed parallelogram
  const corners: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const I: Matrix2 = [1, 0, 0, 1];
  const mix: Matrix2 = [
    I[0] + (m[0] - I[0]) * t,
    I[1] + (m[1] - I[1]) * t,
    I[2] + (m[2] - I[2]) * t,
    I[3] + (m[3] - I[3]) * t,
  ];
  const transformed = corners.map(([x, y]) => apply(mix, x, y));
  const pts: [number, number, number][] = transformed.map(([x, y]) => [x, y, 0]);
  pts.push(pts[0]);
  const det = mix[0] * mix[3] - mix[1] * mix[2];

  return (
    <>
      <Line points={pts} color="#fde68a" lineWidth={2} />
      <Billboard position={[transformed[2][0] * 0.4, transformed[2][1] * 0.4, 0]}>
        <Text fontSize={0.22} color={det < 0 ? '#f472b6' : '#fde68a'}>
          det = {det.toFixed(3)}
          {det < 0 ? '  (orientation flipped)' : ''}
        </Text>
      </Billboard>
    </>
  );
}

function BackgroundAxes() {
  return (
    <>
      <Line points={[[-4, 0, 0], [4, 0, 0]]} color="#475569" lineWidth={1} />
      <Line points={[[0, -4, 0], [0, 4, 0]]} color="#475569" lineWidth={1} />
    </>
  );
}

export default function MatrixTransformGrid() {
  const [presetId, setPresetId] = useState(PRESETS[1].id);
  const [t, setT] = useState(1);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const m = preset.m;

  return (
    <div className="matrix-grid">
      <div className="matrix-grid-controls">
        <label>
          <span>Transformation</span>
          <select value={presetId} onChange={(e) => setPresetId(e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>interpolate {t.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
          />
        </label>
        <div className="matrix-display">
          <span>matrix</span>
          <pre>
            {`[ ${m[0].toFixed(2)}  ${m[1].toFixed(2)} ]\n[ ${m[2].toFixed(2)}  ${m[3].toFixed(2)} ]`}
          </pre>
        </div>
      </div>

      <SceneStage aspect={1} bloom={0.7}>
        <BackgroundAxes />
        <TransformedGrid m={m} t={t} />
        <Shape m={m} t={t} />
        <BasisVectors m={m} t={t} />
        <OrbitControls
          enablePan={false}
          enableRotate={false}
          minDistance={6}
          maxDistance={14}
          makeDefault
        />
      </SceneStage>

      <p className="matrix-caption">
        A matrix is an <em>action</em> on space. Drag the interpolator to morph the
        identity into the chosen transformation. The basis vectors î and ĵ carry the
        whole grid with them; the determinant records area change and orientation flip.
      </p>
    </div>
  );
}
