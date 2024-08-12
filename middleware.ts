import {type NextRequest, NextResponse} from "next/server";
import {
  LOGIN_ROUTE,
  ROOT_ROUTE,
  SESSION_COOKIE_NAME,
  SIGN_UP_ROUTE,
  CHAT_ROUTE,
  PROFILE_ROUTE,
} from "./constants";

const protectedRoutes = [ROOT_ROUTE, CHAT_ROUTE, PROFILE_ROUTE];
const unprotectedRoutes = [LOGIN_ROUTE, SIGN_UP_ROUTE];

export default function middleware(request: NextRequest) {
  const session =
    request.cookies.get(SESSION_COOKIE_NAME)?.value ||
    request.headers.get(SESSION_COOKIE_NAME) ||
    "";

  // Redirect to login if session is not set
  if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(LOGIN_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // Redirect to root if session is set and user tries to access unprotected routes
  if (session && unprotectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
