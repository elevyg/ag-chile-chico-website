import { motion, useScroll, useTransform } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { useRef } from "react";
import { useTranslation } from "next-i18next";

const Hero = () => {
  const { t } = useTranslation(["landing", "common"]);
  const target = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start", "end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 10]);

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

  return (
    <div ref={target} className="relative h-[200vh]">
      <div className="sticky left-0 top-0 h-[100vh]">
        <motion.div
          style={{ scale, opacity, x: "50%" }}
          className="absolute right-1/2 top-1/2 z-20 w-full overflow-hidden"
        >
          <motion.h1 className="w-full text-center text-3xl font-bold text-white">
            {t("main-title")}
          </motion.h1>
        </motion.div>
        <CldImage
          width="1000"
          height="600"
          priority
          src="ag-chile-chico-website/foto_islas_vhlcy2"
          sizes="100vw"
          alt="Description of my image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
