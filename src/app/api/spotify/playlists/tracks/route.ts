// src/app/api/spotify/tracks/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken, playlistId } = await req.json();

  if (!accessToken || !playlistId) {
    return NextResponse.json({ error: "Token o playlistId faltante" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error obteniendo tracks de Spotify" }, { status: 500 });
  }
}
