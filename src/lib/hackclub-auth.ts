import { cookies } from "next/headers";
import { SignJWT, createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const AUTH_BASE_URL = process.env.HACKCLUB_AUTH_BASE_URL ?? "https://auth.hackclub.com";
const SESSION_COOKIE_NAME = "hackwallet_session";
const OAUTH_STATE_COOKIE_NAME = "hackwallet_oauth_state";
const OIDC_SCOPES = ["openid", "profile", "name", "slack_id"];
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

const jwks = createRemoteJWKSet(new URL("https://auth.hackclub.com/oauth/discovery/keys"));

export type HackClubIdentity = {
  id: string;
  ysws_eligible?: boolean;
  verification_status?: string;
  first_name?: string;
  last_name?: string;
  primary_email?: string;
  slack_id?: string;
};

export type HackWalletUser = {
  id: string;
  displayName: string;
  email?: string;
  slackId?: string;
  verificationStatus?: string;
  yswsEligible?: boolean;
};

export type HackWalletSession = {
  user: HackWalletUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
};

type IdTokenClaims = JWTPayload & {
  name?: string;
  given_name?: string;
  family_name?: string;
  nickname?: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  slack_id?: string;
  verification_status?: string;
  ysws_eligible?: boolean;
};

type UserInfoResponse = {
  identity?: HackClubIdentity;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for Hack Club Auth`);
  }

  return value;
}

function getClientId() {
  return getRequiredEnv("HACKCLUB_CLIENT_ID");
}

function getClientSecret() {
  return getRequiredEnv("HACKCLUB_CLIENT_SECRET");
}

function getSessionSecret() {
  return getRequiredEnv("HACKWALLET_SESSION_SECRET");
}

function getAppUrl() {
  return process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getRedirectUri() {
  return new URL("/api/auth/callback", getAppUrl()).toString();
}

export function buildAuthorizeUrl(state: string) {
  const url = new URL("/oauth/authorize", AUTH_BASE_URL);

  url.searchParams.set("client_id", getClientId());
  url.searchParams.set("redirect_uri", getRedirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", OIDC_SCOPES.join(" "));
  url.searchParams.set("state", state);

  return url.toString();
}

export function createOAuthState() {
  return crypto.randomUUID();
}

export async function exchangeCodeForTokens(code: string) {
  const response = await fetch(`${AUTH_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      redirect_uri: getRedirectUri(),
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed with status ${response.status}`);
  }

  return (await response.json()) as TokenResponse;
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`${AUTH_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed with status ${response.status}`);
  }

  return (await response.json()) as TokenResponse;
}

export async function verifyIdToken(idToken: string) {
  const result = await jwtVerify<IdTokenClaims>(idToken, jwks, {
    issuer: "https://auth.hackclub.com",
    audience: getClientId(),
  });

  return result.payload;
}

export async function fetchCurrentIdentity(accessToken: string) {
  const response = await fetch(`${AUTH_BASE_URL}/api/v1/me`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Identity request failed with status ${response.status}`);
  }

  return (await response.json()) as UserInfoResponse;
}

function buildDisplayName(identity: HackClubIdentity | undefined, claims: IdTokenClaims) {
  if (typeof claims.nickname === "string" && claims.nickname.trim()) {
    return claims.nickname;
  }

  if (typeof claims.preferred_username === "string" && claims.preferred_username.trim()) {
    return claims.preferred_username;
  }

  if (identity?.slack_id && identity.slack_id.trim()) {
    return identity.slack_id;
  }

  if (typeof claims.slack_id === "string" && claims.slack_id.trim()) {
    return claims.slack_id;
  }

  if (typeof claims.given_name === "string" && claims.given_name.trim()) {
    return claims.given_name;
  }

  return "user";
}

export async function buildSessionFromTokens(tokens: TokenResponse) {
  if (!tokens.id_token) {
    throw new Error("Missing id_token from Hack Club Auth");
  }

  const claims = await verifyIdToken(tokens.id_token);
  const identityResponse = await fetchCurrentIdentity(tokens.access_token);
  const identity = identityResponse.identity;

  const session: HackWalletSession = {
    user: {
      id: String(identity?.id ?? claims.sub ?? ""),
      displayName: buildDisplayName(identity, claims),
      email: identity?.primary_email ?? claims.email,
      slackId: identity?.slack_id ?? claims.slack_id,
      verificationStatus: identity?.verification_status ?? claims.verification_status,
      yswsEligible: identity?.ysws_eligible ?? claims.ysws_eligible,
    },
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? "",
    expiresAt: Date.now() + (tokens.expires_in ?? 0) * 1000,
  };

  return session;
}

export async function signSessionCookie(session: HackWalletSession) {
  return await new SignJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(getSessionSecret()));
}

export async function readSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const result = await jwtVerify<HackWalletSession>(
      token,
      new TextEncoder().encode(getSessionSecret())
    );

    return result.payload;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getStateCookieName() {
  return OAUTH_STATE_COOKIE_NAME;
}

export function getCookieOptions(maxAgeSeconds?: number) {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
