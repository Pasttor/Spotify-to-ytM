// src/app/api/youtube/add-to-playlist/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken, playlistId, videoId } = await req.json();

  try {
    const res = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new NextResponse(JSON.stringify({ error: data }), { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Error al añadir a la playlist" }), { status: 500 });
  }
}
