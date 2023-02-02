import About from "../../components/about";
import Bg from "../../components/bg";
import BackToTop from "../../components/backToTop";
import Cursor from "../../components/cursor";
import { motion } from 'framer-motion'

const about = () => {
  return (
    <>
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
        <Bg />
        <About />
        <Cursor />
      </motion.div>
    </>
  );
};

export default about;
