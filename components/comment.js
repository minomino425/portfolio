import styles from "../styles/Left.module.css";
import React, { useState, useRef } from "react";

export default function Comment({
  noiseBg = false,
  glass = false,
  morph = false,
  noiseSlide = false,
  changeGradation = false,
  about = false,
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
  const changeGradationComment = changeGradation
    ? "体の色が移り変わるモンスターです。GLSLスクールのプラスワン講義での山田啓太さんの解説を元にして作りました。グラデーションの画像から色を抽出しています。"
    : "";
  const aboutComment = about
    ? `このサイトの今後の改善点リストです。\n・パフォーマンスが悪くカーソルがもたつく\n・オープニングアニメーションをcookieを使って最初の1回だけ表示させる\n・生のWebGLで縦横比を保たせる`
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
        {aboutComment ? (
          <span className={styles["comment-title"]}>課題リスト</span>
        ) : (
          <span className={styles["comment-title"]}>Comment</span>
        )}
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
          {changeGradationComment && changeGradationComment}
          {aboutComment && aboutComment}
        </p>
      </a>
    </>
  );
}
