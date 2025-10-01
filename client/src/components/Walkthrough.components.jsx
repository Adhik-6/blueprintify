import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export default function Walkthrough({ modelUrl }) {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("walkthrough").appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    // Floor (so we don’t fall forever)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Load model
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      scene.add(gltf.scene);
    });

    // FPS controls
    const controls = new PointerLockControls(camera, renderer.domElement);
    document.addEventListener("click", () => controls.lock());

    // Movement
    const keys = {};
    document.addEventListener("keydown", (e) => (keys[e.code] = true));
    document.addEventListener("keyup", (e) => (keys[e.code] = false));

    camera.position.set(0, 2, 5);

    function animate() {
      requestAnimationFrame(animate);

      if (controls.isLocked) {
        const speed = 0.1;
        if (keys["KeyW"]) controls.moveForward(speed);
        if (keys["KeyS"]) controls.moveForward(-speed);
        if (keys["KeyA"]) controls.moveRight(-speed);
        if (keys["KeyD"]) controls.moveRight(speed);
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      document.getElementById("walkthrough").innerHTML = "";
    };
  }, [modelUrl]);

  return <div id="walkthrough" style={{ width: "100%", height: "600px" }} />;
}
