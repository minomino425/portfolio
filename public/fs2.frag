precision mediump float;
uniform sampler2D textureUnit;
uniform float noiseStrength; // ノイズが可視化される強さ
uniform float noiseScale;    // ノイズに掛かるスケール
uniform float time;          // 時間の経過
uniform vec2 mouse;
uniform vec2 resolution;    // 解像度
varying vec4 vColor;
varying vec2 vTexCoord;

const int OCT = 8;         // オクターブ
const float PST = 0.5;       // パーセンテージ
const float PI = 3.1415926; // 円周率

//	<https://www.shadertoy.com/view/4dS3Wd>
//	By Morgan McGuire @morgan3d, http://graphicscodex.com
//
float hash(float n) {
  return fract(sin(n) * 1e4);
}
float hash(vec2 p) {
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float noise(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);

	// Four corners in 2D of a tile
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  float r = noise(gl_FragCoord.st * noiseScale + (time * 0.5 + 0.5) * 10.0);
  float g = noise(gl_FragCoord.st * noiseScale + (time * 0.5 + 0.5) * 20.0);
  float b = noise(gl_FragCoord.st * noiseScale + (time * 0.5 + 1.) * 30.0);
  // ノイズの強さに応じて値を調整
  r = 1.0 - r * noiseStrength;
  g = 1.0 - g * noiseStrength;
  b = 1.0 - b * noiseStrength;

  // ノイズを乗算して出力
  gl_FragColor = vec4((vec3(r, g, b) * 0.75 + 0.25) * vec3(1.5 * (abs(sin(time * 0.5 + 0.5)) * 0.5 + 0.25), 0.8, 0.8)+ vec3(mouse * 0.1, 0.0), 1.0);
}
