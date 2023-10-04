import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RootLayout from "~/pages/RootLayout";
import nextI18nConfig from "../../next-i18next.config.mjs";

import { useRouter } from "next/router";
import LandingNavbar from "~/components/LandingNavbar";
import Hero from "~/pages/Hero";
import MapSection from "~/pages/Map";
import { api } from "~/utils/api";
import { ssgApiHelper } from "~/utils/ssgApi";

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  const ssg = await ssgApiHelper();

  await ssg.article.getPreviews.prefetch({ locale });

  return {
    props: {
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

export default function Home() {
  const { locale } = useRouter();
  const articlesPrevies = api.article.getPreviews.useQuery({
    locale: locale ?? "es",
  });
  return (
    <>
      <RootLayout>
        <LandingNavbar />
        <Hero />
        <div className="h-[100vh]"></div>
        <MapSection />
      </RootLayout>
    </>
  );
}
