import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { href: "/admin", label: "Artículos" },
  { href: "/admin/miembros", label: "Miembros" },
  { href: "/admin/qr", label: "QR y entradas" },
];

const AdminNav = () => {
  const { pathname } = useRouter();

  return (
    <nav className="mb-8 flex gap-2">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-4 py-2 ${
              active
                ? "bg-darkYellow text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNav;
