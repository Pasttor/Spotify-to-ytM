import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { playlistId: string } }) {
  const playlistId = params.playlistId;
  const accessToken = req.headers.get("authorization")?.split("Bearer ")[1];

  if (!accessToken) {
    return NextResponse.json({ error: "Falta token de acceso" }, { status: 401 });
  }

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Error al obtener tracks de Spotify" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
