import Bg from "../components/bg";
import Left from "../components/left";
import Meta from '../components/meta'
import { motion } from 'framer-motion'

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
      <Bg />
      <Left></Left>
    </motion.div>
    </>
  );
};

export default Home;
