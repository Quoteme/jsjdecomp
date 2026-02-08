import React, { useMemo } from "react";
import { Canvas, type ThreeElements } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";

type TorusProps = {
  widthSegments?: number;
  heightSegments?: number;
  R?: number; // major radius
  r?: number; // minor (tube) radius
};

export const Torus: React.FC<TorusProps> = ({
  widthSegments = 128,
  heightSegments = 64,
  R = 6 / 5,
  r = 1 / 3,
}: TorusProps) => {
  const { positions, uvs, indices } = useMemo(() => {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Build a grid in [0,1]x[0,1] (like a plane), then map to torus
    for (let iy = 0; iy <= heightSegments; iy++) {
      const v = iy / heightSegments; // [0,1]
      const angleV = v * Math.PI * 2; // tube angle

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments; // [0,1]
        const angleU = u * Math.PI * 2; // around the torus

        const x = (R + r * Math.cos(angleV)) * Math.cos(angleU);
        const y = (R + r * Math.cos(angleV)) * Math.sin(-angleU);
        const z = r * Math.sin(angleV);

        positions.push(x, y, z);
        uvs.push(u, v); // same as plane UVs
      }
    }

    // Indices for a regular grid
    const vertsPerRow = widthSegments + 1;
    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = iy * vertsPerRow + ix;
        const b = a + 1;
        const c = (iy + 1) * vertsPerRow + ix;
        const d = c + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    return {
      positions: new Float32Array(positions),
      uvs: new Float32Array(uvs),
      indices: new Uint32Array(indices),
    };
  }, [widthSegments, heightSegments, R, r]);

  return (
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
      <bufferAttribute attach="index" args={[indices, 1]} />
    </bufferGeometry>
  );
};
