// src/app/api/spotify/profile/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("authorization")?.split("Bearer ")[1];

  if (!accessToken) {
    return NextResponse.json({ error: "Token de acceso no proporcionado" }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.spotify.com/v1/me", {
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
    return NextResponse.json({ error: "Error obteniendo perfil de Spotify" }, { status: 500 });
  }
}
