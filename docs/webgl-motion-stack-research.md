# WebGL + Motion Tech Stack Research (and Implementation Choice)

## What was evaluated

1. **Three.js**
   - Core renderer + scene graph for high-performance 3D visualization in the browser.
2. **React Three Fiber (R3F)**
   - React renderer for Three.js; allows declarative scene composition in JSX and integrates with existing React state/UI patterns.
3. **Drei**
   - Utility helpers on top of R3F (controls, stars, common abstractions).
4. **Framer Motion (already in repo)**
   - Best for DOM/UI micro-interactions and section transitions.

## Why this stack

- Keep **Framer Motion** for textual/UI pedagogy and transitions.
- Add **R3F + Drei + Three.js** for concept-rich spatial visuals (e.g., number-system worlds, transformations, rotations).
- This hybrid keeps the current app architecture while unlocking richer 3D experiences incrementally.

## Implementation in this PR

- Installed:
  - `three`
  - `@react-three/fiber`
  - `@react-three/drei`
- Added `WebGLHero` component and integrated it near the start of the learning flow.
- Added low-motion compatibility behavior (`body.low-motion .webgl-hero-shell { display: none; }`) so users can disable the heavy visual layer.

## Suggested next evolutions

1. Convert selected 2D modules to optional 3D modes (e.g., Complex Plane, Growth Types).
2. Add scene-level quality scaling (device-pixel-ratio caps, fallback presets).
3. Add GPU capability checks and graceful fallback copy for unsupported environments.
