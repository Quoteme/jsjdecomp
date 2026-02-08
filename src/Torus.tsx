import React, { useMemo } from "react";
import { type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

type TorusProps = {
  widthSegments?: number;
  heightSegments?: number;
  R?: number; // major radius
  r?: number; // minor (tube) radius
  angleStartMeridian?: number; // in radians, default 0
  angleLengthMeridian?: number; // in radians, default 2*PI
  angleStartLongitude?: number; // in radians, default 0
  angleLengthLongitude?: number; // in radians, default 2*PI
} & ThreeElements["bufferGeometry"];

export const Torus: React.FC<TorusProps> = ({
  widthSegments = 128,
  heightSegments = 64,
  R = 6 / 5,
  r = 1 / 3,
  angleStartMeridian = 0,
  angleLengthMeridian = Math.PI * 2,
  angleStartLongitude = 0,
  angleLengthLongitude = Math.PI * 2,
  ...geomProps
}: TorusProps) => {
  const { positions, uvs, indices, normals } = useMemo(() => {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Build a grid in [0,1]x[0,1], then map to torus
    for (let iy = 0; iy <= heightSegments; iy++) {
      const v = iy / heightSegments; // [0,1]
      const angleV = v * angleLengthMeridian + angleStartMeridian; // tube angle

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments; // [0,1]
        const angleU = u * angleLengthLongitude + angleStartLongitude; // around the torus

        const x = (R + r * Math.cos(angleV)) * Math.cos(angleU);
        const y = (R + r * Math.cos(angleV)) * Math.sin(-angleU);
        const z = r * Math.sin(angleV);

        positions.push(x, y, z);
        uvs.push(u, v);
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

    // Build a THREE.BufferGeometry to compute normals
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals(); // crucial for lighting [web:13][web:24]

    const normalAttr = geometry.getAttribute("normal") as THREE.BufferAttribute;

    return {
      positions: geometry.getAttribute("position").array as Float32Array,
      uvs: geometry.getAttribute("uv").array as Float32Array,
      indices: geometry.getIndex()!.array as Uint32Array,
      normals: normalAttr.array as Float32Array,
    };
  }, [widthSegments, heightSegments, R, r]);

  return (
    <bufferGeometry {...geomProps}>
      <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      <bufferAttribute attach="attributes-normal" args={[normals, 3]} />
      <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
      <bufferAttribute attach="index" args={[indices, 1]} />
    </bufferGeometry>
  );
};
