// src/app/api/spotify/playlists/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse("No se proporcionó un token de acceso válido.", {
      status: 401,
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return new NextResponse(
        `Error al obtener playlists: ${JSON.stringify(data)}`,
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(`Error de servidor: ${error.message}`, {
      status: 500,
    });
  }
}
