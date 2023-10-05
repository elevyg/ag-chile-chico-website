import Link from "next/link";
import React from "react";
import Navbar from "~/components/Navbar";
import RootLayout from "~/pages/RootLayout";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});

const index = () => {
  return (
    <RootLayout>
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-5xl">No tienes acceso a esta página</h1>
        <Link href="/" className="text-sky-400 underline">
          Volver al inicio
        </Link>
      </div>
    </RootLayout>
  );
};

export default index;
