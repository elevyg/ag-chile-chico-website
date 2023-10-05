import { useTranslation } from "next-i18next";
import Navbar from "~/components/Navbar";
import RootLayout from "~/pages/RootLayout";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale, ["unete"])),
  },
});

const Unete = () => {
  const { t } = useTranslation("unete");
  return (
    <RootLayout>
      <Navbar />
      <div className="flex flex-col items-center p-5 py-20">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="w-full rounded-lg bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 p-5 text-white shadow-md">
            <h2 className="pb-2 text-xl font-bold">
              ¿Quieres unirte a nuestra Asociación Gremial?
            </h2>
            <p>
              Escríbenos a nuestro correo electrónico{" "}
              <a
                href="mailto:agturismo@gmail.com"
                className="text-sky-400 underline"
              >
                agturismo@gmail.com
              </a>
              para conocer los requisitos y beneficios.
            </p>
          </div>
          <h1 className="text-3xl font-bold">{t("AssociationName")}</h1>
          <p>{t("Description")}</p>
          <p>{t("Description-1")}</p>
          <p>{t("Description-2")}</p>
          <p>{t("Description-3")}</p>
          <p>{t("PresidentInfo.RoleDescription")}</p>
          <p>{t("Challenges.AssociationChallenges")}</p>
          <p>{t("Challenges.MotivationToLead")}</p>
        </div>
      </div>
    </RootLayout>
  );
};

export default Unete;
