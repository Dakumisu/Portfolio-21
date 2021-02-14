import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let heroImgDefault = document.querySelector('.img--default img')
let heroImgHover = document.querySelector('.img--hover img')

heroImgDefault.src = "/img/moi_Default.jpg"
heroImgHover.src = "/img/moi_Hover.png"


// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xff0000 )

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// Iceberg
// const iceberg = new GLTFLoader(icebergModel)
// scene.add(iceberg)
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/3D/iceberg.gltf',
    (gltf) => {
        // console.log('success')
        // scene.add(gltf.scene.children[0])
        const children = [...gltf.scene.children]
        for(const child of children) {
            console.log(child)
            child.scale.set(0.1, 0.1, 0.1)
            scene.add(child)
        }
    },
    // (progress) =>
    // {
    //     console.log('progress')
    //     console.log(progress)
    // },
    // (error) =>
    // {
    //     console.log('error')
    //     console.log(error)
    // }
)

const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()