import { easeIn, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "next-i18next";
import { IoMenuOutline } from "react-icons/io5";
import Image from "next/image";

const LandingNavbar = () => {
  const target = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["80px", "100vh"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["rgba(241 245 249,0)", "rgba(241 245 249,1)"],
    { ease: easeIn },
  );

  const { t } = useTranslation("common");

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 flex h-[80px] items-center justify-between  p-5 text-zinc-800"
      ref={target}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="flex items-center gap-2 font-extrabold">
        <Image src="/sun-icon-gray.png" alt="sun-icon" width={40} height={40} />
        <Link href="/">{t("navbar-title")}</Link>
      </div>
      {/* <div className="mx-5 flex items-center justify-center gap-2 rounded-md  border-[1px] border-zinc-800 p-2 md:hidden">
        <IoMenuOutline size="1.5em" />
      </div> */}
    </motion.nav>
  );
};

export default LandingNavbar;
