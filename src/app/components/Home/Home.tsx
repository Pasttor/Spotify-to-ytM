"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

export default function Home() {
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [ytmConnected, setYtmConnected] = useState(false);
  const [transferStarted, setTransferStarted] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);

  useEffect(() => {
    if (transferStarted) {
      const timer = setTimeout(() => {
        setTransferComplete(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [transferStarted]);

  const handleConnectSpotify = () => setSpotifyConnected(true);
  const handleConnectYTM = () => setYtmConnected(true);
  const handleStartTransfer = () => setTransferStarted(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md shadow-xl p-6">
        <CardContent>
          {!spotifyConnected || !ytmConnected ? (
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-bold">Conecta tus cuentas</h1>
              <Button onClick={handleConnectSpotify} disabled={spotifyConnected}>
                {spotifyConnected ? "Spotify conectado" : "Conectar Spotify"}
              </Button>
              <Button onClick={handleConnectYTM} disabled={ytmConnected}>
                {ytmConnected ? "YouTube Music conectado" : "Conectar YouTube Music"}
              </Button>
            </div>
          ) : !transferComplete ? (
            <div className="flex flex-col gap-4 items-center">
              <h2 className="text-lg font-medium">Todo listo para transferir</h2>
              {!transferStarted ? (
                <Button onClick={handleStartTransfer}>Iniciar transferencia</Button>
              ) : (
                <p className="text-gray-500">Transfiriendo música...</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-lg font-bold text-green-600">¡Transferencia completa!</h2>
              <p>123 canciones, 10 playlists, 4 álbumes migrados con éxito.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
