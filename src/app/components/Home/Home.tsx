"use client";

import { useState } from "react";

export default function Home() {
  const [accessToken, setAccessToken] = useState("");
  const [playlists, setPlaylists] = useState<any[]>([]);

  const handleFetchPlaylists = async () => {
    if (!accessToken) {
      alert("Primero conecta tu cuenta de Spotify y pega el token.");
      return;
    }

    const res = await fetch("/api/spotify/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (data.items) {
      setPlaylists(data.items);
    } else {
      console.error(data);
      alert("No se pudieron obtener las playlists.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Migrar de Spotify a YouTube Music</h1>

      <a href="/api/auth/spotify/login">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Conectar con Spotify
        </button>
      </a>

      <input
        className="border p-2 rounded w-full max-w-md"
        type="text"
        placeholder="Pega aquí el access token"
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
      />

      <button
        onClick={handleFetchPlaylists}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Obtener playlists
      </button>

      <ul className="mt-4">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="mb-2">
            🎵 {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
