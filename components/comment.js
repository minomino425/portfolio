import styles from "../styles/opening.module.css";
import { gsap } from "gsap";
import React, { useState, useEffect, useRef } from "react";

export default function Comment({
  noiseBg = false,
  glass = false,
  morph = false,
  noiseSlide = false,
}) {
  const noiseBgComment = noiseBg ?? "ノイズでざらつきのあるような質感を表現しました。時間経過またはマウスカーソルを動かすと色が変化します。";
  const glassComment = glass ?? "すりガラスのような見た目になりながら画像が切り替わるスライダーです。横方向に少しずらしながら切り替えることで、より自然に見えるようにしました。イージングや秒数などの指定にはGSAPを使っています。高級感を演出したいサイトのFVなどで使用すると、目を引く演出になるのではと思います。";
  const morphComment = morph ?? "3Dモーフィングです。";
  const noiseSlideComment = noiseSlide ?? "ノイズを使って水玉模様に切り替わるスライダーです。";

  return (
    <>
      <div className={styles.comment}>
        <span className={styles["comment-title"]}>Comment</span>
        <span className={styles["comment-text"]}>
            {noiseBgComment}
            {glassComment}
            {morphComment}
            {noiseSlideComment}
        </span>

      </div>
    </>
  );
}
