import { NextResponse } from "next/server";
import {
  buildAuthorizeUrl,
  createOAuthState,
  getCookieOptions,
  getStateCookieName,
} from "../../../../lib/hackclub-auth";

export function GET() {
  const state = createOAuthState();
  const response = NextResponse.redirect(buildAuthorizeUrl(state));

  response.cookies.set(getStateCookieName(), state, getCookieOptions(10 * 60));

  return response;
}
