"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
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

const DESKTOP_CAMERA = new THREE.Vector3(0, 2, 15);
const DESKTOP_ROOM_POSITION = new THREE.Vector3(1.2, -2.1, 0);
const DESKTOP_SCALE = 0.82;
const FIT_NDC = 0.9;

function cornerAbsNdc(object: THREE.Object3D, camera: THREE.Camera) {
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return Infinity;

  const ndc = new THREE.Vector3();
  let maxAbs = 0;
  const xs = [box.min.x, box.max.x];
  const ys = [box.min.y, box.max.y];
  const zs = [box.min.z, box.max.z];
  for (const x of xs) {
    for (const y of ys) {
      for (const z of zs) {
        ndc.set(x, y, z).project(camera);
        if (!Number.isFinite(ndc.x) || !Number.isFinite(ndc.y) || ndc.z < -1 || ndc.z > 1) {
          return Infinity;
        }
        maxAbs = Math.max(maxAbs, Math.abs(ndc.x), Math.abs(ndc.y));
      }
    }
  }
  return maxAbs;
}

/** Same desktop camera angle, scaled so the whole room box fits the narrow stage. */
function FittedRoom({ screensRef }: { screensRef: RefObject<THREE.Mesh | null> }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const outerGroup = outer.current;
    const innerGroup = inner.current;
    if (!outerGroup || !innerGroup || size.width < 2 || size.height < 2) return;

    const center = new THREE.Vector3();
    const place = (scale: number) => {
      innerGroup.position.copy(DESKTOP_ROOM_POSITION);
      innerGroup.rotation.set(0, -Math.PI / 4, 0);
      innerGroup.scale.setScalar(scale);
      outerGroup.position.set(0, 0, 0);
      outerGroup.rotation.set(0, 0, 0);
      outerGroup.scale.setScalar(1);
      outerGroup.updateWorldMatrix(true, true);
      new THREE.Box3().setFromObject(outerGroup).getCenter(center);
      outerGroup.position.copy(center).multiplyScalar(-1);
      outerGroup.updateWorldMatrix(true, true);
    };

    place(DESKTOP_SCALE);
    camera.position.copy(DESKTOP_CAMERA).sub(center);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    let low = 0.05;
    let high = 1.8;
    let best = low;
    for (let i = 0; i < 16; i += 1) {
      const mid = (low + high) / 2;
      place(mid);
      if (cornerAbsNdc(outerGroup, camera) <= FIT_NDC) {
        best = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
    place(best);
    invalidate();
  }, [camera, invalidate, size.height, size.width]);

  return (
    <group ref={outer}>
      <group ref={inner}>
        <Room screensRef={screensRef} />
      </group>
    </group>
  );
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
  const isNarrow = useMediaQuery("(max-width: 1023px)");
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
      key={isNarrow ? "room-narrow" : "room-desktop"}
      className={`h-full w-full border-0 bg-transparent shadow-none ${isNarrow ? "touch-pan-y" : "touch-none"}`}
      style={{ background: "transparent", border: "none", boxShadow: "none" }}
      frameloop={frameloop}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.setClearColor(0x000000, 0);
      }}
      camera={{
        position: [0, 2, 15],
        fov: 43,
      }}
    >
      <RedrawOnResize active={renderActive} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!isNarrow && !reduceMotion}
        enabled={!isNarrow}
        autoRotate={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        maxDistance={20}
        minDistance={5}
      />
      <HeroLight />
      <Suspense fallback={null}>
        {isNarrow ? (
          <FittedRoom screensRef={screensRef} />
        ) : (
          <group scale={0.82} position={[1.2, -2.1, 0]} rotation={[0, -Math.PI / 4, 0]}>
            <Room screensRef={screensRef} />
          </group>
        )}
        <IntroFrames count={introFrames} gapMs={introGapMs} />
      </Suspense>
      <EffectComposer>
        <SelectiveBloom
          selection={screensRef as unknown as THREE.Object3D[]}
          intensity={1}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>
    </Canvas>
  );
}
