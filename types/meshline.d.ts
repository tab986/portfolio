import type { ThreeElements } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElements["bufferGeometry"];
    meshLineMaterial: ThreeElements["shaderMaterial"] & {
      color?: string;
      depthTest?: boolean;
      resolution?: [number, number];
      useMap?: boolean;
      map?: unknown;
      repeat?: [number, number];
      lineWidth?: number;
    };
  }
}

declare module "meshline" {
  export class MeshLineGeometry {
    setPoints(points: unknown): void;
  }
  export class MeshLineMaterial {
    constructor(parameters?: Record<string, unknown>);
  }
}
