import './style.css'
import './locomotiveBase.css'

import { VarConst, VarLet } from '../static/js/var.js'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Interaction } from 'three.interaction'
// import { BloomEffect, EffectComposer, ShaderPass, EffectPass, RenderPass } from "postprocessing"
import LocomotiveScroll from 'locomotive-scroll'
// import { TweenLite, TweenMax, gsap } from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
import howlerjs from 'howler'
import createjs from 'preload-js'

import { polygon as PolygonCursor, outerHandleMouseLeave } from '../static/js/cursor.js'
import { AudioSwitcher } from '../static/js/audio.js'

import vertexShader from '../static/glsl/vertexShader.glsl'
import fragmentShader from '../static/glsl/fragmentShader.glsl'


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    VarLet.isOnMobile = true
    VarConst.cursor.forEach(e => {
        e.style.display = 'none'
    })
    VarConst.projectIndicatorContainer.style.display = 'none'
    document.querySelector('.mobileNotAvailable').style.display = "flex"
}


// Preload
let queue = new createjs.LoadQueue(false)

// images
queue.loadFile('/img/projects/argentic.png')
queue.loadFile('/img/projects/chara_mushroom.png')
queue.loadFile('/img/projects/depression_achro.png')
queue.loadFile('/img/projects/folio_2020.png')
queue.loadFile('/img/projects/folio_cms.png')
queue.loadFile('/img/projects/gamovore.png')
queue.loadFile('/img/projects/id_2021.png')
queue.loadFile('/img/projects/inside.png')
queue.loadFile('/img/projects/jam_cloud.png')
queue.loadFile('/img/projects/mmi_tv.png')
queue.loadFile('/img/projects/morpion.png')
queue.loadFile('/img/projects/numeric.png')
queue.loadFile('/img/projects/retrowave.png')
queue.loadFile('/img/projects/terre_de_bois.png')
queue.loadFile('/img/moi_Default.jpg')
queue.loadFile('/img/moi_Hover.png')
queue.loadFile('/img/displacement/disp.jpg')

// glsl
queue.loadFile('/glsl/fragmentShader.glsl')
queue.loadFile('/glsl/vertexShader.glsl')

// font
queue.loadFile('/font/AndBasR.woff')
queue.loadFile('/font/AndBasR.woff2')
queue.loadFile('/font/Chapaza.woff')
queue.loadFile('/font/Chapaza.woff2')
queue.loadFile('/font/Rossanova.woff')
queue.loadFile('/font/Rossanova.woff2')

// 3D
queue.loadFile('/3D/iceberg_2.0.gltf')

// Sound
queue.loadFile('/sound/music.mp3')

// Librairies
queue.loadFile(GLTFLoader)
queue.loadFile(Interaction)
queue.loadFile(ScrollTrigger)
queue.loadFile(LocomotiveScroll)

queue.on("progress", event => {
    let progressValue =  Math.floor(event.progress*100)
    if (progressValue < 10)
        VarConst.progressLoaderValue.innerHTML = `<span class="loadValue">00${ progressValue }</span>`
    else if (progressValue < 100)
        VarConst.progressLoaderValue.innerHTML = `<span class="loadValue">0${ progressValue }</span>`
    else
        VarConst.progressLoaderValue.innerHTML = `<span class="loadValue">${ progressValue }</span>`

    if (progressValue <= 20 && progressValue >= 0) {

    } else if (progressValue <= 60 && progressValue > 20) {
        VarConst.maskContainer.forEach(element => {
            TweenMax.to(element, .5, { yPercent: -100 })
        })
        TweenMax.to(VarConst.loadingText_1, .25, { opacity: 0 })
        TweenMax.to(VarConst.loadingText_2, .25, { opacity: 1 })
    } else if (progressValue <= 90 && progressValue > 60) {
        VarConst.maskContainer.forEach(element => {
            TweenMax.to(element, .5, { yPercent: -200 })
        })
        TweenMax.to(VarConst.loadingText_2, .25, { opacity: 0 })
        TweenMax.to(VarConst.loadingText_3, .25, { opacity: 1 })
    } else {
        VarConst.maskContainer.forEach(element => {
            TweenMax.to(element, .5, { yPercent: -300 })
        })
        TweenMax.to(VarConst.loadingText_3, .25, { opacity: 0 })
        TweenMax.to(VarConst.loadingText_4, .25, { opacity: 1 })
    }
})

