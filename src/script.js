import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import * as THREE from 'three/webgpu'
import BaseObject from './object/baseObject'
import Ground from './object/ground'
import Sword from './object/sword'
import { pass, uniform } from 'three/tsl'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import settingsPane from './tools/Pane'
import { film } from 'three/examples/jsm/tsl/display/FilmNode.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.threejs')

// Scene
const scene = new THREE.Scene()

// Environement map
const rgbeLoader = new RGBELoader()

rgbeLoader.load('./sky_environnement.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.environment = environmentMap
    scene.background = environmentMap
    scene.environmentIntensity = 0.8
})

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 1
camera.position.z = 5
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGPURenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x859dff)

const baseObject = new BaseObject(1);
// scene.add(baseObject)

const ground = new Ground(10);
// scene.add(ground)

const sword = new Sword(1);
scene.add(sword)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(sword.position.x, sword.position.y, sword.position.z)
controls.enableDamping = true
// camera.lookAt(sword.position)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.castShadow = true
directionalLight.position.set(2, 0.75, -1).normalize().multiplyScalar(10)
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.bottom = -10
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.near = 0.01
directionalLight.shadow.camera.far = 20
directionalLight.shadow.radius = 3
directionalLight.shadow.normalBias = 0.1
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0x859dff, 1)
scene.add(ambientLight)

/**
 * Post-processing
 */
const renderPipeline = new THREE.RenderPipeline(renderer)

const scenePass = pass(scene, camera)

const sceneOutput = scenePass.getTextureNode('output')

// Bloom pass
const bloomSettings = {
    strength: 0.15,
    radius: 0.7,
    threshold: 0.7,
};

const bloomPass = bloom(sceneOutput, bloomSettings.strength, bloomSettings.radius, bloomSettings.threshold)
const bloomOutput = sceneOutput.add(bloomPass)


const bloomFolder = settingsPane.addFolder({
    title: "Bloom",
    expanded: false,
});

bloomFolder.addBinding(bloomSettings, "strength", {
    min: 0,
    max: 2,
    step: 0.01,
    label: "strength",
}).on("change", (event) => {
    bloomPass.strength.value = event.value;
});

bloomFolder.addBinding(bloomSettings, "radius", {
    min: 0,
    max: 1,
    step: 0.01,
    label: "radius"
}).on("change", (event) => {
    bloomPass.radius.value = event.value;
});

bloomFolder.addBinding(bloomSettings, "threshold", {
    min: 0,
    max: 1,
    step: 0.01,
    label: "threshold",
}).on("change", (event) => {
    bloomPass.threshold.value = event.value;
});

// Film pass

const filmSettings = {
    intensity: 1.09,
};

const filmIntensity = uniform(filmSettings.intensity);

const filmPass = film(bloomOutput, filmIntensity);

const filmFolder = settingsPane.addFolder({
    title: "Film",
    expanded: false,
});

filmFolder.addBinding(filmSettings, "intensity", {
    min: 0,
    max: 5,
    step: 0.01,
    label: "Intensity",
}).on("change", (event) => {
    filmIntensity.value = event.value;
});

renderPipeline.outputNode = filmPass;

/**
 * Animate
 */
const timer = new THREE.Timer()
timer.connect(document)

const tick = () =>
{
    timer.update()
    const delta = timer.getDelta()

    sword.tick(timer);

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    renderPipeline.render()
}

renderer.setAnimationLoop(tick)

console.log(renderer.backend)