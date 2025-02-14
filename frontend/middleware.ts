import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('refresh_token')?.value;

  const nonProtectedRoutes = ['/login', '/register'];
  const protectedRoutes = ['/'];

  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);
  // ✅ 1. If the user is authenticated and tries to access /login or /register, redirect to /
  if ((!token || token === "") && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ✅ 2. If the user is NOT authenticated and tries to access ANY other route, redirect to /login
  if ((token && token !== "") && nonProtectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
