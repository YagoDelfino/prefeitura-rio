import { NextRequest, NextResponse } from "next/server";

import { AUTH_TOKEN_COOKIE_NAME, verifyAuthToken } from "./src/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const loginUrl = new URL("/", request.url);
  const dashboardUrl = new URL("/dashboard", request.url);

  const redirectToLogin = () => NextResponse.redirect(loginUrl);

  if (!token) {
    if (pathname === "/") {
      return NextResponse.next();
    }

    return redirectToLogin();
  }

  if (pathname === "/") {
    if (await verifyAuthToken(token)) {
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  if (!(await verifyAuthToken(token))) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api).*)"],
};
