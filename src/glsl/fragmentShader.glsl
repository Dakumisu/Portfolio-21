uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;

vec2 scaleImage(vec2 uv, float scale) {
  float center = .5;
  return ((uv - center) * scale) + center;
}

void main() {
  vec3 color = texture2D(uTexture, scaleImage(vUv, 1.)).rgb;
  gl_FragColor = vec4(color, uAlpha);
}