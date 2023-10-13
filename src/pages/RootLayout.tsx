import { CldOgImage } from "next-cloudinary";
import { Raleway } from "next/font/google";
import Head from "next/head";
import Footer from "~/pages/Footer";

const raleway = Raleway({
  variable: "--raleway-font",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CldOgImage
        src="ag-chile-chico-website/foto_islas_vhlcy2"
        title="Chile Chico Turismo"
        alt="Islas de Chile Chico"
      />
      <Head>
        <title>AG Chile Chico</title>
        <meta
          name="description"
          content="Descubre todo lo que necesitas para recorrer Chile Chico, somos la asociación gremial de turismo y cultura de Chile Chico."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative">
        <div className={raleway.className}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
