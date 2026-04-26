import { NextRequest, NextResponse } from "next/server";
import {
  buildSessionFromTokens,
  exchangeCodeForTokens,
  getCookieOptions,
  getSessionCookieName,
  getStateCookieName,
  signSessionCookie,
} from "../../../../lib/hackclub-auth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const storedState = request.cookies.get(getStateCookieName())?.value;

  if (!code || !returnedState || !storedState || returnedState !== storedState) {
    return NextResponse.redirect(new URL("/?auth=error", request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const session = await buildSessionFromTokens(tokens);
    const sessionCookie = await signSessionCookie(session);
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set(getSessionCookieName(), sessionCookie, getCookieOptions(60 * 60 * 24 * 30));
    response.cookies.set(getStateCookieName(), "", { ...getCookieOptions(), maxAge: 0 });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/?auth=error", request.url));
  }
}
