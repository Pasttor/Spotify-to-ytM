// src/app/api/auth/youtube/login/route.ts
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID!;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI!;
const SCOPE = [
  "https://www.googleapis.com/auth/youtube.readonly",
].join(" ");

export async function GET() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
