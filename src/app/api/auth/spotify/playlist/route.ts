// src/app/api/spotify/playlists/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json({ error: "Access token missing" }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: "Failed to fetch playlists", details: errorData }, { status: res.status });
    }

    const playlists = await res.json();
    return NextResponse.json(playlists);
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error", details: error }, { status: 500 });
  }
}
