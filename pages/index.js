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
  const [flag, setFlag] = useState();
  // useEffect(() => {
  //   if (localStorage.getItem("access")) {
  //     console.log("2回目以降のアクセスです");
  //     setFlag(true);
  //     // console.log("flag2" + flag);
  //   } else {
  //     console.log("初回アクセスです");
  //     localStorage.setItem("access", 0);
  //     // setFlag(false);
  //     // console.log("flag1" + flag);
  //   }
  // }, [flag]);
  // console.log(flag)

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Cookieから「showAnimation」の値を取得する
    const showAnimationCookie = Cookie.get("showAnimation");

    // Cookieに「showAnimation」の値がなければ、アニメーションを表示する
    if (showAnimationCookie === undefined) {
      setShowAnimation(true);
      // Cookieに「showAnimation」の値を設定する（有効期限は1日）
      Cookie.set("showAnimation", "false", { expires: 1 });
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
        {/* {showAnimation && <OpeningFirst />} */}
        {showAnimation ? <OpeningFirst /> : <OpeningClear />}
        <Bg />
        <Left></Left>
        <Cursor />
      </motion.div>
    </>
  );
};

export default Home;
