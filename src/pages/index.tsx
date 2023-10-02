import Head from "next/head";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RootLayout from "~/pages/RootLayout";
import nextI18nConfig from "../../next-i18next.config.mjs";

import Map from "~/components/Map";
import Hero from "~/pages/Hero";
import Navbar from "~/components/Navbar";
import { useTranslation } from "next-i18next";
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
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>AG Chile Chico</title>
        <meta
          name="description"
          content="Descubre todo lo que necesitas para recorrer Chile Chico"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RootLayout>
        <Navbar title={t("navbar-title")} inLanding />
        <Hero />
        <MapSection />
        <div className="flex h-screen flex-col bg-gradient-to-b from-pink-200 to-blue-500">
          <h2 className="my-10 px-5 text-xl">Últimos artículos</h2>
        </div>
      </RootLayout>
    </>
  );
}
