import styles from "../styles/Left.module.css";
export default function About() {
  return (
    <>
      <section className={styles["left-container"]}>
        <div>
          <h2 className={styles.title}>Tomomi Minoda</h2>
          <div className={styles["about-containar"]}>
            <p>
              兵庫県生まれ。大学卒業後、SEからウェブ業界へ転身。
              <br />
              現在は東京のWebマーケティング会社でコーダーとしてWebサイトを作っています。
              <br />
              触っていて心地良いと感じるようなインタラクティブ性のあるサイトが好きです。
              <br />
              表現の幅を広げるため、まだまだ未熟ですがWebGL学習中です。
              <br />
              今後はUI/UXの設計、デザイン、コーディングまで一貫して作れるようになりたいと思っています。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
