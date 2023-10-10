import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RootLayout from "~/pages/RootLayout";
import nextI18nConfig from "../../next-i18next.config.mjs";

import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getSelectorsByUserAgent } from "react-device-detect";
import LandingNavbar from "~/components/LandingNavbar";
import ArticlesPreview from "~/pages/ArticlesPreview";
import Hero from "~/pages/Hero";
import MapSection from "~/pages/Map";
import WhoAreWe from "~/pages/WhoAreWe";
import { ssgApiHelper } from "~/utils/ssgApi";

export const getServerSideProps = async ({
  locale = "es",
  req,
}: GetServerSidePropsContext) => {
  const ssg = await ssgApiHelper();
  const userAgent = req.headers["user-agent"];

  const { isMobile } = getSelectorsByUserAgent(userAgent ?? "") as {
    isMobile: boolean;
  };

  await ssg.article.getPreviews.prefetch({ locale });

  return {
    props: {
      isMobile,
      trpcState: ssg.dehydrate(),
      ...(await serverSideTranslations(
        locale,
        ["landing", "common"],
        nextI18nConfig,
        ["es", "en"],
      )),
    },
  };
};

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <>
      <RootLayout>
        <LandingNavbar />
        <Hero isMobile={props.isMobile} />
        <ArticlesPreview />
        <MapSection />
        <WhoAreWe isMobile={props.isMobile} />
      </RootLayout>
    </>
  );
}
