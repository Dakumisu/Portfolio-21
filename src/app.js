import './style.css'
import './locomotiveBase.css'
// import '../static/js/audio.js'
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

const lerp = (a, b, n) => {
    return (1 - n) * a + n * b
}

const map = (value, in_min, in_max, out_min, out_max) => {
    return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    )
}

const backgroundContainer = document.querySelector('.background--container')
const hudContainer = document.querySelector('.hud--container')
const hudContainerTop = document.querySelector('.hud--container .hud--nav__top')
const hudContainerBottom = document.querySelector('.hud--container .hud--nav__bottom')
const scrollContainer = document.querySelector('[data-scroll-container]')
const aboutContainer = document.querySelector('.about--container')
const projectsContainer = document.querySelector('.projects--container')
const contactContainer = document.querySelector('.contact--container')
const canvasContainer = document.querySelector('.canvas--container')

const navNameSpan = document.querySelectorAll('.spanName--container span')
const navPseudoSpan = document.querySelectorAll('.spanPseudo--container span')

const titleCat = document.querySelectorAll('.title--cat')
const outerLinkItems = document.querySelectorAll(".outer--link")
const innerLinkItems = document.querySelectorAll(".inner--link")
const buttonContact = document.querySelector(".btn--contact")
const crossClose = document.querySelector(".close")

const cursor = document.querySelector('.cursor')
const innerCursor = document.querySelector(".cursor--small")
const mouse = new THREE.Vector2()

let navName = document.querySelector('.nav--name')
let nameSpanContainer = document.querySelector('.spanName--container')
let pseudoSpanContainer = document.querySelector('.spanPseudo--container')

let THREElightBlue = new THREE.Color("#E9EFEF")
let THREEnormalBlue = new THREE.Color("#48717F")
let THREEdarkBlue = new THREE.Color("#29363C")
let THREEdarkerBlue = new THREE.Color("#171f22")

const lightBlue = "#E9EFEF"
const normalBlue = "#48717F"
const darkBlue = "#29363C"
const darkerBlue = "#171f22"

let onMouseDown = false
let icebergPosition = 'default'
let isIcebergRotating = false
let isContactActive = false

let mouseX = 0
let mouseY = 0
let posX = 0
let posY = 0
let posXNormalize = 0
let posYNormalize = 0

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
const mainCanvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: mainCanvas,
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

// ------------------------------------------------------------------------------- Init Iceberg -------------------------------------------------------------------------------
const gltfLoader = new GLTFLoader()
let icebergModel

let rotationValue
let rotationYDefault = Math.PI * 1.7
let rotationYOnTheCenter = Math.PI * .9
let rotationYOnTheLeft = Math.PI * .3

