import { motion, useScroll } from "framer-motion";
import { IoMenuOutline } from "react-icons/io5";

interface Props {
  title: string;
}

const Navbar = ({ title }: Props) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.nav
      className="sticky left-0 right-0 top-0 z-50 flex items-center justify-between border-b-[1px] border-zinc-400 bg-slate-100 p-5 text-zinc-800"
      style={{}}
    >
      <div className="font-extrabold">
        <p>{title}</p>
      </div>
      <div className="mx-5 flex items-center justify-center gap-2 rounded-md  border-[1px] border-zinc-800 p-2 md:hidden">
        <IoMenuOutline size="1.5em" />
      </div>
    </motion.nav>
  );
};

export default Navbar;
