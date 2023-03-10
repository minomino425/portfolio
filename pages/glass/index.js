import styles from "../../styles/Left.module.css";
import Glass from "../../components/glass";
import { motion } from 'framer-motion'
import BackToTop from "../../components/backToTop";
import Cursor from "../../components/cursor";
import Comment from "../../components/comment";

const GlassSlide = () => {
  return (
    <>
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
      <Glass />
      <BackToTop isWork/>
      <Cursor />
      <Comment glass/>
      </motion.div>
    </>
  );
};

export default GlassSlide;
