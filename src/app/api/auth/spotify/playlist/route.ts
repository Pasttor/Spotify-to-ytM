// src/app/api/spotify/playlists/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "No Authorization header provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Spotify API request failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching playlists" }, { status: 500 });
  }
}
