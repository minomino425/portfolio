import BackToTop from "../../components/backToTop";
import Cursor from "../../components/cursor";
import Comment from "../../components/comment";
import ChangeGradationBg from "../../components/ChangeGradationBg";
import { motion } from 'framer-motion'

const ChangeGradation = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 1 }}
      >
      <ChangeGradationBg />
      <BackToTop isWork/>
      <Cursor />
      <Comment changeGradation/>
      </motion.div>
    </>
  );
};

export default ChangeGradation;
