import React from "react";
import { useTranslation } from "next-i18next";
import Map from "~/components/Map";
import { agMembers } from "~/ag-members";

const MapSection = () => {
  const { t } = useTranslation("landing");
  return (
    <div className="relative flex flex-col">
      <div className="absolute z-20 h-10 w-full bg-gradient-to-b from-slate-200 to-transparent pt-5">
        <h2 className="px-5 text-xl">{t("map-section-title")}</h2>
      </div>
      <Map places={Object.values(agMembers)} />
    </div>
  );
};

export default MapSection;
