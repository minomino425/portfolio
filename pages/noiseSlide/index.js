import NoiseSlide from "../../components/noiseSlide";
import BackToTop from "../../components/backToTop";
import { motion } from 'framer-motion'
import Cursor from "../../components/cursor";
import Comment from "../../components/comment";

const NoiseSlider = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 1 }}
      >
        <NoiseSlide />
        <BackToTop isWork/>
        <Cursor />
        <Comment noiseSlide/>
      </motion.div>
    </>
  );
};

export default NoiseSlider;
