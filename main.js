import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js';


let width, height;
const canvas = document.getElementById('canvas');
const text = document.querySelector(".text-container");

const setSizes = () => {
    width = window.innerWidth;
    height = window.innerHeight;
}

setSizes();

window.addEventListener('resize', () => {
    setSizes();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

});

//ROOT BASIC VARIABLES
const colorBlue = 0x4763ad;
const colorLight = 0xf0f0f7;
const colorRed = 0xff1155;
const colorGray = 0x777788;

//LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // soft white light
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.position.set(0, 2, 5);
dirLight.lookAt(0, 0, 0);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight2.castShadow = true;
dirLight2.shadow.mapSize.width = 512;
dirLight2.shadow.mapSize.height = 512;
dirLight2.position.set(0, -2, -5);
dirLight2.lookAt(0, 0, 0);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 500);
camera.name = "Camera_A";
camera.position.set(0, 3, 7);

// SCENE
const scene = new THREE.Scene({});
scene.background = new THREE.Color(colorLight);

// GEOMETRIES 
const geometry = new THREE.BoxGeometry(2, 2, 2);


// MATERIAL
const materialA = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorBlue,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});
const materialB = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorRed,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});
const materialC = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorGray,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

// MESH
let cubeA = new THREE.Mesh(geometry, materialA);
let cubeB = new THREE.Mesh(geometry, materialB);
let cubeC = new THREE.Mesh(geometry, materialC);
cubeA.userData.type = "cube";
cubeB.userData.type = "cube";
cubeC.userData.type = "cube";

cubeA.userData.name = "a";
cubeB.userData.name = "b";
cubeC.userData.name = "c";

cubeB.scale.set(0.75, 0.75, 0.75);
cubeC.scale.set(0.75, 0.75, 0.75);

cubeB.add(cubeC);
cubeA.add(cubeB);

cubeA.position.set(-1.5, 0, 0)
cubeB.position.set(2.5, 0, 0);
cubeC.position.set(3, 0, 0);

const cubes = [cubeA, cubeB, cubeC];

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.update();


// STATS
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


// ADD TO SCENE
scene.add(camera);
scene.add(ambientLight, dirLight, dirLight2);
scene.add(cubeA);


function calculateDistance() {
    cubes.forEach(cube => {
        let vCube = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        let vCam = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        let delta = vCube.distanceTo(vCam).toFixed(2);
        text.querySelector(`#pos-${cube.userData.name}`).textContent = delta;
    });

}

// ANIMATION LOOP
const animation = () => {

    stats.begin();

    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
    stats.end();
    calculateDistance();
    renderer.setAnimationLoop(animation);
}

animation();




// CLICKING EVENTS
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function getRnd(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

function moveCubes() {
    cubes.forEach(cube => {
        new TWEEN.Tween(cube.position).to({
            x: getRnd(-3, 3),
            y: getRnd(-3, 3),
            z: getRnd(-3, 3),
        }, 300)
            .easing(TWEEN.Easing.Quartic.Out)
            .start();
    });

}

function clicking(e) {

    pointer.x = (e.clientX / width) * 2 - 1;
    pointer.y = -(e.clientY / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    let intersection = raycaster.intersectObjects(scene.children);

    console.log(intersection[0]);

    if (intersection[0] && intersection[0].object.userData.type === "cube") {
        moveCubes();
    }
}

window.addEventListener('click', clicking);
