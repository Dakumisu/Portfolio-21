import './style.css'
import './locomotiveBase.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Interaction } from 'three.interaction'
import { BloomEffect, EffectComposer, ShaderPass, EffectPass, RenderPass } from "postprocessing"
import { TweenLite } from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
import LocomotiveScroll from 'locomotive-scroll'
import howlerjs from 'howler'

import vertexShader from '../static/glsl/vertexShader.glsl'
import fragmentShader from '../static/glsl/fragmentShader.glsl'

const backgroundContainer = document.querySelector('.background--container')
const hudContainer = document.querySelector('.hud--container')
const hudContainerTop = document.querySelector('.hud--container .hud--nav__top')
const hudContainerBottom = document.querySelector('.hud--container .hud--nav__bottom')
const contactContainer = document.querySelector('.contact--container')
const projectCanvasContainer = document.querySelector('.projectCanvas--container')
const projectCanvasContentContainer = document.querySelector('.projectCanvas--container .content--container')
const scrollContainer = document.querySelector('.scroll--container')
const heroContainer = document.querySelector('.hero--container')
const aboutContainer = document.querySelector('.about--container')
const projectsContainer = document.querySelector('.projects--container')
const endContainer = document.querySelector('.end--container')

const canvasContainer = document.querySelector('.canvas--container')
const mainCanvas = document.querySelector('.webgl')
const projectCanvas = document.querySelector('.canvasProject')

const navAbout = document.querySelector('.about')
const navProjects = document.querySelector('.projects')
const navNameSpan = document.querySelectorAll('.spanName--container span')
const navPseudoSpan = document.querySelectorAll('.spanPseudo--container span')
const soundButton = document.querySelector('.hud--sound--btn')

const titleCat = document.querySelectorAll('.title--cat')
const outerLinkItems = document.querySelectorAll(".outer--link")
const innerLinkItems = document.querySelectorAll(".inner--link")
const noLinkItems = document.querySelectorAll(".no--link")
const buttonContact = document.querySelector(".btn--contact")
const crossCloseContact = document.querySelector(".close__contact")
const crossCloseProject = document.querySelector(".close__project")
const crossClose = document.querySelectorAll(".close")
const transitionContainerProject = document.querySelector(".projectCanvas--container .transition--container")
const transitionContainerContact = document.querySelector(".contact--container .transition--container")
const contentContactContainer = document.querySelector('.contact--container .content--container')

const projectTitle = document.querySelector(".projectCanvas--container .title--container h3")
const projectText = document.querySelector(".projectCanvas--container .text--container p")
const projectIndicatorContainer = document.querySelector(".project__indicator--container")
const btnViewProject = document.querySelector(".project__view")
const btnVisitProject = document.querySelector(".project__visit")
const projectIndicator = document.querySelectorAll(".project__indicator")

const icon = {
    html: document.querySelector("#icon__html"),
    sass: document.querySelector("#icon__sass"),
    js: document.querySelector("#icon__js"),
    gsap: document.querySelector("#icon__gsap"),
    threejs: document.querySelector("#icon__threejs"),
    php: document.querySelector("#icon__php"),
    sql: document.querySelector("#icon__sql"),
    ae: document.querySelector("#icon__ae"),
    ai: document.querySelector("#icon__ai"),
    lr: document.querySelector("#icon__lr"),
    pp: document.querySelector("#icon__pp"),
    xd: document.querySelector("#icon__xd")
}

const cursor = document.querySelectorAll('.cursor')
const cursorCanvas = document.querySelector(".cursor--canvas")
const innerCursor = document.querySelector(".cursor--small")
const mouse = new THREE.Vector2()
const mousePosition = new THREE.Vector3()

const navName = document.querySelector('.nav--name')

const music = new Howl({
    src: ['/sound/music.mp3'],
    autoplay: false,
    loop: true, 
    stereo: 0,
    volume: .7,
})

const lightBlue = "#E9EFEF"
const normalBlue = "#48717F"
const darkBlue = "#29363C"
const darkerBlue = "#171f22"

const THREElightBlue = new THREE.Color("#E9EFEF")
const THREEnormalBlue = new THREE.Color("#48717F")
const THREEdarkBlue = new THREE.Color("#29363C")
const THREEdarkerBlue = new THREE.Color("#171f22")

let onMouseDown = false
let isIcebergRotating = false
let isContactActive = false
let enterProject = false
let currentProject
let musicPlayed = false
let musicMuted = true
let navScrollActive = false
let isOnMobile = false

let mouseX = 0
let mouseY = 0
let posX = 0
let posY = 0
let posXNormalize = 0
let posYNormalize = 0
let planeX = 0
let planeY = 0

let icebergRotY = 0
let icebergPosX = 0
let currentRotate = 0


const lerp = (a, b, n) => {
    return (1 - n) * a + n * b
}
const map = (value, in_min, in_max, out_min, out_max) => {
    return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    )
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log("mobile device")
    isOnMobile = true
    cursor.forEach(e => {
        e.style.display = 'none'
    })
    projectIndicatorContainer.style.display = 'none'
    document.querySelector('.mobileNotAvailable').style.display = "flex"
} else {
    console.log("not mobile device")
}

console.log(window.navigator.userAgent)

