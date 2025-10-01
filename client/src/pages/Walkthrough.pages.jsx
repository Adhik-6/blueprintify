import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export default function Walkthrough() {
    const {id} = useParams()
    const [modelUrl, setModelUrl] = useState(`/${id}.glb`);

    useEffect(() => setModelUrl(`/${id}.glb`), [id]);

    // console.log(modelUrl)

    useEffect(() => {
        const scene = new THREE.Scene();

        // 🌌 Sky blue background
        scene.background = new THREE.Color(0x87ceeb);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("walkthrough").appendChild(renderer.domElement);

        // ☀️ Sunlight
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 20, 10);
        scene.add(light);

        // 🌍 Hemisphere light (blue sky + green ground bounce)
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x228B22, 0.6);
        scene.add(hemiLight);

        // 🌱 Grass floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshStandardMaterial({ color: 0x228B22 }) // grassy green
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        // 🏠 Load model
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
            const model = gltf.scene;

            // Scale
            model.scale.set(10, 10, 10);

            // Center and lift
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.sub(center);
            model.position.y += size.y / 2;

            scene.add(model);

            // 🎥 Camera start (4m tall, a bit back)
            const distance = Math.max(size.x, size.z) * 1.5;
            camera.position.set(0, 2, distance);   // height = 4m
            camera.lookAt(0, size.y * 0.5, 0);
        });

        // 🎮 FPS controls
        const controls = new PointerLockControls(camera, renderer.domElement);
        document.addEventListener("click", () => controls.lock());

        // Keyboard movement
        const keys = {};
        document.addEventListener("keydown", (e) => (keys[e.code] = true));
        document.addEventListener("keyup", (e) => (keys[e.code] = false));

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


        // Cleanup
        return () => (document.getElementById("walkthrough").innerHTML = "");
    }, [modelUrl]);

    return <div id="walkthrough" style={{ width: "100%", height: "600px" }} />;
}
