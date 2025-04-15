"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [youtubeAccessToken, setYoutubeAccessToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyToken = urlParams.get("access_token");
    const ytToken = urlParams.get("yt_access_token");

    if (spotifyToken) {
      setSpotifyAccessToken(spotifyToken);
      localStorage.setItem("spotify_access_token", spotifyToken);
    } else {
      const savedSpotifyToken = localStorage.getItem("spotify_access_token");
      if (savedSpotifyToken) {
        setSpotifyAccessToken(savedSpotifyToken);
      }
    }

    if (ytToken) {
      setYoutubeAccessToken(ytToken);
      localStorage.setItem("yt_access_token", ytToken);
    } else {
      const savedYTToken = localStorage.getItem("yt_access_token");
      if (savedYTToken) {
        setYoutubeAccessToken(savedYTToken);
      }
    }
  }, []);

  const handleFetchPlaylists = async () => {
    if (!spotifyAccessToken) {
      alert("Necesitas autenticarte con Spotify primero.");
      return;
    }

    try {
      const res = await fetch("/api/spotify/playlists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      });

      const data = await res.json();
      setPlaylists(data.items || []);
    } catch (error) {
      console.error("Error obteniendo playlists:", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Migrar de Spotify a YouTube Music</h1>
          <p className="mb-6">Conecta tus cuentas para comenzar la migración.</p>

          <a href="/api/auth/spotify/login">
            <Button className="bg-green-500 hover:bg-green-600 w-full mb-4">
              Conectar con Spotify
            </Button>
          </a>

          <a href="/api/auth/youtube/login">
            <Button className="bg-red-500 hover:bg-red-600 w-full mb-4">
              Conectar con YouTube
            </Button>
          </a>

          <Button onClick={handleFetchPlaylists} className="bg-blue-500 hover:bg-blue-600 w-full">
            Obtener playlists
          </Button>

          {playlists.length > 0 && (
            <div className="mt-4 text-left">
              <h2 className="text-lg font-semibold mb-2">Tus Playlists de Spotify:</h2>
              <ul className="list-disc ml-5">
                {playlists.map((playlist: any) => (
                  <li key={playlist.id}>{playlist.name}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
