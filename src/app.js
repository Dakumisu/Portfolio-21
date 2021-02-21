import './style.css'
import './locomotiveBase.css'
import '../static/js/audio.js'
// import '../static/js/cursor.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Interaction } from 'three.interaction'
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
import LocomotiveScroll from 'locomotive-scroll'
import gsap from 'gsap/gsap-core'

// import vertexShader from './glsl/vertexShader.glsl'
// import fragmentShader from './glsl/fragmentShader.glsl'
const hudContainer = document.querySelector('.hud--container')
const hudContainerTop = document.querySelector('.hud--container .hud--nav__top')
const hudContainerBottom = document.querySelector('.hud--container .hud--nav__bottom')
const scrollContainer = document.querySelector('.scroll--container')
const aboutContainer = document.querySelector('.about--container')
const projectsContainer = document.querySelector('.projects--container')
const canvasContainer = document.querySelector('.canvas--container')

const cursor = document.querySelector('.cursor')
const mouse = new THREE.Vector2()

let navName = document.querySelector('.nav--name')
let nameSpanContainer = document.querySelector('.spanName--container')
let pseudoSpanContainer = document.querySelector('.spanPseudo--container')

let staggerVelocity = .05
let durationVelocity = .4
let easeDefault = "Power3.inOut"

let THREElightBlue = new THREE.Color("#E9EFEF")
let THREEnormalBlue = new THREE.Color("#48717F")
let THREEdarkBlue = new THREE.Color("#29363C")
let THREEdarkerBlue = new THREE.Color("#171f22")

const lightBlue = "#E9EFEF"
const normalBlue = "#48717F"
const darkBlue = "#29363C"
const darkerBlue = "#171f22"

let onMouseDown = false
let mouseOnModel = false
let isIcebergOnTheLeft = false

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color('#E9EFEF')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 10
scene.add(camera)

// Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)

// Interaction
const interaction = new Interaction(renderer, scene, camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.75, 0)
// controls.enableDamping = true

// Lights
// const light = new THREE.AmbientLight('#ffff00', 0.5)
const pointLight = new THREE.PointLight(THREEdarkerBlue, .8)
pointLight.position.set(4, -20, 0)
// scene.add(pointLight)
const hemisphereLightUp = new THREE.HemisphereLight( THREElightBlue, THREEdarkBlue, 1.3)
scene.add(hemisphereLightUp)
const hemisphereLightDown = new THREE.HemisphereLight( THREEdarkBlue, THREEnormalBlue, 0)
scene.add(hemisphereLightDown)

const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 )
// scene.add( pointLightHelper )

const spotLightUp = new THREE.SpotLight( THREElightBlue, 0.15 )
spotLightUp.position.set( 0, 8, 0 )
// scene.add( spotLightUp )
const spotLightDown = new THREE.SpotLight( THREEdarkerBlue, 1 )
spotLightDown.position.set( 4, -10, 0 )
// scene.add( spotLightDown )

const spotLightHelperUp = new THREE.SpotLightHelper(spotLightUp, 0.1)
// scene.add(spotLightHelperUp)
const spotLightHelperDown = new THREE.SpotLightHelper(spotLightDown, 0.1)
// scene.add(spotLightHelperDown)

// Textures
const textureLoader = new THREE.TextureLoader()

// const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

// Materials
const toonMaterial = new THREE.MeshToonMaterial()
// toonMaterial.map = gradientTexture
toonMaterial.color = THREElightBlue
toonMaterial.aoMapIntensity = 1


