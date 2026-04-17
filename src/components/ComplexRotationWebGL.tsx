import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function RotatingVector() {
  const group = useRef<THREE.Group>(null);
  const unitCircle = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => {
        const t = (i / 120) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(t) * 1.8, Math.sin(t) * 1.8, 0);
      }),
    [],
  );

  useFrame((state) => {
    const theta = state.clock.elapsedTime * 0.8;
    if (group.current) {
      group.current.rotation.z = theta;
    }
  });

  return (
    <>
      <Line points={unitCircle} color="#64748b" lineWidth={1} />
      <Line points={[[-2.2, 0, 0], [2.2, 0, 0]]} color="#334155" lineWidth={1} />
      <Line points={[[0, -2.2, 0], [0, 2.2, 0]]} color="#334155" lineWidth={1} />

      <group ref={group}>
        <Line points={[[0, 0, 0], [1.8, 0, 0]]} color="#22d3ee" lineWidth={2.2} />
        <mesh position={[1.8, 0, 0]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
          <Html distanceFactor={10} position={[0, 0.2, 0]}>
            <div className="webgl-label">z</div>
          </Html>
        </mesh>
      </group>

      <Html position={[0, -2.4, 0]} center distanceFactor={10}>
        <div className="complex-angle-pill">multiply by i rotates the vector by 90° each turn</div>
      </Html>
    </>
  );
}

export default function ComplexRotationWebGL() {
  return (
    <div className="complex-webgl-shell">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 3]} intensity={0.9} />
        <RotatingVector />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
