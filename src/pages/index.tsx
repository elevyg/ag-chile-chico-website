import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import nextI18nConfig from "../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "es",
      "en",
    ])),
  },
});

export default function Home() {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>Chile Chico Turismo</title>
        <meta
          name="description"
          content="Descubre todo lo que necesitas para recorrer Chile Chico"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>{t("main-title")}</h1>
      </main>
    </>
  );
}
