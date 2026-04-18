import { Canvas } from '@react-three/fiber';
import type { CanvasProps } from '@react-three/fiber';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';

interface Props extends Omit<CanvasProps, 'gl'> {
  children: ReactNode;
  aspect?: number;
  bloom?: number;
  vignette?: boolean;
  fallback?: ReactNode;
}

/**
 * Shared R3F stage. Gives every scene the same lighting/post-processing floor
 * (subtle bloom + vignette), performance adaptivity, and a reduced-motion
 * fallback. Heavy scenes escape through the `essential` prop on their own
 * canvases; this wrapper is for the chapter-level visuals.
 */
export default function SceneStage({
  children,
  aspect = 16 / 9,
  bloom = 0.9,
  vignette = true,
  fallback,
  ...rest
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="scene-stage-fallback" style={{ aspectRatio: aspect }}>
        {fallback ?? (
          <p>
            Animated 3D scene hidden to respect your reduced-motion preference.
            Toggle system motion to view.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="scene-stage" style={{ aspectRatio: aspect }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        {...rest}
      >
        <color attach="background" args={['#060913']} />
        <fog attach="fog" args={['#060913', 10, 28]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} color="#9ab8ff" />
        <pointLight position={[-5, -4, 2]} intensity={0.6} color="#ff7eb6" />
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={bloom} luminanceThreshold={0.15} mipmapBlur />
          {vignette ? <Vignette eskil={false} offset={0.15} darkness={0.8} /> : <></>}
        </EffectComposer>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}
