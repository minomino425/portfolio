import Noise from "../../components/noiseBg";
import BackToTop from "../../components/backToTop";
import Cursor from "../../components/cursor";
import Comment from "../../components/comment";
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
      <Cursor />
      <Comment noiseBg/>
      </motion.div>
    </>
  );
};

export default NoiseBg;
