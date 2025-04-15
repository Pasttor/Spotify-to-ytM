// src/app/api/auth/youtube/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID!;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI!;

// Scopes que le pides al usuario
const SCOPES = [
  "https://www.googleapis.com/auth/youtube", // acceso total a la cuenta de YouTube
].join(" ");

export async function GET(req: NextRequest) {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(authUrl.toString());
}
