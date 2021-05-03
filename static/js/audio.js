import { VarConst, VarLet } from './var.js'

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
            const x = (this.width / 2) - (this.settings.width / 2 * 0.5) + i * .8
            const t = (time * this.settings.speed) + (i * this.amp)
            const y = (this.height / 2) + (-Math.sin(t) * this.h)
            this.ctx.ellipse(x, y, .5, .5, VarConst.deg(360), 0, VarConst.deg(360))
            this.ctx.closePath()
            this.ctx.fill()
        }
    }

    animate(time) {
        let height = this.hover ? this.settings.hoverHeight : 0
        height = this.active ? this.settings.height : height
        this.h = VarConst.lerp(this.h, height, 0.04)

        let amplitude = this.hover ? this.settings.hoverAmplitude : 0
        amplitude = this.active ? this.settings.amplitude : amplitude
        this.amp = VarConst.lerp(this.amp, amplitude, 0.04)

        this.clear()
        this.draw(time)
    }
}

export { AudioSwitcher }