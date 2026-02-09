import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Torus } from "./Torus";
import range from "rrjx";
import { Color, TextureLoader, Vector3, WebGLRenderer } from "three";
import { useLoader } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import toast, { Toaster } from "react-hot-toast";
import { Pathtracer, usePathtracer } from "@react-three/gpu-pathtracer";

interface SceneProps {
  splitting_num: number;
  jsj_tori_opacity: number;
  jsj_components_opacity: number;
  jsj_obstruction_opacity: number;
  jsj_tori_logitude_opacity: number;
  jsj_tori_meridian_opacity: number;
  jsj_tori_logitude_compressing_disk_opacity: number;
  jsj_tori_meridian_compressing_disk_opacity: number;
  path_tracing: boolean;
}

function Scene(props: SceneProps) {
  const {
    splitting_num,
    jsj_tori_opacity,
    jsj_components_opacity,
    jsj_tori_logitude_opacity,
    jsj_tori_meridian_opacity,
    jsj_tori_logitude_compressing_disk_opacity,
    jsj_obstruction_opacity,
    jsj_tori_meridian_compressing_disk_opacity,
    path_tracing,
  } = props;
  const offset: Vector3 = new Vector3(3.5, 0, 0);
  const texture_globe = useLoader(TextureLoader, "./src/assets/globe.jpg");
  const { update } = usePathtracer();

  useEffect(() => {
    if (path_tracing) {
      update();
    }
  }, [props]);

  return (
    <group>
      {[...range(0, splitting_num)].map((i) => (
        <group
          position={offset.clone().multiplyScalar(i - (splitting_num - 1) / 2)}
        >
          <mesh
            key={`jsj_torus_${i}`}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={1}
          >
            <Torus R={6 / 5} r={1 / 3} />
            <meshPhongMaterial
              map={texture_globe}
              opacity={jsj_tori_opacity}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
          <mesh
            key={`jsj_torus_logitude_${i}`}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={-1}
          >
            <Torus R={8 / 5} r={0.075} />
            <meshPhongMaterial
              color={[1, 0, 0]}
              opacity={jsj_tori_logitude_opacity}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
          <mesh
            key={`jsj_torus_logitude_compressing_disk_${i}`}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={-1}
          >
            <circleGeometry args={[8 / 5 - 0.075, 64]} />
            <meshPhongMaterial
              color={[0, 1, 1]}
              opacity={jsj_tori_logitude_compressing_disk_opacity}
              transparent={true}
              side={2}
              depthWrite={false}
            />
          </mesh>
          <mesh
            key={`jsj_torus_meridian_${i}`}
            position={new Vector3(0, 0, 6 / 5)}
            rotation={[0, Math.PI / 2, 0]}
            renderOrder={-1}
          >
            <Torus R={2 / 5} r={0.075} />
            <meshPhongMaterial
              color={[0, 0, 1]}
              opacity={jsj_tori_meridian_opacity}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
          <mesh
            key={`jsj_torus_meridian_compressing_disk_${i}`}
            position={new Vector3(0, 0, 6 / 5)}
            rotation={[0, Math.PI / 2, 0]}
            renderOrder={-1}
          >
            <circleGeometry args={[2 / 5 - 0.075, 64]} />
            <meshPhongMaterial
              color={[1, 1, 0]}
              opacity={jsj_tori_meridian_compressing_disk_opacity}
              transparent={true}
              side={2}
              depthWrite={false}
            />
          </mesh>
          <mesh
            key={`jsj_component_${i}`}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={0}
          >
            <Torus R={6 / 5} r={1 / 4} />
            <meshPhongMaterial
              color={new Color().setHSL(i / splitting_num, 1, 0.5)}
              opacity={jsj_components_opacity}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
          <mesh
            key={`jsj_obsturction_longitude${i}`}
            position={new Vector3(0, 0, 6 / 5)}
            rotation={[0, Math.PI / 2, 0]}
            renderOrder={0}
          >
            <Torus R={4 / 5} r={0.15} />
            <meshPhongMaterial
              color={new Color().setHSL(0, 0, 0.5)}
              opacity={jsj_obstruction_opacity}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
          <mesh
            key={`jsj_obsturction_meridian${i}`}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={0}
          >
            <Torus R={6 / 5} r={0.15} />
            <meshPhongMaterial
              color={new Color().setHSL(0, 0, 0.5)}
              opacity={jsj_obstruction_opacity}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function App() {
  const glRef = useRef<WebGLRenderer>(null);

  const {
    splitting_num,
    jsj_tori_opacity,
    jsj_components_opacity,
    jsj_tori_logitude,
    jsj_tori_meridian,
    jsj_tori_logitude_compressing_disk,
    jsj_tori_meridian_compressing_disk,
    jsj_obstruction_opacity,
    path_tracing,
  } = useControls({
    splitting_num: {
      value: 4,
      min: 1,
      max: 20,
      step: 1,
      hint: "Number of tori in the toroidal splitting",
    },
    jsj_tori_opacity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      hint: "Opacity of the tori in the toroidal splitting",
    },
    jsj_tori_logitude: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      hint: "Opacity of the longitude lines in the toroidal splitting",
    },
    jsj_tori_meridian: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      hint: "Opacity of the meridian lines in the toroidal splitting",
    },
    jsj_components_opacity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      hint: "Opacity of the JSJ components in the toroidal splitting",
    },
    jsj_tori_meridian_compressing_disk: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      hint: "Opacity of the compressing disks for the meridian lines in the toroidal splitting",
    },
    jsj_tori_logitude_compressing_disk: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      hint: "Opacity of the compressing disks for the longitude lines in the toroidal splitting",
    },
    jsj_obstruction_opacity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      hint: "Opacity of the obstructions in the toroidal splitting",
    },
    path_tracing: {
      value: false,
      hint: "Whether to enable path tracing or not. Enabling this will significantly increase the rendering time, but will produce more accurate and visually appealing results.",
    },
  });

  return (
    <>
      <Leva />
      <Canvas
        camera={{ position: [0, 5, 9], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          premultipliedAlpha: true,
        }}
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
        <Pathtracer enabled={path_tracing}>
          <OrbitControls makeDefault enableDamping={false} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[8, 8, 2]} intensity={1} castShadow />
          <Scene
            splitting_num={splitting_num}
            jsj_tori_opacity={jsj_tori_opacity}
            jsj_components_opacity={jsj_components_opacity}
            jsj_tori_logitude_opacity={jsj_tori_logitude}
            jsj_tori_meridian_opacity={jsj_tori_meridian}
            jsj_obstruction_opacity={jsj_obstruction_opacity}
            jsj_tori_logitude_compressing_disk_opacity={
              jsj_tori_logitude_compressing_disk
            }
            jsj_tori_meridian_compressing_disk_opacity={
              jsj_tori_meridian_compressing_disk
            }
            path_tracing
          />
        </Pathtracer>
      </Canvas>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
