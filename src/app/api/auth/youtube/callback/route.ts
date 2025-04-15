// src/app/api/auth/youtube/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID!;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return new NextResponse("No se recibió el código de autorización", { status: 400 });
  }

  const params = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return new NextResponse(`Error al obtener el token: ${JSON.stringify(data)}`, {
        status: 500,
      });
    }

    // Redirige al frontend con el access_token como query param (o guarda en localStorage del frontend)
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("yt_access_token", data.access_token);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    return new NextResponse(`Error en la solicitud: ${error}`, { status: 500 });
  }
}
