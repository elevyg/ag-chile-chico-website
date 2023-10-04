/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { useEffect } from "react";
import AdminLayout from "~/pages/AdminLayout";
import ArticleEditor from "~/pages/admin/components/ArticleEditor";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});
const Editar = () => {
  const router = useRouter();

  const articleSlug = router.query.articleSlug;

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof articleSlug !== "string") {
      void router.push({
        pathname: "/",
        query: { returnUrl: router.asPath },
      });
    }
  }, [articleSlug, router]);

  if (typeof articleSlug !== "string") return null;
  return (
    <AdminLayout>
      <ArticleEditor articleSlug={articleSlug} />
    </AdminLayout>
  );
};

export default Editar;
