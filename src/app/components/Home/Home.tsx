"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [ytAccessToken, setYtAccessToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [migrationMessages, setMigrationMessages] = useState<string[]>([]);

  // Obtener tokens desde URL o localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const spotifyToken = urlParams.get("access_token");
    const youtubeToken = urlParams.get("yt_access_token");

    if (spotifyToken) {
      setAccessToken(spotifyToken);
      localStorage.setItem("spotify_access_token", spotifyToken);
    } else {
      const savedToken = localStorage.getItem("spotify_access_token");
      if (savedToken) setAccessToken(savedToken);
    }

    if (youtubeToken) {
      setYtAccessToken(youtubeToken);
      localStorage.setItem("yt_access_token", youtubeToken);
    } else {
      const savedYtToken = localStorage.getItem("yt_access_token");
      if (savedYtToken) setYtAccessToken(savedYtToken);
    }
  }, []);

  const handleFetchPlaylists = async () => {
    if (!accessToken) {
      alert("Necesitas autenticarte con Spotify primero.");
      return;
    }

    try {
      const res = await fetch("/api/spotify/playlists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setPlaylists(data.items || []);
    } catch (error) {
      console.error("Error obteniendo playlists:", error);
    }
  };

  const handleMigration = async () => {
    if (!ytAccessToken || !playlists.length) return;

    setProgress(0);
    setMigrationMessages([]);

    for (let i = 0; i < playlists.length; i++) {
      const playlist = playlists[i];

      try {
        const res = await fetch("/api/youtube/create-playlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ytAccessToken}`,
          },
          body: JSON.stringify({
            name: playlist.name,
            description: playlist.description || "Migrada desde Spotify",
          }),
        });

        let result;
        try {
          result = await res.json();
        } catch {
          result = { error: "Respuesta vacía o inválida del servidor." };
        }
        

        if (res.ok) {
          setMigrationMessages(prev => [...prev, `✅ "${playlist.name}" migrada correctamente.`]);
        } else {
          setMigrationMessages(prev => [...prev, `❌ Error en "${playlist.name}": ${result.error}`]);
        }
      } catch (err) {
        setMigrationMessages(prev => [...prev, `❌ Error en "${playlist.name}": ${err}`]);
      }

      setProgress(Math.round(((i + 1) / playlists.length) * 100));
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Migrar de Spotify a YouTube Music</h1>
          <p className="mb-6">Conecta tus cuentas para comenzar la migración.</p>

          <a href="/api/auth/spotify/login">
            <Button className="bg-green-500 hover:bg-green-600 w-full mb-2">
              Conectar con Spotify
            </Button>
          </a>

          <a href="/api/auth/youtube/login">
            <Button className="bg-red-500 hover:bg-red-600 w-full mb-4">
              Conectar con YouTube
            </Button>
          </a>

          <Button
            onClick={handleFetchPlaylists}
            className="bg-blue-500 hover:bg-blue-600 w-full"
          >
            Obtener playlists
          </Button>

          {playlists.length > 0 && ytAccessToken && (
            <Button
              onClick={handleMigration}
              className="bg-yellow-500 hover:bg-yellow-600 w-full mt-4"
            >
              Migrar a YouTube
            </Button>
          )}

          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <Progress value={progress} />
              <p className="text-sm mt-2">Migrando... {progress}%</p>
            </div>
          )}

          {migrationMessages.length > 0 && (
            <div className="mt-6 text-left">
              <h2 className="text-md font-semibold mb-2">Resultado de la migración:</h2>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {migrationMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