// --------------------------------------- Init THREE.js features ---------------------------------------
// Scene
const mainScene = new THREE.Scene()
const projectScene = new THREE.Scene()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 10
mainScene.add(camera)
projectScene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: mainCanvas,
    antialias: true,
    alpha: true
})
const rendererProject = new THREE.WebGLRenderer({
    canvas: projectCanvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
rendererProject.setSize(sizes.width, sizes.height)

// Post Processing
const composer = new EffectComposer(rendererProject)
const renderPass = new RenderPass(projectScene, camera)
composer.addPass(renderPass)

const customPass = new ShaderPass({ vertexShader, fragmentShader })
customPass.renderToScreen = true
composer.addPass(customPass)

// Interaction
const mainInteraction = new Interaction(renderer, mainScene, camera)
const projectInteraction = new Interaction(rendererProject, projectScene, camera)

// Lights
// const light = new THREE.AmbientLight('#ffff00', 0.5)
const pointLight = new THREE.PointLight(THREEdarkerBlue, .3)
pointLight.position.set(0, 0, 5)
mainScene.add(pointLight)
const hemisphereLightUp = new THREE.HemisphereLight( THREElightBlue, THREEdarkBlue, 1.3)
mainScene.add(hemisphereLightUp)
const hemisphereLightDown = new THREE.HemisphereLight( THREEdarkBlue, THREEnormalBlue, 0)
mainScene.add(hemisphereLightDown)

// Texture Loader
const textureLoader = new THREE.TextureLoader()

// Materials
const toonMaterial = new THREE.MeshToonMaterial()
toonMaterial.color = THREElightBlue
toonMaterial.aoMapIntensity = 1

// --------------------------------------- Init Iceberg ---------------------------------------
const gltfLoader = new GLTFLoader()
let icebergModel

let rotationYHome = Math.PI * 1.7
let rotationValue = 0
let rotationOnMouseValue = 0
let rotationOnScrollValue = rotationYHome

gltfLoader.load('/3D/iceberg_2.0.gltf', (addIcebergModel) => {
        icebergModel = addIcebergModel.scene
        icebergModel.traverse((e) => {
            if (e.isMesh) e.material = toonMaterial
        })
        icebergModel.scale.set(.28, .28, .28)
        icebergModel.rotation.y = rotationYHome
        icebergModel.position.set(4, 1, 0)
        // gsap.to(icebergModel.scale, 1, { x: 0.28, y: 0.28, z: 0.28, ease: Elastic.easeOut })
        // gsap.to(icebergModel.position, 1, { x: 4, ease: Elastic.easeOut })
        mainScene.add(icebergModel)
        
        // timelineIcebergPosHome
        //     .to(icebergModel.position, 3.5, { x: 4, ease: Elastic.easeOut })
        //     .to(icebergModel.rotation, 3.5, { y: rotationYHome, ease: Power2.easeOut }, 0)
        //     .progress(1)
            
        // timelineIcebergPosAbout
        //     .to(icebergModel.position, 3.5, { x: 0, ease: Elastic.easeOut })
        //     .to(icebergModel.rotation, 3.5, { y: rotationYAbout, ease: Power2.easeOut }, 0)
        //     .progress(1)
            
        // timelineIcebergPosProjects
        //     .to(icebergModel.position, 3.5, { x: -8, ease: Elastic.easeOut })
        //     .to(icebergModel.rotation, 3.5, { y: rotationYProjects, ease: Power2.easeOut }, 0)
        //     .progress(1)
        


        // icebergModel.on('click', () => {
        //canvasContainer.style.zIndex = -1
        //if (icebergModel.scale.x == 0.02) {
            // gsap.to(icebergModel.scale, 1, { x: 0.28, y: 0.28, z: 0.28, ease: Elastic.easeOut })
            // gsap.to(icebergModel.position, 1, { x: 4, ease: Elastic.easeOut })
            // gsap.to(icebergModel.rotation, .5, { y: icebergModel.rotation.y += Math.PI * .25, ease: Power4.easeInOut })
        //} 
        // else if (icebergModel.scale.x == 0.28) {
        //     gsap.to(icebergModel.scale, 1, { x: 0.02, y: 0.02, z: 0.02, ease: Expo.easeInOut })
        //     gsap.to(icebergModel.position, 1, { x: 0, ease: Expo.easeInOut })
        // }
        // })

        icebergModel.on('click', () => {
            if (!navScrollActive) {
                locoScroll.scrollTo(heroContainer)
                navScrollActive = true
                setTimeout(() => {
                    navScrollActive = false
                }, 1200)
            }
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
    }, 1000)
}


// --------------------------------------- Planes ---------------------------------------
const texture_id2021 = textureLoader.load('/img/projects/id_2021.png')
const texture_folio2020 = textureLoader.load('/img/projects/folio_2020.png')
const texture_foliocms = textureLoader.load('/img/projects/folio_cms.png')
const texture_morpion = textureLoader.load('/img/projects/morpion.png')
const texture_gamovore = textureLoader.load('/img/projects/gamovore.png')
const texture_retrowave = textureLoader.load('/img/projects/retrowave.png')

const texture_jamcloud = textureLoader.load('/img/projects/jam_cloud.png')
const texture_terredebois = textureLoader.load('/img/projects/terre_de_bois.png')
const texture_charamushroom = textureLoader.load('/img/projects/chara_mushroom.png')

const texture_depression = textureLoader.load('/img/projects/depression_achro.png')
const texture_mmitv = textureLoader.load('/img/projects/mmi_tv.png')
const texture_inside = textureLoader.load('/img/projects/inside.png')
const texture_1984analysis = textureLoader.load('/img/projects/1984_analysis.png')

const texture_numeric = textureLoader.load('/img/projects/numeric.png')
const texture_argentic = textureLoader.load('/img/projects/argentic.png')

const planeRectGeometry = new THREE.PlaneGeometry(16*.3, 9*.3, 32, 32)

const planeRectMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTexture1: { value: texture_id2021 },
        uTexture2: { value: texture_id2021 },
        uOffset: { value: new THREE.Vector2(0, 0) },
        uAlpha: { value: 0 },
        uProgress: { value: 0 },
        uFrequency: { value: new THREE.Vector2(0, 0) },
        uDisp: { value: textureLoader.load('/img/displacement/disp.jpg') },
        uDispFactor: { value: 0.0 }
    }, 
    transparent: true, 
    side: THREE.DoubleSide
})

