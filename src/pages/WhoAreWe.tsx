import { useScroll, motion, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface Props {
  isMobile: boolean;
}

const WhoAreWe = ({ isMobile }: Props) => {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end end"],
  });

  const translateX = useTransform(
    scrollYProgress,
    (progress) => (1 - progress) * -400,
  );

  const translateXInverted = useTransform(
    scrollYProgress,
    (progress) => (1 - progress) * 400,
  );
  const translateY = useTransform(
    scrollYProgress,
    (progress) => (1 - progress) * -400,
  );

  const { t } = useTranslation(["landing", "common"]);

  const router = useRouter();

  return (
    <motion.div
      ref={target}
      className="flex flex-col items-center gap-5 overflow-hidden  p-5 py-20 md:flex-row"
    >
      <motion.div style={{ translateX }}>
        <Image
          priority
          src="/logo-ag.png"
          width={400}
          height={400}
          alt="Logo Asociación Gremial Chile Chico"
          className="h-50 w-50 object-scale-down md:h-full md:w-full"
        />
      </motion.div>
      <motion.div
        className="flex h-full w-full flex-1 flex-col items-start justify-center gap-5 bg-white"
        style={{
          translateY: !isMobile ? translateY : undefined,
          translateX: isMobile ? translateXInverted : undefined,
        }}
      >
        <h3 className="text-2xl font-bold">{t("who-are-we-title")}</h3>
        <p>{t("about-ag-description")}</p>
        <button
          onClick={() => void router.push("/unete")}
          className="mt-5 w-full max-w-4xl self-center rounded-md border-2 border-darkYellow p-5 text-lg font-bold text-darkYellow hover:bg-darkYellow hover:text-white"
        >
          {t("ag-call-to-action")}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default WhoAreWe;
