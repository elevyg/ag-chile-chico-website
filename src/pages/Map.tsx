import React from "react";
import { useTranslation } from "next-i18next";
import Map from "~/components/Map";
import { agMembers } from "~/ag-members";
import { motion } from "framer-motion";

const MapSection = () => {
  const { t } = useTranslation("landing");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="relative flex flex-col"
      id="mapa"
    >
      <div className="absolute z-20 h-10 w-full bg-gradient-to-b from-slate-200 to-transparent pt-5">
        <h2 className="px-5 text-xl">{t("map-section-title")}</h2>
      </div>
      <Map places={Object.values(agMembers)} />
    </motion.div>
  );
};

export default MapSection;