const planeRectMesh = new THREE.Mesh(
    planeRectGeometry,
    planeRectMaterial
)

planeRectMesh.position.z = 4
projectScene.add(planeRectMesh)

document.addEventListener("mousemove", e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1
})

const images = document.querySelectorAll('.hoverPlane')
images.forEach(image => {
    image.addEventListener('mouseenter', (e) => {
        if (!enterProject) {
            TweenLite.to(planeRectMaterial.uniforms.uAlpha, .5, { value: 1, ease: Power2.easeInOut })
            switch (e.target.attributes[1].value) {
                case 'id2021' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_id2021
                        planeRectMaterial.uniforms.uTexture1.value = texture_id2021
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_id2021
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_id2021
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'folio2020' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_folio2020
                        planeRectMaterial.uniforms.uTexture1.value = texture_folio2020
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_folio2020
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_folio2020
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'foliocms' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_foliocms
                        planeRectMaterial.uniforms.uTexture1.value = texture_foliocms
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_foliocms
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_foliocms
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'morpion' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_morpion
                        planeRectMaterial.uniforms.uTexture1.value = texture_morpion
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_morpion
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_morpion
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'gamovore' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_gamovore
                        planeRectMaterial.uniforms.uTexture1.value = texture_gamovore
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_gamovore
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_gamovore
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'retrowave' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_retrowave
                        planeRectMaterial.uniforms.uTexture1.value = texture_retrowave
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_retrowave
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_retrowave
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
    
                case 'jamcloud' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_jamcloud
                        planeRectMaterial.uniforms.uTexture1.value = texture_jamcloud
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_jamcloud
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_jamcloud
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'terredebois' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_terredebois
                        planeRectMaterial.uniforms.uTexture1.value = texture_terredebois
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_terredebois
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_terredebois
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'charamushroom' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_charamushroom
                        planeRectMaterial.uniforms.uTexture1.value = texture_charamushroom
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_charamushroom
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_charamushroom
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
    
                case 'depression_achro' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_depression
                        planeRectMaterial.uniforms.uTexture1.value = texture_depression
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_depression
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_depression
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'mmitv' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_mmitv
                        planeRectMaterial.uniforms.uTexture1.value = texture_mmitv
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_mmitv
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_mmitv
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'inside' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_inside
                        planeRectMaterial.uniforms.uTexture1.value = texture_inside
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_inside
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_inside
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case '1984analysis' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_1984analysis
                        planeRectMaterial.uniforms.uTexture1.value = texture_1984analysis
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_1984analysis
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_1984analysis
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
    
                case 'numeric' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_numeric
                        planeRectMaterial.uniforms.uTexture1.value = texture_numeric
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_numeric
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_numeric
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
                case 'argentic' :
                    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
                        planeRectMaterial.uniforms.uTexture2.value = texture_argentic
                        planeRectMaterial.uniforms.uTexture1.value = texture_argentic
                    } else {
                        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
                            planeRectMaterial.uniforms.uTexture2.value = texture_argentic
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
                        } else {
                            planeRectMaterial.uniforms.uTexture1.value = texture_argentic
                            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
                        }
                    }
                    break
            }
        }
    })

    image.addEventListener('mouseleave', () => {
        if (!enterProject) {
            TweenLite.to(planeRectMaterial.uniforms.uAlpha, .5, { value: 0, ease: Power4.easeOut })
        }
    })

    image.addEventListener('click', (e) => {
        enterProject = true
        currentProject = e.target.attributes[1].value
        locoScroll.stop()

        switch (e.target.attributes[1].value) {
            case 'id2021' :
                projectTitle.innerHTML = projectContent.id2021.title
                projectText.innerHTML = projectContent.id2021.text
                btnVisitProject.style.display = "block"
                icon.html.style.display = "inline-block"
                icon.sass.style.display = "inline-block"
                icon.js.style.display = "inline-block"
                icon.gsap.style.display = "inline-block"
                icon.threejs.style.display = "inline-block"
                document.querySelector('.title--container--content span').style.display = 'block'
                break
            case 'folio2020' :
                projectTitle.innerHTML = projectContent.folio2020.title
                projectText.innerHTML = projectContent.folio2020.text
                btnVisitProject.style.display = "block"
                btnVisitProject.style.display = "block"
                icon.html.style.display = "inline-block"
                icon.sass.style.display = "inline-block"
                icon.js.style.display = "inline-block"
                icon.php.style.display = "inline-block"
                break
            case 'foliocms' :
                projectTitle.innerHTML = projectContent.foliocms.title
                projectText.innerHTML = projectContent.foliocms.text
                btnVisitProject.style.display = "block"
                btnVisitProject.style.display = "block"
                icon.html.style.display = "inline-block"
                icon.sass.style.display = "inline-block"
                icon.php.style.display = "inline-block"
                icon.sql.style.display = "inline-block"
                break
            case 'morpion' :
                projectTitle.innerHTML = projectContent.morpion.title
                projectText.innerHTML = projectContent.morpion.text
                btnVisitProject.style.display = "block"
                icon.html.style.display = "inline-block"
                icon.sass.style.display = "inline-block"
                icon.php.style.display = "inline-block"
                break
            case 'gamovore' :
                projectTitle.innerHTML = projectContent.gamovore.title
                projectText.innerHTML = projectContent.gamovore.text
                btnVisitProject.style.display = "block"
                icon.html.style.display = "inline-block"
                icon.sass.style.display = "inline-block"
                icon.php.style.display = "inline-block"
                break
            case 'retrowave' :
                projectTitle.innerHTML = projectContent.retrowave.title
                projectText.innerHTML = projectContent.retrowave.text
                btnVisitProject.style.display = "block"
                icon.html.style.display = "inline-block"
                icon.sass.style.display = "inline-block"
                icon.js.style.display = "inline-block"
                break

            case 'jamcloud' :
                projectTitle.innerHTML = projectContent.jamcloud.title
                projectText.innerHTML = projectContent.jamcloud.text
                btnViewProject.style.display = "block"
                icon.xd.style.display = "inline-block"
                break
            case 'terredebois' :
                projectTitle.innerHTML = projectContent.terredebois.title
                projectText.innerHTML = projectContent.terredebois.text
                btnViewProject.style.display = "block"
                icon.ai.style.display = "inline-block"
                break
            case 'charamushroom' :
                projectTitle.innerHTML = projectContent.charamushroom.title
                projectText.innerHTML = projectContent.charamushroom.text
                btnViewProject.style.display = "block"
                icon.ai.style.display = "inline-block"
                break

            case 'depression_achro' :
                projectTitle.innerHTML = projectContent.depression_achro.title
                projectText.innerHTML = projectContent.depression_achro.text
                btnViewProject.style.display = "block"
                icon.pp.style.display = "inline-block"
                break
            case 'mmitv' :
                projectTitle.innerHTML = projectContent.mmitv.title
                projectText.innerHTML = projectContent.mmitv.text
                btnViewProject.style.display = "block"
                icon.ae.style.display = "inline-block"
                break
            case 'inside' :
                projectTitle.innerHTML = projectContent.inside.title
                projectText.innerHTML = projectContent.inside.text
                btnViewProject.style.display = "block"
                icon.pp.style.display = "inline-block"
                break
            case '1984analysis' :
                projectTitle.innerHTML = projectContent.analysis1984.title
                projectText.innerHTML = projectContent.analysis1984.text
                btnViewProject.style.display = "block"
                icon.pp.style.display = "inline-block"
                break

            case 'numeric' :
                projectTitle.innerHTML = projectContent.numeric.title
                projectText.innerHTML = projectContent.numeric.text
                btnViewProject.style.display = "block"
                icon.lr.style.display = "inline-block"
                break
            case 'argentic' :
                projectTitle.innerHTML = projectContent.argentic.title
                projectText.innerHTML = projectContent.argentic.text
                btnViewProject.style.display = "block"
                break
        }

        TweenMax.to(projectsContainer, 1, { opacity: 0, pointerEvents: 'none', ease: Power4.easeOut })
        TweenMax.to(transitionContainerProject, 1.5, { yPercent: 100, ease: Expo.easeInOut })

        // TweenMax.to('.projectCanvas--container .container', 1.5, { backgroundColor: 'rgba(72, 113, 127, 1)', ease: Power4.easeInOut })
        // TweenMax.to('.projectCanvas--container .container', 1.5, { yPercent: -100, ease: Expo.easeInOut })
        TweenMax.to('.content--container .title--container', 2.5, { opacity: 1, ease: Power4.easeInOut, delay: .50 })
        TweenMax.to('.content--container .text--container', 2.5, { opacity: 1, ease: Power4.easeInOut, delay: .75 })
        TweenMax.to('.content--container .icon--container', 2.5, { opacity: 1, ease: Power4.easeInOut, delay: 1 })
        TweenMax.to(crossCloseProject, 1.5, { yPercent: 500, ease: Power4.easeInOut, delay: .75 })

        projectCanvasContainer.style.position = 'absolute'
        setTimeout(() => {            
            projectCanvasContainer.style.pointerEvents = 'all'
            projectCanvasContainer.style.zIndex = 5
            cursor.forEach(e => {
                e.style.mixBlendMode = 'hard-light'
            })
            // cursorCanvas.style.mixBlendMode = 'normal'
        }, 500)

        TweenLite.to(planeRectMaterial.uniforms.uAlpha, .5, { value: 1, ease: Power4.easeOut })
        
        TweenLite.to(planeRectMaterial.uniforms.uOffset.value, .5, { x: 0, y: 0, ease: Power4.easeOut })

        TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 4, { x: 5, y: 5, ease: Expo.easeOut })
        TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 3, { x: 1, y: 1, ease: Power4.easeOut, delay: 1 })

        TweenLite.to(planeRectMesh.position, 2, { x: -3, y: 0, z: 6, ease: Expo.easeInOut })
    })
})