queue.on("complete", () => {
    VarLet.loadFinished = true
    TweenMax.to(VarConst.progressLoaderValue, .75, { opacity: 0 })
    TweenMax.to(VarConst.loadingText_4, .75, { opacity: 0, delay: 1})
    TweenMax.to(VarConst.loaderContainer, 2, { yPercent: -200, ease: Expo.easeInOut, delay: 1 })

    TweenMax.from(VarConst.hudContainerTop, 1, { yPercent: -300, ease: Expo.easeOut, delay: 2.5 })
    TweenMax.from(VarConst.hudContainerBottom, 1, { yPercent: 300, ease: Expo.easeOut, delay: 2.5 })
    TweenMax.from(VarConst.scrollIndication_1, 1.5, { yPercent: 300, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Expo.easeOut, delay: 3.5 })
    TweenMax.from(VarConst.scrollIndication_2, 1.5, { yPercent: 300, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Expo.easeOut, delay: 3.5 })
    
    TweenMax.from(VarConst.heroContentTitle, 1, { yPercent: 50, opacity: 0, ease: Power3.easeOut, delay: 2.75 })
    TweenMax.from(VarConst.heroContentSubtitle, 1, { yPercent: 50, opacity: 0, ease: Power3.easeOut, delay: 3 })

    TweenLite.from(icebergModel.scale, 2, { x: 0, y: 0, z: 0, ease: Elastic.easeOut.config(1, 0.5), delay: 3 })
    TweenLite.from(icebergModel.rotation, 6, { y: 0, ease: Elastic.easeOut, delay: 3 })

    setTimeout(() => {
        locoScroll.start()
        TweenMax.to(VarConst.scrollIndication_1, 1, { y: -15, rotationZ: -15, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Power3.easeInOut, delay: 2.5, repeat: -1, repeatDelay: 2 })
        TweenMax.to(VarConst.scrollIndication_2, 1, { y: -15, rotationZ: 0, opacity: 1, stagger: { each: .05, from: 'start'}, ease: Power3.easeInOut, delay: 2.5, repeat: -1, repeatDelay: 2 })
    }, 4000);
})

const music = new Howl({
    src: ['/sound/music.mp3'],
    autoplay: false,
    loop: true, 
    stereo: 0,
    volume: .7,
})

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
    canvas: VarConst.mainCanvas,
    antialias: true,
    alpha: true
})
const rendererProject = new THREE.WebGLRenderer({
    canvas: VarConst.projectCanvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
rendererProject.setSize(sizes.width, sizes.height)

// Post Processing
// const composer = new EffectComposer(rendererProject)
// const renderPass = new RenderPass(projectScene, camera)
// composer.addPass(renderPass)

// const customPass = new ShaderPass({ vertexShader, fragmentShader })
// customPass.renderToScreen = true
// composer.addPass(customPass)

// Interaction
new Interaction(renderer, mainScene, camera)
new Interaction(rendererProject, projectScene, camera)

// Lights
const pointLight = new THREE.PointLight(VarConst.THREEdarkerBlue, .3)
pointLight.position.set(0, 0, 5)
mainScene.add(pointLight)
const hemisphereLightUp = new THREE.HemisphereLight(VarConst.THREElightBlue, VarConst.THREEdarkBlue, 1.3)
mainScene.add(hemisphereLightUp)
const hemisphereLightDown = new THREE.HemisphereLight(VarConst.THREEdarkBlue, VarConst.THREEnormalBlue, 0)
mainScene.add(hemisphereLightDown)

// Texture Loader
const textureLoader = new THREE.TextureLoader()

// Materials
const toonMaterial = new THREE.MeshToonMaterial()
toonMaterial.color = VarConst.THREElightBlue
toonMaterial.aoMapIntensity = 1

// --------------------------------------- Init Iceberg ---------------------------------------
const gltfLoader = new GLTFLoader()
let icebergModel

let rotationYHome = Math.PI * 1.7
let rotationValue = 0
let rotationOnScrollValue = rotationYHome

gltfLoader.load('/3D/iceberg_2.0.gltf', (addIcebergModel) => {
        icebergModel = addIcebergModel.scene
        icebergModel.traverse((e) => {
            if (e.isMesh)
                e.material = toonMaterial
        })

        icebergModel.scale.set(.28, .28, .28)
        icebergModel.rotation.y = rotationYHome
        icebergModel.position.set(4, 1, 0)
        mainScene.add(icebergModel)

        icebergModel.on('click', () => {
            if (!VarLet.navScrollActive) {
                locoScroll.scrollTo(VarConst.heroContainer)
                VarLet.navScrollActive = true
                setTimeout(() => {
                    VarLet.navScrollActive = false
                }, 1200)
            }
        })
    }
)

// function test() {
//     gsap.to(icebergModel.scale, 1, { x: .28, y: .28, z: .28, ease: Power4.easeOut})
//     setTimeout(() => {
//         onMouseDown = false
//     }, 1000)
// }


// --------------------------------------- Planes ---------------------------------------
const texture_id2021 = textureLoader.load('/img/projects/id_2021.png')
const texture_folio2020 = textureLoader.load('/img/projects/folio_2020.png')
const texture_foliocms = textureLoader.load('/img/projects/folio_cms.png')
const texture_morpion = textureLoader.load('/img/projects/morpion.png')
const texture_gamovore = textureLoader.load('/img/projects/gamovore.png')
const texture_retrowave = textureLoader.load('/img/projects/retrowave.png')
const texture_particlesfollow = textureLoader.load('/img/projects/particles_follow.png')
const texture_fod = textureLoader.load('/img/projects/fod.png')

const texture_jamcloud = textureLoader.load('/img/projects/jam_cloud.png')
const texture_terredebois = textureLoader.load('/img/projects/terre_de_bois.png')
const texture_charamushroom = textureLoader.load('/img/projects/chara_mushroom.png')

const texture_shworeel = textureLoader.load('/img/projects/showreel.png')
const texture_depression = textureLoader.load('/img/projects/depression_achro.png')
const texture_mmitv = textureLoader.load('/img/projects/mmi_tv.png')
const texture_inside = textureLoader.load('/img/projects/inside.png')

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
    VarConst.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    VarConst.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1
})