// const materialShader = new THREE.ShaderMaterial({
//     vertexShader : 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);}',
//     fragmentShader: '#define USE_TRANSLUCENCY#ifdef USE_TRANSLUCENCY uniform sampler2D thicknessMap; uniform float thicknessPower; uniform float thicknessScale; uniform float thicknessDistortion; uniform float thicknessAmbient; uniform vec2 thicknessRepeat;#endif#define PHYSICALuniform vec3 diffuse;uniform vec3 emissive;uniform float roughness;uniform float metalness;uniform float opacity;#ifndef STANDARD uniform float clearCoat; uniform float clearCoatRoughness;#endifuniform float envMapIntensity; // temporaryvarying vec3 vViewPosition;#ifndef FLAT_SHADED varying vec3 vNormal;#endif#include <common>#include <packing>#include <color_pars_fragment>#include <uv_pars_fragment>#include <uv2_pars_fragment>#include <map_pars_fragment>#include <alphamap_pars_fragment>#include <aomap_pars_fragment>#include <lightmap_pars_fragment>#include <emissivemap_pars_fragment>#include <envmap_pars_fragment>#include <fog_pars_fragment>#include <bsdfs>#include <cube_uv_reflection_fragment>#include <lights_pars>#include <lights_physical_pars_fragment>#include <shadowmap_pars_fragment>#include <bumpmap_pars_fragment>#include <normalmap_pars_fragment>#include <roughnessmap_pars_fragment>#include <metalnessmap_pars_fragment>#include <logdepthbuf_pars_fragment>#include <clipping_planes_pars_fragment>void main() { #include <clipping_planes_fragment> vec4 diffuseColor = vec4( diffuse, opacity ); ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) ); vec3 totalEmissiveRadiance = emissive; #include <logdepthbuf_fragment> #include <map_fragment> #include <color_fragment> #include <alphamap_fragment> #include <alphatest_fragment> #include <specularmap_fragment> #include <roughnessmap_fragment> #include <metalnessmap_fragment> #include <normal_flip> #include <normal_fragment> #include <emissivemap_fragment> // accumulation #include <lights_physical_fragment> #include <lights_template> #ifdef USE_TRANSLUCENCY vec3 thicknessColor = vec3(1.0, 1.0, 1.0); vec3 thickness = thicknessColor * texture2D(thicknessMap, vUv * thicknessRepeat).r; vec3 N = geometry.normal; vec3 V = normalize(geometry.viewDir); float thicknessCutoff = 0.75; float thicknessDecay = 1.0; #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct ) for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) { pointLight = pointLights[ i ]; vec3 vLightDir = pointLight.position - geometry.position; vec3 L = normalize(vLightDir); float lightDist = length(vLightDir); float lightAtten = punctualLightIntensityToIrradianceFactor(lightDist, pointLight.distance, pointLight.decay); vec3 LTLight = normalize(L + (N * thicknessDistortion)); float LTDot = pow(saturate(dot(V, -LTLight)), thicknessPower) * thicknessScale; vec3 LT = lightAtten * (LTDot + thicknessAmbient) * thickness; reflectedLight.directDiffuse += material.diffuseColor * pointLight.color * LT; } #endif #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea ) for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) { rectAreaLight = rectAreaLights[ i ]; vec3 vLightDir = rectAreaLight.position - geometry.position; vec3 L = normalize(vLightDir); float lightDist = length(vLightDir); float lightAtten = punctualLightIntensityToIrradianceFactor(lightDist, thicknessCutoff, thicknessDecay); vec3 LTLight = normalize(L + (N * thicknessDistortion)); float LTDot = pow(saturate(dot(V, -LTLight)), thicknessPower) * thicknessScale; vec3 LT = lightAtten * (LTDot + thicknessAmbient) * thickness; reflectedLight.directDiffuse += material.diffuseColor * rectAreaLight.color * LT; } #endif #endif // modulation #include <aomap_fragment> vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance; gl_FragColor = vec4( outgoingLight, diffuseColor.a ); #include <premultiplied_alpha_fragment> #include <tonemapping_fragment> #include <encodings_fragment> #include <fog_fragment>}',
//     uniforms: {
//         time: { type: 'f', value: 0 },
//         thicknessMap: { type: 't', value: new THREE.Texture() },
//         thicknessRepeat: { type: 'v3', value: new THREE.Vector2() },
//         thicknessPower: { type: 'f', value: 20 },
//         thicknessScale: { type: 'f', value: 4 },
//         thicknessDistortion: { type: 'f', value: 0.185 },
//         thicknessAmbient: { type: 'f', value: 0.0 },
//     },
//     transparent: true,
//     opacity: 1.0
// })

// Iceberg
const gltfLoader = new GLTFLoader()
let icebergModel
let rotationYDefault = Math.PI * 1.7
let rotationYOnTheLeft = Math.PI * 2.1

