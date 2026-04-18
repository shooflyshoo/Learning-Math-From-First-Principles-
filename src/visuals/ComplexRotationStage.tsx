import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, OrbitControls, Text, Trail, Billboard, Float } from '@react-three/drei';
import * as THREE from 'three';
import SceneStage from './SceneStage';

function UnitDisk() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.05;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <ringGeometry args={[0.01, 1, 128]} />
      <meshBasicMaterial color="#1e293b" transparent opacity={0.35} side={THREE.DoubleSide} />
    </mesh>
  );
}

function UnitCircle() {
  const pts = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const t = (i / 128) * Math.PI * 2;
      arr.push([Math.cos(t), Math.sin(t), 0]);
    }
    return arr;
  }, []);
  return <Line points={pts} color="#475569" lineWidth={1} />;
}

function Axes() {
  return (
    <>
      <Line points={[[-3, 0, 0], [3, 0, 0]]} color="#64748b" lineWidth={1} />
      <Line points={[[0, -3, 0], [0, 3, 0]]} color="#64748b" lineWidth={1} />
      <Billboard position={[3.1, 0, 0]}>
        <Text fontSize={0.22} color="#7dd3fc">Re</Text>
      </Billboard>
      <Billboard position={[0, 3.1, 0]}>
        <Text fontSize={0.22} color="#c4b5fd">Im</Text>
      </Billboard>
    </>
  );
}

function AngleArc({ angle, radius = 0.35 }: { angle: number; radius?: number }) {
  const points = useMemo(() => {
    const steps = 32;
    const out: [number, number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * angle;
      out.push([Math.cos(t) * radius, Math.sin(t) * radius, 0]);
    }
    return out;
  }, [angle, radius]);
  return <Line points={points} color="#fde68a" lineWidth={2} />;
}

function ComplexVector({
  re,
  im,
  color,
  label,
  trail,
}: {
  re: number;
  im: number;
  color: string;
  label: string;
  trail?: boolean;
}) {
  const tip = useRef<THREE.Mesh>(null);
  const r = Math.hypot(re, im);
  const theta = Math.atan2(im, re);
  const VectorLine = (
    <Line
      points={[[0, 0, 0], [re, im, 0]]}
      color={color}
      lineWidth={3}
      dashed={false}
    />
  );

  return (
    <group>
      {VectorLine}
      {trail ? (
        <Trail width={0.15} length={4} color={color} attenuation={(t) => t * t}>
          <mesh ref={tip} position={[re, im, 0]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
        </Trail>
      ) : (
        <mesh ref={tip} position={[re, im, 0]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
      )}
      <Billboard position={[re + 0.2, im + 0.2, 0]}>
        <Text fontSize={0.18} color={color}>
          {label}
          {`  |r|=${r.toFixed(2)}, arg=${((theta * 180) / Math.PI).toFixed(0)}°`}
        </Text>
      </Billboard>
    </group>
  );
}

function AnimatedProduct({
  reA,
  imA,
  reB,
  imB,
}: {
  reA: number;
  imA: number;
  reB: number;
  imB: number;
}) {
  const [t, setT] = useState(0);
  useFrame((_, dt) => {
    // animate t from 0 -> 1 gently
    setT((v) => (v + dt * 0.3) % 1.2);
  });

  const clamped = Math.min(1, t);
  // Start from A and rotate/scale toward A*B as t goes 0 -> 1
  const thetaA = Math.atan2(imA, reA);
  const rA = Math.hypot(reA, imA);
  const thetaB = Math.atan2(imB, reB);
  const rB = Math.hypot(reB, imB);
  const theta = thetaA + thetaB * clamped;
  const r = rA * (1 + (rB - 1) * clamped);
  const re = r * Math.cos(theta);
  const im = r * Math.sin(theta);

  return (
    <ComplexVector re={re} im={im} color="#fde68a" label="a · b (animated)" trail />
  );
}

function Scene({
  reA,
  imA,
  reB,
  imB,
}: {
  reA: number;
  imA: number;
  reB: number;
  imB: number;
}) {
  const thetaA = Math.atan2(imA, reA);
  const thetaB = Math.atan2(imB, reB);
  return (
    <>
      <UnitDisk />
      <UnitCircle />
      <Axes />
      <AngleArc angle={thetaA} radius={0.45} />
      <AngleArc angle={thetaB} radius={0.7} />

      <ComplexVector re={reA} im={imA} color="#7dd3fc" label="a" />
      <ComplexVector re={reB} im={imB} color="#c4b5fd" label="b" />
      <AnimatedProduct reA={reA} imA={imA} reB={reB} imB={imB} />

      <Float speed={1.2} floatIntensity={0.15} rotationIntensity={0}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
        </mesh>
      </Float>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={4}
        maxDistance={14}
        makeDefault
      />
    </>
  );
}

export default function ComplexRotationStage() {
  const [reA, setReA] = useState(1.5);
  const [imA, setImA] = useState(0.6);
  const [reB, setReB] = useState(0.5);
  const [imB, setImB] = useState(1.0);

  const rA = Math.hypot(reA, imA);
  const rB = Math.hypot(reB, imB);
  const tA = Math.atan2(imA, reA);
  const tB = Math.atan2(imB, reB);
  const product = {
    re: reA * reB - imA * imB,
    im: reA * imB + imA * reB,
  };

  return (
    <div className="complex-stage">
      <div className="complex-stage-controls">
        <label>
          <span>a (real) {reA.toFixed(2)}</span>
          <input type="range" min={-2} max={2} step={0.05} value={reA} onChange={(e) => setReA(Number(e.target.value))} />
        </label>
        <label>
          <span>a (imag) {imA.toFixed(2)}</span>
          <input type="range" min={-2} max={2} step={0.05} value={imA} onChange={(e) => setImA(Number(e.target.value))} />
        </label>
        <label>
          <span>b (real) {reB.toFixed(2)}</span>
          <input type="range" min={-2} max={2} step={0.05} value={reB} onChange={(e) => setReB(Number(e.target.value))} />
        </label>
        <label>
          <span>b (imag) {imB.toFixed(2)}</span>
          <input type="range" min={-2} max={2} step={0.05} value={imB} onChange={(e) => setImB(Number(e.target.value))} />
        </label>
      </div>

      <SceneStage aspect={1} bloom={1}>
        <Scene reA={reA} imA={imA} reB={reB} imB={imB} />
      </SceneStage>

      <div className="complex-stage-readout">
        <div>
          <span>|a| · |b|</span>
          <strong>{(rA * rB).toFixed(3)}</strong>
        </div>
        <div>
          <span>arg(a) + arg(b)</span>
          <strong>{(((tA + tB) * 180) / Math.PI).toFixed(1)}°</strong>
        </div>
        <div>
          <span>a · b</span>
          <strong>
            {product.re.toFixed(2)}
            {product.im >= 0 ? ' + ' : ' − '}
            {Math.abs(product.im).toFixed(2)}i
          </strong>
        </div>
      </div>
    </div>
  );
}
