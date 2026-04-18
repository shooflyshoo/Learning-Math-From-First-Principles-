import { useMemo, useState } from 'react';
import { Line, OrbitControls, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import SceneStage from './SceneStage';

function GridPlane() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(12, 24, '#1e293b', '#0f172a');
    g.rotation.x = 0;
    g.position.y = -0.01;
    return g;
  }, []);
  return <primitive object={grid} />;
}

function Axis({ dir, color, label }: { dir: THREE.Vector3; color: string; label: string }) {
  const end = dir.clone().multiplyScalar(5.5);
  return (
    <>
      <Line points={[[0, 0, 0], [end.x, end.y, end.z]]} color={color} lineWidth={1.5} />
      <Billboard position={[end.x, end.y, 0]}>
        <Text fontSize={0.22} color={color} anchorX="left" anchorY="middle">
          {label}
        </Text>
      </Billboard>
    </>
  );
}

function Dot({ position, color, label }: { position: THREE.Vector3; color: string; label?: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
        />
      </mesh>
      {label && (
        <Billboard position={[0.2, 0.2, 0]}>
          <Text fontSize={0.18} color={color} anchorX="left">
            {label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function Triangle({ a, b, color, opacity = 0.25 }: { a: number; b: number; color: string; opacity?: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(a, 0);
    s.lineTo(0, b);
    s.closePath();
    return s;
  }, [a, b]);
  return (
    <mesh>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ConstructionScene({ a, b }: { a: number; b: number }) {
  const ab = a * b;
  const horizontal = new THREE.Vector3(1, 0, 0);
  const vertical = new THREE.Vector3(0, 1, 0);

  const X1 = new THREE.Vector3(1, 0, 0);
  const Xa = new THREE.Vector3(a, 0, 0);
  const Yb = new THREE.Vector3(0, b, 0);
  const Yab = new THREE.Vector3(0, ab, 0);

  return (
    <>
      <GridPlane />
      <Axis dir={horizontal} color="#7dd3fc" label="horizontal" />
      <Axis dir={vertical} color="#c4b5fd" label="vertical" />

      {/* small triangle (X1 → Yb) */}
      <Triangle a={1} b={b} color="#fde68a" opacity={0.35} />
      {/* large triangle (Xa → Yab) */}
      <Triangle a={a} b={ab} color="#7dd3fc" opacity={0.22} />

      {/* connector from X1 to Yb */}
      <Line
        points={[
          [1, 0, 0],
          [0, b, 0],
        ]}
        color="#fde68a"
        lineWidth={2}
      />
      {/* parallel through Xa to Yab */}
      <Line
        points={[
          [a, 0, 0],
          [0, ab, 0],
        ]}
        color="#7dd3fc"
        lineWidth={2}
      />
      {/* rise from Xa to (a,ab) projection is not directly drawn but highlight the result */}
      <Line
        points={[
          [0, 0, 0],
          [a, 0, 0],
        ]}
        color="#22d3ee"
        lineWidth={4}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, ab, 0],
        ]}
        color="#f472b6"
        lineWidth={4}
      />

      <Dot position={X1} color="#fde68a" label="X₁" />
      <Dot position={Xa} color="#22d3ee" label={`X_a = ${a.toFixed(2)}`} />
      <Dot position={Yb} color="#fde68a" label={`Y_b = ${b.toFixed(2)}`} />
      <Dot position={Yab} color="#f472b6" label={`Y = a·b = ${ab.toFixed(2)}`} />

      <OrbitControls
        enablePan={false}
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.01}
        minDistance={4}
        maxDistance={16}
      />
    </>
  );
}

export default function SimilarTriangleMultiplier() {
  const [a, setA] = useState(2.3);
  const [b, setB] = useState(1.7);

  return (
    <div className="similar-triangle">
      <div className="similar-triangle-controls">
        <label>
          <span>a = {a.toFixed(2)}</span>
          <input
            type="range"
            min={0.2}
            max={4.5}
            step={0.05}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
          />
        </label>
        <label>
          <span>b = {b.toFixed(2)}</span>
          <input
            type="range"
            min={0.2}
            max={2.5}
            step={0.05}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
          />
        </label>
        <div className="similar-triangle-readout">
          <strong>a × b =</strong>
          <span>{(a * b).toFixed(3)}</span>
        </div>
      </div>

      <SceneStage aspect={4 / 3} bloom={0.7}>
        <ConstructionScene a={a} b={b} />
      </SceneStage>

      <p className="similar-triangle-caption">
        Two rays from the origin. Unit at X₁, magnitude <em>a</em> at X_a,
        magnitude <em>b</em> at Y_b. Connect X₁→Y_b, draw the parallel through
        X_a — it lands at height <em>a·b</em> on the vertical ray. This is
        multiplication as similar-triangle geometry, not repeated addition.
      </p>
    </div>
  );
}
