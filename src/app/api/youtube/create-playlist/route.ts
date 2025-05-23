// src/app/api/youtube/create-playlist/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken, title, description } = await req.json();

  try {
    const res = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: "private",
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new NextResponse(JSON.stringify({ error: data }), { status: res.status });
    }

    return NextResponse.json({ playlistId: data.id });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Error al crear la playlist" }), { status: 500 });
  }
}
