import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken, query } = await req.json();

  if (!accessToken || !query) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: "1",
  });

  const youtubeRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await youtubeRes.json();

  if (data?.items?.length > 0) {
    const videoId = data.items[0].id.videoId;
    return NextResponse.json({ videoId });
  } else {
    return NextResponse.json({ error: "No se encontró el video" }, { status: 404 });
  }
}
