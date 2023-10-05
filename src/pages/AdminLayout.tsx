import { Raleway } from "next/font/google";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { ProtectedAdminLayout } from "~/components/ProtectedAdminLayout";
import Footer from "~/pages/Footer";

const raleway = Raleway({
  variable: "--raleway-font",
  subsets: ["latin"],
  display: "swap",
});

export default function AdminLayout({
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
      <ProtectedAdminLayout>
        <>
          <Navbar />
          <main className="relative min-h-[calc(100vh_-_160px)] p-5">
            <div className={raleway.className}>{children}</div>
          </main>
          <Footer />
        </>
      </ProtectedAdminLayout>
    </>
  );
}
