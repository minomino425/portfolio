import Bg from "../components/bg";
import Left from "../components/left";
import Meta from '../components/meta'
import Opening from '../components/opening'
import { motion } from 'framer-motion'
import Cursor from "../components/cursor";

const Home = () => {
  return (
    <>
    <Meta />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
      <Opening />
      <Bg />
      <Left></Left>
      <Cursor />
    </motion.div>
    </>
  );
};

export default Home;
