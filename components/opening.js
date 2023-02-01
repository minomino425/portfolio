import styles from "../styles/opening.module.css";
import Image from "next/image";
import { gsap } from "gsap";
import React, { useState, useEffect, useRef } from "react";

export default function Opening() {
  const tl = gsap.timeline({});

  useEffect(() => {
    tl.to("#box", {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.inOut",
    })
    tl.to("#box", {
      scaleY: 0,
      duration: 0.5,
      ease: "power3.inOut",
      transformOrigin: "top"
    })
  }, []);

  return (
    <>
      <section className={styles["opening"]}>
        <div className={styles["opening-inner"]}>
          <div id="box" className={styles["box"]}>
            <Image
              src="/favicon.ico"
              objectFit="contain"
              layout="fill"
              alt="logo"
            />
          </div>
        </div>
      </section>
    </>
  );
}
