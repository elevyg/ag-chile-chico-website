import Head from "next/head";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

import { api } from "~/utils/api";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import nextI18nConfig from "../../next-i18next.config.mjs";
import RootLayout from "~/pages/RootLayout";

import Map from "~/components/Map";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["landing"], nextI18nConfig, [
      "es",
      "en",
    ])),
  },
});

export default function Home() {
  const { t } = useTranslation("landing");
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
        =
        <div className="relative flex h-screen flex-1 items-center justify-center">
          <h1 className="z-20 text-3xl font-bold text-white">
            {t("main-title")}
          </h1>
          <CldImage
            width="1000"
            height="600"
            src="ag-chile-chico-website/foto_islas_vhlcy2"
            sizes="100vw"
            alt="Description of my image"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <Map address="O'higgins 420 Chile Chico" />
        <div className="h-screen bg-gradient-to-b from-pink-200 to-blue-500"></div>
      </RootLayout>
    </>
  );
}
