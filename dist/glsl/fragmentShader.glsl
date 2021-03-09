uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uDisp;
uniform float uAlpha;
uniform vec2 uOffset;
uniform float uDispFactor;

varying vec2 vUv;

void main() {
  vec4 disp = texture2D(uDisp, vUv);

  vec2 distortedPosition1 = vec2(vUv.x + uDispFactor * (disp.r), vUv.y);
  vec2 distortedPosition2 = vec2(vUv.x - (1. -uDispFactor) * (disp.r), vUv.y);

  vec4 texture1 = texture2D(uTexture1, distortedPosition1);
  vec4 texture2 = texture2D(uTexture2, distortedPosition2);
  
  vec4 finalTexture = mix(texture1, texture2, uDispFactor);
  
  finalTexture.a = uAlpha;

  gl_FragColor = finalTexture;
}