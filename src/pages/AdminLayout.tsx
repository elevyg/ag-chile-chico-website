import { signIn, signOut, useSession } from "next-auth/react";
import { Raleway } from "next/font/google";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { ProtectedAdminLayout } from "~/components/ProtectedAdminLayout";

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
  const { data: sessionData } = useSession();

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
          <footer className="min-h-[100px] bg-black">
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
            </button>
          </footer>
        </>
      </ProtectedAdminLayout>
    </>
  );
}
