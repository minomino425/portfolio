import styles from "../styles/opening.module.css";
import { gsap } from "gsap";
import React, { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import url from "../public/opening.png";

export default function Opening() {
  const tl = gsap.timeline({});

  useEffect(() => {
    tl.to("#box", {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.inOut",
    });
    tl.to("#box", {
      scaleY: 0,
      duration: 0.5,
      ease: "power3.inOut",
      transformOrigin: "top",
    });
  }, []);

  return (
    <>
      <section className={styles["opening"]}>
        <div className={styles["opening-inner"]}>
          <NextImage className="object-contain" src={url} alt="" />
        </div>
      </section>
    </>
  );
}
