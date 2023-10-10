import { motion, useScroll, useTransform } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { useTranslation } from "next-i18next";
import { useRef } from "react";

interface Props {
  isMobile: boolean;
}
const Hero = ({ isMobile }: Props) => {
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
      <div className="sticky left-0 top-0 h-[100vh] overflow-hidden">
        <div className="absolute bottom-5 right-5 z-50 hidden md:block">
          <ScrollDownIcon className="animate-bounce fill-white opacity-50 md:h-20 md:w-20" />
        </div>
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

const ScrollDownIcon = (props: { className?: string }) => {
  return (
    <svg
      id="Layer_1"
      // height="100"
      viewBox="0 0 512 512"
      // width="100"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      {...props}
    >
      <path d="m256 0c-141.159 0-256 114.841-256 256s114.841 256 256 256 256-114.841 256-256-114.841-256-256-256zm114.788 292.1-103.475 103.469a16 16 0 0 1 -22.626 0l-103.475-103.469a16 16 0 0 1 22.627-22.627l92.161 92.156 92.161-92.159a16 16 0 1 1 22.627 22.63zm0-133.039-103.475 103.47a16 16 0 0 1 -22.626 0l-103.475-103.473a16 16 0 0 1 22.627-22.627l92.161 92.16 92.161-92.16a16 16 0 1 1 22.627 22.627z" />
    </svg>
  );
};

export default Hero;
