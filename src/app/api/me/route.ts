import { NextResponse } from "next/server";
import { readSessionCookie } from "../../../lib/hackclub-auth";

export async function GET() {
  const session = await readSessionCookie();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
