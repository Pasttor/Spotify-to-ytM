// src/app/api/youtube/migrate/route.ts
import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ytToken, title, tracks } = body;

  // 1. Crear playlist en YouTube
  const createPlaylistRes = await fetch(`${YOUTUBE_API}/playlists?part=snippet,status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ytToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: { title },
      status: { privacyStatus: "private" },
    }),
  });

  const playlistData = await createPlaylistRes.json();
  const playlistId = playlistData.id;

  // 2. Buscar y agregar canciones
  for (const track of tracks) {
    const query = encodeURIComponent(`${track.name} ${track.artist}`);
    const searchRes = await fetch(`${YOUTUBE_API}/search?part=snippet&q=${query}&type=video&maxResults=1`, {
      headers: { Authorization: `Bearer ${ytToken}` },
    });
    const searchData = await searchRes.json();
    const videoId = searchData.items?.[0]?.id?.videoId;

    if (videoId) {
      await fetch(`${YOUTUBE_API}/playlistItems?part=snippet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ytToken}`,
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
    }
  }

  return NextResponse.json({ success: true, playlistId });
}
