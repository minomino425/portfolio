import styles from "../styles/opening.module.css";
import { gsap } from "gsap";
import React, { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import url1 from "../public/opening_1.png";
import url2 from "../public/opening_2.png";
import url3 from "../public/opening.png";

export default function Opening() {
  const tl = gsap.timeline({});

  useEffect(() => {
    tl.to(
      `.${styles["image1"]}`,
      {
        autoAlpha: 0,
      },
      "1"
    );
    tl.to(
      `.${styles["image2"]}`,
      {
        autoAlpha: 1,
      },
      "<"
    );
    tl.to(
      `.${styles["image2"]}`,
      {
        autoAlpha: 0,
      },
      "<1"
    );
    tl.to(
      `.${styles["image3"]}`,
      {
        autoAlpha: 1,
      },
      "<"
    );
  }, []);

  return (
    <>
      <section className={styles["opening"]}>
        <div className={styles["opening-inner"]}>
          <NextImage
            className={`${styles["opening-image"]} ${styles["image1"]}`}
            src={url1}
            alt=""
            priority
          />
          <NextImage
            className={`${styles["opening-image"]} ${styles["image2"]}`}
            src={url2}
            alt=""
            priority
          />
          <NextImage
            className={`${styles["opening-image"]} ${styles["image3"]}`}
            src={url3}
            alt=""
            priority
          />
          <div className={styles.block}></div>
        </div>
      </section>
    </>
  );
}
