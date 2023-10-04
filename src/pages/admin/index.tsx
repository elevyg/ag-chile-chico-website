import AdminLayout from "~/pages/AdminLayout";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});

const Admin = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen">
        <h1>Panel administrador</h1>
      </div>
    </AdminLayout>
  );
};

export default Admin;
