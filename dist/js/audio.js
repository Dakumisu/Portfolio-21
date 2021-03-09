const lerp=(t,i,e)=>t*(1-e)+i*e,deg=t=>t*Math.PI/180;class AudioSwitcher{constructor(t){Object.assign(this,t),this.active=!1,this.hover=!1,this.volume=0,this.settings={width:60,height:7,amplitude:-.18,hoverHeight:1.5,hoverAmplitude:-.1,speed:3.5},this.init()}init(){this.button.addEventListener("click",(()=>{this.active=!this.active,this.button.classList.toggle("active");const t=this.active?"play":"pause";this.audio[t](),this.hover=!1})),this.button.addEventListener("mouseenter",(()=>{this.hover=!0})),this.button.addEventListener("mouseleave",(()=>{this.hover=!1})),window.addEventListener("blur",(()=>{this.audio.muted=!0})),window.addEventListener("focus",(()=>{this.audio.muted=!1})),this.ctx=this.canvas.getContext("2d"),this.width=this.canvas.clientWidth,this.height=this.canvas.clientHeight,this.amp=0,this.h=0,this.devicePixelRatio=window.devicePixelRatio||1,this.canvas.width=this.width*this.devicePixelRatio,this.canvas.height=this.height*this.devicePixelRatio,this.canvas.style.width=`${this.width}px`,this.canvas.style.height=`${this.height}px`,this.ctx.scale(this.devicePixelRatio,this.devicePixelRatio)}clear(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}draw(t){this.ctx.fillStyle=this.color;for(let i=0;i<this.settings.width;i++){this.ctx.beginPath();const e=this.width/2-this.settings.width/2*.5+.6*i,s=t*this.settings.speed+i*this.amp,h=this.height/2+-Math.cos(s)*this.h;this.ctx.ellipse(e,h,.5,.5,deg(360),0,deg(360)),this.ctx.closePath(),this.ctx.fill()}}animate(t){let i=this.hover?this.settings.hoverHeight:0;i=this.active?this.settings.height:i,this.h=lerp(this.h,i,.04);let e=this.hover?this.settings.hoverAmplitude:0;e=this.active?this.settings.amplitude:e,this.amp=lerp(this.amp,e,.04);const s=this.active?1:0;this.volume=lerp(this.volume,s,.04),this.audio.volume=this.volume,this.clear(),this.draw(t)}}const audioSwitcher=new AudioSwitcher({button:document.querySelector(".hud--sound--btn"),canvas:document.querySelector("#canvas-audio"),audio:document.querySelector("#audio"),color:"#29363C"}),raf=()=>{const t=performance.now()/1e3;audioSwitcher&&audioSwitcher.animate(t),requestAnimationFrame(raf)};raf();