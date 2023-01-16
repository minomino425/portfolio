// 必要なモジュールを読み込み
import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Morph() {
  useEffect(() => {
    const app = new App3();
    app.init();
    app.animate();
    app.render();
  });

  class App3 {
    /**
     * カメラ定義のための定数
     */
    static get CAMERA_PARAM() {
      return {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 20.0,
        x: 0.0,
        y: 2.0,
        z: 10.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
      };
    }
    /**
     * レンダラー定義のための定数
     */
    static get RENDERER_PARAM() {
      return {
        clearColor: 0x72a6e1,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    /**
     * ディレクショナルライト定義のための定数
     */
    static get DIRECTIONAL_LIGHT_PARAM() {
      return {
        color: 0xffffff,
        intensity: 1.0,
        x: 1.0,
        y: 1.0,
        z: 1.0,
      };
    }
    /**
     * アンビエントライト定義のための定数
     */
    static get AMBIENT_LIGHT_PARAM() {
      return {
        color: 0xffffff,
        intensity: 0.3,
      };
    }
    /**
     * マテリアル定義のための定数
     */
    static get MATERIAL_PARAM() {
      return {
        color: 0xf7c7a5,
        flatShading: true,
      };
    }
    /**
     * レイが交差した際のマテリアル定義のための定数 @@@
     */
    static get INTERSECTION_MATERIAL_PARAM() {
      return {
        color: 0x00ff00,
      };
    }
    /**
     * フォグの定義のための定数
     */
    static get FOG_PARAM() {
      return {
        fogColor: 0xffffff,
        fogNear: 10.0,
        fogFar: 20.0,
      };
    }

    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
      this.renderer; // レンダラ
      this.scene; // シーン
      this.camera; // カメラ
      this.directionalLight; // ディレクショナルライト
      this.ambientLight; // アンビエントライト
      this.material; // マテリアル
      this.geometry; // ジオメトリ
      this.controls; // オービットコントロール
      this.axesHelper; // 軸ヘルパー
      this.mesh; // グループ
      this.texture; // テクスチャ
      this.animationParam = {
        twist01: 0,
        twist02: 0,
      };

      // 再帰呼び出しのための this 固定
      this.render = this.render.bind(this);

      // キーの押下や離す操作を検出できるようにする
      window.addEventListener(
        "keydown",
        (keyEvent) => {
          switch (keyEvent.key) {
            case " ":
              this.isDown = true;
              break;
            default:
          }
        },
        false
      );
      window.addEventListener(
        "keyup",
        (keyEvent) => {
          this.isDown = false;
        },
        false
      );

      // リサイズイベント
      window.addEventListener(
        "resize",
        () => {
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
        },
        false
      );
    }

    /**
     * 初期化処理
     */
    init() {
      // レンダラー
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(
        new THREE.Color(App3.RENDERER_PARAM.clearColor)
      );
      this.renderer.setSize(
        App3.RENDERER_PARAM.width,
        App3.RENDERER_PARAM.height
      );
      const wrapper = document.querySelector("#webgl");
      wrapper.appendChild(this.renderer.domElement);

      // シーンとフォグ
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(
        App3.FOG_PARAM.fogColor,
        App3.FOG_PARAM.fogNear,
        App3.FOG_PARAM.fogFar
      );

      // カメラ
      this.camera = new THREE.PerspectiveCamera(
        App3.CAMERA_PARAM.fovy,
        App3.CAMERA_PARAM.aspect,
        App3.CAMERA_PARAM.near,
        App3.CAMERA_PARAM.far
      );
      this.camera.position.set(
        App3.CAMERA_PARAM.x,
        App3.CAMERA_PARAM.y,
        App3.CAMERA_PARAM.z
      );
      this.camera.lookAt(App3.CAMERA_PARAM.lookAt);

      // ディレクショナルライト（平行光源）
      this.directionalLight = new THREE.DirectionalLight(
        App3.DIRECTIONAL_LIGHT_PARAM.color,
        App3.DIRECTIONAL_LIGHT_PARAM.intensity
      );
      this.directionalLight.position.set(
        App3.DIRECTIONAL_LIGHT_PARAM.x,
        App3.DIRECTIONAL_LIGHT_PARAM.y,
        App3.DIRECTIONAL_LIGHT_PARAM.z
      );
      this.scene.add(this.directionalLight);

      // アンビエントライト（環境光）
      this.ambientLight = new THREE.AmbientLight(
        App3.AMBIENT_LIGHT_PARAM.color,
        App3.AMBIENT_LIGHT_PARAM.intensity
      );
      this.scene.add(this.ambientLight);

      // マテリアル
      this.material = new THREE.MeshToonMaterial(App3.MATERIAL_PARAM);

      const createGeometry = () => {
        // 初期のトーラス
        this.geometry = new THREE.TorusGeometry(2, 0.7, 20, 100);
        this.geometry.morphAttributes.position = [];

        // geometryの元のposition(頂点)
        const positionAttribute = this.geometry.attributes.position;
        const twistPositions = [];
        const twist02Positions = [];

        const direction = new THREE.Vector3(1, 0, 0);
        const vertex = new THREE.Vector3();

        //トーラスの頂点の数だけループ
        for (let i = 0; i < positionAttribute.count; i++) {
          // トーラスの頂点座標を取得
          let x = positionAttribute.getX(i);
          let y = positionAttribute.getY(i);
          let z = positionAttribute.getZ(i);

          // 縦長にする
          vertex.set(x * 1.5, y / 1.5, z);
          vertex
            .applyAxisAngle(direction, (Math.PI * x) / 2)
            .toArray(twistPositions, twistPositions.length);

          vertex
            .applyAxisAngle(direction, (Math.PI * x) / 2)
            .toArray(twist02Positions, twist02Positions.length);
        }

        this.geometry.morphAttributes.position[0] =
          new THREE.Float32BufferAttribute(twistPositions, 3);
        this.geometry.morphAttributes.position[1] =
          new THREE.Float32BufferAttribute(twist02Positions, 3);

        return this.geometry;
      };

      this.mesh = new THREE.Mesh(createGeometry(), this.material);
      this.mesh.rotation.x = -10;
      this.mesh.rotation.z = -20;
      this.scene.add(this.mesh);

      // コントロール
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    /**
     * アニメーション
     */
    animate() {
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "Power3.easeInOut" },
        repeat: -1,
        yoyo: true,
      });
      tl.to(this.animationParam, {
        twist01: 0,
        twist02: 0,
        duration: 0,
      })
        .to(this.animationParam, {
          twist01: 1,
          twist02: 0,
        })
        .to(this.animationParam, {
          twist01: 0,
          twist02: 1,
        });
    }
    /**
     * 描画処理
     */
    render() {
      requestAnimationFrame(this.render);
      this.controls.update();
      this.mesh.rotation.y += 0.01;
      this.mesh.morphTargetInfluences[0] = this.animationParam.twist01;
      this.mesh.morphTargetInfluences[1] = this.animationParam.twist02;
      this.renderer.render(this.scene, this.camera);
    }
  }

  return (
    <>
      <div id="webgl"></div>
    </>
  );
}
