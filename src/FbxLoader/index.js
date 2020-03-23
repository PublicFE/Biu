import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {animate, onWindowResize} from "../utils";

export default function FbxLoader(container, source) {
    let mixer;
    // 场景
    const scene = new THREE.Scene();
    setScene(scene, {background: {color: 0x0000ff}, fog: {color: 0x3385ff, near: 200, far: 1000}});
    // 相机
    const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);
    // 灯光
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;

    scene.add(light);

    const clock = new THREE.Clock();

    // ground
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const grid = new THREE.GridHelper(200, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // model


    Promise.all(source.map((url) => getModle(url))).then((arr) => {

        arr.forEach((object) => {
            mixer = new THREE.AnimationMixer(object);
            mixer.setTime(10)

            const action = mixer.clipAction(object.animations[0]);

            action.play()
            // action.time = 10;
            // action.setLoop('LoopRepeat',10)

            const Pause = document.getElementById('Pause');
            const Go = document.getElementById('GO');
            const Stop = document.getElementById('Stop');
            Pause.onclick = () => {
                scene.translateZ(-10)
                object.translateZ(10)

            }
            Go.onclick = () => {
                action.paused = true;
            };
            Stop.onclick = () => {
                action.stop();
            }

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(object);
        });
        animate({clock, mixer, scene, camera, renderer})

    });

    const renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    window.addEventListener('resize', () => onWindowResize(camera, renderer), false);
    container.appendChild(renderer.domElement);
}

function setScene(scene, {background, fog}) {
    scene.background = new THREE.Color(background.color);
    scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);
}

function getModle(url) {
    const loader = new FBXLoader();
    return new Promise((resolve, reject) => {
        loader.load(url, function (object) {
            resolve(object);
        })
    })
}



