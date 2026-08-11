"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useMediaQuery } from "@/components/hero-3d/useMediaQuery";

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = "/assets/kartu.glb";
const BAND_TEXTURE_PATH = "/assets/bandd.png?v=4";
const CARD_TEXTURE_PATH = "/assets/card-texture.png?v=4";

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
};

type RigidBodyWithLerped = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function isFiniteVec3(v: THREE.Vector3) {
  return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}

function Band({
  maxSpeed = 50,
  minSpeed = 10,
  isMobile = false,
}: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const { gl } = useThree();

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const bandGeometry = useMemo(() => new MeshLineGeometry(), []);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: isMobile ? 8 : 4,
    linearDamping: isMobile ? 6 : 4,
  };

  const { nodes, materials } = useGLTF(GLTF_PATH) as unknown as {
    nodes: {
      card: THREE.Mesh;
      clip: THREE.Mesh;
      clamp: THREE.Mesh;
    };
    materials: {
      metal: THREE.MeshStandardMaterial;
    };
  };
  const texture = useTexture(BAND_TEXTURE_PATH);
  const cardTexture = useTexture(CARD_TEXTURE_PATH);
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Keep clip eyelet alignment stable; framing is handled by camera / hang origin.
  useRopeJoint(fixed as never, j1 as never, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as never, j2 as never, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as never, j3 as never, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as never, card as never, [
    [0, 0, 0],
    [0, 2.02, -0.05],
  ]);

  useLayoutEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    cardTexture.flipY = false;
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.anisotropy = 8;
    cardTexture.needsUpdate = true;

    bandGeometry.setPoints([
      new THREE.Vector3(3.5, 4, 0),
      new THREE.Vector3(3.0, 4, 0),
      new THREE.Vector3(2.5, 4, 0),
      new THREE.Vector3(1.5, 4, 0),
    ]);
  }, [texture, cardTexture, bandGeometry]);

  useEffect(() => {
    gl.domElement.style.touchAction = dragged ? "none" : "pan-y";
  }, [dragged, gl]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      let nextX = vec.x - dragged.x;
      let nextY = vec.y - dragged.y;
      let nextZ = vec.z - dragged.z;

      if (isMobile && fixed.current) {
        const anchor = fixed.current.translation();
        nextX = THREE.MathUtils.clamp(nextX, anchor.x - 1.6, anchor.x + 1.6);
        nextY = THREE.MathUtils.clamp(nextY, anchor.y - 4.2, anchor.y - 0.4);
        nextZ = THREE.MathUtils.clamp(nextZ, -0.8, 0.8);
      }

      card.current.setNextKinematicTranslation({
        x: nextX,
        y: nextY,
        z: nextZ,
      });
    }

    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current
    ) {
      return;
    }

    ([j1, j2] as const).forEach((ref) => {
      const body = ref.current as RigidBodyWithLerped | null;
      if (!body) return;
      const t = body.translation();
      if (!Number.isFinite(t.x) || !Number.isFinite(t.y) || !Number.isFinite(t.z)) {
        return;
      }
      tmp.set(t.x, t.y, t.z);
      if (!body.lerped) body.lerped = tmp.clone();
      const clampedDistance = Math.max(0.1, Math.min(1, body.lerped.distanceTo(tmp)));
      body.lerped.lerp(
        tmp,
        delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
      );
    });

    const j1Body = j1.current as RigidBodyWithLerped;
    const j2Body = j2.current as RigidBodyWithLerped;
    if (!j1Body.lerped || !j2Body.lerped) return;

    const a = j3.current.translation();
    const d = fixed.current.translation();
    curve.points[0].set(a.x, a.y, a.z);
    curve.points[1].copy(j2Body.lerped);
    curve.points[2].copy(j1Body.lerped);
    curve.points[3].set(d.x, d.y, d.z);

    if (curve.points.every(isFiniteVec3)) {
      bandGeometry.setPoints(curve.getPoints(32));
    }

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    if (isFiniteVec3(ang) && isFiniteVec3(rot)) {
      // Mobile: damp extreme swing/tilt so the card stays readable in-frame.
      const settle = isMobile ? 0.55 : 0.25;
      const damp = isMobile ? 0.82 : 1;
      card.current.setAngvel(
        {
          x: ang.x * damp,
          y: ang.y - rot.y * settle,
          z: ang.z * damp,
        },
        true,
      );
    }
  });

  // Mobile: centered hang slightly lower so content sits mid-frame in 80dvh stage.
  // Desktop: original right-biased hang for the side camera.
  const hangOrigin = isMobile ? ([0, 3.25, 0] as const) : ([1.5, 4, 0] as const);
  const lineWidth = isMobile ? 0.45 : 1;

  return (
    <>
      <group position={hangOrigin}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.7}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              (e.target as Element).setPointerCapture(e.pointerId);
              const offset = new THREE.Vector3()
                .copy(e.point)
                .sub(vec.copy(card.current!.translation()));
              // Limit initial grab offset on mobile so the card can't sling off-screen.
              if (isMobile) {
                offset.x = THREE.MathUtils.clamp(offset.x, -0.65, 0.65);
                offset.y = THREE.MathUtils.clamp(offset.y, -0.65, 0.65);
                offset.z = THREE.MathUtils.clamp(offset.z, -0.35, 0.35);
              }
              drag(offset);
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band} geometry={bandGeometry} frustumCulled={false}>
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[Math.max(width, 1), Math.max(height, 1)]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lineWidth}
        />
      </mesh>
    </>
  );
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

