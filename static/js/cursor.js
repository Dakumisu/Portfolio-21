import { VarConst, VarLet } from './var.js'
import { paper } from 'paper'
// import { SimplexNoise } from 'simplex-noise'
var SimplexNoise = require('simplex-noise')

let lastX = 0
let lastY = 0
let initalScale = 50
let isStuck = false
let group, stuckX, stuckY

const shapeBounds = {
   width: 75,
   height: 75
}

paper.setup(VarConst.cursorCanvas)
const strokeColor = VarConst.lightBlue
const strokeWidth = .5
const segments = 8
const radius = 50

const noiseScale = 150 // speed
const noiseRange = 4 // range of distortion

const polygon = new paper.Path.RegularPolygon(
   new paper.Point(0, 0),
   segments,
   radius
)

polygon.strokeColor = strokeColor
polygon.strokeWidth = strokeWidth
polygon.smooth()
group = new paper.Group([polygon])
group.applyMatrix = false

const noiseObjects = polygon.segments.map(() => new SimplexNoise())
let bigCoordinates = []

VarConst.noLinkItems.forEach(e => {
   e.addEventListener("mouseenter", noHandleMouseEnter)
   e.addEventListener("mouseleave", noHandleMouseLeave)
})

VarConst.innerLinkItems.forEach(e => {
   e.addEventListener("mouseenter", innerHandleMouseEnter)
   e.addEventListener("mouseleave", innerHandleMouseLeave)
})

document.querySelector('.about--img').addEventListener("mouseenter", imageHandleMouseEnter)
document.querySelector('.about--img').addEventListener("mouseleave", imageHandleMouseLeave)

// document.querySelector('.webgl').addEventListener("mouseenter", imageHandleMouseEnter)
// document.querySelector('.webgl').addEventListener("mouseleave", imageHandleMouseLeave)

VarConst.outerLinkItems.forEach(e => {
   e.addEventListener("mouseenter", outerHandleMouseEnter)
   e.addEventListener("mouseleave", outerHandleMouseLeave)
})

function noHandleMouseEnter() {
   TweenMax.to(VarConst.innerCursor, .75, {
      opacity: 0,
      ease: Expo.easeOut
   })
   gsap.to(polygon.strokeColor, .75, {
      alpha: 0,
      ease: Expo.easeOut
   })
}

function noHandleMouseLeave() {
   TweenMax.to(VarConst.innerCursor, .75, {
      opacity: 1,
      ease: Expo.easeOut
   })
   gsap.to(polygon.strokeColor, .75, {
      alpha: 1,
      ease: Expo.easeOut
   })
}

function innerHandleMouseEnter() {
   TweenMax.to(VarConst.innerCursor, .75, {
      padding: 25,
      backgroundColor: VarConst.lightBlue,
      ease: Expo.easeOut
   })
   gsap.to(polygon.strokeColor, .75, {
      alpha: 0,
      ease: Expo.easeOut
   })
}

function innerHandleMouseLeave() {
   TweenMax.to(VarConst.innerCursor, .75, {
      padding: 5,
      backgroundColor: 'transparent',
      ease: Expo.easeOut
   })
   gsap.to(polygon.strokeColor, .75, {
      alpha: 1,
      ease: Expo.easeOut
   })
}

function imageHandleMouseEnter() {
   TweenMax.to(VarConst.innerCursor, .75, {
      padding: 50,
      backgroundColor: VarConst.lightBlue,
      ease: Expo.easeOut
   })
   gsap.to(polygon.strokeColor, .75, {
      alpha: 0,
      ease: Expo.easeOut
   })
}

function imageHandleMouseLeave() {
   TweenMax.to(VarConst.innerCursor, .75, {
      padding: 5,
      backgroundColor: 'transparent',
      ease: Expo.easeOut
   })
   gsap.to(polygon.strokeColor, .75, {
      alpha: 1,
      ease: Expo.easeOut
   })
}

function outerHandleMouseEnter(e) {
   const navItem = e.currentTarget
   const navItemBox = navItem.getBoundingClientRect()
   stuckX = Math.round(navItemBox.left + navItemBox.width / 2)
   stuckY = Math.round(navItemBox.top + navItemBox.height / 2)
   isStuck = true
   TweenMax.to(VarConst.innerCursor, .75, {
      padding: 0,
      opacity: 0,
      ease: Expo.easeOut
   })
}

function outerHandleMouseLeave() {
   isStuck = false
   TweenMax.to(VarConst.innerCursor, .75, {
      padding: 5,
      opacity: 1,
      ease: Expo.easeOut
   })
}

paper.view.onFrame = event => {
   if (!isStuck) {
      lastX = VarConst.lerp(lastX, VarLet.mouseX, 0.12)
      lastY = VarConst.lerp(lastY, VarLet.mouseY, 0.12)
      group.position = new paper.Point(lastX, lastY)
      
      if (bigCoordinates.length === 0) {
         polygon.segments.forEach((segment, i) => {
            bigCoordinates[i] = [segment.point.x, segment.point.y]
         })
      } else {
         polygon.segments.forEach((segment, i) => {
            segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1])
         })
         bigCoordinates = []
      }
      if (polygon.bounds.width >= initalScale) {
         polygon.scale(.97)
      }
   } else if (isStuck) {
      lastX = VarConst.lerp(lastX, stuckX, 0.12)
      lastY = VarConst.lerp(lastY, stuckY, 0.12)
      group.position = new paper.Point(lastX, lastY)

      polygon.segments.forEach((segment, i) => {
         segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1])
      })
      bigCoordinates = []
      if (polygon.bounds.width <= shapeBounds.width) {
         polygon.scale(1.05)
      }
   }

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

      const distortionX = VarConst.map(noiseX, -1, 1, -noiseRange, noiseRange)
      const distortionY = VarConst.map(noiseY, -1, 1, -noiseRange, noiseRange)

      const newX = bigCoordinates[i][0] + distortionX
      const newY = bigCoordinates[i][1] + distortionY

      segment.point.set(newX, newY)
   })

   polygon.smooth()
}

export { polygon, outerHandleMouseLeave, imageHandleMouseEnter, imageHandleMouseLeave }