import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Arabic is the default locale and lives at the root (no prefix).
// English lives under /en. Internally Arabic is served from /ar.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return;

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ar/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ar${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next|api|opengraph-image|icon|.*\\..*).*)",
  ],
};