crossCloseProject.addEventListener('click', () => {
    outerHandleMouseLeave()
    TweenMax.to(projectsContainer, 0, { opacity: 1 })
    TweenMax.to(projectsContainer, 0, { pointerEvents: 'all', delay: 2 })

    TweenMax.to(transitionContainerProject, 1.25, { yPercent: 200, ease: Expo.easeInOut, delay: .75 })
    TweenMax.to(transitionContainerProject, 0, { yPercent: 0, delay: 2 })

    TweenMax.to('.content--container .title--container', 1.5, { opacity: 0, ease: Power4.easeOut })
    TweenMax.to('.content--container .text--container', 1.5, { opacity: 0, ease: Power4.easeOut, delay: .25 })
    TweenMax.to('.content--container .icon--container', 1.5, { opacity: 0, ease: Power4.easeOut, delay: .5 })
    TweenMax.to(crossCloseProject, 1.5, {yPercent: -500, ease: Power4.easeInOut })

    projectCanvasContainer.style.pointerEvents = 'none'
    setTimeout(() => {
        locoScroll.start()
    }, 1500);
    setTimeout(() => {
        projectCanvasContainer.style.position = 'fixed'
        btnVisitProject.style.display = "none"
        btnViewProject.style.display = "none"
        icon.html.style.display = "none"
        icon.sass.style.display = "none"
        icon.js.style.display = "none"
        icon.gsap.style.display = "none"
        icon.threejs.style.display = "none"
        icon.php.style.display = "none"
        icon.sql.style.display = "none"
        icon.ae.style.display = "none"
        icon.ai.style.display = "none"
        icon.lr.style.display = "none"
        icon.pp.style.display = "none"
        icon.xd.style.display = "none"
        document.querySelector('.title--container--content span').style.display = 'none'
        cursor.forEach(e => {
            e.style.mixBlendMode = 'difference'
        })
    }, 2000)

    TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 3, { x: 5, y: 5, ease: Expo.easeOut })
    TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 2, { x: 0, y: 0, ease: Expo.easeOut, delay: 1 })

    TweenLite.to(planeRectMaterial.uniforms.uAlpha, 1.5, { value: 0, ease: Power4.easeOut })
    
    TweenLite.to(planeRectMesh.position, { z: 4, delay: 1 })

    setTimeout(() => {
        projectCanvasContainer.style.zIndex = -1
        enterProject = false
    }, 1500)
})

