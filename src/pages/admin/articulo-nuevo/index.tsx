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
      <div className="flex flex-1 flex-col">
        <h1 className="text-2xl">Crea un artículo nuevo</h1>
        <ArticleEditor />
      </div>
    </AdminLayout>
  );
};

export default NewArticle;
