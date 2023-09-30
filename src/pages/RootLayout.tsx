import { Raleway } from "next/font/google";
import Navbar from "~/components/Navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../next-i18next.config.mjs";
import { useTranslation } from "next-i18next";

// If loading a variable font, you don't need to specify the font weight
const raleway = Raleway({
  variable: "--raleway-font",
  subsets: ["latin"],
  display: "swap",
});

// export const getStaticProps = async ({ locale }: { locale: string }) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
//       "es",
//       "en",
//     ])),
//   },
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation(["common"]);
  console.log(t("navbar-title"));
  return (
    <main className="relative">
      <Navbar title={t("navbar-title")} />
      <div className={raleway.className}>{children}</div>
    </main>
  );
}