planeRectMesh.on('click', () => {
    switch (currentProject) {
        case 'id2021':
            window.open('https://www.immersions-digitales.fr/')
            break
        case 'folio2020':
            window.open('https://www.dakumisu.fr/')
            break
        case 'foliocms':
            window.open('http://cmsfolio.dakumisu.fr/')
            break
        case 'morpion':
            window.open('http://morpion.dakumisu.fr/')
            break
        case 'gamovore':
            window.open('http://gamovore.dakumisu.fr/')
            break
        case 'retrowave':
            window.open('http://retrowave.dakumisu.fr/')
            break

        case 'jamcloud':
            window.open('https://www.behance.net/gallery/114356105/Jam-Cloud-Maquette-Web-Design')
            break
        case 'terredebois':
            window.open('https://www.behance.net/gallery/114355661/Terre-de-Bois-Charte-Graphique')
            break
        case 'charamushroom':
            window.open('https://www.behance.net/gallery/114351103/Chara-Mushroom')
            break

        case 'depression_achro':
            window.open('https://vimeo.com/518747577')
            break
        case 'mmitv':
            window.open('https://vimeo.com/517251095')
            break
        case 'inside':
            window.open('https://vimeo.com/517253872')
            break
        case '1984analysis':
            window.open('https://vimeo.com/517256420')
            break

        case 'numeric':
            window.open('https://www.behance.net/gallery/114356673/Packaging-Photography')
            break
        case 'argentic':
            window.open('https://www.behance.net/gallery/114359139/Movement-Photography-Argentic')
            break
    }
})

document.querySelector('.title--container--content span').addEventListener('click', () => {
    window.open('https://www.awwwards.com/sites/immersions-digitales-2021')
})

planeRectMesh.on('mouseover', () => {
    TweenMax.to(innerCursor, 1, { padding: 50, backgroundColor: 'rgba(233, 239, 239, 1)', ease: Power4.easeOut })
    gsap.to(polygon.strokeColor, 1, { alpha: 0, ease: Power4.easeOut })
    TweenMax.to(projectIndicator, .75, { scale: 1, ease: Power4.easeOut, delay: .25 })
})
planeRectMesh.on('mouseout', () => {
    TweenMax.to(innerCursor, 1, { padding: 5, backgroundColor: 'rgba(233, 239, 239, 0)', ease: Power4.easeOut })
    // TweenMax.to(innerCursor, { mixBlendMode: 'normal', delay: .5 })
    gsap.to(polygon.strokeColor, 1, { alpha: 1, ease: Power4.easeOut })
    TweenMax.to(projectIndicator, 1, { scale: 0, ease: Power4.easeOut })
})

function viewSize() {
    let cameraZ = camera.position.z
    let planeZ = planeRectMesh.position.z
    let distance = cameraZ - planeZ
    let aspect = camera.aspect
    let vFov = camera.fov * Math.PI / 180
    let height = 2 * Math.tan(vFov / 2) * distance
    let width = height * aspect
    return { width, height, vFov }
}

function hoverPositionUpdate() {
    let offset = planeRectMesh.position
        .clone()
        .sub(mousePosition)
        .multiplyScalar(-.7)
    planeRectMaterial.uniforms.uOffset.value = offset
}

