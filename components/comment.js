import styles from "../styles/Left.module.css";
import React, { useState, useEffect, useRef } from "react";

export default function Comment({
  noiseBg = false,
  glass = false,
  morph = false,
  noiseSlide = false,
}) {
  const noiseBgComment = noiseBg
    ? "ノイズでざらつきのあるような質感を表現しました。時間経過またはマウスカーソルを動かすと色が変化します。ただのベタ塗りより繊細な見え方になる気がします。"
    : "";
  const glassComment = glass
    ? "すりガラスのような見た目になりながら画像が切り替わるスライダーです。横方向に少しずらしながら切り替えることで、より自然に見えるようにしました。イージングや秒数などの指定にはGSAPを使っています。高級感を演出したいサイトのFVなどで使用すると、目を引く演出になるのではと思います。"
    : "";
  const morphComment = morph ? "トーラスをモーフィングさせました。マテリアルはトゥーンレンダリングと呼ばれるアニメ風で陰影がはっきりしている手法を使用しています。" : "";
  const noiseSlideComment = noiseSlide
    ? "ノイズを使って水玉模様に切り替わるスライダーです。"
    : "";

  const [active, setActive] = useState(false);
  const classToggle = () => {
    setActive(!active);
  };
  return (
    <>
      <a
        className={`${styles.comment} ${active ? styles.active : ""}`}
        onClick={classToggle}
      >
        <span className={styles["comment-title"]}>Comment</span>
        <div class="c-coder__popup__bg"></div>
      </a>
      <a
        className={`${styles["comment-wrap"]} ${active ? styles.active : ""}`}
        onClick={classToggle}
      >
       <p className={styles.commentText}>
          {noiseBgComment && noiseBgComment}
          {glassComment && glassComment}
          {morphComment && morphComment}
          {noiseSlideComment && noiseSlideComment}
        </p>
      </a>
    </>
  );
}
