'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      localStorage.setItem("spotify_refresh_token", refreshToken || "");
      router.push("/"); // Redirigir al home
    }
  }, [router]);

  return (
    <div className="p-6 text-center">
      <p>Autenticando con Spotify...</p>
    </div>
  );
}
