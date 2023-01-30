import React, { useState, useEffect } from "react";
import { gsap } from "gsap";

export default function Glass() {
  useEffect(() => {
    const webgl = new WebGLFrame();
    webgl.init("webgl-canvas");
    webgl.load().then(() => {
      webgl.setup();
      webgl.debugSetting();
      webgl.render();
    });
  },[]);
  class WebGLFrame {
    constructor() {
      this.canvas = null;
      this.gl = null;
      this.running = false;
      this.beginTime = 0;
      this.nowTime = 0;
      this.render = this.render.bind(this);

      this.camera = new InteractionCamera();
      this.mMatrix = MAT.identity(MAT.create());
      this.vMatrix = MAT.identity(MAT.create());
      this.pMatrix = MAT.identity(MAT.create());
      this.vpMatrix = MAT.identity(MAT.create());
      this.mvpMatrix = MAT.identity(MAT.create());

      // テクスチャのブレンド係数 @@@
      this.blendingRatio = { value: 0.0 };
    }
    /**
     * WebGL を実行するための初期化処理を行う。
     * @param {HTMLCanvasElement|string} canvas - canvas への参照か canvas の id 属性名のいずれか
     */
    init(canvas) {
      if (canvas instanceof HTMLCanvasElement === true) {
        this.canvas = canvas;
      } else if (Object.prototype.toString.call(canvas) === "[object String]") {
        const c = document.querySelector(`#${canvas}`);
        if (c instanceof HTMLCanvasElement === true) {
          this.canvas = c;
        }
      }
      if (this.canvas == null) {
        throw new Error("invalid argument");
      }
      this.gl = this.canvas.getContext("webgl");
      if (this.gl == null) {
        throw new Error("webgl not supported");
      }
    }
    /**
     * シェーダやテクスチャ用の画像など非同期で読み込みする処理を行う。
     * @return {Promise}
     */
    load() {
      // ロード完了後に必要となるプロパティを初期化
      this.program = null;
      this.attLocation = null;
      this.attStride = null;
      this.uniLocation = null;
      this.uniType = null;

      return new Promise((resolve) => {
        this.loadShader(["./vs3_1.vert", "./fs3_1.frag"])
          .then((shaders) => {
            const gl = this.gl;
            const vs = this.createShader(shaders[0], gl.VERTEX_SHADER);
            const fs = this.createShader(shaders[1], gl.FRAGMENT_SHADER);
            this.program = this.createProgram(vs, fs);
            // attribute 変数関係
            this.attLocation = [
              gl.getAttribLocation(this.program, "position"),
              gl.getAttribLocation(this.program, "color"),
              gl.getAttribLocation(this.program, "texCoord"),
            ];
            this.attStride = [3, 4, 2];
            // uniform 変数関係
            this.uniLocation = [
              gl.getUniformLocation(this.program, "mvpMatrix"),
              gl.getUniformLocation(this.program, "ratio"),
              gl.getUniformLocation(this.program, "textureUnit1"),
              gl.getUniformLocation(this.program, "textureUnit2"),
              gl.getUniformLocation(this.program, "disp"),
            ];
            this.uniType = [
              "uniformMatrix4fv",
              "uniform1f",
              "uniform1i",
              "uniform1i",
              "uniform1i",
            ];

            // テクスチャ用の素材１をロード
            return this.createTextureFromFile("./sample1.jpg");
          })
          .then((texture) => {
            // 直前でバインドするとして、いったんプロパティに入れておく
            this.texture1 = texture;
            // テクスチャ用の素材２をロード
            return this.createTextureFromFile("./sample2.jpg");
          })
          .then((texture) => {
            // 直前でバインドするとして、いったんプロパティに入れておく
            this.texture2 = texture;
            // テクスチャ用の素材３をロード @@@
            return this.createTextureFromFile("./displacement.jpg");
          })
          .then((texture) => {
            // 直前でバインドするとして、いったんプロパティに入れておく
            this.texture3 = texture;

            // load メソッドを解決
            resolve();
          });
      });
    }
    /**
     * WebGL のレンダリングを開始する前のセットアップを行う。
     */
    setup() {
      const gl = this.gl;

      // シンプルな XY 平面ジオメトリ
      this.position = [
        -1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
      ];
      this.color = [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0,
      ];
      // テクスチャ座標を定義
      this.texCoord = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
      this.indices = [0, 1, 2, 2, 1, 3];
      this.vbo = [
        this.createVbo(this.position),
        this.createVbo(this.color),
        this.createVbo(this.texCoord),
      ];
      // インデックスバッファ（IBO）を使う
      this.ibo = this.createIbo(this.indices);

      // 軸をラインで描画するための頂点を定義
      this.axisPosition = [
        0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
      ];
      this.axisColor = [
        0.5, 0.0, 0.0, 1.0, 1.0, 0.2, 0.0, 1.0, 0.0, 0.5, 0.0, 1.0, 0.0, 1.0,
        0.2, 1.0, 0.0, 0.0, 0.5, 1.0, 0.2, 0.0, 1.0, 1.0,
      ];
      this.axisTexCoord = [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ];
      this.axisVbo = [
        this.createVbo(this.axisPosition),
        this.createVbo(this.axisColor),
        this.createVbo(this.axisTexCoord),
      ];

      gl.clearColor(0.4, 0.4, 0.4, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);

      this.running = true;
      this.beginTime = Date.now();
    }
    /**
     * イベントやデバッグ用のセットアップを行う。
     */
    debugSetting() {
      // Esc キーで実行を止められるようにイベントを設定
      window.addEventListener(
        "keydown",
        (evt) => {
          this.running = evt.key !== "Escape";
        },
        false
      );

      // マウス関連イベントの登録
      this.camera.update();
      this.canvas.addEventListener("mousedown", this.camera.startEvent, false);
      this.canvas.addEventListener("mousemove", this.camera.moveEvent, false);
      this.canvas.addEventListener("mouseup", this.camera.endEvent, false);
      this.canvas.addEventListener("wheel", this.camera.wheelEvent, false);

      // tweakpane で GUI を生成する
      // const pane = new Tweakpane.Pane();
      // pane
      //   .addBlade({
      //     view: "slider",
      //     label: "ratio",
      //     min: 0.0,
      //     max: 1.0,
      //     value: this.blendingRatio.value,
      //   })
      //   .on("change", (v) => (this.blendingRatio.value = v.value));

      const tl = gsap.timeline({
        defaults: { duration: 3, ease: "Power4.easeInOut" },
        repeat: -1,
        yoyo: true,
      });
      tl.to(this.blendingRatio, {
        duration: 0,
        value: 0.0,
      }).to(this.blendingRatio, {
        value: 1.0,
      });
    }
    /**
     * WebGL を利用して描画を行う。
     */
    render() {
      const gl = this.gl;
      if (this.running === true) {
        requestAnimationFrame(this.render);
      }

      // 経過時間を取得
      this.nowTime = (Date.now() - this.beginTime) / 1000;
      // ウィンドウサイズぴったりに canvas のサイズを修正する
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // カメラ関連のパラメータを決める
      const cameraPosition = [0.0, 0.0, 3.0]; // カメラの座標
      const centerPoint = [0.0, 0.0, 0.0]; // カメラの注視点
      const cameraUpDirection = [0.0, 1.0, 0.0]; // カメラの上方向
      const fovy = 60 * this.camera.scale; // カメラの視野角
      const aspect = this.canvas.width / this.canvas.height; // カメラのアスペクト比
      const near = 0.1; // 最近距離クリップ面
      const far = 10.0; // 最遠距離クリップ面

      // ビュー・プロジェクション座標変換行列
      this.vMatrix = MAT.lookAt(cameraPosition, centerPoint, cameraUpDirection);
      this.pMatrix = MAT.perspective(fovy, aspect, near, far);
      this.vpMatrix = MAT.multiply(this.pMatrix, this.vMatrix);
      this.camera.update();
      let quaternionMatrix = MAT.identity(MAT.create());
      quaternionMatrix = QTN.toMatIV(this.camera.qtn, quaternionMatrix);
      this.vpMatrix = MAT.multiply(this.vpMatrix, quaternionMatrix);
      // モデル座標変換
      this.mMatrix = MAT.identity(this.mMatrix);
      this.mvpMatrix = MAT.multiply(this.vpMatrix, this.mMatrix);

      // どのプログラムオブジェクトを使うのかを明示する
      gl.useProgram(this.program);

      // 0 番目のユニットを指定してテクスチャ１をバインド
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture1);
      // 1 番目のユニットを指定してテクスチャ２をバインド
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.texture2);
      // 2 番目のユニットを指定してテクスチャ３をバインド @@@
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.texture3);

      // attribute と uniform を設定・更新し頂点をレンダリングする
      this.setAttribute(this.vbo, this.attLocation, this.attStride, this.ibo);
      this.setUniform(
        [
          this.mvpMatrix,
          this.blendingRatio.value,
          0, // それぞれのテクスチャユニットを指定
          1, // それぞれのテクスチャユニットを指定
          2, // それぞれのテクスチャユニットを指定
        ],
        this.uniLocation,
        this.uniType
      );
      gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

      // 以下は軸の描画 -------------------------------------------------------
      this.setAttribute(this.axisVbo, this.attLocation, this.attStride);
      this.setUniform(
        [this.vpMatrix, this.blendingRatio.value, 0, 1, 2],
        this.uniLocation,
        this.uniType
      );
      gl.drawArrays(gl.LINES, 0, this.axisPosition.length / 3);
    }

    // utility method =========================================================

    /**
     * シェーダのソースコードを外部ファイルから取得する。
     * @param {Array.<string>} pathArray - シェーダを記述したファイルのパス（の配列）
     * @return {Promise}
     */
    loadShader(pathArray) {
      if (Array.isArray(pathArray) !== true) {
        throw new Error("invalid argument");
      }
      const promises = pathArray.map((path) => {
        return fetch(path).then((response) => {
          return response.text();
        });
      });
      return Promise.all(promises);
    }

    /**
     * シェーダオブジェクトを生成して返す。
     * コンパイルに失敗した場合は理由をアラートし null を返す。
     * @param {string} source - シェーダのソースコード文字列
     * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @return {WebGLShader} シェーダオブジェクト
     */
    createShader(source, type) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
      } else {
        alert(gl.getShaderInfoLog(shader));
        return null;
      }
    }

    /**
     * プログラムオブジェクトを生成して返す。
     * シェーダのリンクに失敗した場合は理由をアラートし null を返す。
     * @param {WebGLShader} vs - 頂点シェーダオブジェクト
     * @param {WebGLShader} fs - フラグメントシェーダオブジェクト
     * @return {WebGLProgram} プログラムオブジェクト
     */
    createProgram(vs, fs) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        return program;
      } else {
        alert(gl.getProgramInfoLog(program));
        return null;
      }
    }

    /**
     * VBO を生成して返す。
     * @param {Array} data - 頂点属性データを格納した配列
     * @return {WebGLBuffer} VBO
     */
    createVbo(data) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      return vbo;
    }

    /**
     * IBO を生成して返す。
     * @param {Array} data - インデックスデータを格納した配列
     * @return {WebGLBuffer} IBO
     */
    createIbo(data) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      const ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Int16Array(data),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      return ibo;
    }

    /**
     * IBO を生成して返す。(INT 拡張版)
     * @param {Array} data - インデックスデータを格納した配列
     * @return {WebGLBuffer} IBO
     */
    createIboInt(data) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      if (ext == null || ext.elementIndexUint == null) {
        throw new Error("element index Uint not supported");
      }
      const ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(data),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      return ibo;
    }

    /**
     * 画像ファイルを読み込み、テクスチャを生成してコールバックで返却する。
     * @param {string} source - ソースとなる画像のパス
     * @return {Promise}
     */
    createTextureFromFile(source) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      return new Promise((resolve) => {
        const gl = this.gl;
        const img = new Image();
        img.addEventListener(
          "load",
          () => {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              img
            );
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_S,
              gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_T,
              gl.CLAMP_TO_EDGE
            );
            gl.bindTexture(gl.TEXTURE_2D, null);
            resolve(tex);
          },
          false
        );
        img.src = source;
      });
    }

    /**
     * フレームバッファを生成して返す。
     * @param {number} width - フレームバッファの幅
     * @param {number} height - フレームバッファの高さ
     * @return {object} 生成した各種オブジェクトはラップして返却する
     * @property {WebGLFramebuffer} framebuffer - フレームバッファ
     * @property {WebGLRenderbuffer} renderbuffer - 深度バッファとして設定したレンダーバッファ
     * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
     */
    createFramebuffer(width, height) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      const frameBuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
      const depthRenderBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        width,
        height
      );
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        depthRenderBuffer
      );
      const fTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, fTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        fTexture,
        0
      );
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return {
        framebuffer: frameBuffer,
        renderbuffer: depthRenderBuffer,
        texture: fTexture,
      };
    }

    /**
     * フレームバッファを生成して返す。（フロートテクスチャ版）
     * @param {object} ext - getWebGLExtensions の戻り値
     * @param {number} width - フレームバッファの幅
     * @param {number} height - フレームバッファの高さ
     * @return {object} 生成した各種オブジェクトはラップして返却する
     * @property {WebGLFramebuffer} framebuffer - フレームバッファ
     * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
     */
    createFramebufferFloat(ext, width, height) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      if (
        ext == null ||
        (ext.textureFloat == null && ext.textureHalfFloat == null)
      ) {
        throw new Error("float texture not supported");
      }
      const flg =
        ext.textureFloat != null
          ? gl.FLOAT
          : ext.textureHalfFloat.HALF_FLOAT_OES;
      const frameBuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
      const fTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, fTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        flg,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        fTexture,
        0
      );
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { framebuffer: frameBuffer, texture: fTexture };
    }

    /**
     * VBO を IBO をバインドし有効化する。
     * @param {Array} vbo - VBO を格納した配列
     * @param {Array} attL - attribute location を格納した配列
     * @param {Array} attS - attribute stride を格納した配列
     * @param {WebGLBuffer} ibo - IBO
     */
    setAttribute(vbo, attL, attS, ibo) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      vbo.forEach((v, index) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, v);
        gl.enableVertexAttribArray(attL[index]);
        gl.vertexAttribPointer(attL[index], attS[index], gl.FLOAT, false, 0, 0);
      });
      if (ibo != null) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      }
    }

    /**
     * uniform 変数をまとめてシェーダに送る。
     * @param {Array} value - 各変数の値
     * @param {Array} uniL - uniform location を格納した配列
     * @param {Array} uniT - uniform 変数のタイプを格納した配列
     */
    setUniform(value, uniL, uniT) {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      value.forEach((v, index) => {
        const type = uniT[index];
        if (type.includes("Matrix") === true) {
          gl[type](uniL[index], false, v);
        } else {
          gl[type](uniL[index], v);
        }
      });
    }

    /**
     * 主要な WebGL の拡張機能を取得する。
     * @return {object} 取得した拡張機能
     * @property {object} elementIndexUint - Uint32 フォーマットを利用できるようにする
     * @property {object} textureFloat - フロートテクスチャを利用できるようにする
     * @property {object} textureHalfFloat - ハーフフロートテクスチャを利用できるようにする
     */
    getWebGLExtensions() {
      if (this.gl == null) {
        throw new Error("webgl not initialized");
      }
      const gl = this.gl;
      return {
        elementIndexUint: gl.getExtension("OES_element_index_uint"),
        textureFloat: gl.getExtension("OES_texture_float"),
        textureHalfFloat: gl.getExtension("OES_texture_half_float"),
      };
    }
  }

  /**
   * マウスでドラッグ操作を行うための簡易な実装例
   * @class
   */
  class InteractionCamera {
    /**
     * @constructor
     */
    constructor() {
      this.qtn = QTN.identity(QTN.create());
      this.dragging = false;
      this.prevMouse = [0, 0];
      this.rotationScale = Math.min(window.innerWidth, window.innerHeight);
      this.rotation = 0.0;
      this.rotateAxis = [0.0, 0.0, 0.0];
      this.rotatePower = 2.0;
      this.rotateAttenuation = 0.9;
      this.scale = 1.25;
      this.scalePower = 0.0;
      this.scaleAttenuation = 0.8;
      this.scaleMin = 0.25;
      this.scaleMax = 2.0;
      this.startEvent = this.startEvent.bind(this);
      this.moveEvent = this.moveEvent.bind(this);
      this.endEvent = this.endEvent.bind(this);
      this.wheelEvent = this.wheelEvent.bind(this);
    }
    /**
     * mouse down event
     * @param {Event} eve - event object
     */
    startEvent(eve) {
      this.dragging = true;
      this.prevMouse = [eve.clientX, eve.clientY];
    }
    /**
     * mouse move event
     * @param {Event} eve - event object
     */
    moveEvent(eve) {
      if (this.dragging !== true) {
        return;
      }
      const x = this.prevMouse[0] - eve.clientX;
      const y = this.prevMouse[1] - eve.clientY;
      this.rotation =
        (Math.sqrt(x * x + y * y) / this.rotationScale) * this.rotatePower;
      this.rotateAxis[0] = y;
      this.rotateAxis[1] = x;
      this.prevMouse = [eve.clientX, eve.clientY];
    }
    /**
     * mouse up event
     */
    endEvent() {
      this.dragging = false;
    }
    /**
     * wheel event
     * @param {Event} eve - event object
     */
    wheelEvent(eve) {
      const w = eve.wheelDelta;
      const s = this.scaleMin * 0.1;
      if (w > 0) {
        this.scalePower = -s;
      } else if (w < 0) {
        this.scalePower = s;
      }
    }

    /**
     * quaternion update
     */
    update() {
      this.scalePower *= this.scaleAttenuation;
      this.scale = Math.max(
        this.scaleMin,
        Math.min(this.scaleMax, this.scale + this.scalePower)
      );
      if (this.rotation === 0.0) {
        return;
      }
      this.rotation *= this.rotateAttenuation;
      const q = QTN.identity(QTN.create());
      QTN.rotate(this.rotation, this.rotateAxis, q);
      QTN.multiply(this.qtn, q, this.qtn);
    }
  }

  const MAT = new matIV();
  const QTN = new qtnIV();

  function matIV() {
    this.create = function () {
      return new Float32Array(16);
    };
    this.identity = function (dest) {
      dest[0] = 1;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 1;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = 1;
      dest[11] = 0;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
      return dest;
    };
    this.multiply = function (mat1, mat2, dest) {
      if (dest == null) {
        dest = this.create();
      }
      var a = mat1[0],
        b = mat1[1],
        c = mat1[2],
        d = mat1[3],
        e = mat1[4],
        f = mat1[5],
        g = mat1[6],
        h = mat1[7],
        i = mat1[8],
        j = mat1[9],
        k = mat1[10],
        l = mat1[11],
        m = mat1[12],
        n = mat1[13],
        o = mat1[14],
        p = mat1[15],
        A = mat2[0],
        B = mat2[1],
        C = mat2[2],
        D = mat2[3],
        E = mat2[4],
        F = mat2[5],
        G = mat2[6],
        H = mat2[7],
        I = mat2[8],
        J = mat2[9],
        K = mat2[10],
        L = mat2[11],
        M = mat2[12],
        N = mat2[13],
        O = mat2[14],
        P = mat2[15];
      dest[0] = A * a + B * e + C * i + D * m;
      dest[1] = A * b + B * f + C * j + D * n;
      dest[2] = A * c + B * g + C * k + D * o;
      dest[3] = A * d + B * h + C * l + D * p;
      dest[4] = E * a + F * e + G * i + H * m;
      dest[5] = E * b + F * f + G * j + H * n;
      dest[6] = E * c + F * g + G * k + H * o;
      dest[7] = E * d + F * h + G * l + H * p;
      dest[8] = I * a + J * e + K * i + L * m;
      dest[9] = I * b + J * f + K * j + L * n;
      dest[10] = I * c + J * g + K * k + L * o;
      dest[11] = I * d + J * h + K * l + L * p;
      dest[12] = M * a + N * e + O * i + P * m;
      dest[13] = M * b + N * f + O * j + P * n;
      dest[14] = M * c + N * g + O * k + P * o;
      dest[15] = M * d + N * h + O * l + P * p;
      return dest;
    };
    this.scale = function (mat, vec, dest) {
      dest[0] = mat[0] * vec[0];
      dest[1] = mat[1] * vec[0];
      dest[2] = mat[2] * vec[0];
      dest[3] = mat[3] * vec[0];
      dest[4] = mat[4] * vec[1];
      dest[5] = mat[5] * vec[1];
      dest[6] = mat[6] * vec[1];
      dest[7] = mat[7] * vec[1];
      dest[8] = mat[8] * vec[2];
      dest[9] = mat[9] * vec[2];
      dest[10] = mat[10] * vec[2];
      dest[11] = mat[11] * vec[2];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
      return dest;
    };
    this.translate = function (mat, vec, dest) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
      dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
      dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
      dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
      return dest;
    };
    this.rotate = function (mat, angle, axis, dest) {
      var sq = Math.sqrt(
        axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]
      );
      if (!sq) {
        return null;
      }
      var a = axis[0],
        b = axis[1],
        c = axis[2];
      if (sq != 1) {
        sq = 1 / sq;
        a *= sq;
        b *= sq;
        c *= sq;
      }
      var d = Math.sin(angle),
        e = Math.cos(angle),
        f = 1 - e,
        g = mat[0],
        h = mat[1],
        i = mat[2],
        j = mat[3],
        k = mat[4],
        l = mat[5],
        m = mat[6],
        n = mat[7],
        o = mat[8],
        p = mat[9],
        q = mat[10],
        r = mat[11],
        s = a * a * f + e,
        t = b * a * f + c * d,
        u = c * a * f - b * d,
        v = a * b * f - c * d,
        w = b * b * f + e,
        x = c * b * f + a * d,
        y = a * c * f + b * d,
        z = b * c * f - a * d,
        A = c * c * f + e;
      if (angle) {
        if (mat != dest) {
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
        }
      } else {
        dest = mat;
      }
      dest[0] = g * s + k * t + o * u;
      dest[1] = h * s + l * t + p * u;
      dest[2] = i * s + m * t + q * u;
      dest[3] = j * s + n * t + r * u;
      dest[4] = g * v + k * w + o * x;
      dest[5] = h * v + l * w + p * x;
      dest[6] = i * v + m * w + q * x;
      dest[7] = j * v + n * w + r * x;
      dest[8] = g * y + k * z + o * A;
      dest[9] = h * y + l * z + p * A;
      dest[10] = i * y + m * z + q * A;
      dest[11] = j * y + n * z + r * A;
      return dest;
    };
    this.lookAt = function (eye, center, up, dest) {
      if (dest == null) {
        dest = this.create();
      }
      var eyeX = eye[0],
        eyeY = eye[1],
        eyeZ = eye[2],
        upX = up[0],
        upY = up[1],
        upZ = up[2],
        centerX = center[0],
        centerY = center[1],
        centerZ = center[2];
      if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
        return this.identity(dest);
      }
      var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
      z0 = eyeX - center[0];
      z1 = eyeY - center[1];
      z2 = eyeZ - center[2];
      l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
      z0 *= l;
      z1 *= l;
      z2 *= l;
      x0 = upY * z2 - upZ * z1;
      x1 = upZ * z0 - upX * z2;
      x2 = upX * z1 - upY * z0;
      l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
      if (!l) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
      } else {
        l = 1 / l;
        x0 *= l;
        x1 *= l;
        x2 *= l;
      }
      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;
      l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
      if (!l) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
      } else {
        l = 1 / l;
        y0 *= l;
        y1 *= l;
        y2 *= l;
      }
      dest[0] = x0;
      dest[1] = y0;
      dest[2] = z0;
      dest[3] = 0;
      dest[4] = x1;
      dest[5] = y1;
      dest[6] = z1;
      dest[7] = 0;
      dest[8] = x2;
      dest[9] = y2;
      dest[10] = z2;
      dest[11] = 0;
      dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
      dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
      dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
      dest[15] = 1;
      return dest;
    };
    this.perspective = function (fovy, aspect, near, far, dest) {
      if (dest == null) {
        dest = this.create();
      }
      var r = 1 / Math.tan((fovy * Math.PI) / 360);
      var d = far - near;
      dest[0] = r / aspect;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = r;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = -(far + near) / d;
      dest[11] = -1;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = -(far * near * 2) / d;
      dest[15] = 0;
      return dest;
    };
    this.ortho = function (left, right, top, bottom, near, far, dest) {
      if (dest == null) {
        dest = this.create();
      }
      var h = right - left;
      var v = top - bottom;
      var d = far - near;
      dest[0] = 2 / h;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 2 / v;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = -2 / d;
      dest[11] = 0;
      dest[12] = -(left + right) / h;
      dest[13] = -(top + bottom) / v;
      dest[14] = -(far + near) / d;
      dest[15] = 1;
      return dest;
    };
    this.transpose = function (mat, dest) {
      if (dest == null) {
        dest = this.create();
      }
      dest[0] = mat[0];
      dest[1] = mat[4];
      dest[2] = mat[8];
      dest[3] = mat[12];
      dest[4] = mat[1];
      dest[5] = mat[5];
      dest[6] = mat[9];
      dest[7] = mat[13];
      dest[8] = mat[2];
      dest[9] = mat[6];
      dest[10] = mat[10];
      dest[11] = mat[14];
      dest[12] = mat[3];
      dest[13] = mat[7];
      dest[14] = mat[11];
      dest[15] = mat[15];
      return dest;
    };
    this.inverse = function (mat, dest) {
      if (dest == null) {
        dest = this.create();
      }
      var a = mat[0],
        b = mat[1],
        c = mat[2],
        d = mat[3],
        e = mat[4],
        f = mat[5],
        g = mat[6],
        h = mat[7],
        i = mat[8],
        j = mat[9],
        k = mat[10],
        l = mat[11],
        m = mat[12],
        n = mat[13],
        o = mat[14],
        p = mat[15],
        q = a * f - b * e,
        r = a * g - c * e,
        s = a * h - d * e,
        t = b * g - c * f,
        u = b * h - d * f,
        v = c * h - d * g,
        w = i * n - j * m,
        x = i * o - k * m,
        y = i * p - l * m,
        z = j * o - k * n,
        A = j * p - l * n,
        B = k * p - l * o,
        ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
      dest[0] = (f * B - g * A + h * z) * ivd;
      dest[1] = (-b * B + c * A - d * z) * ivd;
      dest[2] = (n * v - o * u + p * t) * ivd;
      dest[3] = (-j * v + k * u - l * t) * ivd;
      dest[4] = (-e * B + g * y - h * x) * ivd;
      dest[5] = (a * B - c * y + d * x) * ivd;
      dest[6] = (-m * v + o * s - p * r) * ivd;
      dest[7] = (i * v - k * s + l * r) * ivd;
      dest[8] = (e * A - f * y + h * w) * ivd;
      dest[9] = (-a * A + b * y - d * w) * ivd;
      dest[10] = (m * u - n * s + p * q) * ivd;
      dest[11] = (-i * u + j * s - l * q) * ivd;
      dest[12] = (-e * z + f * x - g * w) * ivd;
      dest[13] = (a * z - b * x + c * w) * ivd;
      dest[14] = (-m * t + n * r - o * q) * ivd;
      dest[15] = (i * t - j * r + k * q) * ivd;
      return dest;
    };
  }

  function qtnIV() {
    this.create = function () {
      return new Float32Array(4);
    };
    this.identity = function (dest) {
      dest[0] = 0;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 1;
      return dest;
    };
    this.inverse = function (qtn, dest) {
      if (dest == null) {
        dest = this.create();
      }
      dest[0] = -qtn[0];
      dest[1] = -qtn[1];
      dest[2] = -qtn[2];
      dest[3] = qtn[3];
      return dest;
    };
    this.normalize = function (dest) {
      var x = dest[0],
        y = dest[1],
        z = dest[2],
        w = dest[3];
      var l = Math.sqrt(x * x + y * y + z * z + w * w);
      if (l === 0) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
      } else {
        l = 1 / l;
        dest[0] = x * l;
        dest[1] = y * l;
        dest[2] = z * l;
        dest[3] = w * l;
      }
      return dest;
    };
    this.multiply = function (qtn1, qtn2, dest) {
      if (dest == null) {
        dest = this.create();
      }
      var ax = qtn1[0],
        ay = qtn1[1],
        az = qtn1[2],
        aw = qtn1[3];
      var bx = qtn2[0],
        by = qtn2[1],
        bz = qtn2[2],
        bw = qtn2[3];
      dest[0] = ax * bw + aw * bx + ay * bz - az * by;
      dest[1] = ay * bw + aw * by + az * bx - ax * bz;
      dest[2] = az * bw + aw * bz + ax * by - ay * bx;
      dest[3] = aw * bw - ax * bx - ay * by - az * bz;
      return dest;
    };
    this.rotate = function (angle, axis, dest) {
      var sq = Math.sqrt(
        axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]
      );
      if (!sq) {
        return null;
      }
      var a = axis[0],
        b = axis[1],
        c = axis[2];
      if (sq != 1) {
        sq = 1 / sq;
        a *= sq;
        b *= sq;
        c *= sq;
      }
      var s = Math.sin(angle * 0.5);
      dest[0] = a * s;
      dest[1] = b * s;
      dest[2] = c * s;
      dest[3] = Math.cos(angle * 0.5);
      return dest;
    };
    this.toVecIII = function (vec, qtn, dest) {
      if (dest == null) {
        dest = this.create();
      }
      var qp = this.create();
      var qq = this.create();
      var qr = this.create();
      this.inverse(qtn, qr);
      qp[0] = vec[0];
      qp[1] = vec[1];
      qp[2] = vec[2];
      this.multiply(qr, qp, qq);
      this.multiply(qq, qtn, qr);
      dest[0] = qr[0];
      dest[1] = qr[1];
      dest[2] = qr[2];
      return dest;
    };
    this.toMatIV = function (qtn, dest) {
      var x = qtn[0],
        y = qtn[1],
        z = qtn[2],
        w = qtn[3];
      var x2 = x + x,
        y2 = y + y,
        z2 = z + z;
      var xx = x * x2,
        xy = x * y2,
        xz = x * z2;
      var yy = y * y2,
        yz = y * z2,
        zz = z * z2;
      var wx = w * x2,
        wy = w * y2,
        wz = w * z2;
      dest[0] = 1 - (yy + zz);
      dest[1] = xy - wz;
      dest[2] = xz + wy;
      dest[3] = 0;
      dest[4] = xy + wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz - wx;
      dest[7] = 0;
      dest[8] = xz - wy;
      dest[9] = yz + wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
      return dest;
    };
    this.slerp = function (qtn1, qtn2, time, dest) {
      var ht =
        qtn1[0] * qtn2[0] +
        qtn1[1] * qtn2[1] +
        qtn1[2] * qtn2[2] +
        qtn1[3] * qtn2[3];
      var hs = 1.0 - ht * ht;
      if (hs <= 0.0) {
        dest[0] = qtn1[0];
        dest[1] = qtn1[1];
        dest[2] = qtn1[2];
        dest[3] = qtn1[3];
      } else {
        hs = Math.sqrt(hs);
        if (Math.abs(hs) < 0.0001) {
          dest[0] = qtn1[0] * 0.5 + qtn2[0] * 0.5;
          dest[1] = qtn1[1] * 0.5 + qtn2[1] * 0.5;
          dest[2] = qtn1[2] * 0.5 + qtn2[2] * 0.5;
          dest[3] = qtn1[3] * 0.5 + qtn2[3] * 0.5;
        } else {
          var ph = Math.acos(ht);
          var pt = ph * time;
          var t0 = Math.sin(ph - pt) / hs;
          var t1 = Math.sin(pt) / hs;
          dest[0] = qtn1[0] * t0 + qtn2[0] * t1;
          dest[1] = qtn1[1] * t0 + qtn2[1] * t1;
          dest[2] = qtn1[2] * t0 + qtn2[2] * t1;
          dest[3] = qtn1[3] * t0 + qtn2[3] * t1;
        }
      }
      return dest;
    };
  }

  return (
    <>
      <canvas id="webgl-canvas"></canvas>
    </>
  );
}
