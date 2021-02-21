/*--------------------
Utils
--------------------*/
const lerp = (v0, v1, t) => (v0 * (1 - t) + v1 * t)
const deg = (a) => a * Math.PI / 180 


/*--------------------
AudioSwitcher
--------------------*/
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

    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.clientWidth
    this.height = this.canvas.clientHeight
    this.amp = 0
    this.h = 0
    this.devicePixelRatio = window.devicePixelRatio || 1
    this.canvas.width = this.width * this.devicePixelRatio
    this.canvas.height = this.height * this.devicePixelRatio
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
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

/*------------------------------
Init
------------------------------*/
const audioSwitcher = new AudioSwitcher({
  button: document.querySelector('.hud--sound--btn'),
  canvas: document.querySelector('#canvas-audio'),
  audio: document.querySelector('#audio'),
  color: '#29363C',
})


/*--------------------
Maybe external RaF
--------------------*/
const raf = () => {
  const time = performance.now() / 1000
  if (audioSwitcher) {
    audioSwitcher.animate(time)
  }
  requestAnimationFrame(raf)
}
raf()