import React from "react";
import { useTranslation } from "next-i18next";
import Map from "~/components/Map";

const MapSection = () => {
  const { t } = useTranslation("landing");
  return (
    <div className="relative flex flex-col">
      <div className="absolute z-20 h-10 w-full bg-gradient-to-b from-slate-200 to-transparent pt-5">
        <h2 className="px-5 text-xl">{t("map-section-title")}</h2>
      </div>
      <Map address="O'higgins 420 Chile Chico" />
    </div>
  );
};

export default MapSection;
