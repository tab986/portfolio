"use client";

import {
  Component,
  Suspense,
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

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = "/assets/kartu.glb";
const BAND_TEXTURE_PATH = "/assets/bandd.png?v=4";
const CARD_TEXTURE_PATH = "/assets/card-texture.png?v=4";

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
};

type RigidBodyWithLerped = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function isFiniteVec3(v: THREE.Vector3) {
  return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}

function Band({ maxSpeed = 50, minSpeed = 10 }: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Stable MeshLine geometry instance (avoids broken/missing rope updates)
  const bandGeometry = useMemo(() => new MeshLineGeometry(), []);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
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

  useRopeJoint(fixed as never, j1 as never, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as never, j2 as never, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as never, j3 as never, [[0, 0, 0], [0, 0, 0], 1]);
  // Must sit in the clip’s D-ring (card group is scale 2.7, pos y -1.2).
  // At scale 2.25 this was ~1.45; at 2.7 the eyelet center is ~2.02.
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

    // Seed rope so it doesn’t flash empty before the first physics tick
    bandGeometry.setPoints([
      new THREE.Vector3(3.5, 4, 0),
      new THREE.Vector3(3.0, 4, 0),
      new THREE.Vector3(2.5, 4, 0),
      new THREE.Vector3(1.5, 4, 0),
    ]);
  }, [texture, cardTexture, bandGeometry]);

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
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
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

    // Smooth mid-joints so the rope curve doesn’t kink / detach
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

    // World positions → rope path (band mesh lives outside the hang group)
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
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true,
      );
    }
  });

  return (
    <>
      <group position={[1.5, 4, 0]}>
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
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current!.translation())),
              );
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
          lineWidth={1}
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

function CardFallback() {
  return (
    <div className="flex h-[min(82vh,700px)] w-full items-center justify-center lg:h-[min(78vh,660px)] lg:min-h-[560px]">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-chrome-dim">
        3D card unavailable
      </span>
    </div>
  );
}

export default function LanyardCard() {
  return (
    <div className="lanyard-card relative flex w-full flex-col items-center bg-transparent">
      <div className="relative h-[min(82vh,700px)] w-full lg:h-[min(78vh,660px)] lg:min-h-[560px]">
        <WebGLErrorBoundary fallback={<CardFallback />}>
          <Canvas
            camera={{ position: [-2.4, 0, 11], fov: 24 }}
            gl={{
              alpha: true,
              antialias: true,
              premultipliedAlpha: true,
              powerPreference: "default",
              failIfMajorPerformanceCaveat: false,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
              });
            }}
            style={{ background: "transparent" }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={Math.PI * 0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1.6} />
            <directionalLight position={[-6, 3, 2]} intensity={0.7} />
            <pointLight position={[0, 2, 6]} intensity={2.2} />
            <Suspense fallback={null}>
              <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                <Band />
              </Physics>
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      </div>
      <p className="pointer-events-none mt-1 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-chrome-dim">
        Drag the card
      </p>
    </div>
  );
}
