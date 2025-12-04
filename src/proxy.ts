import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken");

  // If user has a refresh token and tries to access auth pages, redirect to dashboard
  if (
    refreshToken &&
    (pathname.startsWith("/auth/sign-in") ||
      pathname.startsWith("/auth/sign-up") ||
      pathname.startsWith("/auth/forgot-password") ||
      pathname.startsWith("/auth/reset-password"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
  ],
};
