import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("✅ Middleware Running...");

  const cookieHeader = req.headers.get("cookie");
  console.log("Request Cookies:", cookieHeader);

  let token = null;
  let role = null;

  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );
    token = cookies.token;
    role = cookies.role;
  }

  console.log("Extracted Token:", token);
  console.log("Extracted Role:", role);
  console.log("Pathname:", req.nextUrl.pathname);

  let response = NextResponse.next();
  response.headers.set("X-Middleware-Check", "Middleware is Active ✅");

  const path = req.nextUrl.pathname;

  if (
    !token &&
    (path.startsWith("/admin") || path.startsWith("/user")) &&
    !path.startsWith("/auth")
  ) {
    console.log("🔄 Redirecting to /auth...");
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (path.startsWith("/admin") && role?.toLowerCase() !== "admin") {
    console.log("⛔ Redirecting to /unauthorized...");
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  console.log("✅ Allowing request to proceed...");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
