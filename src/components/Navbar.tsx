import { easeIn, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { IoMenuOutline } from "react-icons/io5";

interface Props {
  title: string;
  inLanding?: true;
}

const Navbar = ({ title, inLanding }: Props) => {
  const target = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["80px", inLanding ? "100vh" : "160px"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["rgba(241 245 249,0.3)", "rgba(241 245 249,1)"],
    { ease: easeIn },
  );

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 flex h-[80px] items-center justify-between  p-5 text-zinc-800"
      ref={target}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="font-extrabold">
        <Link href="/">{title}</Link>
      </div>
      <div className="mx-5 flex items-center justify-center gap-2 rounded-md  border-[1px] border-zinc-800 p-2 md:hidden">
        <IoMenuOutline size="1.5em" />
      </div>
    </motion.nav>
  );
};

export default Navbar;
