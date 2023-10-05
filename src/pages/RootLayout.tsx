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
      <Head>
        <title>AG Chile Chico</title>
        <meta
          name="description"
          content="Descubre todo lo que necesitas para recorrer Chile Chico"
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
