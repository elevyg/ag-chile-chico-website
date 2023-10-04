import ArticleEditor from "~/pages/admin/components/ArticleEditor";
import AdminLayout from "~/pages/AdminLayout";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});

const NewArticle = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen">
        <div className="flex min-h-screen flex-1 flex-col p-10">
          <h1>Crea un artículo nuevo</h1>
          <ArticleEditor />
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewArticle;
