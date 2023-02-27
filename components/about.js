import styles from "../styles/Left.module.css";
import BackToTop from "./backToTop";
export default function About() {
  return (
    <>
      <section className={styles["about-containar"]}>
        <div className={styles.about}>
          <h2 className={styles.title}>minoda tomomi</h2>
          <div className={styles["about-inner"]}>
            <p>
              1995年、兵庫県生まれ。神奈川県在住。
              <br />
              大学卒業後、SEからウェブ業界へ転身。
              <br />
              現在は東京のWebマーケティング会社でコーダーとしてWebサイトを作っています。
              <br />
              CSSやSVGアニメーションを作るのが好きです。表現の幅を広げるためWebGLスクール、GLSLスクールを受講し、個人でWebGLも学習中です。
              <br />
              Next.js,Reactなどのフレームワークのスキルも高めていきたいと思っており、このサイトはその2つを使って作りました。
              <br />
              あくまでも理想ですが、将来的にはUI/UXの設計、デザイン、コーディングまで一貫して作れるようになりたいです。
            </p>
            <a
              className={styles["link-zenn"]}
              href="https://zenn.dev/minomino425"
            >
              Zenn
            </a>
          </div>
        </div>
        <BackToTop />
      </section>
    </>
  );
}
