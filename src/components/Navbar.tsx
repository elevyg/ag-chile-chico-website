import { motion, useScroll } from "framer-motion";
import { IoMenuOutline } from "react-icons/io5";

const Navbar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.nav
      className="sticky left-0 right-0 top-0 z-50 flex items-center justify-center border-b-[1px] border-zinc-400 bg-slate-100 p-5 text-zinc-800"
      style={{}}
    >
      <div className="absolute left-0 mx-5 flex items-center justify-center gap-2  rounded-md border-[1px] border-zinc-800 p-1">
        <IoMenuOutline />
        <p>menú</p>
      </div>
      <div className="font-extrabold">
        <p>CHILE CHICO TURISMO</p>
      </div>
    </motion.nav>
  );
};

export default Navbar;
