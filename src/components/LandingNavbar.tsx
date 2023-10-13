import { easeIn, motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRef } from "react";

const LandingNavbar = () => {
  const target = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["80px", "100vh"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["rgba(241 245 249,0)", "rgba(241 245 249,1)"],
    { ease: easeIn },
  );

  const color = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["rgba(255 255 255,1)", "rgba(39 39 42,1)"],
    { ease: easeIn },
  );

  const { t } = useTranslation("common");

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 flex h-[80px] items-center justify-between p-5  text-zinc-800"
      ref={target}
      style={{ backgroundColor: backgroundColor }}
    >
      <motion.div
        className="flex items-center gap-2 font-extrabold"
        style={{ color }}
      >
        <motion.svg
          version="1.1"
          width="40"
          height="40"
          x="0"
          y="0"
          viewBox="0 0 64 64"
        >
          <g>
            <motion.path
              style={{ fill: color }}
              d="M59.873 30.066a1.006 1.006 0 0 0-1.4-1.326c-2.4 1.451-4.3 1.905-5.643 1.345-1.012-.512-1.808-1.49-2.992-2.034 4.389-3.025 5.596-9.373 5.333-11.66a1.005 1.005 0 0 0-1.874-.449c-1.355 2.463-2.772 3.803-4.217 3.98-1.136.065-2.317-.378-3.611-.26 2.282-4.731.145-10.97-1.207-12.764a1.005 1.005 0 0 0-1.851.543c.053 2.804-.508 4.677-1.668 5.566-.95.623-2.19.837-3.253 1.581-.44-5.349-5.287-9.512-7.428-10.456a1.005 1.005 0 0 0-1.327 1.399c1.454 2.402 1.906 4.3 1.346 5.643-.513 1.015-1.491 1.806-2.034 2.996-2.988-4.372-9.402-5.625-11.66-5.337a1.005 1.005 0 0 0-.449 1.875c2.463 1.355 3.802 2.771 3.98 4.216.066 1.138-.378 2.316-.26 3.611-4.73-2.282-10.969-.144-12.764 1.208a1.006 1.006 0 0 0 .543 1.85c2.807-.069 4.677.51 5.566 1.668.623.95.836 2.19 1.581 3.253-5.349.44-9.512 5.288-10.456 7.428a1.005 1.005 0 0 0 1.398 1.327c2.402-1.453 4.3-1.907 5.644-1.346 1.012.512 1.808 1.49 2.992 2.034-4.389 3.025-5.596 9.375-5.333 11.66a1.005 1.005 0 0 0 1.874.45c1.355-2.464 2.772-3.803 4.217-3.98 1.133-.069 2.32.38 3.611.259-2.282 4.731-.144 10.971 1.207 12.764a1.006 1.006 0 0 0 1.851-.543c-.053-2.803.508-4.677 1.668-5.565.95-.623 2.19-.837 3.253-1.582.415 5.267 5.523 10.012 7.9 10.575a1.007 1.007 0 0 0 .855-1.517c-1.454-2.403-1.906-4.301-1.346-5.644.428-.909 1.045-1.286 1.648-2.314.464-1.36 1.004.376 1.713.819a14.332 14.332 0 0 0 10.333 3.836 1.005 1.005 0 0 0 .45-1.874c-2.464-1.355-3.803-2.772-3.98-4.217-.067-1.138.377-2.315.259-3.61 4.732 2.282 10.97.144 12.764-1.208a1.005 1.005 0 0 0-.543-1.851c-2.816.062-4.677-.508-5.565-1.668-.624-.95-.837-2.19-1.582-3.253 5.349-.44 9.512-5.287 10.457-7.428zm-12.39 5.524a1.007 1.007 0 0 0-.756 1.686 8.342 8.342 0 0 1 1.32 1.843 18.194 18.194 0 0 0 1.362 2.844 5.93 5.93 0 0 0 3.32 2.06 11.616 11.616 0 0 1-9.117-1.154 1.007 1.007 0 0 0-1.493 1.086c.574 1.87-.127 3.506-.02 5.376a5.919 5.919 0 0 0 1.857 3.457 11.53 11.53 0 0 1-7.28-5.49 1.008 1.008 0 0 0-1.88.129c-.47 1.919-1.867 2.954-2.72 4.634a5.96 5.96 0 0 0-.11 3.92 11.51 11.51 0 0 1-3.552-8.494 1.005 1.005 0 0 0-1-1.029c-.933.146-1.587 1.254-2.529 1.593a18.203 18.203 0 0 0-2.844 1.362 5.934 5.934 0 0 0-2.06 3.32 11.613 11.613 0 0 1 1.154-9.116 1.006 1.006 0 0 0-1.086-1.494 8.317 8.317 0 0 1-2.235.228 18.07 18.07 0 0 0-3.141-.248 5.919 5.919 0 0 0-3.457 1.857 11.53 11.53 0 0 1 5.49-7.28 1.008 1.008 0 0 0-.129-1.88c-1.92-.47-2.953-1.866-4.634-2.72a5.97 5.97 0 0 0-3.92-.11 11.51 11.51 0 0 1 8.494-3.551 1.034 1.034 0 0 0 .941-.591 1 1 0 0 0-.185-1.095 8.342 8.342 0 0 1-1.32-1.844 18.197 18.197 0 0 0-1.362-2.843 5.93 5.93 0 0 0-3.32-2.061 11.62 11.62 0 0 1 9.117 1.155 1.006 1.006 0 0 0 1.493-1.087 8.324 8.324 0 0 1-.228-2.234 18.118 18.118 0 0 0 .248-3.142 5.919 5.919 0 0 0-1.857-3.457 11.508 11.508 0 0 1 7.319 5.572 1 1 0 0 0 1.833-.175 9.167 9.167 0 0 1 .934-2.07 18.26 18.26 0 0 0 1.795-2.6 5.961 5.961 0 0 0 .11-3.92 11.51 11.51 0 0 1 3.55 8.494 1.006 1.006 0 0 0 1.687.757c1.335-1.428 3.12-1.65 4.687-2.683a5.934 5.934 0 0 0 2.06-3.32 11.613 11.613 0 0 1-1.154 9.117 1.006 1.006 0 0 0 1.086 1.494c1.872-.573 3.505.126 5.376.019a5.919 5.919 0 0 0 3.457-1.857 11.53 11.53 0 0 1-5.49 7.28 1.008 1.008 0 0 0 .129 1.88 8.982 8.982 0 0 1 2.035.926 18.258 18.258 0 0 0 2.599 1.795 5.976 5.976 0 0 0 3.92.11 11.508 11.508 0 0 1-8.494 3.55zm-28.689-3.586a13.206 13.206 0 0 0 26.412 0c-.723-17.514-25.686-17.519-26.412 0zm2 0a11.206 11.206 0 0 1 22.412 0c-.612 14.863-21.797 14.867-22.412 0zm20.166 0a1 1 0 1 1-2 0c-.328-9.213-13.595-9.209-13.92 0a1 1 0 0 1-2 0 8.96 8.96 0 0 1 17.92 0z"
            ></motion.path>
          </g>
        </motion.svg>
        <Link href="/">{t("navbar-title")}</Link>
      </motion.div>
    </motion.nav>
  );
};

export default LandingNavbar;
