import path from "path";

/** @type {import("next-i18next").UserConfig} */
const config = {
  debug:
    process.env.NODE_ENV === "development" && !!process.env.DEBUG_NEXT_I18NEXT,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  i18n: {
    defaultLocale: "es",
    locales: ["en", "es"],
  },
  localePath: path.resolve("./public/locales"),
};
export default config;
