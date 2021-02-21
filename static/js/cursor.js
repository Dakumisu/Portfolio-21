let clientX = -100
let clientY = -100
const innerCursor = document.querySelector(".cursor--small")


document.addEventListener("mousemove", e => {
    clientX = e.clientX
    clientY = e.clientY
})

const render = () => {
    TweenMax.set(innerCursor, {
      x: clientX,
      y: clientY
    })

    requestAnimationFrame(render)
}
requestAnimationFrame(render)


let lastX = 0
let lastY = 0
let isStuck = false
let showCursor = false
let group, stuckX, stuckY, fillOuterCursor

const canvas = document.querySelector(".cursor--canvas")
const shapeBounds = {
    width: 75,
    height: 75
}
paper.setup(canvas)
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
polygon.fillColor = fillColor
polygon.fillColor.alpha = 1
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
    gsap.to(polygon.fillColor, .5, { alpha: 0 })
    console.log(polygon.strokeColor.alpha)

}

const handleMouseLeave = () => {
    isStuck = false
    // gsap.to(polygon.strokeColor, .5, { alpha: 0 })
    gsap.to(polygon.fillColor, .5, { alpha: 1 })
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
        polygon.scale(1.07)
    } 
    else if (!isStuck && polygon.bounds.width > 30) {
        if (isNoisy) {
            polygon.segments.forEach((segment, i) => {
                segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1])
            })
            isNoisy = false
            bigCoordinates = []
        }
        // const scaleDown = 1
        // polygon.scale(scaleDown)
    }

    // if (isStuck && polygon.bounds.width >= shapeBounds.width) {
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
    // } 
    polygon.smooth()
}

// ScrollTrigger.create({
//     trigger: projectsContainer,
//     scroller: scrollContainer,
//     start: "30% bottom", 
//     scrub: true,
//     onUpdate: self => {
//         console.log("progress:", self.progress.toFixed(3))
//     },
//     onToggle: self => {
//         console.log(self.isActive)
//         if (self.isActive) {
//             gsap.to(polygon, .5, { strokeColor: lightBlue })
//         } else {
//             gsap.to(polygon, .5, { strokeColor: darkerBlue })
//         }
//     },
// })
