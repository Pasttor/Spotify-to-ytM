// src/app/api/auth/youtube/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID!;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return new NextResponse("No code provided", { status: 400 });
  }

  const params = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    return new NextResponse(`Error getting token: ${JSON.stringify(data)}`, {
      status: 500,
    });
  }

  // Redirigir al home con access_token
  const redirectUrl = new URL("/", req.url);
  redirectUrl.searchParams.set("yt_access_token", data.access_token);
  return NextResponse.redirect(redirectUrl.toString());
}
