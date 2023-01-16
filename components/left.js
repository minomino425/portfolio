import styles from "../styles/Left.module.css";
export default function Left() {
  return (
    <>
      <section className={styles["left-container"]}>
        <div>
          <h2 className={styles.title}>Tomomi Minoda</h2>
          <ul className={styles.menu}>
            <li className={styles.list}>
              <a href="" className={styles["list-menu"]}>About</a>
            </li>
            <li className={`${styles.list} ${styles['list-title']}`}>
              <a className={styles["list-menu"]}>Works</a>
            </li>
            <li className={styles.list}>
              <a href="./noiseBg" className={styles["list-menu"]}>Noise background</a>
            </li>
            <li className={styles.list}>
              <a href="./glass" className={styles["list-menu"]}>Grass transition</a>
            </li>
            <li className={styles.list}>
              <a href="./morph" className={styles["list-menu"]}>3D Morph Targets</a>
            </li>
            <li className={styles.list}>
              <a href="" className={styles["list-menu"]}>Noise transition</a>
            </li>
            <li className={styles.list}>
              <a href="mailto:tomomi.minoda425@gmail.com" className={styles["list-menu"]}>Contact</a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