VarConst.images.forEach(image => {
    image.addEventListener('mouseenter', (e) => {
        if (!VarLet.enterProject) {
            TweenLite.to(planeRectMaterial.uniforms.uAlpha, .5, { value: 1, ease: Power2.easeInOut })
            TweenMax.to(VarConst.images, .75, { opacity: .25, ease: Power3.easeOut })
            switch (e.target.attributes[1].value) {
                case 'id2021' :
                    changePlaneTexture(texture_id2021)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'folio2020' :
                    changePlaneTexture(texture_folio2020)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'foliocms' :
                    changePlaneTexture(texture_foliocms)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'morpion' :
                    changePlaneTexture(texture_morpion)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'gamovore' :
                    changePlaneTexture(texture_gamovore)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'retrowave' :
                    changePlaneTexture(texture_retrowave)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'particles_follow' :
                    changePlaneTexture(texture_particlesfollow)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'fod' :
                    changePlaneTexture(texture_fod)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
    
                case 'jamcloud' :
                    changePlaneTexture(texture_jamcloud)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'terredebois' :
                    changePlaneTexture(texture_terredebois)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'charamushroom' :
                    changePlaneTexture(texture_charamushroom)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
    
                case 'showreel' :
                    changePlaneTexture(texture_shworeel)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'depression_achro' :
                    changePlaneTexture(texture_depression)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'mmitv' :
                    changePlaneTexture(texture_mmitv)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'inside' :
                    changePlaneTexture(texture_inside)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break

                case 'numeric' :
                    changePlaneTexture(texture_numeric)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
                case 'argentic' :
                    changePlaneTexture(texture_argentic)
                    TweenMax.to(image, .75, { opacity: 1, ease: Power3.easeOut })
                    break
            }
        }
    })

    image.addEventListener('mouseleave', () => {
        if (!VarLet.enterProject) {
            TweenLite.to(planeRectMaterial.uniforms.uAlpha, .5, { value: 0, ease: Power4.easeOut })
            TweenMax.to(VarConst.images, .75, { opacity: .75, ease: Power3.easeOut })
        }
    })

    image.addEventListener('click', (e) => {
        VarLet.enterProject = true
        TweenMax.to(VarConst.images, .75, { opacity: .75, ease: Power3.easeOut })
        VarLet.currentProject = e.target.attributes[1].value
        locoScroll.stop()

        switch (e.target.attributes[1].value) {
            case 'id2021' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.id2021.title
                VarConst.projectText.innerHTML = VarConst.projectContent.id2021.text
                VarConst.btnVisitProject.style.display = "block"
                VarConst.icon.html.style.display = "inline-block"
                VarConst.icon.sass.style.display = "inline-block"
                VarConst.icon.js.style.display = "inline-block"
                VarConst.icon.gsap.style.display = "inline-block"
                VarConst.icon.threejs.style.display = "inline-block"
                VarConst.icon.glsl.style.display = "inline-block"
                VarConst.icon.awwward.style.display = 'block'
                VarConst.icon.github.style.display = 'block'
                VarLet.link = VarConst.githubLink.id
                break
            case 'folio2020' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.folio2020.title
                VarConst.projectText.innerHTML = VarConst.projectContent.folio2020.text
                VarConst.btnVisitProject.style.display = "block"
                VarConst.btnVisitProject.style.display = "block"
                VarConst.icon.html.style.display = "inline-block"
                VarConst.icon.sass.style.display = "inline-block"
                VarConst.icon.js.style.display = "inline-block"
                VarConst.icon.php.style.display = "inline-block"
                break
            case 'foliocms' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.foliocms.title
                VarConst.projectText.innerHTML = VarConst.projectContent.foliocms.text
                VarConst.btnVisitProject.style.display = "block"
                VarConst.btnVisitProject.style.display = "block"
                VarConst.icon.html.style.display = "inline-block"
                VarConst.icon.sass.style.display = "inline-block"
                VarConst.icon.php.style.display = "inline-block"
                VarConst.icon.sql.style.display = "inline-block"
                break
            case 'morpion' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.morpion.title
                VarConst.projectText.innerHTML = VarConst.projectContent.morpion.text
                VarConst.btnVisitProject.style.display = "block"
                VarConst.icon.html.style.display = "inline-block"
                VarConst.icon.sass.style.display = "inline-block"
                VarConst.icon.php.style.display = "inline-block"
                break
            case 'gamovore' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.gamovore.title
                VarConst.projectText.innerHTML = VarConst.projectContent.gamovore.text
                VarConst.btnVisitProject.style.display = "block"
                VarConst.icon.html.style.display = "inline-block"
                VarConst.icon.sass.style.display = "inline-block"
                VarConst.icon.php.style.display = "inline-block"
                break
            case 'retrowave' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.retrowave.title
                VarConst.projectText.innerHTML = VarConst.projectContent.retrowave.text
                VarConst.btnVisitProject.style.display = "block"
                VarConst.icon.html.style.display = "inline-block"
                VarConst.icon.sass.style.display = "inline-block"
                VarConst.icon.js.style.display = "inline-block"
                VarConst.icon.github.style.display = 'block'
                VarLet.link = VarConst.githubLink.retrowave
                break
            case 'particles_follow' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.particles_follow.title
                VarConst.projectText.innerHTML = VarConst.projectContent.particles_follow.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.processing.style.display = "inline-block"
                VarConst.icon.java.style.display = "inline-block"
                break
            case 'fod' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.fod.title
                VarConst.projectText.innerHTML = VarConst.projectContent.fod.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.unity.style.display = "inline-block"
                VarConst.icon.csharp.style.display = "inline-block"
                break

            case 'jamcloud' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.jamcloud.title
                VarConst.projectText.innerHTML = VarConst.projectContent.jamcloud.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.xd.style.display = "inline-block"
                break
            case 'terredebois' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.terredebois.title
                VarConst.projectText.innerHTML = VarConst.projectContent.terredebois.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.ai.style.display = "inline-block"
                break
            case 'charamushroom' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.charamushroom.title
                VarConst.projectText.innerHTML = VarConst.projectContent.charamushroom.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.ai.style.display = "inline-block"
                break

            case 'showreel' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.showreel.title
                VarConst.projectText.innerHTML = VarConst.projectContent.showreel.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.ae.style.display = "inline-block"
                break
            case 'depression_achro' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.depression_achro.title
                VarConst.projectText.innerHTML = VarConst.projectContent.depression_achro.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.pp.style.display = "inline-block"
                break
            case 'mmitv' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.mmitv.title
                VarConst.projectText.innerHTML = VarConst.projectContent.mmitv.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.ae.style.display = "inline-block"
                break
            case 'inside' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.inside.title
                VarConst.projectText.innerHTML = VarConst.projectContent.inside.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.pp.style.display = "inline-block"
                break

            case 'numeric' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.numeric.title
                VarConst.projectText.innerHTML = VarConst.projectContent.numeric.text
                VarConst.btnViewProject.style.display = "block"
                VarConst.icon.lr.style.display = "inline-block"
                break
            case 'argentic' :
                VarConst.projectTitle.innerHTML = VarConst.projectContent.argentic.title
                VarConst.projectText.innerHTML = VarConst.projectContent.argentic.text
                VarConst.btnViewProject.style.display = "block"
                break
        }

        TweenMax.to(VarConst.projectsContainer, 1, { opacity: 0, pointerEvents: 'none', ease: Power4.easeOut })
        TweenMax.to(VarConst.transitionContainerProject, 1.5, { yPercent: 100, ease: Expo.easeInOut })

        TweenMax.to('.content--container .title--container', 2.5, { opacity: 1, ease: Power4.easeInOut, delay: .50 })
        TweenMax.to('.content--container .text--container', 2.5, { opacity: 1, ease: Power4.easeInOut, delay: .75 })
        TweenMax.to('.content--container .icon--container', 2.5, { opacity: 1, ease: Power4.easeInOut, delay: 1 })
        TweenMax.to(VarConst.crossCloseProject, 1.5, { yPercent: 500, ease: Power4.easeInOut, delay: .75 })

        VarConst.projectCanvasContainer.style.position = 'absolute'
        setTimeout(() => {            
            VarConst.projectCanvasContainer.style.pointerEvents = 'all'
            VarConst.projectCanvasContainer.style.zIndex = 5
            VarConst.cursor.forEach(e => {
                e.style.mixBlendMode = 'hard-light'
            })
        }, 500)

        TweenLite.to(planeRectMaterial.uniforms.uAlpha, .5, { value: 1, ease: Power4.easeOut })
        
        TweenLite.to(planeRectMaterial.uniforms.uOffset.value, .5, { x: 0, y: 0, ease: Power4.easeOut })

        TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 4, { x: 5, y: 5, ease: Expo.easeOut })
        TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 3, { x: 1, y: 1, ease: Power4.easeOut, delay: 1 })

        TweenLite.to(planeRectMesh.position, 2, { x: -3, y: 0, z: 6, ease: Expo.easeInOut })
    })
})

