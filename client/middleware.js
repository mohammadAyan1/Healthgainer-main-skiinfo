import { NextResponse } from "next/server";

export function middleware(req) {
  

  const cookieHeader = req.headers.get("cookie");
  

  let token = null;
  let role = null;

  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );
    token = cookies.token;
    role = cookies.role;
  }

 
  let response = NextResponse.next();
  response.headers.set("X-Middleware-Check", "Middleware is Active ✅");

  const path = req.nextUrl.pathname;

  if (
    !token &&
    (path.startsWith("/admin") || path.startsWith("/user")) &&
    !path.startsWith("/auth")
  ) {
    
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (path.startsWith("/admin") && role?.toLowerCase() !== "admin") {
    
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
