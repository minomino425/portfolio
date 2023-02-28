import Bg from "../components/bg";
import Left from "../components/left";
import Meta from "../components/meta";
import OpeningClear from "../components/openingClear";
import OpeningFirst from "../components/openingFirst";
import { motion } from "framer-motion";
import Cursor from "../components/cursor";
import Cookie from "js-cookie";
import React, { useState, useEffect, useRef } from "react";

const Home = () => {

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Cookieから「showAnimation」の値を取得する
    const showAnimationCookie = Cookie.get("showAnimation");
    console.log(showAnimationCookie)
    // Cookieに「showAnimation」の値がなければ、アニメーションを表示する
    if (showAnimationCookie === undefined) {
      setShowAnimation(true);
      // Cookieに「showAnimation」の値を設定する（有効期限は1日）
      Cookie.set("showAnimation", "true", { expires: 1 });
    }
  }, []);

  return (
    <>
      <Meta />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 1 }}
      >
        {showAnimation ? <OpeningFirst /> : <OpeningClear />}
        <Bg />
        <Left></Left>
        <Cursor />
      </motion.div>
    </>
  );
};

export default Home;
