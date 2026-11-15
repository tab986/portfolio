"use client";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
const FIT_NDC = 0.94;
/** Narrow screens: the room turns this far each way around its own centre. */
const SWAY_RADIANS = THREE.MathUtils.degToRad(12);
const SWAY_PERIOD_MS = 9000;
const SWAY_FRAME_MS = 1000 / 30;

const FIT_SAMPLE_LIMIT = 6000;

/**
 * A sample of the room's vertices in `root`'s own axes. Call while every
 * ancestor of `root` is identity, so world space equals its local space.
 */
function sampleLocalPoints(root: THREE.Object3D) {
  root.updateWorldMatrix(true, true);
  let total = 0;
  root.traverse((child) => {
    const position = (child as THREE.Mesh).geometry?.attributes?.position;
    if (position) total += position.count;
  });
  const stride = Math.max(1, Math.ceil(total / FIT_SAMPLE_LIMIT));
  const points: number[] = [];
  const point = new THREE.Vector3();
  root.traverse((child) => {
    const position = (child as THREE.Mesh).geometry?.attributes?.position;
    if (!position) return;
    for (let i = 0; i < position.count; i += stride) {
      point.fromBufferAttribute(position, i).applyMatrix4(child.matrixWorld);
      points.push(point.x, point.y, point.z);
    }
  });
  return points;
}

type NdcBounds = { minX: number; maxX: number; minY: number; maxY: number; ok: boolean };

/**
 * Grows `bounds` by the NDC position of the room's sampled vertices. Fitting
 * the real silhouette instead of a bounding box matters here: the room is a
 * two-wall diorama turned 45°, so a box fit leaves it far smaller than the stage.
 */
function growNdcBounds(
  bounds: NdcBounds,
  points: number[],
  object: THREE.Object3D,
  camera: THREE.Camera,
) {
  if (points.length === 0) bounds.ok = false;
  object.updateWorldMatrix(true, false);

  const ndc = new THREE.Vector3();
  for (let i = 0; i < points.length; i += 3) {
    ndc
      .set(points[i], points[i + 1], points[i + 2])
      .applyMatrix4(object.matrixWorld)
      .project(camera);
    if (!Number.isFinite(ndc.x) || !Number.isFinite(ndc.y) || ndc.z < -1 || ndc.z > 1) {
      bounds.ok = false;
      return;
    }
    bounds.minX = Math.min(bounds.minX, ndc.x);
    bounds.maxX = Math.max(bounds.maxX, ndc.x);
    bounds.minY = Math.min(bounds.minY, ndc.y);
    bounds.maxY = Math.max(bounds.maxY, ndc.y);
  }
}

