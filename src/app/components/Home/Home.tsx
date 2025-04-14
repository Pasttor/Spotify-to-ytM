"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";



export default function Home() {
  const [status, setStatus] = useState("Esperando conexión...");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Migrar de Spotify a YouTube Music</h1>
          <p className="mb-6">Conecta tu cuenta de Spotify para comenzar la migración.</p>

          <a href="/api/auth/spotify/login">
            <button className="bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded text-lg">
              Conectar con Spotify
            </button>
          </a>

          <p className="text-sm text-gray-500 mt-6">{status}</p>
        </CardContent>
      </Card>
    </main>
  );
}
