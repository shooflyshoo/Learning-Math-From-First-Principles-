import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

function NumberOrbit() {
  const group = useRef<THREE.Group>(null);
  const ring = useMemo(
    () => [
      { label: 'ℕ', radius: 1.8, color: '#34d399' },
      { label: 'ℤ', radius: 2.4, color: '#60a5fa' },
      { label: 'ℚ', radius: 3, color: '#facc15' },
      { label: 'ℝ', radius: 3.6, color: '#fb923c' },
      { label: 'ℂ', radius: 4.2, color: '#c084fc' },
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.06;
  });

  return (
    <group ref={group}>
      {ring.map((world, idx) => {
        const angle = (idx / ring.length) * Math.PI * 2;
        const x = Math.cos(angle) * world.radius;
        const z = Math.sin(angle) * world.radius;
        return (
          <Float speed={1.2 + idx * 0.2} rotationIntensity={0.25} floatIntensity={0.6} key={world.label}>
            <mesh position={[x, Math.sin(idx) * 0.25, z]}>
              <icosahedronGeometry args={[0.27 + idx * 0.02, 1]} />
              <meshStandardMaterial color={world.color} emissive={world.color} emissiveIntensity={0.2} roughness={0.2} />
              <Html center distanceFactor={10}>
                <div className="webgl-label">{world.label}</div>
              </Html>
            </mesh>
          </Float>
        );
      })}
      <mesh>
        <torusGeometry args={[2.9, 0.05, 16, 120]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function WebGLHero() {
  return (
    <div className="webgl-hero-shell">
      <Canvas camera={{ position: [0, 1.1, 6], fov: 50 }} dpr={[1, 1.8]}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.1} />
        <Suspense fallback={null}>
          <Stars radius={80} depth={30} count={2200} factor={4} saturation={0} fade speed={1} />
          <NumberOrbit />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI * 0.65} minPolarAngle={Math.PI * 0.35} />
      </Canvas>
      <div className="webgl-hero-caption">
        <p className="text-sm text-slate-300">
          Visual map: each glowing node is a number-world you unlock when a rule hits a boundary.
        </p>
      </div>
    </div>
  );
}
