import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function WrapScene() {
  const pointer = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLDivElement>(null);

  useFrame((state) => {
    const value = Math.floor(state.clock.elapsedTime * 2.2) % 24;
    const mod = value % 12;
    const angle = (mod / 12) * Math.PI * 2;
    if (pointer.current) {
      pointer.current.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
    }
    if (label.current) {
      label.current.innerText = `${value} ≡ ${mod} (mod 12)`;
    }
  });

  return (
    <>
      <mesh>
        <ringGeometry args={[1.5, 1.7, 80]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <Html key={i} position={[Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0]} distanceFactor={12} center>
            <div className="mod-label">{i}</div>
          </Html>
        );
      })}
      <mesh ref={pointer}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.45} />
      </mesh>
      <Html position={[0, -2.5, 0]} center distanceFactor={10}>
        <div className="complex-angle-pill" ref={label}>0 ≡ 0 (mod 12)</div>
      </Html>
    </>
  );
}

export default function ModularWrapWebGL() {
  return (
    <div className="mod-webgl-shell">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={0.9} />
        <WrapScene />
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
