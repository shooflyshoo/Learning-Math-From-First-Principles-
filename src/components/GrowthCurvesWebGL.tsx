import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls, Html } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Curves() {
  const marker = useRef<THREE.Mesh>(null);

  const linear = useMemo(() => Array.from({ length: 60 }, (_, i) => [i * 0.08, i * 0.04, 0] as [number, number, number]), []);
  const poly = useMemo(() => Array.from({ length: 60 }, (_, i) => [i * 0.08, (i * i) * 0.0012, 0] as [number, number, number]), []);
  const expo = useMemo(() => Array.from({ length: 60 }, (_, i) => [i * 0.08, Math.min(2.6, Math.pow(1.11, i) * 0.05), 0] as [number, number, number]), []);

  useFrame((state) => {
    if (!marker.current) return;
    const t = (Math.sin(state.clock.elapsedTime) + 1) / 2;
    const idx = Math.floor(t * (expo.length - 1));
    const [x, y] = expo[idx];
    marker.current.position.set(x, y, 0);
  });

  return (
    <>
      <Line points={[[-0.2, 0, 0], [5, 0, 0]]} color="#334155" />
      <Line points={[[0, -0.05, 0], [0, 2.8, 0]]} color="#334155" />
      <Line points={linear} color="#60a5fa" lineWidth={2} />
      <Line points={poly} color="#facc15" lineWidth={2} />
      <Line points={expo} color="#f87171" lineWidth={2.6} />

      <mesh ref={marker}>
        <sphereGeometry args={[0.07, 18, 18]} />
        <meshStandardMaterial color="#f87171" emissive="#f87171" emissiveIntensity={0.4} />
      </mesh>

      <Html position={[4.7, 0.2, 0]} distanceFactor={10}><div className="webgl-label">time</div></Html>
      <Html position={[0.2, 2.7, 0]} distanceFactor={10}><div className="webgl-label">value</div></Html>
    </>
  );
}

export default function GrowthCurvesWebGL() {
  return (
    <div className="growth-webgl-shell">
      <Canvas camera={{ position: [2.4, 1.4, 5], fov: 42 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.1} />
        <Curves />
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI * 0.55} minPolarAngle={Math.PI * 0.45} />
      </Canvas>
      <div className="growth-webgl-legend">
        <span className="text-blue-300">linear</span>
        <span className="text-yellow-300">polynomial</span>
        <span className="text-red-300">exponential</span>
      </div>
    </div>
  );
}
