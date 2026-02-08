import { useState } from "react";
import { OrbitControls } from "@react-three/drei";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Torus } from "./Torus";
import range from "rrjx";
import { add } from "mathjs";
import { Color, TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import { Leva, useControls } from "leva";
function App() {
  const [count, setCount] = useState(0);

  const { splitting_num } = useControls({
    splitting_num: {
      value: 4,
      min: 1,
      max: 20,
      step: 1,
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
            opacity={0.5}
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
            opacity={0.5}
            transparent={true}
          />
        </mesh>
      ))}
    </group>
  );

  return (
    <>
      <Leva />
      <Canvas camera={{ position: [0, 5, 9], fov: 50 }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1} />
        {jsj_tori}
        {jsj_components}
      </Canvas>
    </>
  );
}

export default App;
