import { motion, useScroll, useTransform } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { useTranslation } from "next-i18next";
import { useRef } from "react";

import { isMobile } from "react-device-detect";

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
    <div ref={target} className={`relative h-screen md:h-[200vh] `}>
      <div className="sticky left-0 top-0 h-[100vh]">
        <motion.div
          style={{
            scale: !isMobile ? scale : undefined,
            opacity: !isMobile ? opacity : undefined,
            x: "50%",
          }}
          className="absolute right-1/2 top-1/2 z-20 w-full overflow-hidden"
        >
          <motion.h1 className="w-full text-center text-3xl font-bold text-white">
            {t("main-title")}
          </motion.h1>
        </motion.div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-screen w-screen object-cover"
          poster="https://res.cloudinary.com/dzyy8nvgd/image/upload/q_auto/v1695837655/ag-chile-chico-website/foto_islas_vhlcy2.jpg"
        >
          <source
            src="https://res.cloudinary.com/dzyy8nvgd/video/upload/ac_none,q_auto/v1696270310/ag-chile-chico-website/Chile_Chico_Dron_series_res9ly.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
};

export default Hero;
