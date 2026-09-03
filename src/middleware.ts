import { type NextRequest, NextResponse } from "next/server";

const SHORT_LINKS: Record<string, string> = {
  "/entradas-parque":
    "https://www.pasesparques.tur.com/es/cochrane-295/parque-nacional-patagonia-sector-jeinimeni-3416",
};

const LOCALES = new Set(["en", "es"]);

function pathnameWithoutLocale(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (maybeLocale && LOCALES.has(maybeLocale)) {
    return `/${segments.slice(2).join("/")}`;
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const path = pathnameWithoutLocale(request.nextUrl.pathname);
  const destination = SHORT_LINKS[path];
  if (destination) {
    return NextResponse.redirect(destination, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/entradas-parque", "/:locale(en|es)/entradas-parque"],
};
