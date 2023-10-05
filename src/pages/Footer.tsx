import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function Footer() {
  const { data: sessionData } = useSession();
  const { t } = useTranslation("common");
  const setCookie = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;
  };
  const router = useRouter();
  return (
    <footer className="flex min-h-[100px] flex-col items-start gap-5 bg-zinc-800 p-5 md:flex-row md:justify-evenly md:py-10">
      <div className="flex flex-col">
        <div className="flex items-center justify-start gap-2 font-extrabold text-white">
          <Image src="/sun-icon.png" alt="sun-icon" width={40} height={40} />
          <Link href="/">{t("navbar-title")}</Link>
        </div>
        <div className="flex justify-evenly pt-2 text-lg text-white">
          <button
            onClick={() => {
              setCookie("es");
              void router.push(router.asPath, undefined, {
                locale: "es",
              });
            }}
          >
            🇪🇸 {t("spanish")}
          </button>
          <button
            onClick={() => {
              setCookie("en");
              void router.push(router.asPath, undefined, {
                locale: "en",
              });
            }}
          >
            🇬🇧 {t("english")}
          </button>
        </div>
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
        onClick={
          sessionData
            ? () => void signOut()
            : () => void signIn(undefined, { callbackUrl: "/admin" })
        }
      >
        {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
    </footer>
  );
}
