// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import i18nConfig from "./next-i18next.config.mjs";
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */

const PARK_TICKETS_URL =
  "https://tickets.pasesparques.cl/pt/events/parque-nacional-patagonia-sector-jeinimeni";

const config = {
  reactStrictMode: true,
  transpilePackages: ["verbum"],
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: i18nConfig.i18n,
  async redirects() {
    return [
      {
        source: "/entradas-parque",
        destination: PARK_TICKETS_URL,
        permanent: false,
      },
    ];
  },
};

export default config;
