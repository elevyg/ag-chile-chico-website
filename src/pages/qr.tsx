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

const SiteQrPage = () => {
  const { t } = useTranslation("common");

  return (
    <RootLayout>
      <Navbar />
      <QrDownload
        title={t("qr-site-title")}
        pngSrc="/qr-chilechicoturismo.png"
        svgSrc="/qr-chilechicoturismo.svg"
        pngFilename="chilechicoturismo-qr.png"
        svgFilename="chilechicoturismo-qr.svg"
      />
    </RootLayout>
  );
};

export default SiteQrPage;
