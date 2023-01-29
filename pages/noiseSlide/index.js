import NoiseSlide from "../../components/noiseSlide";
import BackToTop from "../../components/backToTop";
import { motion } from 'framer-motion'

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
      </motion.div>
    </>
  );
};

export default NoiseSlider;
