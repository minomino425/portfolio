import Bg from "../components/bg";
import Left from "../components/left";
import Meta from "../components/meta";
import Opening from "../components/opening";
import { motion } from "framer-motion";
import Cursor from "../components/cursor";
import React, { useState, useEffect, useRef } from "react";

const Home = () => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("access")) {
      console.log("2回目以降のアクセスです");
      setFlag(true)
    } else {
      console.log("初回アクセスです");
      sessionStorage.setItem("access", 0);
      setFlag(false)
    }
  }, [flag]);

  return (
    <>
      <Meta />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 1 }}
      >
        {/* {flag && <Opening />} */}
        {flag ? <Opening /> : <Opening seek/>}
        <Bg />
        <Left seek></Left>
        <Cursor />
      </motion.div>
    </>
  );
};

export default Home;
