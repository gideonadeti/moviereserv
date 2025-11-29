import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken");

  // If user has a refresh token and tries to access auth pages, redirect to dashboard
  if (
    refreshToken &&
    (pathname.startsWith("/auth/sign-in") ||
      pathname.startsWith("/auth/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/auth/sign-in", "/auth/sign-up"],
};
