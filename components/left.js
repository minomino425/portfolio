import styles from "../styles/Left.module.css";
export default function Left() {
  return (
    <>
      <section className={styles["left-container"]}>
        <div>
          <h2 className={styles.title}>tomomi minoda</h2>
          <ul className={styles.menu}>
            <li className={styles.list}>
              <a href="./about" className={styles["list-menu"]}>About</a>
            </li>
            <li className={`${styles.list} ${styles['list-title']}`}>
              <span className={styles["list-menu"]}>Works</span>
            </li>
            <li className={styles.list}>
              <a href="./gradationMonster" className={styles["list-menu"]}>Gradatio monstern</a>
            </li>
            <li className={styles.list}>
              <a href="./morph" className={styles["list-menu"]}>3D morph targets</a>
            </li>
            <li className={styles.list}>
              <a href="./noiseBg" className={styles["list-menu"]}>Noise background</a>
            </li>
            <li className={styles.list}>
              <a href="./glass" className={styles["list-menu"]}>Grass transition</a>
            </li>
            <li className={styles.list}>
              <a href="./noiseSlide" className={styles["list-menu"]}>Noise transition</a>
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
