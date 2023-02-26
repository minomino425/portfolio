import BackToTop from "../../components/backToTop";
import Cursor from "../../components/cursor";
import Comment from "../../components/comment";
import GradationMonster from "../../components/gradationMonster";
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
      <GradationMonster />
      <BackToTop isWork/>
      <Cursor />
      <Comment changeGradation/>
      </motion.div>
    </>
  );
};

export default ChangeGradation;
