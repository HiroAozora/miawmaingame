"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { playerName, setPlayerName } = useGameStore();

  useEffect(() => {
    setIsClient(true);
    // If player already has a name, redirect to game hub
    if (playerName) {
      router.push("/game");
    }
  }, [playerName, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setPlayerName(name.trim());
    router.push("/game");
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-yellow-50 text-center overflow-y-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-md bg-white border-4 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">
          Miaw Main Game
        </h1>
        <p className="text-lg mb-8 font-medium">Selamat datang!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="name" className="block font-bold mb-2">
              Nama Kamu
            </label>
            <Input
              id="name"
              placeholder="Masukkan nama kamuu..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-xl py-6"
            disabled={!name.trim()}
          >
            Gas mulai!
          </Button>
        </form>
      </motion.div>

      <div className="absolute bottom-4 text-xs font-bold text-gray-400">
        v1.0.0 • buat samwantukod
      </div>
    </main>
  );
}
