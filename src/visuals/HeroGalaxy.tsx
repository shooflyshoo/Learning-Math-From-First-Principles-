import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SceneStage from './SceneStage';

const WORLDS = [
  { label: 'ℕ', radius: 1.6, count: 400, color: '#7dd3fc' },
  { label: 'ℤ', radius: 2.4, count: 600, color: '#c4b5fd' },
  { label: 'ℚ', radius: 3.3, count: 900, color: '#fde68a' },
  { label: 'ℝ', radius: 4.3, count: 1400, color: '#fca5a5' },
  { label: 'ℂ', radius: 5.5, count: 2200, color: '#86efac' },
];

function WorldRing({
  radius,
  count,
  color,
  label,
  tilt,
  speed,
}: {
  radius: number;
  count: number;
  color: string;
  label: string;
  tilt: number;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * 0.25;
      const r = radius + jitter;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      positions[i * 3 + 2] = Math.sin(theta) * r;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
    return geo;
  }, [radius, count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uSize: { value: 14 },
    }),
    [color],
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    if (group.current) group.current.rotation.y += dt * speed;
    if (points.current) points.current.rotation.z += dt * speed * 0.2;
  });

  return (
    <group ref={group} rotation={[tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.004, 12, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} />
      </mesh>
      <points ref={points} geometry={geometry}>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            attribute float aOffset;
            uniform float uTime;
            uniform float uSize;
            varying float vAlpha;
            void main() {
              vec3 pos = position;
              pos.y += sin(uTime * 0.9 + aOffset) * 0.08;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              gl_PointSize = uSize * (300.0 / -mvPosition.z);
              vAlpha = 0.55 + 0.45 * sin(uTime * 1.4 + aOffset);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
              vec2 uv = gl_PointCoord - 0.5;
              float d = length(uv);
              float a = smoothstep(0.5, 0.0, d);
              gl_FragColor = vec4(uColor, a * vAlpha);
            }
          `}
          uniforms={uniforms}
        />
      </points>
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[radius, 0, 0]}>
          <icosahedronGeometry args={[0.2, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.9}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>
        <Text
          position={[radius, 0.35, 0]}
          fontSize={0.28}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineColor="#06091a"
          outlineWidth={0.01}
        >
          {label}
        </Text>
      </Float>
    </group>
  );
}

function CoreOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.35;
      mesh.current.rotation.x += dt * 0.12;
    }
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.55, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#8be1ff"
        emissiveIntensity={1.2}
        roughness={0.15}
        metalness={0.5}
      />
    </mesh>
  );
}

function StarField() {
  const count = 1800;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      a[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      a[i * 3 + 2] = r * Math.cos(phi);
    }
    return a;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#e2e8f0"
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroGalaxy() {
  return (
    <SceneStage aspect={16 / 9} bloom={1.2}>
      <StarField />
      <CoreOrb />
      {WORLDS.map((w, i) => (
        <WorldRing
          key={w.label}
          {...w}
          tilt={(i - 2) * 0.11}
          speed={0.42 - i * 0.06}
        />
      ))}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.4}
        makeDefault
      />
    </SceneStage>
  );
}
