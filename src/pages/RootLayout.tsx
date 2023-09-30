import { useTranslation } from "next-i18next";
import { Raleway } from "next/font/google";
import Navbar from "~/components/Navbar";

const raleway = Raleway({
  variable: "--raleway-font",
  subsets: ["latin"],
  display: "swap",
});

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
