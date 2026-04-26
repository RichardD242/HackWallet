import { NextRequest, NextResponse } from "next/server";
import { getCookieOptions, getSessionCookieName } from "../../../../lib/hackclub-auth";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.set(getSessionCookieName(), "", { ...getCookieOptions(), maxAge: 0 });

  return response;
}
