"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [youtubeToken, setYoutubeToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);

  // Recuperar tokens desde la URL o localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spToken = urlParams.get("access_token");
    const ytToken = urlParams.get("yt_access_token");

    if (spToken) {
      setSpotifyToken(spToken);
      localStorage.setItem("spotify_access_token", spToken);
    } else {
      const savedSpotify = localStorage.getItem("spotify_access_token");
      if (savedSpotify) setSpotifyToken(savedSpotify);
    }

    if (ytToken) {
      setYoutubeToken(ytToken);
      localStorage.setItem("yt_access_token", ytToken);
    } else {
      const savedYT = localStorage.getItem("yt_access_token");
      if (savedYT) setYoutubeToken(savedYT);
    }
  }, []);

  // Obtener playlists de Spotify
  const handleFetchPlaylists = async () => {
    if (!spotifyToken) {
      alert("Necesitas autenticarte con Spotify primero.");
      return;
    }

    try {
      const res = await fetch("/api/spotify/playlists", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });
      const data = await res.json();
      setPlaylists(data.items || []);
    } catch (error) {
      console.error("Error obteniendo playlists:", error);
    }
  };

  // Migrar playlist a YouTube
  const handleMigratePlaylist = async (playlistId: string, title: string) => {
    if (!spotifyToken || !youtubeToken) {
      alert("Debes estar autenticado con ambas plataformas.");
      return;
    }

    try {
      // 1. Obtener canciones de la playlist de Spotify
      const resTracks = await fetch(`/api/spotify/playlist-tracks?playlistId=${playlistId}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });

      const { tracks } = await resTracks.json();

      // 2. Enviar al backend para crear playlist en YouTube y migrar canciones
      const resMigrate = await fetch("/api/youtube/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ytToken: youtubeToken,
          title,
          tracks,
        }),
      });

      const data = await resMigrate.json();
      if (data.success) {
        alert(`Playlist "${title}" migrada exitosamente a YouTube.`);
      } else {
        alert("Ocurrió un error durante la migración.");
      }
    } catch (error) {
      console.error("Error migrando playlist:", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Migrar de Spotify a YouTube Music</h1>
          <p className="mb-6">Conecta tus cuentas para comenzar la migración.</p>

          <div className="flex flex-col gap-3 mb-6">
            <a href="/api/auth/spotify/login">
              <Button className="bg-green-500 hover:bg-green-600 w-full">
                Conectar con Spotify
              </Button>
            </a>
            <a href="/api/auth/youtube/login">
              <Button className="bg-red-500 hover:bg-red-600 w-full">
                Conectar con YouTube
              </Button>
            </a>
          </div>

          <Button onClick={handleFetchPlaylists} className="bg-blue-500 hover:bg-blue-600 w-full mb-4">
            Obtener playlists de Spotify
          </Button>

          {playlists.length > 0 && (
            <div className="mt-4 text-left">
              <h2 className="text-lg font-semibold mb-2">Tus Playlists:</h2>
              <ul className="list-disc ml-5">
                {playlists.map((playlist: any) => (
                  <li key={playlist.id} className="mb-2">
                    {playlist.name}
                    <Button
                      onClick={() => handleMigratePlaylist(playlist.id, playlist.name)}
                      className="ml-2 bg-red-500 hover:bg-red-600"
                    >
                      Migrar a YouTube
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