gltfLoader.load('/3D/iceberg_2.0.gltf', (addIcebergModel) => {
        icebergModel = addIcebergModel.scene
        icebergModel.traverse((e) => {
            if (e.isMesh) e.material = toonMaterial
        })
        icebergModel.scale.set(.28, .28, .28)
        icebergModel.rotation.y = rotationYDefault
        icebergModel.position.set(4, 1, 0)
        // gsap.to(icebergModel.scale, 1, { x: 0.28, y: 0.28, z: 0.28, ease: Elastic.easeOut })
        // gsap.to(icebergModel.position, 1, { x: 4, ease: Elastic.easeOut })
        scene.add(icebergModel)

        // icebergModel.on('click', () => {
        //     canvasContainer.style.zIndex = -1
        //     if (icebergModel.scale.x == 0.02) {
                // gsap.to(icebergModel.scale, 1, { x: 0.28, y: 0.28, z: 0.28, ease: Elastic.easeOut })
                // gsap.to(icebergModel.position, 1, { x: 4, ease: Elastic.easeOut })
        //         // gsap.to(icebergModel.rotation, .5, { y: icebergModel.rotation.y += Math.PI * .25, ease: Power4.easeInOut })
        //     } 
        //     // else if (icebergModel.scale.x == 0.28) {
        //     //     gsap.to(icebergModel.scale, 1, { x: 0.02, y: 0.02, z: 0.02, ease: Expo.easeInOut })
        //     //     gsap.to(icebergModel.position, 1, { x: 0, ease: Expo.easeInOut })
        //     // }
        // })

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


// ------------------------------------------------------------------------------- Home Page -------------------------------------------------------------------------------
navName.addEventListener('mouseenter', () => {
    TweenMax.to(navNameSpan, .4, { y: -20, rotationZ: -15, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
    TweenMax.to(navPseudoSpan, .4, { y: -30, rotationZ: 0, opacity: 1, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
})
navName.addEventListener('mouseleave', () => {
    TweenMax.to(navNameSpan, .4, { y: 0, rotationZ: 0, opacity: 1, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
    TweenMax.to(navPseudoSpan, .4, { y: -10, rotationZ: -15, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
})

let icebergRotY = 0
let icebergPosX = 0
// ------------------------------------------------------------------------------- Contact -------------------------------------------------------------------------------
buttonContact.addEventListener('click', () => {
    icebergRotY = icebergModel.rotation.y
    icebergPosX = icebergModel.position.x
    gsap.to(icebergModel.scale, .75, { x: 0, y: 0, z: 0, ease: Back.easeIn })
    gsap.to(icebergModel.rotation, .75, { y: rotationValue - Math.PI * .75,  ease: Power2.easeIn })
    
    TweenMax.to(contactContainer, .75, { opacity: 1, pointerEvents: 'all', ease: Power4.easeInOut, delay: .75 })
    
    gsap.to(icebergModel.position, 1, { x: 13, ease: Back.easeOut, delay: 1.25 })

    isIcebergRotating = true
    setTimeout(() => {
        icebergModel.scale.set(.30, .35, .30)
        icebergModel.position.x = 25
        isContactActive = true
        canvasContainer.style.zIndex = 7
    }, 1000);
})

crossClose.addEventListener('click', () => {
    gsap.to(icebergModel.position, .75, { x: 25, ease: Back.easeIn })
    TweenMax.to(contactContainer, .75, { opacity: 0, pointerEvents: 'none', ease: Power4.easeInOut, delay: .5 })
    gsap.to(icebergModel.rotation, 1.25, { y: icebergRotY,  ease: Power2.easeOut, delay: 1.1 })
    gsap.to(icebergModel.scale, 1.5, { x: .28, y: .28, z: .28, ease: Elastic.easeOut, delay: 1.1 })
    
    setTimeout(() => {
        icebergModel.scale.set(0.00001, 0.00001, 0.00001)
        icebergModel.position.x = icebergPosX
        isContactActive = false
        canvasContainer.style.zIndex = -1
        setTimeout(() => {
            icebergModel.rotation.y = icebergRotY - Math.PI * .75
        }, 100);
        setTimeout(() => {
            isIcebergRotating = false
        }, 1500);
    }, 1000);
})


crossClose.addEventListener('mouseenter', () => {
    TweenMax.to('.line-1', 1.75, { rotateZ: -45, ease: Elastic.easeOut })
    TweenMax.to('.line-2', 1.75, { rotateZ: 45, ease: Elastic.easeOut })
})
crossClose.addEventListener('mouseleave', () => {
    TweenMax.to('.line-1', 1.75, { rotateZ: 45, ease: Elastic.easeOut })
    TweenMax.to('.line-2', 1.75, { rotateZ: -45, ease: Elastic.easeOut })
})


// ------------------------------------------------------------------------------- Mouse move interaction -------------------------------------------------------------------------------
// Cursor Custom
TweenMax.to({}, 0.01, {
    repeat: -1,
    onRepeat: function () {
        posX += (mouseX - posX) / 4;
        posY += (mouseY - posY) / 4;

        TweenMax.set(innerCursor, {
            x: posX,
            y: posY
        })

        if (icebergModel && !isIcebergRotating && !isContactActive) {
            rotationValue = icebergModel.rotation.y
            gsap.to(icebergModel.rotation, 1, { z: posYNormalize / 30 })
            if (icebergPosition == 'default') {
                gsap.to(icebergModel.rotation, { y: rotationYDefault + posXNormalize / 10 })
            } else if (icebergPosition == 'center') {
                gsap.to(icebergModel.rotation, { y: rotationYOnTheCenter + posXNormalize / 10 })
            } else if (icebergPosition == 'left') {
                gsap.to(icebergModel.rotation, { y: rotationYOnTheLeft + posXNormalize / 10 })
            }
        }
        TweenMax.set(hudContainerTop, { x: posXNormalize * -5 })
        TweenMax.set(hudContainerTop, { y: posYNormalize * 5 })
        TweenMax.set(hudContainerBottom, { x: posXNormalize * -5 })
        TweenMax.set(hudContainerBottom, { y: posYNormalize * 5 })
    }
})

document.addEventListener("mousemove", e => {
    mouseX = e.clientX
    mouseY = e.clientY

    posXNormalize = (posX / window.innerWidth) * 2 - 1
    posYNormalize = - (posY / window.innerWidth) * 2 + 1
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
const strokeColor = lightBlue
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

paper.view.onFrame = event => {
    lastX = lerp(lastX, mouseX, 0.7)
    lastY = lerp(lastY, mouseY, 0.7)
    group.position = new paper.Point(lastX, lastY)
}

outerLinkItems.forEach(item => {
    item.addEventListener("mouseenter", outerHandleMouseEnter)
    item.addEventListener("mouseleave", outerHandleMouseLeave)
})

innerLinkItems.forEach(item => {
    item.addEventListener("mouseenter", innerHandleMouseEnter)
    item.addEventListener("mouseleave", innerHandleMouseLeave)
})

function innerHandleMouseEnter() {
    TweenMax.to(innerCursor, .75, { padding: 25, backgroundColor: lightBlue, ease: Expo.easeOut })
    gsap.to(polygon.strokeColor, .75, { alpha: 0, ease: Expo.easeOut })
}

function innerHandleMouseLeave() {
    TweenMax.to(innerCursor, .75, { padding: 5, backgroundColor: 'transparent', ease: Expo.easeOut })
    gsap.to(polygon.strokeColor, .75, { alpha: 1, ease: Expo.easeOut })
}

function outerHandleMouseEnter(e) {
    const navItem = e.currentTarget
    const navItemBox = navItem.getBoundingClientRect()
    stuckX = Math.round(navItemBox.left + navItemBox.width / 2)
    stuckY = Math.round(navItemBox.top + navItemBox.height / 2)
    isStuck = true
    TweenMax.to(innerCursor, .75, { padding: 0, opacity: 0, ease: Expo.easeOut })
    // gsap.to(polygon.strokeColor, .5, { alpha: 1 })
    // gsap.to(polygon.fillColor, .5, { alpha: 0 })
}

function outerHandleMouseLeave() {
    isStuck = false
    TweenMax.to(innerCursor, .75, { padding: 5, opacity: 1, ease: Expo.easeOut })
    // gsap.to(polygon.strokeColor, .5, { alpha: 0 })
    // gsap.to(polygon.fillColor, .5, { alpha: 1 })
}

paper.view.onFrame = event => {
    if (!isStuck) {
        lastX = lerp(lastX, mouseX, 0.2)
        lastY = lerp(lastY, mouseY, 0.2)
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

// ------------------------------------------------------------------------------- Audio -------------------------------------------------------------------------------
const deg = (a) => a * Math.PI / 180 

class AudioSwitcher {
  constructor(opt) {
    Object.assign(this, opt)

    this.active = false
    this.hover = false
    this.volume = 0
    this.settings = {
      width: 60,
      height: 7,
      amplitude: -0.18,
      hoverHeight: 1.5,
      hoverAmplitude: -0.1,
      speed: 3.5
    }

    this.init()
  }

  init() {
    this.button.addEventListener('click', () => {
      this.active = !this.active
      this.button.classList.toggle('active')
      const toggle = this.active ? 'play' : 'pause'
      this.audio[toggle]()
      this.hover = false
    })

    this.button.addEventListener('mouseenter', () => {
      this.hover = true
    })
    this.button.addEventListener('mouseleave', () => {
      this.hover = false
    })

    window.addEventListener('blur', () => {
      this.audio.muted = true
    })
    window.addEventListener('focus', () => {
      this.audio.muted = false
    })

    this.ctx = this.soundCanvas.getContext('2d')
    this.width = this.soundCanvas.clientWidth
    this.height = this.soundCanvas.clientHeight
    this.amp = 0
    this.h = 0
    this.devicePixelRatio = window.devicePixelRatio || 1
    this.soundCanvas.width = this.width * this.devicePixelRatio
    this.soundCanvas.height = this.height * this.devicePixelRatio
    this.soundCanvas.style.width = `${this.width}px`
    this.soundCanvas.style.height = `${this.height}px`
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.soundCanvas.width, this.soundCanvas.height)
  }

  draw(time) {
    this.ctx.fillStyle = this.color

    for (let i = 0; i < this.settings.width; i++) {
      this.ctx.beginPath()
      const x = (this.width / 2) - (this.settings.width / 2 * 0.5) + i * .6
      const t = (time * this.settings.speed) + (i * this.amp)
      const y = (this.height / 2) + (-Math.cos(t) * this.h)
      this.ctx.ellipse(x, y, .5, .5, deg(360), 0, deg(360))
      this.ctx.closePath()
      this.ctx.fill()
    }
  }

  animate(time) {
    let height = this.hover ? this.settings.hoverHeight : 0
    height = this.active ? this.settings.height : height
    this.h = lerp(this.h, height, 0.04)

    let amplitude = this.hover ? this.settings.hoverAmplitude : 0
    amplitude = this.active ? this.settings.amplitude : amplitude
    this.amp = lerp(this.amp, amplitude, 0.04)

    const volume = this.active ? 1 : 0
    this.volume = lerp(this.volume, volume, 0.04)
    this.audio.volume = this.volume

    this.clear()
    this.draw(time)
  }
}

const audioSwitcher = new AudioSwitcher({
  button: document.querySelector('.hud--sound--btn'),
  soundCanvas: document.querySelector('#canvas-audio'),
  audio: document.querySelector('#audio'),
  color: lightBlue,
})


// ------------------------------------------------------------------------------- Scroll Smooth -------------------------------------------------------------------------------
const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    direction: 'vertical',
    smooth: true,
    getDirection: true,
    smoothMobile: true,
    scrollFromAnywhere: true,
    multiplier: 0.5,
    lerp: 0.08,
    // reloadOnContextChange: true,
    draggingClass: true
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
    start: "50% bottom", 
    endTrigger: "html",
    // end:"bottom top",
    // end: "=+100%",
    scrub: true,
    // onUpdate: self => {
    //     // console.log("progress:", self.progress.toFixed(3))
    //     icebergModel.position.x = 4 + self.progress * -4
    // },
    onToggle: toggleOnAbout => {
        // console.log("toggled, isActive:", toggleOnAbout.isActive)
        if (toggleOnAbout.isActive) {
            icebergPosition = 'center'
            isIcebergRotating = true
            setTimeout(() => {
                isIcebergRotating = false
            }, 1700)
            gsap.to(icebergModel.position, 3.5, { x: 0, ease: Elastic.easeOut })
            gsap.to(icebergModel.rotation, 1.5, { y: rotationYOnTheCenter , ease: Power2.easeOut })
            // gsap.to(icebergModel.scale, 1, { x: 0.22, y: 0.22, z: 0.22, ease: Elastic.easeOut })
        } else {
            icebergPosition = 'default'
            isIcebergRotating = true
            setTimeout(() => {
                isIcebergRotating = false
            }, 1700)
            gsap.to(icebergModel.position, 3.5, { x: 4, ease: Elastic.easeOut })
            gsap.to(icebergModel.rotation, 1.5, { y: rotationYDefault , ease: Power2.easeOut })
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
            icebergPosition = 'left'
            isIcebergRotating = true
            setTimeout(() => {
                isIcebergRotating = false
            }, 1700)
            gsap.to(hemisphereLightUp, .5, { intensity: 0 })
            gsap.to(hemisphereLightDown, .5, { intensity: .9 })
            gsap.to(icebergModel.position, 3.5, { x: -6, ease: Elastic.easeOut })
            gsap.to(icebergModel.rotation, 1.5, { y: rotationYOnTheLeft, ease: Power2.easeOut })
            // gsap.to(audioSwitcher, .5, { color: lightBlue })
            // gsap.to(polygon, .5, { strokeColor: lightBlue })
            // TweenMax.to(innerCursor, .5, { borderColor: lightBlue })
            TweenMax.to(backgroundContainer, .5, { backgroundColor: darkerBlue })
            TweenMax.to(aboutContainer, .5, { color: lightBlue })
            TweenMax.to(projectsContainer, .5, { color: lightBlue })
            TweenMax.to(contactContainer, .5, { color: lightBlue, backgroundColor: darkerBlue })
            TweenMax.to('.line-1', .5, { backgroundColor: lightBlue })
            TweenMax.to('.line-2', .5, { backgroundColor: lightBlue })
            TweenMax.to(titleCat, .5, { webkitTextStrokeColor: lightBlue })
            // hudContainerTop.style.color = lightBlue
            // hudContainerBottom.style.color = lightBlue
            titleCat.forEach(e => {
                e.style.webkitTextStrokeWidth = ".06vw "
            })
        } else {
            icebergPosition = 'center'
            isIcebergRotating = true
            setTimeout(() => {
                isIcebergRotating = false
            }, 1700)
            gsap.to(hemisphereLightUp, .5, { intensity: 1.3 })
            gsap.to(hemisphereLightDown, .5, { intensity: 0 })
            gsap.to(icebergModel.position, 3.5, { x: 0, ease: Elastic.easeOut })
            gsap.to(icebergModel.rotation, 1.5, { y: rotationYOnTheCenter, ease: Power2.easeOut })
            // gsap.to(audioSwitcher, .5, { color: darkerBlue })
            // gsap.to(polygon, .5, { strokeColor: darkerBlue })
            // TweenMax.to(innerCursor, .5, { borderColor: darkerBlue })
            TweenMax.to(backgroundContainer, .5, { backgroundColor: lightBlue })
            TweenMax.to(aboutContainer, .5, { color: darkerBlue })
            TweenMax.to(projectsContainer, .5, { color: darkerBlue })
            TweenMax.to(contactContainer, .5, { color: darkerBlue, backgroundColor: lightBlue })
            TweenMax.to('.line-1', .5, { backgroundColor: darkerBlue })
            TweenMax.to('.line-2', .5, { backgroundColor: darkerBlue })
            TweenMax.to(titleCat, .5, { webkitTextStrokeColor: darkerBlue })
            // hudContainerTop.style.color = darkerBlue
            // hudContainerBottom.style.color = darkerBlue
            titleCat.forEach(e => {
                e.style.webkitTextStrokeWidth = ".08vw "
            })
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
                ease: Power4,
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
            })
        }
    }
})

const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    if (icebergModel && isContactActive) {
        icebergModel.rotation.y = elapsedTime * Math.PI * -0.03
    }

    // // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    const time = performance.now() / 1000
    if (audioSwitcher) {
        audioSwitcher.animate(time)
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

ScrollTrigger.addEventListener("refresh", () => locoScroll.update())
ScrollTrigger.refresh()