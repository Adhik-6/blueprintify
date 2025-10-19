import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export default function Walkthrough() {
    const { id } = useParams();
    const [modelUrl, setModelUrl] = useState(`/${id}.glb`);

    useEffect(() => setModelUrl(`/${id}.glb`), [id]);

    useEffect(() => {
        const container = document.getElementById("walkthrough");
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 20, 10);
        scene.add(light);

        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x228B22, 0.6);
        scene.add(hemiLight);

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
            const model = gltf.scene;
            model.scale.set(10, 10, 10);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.sub(center);
            model.position.y += size.y / 2;
            scene.add(model);

            const distance = Math.max(size.x, size.z) * 1.5;
            camera.position.set(0, 3, distance); // ⬆️ taller (4m height)
            camera.lookAt(0, size.y * 0.5, 0);
        });

        const controls = new PointerLockControls(camera, renderer.domElement);
        const onClick = () => controls.lock();
        document.addEventListener("click", onClick);

        const keys = {};
        const onKeyDown = (e) => (keys[e.code] = true);
        const onKeyUp = (e) => (keys[e.code] = false);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        let isMounted = true;

        function animate() {
            if (!isMounted) return;
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
            isMounted = false;

            // 🧹 Remove listeners and renderer safely
            document.removeEventListener("click", onClick);
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);

            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }

            renderer.dispose();
        };
    }, [modelUrl]);

    return <div id="walkthrough" style={{ width: "100%", height: "600px" }} />;
}
