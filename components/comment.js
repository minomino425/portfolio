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
    ? "すりガラスのような見た目になりながら画像が切り替わるスライダーです。横方向に少しずらしながら切り替えることで、より自然に見えるようにしました。イージングや秒数などの指定にはGSAPを使っています。"
    : "";
  const morphComment = morph
    ? "トーラスをモーフィングさせました。マテリアルはトゥーンレンダリングと呼ばれるアニメ風で陰影がはっきりしている手法を使用しています。"
    : "";
  const noiseSlideComment = noiseSlide
    ? "ノイズを使って水玉模様に切り替わるスライダーです。"
    : "";

  const [active, setActive] = useState(false);
  const classToggle = () => {
    setActive(!active);
  };
  const refText = useRef(null);
  const refTitle = useRef(null);

  const style = {
    "--title-width": refTitle.current
      ? `${refTitle.current.offsetWidth}px`
      : "130px",
    "--title-height": refTitle.current
      ? `${refTitle.current.offsetHeight}px`
      : "27px",
    "--text-width": refText.current
      ? `${refText.current.offsetWidth}px`
      : "0px",
    "--text-height": refText.current
      ? `${refText.current.offsetHeight}px`
      : "0px",
  };

  return (
    <>
      <a
        className={`${styles.comment} ${active ? styles.open : styles.close}`}
        onClick={classToggle}
        ref={refTitle}
        {...{ style }}
      >
        <span className={styles["comment-title"]}>Comment</span>
      </a>
      <a
        className={`${styles["comment-wrap"]} ${
          active ? styles.open : styles.close
        }`}
        onClick={classToggle}
        ref={refText}
        {...{ style }}
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
