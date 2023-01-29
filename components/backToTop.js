import styles from "../styles/Left.module.css";

export default function BackToTop({isWork}) {
  return (
    <>
      <a href="../" className={isWork ? styles.bottom : styles.backToTop}>Back to top</a>
    </>
  );
}
