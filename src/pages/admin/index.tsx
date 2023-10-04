import Link from "next/link";
import { useRouter } from "next/router";
import AdminLayout from "~/pages/AdminLayout";
import { api } from "~/utils/api";
import { translationServerProps } from "~/utils/translationServerProps";
import {
  IoAddCircleSharp,
  IoArrowForwardCircleSharp,
  IoMenuOutline,
  IoPencilSharp,
} from "react-icons/io5";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});

const Admin = () => {
  const { locale } = useRouter();
  const allArticles = api.article.getAll.useQuery({ locale });
  return (
    <AdminLayout>
      <div className="">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl">Artículos</h1>
          <Link
            href="/admin/articulo-nuevo"
            className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-950"
          >
            <p>Artículo nuevo</p>
            <IoAddCircleSharp />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {allArticles.data?.map((article) => {
            return (
              <div
                key={article.id}
                className="flex items-center justify-between rounded-lg bg-slate-100 p-10 hover:bg-slate-200"
              >
                <h2 className="text-lg font-medium text-slate-800">
                  {article.title}
                </h2>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/${article.slug.toString()}/editar`}
                    className="flex items-center justify-center gap-2 hover:font-bold"
                  >
                    <p>Editar</p>
                    <IoPencilSharp />
                  </Link>
                  <Link
                    href={`articulos/${article.slug.toString()}`}
                    className="flex items-center justify-center gap-2 hover:font-bold"
                  >
                    <p>Ver</p>
                    <IoArrowForwardCircleSharp />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
