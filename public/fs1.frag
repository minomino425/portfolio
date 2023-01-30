precision mediump float;
uniform vec2 resolution;
uniform float u_time;
uniform vec2 mouse;

//ノイズ関数
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  //vec2(0.0, 0.0) ~ vec2(1.0, 1.0)までに正規化
  vec2 st = gl_FragCoord.xy / resolution.xy;
  //値を大きくすると低解像度のノイズになる
  float fr = 40.;

  //ノイズ1つの大きさ
  st *= resolution.xy / fr;
  vec2 ipos = floor(st);
  
  //abs()は絶対値を返すので正になる
  vec3 color = vec3(abs(sin(u_time * 2.4 * random(ipos))) * 2., 0.8, 0.98);

  gl_FragColor = vec4(color + vec3(mouse.x,0.0,1.0), 1.0);
}