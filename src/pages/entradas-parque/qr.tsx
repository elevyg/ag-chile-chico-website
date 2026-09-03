import { useTranslation } from "next-i18next";
import Navbar from "~/components/Navbar";
import QrDownload from "~/components/QrDownload";
import RootLayout from "~/pages/RootLayout";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});

const ParkTicketsQrPage = () => {
  const { t } = useTranslation("common");

  return (
    <RootLayout>
      <Navbar />
      <QrDownload
        title={t("qr-park-title")}
        pngSrc="/qr-entradas-parque.png"
        svgSrc="/qr-entradas-parque.svg"
        pngFilename="entradas-parque-qr.png"
        svgFilename="entradas-parque-qr.svg"
      />
    </RootLayout>
  );
};

export default ParkTicketsQrPage;
