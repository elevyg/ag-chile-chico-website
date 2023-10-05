import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { data: sessionData } = useSession();
  const { t } = useTranslation("common");
  return (
    <footer className="flex min-h-[100px] flex-col items-start gap-5 bg-zinc-800 p-5 md:flex-row md:justify-evenly md:py-10">
      <div className="flex items-center justify-start gap-2 font-extrabold text-white">
        <Image src="/sun-icon.png" alt="sun-icon" width={40} height={40} />
        <Link href="/">{t("navbar-title")}</Link>
      </div>
      <div className="text-white">
        <p>Bernardo Ohiggins, #333 Chile Chico, Chile</p>
        <p>
          Fono:{" "}
          <a href="tel:+56227318336" className="text-sky-400">
            +56 2 2731 8336
          </a>
        </p>
      </div>
      <button
        className="rounded-md bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
    </footer>
  );
}