function mapCursorXPlane(in_min, in_max, out_min, out_max) {
    return ((mouse.x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}
function mapCursorYPlane(in_min, in_max, out_min, out_max) {
    return ((mouse.y - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}


// --------------------------------------- Projects content ---------------------------------------
const projectContent = {
    id2021: {
        title: 'Immersions Digitales 2021',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    folio2020: {
        title: 'Portfolio 2020',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    foliocms: {
        title: 'CMS Portfolio',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    morpion: {
        title: 'E-Morpion',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    gamovore: {
        title: 'Gamovore',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    retrowave: {
        title: 'Retrowave\'s Trending',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },

    jamcloud: {
        title: 'Jam Cloud',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    terredebois: {
        title: 'Terre de Bois',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    charamushroom: {
        title: 'Chara-Mushroom',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },

    depression_achro: {
        title: 'Dépression Achromatique',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    mmitv: {
        title: 'MMI TV',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    inside: {
        title: 'Inside',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    analysis1984: {
        title: '1984 Analysis',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },

    numeric: {
        title: 'Numeric photography',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    },
    argentic: {
        title: 'Argentic photography',
        text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus tenetur voluptatem ipsa,
                    error similique saepe itaque quae culpa labore ullam nobis fuga doloribus iste officia, quidem quasi
                    exercitationem harum.`
    }
}

// --------------------------------------- Home Page ---------------------------------------
navName.addEventListener('mouseenter', () => {
    TweenMax.to(navNameSpan, .4, { y: -20, rotationZ: -15, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
    TweenMax.to(navPseudoSpan, .4, { y: -30, rotationZ: 0, opacity: 1, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
})
navName.addEventListener('mouseleave', () => {
    TweenMax.to(navNameSpan, .4, { y: 0, rotationZ: 0, opacity: 1, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
    TweenMax.to(navPseudoSpan, .4, { y: -10, rotationZ: -15, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
})

// --------------------------------------- Contact ---------------------------------------
buttonContact.addEventListener('click', () => {
    outerHandleMouseLeave()
    locoScroll.stop()
    icebergRotY = icebergModel.rotation.y
    icebergPosX = icebergModel.position.x
    TweenLite.to(icebergModel.scale, .75, { x: 0, y: 0, z: 0, ease: Back.easeIn })
    TweenLite.to(icebergModel.rotation, .75, { y: icebergRotY - Math.PI * .75,  ease: Power2.easeIn })
    
    TweenMax.to(contactContainer, 0, { pointerEvents: 'all', delay: .75 })
    TweenMax.to(crossCloseContact, 1.5, { yPercent: 500, ease: Power4.easeInOut, delay: .75 })
    TweenMax.to(transitionContainerContact, 1.5, { yPercent: -100, ease: Expo.easeInOut, delay: .25 })
    TweenMax.to(contentContactContainer, 1.25, { opacity: 1, ease: Power4.easeInOut, delay: 1 })
    
    TweenLite.to(icebergModel.position, 1, { x: 13, ease: Back.easeOut, delay: 1.5 })

    isIcebergRotating = true
    setTimeout(() => {
        isContactActive = true
        canvasContainer.style.zIndex = 7
        icebergModel.scale.set(.30, .35, .30)
        icebergModel.position.x = 25
    }, 1000)
})

crossCloseContact.addEventListener('click', () => {
    outerHandleMouseLeave()
    TweenLite.to(icebergModel.position, .75, { x: 25, ease: Back.easeIn })

    TweenMax.to(transitionContainerContact, 1.25, { yPercent: -200, ease: Expo.easeInOut, delay: .5 })
    TweenMax.to(transitionContainerContact, 0, { yPercent: 0, delay: 1.75 })
    TweenMax.to(contactContainer, 0, { pointerEvents: 'none', delay: .5 })
    TweenMax.to(contentContactContainer, 1.25, { opacity: 0, ease: Power4.easeInOut, delay: .25 })
    TweenMax.to(crossCloseContact, 1.5, {yPercent: -500, ease: Power4.easeInOut })

    TweenLite.to(icebergModel.rotation, 1.5, { y: icebergRotY,  ease: Power2.easeOut, delay: 1.1 })
    TweenLite.to(icebergModel.scale, 2, { x: .28, y: .28, z: .28, ease: Elastic.easeOut, delay: 1.1 })
    
    setTimeout(() => {
        locoScroll.start()
        icebergModel.scale.set(0.00001, 0.00001, 0.00001)
        icebergModel.position.x = icebergPosX
        canvasContainer.style.zIndex = -1
        isContactActive = false
        setTimeout(() => {
            isIcebergRotating = false
        }, 1000);
    }, 1000)
})

crossClose.forEach(e => {
    e.addEventListener('mouseenter', () => {
        TweenMax.to('.line-1', 1.75, { rotateZ: -45, ease: Elastic.easeOut })
        TweenMax.to('.line-2', 1.75, { rotateZ: 45, ease: Elastic.easeOut })
    })
    e.addEventListener('mouseleave', () => {
        TweenMax.to('.line-1', 1.75, { rotateZ: 45, ease: Elastic.easeOut })
        TweenMax.to('.line-2', 1.75, { rotateZ: -45, ease: Elastic.easeOut })
    })
})

// --------------------------------------- Link ---------------------------------------
navName.addEventListener('click', () => {
    window.location.replace('https://www.dakumisu.fr/')
})

// --------------------------------------- Mouse move interaction ---------------------------------------
if (!isOnMobile) {
    TweenMax.to({}, 0.01, {
        repeat: -1,
        onRepeat: function () {
            posX += (mouseX - posX) / 4
            posY += (mouseY - posY) / 4
    
            TweenMax.set(innerCursor, {
                x: posX,
                y: posY
            })
    
            TweenMax.set(projectIndicatorContainer, {
                x: posX,
                y: posY,
                delay: .01
            })
    
            if (icebergModel && !isIcebergRotating && !isContactActive) {
                TweenLite.to(icebergModel.rotation, 1, { z: posYNormalize / 30 })
                rotationOnMouseValue = posXNormalize / 10
                // icebergModel.rotation.y = rotationValue
            }
            TweenMax.set(hudContainerTop, { x: posXNormalize * -3 })
            TweenMax.set(hudContainerTop, { y: posYNormalize * 3 })
            TweenMax.set(hudContainerBottom, { x: posXNormalize * -3 })
            TweenMax.set(hudContainerBottom, { y: posYNormalize * 3 })
        }
    })
}

document.addEventListener("mousemove", e => {
    mouseX = e.clientX
    mouseY = e.clientY

    posXNormalize = (posX / window.innerWidth) * 2 - 1
    posYNormalize = - (posY / window.innerWidth) * 2 + 1
})

// --------------------------------------- Cursor Custom ---------------------------------------
let lastX = 0
let lastY = 0
let isStuck = false
let showCursor = false
let group, stuckX, stuckY, fillOuterCursor

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
polygon.strokeColor = strokeColor
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

noLinkItems.forEach(e => {
    e.addEventListener("mouseenter", noHandleMouseEnter)
    e.addEventListener("mouseleave", noHandleMouseLeave)
})

innerLinkItems.forEach(e => {
    e.addEventListener("mouseenter", innerHandleMouseEnter)
    e.addEventListener("mouseleave", innerHandleMouseLeave)
})

outerLinkItems.forEach(e => {
    e.addEventListener("mouseenter", outerHandleMouseEnter)
    e.addEventListener("mouseleave", outerHandleMouseLeave)
})

function noHandleMouseEnter() {
    TweenMax.to(innerCursor, .75, { opacity: 0, ease: Expo.easeOut })
    gsap.to(polygon.strokeColor, .75, { alpha: 0, ease: Expo.easeOut })
}
function noHandleMouseLeave() {
    TweenMax.to(innerCursor, .75, { opacity: 1, ease: Expo.easeOut })
    gsap.to(polygon.strokeColor, .75, { alpha: 1, ease: Expo.easeOut })
}

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
}
function outerHandleMouseLeave() {
    isStuck = false
    TweenMax.to(innerCursor, .75, { padding: 5, opacity: 1, ease: Expo.easeOut })
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

// --------------------------------------- Audio ---------------------------------------
const deg = (a) => a * Math.PI / 180 

class AudioSwitcher {
    constructor(opt) {
        Object.assign(this, opt)

        this.active = false
        this.hover = false
        this.volume = 0
        this.settings = {
            width: 60,
            height: 4.5,
            amplitude: -0.18,
            hoverHeight: 1.2,
            hoverAmplitude: -0.1,
            speed: 3
        }

        this.init()
    }

    init() {
        this.button.addEventListener('click', () => {
            this.active = !this.active
            this.button.classList.toggle('active')
            this.hover = false
        })

        this.button.addEventListener('mouseenter', () => {
            this.hover = true
        })
        this.button.addEventListener('mouseleave', () => {
            this.hover = false
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

        this.clear()
        this.draw(time)
    }
}

const audioSwitcher = new AudioSwitcher({
    button: soundButton,
    soundCanvas: document.querySelector('#canvas-audio'),
    color: lightBlue
})

soundButton.addEventListener('click', () => {
    if (!musicPlayed) {
        musicPlayed = true
        musicMuted = false
        music.play()
    } else {
        if (!musicMuted) {
            musicMuted = true
            music.fade(1, 0, 1000)
        } else {
            musicMuted = false
            music.fade(0, 1, 1000)
        }
    }
})

// --------------------------------------- Scroll Smooth ---------------------------------------
const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    direction: 'vertical',
    smooth: true,
    getDirection: true,
    scrollFromAnywhere: true,
    multiplier: 0.5,
    lerp: 0.08,
    reloadOnContextChange: true,
    smartphone: {
        smooth: true
    },
    tablet: {
        smooth: true
    }
})

navAbout.addEventListener('click', () => {
    if (!navScrollActive) {
        locoScroll.scrollTo(aboutContainer)
        navScrollActive = true
        // gsap.to(music, 1.5, { stereo: 1, ease: Power4.easeInOut})
        // gsap.to(music, 1.5, { stereo: -.5, delay: 1.5, ease: Power4.easeInOut})
        // gsap.to(music, 1, { stereo: 0, delay: 3, ease: Power4.easeInOut})
        setTimeout(() => {
            navScrollActive = false
        }, 1200)
    }
})
navProjects.addEventListener('click', () => {
    if (!navScrollActive) {
        locoScroll.scrollTo(projectsContainer)
        navScrollActive = true
        setTimeout(() => {
            navScrollActive = false
        }, 1200)
    }
})

// --------------------------------------- Scroll Trigger ---------------------------------------
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
    start: "25% bottom", 
    // endTrigger: "html",
    end: "68% bottom",
    scrub: true,
    onUpdate: selfAbout => {
        icebergModel.position.x = 4 + selfAbout.progress * -4
        // icebergModel.rotation.y = rotationYHome + selfAbout.progress * rotationValue
        // rotationValue = rotationYHome + selfAbout.progress * rotationYAbout
    }
})

ScrollTrigger.create({
    trigger: projectsContainer,
    scroller: scrollContainer,
    start: "25% bottom",
    // endTrigger: "html",
    end: "50% bottom",
    scrub: true,
    onUpdate: selfProjects => {
        icebergModel.position.x = 0 + selfProjects.progress * -7
        // icebergModel.rotation.y = rotationYAbout + selfProjects.progress * rotationValue
        // rotationValue = rotationYAbout + selfProjects.progress * rotationYProjects
    }
})

ScrollTrigger.create({
    trigger: projectsContainer,
    scroller: scrollContainer,
    start: "35% bottom", 
    endTrigger: "html",
    onToggle: toggleOnProjects => {
        if (toggleOnProjects.isActive) {
            // isDarkMode = toggleOnProjects.isActive
            // darkMode(isDarkMode)

            // isIcebergRotating = true
            // setTimeout(() => {
            //     isIcebergRotating = false
            // }, 1700)
            // rotationValue = rotationYProjects
            TweenLite.to(hemisphereLightUp, .5, { intensity: 0 })
            TweenLite.to(hemisphereLightDown, .5, { intensity: .9 })
            // timelineIcebergPosProjects.restart()
            // TweenLite.to(icebergModel.position, 3.5, { x: -8, ease: Elastic.easeOut })
            // TweenLite.to(icebergModel.rotation, 1.5, { y: rotationValue, ease: Power2.easeOut })

            TweenMax.to(backgroundContainer, .5, { backgroundColor: darkerBlue })
            TweenMax.to(aboutContainer, .5, { color: lightBlue })
            TweenMax.to(projectsContainer, .5, { color: lightBlue })
            // TweenMax.to(contactContainer, .5, { color: lightBlue })
            // TweenMax.to(transitionContainerContact, .5, { backgroundColor: lightBlue })
            // TweenMax.to('.line-1', .5, { backgroundColor: lightBlue })
            // TweenMax.to('.line-2', .5, { backgroundColor: lightBlue })
            TweenMax.to(titleCat, .5, { webkitTextStrokeColor: lightBlue })

            titleCat.forEach(e => {
                e.style.webkitTextStrokeWidth = ".06vw "
            })

            // timelineIcebergPosAbout.pause()
        } else {
            // isDarkMode = true
            // darkMode(isDarkMode)

            // isIcebergRotating = true
            // setTimeout(() => {
            //     isIcebergRotating = false
            // }, 1700)
            // rotationValue = rotationYAbout
            TweenLite.to(hemisphereLightUp, .5, { intensity: 1.3 })
            TweenLite.to(hemisphereLightDown, .5, { intensity: 0 })
            // timelineIcebergPosAbout.restart()
            // TweenLite.to(icebergModel.position, 3.5, { x: 0, ease: Elastic.easeOut })
            // TweenLite.to(icebergModel.rotation, 1.5, { y: rotationValue, ease: Power2.easeOut })

            TweenMax.to(backgroundContainer, .5, { backgroundColor: lightBlue })
            TweenMax.to(aboutContainer, .5, { color: darkerBlue })
            TweenMax.to(projectsContainer, .5, { color: darkerBlue })
            // TweenMax.to(contactContainer, .5, { color: darkerBlue })
            // TweenMax.to(transitionContainerContact, .5, { backgroundColor: darkerBlue })
            // TweenMax.to('.line-1', .5, { backgroundColor: darkerBlue })
            // TweenMax.to('.line-2', .5, { backgroundColor: darkerBlue })
            TweenMax.to(titleCat, .5, { webkitTextStrokeColor: darkerBlue })

            titleCat.forEach(e => {
                e.style.webkitTextStrokeWidth = ".08vw "
            })

            // timelineIcebergPosProjects.pause()
        }
    },
})

ScrollTrigger.create({
    trigger: endContainer,
    scroller: scrollContainer,
    start: "30% bottom",
    end: "bottom bottom",
    scrub: true,
    onUpdate: self => {
        icebergModel.position.x = -7 + self.progress * 7
        rotationOnScrollValue += (self.getVelocity() * -.00003) * Math.PI
        // icebergModel.rotation.y = rotationYProjects + self.progress * rotationValue
        // rotationValue = rotationYProjects + self.progress * rotationYEnd
        if (self.progress >= .3) {
            canvasContainer.style.zIndex = 1
            canvasContainer.style.pointerEvents = 'all'
        } else {
            canvasContainer.style.zIndex = -1
            canvasContainer.style.pointerEvents = 'none'
        }
    }
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
        rotationOnScrollValue += (self.getVelocity() * -.00001) * Math.PI
    }
})

// --------------------------------------- Gsap Timeline ---------------------------------------
// let icebergMoving = gsap.timeline({ smoothChildTiming: true })

// document.onkeydown = function (e) {
//     switch (e.keyCode) {
//         case 65:
//             tl = gsap.timeline()
//                 .to(icebergModel.position, { duration: 5, x: 0, ease: Elastic.easeOut })
//             break
//         case 90:
//             tl.pause()
//             break
//         case 69:
//             tl.resume()
//             break
//         case 82:
//             tl.seek(2.5)
//             break
//         case 84:
//             tl.restart()
//             break
//     }
// }
// gsap.to(icebergModel.position, 3.5, { x: 0, ease: Elastic.easeOut })
// gsap.to(icebergModel.rotation, 1.5, { y: rotationYAbout , ease: Power2.easeOut })

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
    rendererProject.setSize(sizes.width, sizes.height)
    rendererProject.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()
const raf = () => {
    const elapsedTime = clock.getElapsedTime()

    if (icebergModel) {
        icebergModel.position.y = Math.sin(elapsedTime) * .15 + .85
        if (isContactActive) {
            currentRotate += .03 * Math.PI * -0.03
            if (currentRotate < -Math.PI * 2) {
                currentRotate += Math.PI * 2
            }
            icebergModel.rotation.y = currentRotate
        } else {
            if (!isIcebergRotating) {
                TweenLite.to(icebergModel.rotation, { y: rotationOnScrollValue + rotationOnMouseValue })
            }
        }
    }

    if (music) {
        gsap.to(music, 0, { stereo: Math.sin(elapsedTime) * .4 })
    }

    // Render
    renderer.render(mainScene, camera)
    rendererProject.render(projectScene, camera)
    composer.render()


    const time = performance.now() / 1000
    if (audioSwitcher) {
        audioSwitcher.animate(time)
    }

    if (enterProject)
        planeRectMaterial.uniforms.uProgress.value = elapsedTime * .5

    if (mouse && !enterProject) {
        if (!enterProject) {
            TweenLite.to(pointLight.position, 1, { x: planeX, y: planeY, ease: Power4.easeOut })
            TweenLite.to(planeRectMesh.position, 1, { x: planeX, y: planeY, ease: Power4.easeOut })
            
            hoverPositionUpdate()
            
            planeX = mapCursorXPlane(-1, 1, -viewSize().width / 2, viewSize().width / 2)
            planeY = mapCursorYPlane(-1, 1, -viewSize().height / 2, viewSize().height / 2)
            
            mousePosition.x = planeX
            mousePosition.y = planeY
            mousePosition.z = 0
        } else {
            TweenLite.to(pointLight.position, 1, { x: planeX, y: planeY, ease: Power4.easeOut })
            hoverPositionUpdate()
            
            planeX = mapCursorXPlane(-1, 1, -viewSize().width / 2, viewSize().width / 2)
            planeY = mapCursorYPlane(-1, 1, -viewSize().height / 2, viewSize().height / 2)
            
            mousePosition.x = planeX
            mousePosition.y = planeY
            mousePosition.z = 0
        }
    }

    window.requestAnimationFrame(raf)
}

raf()

ScrollTrigger.addEventListener("refresh", () => locoScroll.update())
ScrollTrigger.refresh()

console.log(`%c ${'there\'s nothing here go away 👀'}`, `background: ${lightBlue}; color: ${normalBlue}; font-weight: bold; font-size: 1rem; border-radius: 100px; padding: .5%`)