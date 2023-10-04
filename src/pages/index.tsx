import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RootLayout from "~/pages/RootLayout";
import nextI18nConfig from "../../next-i18next.config.mjs";

import LandingNavbar from "~/components/LandingNavbar";
import Hero from "~/pages/Hero";
import MapSection from "~/pages/Map";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["landing", "common"],
      nextI18nConfig,
      ["es", "en"],
    )),
  },
});

export default function Home() {
  return (
    <>
      <RootLayout>
        <LandingNavbar />
        <Hero />
        <MapSection />
        <div className="flex h-screen flex-col bg-gradient-to-b from-pink-200 to-blue-500">
          <h2 className="my-10 px-5 text-xl">Últimos artículos</h2>
        </div>
      </RootLayout>
    </>
  );
}
