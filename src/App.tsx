import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Torus } from "./Torus";
import range from "rrjx";
import { add } from "mathjs";
import { Color, TextureLoader, Vector3, WebGLRenderer } from "three";
import { useLoader } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import toast, { Toaster } from "react-hot-toast";
function App() {
  const glRef = useRef<WebGLRenderer>(null);
  const [count, setCount] = useState(0);

  const { splitting_num, jsj_tori_opacity, jsj_components_opacity } =
    useControls({
      splitting_num: {
        value: 4,
        min: 1,
        max: 20,
        step: 1,
      },
      jsj_tori_opacity: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
      },
      jsj_components_opacity: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
      },
    });
  const offset: Vector3 = new Vector3(3.5, 0, 0);

  const texture_globe = useLoader(TextureLoader, "./src/assets/globe.jpg");

  const jsj_tori = (
    <group>
      {[...range(0, splitting_num)].map((i) => (
        <mesh
          key={`jsj_torus_${i}`}
          position={offset.clone().multiplyScalar(i - (splitting_num - 1) / 2)}
          rotation={[Math.PI / 2, 0, 0]}
          renderOrder={1}
        >
          <Torus R={6 / 5} r={1 / 3} />
          <meshPhongMaterial
            map={texture_globe}
            opacity={jsj_tori_opacity}
            transparent={true}
          />
        </mesh>
      ))}
    </group>
  );

  const jsj_components = (
    <group>
      {[...range(splitting_num)].map((i) => (
        <mesh
          key={`jsj_component_${i}`}
          position={offset.clone().multiplyScalar(i - (splitting_num - 1) / 2)}
          rotation={[Math.PI / 2, 0, 0]}
          renderOrder={0}
        >
          <Torus R={6 / 5} r={1 / 4} />
          <meshPhongMaterial
            color={new Color().setHSL(i / splitting_num, 1, 0.5)}
            opacity={jsj_components_opacity}
            transparent={true}
          />
        </mesh>
      ))}
    </group>
  );

  return (
    <>
      <Leva />
      <Canvas
        camera={{ position: [0, 5, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          glRef.current = gl;
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          glRef.current?.domElement.toBlob(
            (blob) =>
              blob &&
              navigator.clipboard
                .write([new ClipboardItem({ "image/png": blob })])
                .then(() => toast.success("Image copied to clipboard!"))
                .catch((error) =>
                  toast.error(
                    `Failed to copy image to clipboard. Error: ${error.message}`,
                  ),
                ),
          );
        }}
      >
        <OrbitControls />
        <ambientLight intensity={0.2} />
        <directionalLight position={[8, 8, 2]} intensity={1} castShadow />
        {jsj_tori}
        {jsj_components}
      </Canvas>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
