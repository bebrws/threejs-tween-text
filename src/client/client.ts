import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';





function loadFont(): Promise<any> {
    return new Promise((resolve, reject) => {
        const loader = new FontLoader();
        const fontName = 'optimer';
        loader.load('fonts/' + fontName + '_bold.typeface.json', function (response) {
            resolve(response);
        });
    });
}


async function main() {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.set(0, 400, 700);
    const cameraTarget = new THREE.Vector3(0, 150, 0);
    

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffd0,
        wireframe: true,
    })

    // const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
    // const cube = new THREE.Mesh(cubeGeometry, material)
    // scene.add(cube);

    const font = await loadFont();
    // const text = new THREE.Mesh(geometry, material)
    const text = new TextGeometry("heyyyyy", {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 4,

        bevelThickness: 2,
        bevelSize: 1.5,
        bevelEnabled: true

    });

    text.computeBoundingBox();

    const materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];
    const textMesh = new THREE.Mesh(text, materials);
    textMesh.position.x = 0;
    textMesh.position.y = 0;
    textMesh.position.z = 0;

    const group = new THREE.Group();
    group.position.y = 100;

    group.add(textMesh);
    
    scene.add(group);
    
    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    dirLight.position.set( 0, 0, 1 ).normalize();
    scene.add( dirLight );

    const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );

    // scene.add(textMesh)

    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }

    const textScale = { x: 1, y: 1, z: 1 };
    const updatetextScale = () => {
        // text.scale.set(textScale.x, textScale.y, textScale.z)
    };
    const textTween = new TWEEN.Tween(textScale)
        .to({ x: 0.1, y: 0.1, z: 0.1 })
        .delay(100)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(updatetextScale)
    const textTweenBack = new TWEEN.Tween(textScale)
        .to({ x: 1, y: 1, z: 1 })
        .delay(100)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(updatetextScale);

    const textTweenChain = textTween.chain(textTweenBack);
    textTweenBack.chain(textTween);

    textTweenChain.start();


    function animate() {
        requestAnimationFrame(animate)

        TWEEN.update();
        // text.rotation.x += 0.01
        // text.rotation.y += 0.01

        render()
    }

    function render() {
        camera.lookAt(cameraTarget);
        
        renderer.render(scene, camera)
    }
    animate()
}

main();