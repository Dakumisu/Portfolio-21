uniform vec2 uOffset;
uniform float uProgress;
uniform vec2 uFrequency;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
    position.x = position.x + (sin(uv.y * PI) * offset.x);
    position.y = position.y + (sin(uv.x * PI) * offset.y);
    return position;
}

void main() {
    vUv = uv + (uOffset * .1);

    vec4 wavePosition = modelMatrix * vec4(position, 1.);
    
    vec3 newPosition = position;
    
    newPosition = deformationCurve(position, uv, uOffset);

    newPosition.z += sin(wavePosition.x * uFrequency.x - uProgress) * .1;
    newPosition.z += sin(wavePosition.y * uFrequency.y - uProgress) * .1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
}