gltfLoader.load('/3D/iceberg_2.0.gltf', (addIcebergModel) => {
        icebergModel = addIcebergModel.scene
        icebergModel.traverse((e) => {
            if (e.isMesh) e.material = toonMaterial
        })
        icebergModel.scale.set(.02, .02, .02)
        icebergModel.rotation.y = rotationYDefault
        icebergModel.position.set(0, .5, 0)
        scene.add(icebergModel)

        icebergModel.on('click', () => {
            canvasContainer.style.zIndex = -1
            if (icebergModel.scale.x == 0.02) {
                gsap.to(icebergModel.scale, 1, { x: 0.28, y: 0.28, z: 0.28, ease: Elastic.easeOut })
                gsap.to(icebergModel.position, 1, { x: 4, ease: Elastic.easeOut })
                // gsap.to(icebergModel.rotation, .5, { y: icebergModel.rotation.y += Math.PI * .25, ease: Power4.easeInOut })
            } 
            // else if (icebergModel.scale.x == 0.28) {
            //     gsap.to(icebergModel.scale, 1, { x: 0.02, y: 0.02, z: 0.02, ease: Expo.easeInOut })
            //     gsap.to(icebergModel.position, 1, { x: 0, ease: Expo.easeInOut })
            // }
        })

        // icebergModel.on('mousedown', () => {
        //     if (icebergModel.scale.x == 0.28) {
        //         onMouseDown = true
        //         mouseOnModel = true
        //         gsap.to(icebergModel.scale, 1, { x: .28 + .1, y: .28 + .1, z: .28 + .1, ease: Power4.easeOut })
        //     }
        // })
        
        // icebergModel.on('mouseup', () => {
        //     if (mouseOnModel) {
        //         if (mouseOnModel) {
        //             test()
        //         }
        //         mouseOnModel = false
        //     }
        // })
        
        // icebergModel.on('mouseout', () => {
        //     if (mouseOnModel) {
        //         test()
        //     }
        //     mouseOnModel = false
        // })
    }
)

function test() {
    gsap.to(icebergModel.scale, 1, { x: .28, y: .28, z: .28, ease: Power4.easeOut})
    setTimeout(() => {
        onMouseDown = false
    }, 1000);
}

// Cursor
// document.addEventListener('mousemove', e => {
//     cursor.style.top = e.pageY + "px"
//     cursor.style.left = e.pageX + "px"
// })

// window.addEventListener('mousedown', () => {
//     // gsap.to(cursor, 1, { padding: 50, ease: Power4.easeOut })
//     cursor.classList.add('onMouseDown')
// })

// window.addEventListener('mouseup', () => {
//     // gsap.to(cursor, 1, { padding: 0, ease: Power4.easeOut })
//     cursor.classList.remove('onMouseDown')
// })

// Init HTML - top nav
let text = "Alex Gattefossé"
let chars = text.split('')

chars.forEach(letter => {
    let char = document.createElement('span')
    char.innerHTML = letter
    nameSpanContainer.append(char)
})

text = "Dakumisu"
chars = text.split('')

chars.forEach(letter => {
    let char = document.createElement('span')
    char.innerHTML = letter
    pseudoSpanContainer.append(char)
})

let navNameSpan = document.querySelectorAll('.spanName--container span')
let navPseudoSpan = document.querySelectorAll('.spanPseudo--container span')

// Home Page
navName.addEventListener('mouseenter', () => {
    TweenMax.to(navNameSpan, durationVelocity, { y: -20, rotationZ: -15, stagger: { each: staggerVelocity, from: 'start'}, ease: easeDefault, delay: .1 })
    TweenMax.to(navPseudoSpan, durationVelocity, { y: -30, rotationZ: 0, stagger: { each: staggerVelocity, from: 'start'}, ease: easeDefault, delay: .1 })
})
navName.addEventListener('mouseleave', () => {
    TweenMax.to(navNameSpan, durationVelocity, { y: 0, rotationZ: 0, stagger: { each: staggerVelocity, from: 'start'}, ease: easeDefault, delay: .1 })
    TweenMax.to(navPseudoSpan, durationVelocity, { y: -10, rotationZ: -15, stagger: { each: staggerVelocity, from: 'start'}, ease: easeDefault, delay: .1 })
})

