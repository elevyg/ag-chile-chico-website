import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "~/../next-i18next.config.mjs";

export const translationServerProps = (
  locale: string,
  scopes: string[] = [],
) => {
  return serverSideTranslations(locale, ["common", ...scopes], nextI18nConfig, [
    "es",
    "en",
  ]);
};