/** Same desktop camera angle, scaled and centred so the whole room fills the narrow stage. */
function FittedRoom({
  screensRef,
  sway,
}: {
  screensRef: RefObject<THREE.Mesh | null>;
  sway: boolean;
}) {
  const swayGroup = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const fittedKey = useRef("");
  const localPoints = useRef<number[] | null>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);

  useFrame(() => {
    const swayRoot = swayGroup.current;
    const outerGroup = outer.current;
    const innerGroup = inner.current;
    const persp = camera as THREE.PerspectiveCamera;
    if (
      !swayRoot ||
      !outerGroup ||
      !innerGroup ||
      size.width < 2 ||
      size.height < 2 ||
      persp.aspect < 0.05
    ) {
      return;
    }

    const key = `${size.width.toFixed(1)}x${size.height.toFixed(1)}x${persp.aspect.toFixed(4)}x${sway}`;
    if (fittedKey.current === key) return;

    const restYaw = swayRoot.rotation.y;
    swayRoot.rotation.y = 0;
    swayRoot.position.set(0, 0, 0);

    // Room vertices in its own axes: every ancestor is identity while sampling.
    if (!localPoints.current) {
      innerGroup.position.set(0, 0, 0);
      innerGroup.rotation.set(0, 0, 0);
      innerGroup.scale.setScalar(1);
      outerGroup.position.set(0, 0, 0);
      outerGroup.rotation.set(0, 0, 0);
      outerGroup.scale.setScalar(1);
      localPoints.current = sampleLocalPoints(innerGroup);
    }
    const points = localPoints.current;

    // Measure at both ends of the sway so no corner ever leaves the stage.
    const yaws = sway ? [-SWAY_RADIANS, 0, SWAY_RADIANS] : [0];
    const measure = () => {
      const bounds: NdcBounds = {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
        ok: true,
      };
      for (const yaw of yaws) {
        swayRoot.rotation.y = yaw;
        swayRoot.updateWorldMatrix(true, true);
        growNdcBounds(bounds, points, innerGroup, persp);
      }
      swayRoot.rotation.y = 0;
      swayRoot.updateWorldMatrix(true, true);
      return bounds;
    };
    const worst = (bounds: NdcBounds) =>
      bounds.ok
        ? Math.max(-bounds.minX, bounds.maxX, -bounds.minY, bounds.maxY)
        : Infinity;

    const center = new THREE.Vector3();
    const place = (scale: number) => {
      innerGroup.position.copy(DESKTOP_ROOM_POSITION);
      innerGroup.rotation.set(0, -Math.PI / 4, 0);
      innerGroup.scale.setScalar(scale);
      outerGroup.position.set(0, 0, 0);
      outerGroup.rotation.set(0, 0, 0);
      outerGroup.scale.setScalar(1);
      outerGroup.updateWorldMatrix(true, true);
      // Box centre in the sway group's space, so its screen shift is kept.
      new THREE.Box3().setFromObject(outerGroup).getCenter(center).sub(swayRoot.position);
      outerGroup.position.copy(center).multiplyScalar(-1);
      outerGroup.updateWorldMatrix(true, true);
    };

    place(DESKTOP_SCALE);
    persp.position.copy(DESKTOP_CAMERA).sub(center);
    persp.lookAt(0, 0, 0);
    persp.updateWorldMatrix(true, false);
    persp.updateProjectionMatrix();

    // World size of one NDC unit at the room, to turn a screen offset into a shift.
    const halfHeight =
      persp.position.length() * Math.tan(THREE.MathUtils.degToRad(persp.fov / 2));
    const halfWidth = halfHeight * persp.aspect;

    // Perspective pushes the box centre off the screen centre (the near floor
    // corner looms larger), which makes one edge hit the frame early. Alternate
    // "largest scale that fits" with "centre what is drawn" a few times.
    let best = 0.05;
    for (let round = 0; round < 4; round += 1) {
      let low = 0.05;
      let high = 1.8;
      best = low;
      for (let i = 0; i < 16; i += 1) {
        const mid = (low + high) / 2;
        place(mid);
        if (worst(measure()) <= FIT_NDC) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }
      place(best);
      if (round === 3) break;
      const bounds = measure();
      if (!bounds.ok) break;
      swayRoot.position.x -= ((bounds.minX + bounds.maxX) / 2) * halfWidth;
      swayRoot.position.y -= ((bounds.minY + bounds.maxY) / 2) * halfHeight;
    }
    place(best);
    swayRoot.rotation.y = restYaw;
    persp.updateWorldMatrix(true, false);
    fittedKey.current = key;
    invalidate();
  });

  // Slow yaw sway, capped near 30fps. The canvas runs on a demand frameloop,
  // so each step asks for exactly one frame; it stops with `sway`.
  useEffect(() => {
    const swayRoot = swayGroup.current;
    if (!swayRoot) return;
    if (!sway) {
      swayRoot.rotation.y = 0;
      invalidate();
      return;
    }

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last >= SWAY_FRAME_MS) {
        last = now;
        swayRoot.rotation.y =
          Math.sin((now / SWAY_PERIOD_MS) * Math.PI * 2) * SWAY_RADIANS;
        invalidate();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sway, invalidate]);

  return (
    <group ref={swayGroup}>
      <group ref={outer}>
        <group ref={inner}>
          <Room screensRef={screensRef} />
        </group>
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
          <FittedRoom screensRef={screensRef} sway={renderActive && !reduceMotion} />
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
