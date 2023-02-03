import styles from "../styles/Left.module.css";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const [hoverFlag, setHoverFlag] = useState(true);

  useEffect(() => {
    //カーソルのスタイル
    gsap.set("#cursor", { xPercent: -50, yPercent: -50 });

    const ball = document.querySelector("#cursor");
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.2;

    const xSet = gsap.quickSetter(ball, "x", "px");
    const ySet = gsap.quickSetter(ball, "y", "px");

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    gsap.ticker.add(() => {
      // adjust speed for higher refresh monitors
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
    });

    const links = document.querySelectorAll("a");
    for (let i = 0; i < links.length; i++) {
      let selfLink = links[i];
      selfLink.addEventListener("mouseover", function () {
        ball.classList.add(`${styles["link"]}`);
      });
      selfLink.addEventListener("mouseout", function () {
        ball.classList.remove(`${styles["link"]}`);
      });
    }
  }, []);

  return (
    <>
      <div id="cursor" className={styles.cursor}>
        <span className={styles.cursorText}>CLICK</span>
      </div>
    </>
  );
}
