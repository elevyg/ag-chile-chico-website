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
      <motion.div style={{ translateX: isMobile ? undefined : translateX }}>
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
          translateY: isMobile ? undefined : translateY,
        }}
      >
        <h3 className="text-2xl font-bold">{t("who-are-we-title")}</h3>
        <p>{t("about-ag-description")}</p>
        <div className="mt-5 flex w-full max-w-4xl flex-col gap-3 self-center">
          <button
            onClick={() => void router.push("/miembros")}
            className="w-full rounded-md bg-gradient-to-l from-lightYellow to-darkYellow p-5 text-lg font-bold text-white hover:from-darkYellow hover:to-darkYellow"
          >
            {t("members-call-to-action")}
          </button>
          <button
            onClick={() => void router.push("/unete")}
            className="w-full rounded-md border-2 border-darkYellow p-5 text-lg font-bold text-darkYellow hover:border-white hover:bg-gradient-to-l hover:from-lightYellow hover:to-darkYellow hover:text-white"
          >
            {t("ag-call-to-action")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WhoAreWe;
