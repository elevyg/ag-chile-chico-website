import RootLayout from "~/pages/RootLayout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "~/../next-i18next.config.mjs";

import { ProtectedAdminLayout } from "~/components/ProtectedAdminLayout";
import ArticleEditor from "~/pages/admin/components/ArticleEditor";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "es",
      "en",
    ])),
  },
});

const NewArticle = () => {
  return (
    <ProtectedAdminLayout>
      <RootLayout>
        <div className="min-h-screen">
          <div className="flex min-h-screen flex-1 flex-col p-10">
            <h1>Crea un artículo nuevo</h1>
            <ArticleEditor />
          </div>
        </div>
      </RootLayout>
    </ProtectedAdminLayout>
  );
};

export default NewArticle;
