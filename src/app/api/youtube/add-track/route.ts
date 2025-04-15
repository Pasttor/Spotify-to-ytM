// /api/youtube/add-track/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { playlistId, videoId } = await req.json();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Token de autorización faltante." }, { status: 401 });
    }

    const res = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
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
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Error agregando canción", details: error.message }, { status: 500 });
  }
}
