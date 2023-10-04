import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RootLayout from "~/pages/RootLayout";
import nextI18nConfig from "../../next-i18next.config.mjs";

import { CldImage } from "next-cloudinary";
import { useRouter } from "next/router";
import LandingNavbar from "~/components/LandingNavbar";
import Hero from "~/pages/Hero";
import MapSection from "~/pages/Map";
import { api } from "~/utils/api";
import { ssgApiHelper } from "~/utils/ssgApi";
import { motion } from "framer-motion";

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
        <div className="flex flex-col gap-2 p-5">
          {articlesPrevies.data?.map((article, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.5, duration: 0.5 }}
              key={article.id}
              className="flex items-start justify-start gap-2 overflow-hidden"
            >
              {article.coverPhotoPublicId && (
                <CldImage
                  src={article.coverPhotoPublicId}
                  alt={article.title ?? "Cover photo"}
                  width="400"
                  height="500"
                  crop="thumb"
                  className="h-full w-1/3 object-cover"
                />
              )}
              <div className="flex h-full flex-1 flex-col gap-3 p-3">
                <h3 className="text-2xl">{article.title}</h3>
                <p className="text-sm">{article.description}</p>
                <div>
                  <a href={`/articulos/${article.slug}`}>Ver más</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <MapSection />
      </RootLayout>
    </>
  );
}
