import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No Authorization header" }, { status: 401 });
    }

    const res = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet,status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        snippet: {
          title: name,
          description: description || "Migrada desde Spotify",
        },
        status: {
          privacyStatus: "private",
        },
      }),
    });

    const text = await res.text(); // para capturar texto crudo incluso si no es JSON

    if (!res.ok) {
      return NextResponse.json({
        error: `YouTube API error: ${res.status}`,
        details: text,
      }, { status: res.status });
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({
        error: "No se pudo parsear la respuesta de YouTube.",
        raw: text,
      }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json({ error: "Error interno", details: error.message }, { status: 500 });
  }
}