VarConst.crossCloseProject.addEventListener('click', () => {
    outerHandleMouseLeave()
    TweenMax.to(VarConst.projectsContainer, 0, { opacity: 1 })
    TweenMax.to(VarConst.projectsContainer, 0, { pointerEvents: 'all', delay: 2 })

    TweenMax.to(VarConst.transitionContainerProject, 1.25, { yPercent: 200, ease: Expo.easeInOut, delay: .75 })
    TweenMax.to(VarConst.transitionContainerProject, 0, { yPercent: 0, delay: 2 })

    TweenMax.to('.content--container .title--container', 1.5, { opacity: 0, ease: Power4.easeOut })
    TweenMax.to('.content--container .text--container', 1.5, { opacity: 0, ease: Power4.easeOut, delay: .25 })
    TweenMax.to('.content--container .icon--container', 1.5, { opacity: 0, ease: Power4.easeOut, delay: .5 })
    TweenMax.to(VarConst.crossCloseProject, 1.5, { yPercent: -500, ease: Power4.easeInOut })

    VarConst.projectCanvasContainer.style.pointerEvents = 'none'
    setTimeout(() => {
        locoScroll.start()
    }, 1500);
    setTimeout(() => {
        VarConst.projectCanvasContainer.style.position = 'fixed'
        VarConst.btnVisitProject.style.display = "none"
        VarConst.btnViewProject.style.display = "none"
        VarConst.icon.html.style.display = "none"
        VarConst.icon.sass.style.display = "none"
        VarConst.icon.js.style.display = "none"
        VarConst.icon.gsap.style.display = "none"
        VarConst.icon.threejs.style.display = "none"
        VarConst.icon.glsl.style.display = "none"
        VarConst.icon.php.style.display = "none"
        VarConst.icon.sql.style.display = "none"
        VarConst.icon.ae.style.display = "none"
        VarConst.icon.ai.style.display = "none"
        VarConst.icon.lr.style.display = "none"
        VarConst.icon.pp.style.display = "none"
        VarConst.icon.xd.style.display = "none"
        VarConst.icon.processing.style.display = "none"
        VarConst.icon.java.style.display = "none"
        VarConst.icon.unity.style.display = "none"
        VarConst.icon.csharp.style.display = "none"
        VarConst.icon.awwward.style.display = 'none'
        VarConst.icon.github.style.display = 'none'
        VarConst.cursor.forEach(e => {
            e.style.mixBlendMode = 'difference'
        })
    }, 2000)

    TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 3, { x: 5, y: 5, ease: Expo.easeOut })
    TweenLite.to(planeRectMaterial.uniforms.uFrequency.value, 2, { x: 0, y: 0, ease: Expo.easeOut, delay: 1 })
    TweenLite.to(planeRectMaterial.uniforms.uAlpha, 1.25, { value: 0, ease: Power4.easeOut })
    TweenLite.to(planeRectMesh.position, { z: 4, delay: 1 })

    setTimeout(() => {
        VarConst.projectCanvasContainer.style.zIndex = -1
        VarLet.enterProject = false
    }, 1500)
})

