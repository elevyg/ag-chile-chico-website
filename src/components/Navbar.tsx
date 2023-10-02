import { easeIn, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { IoMenuOutline } from "react-icons/io5";

interface Props {
  title: string;
}

const Navbar = ({ title }: Props) => {
  const target = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["80px", "160px"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgba(241 245 249,0)", "rgba(241 245 249,1)"],
    { ease: easeIn },
  );

  const color = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgba(256,256,256,1)", "rgba(39,39,42,1)"],
    { ease: easeIn },
  );

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 flex h-[80px] items-center justify-between  p-5 text-zinc-800"
      ref={target}
      style={{ backgroundColor: backgroundColor, color }}
    >
      <div className="font-extrabold">
        <Link href="/">{title}</Link>
      </div>
      <motion.div
        className="mx-5 flex items-center justify-center gap-2 rounded-md  border-[1px] border-zinc-800 p-2 md:hidden"
        style={{ borderColor: color }}
      >
        <IoMenuOutline size="1.5em" />
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
