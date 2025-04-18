// src/app/api/spotify/playlists/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("authorization")?.split("Bearer ")[1];

  if (!accessToken) {
    return NextResponse.json({ error: "Token de acceso no proporcionado" }, { status: 401 });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error obteniendo playlists de Spotify" }, { status: 500 });
  }
}
