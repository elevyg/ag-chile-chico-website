import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { t } = useTranslation("common");

  return (
    <nav className="z-50 flex h-[80px] items-center justify-between bg-gradient-to-l  from-lightYellow  to-darkYellow p-5 text-white">
      <div className="flex items-center gap-2 font-extrabold">
        <Image src="/sun-icon.png" alt="sun-icon" width={40} height={40} />
        <Link href="/">{t("navbar-title")}</Link>
      </div>
    </nav>
  );
};

export default Navbar;
