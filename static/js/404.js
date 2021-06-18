import '../../src/style.css'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TweenMax } from 'gsap/gsap-core'

let linkClicked = false

document.querySelector('.linkRedirect').addEventListener('click', () => {
    linkClicked = true
    const currentRotationValue = icebergModel.rotation.y
    TweenLite.to(icebergModel.scale, .75, { x: 0, y: 0, z: 0, ease: Back.easeIn })
    TweenLite.to(icebergModel.rotation, 1, { y: currentRotationValue + Math.PI, ease: Power2.easeIn })

    gsap.to(document.querySelectorAll('.container span'), 1, { opacity: 0, y: -40, stagger: { each: .1, from: 'start'}, ease: Power3.easeIn, delay: .1 })
    gsap.to(document.querySelector('.container a'), 1, { opacity: 0, y: -40, ease: Power3.easeIn, delay: .3 })
    gsap.to(document.querySelector('.background'), 2, { yPercent: -150, ease: Power3.easeInOut, delay: .3 })
    gsap.to(document.querySelector('.backgroundTransition'), 2, { yPercent: -100, ease: Power3.easeInOut, delay: .3 })
    
    gsap.from(document.querySelector('.loader--container'), 2, { y: 40, ease: Power3.easeInOut, delay: 2 })
    gsap.to(document.querySelector('.loader--container'), 2, { opacity: 1, ease: Power3.easeInOut, delay: 2 })

    setTimeout(() => {
        window.location.replace('https://www.dakumisu.fr/')
    }, 4000);
})

// --------------------------------------- Init THREE.js features ---------------------------------------
// Scene
const mainScene = new THREE.Scene()

// Sizes
const sizes = {
   width: window.innerWidth,
   height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 10
mainScene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
   powerPreference: 'high-performance',
   canvas: document.querySelector('.webgl'),
   antialias: true,
   alpha: true
})

renderer.setSize(sizes.width, sizes.height)

// Lights
const hemisphereLightDown = new THREE.HemisphereLight(new THREE.Color("#29363C"), new THREE.Color("#48717F"), 0.9)
mainScene.add(hemisphereLightDown)

// Materials
const toonMaterial = new THREE.MeshToonMaterial()
toonMaterial.color = new THREE.Color("#E9EFEF")
toonMaterial.aoMapIntensity = 1

// --------------------------------------- Init Iceberg ---------------------------------------
const gltfLoader = new GLTFLoader()
let icebergModel

let rotationYHome = Math.PI * 1.7

gltfLoader.load('/3D/iceberg_2.0.gltf', (addIcebergModel) => {
        icebergModel = addIcebergModel.scene
        icebergModel.traverse((e) => {
            if (e.isMesh)
                e.material = toonMaterial
        })

        icebergModel.scale.set(.28, .28, .28)
        icebergModel.rotation.y = rotationYHome
        icebergModel.position.set(0, 1, 0)
        mainScene.add(icebergModel)
    }
)

window.addEventListener('resize', () => {
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

const clock = new THREE.Clock()
let lowestElapsedTime = 0
function raf() {
    const elapsedTime = clock.getElapsedTime()
    lowestElapsedTime += 0.0006

    if (icebergModel && !linkClicked) {
        icebergModel.position.y = Math.sin(elapsedTime) * .15 + .85
        icebergModel.rotation.y = lowestElapsedTime * Math.PI
    }

    // Render
    renderer.render(mainScene, camera)
    window.requestAnimationFrame(raf)
}

raf()

console.log(`%c ${'there\'s nothing here go away 👀'}`, `color: #E9EFEF; font-weight: bold; font-size: 1rem;`)