//Mouse move interaction
window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    if (icebergModel && !onMouseDown) {
        // gsap.to(icebergModel.rotation, .3, { x: mouse.x / 50, ease: Power1.easeOut })
        gsap.to(icebergModel.rotation, 1, { z: mouse.y / 40 })
        if (isIcebergOnTheLeft) {
            gsap.to(icebergModel.rotation, 1, { y: rotationYOnTheLeft + mouse.x / 20 })
        } else {
            gsap.to(icebergModel.rotation, 1, { y: rotationYDefault + mouse.x / 20 })
        }
        // if (mouse.x > 0) {
        //     gsap.to(icebergModel.rotation, .5, { x: mouse.x })
        // } else {
        //     gsap.to(icebergModel.rotation, .5, { x: mouse.x })
        // }
    }
    gsap.to(hudContainerTop, .3, { x: mouse.x * -5 })
    gsap.to(hudContainerTop, .3, { y: mouse.y * 5 })
    gsap.to(hudContainerBottom, .3, { x: mouse.x * -5 })
    gsap.to(hudContainerBottom, .3, { y: mouse.y * 5 })
})

// Cursor Custom
let clientX = -100
let clientY = -100
const innerCursor = document.querySelector(".cursor--small")


document.addEventListener("mousemove", e => {
    clientX = e.clientX
    clientY = e.clientY
})

let lastX = 0
let lastY = 0
let isStuck = false
let showCursor = false
let group, stuckX, stuckY, fillOuterCursor

const cursorCanvas = document.querySelector(".cursor--canvas")
const shapeBounds = {
    width: 75,
    height: 75
}
paper.setup(cursorCanvas)
const strokeColor = darkerBlue
const fillColor = normalBlue
const strokeWidth = .5
const segments = 8
const radius = 15

const noiseScale = 150 // speed
const noiseRange = 4 // range of distortion
let isNoisy = false // state

const polygon = new paper.Path.RegularPolygon(
    new paper.Point(0, 0),
    segments,
    radius
)
polygon.scale(1)
// polygon.fillColor = fillColor
// polygon.fillColor.alpha = 1
polygon.strokeColor = strokeColor
// polygon.strokeColor.alpha = 0
polygon.strokeWidth = strokeWidth
polygon.smooth()
group = new paper.Group([polygon])
group.applyMatrix = false

const noiseObjects = polygon.segments.map(() => new SimplexNoise())
let bigCoordinates = []

const lerp = (a, b, n) => {
    return (1 - n) * a + n * b
}

const map = (value, in_min, in_max, out_min, out_max) => {
    return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    )
}

paper.view.onFrame = event => {
    lastX = lerp(lastX, clientX, 0.9)
    lastY = lerp(lastY, clientY, 0.9)
    group.position = new paper.Point(lastX, lastY)
}

const handleMouseEnter = e => {
    const navItem = e.currentTarget
    const navItemBox = navItem.getBoundingClientRect()
    stuckX = Math.round(navItemBox.left + navItemBox.width / 2)
    stuckY = Math.round(navItemBox.top + navItemBox.height / 2)
    isStuck = true
    // gsap.to(polygon.strokeColor, .5, { alpha: 1 })
    // gsap.to(polygon.fillColor, .5, { alpha: 0 })
}

const handleMouseLeave = () => {
    isStuck = false
    // gsap.to(polygon.strokeColor, .5, { alpha: 0 })
    // gsap.to(polygon.fillColor, .5, { alpha: 1 })
}
const linkItems = document.querySelectorAll(".link")
linkItems.forEach(item => {
    item.addEventListener("mouseenter", handleMouseEnter)
    item.addEventListener("mouseleave", handleMouseLeave)
})

paper.view.onFrame = event => {
    if (!isStuck) {
        lastX = lerp(lastX, clientX, 0.2)
        lastY = lerp(lastY, clientY, 0.2)
        group.position = new paper.Point(lastX, lastY)
        polygon.scale(1)
    } else if (isStuck) {
        lastX = lerp(lastX, stuckX, 0.15)
        lastY = lerp(lastY, stuckY, 0.15)
        group.position = new paper.Point(lastX, lastY)
        polygon.scale(1)
    }

    if (isStuck && polygon.bounds.width < shapeBounds.width) {
        polygon.scale(1.1)
    } 
    else if (!isStuck && polygon.bounds.width > 30) {
        if (isNoisy) {
            polygon.segments.forEach((segment, i) => {
                segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1])
            })
            isNoisy = false
            bigCoordinates = []
        }
        const scaleDown = .93
        polygon.scale(scaleDown)
    }

    if (isStuck && polygon.bounds.width >= shapeBounds.width) {
        isNoisy = true
        // first get coordinates of large circle
        if (bigCoordinates.length === 0) {
            polygon.segments.forEach((segment, i) => {
                bigCoordinates[i] = [segment.point.x, segment.point.y]
            })
        }

        // loop over all points of the polygon
        polygon.segments.forEach((segment, i) => {
            const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0)
            const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1)

            const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange)
            const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange)

            const newX = bigCoordinates[i][0] + distortionX
            const newY = bigCoordinates[i][1] + distortionY

            segment.point.set(newX, newY)
        })
    } 
    polygon.smooth()
}


