// src/app/api/spotify/playlist-tracks/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("authorization")?.split(" ")[1];
  const playlistId = req.nextUrl.searchParams.get("playlistId");

  if (!accessToken || !playlistId) {
    return NextResponse.json({ error: "Token o playlistId faltante" }, { status: 400 });
  }

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error }, { status: res.status });
  }

  // Devuelve una lista simple de canciones con título y artista
  const tracks = data.items.map((item: any) => {
    const track = item.track;
    return {
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
    };
  });

  return NextResponse.json({ tracks });
}
