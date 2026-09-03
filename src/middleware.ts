import { type NextRequest, NextResponse } from "next/server";

const PARK_TICKETS_URL =
  "https://tickets.pasesparques.cl/pt/events/parque-nacional-patagonia-sector-jeinimeni";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/^\/(en|es)(?=\/|$)/, "");
  if (pathname === "/entradas-parque") {
    return NextResponse.redirect(PARK_TICKETS_URL, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/entradas-parque",
    "/en/entradas-parque",
    "/es/entradas-parque",
  ],
};
