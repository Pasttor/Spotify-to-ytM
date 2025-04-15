"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";

export default function Home() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [ytToken, setYtToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const spotify = urlParams.get("access_token");
    const youtube = urlParams.get("yt_access_token");

    if (spotify) {
      localStorage.setItem("spotify_access_token", spotify);
      setSpotifyToken(spotify);
    } else {
      const saved = localStorage.getItem("spotify_access_token");
      if (saved) setSpotifyToken(saved);
    }

    if (youtube) {
      localStorage.setItem("yt_access_token", youtube);
      setYtToken(youtube);
    } else {
      const saved = localStorage.getItem("yt_access_token");
      if (saved) setYtToken(saved);
    }
  }, []);

  const handleFetchPlaylists = async () => {
    if (!spotifyToken) {
      alert("Necesitas autenticarte con Spotify primero.");
      return;
    }

    try {
      const res = await fetch("/api/spotify/playlists", {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      });

      const data = await res.json();
      setPlaylists(data.items || []);
    } catch (error) {
      console.error("Error obteniendo playlists:", error);
    }
  };

  const searchYouTube = async (query: string) => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=1&key=${process.env.NEXT_PUBLIC_YT_API_KEY}`
    );
    const data = await res.json();
    return data.items?.[0]?.id?.videoId;
  };

  const migrateToYouTube = async () => {
    if (!ytToken || !spotifyToken) {
      alert("Debes autenticarte con Spotify y YouTube primero.");
      return;
    }

    const total = playlists.length;
    let current = 0;
    const finalResults: string[] = [];

    for (const playlist of playlists) {
      try {
        // 1. Obtener canciones de la playlist
        const tracksRes = await fetch(
          `/api/spotify/playlist/${playlist.id}/tracks`,
          {
            headers: { Authorization: `Bearer ${spotifyToken}` },
          }
        );
        const trackData = await tracksRes.json();
        const tracks = trackData.items || [];

        // 2. Crear playlist en YouTube
        const createRes = await fetch("/api/youtube/create-playlist", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ytToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: playlist.name }),
        });

        const { id: ytPlaylistId } = await createRes.json();

        // 3. Buscar y agregar cada canción
        for (const item of tracks) {
          const track = item.track;
          const query = `${track.name} ${track.artists[0].name}`;
          const videoId = await searchYouTube(query);

          if (videoId) {
            await fetch("/api/youtube/add-to-playlist", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ytToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                playlistId: ytPlaylistId,
                videoId,
              }),
            });
          }
        }

        finalResults.push(`✅ Migrado: ${playlist.name}`);
      } catch (err: any) {
        finalResults.push(`❌ Error en "${playlist.name}": ${err.message}`);
      }

      current++;
      setProgress(Math.round((current / total) * 100));
    }

    setResults(finalResults);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Migrar de Spotify a YouTube Music</h1>
          <a href="/api/auth/spotify/login">
            <Button className="w-full mb-2 bg-green-600 hover:bg-green-700">
              Conectar con Spotify
            </Button>
          </a>

          <a href="/api/auth/youtube/login">
            <Button className="w-full mb-4 bg-red-500 hover:bg-red-600">
              Conectar con YouTube
            </Button>
          </a>

          <Button onClick={handleFetchPlaylists} className="w-full mb-2 bg-blue-500">
            Obtener playlists
          </Button>

          {playlists.length > 0 && ytToken && (
            <Button
              onClick={migrateToYouTube}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Migrar a YouTube
            </Button>
          )}

          {progress > 0 && (
            <div className="mt-6">
              <Progress value={progress} />
              <p className="mt-2 text-sm">Progreso: {progress}%</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-4 text-left">
              <h2 className="text-lg font-semibold mb-2">Resultado de la migración:</h2>
              <ul className="list-disc ml-5 text-sm">
                {results.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
