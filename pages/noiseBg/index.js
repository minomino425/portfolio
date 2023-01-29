// import css from "../styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import Noise from "../../components/noiseBg";
import BackToTop from "../../components/backToTop";
import { motion } from 'framer-motion'

const NoiseBg = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 1 }}
      >
      <Noise />
      <BackToTop isWork/>
      </motion.div>
    </>
  );
};

export default NoiseBg;
