// import css from "../styles/Home.module.css";
import Morph from "../../components/morph";
import BackToTop from "../../components/backToTop";
import { motion } from 'framer-motion'

const Morphing = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 1 }}
      >
      <Morph />
      <BackToTop isWork/>
      </motion.div>
    </>
  );
};

export default Morphing;