planeRectMesh.on('click', () => {
    switch (VarLet.currentProject) {
        case 'id2021':
            window.open('https://www.immersions-digitales.fr/')
            break
        case 'folio2020':
            window.open('http://2020.dakumisu.fr/')
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
        case 'particles_follow':
            window.open('https://openprocessing.org/sketch/1173476')
            break
        case 'fod':
            window.open('https://kangourou-gang.itch.io/fear-of-daemon')
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

        case 'showreel':
            window.open('https://vimeo.com/556574460')
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

        case 'numeric':
            window.open('https://www.behance.net/gallery/114356673/Packaging-Photography')
            break
        case 'argentic':
            window.open('https://www.behance.net/gallery/114359139/Movement-Photography-Argentic')
            break
    }
})

document.querySelector('.honorable_mention').addEventListener('click', () => {
    window.open('https://www.awwwards.com/sites/immersions-digitales-2021')
})
document.querySelector('.github').addEventListener('click', () => {
    window.open(VarLet.link)
})

function changePlaneTexture(texture) {
    if (planeRectMaterial.uniforms.uAlpha.value <= .15) {
        planeRectMaterial.uniforms.uTexture2.value = texture
        planeRectMaterial.uniforms.uTexture1.value = texture
    } else {
        if (planeRectMaterial.uniforms.uDispFactor.value >= .0 && planeRectMaterial.uniforms.uDispFactor.value <= .8) {
            planeRectMaterial.uniforms.uTexture2.value = texture
            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 1, ease: Power4.easeOut })
        } else {
            planeRectMaterial.uniforms.uTexture1.value = texture
            TweenLite.to(planeRectMaterial.uniforms.uDispFactor, 1, { value: 0, ease: Power4.easeOut })
        }
    }
}

