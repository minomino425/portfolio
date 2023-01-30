/**
 * 頂点シェーダのソースコードです。
 * ここではまず、最初に attribute 変数が宣言されています。
 * データ型は vec3 で、その変数の名前は position となっています。
 * この position には、JavaScript 側で VBO を生成し、バインドしたデータが転送さ
 * れてきます。
 */
precision mediump float;
attribute vec3 position;

void main() {
  gl_Position = vec4(position, 1.0);
  gl_PointSize = 64.;
}
