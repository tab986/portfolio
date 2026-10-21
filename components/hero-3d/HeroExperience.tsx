"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import HeroLight from "@/components/hero-3d/HeroLight";
import { Room } from "@/components/hero-3d/Room";
import { useSectionVisible } from "@/components/hero-3d/useRenderActive";
import { useMediaQuery } from "@/components/hero-3d/useMediaQuery";

function IntroFrames({ count, gapMs }: { count: number; gapMs: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let framesLeft = count;
    let last = 0;
    let raf = 0;
    const tick = (now: number) => {
      if (framesLeft <= 0) return;
      if (now - last >= gapMs) {
        last = now;
        framesLeft -= 1;
        invalidate();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, gapMs, invalidate]);

  return null;
}

function RedrawOnResize({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    if (!active) return;
    const observer = new ResizeObserver(() => invalidate());
    observer.observe(gl.domElement);
    invalidate();
    return () => observer.disconnect();
  }, [active, gl, invalidate]);

  return null;
}

export default function HeroExperience() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const renderActive = useSectionVisible("welcome");
  const screensRef = useRef<THREE.Mesh>(null);
  // Demand while on screen: draw the settled room, then idle.
  // Never while offscreen or the tab is hidden. OrbitControls invalidates during a drag.
  const frameloop = renderActive ? "demand" : "never";
  const introFrames = reduceMotion ? 1 : isMobile ? 4 : 3;
  const introGapMs = isMobile ? 1000 / 30 : 0;

  return (
    <Canvas
      className={`h-full w-full border-0 bg-transparent shadow-none ${isMobile ? "touch-pan-y" : "touch-none"}`}
      style={{ background: "transparent", border: "none", boxShadow: "none" }}
      frameloop={frameloop}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: !isMobile,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.setClearColor(0x000000, 0);
      }}
      camera={{
        position: isMobile ? [0, 1.45, 10.2] : [0, 2, 15],
        fov: isMobile ? 40 : 43,
      }}
    >
      <RedrawOnResize active={renderActive} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!isMobile && !reduceMotion}
        autoRotate={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        maxDistance={20}
        minDistance={5}
      />
      <HeroLight />
      <Suspense fallback={null}>
        <group
          scale={isMobile ? 1.05 : 0.82}
          position={isMobile ? [0.02, -2.75, 0] : [1.2, -2.1, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room screensRef={screensRef} />
        </group>
        <IntroFrames count={introFrames} gapMs={introGapMs} />
      </Suspense>
      {!isMobile && (
        <EffectComposer>
          <SelectiveBloom
            selection={screensRef as unknown as THREE.Object3D[]}
            intensity={1}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.ADD}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