const DESKTOP_STAGE =
  "relative h-[min(82vh,700px)] w-full lg:h-[min(78vh,660px)] lg:min-h-[560px]";

/** Desktop camera — never mutated by the mobile controller. */
const DESKTOP_CAMERA = {
  position: [-2.4, 0, 11] as [number, number, number],
  fov: 24,
};

/** Mobile: pulled back + lookAt mid-card so strap + badge fit inside stage. */
const MOBILE_CAMERA = {
  position: [0, 0.05, 14.75] as [number, number, number],
  fov: 34,
  lookAt: [0, -0.45, 0] as [number, number, number],
};

/**
 * Applies mobile framing and keeps the projection matrix fresh on resize.
 * On desktop only updates aspect (leaves position/fov to Canvas defaults).
 */
function ResponsiveCardCamera({ isMobile }: { isMobile: boolean }) {
  const { camera, gl, size } = useThree();

  const applyFraming = useCallback(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (!("fov" in cam)) return;

    const w = Math.max(size.width, gl.domElement.clientWidth, 1);
    const h = Math.max(size.height, gl.domElement.clientHeight, 1);
    cam.aspect = w / h;

    if (isMobile) {
      cam.position.set(...MOBILE_CAMERA.position);
      cam.fov = MOBILE_CAMERA.fov;
      cam.near = 0.1;
      cam.far = 100;
      cam.lookAt(...MOBILE_CAMERA.lookAt);
    }

    cam.updateProjectionMatrix();
  }, [camera, gl, isMobile, size.height, size.width]);

  useLayoutEffect(() => {
    applyFraming();

    const onResize = () => applyFraming();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    const parent = gl.domElement.parentElement;
    const ro = new ResizeObserver(onResize);
    ro.observe(gl.domElement);
    if (parent) ro.observe(parent);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      ro.disconnect();
    };
  }, [applyFraming, gl]);

  return null;
}

function CardFallback() {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden max-md:h-[min(80dvh,34rem)] max-md:min-h-[min(500px,80dvh)] max-md:max-w-[100vw] ${DESKTOP_STAGE}`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-chrome-dim">
        3D card unavailable
      </span>
    </div>
  );
}

export default function LanyardCard() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="lanyard-card relative flex w-full max-w-[100vw] flex-col items-center overflow-hidden bg-transparent">
      <div
        className={`lanyard-card__stage ${DESKTOP_STAGE} max-md:h-[min(80dvh,34rem)] max-md:min-h-[min(500px,80dvh)] max-md:max-w-[100vw] max-md:overflow-hidden`}
      >
        <WebGLErrorBoundary fallback={<CardFallback />}>
          <Canvas
            key={isMobile ? "card-mobile" : "card-desktop"}
            className="h-full w-full"
            camera={
              isMobile
                ? {
                    position: MOBILE_CAMERA.position,
                    fov: MOBILE_CAMERA.fov,
                  }
                : {
                    position: DESKTOP_CAMERA.position,
                    fov: DESKTOP_CAMERA.fov,
                  }
            }
            gl={{
              alpha: true,
              antialias: true,
              premultipliedAlpha: true,
              powerPreference: "default",
              failIfMajorPerformanceCaveat: false,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.domElement.style.width = "100%";
              gl.domElement.style.height = "100%";
              gl.domElement.style.touchAction = "pan-y";
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
              });
            }}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              touchAction: "pan-y",
              display: "block",
            }}
            dpr={isMobile ? [1, 1.25] : [1, 1.5]}
            resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
          >
            <ResponsiveCardCamera isMobile={isMobile} />
            <ambientLight intensity={Math.PI * 0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1.6} />
            <directionalLight position={[-6, 3, 2]} intensity={0.7} />
            <pointLight position={[0, 2, 6]} intensity={2.2} />
            <Suspense fallback={null}>
              <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                <Band isMobile={isMobile} />
              </Physics>
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      </div>
    </div>
  );
}