planeRectMesh.on('mouseover', () => {
    TweenMax.to(VarConst.innerCursor, 1, { padding: 50, backgroundColor: 'rgba(233, 239, 239, 1)', ease: Power4.easeOut })
    gsap.to(polygon.strokeColor, 1, { alpha: 0, ease: Power4.easeOut })
    TweenMax.to(VarConst.projectIndicator, .75, { scale: 1, ease: Power4.easeOut, delay: .25 })
})
planeRectMesh.on('mouseout', () => {
    TweenMax.to(VarConst.innerCursor, 1, { padding: 5, backgroundColor: 'rgba(233, 239, 239, 0)', ease: Power4.easeOut })
    gsap.to(polygon.strokeColor, 1, { alpha: 1, ease: Power4.easeInOut })
    TweenMax.to(VarConst.projectIndicator, 1, { scale: 0, ease: Power4.easeOut })
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
        .sub(VarConst.planePosition) // Velocité
        .multiplyScalar(-.5) // Puissance
    planeRectMaterial.uniforms.uOffset.value = offset
}

function mapCursorXPlane(in_min, in_max, out_min, out_max) {
    return ((VarConst.mouse.x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}
function mapCursorYPlane(in_min, in_max, out_min, out_max) {
    return ((VarConst.mouse.y - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}


// --------------------------------------- Home Page ---------------------------------------
VarConst.navName.addEventListener('mouseenter', () => {
    TweenMax.to(VarConst.navNameSpan, .4, { y: -20, rotationZ: -15, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
    TweenMax.to(VarConst.navPseudoSpan, .4, { y: -30, rotationZ: 0, opacity: 1, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
})
VarConst.navName.addEventListener('mouseleave', () => {
    TweenMax.to(VarConst.navNameSpan, .4, { y: 0, rotationZ: 0, opacity: 1, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
    TweenMax.to(VarConst.navPseudoSpan, .4, { y: -10, rotationZ: -15, opacity: 0, stagger: { each: .05, from: 'start'}, ease: Power3, delay: .1 })
})

// --------------------------------------- Contact ---------------------------------------
VarConst.buttonContact.addEventListener('click', () => {
    outerHandleMouseLeave()
    locoScroll.stop()
    VarLet.icebergRotY = icebergModel.rotation.y
    VarLet.icebergPosX = icebergModel.position.x
    TweenLite.to(icebergModel.scale, .75, { x: 0, y: 0, z: 0, ease: Back.easeIn })
    TweenLite.to(icebergModel.rotation, .75, { y: VarLet.icebergRotY - Math.PI * .75,  ease: Power2.easeIn })
    
    TweenMax.to(VarConst.contactContainer, 0, { pointerEvents: 'all', delay: .75 })
    TweenMax.to(VarConst.crossCloseContact, 1.5, { yPercent: 500, ease: Power4.easeInOut, delay: .75 })
    TweenMax.to(VarConst.transitionContainerContact, 1.5, { yPercent: -100, ease: Expo.easeInOut, delay: .25 })
    TweenMax.to(VarConst.contentContactContainer, 1.25, { opacity: 1, ease: Power4.easeInOut, delay: 1 })
    
    TweenLite.to(icebergModel.position, 1, { x: 13, ease: Back.easeOut, delay: 1.5 })

    VarLet.isIcebergRotating = true
    setTimeout(() => {
        VarLet.isContactActive = true
        VarConst.canvasContainer.style.zIndex = 7
        VarConst.canvasContainer.style.pointerEvents = 'none'
        icebergModel.scale.set(.30, .35, .30)
        icebergModel.position.x = 25
    }, 1000)
})

VarConst.crossCloseContact.addEventListener('click', () => {
    outerHandleMouseLeave()
    TweenLite.to(icebergModel.position, .75, { x: 25, ease: Back.easeIn })

    TweenMax.to(VarConst.transitionContainerContact, 1.25, { yPercent: -200, ease: Expo.easeInOut, delay: .5 })
    TweenMax.to(VarConst.transitionContainerContact, 0, { yPercent: 0, delay: 1.75 })
    TweenMax.to(VarConst.contactContainer, 0, { pointerEvents: 'none', delay: .5 })
    TweenMax.to(VarConst.contentContactContainer, 1.25, { opacity: 0, ease: Power4.easeInOut, delay: .25 })
    TweenMax.to(VarConst.crossCloseContact, 1.5, {yPercent: -500, ease: Power4.easeInOut })

    TweenLite.to(icebergModel.rotation, 1.5, { y: VarLet.icebergRotY,  ease: Power2.easeOut, delay: 1.1 })
    TweenLite.to(icebergModel.scale, 2, { x: .28, y: .28, z: .28, ease: Elastic.easeOut, delay: 1.1 })
    
    setTimeout(() => {
        locoScroll.start()
        icebergModel.scale.set(0.00001, 0.00001, 0.00001)
        icebergModel.position.x = VarLet.icebergPosX
        if (VarLet.isIcebergOnEnd) {
            VarConst.canvasContainer.style.pointerEvents = 'all'
            VarConst.canvasContainer.style.zIndex = 1
        } else {
            VarConst.canvasContainer.style.pointerEvents = 'none'
            VarConst.canvasContainer.style.zIndex = -1
        }
        VarLet.isContactActive = false
        setTimeout(() => {
            VarLet.isIcebergRotating = false
        }, 1000);
    }, 1000)
})

VarConst.crossClose.forEach(e => {
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
VarConst.navName.addEventListener('click', () => {
    window.location.replace('https://www.dakumisu.fr/')
})

// --------------------------------------- Mouse move interaction ---------------------------------------
if (!VarLet.isOnMobile) {
    TweenMax.to({}, 0.01, {
        repeat: -1,
        onRepeat: function () {
            VarLet.posX += (VarLet.mouseX - VarLet.posX) / 4
            VarLet.posY += (VarLet.mouseY - VarLet.posY) / 4
    
            TweenMax.set(VarConst.innerCursor, {
                x: VarLet.posX,
                y: VarLet.posY
            })
    
            TweenMax.set(VarConst.projectIndicatorContainer, {
                x: VarLet.posX,
                y: VarLet.posY,
                delay: .01
            })
    
            if (icebergModel && !VarLet.isIcebergRotating && !VarLet.isContactActive) {
                TweenLite.to(icebergModel.rotation, 1, { z: VarLet.posYNormalize * .05 })
            }
            TweenMax.set(VarConst.hudContainerTop, { x: VarLet.posXNormalize * -3 })
            TweenMax.set(VarConst.hudContainerTop, { y: VarLet.posYNormalize * 3 })
            TweenMax.set(VarConst.hudContainerBottom, { x: VarLet.posXNormalize * -3 })
            TweenMax.set(VarConst.hudContainerBottom, { y: VarLet.posYNormalize * 3 })
        }
    })
}

document.addEventListener("mousemove", e => {
    VarLet.mouseX = e.clientX
    VarLet.mouseY = e.clientY

    VarLet.posXNormalize = (VarLet.posX / window.innerWidth) * 2 - 1
    VarLet.posYNormalize = - (VarLet.posY / window.innerWidth) * 2 + 1
})

// --------------------------------------- Cursor Custom ---------------------------------------
const polygon = PolygonCursor

// --------------------------------------- Audio ---------------------------------------
const audioSwitcher = new AudioSwitcher({
    button: VarConst.soundButton,
    soundCanvas: document.querySelector('#canvas-audio'),
    color: VarConst.darkerBlue
})

VarConst.soundButton.addEventListener('click', () => {
    if (!VarLet.musicPlayed) {
        VarLet.musicPlayed = true
        VarLet.musicMuted = false
        music.play()
    } else {
        if (!VarLet.musicMuted) {
            VarLet.musicMuted = true
            music.fade(1, 0, 1000)
        } else {
            VarLet.musicMuted = false
            music.fade(0, 1, 1000)
        }
    }
})

// --------------------------------------- Scroll Smooth ---------------------------------------
const locoScroll = new LocomotiveScroll({
    el: VarConst.scrollContainer,
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

locoScroll.stop()

VarConst.navAbout.addEventListener('click', () => {
    if (VarLet.showScrollIndication) {
        TweenMax.to(VarConst.scrollIndication, 1, { opacity: 0, ease: Power3.easeOut })
        VarLet.showScrollIndication = false
    }
    if (!VarLet.navScrollActive) {
        locoScroll.scrollTo(VarConst.aboutContainer)
        VarLet.navScrollActive = true
        setTimeout(() => {
            VarLet.navScrollActive = false
        }, 1200)
    }
})
VarConst.navProjects.addEventListener('click', () => {
    if (VarLet.showScrollIndication) {
        TweenMax.to(VarConst.scrollIndication, 1, { opacity: 0, ease: Power3.easeOut })
        VarLet.showScrollIndication = false
    }
    if (!VarLet.navScrollActive) {
        locoScroll.scrollTo(VarConst.projectsContainer)
        VarLet.navScrollActive = true
        setTimeout(() => {
            VarLet.navScrollActive = false
        }, 1200)
    }
})

// --------------------------------------- Scroll Trigger ---------------------------------------
/* ADD LOCOSCROLL */
locoScroll.on("scroll", ScrollTrigger.update)

ScrollTrigger.scrollerProxy(VarConst.scrollContainer, {
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
    pinType: VarConst.scrollContainer.style.transform ? "transform" : "fixed"
})

ScrollTrigger.create({
    trigger: VarConst.aboutContainer,
    scroller: VarConst.scrollContainer,
    start: "16% bottom", 
    onToggle: () => {
        if (VarLet.showScrollIndication) {
            TweenMax.to(VarConst.scrollIndication, 1, { opacity: 0, ease: Power3.easeOut })
            VarLet.showScrollIndication = false
        }
    }
})

ScrollTrigger.create({
    trigger: VarConst.aboutContainer,
    scroller: VarConst.scrollContainer,
    start: "25% bottom", 
    end: "43% bottom",
    scrub: true,
    onUpdate: selfAbout => {
        icebergModel.position.x = 4 + selfAbout.progress * -4
    }
})

ScrollTrigger.create({
    trigger: VarConst.aboutContainer,
    scroller: VarConst.scrollContainer,
    start: "60% bottom", 
    end: "150% bottom",
    scrub: true,
    onUpdate: selfAbout => {
        if (selfAbout.progress <= .5) {
            VarConst.canvasContainer.style.opacity = 1 - selfAbout.progress
        } else {
            VarConst.canvasContainer.style.opacity = selfAbout.progress
        }
    }
})

ScrollTrigger.create({
    trigger: VarConst.projectsContainer,
    scroller: VarConst.scrollContainer,
    start: "25% bottom",
    end: "50% bottom",
    scrub: true,
    onUpdate: selfProjects => {
        icebergModel.position.x = 0 + selfProjects.progress * -7.5
    }
})

ScrollTrigger.create({
    trigger: VarConst.projectsContainer,
    scroller: VarConst.scrollContainer,
    start: "35% bottom", 
    endTrigger: "html",
    onToggle: toggleOnProjects => {
        if (toggleOnProjects.isActive) {
            TweenLite.to(hemisphereLightUp, .5, { intensity: 0 })
            TweenLite.to(hemisphereLightDown, .5, { intensity: .9 })

            TweenMax.to(VarConst.backgroundContainer, .5, { backgroundColor: VarConst.darkerBlue })
            TweenMax.to(VarConst.aboutContainer, .5, { color: VarConst.lightBlue })
            TweenMax.to(VarConst.projectsContainer, .5, { color: VarConst.lightBlue })
            TweenMax.to(VarConst.titleCat, .5, { webkitTextStrokeColor: VarConst.lightBlue })
            TweenMax.to(VarConst.lines, .5, { backgroundColor: VarConst.lightBlue })
            
            TweenMax.to(VarConst.hudContainerTop, .5, { color: VarConst.lightBlue })
            TweenMax.to(VarConst.hudContainerBottom, .5, { color: VarConst.lightBlue })
            TweenLite.to(audioSwitcher, .5, { color: VarConst.lightBlue })

            VarConst.titleCat.forEach(e => {
                e.style.webkitTextStrokeWidth = ".5px"
            })
        } else {
            TweenLite.to(hemisphereLightUp, .5, { intensity: 1.3 })
            TweenLite.to(hemisphereLightDown, .5, { intensity: 0 })

            TweenMax.to(VarConst.backgroundContainer, .5, { backgroundColor: VarConst.lightBlue })
            TweenMax.to(VarConst.aboutContainer, .5, { color: VarConst.darkerBlue })
            TweenMax.to(VarConst.projectsContainer, .5, { color: VarConst.darkerBlue })
            TweenMax.to(VarConst.titleCat, .5, { webkitTextStrokeColor: VarConst.darkerBlue })
            TweenMax.to(VarConst.lines, .5, { backgroundColor: VarConst.darkerBlue })

            TweenMax.to(VarConst.hudContainerTop, .5, { color: VarConst.darkerBlue })
            TweenMax.to(VarConst.hudContainerBottom, .5, { color: VarConst.darkerBlue })
            TweenLite.to(audioSwitcher, .5, { color: VarConst.darkerBlue })

            VarConst.titleCat.forEach(e => {
                e.style.webkitTextStrokeWidth = "1.5px"
            })
        }
    },
})

ScrollTrigger.create({
    trigger: VarConst.endContainer,
    scroller: VarConst.scrollContainer,
    start: "30% bottom",
    end: "bottom bottom",
    scrub: true,
    onUpdate: selfEnd => {
        icebergModel.position.x = -7.5 + selfEnd.progress * 7
        rotationOnScrollValue += (selfEnd.getVelocity() * -.00003) * Math.PI
        if (selfEnd.progress >= .3) {
            VarLet.isIcebergOnEnd = true
            VarConst.canvasContainer.style.zIndex = 1
            VarConst.canvasContainer.style.pointerEvents = 'all'
        } else {
            VarLet.isIcebergOnEnd = false
            VarConst.canvasContainer.style.zIndex = -1
            VarConst.canvasContainer.style.pointerEvents = 'none'
        }
    }
})

ScrollTrigger.create({
    trigger: VarConst.endContainer,
    scroller: VarConst.scrollContainer,
    start: "75% bottom",
    endTrigger: "html",
    scrub: true,
    onToggle: selfEnd => {
        if (selfEnd.isActive) {
            TweenMax.to(VarConst.endContainerContent, .5, { opacity: 1, ease: Power4.easeInOut })
        } else {
            TweenMax.to(VarConst.endContainerContent, .5, { opacity: 0, ease: Power4.easeOut })
        }
    }
})

/* ADD SKEW SECTION */
let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(".skewElem", "skewY", "deg"),
    clamp = gsap.utils.clamp(-10, 10)

ScrollTrigger.create({
    scroller: VarConst.scrollContainer,
    trigger: VarConst.scrollContainer,
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
let lowestElapsedTime = 0
function raf() {
    if (VarLet.loadFinished) {
        const elapsedTime = clock.getElapsedTime()
        lowestElapsedTime += 0.0006
    
        if (icebergModel) {
            icebergModel.position.y = Math.sin(elapsedTime) * .15 + .85
            if (VarLet.isContactActive) {
                VarLet.currentRotate += .03 * Math.PI * -0.03
                if (VarLet.currentRotate < -Math.PI * 2) {
                    VarLet.currentRotate += Math.PI * 2
                }
                icebergModel.rotation.y = VarLet.currentRotate
            } else {
                if (!VarLet.isIcebergRotating) {
                    TweenLite.to(icebergModel.rotation, { y: rotationOnScrollValue + VarLet.posXNormalize * .1 })
                }
            }
        }
    
        if (music) {
            music.stereo = Math.sin(lowestElapsedTime) * .6
        }
    
        // Render
        renderer.render(mainScene, camera)
        rendererProject.render(projectScene, camera)
        // composer.render()
    
    
        if (audioSwitcher)
            audioSwitcher.animate(elapsedTime * .9)
    
        if (VarLet.enterProject)
            planeRectMaterial.uniforms.uProgress.value = elapsedTime * .5
    
        if (VarConst.mouse && !VarLet.enterProject) {
            if (!VarLet.enterProject) {
    
                TweenLite.to(pointLight.position, 1, { x: VarLet.planeX, y: VarLet.planeY, ease: Power4.easeOut })
                TweenLite.to(planeRectMesh.position, 1, { x: VarLet.planeX, y: VarLet.planeY, ease: Power4.easeOut })
                
                hoverPositionUpdate()
                
                VarLet.planeX = mapCursorXPlane(-1, 1, -viewSize().width / 2, viewSize().width / 2)
                VarLet.planeY = mapCursorYPlane(-1, 1, -viewSize().height / 2, viewSize().height / 2)
                
                VarConst.planePosition.x = VarLet.planeX
                VarConst.planePosition.y = VarLet.planeY
                
            } else {
                TweenLite.to(pointLight.position, 1, { x: VarLet.planeX, y: VarLet.planeY, ease: Power4.easeOut })
                hoverPositionUpdate()
                
                VarLet.planeX = mapCursorXPlane(-1, 1, -viewSize().width / 2, viewSize().width / 2)
                VarLet.planeY = mapCursorYPlane(-1, 1, -viewSize().height / 2, viewSize().height / 2)
                
                VarConst.planePosition.x = VarLet.planeX
                VarConst.planePosition.y = VarLet.planeY
            }
        }
    
    }
    window.requestAnimationFrame(raf)
}

raf()

ScrollTrigger.addEventListener("refresh", () => locoScroll.update())
ScrollTrigger.refresh()

console.log(`%c ${'there\'s nothing here go away 👀'}`, `color: ${VarConst.lightBlue}; font-weight: bold; font-size: 1rem;`)