// Scroll Smooth
const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    getDirection: true,
    smoothMobile: true,
    scrollFromAnywhere: true,
    multiplier: 0.5,
    lerp: 0.08,
    // reloadOnContextChange: true,
    // draggingClass: true
})

/* ADD LOCOSCROLL */
locoScroll.on("scroll", ScrollTrigger.update)

ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y
    },
    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        }
    },
    pinType: scrollContainer.style.transform ? "transform" : "fixed"
})

ScrollTrigger.create({
    trigger: aboutContainer,
    scroller: scrollContainer,
    start: "30% bottom", 
    end: "=+99999%",
    scrub: true,
    // onUpdate: self => {
    //     // console.log("progress:", self.progress.toFixed(3))
    //     icebergModel.position.x = 4 + self.progress * -4
    // },
    onToggle: toggleOnAbout => {
        console.log("toggled, isActive:", toggleOnAbout.isActive)
        if (toggleOnAbout.isActive) {
            isIcebergOnTheLeft = toggleOnAbout.isActive
            gsap.to(icebergModel.position, 3.5, { x: 0, ease: Elastic.easeOut })
            gsap.to(icebergModel.rotation, 1.5, { y: rotationYOnTheLeft , ease: Elastic.easeOut })
            // gsap.to(icebergModel.scale, 1, { x: 0.22, y: 0.22, z: 0.22, ease: Elastic.easeOut })
        } else {
            isIcebergOnTheLeft = toggleOnAbout.isActive
            gsap.to(icebergModel.position, 3.5, { x: 4, ease: Elastic.easeOut })
            gsap.to(icebergModel.rotation, 1.5, { y: rotationYDefault , ease: Elastic.easeOut })
            // gsap.to(icebergModel.scale, 1, { x: 0.28, y: 0.28, z: 0.28, ease: Elastic.easeOut })
        }
    },
})

ScrollTrigger.create({
    trigger: projectsContainer,
    scroller: scrollContainer,
    start: "30% bottom", 
    scrub: true,
    onToggle: toggleOnProjects => {
        if (toggleOnProjects.isActive) {
            gsap.to(hemisphereLightUp, .5, { intensity: 0 })
            gsap.to(hemisphereLightDown, .5, { intensity: .9 })
            TweenMax.to('body', .5, { backgroundColor: darkerBlue })
            TweenMax.to(projectsContainer, .5, { color: lightBlue })
            TweenMax.to(document.querySelectorAll('.project--container h4'), .5, { color: normalBlue })
            TweenMax.to(polygon, .5, { strokeColor: lightBlue })
            hudContainerTop.style.color = lightBlue
        } else {
            gsap.to(hemisphereLightUp, .5, { intensity: 1.3 })
            gsap.to(hemisphereLightDown, .5, { intensity: 0 })
            TweenMax.to('body', .5, { backgroundColor: lightBlue })
            TweenMax.to(projectsContainer, .5, { color: darkerBlue })
            TweenMax.to(document.querySelectorAll('.project--container h4'), .5, { color: darkerBlue })
            TweenMax.to(polygon, .5, { strokeColor: darkerBlue })
            hudContainerTop.style.color = darkerBlue
        }
    },
})

/* ADD SKEW SECTION */
let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(".skewElem", "skewY", "deg"),
    clamp = gsap.utils.clamp(-10, 10)

ScrollTrigger.create({
    scroller: scrollContainer,
    trigger: scrollContainer,
    onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -500)
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew
            gsap.to(proxy, {
                skew: 0,
                duration: 0.4,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
            })
        }
    }
})

const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // if (icebergModel) {
    //     icebergModel.rotation.y = elapsedTime * Math.PI * -0.01
    // }

    // // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    TweenMax.set(innerCursor, {
        x: clientX,
        y: clientY
      })

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

ScrollTrigger.addEventListener("refresh", () => locoScroll.update())
ScrollTrigger.refresh()