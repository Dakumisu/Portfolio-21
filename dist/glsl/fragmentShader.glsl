uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uDisp;
uniform float uAlpha;
uniform vec2 uOffset;
uniform float uDispFactor;

varying vec2 vUv;

vec2 scaleImage(vec2 uv, float scale) {
  float center = .5;
  return ((uv - center) * scale) + center;
}

void main() {
  // vec3 color = vec3(0., 0., 0.);
  vec4 disp = texture2D(uDisp, vUv);

  vec2 distortedPosition1 = vec2(vUv.x + uDispFactor * (disp.r), vUv.y);
  vec2 distortedPosition2 = vec2(vUv.x - (1. -uDispFactor) * (disp.r), vUv.y);

  vec4 texture1 = texture2D(uTexture1, distortedPosition1);
  vec4 texture2 = texture2D(uTexture2, distortedPosition2);
  
  vec4 finalTexture = mix(texture1, texture2, uDispFactor);

  // color = texture2D(uTexture1, scaleImage(vUv, 1.)).rgb;
  
  finalTexture.a = uAlpha;

  gl_FragColor = finalTexture;
}