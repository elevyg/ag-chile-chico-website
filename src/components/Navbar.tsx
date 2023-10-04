import { useTranslation } from "next-i18next";
import Link from "next/link";
import { IoMenuOutline } from "react-icons/io5";

const Navbar = () => {
  const { t } = useTranslation("common");

  return (
    <nav className="z-50 flex h-[80px] items-center justify-between  bg-slate-500 p-5 text-white">
      <div className="font-extrabold">
        <Link href="/">{t("navbar-title")}</Link>
      </div>
      <div className="mx-5 flex items-center justify-center gap-2 rounded-md  border-[1px] border-white p-2 md:hidden">
        <IoMenuOutline size="1.5em" />
      </div>
    </nav>
  );
};

export default Navbar;
