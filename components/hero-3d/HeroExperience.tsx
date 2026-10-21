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

function PaintWhenStatic({
  enabled,
  visible,
}: {
  enabled: boolean;
  visible: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!visible) return;
    invalidate();
    if (!enabled) return;
    const soon = window.setTimeout(invalidate, 350);
    const later = window.setTimeout(invalidate, 1100);
    return () => {
      window.clearTimeout(soon);
      window.clearTimeout(later);
    };
  }, [enabled, visible, invalidate]);
  return null;
}

export default function HeroExperience() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const renderActive = useSectionVisible("welcome");
  const screensRef = useRef<THREE.Mesh>(null);
  const frameloop = !renderActive ? "never" : reduceMotion ? "demand" : "always";

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
      <PaintWhenStatic enabled={reduceMotion} visible={renderActive} />
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
