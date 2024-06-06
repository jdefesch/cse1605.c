import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const createStand = (x, y, z, scene) => {
    const baseGeometry = new THREE.BoxGeometry(50, 5, 50);
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(x, y - 2.5, z);
    scene.add(base);

    const seatGeometry = new THREE.BoxGeometry(2, 1, 2);
    const seatMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const numRows = 10;
    const seatsPerRow = 25;
    const seatSpacing = 2.5;
    const rowSpacing = 1.5;

    for (let i = -seatsPerRow / 2; i <= seatsPerRow / 2; i++) {
        for (let j = 0; j < numRows; j++) {
            const seat = new THREE.Mesh(seatGeometry, seatMaterial);
            seat.position.set(x + i * seatSpacing, y + j * rowSpacing, z - 15 + j * rowSpacing);
            scene.add(seat);
        }
    }
};


const createDrivingSurface = (x, y, z, width, height, scene) => {
    const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x94928e, side: THREE.DoubleSide });
    const surfaceGeometry = new THREE.PlaneGeometry(width, height);
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2;
    surface.position.set(x, y, z);
    scene.add(surface);
};

const createStartingLineArc = (radius, arcAngle, numSegments, y, scene) => {
    const arcMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Calculate the height and position adjustment based on the radius and desired arc angle
    const heightAdjustment = radius * (1 - Math.cos(arcAngle / 2));

    for (let i = 0; i <= numSegments; i++) {
        const theta = (i / numSegments) * arcAngle - (arcAngle / 2);
        const x = radius * Math.sin(theta);
        const z = radius * Math.cos(theta);
        const adjustedY = y + heightAdjustment * Math.sin((i / numSegments) * Math.PI); // Creates an arc shape

        const boxGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
        const box = new THREE.Mesh(boxGeometry, arcMaterial);
        box.position.set(x, adjustedY, z);
        box.rotation.y = Math.PI / 2 - theta; // Align the boxes along the arc
        scene.add(box);
    }
};


const createSign = (x, y, z, width, height, textureUrl, scene) => {
    const postGeometry = new THREE.BoxGeometry(0.2, y, 0.2);
    const postMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(x, y / 2, z);
    scene.add(post);

    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (texture) => {
        const signGeometry = new THREE.PlaneGeometry(width, height);
        const signMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(x, y + height / 2, z);
        sign.rotation.y = Math.PI;
        scene.add(sign);
    });
};

const createFinishLine = (x, y, z, width, height, scene) => {
    const loader = new THREE.TextureLoader();
    loader.load('checkered_flag.jpg', (texture) => {
        const finishLineGeometry = new THREE.PlaneGeometry(width, height);
        const finishLineMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial);
        finishLine.position.set(x, y + height / 2, z);
        finishLine.rotation.y = Math.PI / 2;
        scene.add(finishLine);
    });

    const postGeometry = new THREE.BoxGeometry(0.2, height, 0.2);
    const postMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(x, y + height / 2, z - width / 2);
    scene.add(leftPost);

    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(x, y + height / 2, z + width / 2);
    scene.add(rightPost);
};

const createPitStop = (x, y, z, scene) => {
    const toolboxGeometry = new THREE.BoxGeometry(2, 1, 1);
    const toolboxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const toolbox = new THREE.Mesh(toolboxGeometry, toolboxMaterial);
    toolbox.position.set(x, y, z);
    scene.add(toolbox);

    const tireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const tireMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    for (let i = 0; i < 4; i++) {
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.position.set(x + 2, y + i * 0.35, z);
        scene.add(tire);
    }

    const partGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
    const partMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const part = new THREE.Mesh(partGeometry, partMaterial);
    part.position.set(x + 4, y, z);
    scene.add(part);
};

const createCircularTrack = (radius, segments, y, scene) => {
    const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x007700 });
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        const boxGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const box = new THREE.Mesh(boxGeometry, trackMaterial);
        box.position.set(x, y, z);
        scene.add(box);
    }
};

const init = () => {
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    const texture = loader.load('skybox.jpg', () => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
    });

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 100, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 200;
    controls.enablePan = false;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    let kart;
    const mtlLoader = new MTLLoader();
    mtlLoader.load('kart.mtl', (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('kart.obj', (object) => {
            kart = object;
            scene.add(kart);
            kart.position.set(0, 0, 0);
            kart.scale.set(0.1, 0.1, 0.1);
            kart.rotation.y = 0;
        });
    });

    createStand(0, 1, 90, scene);
    createDrivingSurface(0, 0, 0, 100, 100, scene);
    createStartingLineArc(50, Math.PI / 2, 100, 0, scene);
    createSign(0, 5, -10, 3, 2, 'start.jpg', scene);
    createFinishLine(0, 1, -20, 10, 5, scene);
    createPitStop(-10, 0.5, 5, scene);
    createCircularTrack(50, 100, 0, scene);

    let direction = new THREE.Vector3(1, 0, 0);
    let velocity = new THREE.Vector3(0, 0, 0);
    const maxSpeed = 1.0; // Maximum speed
    const acceleration = 0.001; // Acceleration factor
    const deceleration = 0.98;

    const keys = {};

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        if (kart) {
            // Update direction based on kart's current rotation
            direction.set(Math.sin(kart.rotation.y + Math.PI / 2), 0, Math.cos(kart.rotation.y + Math.PI / 2)).normalize();

            // Adjust velocity based on key presses
            if (keys['w']) {
                velocity.addScaledVector(direction, -acceleration);
            } else if (keys['s']) {
                velocity.addScaledVector(direction, acceleration);
            } else {
                // Apply deceleration when no keys are pressed
                velocity.multiplyScalar(deceleration);
            }

            // Cap the speed at maxSpeed
            if (velocity.length() > maxSpeed) {
                velocity.setLength(maxSpeed);
            }

            // Rotate the kart
            if (velocity.length() > 0.01) {
                kart.position.add(velocity);

                if (keys['a']) kart.rotation.y += 0.1 * velocity.length();
                if (keys['d']) kart.rotation.y -= 0.1 * velocity.length();
            }
        }

        controls.update();
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

init();
