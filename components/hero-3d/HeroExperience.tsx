"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import HeroLight from "@/components/hero-3d/HeroLight";
import { Room } from "@/components/hero-3d/Room";
import { useMediaQuery } from "@/components/hero-3d/useMediaQuery";

export default function HeroExperience() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const screensRef = useRef<THREE.Mesh>(null);

  return (
    <Canvas
      className="h-full w-full touch-none bg-transparent"
      style={{ background: "transparent" }}
      frameloop="always"
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      camera={{
        position: isMobile ? [0, 2, 18] : [0, 2, 15],
        fov: 43,
      }}
    >
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        maxDistance={20}
        minDistance={5}
      />
      <HeroLight />
      <Suspense fallback={null}>
        <group
          scale={isMobile ? 0.58 : 0.82}
          position={isMobile ? [0.4, -2.2, 0] : [1.2, -2.1, 0]}
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
