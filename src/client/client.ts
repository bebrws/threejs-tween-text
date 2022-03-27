import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffd0,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const cubeScale = { x: 1, y: 1, z: 1 };
const updateCubeScale = () => {
    cube.scale.set(cubeScale.x, cubeScale.y, cubeScale.z)
};
const cubeTween = new TWEEN.Tween(cubeScale)
    .to({ x: 0.1, y: 0.1, z: 0.1 })
    .delay(100)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(updateCubeScale)
const cubeTweenBack = new TWEEN.Tween(cubeScale)    
    .to({ x: 1, y: 1, z: 1 })
    .delay(100)
    .easing(TWEEN.Easing.Bounce.Out)
    .onUpdate(updateCubeScale);

const cubeTweenChain = cubeTween.chain(cubeTweenBack);
cubeTweenBack.chain(cubeTween);

cubeTweenChain.start();


function animate() {
    requestAnimationFrame(animate)

    TWEEN.update();
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    
    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
