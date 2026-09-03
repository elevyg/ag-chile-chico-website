import Image from "next/image";
import { useTranslation } from "next-i18next";

type Props = {
  title: string;
  pngSrc: string;
  svgSrc: string;
  pngFilename: string;
  svgFilename: string;
};

const QrDownload = ({
  title,
  pngSrc,
  svgSrc,
  pngFilename,
  svgFilename,
}: Props) => {
  const { t } = useTranslation("common");

  return (
    <section className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-slate-100 px-5 py-16">
      <h1 className="text-center text-2xl font-bold text-slate-800 md:text-3xl">
        {title}
      </h1>
      <div className="mt-8 rounded-lg bg-white p-4 shadow-lg">
        <Image
          src={pngSrc}
          alt={title}
          width={360}
          height={360}
          priority
          className="h-auto w-[280px] md:w-[360px]"
        />
      </div>
      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <a
          href={pngSrc}
          download={pngFilename}
          className="flex-1 rounded-md bg-gradient-to-l from-lightYellow to-darkYellow p-4 text-center text-lg font-bold text-white hover:from-darkYellow hover:to-darkYellow"
        >
          {t("qr-download-png")}
        </a>
        <a
          href={svgSrc}
          download={svgFilename}
          className="flex-1 rounded-md border-2 border-darkYellow p-4 text-center text-lg font-bold text-darkYellow hover:bg-gradient-to-l hover:from-lightYellow hover:to-darkYellow hover:text-white"
        >
          {t("qr-download-svg")}
        </a>
      </div>
    </section>
  );
};

export default QrDownload;
